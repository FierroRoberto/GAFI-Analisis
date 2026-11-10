/* ==========================================================================
   Escenario 3 · Clientes por vendedor y clientes arriba del umbral mensual
   ========================================================================== */
import { isHouse, isPublico, pareto, sum, groupBy, fmt, nice } from './utils.js';
import { solutionsFor } from './solutions.js';

export const SEGMENTS = [
  { key: '> $50 mil', lo: 50000, hi: Infinity }, { key: '$25–50 mil', lo: 25000, hi: 50000 }, { key: '$12–25 mil', lo: 12000, hi: 25000 },
  { key: '$5–12 mil', lo: 5000, hi: 12000 }, { key: '$2–5 mil', lo: 2000, hi: 5000 }, { key: '< $2 mil', lo: 0, hi: 2000 },
];

export function analyzeVentasClientes(data, opts = {}) {
  const umbral = opts.umbral ?? 12000, meses = opts.meses ?? 10, cerca = opts.cerca ?? Math.round(umbral * 2 / 3);
  const excludeHouse = opts.excludeHouse !== false;
  const vIdx = data.dims.findIndex((d) => /vendedor/i.test(d)), cIdx = data.dims.length - 1;
  const segs = SEGMENTS.map((s) => (s.key === '$12–25 mil' ? { ...s, lo: umbral } : s.key === '$5–12 mil' ? { ...s, hi: umbral } : s));
  const excluded = [], clients = [];
  for (const r of data.rows) {
    const vend = vIdx >= 0 ? r.d[vIdx] : 'Sin vendedor';
    if (excludeHouse && isHouse(vend)) { excluded.push({ ...r, vend, cli: r.d[cIdx] }); continue; }
    const v = r.vY ?? 0, nuevo = r.varY == null;
    const vPrev = nuevo ? 0 : Math.round(r.varY * 1e6) / 1e6 === -1 ? 0 : v / (1 + r.varY);
    const prom = v / meses, prom25 = vPrev / meses, activo = v > 0, arriba = activo && prom > umbral;
    const tend = nuevo ? 'Nuevo (sin venta año anterior)' : r.varY > 0.1 ? 'Crece > 10%' : r.varY < -0.1 ? 'Cae > 10%' : 'Estable ±10%';
    let mov;
    if (!activo) mov = 'Sin compra neta';
    else if (nuevo) mov = arriba ? 'Nuevo arriba del umbral' : 'Nuevo abajo del umbral';
    else if (prom25 > umbral) mov = arriba ? 'Se mantiene arriba' : 'Bajó de nivel';
    else mov = arriba ? 'Subió de nivel' : 'Se mantiene abajo';
    const seg = !activo ? 'Sin compra neta' : segs.find((s) => prom > s.lo && prom <= s.hi)?.key ?? '< $2 mil';
    clients.push({ fila: r.fila, vend, cli: r.d[cIdx], v, var: r.varY, vPrev, impact: v - vPrev, absImpact: Math.abs(v - vPrev), prom, activo, arriba,
      nuevo, tend, mov, seg, cerca: activo && prom > cerca && prom <= umbral, publico: isPublico(r.d[cIdx]) });
  }
  const totalsV = data.totals[vIdx] || new Map();
  const vend = [...groupBy(clients, (c) => c.vend).entries()].map(([name, cs]) => {
    const a = cs.filter((c) => c.activo), big = a.filter((c) => c.arriba);
    const venta = sum(cs, (c) => c.v), ventaAct = sum(a, (c) => c.v);
    const t = totalsV.get(name);
    const varV = t?.varY ?? null, vPrev = varV != null ? (t.vY ?? venta) / (1 + varV) : sum(cs, (c) => c.vPrev);
    const sorted = a.map((c) => c.v).sort((x, y) => y - x);
    let acc = 0, n80 = 0; for (const x of sorted) { acc += x; n80++; if (acc >= 0.8 * ventaAct) break; }
    return { name, clientes: a.length, arriba: big.length, pctArriba: a.length ? big.length / a.length : 0, venta, ventaArriba: sum(big, (c) => c.v),
      pctVentaArriba: ventaAct ? sum(big, (c) => c.v) / ventaAct : 0, cerca: a.filter((c) => c.cerca).length, nuevos: a.filter((c) => c.nuevo).length,
      crecen: a.filter((c) => c.tend === 'Crece > 10%').length, estables: a.filter((c) => c.tend === 'Estable ±10%').length,
      caen: a.filter((c) => c.tend === 'Cae > 10%').length, subieron: cs.filter((c) => c.mov === 'Subió de nivel').length,
      bajaron: cs.filter((c) => c.mov === 'Bajó de nivel').length, nuevosArriba: cs.filter((c) => c.mov === 'Nuevo arriba del umbral').length,
      arriba25: cs.filter((c) => c.activo && !c.nuevo && c.vPrev / meses > umbral).length + cs.filter((c) => c.mov === 'Bajó de nivel' && !c.activo).length,
      publico: a.filter((c) => c.publico).length, ventaPublico: sum(a.filter((c) => c.publico), (c) => c.v),
      prom: a.length ? ventaAct / a.length / meses : 0, top5: ventaAct ? sum(sorted.slice(0, 5), (x) => x) / ventaAct : 0, n80,
      varV, vPrev, impact: venta - vPrev, absImpact: Math.abs(venta - vPrev), perdidos: Math.max(0, vPrev - sum(cs, (c) => c.vPrev)) };
  }).sort((a, b) => b.venta - a.venta);
  vend.forEach((v) => { v.arriba25 = clients.filter((c) => c.vend === v.name && (c.mov === 'Se mantiene arriba' || c.mov === 'Bajó de nivel')).length; });

  const act = clients.filter((c) => c.activo);
  const T = {
    clientes: act.length, arriba: act.filter((c) => c.arriba).length, venta: sum(clients, (c) => c.v), vPrev: sum(vend, (v) => v.vPrev),
    ventaArriba: sum(act.filter((c) => c.arriba), (c) => c.v), cerca: act.filter((c) => c.cerca).length, nuevos: act.filter((c) => c.nuevo).length,
    subieron: clients.filter((c) => c.mov === 'Subió de nivel').length, bajaron: clients.filter((c) => c.mov === 'Bajó de nivel').length,
    nuevosArriba: clients.filter((c) => c.mov === 'Nuevo arriba del umbral').length, perdidos: sum(vend, (v) => v.perdidos),
    publico: act.filter((c) => c.publico).length, ventaPublico: sum(act.filter((c) => c.publico), (c) => c.v),
  };
  T.arriba25 = T.arriba - T.subieron - T.nuevosArriba + T.bajaron;
  T.var = T.vPrev ? T.venta / T.vPrev - 1 : null;
  T.pctArriba = T.clientes ? T.arriba / T.clientes : 0;
  T.pctVentaArriba = sum(act, (c) => c.v) ? T.ventaArriba / sum(act, (c) => c.v) : 0;
  T.ventaActiva = sum(act, (c) => c.v);

  const segRows = segs.map((s) => ({ key: s.key, n: act.filter((c) => c.seg === s.key).length, v: sum(act.filter((c) => c.seg === s.key), (c) => c.v) }));
  const cneg = pareto(clients, -1), cpos = pareto(clients, 1);
  const vneg = pareto(vend, -1), vpos = pareto(vend, 1);

  const plan = [];
  for (const v of vend.filter((x) => x.impact < 0).sort((a, b) => a.impact - b.impact)) {
    const cs = clients.filter((c) => c.vend === v.name && c.impact < 0 && !c.publico).sort((a, b) => a.impact - b.impact);
    plan.push({ tipo: 'Vendedor', entity: v.name, vendedor: v.name, severidad: 'Vendedor en caída', varUlt: v.varV, impact: v.impact, absImpact: v.absImpact,
      vAct: v.venta, clientes: v.clientes, arriba: v.arriba,
      diag: `Venta ${fmt.pct(v.varV)} (${fmt.short(v.impact, true)}). ${v.clientes} clientes, ${v.arriba} arriba del umbral (${fmt.pct0(v.pctArriba)}); ` +
        `${v.caen} caen más de 10%; ${v.bajaron} bajaron de nivel.` + (v.perdidos > Math.max(20000, v.vPrev * 0.01) ? ` Venta del año anterior de clientes sin compra actual (estimada): ${fmt.short(v.perdidos)}.` : ''),
      solutions: [
        v.perdidos > Math.max(20000, v.vPrev * 0.01) ? `Obtener del sistema la lista de clientes que compraron el año anterior y no en el actual (≈${fmt.short(v.perdidos)}) y agendar visita a los de mayor venta.` : null,
        cs[0] ? `Visita de reactivación a ${nice(cs[0].cli)} (${fmt.pct(cs[0].var)})${cs[1] ? ` y ${nice(cs[1].cli)} (${fmt.pct(cs[1].var)})` : ''} con el gerente.` : null,
        v.cerca ? `Plan de desarrollo para los ${v.cerca} clientes cerca del umbral (ampliar surtido por cliente).` : null,
        'Revisión 1 a 1 semanal con gerencia de clientes en caída y recuperados.',
        'Meta de retención: ningún cliente arriba del umbral sin compra en el mes.',
      ].filter(Boolean).slice(0, 5) });
  }
  for (const c of cneg.rows.filter((r) => r.inPareto)) {
    const sev = c.publico ? 'Público en general' : c.var < -0.75 ? 'Casi perdido' : c.var < -0.25 ? 'Caída fuerte' : 'Caída moderada';
    plan.push({ tipo: 'Cliente', entity: c.cli, vendedor: c.vend, severidad: sev, varUlt: c.var, impact: c.impact, absImpact: c.absImpact, vAct: c.v,
      diag: `${sev}. Venta ${fmt.money(c.v)} (${fmt.pct(c.var)}), promedio ${fmt.money(c.prom)}/mes: ${c.arriba ? 'arriba' : 'abajo'} del umbral. Movimiento: ${c.mov.toLowerCase()}.`,
      solutions: solutionsFor('cliente', c.cli, { var: c.var, vendor: c.vend, publico: c.publico }) });
  }
  return { scenario: 'ventas-clientes', Y: data.Y, umbral, meses, cerca, clients, vend, excluded, T, segRows, cneg, cpos, vneg, vpos, plan };
}
