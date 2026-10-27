// ==== APP INSTALABLE (agregar a inicio) ====
// Como append(), pero sin agregar los hijos vacíos (null o false), que append() mostraría como texto.
const agregar=(nodo,...hijos)=>nodo.append(...hijos.filter(h=>h!=null && h!==false));
const UA = navigator.userAgent;
const ES_IOS = /iPad|iPhone|iPod/.test(UA) || (navigator.platform==="MacIntel" && navigator.maxTouchPoints>1);
const ES_ANDROID = /Android/i.test(UA);
const ES_IOS_OTRO = ES_IOS && /CriOS|FxiOS|EdgiOS|OPiOS/.test(UA);
const EN_OTRA_APP = /FBAN|FBAV|FB_IAB|Instagram|WhatsApp|Line\/|Twitter|TikTok|musical_ly|Snapchat|; wv\)/i.test(UA);
const EN_INICIO = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone===true;
const IOS_VER = (UA.match(/OS (\d+)_(\d+)/)||[]).slice(1).map(Number);
const IOS_VIEJO = ES_IOS && IOS_VER.length===2 && (IOS_VER[0]<16 || (IOS_VER[0]===16 && IOS_VER[1]<4));
function necesitaInstalar(){ return !EN_INICIO() && (ES_IOS || ES_ANDROID); }

let BIP = null; // aviso de instalación de Chrome en Android
window.addEventListener("beforeinstallprompt", e=>{ e.preventDefault(); BIP=e; if(ONB.paso==="instalar") renderOnb(); });
window.addEventListener("appinstalled", ()=>{ BIP=null; ONB.instalada=true; if(ONB.paso==="instalar") renderOnb(); });
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(()=>{});

function renderInstalar(box){
  const seguir = txt => el("button",{class:"btn link",type:"button",onclick:trasInstalar}, txt);
  const card = el("div",{class:"onb-card"}, el("div",{class:"eyebrow"},"Antes de empezar"), el("h2",{},"Agregá Pulso a tu pantalla de inicio"));
  const pasos = list => el("ol",{class:"pasos-inst"}, list.map(t=>el("li",{},t)));
  if(EN_OTRA_APP){
    const msg=el("p",{class:"note",role:"status"});
    agregar(card, el("p",{},"Estás viendo Pulso dentro de otra app (por ejemplo, WhatsApp o Instagram). Desde ahí no se puede agregar a la pantalla de inicio."),
      pasos([ES_IOS? "Tocá el menú de la app (⋯) y elegí «Abrir en Safari» o «Abrir en el navegador»." : "Tocá el menú de la app (⋮) y elegí «Abrir en Chrome» o «Abrir en el navegador».",
        "Ahí vas a ver de nuevo esta pantalla, con los pasos para agregarla."]),
      el("button",{class:"btn",type:"button",onclick:async()=>{ try{ await navigator.clipboard.writeText(location.origin+location.pathname); msg.textContent="Enlace copiado: pegalo en "+(ES_IOS?"Safari.":"Chrome."); }catch(e){ msg.textContent="No se pudo copiar. La dirección es "+location.origin+location.pathname; } }},"Copiar el enlace"),
      msg, seguir("Seguir acá igual"));
  } else if(ES_IOS){
    agregar(card, el("p",{},"Así se abre como una app, a pantalla completa, y puede avisarte a la hora de cada comida."),
      el("p",{class:"aviso-inst"},"Hacelo ahora, antes de responder las preguntas: en iPhone, lo que completes en el navegador no pasa a la app de la pantalla de inicio."),
      pasos([ES_IOS_OTRO? "Tocá el botón Compartir (el cuadrado con una flecha hacia arriba), arriba a la derecha, junto a la barra de direcciones."
                        : "Tocá el botón Compartir (el cuadrado con una flecha hacia arriba). Si no lo ves, tocá primero «⋯», abajo a la derecha.",
        "Bajá y tocá «Agregar a inicio». Si no aparece, tocá «Ver más».",
        "Si aparece la opción «Abrir como app web», dejala activada. Tocá «Agregar».",
        "Cerrá el navegador y abrí Pulso desde el ícono nuevo en tu pantalla de inicio."]),
      IOS_VIEJO? el("p",{class:"note"},`Tu iPhone tiene iOS ${IOS_VER.join(".")}. Los recordatorios necesitan iOS 16.4 o posterior (Configuración › General › Actualización de software). Igual podés agregar Pulso a inicio.`) : null,
      seguir("Seguir en el navegador, sin recordatorios"));
  } else {
    agregar(card, el("p",{},"Así se abre como una app, a pantalla completa, y la encontrás junto a tus otras apps."));
    if(ONB.instalada) agregar(card, el("p",{class:"aviso-inst"},"Listo: Pulso quedó en tu pantalla de inicio. Podés abrirla desde ahí o seguir acá; es la misma app y tus datos son los mismos."),
      el("button",{class:"btn primary big",type:"button",onclick:trasInstalar},"Seguir"));
    else if(BIP) agregar(card, el("button",{class:"btn primary big",type:"button",onclick:async()=>{ const b=BIP; b.prompt(); const r=await b.userChoice; BIP=null; if(r.outcome==="accepted") ONB.instalada=true; renderOnb(); }},"Instalar Pulso"),
      seguir("Seguir en el navegador"));
    else agregar(card, pasos(["Tocá el menú ⋮, arriba a la derecha.","Elegí «Instalar app» o «Agregar a la pantalla principal».","Confirmá con «Instalar» o «Agregar»."]),
      el("p",{class:"note"},"En Android, los recordatorios también funcionan desde el navegador."), seguir("Seguir en el navegador"));
  }
  box.append(card);
}

// ==== RECORDATORIOS DE COMIDAS (Web Push) ====
// Independientes de «compartir datos»: usan un código propio (DB.avisos.id), distinto de DB.anonId.
const TXT_DATOS_AVISOS = "Para enviarlos guardamos en nuestro servidor la dirección de notificaciones de este dispositivo, los horarios de tus comidas y qué comidas ya registraste (no qué comiste), con un código aparte de los datos anónimos. Podés desactivarlos cuando quieras desde Perfil.";
const TXT_BLOQUEADO = "Las notificaciones de Pulso están bloqueadas en este dispositivo. Para activarlas: en iPhone, Configuración › Notificaciones › Pulso; en Android, si la instalaste, mantené apretado el ícono de Pulso › Información de la app › Notificaciones, y si la usás en Chrome, tocá el ícono junto a la dirección › Permisos › Notificaciones.";
const AVISOS_OK = () => !!(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY && CONFIG.VAPID_PUBLICA) && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
function estadoAvisos(){
  if(DB.avisos?.on) return "on";
  if(ES_IOS && !EN_INICIO()) return IOS_VIEJO? "viejo" : "instalar";
  if(!AVISOS_OK()) return "no";
  return Notification.permission==="denied" ? "bloqueado" : "off";
}
function b64u(s){ s=s.replace(/-/g,"+").replace(/_/g,"/"); return Uint8Array.from(atob(s+"===".slice((s.length+3)%4)), c=>c.charCodeAt(0)); }
async function rpc(fn, body){
  const res=await fetch(CONFIG.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/rpc/"+fn,{method:"POST",
    headers:{"apikey":CONFIG.SUPABASE_ANON_KEY,"Authorization":"Bearer "+CONFIG.SUPABASE_ANON_KEY,"Content-Type":"application/json"}, body:JSON.stringify(body)});
  if(!res.ok) throw new Error(fn+" "+res.status);
  return res.json();
}
function horariosAvisos(){ const P=PLAN||calcPlan(DB.perfil); return Object.fromEntries(ESTRUCTURAS[P.est].slots.map(([k])=>[k, P.horas[k].padStart(5,"0")])); }
function zonaAvisos(){ try{ return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Argentina/Buenos_Aires"; }catch(e){ return "America/Argentina/Buenos_Aires"; } }
function listaHorarios(){ const P=PLAN||calcPlan(DB.perfil); const xs=ESTRUCTURAS[P.est].slots.map(([k])=>`${SLOTDEF[k].n.toLowerCase()} (${P.horas[k]} h)`); return xs.length>1? xs.slice(0,-1).join(", ")+" y "+xs[xs.length-1] : xs[0]; }

async function guardarSuscripcion(sub){
  const j=sub.toJSON(), horarios=horariosAvisos(), zona=zonaAvisos();
  const ok=await rpc("guardar_suscripcion",{p_id:DB.avisos.id, p_secret:DB.avisos.secret, p_endpoint:j.endpoint, p_p256dh:j.keys.p256dh, p_auth:j.keys.auth, p_horarios:horarios, p_zona:zona});
  if(!ok) throw new Error("rechazada");
  DB.avisos.firma=JSON.stringify([j.endpoint,horarios,zona]); persist();
}
async function suscripcionPush(){
  const reg=await navigator.serviceWorker.ready; let sub=await reg.pushManager.getSubscription();
  if(sub && DB.avisos?.vapid && DB.avisos.vapid!==CONFIG.VAPID_PUBLICA){ await sub.unsubscribe(); sub=null; }
  return sub || reg.pushManager.subscribe({userVisibleOnly:true, applicationServerKey:b64u(CONFIG.VAPID_PUBLICA)});
}
// Devuelve null si se activaron; si no, el mensaje para mostrar. El permiso se pide primero, dentro del toque (lo exige iPhone).
async function activarAvisos(){
  if(!AVISOS_OK()) return "Este navegador no permite notificaciones.";
  let perm; try{ perm=await Notification.requestPermission(); }catch(e){ perm="default"; }
  if(perm!=="granted") return perm==="denied"? TXT_BLOQUEADO : "No se activaron los recordatorios.";
  try{
    const sub=await suscripcionPush();
    DB.avisos={cola:[], ...(DB.avisos||{}), id:DB.avisos?.id||uid(), secret:DB.avisos?.secret||uid()+uid(), on:true, vapid:CONFIG.VAPID_PUBLICA}; persist();
    await guardarSuscripcion(sub);
    for(const c of day().comidas) marcarAviso(S.today, c.slot, true);
    return null;
  }catch(e){ if(DB.avisos){ DB.avisos.on=false; persist(); } return "No se pudieron activar los recordatorios. Revisá la conexión y probá de nuevo."; }
}
async function desactivarAvisos(){
  try{ const sub=await (await navigator.serviceWorker.ready).pushManager.getSubscription(); if(sub) await sub.unsubscribe(); }catch(e){}
  if(DB.avisos?.id){ try{ await rpc("borrar_suscripcion",{p_id:DB.avisos.id, p_secret:DB.avisos.secret}); }catch(e){} }
  DB.avisos={...(DB.avisos||{}), on:false, firma:null, cola:[]}; persist();
}
// Al abrir la app: si cambió la suscripción, los horarios o la zona horaria, se actualizan en el servidor.
async function sincronizarAvisos(){
  if(!DB.avisos?.on || !AVISOS_OK() || !DB.perfil?.completo) return;
  if(Notification.permission==="denied"){ await desactivarAvisos(); return; }
  try{ const sub=await suscripcionPush(); const j=sub.toJSON();
    if(JSON.stringify([j.endpoint,horariosAvisos(),zonaAvisos()])!==DB.avisos.firma) await guardarSuscripcion(sub); }catch(e){}
  enviarMarcas();
}
// «Esta comida ya está registrada»: solo la fecha y el momento del día, sin el contenido.
function marcarAviso(fecha, momento, hecho){
  if(!DB.avisos?.on) return;
  DB.avisos.cola=(DB.avisos.cola||[]).filter(m=>!(m.f===fecha && m.m===momento)); DB.avisos.cola.push({f:fecha, m:momento, h:hecho}); persist(); enviarMarcas();
}
let marcando=false;
async function enviarMarcas(){
  if(marcando || !DB.avisos?.on || !DB.avisos.cola?.length || !navigator.onLine) return;
  marcando=true;
  try{ while(DB.avisos.cola.length){ const x=DB.avisos.cola[0];
    await rpc("marcar_comida",{p_id:DB.avisos.id, p_secret:DB.avisos.secret, p_fecha:x.f, p_momento:x.m, p_hecho:x.h});
    DB.avisos.cola.shift(); persist(); } }catch(e){}
  marcando=false;
}
window.addEventListener("online", ()=>enviarMarcas());

function renderOfertaAvisos(box){
  DB.avisoOfrecido=true; persist();
  const msg=el("p",{class:"note",role:"status"});
  const salir=()=>{ ONB.paso=null; render(); window.scrollTo(0,0); };
  box.append(el("div",{class:"onb-card"}, el("div",{class:"eyebrow"},"Recordatorios"), el("h2",{},"¿Te avisamos a la hora de cada comida?"),
    el("p",{},`Te llega un aviso a la hora de tu ${listaHorarios()}. Si ya registraste esa comida, no te llega.`),
    el("p",{class:"note"},TXT_DATOS_AVISOS),
    el("button",{class:"btn primary big",type:"button",onclick:async ev=>{ const b=ev.currentTarget; b.disabled=true; msg.textContent="Activando…"; const err=await activarAvisos(); if(err){ msg.textContent=err; b.disabled=false; } else salir(); }},"Activar recordatorios"),
    msg, el("button",{class:"btn link",type:"button",onclick:salir},"Ahora no")));
}
function seccionAvisos(){
  const st=estadoAvisos(), msg=el("p",{class:"note",style:"margin:8px 0 0",role:"status"});
  const card=el("section",{class:"card"}, el("h3",{},"Recordatorios de comidas"));
  if(st==="on") agregar(card, el("p",{style:"margin:0 0 8px"},`Activos en este dispositivo: ${listaHorarios()}. Si ya registraste esa comida, no te llega el aviso.`),
    el("div",{class:"row"},
      el("button",{class:"btn small",type:"button",onclick:async()=>{ msg.textContent="Pidiendo el aviso…"; try{ await rpc("pedir_aviso_prueba",{p_id:DB.avisos.id, p_secret:DB.avisos.secret}); msg.textContent="Te va a llegar un aviso de prueba en menos de un minuto."; }catch(e){ msg.textContent="No se pudo pedir el aviso. Revisá la conexión y probá de nuevo."; } }},"Enviar un aviso de prueba"),
      el("button",{class:"btn small ghost",type:"button",onclick:async()=>{ msg.textContent="Desactivando…"; await desactivarAvisos(); render(); }},"Desactivar")));
  else if(st==="off") agregar(card, el("p",{style:"margin:0 0 8px"},`Te avisamos a la hora de tu ${listaHorarios()}. Si ya registraste esa comida, no te llega el aviso.`),
    el("p",{class:"note",style:"margin:0 0 8px"},TXT_DATOS_AVISOS),
    el("button",{class:"btn small primary",type:"button",onclick:async ev=>{ ev.currentTarget.disabled=true; msg.textContent="Activando…"; const err=await activarAvisos(); if(err) msg.textContent=err; else render(); }},"Activar recordatorios"));
  else if(st==="instalar") agregar(card, el("p",{style:"margin:0"},"En iPhone, los recordatorios funcionan con Pulso agregada a la pantalla de inicio: tocá Compartir y después «Agregar a inicio». Antes, tocá «Descargar copia» (más abajo): la app de inicio guarda sus datos aparte del navegador y con «Restaurar copia» los pasás."));
  else if(st==="viejo") agregar(card, el("p",{style:"margin:0"},`Los recordatorios necesitan iOS 16.4 o posterior, y este iPhone tiene iOS ${IOS_VER.join(".")}.`));
  else if(st==="bloqueado") agregar(card, el("p",{style:"margin:0"},TXT_BLOQUEADO));
  else agregar(card, el("p",{style:"margin:0"},"Este navegador no permite notificaciones."));
  agregar(card, msg); return card;
}
