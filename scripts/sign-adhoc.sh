#!/bin/bash
# Ad-hoc sign the .app bundle (standalone utility).
#
# Normally called automatically by the afterPack hook during `npm run build`.
# Run this script manually to re-sign after modifying the bundle contents.
#
# Usage: bash scripts/sign-adhoc.sh [path/to/App.app]

set -euo pipefail

if [ -n "${1:-}" ]; then
  APP="$1"
else
  APP_DIR="release/mac-arm64"
  APP=$(find "$APP_DIR" -maxdepth 1 -name "*.app" -type d | head -1)
fi

if [ -z "$APP" ] || [ ! -d "$APP" ]; then
  echo "Error: No .app found. Pass the path as argument or run from the project root."
  exit 1
fi

echo "[sign] Ad-hoc signing $APP ..."
codesign --force --deep --sign - "$APP"

echo "[sign] Verifying ..."
codesign --verify --deep --verbose=2 "$APP" 2>&1
echo "[sign] ✓ Bundle passes deep verification"
