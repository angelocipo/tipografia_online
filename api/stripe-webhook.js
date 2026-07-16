// Vercel serverless function — POST /api/stripe-webhook
// Configure this URL in the Stripe Dashboard (Developers → Webhooks) listening for
// checkout.session.completed. On a successful payment, generates and submits the
// FatturaPA invoice to Aruba automatically.
//
// Needs the raw request body for signature verification — see vercel.json config note below.

const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const { createInvoiceForOrder } = require('./create-invoice');

module.exports.config = { api: { bodyParser: false } };

function buffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

// Sequential invoice numbering. Swap for a persistent counter (KV/DB) before going live —
// this in-memory counter resets on every cold start.
let invoiceCounter = 0;
function nextInvoiceNumber() {
  invoiceCounter += 1;
  return String(invoiceCounter).padStart(5, '0');
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  let event;
  try {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed', err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const total = session.amount_total / 100;
      const order = {
        number: nextInvoiceNumber(),
        date: new Date(),
        total,
        customer: {
          name: session.customer_details?.name || 'Cliente',
          isCompany: false,
          address: session.customer_details?.address?.line1 || '',
          cap: session.customer_details?.address?.postal_code || '',
          city: session.customer_details?.address?.city || '',
          province: '',
          country: session.customer_details?.address?.country || 'IT',
          sdiCode: '0000000', // "consumatore finale" — no SDI code, invoice made available via portal
        },
        lines: lineItems.data.map((li) => ({
          description: li.description,
          quantity: li.quantity,
          unitPrice: li.amount_total / 100 / li.quantity,
          vatRate: 22, // adjust if any product carries a different aliquota
        })),
      };
      await createInvoiceForOrder(order);
    } catch (err) {
      // Don't fail the webhook response for Stripe's sake — log and handle/retry invoicing separately.
      console.error('Invoice creation failed for session', session.id, err);
    }
  }

  res.status(200).json({ received: true });
};
