// Server-side pricing mirror of the catalog. Keep in sync with PRODUCTS in index.html.
// Only what's needed to recompute price safely (never trust a price sent from the browser).

const ROLLUP_VARIANTS = [
  { label: '200 × 200 cm', price: 530 },
];

const ANGOLI_ARROTONDATI_TIERS = [{qty:100,price:8},{qty:250,price:10},{qty:500,price:14},{qty:1000,price:19},{qty:2500,price:23},{qty:5000,price:29},{qty:7500,price:38},{qty:10000,price:48}];
function angoliArrotondatiPrice(qty) {
  const t = ANGOLI_ARROTONDATI_TIERS.find(t => qty <= t.qty);
  return (t || ANGOLI_ARROTONDATI_TIERS[ANGOLI_ARROTONDATI_TIERS.length - 1]).price;
}

const PRICING = {
  // Reconstructed 1:1 from the real Advanced Product Fields (Studio Wombat) config for this product.
  '197': { nome: 'Stampa Roll-Up 80/85 × 200 cm', ean: '0652026573206', type: 'formula',
    rollupRate: (qty) => (qty > 6 ? 20 : qty > 4 ? 25 : 30),
    strutturaRates: [30, 0], // index 0 = "Con struttura", 1 = "Solo stampa"
    rate24h: 10, forceTempi: '24H' },
  '5833': { nome: 'Stampa Roll-Up 200 × 200 cm', ean: '0652026573213', type: 'size', variants: ROLLUP_VARIANTS },
  '5850': { nome: 'Stampa Roll-Up 150 × 200 cm', ean: '0652026573220', type: 'formula',
    rollupRate: (qty) => (qty > 1 ? 90 : 95),
    strutturaRates: [255, 0], // index 0 = "Con struttura", 1 = "Solo stampa"
    rate24h: 0 },
  '5392': { nome: 'Volantini A5 gr 130', ean: '0652026573237', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:100,price:33},{qty:250,price:36},{qty:500,price:41},{qty:1000,price:48},{qty:2500,price:74},{qty:5000,price:107},{qty:10000,price:166},{qty:20000,price:299},{qty:30000,price:440},{qty:40000,price:573},{qty:50000,price:712},{qty:60000,price:851},{qty:70000,price:990},{qty:80000,price:1119},{qty:90000,price:1257},{qty:100000,price:1395}],
      [{qty:100,price:66},{qty:250,price:69},{qty:500,price:74},{qty:1000,price:81},{qty:2500,price:107},{qty:5000,price:141},{qty:10000,price:204},{qty:20000,price:364},{qty:30000,price:527},{qty:40000,price:685},{qty:50000,price:848},{qty:60000,price:1012},{qty:70000,price:1176},{qty:80000,price:1330},{qty:90000,price:1492},{qty:100000,price:1655}],
    ] },
  '5560': { nome: 'Volantini A4 gr 170', ean: '0652026573244', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:10,price:24.27},{qty:25,price:28.8},{qty:50,price:34.72},{qty:75,price:41.49},{qty:100,price:47.97},{qty:250,price:55.22},{qty:500,price:65.41},{qty:1000,price:85.3},{qty:2500,price:137.28},{qty:5000,price:232.38},{qty:7500,price:338.32},{qty:10000,price:423.04},{qty:15000,price:608.5},{qty:20000,price:783.94}],
      [{qty:10,price:61.34},{qty:25,price:66.37},{qty:50,price:72.37},{qty:75,price:79.5},{qty:100,price:86.45},{qty:250,price:93.95},{qty:500,price:104.35},{qty:1000,price:124.69},{qty:2500,price:174.94},{qty:5000,price:295.55},{qty:7500,price:428.29},{qty:10000,price:513.01},{qty:15000,price:752.06},{qty:20000,price:954.32}],
    ] },
  '5840': { nome: 'Volantini A6 gr 130', ean: '0652026573251', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:100,price:25},{qty:250,price:30},{qty:500,price:31},{qty:1000,price:35},{qty:2500,price:44},{qty:5000,price:67},{qty:10000,price:108},{qty:20000,price:190},{qty:30000,price:277},{qty:40000,price:346},{qty:50000,price:437},{qty:60000,price:526},{qty:70000,price:596},{qty:80000,price:687},{qty:90000,price:776},{qty:100000,price:847}],
      [{qty:100,price:56},{qty:250,price:60},{qty:500,price:65},{qty:1000,price:70},{qty:2500,price:82},{qty:5000,price:100},{qty:10000,price:142},{qty:20000,price:253},{qty:30000,price:368},{qty:40000,price:441},{qty:50000,price:550},{qty:60000,price:664},{qty:70000,price:737},{qty:80000,price:851},{qty:90000,price:964},{qty:100000,price:1040}],
    ] },
  '5723': { nome: 'Volantini 10×21 cm', ean: '0652026573268', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1000,price:35},{qty:2500,price:54},{qty:5000,price:83},{qty:10000,price:135},{qty:20000,price:238},{qty:30000,price:350},{qty:40000,price:458},{qty:50000,price:571},{qty:60000,price:683},{qty:70000,price:796},{qty:80000,price:909},{qty:90000,price:1022},{qty:100000,price:1114}],
      [{qty:1000,price:68},{qty:2500,price:87},{qty:5000,price:117},{qty:10000,price:170},{qty:20000,price:302},{qty:30000,price:442},{qty:40000,price:579},{qty:50000,price:709},{qty:60000,price:847},{qty:70000,price:985},{qty:80000,price:1123},{qty:90000,price:1260},{qty:100000,price:1352}],
    ] },
  '5398': { nome: 'Pieghevoli A4 a 2 Ante A5', ean: '0652026573275', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:100,price:48},{qty:500,price:71},{qty:1000,price:89},{qty:2500,price:138},{qty:5000,price:236},{qty:10000,price:410},{qty:20000,price:769},{qty:30000,price:1169},{qty:40000,price:1563},{qty:50000,price:1902},{qty:60000,price:2315},{qty:70000,price:2784},{qty:80000,price:3037},{qty:90000,price:3427},{qty:100000,price:3619}],
      [{qty:100,price:81},{qty:500,price:105},{qty:1000,price:122},{qty:2500,price:173},{qty:5000,price:298},{qty:10000,price:500},{qty:20000,price:969},{qty:30000,price:1438},{qty:40000,price:1908},{qty:50000,price:2334},{qty:60000,price:2795},{qty:70000,price:3318},{qty:80000,price:3717},{qty:90000,price:4179},{qty:100000,price:4611}],
    ] },
  '5794': { nome: 'Pieghevoli A4 a 3 Ante 10×21 cm', ean: '0652026573282', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:100,price:55},{qty:500,price:70},{qty:1000,price:81},{qty:2500,price:142},{qty:5000,price:240},{qty:10000,price:433},{qty:20000,price:842},{qty:30000,price:1245},{qty:40000,price:1678},{qty:50000,price:2013},{qty:60000,price:2393},{qty:70000,price:2787},{qty:80000,price:3140},{qty:90000,price:3431},{qty:100000,price:3685}],
      [{qty:100,price:90},{qty:500,price:103},{qty:1000,price:115},{qty:2500,price:177},{qty:5000,price:304},{qty:10000,price:528},{qty:20000,price:1027},{qty:30000,price:1493},{qty:40000,price:2029},{qty:50000,price:2445},{qty:60000,price:2853},{qty:70000,price:3322},{qty:80000,price:3749},{qty:90000,price:4183},{qty:100000,price:4643}],
    ] },
  '5606': { nome: 'Locandine 70×100 cm', ean: '0652026573299', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:20,price:52},{qty:30,price:66},{qty:40,price:82},{qty:50,price:97},{qty:55,price:103},{qty:60,price:109},{qty:65,price:116},{qty:70,price:122},{qty:75,price:128},{qty:80,price:133},{qty:85,price:139},{qty:90,price:144},{qty:95,price:148},{qty:100,price:151},{qty:150,price:175},{qty:200,price:190},{qty:250,price:204},{qty:300,price:222},{qty:400,price:268},{qty:500,price:295},{qty:750,price:385},{qty:1000,price:454},{qty:1500,price:633},{qty:2000,price:792},{qty:3000,price:1118},{qty:4000,price:1437},{qty:5000,price:1770},{qty:6000,price:2104}],
      [{qty:20,price:129},{qty:30,price:129},{qty:40,price:129},{qty:50,price:129},{qty:55,price:135},{qty:60,price:142},{qty:65,price:148},{qty:70,price:154},{qty:75,price:160},{qty:80,price:166},{qty:85,price:171},{qty:90,price:177},{qty:95,price:180},{qty:100,price:183},{qty:150,price:207},{qty:200,price:222},{qty:250,price:236},{qty:300,price:254},{qty:400,price:325},{qty:500,price:352},{qty:750,price:466},{qty:1000,price:534},{qty:1500,price:768},{qty:2000,price:954},{qty:3000,price:1366},{qty:4000,price:1737},{qty:5000,price:2149},{qty:6000,price:2521}],
    ] },
  // Reconstructed 1:1 from the real APF config for this product (conditional Formato → Carta → Quantità chain).
  '5515': { nome: 'Biglietti da Visita Prezzi Strategici', ean: '0652026573602', type: 'businessCardStrategici',
    qtyLabels: [500,1000,2500,5000,10000,15000,20000],
    formats: [
      { label: 'Orizzontale 5,5×8,5 cm', papers: [
        { label: 'gr. 300 (classico)', deliveries: [
          { label: 'Budget 1 Settimana', prices: [40,45,54,71,105,136,165] },
          { label: 'Express 2 gg', prices: [73,78,87,104,137,169,198] },
        ] },
        { label: 'gr. 400', deliveries: [
          { label: 'Budget 1 Settimana', prices: [45,49,58,78,116,153,203] },
          { label: 'Express 2 gg', prices: [79,82,90,111,149,185,262] },
        ] },
        { label: 'gr. 500', deliveries: [ { label: 'Budget 1 Settimana', prices: [44,48,56,73,109,142,176] } ] },
      ] },
      { label: 'Verticale 5,5×8,5 cm', papers: [
        { label: 'gr. 300 (classico)', deliveries: [
          { label: 'Budget 1 Settimana', prices: [40,45,54,71,105,136,165] },
          { label: 'Express 2 gg', prices: [73,78,87,104,137,169,198] },
        ] },
        { label: 'gr. 400', deliveries: [
          { label: 'Budget 1 Settimana', prices: [45,49,58,78,116,153,203] },
          { label: 'Express 2 gg', prices: [79,82,90,111,149,185,262] },
        ] },
        { label: 'gr. 500', deliveries: [ { label: 'Budget 1 Settimana', prices: [44,48,56,73,109,142,176] } ] },
      ] },
      { label: 'Orizzontale 9×5 cm', papers: [
        { label: 'gr. 300 (classico)', deliveries: [
          { label: 'Budget 1 Settimana', prices: [43,46,52,67,98,124,149] },
          { label: 'Express 2 gg', prices: [76,79,85,100,131,157,182] },
        ] },
        { label: 'gr. 400', deliveries: [ { label: 'Budget 1 Settimana', prices: [45,48,57,76,113,150,200] } ] },
        { label: 'gr. 500', deliveries: [ { label: 'Budget 1 Settimana', prices: [44,48,56,73,109,142,176] } ] },
      ] },
      { label: 'Verticale 5×9 cm', papers: [
        { label: 'gr. 300 (classico)', deliveries: [
          { label: 'Budget 1 Settimana', prices: [43,46,52,67,98,124,149] },
          { label: 'Express 2 gg', prices: [76,79,85,100,131,157,182] },
        ] },
        { label: 'gr. 400', deliveries: [ { label: 'Budget 1 Settimana', prices: [45,48,57,76,113,150,200] } ] },
        { label: 'gr. 500', deliveries: [ { label: 'Budget 1 Settimana', prices: [44,48,56,73,109,142,176] } ] },
      ] },
      // Order of `formats` MUST match index.html exactly — the client sends a numeric
      // formatIndex, so a different order here charges the price of a different format.
      { label: 'Quadrato 5,5×5,5 cm', papers: [
        { label: 'gr. 300 (classico)', deliveries: [
          { label: 'Budget 1 Settimana', prices: [41,41,45,56,78,97,114] },
          { label: 'Express 2 gg', prices: [75,73,78,89,110,129,147] },
        ] },
        { label: 'gr. 400', deliveries: [ { label: 'Budget 1 Settimana', prices: [41,43,49,62,89,115,138] } ] },
        { label: 'gr. 500', deliveries: [ { label: 'Budget 1 Settimana', prices: [44,48,56,73,109,142,176] } ] },
      ] },
    ] },
  '198': { nome: 'Foto Quadro Personalizzato', ean: '0652026573312', type: 'fotoQuadro', basePrice: 30 },
  '199': { nome: 'Marilyn Monroe Warhol', ean: '0652026573329', type: 'size', variants: [
    { label: '50×40 cm', price: 48 },
    { label: '70×50 cm', price: 67 },
  ] },
  '200': { nome: 'Quadro Claude Monet', ean: '0652026573336', type: 'size', variants: [
    { label: '50×40 cm', price: 48 },
    { label: '70×50 cm', price: 67 },
  ] },
  '201': { nome: 'Quadro Van Gogh "Notte stellata"', ean: '0652026573343', type: 'size', variants: [
    { label: '50×40 cm', price: 48 },
    { label: '70×50 cm', price: 67 },
  ] },
  '203': { nome: 'Adesivi Prespaziati Personalizzati', ean: '0652026573350', type: 'flat', price: 15 },
  '206': { nome: 'Foto Libro Copertina Flessibile', type: 'flat', price: 15 },
  '209': { nome: '2 Adesivi Jeep Renegade Fango', ean: '0652026573367', type: 'flat', price: 49 },
  '210': { nome: '1 Paio di 2 Woodpecker Adesivi Prespaziati', ean: '0652026573374', type: 'flat', price: 32 },
  '212': { nome: 'Wall Stickers Sky Line Città Vinile', ean: '0652026573381', type: 'skylineFormato' },
  '213': { nome: 'Adesivi frasi romane per decorazione', ean: '0652026573398', type: 'imageSwatch', price: 24,
    swatches: ['Mejo','Iddio','Tutte le strade','Omo de Panza',"'ngrassa",'Napoli Orto','Faccia Tosta','A chi tocca'] },
  '214': { nome: 'Decalcomania Hollywood Sticker', ean: '0652026573404', type: 'imageSwatchQty', pricePerUnit: 24, defaultSwatchIdx: 2,
    swatches: ['James Dean','Madonna','Marilyn','Audrey','Swift'] },
  '214': { nome: 'Decalcomania Hollywood Sticker', ean: '0652026573404', type: 'flat', price: 20 },
  '215': { nome: 'Struttura Personalizzata per Eventi', ean: '0652026573411', type: 'strutturaEventi' },
  '216': { nome: 'Scatola Gioielli + stampa Oro/Argento', ean: '0652026573527', type: 'scatolaGioielli',
    misuraChoices: ['5x5x3cm','7x7x3cm','9x9x3cm','23x4,5x2,4cm','8x8x8cm','17x17x3cm'],
    misuraRate: [1.6, 1.8, 2.25, 2.4, 3.95, 4.35],
    coloreChoices: ['Oro Lucido','Argento Lucido','Bianco Opaco'],
  },
  '5805': { nome: 'Libretti Chiesa Personalizzati', ean: '0652026573565', type: 'libretti' },
  '5851': { nome: 'Volantini e Pieghevoli Personalizzati', ean: '0652026573619', type: 'volantiniPieghevoli' },
  '284': { nome: 'Rilegature a spirale Roma EUR', ean: '0652026573541', type: 'rilegature',
    cartaChoices: ['gr. 80','gr. 100','gr. 200','gr. 300','gr. 350','gr. 400'],
    cartaRate: [0.042, 0.065, 0.125, 0.185, 0.215, 0.245],
  },
  '220': { nome: '2 Adesivi Jeep Renegade Stella Graffiata', ean: '0652026573428', type: 'flat', price: 23 },
  '221': { nome: '2 Adesivi Jeep Renegade Stella e Teschio', ean: '0652026573435', type: 'flat', price: 23 },
  '223': { nome: '2 Adesivi Jeep Renegade Logo', ean: '0652026573442', type: 'flat', price: 49 },
  '224': { nome: '2 Adesivi Jeep Renegade Logo + Montagna', ean: '0652026573459', type: 'flat', price: 52 },
  '225': { nome: '2 Adesivi Prespaziati Jeep Renegade Crossfit', ean: '0652026573466', type: 'flat', price: 32 },
  '226': { nome: '2 Adesivi Prespaziati Jeep Renegade Cavalli', ean: '0652026573473', type: 'flat', price: 32 },
  '227': { nome: 'Stampa Quadro Van Gogh Autoritratto', ean: '0652026573480', type: 'size', variants: [
    { label: '50×40 cm', price: 48 },
    { label: '70×50 cm', price: 67 },
  ] },
  '250': { nome: 'Locandine Stampate a Roma Eur 24H', ean: '0652026573497', type: 'locandine250',
    formatChoices: ['35 x 50 cm','50 x 70 cm','70 x 100 cm','A3','A2','A1','A0'],
    formatRates: [2.8,5.3,8.3,2.8,5.3,8,10],
    cartaChoices: ['Usomano gr 80','Usomano gr 180','Carta Sintetica gr 160'],
    cartaMultiplier: [0.8,1.1,1.4],
  },
  '5849': { nome: 'Quadro Pop Art Personalizzato Warhol', ean: '0652026573503', type: 'quadroWarhol' },
  '5047': { nome: 'Stampa Badge Personalizzati', ean: '0652026573558', type: 'badge' },
  '5047-en': { nome: 'Custom Printed Badges', ean: '0652026573558', type: 'badgeEn' },
  '202': { nome: 'Biglietti da visita a rilievo', ean: '0652026573572', type: 'businessCardRilievo',
    formats: [
      { label: 'Quadrato 5,5×5,5 cm', papers: [
        { label: 'gr. 350 offset', tiers: [{qty:250,price:72},{qty:500,price:92},{qty:1000,price:121},{qty:2500,price:211},{qty:5000,price:355},{qty:10000,price:681}] },
      ] },
      { label: 'Orizzontale 5,5×8,5 cm', papers: [
        { label: 'gr. 300 patinata opaca', tiers: [{qty:100,price:49},{qty:500,price:87},{qty:1000,price:99},{qty:2500,price:184},{qty:5000,price:308},{qty:10000,price:578},{qty:20000,price:1122}] },
        { label: 'gr. 350 offset', tiers: [{qty:250,price:72},{qty:500,price:92},{qty:1000,price:121},{qty:2500,price:211},{qty:5000,price:355},{qty:10000,price:681}] },
        { label: 'gr. 400 patinata opaca', tiers: [{qty:100,price:53},{qty:500,price:83},{qty:1000,price:119},{qty:2500,price:232},{qty:5000,price:424},{qty:10000,price:807},{qty:20000,price:1578}] },
      ] },
      { label: 'Verticale 5,5×8,5 cm', papers: [
        { label: 'gr. 300 patinata opaca', tiers: [{qty:100,price:49},{qty:500,price:87},{qty:1000,price:99},{qty:2500,price:184},{qty:5000,price:308},{qty:10000,price:578},{qty:20000,price:1122}] },
        { label: 'gr. 350 offset', tiers: [{qty:250,price:72},{qty:500,price:92},{qty:1000,price:121},{qty:2500,price:211},{qty:5000,price:355},{qty:10000,price:681}] },
        { label: 'gr. 400 patinata opaca', tiers: [{qty:100,price:53},{qty:500,price:83},{qty:1000,price:119},{qty:2500,price:232},{qty:5000,price:424},{qty:10000,price:807},{qty:20000,price:1578}] },
      ] },
      { label: 'Orizzontale 9×5 cm', papers: [
        { label: 'gr. 350 offset', tiers: [{qty:250,price:72},{qty:500,price:92},{qty:1000,price:121},{qty:2500,price:211},{qty:5000,price:355},{qty:10000,price:681}] },
      ] },
      { label: 'Verticale 5×9 cm', papers: [
        { label: 'gr. 350 offset', tiers: [{qty:250,price:72},{qty:500,price:92},{qty:1000,price:121},{qty:2500,price:211},{qty:5000,price:355},{qty:10000,price:681}] },
      ] },
    ] },
  '205': { nome: 'Biglietti da visita con oro/argento lucido', ean: '0652026573589', type: 'businessCardRilievo',
    colorChoices: ['Oro Lucido','Argento Lucido'],
    formats: [
      { label: 'Quadrato 5,5×5,5 cm', papers: [
        { label: 'gr. 300 patinata opaca', tiers: [{qty:100,price:68},{qty:250,price:94},{qty:500,price:116},{qty:1000,price:125},{qty:2500,price:132},{qty:5000,price:196},{qty:7500,price:271},{qty:10000,price:347}] },
        { label: 'gr. 400 patinata opaca', tiers: [{qty:100,price:75},{qty:250,price:102},{qty:500,price:122},{qty:1000,price:142},{qty:2500,price:132},{qty:5000,price:173},{qty:7500,price:226},{qty:10000,price:281}] },
      ] },
      { label: 'Orizzontale 8,5×5,5 cm', papers: [
        { label: 'gr. 300 patinata opaca', tiers: [{qty:100,price:86},{qty:250,price:115},{qty:500,price:142},{qty:1000,price:156},{qty:2500,price:176},{qty:5000,price:279},{qty:7500,price:396},{qty:10000,price:511}] },
        { label: 'gr. 400 patinata opaca', tiers: [{qty:100,price:94},{qty:250,price:125},{qty:500,price:151},{qty:1000,price:179},{qty:2500,price:176},{qty:5000,price:241},{qty:7500,price:326},{qty:10000,price:410}] },
      ] },
      { label: 'Orizzontale 9×5 cm', papers: [
        { label: 'gr. 300 patinata opaca', tiers: [{qty:100,price:84},{qty:250,price:113},{qty:500,price:139},{qty:1000,price:153},{qty:2500,price:171},{qty:5000,price:271},{qty:7500,price:383},{qty:10000,price:494}] },
        { label: 'gr. 400 patinata opaca', tiers: [{qty:100,price:92},{qty:250,price:122},{qty:500,price:148},{qty:1000,price:175},{qty:2500,price:173},{qty:5000,price:233},{qty:7500,price:316},{qty:10000,price:397}] },
      ] },
    ] },
  '217': { nome: 'Forex PVC Stampato', ean: '0652026573596', type: 'forexPvc',
    formats: ['30×40 cm', '40×60 cm', '50×70 cm', '70×100 cm'],
    spessoreChoices: ['2 mm', '5 mm'],
    stampaChoices: ['1 lato', '2 lati'],
    consegnaChoices: ['Budget 1 Settimana', 'Express 2 gg'],
    // rates[spessoreIdx][stampaIdx][consegnaIdx] -> [30x40,40x60,50x70,70x100]
    // Listino +20% applicato il 14/09/2026 (base storica: 31,35,43,58 / 65,69,76,93 ecc.)
    rates: [
      [ [ [37.2,42,51.6,69.6], [78,82.8,91.2,111.6] ],   // 2mm, 1 lato: [1 sett, 2gg]
        [ [38.4,43.2,52.8,80.4], [79.2,84,92.4,122.4] ] ], // 2mm, 2 lati: [1 sett, 2gg]
      [ [ [39.6,45.6,57.6,80.4], [80.4,86.4,97.2,122.4] ],  // 5mm, 1 lato: [1 sett, 2gg]
        [ [40.8,46.8,58.8,84], [80.4,87.6,99.6,126] ] ], // 5mm, 2 lati: [1 sett, 2gg]
    ],
  },
  '5720': { nome: 'Adesivo PVC 42×10 cm', ean: '0652026573305', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:50,price:121},{qty:100,price:155},{qty:250,price:175},{qty:500,price:220},{qty:1000,price:257},{qty:2500,price:499},{qty:5000,price:945},{qty:7500,price:1387},{qty:10000,price:1834}],
      [{qty:50,price:156},{qty:100,price:191},{qty:250,price:210},{qty:500,price:255},{qty:1000,price:292},{qty:2500,price:533},{qty:5000,price:1004},{qty:7500,price:1472},{qty:10000,price:1943}],
    ] },
  '5722': { nome: 'Adesivo PVC ø2 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:50,price:17},{qty:75,price:18},{qty:100,price:19},{qty:250,price:21},{qty:500,price:23},{qty:1000,price:27},{qty:2500,price:36},{qty:5000,price:51},{qty:7500,price:66},{qty:10000,price:84},{qty:15000,price:112},{qty:20000,price:139},{qty:25000,price:164},{qty:30000,price:186}],
    ] },
  '5724': { nome: 'Adesivo PVC ø3 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:50,price:17},{qty:75,price:18},{qty:100,price:19},{qty:250,price:21},{qty:500,price:23},{qty:1000,price:27},{qty:2500,price:36},{qty:5000,price:51},{qty:7500,price:66},{qty:10000,price:84},{qty:15000,price:112},{qty:20000,price:139},{qty:25000,price:164}],
    ] },
  '5725': { nome: 'Adesivo PVC ø4 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:50,price:19},{qty:75,price:20},{qty:100,price:21},{qty:250,price:26},{qty:500,price:30},{qty:1000,price:36},{qty:2500,price:55},{qty:5000,price:87},{qty:7500,price:118},{qty:10000,price:147},{qty:15000,price:201},{qty:20000,price:258},{qty:25000,price:316},{qty:30000,price:367}],
    ] },
  '5721': { nome: 'Adesivo PVC ø5 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:50,price:19},{qty:75,price:20},{qty:100,price:21},{qty:250,price:26},{qty:500,price:30},{qty:1000,price:36},{qty:2500,price:55},{qty:5000,price:87},{qty:7500,price:118},{qty:10000,price:147},{qty:15000,price:201},{qty:20000,price:258}],
    ] },
  '5726': { nome: 'Adesivo PVC ø6 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:50,price:21},{qty:75,price:22},{qty:100,price:23},{qty:250,price:30},{qty:500,price:35},{qty:1000,price:44},{qty:2500,price:70},{qty:5000,price:114},{qty:7500,price:150},{qty:10000,price:192},{qty:15000,price:272},{qty:20000,price:354},{qty:25000,price:436}],
    ] },
  '5728': { nome: 'Adesivo PVC ø14 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:50,price:44},{qty:75,price:47},{qty:100,price:51},{qty:250,price:79},{qty:500,price:100},{qty:1000,price:141},{qty:2500,price:259},{qty:5000,price:472},{qty:7500,price:697},{qty:10000,price:922},{qty:15000,price:1358},{qty:20000,price:1799},{qty:25000,price:2222},{qty:30000,price:2606}],
    ] },
  '5727': { nome: 'Adesivo PVC ø9,5 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:50,price:29},{qty:75,price:31},{qty:100,price:33},{qty:250,price:48},{qty:500,price:59},{qty:1000,price:81},{qty:2500,price:138},{qty:5000,price:236},{qty:7500,price:336},{qty:10000,price:446},{qty:15000,price:665},{qty:20000,price:866},{qty:25000,price:1089},{qty:30000,price:1260}],
    ] },
  '5729': { nome: 'Adesivo PVC 5×5 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:50,price:18.22},{qty:75,price:19.7},{qty:100,price:20.69},{qty:250,price:24.14},{qty:500,price:27.41},{qty:1000,price:32.77},{qty:2500,price:49.66},{qty:5000,price:77.68},{qty:7500,price:103.09},{qty:10000,price:128.32},{qty:15000,price:179.73},{qty:20000,price:228.27},{qty:25000,price:279.73},{qty:30000,price:330.77},{qty:40000,price:432.51},{qty:50000,price:542.58}],
      [{qty:50,price:53.07},{qty:75,price:53.92},{qty:100,price:54.56},{qty:250,price:58.16},{qty:500,price:61.02},{qty:1000,price:66.38},{qty:2500,price:83.71},{qty:5000,price:111.73},{qty:7500,price:137.15},{qty:10000,price:162.43},{qty:15000,price:213.86},{qty:20000,price:262.42},{qty:25000,price:313.87},{qty:30000,price:364.93},{qty:40000,price:466.7},{qty:50000,price:602.13}],
      [{qty:50,price:75.02},{qty:75,price:76.27},{qty:100,price:77.15},{qty:250,price:80.82},{qty:500,price:83.73},{qty:1000,price:92.66},{qty:2500,price:114.27}],
    ] },
  '5735': { nome: 'Adesivo PVC A8 5,2×7,4 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:50,price:20.61},{qty:75,price:21.36},{qty:100,price:23.04},{qty:250,price:27.52},{qty:500,price:31.46},{qty:1000,price:39.6},{qty:2500,price:65.52},{qty:5000,price:105.49},{qty:7500,price:141.23},{qty:10000,price:179.36},{qty:15000,price:258.08},{qty:20000,price:335.74},{qty:25000,price:414.59},{qty:30000,price:510.7},{qty:40000,price:663.89},{qty:50000,price:799.81}],
      [{qty:50,price:54.99},{qty:75,price:55.55},{qty:100,price:56.94},{qty:250,price:61.14},{qty:500,price:65.07},{qty:1000,price:73.22},{qty:2500,price:99.6},{qty:5000,price:139.55},{qty:7500,price:175.34},{qty:10000,price:213.47},{qty:15000,price:292.22},{qty:20000,price:369.92},{qty:25000,price:448.8},{qty:30000,price:570.27},{qty:40000,price:723.44},{qty:50000,price:859.36}],
      [{qty:50,price:77.07},{qty:75,price:77.73},{qty:100,price:79.84},{qty:250,price:83.84},{qty:500,price:87.6},{qty:1000,price:99.3},{qty:2500,price:130.3}],
    ] },
  '5730': { nome: 'Adesivo PVC 5,5×8,5 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:50,price:21.82},{qty:75,price:23.01},{qty:100,price:24.82},{qty:250,price:29.46},{qty:500,price:34.27},{qty:1000,price:44.14},{qty:2500,price:75.34},{qty:5000,price:121.66},{qty:7500,price:165.5},{qty:10000,price:209.06},{qty:15000,price:307.7},{qty:20000,price:402.11},{qty:25000,price:514.75},{qty:30000,price:606.7},{qty:40000,price:793.57},{qty:50000,price:978.43}],
      [{qty:50,price:56.05},{qty:75,price:57.2},{qty:100,price:58.42},{qty:250,price:63.07},{qty:500,price:67.87},{qty:1000,price:77.74},{qty:2500,price:109.41},{qty:5000,price:155.78},{qty:7500,price:199.62},{qty:10000,price:243.17},{qty:15000,price:341.82},{qty:20000,price:436.26},{qty:25000,price:574.3},{qty:30000,price:666.26},{qty:40000,price:853.14},{qty:50000,price:1063.33}],
      [{qty:50,price:78.14},{qty:75,price:79.76},{qty:100,price:81.47},{qty:250,price:85.94},{qty:500,price:90.59},{qty:1000,price:103.97},{qty:2500,price:139.89}],
    ] },
  '5731': { nome: 'Adesivo PVC A7 7,4×10,5 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:50,price:26.08},{qty:75,price:28.67},{qty:100,price:29.63},{qty:250,price:35.79},{qty:500,price:44.35},{qty:1000,price:60.86},{qty:2500,price:108.82},{qty:5000,price:179.94},{qty:7500,price:254.42},{qty:10000,price:329.68},{qty:15000,price:510.22},{qty:20000,price:661.98},{qty:25000,price:815.2},{qty:30000,price:989.12},{qty:40000,price:1289.5},{qty:50000,price:1578.18}],
      [{qty:50,price:60.22},{qty:75,price:62.29},{qty:100,price:63.25},{qty:250,price:69.42},{qty:500,price:77.97},{qty:1000,price:94.48},{qty:2500,price:142.9},{qty:5000,price:214.06},{qty:7500,price:288.56},{qty:10000,price:363.82},{qty:15000,price:569.79},{qty:20000,price:721.54},{qty:25000,price:874.77},{qty:30000,price:1074},{qty:40000,price:1374.4},{qty:50000,price:1688.42}],
      [{qty:50,price:82.54},{qty:75,price:85.42},{qty:100,price:86.51},{qty:250,price:92.19},{qty:500,price:100.96},{qty:1000,price:121.14},{qty:2500,price:172.02}],
    ] },
  '5732': { nome: 'Adesivo PVC 9,8×9,8 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:50,price:28.96},{qty:75,price:32.24},{qty:100,price:33.46},{qty:250,price:39.62},{qty:500,price:50.05},{qty:1000,price:70.13},{qty:2500,price:127.5},{qty:5000,price:215.31},{qty:7500,price:308.3},{qty:10000,price:401.52},{qty:15000,price:616.1},{qty:20000,price:804.53},{qty:25000,price:1013.65},{qty:30000,price:1196.46},{qty:40000,price:1592.13},{qty:50000,price:1942.37}],
      [{qty:50,price:62.7},{qty:75,price:66.38},{qty:100,price:67.73},{qty:250,price:73.22},{qty:500,price:83.66},{qty:1000,price:103.74},{qty:2500,price:161.62},{qty:5000,price:249.44},{qty:7500,price:342.43},{qty:10000,price:435.68},{qty:15000,price:675.66},{qty:20000,price:864.1},{qty:25000,price:1098.54},{qty:30000,price:1281.36},{qty:40000,price:1702.37},{qty:50000,price:2077.95}],
      [{qty:50,price:85.14},{qty:75,price:89.78},{qty:100,price:91.12},{qty:250,price:95.98},{qty:500,price:106.64},{qty:1000,price:130.24},{qty:2500,price:188.74}],
    ] },
  '5737': { nome: 'Adesivo PVC 9,8×21 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:50,price:44.14},{qty:75,price:46.48},{qty:100,price:48.42},{qty:250,price:63.81},{qty:500,price:85.06},{qty:1000,price:125.63},{qty:2500,price:241.86},{qty:5000,price:441.94},{qty:7500,price:660.62},{qty:10000,price:860.35},{qty:15000,price:1274.53},{qty:20000,price:1692.69},{qty:25000,price:2110.88},{qty:30000,price:2507.47},{qty:40000,price:3312.27},{qty:50000,price:3979.46}],
      [{qty:50,price:77.76},{qty:75,price:80.21},{qty:100,price:82.05},{qty:250,price:97.79},{qty:500,price:118.86},{qty:1000,price:159.26},{qty:2500,price:275.98},{qty:5000,price:476.11},{qty:7500,price:720.19},{qty:10000,price:919.92},{qty:15000,price:1359.42},{qty:20000,price:1802.93},{qty:25000,price:2246.46},{qty:30000,price:2668.4},{qty:40000,price:3523.86},{qty:50000,price:4241.74}],
      [{qty:50,price:101.14},{qty:75,price:103.6},{qty:100,price:105.42},{qty:250,price:121.18},{qty:500,price:142.26},{qty:1000,price:184.27},{qty:2500,price:306.05}],
    ] },
  '5733': { nome: 'Adesivo PVC A6 10,5×14,8 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:50,price:36.82},{qty:75,price:38.54},{qty:100,price:40.29},{qty:250,price:52.34},{qty:500,price:68.42},{qty:1000,price:100.58},{qty:2500,price:185.42},{qty:5000,price:333.09},{qty:7500,price:501.1},{qty:10000,price:647.5},{qty:15000,price:984.5},{qty:20000,price:1280.93},{qty:25000,price:1602.53},{qty:30000,price:1924.14},{qty:40000,price:2524.96}],
      [{qty:50,price:70.43},{qty:75,price:72.16},{qty:100,price:73.9},{qty:250,price:85.95},{qty:500,price:102.02},{qty:1000,price:134.21},{qty:2500,price:219.54},{qty:5000,price:367.25},{qty:7500,price:560.67},{qty:10000,price:707.07},{qty:15000,price:1069.41},{qty:20000,price:1365.82},{qty:25000,price:1712.75},{qty:30000,price:2059.73},{qty:40000,price:2685.89}],
      [{qty:50,price:93.1},{qty:75,price:94.88},{qty:100,price:96.72},{qty:250,price:109.01},{qty:500,price:124.94},{qty:1000,price:160.02},{qty:2500,price:249.6}],
    ] },
  '5734': { nome: 'Adesivo PVC A5 14,8×21 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:50,price:56.91},{qty:75,price:60.69},{qty:100,price:63.52},{qty:250,price:83.7},{qty:500,price:114.13},{qty:1000,price:170.27},{qty:2500,price:344.99},{qty:5000,price:656.54},{qty:7500,price:970.13},{qty:10000,price:1257.06},{qty:15000,price:1922.11},{qty:20000,price:2517.38},{qty:25000,price:3128.98},{qty:30000,price:3677.01},{qty:40000,price:4893.01},{qty:50000,price:5948.78}],
      [{qty:50,price:90.53},{qty:75,price:94.53},{qty:100,price:97.14},{qty:250,price:117.33},{qty:500,price:147.76},{qty:1000,price:203.94},{qty:2500,price:379.15},{qty:5000,price:716.11},{qty:7500,price:1055.02},{qty:10000,price:1341.95},{qty:15000,price:2057.7},{qty:20000,price:2678.29},{qty:25000,price:3315.23},{qty:30000,price:3913.94},{qty:40000,price:5205.97},{qty:50000,price:6312.43}],
      [{qty:50,price:113.78},{qty:75,price:117.92},{qty:100,price:120.48},{qty:250,price:139.89},{qty:500,price:169.5},{qty:1000,price:231.84},{qty:2500,price:409.22}],
    ] },
  '5736': { nome: 'Adesivo PVC A4 21×29,7 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:50,price:94.1},{qty:75,price:104.19},{qty:100,price:107.68},{qty:250,price:140.9},{qty:500,price:196.72},{qty:1000,price:315.52},{qty:2500,price:683.86},{qty:5000,price:1282.29},{qty:7500,price:1904.51},{qty:10000,price:2484.3},{qty:15000,price:3694.27},{qty:20000,price:4906.4},{qty:25000,price:6098.06},{qty:30000,price:7310.21},{qty:40000,price:9734.51},{qty:50000,price:11859.82}],
      [{qty:50,price:127.71},{qty:75,price:139.15},{qty:100,price:141.3},{qty:250,price:174.53},{qty:500,price:230.4},{qty:1000,price:349.23},{qty:2500,price:743.41},{qty:5000,price:1367.18},{qty:7500,price:2040.08},{qty:10000,price:2645.22},{qty:15000,price:3931.22},{qty:20000,price:5219.38},{qty:25000,price:6461.71},{qty:30000,price:7749.87},{qty:40000,price:10326.22},{qty:50000,price:12578.22}],
      [{qty:50,price:149.9},{qty:75,price:162.54},{qty:100,price:163.97},{qty:250,price:196.27},{qty:500,price:256.16},{qty:1000,price:377.12},{qty:2500,price:774.34}],
    ] },
  '5910': { nome: 'Spille ø2,5 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:50,price:38.45},{qty:100,price:59.66},{qty:150,price:80.9},{qty:200,price:102.11},{qty:250,price:123.3},{qty:500,price:225.76},{qty:1000,price:427.5},{qty:1500,price:646.3},{qty:2000,price:854.05},{qty:2500,price:1005.63}],
      [{qty:50,price:62.96},{qty:100,price:87.15},{qty:150,price:110.93},{qty:200,price:134.69},{qty:250,price:160.02}],
      [{qty:50,price:85.15},{qty:100,price:108.91}],
    ] },
  '5911': { nome: 'Spille ø3,8 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:50,price:38.99},{qty:100,price:60.16},{qty:150,price:82.58},{qty:200,price:104.99},{qty:250,price:127.38},{qty:500,price:240.06},{qty:1000,price:464.78},{qty:1500,price:695.2},{qty:2000,price:920.24},{qty:2500,price:1150.11}],
      [{qty:50,price:64.22},{qty:100,price:87.66},{qty:150,price:113.14},{qty:200,price:140.03},{qty:250,price:166.9}],
      [{qty:50,price:85.98},{qty:100,price:109.6}],
    ] },
  '5912': { nome: 'Spille ø5 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:50,price:44.4},{qty:100,price:71.81},{qty:150,price:99.89},{qty:200,price:127.34},{qty:250,price:154.75},{qty:500,price:292.48},{qty:1000,price:568.4},{qty:1500,price:849.3},{qty:2000,price:1124.18},{qty:2500,price:1379.79}],
      [{qty:50,price:69.5},{qty:100,price:100.21},{qty:150,price:133.92},{qty:200,price:166.85},{qty:250,price:199.73}],
      [{qty:50,price:91.25},{qty:100,price:123.6}],
    ] },
  '211': { nome: 'Adesivi per uso interno 24H', ean: '0652026573510', type: 'adesivoInterno',
    larghezza: { min:5, max:31, default:21 },
    altezza: { min:5, max:44, default:15 },
    qty: { min:50, max:2000, default:50 },
    sagomaChoices: ['No', 'Si'],
    sagomaMultiplier: [1, 1.4],
  },
  '203': { nome: 'Adesivi Prespaziati Personalizzati', ean: '0652026573350', type: 'adesiviPrespaziati',
    base: { min:5, max:300, default:14 },
    altezza: { min:5, max:52, default:6 },
    copie: { min:1, default:1 },
    lavorazioni: [
      { label: 'Sagomatura semplice', mult: 1 },
      { label: 'Prespaziato semplice', mult: 1.2 },
      { label: 'Prespaziato complesso', mult: 1.3 },
    ],
  },
  '218': { nome: 'Biglietti da visita 24H', ean: '0652026573534', type: 'bv24h',
    larghezza: { min:5.5, max:10.5, default:5.5 },
    altezza: { min:5.5, max:14.8, default:8.5 },
    qty: { min:50, max:1000, default:100 },
    latiMultiplier: [1, 1.5],
    latiChoices: ['1 lato', '2 lati'],
    cartaMultiplier: [1, 1.5, 1.9],
    cartaChoices: ['300', '350', '400'],
    soggettiMultiplier: [1,1.85,2.7,3.55,4.4,5.25,6.1,6.95,7.8,8.65],
    soggettiChoices: [1,2,3,4,5,6,7,8,9,10],
  },
};

// Plastificazione: sovrapprezzo IVA incl. per quantità (per ogni motivo). Derivato dal listino
// plastificati/non plastificati, interpolato dove non era monotono, extrapolato per 20000, ×2.
const PLASTIFICATA_TIERS = [{qty:10,price:14.80},{qty:25,price:14.98},{qty:50,price:15.32},{qty:75,price:15.50},{qty:100,price:15.64},{qty:250,price:18.64},{qty:500,price:20.90},{qty:1000,price:23.18},{qty:2500,price:34.10},{qty:5000,price:42.36},{qty:7500,price:47.20},{qty:10000,price:59.62},{qty:15000,price:89.16},{qty:20000,price:118.88}];
function plastificataPrice(qty) {
  const t = PLASTIFICATA_TIERS.find(t => qty <= t.qty);
  return (t || PLASTIFICATA_TIERS[PLASTIFICATA_TIERS.length - 1]).price;
}

module.exports = { PRICING, ANGOLI_ARROTONDATI_TIERS, angoliArrotondatiPrice, PLASTIFICATA_TIERS, plastificataPrice };
