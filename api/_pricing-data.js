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
  '5920': { nome: 'Banner PVC 400gr 100×50 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:22.78},{qty:2,price:29.55},{qty:3,price:36.06},{qty:4,price:42.54},{qty:5,price:49.01},{qty:6,price:55.47},{qty:7,price:61.95},{qty:8,price:68.42},{qty:9,price:74.88},{qty:10,price:81.36},{qty:11,price:105.04},{qty:12,price:111.52},{qty:13,price:117.97},{qty:14,price:124.45},{qty:15,price:130.93}],
    ] },
  '5921': { nome: 'Banner PVC 400gr 100×100 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:27.02},{qty:2,price:37.62},{qty:3,price:47.82},{qty:4,price:58.03},{qty:5,price:68.21},{qty:6,price:78.42},{qty:7,price:88.64},{qty:8,price:99.1},{qty:9,price:109.31},{qty:10,price:119.52},{qty:11,price:146.24},{qty:12,price:156.35},{qty:13,price:167.02},{qty:14,price:177.15},{qty:15,price:187.26}],
    ] },
  '5922': { nome: 'Banner PVC 400gr 150×100 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:31.28},{qty:2,price:45.2},{qty:3,price:59.18},{qty:4,price:73.17},{qty:5,price:87.46},{qty:6,price:101.44},{qty:7,price:115.42},{qty:8,price:128.48},{qty:9,price:142.35},{qty:10,price:156.51},{qty:11,price:188.11},{qty:12,price:201.98},{qty:13,price:215.87},{qty:14,price:230.54},{qty:15,price:244.42}],
    ] },
  '5923': { nome: 'Banner PVC 400gr 150×150 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:41.15},{qty:2,price:60.37},{qty:3,price:80.19},{qty:4,price:100.16},{qty:5,price:120.1},{qty:6,price:138.4},{qty:7,price:158.1},{qty:8,price:177.78},{qty:9,price:217.71},{qty:10,price:237.41},{qty:11,price:257.09},{qty:12,price:276.78},{qty:13,price:296.46},{qty:14,price:316.16},{qty:15,price:335.86}],
    ] },
  '5924': { nome: 'Banner PVC 400gr 200×100 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:35.25},{qty:2,price:52.61},{qty:3,price:70.29},{qty:4,price:88.29},{qty:5,price:105.97},{qty:6,price:140.24},{qty:7,price:158.34},{qty:8,price:175.9},{qty:9,price:193.44},{qty:10,price:211.79},{qty:11,price:247.47},{qty:12,price:265.02},{qty:13,price:282.58},{qty:14,price:301.87},{qty:15,price:319.44}],
    ] },
  '5925': { nome: 'Banner PVC 400gr 200×150 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:46.98},{qty:2,price:72.3},{qty:3,price:97.92},{qty:4,price:123.52},{qty:5,price:147.36},{qty:6,price:172.62},{qty:7,price:197.89},{qty:8,price:223.18},{qty:9,price:248.43},{qty:10,price:273.71},{qty:11,price:319.98},{qty:12,price:345.25},{qty:13,price:370.54},{qty:14,price:395.79},{qty:15,price:421.06}],
    ] },
  '5926': { nome: 'Banner PVC 400gr 200×200 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:55.07},{qty:2,price:88.42},{qty:3,price:121.79},{qty:4,price:153.3},{qty:5,price:186.22},{qty:6,price:240.75},{qty:7,price:273.68},{qty:8,price:306.61},{qty:9,price:339.52},{qty:10,price:372.45},{qty:11,price:426.96},{qty:12,price:459.89},{qty:13,price:492.82},{qty:14,price:525.76},{qty:15,price:558.67}],
    ] },
  '5927': { nome: 'Banner PVC 400gr 250×100 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:39.34},{qty:2,price:60.69},{qty:3,price:82.3},{qty:4,price:103.68},{qty:5,price:125.02},{qty:6,price:145.6},{qty:7,price:185.25},{qty:8,price:207.22},{qty:9,price:228.42},{qty:10,price:249.58},{qty:11,price:270.78},{qty:12,price:293.17},{qty:13,price:333.76},{qty:14,price:354.93},{qty:15,price:376.11}],
    ] },
  '5928': { nome: 'Banner PVC 400gr 250×200 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:62.8},{qty:2,price:103.92},{qty:3,price:143.34},{qty:4,price:183.95},{qty:5,price:224.53},{qty:6,price:265.09},{qty:7,price:327.3},{qty:8,price:367.86},{qty:9,price:408.45},{qty:10,price:449.06},{qty:11,price:489.65},{qty:12,price:530.22},{qty:13,price:592.4},{qty:14,price:632.99},{qty:15,price:673.55}],
    ] },
  '5929': { nome: 'Banner PVC 400gr 250×250 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:76.5},{qty:2,price:127.28},{qty:3,price:175.92},{qty:4,price:226.08},{qty:5,price:276.18},{qty:6,price:351.84},{qty:7,price:401.97},{qty:8,price:452.1},{qty:9,price:502.22},{qty:10,price:552.37},{qty:11,price:628.02},{qty:12,price:678.18},{qty:13,price:728.29},{qty:14,price:740.94},{qty:15,price:787.73}],
    ] },
  '5930': { nome: 'Banner PVC 400gr 300×100 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:43.38},{qty:2,price:68.77},{qty:3,price:94.46},{qty:4,price:119.86},{qty:5,price:144.48},{qty:6,price:169.66},{qty:7,price:214.13},{qty:8,price:239.33},{qty:9,price:264.53},{qty:10,price:290.9},{qty:11,price:316.06},{qty:12,price:341.28},{qty:13,price:385.95},{qty:14,price:411.12},{qty:15,price:436.88}],
    ] },
  '5936': { nome: 'Banner PVC 400gr 300×150 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:58.64},{qty:2,price:96.16},{qty:3,price:132.13},{qty:4,price:169.17},{qty:5,price:206.21},{qty:6,price:243.25},{qty:7,price:301.31},{qty:8,price:338.34},{qty:9,price:375.38},{qty:10,price:412.42},{qty:11,price:449.46},{qty:12,price:486.5},{qty:13,price:544.53},{qty:14,price:581.57},{qty:15,price:618.61}],
    ] },
  '5931': { nome: 'Banner PVC 400gr 300×200 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:70.61},{qty:2,price:119.52},{qty:3,price:166.45},{qty:4,price:236.29},{qty:5,price:284.59},{qty:6,price:332.86},{qty:7,price:402.72},{qty:8,price:450.99},{qty:9,price:499.28},{qty:10,price:571.86},{qty:11,price:619.76},{qty:12,price:666.93},{qty:13,price:739.34},{qty:14,price:755.74},{qty:15,price:800.78}],
    ] },
  '5932': { nome: 'Banner PVC 400gr 300×300 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:187.97},{qty:2,price:257.68},{qty:3,price:444.53},{qty:4,price:515.33},{qty:5,price:702.18},{qty:6,price:772.99},{qty:7,price:959.87},{qty:8,price:1030.67},{qty:9,price:1166.11},{qty:10,price:1231.71},{qty:11,price:1412.45},{qty:12,price:1478.03},{qty:13,price:1658.8},{qty:14,price:1724.38},{qty:15,price:1858.56}],
    ] },
  '5933': { nome: 'Banner PVC 400gr 400×100 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:51.47},{qty:2,price:85.25},{qty:3,price:118.75},{qty:4,price:169.89},{qty:5,price:203.9},{qty:6,price:237.14},{qty:7,price:290.99},{qty:8,price:324.21},{qty:9,price:357.44},{qty:10,price:410.88},{qty:11,price:444.11},{qty:12,price:478.16},{qty:13,price:532.16},{qty:14,price:566.32},{qty:15,price:600.51}],
    ] },
  '5934': { nome: 'Banner PVC 400gr 400×200 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:86.19},{qty:2,price:148.91},{qty:3,price:212.59},{qty:4,price:297.82},{qty:5,price:361.46},{qty:6,price:425.14},{qty:7,price:510.38},{qty:8,price:574.06},{qty:9,price:637.71},{qty:10,price:722.96},{qty:11,price:753.46},{qty:12,price:812.88},{qty:13,price:897.28},{qty:14,price:956.69},{qty:15,price:1016.1}],
    ] },
  '5935': { nome: 'Banner PVC 400gr 400×300 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:210.74},{qty:2,price:302.62},{qty:3,price:511.94},{qty:4,price:605.23},{qty:5,price:814.56},{qty:6,price:907.86},{qty:7,price:1065.49},{qty:8,price:1151.9},{qty:9,price:1353.46},{qty:10,price:1439.86},{qty:11,price:1641.41},{qty:12,price:1679.9},{qty:13,price:1877.23},{qty:14,price:1959.87},{qty:15,price:2157.18}],
    ] },
  '5940': { nome: 'Banner PVC 500gr con occhielli 100×50 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:23.98},{qty:2,price:32.27},{qty:3,price:40.19},{qty:4,price:48.16},{qty:5,price:56.1},{qty:6,price:64.22},{qty:7,price:72.91},{qty:8,price:81.6},{qty:9,price:90.29},{qty:10,price:98.96},{qty:11,price:120.7},{qty:12,price:127.78},{qty:13,price:135.68},{qty:14,price:144.05},{qty:15,price:152.61}],
      [{qty:1,price:58.02},{qty:2,price:65.89},{qty:3,price:74.05},{qty:4,price:82.72},{qty:5,price:91.38},{qty:6,price:100.03},{qty:7,price:108.74},{qty:8,price:117.41},{qty:9,price:126.1},{qty:10,price:134.77},{qty:11,price:179.7},{qty:12,price:186.88},{qty:13,price:195.41},{qty:14,price:203.98},{qty:15,price:212.54}],
      [{qty:1,price:87.6},{qty:2,price:96.13},{qty:3,price:104.74},{qty:4,price:113.42},{qty:5,price:122.08},{qty:6,price:130.75},{qty:7,price:139.42},{qty:8,price:148.13},{qty:9,price:156.8},{qty:10,price:165.47},{qty:11,price:211.87},{qty:12,price:219.04},{qty:13,price:227.6},{qty:14,price:236.14},{qty:15,price:244.7}],
    ] },
  '5941': { nome: 'Banner PVC 500gr con occhielli 100×100 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:30.13},{qty:2,price:43.78},{qty:3,price:57.12},{qty:4,price:70.48},{qty:5,price:83.82},{qty:6,price:97.47},{qty:7,price:110.85},{qty:8,price:123.31},{qty:9,price:136.56},{qty:10,price:149.81},{qty:11,price:186.69},{qty:12,price:200.27},{qty:13,price:213.81},{qty:14,price:228.02},{qty:15,price:242.18}],
      [{qty:1,price:64.08},{qty:2,price:77.39},{qty:3,price:90.72},{qty:4,price:104.1},{qty:5,price:117.78},{qty:6,price:131.58},{qty:7,price:145.36},{qty:8,price:157.62},{qty:9,price:171.2},{qty:10,price:184.8},{qty:11,price:245.44},{qty:12,price:259.62},{qty:13,price:273.73},{qty:14,price:287.95},{qty:15,price:302.13}],
      [{qty:1,price:93.47},{qty:2,price:107.18},{qty:3,price:120.93},{qty:4,price:134.72},{qty:5,price:148.5},{qty:6,price:162.29},{qty:7,price:176.05},{qty:8,price:188.3},{qty:9,price:201.9},{qty:10,price:215.5},{qty:11,price:277.6},{qty:12,price:291.78},{qty:13,price:305.89},{qty:14,price:320.11},{qty:15,price:334.29}],
    ] },
  '5942': { nome: 'Banner PVC 500gr con occhielli 150×100 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:35.71},{qty:2,price:54.38},{qty:3,price:73.09},{qty:4,price:92.75},{qty:5,price:112.77},{qty:6,price:131.06},{qty:7,price:150.8},{qty:8,price:170.51},{qty:9,price:190.21},{qty:10,price:209.94},{qty:11,price:242.35},{qty:12,price:262.05},{qty:13,price:281.79},{qty:14,price:301.5},{qty:15,price:321.22}],
      [{qty:1,price:69.33},{qty:2,price:88.66},{qty:3,price:108.58},{qty:4,price:128.59},{qty:5,price:148.59},{qty:6,price:166.88},{qty:7,price:186.61},{qty:8,price:206.3},{qty:9,price:226.03},{qty:10,price:245.76},{qty:11,price:302.3},{qty:12,price:322},{qty:13,price:341.73},{qty:14,price:361.44},{qty:15,price:381.15}],
      [{qty:1,price:99.44},{qty:2,price:119.34},{qty:3,price:139.31},{qty:4,price:159.28},{qty:5,price:179.3},{qty:6,price:197.58},{qty:7,price:217.31},{qty:8,price:237.02},{qty:9,price:256.74},{qty:10,price:276.45},{qty:11,price:334.46},{qty:12,price:354.18},{qty:13,price:373.89},{qty:14,price:393.6},{qty:15,price:413.31}],
    ] },
  '5943': { nome: 'Banner PVC 500gr con occhielli 200×100 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:40.94},{qty:2,price:64.69},{qty:3,price:88.96},{qty:4,price:114.35},{qty:5,price:137.97},{qty:6,price:176.67},{qty:7,price:200.75},{qty:8,price:225.79},{qty:9,price:250.83},{qty:10,price:275.87},{qty:11,price:315.18},{qty:12,price:338.8},{qty:13,price:363.71},{qty:14,price:388.74},{qty:15,price:413.79}],
      [{qty:1,price:74.56},{qty:2,price:99.5},{qty:3,price:124.78},{qty:4,price:150.16},{qty:5,price:173.78},{qty:6,price:235.68},{qty:7,price:260.69},{qty:8,price:285.74},{qty:9,price:310.77},{qty:10,price:335.81},{qty:11,price:398.54},{qty:12,price:422.74},{qty:13,price:447.78},{qty:14,price:472.82},{qty:15,price:497.84}],
      [{qty:1,price:105.02},{qty:2,price:130.21},{qty:3,price:155.5},{qty:4,price:180.86},{qty:5,price:204.48},{qty:6,price:267.84},{qty:7,price:292.86},{qty:8,price:317.9},{qty:9,price:342.93},{qty:10,price:367.98},{qty:11,price:431.31},{qty:12,price:456.35},{qty:13,price:481.41},{qty:14,price:506.43},{qty:15,price:531.47}],
    ] },
  '5944': { nome: 'Banner PVC 500gr con occhielli 200×200 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:65.06},{qty:2,price:121.55},{qty:3,price:171.23},{qty:4,price:220.54},{qty:5,price:270.3},{qty:6,price:321.49},{qty:7,price:370.34},{qty:8,price:394.19},{qty:9,price:438.5},{qty:10,price:482.78},{qty:11,price:554.05},{qty:12,price:599.36},{qty:13,price:637.33},{qty:14,price:682.06},{qty:15,price:726.85}],
      [{qty:1,price:100.86},{qty:2,price:157.38},{qty:3,price:207.07},{qty:4,price:256.37},{qty:5,price:306.11},{qty:6,price:381.44},{qty:7,price:430.26},{qty:8,price:454.14},{qty:9,price:498.45},{qty:10,price:542.72},{qty:11,price:638.1},{qty:12,price:683.41},{qty:13,price:721.41},{qty:14,price:766.13},{qty:15,price:810.91}],
      [{qty:1,price:131.57},{qty:2,price:188.06},{qty:3,price:237.78},{qty:4,price:287.07},{qty:5,price:336.82},{qty:6,price:413.6},{qty:7,price:462.42},{qty:8,price:486.3},{qty:9,price:530.61},{qty:10,price:574.88},{qty:11,price:671.73},{qty:12,price:717.04},{qty:13,price:755.01},{qty:14,price:799.76},{qty:15,price:844.51}],
    ] },
  '5945': { nome: 'Banner PVC 500gr con occhielli 250×200 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:75.17},{qty:2,price:128.54},{qty:3,price:182.85},{qty:4,price:237.09},{qty:5,price:291.36},{qty:6,price:345.65},{qty:7,price:419.76},{qty:8,price:474.06},{qty:9,price:528.34},{qty:10,price:582.59},{qty:11,price:636.86},{qty:12,price:641.26},{qty:13,price:710.93},{qty:14,price:761.09},{qty:15,price:811.3}],
      [{qty:1,price:110.96},{qty:2,price:164.37},{qty:3,price:218.67},{qty:4,price:272.91},{qty:5,price:327.18},{qty:6,price:381.47},{qty:7,price:479.71},{qty:8,price:533.98},{qty:9,price:588.29},{qty:10,price:642.54},{qty:11,price:696.82},{qty:12,price:701.2},{qty:13,price:794.98},{qty:14,price:845.15},{qty:15,price:895.36}],
      [{qty:1,price:141.7},{qty:2,price:195.09},{qty:3,price:249.36},{qty:4,price:303.63},{qty:5,price:357.87},{qty:6,price:412.16},{qty:7,price:511.89},{qty:8,price:566.16},{qty:9,price:620.45},{qty:10,price:674.7},{qty:11,price:728.98},{qty:12,price:733.38},{qty:13,price:828.62},{qty:14,price:878.77},{qty:15,price:928.99}],
    ] },
  '5946': { nome: 'Banner PVC 500gr con occhielli 300×100 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:50.11},{qty:2,price:88.96},{qty:3,price:126.19},{qty:4,price:156.94},{qty:5,price:192.88},{qty:6,price:228.83},{qty:7,price:277.87},{qty:8,price:313.84},{qty:9,price:349.78},{qty:10,price:385.71},{qty:11,price:421.65},{qty:12,price:457.63},{qty:13,price:493.9},{qty:14,price:528.45},{qty:15,price:563.06}],
      [{qty:1,price:83.74},{qty:2,price:124.78},{qty:3,price:162},{qty:4,price:192.77},{qty:5,price:228.7},{qty:6,price:264.66},{qty:7,price:337.81},{qty:8,price:373.78},{qty:9,price:409.71},{qty:10,price:445.66},{qty:11,price:481.6},{qty:12,price:517.57},{qty:13,price:577.97},{qty:14,price:612.53},{qty:15,price:647.14}],
      [{qty:1,price:113.92},{qty:2,price:155.5},{qty:3,price:192.7},{qty:4,price:223.47},{qty:5,price:259.41},{qty:6,price:295.34},{qty:7,price:369.98},{qty:8,price:405.94},{qty:9,price:441.87},{qty:10,price:477.82},{qty:11,price:513.78},{qty:12,price:549.73},{qty:13,price:611.57},{qty:14,price:646.16},{qty:15,price:680.75}],
    ] },
  '5947': { nome: 'Banner PVC 500gr con occhielli 300×150 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:70.11},{qty:2,price:120.58},{qty:3,price:168.96},{qty:4,price:218.78},{qty:5,price:268.62},{qty:6,price:318.45},{qty:7,price:387.62},{qty:8,price:437.46},{qty:9,price:487.3},{qty:10,price:537.1},{qty:11,price:586.96},{qty:12,price:636.8},{qty:13,price:656.06},{qty:14,price:702.11},{qty:15,price:748.22}],
      [{qty:1,price:105.92},{qty:2,price:156.38},{qty:3,price:204.77},{qty:4,price:254.61},{qty:5,price:304.45},{qty:6,price:354.26},{qty:7,price:447.55},{qty:8,price:497.41},{qty:9,price:547.23},{qty:10,price:597.06},{qty:11,price:646.9},{qty:12,price:696.72},{qty:13,price:740.13},{qty:14,price:786.18},{qty:15,price:832.29}],
      [{qty:1,price:136.62},{qty:2,price:187.1},{qty:3,price:235.47},{qty:4,price:285.31},{qty:5,price:335.14},{qty:6,price:384.96},{qty:7,price:479.73},{qty:8,price:529.57},{qty:9,price:579.39},{qty:10,price:629.22},{qty:11,price:679.06},{qty:12,price:728.9},{qty:13,price:773.73},{qty:14,price:819.79},{qty:15,price:865.92}],
    ] },
  '5948': { nome: 'Banner PVC 500gr con occhielli 300×200 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:85.28},{qty:2,price:148.54},{qty:3,price:212.78},{qty:4,price:296.91},{qty:5,price:361.15},{qty:6,price:425.41},{qty:7,price:509.54},{qty:8,price:573.78},{qty:9,price:638.03},{qty:10,price:672.11},{qty:11,price:731.54},{qty:12,price:790.91},{qty:13,price:869.79},{qty:14,price:929.22},{qty:15,price:988.62}],
      [{qty:1,price:121.1},{qty:2,price:184.37},{qty:3,price:248.59},{qty:4,price:356.85},{qty:5,price:421.1},{qty:6,price:485.36},{qty:7,price:593.58},{qty:8,price:657.84},{qty:9,price:722.1},{qty:10,price:780.3},{qty:11,price:839.71},{qty:12,price:899.12},{qty:13,price:1002.13},{qty:14,price:1061.54},{qty:15,price:1120.93}],
      [{qty:1,price:151.81},{qty:2,price:215.06},{qty:3,price:279.31},{qty:4,price:389.01},{qty:5,price:453.26},{qty:6,price:517.52},{qty:7,price:627.22},{qty:8,price:691.46},{qty:9,price:755.71},{qty:10,price:815.38},{qty:11,price:874.82},{qty:12,price:934.19},{qty:13,price:1038.66},{qty:14,price:1098.08},{qty:15,price:1157.47}],
    ] },
  '5949': { nome: 'Banner PVC 500gr con occhielli 300×300 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:205.58},{qty:2,price:296.56},{qty:3,price:500.14},{qty:4,price:592.77},{qty:5,price:796.3},{qty:6,price:888.99},{qty:7,price:1040.08},{qty:8,price:1125.76},{qty:9,price:1321.44},{qty:10,price:1407.17},{qty:11,price:1558},{qty:12,price:1639.89},{qty:13,price:1831.26},{qty:14,price:1913.18},{qty:15,price:2104.51}],
      [{qty:1,price:241.38},{qty:2,price:332.37},{qty:3,price:560.08},{qty:4,price:652.7},{qty:5,price:880.37},{qty:6,price:973.06},{qty:7,price:1148.27},{qty:8,price:1233.95},{qty:9,price:1453.74},{qty:10,price:1539.46},{qty:11,price:1714.43},{qty:12,price:1796.32},{qty:13,price:2011.82},{qty:14,price:2093.74},{qty:15,price:2309.18}],
      [{qty:1,price:272.1},{qty:2,price:363.09},{qty:3,price:592.24},{qty:4,price:684.88},{qty:5,price:914},{qty:6,price:1006.69},{qty:7,price:1183.36},{qty:8,price:1269.04},{qty:9,price:1490.29},{qty:10,price:1576.02},{qty:11,price:1752.46},{qty:12,price:1834.34},{qty:13,price:2051.31},{qty:14,price:2133.2},{qty:15,price:2350.13}],
    ] },
  '5950': { nome: 'Banner PVC 500gr con occhielli 400×100 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:60.1},{qty:2,price:108.51},{qty:3,price:159.58},{qty:4,price:213.7},{qty:5,price:262.69},{qty:6,price:310.96},{qty:7,price:361.34},{qty:8,price:398.88},{qty:9,price:443.57},{qty:10,price:500.37},{qty:11,price:543.14},{qty:12,price:585.89},{qty:13,price:642.27},{qty:14,price:683.81},{qty:15,price:725.26}],
      [{qty:1,price:93.71},{qty:2,price:144.32},{qty:3,price:195.38},{qty:4,price:273.66},{qty:5,price:322.62},{qty:6,price:370.9},{qty:7,price:444.72},{qty:8,price:482.24},{qty:9,price:527.01},{qty:10,price:608.66},{qty:11,price:651.54},{qty:12,price:694.32},{qty:13,price:775.7},{qty:14,price:817.23},{qty:15,price:858.72}],
      [{qty:1,price:124.26},{qty:2,price:175.02},{qty:3,price:226.11},{qty:4,price:305.82},{qty:5,price:354.78},{qty:6,price:403.07},{qty:7,price:477.68},{qty:8,price:514.03},{qty:9,price:559.68},{qty:10,price:641.31},{qty:11,price:684.18},{qty:12,price:726.96},{qty:13,price:809.22},{qty:14,price:850.74},{qty:15,price:892.21}],
    ] },
  '5951': { nome: 'Banner PVC 500gr con occhielli 400×150 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:85.82},{qty:2,price:150.14},{qty:3,price:215.49},{qty:4,price:300.18},{qty:5,price:365.49},{qty:6,price:430.83},{qty:7,price:515.52},{qty:8,price:580.83},{qty:9,price:646.18},{qty:10,price:680.16},{qty:11,price:740.58},{qty:12,price:800.98},{qty:13,price:880.37},{qty:14,price:940.8},{qty:15,price:1001.18}],
      [{qty:1,price:121.65},{qty:2,price:185.97},{qty:3,price:251.31},{qty:4,price:360.11},{qty:5,price:425.42},{qty:6,price:490.78},{qty:7,price:599.58},{qty:8,price:664.91},{qty:9,price:730.24},{qty:10,price:788.34},{qty:11,price:848.75},{qty:12,price:909.17},{qty:13,price:1012.69},{qty:14,price:1073.12},{qty:15,price:1133.5}],
      [{qty:1,price:152.35},{qty:2,price:216.67},{qty:3,price:282},{qty:4,price:392.29},{qty:5,price:457.58},{qty:6,price:522.94},{qty:7,price:633.2},{qty:8,price:698.53},{qty:9,price:763.86},{qty:10,price:823.44},{qty:11,price:883.84},{qty:12,price:944.26},{qty:13,price:1049.25},{qty:14,price:1109.66},{qty:15,price:1170.05}],
    ] },
  '5952': { nome: 'Banner PVC 500gr con occhielli 400×200 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:105.47},{qty:2,price:188.42},{qty:3,price:272.58},{qty:4,price:376.61},{qty:5,price:460.77},{qty:6,price:544.98},{qty:7,price:648.98},{qty:8,price:681.2},{qty:9,price:759.04},{qty:10,price:856.3},{qty:11,price:934.14},{qty:12,price:1011.97},{qty:13,price:1069.41},{qty:14,price:1142.5},{qty:15,price:1215.62}],
      [{qty:1,price:141.3},{qty:2,price:224.22},{qty:3,price:308.4},{qty:4,price:436.56},{qty:5,price:520.7},{qty:6,price:604.91},{qty:7,price:733.02},{qty:8,price:765.28},{qty:9,price:843.09},{qty:10,price:964.5},{qty:11,price:1042.34},{qty:12,price:1120.14},{qty:13,price:1202.83},{qty:14,price:1275.92},{qty:15,price:1349.06}],
      [{qty:1,price:171.98},{qty:2,price:254.94},{qty:3,price:339.1},{qty:4,price:468.74},{qty:5,price:552.86},{qty:6,price:637.06},{qty:7,price:766.66},{qty:8,price:798.88},{qty:9,price:876.74},{qty:10,price:999.58},{qty:11,price:1077.41},{qty:12,price:1155.23},{qty:13,price:1236.34},{qty:14,price:1309.42},{qty:15,price:1382.54}],
    ] },
  '5953': { nome: 'Banner PVC 500gr con occhielli 400×250 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:127.12},{qty:2,price:230.1},{qty:3,price:333.1},{qty:4,price:459.98},{qty:5,price:562.98},{qty:6,price:617.97},{qty:7,price:736.38},{qty:8,price:831.62},{qty:9,price:926.86},{qty:10,price:1003.73},{qty:11,price:1093.06},{qty:12,price:1183.41},{qty:13,price:1299.22},{qty:14,price:1388.56},{qty:15,price:1479.2}],
      [{qty:1,price:162.94},{qty:2,price:265.92},{qty:3,price:368.93},{qty:4,price:519.92},{qty:5,price:622.91},{qty:6,price:677.9},{qty:7,price:820.45},{qty:8,price:915.68},{qty:9,price:1010.93},{qty:10,price:1112.26},{qty:11,price:1201.58},{qty:12,price:1291.6},{qty:13,price:1432.64},{qty:14,price:1522},{qty:15,price:1611.5}],
      [{qty:1,price:193.65},{qty:2,price:296.64},{qty:3,price:399.62},{qty:4,price:552.08},{qty:5,price:655.09},{qty:6,price:710.06},{qty:7,price:854.06},{qty:8,price:949.3},{qty:9,price:1044.56},{qty:10,price:1144.88},{qty:11,price:1235.68},{qty:12,price:1326.69},{qty:13,price:1466.16},{qty:14,price:1557.06},{qty:15,price:1648.05}],
    ] },
  '5954': { nome: 'Banner PVC 500gr con occhielli 400×300 cm', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1,price:232.64},{qty:2,price:353.95},{qty:3,price:585.98},{qty:4,price:707.52},{qty:5,price:891.07},{qty:6,price:1003.49},{qty:7,price:1225.39},{qty:8,price:1337.84},{qty:9,price:1512.42},{qty:10,price:1619.84},{qty:11,price:1836.29},{qty:12,price:1943.73},{qty:13,price:2160.22},{qty:14,price:2267.65},{qty:15,price:2484.1}],
      [{qty:1,price:268.45},{qty:2,price:389.76},{qty:3,price:645.94},{qty:4,price:767.46},{qty:5,price:975.14},{qty:6,price:1087.54},{qty:7,price:1333.6},{qty:8,price:1446.03},{qty:9,price:1644.7},{qty:10,price:1752.13},{qty:11,price:1992.75},{qty:12,price:2100.18},{qty:13,price:2340.78},{qty:14,price:2448.21},{qty:15,price:2688.78}],
      [{qty:1,price:299.17},{qty:2,price:420.46},{qty:3,price:678.1},{qty:4,price:799.62},{qty:5,price:1008.77},{qty:6,price:1121.17},{qty:7,price:1368.69},{qty:8,price:1481.12},{qty:9,price:1681.28},{qty:10,price:1788.69},{qty:11,price:2030.75},{qty:12,price:2138.18},{qty:13,price:2380.26},{qty:14,price:2487.68},{qty:15,price:2729.71}],
    ] },
  '5960': { nome: 'Block Notes A4 50 fogli', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:10,price:76.29},{qty:25,price:101.14},{qty:50,price:138.51},{qty:75,price:176.26},{qty:100,price:226.54},{qty:150,price:298.85},{qty:200,price:390.48},{qty:250,price:464.1},{qty:300,price:556.32},{qty:400,price:720.18},{qty:500,price:882.06},{qty:600,price:1055.07},{qty:700,price:1215.82},{qty:750,price:1307.79},{qty:800,price:1381.12},{qty:900,price:1546.43}],
      [{qty:10,price:110.27},{qty:25,price:135.23},{qty:50,price:172.21},{qty:75,price:209.98},{qty:100,price:285.2},{qty:150,price:357.55},{qty:200,price:474.1},{qty:250,price:547.71},{qty:300,price:664.83},{qty:400,price:853.6},{qty:500,price:1040.4},{qty:600,price:1238.32},{qty:700,price:1423.98},{qty:750,price:1540.85},{qty:800,price:1614.19},{qty:900,price:1804.42}],
      [{qty:10,price:133.7},{qty:25,price:158.62},{qty:50,price:193.97},{qty:75,price:235.74},{qty:100,price:311.82},{qty:150,price:384.18},{qty:200,price:501.58}],
    ] },
  '5961': { nome: 'Block Notes A5 50 fogli', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:10,price:57.09},{qty:25,price:71.3},{qty:50,price:94.5},{qty:75,price:114.64},{qty:100,price:136.72},{qty:150,price:174.32},{qty:200,price:231.68},{qty:250,price:272.32},{qty:300,price:312.38},{qty:400,price:412.4},{qty:500,price:498.42},{qty:600,price:598.18},{qty:700,price:680.72},{qty:750,price:740.58},{qty:800,price:781.84},{qty:900,price:864.37},{qty:1000,price:946.42}],
      [{qty:10,price:91.15},{qty:25,price:105.65},{qty:50,price:129.31},{qty:75,price:148.34},{qty:100,price:170.42},{qty:150,price:208.05},{qty:200,price:290.34},{qty:250,price:331.02},{qty:300,price:371.09},{qty:400,price:496.02},{qty:500,price:582.03},{qty:600,price:706.7},{qty:700,price:789.23},{qty:750,price:874},{qty:800,price:915.26},{qty:900,price:997.81},{qty:1000,price:1104.75}],
      [{qty:10,price:114.54},{qty:25,price:129.04},{qty:50,price:152.7},{qty:75,price:171.01},{qty:100,price:192.26},{qty:150,price:233.81},{qty:200,price:316.94}],
    ] },
  '5962': { nome: 'Block Notes A6 50 fogli', ean: '', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:10,price:46.5},{qty:25,price:53.81},{qty:50,price:67.22},{qty:75,price:79.82},{qty:100,price:92.18},{qty:150,price:115.71},{qty:200,price:136.83},{qty:250,price:160.32},{qty:300,price:182.21},{qty:400,price:242.85},{qty:500,price:285.63},{qty:600,price:334.75},{qty:700,price:379.74},{qty:750,price:421.18},{qty:800,price:444.02},{qty:900,price:487.74}],
    ] },
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
