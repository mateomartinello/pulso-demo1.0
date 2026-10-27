#!/bin/sh
# Corre la batería de pruebas del estimador (pruebas/estimador_pruebas.js) con el motor de JavaScript de macOS.
D=$(cd "$(dirname "$0")/.." && pwd); T=$(mktemp)
cat "$D/src/estimador.js" "$D/pruebas/estimador_pruebas.js" > "$T"
/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc "$T"; rm -f "$T"
