/* ==========================================================================
   Detección y lectura de los formatos de archivo (matrices AOA de SheetJS)
   ========================================================================== */
import { num, norm, excelSerialToDate, monthKey } from './utils.js';

export const SCENARIOS = {
  'ventas-anual': { kind: 'ventas', name: 'Ventas por dimensión · comparativo anual', icon: 'fa-chart-column' },
  'ventas-familia': { kind: 'ventas', name: 'Ventas por familia · periodo y trimestre', icon: 'fa-boxes-stacked' },
  'ventas-clientes': { kind: 'ventas', name: 'Clientes por vendedor', icon: 'fa-users' },
  'cartera': { kind: 'cartera', name: 'Cartera vencida · Guía 80-20', icon: 'fa-file-invoice-dollar' },
};

const isTotal = (v) => typeof v === 'string' && /\btotal\b/i.test(v);
const findRow = (aoa, pred, max = 15) => {
  for (let r = 0; r < Math.min(aoa.length, max); r++) if ((aoa[r] || []).some((c) => pred(norm(c)))) return r;
  return -1;
};

/** Devuelve { scenario, data, info } o lanza Error con mensaje para el usuario. */
export function parseSales(aoa) {
  if (findRow(aoa, (c) => c === 'venta periodo act.') >= 0) return parseFamilia(aoa);
  const h = findRow(aoa, (c) => c === 'ventas pesos');
  if (h < 0) throw new Error('No encontré columnas de "Ventas pesos" ni de "Venta periodo". Revisa que sea un reporte de ventas.');
  const head = aoa[h];
  const first = head.findIndex((c) => norm(c) === 'ventas pesos');
  const dims = head.slice(0, first).map((c, i) => (c == null ? `Nivel ${i + 1}` : String(c).trim()));
  /* años: fila superior con textos de 4 dígitos, rellenando hacia la derecha */
  let yearRow = null;
  for (let r = h - 1; r >= Math.max(0, h - 5); r--) if ((aoa[r] || []).some((c) => /^\s*20\d{2}\s*$/.test(String(c ?? '')))) { yearRow = aoa[r]; break; }
  const measures = [];
  let curYear = null;
  for (let c = first; c < head.length; c++) {
    const y = yearRow ? yearRow[c] : null;
    if (y != null && y !== '') curYear = /^\s*20\d{2}\s*$/.test(String(y)) ? String(y).trim() : 'total';
    const name = norm(head[c]);
    if (curYear && curYear !== 'total' && (name === 'ventas pesos' || name.startsWith('% variaci'))) measures.push({ c, year: +curYear, m: name === 'ventas pesos' ? 'v' : 'var' });
  }
  if (!measures.length) { // sin fila de años: un solo año desconocido
    for (let c = first; c < head.length; c++) {
      const name = norm(head[c]);
      if (name === 'ventas pesos' && !measures.some((m) => m.m === 'v')) measures.push({ c, year: 0, m: 'v' });
      if (name.startsWith('% variaci') && !measures.some((m) => m.m === 'var')) measures.push({ c, year: 0, m: 'var' });
    }
  }
  const years = [...new Set(measures.map((m) => m.year))].sort((a, b) => b - a);
  const col = (y, m) => measures.find((x) => x.year === y && x.m === m)?.c;
  const Y = years[0], Y1 = years[1];

  const rows = [], totals = dims.map(() => new Map());
  const fill = dims.map(() => null);
  let grand = null;
  for (let r = h + 1; r < aoa.length; r++) {
    const row = aoa[r] || [];
    if (row.every((c) => c == null || c === '')) continue;
    for (let i = 0; i < dims.length; i++) {
      if (row[i] != null && row[i] !== '') { fill[i] = row[i]; for (let j = i + 1; j < dims.length; j++) fill[j] = null; }
    }
    const tIdx = dims.findIndex((_, i) => isTotal(row[i]));
    const vals = { vY: num(row[col(Y, 'v')]), varY: num(row[col(Y, 'var')]), vY1: Y1 ? num(row[col(Y1, 'v')]) : null, varY1: Y1 ? num(row[col(Y1, 'var')]) : null };
    if (tIdx >= 0) {
      const name = String(row[tIdx]).replace(/\s*total\s*$/i, '').trim();
      if (/grand total|total general/i.test(row[tIdx])) grand = vals; else totals[tIdx].set(name, vals);
      continue;
    }
    if (fill[dims.length - 1] == null) continue;
    rows.push({ fila: r + 1, d: fill.map((x) => (x == null ? '' : String(x).trim())), ...vals });
  }
  if (!rows.length) throw new Error('El archivo no tiene renglones de datos debajo del encabezado.');
  const info = { dims, Y, Y1, headerRow: h + 1, totals, grand };
  if (years.length >= 2) return { scenario: 'ventas-anual', data: { rows, ...info } };
  const leaf = norm(dims.at(-1));
  if (leaf.includes('cliente')) return { scenario: 'ventas-clientes', data: { rows, ...info } };
  throw new Error(`Encontré ventas de un solo año por "${dims.at(-1)}". Para un solo año necesito el detalle por cliente (Desc. Cliente principal).`);
}

function parseFamilia(aoa) {
  const h = findRow(aoa, (c) => c === 'venta periodo act.');
  const head = aoa[h].map(norm);
  const ix = (re) => head.findIndex((c) => re.test(c));
  const C = {
    g: ix(/^grupo/), f: ix(/^familia$/), pAnt: ix(/^venta periodo ant/), pAct: ix(/^venta periodo act/),
    tAnt: ix(/^venta trimestre ant/), tAct: ix(/^venta trimestre act/), pPct: ix(/^periodo act\. vs/), tPct: ix(/^trimestre act\. vs/),
  };
  if (C.f < 0 || C.pAnt < 0 || C.tAnt < 0) throw new Error('El reporte por familia no tiene las columnas esperadas (Familia, Venta periodo, Venta trimestre).');
  const rows = [], totals = [];
  let grp = null;
  for (let r = h + 1; r < aoa.length; r++) {
    const row = aoa[r] || [];
    if (row.every((c) => c == null || c === '')) continue;
    if (isTotal(row[C.g]) || isTotal(row[C.f])) { totals.push({ nombre: row[C.g] || row[C.f], pAnt: num(row[C.pAnt]), pAct: num(row[C.pAct]) }); continue; }
    if (C.g >= 0 && row[C.g] != null && row[C.g] !== '') grp = String(row[C.g]).trim();
    if (row[C.f] == null) continue;
    rows.push({ fila: r + 1, grupo: grp || 'Sin grupo', familia: String(row[C.f]).trim(), pAnt: num(row[C.pAnt]), pAct: num(row[C.pAct]),
      tAnt: num(row[C.tAnt]), tAct: num(row[C.tAct]), pPct: num(row[C.pPct]), tPct: num(row[C.tPct]) });
  }
  return { scenario: 'ventas-familia', data: { rows, totals, headerRow: h + 1 } };
}

/* ---------- Cartera vencida (hoja "antiguedad") ---------- */
export const CARTERA_SHEET = (names) => names.find((n) => norm(n) === 'antiguedad') || null;

export function parseCartera(aoa) {
  const h = findRow(aoa, (c) => c === '> 15 dias', 8);
  if (h < 0) throw new Error('No encontré la columna "> 15 días" en la hoja de antigüedad.');
  const head = aoa[h].map(norm);
  const ix = (name) => head.indexOf(norm(name));
  const C = { zona: ix('Zona'), vend: ix('Vendedor'), cve: ix('Cve Cte'), cli: ix('Cliente'), saldo: ix('Saldo'), gestor: ix('Gestor'),
    v15: ix('> 15 días'), c15: ix('Cliente + 15'), mes: ix('Mes'), tablero: ix('Tablero') };
  const miss = Object.entries(C).filter(([, v]) => v < 0).map(([k]) => k);
  if (miss.length) throw new Error(`Faltan columnas en la hoja de antigüedad: ${miss.join(', ')}.`);
  const recs = [];
  for (let r = h + 1; r < aoa.length; r++) {
    const row = aoa[r];
    if (!row) continue;
    const tab = norm(row[C.tablero]), ges = String(row[C.gestor] ?? '').trim().toUpperCase();
    if (tab !== 'mostradores' || (ges !== 'CR01' && ges !== 'CR02')) continue; // sin autoconsumo, solo CR01-CR02
    const d = excelSerialToDate(row[C.mes]);
    if (!d) continue;
    recs.push({ zona: String(row[C.zona] ?? '').trim(), vend: String(row[C.vend] ?? '').trim(), cve: String(row[C.cve] ?? '').trim(),
      cli: String(row[C.cli] ?? '').trim(), saldo: num(row[C.saldo]) || 0, v15: num(row[C.v15]) || 0, c15: num(row[C.c15]) || 0, mes: monthKey(d) });
  }
  if (!recs.length) throw new Error('No hay renglones de Mostradores CR01-CR02 en la hoja de antigüedad.');
  const meses = [...new Set(recs.map((r) => r.mes))].sort();
  const zonas = [...new Set(recs.map((r) => r.zona))].filter(Boolean).sort((a, b) => a.localeCompare(b, 'es'));
  return { scenario: 'cartera', data: { recs, meses, zonas, total: aoa.length - h - 1 } };
}
