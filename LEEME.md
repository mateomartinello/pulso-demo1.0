# Pulso — cómo publicarla y activar la base común

Pulso es un solo archivo: `index.html`. No necesita servidor. Los datos de cada persona quedan en su propio navegador; si acepta compartirlos, se envían anónimos a Supabase.

## 1. Publicar en GitHub Pages (unos 5 minutos)

1. En github.com, tocá **New repository**. Nombre sugerido: `pulso`. Marcalo como **Public** (GitHub Pages gratis requiere repositorio público) y tocá **Create repository**.
2. En el repositorio nuevo: **Add file → Upload files**, arrastrá `index.html` y tocá **Commit changes**.
3. Andá a **Settings → Pages**. En *Source* elegí **Deploy from a branch**, rama **main**, carpeta **/ (root)**, y **Save**.
4. En uno o dos minutos la app queda en `https://TU-USUARIO.github.io/pulso/`.

Para actualizarla, subí el `index.html` nuevo con el mismo nombre (reemplaza al anterior).

## 2. Activar la base común en Supabase (unos 10 minutos)

1. Creá una cuenta en supabase.com y un proyecto nuevo (plan gratuito). Elegí una región cercana (São Paulo) y guardá la contraseña de la base. En *Security*, desmarcá **Automatically expose new tables** y marcá **Enable automatic RLS**.
2. En el proyecto: **SQL Editor → New query**, pegá todo el contenido de `supabase.sql` y tocá **Run**.
3. En **Project Settings → API Keys** copiá la **Publishable key** (`sb_publishable_…`). La **Project URL** es `https://<id-del-proyecto>.supabase.co`.
4. Pegá los dos valores en `src/config.js`:
   ```js
   SUPABASE_URL: "https://xxxx.supabase.co",
   SUPABASE_ANON_KEY: "sb_publishable_...",
   ```
   También completá `CONTACTO` con un mail para pedidos de acceso o borrado de datos.
5. Corré `python3 build.py` y subí los cambios a GitHub.

La clave publicable puede estar en la página: con los permisos de `supabase.sql`, solo sirve para **agregar** registros, no para leerlos, modificarlos ni borrarlos. **Nunca** pegues en la página una clave secreta (`sb_secret_…` o `service_role`).

**Proyecto actual:** `pulso` (id `aihixquihhpirxmjhumg`, región São Paulo).

**Borrar los datos de prueba antes de abrir la app al público:** en **SQL Editor**, correr `truncate public.eventos restart identity;`.

## 2b. Recordatorios de comidas (Web Push)

La app es instalable (PWA: `manifest.webmanifest`, `sw.js`, `iconos/`) y puede mandar un aviso a la hora de cada comida. En iPhone hace falta agregarla a la pantalla de inicio (iOS 16.4 o posterior); en Android funciona también desde el navegador.

- **Datos:** tablas `suscripciones` y `avisos_dia` (en `supabase.sql`). Son independientes de «compartir datos»: cada dispositivo usa un código propio. La clave pública no puede leerlas; solo usa funciones protegidas con el secreto del dispositivo.
- **Envío:** la Edge Function `enviar-avisos` (`supabase/functions/enviar-avisos/index.ts`), llamada cada minuto por la tarea programada `pulso-avisos` (pg_cron). No usa claves privilegiadas de Supabase.
- **Secretos de la función** (Edge Functions › Secrets): `VAPID_PRIVADA` (clave privada de las notificaciones) y `AVISOS_CLAVE`. Se cargan a mano y **nunca** van al repositorio. La clave pública VAPID está en `src/config.js` y en la función.
- **Huella de `AVISOS_CLAVE`:** se carga en la base con `insert into public.avisos_config (clave_hash) values ('<sha256 de AVISOS_CLAVE>') on conflict (unica) do update set clave_hash = excluded.clave_hash;`
- **Íconos:** `python3 iconos.py` los regenera.

## 2c. Cuentas (desde la versión 0.4.0)

- **Ingreso:** mail + código de 6 dígitos que vence en una hora (Supabase Auth). Los mails salen de `verificacionpulso@gmail.com` por SMTP de Gmail (contraseña de aplicación cargada en Authentication › Emails › SMTP Settings; límite de 30 mails por hora). Las plantillas «Magic link or OTP» y «Confirm sign up» muestran `{{ .Token }}`. La app también acepta el enlace de ingreso, por si algún mail lo trae.
- **URL Configuration:** Site URL `https://mateomartinello.github.io/pulso/` y redirección permitida `https://mateomartinello.github.io/pulso/**`.
- **Tabla `usuarios`:** nombre, apellido, mail, `anon_id` y `respaldo` (copia del perfil y los registros). Solo la lee la propia persona, con las funciones `mi_usuario`, `guardar_usuario` y `eliminar_cuenta`.
- **Eventos vinculados:** `eventos.user_id` se completa solo con la cuenta de la sesión. Para analizar con nombre y mail: vista `eventos_con_usuario` (solo la ve el dueño del proyecto).
- **Eliminar la cuenta:** Perfil › «Eliminar mi cuenta» (página `#eliminar-cuenta`), con 5 preguntas abiertas obligatorias. Borra nombre, apellido, mail, respaldo y la cuenta; los eventos quedan sin `user_id` y la encuesta se guarda como evento `baja`.
- **Versión de prueba (opcional):** `python3 build.py prueba` la arma en `prueba/` y se publica en `/pulso/prueba/`, sin tocar la app principal. Al terminar, borrar `prueba/`.

## 2d. Pruebas del estimador de comidas

`sh pruebas/correr.sh` corre unas 50 frases de comidas comunes («dos porciones de pizza de muzzarella», «pollo con arroz», «un cortado»…) y avisa si alguna estimación sale del rango esperado. Correrlo después de cada cambio en la tabla de alimentos (`src/estimador.js`). Para ver el detalle de una frase: `sh pruebas/estimar.sh "frase"`.

## 3. Ver y analizar los datos

- En Supabase: **Table Editor → eventos** muestra todo. Desde ahí podés exportar a CSV.
- Para que Claude los analice: exportá el CSV y adjuntalo al chat. (No compartas la clave `service_role` en un chat.)

Cada fila es un evento: `perfil`, `comida`, `comida_borrada`, `ejercicio`, `ejercicio_borrado`, `sueno` o `sesion`, con su `fecha`, el código de la persona (`anon_id`) y el detalle en `datos`.

- **`perfil`:** respuestas del cuestionario, sin nombre, apellido ni mail, y `tiempos_s` (segundos que la persona tardó en cada pregunta, sin contar el tiempo con la app en segundo plano).
- **`sesion`:** `id`, `inicio`, `fin` y `duracion_s`. Se envía cada vez que la app pasa a segundo plano; si vuelve en menos de un minuto, sigue la misma sesión y se reenvía con el mismo `id`. **Para analizar, quedate con el último envío de cada `id`.**
- **Mails:** tabla `contactos`, aparte y sin relación con `eventos` (usa otro código). Los términos declaran tres usos: novedades, encuestas o estudios, y atención de consultas.

## 4. Antes de abrirla al público

- Los datos de salud son **datos sensibles** según la Ley 25.326. Desde la versión 0.3.0, aceptar los términos (y con eso compartir los datos) es **obligatorio** para usar la app, y se pide el mail: el art. 7 de la ley dice que nadie puede ser obligado a proporcionar datos sensibles, y una base con datos de personas identificables debe inscribirse en el Registro Nacional de Bases de Datos (AAIP). Los términos son un **borrador**: conviene que los revise un abogado antes de abrir la app.
- Completá el mail de contacto (`CONTACTO`).
- La app no reemplaza a profesionales de la salud y lo dice en sus términos.
