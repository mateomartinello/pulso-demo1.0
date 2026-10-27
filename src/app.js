// ==== CUESTIONARIO INICIAL ====
// Cada pregunta: 4 opciones + «Otro» (con texto). type: single | multi | numbers
const PREGUNTAS = [
  {id:"datos", sec:"Vos", t:"¿Cómo te llamás?", sub:"Tu nombre lo usamos para hablarte por tu nombre. Tu mail, para novedades y encuestas de Pulso.", type:"datos"},
  {id:"sexo", sec:"Vos", t:"¿Con qué sexo te identificás?", sub:"Se usa solo para estimar tu gasto de energía.", type:"single",
   opts:[["h","Hombre"],["m","Mujer"],["nb","No binario"],["pnd","Prefiero no decirlo"]]},
  {id:"cuerpo", sec:"Vos", t:"Tus datos físicos", sub:"Con esto se calcula tu energía diaria. Quedan guardados en tu dispositivo.", type:"numbers",
   fields:[["edad","Edad","años",14,100],["altura","Altura","cm",120,220],["peso","Peso","kg",35,250]]},
  {id:"objetivo", sec:"Objetivo", t:"¿Qué querés lograr?", type:"single",
   opts:[["salud","Mejorar mi salud en general"],["bajar","Bajar grasa"],["ganar","Ganar músculo"],["energia","Tener más energía en el día"]]},
  {id:"actividad", sec:"Objetivo", t:"¿Cuánto te movés hoy?", type:"single",
   opts:[["sed","Casi nada: paso sentado la mayor parte del día"],["lig","Poco: camino o entreno 1 o 2 días"],["mod","Bastante: entreno 3 o 4 días"],["alt","Mucho: entreno 5 días o más"]]},
  {id:"patron", sec:"Alimentación", t:"¿Cómo comés?", type:"single",
   opts:[["omni","Como de todo"],["flex","Mayormente vegetal, con algo de carne"],["veg","Vegetariano"],["vegano","Vegano"]]},
  {id:"restric", sec:"Alimentación", t:"¿Tenés alguna restricción por salud?", sub:"Podés marcar varias.", type:"multi",
   opts:[["gluten","Celiaquía o sin gluten"],["lactosa","Intolerancia a la lactosa"],["nuez","Alergia a frutos secos"],["huevo","Alergia al huevo"]]},
  {id:"nocome", sec:"Alimentación", t:"¿Qué no comés porque no te gusta?", sub:"Podés marcar varias.", type:"multi",
   opts:[["pescado","Pescado"],["cerdo","Carne de cerdo"],["legumbre","Legumbres"],["lacteo","Lácteos"]]},
  {id:"estructura", sec:"Tu día", t:"¿Cuántas comidas hacés por día?", type:"single",
   opts:[["dac","Desayuno, almuerzo y cena"],["amc","Almuerzo, merienda y cena"],["damc","Desayuno, almuerzo, merienda y cena"],["dcamc","Cuatro comidas y colaciones"]]},
  {id:"hAlm", sec:"Tu día", t:"¿A qué hora solés almorzar?", type:"single",
   opts:[["12","12 h"],["13","13 h"],["14","14 h"],["15","15 h"]]},
  {id:"hCen", sec:"Tu día", t:"¿A qué hora solés cenar?", type:"single",
   opts:[["20","20 h"],["21","21 h"],["22","22 h"],["23","23 h"]]},
  {id:"platos", sec:"Tus gustos", t:"¿Qué platos comés más seguido?", sub:"Podés marcar varios.", type:"multi",
   opts:[["milanesas","Milanesas"],["pastas","Pastas"],["bowls","Arroz o bowls"],["ensaladas","Ensaladas"]]},
  {id:"snacks", sec:"Tus gustos", t:"Entre comidas, ¿qué solés comer?", sub:"Podés marcar varios.", type:"multi",
   opts:[["galletitas","Galletitas o alfajores"],["fruta","Fruta"],["frutos","Frutos secos"],["salados","Snacks salados"]]},
  {id:"pan", sec:"Marcas", t:"¿Qué pan comprás?", type:"single",
   opts:[["bimbo","Bimbo"],["fargo","Fargo"],["lactal","Lactal"],["panaderia","De panadería"],["no","No como pan"]]},
  {id:"lacteos", sec:"Marcas", t:"¿Qué marca de yogur o lácteos comprás?", type:"single",
   opts:[["serenisima","La Serenísima"],["yogurisimo","Yogurísimo"],["propia","Marca del supermercado"],["no","No consumo"]]},
  {id:"bebida", sec:"Marcas", t:"¿Qué tomás con las comidas?", type:"single",
   opts:[["agua","Agua"],["gaseosa","Gaseosa común"],["zero","Gaseosa sin azúcar"],["jugo","Jugos"]]},
  {id:"equipo", sec:"Tu cocina", t:"¿Con qué cocinás?", sub:"Podés marcar varios.", type:"multi",
   opts:[["hornalla","Hornallas"],["horno","Horno"],["freidora","Freidora de aire"],["microondas","Microondas"]]},
  {id:"tiempo", sec:"Tu cocina", t:"¿Cuánto tiempo querés dedicarle a cocinar por comida?", type:"single",
   opts:[["15","Menos de 15 minutos"],["30","Entre 15 y 30 minutos"],["60","Entre 30 y 60 minutos"],["tandas","Cocino por tandas, una o dos veces por semana"]]},
  {id:"presupuesto", sec:"Tu cocina", t:"¿Cómo es tu presupuesto para comida?", type:"single",
   opts:[["ajustado","Ajustado"],["moderado","Moderado"],["holgado","Holgado"],["pnd","Prefiero no decirlo"]]},
  {id:"mov", sec:"Movimiento", t:"¿Qué tipo de actividad te gusta?", sub:"Podés marcar varias.", type:"multi",
   opts:[["caminar","Caminar"],["correr","Correr"],["fuerza","Gimnasio o fuerza"],["deporte","Deportes en equipo"]]},
  {id:"dias", sec:"Movimiento", t:"¿Cuántos días por semana podrías moverte?", type:"single",
   opts:[["2","1 o 2 días"],["3","3 días"],["4","4 o 5 días"],["6","6 o 7 días"]]},
  {id:"sueno", sec:"Descanso", t:"¿Cuánto dormís en una noche normal?", type:"single",
   opts:[["5","Menos de 6 horas"],["6.5","Entre 6 y 7 horas"],["7.5","Entre 7 y 8 horas"],["8.5","Más de 8 horas"]]},
  {id:"relacion", sec:"Bienestar", t:"¿Cómo describirías tu relación con la comida?", sub:"Nos ayuda a cuidarte. Esta respuesta queda solo en tu dispositivo.", type:"single",
   opts:[["tranquila","Tranquila, sin problemas"],["emocional","A veces como por ansiedad, estrés o aburrimiento"],["control","Me genera culpa o necesito controlarla mucho"],["tca","Tuve o tengo un trastorno de la conducta alimentaria"]]},
];

// ==== UTILIDADES ====
const $ = s => document.querySelector(s);
const el = (tag, attrs={}, ...kids) => { const e=document.createElement(tag);
  for(const [k,v] of Object.entries(attrs)){ if(k==="class") e.className=v; else if(k.startsWith("on")) e.addEventListener(k.slice(2),v); else if(v!==false && v!=null) e.setAttribute(k,v===true?"":v); }
  for(const k of kids.flat()){ if(k==null||k===false) continue; e.append(k.nodeType?k:document.createTextNode(String(k))); } return e; };
const pad = n => String(n).padStart(2,"0");
function dayKey(d){ const x=new Date(d.getTime()-4*3600e3); return x.getFullYear()+"-"+pad(x.getMonth()+1)+"-"+pad(x.getDate()); }
function keyShift(key, days){ const [y,m,dd]=key.split("-").map(Number); const x=new Date(y,m-1,dd+days,12); return x.getFullYear()+"-"+pad(x.getMonth()+1)+"-"+pad(x.getDate()); }
function keyDate(key){ const [y,m,d]=key.split("-").map(Number); return new Date(y,m-1,d,12); }
const nf = (n,d=0) => Number(n).toLocaleString("es-AR",{maximumFractionDigits:d,minimumFractionDigits:0});
function frac(n){ const r=Math.round(n*2)/2; const w=Math.floor(r); const h=r-w>0; if(w===0&&h) return "½"; return (w? String(w):"")+(h?"½":""); }
function hash(s){ let h=2166136261; for(const c of s){ h^=c.charCodeAt(0); h=Math.imul(h,16777619);} return Math.abs(h); }
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const uid=()=> (crypto.randomUUID ? crypto.randomUUID() : "x"+Math.random().toString(36).slice(2)+Date.now().toString(36));
const cap = s => s.charAt(0).toUpperCase()+s.slice(1);

// ==== ALMACENAMIENTO LOCAL ====
const KEY="pulso.v1";
function blank(){ return {v:1, anonId:uid(), secret:uid()+uid(), perfil:null, consent:null, dias:{}, cola:[]}; }
let DB;
try{ DB = JSON.parse(localStorage.getItem(KEY)||"null") || blank(); }catch(e){ DB = blank(); }
if(!DB.dias) DB.dias={}; if(!DB.cola) DB.cola=[];
let persistOk=true;
function persist(){ try{ localStorage.setItem(KEY, JSON.stringify(DB)); persistOk=true; }catch(e){ persistOk=false; } respaldoPronto(); }
persist();

// ==== PLAN PERSONALIZADO ====
function ans(id){ return DB.perfil?.resp?.[id]; }
function has(id,v){ const a=ans(id); return Array.isArray(a)? a.includes(v) : a===v; }
function calcPlan(p){
  const r=p.resp; const edad=+r.cuerpo?.edad||25, alt=+r.cuerpo?.altura||170, peso=+r.cuerpo?.peso||70;
  const care = edad<18 || r.relacion==="control" || r.relacion==="tca";
  const s = r.sexo==="h"? 5 : r.sexo==="m"? -161 : -78;
  const bmr = 10*peso + 6.25*alt - 5*edad + s;
  const fa = {sed:1.2, lig:1.375, mod:1.55, alt:1.725}[r.actividad] || 1.375;
  let kcal = bmr*fa;
  const obj = r.objetivo;
  if(obj==="bajar" && !care) kcal = Math.max(kcal*0.85, bmr*1.1);
  if(obj==="ganar") kcal *= 1.10;
  kcal = Math.round(kcal/50)*50;
  const protKg = (obj==="bajar"||obj==="ganar") ? 1.6 : 1.0;
  const excl = new Set();
  const pat=r.patron;
  if(pat==="veg"||pat==="vegano") ["vacuna","cerdo","pollo","pescado"].forEach(g=>excl.add(g));
  if(pat==="vegano") ["huevo","lacteo"].forEach(g=>excl.add(g));
  for(const x of (r.restric||[])){ if(x==="gluten") excl.add("gluten"); if(x==="nuez") excl.add("nuez"); if(x==="huevo") excl.add("huevo"); }
  for(const x of (r.nocome||[])){ if(["pescado","cerdo","legumbre","lacteo"].includes(x)) excl.add(x); }
  if(r.pan==="no") excl.add("pan");
  let eq = new Set((r.equipo||[]).filter(x=>x!=="otro")); if(!eq.size) eq=new Set(["hornalla"]);
  const tmax = r.tiempo==="15"?15 : r.tiempo==="30"?30 : r.tiempo==="60"?60 : r.tiempo==="tandas"?60 : 40;
  const est = ESTRUCTURAS[r.estructura] ? r.estructura : "damc";
  const hAlm = +r.hAlm || 13, hCen = +r.hCen || 21;
  const horas = {des:"8:30", col:"10:30", alm:hAlm+":00", mer:Math.round((hAlm+hCen)/2)+":00", cen:hCen+":00"};
  const diasMov = +r.dias || 3;
  return { care, edad, peso, kcal, prot:Math.round(peso*protKg), excl, eq, tmax, est, horas,
    pan: PANES[r.pan] || PANES.generico, sinLactosa:(r.restric||[]).includes("lactosa"),
    metas:{frutas:2, verduras:3, integrales:excl.has("gluten")?2:3, nueces:excl.has("nuez")?0:1, rojaSem:2, movMin:150, fuerza:2, sueno:7},
    flex: pat==="flex", diasMov, budget:r.presupuesto, platos:r.platos||[], prefMov:(r.mov||[]).filter(x=>x!=="otro") };
}
let PLAN = null;

// ==== RECETAS: aplicar el pan elegido y filtrar por perfil ====
function ingOf(id){ if(id==="pan" && PLAN){ return {...ING.pan, ...PLAN.pan, g:["gluten"], pan:true}; } return ING[id]; }
function escala(x,f){ if(f>1 && x.fijo) return 1; if(f>1 && x.pr) return Math.min(f,1.15); return f; }
function nutr(rec, factor){
  factor = factor || 1;
  let k=0,p=0,fib=0,veg=0,fruta=0,integ=0,nuez=false,vitC=false,roja=false,atun=false;
  for(const [id,g,esc] of rec.i){
    const x=ingOf(id); const gg = esc ? g*escala(x,factor) : g;
    k+=x.k*gg/100; p+=x.p*gg/100; fib+=x.f*gg/100;
    if(x.veg) veg+=gg; if(x.fruta) fruta+=gg; if(x.integral) integ+=gg;
    if(x.nuez && gg>=15) nuez=true; if(x.vitC && gg>=60) vitC=true; if(x.roja) roja=true; if(x.atun) atun=true;
  }
  return {kcal:Math.round(k), prot:Math.round(p), fibra:Math.round(fib),
    verduras:Math.round(veg/VEG_PORCION*2)/2, frutas:Math.round(fruta/FRUTA_PORCION*2)/2, integrales:Math.round(integ/INT_PORCION*2)/2,
    nueces:nuez?1:0, vitC, roja, atun};
}
function usable(rec){
  if(!PLAN) return true;
  for(const [id] of rec.i){ const x=ING[id]; if(id==="pan" && PLAN.excl.has("pan")) return false; for(const g of (x.g||[])) if(PLAN.excl.has(g)) return false; }
  for(const req of rec.eq){ if(!req.split("|").some(e=>PLAN.eq.has(e))) return false; }
  if(rec.t>PLAN.tmax) return false;
  return true;
}
function recetasDe(pool){ const all=RECETAS.filter(r=>r.s===pool); const u=all.filter(usable); return u.length? u : all.filter(r=>{ for(const [id] of r.i){ for(const g of (ING[id].g||[])) if(PLAN && PLAN.excl.has(g)) return false; } return true; }); }

// ==== ESTADO DEL DÍA ====
const S = { today: dayKey(new Date()), slot:null, offsets:{}, adj:{}, view:"hoy" };
function day(k){ k=k||S.today; if(!DB.dias[k]) DB.dias[k]={comidas:[], ejercicio:[], sueno:null}; const d=DB.dias[k]; d.comidas=d.comidas||[]; d.ejercicio=d.ejercicio||[]; return d; }
function slotsHoy(){ return ESTRUCTURAS[PLAN.est].slots; }
function slotNow(){
  const h=new Date().getHours()+new Date().getMinutes()/60; const sl=slotsHoy().map(s=>s[0]);
  const hr = k=>{ const [a,b]=PLAN.horas[k].split(":").map(Number); return a+b/60; };
  if(h<4) return sl[sl.length-1];
  let best=sl[0]; for(const k of sl){ if(h >= hr(k)-1.5) best=k; } return best;
}
function totals(comidas){
  const t={kcal:0,prot:0,fibra:0,verduras:0,frutas:0,integrales:0,nueces:0,vitC:false,roja:0,atun:0,sinEstimar:0};
  for(const c of comidas||[]){ if(c.kcal==null){ t.sinEstimar++; continue; }
    t.kcal+=c.kcal; t.prot+=c.prot||0; t.fibra+=c.fibra||0; t.verduras+=c.verduras||0; t.frutas+=c.frutas||0; t.integrales+=c.integrales||0;
    t.nueces+=c.nueces||0; if(c.vitC) t.vitC=true; if(c.roja) t.roja++; if(c.atun) t.atun++; }
  return t;
}
function last7(){ return Array.from({length:7},(_,i)=>keyShift(S.today,i-6)); }
function weekCount(field){ let n=0; for(const k of last7()) for(const c of (DB.dias[k]?.comidas||[])) if(c[field]) n++; return n; }
function exKcal(k){ return (day(k).ejercicio||[]).reduce((a,e)=>a+(e.kcal||0),0); }
function target(){ return PLAN.kcal + exKcal(); }
function slotShare(slot){ return (slotsHoy().find(s=>s[0]===slot)||[0,.25])[1]; }

// ==== ELECCIÓN DE RECETA ====
function candidatos(slot){
  const pool=SLOTDEF[slot].pool; let base=recetasDe(pool);
  const rojaOk = weekCount("roja") < PLAN.metas.rojaSem, atunOk = weekCount("atun") < 3;
  const recientes=new Set(); for(const k of [keyShift(S.today,-2),keyShift(S.today,-1),S.today]) for(const c of (DB.dias[k]?.comidas||[])) if(c.recetaId) recientes.add(c.recetaId);
  let f = base.filter(r=>{ const n=nutr(r); return !(n.roja&&!rojaOk) && !(n.atun&&!atunOk) && !recientes.has(r.id); });
  if(!f.length) f = base.filter(r=>{ const n=nutr(r); return !(n.roja&&!rojaOk) && !(n.atun&&!atunOk); });
  if(!f.length) f = base;
  const score = r => (PLAN.platos.includes(r.tipo)?2:0) + (PLAN.budget==="ajustado" && r.cost<=1 ? 1:0) - (PLAN.flex && nutr(r).roja ? 1:0)
    + (!totals(day().comidas).vitC && pool!=="p" && nutr(r).vitC ? 2:0);
  return f.slice().sort((a,b)=> score(b)-score(a) || a.id.localeCompare(b.id));
}
function elegir(slot){
  const f=candidatos(slot); if(!f.length) return {rec:null, count:0};
  const top=f.filter((r,i)=>i<Math.max(3,Math.ceil(f.length/2)));
  const base=hash(S.today+slot)%top.length; const off=S.offsets[slot]||0;
  const list = off<top.length ? top : f;
  return {rec:list[(base+off)%list.length], count:f.length};
}
function fitFactor(rec, kcalObj){ let best=1, d=Infinity; for(let f=0.6; f<=1.8001; f+=0.05){ const k=nutr(rec,f).kcal; if(Math.abs(k-kcalObj)<d){ d=Math.abs(k-kcalObj); best=Math.round(f*100)/100; } } return best; }
function factorFor(slot, rec){
  let obj = PLAN.kcal*slotShare(slot);
  const ultimo = slotsHoy()[slotsHoy().length-1][0];
  let why="";
  if(slot===ultimo && exKcal()>0){ obj += exKcal(); why=`Porción un poco más grande por tu actividad de hoy.`; }
  return {f:fitFactor(rec,obj), why};
}

// ==== SINCRONIZACIÓN CON LA BASE COMÚN (Supabase) ====
const SYNC_ON = () => !!(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY && DB.consent?.share);
let secretHash=null;
async function getHash(){
  if(secretHash) return secretHash;
  try{ const b=await crypto.subtle.digest("SHA-256", new TextEncoder().encode(DB.secret)); secretHash=[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join(""); }
  catch(e){ secretHash="h"+hash(DB.secret).toString(16); }
  return secretHash;
}
function perfilCompartible(){
  const r={...DB.perfil.resp}; if(r.relacion==="control"||r.relacion==="tca") r.relacion="no_informado"; delete r.relacion_otro; delete r.datos;
  r.tiempos_s = DB.perfil.tiempos||{}; return r;
}
function enviar(tipo, datos, fecha, urgente){
  if(!DB.consent?.share) return;
  DB.cola.push({tipo, fecha: fecha||S.today, datos, creado:new Date().toISOString()}); persist();
  if(urgente) flush(true); else flushSoon();
}
let flushT=null, flushing=false;
function flushSoon(){ clearTimeout(flushT); flushT=setTimeout(flush, 1500); }
async function flush(urgente){
  if(flushing || !SYNC_ON() || !DB.cola.length || !navigator.onLine) return;
  flushing=true;
  try{
    const tk = DB.auth? await tokenVigente() : CONFIG.SUPABASE_ANON_KEY; if(!tk){ flushing=false; return; }
    const h=await getHash(); const lote=DB.cola.slice(0, urgente? 20 : 200);
    const rows=lote.map(e=>({anon_id:DB.anonId, secret_hash:h, tipo:e.tipo, fecha:e.fecha, datos:e.datos, creado:e.creado, app_version:CONFIG.APP_VERSION}));
    const res=await fetch(CONFIG.SUPABASE_URL.replace(/\/$/,"")+"/rest/v1/eventos",{method:"POST", keepalive:!!urgente,
      headers:{"apikey":CONFIG.SUPABASE_ANON_KEY,"Authorization":"Bearer "+tk,"Content-Type":"application/json","Prefer":"return=minimal"},
      body:JSON.stringify(rows)});
    if(res.ok){ DB.cola.splice(0,lote.length); persist(); if(DB.cola.length) flushSoon(); }
  }catch(e){}
  flushing=false;
}
window.addEventListener("online", flushSoon);

const EMAIL_RE=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// ==== SESIONES DE USO ====
// Una sesión va desde que la app se abre (o vuelve al frente) hasta que pasa a segundo plano o se cierra.
// Si vuelve en menos de un minuto, sigue la misma sesión. Se envía cada vez que la app pasa a segundo plano,
// con el mismo id: para analizar, vale el último envío de cada id.
const SES_PAUSA=60000;
function sesionEnviar(s, urgente){
  enviar("sesion",{id:s.id, inicio:new Date(s.inicio).toISOString(), fin:new Date(s.fin).toISOString(), duracion_s:Math.round((s.fin-s.inicio)/1000)}, dayKey(new Date(s.inicio)), urgente);
}
function sesionIniciar(){
  const ahora=Date.now(), s=DB.sesion;
  if(s && s.fin && ahora-s.fin<SES_PAUSA){ s.fin=null; s.ultimo=ahora; persist(); return; }
  if(s && !s.fin){ s.fin=s.ultimo||s.inicio; sesionEnviar(s); }   // se cerró sin aviso: termina en su último registro
  DB.sesion={id:uid(), inicio:ahora, ultimo:ahora, fin:null}; persist();
}
function sesionPausar(){ const s=DB.sesion; if(!s || s.fin) return; s.fin=s.ultimo=Date.now(); persist(); sesionEnviar(s, true); }
document.addEventListener("visibilitychange",()=>{ if(document.hidden) sesionPausar(); else sesionIniciar(); });
window.addEventListener("pagehide", sesionPausar);
setInterval(()=>{ if(DB.sesion && !DB.sesion.fin && !document.hidden){ DB.sesion.ultimo=Date.now(); persist(); } }, 30000);

// ==== REGISTRO ====
function addComida(e){ const c={id:uid(), hora:new Date().toISOString(), ...e}; day().comidas.push(c); persist(); enviar("comida", c); marcarAviso(S.today, c.slot, true); render(); }
function delComida(id, k){ const d=day(k); const slot=d.comidas.find(c=>c.id===id)?.slot; d.comidas=d.comidas.filter(c=>c.id!==id); persist(); enviar("comida_borrada",{id},k);
  if(slot && !d.comidas.some(c=>c.slot===slot)) marcarAviso(k||S.today, slot, false); render(); }
function addEjercicio(e){ const x={id:uid(), hora:new Date().toISOString(), ...e}; day().ejercicio.push(x); persist(); enviar("ejercicio", x); render(); }
function delEjercicio(id){ const d=day(); d.ejercicio=d.ejercicio.filter(c=>c.id!==id); persist(); enviar("ejercicio_borrado",{id}); render(); }
function setSueno(s){ day().sueno={...s, hora:new Date().toISOString()}; persist(); enviar("sueno", day().sueno); render(); }

// ==== HAMBRE Y EMOCIONES: pregunta breve antes de guardar ====
const HAMBRE=[["ninguna","Nada de hambre"],["poca","Poca"],["moderada","Moderada"],["mucha","Mucha"]];
const MOTIVO=[["hambre","Hambre física"],["horario","Horario o costumbre"],["emocion","Ansiedad o estrés"],["aburrimiento","Aburrimiento"]];
function preguntarEmocion(onDone){
  const st={hambre:null, motivo:null, otro:""};
  const sheet=$("#sheet"); sheet.replaceChildren();
  const grupo=(titulo, opts, key)=>{ const box=el("div",{class:"opts"});
    const draw=()=>{ box.replaceChildren(...opts.concat([["otro","Otro"]]).map(([v,t])=>el("button",{type:"button",class:"opt"+(st[key]===v?" on":""),onclick:()=>{st[key]=v; draw(); otroIn.hidden = !(st.hambre==="otro"||st.motivo==="otro");}},t))); };
    draw(); return el("div",{class:"stack",style:"gap:8px"}, el("div",{class:"label"},titulo), box); };
  const otroIn=el("input",{type:"text",id:"emoOtro",placeholder:"Contalo en pocas palabras",hidden:true}); otroIn.addEventListener("input",()=>st.otro=otroIn.value);
  sheet.append(el("div",{class:"sheet-card"},
    el("h2",{},"Antes de guardar"),
    el("p",{class:"note"},"Dos toques. Sirve para que veas tus patrones, no para juzgarte."),
    grupo("¿Cuánta hambre tenías?", HAMBRE, "hambre"),
    grupo("¿Qué te llevó a comer?", MOTIVO, "motivo"),
    otroIn,
    el("div",{class:"row",style:"margin-top:6px"},
      el("button",{class:"btn primary",type:"button",onclick:()=>{ cerrarSheet(); onDone({hambre:st.hambre, motivo:st.motivo, emoOtro:st.otro||undefined}); }},"Guardar"),
      el("button",{class:"btn ghost",type:"button",onclick:()=>{ cerrarSheet(); onDone({}); }},"Saltear"))));
  sheet.hidden=false;
}
function cerrarSheet(){ $("#sheet").hidden=true; $("#sheet").replaceChildren(); }

// ==== RENDER: GENERAL ====
function render(){
  if(location.hash==="#eliminar-cuenta" && (BAJA.hecha || (DB.auth && DB.perfil?.completo))){ $("#app").hidden=true; $("#onb").hidden=false; cuentaParar(); const b=$("#onb"); b.replaceChildren(); renderBaja(b); return; }
  if(!DB.auth || !DB.perfil?.completo || !DB.consent?.acepta || ONB.paso==="avisos"){ $("#app").hidden=true; $("#onb").hidden=false; renderOnb(); return; }
  PLAN = calcPlan(DB.perfil);
  if(!S.slot || !slotsHoy().some(s=>s[0]===S.slot)) S.slot=slotNow();
  $("#onb").hidden=true; $("#app").hidden=false;
  const nombre=DB.perfil.resp.datos?.nombre;
  $("#fecha").textContent = (nombre? `Hola, ${nombre} · ` : "") + cap(keyDate(S.today).toLocaleDateString("es-AR",{weekday:"long",day:"numeric",month:"long"}));
  $("#btnPerfil").setAttribute("aria-current", S.view==="perfil"? "page" : "false");
  $("#storeBanner").hidden = persistOk;
  document.querySelectorAll(".tab").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.v===S.view)));
  for(const v of ["hoy","mov","semana","historial","recetario","perfil"]) $("#v-"+v).hidden = v!==S.view;
  ({hoy:renderHoy, mov:renderMov, semana:renderSemana, historial:renderHistorial, recetario:renderRecetario, perfil:renderPerfil})[S.view]();
}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{ S.view=b.dataset.v; render(); window.scrollTo(0,0); }));
$("#btnPerfil").addEventListener("click",()=>{ S.view="perfil"; render(); window.scrollTo(0,0); });

// ==== HOY ====
function ingRows(rec, f){
  return el("ul",{class:"ing"}, rec.i.map(([id,g,esc])=>{ const x=ingOf(id); let gg=esc? g*escala(x,f) : g; gg = Math.max(5, Math.round(gg/5)*5);
    const unit = x.u ? ` · ${frac(gg/x.u)} ${x.uN||"unidad"}${gg/x.u>1.25 && !(x.uN||"").endsWith(".")?"s":""}` : "";
    return el("li",{}, el("span",{},x.n), el("span",{}, `${gg} g`, el("small",{},unit))); }));
}
function nutrLine(n){
  const care=PLAN.care;
  return el("div",{class:"meta",style:"margin-top:10px"},
    care?null:el("span",{},el("b",{},nf(n.kcal))," kcal"), care?null:el("span",{},el("b",{},nf(n.prot))," g proteína"),
    n.verduras? el("span",{},el("b",{},nf(n.verduras,1))," verdura"):null, n.frutas? el("span",{},el("b",{},nf(n.frutas,1))," fruta"):null,
    n.integrales? el("span",{},el("b",{},nf(n.integrales,1))," integral"):null);
}
function adjSeg(key){
  const cur=S.adj[key]||1;
  return el("div",{class:"seg",role:"group","aria-label":"Cuánto comiste"},
    [[0.75,"Menos"],[1,"Igual"],[1.25,"Más"]].map(([v,t])=>el("button",{type:"button","aria-pressed":String(cur===v),onclick:()=>{S.adj[key]=v; render();}},t)));
}
function scaleN(n,a){ const o={...n}; for(const k of ["kcal","prot","fibra"]) o[k]=Math.round(n[k]*a); for(const k of ["verduras","frutas","integrales"]) o[k]=Math.round(n[k]*a*2)/2; return o; }

function renderHoy(){
  const box=$("#v-hoy"); box.replaceChildren();
  const d=day();
  if(PLAN.care) box.append(cardCuidado());
  if(!d.sueno && new Date().getHours()<16) box.append(cardSueno());
  // momentos del día
  const hechos=new Set(d.comidas.map(c=>c.slot));
  box.append(el("div",{class:"slots","aria-label":"Comidas del día"}, slotsHoy().map(([k])=>el("button",{class:"slot",type:"button","aria-pressed":String(S.slot===k),onclick:()=>{S.slot=k; render();}},
    hechos.has(k)? el("span",{class:"ck","aria-label":"registrada"},"✓"):null, SLOTDEF[k].n, el("span",{class:"note"},PLAN.horas[k]+" h")))));
  // sugerencia
  const slot=S.slot; const {rec,count}=elegir(slot);
  const ya=d.comidas.filter(c=>c.slot===slot);
  if(!rec) box.append(el("article",{class:"card hero"}, el("div",{class:"label"},`${SLOTDEF[slot].n} · ${PLAN.horas[slot]} h`),
    el("p",{},"Todavía no tenemos recetas que se ajusten a todo tu perfil para este momento del día. Registrá lo que comas en «Comí otra cosa», más abajo.")));
  else { const {f,why}=factorFor(slot,rec); const n=nutr(rec,f);
  box.append(el("article",{class:"card hero"},
    el("div",{class:"label"}, `${SLOTDEF[slot].n} · ${PLAN.horas[slot]} h${slot===slotNow()?" · ahora":""}`),
    ya.length? el("div",{class:"note",style:"margin-top:4px"},`Ya registraste: ${ya.map(c=>c.nombre).join(", ")}.`):null,
    el("h2",{},rec.n),
    el("div",{class:"meta"}, rec.t? el("span",{},el("b",{},rec.t)," min"):el("span",{},"Sin cocción"), el("span",{},"1 porción"), PLAN.sinLactosa && rec.i.some(([id])=>(ING[id].g||[]).includes("lacteo"))? el("span",{},"Usá lácteos sin lactosa"):null),
    why? el("div",{class:"factor"},why):null,
    ingRows(rec,f), el("ol",{class:"steps"}, rec.pasos.map(p=>el("li",{},p))), nutrLine(n),
    el("div",{class:"actions"},
      el("div",{class:"row"}, adjSeg(rec.id),
        el("button",{class:"btn primary",type:"button",onclick:()=>{ const a=S.adj[rec.id]||1; const m=scaleN(n,a);
          preguntarEmocion(emo=>{ addComida({slot, recetaId:rec.id, nombre:rec.n+(a!==1?(a<1?" (menos)":" (más)"):""), ...m, ...emo}); S.adj[rec.id]=1; }); }},"Lo comí")),
      count>1? el("div",{class:"row"}, el("button",{class:"btn small",type:"button",onclick:()=>{ S.offsets[slot]=(S.offsets[slot]||0)+1; render(); }},`Otra opción (${count})`)):null))); }
  // movimiento rápido
  box.append(cardMovRapido());
  // progreso
  box.append(el("section",{class:"stack","aria-label":"Progreso de hoy"}, el("h3",{},"Hoy vas así"), progreso(d.comidas)));
  // registro
  const otro=el("textarea",{id:"otroTxt",placeholder:"Escribilo como lo dirías. Por ejemplo: dos porciones de pizza de muzzarella y una gaseosa sin azúcar."});
  const sel=el("select",{id:"otroSlot","aria-label":"Momento del día"}, slotsHoy().map(([k])=>el("option",{value:k},SLOTDEF[k].n))); sel.value=slot;
  const msg=el("span",{class:"note",id:"otroMsg"});
  const registrar=()=>{ const txt=otro.value.trim(); if(!txt){ otro.focus(); return; }
    const r=ESTIMADOR.analizar(txt);
    if(!r.items.length){ msg.textContent="No reconocí ningún alimento. Probá nombrarlo de otra forma."; return; }
    const nombre=cap(txt).replace(/[.\s]+$/,"");
    preguntarEmocion(emo=> addComida({slot:sel.value, recetaId:null, nombre:nombre.length>140?nombre.slice(0,137)+"…":nombre, kcal:r.kcal, prot:r.prot, fibra:r.fibra,
      verduras:r.verduras, frutas:r.frutas, integrales:r.integrales, nueces:r.nueces, vitC:r.vitC, roja:r.roja, atun:r.atun, fuera:true, texto:txt,
      items:r.items.map(ESTIMADOR.describir), noRec:r.sobras, ...emo})); };
  otro.addEventListener("keydown",e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); registrar(); } });
  box.append(el("section",{class:"card"}, el("h3",{},"Registro de hoy"),
    el("ul",{class:"log"}, d.comidas.length? ordenar(d.comidas).map(c=>logItem(c,true)) : el("li",{class:"note"},"Todavía no registraste nada hoy.")),
    el("div",{class:"sep"}),
    el("div",{class:"stack",style:"gap:10px"}, el("label",{for:"otroTxt",class:"label"},"Comí otra cosa"), otro,
      el("div",{class:"row"}, sel, el("button",{class:"btn small",type:"button",onclick:registrar},"Registrar"), msg))));
}
function ordenar(arr){ const o=slotsHoy().map(s=>s[0]); return [...arr].sort((a,b)=>o.indexOf(a.slot)-o.indexOf(b.slot)||String(a.hora).localeCompare(String(b.hora))); }
function horaTxt(c){ const d=new Date(c.hora); return isNaN(d)?"":" · "+pad(d.getHours())+":"+pad(d.getMinutes())+" h"; }
const MOT_TXT=Object.fromEntries(MOTIVO.concat([["otro","Otro motivo"]]));
function logItem(c, borrable, k){
  return el("li",{},
    el("div",{}, el("div",{class:"s"},(SLOTDEF[c.slot]?.n||"")+horaTxt(c)+(c.fuera?" · fuera del plan":"")), el("div",{},c.nombre),
      el("div",{class:"note"}, PLAN.care? (c.motivo?MOT_TXT[c.motivo]:"") : (c.kcal==null?"Sin estimar":`${nf(c.kcal)} kcal · ${nf(c.prot)} g proteína`)+(c.motivo?` · ${MOT_TXT[c.motivo]}`:"")),
      Array.isArray(c.items)&&c.items.length? el("div",{class:"det"},"Contado: "+c.items.join(" · ")):null,
      Array.isArray(c.noRec)&&c.noRec.length? el("div",{class:"det warn"},"No se contó: "+c.noRec.map(w=>"«"+w+"»").join(", ")):null),
    borrable? el("button",{class:"x",type:"button","aria-label":"Borrar "+c.nombre,onclick:()=>delComida(c.id,k)},"×"):null);
}
function progreso(comidas){
  const t=totals(comidas), M=PLAN.metas, box=el("div",{class:"prog"});
  const item=(k,v,goal,unit,opt={})=>{ const pct=goal? clamp(v/goal,0,1)*100:0; const over=opt.max && v>goal; const done=!over && v>=goal;
    return el("div",{class:"pi"+(over?" over":done?" done":"")}, el("div",{class:"k"},k), el("div",{class:"v"},opt.txt||nf(v,1), el("small",{}, opt.txt?"":` / ${nf(goal)}${unit}`)), el("div",{class:"bar"},el("i",{style:`width:${pct}%`}))); };
  if(!PLAN.care){ box.append(item("Energía",t.kcal,target()," kcal"), item("Proteína (mín.)",t.prot,PLAN.prot," g")); }
  box.append(item("Frutas",t.frutas,M.frutas,""), item("Verduras",t.verduras,M.verduras,""), item("Integrales",t.integrales,M.integrales,""));
  if(M.nueces) box.append(item("Frutos secos",t.nueces,M.nueces,""));
  box.append(item("Vitamina C",t.vitC?1:0,1,"",{txt:t.vitC?"Cubierta":"Falta una fuente"}));
  if(!PLAN.excl.has("vacuna")) box.append(item("Carne roja · 7 días",weekCount("roja"),M.rojaSem,"",{max:true}));
  return box;
}
function cardCuidado(){
  return el("section",{class:"card care"}, el("h3",{},"Tu app, en modo cuidado"),
    el("p",{style:"margin:0 0 8px"},"Por lo que nos contaste, la app no muestra calorías ni metas numéricas, y nunca te va a proponer comer menos. Se enfoca en la variedad, los horarios y cómo te sentís."),
    el("p",{class:"note",style:"margin:0"},"Si la comida te genera malestar seguido, hablarlo con un profesional de salud ayuda. En Argentina, la Línea de Salud Mental 0800-999-0091 es gratuita y atiende las 24 horas."));
}
function cardSueno(){
  const st={horas:null, calidad:null};
  const box=el("section",{class:"card"}, el("h3",{},"¿Cómo dormiste anoche?"));
  const draw=()=>{ box.replaceChildren(el("h3",{},"¿Cómo dormiste anoche?"),
    el("div",{class:"label",style:"margin-top:6px"},"Horas"),
    el("div",{class:"opts"}, [["5","Menos de 6"],["6.5","6 a 7"],["7.5","7 a 8"],["8.5","Más de 8"]].map(([v,t])=>el("button",{type:"button",class:"opt"+(st.horas===v?" on":""),onclick:()=>{st.horas=v; draw();}},t))),
    el("div",{class:"label",style:"margin-top:10px"},"Calidad"),
    el("div",{class:"opts"}, [["mala","Mala"],["regular","Regular"],["buena","Buena"],["muy_buena","Muy buena"]].map(([v,t])=>el("button",{type:"button",class:"opt"+(st.calidad===v?" on":""),onclick:()=>{st.calidad=v; draw();}},t))),
    el("div",{class:"row",style:"margin-top:10px"}, el("button",{class:"btn small primary",type:"button",disabled:!(st.horas&&st.calidad),onclick:()=>setSueno({horas:+st.horas, calidad:st.calidad})},"Guardar"),
      el("button",{class:"btn small ghost",type:"button",onclick:()=>setSueno({omitido:true})},"Hoy no"))); };
  draw(); return box;
}

// ==== MOVIMIENTO ====
const ACT=[["caminar","Caminar",3.5],["correr","Correr",8],["fuerza","Fuerza o gimnasio",5],["deporte","Deporte",7]];
const ACT_MET=Object.fromEntries(ACT.map(a=>[a[0],a[2]])); const ACT_TXT=Object.fromEntries(ACT.map(a=>[a[0],a[1]]));
function cardMovRapido(){
  const st={tipo:null, min:null};
  const box=el("section",{class:"card"});
  const draw=()=>{ const hoy=day().ejercicio;
    box.replaceChildren(...[el("h3",{},"¿Te moviste hoy?"),
      hoy.length? el("ul",{class:"log"}, hoy.map(e=>el("li",{}, el("div",{}, el("div",{},`${ACT_TXT[e.tipo]||e.otro||"Actividad"} · ${e.min} min`), PLAN.care?null:el("div",{class:"note"},`≈ ${nf(e.kcal)} kcal`)),
        el("button",{class:"x",type:"button","aria-label":"Borrar actividad",onclick:()=>delEjercicio(e.id)},"×")))):null,
      el("div",{class:"opts"}, ACT.map(([v,t])=>el("button",{type:"button",class:"opt"+(st.tipo===v?" on":""),onclick:()=>{st.tipo=v; draw();}},t)), el("button",{type:"button",class:"opt"+(st.tipo==="otro"?" on":""),onclick:()=>{st.tipo="otro"; draw();}},"Otro")),
      st.tipo? el("div",{class:"opts",style:"margin-top:8px"}, [15,30,45,60].map(m=>el("button",{type:"button",class:"opt"+(st.min===m?" on":""),onclick:()=>{st.min=m; draw();}},m+" min"))) : null,
      st.tipo && st.min? el("button",{class:"btn small primary",type:"button",style:"margin-top:10px",onclick:()=>{ const met=ACT_MET[st.tipo]||5; addEjercicio({tipo:st.tipo, min:st.min, kcal:Math.round((met-1)*PLAN.peso*st.min/60)}); }},"Guardar") : null].filter(Boolean));
  };
  draw(); return box;
}
function planMovimiento(){
  const n=PLAN.diasMov>=6?5: PLAN.diasMov>=4?4: PLAN.diasMov;
  const pref=PLAN.prefMov.length? PLAN.prefMov : ["caminar"];
  const aer=pref.filter(p=>p!=="fuerza"); const aerTipo = aer.length? aer : ["caminar"];
  const fuerzaN = n>=3 ? 2 : (pref.includes("fuerza")?1:0);
  const aerN = Math.max(n - fuerzaN, 1);
  const minAer = clamp(Math.ceil(150/aerN/5)*5, 20, 60);
  const dias = {2:["Martes","Sábado"],3:["Lunes","Miércoles","Viernes"],4:["Lunes","Martes","Jueves","Sábado"],5:["Lunes","Martes","Miércoles","Viernes","Sábado"]}[n] || ["Lunes","Jueves"];
  const ses=[]; let a=0,fz=0;
  for(let i=0;i<dias.length;i++){
    const toca = (fz<fuerzaN && (i%2===1 || aerN-a<=0)) ? "fuerza" : "aer";
    if(toca==="fuerza"){ fz++; ses.push({dia:dias[i], tipo:"fuerza", t:"Fuerza", min:30, det: pref.includes("fuerza")? "Gimnasio: rutina de cuerpo completo (piernas, empuje, tracción y abdomen), 3 series de 8–12 repeticiones." : "En casa: sentadillas, flexiones (pueden ser con rodillas apoyadas), estocadas y plancha; 3 vueltas de 10–12 repeticiones (la plancha, 30 s)."}); }
    else { const tp=aerTipo[a%aerTipo.length]; a++; ses.push({dia:dias[i], tipo:tp, t:ACT_TXT[tp]||"Actividad aeróbica", min:minAer, det: tp==="correr"? "A un ritmo en el que puedas hablar con frases cortas." : tp==="deporte"? "Partido o entrenamiento con tu equipo." : "A paso rápido, que sientas que respirás más fuerte."}); }
  }
  return {ses, minAer, fuerzaN};
}
function semanaMov(){ let min=0, fuerza=0; for(const k of last7()) for(const e of (DB.dias[k]?.ejercicio||[])){ if(e.tipo==="fuerza") fuerza++; else min+=e.min; } return {min, fuerza}; }
function renderMov(){
  const box=$("#v-mov"); box.replaceChildren();
  const p=planMovimiento(), s=semanaMov();
  box.append(
    el("p",{class:"note",style:"margin:0"},"Basado en la recomendación de la Organización Mundial de la Salud para adultos: entre 150 y 300 minutos semanales de actividad moderada y al menos 2 días de fuerza."),
    el("div",{class:"prog"},
      el("div",{class:"pi"+(s.min>=150?" done":"")}, el("div",{class:"k"},"Actividad aeróbica · 7 días"), el("div",{class:"v"},nf(s.min),el("small",{}," / 150 min")), el("div",{class:"bar"},el("i",{style:`width:${clamp(s.min/150,0,1)*100}%`}))),
      el("div",{class:"pi"+(s.fuerza>=2?" done":"")}, el("div",{class:"k"},"Sesiones de fuerza · 7 días"), el("div",{class:"v"},s.fuerza,el("small",{}," / 2")), el("div",{class:"bar"},el("i",{style:`width:${clamp(s.fuerza/2,0,1)*100}%`})))),
    el("section",{class:"card"}, el("h3",{},"Tu semana de movimiento"),
      el("ul",{class:"log"}, p.ses.map(x=>el("li",{}, el("div",{}, el("div",{class:"s"},x.dia), el("div",{},`${x.t} · ${x.min} min`), el("div",{class:"det"},x.det)))))),
    cardMovRapido());
}

// ==== SEMANA ====
function renderSemana(){
  const box=$("#v-semana"); box.replaceChildren(); const keys=last7(); const M=PLAN.metas;
  let n=0, acc={kcal:0,prot:0,fibra:0,frutas:0,verduras:0,integrales:0}, comidas=0, emo=0, conMotivo=0, sueno=[], rows=[];
  for(const k of keys){ const d=DB.dias[k]; const cs=d?.comidas||[]; const t=totals(cs); const has=cs.length>0;
    if(has){ n++; for(const f in acc) acc[f]+=t[f]; }
    for(const c of cs){ comidas++; if(c.motivo){ conMotivo++; if(c.motivo==="emocion"||c.motivo==="aburrimiento") emo++; } }
    if(d?.sueno?.horas) sueno.push(d.sueno.horas);
    const cls=(v,g)=> !has?"":v>=g?"ok":"low";
    rows.push(el("tr",{}, el("td",{},keyDate(k).toLocaleDateString("es-AR",{weekday:"short",day:"numeric"})+(k===S.today?" (hoy)":"")),
      PLAN.care?null:el("td",{},has?nf(t.kcal):"—"),
      el("td",{class:cls(t.frutas,M.frutas)},has?nf(t.frutas,1):"—"), el("td",{class:cls(t.verduras,M.verduras)},has?nf(t.verduras,1):"—"),
      el("td",{class:cls(t.integrales,M.integrales)},has?nf(t.integrales,1):"—"),
      el("td",{},(d?.ejercicio||[]).reduce((a,e)=>a+e.min,0)||"—"), el("td",{},d?.sueno?.horas? nf(d.sueno.horas,1)+" h":"—")));
  }
  const avg=f=>n? acc[f]/n : 0; const sm=semanaMov(); const sAvg = sueno.length? sueno.reduce((a,b)=>a+b,0)/sueno.length : null;
  const ideas=[];
  if(n && avg("verduras")<M.verduras) ideas.push("Las verduras quedaron por debajo de la meta: sumá media porción de ensalada en el almuerzo y en la cena.");
  if(n && avg("frutas")<M.frutas) ideas.push("Pocas frutas: dejá una a la vista o llevala para la colación.");
  if(sm.min<150) ideas.push(`Te faltan ${nf(150-sm.min)} minutos de actividad para la recomendación semanal: dos caminatas de media hora alcanzan para acercarte.`);
  if(sAvg!=null && sAvg<7) ideas.push("Dormiste menos de 7 horas en promedio. Dormir poco aumenta el hambre y las ganas de comer cosas dulces; probá adelantar media hora la hora de acostarte.");
  if(conMotivo>=4 && emo/conMotivo>=0.3) ideas.push(`En ${emo} de ${conMotivo} comidas el motivo fue la ansiedad, el estrés o el aburrimiento. Antes de comer en esos momentos, probá una pausa de dos minutos: un vaso de agua, respirar o salir a caminar un rato. Si pasa seguido y te pesa, conversarlo con un profesional ayuda.`);
  if(!ideas.length && n) ideas.push("Vas bien: mantené lo que está funcionando.");
  box.append(
    el("div",{class:"prog"},
      el("div",{class:"pi"},el("div",{class:"k"},"Días registrados"),el("div",{class:"v"},n,el("small",{}," / 7"))),
      PLAN.care?null:el("div",{class:"pi"},el("div",{class:"k"},"Energía promedio"),el("div",{class:"v"},n?nf(avg("kcal")):"—",el("small",{}," kcal"))),
      el("div",{class:"pi"},el("div",{class:"k"},"Actividad"),el("div",{class:"v"},nf(sm.min),el("small",{}," / 150 min"))),
      el("div",{class:"pi"},el("div",{class:"k"},"Sueño promedio"),el("div",{class:"v"},sAvg!=null?nf(sAvg,1):"—",el("small",{}," h"))),
      el("div",{class:"pi"},el("div",{class:"k"},"Comidas por emoción"),el("div",{class:"v"},conMotivo?nf(emo/conMotivo*100)+"%":"—",el("small",{},conMotivo?` de ${conMotivo}`:"")))),
    el("section",{class:"card"}, el("h3",{},"Para esta semana"), ideas.length? el("ul",{class:"ideas"}, ideas.map(t=>el("li",{},t))) : el("p",{class:"note",style:"margin:0"},"Registrá algunos días para ver sugerencias.")),
    el("section",{class:"card"}, el("h3",{},"Últimos 7 días"),
      el("div",{class:"tbl"}, el("table",{}, el("thead",{},el("tr",{}, ["Día",PLAN.care?null:"kcal","Frutas","Verd.","Integ.","Mov. (min)","Sueño"].filter(Boolean).map(h=>el("th",{scope:"col"},h)))), el("tbody",{},rows))),
      el("p",{class:"note",style:"margin:10px 0 0"},"Todos los valores son aproximados. Los promedios solo cuentan los días con registro.")));
}

// ==== HISTORIAL ====
function renderHistorial(){
  const box=$("#v-historial"); box.replaceChildren();
  const keys=Object.keys(DB.dias).filter(k=>{ const d=DB.dias[k]; return (d.comidas||[]).length||(d.ejercicio||[]).length||d.sueno?.horas; }).sort().reverse();
  if(!keys.length){ box.append(el("p",{class:"note"},"Todavía no hay registros.")); return; }
  for(const k of keys){ const d=DB.dias[k];
    box.append(el("section",{class:"card"}, el("h3",{}, cap(keyDate(k).toLocaleDateString("es-AR",{weekday:"long",day:"numeric",month:"long"}))+(k===S.today?" · hoy":"")),
      (d.comidas||[]).length? el("ul",{class:"log"}, ordenar(d.comidas).map(c=>logItem(c,false))) : null,
      (d.ejercicio||[]).length? el("p",{class:"note",style:"margin:8px 0 0"},"Movimiento: "+d.ejercicio.map(e=>`${ACT_TXT[e.tipo]||"Actividad"} ${e.min} min`).join(" · ")) : null,
      d.sueno?.horas? el("p",{class:"note",style:"margin:4px 0 0"},`Sueño: ${nf(d.sueno.horas,1)} h, ${String(d.sueno.calidad).replace("_"," ")}`) : null));
  }
}

// ==== RECETARIO ====
function renderRecetario(){
  const box=$("#v-recetario"); box.replaceChildren();
  box.append(el("p",{class:"note",style:"margin:0"},"Tu recetario, filtrado según lo que comés, tu cocina y tu tiempo. Las cantidades se ajustan a tu energía diaria en la pestaña Hoy."));
  for(const [pool,t] of [["d","Desayuno o merienda"],["c","Colaciones"],["p","Almuerzo o cena"]]){
    if(pool==="c" && !slotsHoy().some(s=>s[0]==="col")) continue;
    if(pool==="d" && !slotsHoy().some(s=>s[0]==="des"||s[0]==="mer")) continue;
    const list=recetasDe(pool);
    box.append(el("section",{class:"rgroup"}, el("h3",{},`${t} · ${list.length} opciones`),
      list.map(r=>{ const nn=nutr(r); return el("details",{class:"rec"}, el("summary",{}, el("span",{},r.n), el("span",{}, r.t? r.t+" min":"sin cocción")),
        el("div",{class:"tags"}, PLAN.care?null:el("span",{class:"tag"},`${nf(nn.kcal)} kcal base`), nn.vitC? el("span",{class:"tag c"},"vitamina C"):null, nn.roja? el("span",{class:"tag r"},"carne roja"):null),
        ingRows(r,1), el("ol",{class:"steps"}, r.pasos.map(p=>el("li",{},p)))); })));
  }
}

// ==== PERFIL Y PRIVACIDAD ====
function renderPerfil(){
  const box=$("#v-perfil"); box.replaceChildren(); const P=PLAN;
  const resumen=[];
  for(const q of PREGUNTAS){ if(q.type==="numbers" || q.type==="datos") continue; const v=ans(q.id); if(v==null) continue;
    const lab=x=> x==="otro"? (DB.perfil.resp[q.id+"_otro"]||"Otro") : (q.opts.find(o=>o[0]===x)||[,x])[1];
    resumen.push(el("li",{}, el("div",{}, el("div",{class:"s"},q.t), el("div",{}, Array.isArray(v)? (v.length? v.map(lab).join(", "):"Nada") : lab(v))))); }
  const c=DB.perfil.resp.cuerpo||{}, dp=DB.perfil.resp.datos||{};
  box.append(
    el("section",{class:"card hero"}, el("div",{class:"label"},"Tu plan"),
      P.care? el("p",{},"Modo cuidado: sin calorías ni metas numéricas. El foco está en comer variado, en horarios regulares y en cómo te sentís.")
        : el("div",{class:"meta",style:"margin-top:8px"}, el("span",{},el("b",{},nf(P.kcal))," kcal por día de referencia"), el("span",{},el("b",{},nf(P.prot))," g de proteína como mínimo")),
      el("div",{class:"meta",style:"margin-top:8px"}, el("span",{},ESTRUCTURAS[P.est].n), ...slotsHoy().map(([k])=>el("span",{},`${SLOTDEF[k].n} ${P.horas[k]} h`))),
      el("p",{class:"note",style:"margin:10px 0 0"},"La energía se estima con la ecuación de Mifflin-St Jeor y tu nivel de actividad. Es una referencia: si tu peso cambia sin que lo busques, actualizá tus datos.")),
    el("section",{class:"card"}, el("h3",{},"Tus respuestas"),
      (dp.nombre||dp.email)? el("p",{style:"margin:0 0 4px"},[dp.nombre,dp.apellido].filter(Boolean).join(" ")+(dp.email?` · ${dp.email}`:"")) : null,
      el("p",{class:"note",style:"margin:0 0 6px"},`${c.edad||"—"} años · ${c.altura||"—"} cm · ${c.peso||"—"} kg`),
      el("ul",{class:"log"}, resumen),
      el("div",{class:"row",style:"margin-top:12px"}, el("button",{class:"btn small",type:"button",onclick:()=>{ DB.perfil.completo=false; ONB.i=0; persist(); render(); }},"Editar respuestas"))),
    seccionAvisos(), seccionPrivacidad(),
    el("section",{class:"card"}, el("h3",{},"Tu cuenta"), el("p",{style:"margin:0 0 10px"},`Entraste como ${DB.auth?.user?.email||"—"}. Si cerrás sesión, tus datos quedan guardados en tu cuenta y los recuperás al volver a entrar.`),
      el("button",{class:"btn small",type:"button",onclick:async ev=>{ ev.currentTarget.disabled=true; await cerrarSesion(); }},"Cerrar sesión")),
    el("p",{class:"enlace-baja"}, el("a",{href:"#eliminar-cuenta"},"Eliminar mi cuenta")));
}
function seccionPrivacidad(){
  const msg=el("p",{class:"note",id:"privMsg",style:"margin:8px 0 0"});
  const file=el("input",{type:"file",id:"impFile",accept:"application/json",hidden:true});
  file.addEventListener("change",async()=>{ try{ const t=await file.files[0].text(); const x=JSON.parse(t); if(!x||!x.dias||!x.perfil) throw 0; const {avisos, auth, cuentaId, consent}=DB; DB=x; Object.assign(DB,{avisos, auth, cuentaId, consent}); persist(); msg.textContent="Copia restaurada."; render(); }catch(e){ msg.textContent="El archivo no es una copia válida de la app."; } });
  return el("section",{class:"card"}, el("h3",{},"Privacidad y datos"),
    el("p",{style:"margin:0 0 8px"}, `Aceptaste los términos y condiciones el ${new Date(DB.consent.fecha).toLocaleDateString("es-AR",{day:"numeric",month:"long",year:"numeric"})}. Tus registros se guardan en tu cuenta y en la base de datos de Pulso, como explican los términos.`),
    el("div",{class:"row"},
      el("button",{class:"btn small",type:"button",onclick:()=>{ try{ const a=el("a",{href:URL.createObjectURL(new Blob([JSON.stringify(DB,null,1)],{type:"application/json"})),download:"copia-pulso-"+S.today+".json"}); document.body.append(a); a.click(); a.remove(); msg.textContent="Copia descargada."; }catch(e){ msg.textContent="No se pudo descargar la copia en este navegador."; } }},"Descargar copia"),
      el("button",{class:"btn small",type:"button",onclick:()=>file.click()},"Restaurar copia"), file),
    msg, el("details",{class:"rec",style:"margin-top:12px"}, el("summary",{},el("span",{},"Términos y política de privacidad")), terminos()));
}
function terminos(){
  return el("div",{class:"legal"},
    el("p",{},el("b",{},"Borrador para revisión legal.")," Pulso es una herramienta de bienestar general. No reemplaza la consulta con profesionales de la salud ni da diagnósticos."),
    el("p",{},"Para usar Pulso tenés que crear una cuenta con tu mail y aceptar estos términos. Al aceptarlos, se envían a una base de datos del equipo de Pulso tus respuestas al cuestionario (salvo la pregunta sobre tu relación con la comida), el tiempo que tardaste en cada pregunta, tus comidas, tu actividad, tu descanso y cuándo y por cuánto tiempo usás la app. Estos datos quedan vinculados a tu cuenta: el equipo de Pulso puede saber de quién es cada registro."),
    el("p",{},"Textos libres: lo que escribas en campos de texto —por ejemplo, la descripción de una comida en «Comí otra cosa» o las respuestas «Otro»— se envía tal cual lo escribiste. No incluyas nombres ni datos que te identifiquen. La única excepción es la respuesta «Otro» sobre tu relación con la comida, que nunca sale de tu dispositivo."),
    el("p",{},"Tu cuenta guarda tu nombre, tu apellido, tu mail y una copia de tus respuestas y tus registros, para que los recuperes al volver a entrar o desde otro dispositivo. Tu mail también se usa para enviarte el código de ingreso y novedades de Pulso, invitarte a encuestas o estudios y responder tus consultas o pedidos de acceso y borrado."),
    el("p",{},"Si eliminás tu cuenta (Perfil › Eliminar mi cuenta), antes te pedimos que respondas cinco preguntas sobre tu experiencia, que se conservan. Después borramos tu nombre, tu apellido, tu mail y la copia de tu cuenta. Tus registros y tus respuestas se conservan como datos generales, sin nada que los vincule a vos, para mejorar la app. Si querés que también se borren tus registros, pedilo escribiendo a "+CONFIG.CONTACTO+"."),
    el("p",{},"Para qué: entender cómo se usa la app y mejorar sus recomendaciones. No se venden ni se ceden a terceros."),
    el("p",{},"Recordatorios (opcionales, independientes de compartir datos): si los activás, guardamos en nuestro servidor la dirección de notificaciones de tu dispositivo, los horarios de tus comidas, tu zona horaria y qué momentos del día ya registraste (no qué comiste), con un código distinto del de los datos anónimos. Se usan solo para enviarte los avisos; las marcas diarias se borran a los pocos días y todo se borra al desactivarlos. Para enviarlos se usan los servicios de notificaciones de Apple, Google, Mozilla o Microsoft, según tu dispositivo."),
    el("p",{},"Algunos de estos datos son de salud y la Ley 25.326 de Protección de Datos Personales los considera sensibles. Para ejercer tus derechos de acceso, rectificación o supresión, escribí a "+CONFIG.CONTACTO+"."));
}

// ==== CUESTIONARIO (UI) ====
const ONB = {i:-1, draft:null, tiempos:{}};
// Tiempo que la persona tarda en cada pregunta (sin contar el tiempo con la app en segundo plano).
const CRONO = {id:null, desde:0};
function cronoMarcar(id){
  const ahora=performance.now();
  if(CRONO.id && CRONO.desde) ONB.tiempos[CRONO.id]=(ONB.tiempos[CRONO.id]||0)+(ahora-CRONO.desde);
  CRONO.id=id; CRONO.desde= id && !document.hidden ? ahora : 0;
}
document.addEventListener("visibilitychange",()=>{ if(!CRONO.id) return; if(document.hidden){ cronoMarcar(CRONO.id); cuentaParar(); } else CRONO.desde=performance.now(); });

// Cuenta regresiva de las preguntas de varias opciones: barra verde al pie; al terminar, pasa a la siguiente.
const CUENTA_MS=5000; let cuentaT=null;
function cuentaParar(){
  clearTimeout(cuentaT); cuentaT=null;
  const b=$("#cuenta"), i=b.querySelector("i"); b.hidden=true; i.style.transition="none"; i.style.width="0";
}
function cuentaIniciar(alTerminar){
  cuentaParar();
  const b=$("#cuenta"), i=b.querySelector("i"); b.hidden=false; void i.offsetWidth;
  i.style.transition=`width ${CUENTA_MS}ms linear`; i.style.width="100%";
  cuentaT=setTimeout(()=>{ cuentaParar(); alTerminar(); }, CUENTA_MS);
}

function renderOnb(){
  const box=$("#onb"); box.replaceChildren(); cuentaParar();
  if(!ONB.draft) ONB.draft = JSON.parse(JSON.stringify(DB.perfil?.resp||{}));
  const R=ONB.draft; const total=PREGUNTAS.length;
  if(ONB.paso==="avisos"){ cronoMarcar(null); renderOfertaAvisos(box); return; }
  if(!DB.auth && ONB.paso!=="instalar" && (DB.perfil?.completo || ONB.i>=0)) ONB.paso="ingreso";
  if(ONB.paso==="ingreso"){ cronoMarcar(null); renderIngreso(box); return; }
  if(DB.perfil?.completo && !DB.consent?.acepta && !ONB.soloDatos) ONB.i=total;   // perfil de una versión anterior: falta aceptar los términos
  if(ONB.i<0){
    cronoMarcar(null);
    if(ONB.paso==="instalar"){ renderInstalar(box); return; }
    const inst=necesitaInstalar();
    box.append(el("div",{class:"onb-card"}, el("div",{class:"eyebrow"},"Bienvenida"), el("h1",{},"Pulso"),
      el("p",{class:"lead"},"Comer, moverte y descansar mejor, con un plan hecho para vos."),
      el("p",{},"Pulso te sugiere qué comer según tus horarios, tus gustos y tu cocina; arma tu semana de movimiento y te ayuda a registrar cómo dormís y cómo te sentís con la comida."),
      el("p",{},"Es gratis y no necesita cuenta."),
      el("p",{class:"note"}, inst? "Primero vas a agregarla a tu pantalla de inicio; después, "+total+" preguntas rápidas para armar tu plan." : "Para armar tu plan, "+total+" preguntas rápidas: casi todas se responden con un toque."),
      el("button",{class:"btn primary big",type:"button",onclick:()=>{ if(inst) ONB.paso="instalar"; else if(!DB.auth) ONB.paso="ingreso"; else ONB.i=0; renderOnb(); window.scrollTo(0,0); }},"Empezar")));
    return;
  }
  if(ONB.i>=total){ cronoMarcar(null); if(DB.consent?.acepta){ finalizarCuestionario(); return; } renderConsent(box); return; }
  const q=PREGUNTAS[ONB.i]; cronoMarcar(q.id);
  const next=()=>{ if(ONB.soloDatos && q.type==="datos"){ ONB.soloDatos=false; ONB.i=total; } else ONB.i++; renderOnb(); window.scrollTo(0,0); };
  const atras=()=>{ ONB.i--; renderOnb(); };
  const prog=el("div",{class:"onb-prog"}, el("i",{style:`width:${(ONB.i/total)*100}%`}));
  const card=el("div",{class:"onb-card"}, prog, el("div",{class:"eyebrow"},`${q.sec} · ${ONB.i+1} de ${total}`), el("h2",{},q.t), q.sub? el("p",{class:"note"},q.sub):null);
  const otroIn=el("input",{type:"text",id:"q-"+q.id+"-otro",placeholder:"Escribilo",value:R[q.id+"_otro"]||""}); otroIn.addEventListener("input",()=>{ R[q.id+"_otro"]=otroIn.value; ok(); });
  otroIn.addEventListener("blur",()=>ok());
  const sig=el("button",{class:"btn primary",type:"button",onclick:next},"Siguiente");
  let tocado=false;
  const ok=()=>{ let v=R[q.id];
    if(q.type==="datos"){ const d=R.datos||{}; sig.disabled = !(d.nombre && d.apellido && EMAIL_RE.test(d.email||"")); return; }
    if(q.type==="numbers"){ const c=R.cuerpo||{}; sig.disabled = !q.fields.every(([k,,,mn,mx])=>+c[k]>=mn && +c[k]<=mx); return; }
    const conOtro = Array.isArray(v)? v.includes("otro") : v==="otro";
    otroWrap.hidden=!conOtro;
    sig.disabled = q.type==="multi" ? !(v&&v.length) || (conOtro && !otroIn.value.trim()) : !v || (conOtro && !otroIn.value.trim());
    if(q.type==="multi"){ if(tocado && !sig.disabled && document.activeElement!==otroIn) cuentaIniciar(next); else cuentaParar(); } };
  const otroWrap=el("div",{class:"otro-wrap"}, otroIn);
  const nav=(...extra)=>el("div",{class:"row onb-nav"}, ONB.i>0? el("button",{class:"btn ghost",type:"button",onclick:atras},"Atrás"):null, ...extra, sig);
  if(q.type==="datos"){
    R.datos=R.datos||{}; if(DB.auth?.user?.email) R.datos.email=DB.auth.user.email;
    const campos=[["nombre","Nombre","text","given-name"],["apellido","Apellido","text","family-name"],["email","Mail","email","email"]];
    card.append(el("div",{class:"campos"}, campos.map(([k,lab,tipo,ac])=>{
      const inp=el("input",{type:tipo,id:"q-"+k,autocomplete:ac,value:R.datos[k]||"",autocapitalize:tipo==="email"?"off":"words",inputmode:tipo==="email"?"email":false,spellcheck:"false",readonly:tipo==="email" && !!DB.auth});
      inp.addEventListener("input",()=>{ R.datos[k]=inp.value.trim(); ok(); });
      return el("label",{class:"campo",for:"q-"+k}, el("span",{},lab), inp); })));
    card.append(nav()); box.append(card); ok(); return;
  }
  if(q.type==="numbers"){
    R.cuerpo=R.cuerpo||{};
    card.append(el("div",{class:"nums"}, q.fields.map(([k,lab,un,mn,mx])=>{ const inp=el("input",{type:"number",id:"q-"+k,inputmode:"decimal",min:String(mn),max:String(mx),value:R.cuerpo[k]??""});
      inp.addEventListener("input",()=>{ R.cuerpo[k]=inp.value; ok(); });
      return el("label",{class:"num",for:"q-"+k}, el("span",{},lab), el("span",{class:"numrow"}, inp, el("small",{},un))); })));
    card.append(nav()); box.append(card); ok(); return;
  }
  const opts=el("div",{class:"choices"});
  const draw=()=>{ opts.replaceChildren(...q.opts.concat([["otro","Otro"]]).map(([v,t])=>{
    const sel = q.type==="multi" ? (R[q.id]||[]).includes(v) : R[q.id]===v;
    return el("button",{type:"button",class:"choice"+(sel?" on":""),"aria-pressed":String(sel),onclick:()=>{
      if(q.type==="multi"){ let a=(R[q.id]||[]).slice(); if(a.includes(v)) a=a.filter(x=>x!==v); else a.push(v); R[q.id]=a; tocado=true; draw(); ok(); }
      else { R[q.id]=v; draw(); ok(); if(v!=="otro") setTimeout(next,160); else otroIn.focus(); } }}, t); })); };
  draw();
  card.append(opts, otroWrap, nav(q.type==="multi" ? el("button",{class:"btn ghost",type:"button",onclick:()=>{ R[q.id]=[]; next(); }},"Ninguna") : null));
  box.append(card); ok();
}
// Términos y condiciones: obligatorios para entrar, al final del cuestionario.
function renderConsent(box){
  const aviso=el("div",{class:"aviso-tyc",role:"alert",hidden:!ONB.rechazo},"Para usar Pulso tenés que aceptar los términos y condiciones. Mientras no los aceptes, no podés entrar.");
  box.append(el("div",{class:"onb-card"}, el("div",{class:"onb-prog"}, el("i",{style:"width:100%"})),
    el("div",{class:"eyebrow"},"Último paso"), el("h2",{},"Términos y condiciones"),
    el("p",{},"¿Aceptás los términos y condiciones de Pulso?"),
    el("details",{class:"rec"}, el("summary",{},el("span",{},"Leer los términos y condiciones")), terminos()),
    aviso,
    el("button",{class:"btn primary big",type:"button",onclick:()=>{ ONB.rechazo=false; finalizarCuestionario(); }},"Acepto"),
    el("button",{class:"btn ghost",type:"button",onclick:()=>{ ONB.rechazo=true; aviso.hidden=false; aviso.scrollIntoView({block:"center",behavior:"smooth"}); }},"No acepto"),
    DB.perfil?.completo? null : el("button",{class:"btn link",type:"button",onclick:()=>{ ONB.rechazo=false; ONB.i--; renderOnb(); }},"Atrás")));
}
function finalizarCuestionario(){
  const ahora=new Date().toISOString();
  const tiempos=Object.fromEntries(Object.entries(ONB.tiempos).map(([k,v])=>[k, Math.round(v/100)/10]));
  DB.perfil={resp:ONB.draft||DB.perfil.resp, completo:true, actualizado:ahora, creado:DB.perfil?.creado||ahora, tiempos};
  if(!DB.consent?.acepta) DB.consent={acepta:true, share:true, fecha:ahora, version:CONFIG.APP_VERSION};
  ONB.draft=null; ONB.i=-1; ONB.tiempos={}; S.view="hoy"; S.slot=null; persist();
  enviar("perfil", perfilCompartible());
  respaldoPronto(true);
  if(DB.avisos?.on) sincronizarAvisos(); else if(!DB.avisoOfrecido && estadoAvisos()==="off") ONB.paso="avisos";
  render(); window.scrollTo(0,0);
}

// ==== ARRANQUE ====
{ const m=new URLSearchParams(location.search).get("momento"); if(m && SLOTDEF[m]){ S.slot=m; S.view="hoy"; } if(location.search) history.replaceState(null,"",location.pathname); }
sesionIniciar();
render();
flushSoon();
sincronizarAvisos();
setInterval(()=>{ const k=dayKey(new Date()); if(k!==S.today){ S.today=k; S.slot=null; S.offsets={}; render(); } },60000);
