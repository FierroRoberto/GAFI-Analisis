/* ==========================================================================
   Modelo de reporte (lo consumen la interfaz y el PDF)
   Bloques: bars · stack · matrix · table · bridge · list · callouts · text
   ========================================================================== */
import { CATS, NC, fmt, nice, sum, isHouse } from './utils.js';
import { dimKind, plural } from './solutions.js';

const short = (s, n = 34) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
const catCols = [
  { key: 'rank', label: '#', type: 'int' }, { key: 'name', label: 'Entidad', type: 'text', fmt: nice },
  { key: 'vAct', label: 'Venta actual', type: 'short' }, { key: 'varUlt', label: 'Último año', type: 'pct' },
  { key: 'varAnt', label: 'Año anterior', type: 'pct' }, { key: 'impact', label: 'Impacto', type: 'shortSigned' },
  { key: 'cum', label: '% acum.', type: 'pct0' }, { key: 'category', label: 'Categoría', type: 'cat' },
];
const barsFrom = (rows, tone, label = (r) => nice(r.name), max = 15) => rows.slice(0, max).map((r) => ({
  label: short(label(r), 40), value: Math.abs(r.impact), text: `${fmt.short(r.impact, true)} · ${fmt.pct(r.varUlt ?? r.var)}`, tone, extra: `${fmt.pct0(r.cum)} acum.` }));
const topList = (rows, n = 3, f = (r) => `${nice(r.name)} (${fmt.short(r.impact, true)})`) => rows.slice(0, n).map(f).join(', ');

/* ------------------------------------------------------------------ */
export function reportVentasAnual(A, meta) {
  const { Y, Y1, total: T } = A;
  const dimsMulti = A.dims.filter((d) => A.byDim[d].ents.length > 1);
  const famDim = A.dims.find((d) => dimKind(d) === 'familia') || A.dims.at(-1);
  const venDim = A.dims.find((d) => dimKind(d) === 'vendedor');
  const F = A.byDim[famDim], V = venDim ? A.byDim[venDim] : null;
  const exclV = sum(A.excluded, (r) => r.vY ?? 0);
  const cedisName = A.byDim[A.dims[0]].ents.length === 1 ? nice(A.byDim[A.dims[0]].ents[0].name) : `${A.byDim[A.dims[0]].ents.length} ${plural(A.dims[0])}`;

  const summary = [
    { fig: fmt.pct(T.varUlt), tone: T.impact < 0 ? 'neg' : 'pos', text: `<b>La venta ${T.impact < 0 ? 'cae' : 'crece'} ${fmt.short(T.impact, true)}</b>: de ${fmt.short(T.vPrev)} en ${Y1} a ${fmt.short(T.vAct)} en ${Y}. Clasificación general: <b>${T.category}</b> (${fmt.pct(T.varAnt)} el año previo).` },
  ];
  if (F.neg.rows.length) summary.push({ fig: String(F.neg.n80), tone: 'neg', text: `<b>${F.neg.n80} de ${F.neg.rows.length} ${plural(famDim)} explican el ${fmt.pct0(F.neg.cut)} de la caída</b> (${fmt.short(-F.neg.total)}): ${topList(F.neg.rows)}.` });
  if (V) {
    const top = V.neg.rows[0];
    summary.push({ fig: `${V.falling}/${V.ents.length}`, tone: V.falling > V.growing ? 'neg' : 'pos', text: `<b>${V.falling} de ${V.ents.length} vendedores caen</b> y ${V.growing} crecen.${top ? ` La mayor caída es ${nice(top.name)} (${fmt.short(top.impact, true)}, ${fmt.pct(top.varUlt)}).` : ''} ${V.counts['Acierto'] + V.counts['Recuperación'] === 0 ? 'Ningún vendedor está en Acierto ni en Recuperación.' : `${V.counts['Acierto']} en Acierto y ${V.counts['Recuperación']} en Recuperación.`}` });
    if (V.counts['Desaceleración']) summary.push({ fig: String(V.counts['Desaceleración']), tone: '', text: `<b>${V.counts['Desaceleración']} vendedores en Desaceleración</b>: crecieron más de 10% en ${Y1} y hoy están entre ±10%.` });
  }
  if (F.pos.rows.length) summary.push({ fig: fmt.short(F.pos.total, true), tone: 'pos', text: `<b>Crecimiento de ${F.pos.rows.length} ${plural(famDim)}</b> (+${fmt.short(F.pos.total)}), encabezado por ${topList(F.pos.rows)}.` });

  const risks = A.plan.filter((p) => p.inPareto).slice(0, 4).map((p) => `<b>${nice(p.entity)}</b> (${p.dim}, ${p.category}): ${fmt.pct(p.varUlt)}, ${fmt.short(p.impact, true)}.`);
  const actions = A.plan.filter((p) => p.inPareto).slice(0, 5).map((p) => `${nice(p.entity)}: ${p.solutions[0]}`);

  const sections = [];
  for (const d of A.dims) {
    const D = A.byDim[d];
    if (D.ents.length === 1) {
      const e = D.ents[0];
      sections.push({ id: `dim-${d}`, title: `Análisis por ${d}`, kicker: d, lead: `${nice(e.name)}: ${fmt.short(e.vAct)}, ${fmt.pct(e.varUlt)} contra ${Y1} (${fmt.pct(e.varAnt)} el año previo) → <b>${e.category}</b>. Con una sola entidad no hay ranking ni Pareto.`, blocks: [] });
      continue;
    }
    sections.push({ id: `dim-${d}`, title: `Análisis por ${d}`, kicker: `${D.ents.length} ${plural(d)}`,
      lead: `${D.falling} caen y ${D.growing} crecen. <b>${D.neg.n80} concentran el ${fmt.pct0(D.neg.cut)} del impacto negativo</b> (${fmt.short(-D.neg.total)}); ${D.pos.n80} concentran el ${fmt.pct0(D.pos.cut)} del positivo (+${fmt.short(D.pos.total)}).`,
      blocks: [
        { type: 'bars', title: `Pareto de caídas · ${d}`, rows: barsFrom(D.neg.rows.filter((r) => r.inPareto), 'neg') },
        { type: 'bars', title: `Pareto de crecimientos · ${d}`, rows: barsFrom(D.pos.rows.filter((r) => r.inPareto), 'pos', undefined, 12) },
        { type: 'matrix', title: `Matriz de clasificación · ${d}`, counts: D.counts, impacts: D.impacts, total: D.ents.length },
        { type: 'table', title: `Ranking Pareto de caídas · ${d}`, columns: catCols, rows: D.neg.rows.filter((r) => r.inPareto), pdfMax: 16 },
      ] });
  }
  sections.push(planSection(A.plan.map((p) => ({ ...p, title: nice(p.entity), tag: `${p.dim} · ${p.category}`, metric: `${fmt.pct(p.varUlt)} · ${fmt.short(p.impact, true)}` }))));
  return {
    scenario: 'ventas-anual', title: 'Caídas y crecimientos de venta', subtitle: `${cedisName} · ${Y} vs ${Y1}`, file: meta.fileName,
    kpis: [
      { label: `Venta ${Y}`, value: T.vAct, type: 'short', sub: `vs ${fmt.short(T.vPrev)} en ${Y1}` },
      { label: 'Variación', value: T.varUlt, type: 'pct', tone: T.varUlt < 0 ? 'neg' : 'pos', sub: `${Y1} vs ${Y1 - 1}: ${fmt.pct(T.varAnt)}` },
      { label: 'Impacto neto', value: T.impact, type: 'shortSigned', tone: T.impact < 0 ? 'neg' : 'pos', sub: `caída bruta ${fmt.short(-F.neg.total)}` },
      { label: 'Categoría', text: T.category, sub: 'matriz ±10 %' },
    ],
    summary, risks, actions, sections,
    notes: {
      method: [`"Año Anterior" = % variación ${Y1} vs ${Y1 - 1}; "Último Año" = % variación ${Y} vs ${Y1}. Umbrales fijos de ±10%.`,
        'Impacto = venta actual − venta anterior. Las dimensiones se agregan sumando renglones y el % se recalcula.',
        'Pareto: se acumula por impacto absoluto hasta cruzar el 80% (incluye la entidad que cruza).'],
      quality: [`${A.rows.length} renglones analizados de ${A.rows.length + A.excluded.length}.`,
        A.excluded.length ? `Excluidos ${A.excluded.length} renglones de vendedores "Casa"/"Ocasional" (${fmt.short(exclV)}).` : null,
        `${A.rows.filter((r) => r.vY == null).length} sin venta ${Y} · ${A.rows.filter((r) => r.vY1 == null).length} sin venta ${Y1} · ${A.rows.filter((r) => /negativo/.test(r.obs)).length} montos negativos.`].filter(Boolean),
      limits: ['Sin unidades, cuota, cliente ni zona en el archivo: las causas son hipótesis.'],
    },
  };
}

export function planSection(items, lead) {
  return { id: 'plan', title: 'Plan de acción', kicker: 'Caídas relevantes', lead: lead || `${items.length} entidades en Caída Libre, Alerta Roja, Alerta Amarilla o Suelo con impacto negativo. Primero las que están dentro del Pareto 80%.`,
    blocks: [{ type: 'plan', items }] };
}

/* ------------------------------------------------------------------ */
export function reportVentasFamilia(B, meta) {
  const F = B.byDim.Familia, G = B.byDim['Grupo familia'], T = B.total, L = B.lab;
  const altNeg = F.alt;
  const efecto = F.ents.filter((e) => e.category === 'Efecto Rebote').sort((a, b) => a.impactAlt - b.impactAlt);
  const summary = [
    { fig: fmt.pct(T.varUlt), tone: T.impact < 0 ? 'neg' : 'pos', text: `<b>El ${L.ult.toLowerCase()} ${T.impact < 0 ? 'cae' : 'crece'} ${fmt.short(T.impact, true)}</b> (de ${fmt.short(T.vPrev)} a ${fmt.short(T.vAct)}). El ${L.ant.toLowerCase()} varía ${fmt.pct(T.varAnt)} (${fmt.short(T.impactAlt, true)}). Clasificación: <b>${T.category}</b>.` },
    { fig: `${F.neg.n80}`, tone: 'neg', text: `<b>${F.falling} de ${F.ents.length} familias caen</b> (${fmt.short(-F.neg.total)}); ${F.neg.n80} explican el ${fmt.pct0(F.neg.cut)}: ${topList(F.neg.rows)}.` },
    { fig: `${F.pos.n80}`, tone: 'pos', text: `<b>${F.growing} familias crecen</b> (+${fmt.short(F.pos.total)}); ${F.pos.n80} concentran el ${fmt.pct0(F.pos.cut)}: ${topList(F.pos.rows)}.` },
    { fig: fmt.short(G.ents.find((g) => g.impact === Math.min(...G.ents.map((x) => x.impact))).impact, true), tone: '', text: `<b>Por grupo:</b> ${G.ents.map((g) => `${g.name} ${fmt.pct(g.varUlt)}`).join(' · ')}.` },
  ];
  if (efecto.length) summary.push({ fig: String(efecto.length), tone: 'neg', text: `<b>${efecto.length} familias en Efecto Rebote</b>: crecen en ${L.ult.toLowerCase()} pero cayeron más de 10% en ${L.ant.toLowerCase()}: ${efecto.slice(0, 3).map((e) => `${nice(e.name)} (${fmt.short(e.impactAlt, true)})`).join(', ')}.` });
  const famRow = (r) => ({ ...r });
  const sections = [
    { id: 'familia', title: 'Pareto por familia', kicker: `${F.ents.length} familias`, lead: `${F.neg.n80} familias concentran el ${fmt.pct0(F.neg.cut)} de la caída; ${F.pos.n80} concentran el ${fmt.pct0(F.pos.cut)} del crecimiento.`,
      blocks: [
        { type: 'bars', title: `Caídas · ${L.ult.toLowerCase()}`, rows: barsFrom(F.neg.rows, 'neg', undefined, 10) },
        { type: 'bars', title: 'Crecimientos (Pareto 80%)', rows: barsFrom(F.pos.rows.filter((r) => r.inPareto), 'pos', undefined, 24) },
        { type: 'matrix', title: 'Matriz de clasificación · Familia', counts: F.counts, impacts: F.impacts, total: F.ents.length },
        { type: 'table', title: 'Ranking Pareto de caídas · Familia', columns: [...catCols.slice(0, 2), { key: 'grupo', label: 'Grupo', type: 'text' }, ...catCols.slice(2)], rows: F.neg.rows.map(famRow), pdfMax: 14 },
      ] },
    { id: 'alt', title: `${L.ant} y grupos de familia`, kicker: 'Lectura complementaria', lead: `El ${L.ant.toLowerCase()} cae ${fmt.short(-altNeg.total)} en ${altNeg.rows.length} familias; ${altNeg.n80} explican el ${fmt.pct0(altNeg.cut)}.`,
      blocks: [
        { type: 'bars', title: `Caídas · ${L.ant.toLowerCase()} (complementario)`, rows: altNeg.rows.filter((r) => r.inPareto).map((r) => ({ label: short(nice(r.name), 40), value: Math.abs(r.impact), text: `${fmt.short(r.impact, true)} · ${r.category}`, tone: 'warn' })) },
        { type: 'table', title: 'Grupo familia', columns: [{ key: 'name', label: 'Grupo', type: 'text' }, { key: 'vAct', label: `Venta ${L.ult.toLowerCase()}`, type: 'short' },
          { key: 'varUlt', label: L.ult, type: 'pct' }, { key: 'varAnt', label: L.ant, type: 'pct' }, { key: 'impact', label: `Impacto ${L.ult.toLowerCase()}`, type: 'shortSigned' },
          { key: 'impactAlt', label: `Impacto ${L.ant.toLowerCase()}`, type: 'shortSigned' }, { key: 'category', label: 'Categoría', type: 'cat' }], rows: [...G.ents].sort((a, b) => b.vAct - a.vAct) },
      ] },
    planSection(B.plan.map((p) => ({ ...p, title: nice(p.entity), tag: `${p.grupo} · ${p.category}`, metric: `${fmt.pct(p.varUlt)} · ${fmt.short(p.impact, true)}` }))),
  ];
  return {
    scenario: 'ventas-familia', title: 'Caídas y crecimientos por familia', subtitle: `${L.ult} y ${L.ant.toLowerCase()} · actual vs anterior`, file: meta.fileName,
    kpis: [
      { label: `Venta ${L.ult.toLowerCase()} actual`, value: T.vAct, type: 'short', sub: `vs ${fmt.short(T.vPrev)}` },
      { label: `Variación ${L.ult.toLowerCase()}`, value: T.varUlt, type: 'pct', tone: T.varUlt < 0 ? 'neg' : 'pos', sub: fmt.short(T.impact, true) },
      { label: `Variación ${L.ant.toLowerCase()}`, value: T.varAnt, type: 'pct', tone: T.varAnt < 0 ? 'neg' : 'pos', sub: fmt.short(T.impactAlt, true) },
      { label: 'Categoría', text: T.category, sub: 'matriz ±10 %' },
    ],
    summary, risks: B.plan.filter((p) => p.inPareto).slice(0, 4).map((p) => `<b>${nice(p.entity)}</b> (${p.category}): ${fmt.pct(p.varUlt)}, ${fmt.short(p.impact, true)}.`),
    actions: B.plan.slice(0, 5).map((p) => `${nice(p.entity)}: ${p.solutions[0]}`), sections,
    notes: {
      method: [`"Último Año" = % ${L.ult} actual vs anterior (métrica principal y base del Pareto). "Año Anterior" = % ${L.ant}.`,
        'Los % se recalculan desde los pesos (el archivo los trae redondeados). Umbrales fijos de ±10%.'],
      quality: [`${B.rows.length} renglones; ${F.ents.length} familias únicas.`, B.dupNames.length ? `Familias repetidas en dos grupos, consolidadas por nombre: ${B.dupNames.map(nice).join(', ')}.` : null].filter(Boolean),
      limits: ['El archivo no indica las fechas de cada corte.', 'Sin vendedor, cliente, cuota ni unidades: las causas son hipótesis.'],
    },
  };
}

/* ------------------------------------------------------------------ */
export function reportVentasClientes(C, meta) {
  const T = C.T, U = fmt.money(C.umbral);
  const vs = [...C.vend].sort((a, b) => b.pctArriba - a.pctArriba);
  const lowCover = C.vend.filter((v) => v.pctArriba < 0.5 && v.clientes >= 5).sort((a, b) => a.pctArriba - b.pctArriba);
  const lostTop = [...C.vend].sort((a, b) => b.perdidos - a.perdidos)[0];
  const casi = C.clients.filter((c) => c.activo && !c.nuevo && c.var < -0.75);
  const summary = [
    { fig: fmt.pct0(T.pctArriba), tone: '', text: `<b>${T.arriba} de ${T.clientes} clientes compran más de ${U} al mes</b> y generan el ${fmt.pct(T.pctVentaArriba, false)} de la venta. Los otros ${T.clientes - T.arriba} aportan el ${fmt.pct(1 - T.pctVentaArriba, false)}.` },
    { fig: `${T.arriba - T.arriba25 >= 0 ? '+' : ''}${T.arriba - T.arriba25}`, tone: T.arriba >= T.arriba25 ? 'pos' : 'neg', text: `<b>Clientes arriba del umbral: de ${T.arriba25} a ${T.arriba}.</b> ${T.subieron} subieron de nivel y ${T.nuevosArriba} son nuevos arriba del umbral, contra ${T.bajaron} que bajaron.` },
    { fig: String(T.cerca), tone: '', text: `<b>Clientes a un paso del umbral</b> (${fmt.money(C.cerca)}–${U} al mes). Es la palanca más rápida para subir el indicador.` },
    { fig: String(C.cneg.n80), tone: 'neg', text: `<b>Clientes que explican el 80% de la caída</b> (${fmt.short(-C.cneg.total)} en ${C.cneg.rows.length} clientes que bajan). ${casi.length} clientes cayeron más de 75%.` },
  ];
  if (lostTop && lostTop.perdidos > 0) summary.push({ fig: fmt.short(T.perdidos), tone: 'neg', text: `<b>Venta del año anterior de clientes que no compraron este año (estimada)</b>. La mayor es de ${nice(lostTop.name)} (${fmt.short(lostTop.perdidos)}).` });
  const stackRows = vs.map((v) => ({ label: nice(v.name), segs: [{ v: v.arriba, tone: 'dark' }, { v: v.cerca, tone: 'amber' }, { v: v.clientes - v.arriba - v.cerca, tone: 'light' }],
    text: fmt.pct0(v.pctArriba), sub: `de ${v.clientes}`, alert: v.pctArriba < 0.5 }));
  const vCols = [{ key: 'name', label: 'Vendedor', type: 'text', fmt: nice }, { key: 'clientes', label: 'Clientes', type: 'int' }, { key: 'arriba', label: `> ${U}`, type: 'int' },
    { key: 'pctArriba', label: '%', type: 'pct0' }, { key: 'pctVentaArriba', label: '% venta', type: 'pct0' }, { key: 'cerca', label: 'Cerca', type: 'int' },
    { key: 'nuevos', label: 'Nuevos', type: 'int' }, { key: 'caen', label: 'Caen', type: 'int' }, { key: 'venta', label: 'Venta', type: 'short' }, { key: 'varV', label: 'Var.', type: 'pct' }];
  const vTotal = { name: 'Total', clientes: T.clientes, arriba: T.arriba, pctArriba: T.pctArriba, pctVentaArriba: T.pctVentaArriba, cerca: T.cerca, nuevos: T.nuevos,
    caen: sum(C.vend, (v) => v.caen), venta: T.venta, varV: T.var, _total: true };
  const sections = [
    { id: 'vendedores', title: 'Clientes por vendedor', kicker: 'Cobertura de cartera', lead: `Ordenados por % de clientes arriba de ${U}/mes. En rojo, quienes tienen menos de la mitad de su cartera arriba del umbral.`,
      blocks: [
        { type: 'stack', title: 'Composición de la cartera', rows: stackRows, legend: [{ tone: 'dark', label: `Arriba de ${U}/mes` }, { tone: 'amber', label: `Cerca (${fmt.money(C.cerca)}–${U})` }, { tone: 'light', label: 'Resto' }] },
        { type: 'table', title: 'Detalle por vendedor', columns: vCols, rows: [...C.vend, vTotal], pdfMax: 30 },
      ] },
    { id: 'segmentos', title: 'Segmentos y movimiento', kicker: 'Calidad de cartera',
      lead: `Promedio mensual = venta / ${C.meses} meses. Los clientes arriba de ${U} generan el ${fmt.pct(T.pctVentaArriba, false)} de la venta.`,
      blocks: [
        { type: 'bars', title: 'Clientes por compra mensual', rows: C.segRows.map((s) => ({ label: s.key, value: s.n, text: `${s.n} clientes · ${fmt.short(s.v)} (${fmt.pct0(s.v / T.ventaActiva)})`, tone: 'dark' })), half: true },
        { type: 'bridge', title: 'Clientes arriba del umbral: año anterior → actual', half: true, steps: [
          { label: 'Año anterior', value: T.arriba25, kind: 'base' }, { label: 'Subieron', value: T.subieron, kind: 'up' }, { label: 'Nuevos', value: T.nuevosArriba, kind: 'up' },
          { label: 'Bajaron', value: -T.bajaron, kind: 'down' }, { label: 'Actual', value: T.arriba, kind: 'base' }] },
      ] },
    { id: 'pareto', title: 'Pareto de clientes', kicker: 'Fugas y crecimiento', lead: `${C.cneg.n80} de ${C.cneg.rows.length} clientes explican el 80% de la caída (${fmt.short(-C.cneg.total)}); ${C.cpos.n80} de ${C.cpos.rows.length} explican el 80% del crecimiento (+${fmt.short(C.cpos.total)}).`,
      blocks: [
        { type: 'bars', title: 'Top 12 caídas', rows: C.cneg.rows.slice(0, 12).map((r) => ({ label: short(`${nice(r.cli)} · ${nice(r.vend).split(' ').slice(0, 2).join(' ')}`, 46), value: r.absImpact, text: `${fmt.short(r.impact, true)} · ${fmt.pct(r.var)}`, tone: 'neg' })) },
        { type: 'bars', title: 'Top 12 crecimientos', rows: C.cpos.rows.slice(0, 12).map((r) => ({ label: short(`${nice(r.cli)} · ${nice(r.vend).split(' ').slice(0, 2).join(' ')}`, 46), value: r.absImpact, text: `${fmt.short(r.impact, true)} · ${r.nuevo ? 'nuevo' : fmt.pct(r.var)}`, tone: 'pos' })) },
      ] },
    planSection(C.plan.map((p) => ({ ...p, title: nice(p.entity), tag: p.tipo === 'Vendedor' ? `${p.severidad} · ${p.clientes} clientes` : `${nice(p.vendedor)} · ${p.severidad}`, metric: `${fmt.pct(p.varUlt)} · ${fmt.short(p.impact, true)}` })),
      `${C.plan.filter((p) => p.tipo === 'Vendedor').length} vendedores en caída y ${C.plan.filter((p) => p.tipo === 'Cliente').length} clientes del Pareto 80% de caídas.`),
  ];
  return {
    scenario: 'ventas-clientes', title: `Clientes por vendedor y clientes arriba de ${U} al mes`, subtitle: `${C.vend.length} vendedores · ${C.Y || ''}`, file: meta.fileName,
    kpis: [
      { label: 'Clientes activos', value: T.clientes, type: 'int', sub: `${C.vend.length} vendedores` },
      { label: `Arriba de ${U}/mes`, value: T.arriba, type: 'int', sub: `${fmt.pct0(T.pctArriba)} · eran ${T.arriba25}` },
      { label: 'Venta de esos clientes', value: T.pctVentaArriba, type: 'pct0', sub: `de ${fmt.short(T.venta)}` },
      { label: 'Venta vs año anterior', value: T.var, type: 'pct', tone: T.var < 0 ? 'neg' : 'pos', sub: fmt.short(T.venta - T.vPrev, true) },
    ],
    summary,
    risks: [casi.length ? `<b>${casi.length} clientes casi perdidos</b> (caen más de 75%).` : null,
      lowCover.length ? `<b>Carteras con pocos clientes grandes:</b> ${lowCover.slice(0, 4).map((v) => `${nice(v.name)} (${fmt.pct0(v.pctArriba)})`).join(', ')}.` : null,
      C.vend.filter((v) => v.impact < 0).length ? `<b>Vendedores en caída:</b> ${C.vend.filter((v) => v.impact < 0).map((v) => nice(v.name)).join(', ')}.` : null].filter(Boolean),
    actions: ['Visitas de reactivación en 7 días a los clientes que cayeron más de 75%.',
      lostTop && lostTop.perdidos > 0 ? `Recuperar la lista de clientes del año anterior de ${nice(lostTop.name)} que no compraron este año.` : null,
      `Campaña para subir a los ${T.cerca} clientes cercanos por encima de ${U}/mes.`, 'Meta mensual por vendedor: número de clientes arriba del umbral.'].filter(Boolean),
    sections,
    notes: {
      method: [`Cliente arriba del umbral: venta del periodo / ${C.meses} meses > ${U}.`, 'Cada cuenta "Público en general" cuenta como 1 cliente.',
        'Venta del año anterior por cliente = venta / (1 + % variación); sin % = cliente nuevo.'],
      quality: [C.excluded.length ? `Excluidos ${C.excluded.length} clientes de vendedores "Casa"/"Ocasional" (${fmt.short(sum(C.excluded, (r) => r.vY ?? 0))}).` : null,
        `${C.clients.filter((c) => !c.activo).length} clientes con venta neta ≤ $0 quedan fuera del conteo.`].filter(Boolean),
      limits: ['Sin venta mes a mes, el umbral es un promedio del periodo.', 'Los clientes perdidos se estiman por diferencia contra el total del vendedor.'],
    },
  };
}

/* ------------------------------------------------------------------ */
export function reportCartera(R, meta) {
  const K = R.kpi;
  const mcols = R.m5.map((m) => ({ key: `h_${m}`, label: m, type: 'money', month: true }));
  const cl = R.clientes.map((c) => ({ ...c, ...Object.fromEntries(R.m5.map((m) => [`h_${m}`, c.hist[m]])) }));
  return {
    scenario: 'cartera', title: 'Cartera vencida · Guía 80-20', subtitle: `${nice(R.cedis)} · ${R.mes}`, file: meta.fileName,
    kpis: [
      { label: 'Clientes con deuda > 15 días', value: K.clientes, type: 'int', sub: K.prevClientes != null ? `mes anterior: ${K.prevClientes}` : '' },
      { label: 'Vencido > 15 días', value: K.vencido, type: 'short', sub: `${K.vendedores} vendedores` },
      { label: '% a más de 15 días', value: K.pct, type: 'pct2', sub: `lugar ${K.rank} de ${K.zonas} CEDIS` },
      { label: 'Corte 80-20', value: K.n80, type: 'int', sub: `clientes = ${fmt.pct0(K.pct80)} del vencido` },
    ],
    sections: [
      { id: 'desplegado', title: 'Desplegado Clientes', kicker: `${K.clientes} clientes`, lead: `Amarillo = desde el primer cliente hasta el que tiene el Total más cercano a 100% (${fmt.pct(K.totalCut, false)}).`,
        blocks: [{ type: 'table', guia: true, columns: [{ key: 'no', label: 'No', type: 'int' }, { key: 'pctNo', label: '%', type: 'pct2' }, { key: 'vend', label: 'Vendedor', type: 'text' },
          { key: 'cli', label: 'Cliente', type: 'text' }, ...mcols, { key: 'rel', label: '% suma acum', type: 'pct2' }, { key: 'cum', label: '% rel acum', type: 'pct2' }, { key: 'total', label: 'Total', type: 'pct2' }],
          rows: cl, highlight: 'amarillo' }] },
      { id: 'vencimiento', title: 'Resumen Vencimiento', kicker: `${K.vendedores} vendedores`, lead: 'Por vencimiento y por número de clientes; cada tabla con su propio corte 80-20.',
        blocks: [
          { type: 'table', title: 'Por vencimiento', half: true, highlight: 'amarillo', columns: [{ key: 'pctNo', label: '%', type: 'pct0' }, { key: 'vend', label: 'Vendedor', type: 'text' },
            { key: 'n', label: 'Clientes', type: 'int' }, { key: 'v', label: 'Vencido', type: 'money' }, { key: 'rel', label: '% rel', type: 'pct0' }, { key: 'cum', label: '% rel acum', type: 'pct0' }, { key: 'total', label: 'Total', type: 'pct0' }], rows: R.left },
          { type: 'table', title: 'Por clientes', half: true, highlight: 'amarillo', columns: [{ key: 'pctNo', label: '%', type: 'pct0' }, { key: 'vend', label: 'Vendedor', type: 'text' },
            { key: 'n', label: 'Clientes', type: 'int' }, { key: 'v', label: 'Vencido', type: 'money' }, { key: 'rel', label: '% rel', type: 'pct0' }, { key: 'cum', label: '% rel acum', type: 'pct0' }, { key: 'total', label: 'Total', type: 'pct0' }], rows: R.right },
        ] },
      { id: 'resumen', title: 'Resumen', kicker: 'Todos los CEDIS', lead: `Clientes con cartera vencida a más de 15 días (sin autoconsumo) y ranking por % del ${R.mes}.`,
        blocks: [
          { type: 'bars', title: '% a más de 15 días por CEDIS', rows: R.ranking.map((r) => ({ label: nice(r.zona), value: r.pct, text: `${fmt.pct(r.pct, false)} · ${fmt.short(r.v15)}`, tone: r.zona === R.cedis ? 'neg' : 'dark' })) },
          { type: 'table', title: 'Clientes con deuda > 15 días', columns: [{ key: 'zona', label: 'Zona', type: 'text' }, ...R.m13.map((m) => ({ key: `c_${m}`, label: m, type: 'int', month: true }))],
            rows: R.conteo.map((c) => ({ zona: c.zona, _hl: c.zona === R.cedis, ...Object.fromEntries(R.m13.map((m) => [`c_${m}`, c.per[m]])) })) },
        ] },
    ],
  };
}
