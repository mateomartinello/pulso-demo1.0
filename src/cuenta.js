// ==== CUENTA: ingreso con código por mail (Supabase Auth) y respaldo de los datos ====
// La persona entra con su mail y un código de 6 dígitos (Supabase Auth › Email › Email OTP length) (no con un enlace: en iPhone, el enlace se abriría en Safari
// y no en la app de la pantalla de inicio). La tabla «usuarios» guarda una copia de sus respuestas y registros.
const AUTH_URL = () => CONFIG.SUPABASE_URL.replace(/\/$/,"")+"/auth/v1";
async function authPost(ruta, body, token){
  const res=await fetch(AUTH_URL()+ruta,{method:"POST",
    headers:{"apikey":CONFIG.SUPABASE_ANON_KEY,"Content-Type":"application/json",...(token?{"Authorization":"Bearer "+token}:{})}, body:JSON.stringify(body||{})});
  let j=null; try{ j=await res.json(); }catch(e){}
  return {ok:res.ok, status:res.status, j};
}
function guardarSesion(j){
  DB.auth={access_token:j.access_token, refresh_token:j.refresh_token, expira:Date.now()+(j.expires_in||3600)*1000,
    user:{id:j.user?.id||DB.auth?.user?.id, email:(j.user?.email||DB.auth?.user?.email||"").toLowerCase()}};
  persist();
}
let renovando=null;
async function tokenVigente(){
  if(!DB.auth) return null;
  if(Date.now() < DB.auth.expira-60000) return DB.auth.access_token;
  if(!renovando) renovando=(async()=>{
    try{ const r=await authPost("/token?grant_type=refresh_token",{refresh_token:DB.auth.refresh_token});
      if(r.ok){ guardarSesion(r.j); return DB.auth.access_token; }
      if(r.status>=400 && r.status<500){ DB.auth=null; persist(); render(); }   // sesión vencida: vuelve a pedir el mail; los datos del dispositivo quedan
      return null;
    }catch(e){ return null; } finally{ renovando=null; } })();
  return renovando;
}
async function rpcCuenta(fn, body, keepalive){
  const tk=await tokenVigente(); if(!tk) throw new Error("sin sesión");
  const res=await fetch(CONFIG.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/rpc/"+fn,{method:"POST", keepalive:!!keepalive,
    headers:{"apikey":CONFIG.SUPABASE_ANON_KEY,"Authorization":"Bearer "+tk,"Content-Type":"application/json"}, body:JSON.stringify(body||{})});
  if(!res.ok) throw new Error(fn+" "+res.status);
  return res.json();
}

// ---- Respaldo: copia del perfil y los registros en la cuenta (se sube sola, unos segundos después de cada cambio) ----
let respaldoT=null;
function respaldoPronto(ya){ clearTimeout(respaldoT); respaldoT=setTimeout(()=>subirRespaldo(), ya?0:4000); }
async function subirRespaldo(keepalive){
  if(!DB.auth || !DB.perfil?.completo || !DB.consent?.acepta || !navigator.onLine) return;
  const resp={perfil:DB.perfil, dias:DB.dias, consent:DB.consent, secret:DB.secret, marcas:DB.marcas||{}};
  const firma=String(hash(JSON.stringify(resp))); if(firma===DB.respaldoFirma) return;
  const d=DB.perfil.resp.datos||{};
  try{ if(await rpcCuenta("guardar_usuario",{p_nombre:d.nombre||null, p_apellido:d.apellido||null, p_anon_id:DB.anonId, p_respaldo:resp}, keepalive)){ DB.respaldoFirma=firma; persist(); } }catch(e){}
}
document.addEventListener("visibilitychange",()=>{ if(document.hidden) subirRespaldo(true); });
// Junta los registros de dos copias (por ejemplo, la de la cuenta y la de un dispositivo que ya tenía datos).
function unirDias(a,b){
  const out=JSON.parse(JSON.stringify(a||{}));
  for(const [k,d] of Object.entries(b||{})){ const o=out[k]||(out[k]={comidas:[],ejercicio:[],sueno:null});
    for(const f of ["comidas","ejercicio"]){ const ids=new Set((o[f]||[]).map(x=>x.id)); o[f]=(o[f]||[]).concat((d[f]||[]).filter(x=>!ids.has(x.id))); }
    if(!o.sueno && d.sueno) o.sueno=d.sueno; }
  return out;
}
async function alIngresar(j, op={}){
  guardarSesion(j);
  let u=null; try{ u=await rpcCuenta("mi_usuario"); }catch(e){}
  DB.admin = !!(op.admin || u?.admin);
  const r=u?.respaldo||{};
  if(r.perfil?.completo){
    const mismaCuenta = DB.cuentaId===DB.auth.user.id && DB.perfil?.completo;
    if(!mismaCuenta){ DB.perfil=r.perfil; if(r.consent) DB.consent=r.consent; }
    DB.dias=unirDias(r.dias, DB.dias);
    if(u.anon_id) DB.anonId=u.anon_id;
    if(r.secret){ DB.secret=r.secret; secretHash=null; }
    if(r.marcas) DB.marcas={...r.marcas, ...(DB.marcas||{})};
  }
  // Nombre y apellido: los de la cuenta si ya los tenía; si no, los que escribió al ingresar. El mail es siempre el de la cuenta.
  const escritos={nombre:INGRESO.nombre, apellido:INGRESO.apellido};
  const datosDe = d => ({nombre:d?.nombre||escritos.nombre, apellido:d?.apellido||escritos.apellido, email:DB.auth.user.email});
  DB.cuentaId=DB.auth.user.id; DB.respaldoFirma=null;
  ONB.draft=null; INGRESO.paso="mail"; INGRESO.msg="";
  if(DB.perfil?.completo){ DB.perfil.resp.datos=datosDe(DB.perfil.resp.datos); ONB.paso=null; ONB.i=PREGUNTAS.length; }
  else { ONB.draft={datos:datosDe(null)}; ONB.paso="bienvenida"; ONB.i=-1; }
  persist(); render(); window.scrollTo(0,0); respaldoPronto(true);
}
// Ingreso por enlace: mientras el mail de Supabase traiga un enlace en lugar del código (hasta configurar un servidor
// de envío propio), el enlace vuelve a la app con la sesión en la dirección (#access_token=…).
async function ingresoPorEnlace(){
  if(!/(access_token|error_code)=/.test(location.hash)) return;
  const p=new URLSearchParams(location.hash.slice(1)); history.replaceState(null,"",location.pathname);
  if(p.get("error_code")){ INGRESO.paso="mail"; INGRESO.msg="El enlace venció o ya se usó. Pedí uno nuevo."; ONB.paso="ingreso"; render(); return; }
  try{ const at=p.get("access_token");
    const res=await fetch(AUTH_URL()+"/user",{headers:{"apikey":CONFIG.SUPABASE_ANON_KEY,"Authorization":"Bearer "+at}});
    if(!res.ok) throw 0;
    await Promise.all([cargando(3000,"Entrando a tu cuenta…"), alIngresar({access_token:at, refresh_token:p.get("refresh_token"), expires_in:+p.get("expires_in")||3600, user:await res.json()})]); cerrarCarga();
  }catch(e){ INGRESO.paso="mail"; INGRESO.msg="No se pudo entrar con ese enlace. Pedí uno nuevo."; ONB.paso="ingreso"; render(); }
}
// Pantalla intermedia: después de confirmar el código, antes del cuestionario.
function renderBienvenida(box){
  const nombre=ONB.draft?.datos?.nombre;
  box.append(el("div",{class:"onb-card"}, el("div",{class:"eyebrow"},"Tu cuenta"),
    el("h2",{},`¡Perfecto${nombre? ", "+nombre : ""}! Ya entraste a tu cuenta.`),
    el("p",{},"Ahora, unas preguntas rápidas para armar tu plan: casi todas se responden con un toque."),
    el("button",{class:"btn primary big",type:"button",onclick:()=>{ ONB.paso=null; ONB.i=0; renderOnb(); window.scrollTo(0,0); }},"Empezar el cuestionario")));
}

// ---- Ingreso de administrador: PIN de 4 dígitos verificado en Supabase (función «ingreso-admin»). Cuenta de prueba fuera del análisis. ----
function irAdmin(desde){ ONB.adminDesde=desde; ONB.paso="admin"; renderOnb(); window.scrollTo(0,0); }
function renderAdmin(box){
  const msg=el("p",{class:"note",role:"status"});
  const inp=el("input",{type:"password",id:"admin-pin",name:"pin",inputmode:"numeric",autocomplete:"off",maxlength:"4",placeholder:"••••"});
  const btn=el("button",{class:"btn primary big",type:"submit"},"Entrar");
  const entrar=async()=>{ const pin=inp.value.replace(/\D/g,"");
    if(pin.length!==4){ msg.textContent="La clave tiene 4 dígitos."; inp.focus(); return; }
    btn.disabled=true; msg.textContent=""; const espera=cargando(3000,"Entrando como administrador…");
    try{ const res=await fetch(CONFIG.SUPABASE_URL.replace(/\/$/,"")+"/functions/v1/ingreso-admin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pin})});
      const j=await res.json().catch(()=>({}));
      if(res.ok && j.access_token){ Object.assign(INGRESO,{nombre:"Administrador", apellido:"Pulso"}); await Promise.all([espera, alIngresar(j,{admin:true})]); cerrarCarga(); return; }
      msg.textContent = j.error==="bloqueado"? "Demasiados intentos fallidos. El ingreso de administrador queda bloqueado durante una hora." : j.error==="mal"? "La clave no es correcta." : "No se pudo entrar ahora. Probá de nuevo en un rato.";
    }catch(e){ msg.textContent="Sin conexión. Revisá internet y probá de nuevo."; }
    cerrarCarga(); btn.disabled=false; inp.value=""; inp.focus(); };
  box.append(el("div",{class:"onb-card"}, volver(()=>{ ONB.paso=ONB.adminDesde||null; renderOnb(); window.scrollTo(0,0); }),
    el("div",{class:"eyebrow"},"Administrador"), el("h2",{},"Ingreso de administrador"),
    el("p",{},"Escribí la clave de 4 dígitos. Lo que registres como administrador no cuenta en los datos generales de Pulso."),
    el("form",{class:"campos",novalidate:true,onsubmit:ev=>{ ev.preventDefault(); entrar(); }}, el("label",{class:"campo",for:"admin-pin"}, el("span",{},"Clave"), inp), btn), msg));
  setTimeout(()=>inp.focus(),50);
}
// «Empezar de cero» (solo administrador): borra perfil y registros, en el dispositivo y en la copia de la cuenta.
async function adminEmpezarDeCero(){
  DB.perfil=null; DB.dias={}; DB.consent=null; DB.respaldoFirma=null; DB.avisoOfrecido=false; persist();
  try{ await rpcCuenta("guardar_usuario",{p_nombre:"Administrador", p_apellido:"Pulso", p_anon_id:DB.anonId, p_respaldo:{}}); }catch(e){}
  ONB.draft={datos:{nombre:"Administrador", apellido:"Pulso", email:DB.auth?.user?.email}}; ONB.i=0; ONB.paso=null; S.view="hoy"; S.confirmarCierre=false; render(); window.scrollTo(0,0);
}

// ---- Pantalla de ingreso ----
const INGRESO={paso:"mail", email:"", msg:"", enviadoEn:0};
async function pedirCodigo(email){
  try{ const r=await authPost("/otp?redirect_to="+encodeURIComponent(location.origin+location.pathname),{email, create_user:true});
    if(r.ok) return {ok:true};
    if(r.status===429) return {ok:false, msg:"Se pidieron demasiados códigos. Esperá unos minutos y probá de nuevo."};
    return {ok:false, msg:"No pudimos enviar el código. Revisá el mail y probá de nuevo."};
  }catch(e){ return {ok:false, msg:"Sin conexión. Revisá internet y probá de nuevo."}; }
}
function renderIngreso(box){
  const msg=el("p",{class:"note",role:"status"},INGRESO.msg||"");
  const card=el("div",{class:"onb-card"});
  if(INGRESO.paso==="mail"){
    // Formulario real con name y autocomplete: así el iPhone ofrece autocompletar nombre, apellido y mail.
    const campo=(id,lab,attrs)=>{ const i=el("input",{id,spellcheck:"false",...attrs}); return [i, el("label",{class:"campo",for:id}, el("span",{},lab), i)]; };
    const [nom,lNom]=campo("ing-nombre","Nombre",{type:"text",name:"given-name",autocomplete:"given-name",autocapitalize:"words",value:INGRESO.nombre||""});
    const [ape,lApe]=campo("ing-apellido","Apellido",{type:"text",name:"family-name",autocomplete:"family-name",autocapitalize:"words",value:INGRESO.apellido||""});
    const [inp,lMail]=campo("ing-mail","Mail",{type:"email",name:"email",autocomplete:"email",inputmode:"email",autocapitalize:"off",value:INGRESO.email,placeholder:"tu@mail.com"});
    const btn=el("button",{class:"btn primary big",type:"submit"},"Siguiente");
    const enviarCod=async()=>{ const n=nom.value.trim(), a=ape.value.trim(), e=inp.value.trim().toLowerCase();
      if(!n){ msg.textContent="Escribí tu nombre."; nom.focus(); return; }
      if(!a){ msg.textContent="Escribí tu apellido."; ape.focus(); return; }
      if(!EMAIL_RE.test(e)){ msg.textContent="Revisá el mail: parece incompleto."; inp.focus(); return; }
      btn.disabled=true; msg.textContent="Enviando el código…"; const r=await pedirCodigo(e); btn.disabled=false;
      if(r.ok){ Object.assign(INGRESO,{nombre:n, apellido:a, email:e, paso:"codigo", msg:"", enviadoEn:Date.now()}); renderOnb(); window.scrollTo(0,0); } else msg.textContent=r.msg; };
    agregar(card, barraSup(DB.perfil?.completo? null : ()=>{ INGRESO.msg=""; ONB.paso=null; ONB.i=-1; renderOnb(); window.scrollTo(0,0); }, "ingreso"),
      el("div",{class:"eyebrow"},"Tu cuenta"), el("h2",{},"Tus datos"),
      el("p",{},"Te vamos a mandar un código a tu mail para confirmar que es tuyo. Si ya usaste Pulso, recuperás tus respuestas y tus registros."),
      DB.perfil?.completo && !DB.cuentaId? el("p",{class:"note"},"Ahora Pulso guarda tus datos en tu cuenta. Lo que ya registraste en este dispositivo se suma a ella.") : null,
      el("form",{class:"campos",novalidate:true,onsubmit:ev=>{ ev.preventDefault(); enviarCod(); }}, lNom, lApe, lMail, btn), msg);
  } else {
    const inp=el("input",{type:"text",id:"ing-cod",name:"one-time-code",autocomplete:"one-time-code",inputmode:"numeric",maxlength:"6",placeholder:"123456"});
    const btn=el("button",{class:"btn primary big",type:"submit"},"Confirmar código");
    const entrar=async()=>{ const t=inp.value.replace(/\D/g,"");
      if(t.length<6){ msg.textContent="El código tiene 6 dígitos."; inp.focus(); return; }
      btn.disabled=true; msg.textContent=""; const espera=cargando(3000,"Entrando a tu cuenta…");
      try{ const r=await authPost("/verify",{type:"email", email:INGRESO.email, token:t});
        if(r.ok && r.j?.access_token){ await Promise.all([espera, alIngresar(r.j)]); cerrarCarga(); return; }
        msg.textContent="El código no es correcto o venció. Revisá el último mail que te llegó o pedí uno nuevo.";
      }catch(e){ msg.textContent="Sin conexión. Revisá internet y probá de nuevo."; }
      cerrarCarga(); btn.disabled=false; };
    // «Pegar código»: toma los 6 dígitos de lo copiado (por ejemplo, del asunto del mail) y entra.
    const pegar = navigator.clipboard?.readText ? el("button",{class:"btn",type:"button",onclick:async()=>{
      try{ const t=((await navigator.clipboard.readText()).match(/\b\d{6}\b/)||[])[0];
        if(t){ inp.value=t; entrar(); } else msg.textContent="No encontramos un código de 6 dígitos en lo que copiaste."; }
      catch(e){ msg.textContent="No se pudo pegar. Mantené apretado el campo del código y elegí «Pegar»."; } }},"Pegar código") : null;
    const reenviar=el("button",{class:"btn link",type:"button",onclick:async()=>{
      if(Date.now()-INGRESO.enviadoEn<60000){ msg.textContent="Esperá un minuto antes de pedir otro código."; return; }
      msg.textContent="Enviando…"; const r=await pedirCodigo(INGRESO.email); if(r.ok){ INGRESO.enviadoEn=Date.now(); msg.textContent="Te mandamos un código nuevo."; } else msg.textContent=r.msg; }},"Reenviar el código");
    agregar(card, volver(()=>{ INGRESO.paso="mail"; INGRESO.msg=""; renderOnb(); window.scrollTo(0,0); }),
      el("div",{class:"eyebrow"},"Tu cuenta"), el("h2",{},"Revisá tu mail"),
      el("p",{},`Te mandamos un mail a ${INGRESO.email} con un código de 6 dígitos (también está en el asunto). Buscalo (si no está, revisá la carpeta de spam) y escribí el código acá.`),
      el("form",{class:"campos",novalidate:true,onsubmit:ev=>{ ev.preventDefault(); entrar(); }},
        el("label",{class:"campo",for:"ing-cod"}, el("span",{},"Código"), inp), btn, pegar), msg,
      el("div",{class:"row"}, reenviar));
  }
  box.append(card);
  setTimeout(()=>box.querySelector("input")?.focus(), 50);
}

// ---- Pantalla de carga: un círculo que se llena en el sentido del reloj, desde arriba, en la duración exacta ----
let cargaT=null;
function cargando(ms, texto){
  const c=$("#carga"), t=c.querySelector(".torta");
  $("#cargaTxt").textContent=texto||""; c.hidden=false;
  t.style.transition="none"; t.style.strokeDashoffset="94.25"; void c.offsetWidth;
  t.style.transition=`stroke-dashoffset ${ms}ms linear`; t.style.strokeDashoffset="0";
  clearTimeout(cargaT); return new Promise(r=>{ cargaT=setTimeout(r, ms); });
}
function cerrarCarga(){ clearTimeout(cargaT); $("#carga").hidden=true; }

// ---- Botón que hay que mantener apretado: la barra se vacía de derecha a izquierda; si se suelta antes, se cancela ----
function botonMantener(texto, ms, alConfirmar){
  const barra=el("span",{class:"mantener-barra"});
  const b=el("button",{class:"btn mantener",type:"button"}, barra, el("span",{class:"mantener-txt"},texto));
  let t=null;
  const empezar=ev=>{ if(t) return; ev.preventDefault(); barra.style.transition=`width ${ms}ms linear`; barra.style.width="0%"; t=setTimeout(()=>{ t=null; alConfirmar(); }, ms); };
  const soltar=()=>{ if(!t) return; clearTimeout(t); t=null; barra.style.transition="width .2s ease-out"; barra.style.width="100%"; };
  b.addEventListener("pointerdown",empezar);
  for(const e of ["pointerup","pointerleave","pointercancel"]) b.addEventListener(e,soltar);
  b.addEventListener("keydown",ev=>{ if((ev.key===" "||ev.key==="Enter") && !ev.repeat) empezar(ev); });
  b.addEventListener("keyup",ev=>{ if(ev.key===" "||ev.key==="Enter") soltar(); });
  b.addEventListener("contextmenu",ev=>ev.preventDefault());
  return b;
}

// ---- Perfil › Tu cuenta: cerrar sesión en dos pasos (se expande ahí mismo y hay que mantener apretado 2 s) ----
function tarjetaCuenta(){
  const card=el("section",{class:"card"});
  const draw=()=>{
    card.replaceChildren(el("h3",{},"Tu cuenta"),
      el("p",{style:"margin:0 0 10px"},`Entraste como ${DB.auth?.user?.email||"—"}. Si cerrás sesión, tus datos quedan guardados en tu cuenta y los recuperás al volver a entrar.`));
    if(DB.admin) card.append(el("p",{class:"note",style:"margin:0 0 10px"},"Estás como administrador: lo que registres no cuenta en los datos generales."),
      el("div",{class:"row",style:"margin-bottom:10px"}, el("button",{class:"btn small",type:"button",onclick:ev=>{ const b=ev.currentTarget;
        if(!b.dataset.ok){ b.dataset.ok="1"; b.textContent="Tocá de nuevo para borrar todo"; return; } adminEmpezarDeCero(); }},"Empezar de cero")));
    if(!S.confirmarCierre) card.append(el("button",{class:"btn small",type:"button",onclick:()=>{ S.confirmarCierre=true; draw(); }},"Cerrar sesión"));
    else card.append(el("div",{class:"confirmar"},
      el("p",{class:"confirmar-preg"},"¿Estás seguro de que querés cerrar sesión?"),
      botonMantener("Cerrar sesión", 2000, async()=>{ S.confirmarCierre=false; await Promise.all([cerrarSesion(), cargando(2000,"Cerrando sesión…")]); cerrarCarga(); }),
      el("p",{class:"note",style:"margin:0"},"Mantené apretado el botón durante 2 segundos."),
      el("button",{class:"btn small ghost",type:"button",onclick:()=>{ S.confirmarCierre=false; draw(); }},"No, volver")));
  };
  draw(); return card;
}

// ---- Cerrar sesión: borra los datos del dispositivo; la cuenta los conserva ----
async function cerrarSesion(){
  await subirRespaldo(); sesionPausar(); await flush();
  const tk=DB.auth?.access_token; if(tk) authPost("/logout",{},tk).catch(()=>{});
  if(DB.avisos?.on) await desactivarAvisos();
  try{ localStorage.removeItem(KEY); }catch(e){}
  DB=blank(); secretHash=null; persist();
  ONB.i=-1; ONB.paso=null; ONB.draft=null; S.view="hoy"; S.slot=null; render(); window.scrollTo(0,0);
}

// ---- Eliminar la cuenta: página aparte (#eliminar-cuenta), 5 preguntas abiertas obligatorias ----
const BAJA_PREG=["¿Por qué te vas?","¿Qué fue lo que menos te gustó de Pulso?","¿Qué podríamos mejorar?","¿Qué te habría hecho quedarte?","¿Volverías a usar Pulso? ¿Por qué?"];
const BAJA={i:0, resp:["","","","",""], confirmar:false, hecha:false};
const letras = t => (t.match(/\p{L}/gu)||[]).length;
function salirBaja(){ history.replaceState(null,"",location.pathname); BAJA.i=0; BAJA.confirmar=false; render(); window.scrollTo(0,0); }
function renderBaja(box){
  const total=BAJA_PREG.length, msg=el("p",{class:"note",role:"status"});
  const prog=el("div",{class:"onb-prog"}, el("i",{style:`width:${(Math.min(BAJA.i,total)/total)*100}%`}));
  const cancelar=el("button",{class:"btn link",type:"button",onclick:salirBaja},"Cancelar y volver a Pulso");
  if(BAJA.i<total){
    const ta=el("textarea",{id:"baja-resp",rows:"4",placeholder:"Escribí tu respuesta"}); ta.value=BAJA.resp[BAJA.i];
    const sig=el("button",{class:"btn primary",type:"button",onclick:()=>{ BAJA.i++; render(); window.scrollTo(0,0); }},"Siguiente");
    const ok=()=>{ BAJA.resp[BAJA.i]=ta.value; sig.disabled=letras(ta.value)<3; };
    ta.addEventListener("input",ok);
    box.append(el("div",{class:"onb-card"}, prog, el("div",{class:"eyebrow"},`Antes de eliminar tu cuenta · ${BAJA.i+1} de ${total}`),
      el("h2",{},BAJA_PREG[BAJA.i]), el("p",{class:"note"},"Para continuar, respondé esta pregunta."), ta,
      el("div",{class:"row onb-nav"}, BAJA.i>0? el("button",{class:"btn ghost",type:"button",onclick:()=>{ BAJA.i--; render(); }},"Atrás"):null, sig), cancelar));
    ok(); setTimeout(()=>ta.focus(),50); return;
  }
  const btn=el("button",{class:"btn peligro big",type:"button"}, BAJA.confirmar? "Tocá de nuevo para confirmar" : "Eliminar mi cuenta");
  btn.addEventListener("click",async()=>{
    if(!BAJA.confirmar){ BAJA.confirmar=true; btn.textContent="Tocá de nuevo para confirmar"; return; }
    btn.disabled=true; msg.textContent=""; const espera=cargando(3000,"Eliminando tu cuenta…");
    try{
      await flush();
      const ok=await rpcCuenta("eliminar_cuenta",{p_encuesta:BAJA_PREG.map((p,i)=>({pregunta:p, respuesta:BAJA.resp[i].trim()}))});
      if(!ok){ cerrarCarga(); msg.textContent="Revisá tus respuestas: cada una necesita al menos tres letras."; btn.disabled=false; return; }
    }catch(e){ cerrarCarga(); msg.textContent="No se pudo eliminar ahora. Revisá la conexión y probá de nuevo."; btn.disabled=false; return; }
    if(DB.avisos?.on) await desactivarAvisos();
    try{ localStorage.removeItem(KEY); }catch(e){}
    DB=blank(); secretHash=null; persist(); BAJA.i=0; BAJA.confirmar=false; BAJA.resp=["","","","",""]; ONB.i=-1; ONB.paso=null; ONB.draft=null; S.view="hoy";
    history.replaceState(null,"",location.pathname); render();
    await espera; cerrarCarga(); window.scrollTo(0,0);
  });
  box.append(el("div",{class:"onb-card"}, prog, el("div",{class:"eyebrow"},"Último paso"), el("h2",{},"Eliminar tu cuenta"),
    el("p",{},"Se borran tu nombre, tu apellido, tu mail y la copia de tu cuenta, y se desactivan los recordatorios de este dispositivo. Tus registros y tus respuestas se conservan como datos generales, sin nada que los vincule a vos, como explican los términos."),
    el("p",{},"Esta acción no se puede deshacer."), btn, msg, cancelar));
}
window.addEventListener("hashchange",()=>render());

// ---- Apple Salud: el atajo «Pulso Salud» (atajo/) manda los pasos y los minutos de ejercicio del día ----
// «Conectar» genera un código personal y abre el atajo pasándoselo (lo guarda en Atajos); la app lee lo que llegó con «mi_salud».
const ATAJO_NOMBRE="Pulso Salud";
let saludLeyendo=false;
async function leerSalud(){
  if(saludLeyendo || !DB.auth || !DB.salud?.activo || !navigator.onLine) return;
  saludLeyendo=true;
  try{ const filas=await rpcCuenta("mi_salud",{p_desde:keyShift(S.today,-14)});
    const dias={}; let periodo=null;
    const peso=+DB.perfil?.resp?.cuerpo?.peso||70;   // sin energía informada: se estima como actividad moderada (MET 5), igual que el registro manual
    for(const f of filas||[]){ dias[f.fecha]={pasos:f.pasos, entrenos:(Array.isArray(f.entrenos)?f.entrenos:[]).map(e=>{ const min=Math.round(+e.min||0); return {tipo:String(e.tipo||"Ejercicio").slice(0,40), inicio:e.inicio||null, min, kcal:Math.round(+e.kcal||0) || Math.round(4*peso*min/60)}; })};
      if(f.periodo && (!periodo || f.periodo>periodo)) periodo=f.periodo; }
    DB.salud={...DB.salud, dias, leido:Date.now()};
    const R=DB.perfil?.resp;   // ciclo: si la app de ciclo escribe en Salud, se toma el último inicio
    if(periodo && R?.sexo==="m" && ["salud","clue"].includes(R.cicloApp) && (!R.ciclo?.ultimo || periodo>R.ciclo.ultimo)){ R.ciclo={...(R.ciclo||{duracion:28}), ultimo:periodo}; }
    const hoy=dias[S.today]; const d=day();   // entrenamiento de hoy que llegó de Salud: se ofrece el «Después de entrenar»
    if(hoy?.entrenos?.[0]?.inicio && !d.postHora){ const fin=new Date(hoy.entrenos[0].inicio||Date.now()); fin.setMinutes(fin.getMinutes()+(hoy.entrenos[0].min||0)); d.postHora=fin.getHours()+":"+pad(fin.getMinutes()); }
    persist(); if(DB.perfil?.completo) render();
  }catch(e){}
  saludLeyendo=false;
}
document.addEventListener("visibilitychange",()=>{ if(!document.hidden) leerSalud(); });
function saludDia(k){ return DB.salud?.dias?.[k] || null; }
function seccionSalud(){
  const card=el("section",{class:"card"}, el("h3",{},"Apple Salud"));
  const msg=el("p",{class:"note",role:"status",style:"margin:8px 0 0"});
  if(!ES_IOS && !DB.admin){ agregar(card, el("p",{style:"margin:0"},"La conexión con Apple Salud funciona en iPhone. En Android, el movimiento se registra a mano.")); return card; }
  // «Conectar»: genera el código y abre el atajo pasándoselo; el atajo lo guarda y manda los datos de hoy.
  const conectar=async ev=>{ const b=ev.currentTarget; b.disabled=true; msg.textContent="Conectando…";
    try{ const c=await rpcCuenta("salud_codigo_nuevo"); if(!c) throw 0; DB.salud={...(DB.salud||{}), activo:true}; persist();
      msg.textContent="Se abre Atajos: permití que lea Salud. Después volvé a Pulso.";
      location.href="shortcuts://run-shortcut?name="+encodeURIComponent(ATAJO_NOMBRE)+"&input=text&text="+encodeURIComponent(c);
    }catch(e){ msg.textContent="No se pudo conectar. Revisá la conexión y probá de nuevo."; }
    b.disabled=false; };
  const paso=(titulo,...cuerpo)=>el("li",{}, el("b",{},titulo), ...cuerpo);
  agregar(card, el("p",{style:"margin:0 0 8px"},"Pulso puede leer de Salud tus pasos y tus minutos de ejercicio de cada día, así no los cargás a mano. Son tres pasos, una sola vez."),
    el("ol",{class:"pasos-inst"},
      paso("Instalá el atajo. ", "Tocá el botón y después «Agregar atajo».",
        el("div",{style:"margin-top:6px"}, el("a",{class:"btn small",href:CONFIG.ATAJO_SALUD,target:"_blank",rel:"noopener"},"Instalar el atajo"))),
      paso("Conectá Pulso. ", "Se abre Atajos: tocá «Permitir» cuando pida leer Salud y volvé a Pulso.",
        el("div",{style:"margin-top:6px"}, el("button",{class:"btn small primary",type:"button",onclick:conectar}, DB.salud?.activo? "Conectar de nuevo" : "Conectar"))),
      paso("Programalo para todos los días. ", "En la app Atajos:",
        el("ol",{class:"subpasos"}, ["Tocá «Automatización», abajo.","Tocá «+» (o «Nueva automatización»).","Elegí «Hora del día».","Poné 23:00, dejá «Diariamente» y marcá «Ejecutar inmediatamente». Tocá «Siguiente».","Elegí «Pulso Salud»."].map(t=>el("li",{},t))))),
    DB.salud?.activo? el("div",{class:"row",style:"margin-top:10px"}, el("button",{class:"btn small ghost",type:"button",onclick:()=>{ DB.salud={...DB.salud, activo:false}; persist(); render(); }},"Dejar de leer Salud")) : null,
    DB.salud?.leido? el("p",{class:"note",style:"margin:8px 0 0"},`Última lectura: ${new Date(DB.salud.leido).toLocaleString("es-AR",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}.`) : null,
    msg);
  return card;
}

