// Pruebas del estimador de comidas escritas. Cada caso: frase y rangos esperados (kcal, proteína, carbohidratos y grasas en g, porciones de verdura, fruta e integrales).
// Los rangos salen de porciones habituales en Argentina y de tablas de composición (USDA, valores argentinos y rótulos).
// Uso: sh pruebas/correr.sh
const CASOS = [
  // Pizza y panificados
  ["dos porciones de pizza de muzzarella", {kcal:[550,700], prot:[22,32], carb:[60,85], grasa:[18,32], verd:[0,0], fruta:[0,0]}],
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
  ["cafe con leche con dos medialunas",    {kcal:[380,460], prot:[8,13], carb:[42,56], grasa:[16,24]}],
  ["3 sanguchitos de miga",                {kcal:[320,480], prot:[12,22]}],
  ["un sanguche de jamon y queso",         {kcal:[380,470], prot:[20,27]}],
  ["un wrap de pollo",                     {kcal:[280,400], prot:[20,35]}],
  ["tacos",                                {kcal:[340,460], prot:[14,22]}],
  // Carnes, pollo y pescado
  ["milanesa con pure",                    {kcal:[520,650], prot:[28,38], carb:[40,60], grasa:[22,34]}],
  ["pollo con arroz",                      {kcal:[580,700], prot:[48,60], carb:[50,66], grasa:[16,28]}],
  ["medio pollo",                          {kcal:[550,750], prot:[70,85]}],
  ["pechuga a la plancha con ensalada",    {kcal:[340,420], prot:[45,52], verd:[2,3]}],
  ["asado con ensalada",                   {kcal:[850,1050], prot:[50,62], carb:[3,14], grasa:[62,85], verd:[2,3]}],
  ["2 empanadas de carne",                 {kcal:[480,580], prot:[18,23]}],
  ["arroz con atun",                       {kcal:[360,440], prot:[32,40]}],
  ["una lata de atun",                     {kcal:[120,160], prot:[28,34]}],
  // Pastas, guisos y vegetariano
  ["fideos con tuco y queso rallado",      {kcal:[500,620], prot:[20,27], carb:[80,100], grasa:[6,14], verd:[1,2]}],
  ["noquis con tuco",                      {kcal:[420,520], prot:[10,15]}],
  ["guiso de lentejas",                    {kcal:[380,460], prot:[22,28], carb:[35,50], grasa:[10,18]}],
  ["tofu salteado con verduras",           {kcal:[140,220], prot:[10,16], verd:[2,3]}],
  ["tarta de verdura",                     {kcal:[340,420], prot:[14,18], verd:[0.5,1.5]}],
  // Ensaladas, verduras y frutas
  ["ensalada de lechuga y tomate",         {kcal:[90,160], verd:[1.5,3]}],
  ["ensalada de tomate y cebolla",         {kcal:[90,140], verd:[1.5,2.5]}],
  ["una banana",                           {kcal:[95,120], carb:[20,27], grasa:[0,1], fruta:[1,1]}],
  ["dos mandarinas",                       {kcal:[90,120], fruta:[1,1.5]}],
  ["una manzana y un punado de almendras", {kcal:[240,290], prot:[6,9], carb:[18,28], grasa:[12,18], fruta:[1,1.5]}],
  ["un punado de pasas de uva",            {kcal:[70,100], fruta:[0.5,0.7]}],
  ["un yogur con granola y banana",        {kcal:[300,380], fruta:[1,1]}],
  // Dulces, snacks y desayunos
  ["un alfajor",                           {kcal:[200,240], carb:[28,36], grasa:[7,12]}],
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
  ["una lata de coca",                     {kcal:[130,160], carb:[33,40], grasa:[0,0]}],
  ["una coca zero",                        {kcal:[0,5]}],
  ["una cerveza",                          {kcal:[180,220]}],
  ["un fernet",                            {kcal:[250,300]}],
  // Frases reales registradas por usuarios (palabras no reconocidas, 28/10/2026)
  ["🍖 ¾ de una milanesa mediana de pollo, hecha sin aceite agregado. 🍠 Un pedacito de boniato, menor que tu puño. 🧀 2 cucharadas soperas de ricota light Tregar. 🥚 2 claras de huevo. 🫘 ¼ de lata de garbanzos. Y después, como parte de esa comida o postre,: 🥣 50 g de yogur natural/común. 🫐 10 arándanos congelados.", {kcal:[560,720], prot:[42,58]}],
  ["3 galletitas Salmas 68 kcal 1 barrita Dubar de chocolate y naranja", {kcal:[140,210], fruta:[0,0]}],
  ["Arroz Gallo tostado previamente en un poco de aceite, una milanesa de soja de la granja del sol y un huevo frito.", {kcal:[580,740]}],
  ["Huevo 1 huevo entero + 1 clara Milanesa de pollo ¼ de una milanesa que sobró de ayer Tomate ½ tomate chico (aprox. ¼ de uno grande) Garbanzos ¼ de lata Ricota Tregar light 1 cucharada sopera Boniato 2 pedacitos, aproximadamente ½ boniato chico en total* Lechuga 5 hojas Zanahoria ½ zanahoria, con hummus como acompañamiento", {kcal:[500,680]}],
  ["Tres. Croquetas espinaca, empanizados hechas en Air Fryer 1/4 de taza de garbanzos, tres cucharas, sopas de ricota, un tomate chico y una hoja de lechuga, además de qué un sandwichito de miga 5 × 5, con huevo y jamón y después de postre dos cucharadas de dulce leche con con coco", {kcal:[720,950]}],
  ["Una barrita proteica de íntegra con 15 g de proteína, y, una banana mediana tirando grandes", {kcal:[250,340], prot:[13,20], fruta:[1,1]}],
  ["Una rebanasa de pan lactal fargo negro con queso finlandia", {kcal:[120,190], integ:[1,1.5]}],
  // Casos puntuales de esas frases
  ["10 arandanos",                         {kcal:[5,15]}],
  ["una barrita de chocolate y naranja",   {kcal:[80,120], fruta:[0,0]}],
  ["arroz tostado",                        {kcal:[220,300]}],
  ["¾ de una milanesa mediana de pollo",   {kcal:[230,310]}],
  ["tomate ½ tomate chico",                {kcal:[5,15], verd:[0.5,0.5]}],
  // Relleno sin contar dos veces y comas que separan partes de la frase (versión 0.6.0)
  ["sandwich de jamon y queso con jamon",  {kcal:[380,500]}],
  ["wrap de pollo, con pollo, remolacha, cebolla", {kcal:[320,420]}],
  ["un sandwich, una ensalada y un yogur", {kcal:[620,780]}],
  ["un yogur firme",                       {kcal:[160,200]}],
];
let fallas=0;
for(const [frase, esp] of CASOS){
  const r=ESTIMADOR.analizar(frase), val={kcal:r.kcal, prot:r.prot, carb:r.carb, grasa:r.grasa, verd:r.verduras, fruta:r.frutas, integ:r.integrales};
  const mal=Object.entries(esp).filter(([k,[a,b]])=> val[k]<a || val[k]>b).map(([k,[a,b]])=>`${k} ${val[k]} (esperado ${a}–${b})`);
  if(mal.length){ fallas++; print("✗ "+frase+"  →  "+r.items.map(ESTIMADOR.describir).join(" · ")+"\n    "+mal.join(" · ")); }
}
print(fallas? `\n${fallas} de ${CASOS.length} frases fuera de rango` : `✓ ${CASOS.length} frases dentro de lo esperado`);
