# Atajo «Pulso · Salud» (Apple Salud → Pulso)

Lo arma una vez el dueño del proyecto en su iPhone, en la app **Atajos**, y lo comparte con un enlace de iCloud. Ese enlace va en `CONFIG.ATAJO_SALUD` (`src/config.js`). Cada persona lo instala desde Perfil › Apple Salud y pega su código personal.

Los nombres de las acciones pueden variar un poco según la versión de iOS.

## Acciones, en orden

1. **Texto** → escribí `CODIGO`. (Es el código personal; ver «Pregunta al importar», más abajo).
2. **Buscar muestras de salud** → Tipo: *Pasos*; filtro: *Fecha de inicio* es *hoy*.
3. **Calcular estadísticas** → *Suma* de las muestras de salud. Renombrá el resultado: `Pasos`.
4. **Buscar muestras de salud** → Tipo: *Entrenamientos*; filtro: *Fecha de inicio* es *hoy*.
5. **Repetir con cada elemento** (de los entrenamientos) → adentro, un **Diccionario** con:
   - `tipo` (texto): *Tipo* del elemento.
   - `inicio` (texto): *Fecha de inicio* del elemento, con formato ISO 8601.
   - `min` (número): *Duración* del elemento, en minutos.
   - `kcal` (número): *Energía activa* del elemento (si no aparece, dejalo afuera).
   Al salir del bloque queda la lista *Resultados de Repetir*.
6. **Buscar muestras de salud** → Tipo: *Menstruación* (Flujo menstrual); ordenar por *Fecha de inicio*, *más reciente primero*; límite: 1.
7. **Formatear fecha** → la *Fecha de inicio* del paso 6, formato personalizado `yyyy-MM-dd`. Renombrá: `Periodo`.
8. **Fecha actual** + **Formatear fecha** → formato personalizado `yyyy-MM-dd`. Renombrá: `Hoy`.
9. **Obtener contenido de URL**:
   - URL: `https://aihixquihhpirxmjhumg.supabase.co/rest/v1/rpc/salud_importar`
   - Método: **POST**
   - Encabezados: `apikey` = la clave publicable de `src/config.js` (`sb_publishable_…`); `Authorization` = `Bearer ` + la misma clave; `Content-Type` = `application/json`.
   - Cuerpo: **JSON**, con estos campos:
     - `p_codigo` (texto) → *Texto* del paso 1
     - `p_fecha` (texto) → `Hoy`
     - `p_pasos` (texto) → `Pasos`
     - `p_entrenos` (lista) → *Resultados de Repetir*
     - `p_periodo` (texto) → `Periodo`

La respuesta es `true` si se guardó. Si dice `false`, el código no es válido: generá uno nuevo en Perfil.

## Pregunta al importar

En los detalles del atajo (ⓘ) › **Configurar el atajo** › **Pregunta al importar**: agregá una para el *Texto* del paso 1 con el texto «Pegá el código que te dio Pulso (Perfil › Apple Salud)».

## Compartir

Nombre: **Pulso · Salud**. Compartir › **Copiar enlace de iCloud**. Ese enlace va en `CONFIG.ATAJO_SALUD`.

## Lo que hace cada persona (está explicado en la app)

1. Instala el atajo desde el enlace y le permite leer Salud.
2. Pega su código.
3. En Atajos › Automatización: una automatización **Hora del día** a las 23:00 que ejecute «Pulso · Salud» sin preguntar. Con Apple Watch, otra **Al terminar un entrenamiento**.
