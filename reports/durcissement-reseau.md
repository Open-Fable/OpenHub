# Audit de durcissement réseau — OpenHub

**Date :** 2026-06-15
**Périmètre :** Proxy Express (`electron/proxy/`), isolation réseau inter-apps, exposition réseau.
**Stack :** Electron v32+, Express (127.0.0.1:9999), Work:5173, Code:4096, Design:port dynamique.

---

## 1. Synthèse

Le proxy Express présente une posture réseau saine et **en amélioration continue**
par rapport aux audits précédents :

- Binding strict sur `127.0.0.1` (jamais `0.0.0.0`).
- Authentification Bearer obligatoire sur tous les endpoints de données, avec un
  **token de session aléatoire uniquement** (`randomBytes(32)`), comparé en
  temps constant (`timingSafeEqual`). **Plus aucun token statique** — le finding
  N-4 des audits précédents est désormais **résolu dans le code**.
- TLS sortant validé par défaut (aucun `rejectUnauthorized:false` ni
  `NODE_TLS_REJECT_UNAUTHORIZED=0` dans tout `electron/`).
- Défense anti-DNS-rebinding (validation du header `Host`), CORS allow-list locale,
  headers de sécurité complets, garde anti-SSRF sur l'URL Ollama configurable
  (`isSafeOllamaUrl`).
- WebContentsView durcies (`contextIsolation:true`, `sandbox:true`,
  `nodeIntegration:false`, `webSecurity:true`, `allowRunningInsecureContent:false`).

**1 correctif appliqué ce jour** (backoff exponentiel sur le retry 429).
**5 findings restants à vérifier manuellement**, aucun exploitable à distance
(surface limitée à la loopback locale ; les risques résiduels supposent une app
locale déjà compromise).

---

## 2. Matrice de sécurité réseau

| Aspect                      | Constat                                                                                                                                | Statut        |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| Binding proxy               | `app.listen(9999, "127.0.0.1")` — jamais 0.0.0.0                                                                                       | ✅ CONFORME   |
| Auth Bearer                 | Middleware global avant tous les endpoints data ; comparaison `timingSafeEqual`                                                        | ✅ CONFORME   |
| Token de session            | Aléatoire `randomBytes(32)` par session — **aucun token statique**                                                                     | ✅ CONFORME   |
| Endpoints publics           | `PUBLIC_PATHS` = `/status`, `/health`, `/capabilities`, `/runtime/versions` uniquement                                                 | ✅ CONFORME   |
| Anti-DNS-rebinding          | Validation `Host` ∈ {127.0.0.1:9999, localhost:9999} → 421 sinon                                                                       | ✅ CONFORME   |
| CORS                        | Allow-list d'origines locales explicites ; fallback `127.0.0.1:9999` ; `Vary: Origin`                                                  | ✅ CONFORME   |
| X-Content-Type-Options      | `nosniff`                                                                                                                              | ✅ CONFORME   |
| X-Frame-Options             | `DENY`                                                                                                                                 | ✅ CONFORME   |
| Content-Security-Policy     | `frame-ancestors 'none'`                                                                                                               | ✅ CONFORME   |
| Referrer-Policy             | `no-referrer`                                                                                                                          | ✅ CONFORME   |
| Headers upstream filtrés    | `set-cookie`, `content-security-policy`, `x-frame-options`, `strict-transport-security`, `access-control-*` bloqués en réémission      | ✅ CONFORME   |
| TLS sortant                 | `fetch()` Node, validation certificats par défaut (aucun bypass)                                                                       | ✅ CONFORME   |
| Secrets dans les logs       | Aucune Authorization/clé loggée ; corps d'erreur upstream sanitizés (`sanitizeUpstreamError`)                                          | ✅ CONFORME   |
| Garde SSRF Ollama           | URL Ollama configurable filtrée par `isSafeOllamaUrl` (rejette IP réservées/métadonnées cloud)                                         | ✅ CONFORME   |
| Retry / backoff             | `fetchWithRetry` borné (maxRetries=3, ≤60s) + **backoff exponentiel** (corrigé ce jour)                                               | ✅ CORRIGÉ    |
| Limite payload              | `express.json({ limit: "10mb" })`                                                                                                      | ✅ CONFORME   |
| Partition de session        | Les 3 slots partagent `persist:chat`                                                                                                   | ⚠️ À VÉRIFIER |
| Secret OAuth Gemini en dur  | `GEMINI_CLIENT_SECRET` en dur (credential public "installed app", override env)                                                        | ⚠️ À VÉRIFIER |
| Rate limiting entrant       | Aucun, mais surface loopback uniquement                                                                                                | ⚠️ À VÉRIFIER |
| Binding daemon Design       | `od --no-open` sur :7456 — binding non contrôlé par OpenHub                                                                            | ⚠️ À VÉRIFIER |
| Code (opencode) sans mdp    | `OPENCODE_SERVER_PASSWORD` volontairement non posé (cf. commentaire process-manager)                                                  | ⚠️ À VÉRIFIER |

---

## 3. Cartographie des ports et isolation inter-apps

| Slot                 | Port                       | Binding              | Auth                                  | Isolation                                  |
| -------------------- | -------------------------- | -------------------- | ------------------------------------- | ------------------------------------------ |
| Work (openwork)      | 5173                       | local (Vite)         | via proxy (Bearer)                    | WebContentsView, preload, sandbox          |
| Code (opencode)      | 4096                       | **127.0.0.1 strict** (`--hostname 127.0.0.1`) | aucun mdp serveur (loopback, cf. N-5) | WebContentsView, sandbox          |
| Design (open-design) | dynamique + daemon :7456   | local                | daemon `od`                           | WebContentsView, sandbox                   |
| Proxy interne        | 9999                       | **127.0.0.1 strict** | Bearer session obligatoire            | —                                          |

**Isolation navigateur :** les 3 vues sont des `WebContentsView` durcies. La navigation
hors `http(s)://` est bloquée (`will-navigate`) et les liens externes sont délégués au
navigateur système (`setWindowOpenHandler` → `shell.openExternal`, action `deny`).
Les vues locales (chat, projets) bloquent toute navigation hors `file://`.

**Cross-origin Work → Code :** une requête de Work (5173) vers Code (4096) est soumise
à la Same-Origin Policy du navigateur **et** au CORS propre d'opencode (origines
différentes par port). Le proxy ne réexpose que des origines locales connues et ne
ponte 5173 → 4096 que via le préfixe authentifié `/workspace/:id/opencode/*` (header
`Host`/`Origin`/`Referer` réécrits, headers de sécurité non réémis depuis l'upstream).
Aucune route ne ponte les apps sans passer par l'auth Bearer.

**Point d'attention :** les 3 slots partagent `partition: "persist:chat"`
(cookies/localStorage/cache de session communs). La SOP isole déjà le stockage par
origine (port différent = origine différente), mais des partitions distinctes
renforceraient la défense en profondeur. Voir N-1.

---

## 4. Findings détaillés

### CORRIGÉ ce jour

**R-1 — Backoff linéaire sur le retry 429 (LOW)** ✅ CORRIGÉ
`fetchWithRetry` (`electron/proxy/index.ts`) rejouait les requêtes API sortantes
rejetées en 429 avec un backoff **linéaire** (`5*(attempt+1)` → 5s, 10s, 15s).
Vecteur : sur un upstream qui rate-limite agressivement, un backoff trop court
amplifie la charge sortante (effet thundering-herd) et peut prolonger le blocage
voire faire bannir la clé API. Durcissement : passage à un **backoff exponentiel**
(`2^(attempt+1)` → 2s, 4s, 8s) borné à 60s, l'indication explicite `Retry-After`
de l'upstream restant prioritaire. Le nombre de tentatives reste borné
(maxRetries=3) : pas de boucle infinie possible.

> Note process : ce correctif a été intégré au commit `a08e909` du dépôt — la
> modification a été happée par un processus de tâche planifiée concurrent
> (audit permissions) exécuté simultanément sur le même worktree. Le code corrigé
> est bien présent en `HEAD` (vérifié via `git show HEAD:electron/proxy/index.ts`).

### RÉSOLU depuis l'audit précédent (vérifié dans le code)

**N-4 (ancien) — Token Bearer statique `openhub-local`** ✅ RÉSOLU
Le code accepte désormais **uniquement** le token de session aléatoire
(`randomBytes(32)`, comparaison `timingSafeEqual`). Le commentaire du middleware
confirme explicitement « There is NO static/shared token ». Plus de token en dur.

### À VÉRIFIER MANUELLEMENT

**N-1 — Partition de session partagée entre les 3 apps (MEDIUM)**
`electron/main.ts` : tous les `createSlotView` utilisent `partition: "persist:chat"`.
Work, Code et Design partagent cookies, localStorage et cache de session. La SOP
isole le stockage par origine, mais une partition unique reste une réduction de la
défense en profondeur. Cloisonner via `persist:work` / `persist:code` /
`persist:design` renforcerait l'isolation, **mais risque de casser les flux
OAuth/session et l'injection d'overrides** — à valider en dev avant tout changement.

**N-2 — Secret OAuth Gemini en dur (LOW)**
`electron/proxy/index.ts` : `GEMINI_CLIENT_SECRET` est codé en dur (override
`process.env`). Il s'agit des credentials publics « installed app » du Gemini CLI
upstream, non secrets au sens OAuth des apps natives. Le retirer casserait l'auth
Gemini hors-env. Recommandation : documenter son caractère public ou exiger la
variable d'environnement. Ne pas supprimer sans alternative de configuration.

**N-3 — Pas de rate limiting entrant sur le proxy (LOW)**
Aucune limite de débit sur `/v1/chat/completions` ni `/v1/orch/assistant`. Risque
faible (loopback uniquement, pas d'attaquant distant). Un rate limit local
protégerait contre une boucle runaway d'une app locale compromise.

**N-4 — Binding du daemon Design `od` sur :7456 (LOW)**
Le daemon `open-design` (`od --no-open`) est spawné par OpenHub mais **son binding
réseau n'est pas contrôlé** par le shell (port 7456). Vérifier manuellement que `od`
écoute bien sur `127.0.0.1` et non `0.0.0.0`, sans quoi il serait exposé sur le LAN.
Hors périmètre modifiable (code upstream non patché par principe).

**N-5 — opencode serve sans mot de passe serveur (LOW, décision assumée)**
`electron/process-manager.ts` (commentaire l.34-36) : `OPENCODE_SERVER_PASSWORD`
n'est **volontairement pas** posé — le client OpenWork se connecte directement à
opencode et le shell ne peut pas injecter le mot de passe. Conséquence : tout
processus local peut joindre `127.0.0.1:4096` en contournant l'auth du proxy.
Exposition strictement loopback. Décision documentée et assumée ; à réévaluer si
opencode permet à l'avenir une auth injectable côté client.

---

## 5. Recommandations priorisées

1. **N-1** (partitions de session) : tester un cloisonnement par partition en dev
   avant adoption (risque OAuth/overrides).
2. **N-4** (binding `od`) : vérifier le binding du daemon Design (LAN exposure).
3. **N-3** (rate limiting) : ajouter une limite locale légère sur les endpoints LLM.
4. **N-2 / N-5** : documenter le modèle de confiance loopback dans `ARCHITECTURE.md`.

Aucun finding n'est exploitable à distance : toute la surface réseau est liée à
`127.0.0.1`. Les risques résiduels supposent une app locale déjà compromise.

---

## 6. Évolution vs audit précédent (2026-06-13)

- **R-1 (backoff)** : finding N-6 précédent désormais **corrigé** (backoff exponentiel).
- **N-4 ancien (token statique)** : **résolu** dans le code (token de session seul).
- Nouveaux points de vigilance explicités : binding daemon Design (N-4), décision
  assumée opencode sans mot de passe (N-5).
- En-têtes de sécurité (CSP `frame-ancestors`, `Referrer-Policy`) : toujours en place.
- Aucune régression réseau détectée depuis le dernier passage.
