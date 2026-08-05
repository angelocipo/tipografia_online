// Minimal transactional email sender via Resend (https://resend.com).
// Requires RESEND_API_KEY env var set in Vercel. Sender must be a verified domain/address
// in your Resend account (e.g. ordini@tipografia.online).

// Il mittente deve stare sul dominio verificato in Resend: una RESEND_FROM su gmail.com
// faceva rifiutare ogni invio con 403.
const VERIFIED_DOMAIN = 'tipografia.online';
const FROM = (() => {
  const raw = (process.env.RESEND_FROM || '').trim();
  const addr = (raw.match(/<([^>]+)>/) || [null, raw])[1] || '';
  if (addr.toLowerCase().endsWith('@' + VERIFIED_DOMAIN)) return raw;
  if (raw) console.warn(`RESEND_FROM "${raw}" non è su @${VERIFIED_DOMAIN}: ignorata.`);
  return `Tipografia Online <admin@${VERIFIED_DOMAIN}>`;
})();

async function sendEmail({ to, subject, html }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });
  if (!res.ok) {
    throw new Error(`Resend send failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

module.exports = { sendEmail };
