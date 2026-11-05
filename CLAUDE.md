# Pulso · demo 1.0

PWA de un solo archivo para comer, moverse y descansar mejor. La usan amigos de Mateo con datos reales: **cada push a `main` publica al instante** en https://mateomartinello.github.io/pulso-demo1.0/ (GitHub Pages desde la raíz).

## Forma de trabajo
- Español rioplatense, registro formal. Plan y OK antes de cambios de varios pasos; las preguntas de planificación, de a una. Los pasos que necesitan a Mateo (logins, secretos, aprobar SQL), de a uno por mensaje. Los secretos los pega siempre Mateo.
- No tocar la demo 2.0 (`~/Proyectos/pulso-mockup2`, en pausa) ni la app «Comer mejor» (artifact de Claude, solo lectura).
- Cambios de base de datos: compatibles con los datos y las cuentas que ya existen. Nada de datos de amigos en el repo (es público).
- Cada cambio de la app suma una fila al final de «Desarrollo de la app.docx» (no está en git): `/fila-docx`.
- Publicar: `/publicar` (versión de prueba en `/prueba/`, OK de Mateo, producción).

## Comandos
- Armar: `python3 build.py` (raíz) · `python3 build.py prueba` (carpeta `prueba/`). `index.html`, `sw.js` y `prueba/` se generan: no se editan a mano.
- Sintaxis: `/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc -e "checkSyntax('src/app.js')"` (no hay node).
- Pruebas del estimador: `sh pruebas/correr.sh` (frases con rangos esperados en `pruebas/estimador_pruebas.js`).
- Navegador local: `preview_start` con «pulso» (`.claude/launch.json`, puerto 8000).
- Supabase (proyecto «pulso», id `aihixquihhpirxmjhumg`): MCP de Supabase del proyecto (`.mcp.json`, se autoriza con la cuenta de Mateo) o, si no está disponible, por el navegador integrado; el SQL Editor no acepta pegar, se carga con `monaco.editor.getModels()[0].setValue(q)` y se toca Run.

## Mapa del código (`src/`, se concatena en este orden)
Buscar símbolos con `grep -n 'function nombre' src/archivo.js` y leer solo ese rango.
- `config.js` — `CONFIG`: `APP_VERSION`, Supabase, banderas (`SALUD`).
- `data.js` — `ING` (ingredientes de recetas, por 100 g), `PANES`, `RECETAS` (pool `s`: d desayuno/merienda, c colación, p principal, pre/post), `SLOTDEF`, `MARCAS` (valores por marca: `alimentos` del estimador e `ing` de recetas), `DIFICULTAD`, `CASERA` (medidas caseras).
- `estimador.js` — `ALIMENTOS` (tabla de texto: `nombre|alias;…|kcal|prot|fibra|porción g|unidad g|nombre unidad|banderas gr= hc=`) y `ESTIMADOR` (`analizar(texto)` → ítems y totales; `totales(items)`; `describir`; `alimento(nombre)`). Las reglas de combinación están en `analizar`, después de «3) reglas de combinación».
- `pwa.js` — instalación (`necesitaInstalar`, `renderInstalar`), recordatorios (`activarAvisos`, `planAvisos`), `agregar`.
- `cuenta.js` — ingreso por código (`pedirCodigo`, `alIngresar`: trae el respaldo y llama a `recalcularRegistros`), respaldo (`subirRespaldo`, `unirDias`), administrador, baja, Apple Salud (apagado).
- `app.js`:
  - Cuestionario `PREGUNTAS` → `calcPlan` (kcal, proteína, exclusiones, horarios; `resp.planFijo` y `resp.noIng` para perfiles cargados sin cuestionario) → `PLAN`.
  - Recetas: `usable`, `candidatos`, `elegir`, `nutr`.
  - Registro escrito: `pasosRegistro` (preguntas de ingredientes, porción, queso rallado, yogur) → `aplicarRespuestas` → `conMarcas` → `addComida`. Preguntas de a una: `flujoPreguntas` (tipos single, multi, numero).
  - Recálculo de registros viejos: `EST_VER`, `recalcularRegistros` (subir `EST_VER` vuelve a recalcular las comidas escritas de todos).
  - Vistas: `renderHoy` (`progreso`, `verFuentesVitC`), `renderMov` (`anotarMovimiento`, `tarjetaMovimiento`), `renderSemana`, `renderHistorial`, `renderRecetario`, `renderPerfil` (`seccionPlan`, `seccionMarcas`), `renderOnb`, `finalizarCuestionario`.
- `shell.html` + `css_base.css` — estilos; `sw.js` — service worker (red primero).
- `supabase.sql` y `supabase/` — esquema, migraciones y Edge Functions (`enviar-avisos`, `ingreso-admin`).

## Antes de cerrar un cambio
`python3 build.py`, chequeo de sintaxis, `sh pruebas/correr.sh` si se tocó el estimador, y prueba en el navegador a ancho de celular (cuestionario, registro, modo cuidado). En modo cuidado (`PLAN.care`) no se muestran calorías.
