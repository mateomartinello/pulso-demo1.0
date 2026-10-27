#!/bin/sh
# Corre el estimador de comidas sobre frases sueltas, sin navegador. Uso: sh pruebas/estimar.sh "frase" ["otra frase" ...]
D=$(cd "$(dirname "$0")/.." && pwd); T=$(mktemp)
{ cat "$D/src/estimador.js"; echo 'var frases=arguments; for (var i=0;i<frases.length;i++){ var r=ESTIMADOR.analizar(frases[i]); print("» "+frases[i]); print("   "+r.items.map(ESTIMADOR.describir).join(" · ")+(r.sobras.length?"   [no reconocido: "+r.sobras.join(", ")+"]":"")); print("   "+r.kcal+" kcal · "+r.prot+" g prot · "+r.fibra+" g fibra · verd "+r.verduras+" · fruta "+r.frutas+" · integ "+r.integrales+(r.roja?" · carne roja":"")); }'; } > "$T"
/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc "$T" -- "$@"; rm -f "$T"
