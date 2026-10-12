// Selettore lingua IT / EN per tutto il sito. L'italiano resta il testo sorgente delle pagine;
// in inglese il dizionario (i18n-en.js, caricato solo quando serve) sostituisce i testi a video,
// compresi quelli generati dopo il caricamento (configuratore, checkout, riepiloghi).
(function () {
  var KEY = 'tp_lang';
  var lang = 'it';
  try {
    var q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || q === 'it') localStorage.setItem(KEY, q);
    lang = localStorage.getItem(KEY) === 'en' ? 'en' : 'it';
  } catch (e) {}
  window.tpLang = lang;
  var base = (document.currentScript && document.currentScript.src || '').replace(/[^\/]*$/, '');

  function setLang(l) {
    try { localStorage.setItem(KEY, l); } catch (e) {}
    var u = new URL(location.href);
    if (u.searchParams.has('lang')) { u.searchParams.set('lang', l); location.href = u.toString(); }
    else location.reload();
  }
  window.tpSetLang = setLang;

  function btn(code) {
    var b = document.createElement('button');
    var on = code === lang;
    b.type = 'button';
    b.textContent = code.toUpperCase();
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.setAttribute('data-no-i18n', '');
    b.style.cssText = 'font:600 14px/1 var(--font-heading, sans-serif);letter-spacing:.06em;padding:7px 9px;border:0;cursor:pointer;min-height:32px;' +
      (on ? 'background:var(--color-accent,#5980a6);color:#fff;' : 'background:transparent;color:var(--color-text,#1d1f20);');
    if (!on) b.onclick = function () { setLang(code); };
    return b;
  }
  function mountSwitch() {
    if (document.getElementById('tp-lang-switch')) return;
    var nav = document.querySelector('nav.nav, .nav');
    if (!nav && !document.body) return;
    var w = document.createElement('div');
    w.id = 'tp-lang-switch';
    w.setAttribute('role', 'group');
    w.setAttribute('aria-label', lang === 'en' ? 'Language' : 'Lingua');
    w.setAttribute('data-no-i18n', '');
    w.style.cssText = 'display:inline-flex;align-items:stretch;border:1px solid var(--color-accent,#5980a6);flex:0 0 auto;';
    w.appendChild(btn('it'));
    w.appendChild(btn('en'));
    if (nav) {
      var cta = nav.querySelector('.btn-primary');
      if (cta && cta.parentNode === nav) nav.insertBefore(w, cta); else nav.appendChild(w);
    } else {
      w.style.cssText += 'position:fixed;top:12px;right:12px;z-index:1000;background:var(--color-bg,#f2f2f3);';
      document.body.appendChild(w);
    }
  }

  if (lang !== 'en') {
    document.addEventListener('DOMContentLoaded', mountSwitch);
    new MutationObserver(function () { if (!document.getElementById('tp-lang-switch')) mountSwitch(); })
      .observe(document.documentElement, { childList: true, subtree: true });
    return;
  }

  document.documentElement.lang = 'en';
  var hide = document.createElement('style');
  hide.textContent = 'body{opacity:0 !important}';
  document.head.appendChild(hide);
  var unhide = function () { if (hide.parentNode) hide.parentNode.removeChild(hide); };
  setTimeout(unhide, 1500);

  var D = null, T = {}, RX = null, VALS = {};
  var NUM = /\d+(?:[.,]\d+)*/g;
  function norm(s) { return s.replace(/\s+/g, ' ').trim(); }
  function enNum(n) {
    var m = n.match(/^(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d+))?$/);
    return m ? m[1].replace(/\./g, ',') + (m[2] ? '.' + m[2] : '') : n;
  }
  function prices(s) {
    return s.replace(/(€\s?)(\d{1,3}(?:\.\d{3})*,\d+)(?!\d)/g, function (_, e, n) { return e + enNum(n); });
  }
  var DAYS = { lun: 'Mon', mar: 'Tue', mer: 'Wed', gio: 'Thu', ven: 'Fri', sab: 'Sat', dom: 'Sun' };
  var MONTHS = { gen: 'Jan', feb: 'Feb', mar: 'Mar', apr: 'Apr', mag: 'May', giu: 'Jun', lug: 'Jul', ago: 'Aug', set: 'Sep', ott: 'Oct', nov: 'Nov', dic: 'Dec' };
  function dates(s) {
    return s.replace(/\b(lun|mar|mer|gio|ven|sab|dom) (\d{1,2}) (gen|feb|mar|apr|mag|giu|lug|ago|set|ott|nov|dic)\b/g, function (_, d, n, m) { return DAYS[d] + ' ' + n + ' ' + MONTHS[m]; })
      .replace(/^tra (.+) e (.+)$/, 'between $1 and $2');
  }
  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function build(src) {
    D = {};
    Object.keys(src).forEach(function (k) {
      var kk = norm(k.replace(/^style="[^"]*">\s*/, ''));
      if (kk) D[kk] = src[k];
    });
    var subs = [];
    Object.keys(D).forEach(function (k) {
      VALS[norm(D[k])] = 1;
      if (/\d/.test(k)) {
        var a = (k.match(NUM) || []).length, b = (D[k].match(NUM) || []).length;
        if (a === b) T[k.replace(NUM, '#')] = D[k].replace(NUM, '#');
      }
      if (k.indexOf(' ') > 0 && k.length >= 8) subs.push(k);
    });
    subs.sort(function (a, b) { return b.length - a.length; });
    var body = subs.map(esc).join('|');
    try { RX = new RegExp('(?<![\\wÀ-ÿ])(?:' + body + ')(?![\\wÀ-ÿ])', 'g'); }
    catch (e) { RX = new RegExp('(?:' + body + ')', 'g'); }
  }

  function tr(raw) {
    var r = tr0(raw);
    return r != null && r !== norm(raw) ? r : null;
  }
  function tr0(raw) {
    var k = norm(raw);
    if (VALS[k]) return null;
    if (/^[\d.,×x\s\-–ø/]+(cm|mm|m)?$/i.test(k)) return k.replace(NUM, enNum);
    if (/\b(lun|mar|mer|gio|ven|sab|dom) \d{1,2} (gen|feb|mar|apr|mag|giu|lug|ago|set|ott|nov|dic)\b/.test(k)) return dates(k);
    if (!k || !/[A-Za-zÀ-ÿ]/.test(k)) {
      if (/^\d{1,3}(\.\d{3})*,\d{2}$/.test(k)) return enNum(k);
      var p = prices(k); return p !== k ? p : null;
    }
    if (D[k] != null) return D[k];
    var m = k.match(/^(.*?)([\s:(€.,·]+)$/);
    if (m && D[m[1]] != null) return D[m[1]] + m[2];
    if (/\d/.test(k)) {
      var t = T[k.replace(NUM, '#')];
      if (t != null) { var nums = k.match(NUM), i = 0; return t.replace(/#/g, function () { return enNum(nums[i++] || ''); }); }
    }
    var out = prices(RX ? k.replace(RX, function (x) { return D[x]; }) : k);
    return out !== k ? out : null;
  }

  var done = new WeakMap();
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, CODE: 1, NOSCRIPT: 1 };
  function skip(el) {
    for (var e = el; e && e.nodeType === 1; e = e.parentNode) {
      if (SKIP[e.tagName] || e.hasAttribute('data-no-i18n') || e.isContentEditable) return true;
    }
    return false;
  }
  function doText(n) {
    var v = n.nodeValue;
    if (done.get(n) === v || !v || !v.trim()) return;
    if (skip(n.parentNode)) return;
    var t = tr(v);
    if (t != null) {
      var lead = v.match(/^\s*/)[0], trail = v.match(/\s*$/)[0];
      v = lead + t + trail;
      n.nodeValue = v;
    }
    done.set(n, v);
  }
  var ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];
  function doEl(el) {
    if (skip(el)) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var a = el.getAttribute(ATTRS[i]);
      if (a && a !== el['__tp' + i]) { var t = tr(a); el['__tp' + i] = t != null ? t : a; if (t != null && t !== a) el.setAttribute(ATTRS[i], t); }
    }
    if (el.tagName === 'INPUT' && /^(submit|button)$/i.test(el.type) && el.value) {
      var tv = tr(el.value); if (tv != null) el.value = tv;
    }
  }
  function walk(root) {
    if (root.nodeType === 3) return doText(root);
    if (root.nodeType !== 1) return;
    doEl(root);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    var n;
    while ((n = w.nextNode())) { if (n.nodeType === 3) doText(n); else doEl(n); }
  }

  function start() {
    build(window.TP_I18N_EN || {});
    var t = tr(document.title); if (t) document.title = t;
    walk(document.body);
    mountSwitch();
    unhide();
    var pending = [], timer = null, rounds = 0, t0 = Date.now();
    function flush() {
      timer = null;
      var list = pending; pending = [];
      if (Date.now() - t0 > 3000) { t0 = Date.now(); rounds = 0; }
      if (++rounds > 60) { mo.disconnect(); console.warn('i18n: troppe modifiche, traduzione automatica sospesa'); return; }
      for (var i = 0; i < list.length; i++) {
        var r = list[i];
        if (r.type === 'characterData') doText(r.target);
        else if (r.type === 'attributes') doEl(r.target);
        else for (var j = 0; j < r.addedNodes.length; j++) walk(r.addedNodes[j]);
      }
      if (!document.getElementById('tp-lang-switch')) mountSwitch();
    }
    var mo = new MutationObserver(function (list) {
      for (var i = 0; i < list.length; i++) pending.push(list[i]);
      if (!timer) timer = setTimeout(flush, 30);
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }

  var s = document.createElement('script');
  s.src = base + 'i18n-en.js';
  s.onload = function () {
    if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
  };
  s.onerror = unhide;
  document.head.appendChild(s);
})();
