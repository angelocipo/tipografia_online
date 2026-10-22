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
  // Backdrop: costo fornitore (display [+ struttura], IVA esclusa) × 1,6. 0–6 Completo, 7–13 Solo stampa. Ordine = index.html.
  '5970': { nome: 'Backdrop in tessuto', ean: '', type: 'size', variants: [
    { label: '100 × 230 cm — Completo (con struttura)', price: 364 },
    { label: '150 × 230 cm — Completo (con struttura)', price: 444 },
    { label: '230 × 230 cm — Completo (con struttura)', price: 585.6 },
    { label: '300 × 230 cm — Completo (con struttura)', price: 672.8 },
    { label: '400 × 230 cm — Completo (con struttura)', price: 838.4 },
    { label: '500 × 230 cm — Completo (con struttura)', price: 1023.2 },
    { label: '600 × 230 cm — Completo (con struttura)', price: 1152 },
    { label: '100 × 230 cm — Solo stampa', price: 228 },
    { label: '150 × 230 cm — Solo stampa', price: 300 },
    { label: '230 × 230 cm — Solo stampa', price: 412.8 },
    { label: '300 × 230 cm — Solo stampa', price: 482.4 },
    { label: '400 × 230 cm — Solo stampa', price: 600 },
    { label: '500 × 230 cm — Solo stampa', price: 712.8 },
    { label: '600 × 230 cm — Solo stampa', price: 825.6 },
  ] },
  // Prodotto di TEST nascosto (index.html#test-1).
  'test-1': { nome: 'Prodotto di test', ean: '', type: 'flat', price: 1 },
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
  // Buste: costo Flyeralarm × 1,6; scaglioni per formato; niente angoli/plastificazione.
  '6003': { nome: 'Buste a Sacco in Cartone', ean: '', type: 'businessCardStrategici', noFinish: true,
    formats: [
      { label: 'A3 plus · 32,9×47 cm (orizzontale)', qtyLabels: [50,100,250,500,750,1000,2000,2500,3000,4000,5000,6000,7000,7500,8000,9000,10000,15000], papers: [
        { label: 'gr. 450 cartoncino SBS opaco', deliveries: [
          { label: 'Standard 8 gg', readyDays: [8,8], prices: [925.06,942.88,1183.94,1608.26,1999.84,2371.62,3861.52,4738.98,5515.33,7089.44,8663.55,10237.62,11811.74,12609.49,13385.86,14959.97,16534.05,24404.56] },
          { label: 'Express 5–6 gg', readyDays: [5,6], prices: [958.74,976.58,1242.64,1691.87,2108.37,2505.04,4119.5,5077.28,5904.32,7605.12,9305.94,11006.7,12707.54,13581.28,14408.32,16109.15,17809.92] },
        ] },
      ] },
      { label: 'B4 · 34,6×24,8 cm (orizzontale)', qtyLabels: [10,20,30,40,50,75,100,250,500,750,1000,2000,2500,3000,4000,5000,6000], papers: [
        { label: 'gr. 450 cartoncino SBS opaco', deliveries: [
          { label: 'Standard 8 gg', readyDays: [8,8], prices: [171.98,299.39,408.45,536.14,698.5,704.29,707.28,894.53,1217.14,1498.67,1801.89,3032.37,3605.06,4222.32,5416.85,6701.2,7908.43] },
          { label: 'Express 5–6 gg', readyDays: [5,6], prices: [205.58,333.01,442.06,569.76,732.13,737.95,740.94,953.12,1325.65,1632.11,1985.14,3365.09,4019.38,4712.66,6059.22,7520.98,8880.24] },
        ] },
      ] },
      { label: 'B5 · 17,5×24,5 cm (verticale)', qtyLabels: [10,20,30,40,50,75,100,250,500,750,1000,2000,2500,3000,4000,5000,6000], papers: [
        { label: 'gr. 450 cartoncino SBS opaco', deliveries: [
          { label: 'Standard 8 gg', readyDays: [8,8], prices: [136.24,171.9,193.46,228.74,266.29,350.22,472.7,596.24,793.23,989.06,1178.54,1975.47,2344.5,2729.12,3496.21,4200.86,4975.62] },
          { label: 'Express 5–6 gg', readyDays: [5,6], prices: [171.1,205.52,227.07,262.34,299.89,383.86,506.32,654.75,876.74,1097.57,1311.98,2233.46,2657.47,3092.75,3986.56,4792.56,5694.02] },
        ] },
      ] },
      { label: 'B6 · 12,5×17,6 cm (verticale)', qtyLabels: [10,20,30,40,50,75,100,250,500,750,1000,2000,2500,3000,4000,5000,6000,7000,7500], papers: [
        { label: 'gr. 450 cartoncino SBS opaco', deliveries: [
          { label: 'Standard 8 gg', readyDays: [8,8], prices: [129.46,152.14,180.64,203.87,230.94,292.82,376.4,453.54,601.25,751.7,903.28,1479.23,1778.86,2056.88,2635.23,3208.32,3755.92,4286.18,4556.11] },
          { label: 'Express 5–6 gg', readyDays: [5,6], prices: [165.25,186.43,214.26,237.47,264.58,326.43,410.02,487.17,659.76,835.07,1011.58,1662.48,2015.81,2319.17,2998.88,3647.97,4271.6,4903.22,5198.48] },
        ] },
      ] },
      { label: 'DIN lungo · 11×22 cm (verticale)', qtyLabels: [50,75,100,250,500,1000,1250,2500,5000,7500,10000,20000,25000,50000], papers: [
        { label: 'gr. 350 offset bianca', deliveries: [
          { label: 'Standard 9 gg', readyDays: [9,9], prices: [512.1,516.86,520.05,615.46,781.81,1125.04,1284.16,2097.79,3620.86,5184.35,6773.57,12936.46,16068.14,31726.54] },
          { label: 'Express 5–6 gg', readyDays: [5,6], prices: [545.71,550.48,553.66,649.07,815.5,1183.62,1367.7,2233.36,3883.14,5573.33,7289.25] },
        ] },
      ] },
    ] },
  '6002': { nome: 'Buste da Lettera senza Finestra non Stampate', ean: '', type: 'businessCardStrategici', noFinish: true, noPrint: true,
    formats: [
      { label: 'DIN lungo 22×11 cm', qtyLabels: [1000,2000,3000,4000,5000,6000,7000,8000,9000,10000,20000,30000,40000,50000], papers: [
        { label: 'gr. 80 offset bianca', deliveries: [
          { label: 'Standard 4 gg', readyDays: [4,4], prices: [55.58,109.92,162.69,210.48,258,314.21,356.27,418.94,471.09,523.41,1035.82,1543.06,2057.38,2571.74] },
          { label: 'Express 2 gg', readyDays: [2,2], prices: [89.87,168.45,247.34,322.5,399.36,478.75,544.3,635.38,712.94,791.17,1567.84,2341.87,3118.58,3894.98] },
          { label: 'Overnight 1 g', readyDays: [1,1], prices: [116.93,193.22,279.12,355.14,434.99,515.26,581.66,673.6,752.05,833.26,1620.69,2409.78,3200.32,3995.2] },
        ] },
      ] },
      { label: 'DIN C6 16,2×11,4 cm', qtyLabels: [1000,2000,3000,4000,5000,6000,7000,8000,9000,10000,20000,30000,40000,50000], papers: [
        { label: 'gr. 80 offset bianca', deliveries: [
          { label: 'Standard 4 gg', readyDays: [4,4], prices: [68.98,134.67,195.86,258.54,320.66,384.78,443.66,511.39,571.55,635.07,1264.29,1887.84,2517.12,3146.4] },
          { label: 'Express 2 gg', readyDays: [2,2], prices: [103.66,193.17,280.51,368.91,459.58,552.22,629.25,732.46,820.94,911.17,1810.37,2703.87,3602.21,4478.61] },
          { label: 'Overnight 1 g', readyDays: [1,1], prices: [130.72,221.94,312.29,401.54,495.25,588.74,666.62,770.69,860.02,953.26,1863.23,2771.78,3683.01,4576.61] },
        ] },
      ] },
      { label: 'DIN C5 22,9×16,2 cm', qtyLabels: [500,1000,2000,3000,4000,5000,6000,7000,8000,9000,10000,20000,30000,40000,50000], papers: [
        { label: 'gr. 90 offset bianca', deliveries: [
          { label: 'Standard 4 gg', readyDays: [4,4], prices: [51.6,102.21,198.27,293.94,389.09,484.91,581.87,659.23,767.82,863.79,959.79,1906.62,2859.92,3766.21,4657.79] },
          { label: 'Express 2 gg', readyDays: [2,2], prices: [85.63,160.67,306.74,457.71,607.62,756.56,906.08,1036.38,1201.07,1350.1,1499.04,2972.45,4452.13,5886.22,7306.08] },
          { label: 'Overnight 1 g', readyDays: [1,1], prices: [109.01,185.47,337.22,492.08,643.7,796.5,947.76,1079.78,1246.19,1396.93,1549.82,3052.83,4563.41,6047.86,7529.1] },
        ] },
      ] },
      { label: 'DIN C4 22,9×32,4 cm (A4)', qtyLabels: [250,500,1000,2000,3000,4000,5000,6000,7000,8000,9000,10000,20000,30000,40000,50000], papers: [
        { label: 'gr. 90 offset bianca', deliveries: [
          { label: 'Standard 4 gg', readyDays: [4,4], prices: [41.76,84.64,165.17,312.43,465.5,618.96,769.36,919.57,1072.85,1226.08,1379.36,1532.61,3046.1,4516.98,5841.79,7302.22] },
          { label: 'Express 2 gg', readyDays: [2,2], prices: [75.39,143.17,274.91,531.62,797.66,1057.52,1314.43,1571.17,1830.85,2090.51,2350.21,2609.89,5188.16,7725.12,10120.51,12647.34] },
          { label: 'Overnight 1 g', readyDays: [1,1], prices: [98.78,165.78,305.41,568.54,840.56,1107.18,1374.4,1639.36,1905.89,2172.42,2438.94,2707.62,5363.82,7978.4,10447.31,13055.84] },
        ] },
      ] },
    ] },
  '6001': { nome: 'Buste da Lettera con Finestra a Destra', ean: '', type: 'businessCardStrategici', noFinish: true,
    formats: [
      { label: 'DIN lungo 22×11 cm', qtyLabels: [10,25,50,75,100,250,500,750,1000,2000,2500,3000,4000,5000,6000,7000,7500,8000], papers: [
        { label: 'gr. 80 offset bianca', deliveries: [
          { label: 'Standard 5 gg', readyDays: [5,5], prices: [44.86,45.74,47.25,48.74,50.26,67.58,79.58,85.34,99.34,144.19,171.71,200.26,254.69,299.97,349.01,413.36,438,460.03] },
          { label: 'Express 2–3 gg', readyDays: [2,3], prices: [79.79,80.77,82.42,84.05,85.71,103.38,115.41,121.18,135.17,177.89,205.84,234.4,314.13,359.41,408.58,498.27,522.9,544.93] },
          { label: 'Overnight 1 g', readyDays: [1,1], prices: [103.18,104.16,105.81,107.44,109.12,126.78,138.8,144.58,162.21,201.81,235.89] },
        ] },
      ] },
      { label: 'Lettershop 22,9 × 11,4 cm', qtyLabels: [10,25,50,75,100,250,500,750,1000,2000,2500,3000,4000,5000,6000,7000], papers: [
        { label: 'gr. 75 offset bianca', deliveries: [
          { label: 'Standard 7 gg', readyDays: [7,7], prices: [70.8,71.82,73.57,75.28,77.01,86.51,102.64,118,133.18,195.78,232.35,264.5,344.51,409.34,475.09,554.96] },
        ] },
      ] },
      { label: 'DIN C4 22,9×32,4 cm (A4)', qtyLabels: [10,25,50,75,100,250,500,1000,2500,5000,7500,10000,15000,20000,25000], papers: [
        { label: 'gr. 90 offset bianca', deliveries: [
          { label: 'Standard 5 gg', readyDays: [5,5], prices: [113.79,116.32,118.75,122.88,127.04,147.23,183.04,251.65,495.92,886.96,1290.24,1680.91,2458.83,3250.32,3956.69] },
          { label: 'Express 2–3 gg', readyDays: [2,3], prices: [149.6,152.13,154.58,158.7,162.85,181.86,216.72,285.36,580.82,1022.54,1501.84,1943.2] },
          { label: 'Overnight 1 g', readyDays: [1,1], prices: [172.99,175.52,177.95,182.08,186.24,205.25,242.48,313.26] },
        ] },
      ] },
    ] },
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
      { label: 'Orizzontale 8,5×5,5 cm', papers: [
        { label: 'gr. 300 patinata opaca', tiers: [{qty:100,price:71.62},{qty:250,price:86.78},{qty:500,price:111.15},{qty:1000,price:124.99},{qty:2500,price:212.56},{qty:5000,price:341.92},{qty:7500,price:481.17},{qty:10000,price:624.13},{qty:15000,price:911.54},{qty:20000,price:1193.28}] },
        { label: 'gr. 400 patinata opaca', tiers: [{qty:100,price:75.28},{qty:250,price:89.86},{qty:500,price:106.69},{qty:1000,price:144.74},{qty:2500,price:262.86},{qty:5000,price:463.63},{qty:7500,price:661.63},{qty:10000,price:863.84},{qty:15000,price:1258},{qty:20000,price:1670.9}] },
        { label: 'gr. 500 patinata opaca', tiers: [{qty:100,price:83.86},{qty:250,price:111.44},{qty:500,price:145.63},{qty:1000,price:224.24},{qty:2500,price:467.02},{qty:5000,price:877.55},{qty:7500,price:1283.39},{qty:10000,price:1693.25},{qty:15000,price:2510.03},{qty:20000,price:3295.73}] },
        { label: 'gr. 350 cartoncino SBS opaco', tiers: [{qty:100,price:93.89},{qty:250,price:114.86},{qty:500,price:151.18},{qty:1000,price:194.19},{qty:2500,price:369.42},{qty:5000,price:618.69},{qty:7500,price:887.94},{qty:10000,price:1159.12},{qty:15000,price:1709.1},{qty:20000,price:2257.81}] },
      ] },
      { label: 'Verticale 5,5×8,5 cm', papers: [
        { label: 'gr. 300 patinata opaca', tiers: [{qty:100,price:71.62},{qty:250,price:86.78},{qty:500,price:111.15},{qty:1000,price:124.99},{qty:2500,price:212.56},{qty:5000,price:341.92},{qty:7500,price:481.17},{qty:10000,price:624.13},{qty:15000,price:911.54},{qty:20000,price:1193.28}] },
        { label: 'gr. 400 patinata opaca', tiers: [{qty:100,price:75.28},{qty:250,price:89.86},{qty:500,price:106.69},{qty:1000,price:144.74},{qty:2500,price:262.86},{qty:5000,price:463.63},{qty:7500,price:661.63},{qty:10000,price:863.84},{qty:15000,price:1258},{qty:20000,price:1670.9}] },
        { label: 'gr. 500 patinata opaca', tiers: [{qty:100,price:83.86},{qty:250,price:111.44},{qty:500,price:145.63},{qty:1000,price:224.24},{qty:2500,price:467.02},{qty:5000,price:877.55},{qty:7500,price:1283.39},{qty:10000,price:1693.25},{qty:15000,price:2510.03},{qty:20000,price:3295.73}] },
        { label: 'gr. 350 cartoncino SBS opaco', tiers: [{qty:100,price:93.89},{qty:250,price:114.86},{qty:500,price:151.18},{qty:1000,price:194.19},{qty:2500,price:369.42},{qty:5000,price:618.69},{qty:7500,price:887.94},{qty:10000,price:1159.12},{qty:15000,price:1709.1},{qty:20000,price:2257.81}] },
      ] },
      { label: 'Orizzontale 9×5 cm', papers: [
        { label: 'gr. 350 offset', tiers: [{qty:250,price:94.32},{qty:500,price:114.38},{qty:1000,price:143.62},{qty:2500,price:236.58},{qty:5000,price:383.5},{qty:7500,price:538.82},{qty:10000,price:717.65}] },
      ] },
      { label: 'Verticale 5×9 cm', papers: [
        { label: 'gr. 350 offset', tiers: [{qty:250,price:94.32},{qty:500,price:114.38},{qty:1000,price:143.62},{qty:2500,price:236.58},{qty:5000,price:383.5},{qty:7500,price:538.82},{qty:10000,price:717.65}] },
      ] },
      { label: 'Quadrato 5,5×5,5 cm', papers: [
        { label: 'gr. 350 offset', tiers: [{qty:250,price:94.32},{qty:500,price:114.38},{qty:1000,price:143.62},{qty:2500,price:236.58},{qty:5000,price:383.5},{qty:7500,price:538.82},{qty:10000,price:717.65}] },
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
    formats: ['A4 (21×29,7 cm)', 'A3 (29,7×42 cm)', '30×40 cm', '40×60 cm', 'A2 (42×59,4 cm)', '50×70 cm', '50×100 cm', 'A1 (59,4×84 cm)', '60×90 cm', '70×100 cm', 'A0 (84×118,8 cm)', '200×100 cm'],
    spessoreChoices: ['2 mm', '5 mm'],
    stampaChoices: ['1 lato'],
    consegnaChoices: ['Standard 4–6 gg', 'Express 2–3 gg', 'Overnight 1 gg'],
    // Prezzo = (totale Flyeralarm per la quantità × 1,7) + 15 € gestione. Listino FA 22/10/2026, stampa 4/0.
    // fa[spessoreIdx][consegnaIdx][formatIdx][qty-1]; lunghezza array = quantità massima.
    markup: 1.7, handling: 15,
    fa: [
      [ // 2 mm
        [ // Standard
          [11.98,13.32,14.21,15.45,16.75,17.92,19.03,20.15,21.27,22.38,23.5,24.62,25.73,26.84,27.98,29.09,30.2,31.31], // A4 (21×29,7 cm)
          [13.17,14.93,17.07,18.97,20.84,22.7,24.6,26.47,28.33,30.21,32.09,33.96,35.84,37.69,39.58,41.46,43.33,45.21], // A3 (29,7×42 cm)
          [13.08,14.76,16.84,18.69,20.5,22.32,24.13,25.92,27.73,29.53,31.35,33.14,34.95,36.77,38.56,40.36,42.17,43.99], // 30×40 cm
          [15.49,18.98,22.25,25.54,28.8,32.08,35.36,38.62,41.9,45.18,48.45,51.91,55.18,58.45,61.74,65,68.28,71.56], // 40×60 cm
          [15.42,18.9,22.13,25.36,28.59,31.81,35.04,38.28,41.51,44.74,48.15,51.38,54.6,57.83,61.08,64.3,67.54,70.76], // A2 (42×59,4 cm)
          [20.5,27.14,33.77,40.41,47.06,53.71,60.34,67.16,85.23,91.88,98.51,104.48,111.41,118,124.6,131.19,151.93,158.52], // 50×70 cm
          [27.87,38.01,48.21,58.36,68.52,78.68,88.84,99,118.87,129.01,138.82,148.61,158.42,168.22,178.51,188.33,216.42,226.24], // 50×100 cm
          [21.15,28.47,35.77,43.06,50.36,57.84,65.15,72.46,91.19,98.83,105.45,112.7,119.95,127.2,134.94,142.18,163.83,171.07], // A1 (59,4×84 cm)
          [22.76,31.69,40.6,49.51,58.43,67.51,76.43,85.35,105.36,114.21,123.06,131.91,140.76,150.09,158.93,167.8,191.04,199.89], // 60×90 cm
          [30.3,42.88,55.42,68.01,80.57,93.16,104.55,116.98,140.15,152.29,164.9,177.03,189.16,201.28,213.43,226.28,257.08], // 70×100 cm
          [32,46.31,60.62,74.91,89.21,102.37,116.49,130.58,155.59,169.4,183.93,197.7,211.5,225.29,239.08,252.88,285.69,299.87], // A0 (84×118,8 cm)
          [118.34,150.33,180.97,212.55,330.34,361.93,393.52,425.09,542.9,574.48,606.05,637.63,755.44,787.02,818.6,812.43,927.28], // 200×100 cm
        ],
        [ // Express
          [33.35,34.47,35.59,36.69,37.81,38.93,40.04,41.16,42.28,43.39,44.51,45.64,46.74,47.85,48.99,50.1,51.21,52.32], // A4 (21×29,7 cm)
          [34.36,36.23,38.09,39.98,41.84,43.71,45.6,47.47,49.34,51.22,53.1,55.02,56.95,58.85,60.81,62.74,64.67,66.59], // A3 (29,7×42 cm)
          [34.28,36.09,37.89,39.7,41.51,43.32,45.14,46.94,48.74,50.54,52.36,54.19,56.04,57.91,59.75,61.61,63.47,65.34], // 30×40 cm
          [36.71,39.99,43.26,46.54,49.81,53.09,56.47,59.82,63.21,66.56,69.94,73.32,76.68,80.05,83.44,86.79,90.17,93.55], // 40×60 cm
          [36.67,39.9,43.14,46.37,49.6,52.83,56.13,59.47,62.78,66.12,69.45,72.77,76.08,79.41,82.76,86.07,89.4,92.71], // A2 (42×59,4 cm)
          [41.51,48.14,54.84,61.67,68.5,75.35,82.16,89.01,121.71,128.37,134.99,140.96,147.95,154.54,161.13,167.72,203.96,210.55], // 50×70 cm
          [50.26,60.4,70.58,80.75,90.91,101.08,111.22,121.38,155.36,165.55,175.36,185.14,194.96,204.76,215.09,224.89,268.5,278.31], // 50×100 cm
          [42.15,49.48,56.89,64.37,71.9,79.42,86.95,94.47,127.68,135.36,141.98,149.24,156.49,163.73,171.5,178.75,215.91,223.14], // A1 (59,4×84 cm)
          [43.77,52.69,61.86,71.04,80.2,89.38,98.54,107.72,141.9,150.75,159.6,168.44,177.3,186.65,195.5,204.36,243.11,251.96], // 60×90 cm
          [52.68,65.26,77.82,90.4,102.96,115.54,126.94,139.37,176.68,188.83,201.46,213.59,225.72,237.85,250.26,262.86,309.19], // 70×100 cm
          [54.39,68.69,83.01,97.3,111.6,124.75,138.88,152.98,192.16,205.97,220.52,234.3,248.09,261.88,275.78,289.89,337.84,352.01], // A0 (84×118,8 cm)
          [140.74,172.72,203.36,234.93,367.8,399.39,430.97,462.55,595.44,627.03,658.59,690.17,823.06,854.64,886.21,880.04,1009.98], // 200×100 cm
        ],
        [ // Overnight
          [47.4,48.56,49.71,50.83,52,53.14,54.29,55.43,56.57,57.73], // A4 (21×29,7 cm)
          [48.43,50.37,52.28,54.23,56.14,58.07,60.02,61.93,63.85,65.8], // A3 (29,7×42 cm)
          [48.36,50.22,52.07,53.93,55.8,57.67,59.54,61.39,63.23,65.1], // 30×40 cm
          [50.86,54.24,57.59,60.97,64.34,67.71,71.1,74.44,77.82,81.19], // 40×60 cm
          [50.81,54.14,57.47,60.79,64.11,67.44,70.75,74.09,77.4,80.74], // A2 (42×59,4 cm)
          [55.8,62.63,69.46,76.29,83.12,89.97,96.78,103.63,138.35,145.01], // 50×70 cm
          [64.88,75.02,85.2,95.37,105.53,115.69,125.85,136,172,182.18], // 50×100 cm
          [56.45,64,71.51,79,86.52,94.04,101.57,109.09,144.32,152], // A1 (59,4×84 cm)
          [58.13,67.3,76.49,85.66,94.82,104,113.16,122.34,158.53,167.39], // 60×90 cm
          [67.29,79.89,92.44,105.02,117.58,130.16,141.56,153.99,193.32,205.47], // 70×100 cm
          [69.01,83.32,97.63,111.91,126.22,139.38,153.5,167.6,208.8,222.61], // A0 (84×118,8 cm)
          [155.36,187.34,217.97,249.54,383.34,414.93,446.51,478.09,611.88,643.48], // 200×100 cm
        ],
      ],
      [ // 5 mm
        [ // Standard
          [12.4,14.5,16.26,18.15,20.19,22.19,24.03,25.89,27.74,29.61,38.66,40.8,42.88,45,47.11,48.88,50.44,52.01], // A4 (21×29,7 cm)
          [14.04,16.97,20.33,23.52,26.58,29.63,32.7,35.75,38.82,42.06,52.6,55.95,59.32,62.65,66.03,69.27,72.67,75.75], // A3 (29,7×42 cm)
          [13.92,16.75,19.99,23.08,26.06,29.01,31.96,34.92,37.88,41.01,51.63,54.55,57.78,61.04,64.3,67.54], // 30×40 cm
          [17,22.69,27.96,33.19,38.63,43.89,49.15,54.4,59.65,65.09,80.27,85.53,90.8,96.54,101.12,106.32,111.54,116.74], // 40×60 cm
          [17.21,23.05,28.51,33.96,39.59,45.02,50.47,55.92,61.37,66.98,82.36,87.8,93.74,98.52,103.93,109.33,114.73,120.13], // A2 (42×59,4 cm)
          [23.52,33.52,43.55,53.73,63.75,73.77,95.2,104.5,114.43,124.85,134.79,144.73,169.81,179.75,189.68,199.62,209.55,219.49], // 50×70 cm
          [32.2,47.06,62.1,76.97,91.99,106.1,133.81,148.55,163.3,178.78,193.52,208.26,241.25,256.34,271.08,286.21,301.3,316.03], // 50×100 cm
          [26.3,39.11,52.08,64.9,77.85,90.01,114.42,127.11,139.82,153.25,165.94,178.64,205.76,218.81,231.51,244.6,257.64,270.35], // A1 (59,4×84 cm)
          [27.1,40.72,54.49,68.09,81.87,94.78,119.99,133.48,147.7,161.21,174.69,188.19,216.45,229.94,243.82,257.68,271.17,285.01], // 60×90 cm
          [36.05,52.22,68.22,84.38,100.39,137.26,153.99,170,186,201.99,239.72,256.06,272.07,288.42,304.78,342.87,358.85,374.86], // 70×100 cm
          [41.45,65.74,90.02,113.56,137.48,161.78,198.8,222.95,247.35,271.51,295.66,319.83,362.7,386.63,410.55,434.47,458.39], // A0 (84×118,8 cm)
          [125.49,164.61,289.37,329.17,453.95,493.77,618.54,658.34,783.12,822.91,909.44,946.18,1067.15,1103.91,1224.86,1261.61,1382.55,1385.53], // 200×100 cm
        ],
        [ // Express
          [33.9,35.76,37.62,39.47,41.33,43.2,45.04,46.9,48.76,50.62,76.37,78.24,80.46,82.33,84.18,86.05,87.89,89.76], // A4 (21×29,7 cm)
          [35.35,38.4,41.46,44.53,47.59,50.64,53.71,56.77,59.82,63.08,90.46,93.52,96.59,99.64,102.7,105.76,109.21,112.29], // A3 (29,7×42 cm)
          [35.24,38.2,41.15,44.09,47.06,50.02,52.97,55.94,58.89,62.03,89.3,92.25,95.21,98.17,101.12,104.07], // 30×40 cm
          [38.44,43.7,48.97,54.19,59.64,64.9,70.16,75.42,80.67,86.14,116.8,122.07,127.33,133.11,137.68,142.88,148.1,153.31], // 40×60 cm
          [38.63,44.06,49.52,54.97,60.6,66.04,71.49,76.95,82.39,88.03,118.9,124.34,130.31,135.09,140.49,145.89,151.3,156.69], // A2 (42×59,4 cm)
          [44.53,54.54,64.56,74.75,84.77,94.79,131.75,141.04,150.97,161.42,171.36,181.3,221.91,231.86,241.78,251.72,261.65,271.6], // 50×70 cm
          [53.98,68.59,83.21,97.99,113.04,127.14,170.38,185.12,199.87,215.37,230.11,244.85,293.36,308.49,323.22,338.35,353.45,368.18], // 50×100 cm
          [47.31,60.12,73.1,85.92,98.9,111.06,150.99,163.68,176.38,189.84,202.53,215.22,257.87,270.96,283.66,296.74,309.8,322.5], // A1 (59,4×84 cm)
          [48.11,61.73,75.5,89.11,102.91,115.82,156.56,170.05,184.29,197.79,211.28,224.78,268.59,282.09,295.95,309.82,323.32,337.2], // 60×90 cm
          [58.42,73.24,89.24,105.42,121.43,173.83,190.58,206.58,222.59,238.57,291.86,308.23,324.22,340.62,356.99,410.69,426.67,442.69], // 70×100 cm
          [63.07,86.79,111.07,134.62,158.54,182.85,235.38,259.56,283.97,308.15,332.32,356.51,414.96,438.89,462.81,486.73,510.65], // A0 (84×118,8 cm)
          [147.87,187,326.84,366.63,506.49,546.3,686.16,725.96,865.82,905.61,1007.21,1043.96,1180,1216.76,1352.79,1389.53,1525.56,1528.53], // 200×100 cm
        ],
        [ // Overnight
          [47.76,49.59,51.41,53.24,55.07,56.91,58.72,60.53,62.37,64.22], // A4 (21×29,7 cm)
          [49.19,52.18,55.2,58.21,61.24,64.24,67.3,70.37,73.43,76.68], // A3 (29,7×42 cm)
          [49.08,52,54.89,57.78,60.71,63.62,66.57,69.53,72.48,75.62], // 30×40 cm
          [52.22,57.41,62.6,67.79,73.25,78.51,83.77,89.03,94.27,99.74], // 40×60 cm
          [52.41,57.75,63.13,68.57,74.2,79.64,85.09,90.55,95.99,101.62], // A2 (42×59,4 cm)
          [58.21,68.13,78.16,88.35,98.37,108.39,148.38,157.68,167.61,178.06], // 50×70 cm
          [68.6,83.21,97.83,112.47,127.08,143.23,187.02,201.75,216.5,232.01], // 50×100 cm
          [60.95,73.73,86.7,99.52,112.5,124.66,167.62,180.32,193.02,206.47], // A1 (59,4×84 cm)
          [61.74,75.33,89.1,102.71,116.51,129.42,173.2,186.68,200.93,214.43], // 60×90 cm
          [73.05,87.74,102.84,119.02,137.53,190.47,207.22,223.22,239.22,255.22], // 70×100 cm
          [77.7,101.41,125.14,150.72,174.64,198.95,252.02,276.2,300.61,324.79], // A0 (84×118,8 cm)
          [162.5,201.62,342.37,382.17,522.93,562.75,703.51,743.31,884.09,923.88], // 200×100 cm
        ],
      ],
    ],
  },
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
    larghezza: {min:5,max:31,default:21},
    altezza: {min:5,max:44,default:15},
    qty: {min:50,max:2000,default:50},
    sagomaChoices: ['No','Si'],
    sagomaMultiplier: [1,1.4],
  },
  '218': { nome: 'Biglietti da visita 24H', ean: '0652026573534', type: 'bv24h',
    larghezza: { min:5.5, max:10.5, default:5.5 },
    altezza: { min:5.5, max:14.8, default:8.5 },
    qty: { min:50, max:1000, default:100 },
    latiMultiplier: [1, 1.5],
    latiChoices: ['1 lato', '2 lati'],
    cartaMultiplier: [1, 1.5, 1.9],
    cartaChoices: ['300', '350', '400'],
    soggettiMultiplier: [1,1.9,2.8,3.7,4.6,5.5,6.4,7.3,8.2,9.1],
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
