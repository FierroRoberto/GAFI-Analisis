/* ==========================================================================
   Renderizado de bloques (interfaz y PDF): barras SVG animadas, composición,
   puente, matriz 3×3, tablas y plan de acción. Devuelven HTML (string).
   ========================================================================== */
import { CATS, MATRIX_LAYOUT, fmt, nice, monthLabel } from '../core/utils.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export { esc };

export function formatValue(v, type) {
  switch (type) {
    case 'int': return fmt.int(v);
    case 'money': return fmt.money(v);
    case 'short': return fmt.short(v);
    case 'shortSigned': return fmt.short(v, true);
    case 'pct': return fmt.pct(v);
    case 'pct0': return fmt.pct0(v);
    case 'pct2': return v == null ? '—' : `${(v * 100).toFixed(2)}%`;
    default: return v == null ? '' : String(v);
  }
}
export function catClass(c) {
  if (['Acierto', 'Recuperación', 'Efecto Rebote'].includes(c)) return 'cat--good';
  if (['Caída Libre', 'Alerta Roja'].includes(c)) return 'cat--bad';
  if (['Alerta Amarilla', 'Suelo'].includes(c)) return 'cat--warn';
  return '';
}

/* ---------- barras horizontales (SVG + CSS, crecen desde 0 con ease elástico) ---------- */
export function bars(block) {
  if (!block.rows?.length) return '<p class="empty-note">Sin datos para graficar.</p>';
  const max = Math.max(...block.rows.map((r) => r.value)) || 1;
  return `<div class="bars" role="list">${block.rows.map((r, i) => {
    const w = Math.max(0.6, (r.value / max) * 100);
    return `<div class="bar-row" role="listitem" style="--i:${i}" data-tip="${esc(r.label)}|${esc(r.text)}${r.extra ? ' · ' + esc(r.extra) : ''}">
      <span class="bar-label" title="${esc(r.label)}">${esc(r.label)}</span>
      <span class="bar-track"><svg class="bar-svg" aria-hidden="true"><rect class="track" x="0" y="2" width="100%" height="12" rx="6"/><rect class="bar t-${r.tone || 'dark'}" x="0" y="2" width="${w.toFixed(2)}%" height="12" rx="6"/></svg>
      <span class="bar-val">${esc(r.text)}${r.extra ? ` <span class="x">· ${esc(r.extra)}</span>` : ''}</span></span></div>`;
  }).join('')}</div>`;
}

/* ---------- composición apilada por fila ---------- */
export function stack(block) {
  const max = Math.max(...block.rows.map((r) => r.segs.reduce((t, s) => t + s.v, 0))) || 1;
  const legend = `<div class="legend">${block.legend.map((l) => `<span><i class="sw t-${l.tone}"></i>${esc(l.label)}</span>`).join('')}</div>`;
  return legend + `<div class="bars">${block.rows.map((r, i) => {
    let x = 0;
    const segs = r.segs.map((s, j) => {
      const w = (s.v / max) * 100; const out = s.v > 0 ? `<rect class="seg t-${s.tone}" style="--i:${i};--j:${j}" x="${x.toFixed(2)}%" y="2" width="${Math.max(w - 0.35, 0.3).toFixed(2)}%" height="12" rx="3"/>` +
        (w > 4 ? `<text class="seg-txt" style="--i:${i}" x="${(x + w / 2).toFixed(2)}%" y="11.5" text-anchor="middle" fill="${s.tone === 'dark' ? 'var(--bg)' : 'var(--text)'}">${s.v}</text>` : '') : '';
      x += w; return out;
    }).join('');
    return `<div class="bar-row stack-row${r.alert ? ' is-alert' : ''}" style="--i:${i}" data-tip="${esc(r.label)}|${r.segs.map((s, j) => `${block.legend[j].label}: ${s.v}`).join(' · ')}">
      <span class="bar-label">${esc(r.label)}</span>
      <span class="bar-track"><svg class="bar-svg" aria-hidden="true">${segs}</svg><span class="bar-val"><b>${esc(r.text)}</b> <span class="x">${esc(r.sub || '')}</span></span></span></div>`;
  }).join('')}</div>`;
}

/* ---------- puente vertical (año anterior → actual) ---------- */
export function bridge(block) {
  const W = 420, H = 230, top = 26, bot = 40, n = block.steps.length;
  let run = 0; const pts = block.steps.map((s) => {
    let y0, y1;
    if (s.kind === 'base') { y0 = 0; y1 = s.value; run = s.value; } else if (s.kind === 'up') { y0 = run; y1 = run + s.value; run += s.value; } else { y0 = run + s.value; y1 = run; run += s.value; }
    return { ...s, y0, y1 };
  });
  const mx = Math.max(...pts.map((p) => p.y1)) * 1.08 || 1, sc = (H - top - bot) / mx, bw = 50, gap = (W - n * bw) / (n + 1);
  const cols = pts.map((p, i) => {
    const x = gap + i * (bw + gap), yt = H - bot - p.y1 * sc, h = Math.max((p.y1 - p.y0) * sc, 2);
    const cls = p.kind === 'base' ? 't-dark' : p.kind === 'up' ? 't-pos' : 't-neg';
    return `<rect class="bcol ${cls}" style="--i:${i}" x="${x}" y="${yt}" width="${bw}" height="${h}" rx="4"/>
      <text class="bval" style="--i:${i}" x="${x + bw / 2}" y="${yt - 7}" text-anchor="middle">${p.kind === 'up' ? '+' : ''}${p.value}</text>
      <text class="blab" x="${x + bw / 2}" y="${H - bot + 18}" text-anchor="middle">${esc(p.label)}</text>`;
  }).join('');
  return `<svg class="bridge" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(block.title)}"><line class="base" x1="0" x2="${W}" y1="${H - bot}" y2="${H - bot}"/>${cols}</svg>`;
}

/* ---------- matriz 3×3 ---------- */
export function matrix(block) {
  const mx = Math.max(...CATS.map((c) => block.counts[c] || 0)) || 1;
  let k = 0;
  const head = `<div class="mx-corner">Año ant. ↓ / Último →</div>${['> +10 %', '±10 %', '< −10 %'].map((h) => `<div class="mx-h">${h}</div>`).join('')}`;
  const body = MATRIX_LAYOUT.map(([lab, cats]) => `<div class="mx-h row">${lab}</div>` + cats.map((c) => {
    const n = block.counts[c] || 0, a = (n / mx) * 0.9;
    return `<div class="mx-c${a > 0.5 ? ' is-strong' : ''}" style="--a:${a.toFixed(3)};--i:${k++}" data-tip="${esc(c)}|${n} entidades · impacto ${esc(fmt.short(block.impacts[c] || 0, true))}">
      <b>${c}</b><span class="n" data-count="${n}">${n}</span><span class="s">${n ? esc(fmt.short(block.impacts[c] || 0, true)) : '—'}</span></div>`;
  }).join('')).join('');
  const nc = block.counts['No clasificable'];
  return `<div class="matrix">${head}${body}</div>${nc ? `<p class="empty-note" style="margin-top:8px">${nc} no clasificable(s): sin base para calcular el %.</p>` : ''}`;
}

/* ---------- tabla ---------- */
export function table(block, { max } = {}) {
  const rows = max ? block.rows.slice(0, max) : block.rows;
  const isNum = (t) => !['text', 'cat'].includes(t);
  const th = block.columns.map((c) => `<th class="${isNum(c.type) ? '' : 'l'}">${esc(c.month ? monthLabel(c.label) : c.label)}</th>`).join('');
  const tb = rows.map((r) => {
    const cls = [r[block.highlight] ? 'is-yellow' : '', r._hl ? 'is-hl' : '', r._total ? 'is-total' : ''].filter(Boolean).join(' ');
    return `<tr class="${cls}">${block.columns.map((c) => {
      let v = r[c.key];
      if (c.type === 'cat') return `<td class="l"><span class="cat ${catClass(v)}">${esc(v)}</span></td>`;
      if (c.type === 'text') { const s = c.fmt ? c.fmt(v) : v; return `<td class="l" title="${esc(s)}">${esc(s)}</td>`; }
      const tone = (c.type === 'pct' || c.type === 'shortSigned') && v != null ? (v < 0 ? ' tone-neg' : '') : '';
      return `<td class="num${tone}">${esc(formatValue(v, c.type))}</td>`;
    }).join('')}</tr>`;
  }).join('');
  const more = max && block.rows.length > max ? `<p class="pdf-note" style="margin-top:4px">Se muestran ${max} de ${block.rows.length} renglones; el detalle completo está en el Excel.</p>` : '';
  return `<div class="tbl-wrap"><table class="tbl"><thead><tr>${th}</tr></thead><tbody>${tb}</tbody></table></div>${more}`;
}

/* ---------- plan de acción ---------- */
export function planCard(p, i) {
  return `<article class="plan-card" style="--i:${i % 12}">
    <div class="plan-top"><span class="plan-name">${esc(p.title)}${p.inPareto ? '<span class="pareto-flag">PARETO</span>' : ''}</span><span class="plan-metric">${esc(p.metric)}</span></div>
    <div class="plan-tag">${esc(p.tag)}</div><p class="plan-diag">${esc(p.diag)}</p>
    <ol>${p.solutions.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></article>`;
}
export function plan(block, { limit = 12 } = {}) {
  if (!block.items.length) return '<p class="empty-note">No hay entidades con caída relevante: no se generan soluciones.</p>';
  const shown = block.items.slice(0, limit);
  return `<div class="plan-grid">${shown.map(planCard).join('')}</div>` +
    (block.items.length > limit ? `<div class="plan-more"><button class="btn" data-more-plan><i class="fa-solid fa-chevron-down"></i><span>Ver las ${block.items.length - limit} restantes</span></button></div>` : '');
}

export function renderBlock(b, opts = {}) {
  const title = b.title && b.type !== 'plan' ? `<div class="card-title">${esc(b.title)}</div>` : '';
  let inner = '';
  switch (b.type) {
    case 'bars': inner = bars(b); break;
    case 'stack': inner = stack(b); break;
    case 'bridge': inner = bridge(b); break;
    case 'matrix': inner = matrix(b); break;
    case 'table': inner = table(b, { max: opts.pdf ? b.pdfMax || 22 : null }); break;
    case 'plan': inner = plan(b, opts); break;
    default: inner = '';
  }
  return `<section class="card${b.half ? ' is-half' : ''}" data-block="${b.type}">${title}${inner}</section>`;
}
