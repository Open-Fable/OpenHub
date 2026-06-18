#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# OpenHub — Package Apps (standalone .dmg)
# ──────────────────────────────────────────────────────────────────────────────
# Assemble les artefacts de PRODUCTION des 3 apps upstream dans build/bundle/,
# dans le layout exact attendu par electron-builder (extraResources) :
#
#   build/bundle/
#   ├── apps/
#   │   ├── openwork/dist/            ← SPA statique (vite build)
#   │   └── open-design/apps/{daemon,web}/  ← daemon compilé + export Next statique
#   └── bin/
#       ├── opencode                  ← binaire prebuilt
#       └── node                      ← Node 24 standalone (daemon open-design)
#
# Cible : macOS arm64 uniquement (voir NODE_ARCH). Lancé avant `npm run build:package`.
# ──────────────────────────────────────────────────────────────────────────────
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APPS_DIR="$ROOT/apps"
BUNDLE="$ROOT/build/bundle"
VENDOR="$ROOT/vendor"

# ── Versions épinglées (S5/S6) ────────────────────────────────────────────────
# Node 24 LTS pour le daemon open-design (Electron embarque un Node trop ancien).
NODE_VERSION="24.10.0"
NODE_ARCH="darwin-arm64"
NODE_TARBALL="node-v${NODE_VERSION}-${NODE_ARCH}.tar.gz"
NODE_BASE_URL="https://nodejs.org/dist/v${NODE_VERSION}"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
info()  { echo -e "${GREEN}[package]${NC} $*"; }
warn()  { echo -e "${YELLOW}[package]${NC} $*"; }
error() { echo -e "${RED}[package]${NC} $*" >&2; }

require_arm64() {
  local arch; arch="$(uname -m)"
  if [ "$arch" != "arm64" ]; then
    error "Ce script cible macOS arm64 ; arch détectée : $arch."
    error "Builder sur un runner Apple Silicon (les modules natifs doivent matcher l'ABI)."
    exit 1
  fi
}

# ──────────────────────────────────────────────────────────────────────────────
# 0. Préparation
# ──────────────────────────────────────────────────────────────────────────────
require_arm64
info "Nettoyage de $BUNDLE..."
rm -rf "$BUNDLE"
mkdir -p "$BUNDLE/apps" "$BUNDLE/bin" "$VENDOR"

for app in openwork opencode open-design; do
  if [ ! -d "$APPS_DIR/$app" ]; then
    error "apps/$app introuvable — lance d'abord 'npm run setup'."
    exit 1
  fi
done

# ──────────────────────────────────────────────────────────────────────────────
# 1. openwork — SPA statique
# ──────────────────────────────────────────────────────────────────────────────
info "=== openwork (vite build) ==="
( cd "$APPS_DIR/openwork" && OPENWORK_ELECTRON_BUILD=1 pnpm --filter @openwork/app build )
OPENWORK_DIST="$APPS_DIR/openwork/apps/app/dist"
if [ ! -f "$OPENWORK_DIST/index.html" ]; then
  error "Build openwork échoué : $OPENWORK_DIST/index.html absent."
  exit 1
fi
mkdir -p "$BUNDLE/apps/openwork"
cp -R "$OPENWORK_DIST" "$BUNDLE/apps/openwork/dist"
info "openwork ✓"

# ──────────────────────────────────────────────────────────────────────────────
# 2. opencode — binaire prebuilt (S5 : version épinglée, checksum optionnel)
# ──────────────────────────────────────────────────────────────────────────────
info "=== opencode (binaire prebuilt) ==="
# Réutilise l'install système si présente, sinon installe dans un préfixe local.
OPENCODE_SRC=""
if command -v opencode &>/dev/null; then
  # `cp` déréférence les symlinks (copie le vrai fichier) ; pas besoin de
  # readlink -f, absent sur le readlink BSD de macOS.
  OPENCODE_SRC="$(command -v opencode)"
elif [ -x "$HOME/.opencode/bin/opencode" ]; then
  OPENCODE_SRC="$HOME/.opencode/bin/opencode"
fi
if [ -z "$OPENCODE_SRC" ] || [ ! -f "$OPENCODE_SRC" ]; then
  error "Binaire opencode introuvable — lance 'npm run setup' (installe le CLI)."
  exit 1
fi
# TRUST NOTE (S5) : upstream ne publie pas de checksum stable. Si OPENCODE_SHA256
# est fourni (CI), on vérifie ; sinon on hérite de la confiance dans l'install.
if [ -n "${OPENCODE_SHA256:-}" ]; then
  echo "${OPENCODE_SHA256}  ${OPENCODE_SRC}" | shasum -a 256 -c - \
    || { error "Checksum opencode invalide."; exit 1; }
  info "opencode checksum vérifié ✓"
fi
cp "$OPENCODE_SRC" "$BUNDLE/bin/opencode"
chmod +x "$BUNDLE/bin/opencode"
info "opencode ✓ ($("$BUNDLE/bin/opencode" --version 2>/dev/null || echo '?'))"

# ──────────────────────────────────────────────────────────────────────────────
# 3. Node 24 standalone (S5 : checksum vérifié contre SHASUMS256.txt officiel)
# ──────────────────────────────────────────────────────────────────────────────
info "=== Node ${NODE_VERSION} (${NODE_ARCH}) ==="
NODE_CACHE="$VENDOR/$NODE_TARBALL"
if [ ! -f "$NODE_CACHE" ]; then
  curl -fsSL "${NODE_BASE_URL}/${NODE_TARBALL}" -o "$NODE_CACHE"
fi
# Vérifie le tarball contre les sommes officielles signées par Node.js.
SHASUMS="$VENDOR/node-${NODE_VERSION}-SHASUMS256.txt"
curl -fsSL "${NODE_BASE_URL}/SHASUMS256.txt" -o "$SHASUMS"
( cd "$VENDOR" && grep " ${NODE_TARBALL}\$" "$SHASUMS" | shasum -a 256 -c - ) \
  || { error "Checksum Node ${NODE_VERSION} invalide — abandon."; exit 1; }
info "Node checksum vérifié ✓"
tar -xzf "$NODE_CACHE" -C "$VENDOR"
cp "$VENDOR/node-v${NODE_VERSION}-${NODE_ARCH}/bin/node" "$BUNDLE/bin/node"
chmod +x "$BUNDLE/bin/node"
info "node ✓ ($("$BUNDLE/bin/node" --version))"

# ──────────────────────────────────────────────────────────────────────────────
# 4. open-design — daemon compilé + node_modules natifs + export web statique
# ──────────────────────────────────────────────────────────────────────────────
# Les modules natifs (better-sqlite3, node-pty) sont compilés pour l'ABI Node 24
# par 'pnpm install' lancé sous Node 24 (assuré par require_arm64 + Node actif).
info "=== open-design (daemon + web) ==="
OD="$APPS_DIR/open-design"
node_major="$(node -v | sed 's/v//' | cut -d. -f1)"
if [ "$node_major" != "24" ]; then
  warn "Node actif = $(node -v) ; open-design exige Node 24."
  warn "Active Node 24 (fnm use 24 / volta) avant de relancer, sinon l'ABI native sera fausse."
fi

# 4a. Build daemon (tsc → apps/daemon/dist/cli.js) et ses deps de workspace.
( cd "$OD" && pnpm --filter @open-design/daemon... build )
if [ ! -f "$OD/apps/daemon/dist/cli.js" ]; then
  error "Build daemon open-design échoué : apps/daemon/dist/cli.js absent."
  exit 1
fi

# 4b. Build web (Next.js static export → apps/web/out).
( cd "$OD" && NODE_ENV=production pnpm --filter @open-design/web build )
if [ ! -f "$OD/apps/web/out/index.html" ]; then
  error "Export web open-design échoué : apps/web/out/index.html absent."
  error "Vérifie que next.config.ts produit bien output:'export' (pas un build server)."
  exit 1
fi

# 4c. Assemble un node_modules autoportant pour le daemon.
#
# PROBLÈME pnpm : cp -RL daemon/node_modules copie les FICHIERS du package
# (ex. @modelcontextprotocol/sdk) mais PAS ses peer-deps (ex. zod) qui sont
# identifiés dans le nom du répertoire virtuel pnpm :
#   .pnpm/@modelcontextprotocol+sdk@1.29.0_zod@4.4.2/node_modules/
# Le suffixe "_zod@4.4.2" indique que zod est un peer-dep résolu dans ce
# répertoire virtuel. Node le trouve en remontant dans le workspace mais plus
# dans le bundle isolé → ERR_MODULE_NOT_FOUND.
#
# SOLUTION : pour chaque symlink dans daemon/node_modules, on lit le nom du
# répertoire virtuel pnpm et on extrait les noms de peer-deps (suffixe après
# la version). On copie seulement ces packages ciblés depuis le répertoire
# virtuel vers daemon/node_modules du bundle.
OD_OUT="$BUNDLE/apps/open-design"
DAEMON_NM="$OD/apps/daemon/node_modules"
OUT_NM="$OD_OUT/apps/daemon/node_modules"
mkdir -p "$OD_OUT/apps/daemon" "$OD_OUT/apps/web"
cp -R "$OD/apps/daemon/bin"  "$OD_OUT/apps/daemon/bin"
cp -R "$OD/apps/daemon/dist" "$OD_OUT/apps/daemon/dist"
cp -RL "$DAEMON_NM" "$OUT_NM"

# copy_pnpm_peer_deps : copie les peer-deps pnpm manquants dans le bundle.
# Pour chaque symlink dans DAEMON_NM :
#  1. Résoudre le répertoire virtuel pnpm (.pnpm/<name>@<ver>_<peer>@<v>/node_modules/)
#  2. Parser le nom du répertoire pour extraire les peer deps (tout ce qui suit
#     le premier token @version dans le nom : "_peer@version")
#  3. Copier seulement ces packages précis s'ils sont absents du bundle.
copy_pnpm_peer_deps() {
  local nm_src="$1"  # daemon/node_modules d'origine (symlinks pnpm intacts)
  local nm_dst="$2"  # bundle daemon/node_modules (déjà copié avec cp -RL)

  find "$nm_src" -maxdepth 2 -type l | while read -r link; do
    target=$(readlink -f "$link" 2>/dev/null) || continue
    [ -d "$target" ] || continue

    rel="${link#$nm_src/}"
    if [[ "$rel" == @*/* ]]; then
      # @scope/name → répertoire virtuel est 2 niveaux au-dessus de la cible
      virt_nm="$(dirname "$(dirname "$target")")"
    else
      # name → répertoire virtuel est 1 niveau au-dessus
      virt_nm="$(dirname "$target")"
    fi

    # Nom du répertoire virtuel, ex: @modelcontextprotocol+sdk@1.29.0_zod@4.4.2
    virt_dir_name="$(basename "$(dirname "$virt_nm")")"

    # Extraire les peer dep specs du nom : tout après le premier _X@Y
    # Format: pkgname@version[_peer1@v1[_peer2@v2...]]
    # On découpe sur "_" et on garde les tokens qui commencent par [a-z@]
    # et contiennent "@" (= peer@version), en sautant le premier (pkg@version).
    peers=$(printf '%s' "$virt_dir_name" | tr '_' '\n' | tail -n +2)

    for peer_spec in $peers; do
      # peer_spec = "zod@4.4.2" ou "@hono+node-server@1.0.0" etc.
      # Extraire le nom du package (avant le @version final)
      # pnpm encode "@" en "+" dans le nom du dir, on inverse pour le chemin
      peer_name="${peer_spec%@*}"         # "zod" ou "+hono+node-server"
      peer_name="${peer_name//+//}"       # "+hono+node-server" → "/hono/node-server"
      # Reconstruire le chemin dans virt_nm
      peer_path="$virt_nm/$peer_name"
      [ -d "$peer_path" ] || [ -L "$peer_path" ] || continue

      # Copier dans le bundle si absent
      dest="$nm_dst/$peer_name"
      if [ ! -d "$dest" ]; then
        mkdir -p "$(dirname "$dest")"
        cp -RL "$peer_path" "$dest" 2>/dev/null && \
          echo "  [peer-dep] copié $peer_name (requis par $(basename "$link"))"
      fi
    done
  done
}

copy_pnpm_peer_deps "$DAEMON_NM" "$OUT_NM"
info "open-design peer-deps pnpm copiés dans node_modules"

# Le web n'a besoin que de l'export statique au runtime.
cp -R "$OD/apps/web/out" "$OD_OUT/apps/web/out"
info "open-design ✓"

# ──────────────────────────────────────────────────────────────────────────────
# 5. versions.json — versions figées des 3 apps (affichage lecture seule en prod)
# ──────────────────────────────────────────────────────────────────────────────
info "=== versions.json ==="
# Sanitize to a single token (strip quotes/whitespace) so a stray newline or
# quote in any --version output can't produce invalid JSON below.
clean_ver() { printf '%s' "$1" | head -n1 | tr -d '"\\' | tr -d '[:space:]'; }
OPENWORK_VER="$(clean_ver "$(node -p "require('$APPS_DIR/openwork/apps/app/package.json').version" 2>/dev/null || echo '?')")"
OPENCODE_VER="$(clean_ver "$("$BUNDLE/bin/opencode" --version 2>/dev/null || echo '?')")"
OD_VER="$(clean_ver "$(node -p "require('$OD/package.json').version" 2>/dev/null || echo '?')")"
cat > "$BUNDLE/apps/versions.json" <<EOF
{
  "openwork": "${OPENWORK_VER}",
  "opencode": "${OPENCODE_VER}",
  "open-design": "${OD_VER}"
}
EOF
info "versions.json ✓ (openwork ${OPENWORK_VER}, opencode ${OPENCODE_VER}, open-design ${OD_VER})"

# ──────────────────────────────────────────────────────────────────────────────
info "═══════════════════════════════════════════════════════════════════════"
info "  Bundle prêt : $BUNDLE"
du -sh "$BUNDLE" 2>/dev/null || true
info "  → lance maintenant : npm run build:package"
info "═══════════════════════════════════════════════════════════════════════"
