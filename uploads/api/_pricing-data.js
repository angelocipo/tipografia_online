// Server-side pricing mirror of the catalog. Keep in sync with PRODUCTS in index.html.
// Only what's needed to recompute price safely (never trust a price sent from the browser).

const ROLLUP_VARIANTS = [
  { label: '80/85 × 200 cm', price: 60 },
  { label: '150 × 200 cm', price: 350 },
  { label: '200 × 200 cm', price: 530 },
];

const PRICING = {
  // Reconstructed 1:1 from the real Advanced Product Fields (Studio Wombat) config for this product.
  '197': { nome: 'Stampa Roll-Up 80/85 × 200 cm', type: 'formula',
    rollupRate: (qty) => (qty > 6 ? 20 : qty > 4 ? 25 : 30),
    strutturaRates: [30, 0], // index 0 = "Con struttura", 1 = "Solo stampa"
    rate24h: 10 },
  '5833': { nome: 'Stampa Roll-Up 200 × 200 cm', type: 'size', variants: ROLLUP_VARIANTS },
  '5850': { nome: 'Stampa Roll-Up 150 × 200 cm', type: 'formula',
    rollupRate: (qty) => (qty > 1 ? 90 : 95),
    strutturaRates: [255, 0], // index 0 = "Con struttura", 1 = "Solo stampa"
    rate24h: 0 },
  '5392': { nome: 'Volantini A5 gr 130', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:100,price:33},{qty:250,price:36},{qty:500,price:41},{qty:1000,price:48},{qty:2500,price:74},{qty:5000,price:107},{qty:10000,price:166},{qty:20000,price:299},{qty:30000,price:440},{qty:40000,price:573},{qty:50000,price:712},{qty:60000,price:851},{qty:70000,price:990},{qty:80000,price:1119},{qty:90000,price:1257},{qty:100000,price:1395}],
      [{qty:100,price:66},{qty:250,price:69},{qty:500,price:74},{qty:1000,price:81},{qty:2500,price:107},{qty:5000,price:141},{qty:10000,price:204},{qty:20000,price:364},{qty:30000,price:527},{qty:40000,price:685},{qty:50000,price:848},{qty:60000,price:1012},{qty:70000,price:1176},{qty:80000,price:1330},{qty:90000,price:1492},{qty:100000,price:1655}],
    ] },
  '5560': { nome: 'Volantini A4 gr 170', type: 'tiers', tiers: [{qty:1000,price:82},{qty:2500,price:137},{qty:5000,price:236},{qty:10000,price:429},{qty:20000,price:804},{qty:30000,price:1163},{qty:40000,price:1596},{qty:50000,price:1937},{qty:60000,price:2249},{qty:70000,price:2614},{qty:80000,price:2972},{qty:90000,price:3361},{qty:100000,price:3600}] },
  '5840': { nome: 'Volantini A6 gr 130', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:100,price:25},{qty:250,price:30},{qty:500,price:31},{qty:1000,price:35},{qty:2500,price:44},{qty:5000,price:67},{qty:10000,price:108},{qty:20000,price:190},{qty:30000,price:277},{qty:40000,price:346},{qty:50000,price:437},{qty:60000,price:526},{qty:70000,price:596},{qty:80000,price:687},{qty:90000,price:776},{qty:100000,price:847}],
      [{qty:100,price:56},{qty:250,price:60},{qty:500,price:65},{qty:1000,price:70},{qty:2500,price:82},{qty:5000,price:100},{qty:10000,price:142},{qty:20000,price:253},{qty:30000,price:368},{qty:40000,price:441},{qty:50000,price:550},{qty:60000,price:664},{qty:70000,price:737},{qty:80000,price:851},{qty:90000,price:964},{qty:100000,price:1040}],
    ] },
  '5723': { nome: 'Volantini 10×21 cm', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:1000,price:35},{qty:2500,price:54},{qty:5000,price:83},{qty:10000,price:135},{qty:20000,price:238},{qty:30000,price:350},{qty:40000,price:458},{qty:50000,price:571},{qty:60000,price:683},{qty:70000,price:796},{qty:80000,price:909},{qty:90000,price:1022},{qty:100000,price:1114}],
      [{qty:1000,price:68},{qty:2500,price:87},{qty:5000,price:117},{qty:10000,price:170},{qty:20000,price:302},{qty:30000,price:442},{qty:40000,price:579},{qty:50000,price:709},{qty:60000,price:847},{qty:70000,price:985},{qty:80000,price:1123},{qty:90000,price:1260},{qty:100000,price:1352}],
    ] },
  '5398': { nome: 'Pieghevoli A4 a 2 Ante A5', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:100,price:48},{qty:500,price:71},{qty:1000,price:89},{qty:2500,price:138},{qty:5000,price:236},{qty:10000,price:410},{qty:20000,price:769},{qty:30000,price:1169},{qty:40000,price:1563},{qty:50000,price:1902},{qty:60000,price:2315},{qty:70000,price:2784},{qty:80000,price:3037},{qty:90000,price:3427},{qty:100000,price:3619}],
      [{qty:100,price:81},{qty:500,price:105},{qty:1000,price:122},{qty:2500,price:173},{qty:5000,price:298},{qty:10000,price:500},{qty:20000,price:969},{qty:30000,price:1438},{qty:40000,price:1908},{qty:50000,price:2334},{qty:60000,price:2795},{qty:70000,price:3318},{qty:80000,price:3717},{qty:90000,price:4179},{qty:100000,price:4611}],
    ] },
  '5794': { nome: 'Pieghevoli A4 a 3 Ante 10×21 cm', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:100,price:55},{qty:500,price:70},{qty:1000,price:81},{qty:2500,price:142},{qty:5000,price:240},{qty:10000,price:433},{qty:20000,price:842},{qty:30000,price:1245},{qty:40000,price:1678},{qty:50000,price:2013},{qty:60000,price:2393},{qty:70000,price:2787},{qty:80000,price:3140},{qty:90000,price:3431},{qty:100000,price:3685}],
      [{qty:100,price:90},{qty:500,price:103},{qty:1000,price:115},{qty:2500,price:177},{qty:5000,price:304},{qty:10000,price:528},{qty:20000,price:1027},{qty:30000,price:1493},{qty:40000,price:2029},{qty:50000,price:2445},{qty:60000,price:2853},{qty:70000,price:3322},{qty:80000,price:3749},{qty:90000,price:4183},{qty:100000,price:4643}],
    ] },
  '5606': { nome: 'Locandine 70×100 cm', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:50,price:97},{qty:100,price:151},{qty:150,price:175},{qty:200,price:190},{qty:250,price:204},{qty:300,price:222},{qty:400,price:268},{qty:500,price:295},{qty:750,price:385},{qty:1000,price:454},{qty:1500,price:633},{qty:2000,price:792},{qty:3000,price:1118},{qty:4000,price:1437},{qty:5000,price:1770},{qty:6000,price:2104}],
      [{qty:50,price:129},{qty:100,price:183},{qty:150,price:222},{qty:200,price:236},{qty:250,price:236},{qty:300,price:254},{qty:400,price:325},{qty:500,price:352},{qty:750,price:466},{qty:1000,price:534},{qty:1500,price:768},{qty:2000,price:954},{qty:3000,price:1366},{qty:4000,price:1737},{qty:5000,price:2149},{qty:6000,price:2521}],
    ] },
  // Reconstructed 1:1 from the real APF config for this product (conditional Formato → Carta → Quantità chain).
  '5515': { nome: 'Biglietti da Visita Prezzi Strategici', type: 'businessCardStrategici',
    qtyLabels: [100,250,500,1000,2500,5000,10000,15000,20000],
    formats: [
      { label: 'Quadrato 5,5×5,5 cm', papers: [
        { label: 'gr. 300 (classico)', deliveries: [
          { label: '1 Settimana', prices: [24,29,32,33,35,46,68,87,104] },
          { label: '2 Giorni lavorativi', prices: [57,62,65,66,68,80,100,119,137] },
        ] },
        { label: 'gr. 400', deliveries: [ { label: '1 Settimana', prices: [27,30,31,33,39,52,79,105,128] } ] },
        { label: 'gr. 500', deliveries: [ { label: '1 Settimana', prices: [29,32,34,38,46,63,99,132,166] } ] },
      ] },
      { label: 'Orizzontale 5,5×8,5 cm', papers: [
        { label: 'gr. 300 (classico)', deliveries: [
          { label: '1 Settimana', prices: [25,27,30,39,44,61,95,126,155] },
          { label: '2 Giorni lavorativi', prices: [57,59,63,67,77,94,127,159,188] },
        ] },
        { label: 'gr. 400', deliveries: [
          { label: '1 Settimana', prices: [29,33,35,45,50,68,106,143,193] },
          { label: '2 Giorni lavorativi', prices: [63,67,69,72,80,101,139,175,252] },
        ] },
        { label: 'gr. 500', deliveries: [ { label: '1 Settimana', prices: [29,32,34,39,46,63,99,132,166] } ] },
      ] },
      { label: 'Verticale 5,5×8,5 cm', papers: [
        { label: 'gr. 300 (classico)', deliveries: [
          { label: '1 Settimana', prices: [25,27,30,39,44,61,95,126,155] },
          { label: '2 Giorni lavorativi', prices: [57,59,63,67,77,94,127,159,188] },
        ] },
        { label: 'gr. 400', deliveries: [
          { label: '1 Settimana', prices: [29,33,35,45,50,68,106,143,193] },
          { label: '2 Giorni lavorativi', prices: [63,67,69,72,80,101,139,175,252] },
        ] },
        { label: 'gr. 500', deliveries: [ { label: '1 Settimana', prices: [29,32,34,39,46,63,99,132,166] } ] },
      ] },
      { label: 'Orizzontale 9×5 cm', papers: [
        { label: 'gr. 300 (classico)', deliveries: [
          { label: '1 Settimana', prices: [26,31,33,36,42,57,88,114,139] },
          { label: '2 Giorni lavorativi', prices: [58,65,66,69,75,90,121,147,172] },
        ] },
        { label: 'gr. 400', deliveries: [ { label: '1 Settimana', prices: [29,33,35,38,47,66,103,140,190] } ] },
        { label: 'gr. 500', deliveries: [ { label: '1 Settimana', prices: [29,32,34,38,46,63,99,132,166] } ] },
      ] },
      { label: 'Verticale 5×9 cm', papers: [
        { label: 'gr. 300 (classico)', deliveries: [
          { label: '1 Settimana', prices: [26,31,33,36,42,57,88,114,139] },
          { label: '2 Giorni lavorativi', prices: [58,65,66,69,75,90,121,147,172] },
        ] },
        { label: 'gr. 400', deliveries: [ { label: '1 Settimana', prices: [29,33,35,38,47,66,103,140,190] } ] },
        { label: 'gr. 500', deliveries: [ { label: '1 Settimana', prices: [29,32,34,38,46,63,99,132,166] } ] },
      ] },
    ] },
  '198': { nome: 'Foto Quadro Personalizzato', type: 'flat', price: 28 },
  '199': { nome: 'Marilyn Monroe Warhol', type: 'flat', price: 20 },
  '200': { nome: 'Quadro Claude Monet', type: 'flat', price: 15 },
  '201': { nome: 'Quadro Van Gogh "Notte stellata"', type: 'flat', price: 48 },
  '203': { nome: 'Adesivi Prespaziati Personalizzati', type: 'flat', price: 15 },
  '206': { nome: 'Foto Libro Copertina Flessibile', type: 'flat', price: 15 },
  '209': { nome: '2 Adesivi Jeep Renegade Fango', type: 'flat', price: 49 },
  '210': { nome: '1 Paio di 2 Woodpecker Adesivi Prespaziati', type: 'flat', price: 32 },
  '212': { nome: 'Wall Stickers Sky Line Città Vinile', type: 'flat', price: 39 },
  '213': { nome: 'Adesivi frasi romane per decorazione', type: 'imageSwatch', price: 24,
    swatches: ['Mejo','Iddio','Tutte le strade','Omo de Panza',"'ngrassa",'Napoli Orto','Faccia Tosta','A chi tocca'] },
  '214': { nome: 'Decalcomania Hollywood Sticker', type: 'imageSwatchQty', pricePerUnit: 24, defaultSwatchIdx: 2,
    swatches: ['James Dean','Madonna','Marilyn','Audrey','Swift'] },
  '214': { nome: 'Decalcomania Hollywood Sticker', type: 'flat', price: 20 },
  '215': { nome: 'Struttura Personalizzata per Eventi', type: 'flat', price: 200 },
  '220': { nome: '2 Adesivi Jeep Renegade Stella Graffiata', type: 'flat', price: 23 },
  '221': { nome: '2 Adesivi Jeep Renegade Stella e Teschio', type: 'flat', price: 23 },
  '223': { nome: '2 Adesivi Jeep Renegade Logo', type: 'flat', price: 49 },
  '224': { nome: '2 Adesivi Jeep Renegade Logo + Montagna', type: 'flat', price: 52 },
  '225': { nome: '2 Adesivi Prespaziati Jeep Renegade Crossfit', type: 'flat', price: 32 },
  '226': { nome: '2 Adesivi Prespaziati Jeep Renegade Cavalli', type: 'flat', price: 32 },
  '227': { nome: 'Stampa Quadro Van Gogh Autoritratto', type: 'flat', price: 15 },
  '250': { nome: 'Locandine Stampate a Roma Eur 24H', type: 'flat', price: 6 },
  '271': { nome: 'Quadro Statua Libertà stile Andy Warhol', type: 'flat', price: 28 },
  '282': { nome: 'Stampe sagomate grandi', type: 'flat', price: 70 },
  '5849': { nome: 'Quadro Pop Art Personalizzato Warhol', type: 'flat', price: 28 },
  '202': { nome: 'Biglietti da visita a rilievo', type: 'businessCardRilievo',
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
  '217': { nome: 'Forex PVC Stampato', type: 'forexPvc',
    formats: ['30×40 cm', '40×60 cm', '50×70 cm', '70×100 cm'],
    spessoreChoices: ['2 mm', '5 mm'],
    stampaChoices: ['1 lato', '2 lati'],
    consegnaChoices: ['1 Settimana', '2 gg Lavorativi'],
    // rates[spessoreIdx][stampaIdx][consegnaIdx] -> [30x40,40x60,50x70,70x100]
    rates: [
      [ [ [31,35,43,58], [65,69,76,93] ],   // 2mm, 1 lato: [1 sett, 2gg]
        [ [32,36,44,67], [66,70,77,102] ] ], // 2mm, 2 lati: [1 sett, 2gg]
      [ [ [33,38,48,67], [67,72,81,102] ],  // 5mm, 1 lato: [1 sett, 2gg]
        [ [34,39,49,70], [67,73,83,105] ] ], // 5mm, 2 lati: [1 sett, 2gg]
    ],
  },
  '5720': { nome: 'Adesivo PVC 42×10 cm', type: 'tiersDelivery',
    tiersByDelivery: [
      [{qty:50,price:121},{qty:100,price:155},{qty:250,price:175},{qty:500,price:220},{qty:1000,price:257},{qty:2500,price:499},{qty:5000,price:945},{qty:7500,price:1387},{qty:10000,price:1834}],
      [{qty:50,price:156},{qty:100,price:191},{qty:250,price:210},{qty:500,price:255},{qty:1000,price:292},{qty:2500,price:533},{qty:5000,price:1004},{qty:7500,price:1472},{qty:10000,price:1943}],
    ] },
  '211': { nome: 'Adesivi per uso interno 24H', type: 'adesivoInterno',
    larghezza: { min:5, max:31, default:21 },
    altezza: { min:5, max:44, default:15 },
    qty: { min:50, max:2000, default:50 },
    sagomaChoices: ['No', 'Si'],
    sagomaMultiplier: [1, 1.4],
  },
  '203': { nome: 'Adesivi Prespaziati Personalizzati', type: 'adesiviPrespaziati',
    base: { min:5, max:300, default:14 },
    altezza: { min:5, max:52, default:6 },
    copie: { min:1, default:1 },
    lavorazioni: [
      { label: 'Sagomatura semplice', mult: 1 },
      { label: 'Prespaziato semplice', mult: 1.2 },
      { label: 'Prespaziato complesso', mult: 1.3 },
    ],
  },
  '218': { nome: 'Biglietti da visita 24H', type: 'bv24h',
    larghezza: { min:55, max:105, default:55 },
    altezza: { min:55, max:148, default:85 },
    qty: { min:50, max:1000, default:100 },
    latiMultiplier: [1, 1.5],
    latiChoices: ['1 lato', '2 lati'],
    cartaMultiplier: [1, 1.5, 1.9],
    cartaChoices: ['300', '350', '400'],
    soggettiMultiplier: [1,1.85,2.7,3.55,4.4,5.25,6.1,6.95,7.8,8.65],
    soggettiChoices: [1,2,3,4,5,6,7,8,9,10],
  },
};

module.exports = { PRICING };
