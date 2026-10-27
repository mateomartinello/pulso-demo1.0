-- Pulso · base común de datos anónimos
-- Pegar completo en Supabase > SQL Editor > New query > Run.

create extension if not exists pgcrypto;

create table if not exists public.eventos (
  id           bigint generated always as identity primary key,
  anon_id      text        not null,            -- código aleatorio del dispositivo (no identifica a la persona)
  secret_hash  text        not null,            -- huella del secreto local; permite que la persona borre sus datos
  tipo         text        not null,            -- perfil · comida · comida_borrada · ejercicio · ejercicio_borrado · sueno
  fecha        date,                             -- día al que corresponde el registro
  datos        jsonb       not null default '{}'::jsonb,
  creado       timestamptz,                      -- hora del registro en el dispositivo
  recibido     timestamptz not null default now(),
  app_version  text
);
create index if not exists eventos_anon_idx  on public.eventos (anon_id);
create index if not exists eventos_tipo_idx  on public.eventos (tipo, fecha);

-- Seguridad: la app (clave pública) solo puede AGREGAR filas. No puede leer, modificar ni borrar.
-- Permisos explícitos (el proyecto se crea sin «Automatically expose new tables»): solo INSERT para la clave pública.
revoke all on public.eventos from anon, authenticated;
grant usage on schema public to anon;
grant insert on public.eventos to anon;
alter table public.eventos enable row level security;
drop policy if exists "solo_insertar" on public.eventos;
create policy "solo_insertar" on public.eventos for insert to anon with check (
  char_length(anon_id) between 8 and 64
  and tipo in ('perfil','comida','comida_borrada','ejercicio','ejercicio_borrado','sueno')
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
