// Vercel serverless function — POST /api/send-design-files
//
// Receives the artwork the customer attached at checkout and emails it straight to the shop
// as real attachments. There is NO file storage anywhere: the browser reads each file, the
// bytes travel through this function once, Resend delivers them, and nothing is kept.
//
// HARD LIMIT — Vercel caps a serverless request body at 4.5 MB, and base64 inflates bytes by
// ~33%. That puts the real ceiling at roughly 3 MB of files per order. checkout.dc.html
// enforces 3 MB client-side so the customer gets a clear message instead of a failed request.
// For anything larger the customer pastes a WeTransfer/Drive link instead.
//
// Body: { ref, customerName, customerEmail, link, files: [{ name, type, b64 }] }

const OWNER_EMAIL = process.env.OWNER_NOTIFICATION_EMAIL || 'info@tipografia.online';
const RESEND_FROM = process.env.RESEND_FROM || 'Tipografia Online <ordini@tipografia.online>';

const MAX_TOTAL_BYTES = 3 * 1024 * 1024;
const MAX_FILES = 10;

const INK = '#1d1f20';
const STEEL = '#5980a6';
const RULE = '#dfe4e9';
const MUTED = '#6b7378';
const BODY_FONT = 'Barlow,Helvetica,Arial,sans-serif';

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const { ref, customerName, customerEmail, link, files } = req.body || {};
    const list = Array.isArray(files) ? files.slice(0, MAX_FILES) : [];
    if (!list.length && !link) {
      res.status(400).json({ error: 'Nessun file e nessun link.' });
      return;
    }

    let totalBytes = 0;
    const attachments = [];
    for (const f of list) {
      const b64 = String(f && f.b64 || '');
      if (!b64) continue;
      totalBytes += Math.floor(b64.length * 3 / 4);
      attachments.push({ filename: String(f.name || 'allegato').slice(0, 120), content: b64 });
    }
    if (totalBytes > MAX_TOTAL_BYTES) {
      res.status(413).json({ error: 'I file superano i 3 MB complessivi. Usa il campo link (WeTransfer, Drive, Dropbox).' });
      return;
    }

    const rows = [
      ['Ordine', `#${esc(ref || '—')}`],
      ['Cliente', esc(customerName || '—')],
      ['Email', esc(customerEmail || '—')],
      ['File allegati', attachments.length ? attachments.map((a) => esc(a.filename)).join('<br>') : '—'],
      ['Link', link ? `<a href="${esc(link)}" style="color:${STEEL};">${esc(link)}</a>` : '—'],
    ];

    const html = `<!DOCTYPE html><html lang="it"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:32px 16px;background:#f2f2f3;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;margin:0 auto;background:#ffffff;border:1px solid ${RULE};">
  <tr><td style="padding:22px 32px 6px;">
    <div style="font:600 11px/1 ${BODY_FONT};letter-spacing:.16em;text-transform:uppercase;color:${STEEL};">Materiale da stampare</div>
    <div style="font:600 24px/1.2 'Barlow Condensed','Arial Narrow',Helvetica,Arial,sans-serif;color:${INK};padding-top:6px;">Ordine #${esc(ref || '—')}</div>
  </td></tr>
  <tr><td style="padding:8px 32px 26px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
      ${rows.map(([k, v]) => `<tr>
        <td style="padding:7px 0;border-bottom:1px solid ${RULE};font:600 12px/1.4 ${BODY_FONT};letter-spacing:.06em;text-transform:uppercase;color:${MUTED};width:150px;vertical-align:top;">${k}</td>
        <td style="padding:7px 0;border-bottom:1px solid ${RULE};font:400 14px/1.5 ${BODY_FONT};color:${INK};">${v}</td>
      </tr>`).join('')}
    </table>
  </td></tr>
</table>
</body></html>`;

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: OWNER_EMAIL,
        reply_to: customerEmail || undefined,
        subject: `File da stampare — ordine #${ref || '?'}${attachments.length ? ` (${attachments.length} allegat${attachments.length === 1 ? 'o' : 'i'})` : ''}`,
        html,
        attachments: attachments.length ? attachments : undefined,
      }),
    });
    const text = await r.text();
    if (!r.ok) {
      console.error('Design files send failed', r.status, text);
      res.status(502).json({ error: 'Invio file non riuscito.' });
      return;
    }
    console.log('Design files sent for order', ref, '—', attachments.length, 'file(s), link:', link || 'none');
    res.status(200).json({ ok: true, count: attachments.length });
  } catch (err) {
    console.error('send-design-files error', err);
    res.status(500).json({ error: 'Errore nell\'invio dei file.' });
  }
};
