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
    const { productId, tierIndex, sizeIndex, formula } = req.body || {};
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
    } else if (product.type === 'tiers') {
      const idx = Number.isInteger(tierIndex) ? tierIndex : 0;
      const tier = product.tiers[Math.min(Math.max(idx, 0), product.tiers.length - 1)];
      unitAmountCents = Math.round(tier.price * 100);
      description = `${product.nome} — ${tier.qty} copie`;
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

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: description },
          unit_amount: unitAmountCents,
        },
        quantity: 1,
      }],
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancelled`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nella creazione del pagamento' });
  }
};
