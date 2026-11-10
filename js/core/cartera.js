/* ==========================================================================
   Escenario 4 · Cartera vencida > 15 días → Guía 80-20 de un CEDIS
   Reglas: Mostradores (sin autoconsumo), Gestor CR01-CR02, vendedores casa/ocasional SE MANTIENEN.
   Amarillo: desde la primera fila hasta la fila cuyo "Total" está más cerca de 100 % (incluida).
   ========================================================================== */
import { sum, groupBy } from './utils.js';

const EXCLUDE_ZONES = /^(dni|facturas de servicios)$/i;

/** Índice (0-based) cuyo Total (acumulado + rango/N) está más cerca de 100 %. */
export function closestTo100(values) {
  const n = values.length, tot = sum(values);
  let acc = 0, best = 0, bestD = Infinity;
  const totals = values.map((v, k) => { acc += tot ? v / tot : 0; return acc + (k + 1) / n; });
  totals.forEach((t, k) => { const dd = Math.abs(t - 1); if (dd < bestD - 1e-12) { bestD = dd; best = k; } });
  return { cut: best, totals };
}

export function cedisList(data) {
  const cnt = groupBy(data.recs, (r) => r.zona);
  return data.zonas.filter((z) => !EXCLUDE_ZONES.test(z) && new Set(cnt.get(z).map((r) => r.mes)).size >= 3);
}

export function analyzeCartera(data, { cedis, mes } = {}) {
  const meses = data.meses.filter((m) => !mes || m <= mes);
  const MES = mes || meses.at(-1);
  const zonas = cedisList(data);
  const recs = data.recs.filter((r) => zonas.includes(r.zona));

  /* Resumen: conteo de clientes con deuda > 15 días por zona (13 meses) + ranking % 15 días */
  const m13 = meses.slice(-13);
  const byZone = groupBy(recs.filter((r) => m13.includes(r.mes)), (r) => r.zona);
  const conteo = zonas.map((z) => {
    const rs = byZone.get(z) || [];
    const per = Object.fromEntries(m13.map((m) => [m, sum(rs.filter((r) => r.mes === m), (r) => r.c15)]));
    return { zona: z, per };
  }).sort((a, b) => b.per[MES] - a.per[MES] || a.zona.localeCompare(b.zona));
  const ranking = zonas.map((z) => {
    const rs = (byZone.get(z) || []).filter((r) => r.mes === MES);
    const v = sum(rs, (r) => r.v15), s = sum(rs, (r) => r.saldo);
    return { zona: z, v15: v, saldo: s, pct: s ? v / s : 0 };
  }).sort((a, b) => b.pct - a.pct);

  /* Desplegado Clientes del CEDIS */
  const z = recs.filter((r) => r.zona === cedis);
  const m5 = meses.slice(-5);
  const act = z.filter((r) => r.mes === MES && r.v15 > 0);
  const cl = [...groupBy(act, (r) => r.cve).entries()].map(([cve, rs]) => {
    const hist = Object.fromEntries(m5.map((m) => [m, sum(z.filter((r) => r.cve === cve && r.mes === m), (r) => r.v15)]));
    return { cve, vend: rs[0].vend, cli: rs[0].cli, act: sum(rs, (r) => r.v15), hist };
  }).sort((a, b) => b.act - a.act);
  const cd = closestTo100(cl.map((c) => c.act));
  const totalAct = sum(cl, (c) => c.act);
  let acc = 0;
  cl.forEach((c, k) => { c.no = k + 1; c.pctNo = (k + 1) / cl.length; c.rel = totalAct ? c.act / totalAct : 0; acc += c.rel; c.cum = acc; c.total = cd.totals[k]; c.amarillo = k <= cd.cut; });

  /* Resumen Vencimiento: todos los vendedores del CEDIS en el mes (incluye $0) */
  const vendAll = [...new Set(z.filter((r) => r.mes === MES).map((r) => r.vend).filter(Boolean))];
  const vv = vendAll.map((v) => ({ vend: v, n: cl.filter((c) => c.vend === v).length, v: sum(cl.filter((c) => c.vend === v), (c) => c.act) }));
  const side = (arr, key) => {
    const { cut, totals } = closestTo100(arr.map((x) => x[key]));
    const t = sum(arr, (x) => x[key]); let a2 = 0;
    return arr.map((x, k) => { a2 += t ? x[key] / t : 0; return { ...x, pctNo: (k + 1) / arr.length, rel: t ? x[key] / t : 0, cum: a2, total: totals[k], amarillo: k <= cut }; });
  };
  const left = side([...vv].sort((a, b) => b.v - a.v || b.n - a.n), 'v');
  const right = side([...vv].sort((a, b) => b.n - a.n || b.v - a.v), 'n');

  const rk = ranking.findIndex((r) => r.zona === cedis);
  return {
    scenario: 'cartera', cedis, mes: MES, m13, m5, conteo, ranking, clientes: cl, left, right,
    kpi: { clientes: cl.length, vencido: totalAct, pct: ranking[rk]?.pct ?? 0, rank: rk + 1, zonas: zonas.length, vendedores: vendAll.length,
      n80: cd.cut + 1, pct80: cl[cd.cut]?.cum ?? 0, totalCut: cl[cd.cut]?.total ?? 0,
      prevClientes: (conteo.find((c) => c.zona === cedis)?.per[meses.at(-2)]) ?? null },
  };
}
