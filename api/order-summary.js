// Vercel serverless function — GET /api/order-summary?session_id=cs_...
// Riepilogo per la pagina "grazie": legge da Stripe ciò che è stato davvero addebitato.
// Risponde solo per sessioni pagate; il session_id è lungo e non indovinabile.

const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }
  const id = String((req.query && req.query.session_id) || '');
  if (!/^cs_[A-Za-z0-9_]+$/.test(id)) { res.status(400).json({ error: 'session_id non valido' }); return; }
  try {
    const s = await stripe.checkout.sessions.retrieve(id, { expand: ['line_items'] });
    if (s.payment_status !== 'paid') { res.status(404).json({ error: 'Ordine non pagato' }); return; }
    const m = s.metadata || {};
    const items = ((s.line_items && s.line_items.data) || []).map(li => ({
      name: li.description || '', amount: (li.amount_total || 0) / 100,
    }));
    const shippingFee = Number(m.shipping_fee) || 0;
    const ship = m.ship_same === '0'
      ? [m.ship_name, m.ship_address, [m.ship_cap, m.ship_city].filter(Boolean).join(' ')].filter(Boolean).join(', ')
      : [m.inv_address, [m.inv_cap, m.inv_city].filter(Boolean).join(' ')].filter(Boolean).join(', ');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({
      items,
      shippingFee,
      total: (s.amount_total || 0) / 100,
      email: m.inv_email || (s.customer_details && s.customer_details.email) || '',
      billingName: m.inv_company || m.inv_name || '',
      shipTo: ship,
      designFiles: m.design_files || '',
      sender: m.sender_use === '1' ? { company: m.sender_company || '', address: m.sender_address || '', cap: m.sender_cap || '', city: m.sender_city || '', phone: m.sender_phone || '' } : null,
    });
  } catch (e) {
    res.status(500).json({ error: 'Riepilogo non disponibile' });
  }
};
