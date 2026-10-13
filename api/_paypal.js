// Helper PayPal condivisi da create-checkout-session.js e paypal-capture.js.
// Env su Vercel: PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET (Live), opzionale PAYPAL_API_BASE
// (default Live https://api-m.paypal.com; per i test sandbox: https://api-m.sandbox.paypal.com).
const crypto = require('crypto');

const paypalApi = () => process.env.PAYPAL_API_BASE || 'https://api-m.paypal.com';

async function paypalToken() {
  const id = process.env.PAYPAL_CLIENT_ID, secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new Error('PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET mancanti');
  const r = await fetch(`${paypalApi()}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });
  const d = await r.json();
  if (!r.ok || !d.access_token) throw new Error('PayPal token: ' + JSON.stringify(d));
  return d.access_token;
}

// Firma l'importo calcolato dal server: se qualcuno modifica l'ordine prima dell'incasso,
// importo e firma non coincidono più e paypal-capture.js rifiuta di incassare.
const hmac = (s) => crypto.createHmac('sha256', process.env.PAYPAL_CLIENT_SECRET || '').update(s).digest('hex').slice(0, 32);
const signAmount = (cents) => `${cents}.${hmac('EUR:' + cents)}`;
function verifyAmount(customId, value, currency) {
  const [cents, sig] = String(customId || '').split('.');
  if (!cents || !sig || currency !== 'EUR') return false;
  if (Math.round(parseFloat(value) * 100) !== Number(cents)) return false;
  const a = Buffer.from(sig), b = Buffer.from(hmac('EUR:' + cents));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Ticket = dati d'ordine in base64 + firma. Il browser lo restituisce all'incasso ma non può modificarlo.
const fullHmac = (s) => crypto.createHmac('sha256', process.env.PAYPAL_CLIENT_SECRET || '').update(s).digest('hex');
function signTicket(data) {
  const body = Buffer.from(JSON.stringify(data)).toString('base64url');
  return `${body}.${fullHmac('T:' + body)}`;
}
function readTicket(ticket) {
  const [body, sig] = String(ticket || '').split('.');
  if (!body || !sig) return null;
  const a = Buffer.from(sig), b = Buffer.from(fullHmac('T:' + body));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try { return JSON.parse(Buffer.from(body, 'base64url').toString('utf8')); } catch (e) { return null; }
}

module.exports = { paypalApi, paypalToken, signAmount, verifyAmount, signTicket, readTicket };
