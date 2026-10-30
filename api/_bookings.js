// Prenotazioni Struttura per Eventi (215): date occupate salvate su Upstash Redis (Vercel Marketplace).
// Env (aggiunte in automatico collegando il database al progetto): KV_REST_API_URL + KV_REST_API_TOKEN
// oppure UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN. Senza env: nessun blocco (solo log).
// Regole condivise con index.html (tenerle allineate): preavviso, domeniche e festivi senza montaggio.
const NOTICE_DAYS = 5;
const MAX_SPAN_DAYS = 30;
const KEY = 'tp:struttura215:booked';

const kvUrl = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const kvToken = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
const kvReady = () => !!(kvUrl() && kvToken());
async function kv(cmd) {
  const r = await fetch(kvUrl(), { method: 'POST', headers: { Authorization: `Bearer ${kvToken()}`, 'Content-Type': 'application/json' }, body: JSON.stringify(cmd) });
  const j = await r.json();
  if (!r.ok || j.error) throw new Error('KV: ' + (j.error || r.status));
  return j.result;
}

const iso = (d) => d.toISOString().slice(0, 10);
const parseIso = (s) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCDate() === +m[3] ? d : null;
};
function easter(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25),
    g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4,
    l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  return new Date(Date.UTC(y, Math.floor((h + l - 7 * m + 114) / 31) - 1, ((h + l - 7 * m + 114) % 31) + 1));
}
// Festivi nazionali + Pasquetta + Santi Pietro e Paolo (patrono di Roma, 29/06).
function isHoliday(d) {
  const md = iso(d).slice(5);
  if (['01-01', '01-06', '04-25', '05-01', '06-02', '06-29', '08-15', '11-01', '12-08', '12-25', '12-26'].includes(md)) return true;
  const em = easter(d.getUTCFullYear()); em.setUTCDate(em.getUTCDate() + 1);
  return iso(em) === iso(d);
}
const noInstall = (d) => d.getUTCDay() === 0 || isHoliday(d);
function expand(start, end) {
  const out = [], d = new Date(start);
  while (d <= end && out.length <= MAX_SPAN_DAYS) { out.push(iso(d)); d.setUTCDate(d.getUTCDate() + 1); }
  return out;
}

// Valida montaggio/smontaggio; ritorna { start, end, days } oppure { error }.
function validateRange(startS, endS) {
  const s = parseIso(startS), e = parseIso(endS);
  if (!s || !e || e < s) return { error: 'scegli le date di montaggio e smontaggio nel calendario.' };
  const now = new Date(), t0 = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  // 1 giorno di tolleranza per il fuso orario del browser.
  if (s - t0 < (NOTICE_DAYS - 1) * 864e5) return { error: `il montaggio deve essere ad almeno ${NOTICE_DAYS} giorni da oggi.` };
  if (s - t0 > 366 * 864e5) return { error: 'si prenota al massimo con un anno di anticipo.' };
  if ((e - s) / 864e5 + 1 > MAX_SPAN_DAYS) return { error: `durata massima ${MAX_SPAN_DAYS} giorni.` };
  if (noInstall(s) || noInstall(e)) return { error: 'niente montaggi o smontaggi di domenica e nei giorni festivi.' };
  return { start: iso(s), end: iso(e), days: expand(s, e) };
}

async function getBooked() {
  if (!kvReady()) return [];
  const today = iso(new Date());
  return ((await kv(['SMEMBERS', KEY])) || []).filter((d) => d >= today).sort();
}
async function addBooked(days) {
  if (!days.length) return;
  if (!kvReady()) { console.warn('Prenotazione non salvata: database KV non collegato', days); return; }
  await kv(['SADD', KEY, ...days]);
}
// metadata.ev_dates = "AAAA-MM-GG|AAAA-MM-GG,…" (montaggio|smontaggio per ogni struttura nel carrello).
function daysFromMetadata(s) {
  return String(s || '').split(',').flatMap((r) => {
    const [a, b] = r.split('|'); const sa = parseIso(a), sb = parseIso(b);
    return sa && sb && sb >= sa ? expand(sa, sb) : [];
  });
}

module.exports = { NOTICE_DAYS, MAX_SPAN_DAYS, kvReady, validateRange, getBooked, addBooked, daysFromMetadata };
