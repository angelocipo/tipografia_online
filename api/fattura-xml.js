// GET  /api/fattura-xml?t=<ticket>  — link nell'email "Nuovo ordine": chiede la data fattura
//      (il numero lo assegna Aruba), controlla il pagamento con carta nello stesso giorno e mostra i dati cliente (modificabili, es. Provincia che il checkout non raccoglie).
// POST /api/fattura-xml               — genera il file FatturaPA XML da caricare su Aruba.
// Il ticket è firmato (HMAC) dal webhook: i dati d'ordine non si possono alterare dal link.
const { readTicket } = require('./_paypal');
const { buildFattura, pad } = require('./_fattura-pa');

const h = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const eur = (c) => '€ ' + (c / 100).toFixed(2).replace('.', ',');
const F = "Barlow,Helvetica,Arial,sans-serif", HF = "'Barlow Condensed','Arial Narrow',Helvetica,Arial,sans-serif";
const inp = `width:100%;box-sizing:border-box;padding:9px 10px;border:1px solid #c9d1d9;border-radius:0;font:400 15px/1.3 ${F};color:#1d1f20;background:#fff;`;
const lab = `display:block;font:600 11px/1 ${F};letter-spacing:.08em;text-transform:uppercase;color:#6b7378;margin:0 0 6px;`;
const btn = `display:inline-block;padding:12px 22px;border:0;border-radius:0;background:#5980a6;color:#fff;font:600 15px/1 ${F};letter-spacing:.04em;text-transform:uppercase;cursor:pointer;text-decoration:none;`;

function page(title, body) {
  return `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>${h(title)}</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600&family=Barlow+Condensed:wght@600&display=swap">
<style>body{margin:0;background:#f2f2f3;color:#1d1f20;font:400 15px/1.5 ${F}}a{color:#3f6489}a:hover{color:#26333f}input:focus-visible,select:focus-visible,button:focus-visible{outline:2px solid #5980a6;outline-offset:2px}button:hover{background:#4a6d90!important}</style></head>
<body><main style="max-width:720px;margin:0 auto;padding:32px 18px 60px;">
<div style="font:600 11px/1 ${F};letter-spacing:.16em;text-transform:uppercase;color:#5980a6;margin-bottom:8px;">Tipografia Online · Fattura elettronica Aruba</div>
${body}</main></body></html>`;
}
const field = (name, label, value, extra = '') => `<div><label style="${lab}" for="${name}">${label}</label><input style="${inp}" id="${name}" name="${name}" value="${h(value)}" ${extra}></div>`;

const fmtD = (iso) => iso ? iso.split('-').reverse().join('/') : '';
// Regola: fattura pagata con carta di credito lo stesso giorno della data fattura.
function payCheck(d, data) {
  const w = [];
  if (d.pay !== 'Stripe') w.push(`Ordine pagato con ${d.pay}, non con carta di credito`);
  if (!d.pd) w.push('Data di pagamento non presente nel link (ordine precedente all\'aggiornamento): verificala su Stripe/PayPal');
  else if (data && d.pd !== data) w.push(`Pagamento del ${fmtD(d.pd)}, diverso dalla data fattura ${fmtD(data)}`);
  return w;
}
function form(t, d, data = '', err = '') {
  const c = d.c || {};
  const today = new Date(); const iso = `${today.getFullYear()}-${pad(today.getMonth() + 1, 2)}-${pad(today.getDate(), 2)}`;
  const rows = d.lines.map((l) => `<tr><td style="padding:8px 0;border-bottom:1px solid #dfe4e9;">${h(l.d)}</td><td style="padding:8px 0 8px 12px;border-bottom:1px solid #dfe4e9;text-align:right;white-space:nowrap;">${eur(l.c)}</td></tr>`).join('');
  return page(`Fattura ordine ${d.ref}`, `
<h1 style="font:600 34px/1.05 ${HF};margin:0 0 6px;">Fattura ordine #${h(d.ref)}</h1>
<p style="margin:0 0 22px;color:#6b7378;">Pagato ${eur(d.totalCents)} con ${d.pay === 'PayPal' ? 'PayPal' : 'carta (Stripe)'}${d.pd ? ' il ' + fmtD(d.pd) : ''}${d.payId ? ' · ' + h(d.payId) : ''}</p>
${err ? `<p style="margin:0 0 18px;padding:10px 12px;border:1px solid #b4443a;color:#8a2f27;">${h(err)}</p>` : ''}
<form method="post" action="/api/fattura-xml" style="display:grid;gap:22px;">
  <input type="hidden" name="t" value="${h(t)}">
  <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;padding:16px;border:1px solid #5980a6;background:#fff;">
    ${field('data', 'Data fattura', data || d.pd || iso, 'type="date" required autofocus')}
    <div style="align-self:end;color:#6b7378;font-size:14px;">Numero fattura: assegnato da Aruba</div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;">
    <div><label style="${lab}" for="type">Tipo cliente</label><select style="${inp}" id="type" name="type"><option value="privato"${c.type !== 'azienda' ? ' selected' : ''}>Privato</option><option value="azienda"${c.type === 'azienda' ? ' selected' : ''}>Azienda</option></select></div>
    ${field('name', 'Nome e cognome', c.name)}
    ${field('email', 'Email (invio fattura) *', c.email, 'type="email" maxlength="60"')}
    ${field('company', 'Ragione sociale', c.company)}
    ${field('vat', 'Partita IVA', c.vat)}
    ${field('cf', 'Codice fiscale', c.cf)}
    ${field('sdi', 'Codice SDI', c.sdi, 'maxlength="7"')}
    ${field('pec', 'PEC', c.pec)}
    ${field('address', 'Indirizzo', c.address)}
    ${field('cap', 'CAP', c.cap)}
    ${field('city', 'Comune', c.city)}
    ${field('province', 'Provincia (2 lettere) *', c.province, 'maxlength="2" placeholder="RM"')}
    ${field('country', 'Paese', c.country || 'IT', 'maxlength="2"')}
  </div>
  <table style="width:100%;border-collapse:collapse;font:400 14px/1.4 ${F};"><tbody>${rows}
    <tr><td style="padding:10px 0;font-weight:600;">Totale IVA inclusa</td><td style="padding:10px 0;text-align:right;font-weight:600;">${eur(d.totalCents)}</td></tr></tbody></table>
  <div><button type="submit" style="${btn}">Genera XML</button></div>
</form>`);
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  const b = req.method === 'POST' ? (typeof req.body === 'string' ? Object.fromEntries(new URLSearchParams(req.body)) : (req.body || {})) : {};
  const t = String(req.method === 'POST' ? b.t : (req.query && req.query.t) || '');
  const d = readTicket(t);
  if (!d || d.k !== 'fattura' || !Array.isArray(d.lines)) {
    res.status(400).setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(page('Link non valido', `<h1 style="font:600 30px/1.1 ${HF};">Link non valido</h1><p>Apri il link "Crea fattura XML" dall'email dell'ordine.</p>`));
    return;
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  if (req.method !== 'POST') { res.status(200).end(form(t, d)); return; }


  const data = String(b.data || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) { res.status(200).end(form(t, d, data, 'Data non valida.')); return; }

  const customer = {};
  for (const k of ['type', 'name', 'email', 'company', 'vat', 'cf', 'sdi', 'pec', 'address', 'cap', 'city', 'province', 'country']) customer[k] = String(b[k] || '').trim();
  const built = buildFattura({ number: '', date: data, ref: d.ref, pay: d.pay, payId: d.payId, totalCents: d.totalCents, customer, lines: d.lines });
  const { xml, filename } = built;
  const warnings = [...payCheck(d, data), ...built.warnings];
  const href = 'data:application/xml;base64,' + Buffer.from(xml, 'utf8').toString('base64');
  res.status(200).end(page(`Fattura ordine ${d.ref}`, `
<h1 style="font:600 34px/1.05 ${HF};margin:0 0 6px;">Fattura ordine #${h(d.ref)} · ${fmtD(data)}</h1>
<p style="margin:0 0 20px;color:#6b7378;">File: ${h(filename)} · totale ${eur(d.totalCents)}</p>
${warnings.length ? `<div style="margin:0 0 20px;padding:12px 14px;border:1px solid #b4443a;background:#fff;"><div style="font:600 12px/1 ${F};letter-spacing:.08em;text-transform:uppercase;color:#8a2f27;margin-bottom:8px;">Da controllare prima di caricare</div><ul style="margin:0;padding-left:18px;">${warnings.map((w) => `<li>${h(w)}</li>`).join('')}</ul></div>` : `<p style="margin:0 0 20px;color:#2f6b3a;">Nessun problema rilevato nei dati.</p>`}
<div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:22px;">
  <a href="${href}" download="${h(filename)}" style="${btn}">Scarica XML</a>
  <a href="javascript:history.back()" style="${btn}background:transparent;color:#3f6489;border:1px solid #5980a6;">Modifica dati</a>
</div>
<p style="margin:0 0 10px;color:#6b7378;">Su Aruba: Fatture emesse → Carica fattura → scegli il file scaricato. Prima dell'invio: lascia che Aruba assegni il numero, controlla l'email del cliente e scegli <b>Inglese</b> come lingua della copia di cortesia PDF.</p>
<pre style="margin:0;padding:14px;border:1px solid #dfe4e9;background:#fff;overflow:auto;font:12px/1.45 ui-monospace,Menlo,monospace;white-space:pre;">${h(xml)}</pre>`));
};
