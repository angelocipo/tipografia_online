export const config = {
  matcher: '/((?!api|_ds|img|blocked.html|favicon.ico|robots.txt|sitemap.xml).*)',
};

const BLOCKED_COUNTRIES = new Set(['BH', 'BD', 'CN', 'IN', 'IR', 'IQ', 'KW', 'NE', 'NG', 'PK']);
// I motori di ricerca non vengono mai bloccati, da qualunque paese arrivino.
const SEARCH_BOTS = /Googlebot|Google-InspectionTool|AdsBot-Google|Storebot-Google|bingbot|DuckDuckBot|Applebot|YandexBot/i;

export default function middleware(req) {
  if (SEARCH_BOTS.test(req.headers.get('user-agent') || '')) return;
  const country = req.headers.get('x-vercel-ip-country');
  if (country && BLOCKED_COUNTRIES.has(country)) {
    const url = new URL('/blocked.html', req.url);
    return Response.redirect(url, 307);
  }
}
