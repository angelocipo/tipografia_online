// Vercel serverless function — POST /api/create-checkout-session
// Body: { items: [{ productId, tierIndex?, sizeIndex?, formula?, deliveryIndex? }, …], customer, shipping, … }
// (vecchio formato a prodotto singolo ancora accettato)
// Computes the price SERVER-SIDE from _pricing-data.js (never trusts a client-sent amount),
// creates a Stripe Checkout Session, and returns { url } to redirect the browser to.

const Stripe = require('stripe');
const { paypalToken, paypalApi, signAmount, signTicket } = require('./_paypal');
const { PRICING, angoliArrotondatiPrice, plastificataPrice } = require('./_pricing-data');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const { validateRange, getBooked, daysFromMetadata } = require('./_bookings');

function priceItem(product, it) {
  const { productId, tierIndex, sizeIndex, formula, deliveryIndex } = it || {};
  let unitAmountCents, description, evRange;
  // Dimensioni inserite dal cliente: virgola o punto, arrotondate a 1 decimale.
  const dim1 = (v) => { const n = Math.round(parseFloat(String(v).replace(',', '.')) * 10) / 10; return isNaN(n) ? 0 : n; };
  if (product.type === 'formula') {
    const qty = Math.max(1, parseInt(formula?.qty, 10) || 1);
    const strutturaIdx = formula?.strutturaIdx === 1 ? 1 : 0;
    const tempi = product.forceTempi || (formula?.tempi === '24H' ? '24H' : '72H');
    const rush = tempi === '24H' ? product.rate24h : 0;
    const total = qty * (product.rollupRate(qty) + product.strutturaRates[strutturaIdx] + rush);
    unitAmountCents = Math.round(total * 100);
    description = `${product.nome} — ${qty}pz, ${tempi}, ${strutturaIdx === 0 ? 'con struttura' : 'solo stampa'}`;
  } else if (product.type === 'tiersDelivery') {
    const dIdx = Number.isInteger(deliveryIndex) ? deliveryIndex : 0;
    const tiers = product.tiersByDelivery[Math.min(Math.max(dIdx, 0), product.tiersByDelivery.length - 1)];
    const idx = Number.isInteger(tierIndex) ? tierIndex : 0;
    const tier = tiers[Math.min(Math.max(idx, 0), tiers.length - 1)];
    unitAmountCents = Math.round(tier.price * 100);
    description = `${product.nome} — ${tier.qty} copie`;
  } else if (product.type === 'tiers') {
    const idx = Number.isInteger(tierIndex) ? tierIndex : 0;
    const tier = product.tiers[Math.min(Math.max(idx, 0), product.tiers.length - 1)];
    unitAmountCents = Math.round(tier.price * 100);
    description = `${product.nome} — ${tier.qty} copie`;
  } else if (product.type === 'striscioniPvc') {
    const qty = Math.max(1, Math.min(100, parseInt(formula?.qty, 10) || 1));
    const consegnaIdx = formula?.consegnaIdx === 1 ? 1 : 0;
    const occhielliIdx = formula?.occhielliIdx === 1 ? 1 : 0;
    const fIdx = Number.isInteger(formula?.formatIdx) ? formula.formatIdx : 0;
    const idx = Math.min(Math.max(fIdx, 0), 2);
    const rate = consegnaIdx === 1
      ? product.rates2gg[idx]
      : (occhielliIdx === 1 ? product.ratesSettimanaCon[idx] : product.ratesSettimanaSenza[idx]);
    const total = Math.round((rate * qty * 1.22 * 1.3) * 100) / 100;
    unitAmountCents = total * 100;
    const formats = ['200×100 cm', '300×100 cm', '400×100 cm'];
    const consegnaLabel = consegnaIdx === 1 ? '2 gg Lavorativi' : '1 Settimana';
    const occhielliLabel = consegnaIdx === 0 ? (occhielliIdx === 1 ? 'Con occhielli' : 'Senza occhielli') : '';
    description = `${product.nome} — ${formats[idx]}, ${consegnaLabel}${occhielliLabel ? ', ' + occhielliLabel : ''}, ${qty}pz`;
  } else if (product.type === 'bv24h') {
    const { larghezza, altezza, qty, latiIdx, cartaIdx, soggettiIdx } = formula || {};
    const l = Math.max(product.larghezza.min, Math.min(product.larghezza.max, dim1(larghezza) || product.larghezza.default));
    const a = Math.max(product.altezza.min, Math.min(product.altezza.max, dim1(altezza) || product.altezza.default));
    const q = Math.max(product.qty.min, Math.min(product.qty.max, parseInt(qty, 10) || product.qty.default));
    const latI = latiIdx === 1 ? 1 : 0;
    const cartaI = Math.min(Math.max(Number.isInteger(cartaIdx) ? cartaIdx : 0, 0), product.cartaMultiplier.length - 1);
    const sogI = Math.min(Math.max(Number.isInteger(soggettiIdx) ? soggettiIdx : 0, 0), product.soggettiMultiplier.length - 1);
    const bv = product.cartaMultiplier[cartaI];
    const soggetti = product.soggettiMultiplier[sogI];
    const lati = product.latiMultiplier[latI];
    let total = Math.round((20 + bv * soggetti * lati * q * (l*10+20)*(a*10+40)/440/320) * 100) / 100;
    let angoliSuffix = '';
    if (formula && formula.angoliArrotondati) { total += angoliArrotondatiPrice(q); angoliSuffix = ', Angoli arrotondati'; }
    unitAmountCents = total * 100;
    description = `${product.nome} — ${l}×${a} cm, gr.${product.cartaChoices[cartaI]}, ${product.latiChoices[latI]}, ${product.soggettiChoices[sogI]} soggetti, ${q}pz${angoliSuffix}`;
  } else if (product.type === 'adesiviPrespaziati') {
    const { base, altezza, copie, lavorazioneIdx, coloreIdx, materialeIdx, altroColore } = formula || {};
    const b = Math.max(product.base.min, Math.min(product.base.max, dim1(base) || product.base.default));
    const a = Math.max(product.altezza.min, Math.min(product.altezza.max, dim1(altezza) || product.altezza.default));
    const c = Math.max(product.copie.min, parseInt(copie, 10) || product.copie.default);
    const lIdx = Math.min(Math.max(Number.isInteger(lavorazioneIdx) ? lavorazioneIdx : 0, 0), product.lavorazioni.length - 1);
    const mIdx = materialeIdx === 1 ? 1 : 0;
    const colOptions = product.coloreByMateriale[mIdx];
    const cIdx = Math.min(Math.max(Number.isInteger(coloreIdx) ? coloreIdx : 0, 0), colOptions.length - 1);
    const colore = colOptions[cIdx] === 'Altro' ? (altroColore || 'Altro') : colOptions[cIdx];
    const mult = product.lavorazioni[lIdx].mult;
    const total = Math.round((15 + mult * 5.5 * 1.22 * 5 * ((b+2.5)*(a+2.5)/6200) * c) * 100) / 100;
    unitAmountCents = total * 100;
    description = `${product.nome} — ${b}×${a} cm, ${colore}, ${product.lavorazioni[lIdx].label}, ${c}pz`;
  } else if (product.type === 'adesivoInterno') {
    const { larghezza, altezza, qty, sagomaIdx } = formula || {};
    const l = Math.max(product.larghezza.min, Math.min(product.larghezza.max, dim1(larghezza) || product.larghezza.default));
    const a = Math.max(product.altezza.min, Math.min(product.altezza.max, dim1(altezza) || product.altezza.default));
    const q = Math.max(product.qty.min, Math.min(product.qty.max, parseInt(qty, 10) || product.qty.default));
    const sIdx = sagomaIdx === 1 ? 1 : 0;
    const mult = product.sagomaMultiplier[sIdx];
    const total = Math.round((10 + mult * ((l+2)*(a+2)/44/32) * q * 1.22 * 2) * 100) / 100;
    unitAmountCents = total * 100;
    description = `${product.nome} — ${l}×${a} cm, ${q}pz, sagoma: ${product.sagomaChoices[sIdx]}`;
  } else if (product.type === 'imageSwatchQty') {
    const { swatchIdx, qty } = formula || {};
    const idx = Math.min(Math.max(Number.isInteger(swatchIdx) ? swatchIdx : (product.defaultSwatchIdx || 0), 0), product.swatches.length - 1);
    const q = Math.max(1, parseInt(qty, 10) || 1);
    unitAmountCents = Math.round(q * product.pricePerUnit * 100);
    description = `${product.nome} — ${product.swatches[idx]}, ${q}pz`;
  } else if (product.type === 'imageSwatch') {
    const idx = Number.isInteger(sizeIndex) ? sizeIndex : 0;
    const i = Math.min(Math.max(idx, 0), product.swatches.length - 1);
    unitAmountCents = Math.round(product.price * 100);
    description = `${product.nome} — ${product.swatches[i]}`;
  } else if (product.type === 'locandine250') {
  const { formatIdx, cartaIdx, qty } = formula || {};
  const fIdx = Math.min(Math.max(Number.isInteger(formatIdx) ? formatIdx : 0, 0), product.formatRates.length - 1);
  const cIdx = Math.min(Math.max(Number.isInteger(cartaIdx) ? cartaIdx : 2, 0), product.cartaMultiplier.length - 1);
  const q = Math.max(1, parseInt(qty, 10) || 1);
  const total = Math.round((product.formatRates[fIdx] * q * product.cartaMultiplier[cIdx] * 1.22 + 5) * 100) / 100; // + € 5 costo fisso
  unitAmountCents = Math.round(total * 100);
  description = `${product.nome} — ${product.formatChoices[fIdx]}, ${product.cartaChoices[cIdx]}, ${q}pz`;
  } else if (product.type === 'libretti') {
    const { quantita, facciate } = formula || {};
    // Stessi limiti dei campi numerici sulla scheda prodotto (1–200 rilegature, 12–100 facciate).
    const q = Math.min(200, Math.max(1, parseInt(quantita, 10) || 1));
    const f = Math.min(100, Math.max(12, parseInt(facciate, 10) || 12));
    const total = Math.round((q * (1.5 + f * 0.1) + 7) * 100) / 100;
    unitAmountCents = Math.round(total * 100);
    description = `${product.nome} — ${q}pz, ${f} facciate B/N`;
  } else if (product.type === 'volantiniPieghevoli') {
    // Formula Studio Wombat: (carta + stampa) × q × (L+20)(H+20)/440/320 + perforazione×q + pieghe×q.
    // Stessi limiti dei campi sulla scheda prodotto (25–1.000 pz, 5–32 × 5–44 cm).
    const { qty, larghezza, altezza, materiale, stampa, perforazione, pieghe } = formula || {};
    const q = Math.min(1000, Math.max(25, parseInt(qty, 10) || 25));
    const w = Math.min(32, Math.max(5, dim1(larghezza) || 5)) * 10; // cm → mm
    const h = Math.min(44, Math.max(5, dim1(altezza) || 5)) * 10;
    const cartaRate = { 'gr. 100':0.13, 'gr. 200':0.25, 'gr. 300':0.37, 'gr. 400':0.49, 'gr. 280 martellata':0.68 }[materiale] ?? 0.13;
    const stampaRate = { '1 lato a colori':0.4, '2 lati a colori':0.7, '1 lato bianco nero':0.07, '2 lati bianco nero':0.14, '1 lato bianco nero + 1 a colori':0.47 }[stampa] ?? 0.4;
    const perfRate = perforazione === 'Si' ? 0.05 : 0;
    const piegheRate = { '1 piega':0.1, '2 pieghe':0.2, '3 pieghe':0.3 }[pieghe] ?? 0;
    const total = ((cartaRate + stampaRate) * q * (w+20) * (h+20) / 440 / 320 + perfRate*q + piegheRate*q + 10) * 1.6; // €10 spese fisse d'ordine, ricarico ×1,6
    unitAmountCents = Math.round(total * 100);
    description = `${product.nome} — ${w/10}×${h/10} cm, ${materiale || 'gr. 100'}, ${stampa || '1 lato a colori'}${perfRate ? ', perforazione' : ''}${piegheRate ? ', ' + pieghe : ''}, ${q}pz`;
  } else if (product.type === 'strutturaEventi') {
    const { altezza, larghezza, unit, ev_start, ev_end, ev_start_time, ev_end_time, ev_address } = formula || {};
    const rng = validateRange(ev_start, ev_end);
    if (rng.error) return { error: 'Struttura per Eventi: ' + rng.error };
    const tOk = (t) => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(t || ''));
    const addr = String(ev_address || '').replace(/\s+/g, ' ').trim().slice(0, 120);
    if (!tOk(ev_start_time) || !tOk(ev_end_time) || addr.length < 5) return { error: "Struttura per Eventi: indica ora di montaggio, ora di smontaggio e indirizzo dell'evento." };
    const itD = (x) => x.slice(8, 10) + '/' + x.slice(5, 7) + '/' + x.slice(0, 4);
    const evLabel = 'montaggio ' + itD(rng.start) + ' ore ' + ev_start_time + ', smontaggio ' + itD(rng.end) + ' ore ' + ev_end_time + ', ' + addr;
    evRange = [rng.start, rng.end];
    // I campi sono ora liberi: limito i valori lato server all'intervallo dichiarato per unità.
    const LIMITS = { CM:{h:[100,400],w:[100,600]}, INCH:{h:[40,160],w:[40,240]}, FEET:{h:[4,15],w:[4,20]} };
    const lim = LIMITS[String(unit || 'CM').toUpperCase()] || LIMITS.CM;
    const clamp = (v, [lo, hi], def) => Math.min(Math.max(dim1(v) || def, lo), hi);
    const h = clamp(altezza, lim.h, lim.h[0]), w = clamp(larghezza, lim.w, lim.w[0]);
    // Il prezzo si calcola sempre in cm, qualunque unità abbia scelto il cliente.
    const k = ({ CM:1, INCH:2.54, FEET:30.48 })[String(unit || 'CM').toUpperCase()] || 1;
    const hCm = h * k, wCm = w * k;
    const base = wCm * 0.002 + 29 + ((2*hCm + 2*wCm) / 100) * 50;
    const total = base * 1.5;
    unitAmountCents = Math.round(total * 100);
    description = `${product.nome} — Roma, ${evLabel} — ${h}×${w} ${String(unit || 'CM').toUpperCase()}, prezzo € ${base.toFixed(2).replace('.', ',')} + caparra 50% (€ ${(base/2).toFixed(2).replace('.', ',')})`;
  } else if (product.type === 'scatolaGioielli') {
    const { misuraIdx, coloreIdx, qty } = formula || {};
    const mIdx = Math.min(Math.max(Number.isInteger(misuraIdx) ? misuraIdx : 0, 0), product.misuraRate.length - 1);
    const cIdx = Math.min(Math.max(Number.isInteger(coloreIdx) ? coloreIdx : 0, 0), product.coloreChoices.length - 1);
    const q = Math.max(1, parseInt(qty, 10) || 1);
    const rate = product.misuraRate[mIdx];
    const total = Math.round((q * rate * 2 + q * 3 + 8) * 100) / 100;
    unitAmountCents = Math.round(total * 100);
    description = `${product.nome} — ${product.misuraChoices[mIdx]}, ${product.coloreChoices[cIdx]}, ${q}pz`;
  } else if (product.type === 'skylineFormato') {
    const { formato } = formula || {};
    const total = formato === '100 x 50 cm' ? 52 : 25;
    unitAmountCents = Math.round(total * 100);
    description = `${product.nome} — ${formato || '50 x 25 cm'}`;
  } else if (product.type === 'badgeEn') {
    const { qty, holder, formato, larghezza, altezza, stampa, carta, plastificazione, cordino, colore_cordino, creazione_file } = formula || {};
    const q = Math.max(35, parseInt(qty, 10) || 35);
    const stampaRate = { '1 side full color':0.4, '2 sides full color':0.7, '1 side B/W':0.07, '2 sides B/W':0.14, '1 side color + 1 side B/W':0.47 }[stampa] || 0.4;
    const excelRate = creazione_file === 'Yes, create the file for me' ? 0.5 : 0;
    let total, desc;
    if (holder === 'Without' || formato === 'Custom size (without badge holder)') {
      const w = dim1(larghezza) || 5, h = dim1(altezza) || 8;
      const vol = { '80 gsm':0.10, '100 gsm':0.13, '200 gsm':0.25, '300 gsm':0.37, '350 gsm':0.43, '400 gsm':0.49 }[carta] || 0.68;
      const plastRate = plastificazione === 'Yes' ? 0.2 : 0;
      const lanyardRate = cordino === 'Yes' ? 0.21 : 0;
      total = 2*((vol+stampaRate)*q*(w*10+20)*(h*10+20)/440/320 + 10) + plastRate*3*q*(w*10+20)*(h*10+20)/440/320 + q*excelRate + q*lanyardRate;
      desc = `${product.nome} — without holder, ${w}×${h}cm, ${q}pcs${cordino === 'Yes' ? `, lanyard ${colore_cordino || '01 White'}` : ''}`;
    } else {
      const dims = { '8.5×5.5 cm Landscape':[85,55,0.85], '8.5×5.5 cm Portrait':[55,85,0.85], '10×15 cm Portrait':[100,150,1.36], '7.5×10 cm Portrait':[75,100,1.10] };
      const [w,h,holderRate] = dims[formato] || [85,55,0.85]; // mm + costo porta badge (Amazon ×2)
      const lanyardRate = cordino === 'Yes' ? 0.21 : 0;
      total = 2*((0.37+stampaRate)*q*(w+20)*(h+20)/440/320 + 10) + q*holderRate*(1.25 - 0.25*Math.min(1, Math.max(0, (q-100)/100))) + q*lanyardRate + q*excelRate;
      desc = `${product.nome} — ${formato || 'with badge holder'}, ${q}pcs${cordino === 'Yes' ? `, lanyard ${colore_cordino || '01 White'}` : ''}`;
    }
    unitAmountCents = Math.round(total * 100);
    description = desc;
  } else if (product.type === 'badge') {
    const { qty, holder, formato, larghezza, altezza, stampa, carta, plastificazione, cordino, colore_cordino, creazione_file } = formula || {};
    const q = Math.max(35, parseInt(qty, 10) || 35);
    const stampaRate = { '1 lato a colori':0.4, '2 lati a colori':0.7, '1 lato bianco nero':0.07, '2 lati bianco nero':0.14, '1 lato a colori + 1 lato bianco nero':0.47 }[stampa] || 0.4;
    const excelRate = creazione_file === 'Si, create voi il file da stampa' ? 0.5 : 0;
    let total, desc;
    if (holder === 'Senza' || formato === 'Su misura (senza porta badge)') {
      const w = dim1(larghezza) || 5, h = dim1(altezza) || 8;
      const vol = { 'gr. 80':0.10, 'gr. 100':0.13, 'gr. 200':0.25, 'gr. 300':0.37, 'gr. 350':0.43, 'gr. 400':0.49 }[carta] || 0.68;
      const plastRate = plastificazione === 'Si' ? 0.2 : 0;
      const lanyardRate = cordino === 'Si' ? 0.21 : 0;
      total = 2*((vol+stampaRate)*q*(w*10+20)*(h*10+20)/440/320 + 10) + plastRate*3*q*(w*10+20)*(h*10+20)/440/320 + q*excelRate + q*lanyardRate;
      desc = `${product.nome} — senza porta badge, ${w}×${h}cm, ${q}pz${cordino === 'Si' ? `, cordino ${colore_cordino || '01 Bianco'}` : ''}`;
    } else {
      const dims = { '8,5×5,5 cm Landscape':[85,55,0.85], '8,5×5,5 cm Portrait':[55,85,0.85], '10×15 cm Portrait':[100,150,1.36], '7,5×10 cm Portrait':[75,100,1.10] };
      const [w,h,holderRate] = dims[formato] || [85,55,0.85]; // mm + costo porta badge (Amazon ×2)
      const lanyardRate = cordino === 'Si' ? 0.21 : 0;
      total = 2*((0.37+stampaRate)*q*(w+20)*(h+20)/440/320 + 10) + q*holderRate*(1.25 - 0.25*Math.min(1, Math.max(0, (q-100)/100))) + q*lanyardRate + q*excelRate;
      desc = `${product.nome} — ${formato || 'con porta badge'}, ${q}pz${cordino === 'Si' ? `, cordino ${colore_cordino || '01 Bianco'}` : ''}`;
    }
    unitAmountCents = Math.round(total * 100);
    description = desc;
  } else if (product.type === 'quadroWarhol') {
    const { lato_lungo, lato_corto, pannelli, creazione } = formula || {};
    const ll = dim1(lato_lungo) || 30, lc = dim1(lato_corto) || 21;
    const pannelliIdx = ['1','2','3','4'].indexOf(String(pannelli || '1'));
    const pannelliMult = [1, 1.8, 2.7, 3.6][pannelliIdx === -1 ? 0 : pannelliIdx];
    const creazionePrice = creazione === "No, il file ce l'ho io" ? -2 : 30;
    const total = 1.3 * pannelliMult * ll * lc / 100 + 22 + creazionePrice;
    unitAmountCents = Math.round(total * 100);
    description = `${product.nome} — ${ll}×${lc} cm, ${pannelli || '1'} pannelli, ${creazione || 'creazione file inclusa'}`;
  } else if (product.type === 'fotoQuadro') {
    const { lato_lungo, lato_corto, spessore } = formula || {};
    const ll = dim1(lato_lungo) || 30, lc = dim1(lato_corto) || 21;
    const total = Math.max(1.3 * ll * lc / 100 + 22, product.basePrice ?? 0);
    unitAmountCents = Math.round(total * 100);
    description = `${product.nome} — ${ll}×${lc} cm, ${spessore || ''}`;
  } else if (product.type === 'rilegature') {
    const { qty, pagCol, pagBn, latiIdx, cartaIdx } = formula || {};
    const q = Math.max(1, parseInt(qty, 10) || 1);
    const pc = Math.max(0, parseInt(pagCol, 10) || 0);
    const pb = Math.max(0, parseInt(pagBn, 10) || 0);
    const cIdx = Math.min(Math.max(Number.isInteger(cartaIdx) ? cartaIdx : 0, 0), product.cartaRate.length - 1);
    const lati = latiIdx === 1 ? 2 : 1;
    const ril = q > 10 ? 2 : q > 5 ? 3 : q > 1 ? 4 : 5;
    const colori = pc > 99 ? 0.137 : pc > 49 ? 0.16 : pc > 19 ? 0.2 : 0.27;
    const bn = pb > 99 ? 0.05 : pb > 49 ? 0.07 : pb > 19 ? 0.09 : 0.1;
    const cartaRate = product.cartaRate[cIdx];
    const total = Math.round((q*pc*colori + q*pb*bn + q*pc*cartaRate/lati + q*pb*cartaRate/lati + q*ril) * 100) / 100;
    unitAmountCents = Math.round(total * 100);
    description = `${product.nome} — ${q} rilegature, ${pc} col + ${pb} b/n, ${product.cartaChoices[cIdx]}, ${lati} lato/i`;
  } else if (product.type === 'flat') {
    unitAmountCents = Math.round(product.price * 100);
    description = product.nome;
  } else if (product.type === 'forexPvc' && formula?.custom && product.custom) {
    const cu = product.custom;
    let w = Math.max(cu.minShort, Math.min(cu.maxLong, Math.round(Number(formula.w) || cu.minShort)));
    let h = Math.max(cu.minShort, Math.min(cu.maxLong, Math.round(Number(formula.h) || cu.minShort)));
    if (Math.max(w, h) < cu.minLong) { if (w >= h) w = cu.minLong; else h = cu.minLong; }
    if (Math.min(w, h) > cu.maxShort) { if (w <= h) w = cu.maxShort; else h = cu.maxShort; }
    const consegnaIdx = [0, 1, 2].includes(formula?.consegnaIdx) ? formula.consegnaIdx : 0;
    const qty = Math.max(1, Math.min(cu.maxQty, parseInt(formula?.qty, 10) || 1));
    const sIdx = formula?.spessoreIdx === 1 ? 1 : 0;
    const cost = Math.max(cu.minAreaPerPiece || 0, w * h / 10000) * qty * cu.rates[sIdx][consegnaIdx];
    const total = Math.round((cost * product.markup + cu.shipping + product.handling) * 100) / 100;
    unitAmountCents = Math.round(total * 100);
    description = `${product.nome} — ${cu.label} ${w}×${h} cm, ${cu.spessoreChoices[sIdx]}, ${product.stampaChoices[0]}, ${cu.consegnaChoices[consegnaIdx]}, ${qty}pz`;
  } else if (product.type === 'forexPvc') {
    const spessoreIdx = formula?.spessoreIdx === 1 ? 1 : 0;
    const stampaIdx = 0;
    const consegnaIdx = [0, 1, 2].includes(formula?.consegnaIdx) ? formula.consegnaIdx : 0;
    const fIdx = Math.min(Math.max(Number.isInteger(formula?.formatIdx) ? formula.formatIdx : 0, 0), product.formats.length - 1);
    const tiers = product.fa[spessoreIdx][consegnaIdx][fIdx];
    const qty = Math.max(1, Math.min(tiers.length, parseInt(formula?.qty, 10) || 1));
    const total = Math.round((tiers[qty - 1] * product.markup + product.handling) * 100) / 100;
    unitAmountCents = Math.round(total * 100);
    description = `${product.nome} — ${product.formats[fIdx]}, ${product.spessoreChoices[spessoreIdx]}, ${product.stampaChoices[stampaIdx]}, ${product.consegnaChoices[consegnaIdx]}, ${qty}pz`;
  } else if (product.type === 'businessCardStrategici') {
    const { formatIndex, paperIndex, deliveryIndex } = formula || {};
    const fIdx = Number.isInteger(formatIndex) ? formatIndex : 0;
    const format = product.formats[Math.min(Math.max(fIdx, 0), product.formats.length - 1)];
    const pIdx = Number.isInteger(paperIndex) ? paperIndex : 0;
    const paper = format.papers[Math.min(Math.max(pIdx, 0), format.papers.length - 1)];
    const dIdx = Number.isInteger(deliveryIndex) ? deliveryIndex : 0;
    const delivery = paper.deliveries[Math.min(Math.max(dIdx, 0), paper.deliveries.length - 1)];
    const idx = Number.isInteger(tierIndex) ? tierIndex : 0;
    const i = Math.min(Math.max(idx, 0), delivery.prices.length - 1);
    let priceStrategici = delivery.prices[i];
    const qtyLabelsS = format.qtyLabels || product.qtyLabels;
    let angoliSuffixStrategici = '';
    if (formula && formula.angoliArrotondati && !product.noFinish) { priceStrategici += angoliArrotondatiPrice(qtyLabelsS[i]); angoliSuffixStrategici = ', Angoli arrotondati'; }
    // Motivi: 1° a prezzo pieno, ogni motivo aggiuntivo al 90%. Quantità per ogni motivo.
    const motiviRaw = formula && Number(formula.motivi);
    const motivi = (!product.noPrint && Number.isFinite(motiviRaw)) ? Math.min(Math.max(Math.round(motiviRaw), 1), 10) : 1;
    priceStrategici = priceStrategici * (1 + 0.9 * (motivi - 1));
    if (formula && formula.plastificata && !product.noFinish) { priceStrategici += plastificataPrice(qtyLabelsS[i]) * (1 + 0.9 * (motivi - 1)); }
    if (formula && formula.grafica && !product.noPrint) { priceStrategici += 25 * motivi; }
    unitAmountCents = Math.round(priceStrategici * 100);
    description = `${product.nome} — ${format.label}, ${paper.label}, ${delivery.label}, ${qtyLabelsS[i]} copie${motivi > 1 ? ` × ${motivi} motivi` : ''}${angoliSuffixStrategici}${formula && formula.plastificata && !product.noFinish ? ', Plastificata' : ''}${formula && formula.grafica && !product.noPrint ? ', Creazione grafica' : ''}`;
  } else if (product.type === 'businessCardRilievo') {
    const { formatIndex, paperIndex, colorIndex } = formula || {};
    const fIdx = Number.isInteger(formatIndex) ? formatIndex : 0;
    const format = product.formats[Math.min(Math.max(fIdx, 0), product.formats.length - 1)];
    const pIdx = Number.isInteger(paperIndex) ? paperIndex : 0;
    const paper = format.papers[Math.min(Math.max(pIdx, 0), format.papers.length - 1)];
    const idx = Number.isInteger(tierIndex) ? tierIndex : 0;
    const tier = paper.tiers[Math.min(Math.max(idx, 0), paper.tiers.length - 1)];
    let priceRilievo = tier.price;
    let angoliSuffixRilievo = '';
    if (formula && formula.angoliArrotondati) { priceRilievo += angoliArrotondatiPrice(tier.qty); angoliSuffixRilievo = ', Angoli arrotondati'; }
    const motiviRawR = formula && Number(formula.motivi);
    const motiviR = Number.isFinite(motiviRawR) ? Math.min(Math.max(Math.round(motiviRawR), 1), 10) : 1;
    priceRilievo = priceRilievo * (1 + 0.9 * (motiviR - 1));
    unitAmountCents = Math.round(priceRilievo * 100);
    const cIdx = Number.isInteger(colorIndex) ? colorIndex : 0;
    const colorLabel = product.colorChoices ? `, ${product.colorChoices[Math.min(Math.max(cIdx, 0), product.colorChoices.length - 1)]}` : '';
    description = `${product.nome} — ${format.label}, ${paper.label}${colorLabel}, ${tier.qty} copie${motiviR > 1 ? ` × ${motiviR} motivi` : ''}${angoliSuffixRilievo}`;
  } else if (product.type === 'size') {
    const idx = Number.isInteger(sizeIndex) ? sizeIndex : 0;
    const variant = product.variants[Math.min(Math.max(idx, 0), product.variants.length - 1)];
    unitAmountCents = Math.round(variant.price * 100);
    description = `${product.nome} — ${variant.label}`;
  } else {
    return null;
  }
  return { unitAmountCents, description, ...(evRange ? { evRange } : {}) };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { customer, shipping, sender, shippingFee, shippingZone, designLink, designFiles, designRef } = req.body || {};
    // Carrello: body.items = [{ productId, tierIndex, sizeIndex, formula, deliveryIndex }, …].
    // Compatibilità: senza items si usa il singolo prodotto al primo livello del body.
    const rawItems = Array.isArray(req.body && req.body.items) && req.body.items.length
      ? req.body.items.slice(0, 20)
      : [req.body || {}];
    const priced = [];
    for (const it of rawItems) {
      const product = PRICING[it && it.productId];
      if (!product) { res.status(400).json({ error: 'Prodotto sconosciuto' }); return; }
      const r = priceItem(product, it);
      if (!r) { res.status(400).json({ error: 'Questo prodotto richiede un preventivo, non è acquistabile online' }); return; }
      if (r.error) { res.status(400).json({ error: r.error }); return; }
      priced.push({ productId: String(it.productId), product, formula: it.formula, ...r });
    }
    const unitAmountCents = priced.reduce((a, p) => a + p.unitAmountCents, 0);
    const description = priced.length === 1 ? priced[0].description : `Ordine di ${priced.length} articoli — ${priced.map(p => p.product.nome).join(', ')}`;
    const productIds = priced.map(p => p.productId);
    const productEan = priced.map(p => p.product.ean || '').join(',');

    const origin = req.headers.origin || `https://${req.headers.host}`;

    // Una riga per articolo; EAN e ID viaggiano anche nei metadati (liste separate da virgola, stesso ordine delle righe).
    const lineItems = priced.map(p => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: p.description.slice(0, 1400),
          metadata: { product_id: p.productId, ...(p.product.ean ? { ean: p.product.ean } : {}) },
        },
        unit_amount: p.unitAmountCents,
      },
      quantity: 1,
    }));
    // Spedizione ricalcolata qui, stessa regola di checkout.dc.html: non ci si fida dell'importo
    // inviato dal browser. Prodotti "Prezzi Strategici" = spedizione inclusa (0).
    // Elenco = SU_MISURA_IDS in index.html (include decalcomanie e quadri): tenerli allineati.
    // '5970' Backdrop escluso: trasporto incluso nel prezzo.
    const SHIPPING_IDS = ['197', '5833', '5850', '198', '199', '200', '201', '203', '209', '210', '212', '213', '214', '215', '220', '221', '223', '224', '225', '226', '227', '250', '5849', '211', '216', '218', '284', '5047', '5805', '5851'];
    const ZONE_RATES = { roma_centro: 20, roma_resto: 30, italia: 25, ue: 35 };
    const EU_COUNTRIES = ["Austria","Belgio","Bulgaria","Cipro","Croazia","Danimarca","Estonia","Finlandia","Francia","Germania","Grecia","Irlanda","Lettonia","Lituania","Lussemburgo","Malta","Paesi Bassi","Polonia","Portogallo","Repubblica Ceca","Romania","Slovacchia","Slovenia","Spagna","Svezia","Ungheria"];
    const zone = ZONE_RATES[shippingZone] !== undefined ? shippingZone : 'roma_centro';
    const shipCountry = zone === 'ue' ? String((req.body && req.body.shippingCountry) || '') : 'Italia';
    if (zone === 'ue' && !EU_COUNTRIES.includes(shipCountry)) {
      res.status(400).json({ error: 'Seleziona un paese UE valido per la spedizione (no Italia, Città del Vaticano o paesi extra UE).' });
      return;
    }
    // Struttura per Eventi: date ancora libere (già pagate = bloccate) e non sovrapposte nel carrello.
    const evRanges = priced.filter(p => p.evRange).map(p => p.evRange.join('|'));
    if (evRanges.length) {
      const wanted = daysFromMetadata(evRanges.join(','));
      let booked = [];
      try { booked = await getBooked(); } catch (e) { console.error('Lettura prenotazioni fallita', e); }
      if (wanted.some(d => booked.includes(d)) || new Set(wanted).size !== wanted.length) {
        res.status(400).json({ error: 'Struttura per Eventi: alcune date scelte non sono più disponibili. Rimuovila dal carrello e scegli altre date.' });
        return;
      }
    }
    if (priced.some(p => p.productId === '215') && zone !== 'roma_centro' && zone !== 'roma_resto') {
      res.status(400).json({ error: 'La Struttura per Eventi è disponibile solo a Roma: scegli una zona di consegna di Roma.' });
      return;
    }
    // Carrello: una sola spedizione = la tariffa più alta tra gli articoli.
    const shipFeeFor = (productId, formula) => {
      if (productId === '5970') return zone === 'ue' ? 55 : 0; // Backdrop: trasporto incluso in Italia, UE + € 55.
      if (!SHIPPING_IDS.includes(productId)) return 0;
      if (productId === '197' && zone !== 'italia') {
        // Roll-Up 80/85 × 200 (Speedy Boys) a Roma e UE: 1° a tariffa zona, ogni successivo € 15.
        const rq = Math.max(1, parseInt(formula?.qty, 10) || 1);
        return ZONE_RATES[zone] + 15 * (rq - 1);
      }
      return ZONE_RATES[zone];
    };
    const shipFee = Math.max(0, ...priced.map(p => shipFeeFor(p.productId, p.formula)));
    if (Math.round(shipFee * 100) !== Math.round((Number(shippingFee) || 0) * 100)) {
      console.warn('Spedizione diversa dal browser', { productIds, zone, browser: shippingFee, server: shipFee });
    }
    if (shipFee > 0) {
      const zoneLabels = { roma_centro: 'Roma Sud/EUR/Centro', roma_resto: 'Resto di Roma', italia: 'Italia (+1 giorno)', ue: 'Unione Europea (+2/3 giorni)' };
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: { name: `Spedizione — ${zoneLabels[zone] || zone}${zone === 'ue' ? ' — ' + shipCountry : ''}` },
          unit_amount: Math.round(shipFee * 100),
        },
        quantity: 1,
      });
    }

    // Flatten customer/shipping/sender data (collected on our own checkout page) into
    // Stripe session metadata — read back in stripe-webhook.js to build the FatturaPA
    // invoice and to know where/who the shipment should show as sender.
    const metadata = {};
    metadata.product_id = productIds.join(',').slice(0, 490);
    metadata.product_ean = productEan.slice(0, 490);
    metadata.items_count = String(priced.length);
    metadata.lang = req.body && req.body.lang === 'en' ? 'en' : 'it';
    const c = customer || {};
    metadata.inv_type = c.invType || 'privato';
    metadata.inv_name = c.name || '';
    metadata.inv_email = c.email || '';
    metadata.inv_company = c.company || '';
    metadata.inv_vat = c.vat || '';
    metadata.inv_cf = c.cf || '';
    metadata.inv_pec = c.pec || '';
    metadata.inv_sdi = c.sdi || '';
    metadata.inv_address = c.address || '';
    metadata.inv_city = c.city || '';
    metadata.inv_cap = c.cap || '';
    metadata.inv_country = c.country || 'IT';

    const sh = shipping || {};
    const shipPhoneDigits = String(sh.phone || '').replace(/[^\d]/g, '');
    if (shipPhoneDigits.length < 9 || shipPhoneDigits.length > 13) {
      res.status(400).json({ error: 'Inserisci un numero di cellulare valido per la consegna.' });
      return;
    }
    metadata.ship_phone = String(sh.phone).trim().slice(0, 30);
    if (sh.sameAsBilling) {
      metadata.ship_same = '1';
    } else {
      metadata.ship_same = '0';
      metadata.ship_name = sh.name || '';
      metadata.ship_address = sh.address || '';
      metadata.ship_city = sh.city || '';
      metadata.ship_cap = sh.cap || '';
      metadata.ship_notes = (sh.notes || '').slice(0, 490);
    }

    const sn = sender || {};
    metadata.sender_use = sn.use ? '1' : '0';
    if (sn.use) {
      metadata.sender_company = sn.company || '';
      metadata.sender_phone = sn.phone || '';
      metadata.sender_address = sn.address || '';
      metadata.sender_city = sn.city || '';
      metadata.sender_cap = sn.cap || '';
    }
    metadata.shipping_fee = String(shipFee);
    metadata.shipping_zone = zone;
    metadata.ship_country = shipCountry;
    metadata.design_link = typeof designLink === 'string' ? designLink.slice(0, 490) : '';
    metadata.design_files = Array.isArray(designFiles) ? designFiles.join(', ').slice(0, 490) : '';
    metadata.design_ref = typeof designRef === 'string' ? designRef.slice(0, 40) : '';
    if (evRanges.length) metadata.ev_dates = evRanges.join(',').slice(0, 490);

    // PayPal: stesso importo calcolato sopra; l'ordine nasce qui, il browser riceve solo l'ID.
    if (req.body && req.body.provider === 'paypal') {
      const totalCents = unitAmountCents + Math.round(shipFee * 100);
      const eur = (cents) => (cents / 100).toFixed(2);
      const desc = description.slice(0, 127);
      const token = await paypalToken();
      const r = await fetch(`${paypalApi()}/v2/checkout/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            description: desc,
            custom_id: signAmount(totalCents),
            amount: {
              currency_code: 'EUR', value: eur(totalCents),
              breakdown: { item_total: { currency_code: 'EUR', value: eur(unitAmountCents) }, shipping: { currency_code: 'EUR', value: eur(Math.round(shipFee * 100)) } },
            },
            items: priced.map(p => ({ name: p.description.slice(0, 127), quantity: '1', unit_amount: { currency_code: 'EUR', value: eur(p.unitAmountCents) }, ...(p.product.ean ? { sku: p.product.ean } : {}) })),
          }],
          application_context: { shipping_preference: 'NO_SHIPPING', locale: metadata.lang === 'en' ? 'en-IT' : 'it-IT' },
        }),
      });
      const order = await r.json();
      if (!r.ok || !order.id) {
        console.error('PayPal create order', JSON.stringify(order));
        const det = (order.details && order.details[0] && order.details[0].issue) || order.name || order.error || '';
        res.status(502).json({ error: 'Pagamento PayPal non disponibile, riprova o paga con carta.', detail: [det, order.debug_id].filter(Boolean).join(' · ') });
        return;
      }
      // Dati dell'ordine (cliente, spedizione, mittente…) firmati e legati a questo ordine PayPal:
      // paypal-capture.js li usa per email, DDT e fattura, come fa il webhook Stripe.
      const ticket = signTicket({
        orderId: order.id, totalCents, metadata,
        lines: lineItems.map((li) => ({ description: li.price_data.product_data.name, quantity: 1, amount_total: li.price_data.unit_amount })),
      });
      res.status(200).json({ id: order.id, ticket });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: c.email || undefined,
      line_items: lineItems,
      metadata,
      success_url: `${origin}/grazie.dc.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancelled`,
    });

    res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error(err);
    const m = String((err && err.message) || '');
    res.status(500).json({ error: 'Errore nella creazione del pagamento', detail: /PAYPAL_CLIENT|PayPal token/.test(m) ? m.slice(0, 160) : '' });
  }
};
