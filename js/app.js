/* ==========================================================================
   GAFI Analizador · flujo de la aplicación
   1 Tipo → 2 Archivo → 3 Configurar → 4 Resultados (PDF / Excel)
   ========================================================================== */
import { parseSales, parseCartera, SCENARIOS } from './core/parsers.js';
import { analyzeVentasAnual } from './core/ventas-anual.js';
import { analyzeVentasFamilia } from './core/ventas-familia.js';
import { analyzeVentasClientes } from './core/ventas-clientes.js';
import { analyzeCartera, cedisList } from './core/cartera.js';
import { reportVentasAnual, reportVentasFamilia, reportVentasClientes, reportCartera } from './core/reports.js';
import { fmt, nice, monthLong, monthLabel } from './core/utils.js';
import { renderResults, initTooltips } from './ui/render.js';
import { esc } from './ui/blocks.js';
import { excelVentasAnual, excelVentasFamilia, excelVentasClientes, excelCartera } from './export/excel.js';
import { buildPDF } from './export/pdf.js';

const SHEETJS = 'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js';
const loadScript = (src) => new Promise((ok, ko) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => ko(new Error(`No se pudo cargar ${src.split('/').pop()}. Revisa tu conexión a internet.`)); document.head.appendChild(s); });

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const S = { type: null, file: null, parsed: null, analysis: null, report: null };

/* ---------------- tema ---------------- */
const THEME_KEY = 'gafi-analizador-theme';
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  $('#themeBtn i').className = t === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  $('#themeBtn span').textContent = t === 'dark' ? 'Modo claro' : 'Modo oscuro';
  $('meta[name="theme-color"]').setAttribute('content', t === 'dark' ? '#08080a' : '#f5f4f1');
}
function initTheme() {
  let t = null; try { t = localStorage.getItem(THEME_KEY); } catch { /* sin almacenamiento */ }
  applyTheme(t || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
  $('#themeBtn').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    const go = () => { applyTheme(next); try { localStorage.setItem(THEME_KEY, next); } catch { /* */ } };
    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(go); else go();
  });
}

/* ---------------- toasts ---------------- */
export function toast(title, msg = '', kind = 'ok', ms = 4200) {
  const icon = { ok: 'fa-circle-check', err: 'fa-triangle-exclamation', info: 'fa-circle-info' }[kind];
  const el = document.createElement('div'); el.className = `toast toast--${kind} is-enter`; el.setAttribute('role', kind === 'err' ? 'alert' : 'status');
  el.innerHTML = `<i class="fa-solid ${icon}"></i><div><b>${esc(title)}</b>${msg ? `<span>${esc(msg)}</span>` : ''}</div><button class="x" aria-label="Cerrar"><i class="fa-solid fa-xmark"></i></button>`;
  $('#toasts').appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('is-enter')));
  let timer; const close = () => { clearTimeout(timer); el.classList.add('is-leave'); setTimeout(() => el.remove(), 220); };
  const arm = () => { timer = setTimeout(close, ms); };
  el.addEventListener('mouseenter', () => clearTimeout(timer)); el.addEventListener('mouseleave', arm);
  el.querySelector('.x').addEventListener('click', close); arm();
}
const loader = (on, text = '', sub = '') => { $('#loader').classList.toggle('is-on', on); if (text) $('#loaderText').textContent = text; $('#loaderSub').textContent = sub; };

/* ---------------- navegación ---------------- */
function go(step) {
  $$('.view').forEach((v) => v.classList.toggle('is-active', v.dataset.view === String(step)));
  $$('.step').forEach((s) => { const n = +s.dataset.step; s.classList.toggle('is-active', n === step); s.classList.toggle('is-done', n < step); });
  $('#newBtn').hidden = step < 4;
  window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

/* ---------------- paso 1: tipo ---------------- */
function initTypes() {
  $$('.type-card').forEach((c) => {
    c.addEventListener('pointermove', (e) => { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', `${e.clientX - r.left}px`); c.style.setProperty('--my', `${e.clientY - r.top}px`); });
    c.addEventListener('click', () => selectType(c.dataset.type));
  });
}
function selectType(t) {
  S.type = t;
  $('#fileKind').textContent = t === 'ventas' ? 'Ventas' : 'Cartera vencida';
  $('#fileKindIcon').className = `fa-solid ${t === 'ventas' ? 'fa-chart-column' : 'fa-file-invoice-dollar'}`;
  $('#dropHint').innerHTML = t === 'ventas'
    ? 'Reconoce: <b>Cedis · Vendedor · Familia</b> (2 años), <b>Reporte Ventas por Familia</b> (periodo y trimestre) y <b>Vendedor · Cliente</b> (1 año).'
    : 'Reconoce el archivo <b>Cartera Vencida</b> (.xlsb / .xlsx) con la hoja <b>antiguedad</b>.';
  go(2);
}

/* ---------------- paso 2: archivo ---------------- */
function initDrop() {
  const drop = $('#drop'), input = $('#fileInput');
  drop.addEventListener('click', () => input.click());
  drop.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
  input.addEventListener('change', () => { if (input.files[0]) handleFile(input.files[0]); input.value = ''; });
  ['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('is-over'); }));
  ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('is-over'); }));
  drop.addEventListener('drop', (e) => { const f = e.dataTransfer.files[0]; if (f) handleFile(f); });
  $('#backType').addEventListener('click', () => go(1));
}

/* Lectura en Web Worker; si el navegador no lo permite (p. ej. al abrir con doble clic, file://)
   se lee en la página principal con el mismo código (read-core.js). */
function readInWorker(buf) {
  return new Promise((resolve, reject) => {
    let w;
    try { w = new Worker('js/core/reader.worker.js'); } catch (e) { reject(Object.assign(e, { fallback: true })); return; }
    w.onmessage = ({ data }) => {
      if (data.progress) { loader(true, 'Leyendo archivo', data.progress); return; }
      w.terminate(); data.ok ? resolve(data) : reject(new Error(data.error));
    };
    w.onerror = (e) => { e.preventDefault?.(); w.terminate(); reject(Object.assign(new Error(e.message || 'Worker no disponible'), { fallback: true })); };
    w.postMessage({ buf: buf.slice(0) });
  });
}
async function readInPage(buf) {
  if (!window.XLSX) await loadScript(SHEETJS);
  if (!window.GAFIRead) await loadScript('js/core/read-core.js');
  await new Promise((r) => setTimeout(r, 30));
  return window.GAFIRead.read(buf, (msg) => loader(true, 'Leyendo archivo', msg));
}
async function readBook(buf) {
  if (location.protocol.startsWith('http')) {
    try { return await readInWorker(buf); } catch (err) { if (!err.fallback) throw err; console.warn('[lectura] sin worker, uso página principal', err); }
  }
  return readInPage(buf);
}

async function handleFile(file) {
  if (!/\.(xlsx|xlsm|xlsb|xls)$/i.test(file.name)) { toast('Formato no compatible', 'Selecciona un archivo de Excel (.xlsx, .xlsb, .xls).', 'err'); return; }
  S.file = file;
  loader(true, 'Leyendo archivo', `${file.name} · ${(file.size / 1048576).toFixed(1)} MB`);
  try {
    const buf = await file.arrayBuffer();
    const res = await readBook(buf);
    loader(true, 'Detectando formato', res.sheet);
    await new Promise((r) => setTimeout(r, 30));
    const parsed = res.kind === 'cartera' ? parseCartera(res.aoa) : parseSales(res.aoa);
    parsed.sheet = res.sheet; parsed.rowsRead = res.rows;
    const kind = SCENARIOS[parsed.scenario].kind;
    if (kind !== S.type) { toast('Cambié el tipo de análisis', `El archivo es de ${kind === 'ventas' ? 'Ventas' : 'Cartera vencida'}.`, 'info'); S.type = kind; }
    S.parsed = parsed;
    buildConfig();
    loader(false); go(3);
  } catch (err) {
    loader(false); console.error(err);
    toast('No pude leer el archivo', err.message, 'err', 7000);
  }
}

/* ---------------- paso 3: configuración ---------------- */
function buildConfig() {
  const p = S.parsed, sc = SCENARIOS[p.scenario];
  $('#detIcon').className = `fa-solid ${sc.icon}`;
  $('#detName').textContent = sc.name;
  $('#detMeta').textContent = `${S.file.name} · hoja "${p.sheet}" · ${fmt.int(p.rowsRead)} renglones`;
  const f = $('#cfgFields'), rules = $('#cfgRules');
  let fields = '', r = [];
  if (p.scenario === 'ventas-anual') {
    const d = p.data;
    fields = sw('excludeHouse', 'Excluir vendedores "Casa" / "Ocasional"', true, 'Fuera de reportes y de cálculos de caídas y crecimientos.');
    r = [`Comparativo ${d.Y} vs ${d.Y1} · dimensiones: ${d.dims.join(', ')}.`, `"Año Anterior" = % ${d.Y1} vs ${d.Y1 - 1}; "Último Año" = % ${d.Y} vs ${d.Y1}; umbrales fijos ±10%.`,
      'Pareto 80/20 por dimensión y plan de acción para Caída Libre, Alerta Roja, Alerta Amarilla y Suelo.'];
  } else if (p.scenario === 'ventas-familia') {
    fields = sw('swap', 'Invertir cortes', false, 'Por defecto: "Último Año" = Periodo y "Año Anterior" = Trimestre.');
    r = [`${p.data.rows.length} renglones de familia; las familias repetidas en dos grupos se consolidan por nombre.`, 'Los % se recalculan desde los pesos (el archivo los redondea).'];
  } else if (p.scenario === 'ventas-clientes') {
    fields = num('umbral', 'Umbral mensual por cliente ($)', 12000, 1000) + num('meses', 'Meses del periodo', 10, 1) +
      sw('excludeHouse', 'Excluir vendedores "Casa" / "Ocasional"', true, 'Fuera del conteo y de los cálculos.');
    r = ['Cliente arriba del umbral = venta del periodo / meses > umbral.', 'Cada cuenta "Público en general" cuenta como 1 cliente.', 'Cliente activo = venta neta mayor a $0.'];
  } else {
    const ced = cedisList(p.data), ms = p.data.meses;
    fields = sel('cedis', 'CEDIS', ced.map((z) => [z, nice(z)]), ced.find((z) => /quer/i.test(z)) || ced[0]) + sel('mes', 'Mes de corte', ms.map((m) => [m, monthLong(m)]).reverse(), ms.at(-1));
    r = ['"> 15 días", solo Mostradores (sin autoconsumo) y gestores CR01-CR02.', 'Vendedores "Casa" / "Ocasional" se mantienen en cartera.',
      'Amarillo: hasta la fila cuyo Total está más cerca de 100%.', 'Se descarga como "Cartera Vencida.xlsx" con las hojas Resumen, Desplegado Clientes y Resumen Vencimiento.'];
  }
  f.innerHTML = fields;
  rules.innerHTML = r.map((x) => `<li><i class="fa-solid fa-check"></i><span>${esc(x)}</span></li>`).join('');
}
const sw = (id, label, on, help) => `<label class="field switch" for="opt-${id}"><span>${esc(label)}<br><small>${esc(help)}</small></span><input type="checkbox" id="opt-${id}" data-opt="${id}" ${on ? 'checked' : ''}></label>`;
const num = (id, label, v, step) => `<div class="field"><label for="opt-${id}">${esc(label)}</label><input type="number" id="opt-${id}" data-opt="${id}" value="${v}" min="0" step="${step}"></div>`;
const sel = (id, label, opts, v) => `<div class="field"><label for="opt-${id}">${esc(label)}</label><select id="opt-${id}" data-opt="${id}">${opts.map(([k, t]) => `<option value="${esc(k)}" ${k === v ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></div>`;
const opts = () => Object.fromEntries($$('[data-opt]').map((el) => [el.dataset.opt, el.type === 'checkbox' ? el.checked : el.type === 'number' ? +el.value : el.value]));

/* ---------------- paso 4: análisis ---------------- */
async function runAnalysis() {
  const p = S.parsed, o = opts();
  loader(true, 'Analizando', SCENARIOS[p.scenario].name);
  await new Promise((r) => setTimeout(r, 40));
  try {
    const meta = { fileName: S.file.name };
    if (p.scenario === 'ventas-anual') { S.analysis = analyzeVentasAnual(p.data, o); S.report = reportVentasAnual(S.analysis, meta); }
    else if (p.scenario === 'ventas-familia') { S.analysis = analyzeVentasFamilia(p.data, o); S.report = reportVentasFamilia(S.analysis, meta); }
    else if (p.scenario === 'ventas-clientes') {
      if (!(o.umbral > 0) || !(o.meses > 0)) throw new Error('El umbral y los meses deben ser mayores a cero.');
      S.analysis = analyzeVentasClientes(p.data, o); S.report = reportVentasClientes(S.analysis, meta);
    } else { S.analysis = analyzeCartera(p.data, o); S.report = reportCartera(S.analysis, meta); S.report.subtitle = `${nice(o.cedis)} · ${monthLong(S.analysis.mes)}`; }
    const R = S.report;
    $('#resKicker').textContent = SCENARIOS[p.scenario].name;
    $('#resTitle').textContent = R.title;
    $('#resSub').innerHTML = `<span>${esc(R.subtitle)}</span><span class="chip"><i class="fa-solid fa-file"></i>${esc(S.file.name)}</span>`;
    $('#pdfBtn').hidden = p.scenario === 'cartera';
    $('#xlsBtn span').textContent = p.scenario === 'cartera' ? 'Descargar Cartera Vencida.xlsx' : 'Descargar Excel';
    renderResults($('#results'), R);
    loader(false); go(4);
    toast('Análisis listo', p.scenario === 'cartera' ? `${S.analysis.kpi.clientes} clientes con deuda a más de 15 días.` : 'Revisa las pestañas y descarga el PDF y el Excel.');
  } catch (err) { loader(false); console.error(err); toast('No pude completar el análisis', err.message, 'err', 7000); }
}

/* ---------------- descargas ---------------- */
const stamp = () => new Date().toISOString().slice(0, 10);
function download(blob, name) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
}
async function busy(btn, fn) { btn.classList.add('is-busy'); btn.disabled = true; const i = btn.querySelector('i'), c = i.className; i.className = 'fa-solid fa-circle-notch'; try { await fn(); } finally { i.className = c; btn.disabled = false; btn.classList.remove('is-busy'); } }
async function exportExcel() {
  await busy($('#xlsBtn'), async () => {
    try {
      if (!window.ExcelJS) await loadScript('https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js');
      const sc = S.parsed.scenario, A = S.analysis;
      const blob = sc === 'ventas-anual' ? await excelVentasAnual(A) : sc === 'ventas-familia' ? await excelVentasFamilia(A) : sc === 'ventas-clientes' ? await excelVentasClientes(A) : await excelCartera(A);
      const name = sc === 'cartera' ? 'Cartera Vencida.xlsx' : `Analisis de Ventas GAFI ${stamp()}.xlsx`;
      download(blob, name); toast('Excel descargado', name);
    } catch (err) { console.error(err); toast('No pude generar el Excel', err.message, 'err', 7000); }
  });
}
async function exportPDF() {
  await busy($('#pdfBtn'), async () => {
    try {
      loader(true, 'Generando PDF', 'Preparando páginas…');
      const n = await buildPDF(S.report, { fileName: `Reporte Ejecutivo GAFI ${stamp()}.pdf`, onProgress: (i, t) => loader(true, 'Generando PDF', `Página ${i} de ${t}`) });
      loader(false); toast('PDF descargado', `${n} páginas con el logo de GAFI Ferrelectrico.`);
    } catch (err) { loader(false); console.error(err); toast('No pude generar el PDF', err.message, 'err', 7000); }
  });
}

/* ---------------- arranque ---------------- */
function init() {
  initTheme(); initTypes(); initDrop(); initTooltips();
  $('#runBtn').addEventListener('click', runAnalysis);
  $('#backFile').addEventListener('click', () => go(2));
  $('#newBtn').addEventListener('click', () => { S.parsed = S.analysis = S.report = null; go(1); });
  $('#xlsBtn').addEventListener('click', exportExcel);
  $('#pdfBtn').addEventListener('click', exportPDF);
  $$('.step').forEach((s) => s.addEventListener('click', () => { const n = +s.dataset.step; if (s.classList.contains('is-done')) go(n); }));
  window.__gafi = S; // depuración
}
init();
