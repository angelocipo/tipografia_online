// Documento di trasporto (DDT) in PDF, generato senza dipendenze: PDF 1.4 scritto a mano con i
// font standard Helvetica (WinAnsi), così non serve nessun pacchetto npm in più su Vercel.
// Nessun prezzo nel DDT: con "Dati del mittente" il pacco parte a nome del cliente e il
// documento non deve rivelare importi né il nostro nome.

const SELLER = {
  name: 'Printing Italy — Tipografia Online',
  address: 'Via Lorenzo Bonincontri, 26',
  cap: '00147',
  city: 'Roma (RM)',
  vat: '02452700590',
};

const W = 595.28, H = 841.89, M = 42;
const STEEL = '0.349 0.502 0.651', INK = '0.114 0.122 0.125', MUTED = '0.42 0.45 0.47', RULE = '0.80 0.83 0.86';

// WinAnsi: Latin-1 copre lettere accentate; € e le virgolette tipografiche vanno rimappati.
const WIN = { '€': 0x80, '‘': 0x91, '’': 0x92, '“': 0x93, '”': 0x94, '–': 0x96, '—': 0x97, '•': 0x95, '…': 0x85 };
function enc(s) {
  let out = '';
  for (const ch of String(s == null ? '' : s)) {
    let c = WIN[ch] || ch.charCodeAt(0);
    if (c > 255) c = 0x3f;
    const b = String.fromCharCode(c);
    out += b === '(' || b === ')' || b === '\\' ? '\\' + b : b;
  }
  return out;
}
const tw = (s, size, bold) => String(s || '').length * size * (bold ? 0.56 : 0.52);
function wrap(s, size, max, bold) {
  const words = String(s || '').split(/\s+/).filter(Boolean);
  const lines = []; let cur = '';
  for (const w of words) {
    const t = cur ? cur + ' ' + w : w;
    if (tw(t, size, bold) > max && cur) { lines.push(cur); cur = w; } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [''];
}

function buildDdtPdf(order, md, session) {
  md = md || {};
  const ops = [];
  const text = (x, y, s, size = 10, bold = false, color = INK) =>
    ops.push(`BT ${color} rg /${bold ? 'F2' : 'F1'} ${size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${enc(s)}) Tj ET`);
  const rect = (x, y, w, h, color = RULE, lw = 0.8) => ops.push(`${color} RG ${lw} w ${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re S`);
  const line = (x1, y1, x2, y2, color = RULE, lw = 0.8) => ops.push(`${color} RG ${lw} w ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`);
  const cross = (x, y) => { line(x - 4, y, x + 4, y, STEEL, 0.7); line(x, y - 4, x, y + 4, STEEL, 0.7); };
  const box = (x, y, w, h) => { rect(x, y, w, h); cross(x, y); cross(x + w, y); cross(x, y + h); cross(x + w, y + h); };
  const label = (x, y, s) => text(x, y, s.toUpperCase(), 7, true, STEEL);

  const date = order.date instanceof Date ? order.date : new Date();
  const dateStr = date.toLocaleDateString('it-IT', { timeZone: 'Europe/Rome', day: '2-digit', month: '2-digit', year: 'numeric' });

  const customSender = md.sender_use === '1';

  // Logo in alto a sinistra — omesso con "Dati del mittente": il pacco non deve riportare il nostro marchio.
  let logo = null;
  if (!customSender) {
    try { logo = require('./_ddt-logo'); } catch (e) { console.error('DDT logo missing', e); }
  }
  let y = H - M - 10;
  if (logo) {
    const lh = 40, lw = lh * logo.width / logo.height;
    ops.push(`q ${lw.toFixed(2)} 0 0 ${lh} ${M} ${(H - M - lh).toFixed(2)} cm /Im1 Do Q`);
    y -= 52;
  }
  text(M, y, 'DOCUMENTO DI TRASPORTO', 20, true);
  text(M, y - 15, 'D.d.t. — D.P.R. 472/1996', 8.5, false, MUTED);
  const nx = W - M - 170;
  box(nx, y - 22, 170, 40);
  label(nx + 10, y + 6, 'Numero');
  text(nx + 10, y - 10, order.number, 13, true);
  label(nx + 95, y + 6, 'Data');
  text(nx + 95, y - 10, dateStr, 11, true);

  // Mittente / Destinatario
  const mitt = customSender
    ? [md.sender_company || '—', md.sender_address || '', [md.sender_cap, md.sender_city].filter(Boolean).join(' '), md.sender_phone ? 'Tel. ' + md.sender_phone : '']
    : [SELLER.name, SELLER.address, SELLER.cap + ' ' + SELLER.city, 'P.IVA ' + SELLER.vat];
  const c = order.customer || {};
  const shipOther = md.ship_same === '0';
  const dest = shipOther
    ? [md.ship_name || c.name, md.ship_address || '', [md.ship_cap, md.ship_city].filter(Boolean).join(' '), md.ship_phone ? 'Tel. ' + md.ship_phone : '']
    : [c.name, c.address || '', [c.cap, c.city].filter(Boolean).join(' '), c.vatNumber ? 'P.IVA ' + c.vatNumber : (c.fiscalCode ? 'C.F. ' + c.fiscalCode : '')];
  const colW = (W - 2 * M - 14) / 2;
  y -= 52;
  const bh = 92;
  [[M, customSender ? 'Mittente' : 'Mittente / Cedente', mitt], [M + colW + 14, 'Destinatario e luogo di destinazione', dest]].forEach(([x, lab, rows]) => {
    box(x, y - bh, colW, bh);
    label(x + 10, y - 16, lab);
    rows.filter(Boolean).forEach((r, i) => text(x + 10, y - 34 - i * 14, r, i === 0 ? 11 : 9.5, i === 0));
  });

  // Dati del trasporto
  y -= bh + 14;
  const facts = [
    ['Causale del trasporto', 'Vendita'],
    ['Trasporto a cura di', 'Vettore (corriere)'],
    ['Porto', 'Franco'],
    ['Rif. ordine', '#' + order.number],
  ];
  const fw = (W - 2 * M) / facts.length;
  box(M, y - 40, W - 2 * M, 40);
  facts.forEach(([k, v], i) => {
    const x = M + i * fw;
    if (i) line(x, y - 40, x, y);
    label(x + 10, y - 14, k);
    text(x + 10, y - 30, v, 10, true);
  });

  // Beni trasportati — escluse le righe di spedizione
  y -= 62;
  const goods = (order.lines || []).filter((l, i) => i === 0 || !/spedizion|consegna|shipping/i.test(l.description || ''));
  const cx = { code: M + 10, desc: M + 120, qty: W - M - 60 };
  label(cx.code, y, 'Codice');
  label(cx.desc, y, 'Descrizione dei beni');
  label(cx.qty, y, 'Q.tà');
  y -= 8;
  line(M, y, W - M, y, INK, 1.4);
  goods.forEach((l) => {
    const descLines = wrap(l.description, 9.5, cx.qty - cx.desc - 16);
    const code = [l.ean, l.sku].filter(Boolean);
    const rowH = Math.max(descLines.length, code.length, 1) * 13 + 12;
    descLines.forEach((d, i) => text(cx.desc, y - 16 - i * 13, d, 9.5));
    code.forEach((d, i) => text(cx.code, y - 16 - i * 13, d, 8.5, false, MUTED));
    text(cx.qty, y - 16, String(l.quantity), 10, true);
    y -= rowH;
    line(M, y, W - M, y);
  });

  // Colli / peso / inizio trasporto — da compilare alla partenza
  y -= 18;
  const pack = [['Aspetto esteriore dei beni', 'Scatola'], ['N. colli', ''], ['Peso kg', ''], ['Data e ora inizio trasporto', '']];
  box(M, y - 40, W - 2 * M, 40);
  pack.forEach(([k, v], i) => {
    const x = M + i * fw;
    if (i) line(x, y - 40, x, y);
    label(x + 10, y - 14, k);
    if (v) text(x + 10, y - 30, v, 10, true);
  });

  if (md.ship_notes) {
    y -= 58;
    label(M, y, 'Annotazioni');
    wrap(md.ship_notes, 9.5, W - 2 * M).slice(0, 4).forEach((r, i) => text(M, y - 15 - i * 13, r, 9.5));
  }

  // Firme
  const sy = M + 60;
  const sw = (W - 2 * M - 28) / 3;
  ['Firma mittente', 'Firma vettore', 'Firma destinatario'].forEach((k, i) => {
    const x = M + i * (sw + 14);
    line(x, sy, x + sw, sy, INK, 0.8);
    label(x, sy - 12, k);
  });
  text(M, M, customSender ? 'Documento di trasporto' : 'Tipografia Online · tipografia.online', 7.5, false, MUTED);

  const content = ops.join('\n');
  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >>${logo ? ' /XObject << /Im1 8 0 R >>' : ''} >> /Contents 6 0 R >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
    `<< /Length ${Buffer.byteLength(content, 'latin1')} >>\nstream\n${content}\nendstream`,
    `<< /Title (${enc('DDT ' + order.number)}) /Producer (Tipografia Online) >>`,
  ];
  if (logo) {
    const jpg = Buffer.from(logo.jpegBase64, 'base64').toString('latin1');
    objs.push(`<< /Type /XObject /Subtype /Image /Width ${logo.width} /Height ${logo.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n${jpg}\nendstream`);
  }
  let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const offs = [];
  objs.forEach((o, i) => { offs.push(Buffer.byteLength(pdf, 'latin1')); pdf += `${i + 1} 0 obj\n${o}\nendobj\n`; });
  const xref = Buffer.byteLength(pdf, 'latin1');
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offs.map((o) => String(o).padStart(10, '0') + ' 00000 n \n').join('');
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R /Info 7 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf, 'latin1');
}

module.exports = { buildDdtPdf };
