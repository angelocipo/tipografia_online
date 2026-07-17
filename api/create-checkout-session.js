// Vercel serverless function — POST /api/create-checkout-session
// Body: { productId: string, tierIndex?: number, sizeIndex?: number, formula?: {...} }
// Computes the price SERVER-SIDE from _pricing-data.js (never trusts a client-sent amount),
// creates a Stripe Checkout Session, and returns { url } to redirect the browser to.

const Stripe = require('stripe');
const { PRICING } = require('./_pricing-data');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { productId, tierIndex, sizeIndex, formula, deliveryIndex, customer, shipping, sender } = req.body || {};
    const product = PRICING[productId];
    if (!product) {
      res.status(400).json({ error: 'Prodotto sconosciuto' });
      return;
    }

    let unitAmountCents, description;
    if (product.type === 'formula') {
      const qty = Math.max(1, parseInt(formula?.qty, 10) || 1);
      const strutturaIdx = formula?.strutturaIdx === 1 ? 1 : 0;
      const rush = formula?.tempi === '24H' ? product.rate24h : 0;
      const total = qty * (product.rollupRate(qty) + product.strutturaRates[strutturaIdx] + rush);
      unitAmountCents = Math.round(total * 100);
      description = `${product.nome} — ${qty}pz, ${formula?.tempi === '24H' ? '24H' : '72H'}, ${strutturaIdx === 0 ? 'con struttura' : 'solo stampa'}`;
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
      const total = Math.round(rate * qty * 1.22 * 1.3);
      unitAmountCents = total * 100;
      const formats = ['200×100 cm', '300×100 cm', '400×100 cm'];
      const consegnaLabel = consegnaIdx === 1 ? '2 gg Lavorativi' : '1 Settimana';
      const occhielliLabel = consegnaIdx === 0 ? (occhielliIdx === 1 ? 'Con occhielli' : 'Senza occhielli') : '';
      description = `${product.nome} — ${formats[idx]}, ${consegnaLabel}${occhielliLabel ? ', ' + occhielliLabel : ''}, ${qty}pz`;
    } else if (product.type === 'bv24h') {
      const { larghezza, altezza, qty, latiIdx, cartaIdx, soggettiIdx } = formula || {};
      const l = Math.max(product.larghezza.min, Math.min(product.larghezza.max, parseInt(larghezza, 10) || product.larghezza.default));
      const a = Math.max(product.altezza.min, Math.min(product.altezza.max, parseInt(altezza, 10) || product.altezza.default));
      const q = Math.max(product.qty.min, Math.min(product.qty.max, parseInt(qty, 10) || product.qty.default));
      const latI = latiIdx === 1 ? 1 : 0;
      const cartaI = Math.min(Math.max(Number.isInteger(cartaIdx) ? cartaIdx : 0, 0), product.cartaMultiplier.length - 1);
      const sogI = Math.min(Math.max(Number.isInteger(soggettiIdx) ? soggettiIdx : 0, 0), product.soggettiMultiplier.length - 1);
      const bv = product.cartaMultiplier[cartaI];
      const soggetti = product.soggettiMultiplier[sogI];
      const lati = product.latiMultiplier[latI];
      const total = Math.round(20 + bv * soggetti * lati * q * (l+20)*(a+40)/440/320);
      unitAmountCents = total * 100;
      description = `${product.nome} — ${l}×${a} mm, gr.${product.cartaChoices[cartaI]}, ${product.latiChoices[latI]}, ${product.soggettiChoices[sogI]} soggetti, ${q}pz`;
    } else if (product.type === 'adesiviPrespaziati') {
      const { base, altezza, copie, lavorazioneIdx, coloreIdx, materialeIdx, altroColore } = formula || {};
      const b = Math.max(product.base.min, Math.min(product.base.max, parseInt(base, 10) || product.base.default));
      const a = Math.max(product.altezza.min, Math.min(product.altezza.max, parseInt(altezza, 10) || product.altezza.default));
      const c = Math.max(product.copie.min, parseInt(copie, 10) || product.copie.default);
      const lIdx = Math.min(Math.max(Number.isInteger(lavorazioneIdx) ? lavorazioneIdx : 0, 0), product.lavorazioni.length - 1);
      const mIdx = materialeIdx === 1 ? 1 : 0;
      const colOptions = product.coloreByMateriale[mIdx];
      const cIdx = Math.min(Math.max(Number.isInteger(coloreIdx) ? coloreIdx : 0, 0), colOptions.length - 1);
      const colore = colOptions[cIdx] === 'Altro' ? (altroColore || 'Altro') : colOptions[cIdx];
      const mult = product.lavorazioni[lIdx].mult;
      const total = Math.round(15 + mult * 5.5 * 1.22 * 5 * ((b+2.5)*(a+2.5)/6200) * c);
      unitAmountCents = total * 100;
      description = `${product.nome} — ${b}×${a} cm, ${colore}, ${product.lavorazioni[lIdx].label}, ${c}pz`;
    } else if (product.type === 'adesivoInterno') {
      const { larghezza, altezza, qty, sagomaIdx } = formula || {};
      const l = Math.max(product.larghezza.min, Math.min(product.larghezza.max, parseInt(larghezza, 10) || product.larghezza.default));
      const a = Math.max(product.altezza.min, Math.min(product.altezza.max, parseInt(altezza, 10) || product.altezza.default));
      const q = Math.max(product.qty.min, Math.min(product.qty.max, parseInt(qty, 10) || product.qty.default));
      const sIdx = sagomaIdx === 1 ? 1 : 0;
      const mult = product.sagomaMultiplier[sIdx];
      const total = Math.round(10 + mult * ((l+2)*(a+2)/44/32) * q * 1.22 * 2);
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
    const total = Math.round(product.formatRates[fIdx] * q * product.cartaMultiplier[cIdx] * 100) / 100;
    unitAmountCents = Math.round(total * 100);
    description = `${product.nome} — ${product.formatChoices[fIdx]}, ${product.cartaChoices[cIdx]}, ${q}pz`;
    } else if (product.type === 'flat') {
      unitAmountCents = Math.round(product.price * 100);
      description = product.nome;
    } else if (product.type === 'forexPvc') {
      const qty = Math.max(1, Math.min(100, parseInt(formula?.qty, 10) || 1));
      const spessoreIdx = formula?.spessoreIdx === 1 ? 1 : 0;
      const stampaIdx = formula?.stampaIdx === 1 ? 1 : 0;
      const consegnaIdx = formula?.consegnaIdx === 1 ? 1 : 0;
      const fIdx = Number.isInteger(formula?.formatIdx) ? formula.formatIdx : 0;
      const baseRate = product.rates[spessoreIdx][stampaIdx][consegnaIdx][Math.min(Math.max(fIdx, 0), product.formats.length - 1)];
      const multiplier = qty > 1 ? 0.8 : 1;
      const total = Math.round(baseRate * multiplier * qty);
      unitAmountCents = total * 100;
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
      unitAmountCents = Math.round(delivery.prices[i] * 100);
      description = `${product.nome} — ${format.label}, ${paper.label}, ${delivery.label}, ${product.qtyLabels[i]} copie`;
    } else if (product.type === 'businessCardRilievo') {
      const { formatIndex, paperIndex } = formula || {};
      const fIdx = Number.isInteger(formatIndex) ? formatIndex : 0;
      const format = product.formats[Math.min(Math.max(fIdx, 0), product.formats.length - 1)];
      const pIdx = Number.isInteger(paperIndex) ? paperIndex : 0;
      const paper = format.papers[Math.min(Math.max(pIdx, 0), format.papers.length - 1)];
      const idx = Number.isInteger(tierIndex) ? tierIndex : 0;
      const tier = paper.tiers[Math.min(Math.max(idx, 0), paper.tiers.length - 1)];
      unitAmountCents = Math.round(tier.price * 100);
      description = `${product.nome} — ${format.label}, ${paper.label}, ${tier.qty} copie`;
    } else if (product.type === 'size') {
      const idx = Number.isInteger(sizeIndex) ? sizeIndex : 0;
      const variant = product.variants[Math.min(Math.max(idx, 0), product.variants.length - 1)];
      unitAmountCents = Math.round(variant.price * 100);
      description = `${product.nome} — ${variant.label}`;
    } else {
      res.status(400).json({ error: 'Questo prodotto richiede un preventivo, non è acquistabile online' });
      return;
    }

    const origin = req.headers.origin || `https://${req.headers.host}`;

    // Flatten customer/shipping/sender data (collected on our own checkout page) into
    // Stripe session metadata — read back in stripe-webhook.js to build the FatturaPA
    // invoice and to know where/who the shipment should show as sender.
    const metadata = {};
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
    if (sh.sameAsBilling) {
      metadata.ship_same = '1';
    } else {
      metadata.ship_same = '0';
      metadata.ship_name = sh.name || '';
      metadata.ship_phone = sh.phone || '';
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

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: c.email || undefined,
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: description },
          unit_amount: unitAmountCents,
        },
        quantity: 1,
      }],
      metadata,
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancelled`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nella creazione del pagamento' });
  }
};
