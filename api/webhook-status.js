// Vercel serverless function — GET /api/webhook-status
// TEMPORARY diagnostic. After a test order, open https://tipografia.online/api/webhook-status
// to see whether Stripe's webhook actually reached this app and what happened.
// Delete together with api/test-email.js once the flow works.
//
// Caveat: the record lives in memory, so a cold start clears it. Check within a minute
// of the test order — "nessuna chiamata registrata" can also mean the function restarted.

const webhook = require('./stripe-webhook');

module.exports = async (req, res) => {
  const last = webhook.lastCall || {};
  if (!last.at) {
    res.status(200).json({
      esito: 'Nessuna chiamata registrata',
      significato: 'Stripe non ha raggiunto /api/stripe-webhook, oppure la function è stata riavviata dopo la chiamata. Se hai appena fatto un ordine, l\'endpoint webhook su Stripe non è configurato o non ascolta checkout.session.completed.',
    });
    return;
  }
  res.status(200).json({
    ultimaChiamata: last.at,
    esito: last.esito,
    tipoEvento: last.eventType,
    dettaglio: last.dettaglio || 'nessun errore registrato',
  });
};
