/* ==========================================================================
   GAFI Analizador · utilidades compartidas (sin DOM: se usan también en pruebas)
   ========================================================================== */

export const CATS = ['Acierto', 'Desaceleración', 'Caída Libre', 'Recuperación', 'Sin Pena Ni Gloria',
  'Alerta Amarilla', 'Efecto Rebote', 'Suelo', 'Alerta Roja'];
export const DROP_CATS = ['Caída Libre', 'Alerta Roja', 'Alerta Amarilla', 'Suelo'];
export const NC = 'No clasificable';

/* Matriz fija de clasificación (umbrales ±10 %): filas = Año Anterior, columnas = Último Año */
const MATRIX = {
  A: { A: 'Acierto', B: 'Desaceleración', C: 'Caída Libre' },
  B: { A: 'Recuperación', B: 'Sin Pena Ni Gloria', C: 'Alerta Amarilla' },
  C: { A: 'Efecto Rebote', B: 'Suelo', C: 'Alerta Roja' },
};
export const MATRIX_LAYOUT = [
  ['> +10 %', ['Acierto', 'Desaceleración', 'Caída Libre']],
  ['±10 %', ['Recuperación', 'Sin Pena Ni Gloria', 'Alerta Amarilla']],
  ['< −10 %', ['Efecto Rebote', 'Suelo', 'Alerta Roja']],
];

export function bucket(x) {
  if (x == null || !Number.isFinite(x)) return null;
  const v = Math.round(x * 1e6) / 1e6;
  return v > 0.1 ? 'A' : v < -0.1 ? 'C' : 'B';
}
export function classify(ant, ult) {
  const a = bucket(ant), u = bucket(ult);
  return a && u ? MATRIX[a][u] : NC;
}

/** Vendedores "casa" u "ocasional" (regla de reportes de ventas). */
export const isHouse = (v) => /casa|ocasional/i.test(String(v || ''));
export const isPublico = (c) => /p[uú]blico/i.test(String(c || ''));

/** Pareto acumulado: incluye entidades hasta cruzar el umbral (incluye la que lo cruza). */
export function pareto(items, sign, thr = 0.8, key = 'impact') {
  const s = items.filter((i) => (sign < 0 ? i[key] < 0 : i[key] > 0))
    .sort((a, b) => Math.abs(b[key]) - Math.abs(a[key]));
  const total = s.reduce((t, i) => t + Math.abs(i[key]), 0);
  let cum = 0;
  const rows = s.map((i, k) => {
    const share = total ? Math.abs(i[key]) / total : 0;
    const prev = cum; cum += share;
    return { ...i, rank: k + 1, share, cum, inPareto: prev < thr };
  });
  return { total, rows, n80: rows.filter((r) => r.inPareto).length, cut: rows.filter((r) => r.inPareto).at(-1)?.cum ?? 0 };
}

/* ---------- números ---------- */
export function num(v) {
  if (v == null || v === '') return null;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  const s = String(v).replace(/[$,\s]/g, '').replace('%', '');
  if (s === '' || s === '-') return null;
  const n = Number(s);
  return Number.isFinite(n) ? (String(v).includes('%') ? n / 100 : n) : null;
}
export const sum = (arr, f = (x) => x) => arr.reduce((t, x) => t + (f(x) || 0), 0);
export const groupBy = (arr, f) => arr.reduce((m, x) => { const k = f(x); (m.get(k) || m.set(k, []).get(k)).push(x); return m; }, new Map());

/* ---------- formato es-MX ---------- */
const nf0 = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const nf2 = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const fmt = {
  int: (x) => (x == null ? '—' : nf0.format(x)),
  money: (x) => (x == null ? '—' : (x < 0 ? '-$' : '$') + nf0.format(Math.abs(x))),
  /** Compacto: $1.23 M / $456 mil / $980 */
  short(x, signed = false) {
    if (x == null || !Number.isFinite(x)) return '—';
    const s = x < 0 ? '-' : signed && x > 0 ? '+' : '';
    const a = Math.abs(x);
    if (a >= 1e6) return `${s}$${nf2.format(a / 1e6)} M`;
    if (a >= 1e3) return `${s}$${nf0.format(a / 1e3)} mil`;
    return `${s}$${nf0.format(a)}`;
  },
  pct(x, signed = true) {
    if (x == null || !Number.isFinite(x)) return '—';
    const v = x * 100;
    return `${signed && v > 0 ? '+' : ''}${nf1.format(v)}%`;
  },
  pct0: (x) => (x == null || !Number.isFinite(x) ? '—' : `${nf0.format(x * 100)}%`),
};

/* ---------- textos ---------- */
const ACC = [['Garcia', 'García'], ['Hernandez', 'Hernández'], ['Martinez', 'Martínez'], ['Gonzalez', 'González'], ['Rodriguez', 'Rodríguez'],
  ['Perez', 'Pérez'], ['Sanchez', 'Sánchez'], ['Ramirez', 'Ramírez'], ['Gutierrez', 'Gutiérrez'], ['Chavez', 'Chávez'], ['Jimenez', 'Jiménez'],
  ['Lopez', 'López'], ['Gomez', 'Gómez'], ['Diaz', 'Díaz'], ['Alvarez', 'Álvarez'], ['Resendiz', 'Reséndiz'], ['Aviles', 'Avilés'], ['Teran', 'Terán'],
  ['Mendez', 'Méndez'], ['Suarez', 'Suárez'], ['Tuberia', 'Tubería'], ['Valvulas', 'Válvulas'], ['Iluminacion', 'Iluminación'], ['Conexion', 'Conexión'],
  ['Ferreteria', 'Ferretería'], ['Electricas', 'Eléctricas'], ['Electricos', 'Eléctricos'], ['Electrica', 'Eléctrica']];
export function nice(s) {
  if (s == null) return '';
  let out = String(s).trim().toLowerCase().replace(/(^|[\s(/.-])([a-záéíóúñü])/g, (m, a, b) => a + b.toUpperCase());
  out = out.replace(/\b(De|Del|La|Las|Los|Y|Para|P|Con|En)\b/g, (w) => w.toLowerCase());
  out = out.charAt(0).toUpperCase() + out.slice(1);
  for (const [a, b] of ACC) out = out.replace(new RegExp(`\\b${a}\\b`, 'g'), b);
  out = out.replace(/\b(Pvc|Cpvc|Pe|Wc|Led|Qro|Slp|Gdl|Cd|Sa|Cv|Dni|Cr\d\d)\b/g, (w) => w.toUpperCase());
  return out;
}
export const norm = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();

/* ---------- fechas (serial de Excel) ---------- */
export function excelSerialToDate(v) {
  if (v instanceof Date) return new Date(Date.UTC(v.getFullYear(), v.getMonth(), 1));
  const n = num(v);
  if (n == null) return null;
  const d = new Date(Math.round((n - 25569) * 86400000));
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
export const monthKey = (d) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
export const monthLabel = (key) => { const [y, m] = key.split('-'); return `${MESES[+m - 1]}-${y.slice(2)}`; };
export const monthLong = (key) => {
  const L = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const [y, m] = key.split('-'); return `${L[+m - 1]} ${y}`;
};
export const keyToDate = (key) => { const [y, m] = key.split('-'); return new Date(Date.UTC(+y, +m - 1, 1)); };
export const todayLong = () => new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
