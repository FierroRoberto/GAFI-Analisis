/* ==========================================================================
   Lectura del libro de Excel (script clásico: lo usan el Web Worker y,
   como respaldo, la página principal). Requiere SheetJS (global XLSX).
   Devuelve la matriz (AOA) de la hoja relevante; para cartera vencida
   solo regresa las columnas necesarias para reducir memoria.
   ========================================================================== */
/* global XLSX */
(function (root) {
  'use strict';
  var norm = function (s) { return String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toLowerCase(); };
  var CARTERA_COLS = ['zona', 'vendedor', 'cve cte', 'cliente', 'saldo', 'gestor', '> 15 dias', 'cliente + 15', 'mes', 'tablero'];

  function read(buf, progress) {
    progress = progress || function () {};
    progress('Leyendo estructura del libro…');
    var names = XLSX.read(buf, { type: 'array', bookSheets: true }).SheetNames;
    var cart = names.find(function (n) { return norm(n) === 'antiguedad'; });
    if (cart) {
      progress('Leyendo hoja "' + cart + '" (puede tardar unos segundos)…');
      var wbc = XLSX.read(buf, { type: 'array', sheets: [cart], dense: true });
      var aoa = XLSX.utils.sheet_to_json(wbc.Sheets[cart], { header: 1, raw: true, defval: null, blankrows: false });
      var h = aoa.slice(0, 8).findIndex(function (r) { return (r || []).some(function (c) { return norm(c) === '> 15 dias'; }); });
      if (h < 0) throw new Error('La hoja "antiguedad" no tiene la columna "> 15 días".');
      var idx = CARTERA_COLS.map(function (c) { return aoa[h].findIndex(function (x) { return norm(x) === c; }); });
      var pickCols = function (row) { return idx.map(function (i) { return i >= 0 ? row[i] : null; }); };
      var out = [pickCols(aoa[h])];
      for (var r = h + 1; r < aoa.length; r++) if (aoa[r]) out.push(pickCols(aoa[r]));
      return { ok: true, kind: 'cartera', sheet: cart, names: names, aoa: out, rows: aoa.length - h - 1 };
    }
    progress('Leyendo hojas…');
    var wb = XLSX.read(buf, { type: 'array' });
    var pick = null;
    for (var k = 0; k < wb.SheetNames.length; k++) {
      var n = wb.SheetNames[k];
      var a = XLSX.utils.sheet_to_json(wb.Sheets[n], { header: 1, raw: true, defval: null });
      var top = [].concat.apply([], a.slice(0, 15)).map(norm);
      if (top.indexOf('ventas pesos') >= 0 || top.indexOf('venta periodo act.') >= 0) { pick = { n: n, aoa: a }; break; }
      if (!pick && a.length > 1) pick = { n: n, aoa: a };
    }
    if (!pick) throw new Error('El libro no tiene hojas con datos.');
    return { ok: true, kind: 'ventas', sheet: pick.n, names: names, aoa: pick.aoa, rows: pick.aoa.length };
  }
  root.GAFIRead = { read: read };
})(typeof self !== 'undefined' ? self : this);
