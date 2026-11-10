/* ==========================================================================
   Vista de resultados: KPIs con contador, pestañas con indicador deslizante,
   bloques animados al entrar en pantalla y tooltips.
   ========================================================================== */
import { fmt } from '../core/utils.js';
import { renderBlock, planCard, esc, formatValue } from './blocks.js';

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function kpiHTML(k, i) {
  const val = k.text != null ? `<div class="kpi-value is-text">${esc(k.text)}</div>`
    : `<div class="kpi-value ${k.tone ? 'tone-' + k.tone : ''}" data-count="${k.value}" data-type="${k.type}">${esc(formatValue(k.value, k.type))}</div>`;
  return `<div class="kpi" style="--i:${i}"><div class="kpi-label">${esc(k.label)}</div>${val}<div class="kpi-sub">${esc(k.sub || '')}</div></div>`;
}

function summaryPanel(rep) {
  if (!rep.summary) return '';
  const msgs = rep.summary.map((m, i) => `<div class="msg" style="--i:${i}"><div class="msg-fig ${m.tone ? 'tone-' + m.tone : ''}">${esc(m.fig)}</div><div class="msg-text">${m.text}</div></div>`).join('');
  const list = (arr) => `<ul class="bullets">${(arr || []).map((x) => `<li>${x}</li>`).join('') || '<li>Sin elementos.</li>'}</ul>`;
  const notes = rep.notes ? `<section class="card"><div class="card-title">Metodología, calidad y limitaciones</div><div class="notes">
      <div><h4>Metodología</h4><ul>${rep.notes.method.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <div><h4>Calidad de datos</h4><ul>${rep.notes.quality.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <div><h4>Limitaciones</h4><ul>${rep.notes.limits.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div></div></section>` : '';
  return `<div class="tabpanel" data-panel="resumen"><div class="blocks">
    <section class="card"><div class="card-title">Hallazgos principales</div><div class="msgs">${msgs}</div></section>
    <section class="card is-half"><div class="card-title">Riesgos comerciales</div>${list(rep.risks)}</section>
    <section class="card is-half"><div class="card-title">Acciones prioritarias</div>${list(rep.actions)}</section>
    ${notes}</div></div>`;
}

export function renderResults(root, rep) {
  const tabs = [...(rep.summary ? [{ id: 'resumen', title: 'Resumen ejecutivo' }] : []), ...rep.sections.map((s) => ({ id: s.id, title: s.title }))];
  root.innerHTML = `
    <div class="kpis">${rep.kpis.map(kpiHTML).join('')}</div>
    <nav class="tabs" role="tablist"><span class="tab-ink" aria-hidden="true"></span>${tabs.map((t, i) => `<button class="tab${i ? '' : ' is-active'}" role="tab" data-tab="${t.id}" aria-selected="${!i}">${esc(t.title)}</button>`).join('')}</nav>
    ${summaryPanel(rep)}
    ${rep.sections.map((s) => `<div class="tabpanel" data-panel="${s.id}">${s.lead ? `<p class="sec-lead">${s.lead}</p>` : ''}<div class="blocks">${s.blocks.map((b) => renderBlock(b)).join('')}</div></div>`).join('')}`;
  const panels = [...root.querySelectorAll('.tabpanel')], tabBtns = [...root.querySelectorAll('.tab')], ink = root.querySelector('.tab-ink');
  const moveInk = (btn) => { ink.style.width = `${btn.offsetWidth}px`; ink.style.transform = `translateX(${btn.offsetLeft}px)`; };
  const show = (id) => {
    tabBtns.forEach((b) => { const on = b.dataset.tab === id; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', on); if (on) { moveInk(b); b.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduce() ? 'auto' : 'smooth' }); } });
    panels.forEach((p) => { const on = p.dataset.panel === id; p.classList.toggle('is-active', on); if (on) animateIn(p); });
  };
  tabBtns.forEach((b) => b.addEventListener('click', () => show(b.dataset.tab)));
  window.addEventListener('resize', () => { const a = root.querySelector('.tab.is-active'); if (a) moveInk(a); });
  /* plan: "ver más" */
  root.querySelectorAll('[data-more-plan]').forEach((btn) => btn.addEventListener('click', () => {
    const sec = rep.sections.find((s) => s.id === 'plan'), grid = btn.closest('.card').querySelector('.plan-grid');
    const items = sec.blocks[0].items; grid.insertAdjacentHTML('beforeend', items.slice(12).map((p, i) => planCard(p, i)).join('')); btn.parentElement.remove();
  }));
  requestAnimationFrame(() => { show(tabs[0].id); countUp(root); });
}

/* Anima barras/segmentos cuando el panel se activa o entra en pantalla */
const io = 'IntersectionObserver' in window ? new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -40px 0px' }) : null;
function animateIn(panel) {
  panel.querySelectorAll('.card').forEach((c) => {
    if (c.classList.contains('is-in')) return;
    if (io) io.observe(c); else c.classList.add('is-in');
  });
  panel.querySelectorAll('.mx-c .n[data-count]').forEach((el) => tween(el, +el.dataset.count, (v) => String(Math.round(v)), 700));
}

export function countUp(root) {
  root.querySelectorAll('.kpi-value[data-count]').forEach((el) => {
    const target = +el.dataset.count, type = el.dataset.type;
    tween(el, target, (v) => formatValue(type === 'int' ? Math.round(v) : v, type), 1100);
  });
}
function tween(el, target, f, dur) {
  if (!Number.isFinite(target) || reduce()) { el.textContent = f(target); return; }
  const t0 = performance.now(), ease = (t) => 1 - Math.pow(1 - t, 4);
  const step = (now) => { const t = Math.min(1, (now - t0) / dur); el.textContent = f(target * ease(t)); if (t < 1) requestAnimationFrame(step); else el.textContent = f(target); };
  requestAnimationFrame(step);
}

/* Tooltip compartido para elementos con data-tip="título|detalle" */
export function initTooltips() {
  const tip = document.createElement('div'); tip.className = 'tip'; tip.setAttribute('role', 'tooltip'); document.body.appendChild(tip);
  let cur = null;
  document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const t = e.target.closest?.('[data-tip]');
    if (!t) { if (cur) { tip.classList.remove('is-on'); cur = null; } return; }
    if (t !== cur) { const [a, b] = t.dataset.tip.split('|'); tip.innerHTML = `<b>${esc(a)}</b><span class="mono">${esc(b || '')}</span>`; cur = t; tip.classList.add('is-on'); }
    const x = Math.min(e.clientX + 14, window.innerWidth - tip.offsetWidth - 10), y = Math.min(e.clientY + 16, window.innerHeight - tip.offsetHeight - 10);
    tip.style.left = `${x}px`; tip.style.top = `${y}px`;
  }, { passive: true });
}
