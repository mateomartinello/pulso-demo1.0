// Pruebas del estimador de comidas escritas. Cada caso: frase y rangos esperados (kcal, proteína g, porciones de verdura, fruta e integrales).
// Los rangos salen de porciones habituales en Argentina y de tablas de composición (USDA, valores argentinos y rótulos).
// Uso: sh pruebas/correr.sh
const CASOS = [
  // Pizza y panificados
  ["dos porciones de pizza de muzzarella", {kcal:[550,700], prot:[22,32], verd:[0,0], fruta:[0,0]}],
  ["media pizza",                          {kcal:[1100,1400], prot:[45,60], verd:[0,0], fruta:[0,0]}],
  ["pizza de muzzarella con tomate",       {kcal:[580,720], prot:[22,32], verd:[0,0.5], fruta:[0,0]}],
  ["una porcion de pizza con anana",       {kcal:[300,380], prot:[12,16], fruta:[0,0.5]}],
  ["hamburguesa con lechuga y tomate",     {kcal:[540,650], prot:[28,36], verd:[0,1]}],
  ["hamburguesa con papas fritas",         {kcal:[900,1100], prot:[30,40]}],
  ["hamburguesa con huevo frito y panceta", {kcal:[700,800], prot:[38,46]}],
  ["pan",                                  {kcal:[140,200], integ:[0,0]}],
  ["tostadas",                             {kcal:[110,160], integ:[0,0]}],
  ["dos tostadas integrales",              {kcal:[150,220], integ:[1.5,3]}],
  ["dos rebanadas de pan",                 {kcal:[110,160], integ:[0,0]}],
  ["un tostado de jamon y queso y un cafe con leche", {kcal:[400,520], prot:[20,30]}],
  ["cafe con leche con dos medialunas",    {kcal:[380,460], prot:[8,13]}],
  ["3 sanguchitos de miga",                {kcal:[320,480], prot:[12,22]}],
  ["un sanguche de jamon y queso",         {kcal:[380,470], prot:[20,27]}],
  ["un wrap de pollo",                     {kcal:[280,400], prot:[20,35]}],
  ["tacos",                                {kcal:[340,460], prot:[14,22]}],
  // Carnes, pollo y pescado
  ["milanesa con pure",                    {kcal:[520,650], prot:[28,38]}],
  ["pollo con arroz",                      {kcal:[580,700], prot:[48,60]}],
  ["medio pollo",                          {kcal:[550,750], prot:[70,85]}],
  ["pechuga a la plancha con ensalada",    {kcal:[340,420], prot:[45,52], verd:[2,3]}],
  ["asado con ensalada",                   {kcal:[850,1050], prot:[50,62], verd:[2,3]}],
  ["2 empanadas de carne",                 {kcal:[480,580], prot:[18,23]}],
  ["arroz con atun",                       {kcal:[360,440], prot:[32,40]}],
  ["una lata de atun",                     {kcal:[120,160], prot:[28,34]}],
  // Pastas, guisos y vegetariano
  ["fideos con tuco y queso rallado",      {kcal:[500,620], prot:[20,27], verd:[1,2]}],
  ["noquis con tuco",                      {kcal:[420,520], prot:[10,15]}],
  ["guiso de lentejas",                    {kcal:[380,460], prot:[22,28]}],
  ["tofu salteado con verduras",           {kcal:[140,220], prot:[10,16], verd:[2,3]}],
  ["tarta de verdura",                     {kcal:[340,420], prot:[14,18], verd:[0.5,1.5]}],
  // Ensaladas, verduras y frutas
  ["ensalada de lechuga y tomate",         {kcal:[90,160], verd:[1.5,3]}],
  ["ensalada de tomate y cebolla",         {kcal:[90,140], verd:[1.5,2.5]}],
  ["una banana",                           {kcal:[95,120], fruta:[1,1]}],
  ["dos mandarinas",                       {kcal:[90,120], fruta:[1,1.5]}],
  ["una manzana y un punado de almendras", {kcal:[240,290], prot:[6,9], fruta:[1,1.5]}],
  ["un punado de pasas de uva",            {kcal:[70,100], fruta:[0.5,0.7]}],
  ["un yogur con granola y banana",        {kcal:[300,380], fruta:[1,1]}],
  // Dulces, snacks y desayunos
  ["un alfajor",                           {kcal:[200,240]}],
  ["una barra de chocolate",               {kcal:[220,270]}],
  ["un bombon",                            {kcal:[60,90]}],
  ["queso y dulce",                        {kcal:[260,320], prot:[9,13]}],
  ["flan con dulce de leche",              {kcal:[250,300]}],
  ["avena con leche",                      {kcal:[250,300], integ:[1,2]}],
  ["dos huevos revueltos con dos tostadas",{kcal:[300,380], prot:[15,22], integ:[0,0]}],
  // Bebidas
  ["un cortado",                           {kcal:[15,35]}],
  ["un cafe con leche",                    {kcal:[80,100]}],
  ["mate",                                 {kcal:[0,10]}],
  ["una lata de coca",                     {kcal:[130,160]}],
  ["una coca zero",                        {kcal:[0,5]}],
  ["una cerveza",                          {kcal:[180,220]}],
  ["un fernet",                            {kcal:[250,300]}],
];
let fallas=0;
for(const [frase, esp] of CASOS){
  const r=ESTIMADOR.analizar(frase), val={kcal:r.kcal, prot:r.prot, verd:r.verduras, fruta:r.frutas, integ:r.integrales};
  const mal=Object.entries(esp).filter(([k,[a,b]])=> val[k]<a || val[k]>b).map(([k,[a,b]])=>`${k} ${val[k]} (esperado ${a}–${b})`);
  if(mal.length){ fallas++; print("✗ "+frase+"  →  "+r.items.map(ESTIMADOR.describir).join(" · ")+"\n    "+mal.join(" · ")); }
}
print(fallas? `\n${fallas} de ${CASOS.length} frases fuera de rango` : `✓ ${CASOS.length} frases dentro de lo esperado`);
