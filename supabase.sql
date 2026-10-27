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
