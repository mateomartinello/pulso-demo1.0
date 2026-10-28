-- Pulso · base común de datos anónimos
-- Pegar completo en Supabase > SQL Editor > New query > Run.

create extension if not exists pgcrypto;

create table if not exists public.eventos (
  id           bigint generated always as identity primary key,
  anon_id      text        not null,            -- código aleatorio del dispositivo (no identifica a la persona)
  secret_hash  text        not null,            -- huella del secreto local; permite que la persona borre sus datos
  tipo         text        not null,            -- perfil · comida · comida_borrada · ejercicio · ejercicio_borrado · sueno · sesion · baja
  fecha        date,                             -- día al que corresponde el registro
  datos        jsonb       not null default '{}'::jsonb,
  creado       timestamptz,                      -- hora del registro en el dispositivo
  recibido     timestamptz not null default now(),
  app_version  text
);
-- Cuenta de la persona (si inició sesión). Al eliminar la cuenta queda vacía y los datos quedan como datos generales.
alter table public.eventos add column if not exists user_id uuid default auth.uid() references auth.users(id) on delete set null;
create index if not exists eventos_anon_idx  on public.eventos (anon_id);
create index if not exists eventos_user_idx  on public.eventos (user_id);
create index if not exists eventos_tipo_idx  on public.eventos (tipo, fecha);

-- Seguridad: la app (clave pública) solo puede AGREGAR filas. No puede leer, modificar ni borrar.
-- Permisos explícitos (el proyecto se crea sin «Automatically expose new tables»): solo INSERT, con o sin sesión iniciada.
revoke all on public.eventos from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant insert on public.eventos to anon, authenticated;
alter table public.eventos enable row level security;
drop policy if exists "solo_insertar" on public.eventos;
create policy "solo_insertar" on public.eventos for insert to anon, authenticated with check (
  char_length(anon_id) between 8 and 64
  and (user_id is null or user_id = auth.uid())
  and tipo in ('perfil','comida','comida_borrada','ejercicio','ejercicio_borrado','sueno','sesion')
  and pg_column_size(datos) < 20000
);

-- Borrado a pedido de la persona: solo borra si presenta el secreto que guarda su dispositivo.
create or replace function public.borrar_mis_datos(p_anon_id text, p_secret text)
returns integer
language plpgsql
security definer
set search_path = public, extensions
as $$
declare n integer;
begin
  delete from public.eventos
   where anon_id = p_anon_id
     and secret_hash = encode(digest(p_secret, 'sha256'), 'hex');
  get diagnostics n = row_count;
  return n;
end;
$$;
revoke all on function public.borrar_mis_datos(text, text) from public;
grant execute on function public.borrar_mis_datos(text, text) to anon;

-- Vistas útiles para analizar (solo las ve el dueño del proyecto, no la app):
create or replace view public.resumen_usuarios with (security_invoker = on) as
  select anon_id, min(recibido) as primer_registro, max(recibido) as ultimo_registro,
         count(*) filter (where tipo='comida') as comidas,
         count(*) filter (where tipo='ejercicio') as actividades,
         count(*) filter (where tipo='sueno') as noches
    from public.eventos group by anon_id;
revoke all on public.resumen_usuarios from anon, authenticated;


-- ======================= RECORDATORIOS DE COMIDAS (Web Push) =======================
-- Independientes de «compartir datos»: cada dispositivo usa un código propio, distinto de anon_id.
-- La clave pública no puede leer estas tablas: solo usa las funciones de abajo, protegidas con el secreto del dispositivo.
create table if not exists public.suscripciones (
  id           text primary key,                    -- código aleatorio del dispositivo para los avisos
  secret_hash  text not null,                       -- huella del secreto local; permite cambiar o borrar la suscripción
  endpoint     text not null unique,                -- dirección del servicio de notificaciones (Apple, Google, Mozilla, Microsoft)
  p256dh       text not null,
  auth         text not null,
  horarios     jsonb not null default '{}'::jsonb,  -- {"des":"08:30","alm":"13:00",...}
  zona         text not null,                       -- zona horaria, por ejemplo America/Argentina/Buenos_Aires
  prueba       boolean not null default false,      -- la persona pidió un aviso de prueba
  creado       timestamptz not null default now(),
  actualizado  timestamptz not null default now()
);
create table if not exists public.avisos_dia (
  sub_id      text not null references public.suscripciones(id) on delete cascade,
  fecha       date not null,
  momento     text not null,
  registrado  boolean not null default false,       -- la persona ya registró esa comida (sin el contenido)
  enviado     timestamptz,                          -- cuándo se mandó el aviso
  primary key (sub_id, fecha, momento)
);
create table if not exists public.avisos_config (
  unica       boolean primary key default true check (unica),
  clave_hash  text not null                         -- huella de AVISOS_CLAVE, el secreto de la función de envío
);
alter table public.suscripciones enable row level security;
alter table public.avisos_dia    enable row level security;
alter table public.avisos_config enable row level security;
revoke all on public.suscripciones, public.avisos_dia, public.avisos_config from anon, authenticated;

create or replace function public.guardar_suscripcion(p_id text, p_secret text, p_endpoint text, p_p256dh text, p_auth text, p_horarios jsonb, p_zona text)
returns boolean language plpgsql security definer set search_path = public, extensions as $$
declare h text := encode(digest(p_secret, 'sha256'), 'hex'); actual text;
begin
  if char_length(p_id) not between 8 and 64 or char_length(p_secret) < 16
     or char_length(p_endpoint) > 1000
     or p_endpoint !~ '^https://(fcm\.googleapis\.com|android\.googleapis\.com|web\.push\.apple\.com|updates\.push\.services\.mozilla\.com|[a-z0-9.-]+\.notify\.windows\.com)/'
     or char_length(p_p256dh) not between 80 and 100 or char_length(p_auth) not between 16 and 30
     or jsonb_typeof(p_horarios) <> 'object'
     or exists (select 1 from jsonb_each_text(p_horarios) e where e.key not in ('des','col','alm','mer','cen') or e.value !~ '^([01]?\d|2[0-3]):[0-5]\d$')
     or not exists (select 1 from pg_timezone_names where name = p_zona)
  then return false; end if;
  select s.secret_hash into actual from suscripciones s where s.id = p_id;
  if found and actual <> h then return false; end if;
  delete from suscripciones s where s.endpoint = p_endpoint and s.id <> p_id;   -- el mismo dispositivo con otro código (por ejemplo, tras «Borrar todo»)
  insert into suscripciones (id, secret_hash, endpoint, p256dh, auth, horarios, zona)
  values (p_id, h, p_endpoint, p_p256dh, p_auth, p_horarios, p_zona)
  on conflict (id) do update set endpoint = excluded.endpoint, p256dh = excluded.p256dh, auth = excluded.auth,
    horarios = excluded.horarios, zona = excluded.zona, actualizado = now();
  return true;
end; $$;

-- «Esta comida ya está registrada» (o ya no, si se borró el registro): solo fecha y momento del día.
create or replace function public.marcar_comida(p_id text, p_secret text, p_fecha date, p_momento text, p_hecho boolean)
returns boolean language plpgsql security definer set search_path = public, extensions as $$
begin
  if p_momento not in ('des','col','alm','mer','cen') or p_fecha not between current_date - 2 and current_date + 2
     or not exists (select 1 from suscripciones s where s.id = p_id and s.secret_hash = encode(digest(p_secret, 'sha256'), 'hex'))
  then return false; end if;
  insert into avisos_dia (sub_id, fecha, momento, registrado) values (p_id, p_fecha, p_momento, p_hecho)
  on conflict (sub_id, fecha, momento) do update set registrado = excluded.registrado;
  return true;
end; $$;

create or replace function public.borrar_suscripcion(p_id text, p_secret text)
returns integer language plpgsql security definer set search_path = public, extensions as $$
declare n integer;
begin
  delete from suscripciones s where s.id = p_id and s.secret_hash = encode(digest(p_secret, 'sha256'), 'hex');
  get diagnostics n = row_count; return n;
end; $$;

create or replace function public.pedir_aviso_prueba(p_id text, p_secret text)
returns boolean language plpgsql security definer set search_path = public, extensions as $$
begin
  update suscripciones s set prueba = true where s.id = p_id and s.secret_hash = encode(digest(p_secret, 'sha256'), 'hex');
  return found;
end; $$;

-- Para la función de envío (la llama cada minuto la tarea programada). Exige AVISOS_CLAVE.
-- Devuelve los avisos que vencen ahora (hasta 20 minutos de tolerancia) y los marca como enviados, así nunca se repiten.
create or replace function public.avisos_a_enviar(p_clave text)
returns table (sub_id text, endpoint text, p256dh text, auth text, momento text)
language plpgsql security definer set search_path = public, extensions as $$
#variable_conflict use_column
begin
  if not exists (select 1 from avisos_config c where c.clave_hash = encode(digest(p_clave, 'sha256'), 'hex')) then
    raise exception 'clave incorrecta' using errcode = '42501';
  end if;
  perform pg_advisory_xact_lock(724100);
  delete from avisos_dia a where a.fecha < current_date - 3;
  return query
  with horas as (
    select s.id, s.endpoint, s.p256dh, s.auth, h.key as mom, h.value::time as hora, (now() at time zone s.zona) as ahora
      from suscripciones s cross join lateral jsonb_each_text(s.horarios) h
  ), vencen as (
    select x.id, x.endpoint, x.p256dh, x.auth, x.mom, x.ahora::date as fecha
      from horas x
     where x.ahora::time - x.hora >= interval '0' and x.ahora::time - x.hora < interval '20 minutes'
       and not exists (select 1 from avisos_dia a where a.sub_id = x.id and a.fecha = x.ahora::date and a.momento = x.mom and (a.registrado or a.enviado is not null))
  ), marcar as (
    insert into avisos_dia (sub_id, fecha, momento, enviado)
    select v.id, v.fecha, v.mom, now() from vencen v
    on conflict on constraint avisos_dia_pkey do update set enviado = now()
    returning 1
  )
  select v.id, v.endpoint, v.p256dh, v.auth, v.mom from vencen v
  union all
  select s.id, s.endpoint, s.p256dh, s.auth, 'prueba' from suscripciones s where s.prueba;
  update suscripciones s set prueba = false where s.prueba;
end; $$;

-- Suscripciones que el servicio de notificaciones dio por vencidas (la persona desinstaló la app o quitó el permiso).
create or replace function public.quitar_suscripciones(p_clave text, p_ids text[])
returns integer language plpgsql security definer set search_path = public, extensions as $$
declare n integer;
begin
  if not exists (select 1 from avisos_config c where c.clave_hash = encode(digest(p_clave, 'sha256'), 'hex')) then
    raise exception 'clave incorrecta' using errcode = '42501';
  end if;
  delete from suscripciones s where s.id = any(p_ids);
  get diagnostics n = row_count; return n;
end; $$;

revoke all on function public.guardar_suscripcion(text, text, text, text, text, jsonb, text) from public;
revoke all on function public.marcar_comida(text, text, date, text, boolean) from public;
revoke all on function public.borrar_suscripcion(text, text) from public;
revoke all on function public.pedir_aviso_prueba(text, text) from public;
revoke all on function public.avisos_a_enviar(text) from public;
revoke all on function public.quitar_suscripciones(text, text[]) from public;
grant execute on function public.guardar_suscripcion(text, text, text, text, text, jsonb, text) to anon;
grant execute on function public.marcar_comida(text, text, date, text, boolean) to anon;
grant execute on function public.borrar_suscripcion(text, text) to anon;
grant execute on function public.pedir_aviso_prueba(text, text) to anon;
grant execute on function public.avisos_a_enviar(text) to anon;
grant execute on function public.quitar_suscripciones(text, text[]) to anon;

-- La huella de AVISOS_CLAVE se carga aparte (no va en este archivo público); ver LEEME.md:
--   insert into public.avisos_config (clave_hash) values ('<sha256 de AVISOS_CLAVE>')
--   on conflict (unica) do update set clave_hash = excluded.clave_hash;

-- Tarea programada: llama a la función de envío cada minuto.
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;
select cron.schedule('pulso-avisos', '* * * * *', $cron$
  select net.http_post(
    url := 'https://aihixquihhpirxmjhumg.supabase.co/functions/v1/enviar-avisos',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb,
    timeout_milliseconds := 30000);
$cron$);


-- ======================= CUENTAS (ingreso con código por mail) =======================
-- Supabase Auth: la persona entra con su mail y un código. La tabla «usuarios» guarda su nombre, su apellido,
-- su mail y una copia de respaldo de sus respuestas y registros, para recuperarlos al volver a entrar.
-- Solo la propia persona puede leer o cambiar su fila, mediante las funciones de abajo.
drop function if exists public.guardar_contacto(text, text, text);
drop function if exists public.borrar_contacto(text, text);
drop table if exists public.contactos;   -- reemplazada por «usuarios»

create table if not exists public.usuarios (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  nombre       text,
  apellido     text,
  anon_id      text,                                -- código de análisis del dispositivo (continuidad entre dispositivos)
  respaldo     jsonb not null default '{}'::jsonb,  -- copia del estado de la app: perfil, registros y aceptación de términos
  creado       timestamptz not null default now(),
  actualizado  timestamptz not null default now()
);
alter table public.usuarios enable row level security;
revoke all on public.usuarios from anon, authenticated;

create or replace function public.guardar_usuario(p_nombre text, p_apellido text, p_anon_id text, p_respaldo jsonb)
returns boolean language plpgsql security definer set search_path = public, extensions as $$
declare uid uuid := auth.uid(); mail text;
begin
  if uid is null or jsonb_typeof(p_respaldo) <> 'object' or pg_column_size(p_respaldo) > 5000000
     or char_length(coalesce(p_nombre,'')) > 80 or char_length(coalesce(p_apellido,'')) > 80 or char_length(coalesce(p_anon_id,'')) > 64
  then return false; end if;
  select u.email into mail from auth.users u where u.id = uid;
  insert into usuarios (user_id, email, nombre, apellido, anon_id, respaldo)
  values (uid, mail, p_nombre, p_apellido, p_anon_id, p_respaldo)
  on conflict (user_id) do update set email = excluded.email, nombre = excluded.nombre, apellido = excluded.apellido,
    anon_id = excluded.anon_id, respaldo = excluded.respaldo, actualizado = now();
  return true;
end; $$;

create or replace function public.mi_usuario()
returns jsonb language sql stable security definer set search_path = public, extensions as $$
  select jsonb_build_object('email', u.email, 'nombre', u.nombre, 'apellido', u.apellido, 'anon_id', u.anon_id, 'respaldo', u.respaldo)
    from usuarios u where u.user_id = auth.uid();
$$;

-- Eliminar la cuenta: exige las 5 respuestas de la encuesta de salida. Borra nombre, apellido, mail, respaldo y la cuenta;
-- los eventos quedan como datos generales (sin user_id) y la encuesta se guarda como evento «baja».
create or replace function public.eliminar_cuenta(p_encuesta jsonb)
returns boolean language plpgsql security definer set search_path = public, extensions as $$
declare uid uuid := auth.uid(); aid text;
begin
  if uid is null or jsonb_typeof(p_encuesta) <> 'array' or jsonb_array_length(p_encuesta) <> 5
     or exists (select 1 from jsonb_array_elements(p_encuesta) r
                where jsonb_typeof(r->'respuesta') <> 'string' or char_length(regexp_replace(r->>'respuesta', '[^[:alpha:]]', '', 'g')) < 3)
  then return false; end if;
  select u.anon_id into aid from usuarios u where u.user_id = uid;
  insert into eventos (anon_id, secret_hash, tipo, fecha, datos, creado, user_id)
  values (coalesce(aid, 'cuenta-eliminada'), '-', 'baja', current_date, jsonb_build_object('encuesta', p_encuesta), now(), null);
  update eventos e set user_id = null where e.user_id = uid;
  delete from usuarios u where u.user_id = uid;
  delete from auth.users a where a.id = uid;
  return true;
end; $$;

revoke all on function public.guardar_usuario(text, text, text, jsonb) from public;
revoke all on function public.mi_usuario() from public;
revoke all on function public.eliminar_cuenta(jsonb) from public;
grant execute on function public.guardar_usuario(text, text, text, jsonb) to authenticated;
grant execute on function public.mi_usuario() to authenticated;
grant execute on function public.eliminar_cuenta(jsonb) to authenticated;

-- Para analizar (solo la ve el dueño del proyecto): cada evento con el nombre y el mail de su cuenta, si la tiene.
create or replace view public.eventos_con_usuario with (security_invoker = on) as
  select e.*, u.email, u.nombre, u.apellido
    from public.eventos e left join public.usuarios u on u.user_id = e.user_id;
revoke all on public.eventos_con_usuario from anon, authenticated;


-- ======================= VERSIÓN 0.5.0 =======================
-- (mismo contenido que supabase/migracion-0.5.sql)

-- ======================= ADMINISTRADOR =======================
-- Cuenta de prueba a la que se entra con un PIN de 4 dígitos (Edge Function «ingreso-admin»).
-- Sus datos se guardan como los de cualquiera, pero las vistas de análisis los excluyen.
create table if not exists public.administradores (
  user_id  uuid primary key references auth.users(id) on delete cascade,
  creado   timestamptz not null default now()
);
create table if not exists public.admin_config (
  unica            boolean primary key default true check (unica),
  pin_hash         text not null,                    -- crypt() del PIN (bcrypt)
  fallos           integer not null default 0,
  bloqueado_hasta  timestamptz
);
alter table public.administradores enable row level security;
alter table public.admin_config    enable row level security;
revoke all on public.administradores, public.admin_config from anon, authenticated;

-- Verifica el PIN. Tras 5 intentos fallidos, bloquea el ingreso de administrador durante una hora.
-- Devuelve 'ok', 'mal' o 'bloqueado'.
create or replace function public.admin_verificar_pin(p_pin text)
returns text language plpgsql security definer set search_path = public, extensions as $$
declare c admin_config%rowtype;
begin
  select * into c from admin_config where unica for update;
  if not found or p_pin !~ '^\d{4}$' then return 'mal'; end if;
  if c.bloqueado_hasta is not null and c.bloqueado_hasta > now() then return 'bloqueado'; end if;
  if crypt(p_pin, c.pin_hash) = c.pin_hash then
    update admin_config set fallos = 0, bloqueado_hasta = null where unica;
    return 'ok';
  end if;
  update admin_config set fallos = case when c.fallos + 1 >= 5 then 0 else c.fallos + 1 end,
                          bloqueado_hasta = case when c.fallos + 1 >= 5 then now() + interval '1 hour' else null end
   where unica;
  return 'mal';
end; $$;
revoke all on function public.admin_verificar_pin(text) from public;
grant execute on function public.admin_verificar_pin(text) to anon;

-- Para el dueño del proyecto (SQL Editor): select public.admin_definir_pin('1234');
create or replace function public.admin_definir_pin(p_pin text)
returns boolean language plpgsql security definer set search_path = public, extensions as $$
begin
  if p_pin !~ '^\d{4}$' then return false; end if;
  insert into admin_config (pin_hash) values (crypt(p_pin, gen_salt('bf')))
  on conflict (unica) do update set pin_hash = excluded.pin_hash, fallos = 0, bloqueado_hasta = null;
  return true;
end; $$;
revoke all on function public.admin_definir_pin(text) from public, anon, authenticated;

-- mi_usuario devuelve además si la cuenta es de administrador.
create or replace function public.mi_usuario()
returns jsonb language sql stable security definer set search_path = public, extensions as $$
  select jsonb_build_object('email', u.email, 'nombre', u.nombre, 'apellido', u.apellido, 'anon_id', u.anon_id, 'respaldo', u.respaldo,
           'admin', exists (select 1 from administradores a where a.user_id = u.user_id))
    from usuarios u where u.user_id = auth.uid();
$$;

-- ======================= EVENTOS: tipos nuevos =======================
drop policy if exists "solo_insertar" on public.eventos;
create policy "solo_insertar" on public.eventos for insert to anon, authenticated with check (
  char_length(anon_id) between 8 and 64
  and (user_id is null or user_id = auth.uid())
  and tipo in ('perfil','comida','comida_borrada','ejercicio','ejercicio_borrado','sueno','sesion','ciclo','antojo')
  and pg_column_size(datos) < 20000
);

-- ======================= APPLE SALUD (atajo de iPhone) =======================
-- El atajo manda pasos y entrenamientos del día con un código personal (lo genera la app; acá solo queda su huella).
create table if not exists public.salud_tokens (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  token_hash  text not null unique,
  creado      timestamptz not null default now()
);
create table if not exists public.salud_dia (
  user_id     uuid not null references auth.users(id) on delete cascade,
  fecha       date not null,
  pasos       integer,
  entrenos    jsonb not null default '[]'::jsonb,   -- [{"tipo":"Correr","inicio":"2026-10-28T18:05:00-03:00","min":32,"kcal":310}]
  periodo     date,                                 -- inicio del último período registrado en Salud (si la persona lo comparte)
  actualizado timestamptz not null default now(),
  primary key (user_id, fecha)
);
alter table public.salud_tokens enable row level security;
alter table public.salud_dia    enable row level security;
revoke all on public.salud_tokens, public.salud_dia from anon, authenticated;

-- La app pide un código nuevo (reemplaza al anterior) para pegarlo en el atajo.
create or replace function public.salud_codigo_nuevo()
returns text language plpgsql security definer set search_path = public, extensions as $$
declare uid uuid := auth.uid(); t text := encode(gen_random_bytes(12), 'hex');
begin
  if uid is null then return null; end if;
  insert into salud_tokens (user_id, token_hash) values (uid, encode(digest(t, 'sha256'), 'hex'))
  on conflict (user_id) do update set token_hash = excluded.token_hash, creado = now();
  return t;
end; $$;

-- La llama el atajo (clave pública + código personal). Guarda el día y lo deja también como evento «salud» para el análisis.
drop function if exists public.salud_importar(text, date, integer, jsonb);
drop function if exists public.salud_importar(text, date, integer, jsonb, date);
drop function if exists public.salud_importar(text, date, text, jsonb, text);
-- Pasos, minutos y período llegan como texto: el atajo puede mandarlos vacíos (por ejemplo, si no hay registros del período).
-- p_minutos: minutos de ejercicio del día (anillo verde de Salud); si no vienen entrenamientos, se guardan como uno solo.
create or replace function public.salud_importar(p_codigo text, p_fecha date, p_pasos text default null, p_entrenos jsonb default '[]'::jsonb, p_periodo text default null, p_minutos text default null)
returns boolean language plpgsql security definer set search_path = public, extensions as $$
declare uid uuid; aid text; ent jsonb := coalesce(p_entrenos, '[]'::jsonb); pasos integer; periodo date; minutos integer;
begin
  select s.user_id into uid from salud_tokens s where s.token_hash = encode(digest(trim(both E' \n\r\t' from coalesce(p_codigo,'')), 'sha256'), 'hex');
  if uid is null or p_fecha not between current_date - 7 and current_date + 1 then return false; end if;
  if jsonb_typeof(ent) = 'object' then ent := jsonb_build_array(ent); end if;   -- un solo entrenamiento
  if jsonb_typeof(ent) <> 'array' or jsonb_array_length(ent) > 20 or pg_column_size(ent) > 20000 then return false; end if;
  if trim(coalesce(p_pasos,'')) ~ '^\d{1,6}([.,]\d+)?$' then pasos := round(replace(trim(p_pasos), ',', '.')::numeric); end if;
  if pasos > 150000 then return false; end if;
  if trim(coalesce(p_periodo,'')) ~ '^\d{4}-\d{2}-\d{2}$' then periodo := trim(p_periodo)::date; end if;
  if trim(coalesce(p_minutos,'')) ~ '^\d{1,4}([.,]\d+)?$' then minutos := round(replace(trim(p_minutos), ',', '.')::numeric); end if;
  if jsonb_array_length(ent) = 0 and minutos > 0 then ent := jsonb_build_array(jsonb_build_object('tipo', 'Ejercicio', 'min', minutos)); end if;
  if periodo is not null and periodo not between current_date - 120 and current_date + 1 then periodo := null; end if;
  insert into salud_dia (user_id, fecha, pasos, entrenos, periodo) values (uid, p_fecha, pasos, ent, periodo)
  on conflict (user_id, fecha) do update set pasos = excluded.pasos, entrenos = excluded.entrenos, periodo = excluded.periodo, actualizado = now();
  select u.anon_id into aid from usuarios u where u.user_id = uid;
  insert into eventos (anon_id, secret_hash, tipo, fecha, datos, creado, user_id)
  values (coalesce(aid, 'salud-' || left(uid::text, 8)), '-', 'salud', p_fecha, jsonb_build_object('pasos', pasos, 'entrenos', ent, 'periodo', periodo), now(), uid);
  return true;
end; $$;

-- La app lee lo que llegó del atajo.
create or replace function public.mi_salud(p_desde date)
returns table (fecha date, pasos integer, entrenos jsonb, periodo date)
language sql stable security definer set search_path = public, extensions as $$
  select d.fecha, d.pasos, d.entrenos, d.periodo from salud_dia d where d.user_id = auth.uid() and d.fecha >= p_desde order by d.fecha;
$$;

revoke all on function public.salud_codigo_nuevo() from public;
revoke all on function public.salud_importar(text, date, text, jsonb, text, text) from public;
revoke all on function public.mi_salud(date) from public;
grant execute on function public.salud_codigo_nuevo() to authenticated;
grant execute on function public.salud_importar(text, date, text, jsonb, text, text) to anon;
grant execute on function public.mi_salud(date) to authenticated;

-- ======================= VISTAS DE ANÁLISIS (sin la cuenta de administrador) =======================
create or replace view public.eventos_con_usuario with (security_invoker = on) as
  select e.*, u.email, u.nombre, u.apellido
    from public.eventos e left join public.usuarios u on u.user_id = e.user_id
   where not exists (select 1 from public.administradores a where a.user_id = e.user_id);
revoke all on public.eventos_con_usuario from anon, authenticated;

create or replace view public.resumen_usuarios with (security_invoker = on) as
  select anon_id, min(recibido) as primer_registro, max(recibido) as ultimo_registro,
         count(*) filter (where tipo='comida') as comidas,
         count(*) filter (where tipo='ejercicio') as actividades,
         count(*) filter (where tipo='sueno') as noches
    from public.eventos e
   where not exists (select 1 from public.administradores a where a.user_id = e.user_id)
   group by anon_id;
revoke all on public.resumen_usuarios from anon, authenticated;

-- Palabras que el estimador no reconoció al registrar comidas escritas: para sumarlas a la tabla de alimentos.
create or replace view public.palabras_no_reconocidas with (security_invoker = on) as
  select lower(w.palabra) as palabra, count(*) as veces,
         (array_agg(e.datos->>'texto' order by e.recibido desc))[1] as ejemplo,
         max(e.fecha) as ultima_vez
    from public.eventos e
    cross join lateral jsonb_array_elements_text(case when jsonb_typeof(e.datos->'noRec') = 'array' then e.datos->'noRec' else '[]'::jsonb end) as w(palabra)
   where e.tipo = 'comida'
     and not exists (select 1 from public.administradores a where a.user_id = e.user_id)
   group by 1
   order by veces desc, ultima_vez desc;
revoke all on public.palabras_no_reconocidas from anon, authenticated;
