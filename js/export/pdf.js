/* ==========================================================================
   PDF ejecutivo (descarga directa): páginas carta con logo y nombre de
   GAFI Ferrelectrico en cada hoja · html2canvas + jsPDF
   ========================================================================== */
import { todayLong } from '../core/utils.js';
import { renderBlock, planCard, esc, formatValue } from '../ui/blocks.js';
import { LOGO_DATA_URL } from '../ui/logo-data.js';

const LIBS = {
  html2canvas: 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  jspdf: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
};
const loadScript = (src) => new Promise((ok, ko) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => ko(new Error(`No se pudo cargar ${src}`)); document.head.appendChild(s); });
async function ensureLibs() {
  if (!window.html2canvas) await loadScript(LIBS.html2canvas);
  if (!window.jspdf) await loadScript(LIBS.jspdf);
}

export async function buildPDF(rep, { logo = LOGO_DATA_URL, fileName = 'Reporte GAFI.pdf', onProgress = () => {} } = {}) {
  await ensureLibs();
  const stage = document.createElement('div'); stage.className = 'pdf-stage'; stage.setAttribute('aria-hidden', 'true'); document.body.appendChild(stage);
  const pages = [];
  const newPage = (cover = false) => {
    const p = document.createElement('section'); p.className = `pdf-page${cover ? ' pdf-cover' : ''}`;
    p.innerHTML = `<header class="pdf-hdr"><img src="${logo}" alt=""><div class="pdf-brand"><b>GAFI</b> Ferrelectrico</div><div class="rt">${esc(rep.title)}<br>${esc(rep.subtitle)}</div></header>
      <div class="pdf-body"></div><footer class="pdf-ftr"><span>GAFI Ferrelectrico · Dirección Comercial · Elaborado el ${esc(todayLong())}</span><span class="pg"></span></footer>`;
    stage.appendChild(p); pages.push(p); return p.querySelector('.pdf-body');
  };
  const overflows = (body) => body.scrollHeight > body.clientHeight + 1;
  /** Agrega html; si no cabe, abre página nueva (con título de continuación). */
  let body;
  const add = (html, contTitle) => {
    const tmp = document.createElement('div'); tmp.innerHTML = html; const el = tmp.firstElementChild;
    body.appendChild(el);
    if (overflows(body) && body.children.length > 1) {
      el.remove(); body = newPage();
      if (contTitle) body.insertAdjacentHTML('beforeend', `<div class="pdf-kick">${esc(contTitle)} · continuación</div>`);
      body.appendChild(el);
    }
    return el;
  };

  /* ---------- portada ---------- */
  body = newPage(true);
  body.insertAdjacentHTML('beforeend', `<img class="pdf-mark" src="${logo}" alt="">
    <div class="pdf-kick">Reporte ejecutivo · Dirección comercial</div>
    <h1 class="pdf-h1">${esc(rep.title)}</h1>
    <p class="pdf-lead" style="font-size:13px">${esc(rep.subtitle)} · Archivo: ${esc(rep.file || '')}</p>
    <div class="pdf-kpis">${rep.kpis.map((k) => `<div class="pdf-kpi"><div class="v ${k.text != null ? 'txt' : ''}" style="${k.tone === 'neg' ? 'color:#c62828' : k.tone === 'pos' ? 'color:#1c5cab' : ''}">${esc(k.text ?? formatValue(k.value, k.type))}</div><div class="l">${esc(k.label)}</div><div class="s">${esc(k.sub || '')}</div></div>`).join('')}</div>
    ${rep.notes ? `<div><div class="pdf-h3">Reglas del análisis</div><div class="pdf-rules">${[...rep.notes.method, ...rep.notes.quality].map((t, i) => `<div><span>${String(i + 1).padStart(2, '0')}</span><p>${esc(t)}</p></div>`).join('')}</div></div>` : ''}`);
  /* ---------- resumen ejecutivo ---------- */
  if (rep.summary) {
    body = newPage();
    body.insertAdjacentHTML('beforeend', `<div><div class="pdf-kick">Resumen ejecutivo</div><h2 class="pdf-h2">Hallazgos principales</h2></div>
      <div class="msgs pdf-msgs">${rep.summary.map((m) => `<div class="msg"><div class="msg-fig" style="${m.tone === 'neg' ? 'color:#c62828' : m.tone === 'pos' ? 'color:#1c5cab' : ''}">${esc(m.fig)}</div><div class="msg-text">${m.text}</div></div>`).join('')}</div>
      <div class="pdf-cols"><div><div class="pdf-h3">Riesgos comerciales</div><ul class="bullets">${(rep.risks || []).map((x) => `<li>${x}</li>`).join('')}</ul></div>
      <div><div class="pdf-h3">Acciones prioritarias</div><ul class="bullets">${(rep.actions || []).map((x) => `<li>${x}</li>`).join('')}</ul></div></div>
      ${rep.notes ? `<div><div class="pdf-h3">Limitaciones</div><ul class="bullets">${rep.notes.limits.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}`);
  }
  /* ---------- secciones ---------- */
  for (const sec of rep.sections) {
    const head = `<div><div class="pdf-kick">${esc(sec.kicker || '')}</div><h2 class="pdf-h2">${esc(sec.title)}</h2>${sec.lead ? `<p class="pdf-lead" style="margin-top:6px">${sec.lead}</p>` : ''}</div>`;
    if (sec.blocks.length) { body = newPage(); body.insertAdjacentHTML('beforeend', head); } else { add(head); continue; }
    let halfBuf = [];
    const flushHalf = () => { if (!halfBuf.length) return; add(`<div class="pdf-cols">${halfBuf.join('')}</div>`, sec.title); halfBuf = []; };
    for (const b of sec.blocks) {
      if (b.type === 'plan') {
        const items = b.items.slice(0, 12);
        add(`<div class="card"><div class="card-title">Plan de acción · ${b.items.length} entidades${b.items.length > items.length ? ` (se muestran ${items.length}; el resto en el Excel)` : ''}</div></div>`, sec.title);
        for (let i = 0; i < items.length; i += 2) add(`<div class="plan-grid">${items.slice(i, i + 2).map(planCard).join('')}</div>`, sec.title);
        continue;
      }
      const html = renderBlock(b, { pdf: true });
      if (b.half) { halfBuf.push(html); if (halfBuf.length === 2) flushHalf(); continue; }
      flushHalf();
      const el = add(html, sec.title);
      if (b.type === 'table' && overflows(body)) { // recorta filas hasta que quepa
        const rowsEl = el.querySelectorAll('tbody tr');
        for (let k = rowsEl.length - 1; k > 3 && overflows(body); k--) rowsEl[k].remove();
        if (!el.querySelector('.pdf-note')) el.insertAdjacentHTML('beforeend', '<p class="pdf-note" style="margin-top:4px">Detalle completo en el Excel.</p>');
      }
    }
    flushHalf();
  }
  pages.forEach((p, i) => { p.querySelector('.pg').textContent = `${String(i + 1).padStart(2, '0')} / ${String(pages.length).padStart(2, '0')}`; });

  /* ---------- rasterizar y armar el PDF ---------- */
  await document.fonts.ready;
  await Promise.all([...stage.querySelectorAll('img')].map((im) => (im.complete ? 0 : new Promise((r) => { im.onload = im.onerror = r; }))));
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit: 'pt', format: 'letter', orientation: 'portrait', compress: true });
  for (let i = 0; i < pages.length; i++) {
    onProgress(i + 1, pages.length);
    const canvas = await window.html2canvas(pages[i], { scale: 2, backgroundColor: '#fbfaf7', useCORS: true, logging: false, windowWidth: 1400 });
    if (i) pdf.addPage('letter', 'portrait');
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 612, 792, undefined, 'FAST');
  }
  pdf.setProperties({ title: rep.title, subject: rep.subtitle, author: 'GAFI Ferrelectrico', creator: 'GAFI Analizador' });
  stage.remove();
  pdf.save(fileName);
  return pages.length;
}
