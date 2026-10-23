// Carrello — salvato in localStorage ('tp_cart'), resta anche chiudendo il browser.
// Ogni articolo: { key, productId, name, price, col, ean, body, details:[{label,value}] }.
// body = configurazione inviata a /api/create-checkout-session (il prezzo lo ricalcola il server).
(function () {
  var KEY = 'tp_cart', MAX = 20;
  var listeners = [];
  function read() { try { var a = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function write(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} listeners.forEach(function (fn) { try { fn(a); } catch (e) {} }); }
  var eur = function (n) { return Number(n || 0).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  var TPCart = {
    items: read,
    count: function () { return read().length; },
    subtotal: function () { return read().reduce(function (a, i) { return a + (parseFloat(i.price) || 0); }, 0); },
    add: function (item) {
      var a = read();
      if (a.length >= MAX) return false;
      item.key = item.key || ('c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6));
      a.push(item); write(a); return true;
    },
    remove: function (key) { write(read().filter(function (i) { return i.key !== key; })); },
    clear: function () { write([]); },
    onChange: function (fn) { listeners.push(fn); },
    eur: eur,
    // Spedizione stimata per il preventivo dal carrello: zona Roma Sud/EUR/Centro (stessa regola del checkout).
    quoteHref: function () {
      var a = read();
      var fee = Math.max.apply(null, [0].concat(a.map(function (it) {
        if (String(it.productId) === '5970' || it.col === 'strategici') return 0;
        if (String(it.productId) === '197') { var q = Math.max(1, parseInt(((it.body || {}).formula || {}).qty, 10) || 1); return 20 + 15 * (q - 1); }
        return 20;
      })));
      return 'preventivo.html?cart=1&zona=roma_centro&sped=' + fee.toFixed(2);
    },

    // Pannello laterale (scheda prodotto). Creato al primo uso.
    open: function (msg) { ensurePanel(); renderPanel(msg); panel.style.transform = 'translateX(0)'; backdrop.style.display = 'block'; panel.setAttribute('aria-hidden', 'false'); },
    close: function () { if (!panel) return; panel.style.transform = 'translateX(100%)'; backdrop.style.display = 'none'; panel.setAttribute('aria-hidden', 'true'); },
  };

  var panel, backdrop;
  function ensurePanel() {
    if (panel) return;
    backdrop = document.createElement('div');
    backdrop.style.cssText = 'position:fixed;inset:0;background:rgba(20,22,24,.35);z-index:200;display:none;';
    backdrop.addEventListener('click', TPCart.close);
    panel = document.createElement('aside');
    panel.setAttribute('aria-label', 'Carrello');
    panel.setAttribute('aria-hidden', 'true');
    panel.style.cssText = 'position:fixed;top:0;right:0;bottom:0;width:min(420px,100vw);background:var(--color-bg);border-left:1px solid var(--color-divider, #d6d8db);z-index:201;transform:translateX(100%);transition:transform .22s ease;display:flex;flex-direction:column;box-shadow:var(--shadow-lg);';
    document.body.appendChild(backdrop);
    document.body.appendChild(panel);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') TPCart.close(); });
    panel.addEventListener('click', function (e) {
      var rm = e.target.closest('[data-cart-remove]');
      if (rm) { TPCart.remove(rm.getAttribute('data-cart-remove')); renderPanel(); return; }
      if (e.target.closest('[data-cart-close]')) TPCart.close();
    });
  }
  function renderPanel(msg) {
    if (!panel) return;
    var a = read();
    var corners = '<i class="corner tl"></i><i class="corner tr"></i><i class="corner bl"></i><i class="corner br"></i>';
    var rows = a.map(function (i, n) {
      var det = (i.details || []).map(function (d) { return esc(d.label) + ': ' + esc(d.value); }).join(' · ');
      return '<div style="padding:14px 0;border-bottom:1px solid var(--color-divider, #d6d8db);display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 12px;">'
        + '<div style="font-family:var(--font-heading);font-size:18px;line-height:1.2;">' + esc(i.name) + '</div>'
        + '<div style="font-family:var(--font-heading);font-size:18px;white-space:nowrap;">€ ' + eur(i.price) + '</div>'
        + (det ? '<div style="grid-column:1/-1;font-size:12.5px;color:var(--color-neutral-700);text-wrap:pretty;">' + det + '</div>' : '')
        + '<button type="button" data-cart-remove="' + esc(i.key) + '" class="btn btn-ghost" style="grid-column:1/-1;justify-self:start;padding:4px 0;font-size:12.5px;min-height:0;">Rimuovi</button>'
        + '</div>';
    }).join('');
    panel.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid var(--color-divider, #d6d8db);">'
      + '<div style="font-family:var(--font-heading);font-size:24px;">Carrello' + (a.length ? ' (' + a.length + ')' : '') + '</div>'
      + '<button type="button" data-cart-close class="btn btn-ghost btn-icon" aria-label="Chiudi"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>'
      + '</div>'
      + (msg ? '<div style="padding:10px 20px;font-size:13.5px;font-weight:600;color:var(--color-accent-700);background:var(--color-accent-100);">' + esc(msg) + '</div>' : '')
      + '<div style="flex:1;overflow:auto;padding:0 20px;">'
      + (a.length ? rows : '<p style="margin:24px 0;font-size:14px;color:var(--color-neutral-700);">Il carrello è vuoto.</p>')
      + '</div>'
      + (a.length ? '<div style="padding:16px 20px calc(40px + env(safe-area-inset-bottom));border-top:1px solid var(--color-divider, #d6d8db);display:flex;flex-direction:column;gap:10px;">'
        + '<div style="display:flex;justify-content:space-between;align-items:baseline;"><span style="font-size:14px;">Subtotale</span><span style="font-family:var(--font-heading);font-size:24px;">€ ' + eur(TPCart.subtotal()) + '</span></div>'
        + '<div style="font-size:12px;color:var(--color-neutral-700);">Spedizione calcolata nel checkout (una sola spedizione per ordine; Prezzi Strategici: inclusa). I file da stampare li carichi nel checkout.</div>'
        + '<a href="checkout.html" class="btn btn-primary btn-block blueprint" style="display:flex;justify-content:center;">' + corners + 'Vai al checkout</a>'
        + '<a href="' + TPCart.quoteHref() + '" target="_blank" rel="noopener" class="btn btn-secondary btn-block blueprint" style="display:flex;justify-content:center;">' + corners + 'Richiedi un preventivo ufficiale</a>'
        + '<button type="button" data-cart-close class="btn btn-ghost btn-block">Continua gli acquisti</button>'
        + '</div>' : '');
  }
  TPCart.onChange(function () { renderPanel(); });
  window.TPCart = TPCart;
})();
