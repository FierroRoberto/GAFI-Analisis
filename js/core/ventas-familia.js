/* ==========================================================================
   Escenario 2 · Ventas por familia (Periodo y Trimestre, actual vs anterior)
   Último Año = % Periodo · Año Anterior = % Trimestre (opción para invertir)
   ========================================================================== */
import { CATS, DROP_CATS, NC, classify, pareto, sum, groupBy, fmt, nice } from './utils.js';
import { solutionsFor } from './solutions.js';

export function analyzeVentasFamilia(data, opts = {}) {
  const swap = !!opts.swap;
  const rows = data.rows.map((r) => ({ ...r, pAnt0: r.pAnt ?? 0, pAct0: r.pAct ?? 0, tAnt0: r.tAnt ?? 0, tAct0: r.tAct ?? 0 }));
  const dupNames = new Set([...groupBy(rows, (r) => r.familia).entries()].filter(([, v]) => v.length > 1).map(([k]) => k));
  rows.forEach((r) => {
    const o = [];
    if (dupNames.has(r.familia)) o.push('Familia repetida en otro grupo (se consolida por nombre)');
    if ([r.pAnt, r.pAct, r.tAnt, r.tAct].some((x) => x != null && x < 0)) o.push('Monto negativo (nota de crédito)');
    if ([r.pAnt, r.pAct, r.tAnt, r.tAct].some((x) => x == null)) o.push('Sin venta en algún corte');
    r.obs = o.join('; ');
  });
  const mk = (name, rs, extra = {}) => {
    const pAnt = sum(rs, (r) => r.pAnt0), pAct = sum(rs, (r) => r.pAct0), tAnt = sum(rs, (r) => r.tAnt0), tAct = sum(rs, (r) => r.tAct0);
    const varP = pAnt > 0 ? pAct / pAnt - 1 : null, varT = tAnt > 0 ? tAct / tAnt - 1 : null;
    const varUlt = swap ? varT : varP, varAnt = swap ? varP : varT;
    const impact = swap ? tAct - tAnt : pAct - pAnt, impactAlt = swap ? pAct - pAnt : tAct - tAnt;
    return { name, pAnt, pAct, tAnt, tAct, varP, varT, varUlt, varAnt, impact, absImpact: Math.abs(impact), impactAlt,
      vAct: swap ? tAct : pAct, vPrev: swap ? tAnt : pAnt, category: classify(varAnt, varUlt), ...extra };
  };
  const famG = groupBy(rows, (r) => r.familia);
  const fams = [...famG.entries()].map(([f, rs]) => mk(f, rs, { grupo: [...rs].sort((a, b) => b.pAct0 - a.pAct0)[0].grupo }));
  const grps = [...groupBy(rows, (r) => r.grupo).entries()].map(([g, rs]) => mk(g, rs));
  const total = mk('Total', rows);
  const build = (ents, dim) => ({
    dim, ents: ents.sort((a, b) => b.absImpact - a.absImpact), neg: pareto(ents, -1), pos: pareto(ents, 1),
    alt: pareto(ents.map((e) => ({ ...e, impact: e.impactAlt })), -1),
    counts: Object.fromEntries([...CATS, NC].map((c) => [c, ents.filter((e) => e.category === c).length])),
    impacts: Object.fromEntries([...CATS, NC].map((c) => [c, sum(ents.filter((e) => e.category === c), (e) => e.impact)])),
    falling: ents.filter((e) => e.impact < 0).length, growing: ents.filter((e) => e.impact > 0).length,
  });
  const byDim = { Familia: build(fams, 'Familia'), 'Grupo familia': build(grps, 'Grupo familia') };
  const lab = swap ? { ult: 'Trimestre', ant: 'Periodo' } : { ult: 'Periodo', ant: 'Trimestre' };

  const plan = byDim.Familia.ents.filter((e) => DROP_CATS.includes(e.category) && e.impact < 0).map((e) => {
    const twoCuts = e.varP != null && e.varT != null && e.varP < -0.1 && e.varT < -0.1;
    const diag = `${lab.ult} ${fmt.pct(e.varUlt)} (${fmt.short(e.impact, true)}); ${lab.ant.toLowerCase()} ${fmt.pct(e.varAnt)} (${fmt.short(e.impactAlt, true)}). ` +
      `Grupo ${e.grupo}; venta ${lab.ult.toLowerCase()} actual ${fmt.short(e.vAct)}.${twoCuts ? ' Cae en ambos cortes.' : ''}`;
    return { entity: e.name, dim: 'Familia', grupo: e.grupo, category: e.category, varUlt: e.varUlt, varAnt: e.varAnt, impact: e.impact,
      absImpact: e.absImpact, impactAlt: e.impactAlt, vAct: e.vAct, inPareto: byDim.Familia.neg.rows.find((r) => r.name === e.name)?.inPareto ?? false,
      diag, solutions: solutionsFor('familia', e.name, { broad: true, category: e.category }) };
  }).sort((a, b) => (b.inPareto - a.inPareto) || b.absImpact - a.absImpact);

  return { scenario: 'ventas-familia', swap, lab, rows, byDim, total, plan, dupNames: [...dupNames] };
}
