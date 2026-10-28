// Pulso · ingreso de administrador con un PIN de 4 dígitos (cuenta de prueba; sus datos no entran en el análisis).
// El PIN se verifica en la base (admin_verificar_pin: bcrypt y bloqueo de una hora tras 5 intentos fallidos).
// Si es correcto, la función entra a la cuenta de administrador con su contraseña y devuelve la sesión a la app.
// Secreto de la función (Edge Functions › Secrets): ADMIN_CLAVE, la contraseña de la cuenta de administrador.
// No usa claves privilegiadas de Supabase. «Verify JWT» debe estar apagado (la llama la app sin sesión).

const SUPABASE_URL = "https://aihixquihhpirxmjhumg.supabase.co";
const CLAVE_PUBLICA = "sb_publishable_4rprl49Z0iCw1uuv0Bk6Tw_7-bdMaTb";
const ADMIN_MAIL = "verificacionpulso+admin@gmail.com";
const ORIGENES = ["https://mateomartinello.github.io", "http://localhost:8000", "http://127.0.0.1:8000"];

const cors = (req: Request) => {
  const o = req.headers.get("Origin") ?? "";
  return { "Access-Control-Allow-Origin": ORIGENES.includes(o) ? o : ORIGENES[0], "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type, apikey, authorization, x-client-info", "Vary": "Origin" };
};
const json = (req: Request, d: unknown, status = 200) =>
  new Response(JSON.stringify(d), { status, headers: { ...cors(req), "Content-Type": "application/json" } });

Deno.serve(async req => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors(req) });
  if (req.method !== "POST") return json(req, { error: "metodo" }, 405);
  const clave = Deno.env.get("ADMIN_CLAVE");
  if (!clave) return json(req, { error: "falta el secreto ADMIN_CLAVE" }, 500);
  let pin = "";
  try { pin = String((await req.json()).pin ?? ""); } catch (_) { /* cuerpo inválido */ }
  if (!/^\d{4}$/.test(pin)) return json(req, { error: "mal" }, 401);
  const h = { apikey: CLAVE_PUBLICA, Authorization: `Bearer ${CLAVE_PUBLICA}`, "Content-Type": "application/json" };
  const v = await fetch(`${SUPABASE_URL}/rest/v1/rpc/admin_verificar_pin`, { method: "POST", headers: h, body: JSON.stringify({ p_pin: pin }) });
  if (!v.ok) return json(req, { error: "base" }, 502);
  const estado = await v.json();
  if (estado !== "ok") return json(req, { error: estado }, estado === "bloqueado" ? 429 : 401);
  const s = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, { method: "POST",
    headers: { apikey: CLAVE_PUBLICA, "Content-Type": "application/json" }, body: JSON.stringify({ email: ADMIN_MAIL, password: clave }) });
  if (!s.ok) return json(req, { error: "cuenta" }, 502);
  return json(req, await s.json());
});
