#!/bin/sh
# PostToolUse (Edit|Write|MultiEdit): chequeo de sintaxis de los .js y pruebas del estimador.
f=$(jq -r '.tool_input.file_path // .tool_response.filePath // empty')
raiz="$CLAUDE_PROJECT_DIR"
JSC=/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc
case "$f" in
  "$raiz"/src/*.js|"$raiz"/pruebas/*.js) ;;
  *) exit 0 ;;
esac
if ! out=$("$JSC" -e "checkSyntax('$f')" 2>&1); then
  echo "Error de sintaxis en $f: $out" >&2; exit 2
fi
case "$f" in
  "$raiz/src/estimador.js"|"$raiz/pruebas/estimador_pruebas.js")
    res=$(sh "$raiz/pruebas/correr.sh" 2>&1)
    if echo "$res" | grep -q "fuera de rango\|Error\|error"; then
      echo "Pruebas del estimador:" >&2; echo "$res" | tail -25 >&2; exit 2
    fi ;;
esac
exit 0
