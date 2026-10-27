// Pulso · envío de los recordatorios de comidas (Web Push). La llama cada minuto una tarea programada (pg_cron).
// No usa claves privilegiadas de Supabase: pide los avisos vencidos con la clave pública y AVISOS_CLAVE.
// Secretos de la función (Edge Functions › Secrets): VAPID_PRIVADA y AVISOS_CLAVE.
// Cifrado: RFC 8291 (aes128gcm) y firma VAPID (RFC 8292), con WebCrypto, sin librerías externas.

const SUPABASE_URL = "https://aihixquihhpirxmjhumg.supabase.co";
const CLAVE_PUBLICA = "sb_publishable_4rprl49Z0iCw1uuv0Bk6Tw_7-bdMaTb";
const VAPID_PUBLICA = "BPbi0hFzII-GcGYVX2Y_ulYxwdQc9rpX-vS5ejgFcRfzqGNYFvNvC_zX2cBmvJ9jSuYVHAFvCbnUs60_1TXyYZA";
const VAPID_SUJETO = "https://mateomartinello.github.io/pulso/";

// Textos neutros, sin calorías ni números (sirven también en modo cuidado).
const TEXTOS: Record<string, [string, string]> = {
  des: ["Hora del desayuno", "¿Qué vas a desayunar? Tenés una sugerencia en Pulso."],
  col: ["Hora de la colación", "Si tenés hambre, mirá la sugerencia de colación en Pulso."],
  alm: ["Hora del almuerzo", "¿Qué vas a almorzar? Tenés una sugerencia en Pulso."],
  mer: ["Hora de la merienda", "¿Qué vas a merendar? Tenés una sugerencia en Pulso."],
  cen: ["Hora de la cena", "¿Qué vas a cenar? Tenés una sugerencia en Pulso."],
  prueba: ["Pulso", "Aviso de prueba: los recordatorios funcionan en este dispositivo."],
};

type Aviso = { sub_id: string; endpoint: string; p256dh: string; auth: string; momento: string };

const enc = new TextEncoder();
const b64u = (b: Uint8Array) => btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const deB64u = (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4)), c => c.charCodeAt(0));
const unir = (...ps: Uint8Array[]) => { const o = new Uint8Array(ps.reduce((n, p) => n + p.length, 0)); let i = 0; for (const p of ps) { o.set(p, i); i += p.length; } return o; };
const json = (d: unknown, status = 200) => new Response(JSON.stringify(d), { status, headers: { "Content-Type": "application/json" } });

async function hkdf(sal: Uint8Array, ikm: Uint8Array, info: Uint8Array, bytes: number) {
  const k = await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt: sal, info }, k, bytes * 8));
}

let claveVapid: CryptoKey | null = null;
async function firmarVapid(aud: string) {
  if (!claveVapid) {
    const pub = deB64u(VAPID_PUBLICA);
    claveVapid = await crypto.subtle.importKey("jwk",
      { kty: "EC", crv: "P-256", d: Deno.env.get("VAPID_PRIVADA")!, x: b64u(pub.slice(1, 33)), y: b64u(pub.slice(33, 65)), ext: true },
      { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  }
  const cab = b64u(enc.encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const cuerpo = b64u(enc.encode(JSON.stringify({ aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: VAPID_SUJETO })));
  const firma = new Uint8Array(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, claveVapid, enc.encode(cab + "." + cuerpo)));
  return cab + "." + cuerpo + "." + b64u(firma);
}

async function cifrar(p256dh: string, auth: string, texto: string) {
  const uaPub = deB64u(p256dh), secreto = deB64u(auth);
  const efimera = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]) as CryptoKeyPair;
  const asPub = new Uint8Array(await crypto.subtle.exportKey("raw", efimera.publicKey));
  const uaKey = await crypto.subtle.importKey("raw", uaPub, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const ecdh = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: uaKey }, efimera.privateKey, 256));
  const ikm = await hkdf(secreto, ecdh, unir(enc.encode("WebPush: info\0"), uaPub, asPub), 32);
  const sal = crypto.getRandomValues(new Uint8Array(16));
  const cek = await hkdf(sal, ikm, enc.encode("Content-Encoding: aes128gcm\0"), 16);
  const nonce = await hkdf(sal, ikm, enc.encode("Content-Encoding: nonce\0"), 12);
  const k = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["encrypt"]);
  const cifrado = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, k, unir(enc.encode(texto), new Uint8Array([2]))));
  return unir(sal, new Uint8Array([0, 0, 16, 0]), new Uint8Array([asPub.length]), asPub, cifrado); // registro de 4096 bytes
}

async function enviar(a: Aviso) {
  const [title, body] = TEXTOS[a.momento] ?? TEXTOS.prueba;
  const datos = JSON.stringify({ title, body, tag: "pulso-" + a.momento, url: a.momento === "prueba" ? "./" : "./?momento=" + a.momento });
  const jwt = await firmarVapid(new URL(a.endpoint).origin);
  return fetch(a.endpoint, {
    method: "POST",
    headers: { "Content-Encoding": "aes128gcm", "Content-Type": "application/octet-stream", "TTL": "1800", "Urgency": "high",
      "Authorization": `vapid t=${jwt}, k=${VAPID_PUBLICA}` },
    body: await cifrar(a.p256dh, a.auth, datos),
  });
}

async function rpc(fn: string, body: unknown) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, { method: "POST",
    headers: { apikey: CLAVE_PUBLICA, Authorization: `Bearer ${CLAVE_PUBLICA}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`${fn}: ${r.status}`);
  return r.json();
}

Deno.serve(async () => {
  const clave = Deno.env.get("AVISOS_CLAVE");
  if (!clave || !Deno.env.get("VAPID_PRIVADA")) return json({ error: "faltan los secretos AVISOS_CLAVE o VAPID_PRIVADA" }, 500);
  try {
    const lista: Aviso[] = await rpc("avisos_a_enviar", { p_clave: clave });
    let enviados = 0; const vencidas: string[] = []; const errores: string[] = [];
    await Promise.all(lista.map(async a => {
      try {
        const res = await enviar(a);
        if (res.status === 404 || res.status === 410) vencidas.push(a.sub_id);
        else if (res.ok) enviados++;
        else errores.push(`${new URL(a.endpoint).host} ${res.status} ${(await res.text()).slice(0, 120)}`);
      } catch (e) { errores.push(String(e)); }
    }));
    if (vencidas.length) await rpc("quitar_suscripciones", { p_clave: clave, p_ids: vencidas });
    return json({ total: lista.length, enviados, vencidas: vencidas.length, errores });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
