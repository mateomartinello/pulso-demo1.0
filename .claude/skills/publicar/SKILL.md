---
name: publicar
description: Publica una versión de Pulso demo 1.0: primero en /prueba/, después (con el OK de Mateo) en producción. Usar cuando haya cambios listos para probar o Mateo diga «publicala».
disable-model-invocation: true
---

# Publicar Pulso

Cada push a `main` publica al instante en https://mateomartinello.github.io/pulso-demo1.0/ y la usan amigos con datos reales.

## 1. Versión de prueba
1. Subí `APP_VERSION` en `src/config.js`.
2. Chequeos: sintaxis de cada `src/*.js` con jsc, `sh pruebas/correr.sh` si se tocó el estimador, prueba en el navegador a ancho de celular (cuestionario, registro, modo cuidado).
3. `python3 build.py prueba` y después `git checkout index.html sw.js` (la raíz no se publica en este paso).
4. `git add prueba src pruebas` (más lo que corresponda), commit «Prueba X.Y.Z: …» con la línea Co-Authored-By, push.
5. Esperar a que https://mateomartinello.github.io/pulso-demo1.0/prueba/ muestre la versión nueva (curl con `?v=$(date +%s)`).
6. Pasarle a Mateo el link de prueba y qué probar en el iPhone (en Safari, no en la app instalada).

## 2. Producción (solo con el OK de Mateo)
1. `git pull --ff-only`, `python3 build.py`, `git rm -rq prueba`.
2. `git add index.html sw.js`, commit «Publica la versión X.Y.Z de la demo 1.0 y quita la versión de prueba», push.
3. Verificar con curl que la raíz tiene la versión y que `/prueba/` da 404; abrir la app en el navegador y revisar que no haya errores en la consola.
4. `/fila-docx` y actualizar la memoria del proyecto.
