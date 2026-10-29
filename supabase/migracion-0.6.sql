-- Pulso · migración a la versión 0.6.0 (se corre una vez en SQL Editor).

-- Lo que más registran los usuarios (últimos 30 días, sin la cuenta de administrador): base para crear recetas nuevas cada semana.
create or replace view public.comidas_mas_registradas with (security_invoker = on) as
  select regexp_replace(regexp_replace(it, ' (\d|×|\().*$', ''), ' \(.*$', '') as alimento,
         count(*) as veces, count(distinct e.user_id) as personas, max(e.fecha) as ultima_vez
    from public.eventos e
    cross join lateral jsonb_array_elements_text(case when jsonb_typeof(e.datos->'items') = 'array' then e.datos->'items' else '[]'::jsonb end) as it
   where e.tipo = 'comida' and e.fecha >= current_date - 30
     and not exists (select 1 from public.administradores a where a.user_id = e.user_id)
   group by 1
   order by veces desc, personas desc;
revoke all on public.comidas_mas_registradas from anon, authenticated;
