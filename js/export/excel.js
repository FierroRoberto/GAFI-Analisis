/* ==========================================================================
   Exportación a Excel con ExcelJS (global window.ExcelJS)
   ========================================================================== */
import { CATS, NC, MATRIX_LAYOUT, sum, fmt, monthLabel, keyToDate, todayLong } from '../core/utils.js';
import { plural } from '../core/solutions.js';

const X = () => globalThis.ExcelJS;
const FONT = 'Arial';
const NAVY = 'FF1F3A5F', BLUE = 'FF0000FF';
const MON = '$#,##0;-$#,##0;-', PCT = '0.0%;-0.0%;0.0%', INT = '#,##0;-#,##0;-', PCT2 = '0.00%';

function sheet(wb, name, cols) {
  const ws = wb.addWorksheet(name, { views: [{ state: 'frozen', ySplit: 1 }] });
  ws.columns = cols.map((c) => ({ header: c.h, key: c.k, width: c.w || 14, style: { font: { name: FONT, size: 10 }, numFmt: c.f } }));
  const hr = ws.getRow(1);
  hr.height = 40;
  hr.eachCell((cell) => {
    cell.font = { name: FONT, size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
    cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };
  });
  return ws;
}
const finish = (ws) => { if (ws.rowCount > 1) ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: ws.rowCount, column: ws.columnCount } }; };
const val = (x) => (x == null || (typeof x === 'number' && !Number.isFinite(x)) ? null : x);
const wrapCols = (ws, keys) => ws.eachRow((row, i) => { if (i > 1) keys.forEach((k) => { const c = row.getCell(k); c.alignment = { wrapText: true, vertical: 'top' }; }); });

function notesSheet(wb, title, items) {
  const ws = wb.addWorksheet('Reglas y notas');
  ws.getColumn(1).width = 4; ws.getColumn(2).width = 28; ws.getColumn(3).width = 110;
  ws.getCell('B1').value = title; ws.getCell('B1').font = { name: FONT, size: 13, bold: true, color: { argb: NAVY } };
  ws.getCell('B2').value = `Generado por GAFI Analizador · ${todayLong()}`; ws.getCell('B2').font = { name: FONT, size: 9, italic: true };
  let r = 4;
  if (items.matrix) {
    ws.getCell(`B${r}`).value = 'Año Anterior ↓ / Último Año →'; ws.getCell(`B${r}`).font = { name: FONT, bold: true, size: 9 };
    r++;
    ['', '> +10 %', '±10 %', '< −10 %'].forEach((h, j) => { if (h) { const c = ws.getCell(r, 2 + j); c.value = h; c.font = { name: FONT, bold: true, color: { argb: 'FFFFFFFF' } }; c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } }; } });
    for (const [lab, cats] of MATRIX_LAYOUT) {
      r++; const c = ws.getCell(r, 2); c.value = lab; c.font = { name: FONT, bold: true, color: { argb: 'FFFFFFFF' } }; c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
      cats.forEach((v, j) => { const x = ws.getCell(r, 3 + j); x.value = v; x.font = { name: FONT }; x.alignment = { horizontal: 'center' }; });
    }
    ws.getColumn(4).width = 22; ws.getColumn(5).width = 22; r += 2;
  }
  for (const [k, v] of items.rows) {
    ws.getCell(r, 2).value = k; ws.getCell(r, 2).font = { name: FONT, bold: true, size: 10 };
    ws.getCell(r, 3).value = v; ws.getCell(r, 3).font = { name: FONT, size: 10 }; ws.getCell(r, 3).alignment = { wrapText: true, vertical: 'top' };
    r++;
  }
}

function paretoRows(ws, level, rows, map) {
  for (const r of rows) ws.addRow({ nivel: level, rank: r.rank, ...map(r), share: r.share, cum: r.cum, p80: r.inPareto ? 'Sí' : 'No' });
}

function resumenSheet(wb, dims, byDim, missing = []) {
  const cols = [{ h: 'Dimensión', k: 'dim', w: 26 }, { h: 'Estatus', k: 'st', w: 22 }, { h: '# Entidades', k: 'n', w: 10, f: INT },
    ...[...CATS, NC].map((c) => ({ h: c, k: c, w: 11, f: INT })), { h: 'Impacto caídas $', k: 'neg', w: 15, f: MON }, { h: 'Impacto crecimientos $', k: 'pos', w: 15, f: MON },
    { h: 'Impacto neto $', k: 'net', w: 15, f: MON }, { h: '# Pareto 80% caídas', k: 'pn', w: 11, f: INT }, { h: '# Pareto 80% crecimientos', k: 'pp', w: 11, f: INT }];
  const ws = sheet(wb, 'Resumen por dimensión', cols);
  for (const m of missing) ws.addRow({ dim: m, st: 'No disponible en archivo' });
  for (const d of dims) {
    const D = byDim[d];
    ws.addRow({ dim: d, st: D.ents.length > 1 ? 'Analizada' : 'Analizada (1 entidad)', n: D.ents.length, ...D.counts, neg: -D.neg.total, pos: D.pos.total, net: D.pos.total - D.neg.total, pn: D.neg.n80, pp: D.pos.n80 });
  }
  finish(ws);
}

async function toBlob(wb) {
  const buf = await wb.xlsx.writeBuffer();
  return new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

/* =================================================================== */
export async function excelVentasAnual(A) {
  const wb = new (X().Workbook)(); wb.creator = 'GAFI Analizador';
  const { Y, Y1, dims } = A;
  /* 1. Datos depurados */
  let ws = sheet(wb, 'Datos depurados', [{ h: 'Fila origen', k: 'fila', w: 9 }, ...dims.map((d, i) => ({ h: d, k: `d${i}`, w: 28 })),
    { h: `Ventas pesos (${Y})`, k: 'vY', w: 15, f: MON }, { h: `Ventas pesos año anterior (${Y1})`, k: 'vY1', w: 15, f: MON },
    { h: `% Variacion pesos — Último Año (${Y} vs ${Y1})`, k: 'varY', w: 15, f: PCT }, { h: `Año Anterior (% Var ${Y1} vs ${Y1 - 1})`, k: 'varY1', w: 15, f: PCT },
    { h: `Ventas pesos ${Y1 - 1} (calculada)`, k: 'v2', w: 15, f: MON }, { h: 'Variación $', k: 'imp', w: 15, f: MON }, { h: 'Impacto absoluto', k: 'abs', w: 14, f: MON },
    { h: 'Categoría', k: 'cat', w: 18 }, { h: 'Observación', k: 'obs', w: 40 }]);
  for (const r of A.rows) ws.addRow({ fila: r.fila, ...Object.fromEntries(r.d.map((x, i) => [`d${i}`, x])), vY: val(r.vY), vY1: val(r.vY1), varY: val(r.varY), varY1: val(r.varY1),
    v2: val(r.vPrev2), imp: r.impact, abs: Math.abs(r.impact), cat: r.category, obs: r.obs || null });
  finish(ws);
  /* 2. Clasificación */
  ws = sheet(wb, 'Clasificación', [{ h: 'Dimensión', k: 'dim', w: 14 }, { h: 'Entidad', k: 'name', w: 36 }, { h: `Ventas pesos (${Y})`, k: 'vAct', w: 15, f: MON },
    { h: `Ventas pesos (${Y1})`, k: 'vPrev', w: 15, f: MON }, { h: `Ventas pesos ${Y1 - 1} (calc.)`, k: 'vPrev2', w: 15, f: MON },
    { h: `Año Anterior (${Y1} vs ${Y1 - 1})`, k: 'varAnt', w: 14, f: PCT }, { h: `Último Año (${Y} vs ${Y1})`, k: 'varUlt', w: 14, f: PCT },
    { h: 'Variación $', k: 'impact', w: 15, f: MON }, { h: 'Impacto absoluto', k: 'absImpact', w: 14, f: MON }, { h: 'Categoría', k: 'category', w: 18 }, { h: '# Renglones', k: 'n', w: 10, f: INT }]);
  for (const d of dims) for (const e of A.byDim[d].ents) ws.addRow({ ...e, varAnt: val(e.varAnt), varUlt: val(e.varUlt), dim: d });
  finish(ws);
  /* 3-4. Pareto */
  const pcols = [{ h: 'Dimensión', k: 'nivel', w: 14 }, { h: 'Rank', k: 'rank', w: 7 }, { h: 'Entidad', k: 'name', w: 36 }, { h: 'Categoría', k: 'category', w: 18 },
    { h: `Ventas (${Y})`, k: 'vAct', w: 15, f: MON }, { h: `Ventas (${Y1})`, k: 'vPrev', w: 15, f: MON }, { h: 'Último Año', k: 'varUlt', w: 12, f: PCT }, { h: 'Año Anterior', k: 'varAnt', w: 12, f: PCT },
    { h: 'Variación $', k: 'impact', w: 15, f: MON }, { h: '% del impacto', k: 'share', w: 11, f: PCT }, { h: '% acumulado', k: 'cum', w: 11, f: PCT }, { h: 'Dentro del Pareto 80%', k: 'p80', w: 11 }];
  for (const [name, key] of [['Pareto caídas', 'neg'], ['Pareto crecimientos', 'pos']]) {
    ws = sheet(wb, name, pcols);
    for (const d of dims) paretoRows(ws, d, A.byDim[d][key].rows, (r) => ({ name: r.name, category: r.category, vAct: r.vAct, vPrev: r.vPrev, varUlt: val(r.varUlt), varAnt: val(r.varAnt), impact: r.impact }));
    finish(ws);
  }
  resumenSheet(wb, dims, A.byDim, ['Desc. Cliente principal', 'Desc. Cliente', 'Zona'].filter((m) => !dims.includes(m)));
  planSheet(wb, A.plan.map((p) => ({ ...p, extra1: p.dim })), 'Dimensión');
  notesSheet(wb, 'Reglas y notas · Ventas comparativo anual', { matrix: true, rows: [
    ['Año Anterior', `% variación ${Y1} vs ${Y1 - 1}`], ['Último Año', `% variación ${Y} vs ${Y1} (métrica principal)`],
    ['Impacto', 'Ventas año actual − ventas año anterior; Pareto por impacto absoluto hasta cruzar el 80%.'],
    ['Exclusiones', A.excluded.length ? `${A.excluded.length} renglones de vendedores con "Casa"/"Ocasional" en el nombre (${fmt.money(sum(A.excluded, (r) => r.vY ?? 0))}).` : 'Ninguna.'],
    ['No disponibles', 'Cubrimiento cuota, Ventas unidades, % Variacion unidades y las dimensiones que no vienen en el archivo.']] });
  return toBlob(wb);
}

function planSheet(wb, plan, extraLabel, extraKey = 'extra1') {
  const ws = sheet(wb, 'Plan de acción', [{ h: 'Prioridad', k: 'p', w: 9 }, { h: 'Entidad', k: 'entity', w: 34 }, { h: extraLabel, k: 'extra', w: 14 }, { h: 'Categoría', k: 'category', w: 17 },
    { h: '% Variacion pesos', k: 'varUlt', w: 12, f: PCT }, { h: 'Año Anterior', k: 'varAnt', w: 12, f: PCT }, { h: 'Variación $', k: 'impact', w: 14, f: MON },
    { h: 'Impacto absoluto', k: 'absImpact', w: 14, f: MON }, { h: 'Ventas actuales', k: 'vAct', w: 14, f: MON }, { h: 'Cubrimiento cuota', k: 'cuota', w: 13 },
    { h: '% Variacion unidades', k: 'unid', w: 13 }, { h: 'Dentro del Pareto 80%', k: 'p80', w: 11 }, { h: 'Diagnóstico (basado en datos)', k: 'diag', w: 60 }, { h: 'Soluciones recomendadas', k: 'sol', w: 90 }]);
  plan.forEach((x, i) => {
    const row = ws.addRow({ p: i + 1, entity: x.entity, extra: x[extraKey], category: x.category, varUlt: val(x.varUlt), varAnt: val(x.varAnt), impact: x.impact, absImpact: x.absImpact,
      vAct: x.vAct, cuota: 'No disponible', unid: 'No disponible', p80: x.inPareto ? 'Sí' : 'No', diag: x.diag, sol: x.solutions.map((s, k) => `${k + 1}. ${s}`).join('\n') });
    row.height = 15 * Math.max(4, x.solutions.length + 2);
  });
  wrapCols(ws, ['entity', 'diag', 'sol']);
  finish(ws);
}

/* =================================================================== */
export async function excelVentasFamilia(B) {
  const wb = new (X().Workbook)(); wb.creator = 'GAFI Analizador';
  const L = B.lab;
  let ws = sheet(wb, 'Datos depurados', [{ h: 'Fila origen', k: 'fila', w: 9 }, { h: 'Grupo familia', k: 'grupo', w: 14 }, { h: 'Familia', k: 'familia', w: 32 },
    { h: 'Venta periodo Ant.', k: 'pAnt', w: 14, f: MON }, { h: 'Venta periodo Act.', k: 'pAct', w: 14, f: MON }, { h: 'Venta trimestre Ant.', k: 'tAnt', w: 14, f: MON },
    { h: 'Venta trimestre Act.', k: 'tAct', w: 14, f: MON }, { h: '% Periodo (recalc.)', k: 'vp', w: 12, f: PCT }, { h: '% Trimestre (recalc.)', k: 'vt', w: 12, f: PCT },
    { h: 'Variación $ periodo', k: 'dp', w: 14, f: MON }, { h: 'Variación $ trimestre', k: 'dt', w: 14, f: MON }, { h: 'Observación', k: 'obs', w: 44 }]);
  for (const r of B.rows) ws.addRow({ ...r, pAnt: val(r.pAnt), pAct: val(r.pAct), tAnt: val(r.tAnt), tAct: val(r.tAct), vp: r.pAnt0 > 0 ? r.pAct0 / r.pAnt0 - 1 : null,
    vt: r.tAnt0 > 0 ? r.tAct0 / r.tAnt0 - 1 : null, dp: r.pAct0 - r.pAnt0, dt: r.tAct0 - r.tAnt0, obs: r.obs || null });
  finish(ws);
  ws = sheet(wb, 'Clasificación', [{ h: 'Dimensión', k: 'dim', w: 14 }, { h: 'Entidad', k: 'name', w: 34 }, { h: 'Grupo familia', k: 'grupo', w: 13 },
    { h: 'Venta periodo Ant.', k: 'pAnt', w: 14, f: MON }, { h: 'Venta periodo Act.', k: 'pAct', w: 14, f: MON }, { h: 'Venta trimestre Ant.', k: 'tAnt', w: 14, f: MON }, { h: 'Venta trimestre Act.', k: 'tAct', w: 14, f: MON },
    { h: `Año Anterior = % ${L.ant}`, k: 'varAnt', w: 13, f: PCT }, { h: `Último Año = % ${L.ult}`, k: 'varUlt', w: 13, f: PCT },
    { h: `Variación $ ${L.ult.toLowerCase()}`, k: 'impact', w: 14, f: MON }, { h: `Variación $ ${L.ant.toLowerCase()}`, k: 'impactAlt', w: 14, f: MON }, { h: 'Categoría', k: 'category', w: 18 }]);
  for (const d of ['Grupo familia', 'Familia']) for (const e of B.byDim[d].ents) ws.addRow({ ...e, dim: d, varAnt: val(e.varAnt), varUlt: val(e.varUlt) });
  finish(ws);
  const pcols = [{ h: 'Dimensión', k: 'nivel', w: 16 }, { h: 'Rank', k: 'rank', w: 7 }, { h: 'Entidad', k: 'name', w: 34 }, { h: 'Categoría', k: 'category', w: 18 },
    { h: `Venta ${L.ult.toLowerCase()} Act.`, k: 'vAct', w: 14, f: MON }, { h: `Venta ${L.ult.toLowerCase()} Ant.`, k: 'vPrev', w: 14, f: MON }, { h: `% ${L.ult}`, k: 'varUlt', w: 11, f: PCT },
    { h: `% ${L.ant}`, k: 'varAnt', w: 11, f: PCT }, { h: 'Variación $', k: 'impact', w: 14, f: MON }, { h: '% del impacto', k: 'share', w: 11, f: PCT }, { h: '% acumulado', k: 'cum', w: 11, f: PCT }, { h: 'Dentro del Pareto 80%', k: 'p80', w: 11 }];
  const map = (r) => ({ name: r.name, category: r.category, vAct: r.vAct, vPrev: r.vPrev, varUlt: val(r.varUlt), varAnt: val(r.varAnt), impact: r.impact });
  for (const [name, key] of [['Pareto caídas', 'neg'], ['Pareto crecimientos', 'pos']]) {
    ws = sheet(wb, name, pcols);
    for (const d of ['Grupo familia', 'Familia']) paretoRows(ws, d, B.byDim[d][key].rows, map);
    finish(ws);
  }
  ws = sheet(wb, `Pareto caídas ${L.ant.toLowerCase()}`, pcols);
  paretoRows(ws, `Familia (${L.ant.toLowerCase()})`, B.byDim.Familia.alt.rows, (r) => ({ ...map(r), impact: r.impact }));
  finish(ws);
  resumenSheet(wb, ['Familia', 'Grupo familia'], B.byDim, ['Desc. Cliente principal', 'Desc. Cliente', 'Zona', 'Vendedor']);
  planSheet(wb, B.plan, 'Grupo familia', 'grupo');
  notesSheet(wb, 'Reglas y notas · Ventas por familia', { matrix: true, rows: [
    ['Supuesto clave', `"Último Año" = % ${L.ult} actual vs anterior (métrica principal y base del Pareto). "Año Anterior" = % ${L.ant}.`],
    ['Porcentajes', 'Recalculados desde los pesos; el archivo los trae redondeados a enteros.'],
    ['Consolidados', B.dupNames.length ? `Familias repetidas en dos grupos, sumadas por nombre: ${B.dupNames.join(', ')}.` : 'Ninguno.'],
    ['No disponibles', 'Vendedor, cliente, zona, cubrimiento de cuota y unidades.']] });
  return toBlob(wb);
}

/* =================================================================== */
export async function excelVentasClientes(C) {
  const wb = new (X().Workbook)(); wb.creator = 'GAFI Analizador';
  const U = fmt.money(C.umbral);
  let ws = sheet(wb, 'Resumen por vendedor', [{ h: 'Vendedor', k: 'name', w: 32 }, { h: 'Clientes activos', k: 'clientes', w: 10, f: INT }, { h: `Clientes > ${U}/mes`, k: 'arriba', w: 11, f: INT },
    { h: `% clientes > ${U}`, k: 'pctArriba', w: 10, f: PCT }, { h: `Clientes ≤ ${U}/mes`, k: 'menor', w: 11, f: INT }, { h: `Cerca del umbral (${fmt.money(C.cerca)}–${U})`, k: 'cerca', w: 11, f: INT },
    { h: 'Ventas pesos', k: 'venta', w: 15, f: MON }, { h: `Venta de clientes > ${U}`, k: 'ventaArriba', w: 15, f: MON }, { h: `% venta de clientes > ${U}`, k: 'pctVentaArriba', w: 11, f: PCT },
    { h: 'Promedio mensual por cliente', k: 'prom', w: 13, f: MON }, { h: 'Clientes nuevos', k: 'nuevos', w: 9, f: INT }, { h: 'Crecen > 10%', k: 'crecen', w: 9, f: INT },
    { h: 'Estables ±10%', k: 'estables', w: 9, f: INT }, { h: 'Caen > 10%', k: 'caen', w: 9, f: INT }, { h: 'Subieron de nivel', k: 'subieron', w: 9, f: INT }, { h: 'Bajaron de nivel', k: 'bajaron', w: 9, f: INT },
    { h: `Clientes > ${U} año anterior`, k: 'arriba25', w: 11, f: INT }, { h: 'Público en general (cuentas)', k: 'publico', w: 10, f: INT }, { h: 'Venta Público en general', k: 'ventaPublico', w: 14, f: MON },
    { h: 'Ventas año anterior', k: 'vPrev', w: 15, f: MON }, { h: '% Variacion pesos', k: 'varV', w: 10, f: PCT }, { h: 'Variación $', k: 'impact', w: 14, f: MON },
    { h: 'Venta año anterior de clientes sin compra (est.)', k: 'perdidos', w: 16, f: MON }]);
  for (const v of C.vend) ws.addRow({ ...v, menor: v.clientes - v.arriba, varV: val(v.varV) });
  const T = C.T;
  const tr = ws.addRow({ name: 'Total', clientes: T.clientes, arriba: T.arriba, pctArriba: T.pctArriba, menor: T.clientes - T.arriba, cerca: T.cerca, venta: T.venta, ventaArriba: T.ventaArriba,
    pctVentaArriba: T.pctVentaArriba, prom: T.ventaActiva / T.clientes / C.meses, nuevos: T.nuevos, crecen: sum(C.vend, (v) => v.crecen), estables: sum(C.vend, (v) => v.estables),
    caen: sum(C.vend, (v) => v.caen), subieron: T.subieron, bajaron: T.bajaron, arriba25: T.arriba25, publico: T.publico, ventaPublico: T.ventaPublico, vPrev: T.vPrev, varV: T.var, impact: T.venta - T.vPrev, perdidos: T.perdidos });
  tr.eachCell((c) => { c.font = { name: FONT, size: 10, bold: true }; c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEF2F7' } }; });
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: C.vend.length + 1, column: ws.columnCount } };

  ws = sheet(wb, 'Datos depurados', [{ h: 'Fila origen', k: 'fila', w: 9 }, { h: 'Vendedor', k: 'vend', w: 30 }, { h: 'Desc. Cliente principal', k: 'cli', w: 40 },
    { h: 'Público en general', k: 'pub', w: 9 }, { h: 'Ventas pesos', k: 'v', w: 14, f: MON }, { h: '% Variacion pesos', k: 'var', w: 11, f: PCT }, { h: 'Ventas año anterior (calc.)', k: 'vPrev', w: 14, f: MON },
    { h: 'Variación $', k: 'impact', w: 14, f: MON }, { h: 'Promedio mensual', k: 'prom', w: 13, f: MON }, { h: 'Cliente activo', k: 'act', w: 8 }, { h: `> ${U}/mes`, k: 'arr', w: 8 },
    { h: 'Segmento mensual', k: 'seg', w: 16 }, { h: 'Tendencia', k: 'tend', w: 20 }, { h: 'Cerca del umbral', k: 'cer', w: 9 }, { h: 'Movimiento vs umbral', k: 'mov', w: 22 }]);
  for (const c of [...C.clients].sort((a, b) => a.vend.localeCompare(b.vend) || b.v - a.v)) ws.addRow({ ...c, var: val(c.var), pub: c.publico ? 'Sí' : 'No', act: c.activo ? 'Sí' : 'No', arr: c.arriba ? 'Sí' : 'No', cer: c.cerca ? 'Sí' : 'No' });
  finish(ws);

  ws = sheet(wb, 'Clasificación', [{ h: 'Vendedor', k: 'name', w: 32 }, ...C.segRows.map((s) => ({ h: s.key, k: s.key, w: 11, f: INT })), { h: 'Total activos', k: 'tot', w: 10, f: INT },
    { h: 'Nuevos', k: 'nuevos', w: 10, f: INT }, { h: 'Crecen > 10%', k: 'crecen', w: 10, f: INT }, { h: 'Estables ±10%', k: 'estables', w: 10, f: INT }, { h: 'Caen > 10%', k: 'caen', w: 10, f: INT }]);
  for (const v of C.vend) ws.addRow({ name: v.name, ...Object.fromEntries(C.segRows.map((s) => [s.key, C.clients.filter((c) => c.vend === v.name && c.seg === s.key).length])), tot: v.clientes, nuevos: v.nuevos, crecen: v.crecen, estables: v.estables, caen: v.caen });
  finish(ws);

  const pcols = [{ h: 'Nivel', k: 'nivel', w: 10 }, { h: 'Rank', k: 'rank', w: 7 }, { h: 'Vendedor', k: 'vend', w: 30 }, { h: 'Cliente', k: 'cli', w: 40 }, { h: 'Ventas pesos', k: 'v', w: 14, f: MON },
    { h: 'Ventas año anterior', k: 'vPrev', w: 14, f: MON }, { h: '% Variacion pesos', k: 'var', w: 11, f: PCT }, { h: 'Variación $', k: 'impact', w: 14, f: MON },
    { h: '% del impacto', k: 'share', w: 11, f: PCT }, { h: '% acumulado', k: 'cum', w: 11, f: PCT }, { h: 'Dentro del Pareto 80%', k: 'p80', w: 11 }];
  for (const [name, cv, vv] of [['Pareto caídas', C.cneg, C.vneg], ['Pareto crecimientos', C.cpos, C.vpos]]) {
    ws = sheet(wb, name, pcols);
    paretoRows(ws, 'Vendedor', vv.rows, (r) => ({ vend: r.name, cli: '(total vendedor)', v: r.venta, vPrev: r.vPrev, var: val(r.varV), impact: r.impact }));
    paretoRows(ws, 'Cliente', cv.rows, (r) => ({ vend: r.vend, cli: r.cli, v: r.v, vPrev: r.vPrev, var: val(r.var), impact: r.impact }));
    finish(ws);
  }
  ws = sheet(wb, 'Plan de acción', [{ h: 'Prioridad', k: 'p', w: 9 }, { h: 'Tipo', k: 'tipo', w: 10 }, { h: 'Entidad', k: 'entity', w: 36 }, { h: 'Vendedor', k: 'vendedor', w: 28 },
    { h: 'Severidad', k: 'severidad', w: 16 }, { h: '% Variacion pesos', k: 'varUlt', w: 11, f: PCT }, { h: 'Variación $', k: 'impact', w: 14, f: MON }, { h: 'Ventas pesos', k: 'vAct', w: 14, f: MON },
    { h: 'Cubrimiento cuota', k: 'cuota', w: 12 }, { h: '% Variacion unidades', k: 'unid', w: 12 }, { h: 'Diagnóstico (basado en datos)', k: 'diag', w: 60 }, { h: 'Soluciones recomendadas', k: 'sol', w: 90 }]);
  C.plan.forEach((x, i) => { const r = ws.addRow({ ...x, p: i + 1, varUlt: val(x.varUlt), cuota: 'No disponible', unid: 'No disponible', sol: x.solutions.map((s, k) => `${k + 1}. ${s}`).join('\n') }); r.height = 15 * Math.max(4, x.solutions.length + 2); });
  wrapCols(ws, ['entity', 'diag', 'sol']); finish(ws);

  ws = sheet(wb, 'Excluidos', [{ h: 'Fila origen', k: 'fila', w: 9 }, { h: 'Vendedor', k: 'vend', w: 24 }, { h: 'Desc. Cliente principal', k: 'cli', w: 40 }, { h: 'Ventas pesos', k: 'vY', w: 14, f: MON },
    { h: '% Variacion pesos', k: 'varY', w: 11, f: PCT }, { h: 'Motivo', k: 'm', w: 44 }]);
  for (const r of C.excluded) ws.addRow({ ...r, vY: val(r.vY), varY: val(r.varY), m: 'Vendedor con "Casa"/"Ocasional" en el nombre' });
  finish(ws);
  notesSheet(wb, 'Parámetros y reglas · Clientes por vendedor', { rows: [
    ['Umbral mensual', `${U} (promedio mensual = venta / ${C.meses} meses)`], ['Cerca del umbral', `${fmt.money(C.cerca)} a ${U} al mes`],
    ['Cliente activo', 'Venta neta > $0.'], ['Público en general', 'Cada cuenta cuenta como 1 cliente del vendedor.'],
    ['Venta año anterior', 'Por cliente: venta / (1 + % variación); sin % = nuevo. Clientes sin compra en el año actual se estiman por diferencia contra el total del vendedor.'],
    ['Exclusiones', 'Vendedores con "Casa" u "Ocasional" en el nombre (hoja Excluidos).']] });
  return toBlob(wb);
}

/* =================================================================== */
/* Cartera Vencida.xlsx · formato de la Guía 80-20 (Calibri, encabezados azules, amarillo de corte) */
const G = { head: 'FF3B618E', title: 'FF808080', gray: 'FFBFBFBF', light: 'FFDCE6F2', yellow: 'FFFFFF00', hl: 'FFFCE4D6' };
const thin = { style: 'thin', color: { argb: 'FF000000' } };
const box = { top: thin, left: thin, bottom: thin, right: thin };
const cal = (o = {}) => ({ name: 'Calibri', size: o.size || 11, bold: !!o.bold, color: o.color ? { argb: o.color } : undefined });
const fill = (argb) => ({ type: 'pattern', pattern: 'solid', fgColor: { argb } });

export async function excelCartera(R) {
  const wb = new (X().Workbook)(); wb.creator = 'GAFI Analizador';
  const set = (ws, addr, value, st = {}) => {
    const c = ws.getCell(addr); c.value = value;
    c.font = cal(st); c.border = st.border === false ? undefined : box;
    if (st.fill) c.fill = fill(st.fill);
    if (st.fmt) c.numFmt = st.fmt;
    c.alignment = { horizontal: st.align || (typeof value === 'string' ? 'left' : 'right'), vertical: 'middle', wrapText: !!st.wrap };
    return c;
  };
  const L = (n) => { let s = ''; n++; while (n) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; };

  /* ---------- Resumen ---------- */
  let ws = wb.addWorksheet('Resumen');
  ws.mergeCells('A1:N1'); set(ws, 'A1', 'CLIENTES CON CARTERA VENCIDA A MAS DE 15 DIAS', { bold: true, size: 12, fill: G.title, color: 'FFFFFFFF', align: 'center' });
  ws.mergeCells('R1:S1'); set(ws, 'R1', 'Sin Autoconsumo', { bold: true, fill: G.head, color: 'FFFFFFFF', align: 'center' });
  set(ws, 'A2', 'Zona', { bold: true, fill: G.head, color: 'FFFFFFFF', align: 'center' });
  R.m13.forEach((m, j) => set(ws, `${L(1 + j)}2`, keyToDate(m), { bold: true, fill: G.head, color: 'FFFFFFFF', align: 'center', fmt: 'mmm-yy' }));
  ['Cve Zona', 'Zona', ' > 15 días', ' % 15 dias'].forEach((h, j) => set(ws, `${L(15 + j)}2`, h, { bold: true, fill: G.head, color: 'FFFFFFFF', align: 'center' }));
  R.conteo.forEach((z, i) => {
    const r = 3 + i, me = z.zona === R.cedis;
    set(ws, `A${r}`, z.zona, { bold: true, align: 'center', fill: me ? G.hl : undefined });
    R.m13.forEach((m, j) => set(ws, `${L(1 + j)}${r}`, z.per[m], { align: 'center', fmt: '0', fill: me ? G.hl : undefined, bold: me }));
  });
  R.ranking.forEach((z, i) => {
    const r = 3 + i, me = z.zona === R.cedis;
    set(ws, `P${r}`, i + 1, { bold: true, fill: G.light, align: 'center' });
    set(ws, `Q${r}`, z.zona, { align: 'center', fill: me ? G.hl : undefined, bold: me });
    set(ws, `R${r}`, Math.round(z.v15 * 100) / 100, { fmt: '"$"#,##0', fill: me ? G.hl : undefined, bold: me });
    set(ws, `S${r}`, z.pct, { fmt: '0.00%', fill: me ? G.hl : undefined, bold: me });
  });
  const tr = 3 + R.conteo.length, last = tr - 1;
  set(ws, `A${tr}`, 'Total general', { bold: true, fill: G.head, color: 'FFFFFFFF', align: 'center' });
  R.m13.forEach((m, j) => { const c = L(1 + j); set(ws, `${c}${tr}`, { formula: `SUM(${c}3:${c}${last})`, result: sum(R.conteo, (z) => z.per[m]) }, { fill: G.head, color: 'FFFFFFFF', align: 'center', fmt: '0' }); });
  ws.mergeCells(`P${tr}:Q${tr}`); set(ws, `P${tr}`, 'Total general', { bold: true, align: 'center' });
  const tv = sum(R.ranking, (z) => z.v15), ts = sum(R.ranking, (z) => z.saldo);
  set(ws, `R${tr}`, { formula: `SUM(R3:R${last})`, result: tv }, { bold: true, fmt: '"$"#,##0' });
  set(ws, `S${tr}`, ts ? tv / ts : 0, { bold: true, fmt: '0.00%' });
  ws.addConditionalFormatting({ ref: `S3:S${last}`, rules: [{ type: 'cellIs', operator: 'greaterThan', formulae: ['0.0351'], style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFFFEB9C' } }, font: { color: { argb: 'FF9C6500' } } } }] });
  ws.getColumn(1).width = 16; for (let j = 1; j <= 13; j++) ws.getColumn(1 + j).width = 7.4;
  ws.getColumn(15).width = 3; ws.getColumn(16).width = 9; ws.getColumn(17).width = 20; ws.getColumn(18).width = 14; ws.getColumn(19).width = 11;

  /* ---------- Desplegado Clientes ---------- */
  ws = wb.addWorksheet('Desplegado Clientes', { views: [{ state: 'frozen', ySplit: 1 }] });
  const H = ['No', '%', 'VENDEDOR', 'CLIENTE', ...R.m5, '% SUMA ACUM', '% REL ACUM', 'Total', 'COMENTARIOS'];
  H.forEach((h, j) => set(ws, `${L(j)}1`, j >= 4 && j < 9 ? keyToDate(h) : h, { bold: true, size: 12, fill: G.head, color: 'FFFFFFFF', align: 'center', fmt: j >= 4 && j < 9 ? 'mmm-yy' : undefined, wrap: true }));
  ws.getRow(1).height = 46.5;
  const N = R.clientes.length, lastD = N + 1, totD = N + 2;
  R.clientes.forEach((c, k) => {
    const r = k + 2, y = c.amarillo ? G.yellow : undefined;
    set(ws, `A${r}`, k === 0 ? 1 : { formula: `1+A${r - 1}`, result: k + 1 }, { fill: y, align: 'center', fmt: '0' });
    set(ws, `B${r}`, { formula: `+A${r}/A$${lastD}`, result: c.pctNo }, { fill: y, fmt: '0.00%' });
    set(ws, `C${r}`, c.vend, { fill: y }); set(ws, `D${r}`, c.cli, { fill: y });
    R.m5.forEach((m, j) => set(ws, `${L(4 + j)}${r}`, Math.round(c.hist[m] * 100) / 100, { fill: y, fmt: '"$"#,##0' }));
    set(ws, `J${r}`, { formula: `+I${r}/I$${totD}`, result: c.rel }, { fill: y, fmt: '0.00%' });
    set(ws, `K${r}`, k === 0 ? { formula: `+J${r}`, result: c.cum } : { formula: `+J${r}+K${r - 1}`, result: c.cum }, { fill: y, fmt: '0.00%' });
    set(ws, `L${r}`, { formula: `+K${r}+B${r}`, result: c.total }, { fill: y, fmt: '0.00%' });
    set(ws, `M${r}`, null, { fill: y });
  });
  ['A', 'B', 'C', 'D'].forEach((c) => set(ws, `${c}${totD}`, null, { fill: G.head }));
  R.m5.forEach((m, j) => { const c = L(4 + j); set(ws, `${c}${totD}`, { formula: j === 4 ? `SUBTOTAL(9,${c}2:${c}${lastD})` : `SUM(${c}2:${c}${lastD})`, result: sum(R.clientes, (x) => x.hist[m]) }, { bold: true, size: 12, fill: G.head, color: 'FFFFFFFF', fmt: '"$"#,##0', align: 'center' }); });
  set(ws, `J${totD}`, { formula: `SUBTOTAL(9,J2:J${lastD})`, result: 1 }, { bold: true, size: 12, fill: G.head, color: 'FFFFFFFF', fmt: '0.00%', align: 'center' });
  [4.5, 9.5, 34.5, 35, 11, 11, 11, 11, 11, 10, 11.8, 11.3, 42].forEach((w, j) => { ws.getColumn(j + 1).width = w; });

  /* ---------- Resumen Vencimiento ---------- */
  ws = wb.addWorksheet('Resumen Vencimiento');
  const NV = R.left.length, lastV = NV + 2, totV = NV + 3;
  const hdr = (c, v) => set(ws, c, v, { bold: true, size: 12, fill: G.gray, align: 'center' });
  ws.mergeCells('A1:A2'); hdr('A1', '%'); ws.mergeCells('B1:G1'); hdr('B1', 'POR VENCIMIENTO');
  ws.mergeCells('I1:I2'); hdr('I1', '%'); ws.mergeCells('J1:O1'); hdr('J1', 'POR CLIENTES');
  ['VENDEDOR', 'CLIENTES', 'VENCIDO', '% REL', '% REL ACUM', 'Total'].forEach((h, j) => { hdr(`${L(1 + j)}2`, h); hdr(`${L(9 + j)}2`, h); });
  const DC = "'Desplegado Clientes'!";
  const side = (rows, c0, keyCol) => rows.forEach((x, k) => {
    const r = k + 3, y = x.amarillo ? G.yellow : undefined, C0 = L(c0), Cv = L(c0 + 1), Cn = L(c0 + 2), Cd = L(c0 + 3), Ce = L(c0 + 4), Cf = L(c0 + 5), Cg = L(c0 + 6);
    set(ws, `${C0}${r}`, { formula: `${k + 1}/${NV}`, result: x.pctNo }, { fill: y, fmt: '0%' });
    set(ws, `${Cv}${r}`, x.vend, { fill: y });
    set(ws, `${Cn}${r}`, { formula: `COUNTIFS(${DC}$C$2:$C$${lastD},${Cv}${r})`, result: x.n }, { size: 12, fill: y, align: 'center' });
    set(ws, `${Cd}${r}`, { formula: `SUMIFS(${DC}$I$2:$I$${lastD},${DC}$C$2:$C$${lastD},${Cv}${r})`, result: Math.round(x.v * 100) / 100 }, { size: 12, fill: y, fmt: '"$"#,##0' });
    set(ws, `${Ce}${r}`, { formula: `+${keyCol === 'v' ? Cd : Cn}${r}/${keyCol === 'v' ? Cd : Cn}$${totV}`, result: x.rel }, { size: 12, fill: y, fmt: '0%' });
    set(ws, `${Cf}${r}`, k === 0 ? { formula: `+${Ce}${r}`, result: x.cum } : { formula: `+${Ce}${r}+${Cf}${r - 1}`, result: x.cum }, { fill: y, fmt: '0%' });
    set(ws, `${Cg}${r}`, { formula: `+${Cf}${r}+${C0}${r}`, result: x.total }, { fill: y, fmt: '0%' });
  });
  side(R.left, 0, 'v'); side(R.right, 8, 'n');
  for (const [c, f, res] of [['C', '0', sum(R.left, (x) => x.n)], ['D', '"$"#,##0', sum(R.left, (x) => x.v)], ['E', '0%', 1], ['K', '0', sum(R.right, (x) => x.n)], ['L', '"$"#,##0', sum(R.right, (x) => x.v)], ['M', '0%', 1]])
    set(ws, `${c}${totV}`, { formula: `SUM(${c}3:${c}${lastV})`, result: res }, { bold: true, size: 12, fill: G.gray, fmt: f, align: 'center' });
  [5.7, 33.8, 9.2, 13, 7, 13.3, 7, 3.2, 5.4, 33.8, 9.2, 13, 7, 12.5, 7].forEach((w, j) => { ws.getColumn(j + 1).width = w; });
  return toBlob(wb);
}
