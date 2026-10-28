// ==== TABLA DE ALIMENTOS (valores aproximados por 100 g o 100 ml) ====
// Para agregar algo: una línea nueva con el mismo formato. Los alias van sin importar tildes, mayúsculas ni plurales.
const ALIMENTOS = `
## nombre|alias;alias|kcal|prot|fibra (por 100 g o 100 ml)|porción típica (g)|unidad (g)|nombre de la unidad|marcas
## marcas: gr=grasas y hc=carbohidratos disponibles (g por 100 g; hc sale por diferencia con la energía, salvo frutos secos y bebidas con alcohol), v=verdura (v.5 = mitad del peso cuenta como verdura), f=fruta, i.4=equivale a 40% de su peso en cereal integral, n=fruto seco, c=fuente de vitamina C, r=carne roja o embutido, a=lata de atún, l=líquido (ml), F=ya frito, P=incluye pan, b=pan, B=hay que ver con qué se rellenó, cnt=gramos de "una" entera
# ---- Carnes vacunas y de cerdo ----
Milanesa de carne|milanesa;milanesa de carne;milanesa de nalga;milanesa de peceto;milanesa vacuna;mila;milanga;milanesa de ternera;milanesa al horno;milanesa frita|260|20|1|150|150|milanesa|r F gr=13 hc=15
Milanesa napolitana|milanesa napolitana;mila napolitana;milanesa napo;mila napo;napolitana de carne|250|19|1|230|230|milanesa|r F gr=13 hc=14
Milanesa de pollo|milanesa de pollo;mila de pollo;suprema;suprema de pollo;milanesa de pechuga;suprema frita|240|22|1|150|150|milanesa|F gr=11 hc=13
Suprema napolitana|suprema napolitana;milanesa de pollo napolitana;suprema a la napolitana;mila de pollo napolitana|235|21|1|230|230|suprema|F gr=11 hc=12.5
Milanesa de soja|milanesa de soja;mila de soja;milanesas de soja|200|14|4|110|110|milanesa|gr=8 hc=16
Milanesa de berenjena|milanesa de berenjena|190|5|4|100|100|milanesa|v.4 gr=11 hc=16
Milanesa de pescado|milanesa de pescado;milanesa de merluza|220|15|1|150|150|milanesa|F gr=11 hc=15
Bife|bife;bife de chorizo;bife de lomo;churrasco;bifecito;entrecot;ojo de bife;bife angosto;bife ancho;carne a la plancha;bife a la plancha;churrasquito|220|27|0|200|200|bife|r gr=12 hc=1
Lomo|lomo;lomo de vaca;medallon de lomo|190|28|0|180|180|porción|r gr=8.5 hc=0.4
Asado|asado;tira de asado;asado de tira;costilla;costillas;falda|330|22|0|250||porción|r gr=26.5 hc=0.9
Vacío|vacio|290|24|0|200||porción|r gr=21.5 hc=0.1
Matambre|matambre;matambre a la pizza;matambrito|260|25|0|180||porción|r gr=17.5 hc=0.6
Carne vacuna|carne;carne vacuna;carne de vaca;carne al horno;nalga;peceto;cuadril;colita de cuadril;roast beef;carne asada;carne guisada;cuadrada;bola de lomo;tapa de nalga;picana;entraña;carne de ternera;ternera;osobuco;roti|200|27|0|180||porción|r gr=10 hc=0.5
Carne picada|carne picada;picadillo|250|20|0|120||porción|r gr=18.5 hc=0.9
Hamburguesa con pan|hamburguesa;hamburguesas;hamburguesa completa;hamburguesa con pan;burger;hamburguesa doble;hamburguesa con queso;cheeseburger;hamburguesa casera con pan|255|14|1.5|220|220|hamburguesa|r P T gr=12 hc=22
Medallón de carne|medallon;medallon de carne;paty;patty;hamburguesa al plato;hamburguesa sin pan;hamburguesa casera;medallones|250|18|0|110|110|medallón|r gr=19 hc=1.8
Big Mac|big mac;bigmac|257|12|1.7|215|215|unidad|r P gr=13.5 hc=21
Cuarto de libra|cuarto de libra;cuarto libra;cuarto de libra con queso|260|15|1.5|200|200|unidad|r P gr=13.5 hc=19
Whopper|whopper;stacker;whopper doble|240|11|1.5|270|270|unidad|r P gr=14 hc=17
McPollo|mcpollo;mc pollo;mcchicken;mc chicken;hamburguesa de pollo con pan;sandwich de pollo frito|240|11|1.5|180|180|unidad|P F gr=11 hc=23.5
Cerdo|cerdo;bondiola;carre;carre de cerdo;solomillo;solomillo de cerdo;pechito;pechito de cerdo;costillitas;costillita;cerdo al horno;lomo de cerdo;matambre de cerdo;cerdo a la plancha|260|25|0|180||porción|r gr=17.5 hc=0.6
Chorizo|chorizo;chorizos;chorizo parrillero|300|15|0|100|100|chorizo|r gr=26 hc=1.5
Choripán|choripan;chori;choripanes|290|12|1|230|230|choripán|r P gr=16 hc=24
Morcilla|morcilla;morcipan|380|14|0.5|80|80|morcilla|r gr=33 hc=6.5
Salchicha|salchicha;salchichas de viena;salchicha de viena;vienas;salchichas|290|11|0|50|50|salchicha|r gr=25 hc=5.2
Pancho|pancho;panchos;hot dog;superpancho|270|9|1|110|110|pancho|r P gr=15 hc=24
Lomito|lomito;lomito completo;sandwich de lomo;lomito de cerdo|230|15|1|300|300|lomito|r P gr=10 hc=19.5
Salame|salame;salamin;salamines;longaniza;sopressata;chorizo seco|420|22|0|30|10|feta|r gr=35 hc=4.2
Mortadela|mortadela|300|13|0|30|10|feta|r gr=26 hc=3.5
Panceta|panceta;bacon;tocino;panceta ahumada|450|13|0|20|10|feta|r gr=44 hc=0.5
Jamón cocido|jamon;jamon cocido;jamon natural;fiambre;fiambres|120|18|0|40|15|feta|gr=4 hc=3
Jamón crudo|jamon crudo;crudo;serrano;jamon serrano|260|26|0|30|10|feta|gr=17 hc=0.8
Paleta|paleta;paleta cocida;lomito ahumado;lomo ahumado;pastrami|140|16|0|30|15|feta|gr=6.5 hc=4.4
Pavita|pavita;pechuga de pavo;fiambre de pavo;pavo|110|20|0|40|15|feta|gr=2.5 hc=1.9
Arrollado de pollo|arrollado;arrollado de pollo|150|16|0|40|20|feta|gr=8.5 hc=2.4
# ---- Pollo ----
Pollo (pechuga)|pechuga;pechuga de pollo;pollo a la plancha;pollo grillado;pollo al disco;pollo hervido;pechuga a la plancha;suprema a la plancha;suprema grillada;suprema al horno;pollito;pollo en cubos;pollo desmenuzado;pollo salteado;pollo al verdeo;pollo a la mostaza|165|31|0|150||porción|gr=4.5 hc=0.1
Pollo al horno|pollo;pollo al horno;pata muslo;patamuslo;muslo;muslos;pata;cuarto de pollo;pollo asado;pollo con piel;pollo a la parrilla;pollo al spiedo;pollo rostizado;pollo entero|215|26|0|180||porción|cnt=600 gr=12 hc=0.8
Pollo frito|pollo frito;pollo rebozado;pollo apanado;pollo crispy;pollo kfc;kfc;tiras de pollo;strips|260|25|0.5|200||porción|F gr=15 hc=6
Alitas|alitas;alas;alitas de pollo;wings;alitas bbq|250|23|0|150|30|alita|gr=17 hc=1.2
Nuggets|nuggets;nugget;mcnuggets;patitas;patitas de pollo;bocaditos de pollo;formitas;medallones de pollo;medallon de pollo;hamburguesa de pollo|260|14|1|120|20|unidad|F gr=16 hc=14.5
# ---- Pescados y mariscos ----
Merluza|merluza;filet de merluza;pescado;filet;filete de pescado;pescado al horno;pescado a la plancha;abadejo;lenguado;pescadilla;brotola;dorado|100|19|0|180|180|filet|gr=2.5 hc=0.4
Pescado frito|pescado frito;merluza frita;filet frito;filet de merluza rebozado;pescado rebozado;filet rebozado;rebozado de pescado;pescado apanado;bastoncitos de pescado;kanikama frito|220|15|0.5|180|180|filet|F gr=12 hc=13
Salmón|salmon;salmon rosado;salmon rojo;trucha|210|22|0|150||porción|gr=13.5 hc=0.1
Atún al natural|atun;atun al natural;lata de atun;atun en agua;atun desmenuzado;atun en lata;atun lomitos|116|25.5|0|120|120|lata|a gr=1.5 hc=0.1
Atún en aceite|atun en aceite;lomitos de atun en aceite|190|26|0|120|120|lata|a gr=9.5 hc=0.1
Sardinas|sardina;sardinas;caballa;jurel;anchoas|210|25|0|90|90|lata|gr=12 hc=0.5
Kanikama|kanikama;surimi;palitos de cangrejo|95|7|0|60|15|palito|gr=1 hc=14.5
Camarones|camarones;langostinos;mariscos;gambas;calamar;calamares|100|21|0|120||porción|gr=1.5 hc=0.6
Rabas|rabas;rabas fritas;calamares fritos|250|14|1|150||porción|F gr=13 hc=19
# ---- Huevos ----
Huevo|huevo;huevo duro;huevo hervido;huevo pasado por agua;huevo cocido;huevo poche;huevos duros|143|12.6|0|50|50|huevo|gr=10 hc=0.6
Huevo frito|huevo frito;huevo a la plancha;huevo estrellado;huevos fritos|196|13.6|0|55|55|huevo|F gr=15 hc=1.6
Huevos revueltos|revuelto;huevo revuelto;huevos revueltos;revuelto de huevo;scrambled|170|11|0|110|55|huevo|gr=13 hc=2.2
Omelette|omelette;omelet;tortilla francesa;omelette de queso;omelette de jamon y queso;omelet de queso;omelet de jamon y queso|190|13|0|140||porción|gr=14.5 hc=1.9
Tortilla de papa|tortilla;tortilla de papa;tortilla de papas;tortilla española;tortilla espanola|160|6|1.5|200||porción|gr=9 hc=13
Clara de huevo|clara;claras;clara de huevo|52|11|0|33|33|clara|gr=0.2 hc=1.6
# ---- Quesos y lácteos ----
Queso|queso;queso cremoso;queso fresco;cremoso;port salut;por salut;queso port salut;queso por salut;queso de barra;queso pategras;pategras;queso gouda;gouda;queso holanda;queso dambo;queso danbo;danbo;dambo;queso tybo;tybo;queso de maquina;queso en fetas;queso fundido;queso derretido;queso light|310|22|0|30|20|feta|gr=24 hc=1.5
Mozzarella|mozzarella;muzzarella;muzarella;mozarella;muzza;mozza;bocconcino;bocconcinos|280|20|0|50||porción|gr=21.5 hc=1.6
Queso rallado|queso rallado;rallado;parmesano;reggianito;sardo;queso sardo;queso parmesano;grana padano;provolone rallado|390|33|0|15||porción|gr=27.5 hc=2.6
Queso untable|queso untable;queso crema;casancrem;finlandia;queso blanco;queso untable descremado;queso untable light;mendicrim;queso philadelphia;philadelphia;queso finlandia|200|8|0|30|15|cucharada|gr=17 hc=3.8
Ricota|ricota;ricotta|140|11|0|60||porción|gr=9 hc=3.8
Provoleta|provoleta;provolone|350|25|0|120|120|provoleta|gr=27 hc=1.8
Queso azul|roquefort;queso azul;gorgonzola|360|21|0|30||porción|gr=30 hc=1.5
Cheddar|cheddar;queso cheddar;fetas de cheddar|400|25|0|20|20|feta|gr=33 hc=0.8
Leche|leche;leche entera;leche descremada;leche parcialmente descremada;vaso de leche;leche fria;leche caliente;leche de almendras;leche de avena;leche de soja;bebida de soja|50|3.3|0|250||vaso|l gr=2 hc=4.7
Chocolatada|chocolatada;leche chocolatada;cindor;chocolate caliente;submarino;leche con chocolate;leche con cacao;nesquik;toddy;cola cao;colacao|80|3.2|1|250||vaso|l M gr=2 hc=12
Yogur bebible|yogur;yogurt;yogur bebible;yogurt bebible;yogur entero;yogur de vainilla;yogur de frutilla;yogur descremado;yogurt descremado;yogur light;yogurisimo|80|3|0|200|200|pote|gr=2 hc=12.5 S
Yogur natural|yogur natural;yogurt natural;yogur sin azucar;yogurt sin azucar;yogur natural sin azucar|65|4|0|190|190|pote|gr=3 hc=5.5
Yogur griego|yogur griego;yogurt griego;griego;yogur proteico;yogurt proteico;yogur alto en proteina|110|8|0|170|170|pote|gr=7 hc=3.8
Yogur con cereales|yogur con cereales;yogurt con cereales;yogur con granola;yogurt con granola;yogur con copos;yogurisimo con cereales|120|4|0.8|200|200|pote|gr=3 hc=19
Postrecito|postrecito;postre de leche;serenito;danette;postre de chocolate;postre de vainilla;mousse;mousse de chocolate|130|3|0.5|100|100|pote|gr=3.5 hc=21.5 S
Flan|flan;flan casero;flan mixto|150|4|0|120|120|porción|gr=4.5 hc=23.5
Dulce de membrillo|dulce de membrillo;membrillo;dulce de batata;batata dulce|270|0.4|1.5|40||porción|gr=0.1 hc=66
Postre vigilante|queso y dulce;queso con dulce;vigilante;postre vigilante|285|11|0.7|100||porción|gr=12 hc=33
Dulce de leche|dulce de leche;ddl;dulce leche;dulce de leche repostero|315|7|0|30|20|cucharada|gr=7.5 hc=55
Manteca|manteca;mantequilla;margarina|717|1|0|10|10|cucharadita|gr=81 hc=0
Crema|crema;crema de leche;crema batida;chantilly;crema chantilly;crema doble|300|2.5|0|30|15|cucharada|gr=31 hc=2.8
Helado|helado;helado de crema;helados;cucurucho;cono;vasito de helado;helado de dulce de leche;helado de chocolate;helado de frutilla;helado de vainilla;pote de helado;freddo;grido|220|4|0.5|160|80|bocha|gr=11 hc=26 S
Helado ¼ kg|cuarto de helado;cuarto kilo de helado;1/4 de helado;helado de 1/4;helado de cuarto;cuartito de helado;1/4 kg de helado;pote de 1/4|220|4|0.5|250|250||gr=11 hc=26 S
Helado de agua|helado de agua;palito helado;palito de agua;paleta helada;helado frutal|100|0|0|70|70|palito|gr=0 hc=25
# ---- Panes y panificados ----
Pan integral|pan integral;pan de salvado;bimbo artesano;pan artesano;pan integral bimbo;tostadas integrales;tostada integral;pan de molde integral;pan lactal integral;pan negro;pan de centeno;pan con semillas;pan multicereal;pan lactal negro;pan lactal fargo negro;fargo negro;pan fargo negro|243|12.1|5.4|76|38|rebanada|i1 b gr=3.4 hc=38.5
Pan blanco|pan;pan blanco;pan frances;pan flauta;flauta;felipe;felipes;minon;miñon;pan de campo;pancito;pancitos;mignon;pan casero;baguette;pan de mesa;bollito;bollitos;pan de agua;figacita;figazza;pan arabe;pan pita;pan de papa;pan de leche;pan brioche|270|9|2.5|60|60|pan|b gr=3 hc=50.5
Pan lactal|pan lactal;pan de molde;pan lactal blanco;pan blanco de molde;fargo;lactal;bimbo;pan bimbo;tostada;tostadas;rebanada de pan;rodaja de pan|265|8|2.5|50|25|rebanada|b gr=4 hc=48
Pan de hamburguesa|pan de hamburguesa;pan de hamburguesas;pan de pancho;pan de panchos|275|9|2|60|60|pan|b gr=4.5 hc=48.5
Sándwich|sandwich;sandwiches;sanguche;sanguches;sanguchito;sandwichito;emparedado;pebete;bocadillo;baguette rellena;sandwich de pan frances|270|9|2.5|100|100|sándwich|b B P gr=10 hc=35
Sándwich de miga|sandwich de miga;sandwiches de miga;sanguche de miga;sanguchitos de miga;miga;triples;triple de miga;triple;sandwichito de miga;sandwichitos de miga;sandwich de miga;sanguchito de miga|260|10|1.5|90|45|sándwich|b P gr=13 hc=25
Tostado|tostado;tostados;carlitos;tostado de jamon y queso;tostado jyq;tostado de jyq;tostado de queso|240|8|2|90|90|tostado|b B P gr=10 hc=28.5
Wrap|wrap;wraps;rapidita;rapiditas;tortilla de trigo;tortillas de trigo;tortilla mexicana;fajita;fajitas|300|8|2.5|60|60|tortilla|b B P gr=7.5 hc=49
Burrito|burrito;burritos|170|6|3|250|250|burrito|B gr=6 hc=21.5
Taco|taco;tacos|220|9|3|180|90|taco|gr=11 hc=20
Rapidita integral|rapidita integral;rapiditas integrales;wrap integral;tortilla integral|290|9|6|80|40|rapidita|i1 b B P gr=7 hc=45
Medialuna|medialuna;medialunas;medialuna de manteca;medialunas de manteca;croissant;medialuna rellena|410|7.5|1.6|80|40|medialuna|gr=21 hc=47
Medialuna de grasa|medialuna de grasa;medialunas de grasa|400|7|1.6|80|40|medialuna|gr=20 hc=47
Factura|factura;facturas;vigilante;cañoncito;canoncito;bola de fraile;berlinesa;tortita negra;sacramento;librito;moño;chicharron;ensaimada;palmerita;palmeritas;cañon de dulce de leche|400|6|1.5|100|50|factura|gr=19 hc=50.5
Churro|churro;churros;churro relleno;churros rellenos|400|5|1.5|80|40|churro|F gr=20 hc=49
Bizcochitos|bizcochitos;bizcochito;bizcochitos de grasa;bizcochos;9 de oro;nueve de oro;don satur|450|9|2|30|5|bizcochito|gr=22 hc=53
Chipá|chipa;chipas;chipacitos;chipá|340|9|1|60|20|chipá|gr=17 hc=37
Pan dulce|pan dulce;panettone;budin ingles|370|7|2|80||porción|gr=13 hc=55
Grisines|grisines;grisin;grissini;palitos de pan|410|12|3|20|5|grisín|gr=12 hc=62
Galletas de arroz|galletas de arroz;galletas de arroz inflado;tostadas de arroz;galletitas de arroz;arroz inflado|380|8|3|20|10|galleta|i.8 gr=3 hc=79
Pan rallado|pan rallado;rebozador|395|13|4.5|30||porción|gr=5 hc=72
Arepa|arepa;arepas|220|5|2|120|120|arepa|gr=5 hc=38
Pizza|pizza;pizza de muzzarella;pizza de muzza;pizza muzza;pizza de mozzarella;pizza comun;pizza al molde;pizza a la piedra;pizza casera;muzza al molde;pizza margarita;pizza margherita|260|11|2|240|120|porción|T cnt=960 gr=10 hc=30.5
Fugazzeta|fugazzeta;pizza fugazzeta;fugazza;fugazza con queso;fugazzetta|290|11|2|240|120|porción|T cnt=960 gr=13 hc=31
Pizza napolitana|pizza napolitana;napolitana;pizza de tomate;pizza con tomate|240|10|2|240|120|porción|T cnt=960 gr=9 hc=29
Pizza de jamón|pizza de jamon;pizza de jamon y morrones;pizza de jamon y morron;pizza especial;pizza de jamon y queso;pizza jyq;pizza con jamon;pizza de jamon y huevo|250|12|2|240|120|porción|T cnt=960 gr=9.5 hc=28
Pizza con fiambre|pizza de calabresa;calabresa;pizza de longaniza;pizza de pepperoni;pepperoni;pizza de salame|280|12|2|240|120|porción|T r cnt=960 gr=13 hc=28
Pizza de rúcula|pizza de rucula;pizza con rucula;pizza rucula y crudo;pizza de rucula y crudo|240|11|2|240|120|porción|T cnt=960 gr=9 hc=28
Pizza de verdura|pizza de verdura;pizza de verduras;pizza vegetariana;pizza de champiñones|220|9|2.5|240|120|porción|T v.15 cnt=960 gr=8.5 hc=25.5
Pizzeta|pizzeta;pizzetas;pizzita;pizzitas;pizzeta de rapidita;mini pizza|250|10|2|150|150|pizzeta|T gr=9 hc=31
Prepizza|prepizza;pre pizza;masa de pizza|280|8|2|120|120|porción|T gr=5 hc=50
Fainá|faina|230|8|4|80|80|porción|gr=10 hc=25
Calzone|calzone;calzones|250|12|2|300|300|calzone|gr=10 hc=27
Pizza integral|pizza integral;pizza de masa integral|240|11|4|240|120|porción|T i.5 cnt=960 gr=9 hc=27
# ---- Empanadas y tartas ----
Empanada|empanada;empanadas;empanadita;empanaditas;empanada al horno;empanadas al horno;empanada casera|280|11|2|180|90|empanada|gr=15 hc=24
Empanada de carne|empanada de carne;empanada de carne cortada a cuchillo;empanada salteña;empanada tucumana;empanada criolla;empanada de carne picante;empanada de carne suave;empanada mendocina;empanada santiagueña|290|11|2|180|90|empanada|r gr=16 hc=24.5
Empanada de jamón y queso|empanada de jamon y queso;empanada jyq;empanada de jyq;empanada de queso;empanada de queso y jamon;empanada de jamon|300|12|1.5|180|90|empanada|gr=17 hc=24
Empanada de pollo|empanada de pollo;empanada de pollo al verdeo|270|12|1.5|180|90|empanada|gr=14 hc=23
Empanada de humita|empanada de humita;empanada de choclo|260|6|2.5|180|90|empanada|gr=13 hc=28.5
Empanada de verdura|empanada de verdura;empanada de acelga;empanada de espinaca;empanada de calabaza|230|8|2.5|180|90|empanada|v.25 gr=12 hc=21
Empanada de caprese|empanada de caprese;empanada caprese;empanada de tomate y albahaca;empanada de queso y tomate|270|10|1.5|180|90|empanada|gr=15 hc=23
Empanada de cebolla|empanada de queso y cebolla;empanada de cebolla y queso;empanada de cebolla;empanada de roquefort|280|9|1.5|180|90|empanada|gr=15 hc=26.5
Empanada árabe|empanada arabe;empanadas arabes;sfiha;fatay|260|11|2|180|90|empanada|r gr=12 hc=26
Empanada de atún|empanada de atun|270|13|1.5|180|90|empanada|gr=13 hc=24.5
Empanada frita|empanada frita;empanadas fritas|330|10|2|180|90|empanada|F gr=21 hc=24
Tarta|tarta;tarta de jamon y queso;tarta jyq;tarta de jyq;tarta de queso;quiche;quiche lorraine;tarta de cebolla;tarta de puerro;pascualina;tartaleta|260|10|1.5|200|200|porción|gr=15 hc=20.5
Tarta de verdura|tarta de verdura;tarta de verduras;tarta de acelga;tarta de espinaca;tarta de zapallito;tarta de zapallitos;tarta de calabaza;tarta de zucchini;tarta de brocoli;tarta de calabacin|190|8|2|200|200|porción|v.4 gr=11 hc=14
Tarta de choclo|tarta de choclo;tarta de humita|220|6|2|200|200|porción|gr=12 hc=21
Tarta de atún|tarta de atun|230|13|1.5|200|200|porción|gr=12 hc=17
# ---- Pastas, arroz y cereales (cocidos) ----
Fideos|fideos;fideo;pasta;pastas;spaghetti;espagueti;spaguetti;tallarines;tallarin;mostachol;mostacholes;tirabuzon;tirabuzones;moñito;moñitos;penne;macarrones;rigatoni;fusilli;cintas;fetuccini;fettuccine;tagliatelle;coditos;dedalitos;municiones;fideos secos;pasta seca|158|5.8|1.8|280||plato|gr=0.9 hc=31
Fideos integrales|fideos integrales;fideo integral;pasta integral;spaghetti integral;tirabuzones integrales;penne integral;mostachol integral|140|5.5|3.5|280||plato|i.4 gr=1 hc=25.5
Fideos de arroz|fideos de arroz;fideos chinos;fideos de wok;noodles;ramen;fideos instantaneos;maruchan;sopa instantanea|130|2.5|1|250||plato|gr=0.3 hc=29
Ravioles|ravioles;raviol;raviolis;ravioles de verdura;ravioles de ricota;ravioles de carne;ravioles de pollo;agnolotis;agnolottis|200|8|1.5|280||plato|gr=7 hc=25.5
Sorrentinos|sorrentinos;sorrentino;sorrentinos de jamon y queso;sorrentinos de calabaza;sorrentinos de ricota|220|9|1.5|280||plato|gr=8 hc=27
Ñoquis|ñoquis;ñoqui;noquis;noqui;gnocchi;ñoquis de papa|140|3.5|1.5|300||plato|gr=1 hc=28.5
Canelones|canelones;canelon;canelones de verdura;canelones de carne;canelones de pollo|160|8|1.2|300||porción|gr=8 hc=13.5
Lasaña|lasaña;lasagna;lasagña;lasana;lasagne|160|9|1|300||porción|r gr=8 hc=12.5
Capeletinis|capeletinis;capelettis;capeletis;tortellini;tortellinis|210|9|1.5|250||plato|gr=7 hc=27
Arroz|arroz;arroz blanco;arroz hervido;arroz primavera;arroz frito;arroz chaufa;arroz saltado|130|2.7|0.4|200||plato|gr=0.3 hc=29
Arroz integral|arroz integral;arroz yamani;arroz yamaní|112|2.6|1.8|200||plato|i.35 gr=0.9 hc=22.5
Risotto|risotto;risoto;risotto de hongos;risotto de calabaza|170|4|0.5|300||plato|gr=6 hc=25
Arroz con pollo|arroz con pollo;paella|160|10|0.5|350||plato|gr=5 hc=18.5
Polenta|polenta|70|1.6|1|250||plato|gr=0.4 hc=14.5
Quinoa|quinoa;quinua|120|4.4|2.8|150||porción|i.4 gr=1.9 hc=20
Cuscús|cuscus;couscous|112|3.8|1.4|150||porción|gr=0.2 hc=23
Avena|avena;copos de avena;avena arrollada;porridge|380|13|10|40||porción|i1 gr=7 hc=61
Cereales|cereales;cereal;copos;copos de maiz;corn flakes;zucaritas;choco krispis;fruit loops;trix;cereal de chocolate;aritos;aritos de miel;almohaditas;almohaditas rellenas;special k;fitness;nestle fitness|380|7|3|40||porción|gr=2 hc=82
Granola|granola;muesli;cereales integrales;salvado;salvado de avena;fibra;all bran|440|10|8|40||porción|i.5 gr=15 hc=62
# ---- Papas y similares ----
Papa|papa;papas;papa hervida;papas hervidas;papa al vapor;papines;papa cocida;papas naturales|77|2|2.2|200|150|papa|gr=0.1 hc=16
Papas fritas|papas fritas;papa frita;papas fritas caseras;papas bastones;fritas;papas a caballo;papas cheddar;papas con cheddar;papas mcdonalds;papas medianas;papas grandes;papas fritas medianas;papas fritas grandes|300|3.4|3.5|150||porción|F gr=15 hc=36
Papas fritas de paquete|papas fritas de paquete;papas de paquete;papitas;lays;papas lays;pringles;papas pay;papas pai;snack;snacks;papas fritas lays;papas kesbeb;krachitos|536|7|4.5|45||paquete|F gr=35 hc=46
Papas al horno|papas al horno;papa al horno;papas rusticas;papa rustica;papas noisette;papas a la provenzal;papas españolas;papas en la freidora;papas al aire;papas en freidora de aire;papas a la crema;papas gratinadas|140|2.5|2.5|200||porción|gr=5 hc=20
Puré de papa|pure;pure de papa;pure de papas;pure mixto;pure de papa y zapallo;pure de papa y calabaza|100|2|1.5|200||porción|gr=4 hc=13
Puré de calabaza|pure de calabaza;pure de zapallo;pure de zapallo anco;pure de batata|60|1.2|1.5|200||porción|v1 gr=2.5 hc=7.4
Batata|batata;batatas;batata al horno;boniato;camote|90|1.6|3|200|200|batata|v1 gr=0.1 hc=19
Mandioca|mandioca;yuca|160|1.4|1.8|150||porción|gr=0.3 hc=37
Choclo|choclo;maiz;choclos;choclo desgranado;granos de choclo;humita|86|3.3|2.7|100|150|choclo|v.5 gr=1.4 hc=13.5
# ---- Legumbres y vegetarianos ----
Lentejas|lentejas;lenteja;ensalada de lentejas|116|9|8|180||porción|gr=0.4 hc=15
Garbanzos|garbanzos;garbanzo;ensalada de garbanzos|164|9|7.6|150||porción|gr=2.6 hc=22.5
Porotos|porotos;poroto;porotos negros;porotos colorados;frijoles;alubias|127|8.7|6.4|150||porción|gr=0.5 hc=18.5
Arvejas|arvejas;arveja;arvejas en lata;guisantes|81|5.4|5|80||porción|v1 gr=0.4 hc=11.5
Hummus|hummus;humus|170|8|6|50||porción|gr=10 hc=9
Falafel|falafel;faláfel|330|13|5|100|25|unidad|F gr=18 hc=26.5
Tofu|tofu|76|8|0.3|100||porción|gr=4.8 hc=1.9
Seitán|seitan|120|21|0.6|100||porción|gr=1.5 hc=5.3
Soja texturizada|soja texturizada;carne de soja;soja|150|16|6|100||porción|gr=0.5 hc=17.5
Medallón vegetal|hamburguesa de soja;medallon de soja;hamburguesa vegetal;hamburguesa de lentejas;medallon de verdura;medallon de lentejas;hamburguesa de garbanzos;medallon de garbanzos;hamburguesa veggie;hamburguesa de quinoa;medallon de quinoa;hamburguesa de espinaca|200|10|4|80|80|medallón|gr=9 hc=18
# ---- Comidas armadas ----
Guiso|guiso;guiso de arroz;estofado;guiso de fideos;cazuela;carbonada;puchero;estofado de carne;guisito|130|7|2.5|350||plato|r v.2 gr=5 hc=13
Guiso de lentejas|guiso de lentejas;lentejas guisadas;guiso de garbanzos;guiso de porotos;feijoada|120|7|4|350||plato|r gr=4 hc=12
Parrillada|parrillada;parrilla;parrillada mixta;asado completo|300|23|0|350||porción|r gr=22 hc=2.5
Locro|locro|140|7|3|350||plato|r gr=6 hc=13
Pastel de papa|pastel de papa;pastel de papas;hachis parmentier|140|8|1.5|300||porción|r gr=6.5 hc=11.5
Wok de pollo|wok;wok de pollo;salteado de pollo;pollo con verduras;pollo al wok;chop suey|120|11|1.5|350||plato|v.4 gr=4.5 hc=8.1
Quesadilla|quesadilla;quesadillas|300|13|2|150|75|quesadilla|gr=15 hc=27
Nachos con queso|nachos con queso;nachos con cheddar;nachos con guacamole|320|7|3|150||porción|F gr=18 hc=31
Guiso de pollo|estofado de pollo;guiso de pollo;pollo guisado;pollo al disco con verduras;cazuela de pollo|120|11|1.5|350||plato|v.2 gr=4 hc=9.2
Shawarma|shawarma;shawarma de pollo;shawarma de carne;kebab;kebap;doner;doner kebab;pita de pollo|210|12|1.5|300|300|unidad|P gr=9 hc=19.5
Sushi|sushi;pieza de sushi;rolls;roll;sushi roll;nigiri;niguiri;sashimi;sushi de salmon;rolls de salmon;philadelphia roll;california roll;geisha;hot roll;hot rolls;combinado de sushi|160|6|0.8|250|25|pieza|gr=3.5 hc=25.5
Ensalada mixta|ensalada mixta;ensalada comun;ensalada de lechuga y tomate;ensalada de lechuga tomate y cebolla;ensalada verde;ensaladita;ensalada simple|65|1.2|1.5|200||plato|v.9 gr=5 hc=3.1
Ensalada César|ensalada cesar;ensalada caesar;caesar;cesar|190|9|1.5|250||plato|v.5 gr=14 hc=6.2
Ensalada rusa|ensalada rusa;rusa;ensalada de papa y huevo|150|3|2|200||porción|v.3 gr=10 hc=11
Caprese|caprese;ensalada caprese|180|9|1|200||porción|v.5 gr=14 hc=4
Verduras|verduras;verdura;vegetales;vegetal;verduras al vapor;verduras salteadas;wok de verduras;verduras grilladas;verduras asadas;verduras al horno;vegetales asados;salteado de verduras;ratatouille;verduras hervidas;verduras a la plancha;guarnicion de verduras;verdura al vapor;hortalizas;zapallitos rellenos;tomates rellenos|45|2|2.5|200||porción|v1 gr=1 hc=5.8
Sopa|sopa;sopa de verduras;sopa crema;crema de calabaza;crema de zapallo;sopa de calabaza;sopa de zapallo;crema de verduras;sopa de verdura;minestrone;sopa de pollo|45|1.5|1|300||plato|v.5 l gr=1.5 hc=5.9
Caldo|caldo;consome;sopa de caldo;caldito|8|0.6|0|250||taza|l gr=0.4 hc=0.5
Revuelto de verduras|revuelto de zapallitos;revuelto gramajo;revuelto de verduras;revuelto de acelga|160|7|1.5|250||plato|v.3 gr=12 hc=5.2
Bastones de muzzarella|bastones de muzzarella;bastones de queso;palitos de queso;dedos de queso|300|14|1|120|20|bastón|F gr=18 hc=20
Croquetas|croquetas;croqueta;bombas de papa;bocaditos de espinaca;bocaditos de acelga;buñuelos;bunuelos;croquetas de espinaca;croqueta de espinaca;croquetas de verdura;croquetas de pollo;croquetas de papa|260|7|1.5|150|30|unidad|F gr=14 hc=26
Picada|tabla;picada de fiambres;tabla de fiambres;tabla de quesos;picadita|350|20|0.5|150||porción|r gr=28 hc=4.2
# ---- Verduras (crudas o cocidas) ----
Tomate|tomate;tomates;tomate redondo;tomate perita;tomate en rodajas;rodajas de tomate|18|0.9|1.2|120|120|tomate|v1 gr=0.2 hc=2.5
Tomate cherry|tomate cherry;tomates cherry;cherry;cherrys;tomatitos;tomatitos cherry|18|0.9|1.2|80|10|tomatito|v1 gr=0.2 hc=2.5
Salsa de tomate|salsa;salsa de tomate;tuco;filetto;salsa filetto;pomarola;tomate triturado;pure de tomate;salsa pomodoro;pomodoro;salsa napolitana;salsa casera|50|1.5|1.5|100||porción|v1 gr=2 hc=5.8
Salsa bolognesa|bolognesa;salsa bolognesa;salsa con carne;bolognesa de carne|130|8|1.5|150||porción|r v.5 gr=8 hc=5.8
Salsa blanca|salsa blanca;bechamel;salsa bechamel|120|3.5|0|80||porción|gr=7.5 hc=9.6
Salsa de crema|salsa de crema;salsa de queso;salsa cuatro quesos;cuatro quesos;crema y queso;salsa alfredo;alfredo;salsa rosa;salsa mixta|200|5|0|80||porción|gr=17 hc=6.8
Pesto|pesto;salsa pesto;pesto de albahaca|450|5|1|30||porción|gr=45 hc=5.8
Lechuga|lechuga;lechuga criolla;lechuga mantecosa;lechuga morada;lechuga capuchina|15|1.4|1.3|50||porción|v1 gr=0.2 hc=1.2
Rúcula|rucula;rucola;radicheta;berro;canonigos|25|2.6|1.6|40||porción|v1 gr=0.7 hc=1.3
Espinaca|espinaca;espinacas;acelga;kale;hojas verdes|23|2.9|2.2|80||porción|v1 gr=0.4 hc=0.9
Zanahoria|zanahoria;zanahorias;zanahoria rallada;zanahoria hervida|41|0.9|2.8|70|70|zanahoria|v1 gr=0.2 hc=7.5
Zapallo|zapallo;zapallo anco;calabaza;anco;zapallo al horno;calabaza al horno;calabacita;zapallo cabutia;cabutia|45|1|2|150||porción|v1 gr=0.1 hc=9
Zapallito|zapallito;zapallitos;zapallito redondo;zapallitos redondos;zucchini;zuchini;zukini;calabacin|17|1.2|1|150|150|zapallito|v1 gr=0.3 hc=1.9
Morrón|morron;morrones;morron rojo;pimiento;pimiento rojo;morron asado;pimenton fresco;morron amarillo|31|1|2.1|60|150|morrón|v1 c gr=0.3 hc=5
Morrón verde|morron verde;aji verde;pimiento verde;aji morron verde|20|0.9|1.7|60|150|morrón|v1 c gr=0.2 hc=2.8
Cebolla|cebolla;cebollas;cebolla morada;cebolla de verdeo;verdeo;cebollita;cebolla caramelizada;echalote;puerro|40|1.1|1.7|50|120|cebolla|v1 gr=0.1 hc=7.8
Brócoli|brocoli;brocolis;brócoli|34|2.8|2.6|100||porción|v1 c gr=0.4 hc=3.5
Coliflor|coliflor;repollo;repollitos de bruselas;coles de bruselas;repollo colorado|25|1.9|2|100||porción|v1 c gr=0.3 hc=2.7
Berenjena|berenjena;berenjenas;escabeche de berenjenas;berenjena al escabeche|25|1|3|100|200|berenjena|v1 gr=0.2 hc=3.3
Pepino|pepino;pepinos;pepinillo;pepinillos;pickles|15|0.7|0.5|60|150|pepino|v1 gr=0.1 hc=2.6
Chauchas|chauchas;chaucha;judias verdes;porotos verdes|31|1.8|3.4|100||porción|v1 gr=0.2 hc=3.8
Champiñones|champiñones;champinones;champignones;champiñon;hongos;girgolas;portobello|22|3|1|80||porción|v1 gr=0.3 hc=1.3
Remolacha|remolacha;remolachas|43|1.6|2.8|80|100|remolacha|v1 gr=0.2 hc=7.3
Apio|apio;hinojo;esparragos;esparrago;alcaucil;alcauciles;palmitos;palmito;rabanito;rabanitos;nabo;brotes de soja;germinados|20|1.5|2|80||porción|v1 gr=0.2 hc=2
Palta|palta;paltas;aguacate;guacamole|160|2|6.7|80|150|palta|gr=14.7 hc=1.6
Aceitunas|aceituna;aceitunas;aceitunas verdes;aceitunas negras|145|1|3.3|20|4|aceituna|gr=15 hc=0
Ajo|ajo;ajos;diente de ajo|149|6.4|2.1|3|3|diente|gr=0.5 hc=28.5
# ---- Frutas ----
Banana|banana;bananas;banano;platano|89|1.1|2.6|120|120|banana|f1 gr=0.3 hc=19
Manzana|manzana;manzanas;manzana roja;manzana verde;manzana verde;manzanita|52|0.3|2.4|180|180|manzana|f1 gr=0.2 hc=11
Pera|pera;peras|57|0.4|3.1|180|180|pera|f1 gr=0.1 hc=12
Naranja|naranja;naranjas;gajos de naranja|47|0.9|2.4|180|180|naranja|f1 c gr=0.1 hc=9.4
Mandarina|mandarina;mandarinas;tangerina|53|0.8|1.8|100|100|mandarina|f1 c gr=0.3 hc=11
Kiwi|kiwi;kiwis|61|1.1|3|75|75|kiwi|f1 c gr=0.5 hc=11.5
Frutillas|frutilla;frutillas;fresas;fresa|32|0.7|2|150|15|frutilla|f1 c gr=0.3 hc=5.6
Pomelo|pomelo;pomelos;toronja|42|0.8|1.6|250|300|pomelo|f1 c gr=0.1 hc=8.7
Uvas|uva;uvas;racimo de uvas|69|0.7|0.9|150|5|uva|f1 gr=0.2 hc=15.5
Durazno|durazno;duraznos;pelon;pelones;nectarina;durazno en almibar;duraznos en almibar|42|0.9|1.5|150|150|durazno|f1 gr=0.3 hc=8.2
Ciruela|ciruela;ciruelas|46|0.7|1.4|140|70|ciruela|f1 gr=0.3 hc=9.4
Damasco|damasco;damascos;albaricoque|48|1.4|2|120|40|damasco|f1 gr=0.4 hc=8.7
Ananá|anana;ananá;piña;pina|50|0.5|1.4|150|80|rodaja|f1 c gr=0.1 hc=11
Mango|mango;mangos|60|0.8|1.6|200|250|mango|f1 c gr=0.4 hc=12.5
Melón|melon;melones|34|0.8|0.9|200|200|tajada|f1 c gr=0.2 hc=6.8
Sandía|sandia;sandías|30|0.6|0.4|250|250|tajada|f1 gr=0.2 hc=6.2
Cerezas|cereza;cerezas;guindas|63|1|2|100|8|cereza|f1 gr=0.2 hc=13.5
Arándanos|arandano;arandanos;blueberries|57|0.7|2.4|100||puñado|f1 gr=0.3 hc=11.5 cnt=1.5
Frambuesas|frambuesa;frambuesas;moras;mora;frutos rojos;frutos del bosque|52|1.2|6.5|100||porción|f1 c gr=0.7 hc=7 cnt=4
Higo|higo;higos|74|0.8|3|100|50|higo|f1 gr=0.3 hc=15.5
Papaya|papaya;mamon|43|0.5|1.7|150||porción|f1 c gr=0.3 hc=8.7
Maracuyá|maracuya;mburucuya|97|2.2|10|50|50|unidad|f1 c gr=0.7 hc=15.5
Limón|limon;limones;jugo de limon;lima|29|1|2.8|20|60|limón|gr=0.3 hc=4.2
Fruta|fruta;frutas;una fruta;fruta de estacion;fruta picada|55|0.7|2|150|150|fruta|f1 gr=0.2 hc=11.5
Ensalada de frutas|ensalada de frutas;ensalada de fruta;macedonia;fruta picada con jugo|60|0.6|1.5|200||porción|f1 c gr=0.2 hc=13
Compota|compota;manzana asada;manzanas asadas;pera al horno|80|0.3|2|150||porción|f.5 gr=0.1 hc=18.5
Fruta en almíbar|fruta en almibar;peras en almibar;ananá en almibar|75|0.4|1|150||porción|f.5 gr=0.1 hc=17.5
Licuado|licuado;licuado de banana;smoothie;batido;licuado de frutilla;licuado de durazno|75|2.5|1|300||vaso|f.5 l M gr=1.5 hc=12.5
# ---- Frutos secos y semillas ----
Nueces|nuez;nueces;nueces peladas|654|15|6.7|30||puñado|n gr=65 hc=7
Almendras|almendra;almendras;almendras tostadas|579|21|12.5|30||puñado|n gr=50 hc=9.5
Maní|mani;manies;mani tostado;mani salado;mani japones;mani con chocolate;garrapiñada;garrapinada;garrapiñadas|585|24|8|30||puñado|n gr=49 hc=13
Castañas de cajú|castañas;castañas de caju;caju;castanas;castanas de caju;nueces de caju|553|18|3.3|30||puñado|n gr=44 hc=27
Pistachos|pistacho;pistachos|560|20|10|30||puñado|n gr=45 hc=18
Avellanas|avellana;avellanas|628|15|10|30||puñado|n gr=61 hc=7
Frutos secos|frutos secos;fruto seco;mix de frutos secos;mix;mix de nueces;mix de semillas;trail mix|600|18|7|30||puñado|n gr=53 hc=12
Mantequilla de maní|mantequilla de mani;pasta de mani;manteca de mani;peanut butter|590|25|6|20|15|cucharada|n gr=50 hc=14
Semillas|semillas;semillas de chia;chia;lino;semillas de lino;semillas de girasol;semillas de zapallo;semillas de sesamo;sesamo|500|18|20|10|10|cucharada|gr=40 hc=8
Coco rallado|coco;coco rallado|660|6.9|16|10||cucharada|gr=65 hc=7
Pasas de uva|pasas;pasas de uva;pasa de uva;datiles;datil;orejones;ciruelas pasas;frutas secas;fruta seca deshidratada|290|2.5|5|30||puñado|f3 gr=0.5 hc=66.5
# ---- Dulces, snacks y golosinas ----
Alfajor|alfajor;alfajores;alfajor simple;alfajor de chocolate;alfajor de dulce de leche;alfajor guaymallen;guaymallen;jorgito;havanna;cachafaz;fantoche;capitan del espacio;alfajor de fruta;alfajor milka;bon o bon alfajor;tatin|440|5|1.5|50|50|alfajor|gr=18 hc=64 S
Alfajor triple|alfajor triple;alfajores triples;triple de chocolate;fantoche triple;jorgito triple;terrabusi triple;guaymallen triple|440|5|1.5|75|75|alfajor|gr=18 hc=64 S
Alfajor de maicena|alfajor de maicena;alfajores de maicena;alfajorcito;alfajorcitos|420|5|1|40|40|alfajor|gr=17 hc=61 S
Chocolate|chocolate;chocolate con leche;barra de chocolate;tableta de chocolate;aguila;cofler;milka;block;cadbury;kit kat;kitkat;twix;snickers;mantecol;rocklets;chocolate blanco;rhodesia;huevo de pascua;chocolate con mani|540|7|2|25|7|cuadradito|cnt=45 gr=31 hc=57
Bombón|bombon;bombones;bon o bon;bonobon;chocolatin;chocolatines;kinder;tita;marroc;cabsha;bananita dolca;bananita|500|6|2|15|15|bombón|gr=27 hc=57 S
Chocolate amargo|chocolate amargo;chocolate 70;chocolate negro;chocolate semiamargo;chocolate 70 por ciento;chocolate 85;chocolate oscuro;cacao amargo|600|7.8|11|20|7|cuadradito|gr=43 hc=40
Caramelos|caramelo;caramelos;chupetin;chupetines;gomitas;mogul;gomita;pastillas;sugus;flynn paff;menthoplus;chicle;chicles;turron;turrón;marshmallow;malvaviscos;chupetin|380|0|0|20|5|caramelo|gr=0.5 hc=94
Galletitas dulces|galletitas;galletas;galletitas dulces;galletitas rellenas;galletitas de chocolate;oreo;oreos;pepitos;chocolinas;rumba;rumbas;tentaciones;sonrisas;mana;manon;merengadas;opera;toddy galletitas;terrabusi;melba;diversion;lincoln;surtidas;galletitas surtidas;galletitas de vainilla;galletitas de limon;anillos;galletitas pepitos;cookies;cookie;galletitas con chips;criollitas dulces;formis;macucas|480|5|2|40|10|galletita|gr=20 hc=69 S
Galletitas de agua|galletitas de agua;galletas de agua;criollitas;crackers;galletitas saladas;express;galletitas express;club social;traviata;traviatas;mediatarde;media tarde;pepas saladas;bay biscuit|420|10|3|30|7|galletita|gr=12 hc=66.5
Galletitas integrales|galletitas integrales;galletas integrales;galletitas de salvado;granix;cerealitas;galletitas de avena;galletas de avena;galletitas con semillas;tostaditas integrales;galletitas multicereal|420|11|8|30|7|galletita|i.6 gr=14 hc=58.5
Salmas|salmas;galletitas salmas;galletas salmas|390|9|4|18|6|galletita|gr=10 hc=63
Vainillas|vainilla;vainillas;bizcochuelo;vainillas de huevo;piononos|390|8|1|40|7|vainilla|gr=4 hc=80
Torta|torta;tortas;torta de chocolate;torta de cumpleaños;chocotorta;tiramisu;lemon pie;cheesecake;torta de ricota;torta de manzana;torta galesa;selva negra;rogel;torta rogel;marquise;tarta de frutilla;tarta de manzana;pastafrola;pasta frola;tarta dulce;budin;budín;budines;muffin;muffins;cupcake;cupcakes;magdalena;magdalenas;madalena;madalenas;bizcochuelo de chocolate;torta frita;tortas fritas;crumble;carrot cake;red velvet;postre helado;tarta de coco|370|5|1.2|100|100|porción|gr=16 hc=51
Brownie|brownie;brownies;blondie|450|5|2|70|70|brownie|gr=24 hc=52.5
Panqueques|panqueque;panqueques;crepe;crepes;crepa;waffle;waffles;hotcakes;pancakes;pancake|230|6|1|120|60|panqueque|gr=8 hc=33
Arroz con leche|arroz con leche;arrocito con leche|130|3|0.2|150||porción|gr=3 hc=22.5
Gelatina|gelatina;gelatina light;jello|60|1.5|0|120||porción|gr=0 hc=13.5
Mermelada|mermelada;mermeladas;dulce de membrillo;membrillo;dulce de batata;mermelada light;jalea;dulce de frutilla|250|0.5|1|20|20|cucharada|gr=0.1 hc=61.5
Miel|miel|304|0.3|0|20|20|cucharada|gr=0 hc=75.5
Azúcar|azucar;azucarado;azúcar|400|0|0|5|5|cucharadita|gr=0 hc=100
Nutella|nutella;crema de avellanas;crema de cacao;mantecol untable|540|6|3|20|15|cucharada|gr=31 hc=58
Barrita de cereal|barrita;barritas;barrita de cereal;barritas de cereal;barra de cereal;cereal bar;granix barrita;mix barrita;quaker barrita;barrita de mani;dubar;barrita dubar|400|6|3|25|25|barrita|gr=12 hc=65.5 S
Barrita proteica|barrita proteica;barra proteica;barritas proteicas;barrita de proteina;barra de proteina;protein bar|380|30|5|50|50|barrita|S gr=12 hc=34
Pochoclo|pochoclo;pochoclos;pop corn;popcorn;palomitas;pochoclo dulce;pochoclo salado;pororo|450|8|8|40||porción|i1 gr=20 hc=55.5
Snacks salados|palitos;palitos salados;chizitos;chizito;doritos;nachos;conitos;3d;tostitos;cheetos;saladix;papas fritas de bolsa;mani saborizado;palitos de queso de paquete|500|6|3|40||paquete|F gr=28 hc=54.5
# ---- Condimentos ----
Aceite|aceite;aceite de oliva;aceite de girasol;oliva;aceite de canola;chorrito de aceite;aliño;alino;aderezo de aceite|884|0|0|10|13|cucharada|gr=100 hc=0
Mayonesa|mayonesa;mayo;hellmanns;hellmann's;natura mayonesa;alioli;salsa tartara;salsa golf;golf;salsa golf light|680|1|0|15|15|cucharada|gr=75 hc=0.2
Mayonesa light|mayonesa light;mayonesa liviana;mayonesa light hellmanns|300|1|0|15|15|cucharada|gr=30 hc=6.5
Ketchup|ketchup;catsup;salsa barbacoa;barbacoa;bbq;salsa bbq;salsa agridulce|110|1.5|0|15|15|cucharada|gr=0.2 hc=25.5
Mostaza|mostaza|70|4|3|10|10|cucharadita|gr=3.5 hc=4.1
Chimichurri|chimichurri;salsa criolla;provenzal;salsa provenzal|300|1|1|15|15|cucharada|gr=32 hc=1.5
Salsa de soja|salsa de soja;salsa soja;soja salsa;shoyu;teriyaki;salsa teriyaki|60|6|0|10|10|cucharadita|gr=0 hc=5
Aderezo|aderezo;aderezos;aderezo cesar;salsa cesar;ranch;salsa ranch;salsa de yogur;salsa de ajo;tzatziki|300|1|0|15|15|cucharada|gr=30 hc=6.5
Vinagre|vinagre;aceto;aceto balsamico;vinagre balsamico|20|0|0|10|10|cucharadita|gr=0 hc=0.5
# ---- Bebidas ----
Agua|agua;agua mineral;agua de la canilla;agua con gas;agua sin gas;soda;sifon;agua fria;botella de agua;aguita|0|0|0|500|500|botella|l gr=0 hc=0
Gaseosa|coca;coca cola;cocacola;coca-cola;coca comun;coca normal;gaseosa;gaseosas;pepsi;sprite;seven up;7up;fanta;mirinda;paso de los toros;cunnington;manaos;schweppes;tonica;agua tonica;crush;pomelo neuss;neuss;cola;pritty;secco;gaseosa comun;bebida;refresco;refrescos|42|0|0|350|350|vaso|l gr=0 hc=10.5
Gaseosa sin azúcar|coca zero;coca cero;coca light;coca sin azucar;coca-cola zero;coca cola zero;cocacola zero;pepsi black;pepsi light;pepsi zero;gaseosa zero;gaseosa cero;gaseosa light;gaseosa sin azucar;gaseosa diet;sprite zero;7up free;seven up free;fanta zero;coca diet;zero;cero azucar;schweppes zero|0.4|0|0|350|350|vaso|l gr=0 hc=0.1
Agua saborizada|agua saborizada;levite;aquarius;saborizada;villavicencio saborizada;ser agua;agua con sabor;agua saborizada de pomelo;agua saborizada de manzana;awafrut|20|0|0|500|500|botella|l gr=0 hc=5
Agua saborizada sin azúcar|agua saborizada sin azucar;levite cero;levite zero;aquarius zero;aquarius cero;agua saborizada cero;agua saborizada light|1|0|0|500|500|botella|l gr=0 hc=0.2
Jugo de naranja exprimido|jugo de naranja;jugo exprimido;jugo natural;exprimido;jugo de naranja exprimido;naranja exprimida;jugo de mandarina;jugo de pomelo;jugo de frutas natural;jugo natural de naranja|45|0.7|0.2|250|250|vaso|l c gr=0.2 hc=10
Jugo|jugo;jugos;jugo de caja;jugo en caja;cepita;baggio;jugo de manzana;jugo de durazno;jugo de multifruta;ades;jugo ades;jugo de soja;jugo de fruta;jugo exprimido de manzana;jugo de pera;jugo de uva;limonada;limonada con menta|45|0.3|0.2|250|200|caja|l gr=0.1 hc=10.5
Jugo en polvo|tang;clight;jugo en polvo;jugo de sobre;jugo light;arcor jugo en polvo;verao;baggio en polvo;jugo de polvo|8|0|0|250|250|vaso|l gr=0 hc=2
Cerveza|cerveza;cervezas;birra;birras;porron;quilmes;stella;stella artois;brahma;heineken;patagonia;andes;corona;cerveza artesanal;pinta;pintas;chopp;imperial;budweiser;schneider;isenbeck;cerveza negra;cerveza rubia;ipa;cerveza roja|43|0.5|0|500|473|lata|l gr=0 hc=3.6
Cerveza sin alcohol|cerveza sin alcohol;cerveza cero;birra sin alcohol;cerveza 0;cerveza 0,0|20|0.3|0|473|473|lata|l gr=0 hc=4.7
Vino|vino;vinos;vino tinto;vino blanco;vino rosado;malbec;cabernet;torrontes;copa de vino;tinto;blanco;champagne;champan;espumante;sidra;cosecha tardia;vino dulce;tinto de verano|85|0|0|150|150|copa|l gr=0 hc=2.6
Fernet con coca|fernet;fernet con coca;fernando;fernet branca;fernecito;fernet con cola|80|0|0|350|350|vaso|l gr=0 hc=6
Aperitivo|gancia;gancia batido;campari;aperol;aperol spritz;spritz;cinzano;vermut;vermouth;cynar;campari con naranja;cynar con pomelo|90|0|0|250|250|vaso|l gr=0 hc=8
Trago|trago;tragos;cocktail;coctel;daikiri;daiquiri;mojito;caipirinha;caipiroska;caipi;cuba libre;destornillador;sex on the beach;piña colada;tequila sunrise;margarita;gin tonic;gintonic;vodka con speed;vodka con jugo;whisky con coca;ron con coca;tragos largos|120|0|0|250|250|vaso|l gr=0 hc=10
Bebida blanca|whisky;whiskey;vodka;ron;gin;tequila;shot;shots;chupito;licor;licor de dulce de leche;jagger;jagermeister;grappa;caña;cognac;brandy;baileys|230|0|0|45|45|medida|l gr=0 hc=0
Energizante|energizante;energizantes;red bull;speed;monster;energy drink;bebida energizante;rockstar;burn|45|0|0|250|250|lata|l gr=0 hc=11
Energizante sin azúcar|red bull sin azucar;speed sin azucar;monster zero;monster ultra;speed zero;red bull zero;energizante sin azucar|2|0|0|250|250|lata|l gr=0 hc=0.5
Bebida deportiva|gatorade;powerade;isotonica;bebida isotonica;bebida deportiva;h2o|25|0|0|500|500|botella|l gr=0 hc=6.2
Café|cafe;cafe solo;espresso;expreso;cafe negro;cafecito;cafe americano;americano;cafe sin leche;cafe de filtro;cafe instantaneo;nescafe;cafe de maquina;ristretto;doppio;cafe chico;cafe doble;cafe con azucar;cafe con edulcorante|2|0.1|0|100|100|taza|l gr=0 hc=0.4
Cortado|cortado;cortadito;cafe cortado|20|1|0|120|120|taza|l M gr=0.8 hc=2.2
Café con leche|cafe con leche;lagrima;lágrima;capuchino;capuccino;cappuccino;latte;cafe latte;flat white;mocaccino;moca;macchiato;latte macchiato;cafe con leche de almendras;te con leche;mate cocido con leche;caramel macchiato;frappuccino;cafe frio;ice latte;iced latte;cafe helado;lagrimita|45|2.2|0|200|200|taza|l M gr=1.5 hc=5.7
Té|te;te verde;te negro;infusion;infusiones;te de hierbas;te de manzanilla;manzanilla;mate cocido;te de boldo;boldo;tecito;te helado;te frio|1|0|0|250|250|taza|l gr=0 hc=0.2
Mate|mate;mates;matecito;matecitos;terere;mate amargo;mate dulce;mate con azucar;ronda de mate;yerba;termo de mate|2|0|0|300||ronda|l gr=0 hc=0.5
`;

// ==== ESTIMADOR LOCAL: lee la frase y la convierte en alimentos y cantidades ====
const ESTIMADOR = (function(){
  const FRACC = {"¼":" 1/4 ","½":" 1/2 ","¾":" 3/4 ","⅓":" 1/3 ","⅔":" 2/3 ","×":" x "};
  const norm = s => s.replace(/[¼½¾⅓⅔×]/g,c=>FRACC[c]).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"")
    .replace(/([a-z])\/([a-z])/g,"$1 $2")   // «natural/común» → dos palabras
    .replace(/(\d),(\d)/g,"$1.$2").replace(/(\d)\s*%/g,"$1").replace(/(\d)([a-z])/g,(m,a,b)=> a+" "+b)
    .replace(/[^a-z0-9.\/\s]+/g," ").replace(/\.(?!\d)/g," ").replace(/\s+/g," ").trim();
  // "x2" se separa en "x 2" y "7up"/"3d"/"h2o" se rearman abajo.
  const GLUE = {"7 up":"7up","3 d":"3d","h2 o":"h2o","h 2 o":"h2o","9 de oro":"9 de oro"};
  function sing(t){
    if(t.length<=3 || /\d/.test(t)) return t;
    if(t.endsWith("ces")) return t.slice(0,-3)+"z";
    if(t.endsWith("es") && /[lrndj]/.test(t[t.length-3]) && t.length>4) return t.slice(0,-2);
    if(t.endsWith("s") && !t.endsWith("ss")) return t.slice(0,-1);
    return t;
  }
  const DROP = new Set(["de","del","la","el","al","a","los","las","en","lo","le","les"]);
  function toks(s){
    let n = " "+norm(s)+" ";
    for(const [a,b] of Object.entries(GLUE)) n=n.split(" "+a+" ").join(" "+b+" ");
    const raw = n.trim().split(" ").filter(Boolean);
    const out=[];
    let de=false;   // «de» antes del token: «¼ de lata de garbanzos» (la cantidad es de lo que sigue) frente a «Garbanzos ¼ de lata Ricota»
    for(const r of raw){ if(DROP.has(r)){ de = de || r==="de"; continue; } out.push({raw:r, t:sing(r), de}); de=false; }
    return out;
  }

  const NUM = {un:1,una:1,uno:1,dos:2,tres:3,cuatro:4,cinco:5,seis:6,siete:7,ocho:8,nueve:9,diez:10,once:11,doce:12,quince:15,veinte:20,
    medio:0.5,media:0.5,mitad:0.5,cuarto:0.25,par:2,docena:12,ambos:2,ambas:2,varios:3,varias:3,unos:null,unas:null,otra:1,otro:1};
  // unidades: g = gramos fijos; "u" = la unidad del alimento; "p" = la porción típica
  const UNIT = {
    g:{g:1},gr:{g:1},grs:{g:1},gramo:{g:1},gram:{g:1},kg:{g:1000},kilo:{g:1000},kilogramo:{g:1000},
    ml:{g:1},cc:{g:1},mililitro:{g:1},l:{g:1000},lt:{g:1000},litro:{g:1000},
    porcion:{p:1,un:"porcion"},plato:{p:1,un:"plato"},platito:{p:0.6},plato_hondo:{p:1.3},racion:{p:1},
    vaso:{g:250,un:"vaso"},vasito:{g:200},taza:{g:250,un:"taza"},tazon:{g:350},jarra:{g:1000},copa:{g:150,un:"copa"},
    lata:{g:354,un:"lata"},latita:{g:220},botella:{g:500,un:"botella"},botellita:{g:500},porron:{g:340},pinta:{g:500},chopp:{g:500},
    pote:{g:190,un:"pote"},potecito:{g:120},caja:{g:200,un:"caja"},cajita:{g:200},
    rebanada:{u:1,g:30,un:"rebanada"},feta:{u:1,g:20,un:"feta"},tajada:{u:1,g:30,un:"tajada"},rodaja:{u:1,g:25,un:"rodaja"},
    unidad:{u:1},pieza:{u:1,g:25,un:"pieza"},bocha:{g:80,un:"bocha"},cucurucho:{g:160},
    cucharada:{g:15,un:"cucharada"},cuchara:{g:15,un:"cucharada"},hoja:{g:8,un:"hoja"},cda:{g:15,un:"cucharada"},cucharadon:{g:20},cucharadita:{g:5,un:"cucharadita"},cdita:{g:5,un:"cucharadita"},
    punado:{g:30,un:"punado"},cuadradito:{g:7,un:"cuadradito"},cuadrado:{g:7,un:"cuadradito"},trozo:{p:0.6},pedazo:{p:0.6},pedacito:{p:0.3},
    paquete:{g:100,un:"paquete"},paquetito:{g:40},bolsita:{g:45},sobre:{g:10},
    medida:{g:45,un:"medida"},chorrito:{g:10},chorro:{g:10},hilo:{g:5},puntita:{g:5},
    porcioncita:{p:0.6},tira:{u:1},bife:{u:1},filet:{u:1,un:"filet"},ronda:{p:1,un:"ronda"},bandeja:{p:1.5},tupper:{p:1},tapper:{p:1},bowl:{p:1},bol:{p:1},fuente:{p:1.5},cazuela_:{p:1}
  };
  const SIZE = {grande:1.4,grandes:1.4,enorme:1.8,abundante:1.4,generoso:1.3,generosa:1.3,mucho:1.4,mucha:1.4,bastante:1.3,doble:2,triple:3,
    chico:0.7,chica:0.7,pequeno:0.7,pequena:0.7,chiquito:0.5,chiquita:0.5,poco:0.5,poca:0.5,poquito:0.35,poquita:0.35,mediano:1,mediana:1,
    mini:0.5,minimo:0.4,minima:0.4,normal:1,regular:1,comun:1};
  const ADJ = new Set(["hervido","hervida","cocido","cocida","asado","asada","horno","plancha","grillado","grillada","parrilla","vapor","salteado","salteada",
    "casero","casera","natural","entero","entera","crudo","cruda","rallado","rallada","picado","picadito","relleno","rellena","gratinado","gratinada","tostado","tostada",
    "light","descremado","descremada","fresco","fresca","frio","fria","caliente","tibio","tibia","dorado","dorada","horneado","horneada","aire","freidora",
    "rodaja","cubo","tira","pure","pisado","pisada","fileteado","maduro","madura","verde","rojo","roja","amarillo","sola","solo","comun","clasico","clasica",
    "suave","picante","condimentado","condimentada","sabor","sabores","recalentado","calentado","tostadito","congelado","congelada","prefrito","rebozado","rebozada","empanado","empanada_adj","apanado","apanada",
    "congelado","congelada","empanizado","empanizada","sopera","entero"]);
  const FRITO = new Set(["frito","frita","fritito","frititos"]);
  const STOP = new Set(["comi","comimo","almorce","cene","desayune","meriende","tome","tomo","bebi","picotee","pique","probe","pedi","compre","hice","cocine","prepare","termine",
    "me","mi","mis","con","y","e","o","u","ni","sin","mas","tambien","despue","antes","luego","hoy","ayer","manana","noche","tarde","mediodia","temprano",
    "desayuno","almuerzo","merienda","cena","colacion","postre","entrada","principal","acompanamiento","guarnicion","snack_","algo","otro","otra","este","esta","eso","esa","ese",
    "que","cual","para","por","porque","pero","casi","todo","toda","nada","cada","como","tipo","onda","ahi","aca","alla","casa","restaurante","resto","comida","bocado",
    "rico","rica","raro","rara","muy","fuera","afuera","delivery","pedido","sobra","sobrante","quedo","habia","tenia","era","fue","estaba","con","sal","pimienta","oregano","condimento",
    "especia","pimenton","aji","molido","albahaca","perejil","comino","curry","nuez_moscada","edulcorante","sacarina","stevia","hielo","agua_","porcion_","cosa","alguna","alguno",
    "dulce","salado","salada","casi","aprox","aproximadamente","mas_o_meno","meno","menos","maso","cerca","unos","unas","x","segundo","segunda","primero","primera","vez","veces",
    "nomas","solamente","sobre","encima","arriba","adentro","mezclado","mezclada","acompanado","acompanada","tambien","porque","lugar","bar","cafeteria","facultad","facu","trabajo",
    "serenisima","sancor","ilolay","paladini","cagnoli","fela","fiambreria","variedad","marca","tregar","gallo","granja","sol","integra",
    "hecha","hecho","agregado","agregada","previamente","parte","puno","menor","mayor","tu","total","ademas","tirando","proteina","kcal","caloria",
    "air","fryer","airfryer","sobro","quedo_","aproximado","aproximada",
    "oficina","amigo","amiga","familia","novia","novio","vieja","viejo","abuela","abuelo","mama","papa_","hermano","hermana","companero","companera","cumple","cumpleano","juntada","asadito_","mcdonald","burger","king","starbuck","havanna_","freddo_","mostrador","kiosco","super","supermercado","mismo","misma"]);

  // ---- carga de la tabla ----
  function parseDB(txt){
    const foods=[]; const alias=[];
    for(const line of txt.split("\n")){
      if(!line.trim() || line.startsWith("#")) continue;
      const [n,al,k,p,f,por,u,uN,fl=""] = line.split("|");
      const x={n, k:+k, p:+p, f:+f, por:+por||100, u:+u||0, uN:uN||"", hc:0, gr:0, v:0, fr:0, ig:0, nz:false, c:false, r:false, a:false, l:false, F:false, P:false, b:false, B:false, cnt:0};
      for(const t of fl.trim().split(/\s+/).filter(Boolean)){
        const m=t.match(/^([a-zA-Z]+)=?([\d.]*)$/); if(!m) continue; const [,key,val]=m;
        if(key==="v") x.v=val?+val:1; else if(key==="f") x.fr=val?+val:1; else if(key==="i") x.ig=val?+val:1;
        else if(key==="n") x.nz=true; else if(key==="c") x.c=true; else if(key==="r") x.r=true; else if(key==="a") x.a=true;
        else if(key==="l") x.l=true; else if(key==="F") x.F=true; else if(key==="P") x.P=true; else if(key==="b") x.b=true; else if(key==="B") x.B=true;
        else if(key==="gr") x.gr=+val; else if(key==="hc") x.hc=+val;
        else if(key==="cnt") x.cnt=+val; else if(key==="M") x.M=true; else if(key==="T") x.T=true; else if(key==="S") x.S=true;
      }
      x.id=foods.length; foods.push(x);
      const seen=new Set();
      for(const a of (al+";"+n).split(";")){ const tk=toks(a).map(o=>o.t); const key=tk.join(" "); if(!key||seen.has(key)) continue; seen.add(key); alias.push({tk, food:x}); }
    }
    return {foods, alias};
  }

  // Sabores: después de un alimento marcado S («barrita de chocolate y naranja»), no suman otro alimento.
  const SABORES = new Set(["chocolate","naranja","frutilla","limon","vainilla","banana","coco","menta","mani","almendra","avellana","cereza","durazno",
    "manzana","arandano","fruto","rojo","dulce","leche","crema","cookie","caramelo","maracuya","mango","anana","nuez","pistacho","cafe","miel","frambuesa"]);
  let DB=null, BYFIRST=null, VOCAB=null, BYNAME=null;
  const INTEG = {"Fideos":"Fideos integrales","Arroz":"Arroz integral","Pan blanco":"Pan integral","Pan lactal":"Pan integral","Wrap":"Rapidita integral","Galletitas de agua":"Galletitas integrales","Pizza":"Pizza integral","Galletitas dulces":"Galletitas integrales"};
  function init(txt){
    DB=parseDB(txt); BYFIRST=new Map(); VOCAB=new Set(); BYNAME={};
    for(const a of DB.alias){ const k=a.tk[0]; if(!BYFIRST.has(k)) BYFIRST.set(k,[]); BYFIRST.get(k).push(a); for(const t of a.tk) VOCAB.add(t); }
    for(const l of BYFIRST.values()) l.sort((x,y)=>y.tk.length-x.tk.length);
    for(const f of DB.foods) BYNAME[f.n]=f;
    for(const w of [...STOP,...ADJ,...FRITO,...Object.keys(UNIT),...Object.keys(SIZE),...Object.keys(NUM)]) VOCAB.add(sing(w));
    return DB;
  }

  // ---- corrección de errores de tipeo (distancia de edición) ----
  function lev(a,b,max){
    if(Math.abs(a.length-b.length)>max) return max+1;
    let prev=Array.from({length:b.length+1},(_,i)=>i), pp=null;
    for(let i=1;i<=a.length;i++){ const cur=[i]; let best=i;
      for(let j=1;j<=b.length;j++){ let v=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));
        if(pp && i>1 && j>1 && a[i-1]===b[j-2] && a[i-2]===b[j-1]) v=Math.min(v,pp[j-2]+1);
        cur.push(v); if(v<best) best=v; }
      if(best>max) return max+1; pp=prev; prev=cur; }
    return prev[b.length];
  }
  const fixCache=new Map();
  function fix(t){
    if(VOCAB.has(t) || t.length<4 || /\d/.test(t)) return t;
    if(fixCache.has(t)) return fixCache.get(t);
    const max = t.length>=8?2:1; let best=t, bd=max+1;
    for(const w of VOCAB){ if(w.length<3) continue; const d=lev(t,w,max); if(d<bd || (d===bd && best!==t && Math.abs(w.length-t.length)<Math.abs(best.length-t.length))){ bd=d; best=w; } }
    const r = bd<=max? best : t; fixCache.set(t,r); return r;
  }

  function numOf(o){
    if(!o) return null; const r=o.raw;
    if(/^\d+(\.\d+)?$/.test(r)) return parseFloat(r);
    if(/^\d+\/\d+$/.test(r)){ const [a,b]=r.split("/").map(Number); return b? a/b : null; }
    if(/^x\d+(\.\d+)?$/.test(r)) return parseFloat(r.slice(1));
    if(Object.prototype.hasOwnProperty.call(NUM,r)) return NUM[r];
    return undefined;
  }
  const isNum = o => { const n=numOf(o); return n!==undefined; };

  function analizar(texto){
    if(!DB) throw new Error("Tabla no cargada");
    const T = toks(texto).map(o=>({...o, t:fix(o.t)}));
    const used = new Array(T.length).fill(false);
    const items=[];
    // 1) buscar alimentos (la coincidencia más larga primero)
    for(let i=0;i<T.length;i++){
      if(used[i]) continue;
      if(T[i].t==="sopa" && i>0 && /^cuchar/.test(T[i-1].t)){ used[i]=true; T[i].puente=true; continue; }   // «tres cucharas sopas» (dictado de «cucharadas soperas»)
      const prev=items[items.length-1];
      if(prev && ADJ.has(T[i].t)){ let k=i-1; while(k>=prev.e && (STOP.has(T[k].t)||STOP.has(T[k].raw)) && !["con","y","e","o","mas"].includes(T[k].raw)) k--;
        if(k+1===prev.e) continue; }   // «arroz (Gallo) tostado»: adjetivo, no el sándwich «tostado»
      const list=BYFIRST.get(T[i].t)||[];
      let hit=null, hitEnd=i, talla=1;
      // un tamaño puede ir en medio del nombre: «milanesa mediana de pollo»
      for(const a of list){ let j=i, k=0, ok=true, tl=1, saltos=0;
        while(k<a.tk.length){ if(j>=T.length || used[j]){ ok=false; break; }
          if(T[j].t===a.tk[k]){ j++; k++; continue; }
          if(k>0 && SIZE[T[j].raw]!==undefined && saltos<2){ tl*=SIZE[T[j].raw]; saltos++; j++; continue; }
          ok=false; break; }
        if(ok){ hit=a; hitEnd=j; talla=tl; break; } }
      if(i>0 && isNum(T[i-1]) && items.length){
        // "3 empanadas de carne y 2 de pollo": primero probar con el plato anterior
        const h=items[items.length-1].head; const alt=(BYFIRST.get(h)||[]).find(a=> a.tk.length>1 && i+a.tk.length-1<=T.length && a.tk.slice(1).every((t,j)=>T[i+j].t===t && !used[i+j]));
        if(alt && (!hit || alt.tk.length-1>=hit.tk.length)){ const end=i+alt.tk.length-1; for(let j=i;j<end;j++) used[j]=true; items.push({food:alt.food, s:i, e:end, head:h}); i=end-1; continue; }
      }
      if(!hit) continue;
      let end=hitEnd; for(let j=i;j<end;j++) used[j]=true;
      if(hit.food.S && end<T.length && SABORES.has(T[end].t)){   // sabores: «de chocolate y naranja»
        while(end<T.length && !used[end] && (SABORES.has(T[end].t) || (T[end].raw==="y" && end+1<T.length && SABORES.has(T[end+1].t)))){ used[end]=true; end++; } }
      items.push({food:hit.food, s:i, e:end, head:hit.tk[0], al:hit.tk.length, sz0:talla}); i=end-1;
    }
    // 2) cantidades alrededor de cada alimento
    const free = k => k>=0 && k<T.length && !used[k];
    const inicios = new Set(items.map(x=>x.s));
    const pesoPuro = u => u && u.g && !u.u && !u.p && !u.un;
    for(const it of items){
      it.num=null; it.unit=null; it.size=it.sz0||1; it.frito=false; it.neg=false; it.gExp=null; it.integral=false;
      let j=it.s-1, guard=0; const nums=[];
      while((free(j) || (j>=0 && T[j].puente)) && guard++<6){
        const o=T[j]; if(o.puente){ j--; continue; }
        if(o.raw==="sin"){ it.neg=true; used[j]=true; break; }
        if(SIZE[o.raw]!==undefined && !UNIT[o.t]){ it.size*=SIZE[o.raw]; used[j]=true; j--; continue; }
        if(UNIT[o.t] && it.unit==null && !isNum(o)){ it.unit=UNIT[o.t]; it.unitW=o.t; used[j]=true; j--; continue; }
        if(isNum(o)){ const n=numOf(o); if(n!=null) nums.push(n); used[j]=true; j--; continue; }
        break;
      }
      if(nums.length) it.num = nums.reduce((a,b)=>a*b,1);
      let k=it.e; guard=0;
      while(free(k) && guard++<5){
        const o=T[k];
        if(o.t==="integral"){ it.integral=true; used[k]=true; k++; continue; }
        if(ADJ.has(o.t) || ADJ.has(o.raw)){ used[k]=true; k++; continue; }
        if(FRITO.has(o.raw)||FRITO.has(o.t)){ it.frito=true; used[k]=true; k++; continue; }
        if(SIZE[o.raw]!==undefined){ it.size*=SIZE[o.raw]; used[k]=true; k++; continue; }
        if(/^x\d/.test(o.raw)){ it.num=numOf(o); used[k]=true; k++; continue; }
        if((o.raw==="como"||o.raw==="aprox"||o.raw==="aproximadamente"||o.raw==="unos"||o.raw==="unas") && T[k+1] && isNum(T[k+1])){ used[k]=true; k++; continue; }
        if(isNum(o) && numOf(o)!=null && T[k+1] && UNIT[T[k+1].t] && !(inicios.has(k+2) && T[k+2].de)){   // «… ¼ de lata de garbanzos»: esa cantidad es del alimento que sigue
          const u=UNIT[T[k+1].t];
          if(pesoPuro(u)) it.gExp=numOf(o)*u.g; else { it.num=numOf(o); it.unit=u; it.unitW=T[k+1].t; }
          used[k]=used[k+1]=true; k+=2; continue; }
        break;
      }
    }
    // cantidades sueltas ("pizza con amigos, 4 porciones"): van al alimento anterior que no tenía cantidad
    for(let i=0;i<T.length-1;i++){
      if(used[i] || used[i+1] || !isNum(T[i]) || numOf(T[i])==null || !UNIT[T[i+1].t]) continue;
      const prev = items.filter(it=> it.e<=i && i-it.e<=6 && it.num==null && it.gExp==null).pop();
      if(!prev) continue;
      const u=UNIT[T[i+1].t]; if(pesoPuro(u)) prev.gExp=numOf(T[i])*u.g; else { prev.num=numOf(T[i]); prev.unit=u; prev.unitW=T[i+1].t; }
      used[i]=used[i+1]=true;
    }
    for(const it of items){
      if(it.integral && INTEG[it.food.n] && BYNAME[INTEG[it.food.n]]) it.food=BYNAME[INTEG[it.food.n]];
      const f=it.food; const unit=it.unit, num=it.num;
      let g;
      if(it.gExp!=null) g=it.gExp;
      else if(pesoPuro(unit)) g=(num==null?1:num)*unit.g;
      else {
        let base;
        const uMatch = unit && f.u && (unit.u || (unit.un && f.uN && sing(norm(f.uN))===unit.un));
        if(uMatch) base=f.u;
        else if(unit && unit.p) base=f.por*unit.p;
        else if(unit && unit.g) base=unit.g;
        else if(num!=null) base = f.cnt || f.u || f.por;
        else base = f.por;
        g = (num==null?1:num)*base;
      }
      g *= it.size;
      it.g = Math.max(1, Math.round(g)); it.frito = it.frito && !f.F;
    }
    // el mismo alimento nombrado dos veces seguidas ("una bocha de helado", "galletitas oreo") cuenta una vez
    for(let i=items.length-1;i>0;i--){ const a=items[i-1], b=items[i]; if(a.food===b.food && b.s-a.e<=1){ if(b.num!=null && a.num==null){ a.g=b.g; } items.splice(i,1); } }
    // listas del tipo «Tomate ½ tomate chico» o «Milanesa de pollo ¼ de una milanesa»: encabezado y después la cantidad, sin «y» ni «con» en el medio
    const conCant = it => it.num!=null || it.gExp!=null || it.unit!=null || (it.size||1)!==1;
    for(let i=items.length-1;i>0;i--){ const a=items[i-1], b=items[i];
      const entre=T.slice(a.e,b.s), aclara=entre.some(o=>["aproximadamente","aprox","osea"].includes(o.raw));   // «2 pedacitos, aproximadamente ½ boniato»
      if(!(a.food===b.food || (a.head===b.head && (b.al||1)===1)) || b.s-a.e>5 || (conCant(a) && !aclara)) continue;
      if(entre.some(o=>["y","e","con","mas"].includes(o.raw))) continue;
      a.g = a.food===b.food? b.g : Math.max(1, Math.round(b.g/(b.food.u||b.food.por)*(a.food.u||a.food.por)));
      a.e=b.e; items.splice(i,1); }
    // panes seguidos («rebanada de pan lactal Fargo negro»): vale el más específico, con la cantidad del primero
    for(let i=items.length-1;i>0;i--){ const a=items[i-1], b=items[i];
      if(!(a.food.b && b.food.b) || b.s-a.e>1 || a.food===b.food) continue;
      a.g=Math.max(1, Math.round(a.g/(a.food.u||a.food.por)*(b.food.u||b.food.por))); a.food=b.food; a.e=b.e; items.splice(i,1); }
    // 3) reglas de combinación
    let out = items.filter(i=>!i.neg);
    // si algo ya trae pan (hamburguesa, pancho, sándwich), no se suma "pan" aparte cerca
    for(const p of out.filter(i=>i.food.P)){
      out = out.filter(i=> i===p || !(i.food.b && !i.food.B && Math.abs(i.s-p.s)<=8));
    }
    // lo que ya trae leche (licuado, café con leche) no suma "leche" aparte cerca
    for(const p of out.filter(i=>i.food.M)){ out = out.filter(i=> i===p || !(i.food.n==="Leche" && Math.abs(i.s-p.s)<=5)); }
    // relleno de sándwiches, tostados, wraps y tacos: porción de relleno, no de plato
    for(const c of out.filter(i=>i.food.B)){
      const fx = Math.min(Math.max(c.g/80, 0.75), 1.2);
      for(const i of out){ if(i===c || i.food.b || i.food.l || i.s<=c.s || i.s-c.e>6 || i.num!=null || i.gExp!=null) continue;
        if(i.food.u && i.food.u===i.food.por) continue;
        i.g = Math.max(5, Math.round(Math.min(i.g,80)*fx)); }
    }
    // coberturas de pizzas y hamburguesas ("pizza con tomate", "hamburguesa con lechuga y tomate"): unas rodajas, no la porción entera
    const COBERTURA = new Set(["Aceitunas","Jamón cocido","Jamón crudo","Queso","Cheddar","Mozzarella","Panceta","Palta","Champiñones"]);
    for(const c of out.filter(i=>i.food.T)){
      const tope = Math.min(150, Math.round(25*Math.max(1, c.g/(c.food.u||c.g))));
      for(const i of out){ if(i===c || i.s<=c.s || i.s-c.e>6 || i.num!=null || i.gExp!=null || i.food.l || i.food.T) continue;
        if(i.food.v>=1 || i.food.fr>=1 || COBERTURA.has(i.food.n)) i.g = Math.min(i.g, tope); }
    }
    // panes que se rellenan (sándwich, tostado, wrap) sin relleno nombrado: relleno típico
    const extra=[];
    for(const c of out.filter(i=>i.food.B)){
      const relleno = out.some(i=> i!==c && !i.food.b && i.s>c.s && i.s-c.e<=6 && !i.food.l);
      if(!relleno){
        const k = c.g / (c.food.u||c.g);
        extra.push({food:BYNAME["Jamón cocido"], g:Math.round(40*k), s:c.s, auto:true});
        extra.push({food:BYNAME["Queso"], g:Math.round(30*k), s:c.s, auto:true});
      }
    }
    // "ensalada" suelta: si dice de qué, cuenta el aderezo; si no, ensalada mixta
    for(let i=0;i<T.length;i++){
      if(used[i] || T[i].t!=="ensalada") continue;
      used[i]=true;
      const nombrados = out.filter(x=> x.s>i && x.s-i<=7 && x.food.v>=1);
      if(nombrados.length){ extra.push({food:BYNAME["Aceite"], g:8, s:i, auto:true, nota:"aderezo"}); }
      else extra.push({food:BYNAME["Ensalada mixta"], g:200, s:i});
    }
    out = out.concat(extra).sort((a,b)=>a.s-b.s);
    // 4) no reconocido
    const sobras=[];
    for(let i=0;i<T.length;i++){ if(used[i]) continue; const o=T[i];
      if(STOP.has(o.t)||STOP.has(o.raw)||ADJ.has(o.t)||FRITO.has(o.raw)||UNIT[o.t]||SIZE[o.raw]!==undefined||isNum(o)||o.raw.length<=2) continue;
      sobras.push(o.raw); }
    // 5) totales
    let kcal=0,prot=0,carb=0,grasa=0,fibra=0,veg=0,fru=0,integ=0,nuez=0,vitC=false,roja=false,atun=false;
    for(const it of out){ const f=it.food, g=it.g;
      kcal+=f.k*g/100 + (it.frito? g*0.5 : 0); prot+=f.p*g/100; fibra+=f.f*g/100;
      carb+=f.hc*g/100; grasa+=f.gr*g/100 + (it.frito? g*0.5/9 : 0);   // frito: el aceite absorbido suma grasa
      veg+=g*f.v; fru+=g*f.fr; integ+=g*(it.integral && f.b ? Math.max(f.ig,1) : f.ig); if(f.nz) nuez+=g; if(f.c && g>=60) vitC=true; if(f.r) roja=true; if(f.a) atun=true; }
    return {
      items: out.map(it=>({n:it.food.n, g:it.g, l:it.food.l, u:it.food.u, uN:it.food.uN, auto:!!it.auto, nota:it.nota||""})),
      sobras,
      kcal:Math.round(kcal), prot:Math.round(prot), carb:Math.round(carb), grasa:Math.round(grasa), fibra:Math.round(fibra),
      verduras:Math.round(veg/80*2)/2, frutas:Math.round(fru/150*2)/2, integrales:Math.round(integ/30*2)/2,
      nueces: nuez>=15?1:0, vitC, roja, atun
    };
  }
  function describir(it){
    const unidad = it.l? "ml":"g";
    if(it.u && it.u>=20 && !it.l){ const n=it.g/it.u; if(Math.abs(n-Math.round(n))<0.01 && n>=1 && n<=24){
      const un=it.uN||""; const base=norm(it.n).split(" ")[0];
      if(!un || un==="unidad" || sing(norm(un))===sing(base)) return n===1? it.n : `${it.n} ×${n}`;
      return `${it.n} (${n} ${n===1?un:plural(un)})`; } }
    return `${it.n} ${it.g} ${unidad}`;
  }
  function plural(w){ if(/[aeiouáéí]$/.test(w)) return w+"s"; if(w.endsWith("z")) return w.slice(0,-1)+"ces"; if(w.endsWith("ón")) return w.slice(0,-2)+"ones"; if(w.endsWith("án")) return w.slice(0,-2)+"anes"; return w+"es"; }
  return {init, analizar, describir, alimento:n=>BYNAME[n], norm, _toks:toks};
})();
ESTIMADOR.init(ALIMENTOS);
