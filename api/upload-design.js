// Riceve il materiale da stampare raccolto sulla scheda prodotto e lo inoltra
// per email al titolare come allegato (via Resend).
//
// Limite tecnico: il body di una funzione serverless Vercel non può superare ~4,5 MB.
// I file arrivano in base64 (+33%), quindi il client limita il totale a 2,5 MB reali.
// Per file più grandi il cliente incolla un link (WeTransfer, Drive, Canva…).

// Stesso indirizzo usato dalle notifiche d'ordine in stripe-webhook.js: prima questo file
// leggeva OWNER_EMAIL (variabile che su Vercel non esiste) e ripiegava su
// ordini@tipografia.online, casella diversa da quella dove arrivano gli ordini.
const OWNER_EMAIL = process.env.OWNER_NOTIFICATION_EMAIL || process.env.OWNER_EMAIL || 'info@tipografia.online';
// Il mittente DEVE stare su un dominio verificato in Resend. Su Vercel RESEND_FROM era
// impostata su un indirizzo gmail.com: Resend rifiutava ogni invio con 403. Se la variabile
// non punta a tipografia.online la ignoriamo e usiamo il dominio verificato.
const VERIFIED_DOMAIN = 'tipografia.online';
function safeFrom() {
  const raw = (process.env.RESEND_FROM || '').trim();
  const addr = (raw.match(/<([^>]+)>/) || [null, raw])[1] || '';
  if (addr.toLowerCase().endsWith('@' + VERIFIED_DOMAIN)) return raw;
  if (raw) console.warn(`RESEND_FROM "${raw}" non è su @${VERIFIED_DOMAIN}: ignorata.`);
  return `Tipografia Online <admin@${VERIFIED_DOMAIN}>`;
}
const RESEND_FROM = safeFrom();

const MAX_TOTAL_B64 = 4.2 * 1024 * 1024;

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

module.exports = async (req, res) => {
  // Diagnostica: apri /api/upload-design nel browser per verificare la configurazione.
  // Non espone nessun valore, solo se le variabili esistono.
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      resendKey: !!process.env.RESEND_API_KEY,
      destinatario: OWNER_EMAIL,
      mittente: RESEND_FROM,
      maxMb: +(MAX_TOTAL_B64 / 1024 / 1024).toFixed(1),
    });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY non configurata' });
  }

  try {
    const { files, link, customer, product, note, ref } = req.body || {};
    const list = Array.isArray(files) ? files.filter((f) => f && f.name && f.data) : [];
    const cleanLink = typeof link === 'string' ? link.trim().slice(0, 500) : '';

    if (!list.length && !cleanLink) {
      return res.status(200).json({ ok: true, skipped: true });
    }

    const totalB64 = list.reduce((n, f) => n + String(f.data).length, 0);
    if (totalB64 > MAX_TOTAL_B64) {
      return res.status(413).json({ error: 'File troppo grandi. Usa il campo link.' });
    }

    const c = customer || {};
    const cleanRef = typeof ref === 'string' ? ref.replace(/[^A-Za-z0-9-]/g, '').slice(0, 20) : '';
    const rows = [
      ['Riferimento', cleanRef || '—'],
      ['Prodotto', product || '—'],
      ['Cliente', c.name || '—'],
      ['Email', c.email || '—'],
      ['Telefono', c.phone || '—'],
      ['Azienda', c.company || ''],
      ['File allegati', list.length ? list.map((f) => f.name).join(', ') : 'nessuno'],
      ['Link fornito', cleanLink ? `<a href="${esc(cleanLink)}">${esc(cleanLink)}</a>` : 'nessuno'],
      ['Note', note || ''],
    ].filter(([, v]) => v !== '');

    const html = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;color:#1d1f20;">
      <h2 style="font-size:18px;margin:0 0 4px;">Materiale da stampare ricevuto</h2>
      <p style="font-size:13px;color:#666;margin:0 0 16px;">Inviato dalla scheda prodotto nel momento in cui il cliente ha scelto il file. L'ordine potrebbe non essere ancora stato pagato: cerca su Stripe l'ordine con lo stesso riferimento.</p>
      <table style="border-collapse:collapse;font-size:14px;">
        ${rows.map(([k, v]) => `<tr><td style="padding:4px 14px 4px 0;color:#666;">${esc(k)}</td><td style="padding:4px 0;">${k === 'Link fornito' ? v : esc(v)}</td></tr>`).join('')}
      </table>
    </body></html>`;

    const payload = {
      from: RESEND_FROM,
      to: OWNER_EMAIL,
      subject: `Materiale da stampare${cleanRef ? ' ' + cleanRef : ''} — ${product || 'ordine'}${c.name ? ' — ' + c.name : ''}`,
      html,
    };
    if (list.length) {
      payload.attachments = list.slice(0, 10).map((f) => ({
        filename: String(f.name).slice(0, 120),
        content: String(f.data),
      }));
    }

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
      body: JSON.stringify(payload),
    });
    const text = await r.text();
    if (!r.ok) {
      console.error(`Resend upload-design failed → to=${OWNER_EMAIL} from=${RESEND_FROM} status=${r.status} body=${text}`);
      // Riportiamo il messaggio esatto di Resend: un 403 nudo non dice se il dominio non
      // è verificato, se la chiave è limitata o se il destinatario non è ammesso.
      let detail = '';
      try { const j = JSON.parse(text); detail = j.message || j.error || ''; } catch (e) { detail = text; }
      return res.status(502).json({ error: `Resend ${r.status}: ${String(detail).slice(0, 300)}` });
    }
    console.log(`Materiale inviato a ${OWNER_EMAIL} — rif ${cleanRef || 'nessuno'}, ${list.length} allegato/i`);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('upload-design error', err);
    return res.status(500).json({ error: err.message });
  }
};
