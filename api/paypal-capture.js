// Vercel serverless function — POST /api/paypal-capture  Body: { orderID }
// Controlla che l'ordine PayPal abbia ancora l'importo firmato dal server, poi lo incassa.
const { paypalApi, paypalToken, verifyAmount, readTicket } = require('./_paypal');

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  try {
    const orderID = String((req.body || {}).orderID || '');
    if (!/^[A-Z0-9]{10,40}$/.test(orderID)) { res.status(400).json({ error: 'Ordine PayPal non valido' }); return; }
    const ticket = readTicket((req.body || {}).ticket);
    if (!ticket || ticket.orderId !== orderID) { res.status(400).json({ error: 'Ordine PayPal non valido' }); return; }
    const token = await paypalToken();
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

    const g = await fetch(`${paypalApi()}/v2/checkout/orders/${orderID}`, { headers });
    const order = await g.json();
    const pu = (order.purchase_units || [])[0] || {};
    if (!g.ok || !verifyAmount(pu.custom_id, pu.amount && pu.amount.value, pu.amount && pu.amount.currency_code)) {
      console.error('PayPal: importo non corrispondente, incasso rifiutato', orderID, pu.amount, pu.custom_id);
      res.status(400).json({ error: 'Importo non valido. Pagamento non effettuato.', detail: g.ok ? 'AMOUNT_MISMATCH' : ((order.details && order.details[0] && order.details[0].issue) || order.name || 'ORDER_NOT_FOUND') });
      return;
    }

    const c = await fetch(`${paypalApi()}/v2/checkout/orders/${orderID}/capture`, { method: 'POST', headers });
    const cap = await c.json();
    if (!c.ok || cap.status !== 'COMPLETED') {
      console.error('PayPal capture', JSON.stringify(cap));
      const issue = (cap.details && cap.details[0] && cap.details[0].issue) || cap.name || '';
      res.status(402).json({ error: 'Pagamento PayPal non riuscito, riprova.', issue, detail: [issue, cap.debug_id].filter(Boolean).join(' · ') });
      return;
    }
    // Email, DDT e fattura come per Stripe. Se fallisce, il pagamento resta valido: lo segnaliamo nei log.
    const payer = cap.payer || {};
    const capturedCents = Math.round(parseFloat((((cap.purchase_units || [])[0] || {}).payments?.captures?.[0]?.amount?.value) || ticket.totalCents / 100) * 100);
    try {
      const { processPaidOrder } = require('./stripe-webhook');
      await processPaidOrder({
        id: cap.id,
        metadata: { ...ticket.metadata, payment_method: 'PayPal', paypal_order: cap.id },
        amount_total: capturedCents,
        customer_email: payer.email_address,
        customer_details: { email: payer.email_address, name: [payer.name?.given_name, payer.name?.surname].filter(Boolean).join(' ') },
      }, ticket.lines);
    } catch (err) {
      console.error('PayPal: pagamento incassato ma elaborazione ordine fallita', cap.id, err);
    }
    res.status(200).json({ id: cap.id, status: cap.status });
  } catch (err) {
    console.error(err);
    const m = String((err && err.message) || '');
    res.status(500).json({ error: 'Errore nel pagamento PayPal', detail: /PAYPAL_CLIENT|PayPal token/.test(m) ? m.slice(0, 160) : '' });
  }
};
