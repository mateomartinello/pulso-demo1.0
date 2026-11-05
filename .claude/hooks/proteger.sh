#!/bin/sh
# PreToolUse (Edit|Write|MultiEdit): bloquea archivos que genera build.py y la demo 2.0 (en pausa).
f=$(jq -r '.tool_input.file_path // empty')
[ -z "$f" ] && exit 0
raiz="$CLAUDE_PROJECT_DIR"
case "$f" in
  */pulso-mockup2/*) echo "La demo 2.0 (pulso-mockup2) está en pausa: no se toca." >&2; exit 2 ;;
  "$raiz/index.html"|"$raiz/sw.js"|"$raiz/manifest.webmanifest"|"$raiz"/prueba/*)
    echo "$f se genera con build.py: editá src/ y corré python3 build.py (o build.py prueba)." >&2; exit 2 ;;
esac
exit 0
