// Vercel serverless function — GET /api/test-email
// TEMPORARY diagnostic. Open https://tipografia.online/api/test-email in a browser:
// it reports which env vars are present and what Resend answers, then can be deleted.
// Only ever sends to OWNER_NOTIFICATION_EMAIL, so it can't be abused to spam others.

module.exports = async (req, res) => {
  const to = process.env.OWNER_NOTIFICATION_EMAIL;
  const from = process.env.RESEND_FROM;
  const key = process.env.RESEND_API_KEY;

  const env = {
    RESEND_API_KEY: key ? `presente (${key.slice(0, 4)}…, ${key.length} caratteri)` : 'MANCANTE',
    RESEND_FROM: from || 'MANCANTE',
    OWNER_NOTIFICATION_EMAIL: to || 'MANCANTE',
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ? 'presente' : 'MANCANTE',
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? 'presente' : 'MANCANTE',
  };

  if (!key || !from || !to) {
    res.status(200).json({ esito: 'Variabili mancanti — invio non tentato', env });
    return;
  }

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        from,
        to,
        subject: 'Test invio — Tipografia Online',
        html: '<p>Se leggi questa email, Resend funziona correttamente.</p>',
      }),
    });
    const body = await res_text(r);
    res.status(200).json({
      esito: r.ok ? 'Resend ha accettato l\'invio — controlla la casella' : 'Resend ha RIFIUTATO l\'invio',
      statoHttp: r.status,
      rispostaResend: body,
      env,
    });
  } catch (err) {
    res.status(200).json({ esito: 'Chiamata a Resend fallita', errore: String(err), env });
  }
};

async function res_text(r) {
  const t = await r.text();
  try { return JSON.parse(t); } catch { return t; }
}
