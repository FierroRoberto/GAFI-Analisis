/* ==========================================================================
   Web Worker de lectura (no bloquea la interfaz con archivos grandes .xlsb)
   ========================================================================== */
/* global GAFIRead */
self.importScripts('https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js', 'read-core.js');

self.onmessage = function (e) {
  try {
    var res = GAFIRead.read(e.data.buf, function (msg) { self.postMessage({ progress: msg }); });
    self.postMessage(res);
  } catch (err) {
    self.postMessage({ ok: false, error: err.message || String(err) });
  }
};
