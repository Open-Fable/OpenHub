import { promises as fs } from "fs";
import path from "path";
import type { Project } from "./project-store.js";

// ── Helpers de contexte ──────────────────────────────────────────────────────

export async function buildWorkspaceContext(workspaceDir: string): Promise<string> {
  const indexPath = path.join(workspaceDir, "WORKSPACE_INDEX.md");
  try {
    const content = await fs.readFile(indexPath, "utf-8");
    const trimmed = content.substring(0, 3000);
    return `[ÉTAT DU WORKSPACE]\n${trimmed}`;
  } catch {
    return "[ÉTAT DU WORKSPACE]\nAucun fichier indexé. Le workspace est vide ou non initialisé.";
  }
}

export function buildDependencyContext(
  node: Project,
  allProjects: readonly Project[],
  executionResults: ReadonlyMap<string, string>,
): string {
  const deps = node.dependencies ?? [];
  if (deps.length === 0) return "";

  const blocks: string[] = [];
  for (const depId of deps) {
    const depProject = allProjects.find((p) => p.id === depId);
    const result = executionResults.get(depId);
    if (!depProject) continue;

    const resultSummary = result ? result.substring(0, 1500) : "(pas encore exécuté)";

    blocks.push(
      `--- Agent "${depProject.name}" (${depProject.type ?? "inconnu"}) ---\nTâche : ${depProject.task ?? "non définie"}\nRésultat :\n${resultSummary}`,
    );
  }

  if (blocks.length === 0) return "";
  return `[RÉSULTATS DES AGENTS PRÉCÉDENTS]\nLes agents suivants ont déjà terminé leur travail. Utilise leurs résultats comme base.\n\n${blocks.join("\n\n")}`;
}

// ── Règles par type d'agent ──────────────────────────────────────────────────

const QUALITY_RULES: Record<string, string> = {
  code: `RÈGLES DE QUALITÉ :
- Code complet et fonctionnel — pas de placeholders, pas de "// TODO", pas de "..."
- TypeScript strict, pas de \`any\` sauf aux frontières de sérialisation
- Fonctions < 50 lignes, fichiers < 400 lignes
- Gestion d'erreurs explicite à chaque niveau
- Pas de secrets en dur — utiliser les variables d'environnement
- Nommer chaque fichier créé avec son chemin relatif au workspace
- Inclure tous les imports nécessaires
- Écrire les tests unitaires correspondants`,

  design: `RÈGLES DE QUALITÉ :
- Composants accessibles WCAG AA minimum
- Design responsive (mobile-first)
- Utiliser des variables CSS pour les couleurs, tailles et espacements
- Nommer les fichiers CSS/composants de manière descriptive
- Documenter les tokens de design (couleurs, typographies, espacements)
- Fournir le code CSS/HTML complet, pas des descriptions vagues`,

  work: `RÈGLES DE QUALITÉ :
- HTML sémantique et valide
- Intégration fidèle aux maquettes/spécifications
- Code propre, indenté, sans redondance
- Optimisation des assets (images compressées, lazy loading)
- SEO de base (balises meta, titres, alt text)
- Nommer chaque fichier créé avec son chemin relatif`,

  verifier: `RÈGLES DE VÉRIFICATION :
- Analyser chaque livrable selon des critères objectifs et mesurables
- Distinguer les erreurs bloquantes (CRITICAL) des améliorations souhaitables (WARNING)
- Fournir des exemples concrets pour chaque problème identifié
- Proposer une correction pour chaque erreur trouvée
- Ne pas inventer de problèmes — signaler uniquement ce qui est réellement incorrect`,

  recherche: `RÈGLES DE QUALITÉ :
- Structurer les résultats avec des sections claires
- Citer les sources quand applicable
- Distinguer les faits des recommandations
- Prioriser les informations actionnables
- Fournir un résumé exécutif en début de livrable`,
};

function getQualityRules(type: string | undefined): string {
  return QUALITY_RULES[type ?? "code"] ?? QUALITY_RULES.code;
}

// ── 1. Planning ──────────────────────────────────────────────────────────────

export function buildPlanningSystemPrompt(orchestrator: Project): string {
  const base = orchestrator.instructions || "";
  return `Tu es un coordinateur de projet IA. Tu décomposes une tâche globale en sous-tâches précises pour des agents spécialisés.

${base ? `INSTRUCTIONS PERSONNALISÉES :\n${base}\n` : ""}RESPONSABILITÉS :
- Analyser la tâche globale et identifier TOUS les livrables nécessaires
- Attribuer à chaque agent une tâche claire, autonome et vérifiable
- Assurer la cohérence entre les tâches (pas de contradictions, pas de doublons)
- Respecter les dépendances entre agents (un agent dépendant reçoit le contexte de ses prédécesseurs)

RÈGLES DE DÉCOMPOSITION :
- Chaque tâche = UN livrable vérifiable (pas "fais plusieurs choses")
- Chaque tâche doit être compréhensible sans contexte extérieur
- Préciser le FORMAT DE SORTIE attendu (fichiers à créer, structure, conventions)
- Préciser les CONTRAINTES (technologies, standards, compatibilité)
- Préciser les CRITÈRES DE RÉUSSITE (comment vérifier que c'est bien fait)
- Adapter le niveau de détail au type d'agent (code → spécifications techniques, design → spécifications visuelles)

FORMAT DE RÉPONSE :
Renvoie STRICTEMENT un objet JSON plat sans autre texte ni balise markdown.
Les clés sont les identifiants de projet, les valeurs sont les tâches structurées.`;
}

export function buildPlanningUserPrompt(
  globalTask: string,
  linkedProjects: readonly Project[],
  workspaceContext: string,
): string {
  const agentList = linkedProjects
    .map((p) => {
      const deps = p.dependencies ?? [];
      const depInfo =
        deps.length > 0
          ? ` | Dépend de : ${deps.map((d) => linkedProjects.find((lp) => lp.id === d)?.name ?? d).join(", ")}`
          : "";
      return `- ID: "${p.id}" | Nom: "${p.name}" | Type: ${p.type ?? "non défini"}${depInfo}\n  Compétences : ${p.instructions || "non précisées"}`;
    })
    .join("\n");

  return `TÂCHE GLOBALE :
"${globalTask}"

${workspaceContext}

AGENTS DISPONIBLES :
${agentList}

CONSIGNE :
Pour chaque agent, génère une tâche structurée qui contient :
1. OBJECTIF — Ce que l'agent doit produire concrètement
2. CONTEXTE — Ce qu'il doit savoir pour travailler (dépendances, contraintes projet)
3. FORMAT — Les fichiers/livrables attendus avec leur structure
4. CRITÈRES — Comment vérifier que le travail est correct

EXEMPLE DE RÉPONSE :
{
  "p1": "OBJECTIF : Implémenter l'API d'authentification OAuth2 avec refresh tokens.\\nCONTEXTE : L'application utilise Express + PostgreSQL. Les routes doivent être sous /api/auth/.\\nFORMAT : Créer src/auth/router.ts, src/auth/service.ts, src/auth/types.ts et tests/auth.test.ts.\\nCRITÈRES : Les endpoints POST /login, POST /refresh et POST /logout doivent fonctionner. Tests unitaires avec couverture > 80%.",
  "p2": "OBJECTIF : Créer la charte graphique du module d'onboarding.\\nCONTEXTE : Application web B2B, cible professionnelle, style moderne et épuré.\\nFORMAT : Créer design/tokens.css (variables), design/onboarding.css (composants), et un document design/specs.md décrivant les choix.\\nCRITÈRES : Accessibilité WCAG AA, responsive mobile/desktop, palette de 5 couleurs max."
}`;
}

// ── 2. Exécution de node ─────────────────────────────────────────────────────

export function buildNodeSystemPrompt(node: Project): string {
  const identity = node.instructions || `Agent de type "${node.type ?? "général"}"`;
  const rules = getQualityRules(node.type);

  return `${identity}

${rules}

COMPORTEMENT ATTENDU :
- Tu travailles dans un workspace partagé avec d'autres agents
- Produis du code/contenu COMPLET et FONCTIONNEL, prêt à être utilisé
- Si tu crées des fichiers, indique clairement leur chemin relatif
- Ne fais PAS référence à d'autres agents ou à l'orchestrateur dans ta réponse
- Concentre-toi uniquement sur TA tâche assignée`;
}

export function buildNodeUserPrompt(
  node: Project,
  workspaceContext: string,
  dependencyContext: string,
): string {
  const task = node.task || "Aucune tâche définie.";

  const sections = [`TÂCHE :\n${task}`];

  if (workspaceContext) {
    sections.push(workspaceContext);
  }

  if (dependencyContext) {
    sections.push(dependencyContext);
  }

  sections.push(
    "RAPPEL : Produis un livrable complet. Pas de placeholders, pas de résumés partiels. Si tu crées des fichiers, indique le chemin et le contenu intégral.",
  );

  return sections.join("\n\n");
}

// ── 3. Continuation ──────────────────────────────────────────────────────────

export function buildContinuationPrompt(
  node: Project,
  previousText: string,
  attempt: number,
  maxRetries: number,
): string {
  const tail = previousText.slice(-500);
  return `Ta génération précédente a été interrompue (tentative ${attempt}/${maxRetries}).

TÂCHE ORIGINALE :
${node.task || "non définie"}

FIN DE TA DERNIÈRE RÉPONSE :
"""
...${tail}
"""

CONSIGNE : Reprends EXACTEMENT là où tu t'es arrêté. Ne répète pas ce que tu as déjà écrit. Continue directement à partir du point d'interruption ci-dessus.`;
}

// ── 4. Vérification pré-exécution ────────────────────────────────────────────

export function buildVerifyPromptsSystemPrompt(verifier: Project): string {
  return `${verifier.instructions || "Tu es un vérificateur de qualité d'instructions."}

RÔLE : Analyser un ensemble d'instructions générées pour des agents IA et vérifier leur qualité AVANT exécution.

Tu évalues selon une CHECKLIST STRICTE. Chaque critère est noté OK ou PROBLÈME.`;
}

export function buildVerifyPromptsUserPrompt(
  globalTask: string,
  promptsMap: Record<string, string>,
  linkedProjects: readonly Project[],
): string {
  const projectContext = linkedProjects
    .map((p) => `- "${p.id}" = "${p.name}" (${p.type ?? "non défini"})`)
    .join("\n");

  return `TÂCHE GLOBALE : "${globalTask}"

AGENTS :
${projectContext}

INSTRUCTIONS GÉNÉRÉES :
${JSON.stringify(promptsMap, null, 2)}

CHECKLIST DE VÉRIFICATION :
1. COUVERTURE — Chaque aspect de la tâche globale est-il couvert par au moins un agent ?
2. COHÉRENCE — Les instructions ne se contredisent-elles pas entre agents ?
3. CLARTÉ — Chaque instruction est-elle compréhensible sans contexte supplémentaire ?
4. COMPLÉTUDE — Chaque instruction précise-t-elle l'objectif, le format et les critères de réussite ?
5. DÉPENDANCES — Les agents dépendants ont-ils les informations nécessaires ?
6. FAISABILITÉ — Chaque tâche est-elle réalisable par un seul agent ?

Réponds STRICTEMENT par un JSON valide :
{
  "valid": true ou false,
  "checks": {
    "couverture": {"ok": true/false, "detail": "..."},
    "coherence": {"ok": true/false, "detail": "..."},
    "clarte": {"ok": true/false, "detail": "..."},
    "completude": {"ok": true/false, "detail": "..."},
    "dependances": {"ok": true/false, "detail": "..."},
    "faisabilite": {"ok": true/false, "detail": "..."}
  },
  "reason": "Résumé global si invalide"
}`;
}

// ── 5. Vérification post-exécution ───────────────────────────────────────────

export function buildVerifyOutputSystemPrompt(verifier: Project): string {
  return `${verifier.instructions || "Tu es un réviseur de code et de livrables."}

RÔLE : Vérifier qu'un livrable produit par un agent IA répond aux attentes de sa tâche assignée.

Tu évalues selon des critères objectifs. Tu ne valides PAS par défaut — tu cherches activement les problèmes.`;
}

export function buildVerifyOutputUserPrompt(node: Project, resultText: string): string {
  const typeChecks: Record<string, string> = {
    code: `CRITÈRES SPÉCIFIQUES (code) :
- Le code est-il syntaxiquement correct ?
- Les imports sont-ils présents et cohérents ?
- La gestion d'erreurs est-elle présente ?
- Y a-t-il des placeholders ou TODOs non résolus ?
- Les fichiers sont-ils nommés avec leur chemin ?`,
    design: `CRITÈRES SPÉCIFIQUES (design) :
- Les styles CSS sont-ils complets et valides ?
- Les variables de design sont-elles définies ?
- L'accessibilité est-elle prise en compte ?
- Le responsive est-il adressé ?`,
    work: `CRITÈRES SPÉCIFIQUES (intégration) :
- Le HTML est-il sémantique et valide ?
- L'intégration correspond-elle aux spécifications ?
- Les assets sont-ils référencés correctement ?`,
    verifier: `CRITÈRES SPÉCIFIQUES (vérification) :
- L'analyse est-elle structurée et objective ?
- Les problèmes identifiés sont-ils réels et documentés ?
- Des corrections sont-elles proposées ?`,
    recherche: `CRITÈRES SPÉCIFIQUES (recherche) :
- Les résultats sont-ils structurés ?
- Les sources sont-elles citées ?
- Les recommandations sont-elles actionnables ?`,
  };

  const specificChecks = typeChecks[node.type ?? "code"] ?? typeChecks.code;

  return `AGENT : "${node.name}" (type: ${node.type ?? "non défini"})
TÂCHE ASSIGNÉE : "${node.task ?? "non définie"}"

LIVRABLE PRODUIT :
---
${resultText.substring(0, 4000)}
---

CRITÈRES GÉNÉRAUX :
- Le livrable répond-il à la tâche assignée ?
- Le livrable est-il complet (pas de sections manquantes) ?
- Le livrable est-il utilisable en l'état ?
- Y a-t-il des erreurs évidentes ?

${specificChecks}

Réponds STRICTEMENT par un JSON valide :
{
  "valid": true ou false,
  "score": 0-100,
  "issues": [{"severity": "critical|warning|info", "description": "..."}],
  "reason": "Résumé si invalide"
}`;
}

// ── 6. Conformité marque ─────────────────────────────────────────────────────

export function buildBrandComplianceSystemPrompt(verifier: Project): string {
  return `${verifier.instructions || "Tu es le gardien de la charte de marque."}

RÔLE : Vérifier que les livrables produits respectent le guide de style et la charte graphique du projet.

Tu compares les livrables aux spécifications de la marque et signales tout écart.`;
}

export function buildBrandComplianceUserPrompt(brandGuidelines: string): string {
  return `GUIDE DE STYLE ET DE MARQUE :
---
${brandGuidelines}
---

GRILLE D'ÉVALUATION :
1. COULEURS — Les couleurs utilisées correspondent-elles à la palette définie ?
2. TYPOGRAPHIE — Les polices et tailles sont-elles conformes ?
3. ESPACEMENTS — Les marges et paddings suivent-ils la grille ?
4. TONALITÉ — Le ton rédactionnel est-il cohérent avec la marque ?
5. COMPOSANTS — Les composants UI respectent-ils les patterns définis ?

Réponds STRICTEMENT par un JSON valide :
{
  "valid": true ou false,
  "checks": {
    "couleurs": {"ok": true/false, "detail": "..."},
    "typographie": {"ok": true/false, "detail": "..."},
    "espacements": {"ok": true/false, "detail": "..."},
    "tonalite": {"ok": true/false, "detail": "..."},
    "composants": {"ok": true/false, "detail": "..."}
  },
  "reason": "Explication des écarts de marque"
}`;
}

// ── 7. Indexeur workspace ────────────────────────────────────────────────────

export function buildWorkspaceIndexSystemPrompt(): string {
  return "Tu es un analyste de documentation projet. Tu extrais les informations de fichiers créés ou modifiés à partir du résultat d'un agent et tu les formates pour un registre de workspace.";
}

export function buildWorkspaceIndexUserPrompt(node: Project, resultText: string): string {
  return `AGENT : "${node.name}" (type: ${(node.type ?? "code").toUpperCase()})

RÉSULTAT DE L'AGENT :
---
${resultText.substring(0, 3000)}
---

CONSIGNE :
Analyse le résultat ci-dessus et extrais :
1. Les NOUVEAUX FICHIERS créés (chemin + fonction en une phrase)
2. Une LIGNE DE CHANGELOG résumant ce que l'agent a fait

Réponds STRICTEMENT par un JSON valide :
{
  "newFiles": "| chemin/du/fichier | Fonction courte |\\n| chemin/autre | Fonction |",
  "changelogLine": "| ${new Date().toLocaleDateString("fr-FR")} | ${node.name} | fichiers modifiés | Description des changements |"
}

Si aucun fichier n'a été créé, mets "newFiles" à "".`;
}
