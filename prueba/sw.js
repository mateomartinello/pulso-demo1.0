// ==== SERVICE WORKER: abrir sin conexión y recibir los recordatorios ====
// build.py pone una marca de versión nueva en CACHE en cada armado, así el navegador detecta la versión nueva.
const CACHE = "pulso-9a6693216e";
const BASE = ["./", "./manifest.webmanifest", "./iconos/icon-192.png", "./iconos/apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Primero la red (para no quedar con una versión vieja); si no hay conexión, lo guardado.
// «no-cache»: revalida con el servidor aunque el navegador tenga una copia (GitHub Pages la guarda hasta 10 minutos).
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  // (en las navegaciones, una redirección seguida acá Safari no la acepta: se devuelve como redirección)
  const red = r.mode === "navigate"
    ? fetch(r.url, {cache: "no-cache", credentials: "same-origin"}).then(res => res.redirected ? Response.redirect(res.url, 302) : res)
    : fetch(r, {cache: "no-cache"});
  e.respondWith(red.then(res => {
    if (res.ok) { const copia = res.clone(); caches.open(CACHE).then(c => c.put(r, copia)); }
    return res;
  }).catch(() => caches.match(r, {ignoreSearch: r.mode === "navigate"}).then(m => m || (r.mode === "navigate" ? caches.match("./") : Response.error()))));
});

self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = {body: e.data ? e.data.text() : ""}; }
  e.waitUntil(self.registration.showNotification(d.title || "Pulso", {
    body: d.body || "", icon: "iconos/icon-192.png", badge: "iconos/icon-192.png",
    tag: d.tag || "pulso", data: {url: d.url || "./"}
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = new URL(e.notification.data?.url || "./", self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type: "window", includeUncontrolled: true}).then(ws => {
    for (const w of ws) { if (w.url.startsWith(self.registration.scope)) return (w.navigate ? w.navigate(url) : Promise.resolve(w)).then(x => (x || w).focus()); }
    return self.clients.openWindow(url);
  }));
});
