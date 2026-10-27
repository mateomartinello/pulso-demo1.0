# Pulso — cómo publicarla y activar la base común

Pulso es un solo archivo: `index.html`. No necesita servidor. Los datos de cada persona quedan en su propio navegador; si acepta compartirlos, se envían anónimos a Supabase.

## 1. Publicar en GitHub Pages (unos 5 minutos)

1. En github.com, tocá **New repository**. Nombre sugerido: `pulso`. Marcalo como **Public** (GitHub Pages gratis requiere repositorio público) y tocá **Create repository**.
2. En el repositorio nuevo: **Add file → Upload files**, arrastrá `index.html` y tocá **Commit changes**.
3. Andá a **Settings → Pages**. En *Source* elegí **Deploy from a branch**, rama **main**, carpeta **/ (root)**, y **Save**.
4. En uno o dos minutos la app queda en `https://TU-USUARIO.github.io/pulso/`.

Para actualizarla, subí el `index.html` nuevo con el mismo nombre (reemplaza al anterior).

## 2. Activar la base común en Supabase (unos 10 minutos)

1. Creá una cuenta en supabase.com y un proyecto nuevo (plan gratuito). Elegí una región cercana (São Paulo) y guardá la contraseña de la base.
2. En el proyecto: **SQL Editor → New query**, pegá todo el contenido de `supabase.sql` y tocá **Run**.
3. En **Project Settings → API** copiá:
   - **Project URL** (algo como `https://xxxx.supabase.co`)
   - la clave **anon public**
4. Abrí `index.html` con un editor de texto, buscá `const CONFIG` al principio del script y pegá los dos valores:
   ```js
   SUPABASE_URL: "https://xxxx.supabase.co",
   SUPABASE_ANON_KEY: "eyJ...",
   ```
   También completá `CONTACTO` con un mail para pedidos de acceso o borrado de datos.
5. Subí ese `index.html` a GitHub (paso 1.2).

La clave **anon public** puede estar en la página: con las reglas de `supabase.sql`, solo sirve para **agregar** registros, no para leerlos. **Nunca** pegues en la página la clave `service_role`.

## 3. Ver y analizar los datos

- En Supabase: **Table Editor → eventos** muestra todo. Desde ahí podés exportar a CSV.
- Para que Claude los analice: exportá el CSV y adjuntalo al chat. (No compartas la clave `service_role` en un chat.)

Cada fila es un evento: `perfil`, `comida`, `comida_borrada`, `ejercicio`, `ejercicio_borrado` o `sueno`, con su `fecha`, el código anónimo de la persona (`anon_id`) y el detalle en `datos`.

## 4. Antes de abrirla al público

- Los datos de salud son **datos sensibles** según la Ley 25.326. Los términos de la app son un **borrador**: conviene que los revise un abogado.
- Completá el mail de contacto (`CONTACTO`).
- La app no reemplaza a profesionales de la salud y lo dice en sus términos.
