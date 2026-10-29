// ==== CONFIGURACIÓN ====
// Para activar la base común: pegá acá la URL del proyecto de Supabase y su clave pública ("publishable key", sb_publishable_…).
// Con los dos vacíos, la app funciona igual y no envía nada. Nunca pegues acá una clave secreta (sb_secret_… o service_role).
const CONFIG = {
  SUPABASE_URL: "https://aihixquihhpirxmjhumg.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_4rprl49Z0iCw1uuv0Bk6Tw_7-bdMaTb",
  // Recordatorios (Web Push): clave pública VAPID. La privada vive solo en los secretos de la función de Supabase.
  VAPID_PUBLICA: "BPbi0hFzII-GcGYVX2Y_ulYxwdQc9rpX-vS5ejgFcRfzqGNYFvNvC_zX2cBmvJ9jSuYVHAFvCbnUs60_1TXyYZA",
  APP_VERSION: "0.7.0",
  DEMO: "demo 1.0",   // versión de la demo: la pantalla de inicio dice «Bienvenido a la demo 1.0»
  CONTACTO: "verificacionpulso@gmail.com",
  // Apple Salud por el atajo «Pulso Salud»: apagado hasta que el atajo funcione en el iPhone (en la prueba del 28/10/2026 daba «No samples found»).
  SALUD: false,
  // Atajo «Pulso Salud» (Apple Salud → Pulso): enlace de iCloud; mientras tanto, el archivo firmado del repositorio.
  ATAJO_SALUD: "https://mateomartinello.github.io/pulso-demo1.0/atajo/Pulso%20Salud.shortcut",
};
