export const config = {
  matcher: '/((?!api|_ds|img|blocked.html|favicon.ico|robots.txt|sitemap.xml).*)',
};

const BLOCKED_COUNTRIES = new Set(['BH', 'BD', 'CN', 'IN', 'IR', 'IQ', 'KW', 'NE', 'NG', 'PK']);
// I motori di ricerca non vengono mai bloccati, da qualunque paese arrivino.
const SEARCH_BOTS = /Googlebot|Google-InspectionTool|AdsBot-Google|Storebot-Google|bingbot|DuckDuckBot|Applebot|YandexBot/i;

const SITE = 'https://tipografia.online';
// Pagine del catalogo (index.html servito per /, /prodotto/… e /categoria/…).
const APP_PAGE = /^\/(?:$|prodotto\/|categoria\/)/;

// SEO nell'HTML grezzo (quello che leggono i crawler prima del JavaScript):
// - versione inglese (?lang=en): canonical, og:url e lang puntano a sé stessa, non all'italiano;
// - schede prodotto e categorie: canonical della pagina stessa, non della home;
// - link hreflang it / en / x-default, come in sitemap.xml.
// Prima questi tag li correggeva solo il JavaScript (i18n.js / app.js), dopo il caricamento.
export function seoHtml(html, pathname, en) {
  if (/<meta name="robots" content="[^"]*noindex/i.test(html)) return html;
  const it = SITE + pathname, enUrl = it + '?lang=en', self = en ? enUrl : it;
  let out = html.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${self}">`);
  out = out.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${self}$2`);
  if (en) {
    out = out.replace(/<html lang="it">/, '<html lang="en">')
      .replace(/(<meta property="og:locale" content=")it_IT(")/, '$1en_GB$2');
  }
  if (!/hreflang=/.test(out)) {
    const alt = `<link rel="alternate" hreflang="it" href="${it}">\n<link rel="alternate" hreflang="en" href="${enUrl}">\n<link rel="alternate" hreflang="x-default" href="${it}">\n`;
    out = out.replace('</head>', alt + '</head>');
  }
  return out;
}

export default async function middleware(req) {
  // Richiesta interna fatta qui sotto per leggere la pagina: passa senza altri controlli.
  if (req.headers.get('x-tp-seo')) return;
  const ua = req.headers.get('user-agent') || '';
  if (!SEARCH_BOTS.test(ua)) {
    const country = req.headers.get('x-vercel-ip-country');
    if (country && BLOCKED_COUNTRIES.has(country)) {
      const url = new URL('/blocked.html', req.url);
      return Response.redirect(url, 307);
    }
  }

  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const en = url.searchParams.get('lang') === 'en';
  const app = APP_PAGE.test(url.pathname);
  // Solo dove l'HTML grezzo ha tag sbagliati: catalogo (sempre) e pagine .html in inglese.
  if (!app && !(en && url.pathname.endsWith('.html'))) return;
  try {
    const res = await fetch(url.toString(), { headers: { 'x-tp-seo': '1', 'user-agent': ua, accept: 'text/html' } });
    if (!res.ok || !(res.headers.get('content-type') || '').includes('text/html')) return;
    const html = seoHtml(await res.text(), url.pathname, en);
    return new Response(html, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=0, must-revalidate' } });
  } catch (e) {
    return; // in caso di errore la pagina parte normale, senza correzioni
  }
}
