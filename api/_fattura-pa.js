// FatturaPA XML (FPR12, TD01) da caricare a mano su Aruba Fatturazione Elettronica.
// Stesso tracciato della fattura 261/2026 già accettata. Gli importi in ingresso sono IVA INCLUSA
// (quanto pagato dal cliente): l'IVA viene scorporata per aliquota, così Imponibile + Imposta = pagato.
// Ritorna { xml, filename, warnings } — warnings = dati da controllare prima del caricamento.

const SELLER = {
  name: process.env.SELLER_NAME || 'Printing Italy di Angelo Cipolla',
  vatNumber: (process.env.SELLER_VAT_NUMBER || '02452700590').replace(/^IT/i, ''),
  fiscalCode: process.env.SELLER_FISCAL_CODE || '',
  address: process.env.SELLER_ADDRESS || 'Via Lorenzo Bonincontri 26',
  cap: process.env.SELLER_CAP || '00147',
  city: process.env.SELLER_CITY || 'Roma',
  province: process.env.SELLER_PROVINCE || 'RM',
  regimeFiscale: process.env.SELLER_REGIME_FISCALE || 'RF01',
};

const pad = (n, len) => String(n).padStart(len, '0');
// I campi testo FatturaPA accettano solo Latin-1: rimappa i caratteri tipografici, scarta il resto.
function latin1(s) {
  return String(s ?? '')
    .replace(/[\u2012-\u2015\u2212]/g, '-').replace(/[\u2018\u2019\u201A\u2032]/g, "'")
    .replace(/[\u201C\u201D\u201E\u2033]/g, '"').replace(/\u2026/g, '...').replace(/\u00D7/g, 'x')
    .replace(/[\u00A0\u2000-\u200B\u202F]/g, ' ').replace(/\u20AC/g, 'EUR')
    .normalize('NFC').replace(/[^\u0000-\u00FF]/g, (c) => c.normalize('NFD').replace(/[^\u0000-\u00FF]/g, ''));
}
const esc = (s) => latin1(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const eur = (cents) => (cents / 100).toFixed(2);
const clean = (s) => String(s || '').replace(/\s+/g, '').toUpperCase();

function progressivo() {
  const A = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let s = '';
  for (let i = 0; i < 5; i++) s += A[Math.floor(Math.random() * A.length)];
  return s;
}

// c: { type: 'privato'|'azienda', name, company, vat, cf, pec, sdi, address, cap, city, province, country }
function buyerBlock(c, warnings) {
  const country = clean(c.country) || 'IT';
  const foreign = country !== 'IT';
  if (!/^[A-Z]{2}$/.test(country)) warnings.push(`Codice paese cliente non valido: "${c.country}"`);
  let vat = clean(c.vat).replace(/^[A-Z]{2}(?=\d)/, '');
  let cf = clean(c.cf);
  if (!foreign && vat && !/^\d{11}$/.test(vat)) { if (!cf) cf = vat; vat = ''; }

  let fiscal = '';
  if (vat) fiscal += `<IdFiscaleIVA><IdPaese>${esc(country)}</IdPaese><IdCodice>${esc(vat)}</IdCodice></IdFiscaleIVA>`;
  if (!foreign && cf) fiscal += `<CodiceFiscale>${esc(cf)}</CodiceFiscale>`;
  if (!fiscal && foreign) fiscal = `<IdFiscaleIVA><IdPaese>${esc(country)}</IdPaese><IdCodice>99999999999</IdCodice></IdFiscaleIVA>`;
  if (!fiscal) warnings.push('Cliente senza Partita IVA né Codice Fiscale: SDI scarta la fattura');

  const company = c.type === 'azienda' || (foreign && c.company);
  let anagrafica;
  if (company) {
    anagrafica = `<Denominazione>${esc(c.company || c.name)}</Denominazione>`;
  } else {
    const parts = String(c.name || '').trim().split(/\s+/);
    const nome = parts.shift() || 'Cliente';
    anagrafica = `<Nome>${esc(nome)}</Nome><Cognome>${esc(parts.join(' ') || nome)}</Cognome>`;
    if (!parts.length) warnings.push('Nome cliente senza cognome: controlla Nome/Cognome');
  }

  const prov = clean(c.province);
  if (!foreign && !/^[A-Z]{2}$/.test(prov)) warnings.push('Provincia cliente mancante o non valida (2 lettere, es. RM)');
  const cap = foreign ? '00000' : clean(c.cap);
  if (!foreign && !/^\d{5}$/.test(cap)) warnings.push(`CAP cliente non valido: "${c.cap}"`);
  if (!c.address || !c.city) warnings.push('Indirizzo o comune cliente mancante');

  let codDest = foreign ? 'XXXXXXX' : (clean(c.sdi) || '0000000');
  if (!foreign && !/^[A-Z0-9]{7}$/.test(codDest)) { warnings.push(`Codice SDI non valido: "${c.sdi}" — usato 0000000`); codDest = '0000000'; }
  if (c.type === 'azienda' && !foreign && codDest === '0000000' && !c.pec) warnings.push('Azienda senza Codice SDI né PEC');
  if (foreign && vat && company) warnings.push('Cliente aziendale estero con P.IVA: verifica se serve non imponibilità (art. 41) invece del 22%');

  return {
    codDest,
    pec: codDest === '0000000' && c.pec ? c.pec : '',
    xml: `<CessionarioCommittente>
      <DatiAnagrafici>${fiscal}<Anagrafica>${anagrafica}</Anagrafica></DatiAnagrafici>
      <Sede>
        <Indirizzo>${esc(c.address)}</Indirizzo>
        <CAP>${esc(cap)}</CAP>
        <Comune>${esc(c.city)}</Comune>
        ${!foreign && prov ? `<Provincia>${esc(prov)}</Provincia>` : ''}
        <Nazione>${esc(country)}</Nazione>
      </Sede>
    </CessionarioCommittente>`,
  };
}

// inv: { number? (vuoto: lo assegna Aruba), date: 'YYYY-MM-DD', ref, pay: 'Stripe'|'PayPal', payId, totalCents, customer, lines: [{ d, q, c (centesimi IVA incl.), r? }] }
function buildFattura(inv) {
  const warnings = [];
  const prog = progressivo();
  const lines = inv.lines.map((l) => ({ description: l.d, quantity: l.q || 1, grossCents: l.c, vatRate: l.r ?? 22 }));
  const groups = {};
  lines.forEach((l) => { (groups[l.vatRate] = groups[l.vatRate] || []).push(l); });
  const riepiloghi = [];
  for (const [rateStr, ls] of Object.entries(groups)) {
    const r = parseFloat(rateStr);
    const gross = ls.reduce((t, l) => t + l.grossCents, 0);
    const imponibile = Math.round(gross / (1 + r / 100));
    let assigned = 0;
    ls.forEach((l, i) => {
      l.netCents = i === ls.length - 1 ? imponibile - assigned : Math.round(l.grossCents / (1 + r / 100));
      assigned += l.netCents;
    });
    riepiloghi.push(`
      <DatiRiepilogo>
        <AliquotaIVA>${r.toFixed(2)}</AliquotaIVA>
        <ImponibileImporto>${eur(imponibile)}</ImponibileImporto>
        <Imposta>${eur(gross - imponibile)}</Imposta>
        <EsigibilitaIVA>I</EsigibilitaIVA>
      </DatiRiepilogo>`);
  }
  const sumGross = lines.reduce((t, l) => t + l.grossCents, 0);
  if (sumGross !== inv.totalCents) warnings.push(`Somma righe € ${eur(sumGross)} diversa dal pagato € ${eur(inv.totalCents)}`);

  // Il tracciato non ha un campo email per il cliente: la mettiamo in AltriDatiGestionali della riga 1.
  const email = String(inv.customer.email || '').trim();
  if (!email) warnings.push('Email cliente mancante: Aruba non potrà inviare la fattura via email');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 60) warnings.push(`Email cliente non valida: "${email}"`);
  const emailXml = email ? `
        <AltriDatiGestionali><TipoDato>EMAIL</TipoDato><RiferimentoTesto>${esc(email.slice(0, 60))}</RiferimentoTesto></AltriDatiGestionali>` : '';
  const dettaglio = lines.map((l, i) => `
      <DettaglioLinee>
        <NumeroLinea>${i + 1}</NumeroLinea>
        <Descrizione>${esc(String(l.description || 'Articolo').slice(0, 1000))}</Descrizione>
        <Quantita>${Number(l.quantity).toFixed(2)}</Quantita>
        <PrezzoUnitario>${(l.netCents / 100 / l.quantity).toFixed(6)}</PrezzoUnitario>
        <PrezzoTotale>${eur(l.netCents)}</PrezzoTotale>
        <AliquotaIVA>${Number(l.vatRate).toFixed(2)}</AliquotaIVA>${i === 0 ? emailXml : ''}
      </DettaglioLinee>`).join('');

  const buyer = buyerBlock(inv.customer, warnings);
  const pagato = inv.pay === 'PayPal'
    ? `pagato online con PayPal${inv.payId ? ' (' + inv.payId + ')' : ''}`
    : 'pagato online con carta (Stripe)';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<p:FatturaElettronica xmlns:p="http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" versione="FPR12">
  <FatturaElettronicaHeader>
    <DatiTrasmissione>
      <IdTrasmittente><IdPaese>IT</IdPaese><IdCodice>${esc(SELLER.vatNumber)}</IdCodice></IdTrasmittente>
      <ProgressivoInvio>${prog}</ProgressivoInvio>
      <FormatoTrasmissione>FPR12</FormatoTrasmissione>
      <CodiceDestinatario>${esc(buyer.codDest)}</CodiceDestinatario>
      ${buyer.pec ? `<PECDestinatario>${esc(buyer.pec)}</PECDestinatario>` : ''}
    </DatiTrasmissione>
    <CedentePrestatore>
      <DatiAnagrafici>
        <IdFiscaleIVA><IdPaese>IT</IdPaese><IdCodice>${esc(SELLER.vatNumber)}</IdCodice></IdFiscaleIVA>
        ${SELLER.fiscalCode ? `<CodiceFiscale>${esc(SELLER.fiscalCode)}</CodiceFiscale>` : ''}
        <Anagrafica><Denominazione>${esc(SELLER.name)}</Denominazione></Anagrafica>
        <RegimeFiscale>${esc(SELLER.regimeFiscale)}</RegimeFiscale>
      </DatiAnagrafici>
      <Sede>
        <Indirizzo>${esc(SELLER.address)}</Indirizzo>
        <CAP>${esc(SELLER.cap)}</CAP>
        <Comune>${esc(SELLER.city)}</Comune>
        ${SELLER.province ? `<Provincia>${esc(SELLER.province)}</Provincia>` : ''}
        <Nazione>IT</Nazione>
      </Sede>
    </CedentePrestatore>
    ${buyer.xml}
  </FatturaElettronicaHeader>
  <FatturaElettronicaBody>
    <DatiGenerali>
      <DatiGeneraliDocumento>
        <TipoDocumento>TD01</TipoDocumento>
        <Divisa>EUR</Divisa>
        <Data>${esc(inv.date)}</Data>
        <Numero>${esc(inv.number || '')}</Numero>
        <ImportoTotaleDocumento>${eur(inv.totalCents)}</ImportoTotaleDocumento>
        <Causale>${esc(`Ordine ${inv.ref} - ${pagato}`.slice(0, 200))}</Causale>
      </DatiGeneraliDocumento>
    </DatiGenerali>
    <DatiBeniServizi>${dettaglio}${riepiloghi.join('')}
    </DatiBeniServizi>
    <DatiPagamento>
      <CondizioniPagamento>TP02</CondizioniPagamento>
      <DettaglioPagamento>
        <ModalitaPagamento>MP08</ModalitaPagamento>
        <ImportoPagamento>${eur(inv.totalCents)}</ImportoPagamento>
      </DettaglioPagamento>
    </DatiPagamento>
  </FatturaElettronicaBody>
</p:FatturaElettronica>`;
  return { xml, filename: `IT${SELLER.vatNumber}_${prog}.xml`, warnings };
}

module.exports = { buildFattura, SELLER, pad };
