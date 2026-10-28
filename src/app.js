// ==== CUESTIONARIO INICIAL ====
// Cada pregunta: 4 opciones + «Otro» (con texto). type: single | multi | numbers
const PREGUNTAS = [
  {id:"sexo", sec:"Vos", t:"¿Con qué sexo te identificás?", sub:"Se usa solo para estimar tu gasto de energía.", type:"single",
   opts:[["h","Hombre"],["m","Mujer"],["pnd","Prefiero no decirlo"]], sinOtro:true, viejas:[["nb","No binario"]]},
  {id:"cuerpo", sec:"Vos", t:"Tus datos físicos", sub:"Con esto se calcula tu energía diaria. Quedan guardados en tu dispositivo.", type:"numbers",
   fields:[["edad","Edad","años",14,100],["altura","Altura","cm",120,220],["peso","Peso","kg",35,250]]},
  {id:"objetivo", sec:"Objetivo", t:"¿Qué querés lograr?", type:"single",
   opts:[["salud","Mejorar mi salud en general"],["bajar","Bajar grasa"],["ganar","Ganar músculo"],["energia","Tener más energía en el día"]]},
  {id:"actividad", sec:"Objetivo", t:"¿Cuánto te movés hoy?", type:"single",
   opts:[["sed","Casi nada: paso sentado la mayor parte del día"],["lig","Poco: camino o entreno 1 o 2 días"],["mod","Bastante: entreno 3 o 4 días"],["alt","Mucho: entreno 5 días o más"]]},
  {id:"patron", sec:"Alimentación", t:"¿Cómo comés?", type:"single",
   opts:[["omni","Como de todo"],["flex","Mayormente vegetal, con algo de carne"],["veg","Vegetariano"],["vegano","Vegano"]]},
  {id:"restric", sec:"Alimentación", t:"¿Tenés alguna restricción por salud?", sub:"Podés marcar varias.", type:"multi",
   opts:[["gluten","Celiaquía o sin gluten"],["lactosa","Intolerancia a la lactosa"],["mani","Alergia al maní"],["nuez","Alergia a frutos secos"],["huevo","Alergia al huevo"],["pescado","Alergia al pescado"],["marisco","Alergia a los mariscos"]]},
  {id:"nocome", sec:"Alimentación", t:"¿Qué no comés porque no te gusta?", sub:"Podés marcar varias.", type:"multi",
   opts:[["pescado","Pescado"],["cerdo","Carne de cerdo"],["legumbre","Legumbres"],["lacteo","Lácteos"],["pan","Pan"]]},
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
  {id:"bebida", sec:"Tus gustos", t:"¿Qué tomás con las comidas?", type:"single",
   opts:[["agua","Agua"],["gaseosa","Gaseosa común"],["zero","Gaseosa sin azúcar"],["jugo","Jugos"]]},
  {id:"equipo", sec:"Tu cocina", t:"¿Con qué cocinás?", sub:"Podés marcar varios.", type:"multi",
   opts:[["hornalla","Hornallas"],["horno","Horno"],["freidora","Freidora de aire"],["microondas","Microondas"]]},
  {id:"tiempo", sec:"Tu cocina", t:"¿Cuánto tiempo querés dedicarle a cocinar por comida?", type:"single",
   opts:[["15","Menos de 15 minutos"],["30","Entre 15 y 30 minutos"],["60","Entre 30 y 60 minutos"],["tandas","Cocino por tandas, una o dos veces por semana"]]},
  {id:"presupuesto", sec:"Tu cocina", t:"¿Cómo es tu presupuesto para comida?", type:"single",
   opts:[["ajustado","Ajustado"],["moderado","Moderado"],["holgado","Holgado"],["pnd","Prefiero no decirlo"]]},
  {id:"mov", sec:"Movimiento", t:"¿Qué tipo de actividad te gusta?", sub:"Podés marcar varias.", type:"multi",
   opts:[["caminar","Caminar"],["correr","Correr"],["fuerza","Gimnasio o fuerza"],["deporte","Deportes en equipo"]]},
  {id:"entreno", sec:"Movimiento", t:"¿Entrenás en un horario fijo?", sub:"Con esto te sugerimos qué comer antes y después de entrenar.", type:"single", sinOtro:true,
   opts:[["manana","Sí, a la mañana"],["mediodia","Sí, al mediodía"],["tarde","Sí, a la tarde"],["noche","Sí, a la noche"],["variable","Entreno, pero sin horario fijo"],["no","No entreno"]]},
  {id:"entrenoDias", sec:"Movimiento", t:"¿Qué días entrenás?", sub:"Podés marcar varios.", type:"multi", sinOtro:true, sinNinguna:true, si:R=>!!HORA_ENTRENO[R.entreno],
   opts:[["1","Lunes"],["2","Martes"],["3","Miércoles"],["4","Jueves"],["5","Viernes"],["6","Sábado"],["0","Domingo"]]},
  {id:"sueno", sec:"Descanso", t:"¿Cuánto dormís en una noche normal?", type:"single",
   opts:[["5","Menos de 6 horas"],["6.5","Entre 6 y 7 horas"],["7.5","Entre 7 y 8 horas"],["8.5","Más de 8 horas"]]},
  {id:"cicloApp", sec:"Tu ciclo", t:"¿Usás alguna app para seguir tu ciclo menstrual?", sub:"Es opcional. Sirve para acompañarte en los días previos a tu período, cuando son más comunes los antojos. Lo podés cambiar en Perfil.", type:"single", sinOtro:true, si:R=>R.sexo==="m",
   opts:[["flo","Flo"],["clue","Clue"],["salud","Salud de Apple"],["otra","Otra app"],["ninguna","No uso ninguna"],["off","Prefiero no usar esta función"]]},
  {id:"ciclo", sec:"Tu ciclo", t:"¿Cuándo empezó tu último período?", sub:"Con esto estimamos las fechas siguientes. Si tus ciclos son irregulares, igual sirve como referencia.", type:"ciclo", si:R=>R.sexo==="m" && R.cicloApp && R.cicloApp!=="off"},
  {id:"relacion", sec:"Bienestar", t:"¿Cómo describirías tu relación con la comida?", sub:"Nos ayuda a cuidarte. Esta respuesta queda solo en tu dispositivo.", type:"single",
   opts:[["tranquila","Tranquila, sin problemas"],["emocional","A veces como por ansiedad, estrés o aburrimiento"],["control","Me genera culpa o necesito controlarla mucho"],["tca","Tuve o tengo un trastorno de la conducta alimentaria"]]},
];

const HORA_ENTRENO = {manana:8, mediodia:13, tarde:18, noche:20};   // hora de inicio supuesta de cada franja
const visible = (q,R) => !q.si || q.si(R);

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
  // Modo cuidado (menores de 18 o relación difícil con la comida): la app no muestra calorías. Todo lo demás es igual.
  const care = edad<18 || r.relacion==="control" || r.relacion==="tca";
  const s = r.sexo==="h"? 5 : r.sexo==="m"? -161 : -78;
  const bmr = 10*peso + 6.25*alt - 5*edad + s;
  const fa = {sed:1.2, lig:1.375, mod:1.55, alt:1.725}[r.actividad] || 1.375;
  let kcal = bmr*fa;
  const obj = r.objetivo;
  if(obj==="bajar") kcal = Math.max(kcal*0.85, bmr*1.1);
  if(obj==="ganar") kcal *= 1.10;
  kcal = Math.round(kcal/50)*50;
  const protKg = (obj==="bajar"||obj==="ganar") ? 1.6 : 1.0;
  const excl = new Set();
  const pat=r.patron;
  if(pat==="veg"||pat==="vegano") ["vacuna","cerdo","pollo","pescado"].forEach(g=>excl.add(g));
  if(pat==="vegano") ["huevo","lacteo"].forEach(g=>excl.add(g));
  for(const x of (r.restric||[])){ if(["gluten","mani","nuez","huevo","pescado","marisco"].includes(x)) excl.add(x); }
  for(const x of (r.nocome||[])){ if(["pescado","cerdo","legumbre","lacteo"].includes(x)) excl.add(x); }
  if(r.pan==="no" || (r.nocome||[]).includes("pan")) excl.add("pan");   // r.pan: pregunta de marcas de versiones anteriores
  let eq = new Set((r.equipo||[]).filter(x=>x!=="otro")); if(!eq.size) eq=new Set(["hornalla"]);
  const tmax = r.tiempo==="15"?15 : r.tiempo==="30"?30 : r.tiempo==="60"?60 : r.tiempo==="tandas"?60 : 40;
  const est = ESTRUCTURAS[r.estructura] ? r.estructura : "damc";
  const hAlm = +r.hAlm || 13, hCen = +r.hCen || 21;
  const horas = {des:"8:30", col:"10:30", alm:hAlm+":00", mer:Math.round((hAlm+hCen)/2)+":00", cen:hCen+":00"};
  const hE=HORA_ENTRENO[r.entreno]; const hm=h=>Math.floor(h)+":"+pad(Math.round((h%1)*60));
  if(hE){ horas.pre=hm(hE-1.5); horas.post=hm(hE+1.5); }   // antes: 1 h 30 min antes; después: al terminar (se supone 1 h de entreno)
  return { care, edad, peso, kcal, prot:Math.round(peso*protKg), excl, eq, tmax, est, horas, entrenoDias: hE? (r.entrenoDias||[]) : [],
    pan: PANES[DB.marcas?.pan] || PANES[r.pan] || PANES.generico, sinLactosa:(r.restric||[]).includes("lactosa"),
    metas:{grasaMin:Math.round(kcal*0.2/9), frutas:2, verduras:3, integrales:excl.has("gluten")?2:3, nueces:excl.has("nuez")?0:1, rojaSem:2, movMin:150, fuerza:2, sueno:7},
    flex: pat==="flex", budget:r.presupuesto, platos:r.platos||[], prefMov:(r.mov||[]).filter(x=>x!=="otro") };
}
let PLAN = null;

// ==== RECETAS: aplicar el pan elegido y filtrar por perfil ====
function ingOf(id){
  if(id==="pan" && PLAN){ return {...ING.pan, ...PLAN.pan, g:["gluten"], pan:true}; }
  const m=marcaDeIng(id); return m? {...ING[id], k:m.k, p:m.p, f:m.f, hc:m.hc, gr:m.gr} : ING[id];
}
function escala(x,f){ if(f>1 && x.fijo) return 1; if(f>1 && x.pr) return Math.min(f,1.15); return f; }
function nutr(rec, factor){
  factor = factor || 1;
  let k=0,p=0,hc=0,gr=0,fib=0,veg=0,fruta=0,integ=0,nuez=false,vitC=false,roja=false,atun=false;
  for(const [id,g,esc] of rec.i){
    const x=ingOf(id); const gg = esc ? g*escala(x,factor) : g;
    k+=x.k*gg/100; p+=x.p*gg/100; hc+=(x.hc||0)*gg/100; gr+=(x.gr||0)*gg/100; fib+=x.f*gg/100;
    if(x.veg) veg+=gg; if(x.fruta) fruta+=gg; if(x.integral) integ+=gg;
    if(x.nuez && gg>=15) nuez=true; if(x.vitC && gg>=60) vitC=true; if(x.roja) roja=true; if(x.atun) atun=true;
  }
  return {kcal:Math.round(k), prot:Math.round(p), carb:Math.round(hc), grasa:Math.round(gr), fibra:Math.round(fib),
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
// Momentos del día: los de la estructura elegida y, los días de entreno (o después de registrar movimiento), antes y después de entrenar.
function slotsHoy(){
  const base=ESTRUCTURAS[PLAN.est].slots.slice(), d=DB.dias[S.today];
  const entrena = PLAN.entrenoDias.includes(String(keyDate(S.today).getDay()));
  if(entrena) base.push(["pre",.08]);
  if(entrena || d?.postHora) base.push(["post",.10]);
  const hr=k=>{ const [a,b]=PLAN.horas[k].split(":").map(Number); return a+b/60; };
  return base.sort((x,y)=>hr(x[0])-hr(y[0]));
}
function slotNow(){
  const h=new Date().getHours()+new Date().getMinutes()/60; const sl=slotsHoy().map(s=>s[0]);
  const hr = k=>{ const [a,b]=PLAN.horas[k].split(":").map(Number); return a+b/60; };
  if(h<4) return sl[sl.length-1];
  let best=sl[0]; for(const k of sl){ if(h >= hr(k)-1.5) best=k; } return best;
}
function totals(comidas){
  const t={kcal:0,prot:0,carb:0,grasa:0,fibra:0,verduras:0,frutas:0,integrales:0,nueces:0,vitC:false,roja:0,atun:0,sinEstimar:0};
  for(const c of comidas||[]){ if(c.kcal==null){ t.sinEstimar++; continue; }
    t.kcal+=c.kcal; t.prot+=c.prot||0; t.carb+=c.carb||0; t.grasa+=c.grasa||0; t.fibra+=c.fibra||0; t.verduras+=c.verduras||0; t.frutas+=c.frutas||0; t.integrales+=c.integrales||0;
    t.nueces+=c.nueces||0; if(c.vitC) t.vitC=true; if(c.roja) t.roja++; if(c.atun) t.atun++; }
  return t;
}
function last7(){ return Array.from({length:7},(_,i)=>keyShift(S.today,i-6)); }
function weekCount(field){ let n=0; for(const k of last7()) for(const c of (DB.dias[k]?.comidas||[])) if(c[field]) n++; return n; }
function exKcal(k){ return (day(k).ejercicio||[]).reduce((a,e)=>a+(e.kcal||0),0) + (saludDia(k||S.today)?.entrenos||[]).reduce((a,e)=>a+(e.kcal||0),0); }
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
document.addEventListener("visibilitychange",()=>{ if(document.hidden){ sesionPausar(); DB.cerradaDesde=Date.now(); persist(); } else { sesionIniciar(); if(movAlVolver() && S.view==="hoy") render(); delete DB.cerradaDesde; persist(); } });
window.addEventListener("pagehide",()=>{ sesionPausar(); DB.cerradaDesde=Date.now(); persist(); });
setInterval(()=>{ if(DB.sesion && !DB.sesion.fin && !document.hidden){ DB.sesion.ultimo=Date.now(); persist(); } }, 30000);

// ==== REGISTRO ====
function addComida(e){ const c={id:uid(), hora:new Date().toISOString(), ...e}; day().comidas.push(c); persist(); enviar("comida", c); marcarAviso(S.today, c.slot, true); render(); }
function delComida(id, k){ const d=day(k); const slot=d.comidas.find(c=>c.id===id)?.slot; d.comidas=d.comidas.filter(c=>c.id!==id); persist(); enviar("comida_borrada",{id},k);
  if(slot && !d.comidas.some(c=>c.slot===slot)) marcarAviso(k||S.today, slot, false); render(); }
function addEjercicio(e){ const x={id:uid(), hora:new Date().toISOString(), ...e}; const d=day(); d.ejercicio.push(x);
  if(!d.postHora){ const t=new Date(); d.postHora=t.getHours()+":"+pad(t.getMinutes()); S.slot="post"; }   // se ofrece el «Después de entrenar»
  persist(); enviar("ejercicio", x); render(); }
function delEjercicio(id){ const d=day(); d.ejercicio=d.ejercicio.filter(c=>c.id!==id); persist(); enviar("ejercicio_borrado",{id}); render(); }
function setSueno(s){ day().sueno={...s, hora:new Date().toISOString()}; persist(); enviar("sueno", day().sueno); render(); }

// ==== MARCAS (tabla en data.js) ====
function marcaDeIng(id){ for(const [k,P] of Object.entries(MARCAS)){ if(k!=="pan" && P.ing.includes(id)){ const o=P.opts[DB.marcas?.[k]]; if(o) return o; } } return null; }
// Marca nombrada en el texto («yogur Ser», «una coca»), si la hay.
function marcaEnTexto(prod, txt){
  const t=" "+ESTIMADOR.norm(txt)+" ";
  let mejor=null; for(const [k,o] of Object.entries(MARCAS[prod].opts)) for(const a of o.al){ if(t.includes(" "+a+" ") && (!mejor || a.length>mejor[1])) mejor=[k,a.length]; }
  return mejor? mejor[0] : null;
}
function prodDe(nombre){ return Object.keys(MARCAS).find(k=>MARCAS[k].alimentos.includes(nombre)); }
function marcasPendientes(r, txt){ return [...new Set(r.items.map(it=>prodDe(it.n)).filter(k=>k && !DB.marcas?.[k] && !marcaEnTexto(k,txt)))]; }
function guardarMarcas(m){ const x=Object.entries(m||{}).filter(([,v])=>v); if(!x.length) return; DB.marcas={...(DB.marcas||{}), ...Object.fromEntries(x)}; persist(); }
// Rehace la cuenta de una comida escrita con los valores de la marca de cada producto («otra» = valores generales).
function conMarcas(r, txt){
  const out={kcal:r.kcal, prot:r.prot, carb:r.carb, grasa:r.grasa, fibra:r.fibra, items:[], marcas:{}};
  for(const it of r.items){
    const k=prodDe(it.n), m=k && (marcaEnTexto(k,txt) || DB.marcas?.[k]), o=m && MARCAS[k].opts[m], gen=ESTIMADOR.alimento(it.n);
    if(!o || !gen){ out.items.push(ESTIMADOR.describir(it)); continue; }
    out.marcas[k]=m;
    let g=it.g; if(o.u && gen.u && it.g%gen.u===0) g=it.g/gen.u*o.u;   // por unidades: el tamaño de la unidad de esa marca
    const d=(a,b)=>(a*g-b*it.g)/100;
    out.kcal+=d(o.k,gen.k); out.prot+=d(o.p,gen.p); out.carb+=d(o.hc,gen.hc); out.grasa+=d(o.gr,gen.gr); out.fibra+=d(o.f,gen.f);
    out.items.push(ESTIMADOR.describir({...it, g, u:o.u||it.u})+" ("+o.n+")");
  }
  for(const c of ["kcal","prot","carb","grasa","fibra"]) out[c]=Math.max(0,Math.round(out[c]));
  return out;
}
function grupoMarca(prod, sel){
  const P=MARCAS[prod], box=el("div",{class:"opts"});
  const draw=()=>box.replaceChildren(...Object.entries(P.opts).concat([["otra",{n:"Otra o no sé"}]]).map(([v,o])=>el("button",{type:"button",class:"opt"+(sel[prod]===v?" on":""),onclick:()=>{ sel[prod]=v; draw(); }},o.n)));
  draw(); return el("div",{class:"stack",style:"gap:8px"}, el("div",{class:"label"},`¿Qué marca de ${P.n} usaste?`), box);
}
// Perfil › Mis marcas
function seccionMarcas(){
  const filas=Object.entries(MARCAS).map(([k,P])=>{ const s=el("select",{id:"marca-"+k,"aria-label":"Marca de "+P.n},
      el("option",{value:""},"Sin elegir"), ...Object.entries(P.opts).map(([v,o])=>el("option",{value:v},o.n)), el("option",{value:"otra"},"Otra o no sé"));
    s.value=DB.marcas?.[k]||""; s.addEventListener("change",()=>{ const m={...(DB.marcas||{})}; if(s.value) m[k]=s.value; else delete m[k]; DB.marcas=m; persist(); });
    return el("li",{}, el("label",{for:"marca-"+k},cap(P.n)), s); });
  return el("section",{class:"card"}, el("h3",{},"Mis marcas"),
    el("p",{class:"note",style:"margin:0 0 8px"},"Pulso usa los valores de la marca que elegiste. Te la pregunta la primera vez que registrás cada producto."),
    el("ul",{class:"marcas"}, filas));
}

// ==== HAMBRE Y EMOCIONES: pregunta breve antes de guardar ====
const HAMBRE=[["ninguna","Nada de hambre"],["poca","Poca"],["moderada","Moderada"],["mucha","Mucha"]];
const MOTIVO=[["hambre","Hambre física"],["horario","Horario o costumbre"],["emocion","Ansiedad o estrés"],["aburrimiento","Aburrimiento"]];
function preguntarEmocion(onDone, marcasPend=[]){
  const st={hambre:null, motivo:null, otro:"", marcas:{}};
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
    ...marcasPend.map(prod=>grupoMarca(prod, st.marcas)),
    el("div",{class:"row",style:"margin-top:6px"},
      el("button",{class:"btn primary",type:"button",onclick:()=>{ cerrarSheet(); guardarMarcas(st.marcas); onDone({hambre:st.hambre, motivo:st.motivo, emoOtro:st.otro||undefined}); }},"Guardar"),
      el("button",{class:"btn ghost",type:"button",onclick:()=>{ cerrarSheet(); guardarMarcas(st.marcas); onDone({}); }},"Saltear"))));
  sheet.hidden=false;
}
function cerrarSheet(){ $("#sheet").hidden=true; $("#sheet").replaceChildren(); }

// ==== RENDER: GENERAL ====
function render(){
  if(necesitaInstalar() || ONB.paso==="admin"){ $("#app").hidden=true; $("#onb").hidden=false; renderOnb(); return; }
  if(location.hash==="#eliminar-cuenta" && DB.auth && DB.perfil?.completo){ $("#app").hidden=true; $("#onb").hidden=false; cuentaParar(); const b=$("#onb"); b.replaceChildren(); renderBaja(b); return; }
  if(!DB.auth || !DB.perfil?.completo || !DB.consent?.acepta || ONB.paso==="avisos"){ $("#app").hidden=true; $("#onb").hidden=false; renderOnb(); return; }
  PLAN = calcPlan(DB.perfil);
  if(DB.dias[S.today]?.postHora) PLAN.horas.post=DB.dias[S.today].postHora;   // movimiento registrado hoy: «Después de entrenar» a esa hora
  if(!S.slot || !slotsHoy().some(s=>s[0]===S.slot)) S.slot=slotNow();
  $("#onb").hidden=true; $("#app").hidden=false;
  const nombre=DB.perfil.resp.datos?.nombre;
  $("#fecha").textContent = (nombre? `Hola, ${nombre} · ` : "") + cap(keyDate(S.today).toLocaleDateString("es-AR",{weekday:"long",day:"numeric",month:"long"}));
  $("#btnPerfil").setAttribute("aria-current", S.view==="perfil"? "page" : "false");
  $("#storeBanner").hidden = persistOk;
  document.querySelectorAll(".tab").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.v===S.view)));
  for(const v of ["hoy","mov","semana","historial","recetario","perfil"]) $("#v-"+v).hidden = v!==S.view;
  ({hoy:renderHoy, mov:renderMov, semana:renderSemana, historial:renderHistorial, recetario:renderRecetario, perfil:renderPerfil})[S.view]();
  guiaMostrar();
}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{ S.view=b.dataset.v; render(); window.scrollTo(0,0); }));
$("#btnPerfil").addEventListener("click",()=>{ S.view="perfil"; render(); window.scrollTo(0,0); });

// ==== GUÍA: consejos en contexto, de a uno, la primera vez que se ve cada parte ====
// Cada consejo aparece justo arriba de lo que explica, con «Entendido». En Perfil, «Ver la guía de nuevo» los vuelve a mostrar.
const GUIA=[
  {id:"momentos", v:"hoy", sel:"#v-hoy .slots", t:"Tocá cada momento del día para ver qué te sugerimos comer."},
  {id:"tarjeta", v:"hoy", sel:"#v-hoy .tarjeta", t:"Esta es la sugerencia para este momento. Si no te interesa, deslizala hacia un costado para ocultarla: la receta completa queda más abajo."},
  {id:"registro", v:"hoy", sel:"#otroTxt", t:()=>"Anotá acá lo que comiste, como lo dirías. ¿No querés escribir? "+(ES_IOS? "Tocá el micrófono del teclado (abajo a la derecha) y dictalo." : "Tocá el micrófono del teclado y dictalo.")},
  {id:"datos", v:"hoy", sel:'#v-hoy [aria-label="Datos nutricionales de hoy"]', t:"Acá ves cómo vas en el día. Se actualiza con cada cosa que registrás."},
  {id:"mov", v:"mov", sel:"#v-mov .prog", t:()=>"Acá se junta tu movimiento de la semana."+(ES_IOS && CONFIG.SALUD? " Si querés que se cargue solo, conectá Apple Salud desde Perfil." : "")},
  {id:"semana", v:"semana", sel:"#v-semana .prog", t:"Un resumen de tus últimos 7 días, con ideas para la semana."},
  {id:"marcas", v:"perfil", sel:"#v-perfil .marcas", t:"Las marcas que usás quedan guardadas acá. Las podés cambiar cuando quieras."},
];
function guiaMostrar(){
  document.querySelectorAll(".guia").forEach(x=>x.remove());
  if(!$("#sheet").hidden) return;
  const g=GUIA.find(x=>x.v===S.view && !(DB.guia||{})[x.id] && document.querySelector(x.sel)); if(!g) return;
  const objetivo=document.querySelector(g.sel);
  objetivo.before(el("div",{class:"guia",role:"note"}, el("p",{}, typeof g.t==="function"? g.t() : g.t),
    el("button",{class:"btn small",type:"button",onclick:()=>{ DB.guia={...(DB.guia||{}), [g.id]:1}; persist(); guiaMostrar(); }},"Entendido")));
}

// ==== HOY ====
function ingRows(rec, f){
  return el("ul",{class:"ing"}, rec.i.map(([id,g,esc])=>{ const x=ingOf(id); let gg=esc? g*escala(x,f) : g; gg = Math.max(5, Math.round(gg/5)*5);
    const unit = x.u ? ` · ${frac(gg/x.u)} ${x.uN||"unidad"}${gg/x.u>1.25 && !(x.uN||"").endsWith(".")?"s":""}` : "";
    return el("li",{}, el("span",{},x.n), el("span",{}, `${gg} g`, el("small",{},unit))); }));
}
function nutrLine(n, completa){
  const care=PLAN.care, g=(v,t)=>el("span",{},el("b",{},nf(v)),` g ${t}`);
  return el("div",{class:"meta",style:"margin-top:10px"},
    care?null:el("span",{},el("b",{},nf(n.kcal))," kcal"), g(n.prot,"proteína"), n.carb!=null? g(n.carb,"carbohidratos"):null, n.grasa!=null? g(n.grasa,"grasas"):null,
    completa? g(n.fibra,"fibra"):null,
    completa && n.verduras? el("span",{},el("b",{},nf(n.verduras,1))," verdura"):null, completa && n.frutas? el("span",{},el("b",{},nf(n.frutas,1))," fruta"):null,
    completa && n.integrales? el("span",{},el("b",{},nf(n.integrales,1))," integral"):null);
}
function adjSeg(key){
  const cur=S.adj[key]||1;
  return el("div",{class:"seg",role:"group","aria-label":"Cuánto comiste"},
    [[0.75,"Menos"],[1,"Igual"],[1.25,"Más"]].map(([v,t])=>el("button",{type:"button","aria-pressed":String(cur===v),onclick:()=>{S.adj[key]=v; render();}},t)));
}
function scaleN(n,a){ const o={...n}; for(const k of ["kcal","prot","carb","grasa","fibra"]) o[k]=Math.round(n[k]*a); for(const k of ["verduras","frutas","integrales"]) o[k]=Math.round(n[k]*a*2)/2; return o; }

// Orden de Hoy: sueño y movimiento → tarjeta de la sugerencia (se desliza para ocultarla) → registro → datos del día → receta completa.
function renderHoy(){
  const box=$("#v-hoy"); box.replaceChildren();
  const d=day();
  if(!d.sueno && new Date().getHours()<16) box.append(cardSueno());
  if(!movAunNo()) box.append(cardMovRapido(true));
  if(cicloInfo()?.antojos && !d.antojo) box.append(cardAntojo());
  // momentos del día
  const hechos=new Set(d.comidas.map(c=>c.slot));
  box.append(el("div",{class:"slots","aria-label":"Comidas del día"}, slotsHoy().map(([k])=>el("button",{class:"slot",type:"button","aria-pressed":String(S.slot===k),onclick:()=>{S.slot=k; render();}},
    hechos.has(k)? el("span",{class:"ck","aria-label":"registrada"},"✓"):null, SLOTDEF[k].n, el("span",{class:"note"},PLAN.horas[k]+" h")))));
  // sugerencia: tarjeta corta arriba, receta completa abajo
  const slot=S.slot; const {rec,count}=elegir(slot);
  const ya=d.comidas.filter(c=>c.slot===slot);
  let completa=null;
  if(!rec) box.append(el("article",{class:"card hero"}, el("div",{class:"label"},`${SLOTDEF[slot].n} · ${PLAN.horas[slot]} h`),
    el("p",{},"Todavía no tenemos recetas que se ajusten a todo tu perfil para este momento del día. Registrá lo que comas más abajo.")));
  else { const {f,why}=factorFor(slot,rec); const n=nutr(rec,f);
    if(!tarjetaOculta(slot)) box.append(tarjetaReceta(slot, rec, n, count, ya));
    completa=el("article",{class:"card"},
      el("div",{class:"label"},`Receta · ${SLOTDEF[slot].n}`), el("h2",{},rec.n),
      el("div",{class:"meta"}, rec.t? el("span",{},el("b",{},rec.t)," min"):el("span",{},"Sin cocción"), el("span",{},"1 porción"), PLAN.sinLactosa && rec.i.some(([id])=>(ING[id].g||[]).includes("lacteo"))? el("span",{},"Usá lácteos sin lactosa"):null),
      why? el("div",{class:"factor"},why):null,
      ingRows(rec,f), nutrLine(n, true), el("ol",{class:"steps"}, rec.pasos.map(p=>el("li",{},p)))); }
  // registro
  const otro=el("textarea",{id:"otroTxt",placeholder:"Escribilo como lo dirías. Por ejemplo: dos porciones de pizza de muzzarella y una gaseosa sin azúcar."});
  const sel=el("select",{id:"otroSlot","aria-label":"Momento del día"}, slotsHoy().map(([k])=>el("option",{value:k},SLOTDEF[k].n))); sel.value=slot;
  const msg=el("span",{class:"note",id:"otroMsg"});
  const registrar=()=>{ const txt=otro.value.trim(); if(!txt){ otro.focus(); return; }
    const r=ESTIMADOR.analizar(txt);
    if(!r.items.length){ msg.textContent="No reconocí ningún alimento. Probá nombrarlo de otra forma."; return; }
    const nombre=cap(txt).replace(/[.\s]+$/,"");
    preguntarEmocion(emo=>{ const a=conMarcas(r, txt);
      addComida({slot:sel.value, recetaId:null, nombre:nombre.length>140?nombre.slice(0,137)+"…":nombre, kcal:a.kcal, prot:a.prot, carb:a.carb, grasa:a.grasa, fibra:a.fibra,
      verduras:r.verduras, frutas:r.frutas, integrales:r.integrales, nueces:r.nueces, vitC:r.vitC, roja:r.roja, atun:r.atun, fuera:true, texto:txt,
      items:a.items, marcas:a.marcas, noRec:r.sobras, ...emo}); }, marcasPendientes(r, txt)); };
  otro.addEventListener("keydown",e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); registrar(); } });
  box.append(el("section",{class:"card"}, el("h3",{},"Registro de hoy"),
    el("ul",{class:"log"}, d.comidas.length? ordenar(d.comidas).map(c=>logItem(c,true)) : el("li",{class:"note"},"Todavía no registraste nada hoy.")),
    el("div",{class:"sep"}),
    el("div",{class:"stack",style:"gap:10px"}, el("label",{for:"otroTxt",class:"label"},"Anotá lo que comiste"), otro,
      el("div",{class:"row"}, sel, el("button",{class:"btn small",type:"button",onclick:registrar},"Registrar"), msg))));
  // datos del día
  box.append(el("section",{class:"stack","aria-label":"Datos nutricionales de hoy"}, el("h3",{},"Hoy vas así"), progreso(d.comidas)));
  if(completa) box.append(completa);
}
// Tarjeta corta de la sugerencia: nombre y macros principales. Deslizarla hacia un costado la oculta (la receta completa queda abajo).
function tarjetaReceta(slot, rec, n, count, ya){
  const card=el("article",{class:"card hero tarjeta"},
    el("div",{class:"label"}, `${SLOTDEF[slot].n} · ${PLAN.horas[slot]} h${slot===slotNow()?" · ahora":""}`),
    ya.length? el("div",{class:"note",style:"margin-top:4px"},`Ya registraste: ${ya.map(c=>c.nombre).join(", ")}.`):null,
    el("h2",{},rec.n), nutrLine(n),
    el("div",{class:"actions"},
      el("div",{class:"row"}, adjSeg(rec.id),
        el("button",{class:"btn primary",type:"button",onclick:()=>{ const a=S.adj[rec.id]||1; const m=scaleN(n,a);
          const pend=Object.keys(MARCAS).filter(k=>!DB.marcas?.[k] && MARCAS[k].ing.some(id=>rec.i.some(([x])=>x===id)));
          preguntarEmocion(emo=>{ const {f}=factorFor(slot,rec); const m2=scaleN(nutr(rec,f),a);   // con las marcas recién elegidas
            addComida({slot, recetaId:rec.id, nombre:rec.n+(a!==1?(a<1?" (menos)":" (más)"):""), ...m2, ...emo}); S.adj[rec.id]=1; }, pend); }},"Lo comí")),
      count>1? el("div",{class:"row"}, el("button",{class:"btn small",type:"button",onclick:()=>{ S.offsets[slot]=(S.offsets[slot]||0)+1; render(); }},`Otra opción (${count})`)):null));
  deslizable(card, ()=>{ ocultarTarjeta(slot); render(); });
  return card;
}
function tarjetaOculta(slot){ return !!(DB.ocultas||{})[S.today+"|"+slot]; }
function ocultarTarjeta(slot){ const o={}; for(const [k,v] of Object.entries(DB.ocultas||{})) if(k.slice(0,10)>=keyShift(S.today,-2)) o[k]=v; o[S.today+"|"+slot]=1; DB.ocultas=o; persist(); }
// Arrastre horizontal con el dedo (o el mouse): pasado un umbral, la tarjeta sale de la pantalla y se llama a alSalir.
function deslizable(card, alSalir){
  let x0=null, y0=0, dx=0, id=null, horizontal=null;
  card.addEventListener("pointerdown",ev=>{ if(ev.target.closest("button,a,input,textarea,select")) return; x0=ev.clientX; y0=ev.clientY; dx=0; id=ev.pointerId; horizontal=null; card.style.transition="none"; });
  card.addEventListener("pointermove",ev=>{ if(x0==null || ev.pointerId!==id) return; dx=ev.clientX-x0; const dy=ev.clientY-y0;
    if(horizontal==null && (Math.abs(dx)>8 || Math.abs(dy)>8)){ horizontal=Math.abs(dx)>Math.abs(dy); if(horizontal) card.setPointerCapture(id); }
    if(horizontal){ card.style.transform=`translateX(${dx}px) rotate(${dx/40}deg)`; card.style.opacity=String(1-Math.min(Math.abs(dx)/320,0.6)); } });
  const fin=()=>{ if(x0==null) return; const salir=horizontal && Math.abs(dx)>110; x0=null;
    card.style.transition="transform .2s ease-out, opacity .2s ease-out";
    if(salir){ card.style.transform=`translateX(${Math.sign(dx)*window.innerWidth}px)`; card.style.opacity="0"; setTimeout(alSalir,200); }
    else { card.style.transform=""; card.style.opacity=""; } };
  for(const e of ["pointerup","pointercancel"]) card.addEventListener(e,fin);
}
function ordenar(arr){ const o=slotsHoy().map(s=>s[0]); return [...arr].sort((a,b)=>o.indexOf(a.slot)-o.indexOf(b.slot)||String(a.hora).localeCompare(String(b.hora))); }
function horaTxt(c){ const d=new Date(c.hora); return isNaN(d)?"":" · "+pad(d.getHours())+":"+pad(d.getMinutes())+" h"; }
const MOT_TXT=Object.fromEntries(MOTIVO.concat([["otro","Otro motivo"]]));
function logItem(c, borrable, k){
  return el("li",{},
    el("div",{}, el("div",{class:"s"},(SLOTDEF[c.slot]?.n||"")+horaTxt(c)+(c.fuera?" · fuera del plan":"")), el("div",{},c.nombre),
      el("div",{class:"note"}, (c.kcal==null?"Sin estimar":(PLAN.care?"":`${nf(c.kcal)} kcal · `)+`${nf(c.prot)} g proteína`+(c.carb!=null?` · ${nf(c.carb)} g carbohidratos · ${nf(c.grasa)} g grasas`:""))+(c.motivo?` · ${MOT_TXT[c.motivo]}`:"")),
      Array.isArray(c.items)&&c.items.length? el("div",{class:"det"},"Contado: "+c.items.join(" · ")):null,
      Array.isArray(c.noRec)&&c.noRec.length? el("div",{class:"det warn"},"No se contó: "+c.noRec.map(w=>"«"+w+"»").join(", ")):null),
    borrable? el("button",{class:"x",type:"button","aria-label":"Borrar "+c.nombre,onclick:()=>delComida(c.id,k)},"×"):null);
}
function progreso(comidas){
  const t=totals(comidas), M=PLAN.metas, box=el("div",{class:"prog"});
  const item=(k,v,goal,unit,opt={})=>{ const pct=goal? clamp(v/goal,0,1)*100:0; const over=opt.max && v>goal; const done=!over && v>=goal;
    return el("div",{class:"pi"+(over?" over":done?" done":"")}, el("div",{class:"k"},k), el("div",{class:"v"},opt.txt||nf(v,1), el("small",{}, opt.txt? (opt.unidad? " · "+opt.unidad : "") : ` / ${nf(goal)}${unit}`)), el("div",{class:"bar"},el("i",{style:`width:${pct}%`}))); };
  const dato=(k,v,unit)=>el("div",{class:"pi"}, el("div",{class:"k"},k), el("div",{class:"v"},nf(v), el("small",{},unit)));
  if(!PLAN.care) box.append(item("Energía",t.kcal,target()," kcal"));
  box.append(item("Proteína (mín.)",t.prot,PLAN.prot," g"), dato("Carbohidratos",t.carb," g"));
  const gMin=M.grasaMin; box.append(item("Grasas (mín.)",t.grasa,gMin," g",{txt: t.grasa<=0? "Falta" : t.grasa>=gMin? "Cubierta" : null, unidad:`${nf(t.grasa)} / ${nf(gMin)} g`}), dato("Fibra",t.fibra," g"));
  box.append(item("Frutas",t.frutas,M.frutas,""), item("Verduras",t.verduras,M.verduras,""), item("Integrales",t.integrales,M.integrales,""));
  if(M.nueces) box.append(item("Frutos secos",t.nueces,M.nueces,""));
  box.append(item("Vitamina C",t.vitC?1:0,1,"",{txt:t.vitC?"Cubierta":"Falta una fuente"}));
  if(!PLAN.excl.has("vacuna")) box.append(item("Carne roja · 7 días",weekCount("roja"),M.rojaSem,"",{max:true}));
  return box;
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

// ==== CICLO MENSTRUAL Y ANTOJOS ====
// Fecha estimada a partir del último período y la duración del ciclo (o de lo que llegue de Salud de Apple).
// Antojos: desde 5 días antes del período estimado hasta su 2.º día, una vez por día.
function cicloInfo(){
  const R=DB.perfil?.resp; if(!R || R.sexo!=="m" || !R.cicloApp || R.cicloApp==="off" || !R.ciclo?.ultimo) return null;
  const dur=clamp(+R.ciclo.duracion||28,20,45), desde=Math.round((keyDate(S.today)-keyDate(R.ciclo.ultimo))/864e5);
  if(desde<0) return null;
  const dia=desde%dur;   // 0 = primer día del período (estimado)
  return {dia, dur, proximo:keyShift(S.today, dur-dia), antojos: dia>=dur-5 || dia<=1};
}
const ANTOJOS=[["dulce","Algo dulce",["Una fruta con yogur y una cucharadita de miel","Banana pisada con canela","Un puñado de pasas de uva"]],
  ["chocolate","Chocolate",["Dos cuadraditos de chocolate amargo (70 %)","Yogur con cacao amargo y banana","Frutillas con un cuadradito de chocolate"]],
  ["salado","Algo salado",["Un puñado de maní o almendras sin sal","Galletas de arroz con queso untable","Pochoclo casero con poca sal"]],
  ["frito","Algo frito",["Papas o batatas al horno","Milanesa al horno","Garbanzos tostados al horno con pimentón"]]];
function cardAntojo(){
  const box=el("section",{class:"card"}); let elegido=null;
  const marcar=tipo=>{ day().antojo={tipo, hora:new Date().toISOString()}; persist(); enviar("antojo",{tipo, dia_ciclo:cicloInfo()?.dia}); };
  const draw=()=>{ const a=ANTOJOS.find(x=>x[0]===elegido);
    box.replaceChildren(); agregar(box, el("h3",{},"¿Tenés algún antojo?"),
      el("p",{class:"note",style:"margin:0 0 10px"},"En estos días del ciclo los antojos son más comunes. Si tenés uno, te damos opciones que también suman."),
      el("div",{class:"opts"}, ANTOJOS.map(([v,t])=>el("button",{type:"button",class:"opt"+(elegido===v?" on":""),onclick:()=>{ elegido=v; draw(); }},t)),
        el("button",{type:"button",class:"opt",onclick:()=>{ marcar("ninguno"); render(); }},"No, ninguno")),
      a? el("ul",{class:"ideas",style:"margin-top:12px"}, a[2].map(t=>el("li",{},t))) : null,
      a? el("button",{class:"btn small primary",type:"button",style:"margin-top:12px",onclick:()=>{ marcar(elegido); render(); }},"Listo") : null,
      el("p",{class:"note",style:"margin:12px 0 0"}, el("button",{class:"btn link",type:"button",onclick:()=>{ cicloEmpezo(); render(); }},"¿Empezó tu período hoy? Marcalo")));
  };
  draw(); return box;
}
function cicloEmpezo(){ const R=DB.perfil.resp; R.ciclo={...(R.ciclo||{duracion:28}), ultimo:S.today}; persist(); enviar("ciclo",{inicio:S.today, origen:"app"}); respaldoPronto(); }

// ==== MOVIMIENTO ====
const ACT=[["caminar","Caminar",3.5],["correr","Correr",8],["fuerza","Fuerza o gimnasio",5],["deporte","Deporte",7]];
const ACT_MET=Object.fromEntries(ACT.map(a=>[a[0],a[2]])); const ACT_TXT=Object.fromEntries(ACT.map(a=>[a[0],a[1]]));
// «Aún no» oculta la tarjeta de Hoy; vuelve cuando se abre la app después de tenerla cerrada (o en segundo plano) 30 minutos o más.
const MOV_VUELVE=30*60000;
function movAunNo(){ return !!DB.movAunNo && dayKey(new Date(DB.movAunNo))===S.today; }
function movAlVolver(){ if(DB.cerradaDesde && Date.now()-DB.cerradaDesde>=MOV_VUELVE && DB.movAunNo){ delete DB.movAunNo; persist(); return true; } return false; }
function cardMovRapido(conAunNo){
  const st={tipo:null, min:null};
  const box=el("section",{class:"card"});
  const draw=()=>{ const hoy=day().ejercicio;
    box.replaceChildren(...[el("h3",{},"¿Te moviste hoy?"),
      hoy.length? el("ul",{class:"log"}, hoy.map(e=>el("li",{}, el("div",{}, el("div",{},`${ACT_TXT[e.tipo]||e.otro||"Actividad"} · ${e.min} min`), PLAN.care?null:el("div",{class:"note"},`≈ ${nf(e.kcal)} kcal`)),
        el("button",{class:"x",type:"button","aria-label":"Borrar actividad",onclick:()=>delEjercicio(e.id)},"×")))):null,
      el("div",{class:"opts"}, ACT.map(([v,t])=>el("button",{type:"button",class:"opt"+(st.tipo===v?" on":""),onclick:()=>{st.tipo=v; draw();}},t)), el("button",{type:"button",class:"opt"+(st.tipo==="otro"?" on":""),onclick:()=>{st.tipo="otro"; draw();}},"Otro")),
      st.tipo? el("div",{class:"opts",style:"margin-top:8px"}, [15,30,45,60].map(m=>el("button",{type:"button",class:"opt"+(st.min===m?" on":""),onclick:()=>{st.min=m; draw();}},m+" min"))) : null,
      st.tipo && st.min? el("button",{class:"btn small primary",type:"button",style:"margin-top:10px",onclick:()=>{ const met=ACT_MET[st.tipo]||5; addEjercicio({tipo:st.tipo, min:st.min, kcal:Math.round((met-1)*PLAN.peso*st.min/60)}); }},"Guardar") : null,
      conAunNo && !hoy.length && !st.tipo? el("button",{class:"btn small ghost",type:"button",style:"margin-top:10px",onclick:()=>{ DB.movAunNo=Date.now(); persist(); render(); }},"Aún no") : null].filter(Boolean));
  };
  draw(); return box;
}
function semanaMov(){ let min=0, fuerza=0; for(const k of last7()){ for(const e of (DB.dias[k]?.ejercicio||[])){ if(e.tipo==="fuerza") fuerza++; else min+=e.min; }
  for(const e of (saludDia(k)?.entrenos||[])){ if(/fuerza|pesas|strength/i.test(e.tipo)) fuerza++; else min+=e.min||0; } } return {min, fuerza}; }
function movDia(k){ return (DB.dias[k]?.ejercicio||[]).map(e=>`${ACT_TXT[e.tipo]||e.otro||"Actividad"} · ${e.min} min`).concat((saludDia(k)?.entrenos||[]).map(e=>`${e.tipo} · ${e.min} min (desde Salud)`)); }
function renderMov(){
  const box=$("#v-mov"); box.replaceChildren();
  const s=semanaMov(), dias=last7().slice().reverse().filter(k=>movDia(k).length || saludDia(k)?.pasos!=null);
  const pasos=last7().map(k=>saludDia(k)?.pasos).filter(x=>x!=null);
  box.append(
    el("div",{class:"prog"},
      el("div",{class:"pi"}, el("div",{class:"k"},"Actividad aeróbica · 7 días"), el("div",{class:"v"},nf(s.min),el("small",{}," min"))),
      el("div",{class:"pi"}, el("div",{class:"k"},"Sesiones de fuerza · 7 días"), el("div",{class:"v"},s.fuerza)),
      pasos.length? el("div",{class:"pi"}, el("div",{class:"k"},"Pasos por día · promedio"), el("div",{class:"v"},nf(pasos.reduce((a,b)=>a+b,0)/pasos.length))) : null),
    el("section",{class:"card"}, el("h3",{},"Lo que registraste esta semana"),
      dias.length? el("ul",{class:"log"}, dias.map(k=>el("li",{}, el("div",{},
        el("div",{class:"s"}, cap(keyDate(k).toLocaleDateString("es-AR",{weekday:"long",day:"numeric"}))+(k===S.today?" · hoy":"")),
        movDia(k).length? el("div",{}, movDia(k).join(" · ")) : null,
        saludDia(k)?.pasos!=null? el("div",{class:"note"}, `${nf(saludDia(k).pasos)} pasos`) : null))))
        : el("p",{class:"note",style:"margin:0"},"Todavía no registraste actividad en los últimos 7 días.")),
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
      el("td",{},(d?.ejercicio||[]).reduce((a,e)=>a+e.min,0)+(saludDia(k)?.entrenos||[]).reduce((a,e)=>a+(e.min||0),0)||"—"), el("td",{},d?.sueno?.horas? nf(d.sueno.horas,1)+" h":"—")));
  }
  const avg=f=>n? acc[f]/n : 0; const sm=semanaMov(); const sAvg = sueno.length? sueno.reduce((a,b)=>a+b,0)/sueno.length : null;
  const ideas=[];
  if(n && avg("verduras")<M.verduras) ideas.push("Las verduras quedaron por debajo de la meta: sumá media porción de ensalada en el almuerzo y en la cena.");
  if(n && avg("frutas")<M.frutas) ideas.push("Pocas frutas: dejá una a la vista o llevala para la colación.");
  if(sAvg!=null && sAvg<7) ideas.push("Dormiste menos de 7 horas en promedio. Dormir poco aumenta el hambre y las ganas de comer cosas dulces; probá adelantar media hora la hora de acostarte.");
  if(conMotivo>=4 && emo/conMotivo>=0.3) ideas.push(`En ${emo} de ${conMotivo} comidas el motivo fue la ansiedad, el estrés o el aburrimiento. Antes de comer en esos momentos, probá una pausa de dos minutos: un vaso de agua, respirar o salir a caminar un rato. Si pasa seguido y te pesa, conversarlo con un profesional ayuda.`);
  if(!ideas.length && n) ideas.push("Vas bien: mantené lo que está funcionando.");
  box.append(
    el("div",{class:"prog"},
      el("div",{class:"pi"},el("div",{class:"k"},"Días registrados"),el("div",{class:"v"},n,el("small",{}," / 7"))),
      PLAN.care?null:el("div",{class:"pi"},el("div",{class:"k"},"Energía promedio"),el("div",{class:"v"},n?nf(avg("kcal")):"—",el("small",{}," kcal"))),
      el("div",{class:"pi"},el("div",{class:"k"},"Actividad"),el("div",{class:"v"},nf(sm.min),el("small",{}," min"))),
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
      movDia(k).length? el("p",{class:"note",style:"margin:8px 0 0"},"Movimiento: "+movDia(k).join(" · ")) : null,
      d.sueno?.horas? el("p",{class:"note",style:"margin:4px 0 0"},`Sueño: ${nf(d.sueno.horas,1)} h, ${String(d.sueno.calidad).replace("_"," ")}`) : null));
  }
}

// ==== RECETARIO ====
function renderRecetario(){
  const box=$("#v-recetario"); box.replaceChildren();
  box.append(el("p",{class:"note",style:"margin:0"},"Tu recetario, filtrado según lo que comés, tu cocina y tu tiempo. Las cantidades se ajustan a tu energía diaria en la pestaña Hoy."));
  for(const [pool,t] of [["d","Desayuno o merienda"],["c","Colaciones"],["p","Almuerzo o cena"],["pre","Antes de entrenar"],["post","Después de entrenar"]]){
    if((pool==="pre"||pool==="post") && !PLAN.horas.pre) continue;
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
  for(const q of PREGUNTAS){ if(!q.opts || q.id==="relacion" || !visible(q,DB.perfil.resp)) continue; const v=ans(q.id); if(v==null) continue;
    const lab=x=> x==="otro"? (DB.perfil.resp[q.id+"_otro"]||"Otro") : (q.opts.concat(q.viejas||[]).find(o=>o[0]===x)||[,x])[1];
    resumen.push(el("li",{}, el("div",{}, el("div",{class:"s"},q.t), el("div",{}, Array.isArray(v)? (v.length? v.map(lab).join(", "):"Nada") : lab(v))))); }
  const c=DB.perfil.resp.cuerpo||{}, dp=DB.perfil.resp.datos||{};
  agregar(box,
    el("section",{class:"card hero"}, el("div",{class:"label"},"Tu plan"),
      el("div",{class:"meta",style:"margin-top:8px"}, P.care? null : el("span",{},el("b",{},nf(P.kcal))," kcal por día de referencia"), el("span",{},el("b",{},nf(P.prot))," g de proteína como mínimo")),
      el("div",{class:"meta",style:"margin-top:8px"}, el("span",{},ESTRUCTURAS[P.est].n), ...slotsHoy().map(([k])=>el("span",{},`${SLOTDEF[k].n} ${P.horas[k]} h`))),
      el("p",{class:"note",style:"margin:10px 0 0"},"La energía se estima con la ecuación de Mifflin-St Jeor y tu nivel de actividad. Es una referencia: si tu peso cambia sin que lo busques, actualizá tus datos.")),
    el("section",{class:"card"}, el("h3",{},"Tus respuestas"),
      (dp.nombre||dp.email)? el("p",{style:"margin:0 0 4px"},[dp.nombre,dp.apellido].filter(Boolean).join(" ")+(dp.email?` · ${dp.email}`:"")) : null,
      el("p",{class:"note",style:"margin:0 0 6px"},`${c.edad||"—"} años · ${c.altura||"—"} cm · ${c.peso||"—"} kg`),
      cicloInfo()? el("p",{class:"note",style:"margin:0 0 6px"},`Tu ciclo: próximo período estimado el ${keyDate(cicloInfo().proximo).toLocaleDateString("es-AR",{day:"numeric",month:"long"})}.`) : null,
      el("ul",{class:"log"}, resumen),
      el("div",{class:"row",style:"margin-top:12px"}, el("button",{class:"btn small",type:"button",onclick:()=>{ DB.perfil.completo=false; ONB.i=0; persist(); render(); }},"Editar respuestas"),
        el("button",{class:"btn small ghost",type:"button",onclick:()=>{ DB.guia={}; persist(); S.view="hoy"; render(); window.scrollTo(0,0); }},"Ver la guía de nuevo"))),
    seccionMarcas(), CONFIG.SALUD? seccionSalud() : null, seccionAvisos(), seccionPrivacidad(),
    tarjetaCuenta(),
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
    el("p",{},"Para usar Pulso tenés que crear una cuenta con tu mail y aceptar estos términos. Al aceptarlos, se envían a una base de datos del equipo de Pulso tus respuestas al cuestionario (salvo la pregunta sobre tu relación con la comida), el tiempo que tardaste en cada pregunta, tus comidas (con las marcas que elegiste), tu actividad, tu descanso, tus antojos y cuándo y por cuánto tiempo usás la app. Estos datos quedan vinculados a tu cuenta: el equipo de Pulso puede saber de quién es cada registro."),
    el("p",{},"Textos libres: lo que escribas en campos de texto —por ejemplo, la descripción de una comida en «Comí otra cosa» o las respuestas «Otro»— se envía tal cual lo escribiste. No incluyas nombres ni datos que te identifiquen. La única excepción es la respuesta «Otro» sobre tu relación con la comida, que nunca sale de tu dispositivo."),
    el("p",{},"Tu cuenta guarda tu nombre, tu apellido, tu mail y una copia de tus respuestas y tus registros, para que los recuperes al volver a entrar o desde otro dispositivo. Tu mail también se usa para enviarte el código de ingreso y novedades de Pulso, invitarte a encuestas o estudios y responder tus consultas o pedidos de acceso y borrado."),
    el("p",{},"Si eliminás tu cuenta (Perfil › Eliminar mi cuenta), antes te pedimos que respondas cinco preguntas sobre tu experiencia, que se conservan. Después borramos tu nombre, tu apellido, tu mail y la copia de tu cuenta. Tus registros y tus respuestas se conservan como datos generales, sin nada que los vincule a vos, para mejorar la app. Si querés que también se borren tus registros, pedilo escribiendo a "+CONFIG.CONTACTO+"."),
    el("p",{},"Seguimiento del ciclo menstrual (opcional): si lo activás, guardamos qué app usás para seguir tu ciclo, la fecha de inicio de tu último período, la duración habitual de tu ciclo y los antojos que registres. Es un dato de salud especialmente sensible. Lo podés desactivar cuando quieras desde Perfil › Editar respuestas."),
    CONFIG.SALUD? el("p",{},"Apple Salud (opcional): si conectás el atajo «Pulso Salud», tu iPhone nos envía cada día tus pasos y tus minutos de ejercicio. Para dejar de enviarlos, borrá la automatización en la app Atajos y tocá «Dejar de leer Salud» en Perfil.") : null,
    el("p",{},"Para qué: entender cómo se usa la app y mejorar sus recomendaciones. No se venden ni se ceden a terceros."),
    el("p",{},"Recordatorios (opcionales, independientes de compartir datos): si los activás, guardamos en nuestro servidor la dirección de notificaciones de tu dispositivo, los horarios de tus comidas, tu zona horaria y qué momentos del día ya registraste (no qué comiste), con un código aparte, que no se vincula con tu cuenta. Se usan solo para enviarte los avisos; las marcas diarias se borran a los pocos días y todo se borra al desactivarlos. Para enviarlos se usan los servicios de notificaciones de Apple, Google, Mozilla o Microsoft, según tu dispositivo."),
    el("p",{},"Si la comida te genera malestar seguido, hablarlo con un profesional de salud ayuda. En Argentina, la Línea de Salud Mental 0800-999-0091 es gratuita y atiende las 24 horas."),
    el("p",{},"Algunos de estos datos son de salud y la Ley 25.326 de Protección de Datos Personales los considera sensibles. Para ejercer tus derechos de acceso, rectificación o supresión, escribí a "+CONFIG.CONTACTO+"."));
}

// ==== CUESTIONARIO (UI) ====
const ONB = {i:-1, dir:1, draft:null, tiempos:{}};
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
  if(ONB.paso==="admin"){ cronoMarcar(null); renderAdmin(box); return; }
  // Sin instalar (salvo administrador): solo la bienvenida y los pasos para instalar.
  if(necesitaInstalar()){ cronoMarcar(null); if(ONB.paso==="instalar") renderInstalar(box); else { ONB.paso=null; renderInicio(box); } return; }
  if(ONB.paso==="avisos"){ cronoMarcar(null); renderOfertaAvisos(box); return; }
  if(!DB.auth && (DB.perfil?.completo || ONB.i>=0)) ONB.paso="ingreso";
  if(ONB.paso==="ingreso"){ cronoMarcar(null); renderIngreso(box); return; }
  if(ONB.paso==="bienvenida" && DB.auth){ cronoMarcar(null); renderBienvenida(box); return; }
  if(DB.perfil?.completo && !DB.consent?.acepta) ONB.i=total;   // perfil de una versión anterior: falta aceptar los términos
  if(ONB.i<0){ cronoMarcar(null); renderInicio(box); return; }
  if(ONB.i>=total){ cronoMarcar(null); if(DB.consent?.acepta){ finalizarCuestionario(); return; } renderConsent(box); return; }
  const q=PREGUNTAS[ONB.i];
  if(!visible(q,R)){ ONB.i += ONB.dir<0? -1 : 1; if(ONB.i<0) ONB.i=0; renderOnb(); return; }   // pregunta que no corresponde: se saltea
  cronoMarcar(q.id);
  const next=()=>{ ONB.dir=1; ONB.i++; renderOnb(); window.scrollTo(0,0); };
  const atras=()=>{ ONB.dir=-1; ONB.i--; renderOnb(); };
  const vis=PREGUNTAS.filter(x=>visible(x,R)), pos=vis.indexOf(q);
  const prog=el("div",{class:"onb-prog"}, el("i",{style:`width:${(pos/vis.length)*100}%`}));
  const card=el("div",{class:"onb-card"}, prog, el("div",{class:"eyebrow"},q.sec), el("h2",{},q.t), q.sub? el("p",{class:"note"},q.sub):null);
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
  if(q.type==="ciclo"){
    R.ciclo=R.ciclo||{duracion:28}; const hoy=dayKey(new Date());
    const f=el("input",{type:"date",id:"q-ciclo-ultimo",max:hoy,min:keyShift(hoy,-90),value:R.ciclo.ultimo||""});
    const n=el("input",{type:"number",id:"q-ciclo-dur",inputmode:"numeric",min:"20",max:"45",value:R.ciclo.duracion??28});
    const chk=()=>{ R.ciclo={ultimo:f.value||null, duracion:+n.value||28}; sig.disabled=!(f.value && f.value<=hoy && +n.value>=20 && +n.value<=45); };
    f.addEventListener("input",chk); n.addEventListener("input",chk);
    card.append(el("div",{class:"nums"}, el("label",{class:"num",for:"q-ciclo-ultimo"}, el("span",{},"Primer día"), f),
      el("label",{class:"num",for:"q-ciclo-dur"}, el("span",{},"Duración habitual del ciclo"), el("span",{class:"numrow"}, n, el("small",{},"días")))),
      el("p",{class:"note"},"Si no sabés la duración, dejá 28 días, que es lo más común."));
    card.append(nav()); box.append(card); chk(); return;
  }
  if(q.type==="numbers"){
    R.cuerpo=R.cuerpo||{};
    card.append(el("div",{class:"nums"}, q.fields.map(([k,lab,un,mn,mx])=>{ const inp=el("input",{type:"number",id:"q-"+k,inputmode:"decimal",min:String(mn),max:String(mx),value:R.cuerpo[k]??""});
      inp.addEventListener("input",()=>{ R.cuerpo[k]=inp.value; ok(); });
      return el("label",{class:"num",for:"q-"+k}, el("span",{},lab), el("span",{class:"numrow"}, inp, el("small",{},un))); })));
    card.append(nav()); box.append(card); ok(); return;
  }
  const opts=el("div",{class:"choices"});
  const draw=()=>{ opts.replaceChildren(...q.opts.concat(q.sinOtro? [] : [["otro","Otro"]]).map(([v,t])=>{
    const sel = q.type==="multi" ? (R[q.id]||[]).includes(v) : R[q.id]===v;
    return el("button",{type:"button",class:"choice"+(sel?" on":""),"aria-pressed":String(sel),onclick:()=>{
      if(q.type==="multi"){ let a=(R[q.id]||[]).slice(); if(a.includes(v)) a=a.filter(x=>x!==v); else a.push(v); R[q.id]=a; tocado=true; draw(); ok(); }
      else { R[q.id]=v; draw(); ok(); if(v!=="otro") setTimeout(next,160); else otroIn.focus(); } }}, t); })); };
  draw();
  card.append(opts, otroWrap, nav(q.type==="multi" && !q.sinNinguna ? el("button",{class:"btn ghost",type:"button",onclick:()=>{ R[q.id]=[]; next(); }},"Ninguna") : null));
  box.append(card); ok();
}
function renderInicio(box){
  box.append(el("div",{class:"onb-card"}, el("div",{class:"eyebrow"}, CONFIG.DEMO? "Bienvenido a la "+CONFIG.DEMO : "Bienvenida"), el("h1",{},"Pulso"),
    el("p",{class:"lead"},"Comer, moverte, y descansar mejor.", el("br"), "Un plan hecho sólo para vos."),
    el("p",{},"Pulso te acompaña con tus comidas, según tus gustos y tu cocina.", el("br"), "Además, contempla tu actividad física, tu sueño, y tu relación con la comida."),
    el("p",{},"Es gratis."),
    el("button",{class:"btn primary big",type:"button",onclick:()=>{ if(necesitaInstalar()) ONB.paso="instalar"; else if(!DB.auth) ONB.paso="ingreso"; else ONB.i=0; renderOnb(); window.scrollTo(0,0); }},"Empezar")));
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
{ const m=new URLSearchParams(location.search).get("momento"); if(m && SLOTDEF[m]){ S.slot=m; S.view="hoy"; } if(location.search) history.replaceState(null,"",location.pathname+location.hash); }
sesionIniciar();
movAlVolver(); delete DB.cerradaDesde; persist();
render();
ingresoPorEnlace();
flushSoon();
sincronizarAvisos();
leerSalud();
setInterval(()=>{ const k=dayKey(new Date()); if(k!==S.today){ S.today=k; S.slot=null; S.offsets={}; render(); } },60000);
