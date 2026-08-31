// Materiale da stampare — invio DOPO il pagamento.
//
// Prima i file partivano verso il titolare nell'istante in cui il cliente li sceglieva sulla
// scheda prodotto: arrivavano quindi anche gli upload di chi poi non completava il checkout.
// Ora i file restano nel browser del cliente (IndexedDB: regge i MB, a differenza di
// sessionStorage) e vengono inviati solo quando la pagina "grazie" conferma il pagamento.
//
// Limite invariato: il body di una funzione serverless Vercel è ~4,5 MB → max 3 MB reali.
//
// Rischio noto e mitigato: se il cliente chiude il browser subito dopo aver pagato senza
// arrivare su /grazie, i file restano in coda. Vengono marcati "pagato" e rispediti al
// primo ritorno sul sito (questo file gira su tutte le schede prodotto). Se non torna mai,
// il materiale non arriva: l'email d'ordine Stripe riporta comunque nomi file, link e
// riferimento, così è possibile richiederli al cliente.
(function () {
  var DB = 'tp-design', STORE = 'pending', KEY = 'current';
  var MAX_UNPAID_DAYS = 7;

  function open() {
    return new Promise(function (resolve, reject) {
      var rq = indexedDB.open(DB, 1);
      rq.onupgradeneeded = function () { rq.result.createObjectStore(STORE, { keyPath: 'id' }); };
      rq.onsuccess = function () { resolve(rq.result); };
      rq.onerror = function () { reject(rq.error); };
    });
  }
  function tx(mode, fn) {
    return open().then(function (db) {
      return new Promise(function (resolve, reject) {
        var t = db.transaction(STORE, mode), rq = fn(t.objectStore(STORE));
        rq.onsuccess = function () { resolve(rq.result); };
        rq.onerror = function () { reject(rq.error); };
      });
    });
  }
  var get = function () { return tx('readonly', function (s) { return s.get(KEY); }); };
  var put = function (v) { return tx('readwrite', function (s) { return s.put(v); }); };
  var del = function () { return tx('readwrite', function (s) { return s.delete(KEY); }); };

  var TPFiles = {
    // Scheda prodotto: mette i file in coda, non li invia.
    async stash(opts) {
      var cur = (await get()) || { id: KEY, files: [], paid: false, ts: Date.now() };
      cur.files = (cur.files || []).concat(opts.files || []).slice(0, 10);
      cur.ref = opts.ref || cur.ref || '';
      cur.product = opts.product || cur.product || '';
      cur.ts = Date.now();
      await put(cur);
      return cur.files.map(function (f) { return f.name; });
    },

    async setLink(link) {
      var cur = await get();
      if (!cur) return;
      cur.link = link || '';
      await put(cur);
    },

    async names() {
      var cur = await get();
      return cur && cur.files ? cur.files.map(function (f) { return f.name; }) : [];
    },

    // Pagina "grazie": marca la coda come pagata e prova subito l'invio.
    async markPaid(orderRef, customer, link) {
      var cur = await get();
      if (!cur || !(cur.files || []).length) return { ok: true, empty: true };
      cur.paid = true;
      cur.orderRef = orderRef || cur.orderRef || '';
      if (customer) cur.customer = customer;
      if (link) cur.link = link;
      await put(cur);
      return TPFiles.flush();
    },

    // Gira a ogni caricamento di pagina: rispedisce una coda pagata rimasta indietro
    // e ripulisce le code abbandonate (upload senza pagamento) dopo 7 giorni.
    async flush() {
      var cur;
      try { cur = await get(); } catch (e) { return { ok: false, error: String(e) }; }
      if (!cur) return { ok: true, empty: true };
      if (!cur.paid) {
        if (Date.now() - (cur.ts || 0) > MAX_UNPAID_DAYS * 864e5) await del();
        return { ok: true, pending: true };
      }
      if (!(cur.files || []).length) { await del(); return { ok: true, empty: true }; }
      try {
        var res = await fetch('/api/upload-design', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            files: cur.files,
            ref: cur.ref || '',
            link: cur.link || '',
            product: cur.product || '',
            customer: cur.customer || null,
            note: cur.orderRef ? 'Ordine pagato — riferimento ordine ' + cur.orderRef : 'Ordine pagato',
          }),
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        await del();
        return { ok: true, sent: true };
      } catch (e) {
        // Resta in coda: si riprova al prossimo caricamento di pagina.
        return { ok: false, error: String(e && e.message || e) };
      }
    },
  };

  window.TPFiles = TPFiles;
  // Rete di sicurezza: ogni pagina che carica questo file ritenta una coda pagata.
  if (window.indexedDB) { try { TPFiles.flush(); } catch (e) {} }
})();
