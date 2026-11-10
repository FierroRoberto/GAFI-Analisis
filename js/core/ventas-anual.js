/* ==========================================================================
   Escenario 1 · Ventas por dimensión con comparativo anual
   (Cedis / Vendedor / Familia …, Ventas pesos y % variación de dos años)
   ========================================================================== */
import { CATS, DROP_CATS, NC, classify, isHouse, pareto, sum, groupBy, fmt, nice } from './utils.js';
import { dimKind, solutionsFor, plural } from './solutions.js';

export function analyzeVentasAnual(data, opts = {}) {
  const { dims, Y, Y1 } = data;
  const vIdx = dims.findIndex((d) => dimKind(d) === 'vendedor');
  const excludeHouse = opts.excludeHouse !== false;
  const excluded = [], rows = [];
  for (const r of data.rows) {
    if (excludeHouse && vIdx >= 0 && isHouse(r.d[vIdx])) { excluded.push(r); continue; }
    const vAct = r.vY ?? 0, vPrev = r.vY1 ?? 0;
    let vPrev2 = null;
    if (r.vY1 != null) vPrev2 = r.varY1 == null ? 0 : Math.round(r.varY1 * 1e6) / 1e6 === -1 ? null : r.vY1 / (1 + r.varY1);
    const obs = [];
    if (r.vY == null) obs.push(`Sin venta ${Y}`);
    if (r.vY1 == null) obs.push(`Sin venta ${Y1}`);
    if (r.vY1 != null && r.varY1 == null) obs.push(`Sin base ${Y1 - 1}`);
    if ((r.vY ?? 0) < 0 || (r.vY1 ?? 0) < 0) obs.push('Monto negativo (nota de crédito)');
    if ([r.varY, r.varY1].some((x) => x != null && Math.abs(x) > 5)) obs.push('Variación extrema por base pequeña');
    rows.push({ ...r, vAct, vPrev, vPrev2, impact: vAct - vPrev, category: classify(r.varY1, r.varY), obs: obs.join('; ') });
  }

  /* ---------- agregación por dimensión ---------- */
  const byDim = {};
  dims.forEach((dim, i) => {
    const g = groupBy(rows, (r) => r.d[i]);
    const ents = [...g.entries()].map(([name, rs]) => {
      const vAct = sum(rs, (r) => r.vAct), vPrev = sum(rs, (r) => r.vPrev), vPrev2 = sum(rs, (r) => r.vPrev2 ?? 0);
      const varUlt = vPrev > 0 ? vAct / vPrev - 1 : null, varAnt = vPrev2 > 0 ? vPrev / vPrev2 - 1 : null;
      return { name, dim, vAct, vPrev, vPrev2, varUlt, varAnt, impact: vAct - vPrev, absImpact: Math.abs(vAct - vPrev),
        category: classify(varAnt, varUlt), n: rs.length, lost: rs.filter((r) => r.vY == null && r.vY1 > 0).length, rows: rs };
    });
    const neg = pareto(ents, -1), pos = pareto(ents, 1);
    const counts = Object.fromEntries([...CATS, NC].map((c) => [c, ents.filter((e) => e.category === c).length]));
    const impacts = Object.fromEntries([...CATS, NC].map((c) => [c, sum(ents.filter((e) => e.category === c), (e) => e.impact)]));
    byDim[dim] = { dim, i, ents: ents.sort((a, b) => b.absImpact - a.absImpact), neg, pos, counts, impacts,
      falling: ents.filter((e) => e.impact < 0).length, growing: ents.filter((e) => e.impact > 0).length };
  });

  /* ---------- totales ---------- */
  const vAct = sum(rows, (r) => r.vAct), vPrev = sum(rows, (r) => r.vPrev), vPrev2 = sum(rows, (r) => r.vPrev2 ?? 0);
  const total = { vAct, vPrev, vPrev2, varUlt: vPrev ? vAct / vPrev - 1 : null, varAnt: vPrev2 ? vPrev / vPrev2 - 1 : null, impact: vAct - vPrev };
  total.category = classify(total.varAnt, total.varUlt);

  /* ---------- perfil para diagnóstico: desglose contra otra dimensión ---------- */
  const other = (i) => {
    const kinds = dims.map(dimKind);
    if (kinds[i] === 'vendedor') return kinds.indexOf('familia') >= 0 ? kinds.indexOf('familia') : dims.length - 1;
    if (kinds[i] === 'familia') return kinds.indexOf('vendedor');
    return kinds.indexOf('vendedor') >= 0 ? kinds.indexOf('vendedor') : dims.length - 1;
  };
  function profile(e, i) {
    const j = other(i);
    if (j < 0 || j === i) return { broad: false };
    const sub = [...groupBy(e.rows.filter((r) => r.vPrev > 0 || r.vAct > 0), (r) => r.d[j]).entries()]
      .map(([k, rs]) => ({ k, imp: sum(rs, (r) => r.impact), base: sum(rs, (r) => r.vPrev) }));
    const falls = sub.filter((s) => s.imp < 0).sort((a, b) => a.imp - b.imp);
    const gross = sum(falls, (s) => s.imp);
    const withBase = sub.filter((s) => s.base > 0).length;
    return { otherDim: dims[j], falls: falls.length, total: withBase, broad: withBase >= 4 && falls.length / withBase >= 0.75,
      topName: falls[0]?.k, topImp: falls[0]?.imp ?? 0, topShare: gross ? falls[0].imp / gross : 0, top3: falls.slice(0, 3), gross,
      grossPos: sum(sub.filter((s) => s.imp > 0), (s) => s.imp) };
  }

  /* ---------- plan de acción ---------- */
  const plan = [];
  for (const dim of dims) {
    const D = byDim[dim];
    if (D.ents.length < 2) continue;
    for (const e of D.ents.filter((x) => DROP_CATS.includes(x.category) && x.impact < 0)) {
      const p = profile(e, D.i), kind = dimKind(dim);
      const house = kind === 'vendedor' && isHouse(e.name);
      let diag = `${fmt.pct(e.varUlt)} en ${Y} tras ${fmt.pct(e.varAnt)} en ${Y1}; impacto ${fmt.short(e.impact, true)}.`;
      if (p.otherDim && p.total) {
        diag += ` Cae en ${p.falls} de ${p.total} ${plural(p.otherDim)}`;
        if (p.topName) diag += `; la mayor caída es ${nice(p.topName)} (${fmt.short(p.topImp, true)}, ${fmt.pct0(p.topShare)} de la caída bruta)`;
        diag += p.broad ? '. Caída generalizada.' : p.topShare >= 0.45 ? '. Caída concentrada.' : '.';
      }
      if (e.lost) diag += ` ${e.lost} ${e.lost === 1 ? 'combinación' : 'combinaciones'} sin venta en ${Y}.`;
      plan.push({ entity: e.name, dim, category: e.category, varUlt: e.varUlt, varAnt: e.varAnt, impact: e.impact, absImpact: e.absImpact,
        vAct: e.vAct, inPareto: D.neg.rows.find((r) => r.name === e.name)?.inPareto ?? false, diag,
        solutions: solutionsFor(kind, e.name, { ...p, category: e.category, house }) });
    }
  }
  plan.sort((a, b) => (b.inPareto - a.inPareto) || b.absImpact - a.absImpact);
  return { scenario: 'ventas-anual', Y, Y1, dims, rows, excluded, byDim, total, plan, profile };
}
