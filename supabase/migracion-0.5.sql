-- Pulso · migración a la versión 0.5.0 (se corre una vez en SQL Editor; todo es compatible con los datos existentes).
-- Lo mismo queda incorporado en supabase.sql para instalaciones nuevas.

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
