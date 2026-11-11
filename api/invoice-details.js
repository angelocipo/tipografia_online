// Vercel serverless function — POST /api/invoice-details
// Passo 2 del checkout: dopo il pagamento il cliente inserisce i dati di fatturazione nella pagina "grazie".
// Body: { session_id } (Stripe) oppure { paypal: { orderID, ticket } }, più { customer: { type, name, email, … } }.
// Verifica che l'ordine sia pagato, poi manda al titolare l'email «Dati fattura ordine #REF» con l'XML FatturaPA
// (senza numero, lo assegna Aruba) e il link per correggerlo. Nessun dato viene salvato sul server.
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const { paypalApi, paypalToken, readTicket, signTicket } = require('./_paypal');

const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const clip = (v, n = 120) => String(v || '').trim().slice(0, n);

function checkCustomer(c) {
  if (!c.name) return 'Inserisci nome e cognome.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) return 'Inserisci un indirizzo email valido.';
  if (!c.address || !c.cap || !c.city) return 'Inserisci un indirizzo di fatturazione completo.';
  if (c.type === 'privato' && !c.cf) return 'Inserisci il Codice Fiscale.';
  if (c.type === 'azienda' && (!c.company || !c.vat)) return 'Inserisci Ragione Sociale e Partita IVA.';
  if (c.type === 'azienda' && !c.pec && !c.sdi) return 'Inserisci PEC o Codice SDI.';
  return null;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  try {
    const b = req.body || {};
    const raw = b.customer || {};
    const type = ['privato', 'azienda', 'estero'].includes(raw.type) ? raw.type : 'privato';
    const c = { type };
    for (const k of ['name', 'email', 'company', 'vat', 'cf', 'sdi', 'pec', 'address', 'cap', 'city', 'country']) c[k] = clip(raw[k]);
    c.sdi = c.sdi.toUpperCase().slice(0, 7);
    c.cf = c.cf.toUpperCase();
    if (type !== 'estero') c.country = 'IT';
    const bad = checkCustomer(c);
    if (bad) { res.status(400).json({ error: bad }); return; }

    // Ordine pagato: sessione Stripe o ordine PayPal (ticket firmato da create-checkout-session.js).
    let session, lines;
    const sid = String(b.session_id || '');
    if (sid) {
      if (!/^cs_[A-Za-z0-9_]+$/.test(sid)) { res.status(400).json({ error: 'Ordine non valido' }); return; }
      let s;
      try { s = await stripe.checkout.sessions.retrieve(sid); }
      catch (e) { res.status(404).json({ error: 'Ordine non trovato. Scrivici a info@tipografia.online con il riferimento dell\'ordine.' }); return; }
      if (s.payment_status !== 'paid') { res.status(404).json({ error: 'Ordine non pagato' }); return; }
      lines = (await stripe.checkout.sessions.listLineItems(sid, { limit: 100 })).data;
      session = { id: s.id, created: s.created, amount_total: s.amount_total, customer_details: s.customer_details, customer_email: s.customer_email, metadata: { ...(s.metadata || {}) } };
    } else if (b.paypal && b.paypal.orderID) {
      const orderID = String(b.paypal.orderID);
      const t = readTicket(b.paypal.ticket);
      if (!/^[A-Z0-9]{10,40}$/.test(orderID) || !t || t.orderId !== orderID) { res.status(400).json({ error: 'Ordine non valido' }); return; }
      const token = await paypalToken();
      const g = await fetch(`${paypalApi()}/v2/checkout/orders/${orderID}`, { headers: { Authorization: `Bearer ${token}` } });
      const o = await g.json().catch(() => ({}));
      if (!g.ok || o.status !== 'COMPLETED') { res.status(404).json({ error: 'Ordine non pagato' }); return; }
      lines = t.lines || [];
      session = { id: orderID, created: Math.floor(Date.now() / 1000), amount_total: t.totalCents, metadata: { ...(t.metadata || {}), payment_method: 'PayPal', paypal_order: orderID } };
    } else {
      res.status(400).json({ error: 'Ordine non trovato' }); return;
    }

    const md = session.metadata;
    Object.assign(md, { inv_type: type, inv_name: c.name, inv_email: c.email, inv_company: c.company, inv_vat: c.vat, inv_cf: c.cf,
      inv_pec: c.pec, inv_sdi: c.sdi, inv_address: c.address, inv_cap: c.cap, inv_city: c.city, inv_country: c.country || 'IT', inv_later: '0' });

    const { buildFatturaData, sendEmail, OWNER_EMAIL } = require('./stripe-webhook');
    const fd = buildFatturaData(session, lines);
    const link = 'https://tipografia.online/api/fattura-xml?t=' + signTicket(fd);
    let attachments = [], warnings = [];
    try {
      const { buildFattura } = require('./_fattura-pa');
      const f = buildFattura({ number: '', date: fd.pd, ref: fd.ref, pay: fd.pay, payId: fd.payId, totalCents: fd.totalCents, customer: fd.c, lines: fd.lines });
      attachments = [{ filename: f.filename, content: Buffer.from(f.xml, 'utf8').toString('base64') }];
      warnings = f.warnings || [];
      if (fd.dep) warnings.unshift(`Caparra € ${(fd.dep / 100).toFixed(2).replace('.', ',')} incassata ma esclusa dalla fattura (da restituire dopo ispezione)`);
      if (fd.pay !== 'Stripe') warnings.unshift(`Ordine pagato con ${fd.pay}, non con carta di credito`);
    } catch (e) { console.error('invoice-details: XML non generato', fd.ref, e); }

    const rows = [
      ['Ordine', '#' + fd.ref + ' · € ' + (session.amount_total / 100).toFixed(2).replace('.', ',') + ' · ' + (fd.pay === 'PayPal' ? 'PayPal' : 'Carta (Stripe)')],
      ['Tipo', type === 'azienda' ? 'Azienda' : type === 'estero' ? 'Estero' : 'Privato'],
      ['Nome', c.name], ['Email', c.email], ['Ragione sociale', c.company], ['P. IVA', c.vat], ['Codice fiscale', c.cf],
      ['SDI', c.sdi], ['PEC', c.pec], ['Indirizzo', [c.address, c.cap, c.city, c.country].filter(Boolean).join(', ')],
    ].filter(([, v]) => v);
    const html = `<!doctype html><html><body style="margin:0;background:#f2f2f3;font:400 15px/1.5 Helvetica,Arial,sans-serif;color:#1d1f20;">
<div style="max-width:600px;margin:0 auto;padding:24px 16px;"><div style="background:#fff;border:1px solid #dfe4e9;padding:24px 28px;">
<div style="font:600 11px/1 Helvetica,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#5980a6;">Passo 2 · Dati fattura dal cliente</div>
<h1 style="font-size:24px;margin:10px 0 16px;">Dati fattura ordine #${esc(fd.ref)}</h1>
<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${rows.map(([k, v]) => `<tr><td style="padding:7px 0;border-bottom:1px solid #dfe4e9;font:600 12px/1.4 Helvetica,Arial,sans-serif;text-transform:uppercase;letter-spacing:.06em;color:#6b7378;width:150px;">${k}</td><td style="padding:7px 0;border-bottom:1px solid #dfe4e9;">${esc(v)}</td></tr>`).join('')}</table>
${warnings.length ? `<p style="margin:16px 0 0;color:#8a2f27;">Da controllare prima di caricare su Aruba:<br>${warnings.map((w) => '• ' + esc(w)).join('<br>')}</p>` : ''}
<p style="margin:16px 0 0;">${attachments.length ? 'XML FatturaPA allegato (senza numero, lingua copia cortesia: Inglese).<br>' : ''}<a href="${link}" style="color:#5980a6;font-weight:600;">Correggi dati e rigenera XML</a></p>
</div></div></body></html>`;
    await sendEmail({ to: OWNER_EMAIL, subject: `Dati fattura ordine #${fd.ref} — ${c.company || c.name}`, html, attachments });
    res.status(200).json({ ok: true, ref: fd.ref });
  } catch (err) {
    console.error('invoice-details', err);
    res.status(500).json({ error: 'Invio non riuscito, riprova o scrivici a info@tipografia.online.' });
  }
};
