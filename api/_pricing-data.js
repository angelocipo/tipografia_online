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
  '5850': { nome: 'Stampa Roll-Up 150 × 200 cm', type: 'size', variants: ROLLUP_VARIANTS },
  '5392': { nome: 'Volantini A5 gr 130', type: 'tiers', tiers: [{qty:1000,price:48},{qty:2500,price:74},{qty:5000,price:107},{qty:10000,price:166},{qty:20000,price:299},{qty:30000,price:440},{qty:40000,price:573},{qty:50000,price:712},{qty:60000,price:851},{qty:70000,price:990},{qty:80000,price:1119},{qty:90000,price:1257},{qty:100000,price:1395}] },
  '5560': { nome: 'Volantini A4 gr 170', type: 'tiers', tiers: [{qty:1000,price:82},{qty:2500,price:137},{qty:5000,price:236},{qty:10000,price:429},{qty:20000,price:804},{qty:30000,price:1163},{qty:40000,price:1596},{qty:50000,price:1937},{qty:60000,price:2249},{qty:70000,price:2614},{qty:80000,price:2972},{qty:90000,price:3361},{qty:100000,price:3600}] },
  '5840': { nome: 'Volantini A6 gr 130', type: 'tiers', tiers: [{qty:100,price:25},{qty:500,price:31},{qty:1000,price:35},{qty:2500,price:44},{qty:5000,price:67},{qty:10000,price:108},{qty:20000,price:190},{qty:30000,price:277},{qty:40000,price:346},{qty:50000,price:437},{qty:60000,price:526},{qty:70000,price:596},{qty:80000,price:687},{qty:90000,price:776},{qty:100000,price:847}] },
  '5723': { nome: 'Volantini 10×21 cm', type: 'tiers', tiers: [{qty:1000,price:35},{qty:2500,price:54},{qty:5000,price:83},{qty:10000,price:135},{qty:20000,price:238},{qty:30000,price:350},{qty:40000,price:458},{qty:50000,price:571},{qty:60000,price:683},{qty:70000,price:796},{qty:80000,price:909},{qty:90000,price:1022},{qty:100000,price:1114}] },
  '5398': { nome: 'Pieghevoli A4 a 2 Ante A5', type: 'tiers', tiers: [{qty:100,price:48},{qty:500,price:71},{qty:1000,price:89},{qty:2500,price:138},{qty:5000,price:236},{qty:10000,price:410},{qty:20000,price:769},{qty:30000,price:1169},{qty:40000,price:1563},{qty:50000,price:1902},{qty:60000,price:2315},{qty:70000,price:2784},{qty:80000,price:3037},{qty:90000,price:3427},{qty:100000,price:3619}] },
  '5794': { nome: 'Pieghevoli A4 a 3 Ante 10×21 cm', type: 'tiers', tiers: [{qty:100,price:55},{qty:500,price:70},{qty:1000,price:81},{qty:2500,price:142},{qty:5000,price:240},{qty:10000,price:433},{qty:20000,price:842},{qty:30000,price:1245},{qty:40000,price:1678},{qty:50000,price:2013},{qty:60000,price:2393},{qty:70000,price:2787},{qty:80000,price:3140},{qty:90000,price:3431},{qty:100000,price:3685}] },
  '5606': { nome: 'Locandine 70×100 cm', type: 'tiers', tiers: [{qty:50,price:97},{qty:100,price:151},{qty:150,price:175},{qty:200,price:190},{qty:250,price:204},{qty:400,price:268},{qty:500,price:295},{qty:750,price:385},{qty:1000,price:454},{qty:1500,price:633},{qty:2000,price:792},{qty:3000,price:1118},{qty:4000,price:1437},{qty:5000,price:1770},{qty:6000,price:2104}] },
};

module.exports = { PRICING };
