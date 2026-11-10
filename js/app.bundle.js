/* GAFI Analizador · bundle generado desde js/app.js (no editar a mano; ver README) */
(() => {
  // js/core/utils.js
  var CATS = [
    "Acierto",
    "Desaceleraci\xF3n",
    "Ca\xEDda Libre",
    "Recuperaci\xF3n",
    "Sin Pena Ni Gloria",
    "Alerta Amarilla",
    "Efecto Rebote",
    "Suelo",
    "Alerta Roja"
  ];
  var DROP_CATS = ["Ca\xEDda Libre", "Alerta Roja", "Alerta Amarilla", "Suelo"];
  var NC = "No clasificable";
  var MATRIX = {
    A: { A: "Acierto", B: "Desaceleraci\xF3n", C: "Ca\xEDda Libre" },
    B: { A: "Recuperaci\xF3n", B: "Sin Pena Ni Gloria", C: "Alerta Amarilla" },
    C: { A: "Efecto Rebote", B: "Suelo", C: "Alerta Roja" }
  };
  var MATRIX_LAYOUT = [
    ["> +10 %", ["Acierto", "Desaceleraci\xF3n", "Ca\xEDda Libre"]],
    ["\xB110 %", ["Recuperaci\xF3n", "Sin Pena Ni Gloria", "Alerta Amarilla"]],
    ["< \u221210 %", ["Efecto Rebote", "Suelo", "Alerta Roja"]]
  ];
  function bucket(x) {
    if (x == null || !Number.isFinite(x)) return null;
    const v = Math.round(x * 1e6) / 1e6;
    return v > 0.1 ? "A" : v < -0.1 ? "C" : "B";
  }
  function classify(ant, ult) {
    const a = bucket(ant), u = bucket(ult);
    return a && u ? MATRIX[a][u] : NC;
  }
  var isHouse = (v) => /casa|ocasional/i.test(String(v || ""));
  var isPublico = (c) => /p[uú]blico/i.test(String(c || ""));
  function pareto(items, sign, thr = 0.8, key = "impact") {
    const s = items.filter((i) => sign < 0 ? i[key] < 0 : i[key] > 0).sort((a, b) => Math.abs(b[key]) - Math.abs(a[key]));
    const total = s.reduce((t, i) => t + Math.abs(i[key]), 0);
    let cum = 0;
    const rows = s.map((i, k) => {
      const share = total ? Math.abs(i[key]) / total : 0;
      const prev = cum;
      cum += share;
      return { ...i, rank: k + 1, share, cum, inPareto: prev < thr };
    });
    return { total, rows, n80: rows.filter((r) => r.inPareto).length, cut: rows.filter((r) => r.inPareto).at(-1)?.cum ?? 0 };
  }
  function num(v) {
    if (v == null || v === "") return null;
    if (typeof v === "number") return Number.isFinite(v) ? v : null;
    const s = String(v).replace(/[$,\s]/g, "").replace("%", "");
    if (s === "" || s === "-") return null;
    const n = Number(s);
    return Number.isFinite(n) ? String(v).includes("%") ? n / 100 : n : null;
  }
  var sum = (arr, f = (x) => x) => arr.reduce((t, x) => t + (f(x) || 0), 0);
  var groupBy = (arr, f) => arr.reduce((m, x) => {
    const k = f(x);
    (m.get(k) || m.set(k, []).get(k)).push(x);
    return m;
  }, /* @__PURE__ */ new Map());
  var nf0 = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 0 });
  var nf1 = new Intl.NumberFormat("es-MX", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var nf2 = new Intl.NumberFormat("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var fmt = {
    int: (x) => x == null ? "\u2014" : nf0.format(x),
    money: (x) => x == null ? "\u2014" : (x < 0 ? "-$" : "$") + nf0.format(Math.abs(x)),
    /** Compacto: $1.23 M / $456 mil / $980 */
    short(x, signed = false) {
      if (x == null || !Number.isFinite(x)) return "\u2014";
      const s = x < 0 ? "-" : signed && x > 0 ? "+" : "";
      const a = Math.abs(x);
      if (a >= 1e6) return `${s}$${nf2.format(a / 1e6)} M`;
      if (a >= 1e3) return `${s}$${nf0.format(a / 1e3)} mil`;
      return `${s}$${nf0.format(a)}`;
    },
    pct(x, signed = true) {
      if (x == null || !Number.isFinite(x)) return "\u2014";
      const v = x * 100;
      return `${signed && v > 0 ? "+" : ""}${nf1.format(v)}%`;
    },
    pct0: (x) => x == null || !Number.isFinite(x) ? "\u2014" : `${nf0.format(x * 100)}%`
  };
  var ACC = [
    ["Garcia", "Garc\xEDa"],
    ["Hernandez", "Hern\xE1ndez"],
    ["Martinez", "Mart\xEDnez"],
    ["Gonzalez", "Gonz\xE1lez"],
    ["Rodriguez", "Rodr\xEDguez"],
    ["Perez", "P\xE9rez"],
    ["Sanchez", "S\xE1nchez"],
    ["Ramirez", "Ram\xEDrez"],
    ["Gutierrez", "Guti\xE9rrez"],
    ["Chavez", "Ch\xE1vez"],
    ["Jimenez", "Jim\xE9nez"],
    ["Lopez", "L\xF3pez"],
    ["Gomez", "G\xF3mez"],
    ["Diaz", "D\xEDaz"],
    ["Alvarez", "\xC1lvarez"],
    ["Resendiz", "Res\xE9ndiz"],
    ["Aviles", "Avil\xE9s"],
    ["Teran", "Ter\xE1n"],
    ["Mendez", "M\xE9ndez"],
    ["Suarez", "Su\xE1rez"],
    ["Tuberia", "Tuber\xEDa"],
    ["Valvulas", "V\xE1lvulas"],
    ["Iluminacion", "Iluminaci\xF3n"],
    ["Conexion", "Conexi\xF3n"],
    ["Ferreteria", "Ferreter\xEDa"],
    ["Electricas", "El\xE9ctricas"],
    ["Electricos", "El\xE9ctricos"],
    ["Electrica", "El\xE9ctrica"]
  ];
  function nice(s) {
    if (s == null) return "";
    let out = String(s).trim().toLowerCase().replace(/(^|[\s(/.-])([a-záéíóúñü])/g, (m, a, b) => a + b.toUpperCase());
    out = out.replace(/\b(De|Del|La|Las|Los|Y|Para|P|Con|En)\b/g, (w) => w.toLowerCase());
    out = out.charAt(0).toUpperCase() + out.slice(1);
    for (const [a, b] of ACC) out = out.replace(new RegExp(`\\b${a}\\b`, "g"), b);
    out = out.replace(/\b(Pvc|Cpvc|Pe|Wc|Led|Qro|Slp|Gdl|Cd|Sa|Cv|Dni|Cr\d\d)\b/g, (w) => w.toUpperCase());
    return out;
  }
  var norm = (s) => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  function excelSerialToDate(v) {
    if (v instanceof Date) return new Date(Date.UTC(v.getFullYear(), v.getMonth(), 1));
    const n = num(v);
    if (n == null) return null;
    const d = new Date(Math.round((n - 25569) * 864e5));
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
  }
  var MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  var monthKey = (d) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  var monthLabel = (key) => {
    const [y, m] = key.split("-");
    return `${MESES[+m - 1]}-${y.slice(2)}`;
  };
  var monthLong = (key) => {
    const L = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const [y, m] = key.split("-");
    return `${L[+m - 1]} ${y}`;
  };
  var keyToDate = (key) => {
    const [y, m] = key.split("-");
    return new Date(Date.UTC(+y, +m - 1, 1));
  };
  var todayLong = () => (/* @__PURE__ */ new Date()).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });

  // js/core/parsers.js
  var SCENARIOS = {
    "ventas-anual": { kind: "ventas", name: "Ventas por dimensi\xF3n \xB7 comparativo anual", icon: "fa-chart-column" },
    "ventas-familia": { kind: "ventas", name: "Ventas por familia \xB7 periodo y trimestre", icon: "fa-boxes-stacked" },
    "ventas-clientes": { kind: "ventas", name: "Clientes por vendedor", icon: "fa-users" },
    "cartera": { kind: "cartera", name: "Cartera vencida \xB7 Gu\xEDa 80-20", icon: "fa-file-invoice-dollar" }
  };
  var isTotal = (v) => typeof v === "string" && /\btotal\b/i.test(v);
  var findRow = (aoa, pred, max = 15) => {
    for (let r = 0; r < Math.min(aoa.length, max); r++) if ((aoa[r] || []).some((c) => pred(norm(c)))) return r;
    return -1;
  };
  function parseSales(aoa) {
    if (findRow(aoa, (c) => c === "venta periodo act.") >= 0) return parseFamilia(aoa);
    const h = findRow(aoa, (c) => c === "ventas pesos");
    if (h < 0) throw new Error('No encontr\xE9 columnas de "Ventas pesos" ni de "Venta periodo". Revisa que sea un reporte de ventas.');
    const head = aoa[h];
    const first = head.findIndex((c) => norm(c) === "ventas pesos");
    const dims = head.slice(0, first).map((c, i) => c == null ? `Nivel ${i + 1}` : String(c).trim());
    let yearRow = null;
    for (let r = h - 1; r >= Math.max(0, h - 5); r--) if ((aoa[r] || []).some((c) => /^\s*20\d{2}\s*$/.test(String(c ?? "")))) {
      yearRow = aoa[r];
      break;
    }
    const measures = [];
    let curYear = null;
    for (let c = first; c < head.length; c++) {
      const y = yearRow ? yearRow[c] : null;
      if (y != null && y !== "") curYear = /^\s*20\d{2}\s*$/.test(String(y)) ? String(y).trim() : "total";
      const name = norm(head[c]);
      if (curYear && curYear !== "total" && (name === "ventas pesos" || name.startsWith("% variaci"))) measures.push({ c, year: +curYear, m: name === "ventas pesos" ? "v" : "var" });
    }
    if (!measures.length) {
      for (let c = first; c < head.length; c++) {
        const name = norm(head[c]);
        if (name === "ventas pesos" && !measures.some((m) => m.m === "v")) measures.push({ c, year: 0, m: "v" });
        if (name.startsWith("% variaci") && !measures.some((m) => m.m === "var")) measures.push({ c, year: 0, m: "var" });
      }
    }
    const years = [...new Set(measures.map((m) => m.year))].sort((a, b) => b - a);
    const col = (y, m) => measures.find((x) => x.year === y && x.m === m)?.c;
    const Y = years[0], Y1 = years[1];
    const rows = [], totals = dims.map(() => /* @__PURE__ */ new Map());
    const fill2 = dims.map(() => null);
    let grand = null;
    for (let r = h + 1; r < aoa.length; r++) {
      const row = aoa[r] || [];
      if (row.every((c) => c == null || c === "")) continue;
      for (let i = 0; i < dims.length; i++) {
        if (row[i] != null && row[i] !== "") {
          fill2[i] = row[i];
          for (let j = i + 1; j < dims.length; j++) fill2[j] = null;
        }
      }
      const tIdx = dims.findIndex((_, i) => isTotal(row[i]));
      const vals = { vY: num(row[col(Y, "v")]), varY: num(row[col(Y, "var")]), vY1: Y1 ? num(row[col(Y1, "v")]) : null, varY1: Y1 ? num(row[col(Y1, "var")]) : null };
      if (tIdx >= 0) {
        const name = String(row[tIdx]).replace(/\s*total\s*$/i, "").trim();
        if (/grand total|total general/i.test(row[tIdx])) grand = vals;
        else totals[tIdx].set(name, vals);
        continue;
      }
      if (fill2[dims.length - 1] == null) continue;
      rows.push({ fila: r + 1, d: fill2.map((x) => x == null ? "" : String(x).trim()), ...vals });
    }
    if (!rows.length) throw new Error("El archivo no tiene renglones de datos debajo del encabezado.");
    const info = { dims, Y, Y1, headerRow: h + 1, totals, grand };
    if (years.length >= 2) return { scenario: "ventas-anual", data: { rows, ...info } };
    const leaf = norm(dims.at(-1));
    if (leaf.includes("cliente")) return { scenario: "ventas-clientes", data: { rows, ...info } };
    throw new Error(`Encontr\xE9 ventas de un solo a\xF1o por "${dims.at(-1)}". Para un solo a\xF1o necesito el detalle por cliente (Desc. Cliente principal).`);
  }
  function parseFamilia(aoa) {
    const h = findRow(aoa, (c) => c === "venta periodo act.");
    const head = aoa[h].map(norm);
    const ix = (re) => head.findIndex((c) => re.test(c));
    const C = {
      g: ix(/^grupo/),
      f: ix(/^familia$/),
      pAnt: ix(/^venta periodo ant/),
      pAct: ix(/^venta periodo act/),
      tAnt: ix(/^venta trimestre ant/),
      tAct: ix(/^venta trimestre act/),
      pPct: ix(/^periodo act\. vs/),
      tPct: ix(/^trimestre act\. vs/)
    };
    if (C.f < 0 || C.pAnt < 0 || C.tAnt < 0) throw new Error("El reporte por familia no tiene las columnas esperadas (Familia, Venta periodo, Venta trimestre).");
    const rows = [], totals = [];
    let grp = null;
    for (let r = h + 1; r < aoa.length; r++) {
      const row = aoa[r] || [];
      if (row.every((c) => c == null || c === "")) continue;
      if (isTotal(row[C.g]) || isTotal(row[C.f])) {
        totals.push({ nombre: row[C.g] || row[C.f], pAnt: num(row[C.pAnt]), pAct: num(row[C.pAct]) });
        continue;
      }
      if (C.g >= 0 && row[C.g] != null && row[C.g] !== "") grp = String(row[C.g]).trim();
      if (row[C.f] == null) continue;
      rows.push({
        fila: r + 1,
        grupo: grp || "Sin grupo",
        familia: String(row[C.f]).trim(),
        pAnt: num(row[C.pAnt]),
        pAct: num(row[C.pAct]),
        tAnt: num(row[C.tAnt]),
        tAct: num(row[C.tAct]),
        pPct: num(row[C.pPct]),
        tPct: num(row[C.tPct])
      });
    }
    return { scenario: "ventas-familia", data: { rows, totals, headerRow: h + 1 } };
  }
  function parseCartera(aoa) {
    const h = findRow(aoa, (c) => c === "> 15 dias", 8);
    if (h < 0) throw new Error('No encontr\xE9 la columna "> 15 d\xEDas" en la hoja de antig\xFCedad.');
    const head = aoa[h].map(norm);
    const ix = (name) => head.indexOf(norm(name));
    const C = {
      zona: ix("Zona"),
      vend: ix("Vendedor"),
      cve: ix("Cve Cte"),
      cli: ix("Cliente"),
      saldo: ix("Saldo"),
      gestor: ix("Gestor"),
      v15: ix("> 15 d\xEDas"),
      c15: ix("Cliente + 15"),
      mes: ix("Mes"),
      tablero: ix("Tablero")
    };
    const miss = Object.entries(C).filter(([, v]) => v < 0).map(([k]) => k);
    if (miss.length) throw new Error(`Faltan columnas en la hoja de antig\xFCedad: ${miss.join(", ")}.`);
    const recs = [];
    for (let r = h + 1; r < aoa.length; r++) {
      const row = aoa[r];
      if (!row) continue;
      const tab = norm(row[C.tablero]), ges = String(row[C.gestor] ?? "").trim().toUpperCase();
      if (tab !== "mostradores" || ges !== "CR01" && ges !== "CR02") continue;
      const d = excelSerialToDate(row[C.mes]);
      if (!d) continue;
      recs.push({
        zona: String(row[C.zona] ?? "").trim(),
        vend: String(row[C.vend] ?? "").trim(),
        cve: String(row[C.cve] ?? "").trim(),
        cli: String(row[C.cli] ?? "").trim(),
        saldo: num(row[C.saldo]) || 0,
        v15: num(row[C.v15]) || 0,
        c15: num(row[C.c15]) || 0,
        mes: monthKey(d)
      });
    }
    if (!recs.length) throw new Error("No hay renglones de Mostradores CR01-CR02 en la hoja de antig\xFCedad.");
    const meses = [...new Set(recs.map((r) => r.mes))].sort();
    const zonas = [...new Set(recs.map((r) => r.zona))].filter(Boolean).sort((a, b) => a.localeCompare(b, "es"));
    return { scenario: "cartera", data: { recs, meses, zonas, total: aoa.length - h - 1 } };
  }

  // js/core/solutions.js
  function dimKind(name) {
    const n = String(name).toLowerCase();
    if (n.includes("vendedor")) return "vendedor";
    if (n.includes("familia") || n.includes("grupo")) return "familia";
    if (n.includes("cliente")) return "cliente";
    if (n.includes("cedis") || n.includes("zona")) return "cedis";
    return "otro";
  }
  function solutionsFor(kind, entity, profile = {}) {
    const s = [];
    const top = profile.topName ? nice(profile.topName) : null;
    const twoYears = profile.category === "Alerta Roja" || profile.category === "Suelo";
    if (kind === "vendedor") {
      if (profile.house) return [
        "Identificar a los clientes de esta cuenta y asignarlos a un vendedor con cuota.",
        "Campa\xF1a de reactivaci\xF3n (llamada y visita) a los clientes de mayor compra del a\xF1o anterior.",
        "Validar en el sistema si hubo reclasificaci\xF3n de clientes hacia otras cuentas.",
        "Definir reglas de uso de cuentas casa y ocasional para que la venta quede atribuida."
      ];
      if (top && profile.topShare >= 0.3) s.push(`Plan de recuperaci\xF3n enfocado en ${top}: identificar los clientes que redujeron compra y acordar su reactivaci\xF3n.`);
      s.push("Revisar cartera: clientes activos contra el a\xF1o anterior, frecuencia de visita y clientes con baja mayor a 20%.");
      s.push("Revisi\xF3n 1 a 1 semanal con gerencia sobre los 5 conceptos con mayor ca\xEDda y los clientes que los explican.");
      s.push("Ampliar surtido por cliente con las familias que crecen en el resto de la fuerza de ventas.");
      s.push("Revisar cuota e incentivos del periodo restante para premiar la recuperaci\xF3n.");
      return s.slice(0, 5);
    }
    if (kind === "familia") {
      if (profile.broad) {
        s.push(`Revisar disponibilidad e inventario de ${nice(entity)} en el CEDIS: quiebres, tiempos de surtido y c\xF3digos descontinuados.`);
        s.push("Revisar precio neto, descuentos y condiciones contra la competencia local.");
        s.push("Lanzar una mec\xE1nica comercial (promoci\xF3n por volumen o combo con familias en crecimiento) con meta semanal por vendedor.");
      } else {
        if (top) s.push(`Plan de recuperaci\xF3n con los clientes que dejaron de comprar la familia, empezando por la cartera de ${top}.`);
        s.push("Revisar precio, descuentos y condiciones otorgadas a los clientes que bajaron su compra.");
      }
      if (twoYears) s.push("Revisar vigencia del surtido: depurar c\xF3digos de baja rotaci\xF3n y definir surtido m\xEDnimo por perfil de cliente.");
      s.push("Benchmark de competencia y sustituci\xF3n: identificar si el cliente cambi\xF3 de proveedor, marca o material.");
      s.push("Incluir la familia en el tablero semanal de seguimiento contra el mismo periodo del a\xF1o anterior.");
      return s.slice(0, 5);
    }
    if (kind === "cliente") {
      const v = profile.vendor ? nice(profile.vendor) : "el vendedor";
      if (profile.publico) return [
        "Revisar la atenci\xF3n de mostrador y la disponibilidad de los productos m\xE1s pedidos.",
        'Identificar compradores recurrentes dentro de "P\xFAblico en general" y darlos de alta como clientes.',
        "Promoci\xF3n de mostrador con las familias en crecimiento."
      ];
      if (profile.var < -0.75) return [
        `Visita del gerente con ${v} en los pr\xF3ximos 7 d\xEDas para conocer el motivo de la baja.`,
        "Revisar cr\xE9dito, saldo vencido o incidencias de servicio (entregas, faltantes, devoluciones).",
        "Preparar una oferta de regreso en sus familias principales del a\xF1o anterior.",
        "Si se fue a la competencia, documentar el motivo para el an\xE1lisis de precios."
      ];
      if (profile.var < -0.25) return [
        "Identificar las familias que dej\xF3 de comprar y ofrecerlas de nuevo.",
        "Revisar precio neto y condiciones contra la competencia en esas familias.",
        `Aumentar la frecuencia de visita de ${v} y acordar una meta trimestral de recuperaci\xF3n.`,
        "Seguimiento mensual en el tablero de clientes clave."
      ];
      return ["Revisar surtido y condiciones comerciales con el cliente.", "Mantener la frecuencia de visita y ofrecer familias en crecimiento.", "Seguimiento mensual de la tendencia."];
    }
    return [
      "Revisar cobertura, frecuencia de visita y cartera de clientes de mayor impacto.",
      "Revisar surtido, disponibilidad y quiebres de inventario de las familias en ca\xEDda.",
      "Revisar precios, descuentos y condiciones contra la competencia.",
      "Seguimiento semanal por vendedor con metas de recuperaci\xF3n."
    ];
  }
  function plural(dim) {
    const n = String(dim).toLowerCase();
    if (n.includes("vendedor")) return "vendedores";
    if (n.includes("grupo")) return "grupos";
    if (n.includes("familia")) return "familias";
    if (n.includes("cliente")) return "clientes";
    if (n.includes("cedis")) return "CEDIS";
    if (n.includes("zona")) return "zonas";
    return n;
  }

  // js/core/ventas-anual.js
  function analyzeVentasAnual(data, opts2 = {}) {
    const { dims, Y, Y1 } = data;
    const vIdx = dims.findIndex((d) => dimKind(d) === "vendedor");
    const excludeHouse = opts2.excludeHouse !== false;
    const excluded = [], rows = [];
    for (const r of data.rows) {
      if (excludeHouse && vIdx >= 0 && isHouse(r.d[vIdx])) {
        excluded.push(r);
        continue;
      }
      const vAct2 = r.vY ?? 0, vPrev3 = r.vY1 ?? 0;
      let vPrev22 = null;
      if (r.vY1 != null) vPrev22 = r.varY1 == null ? 0 : Math.round(r.varY1 * 1e6) / 1e6 === -1 ? null : r.vY1 / (1 + r.varY1);
      const obs = [];
      if (r.vY == null) obs.push(`Sin venta ${Y}`);
      if (r.vY1 == null) obs.push(`Sin venta ${Y1}`);
      if (r.vY1 != null && r.varY1 == null) obs.push(`Sin base ${Y1 - 1}`);
      if ((r.vY ?? 0) < 0 || (r.vY1 ?? 0) < 0) obs.push("Monto negativo (nota de cr\xE9dito)");
      if ([r.varY, r.varY1].some((x) => x != null && Math.abs(x) > 5)) obs.push("Variaci\xF3n extrema por base peque\xF1a");
      rows.push({ ...r, vAct: vAct2, vPrev: vPrev3, vPrev2: vPrev22, impact: vAct2 - vPrev3, category: classify(r.varY1, r.varY), obs: obs.join("; ") });
    }
    const byDim = {};
    dims.forEach((dim, i) => {
      const g = groupBy(rows, (r) => r.d[i]);
      const ents = [...g.entries()].map(([name, rs]) => {
        const vAct2 = sum(rs, (r) => r.vAct), vPrev3 = sum(rs, (r) => r.vPrev), vPrev22 = sum(rs, (r) => r.vPrev2 ?? 0);
        const varUlt = vPrev3 > 0 ? vAct2 / vPrev3 - 1 : null, varAnt = vPrev22 > 0 ? vPrev3 / vPrev22 - 1 : null;
        return {
          name,
          dim,
          vAct: vAct2,
          vPrev: vPrev3,
          vPrev2: vPrev22,
          varUlt,
          varAnt,
          impact: vAct2 - vPrev3,
          absImpact: Math.abs(vAct2 - vPrev3),
          category: classify(varAnt, varUlt),
          n: rs.length,
          lost: rs.filter((r) => r.vY == null && r.vY1 > 0).length,
          rows: rs
        };
      });
      const neg = pareto(ents, -1), pos = pareto(ents, 1);
      const counts = Object.fromEntries([...CATS, NC].map((c) => [c, ents.filter((e) => e.category === c).length]));
      const impacts = Object.fromEntries([...CATS, NC].map((c) => [c, sum(ents.filter((e) => e.category === c), (e) => e.impact)]));
      byDim[dim] = {
        dim,
        i,
        ents: ents.sort((a, b) => b.absImpact - a.absImpact),
        neg,
        pos,
        counts,
        impacts,
        falling: ents.filter((e) => e.impact < 0).length,
        growing: ents.filter((e) => e.impact > 0).length
      };
    });
    const vAct = sum(rows, (r) => r.vAct), vPrev = sum(rows, (r) => r.vPrev), vPrev2 = sum(rows, (r) => r.vPrev2 ?? 0);
    const total = { vAct, vPrev, vPrev2, varUlt: vPrev ? vAct / vPrev - 1 : null, varAnt: vPrev2 ? vPrev / vPrev2 - 1 : null, impact: vAct - vPrev };
    total.category = classify(total.varAnt, total.varUlt);
    const other = (i) => {
      const kinds = dims.map(dimKind);
      if (kinds[i] === "vendedor") return kinds.indexOf("familia") >= 0 ? kinds.indexOf("familia") : dims.length - 1;
      if (kinds[i] === "familia") return kinds.indexOf("vendedor");
      return kinds.indexOf("vendedor") >= 0 ? kinds.indexOf("vendedor") : dims.length - 1;
    };
    function profile(e, i) {
      const j = other(i);
      if (j < 0 || j === i) return { broad: false };
      const sub = [...groupBy(e.rows.filter((r) => r.vPrev > 0 || r.vAct > 0), (r) => r.d[j]).entries()].map(([k, rs]) => ({ k, imp: sum(rs, (r) => r.impact), base: sum(rs, (r) => r.vPrev) }));
      const falls = sub.filter((s) => s.imp < 0).sort((a, b) => a.imp - b.imp);
      const gross = sum(falls, (s) => s.imp);
      const withBase = sub.filter((s) => s.base > 0).length;
      return {
        otherDim: dims[j],
        falls: falls.length,
        total: withBase,
        broad: withBase >= 4 && falls.length / withBase >= 0.75,
        topName: falls[0]?.k,
        topImp: falls[0]?.imp ?? 0,
        topShare: gross ? falls[0].imp / gross : 0,
        top3: falls.slice(0, 3),
        gross,
        grossPos: sum(sub.filter((s) => s.imp > 0), (s) => s.imp)
      };
    }
    const plan2 = [];
    for (const dim of dims) {
      const D = byDim[dim];
      if (D.ents.length < 2) continue;
      for (const e of D.ents.filter((x) => DROP_CATS.includes(x.category) && x.impact < 0)) {
        const p = profile(e, D.i), kind = dimKind(dim);
        const house = kind === "vendedor" && isHouse(e.name);
        let diag = `${fmt.pct(e.varUlt)} en ${Y} tras ${fmt.pct(e.varAnt)} en ${Y1}; impacto ${fmt.short(e.impact, true)}.`;
        if (p.otherDim && p.total) {
          diag += ` Cae en ${p.falls} de ${p.total} ${plural(p.otherDim)}`;
          if (p.topName) diag += `; la mayor ca\xEDda es ${nice(p.topName)} (${fmt.short(p.topImp, true)}, ${fmt.pct0(p.topShare)} de la ca\xEDda bruta)`;
          diag += p.broad ? ". Ca\xEDda generalizada." : p.topShare >= 0.45 ? ". Ca\xEDda concentrada." : ".";
        }
        if (e.lost) diag += ` ${e.lost} ${e.lost === 1 ? "combinaci\xF3n" : "combinaciones"} sin venta en ${Y}.`;
        plan2.push({
          entity: e.name,
          dim,
          category: e.category,
          varUlt: e.varUlt,
          varAnt: e.varAnt,
          impact: e.impact,
          absImpact: e.absImpact,
          vAct: e.vAct,
          inPareto: D.neg.rows.find((r) => r.name === e.name)?.inPareto ?? false,
          diag,
          solutions: solutionsFor(kind, e.name, { ...p, category: e.category, house })
        });
      }
    }
    plan2.sort((a, b) => b.inPareto - a.inPareto || b.absImpact - a.absImpact);
    return { scenario: "ventas-anual", Y, Y1, dims, rows, excluded, byDim, total, plan: plan2, profile };
  }

  // js/core/ventas-familia.js
  function analyzeVentasFamilia(data, opts2 = {}) {
    const swap = !!opts2.swap;
    const rows = data.rows.map((r) => ({ ...r, pAnt0: r.pAnt ?? 0, pAct0: r.pAct ?? 0, tAnt0: r.tAnt ?? 0, tAct0: r.tAct ?? 0 }));
    const dupNames = new Set([...groupBy(rows, (r) => r.familia).entries()].filter(([, v]) => v.length > 1).map(([k]) => k));
    rows.forEach((r) => {
      const o = [];
      if (dupNames.has(r.familia)) o.push("Familia repetida en otro grupo (se consolida por nombre)");
      if ([r.pAnt, r.pAct, r.tAnt, r.tAct].some((x) => x != null && x < 0)) o.push("Monto negativo (nota de cr\xE9dito)");
      if ([r.pAnt, r.pAct, r.tAnt, r.tAct].some((x) => x == null)) o.push("Sin venta en alg\xFAn corte");
      r.obs = o.join("; ");
    });
    const mk = (name, rs, extra = {}) => {
      const pAnt = sum(rs, (r) => r.pAnt0), pAct = sum(rs, (r) => r.pAct0), tAnt = sum(rs, (r) => r.tAnt0), tAct = sum(rs, (r) => r.tAct0);
      const varP = pAnt > 0 ? pAct / pAnt - 1 : null, varT = tAnt > 0 ? tAct / tAnt - 1 : null;
      const varUlt = swap ? varT : varP, varAnt = swap ? varP : varT;
      const impact = swap ? tAct - tAnt : pAct - pAnt, impactAlt = swap ? pAct - pAnt : tAct - tAnt;
      return {
        name,
        pAnt,
        pAct,
        tAnt,
        tAct,
        varP,
        varT,
        varUlt,
        varAnt,
        impact,
        absImpact: Math.abs(impact),
        impactAlt,
        vAct: swap ? tAct : pAct,
        vPrev: swap ? tAnt : pAnt,
        category: classify(varAnt, varUlt),
        ...extra
      };
    };
    const famG = groupBy(rows, (r) => r.familia);
    const fams = [...famG.entries()].map(([f, rs]) => mk(f, rs, { grupo: [...rs].sort((a, b) => b.pAct0 - a.pAct0)[0].grupo }));
    const grps = [...groupBy(rows, (r) => r.grupo).entries()].map(([g, rs]) => mk(g, rs));
    const total = mk("Total", rows);
    const build = (ents, dim) => ({
      dim,
      ents: ents.sort((a, b) => b.absImpact - a.absImpact),
      neg: pareto(ents, -1),
      pos: pareto(ents, 1),
      alt: pareto(ents.map((e) => ({ ...e, impact: e.impactAlt })), -1),
      counts: Object.fromEntries([...CATS, NC].map((c) => [c, ents.filter((e) => e.category === c).length])),
      impacts: Object.fromEntries([...CATS, NC].map((c) => [c, sum(ents.filter((e) => e.category === c), (e) => e.impact)])),
      falling: ents.filter((e) => e.impact < 0).length,
      growing: ents.filter((e) => e.impact > 0).length
    });
    const byDim = { Familia: build(fams, "Familia"), "Grupo familia": build(grps, "Grupo familia") };
    const lab = swap ? { ult: "Trimestre", ant: "Periodo" } : { ult: "Periodo", ant: "Trimestre" };
    const plan2 = byDim.Familia.ents.filter((e) => DROP_CATS.includes(e.category) && e.impact < 0).map((e) => {
      const twoCuts = e.varP != null && e.varT != null && e.varP < -0.1 && e.varT < -0.1;
      const diag = `${lab.ult} ${fmt.pct(e.varUlt)} (${fmt.short(e.impact, true)}); ${lab.ant.toLowerCase()} ${fmt.pct(e.varAnt)} (${fmt.short(e.impactAlt, true)}). Grupo ${e.grupo}; venta ${lab.ult.toLowerCase()} actual ${fmt.short(e.vAct)}.${twoCuts ? " Cae en ambos cortes." : ""}`;
      return {
        entity: e.name,
        dim: "Familia",
        grupo: e.grupo,
        category: e.category,
        varUlt: e.varUlt,
        varAnt: e.varAnt,
        impact: e.impact,
        absImpact: e.absImpact,
        impactAlt: e.impactAlt,
        vAct: e.vAct,
        inPareto: byDim.Familia.neg.rows.find((r) => r.name === e.name)?.inPareto ?? false,
        diag,
        solutions: solutionsFor("familia", e.name, { broad: true, category: e.category })
      };
    }).sort((a, b) => b.inPareto - a.inPareto || b.absImpact - a.absImpact);
    return { scenario: "ventas-familia", swap, lab, rows, byDim, total, plan: plan2, dupNames: [...dupNames] };
  }

  // js/core/ventas-clientes.js
  var SEGMENTS = [
    { key: "> $50 mil", lo: 5e4, hi: Infinity },
    { key: "$25\u201350 mil", lo: 25e3, hi: 5e4 },
    { key: "$12\u201325 mil", lo: 12e3, hi: 25e3 },
    { key: "$5\u201312 mil", lo: 5e3, hi: 12e3 },
    { key: "$2\u20135 mil", lo: 2e3, hi: 5e3 },
    { key: "< $2 mil", lo: 0, hi: 2e3 }
  ];
  function analyzeVentasClientes(data, opts2 = {}) {
    const umbral = opts2.umbral ?? 12e3, meses = opts2.meses ?? 10, cerca = opts2.cerca ?? Math.round(umbral * 2 / 3);
    const excludeHouse = opts2.excludeHouse !== false;
    const vIdx = data.dims.findIndex((d) => /vendedor/i.test(d)), cIdx = data.dims.length - 1;
    const segs = SEGMENTS.map((s) => s.key === "$12\u201325 mil" ? { ...s, lo: umbral } : s.key === "$5\u201312 mil" ? { ...s, hi: umbral } : s);
    const excluded = [], clients = [];
    for (const r of data.rows) {
      const vend2 = vIdx >= 0 ? r.d[vIdx] : "Sin vendedor";
      if (excludeHouse && isHouse(vend2)) {
        excluded.push({ ...r, vend: vend2, cli: r.d[cIdx] });
        continue;
      }
      const v = r.vY ?? 0, nuevo = r.varY == null;
      const vPrev = nuevo ? 0 : Math.round(r.varY * 1e6) / 1e6 === -1 ? 0 : v / (1 + r.varY);
      const prom = v / meses, prom25 = vPrev / meses, activo = v > 0, arriba = activo && prom > umbral;
      const tend = nuevo ? "Nuevo (sin venta a\xF1o anterior)" : r.varY > 0.1 ? "Crece > 10%" : r.varY < -0.1 ? "Cae > 10%" : "Estable \xB110%";
      let mov;
      if (!activo) mov = "Sin compra neta";
      else if (nuevo) mov = arriba ? "Nuevo arriba del umbral" : "Nuevo abajo del umbral";
      else if (prom25 > umbral) mov = arriba ? "Se mantiene arriba" : "Baj\xF3 de nivel";
      else mov = arriba ? "Subi\xF3 de nivel" : "Se mantiene abajo";
      const seg = !activo ? "Sin compra neta" : segs.find((s) => prom > s.lo && prom <= s.hi)?.key ?? "< $2 mil";
      clients.push({
        fila: r.fila,
        vend: vend2,
        cli: r.d[cIdx],
        v,
        var: r.varY,
        vPrev,
        impact: v - vPrev,
        absImpact: Math.abs(v - vPrev),
        prom,
        activo,
        arriba,
        nuevo,
        tend,
        mov,
        seg,
        cerca: activo && prom > cerca && prom <= umbral,
        publico: isPublico(r.d[cIdx])
      });
    }
    const totalsV = data.totals[vIdx] || /* @__PURE__ */ new Map();
    const vend = [...groupBy(clients, (c) => c.vend).entries()].map(([name, cs]) => {
      const a = cs.filter((c) => c.activo), big = a.filter((c) => c.arriba);
      const venta = sum(cs, (c) => c.v), ventaAct = sum(a, (c) => c.v);
      const t = totalsV.get(name);
      const varV = t?.varY ?? null, vPrev = varV != null ? (t.vY ?? venta) / (1 + varV) : sum(cs, (c) => c.vPrev);
      const sorted = a.map((c) => c.v).sort((x, y) => y - x);
      let acc = 0, n80 = 0;
      for (const x of sorted) {
        acc += x;
        n80++;
        if (acc >= 0.8 * ventaAct) break;
      }
      return {
        name,
        clientes: a.length,
        arriba: big.length,
        pctArriba: a.length ? big.length / a.length : 0,
        venta,
        ventaArriba: sum(big, (c) => c.v),
        pctVentaArriba: ventaAct ? sum(big, (c) => c.v) / ventaAct : 0,
        cerca: a.filter((c) => c.cerca).length,
        nuevos: a.filter((c) => c.nuevo).length,
        crecen: a.filter((c) => c.tend === "Crece > 10%").length,
        estables: a.filter((c) => c.tend === "Estable \xB110%").length,
        caen: a.filter((c) => c.tend === "Cae > 10%").length,
        subieron: cs.filter((c) => c.mov === "Subi\xF3 de nivel").length,
        bajaron: cs.filter((c) => c.mov === "Baj\xF3 de nivel").length,
        nuevosArriba: cs.filter((c) => c.mov === "Nuevo arriba del umbral").length,
        arriba25: cs.filter((c) => c.activo && !c.nuevo && c.vPrev / meses > umbral).length + cs.filter((c) => c.mov === "Baj\xF3 de nivel" && !c.activo).length,
        publico: a.filter((c) => c.publico).length,
        ventaPublico: sum(a.filter((c) => c.publico), (c) => c.v),
        prom: a.length ? ventaAct / a.length / meses : 0,
        top5: ventaAct ? sum(sorted.slice(0, 5), (x) => x) / ventaAct : 0,
        n80,
        varV,
        vPrev,
        impact: venta - vPrev,
        absImpact: Math.abs(venta - vPrev),
        perdidos: Math.max(0, vPrev - sum(cs, (c) => c.vPrev))
      };
    }).sort((a, b) => b.venta - a.venta);
    vend.forEach((v) => {
      v.arriba25 = clients.filter((c) => c.vend === v.name && (c.mov === "Se mantiene arriba" || c.mov === "Baj\xF3 de nivel")).length;
    });
    const act = clients.filter((c) => c.activo);
    const T = {
      clientes: act.length,
      arriba: act.filter((c) => c.arriba).length,
      venta: sum(clients, (c) => c.v),
      vPrev: sum(vend, (v) => v.vPrev),
      ventaArriba: sum(act.filter((c) => c.arriba), (c) => c.v),
      cerca: act.filter((c) => c.cerca).length,
      nuevos: act.filter((c) => c.nuevo).length,
      subieron: clients.filter((c) => c.mov === "Subi\xF3 de nivel").length,
      bajaron: clients.filter((c) => c.mov === "Baj\xF3 de nivel").length,
      nuevosArriba: clients.filter((c) => c.mov === "Nuevo arriba del umbral").length,
      perdidos: sum(vend, (v) => v.perdidos),
      publico: act.filter((c) => c.publico).length,
      ventaPublico: sum(act.filter((c) => c.publico), (c) => c.v)
    };
    T.arriba25 = T.arriba - T.subieron - T.nuevosArriba + T.bajaron;
    T.var = T.vPrev ? T.venta / T.vPrev - 1 : null;
    T.pctArriba = T.clientes ? T.arriba / T.clientes : 0;
    T.pctVentaArriba = sum(act, (c) => c.v) ? T.ventaArriba / sum(act, (c) => c.v) : 0;
    T.ventaActiva = sum(act, (c) => c.v);
    const segRows = segs.map((s) => ({ key: s.key, n: act.filter((c) => c.seg === s.key).length, v: sum(act.filter((c) => c.seg === s.key), (c) => c.v) }));
    const cneg = pareto(clients, -1), cpos = pareto(clients, 1);
    const vneg = pareto(vend, -1), vpos = pareto(vend, 1);
    const plan2 = [];
    for (const v of vend.filter((x) => x.impact < 0).sort((a, b) => a.impact - b.impact)) {
      const cs = clients.filter((c) => c.vend === v.name && c.impact < 0 && !c.publico).sort((a, b) => a.impact - b.impact);
      plan2.push({
        tipo: "Vendedor",
        entity: v.name,
        vendedor: v.name,
        severidad: "Vendedor en ca\xEDda",
        varUlt: v.varV,
        impact: v.impact,
        absImpact: v.absImpact,
        vAct: v.venta,
        clientes: v.clientes,
        arriba: v.arriba,
        diag: `Venta ${fmt.pct(v.varV)} (${fmt.short(v.impact, true)}). ${v.clientes} clientes, ${v.arriba} arriba del umbral (${fmt.pct0(v.pctArriba)}); ${v.caen} caen m\xE1s de 10%; ${v.bajaron} bajaron de nivel.` + (v.perdidos > Math.max(2e4, v.vPrev * 0.01) ? ` Venta del a\xF1o anterior de clientes sin compra actual (estimada): ${fmt.short(v.perdidos)}.` : ""),
        solutions: [
          v.perdidos > Math.max(2e4, v.vPrev * 0.01) ? `Obtener del sistema la lista de clientes que compraron el a\xF1o anterior y no en el actual (\u2248${fmt.short(v.perdidos)}) y agendar visita a los de mayor venta.` : null,
          cs[0] ? `Visita de reactivaci\xF3n a ${nice(cs[0].cli)} (${fmt.pct(cs[0].var)})${cs[1] ? ` y ${nice(cs[1].cli)} (${fmt.pct(cs[1].var)})` : ""} con el gerente.` : null,
          v.cerca ? `Plan de desarrollo para los ${v.cerca} clientes cerca del umbral (ampliar surtido por cliente).` : null,
          "Revisi\xF3n 1 a 1 semanal con gerencia de clientes en ca\xEDda y recuperados.",
          "Meta de retenci\xF3n: ning\xFAn cliente arriba del umbral sin compra en el mes."
        ].filter(Boolean).slice(0, 5)
      });
    }
    for (const c of cneg.rows.filter((r) => r.inPareto)) {
      const sev = c.publico ? "P\xFAblico en general" : c.var < -0.75 ? "Casi perdido" : c.var < -0.25 ? "Ca\xEDda fuerte" : "Ca\xEDda moderada";
      plan2.push({
        tipo: "Cliente",
        entity: c.cli,
        vendedor: c.vend,
        severidad: sev,
        varUlt: c.var,
        impact: c.impact,
        absImpact: c.absImpact,
        vAct: c.v,
        diag: `${sev}. Venta ${fmt.money(c.v)} (${fmt.pct(c.var)}), promedio ${fmt.money(c.prom)}/mes: ${c.arriba ? "arriba" : "abajo"} del umbral. Movimiento: ${c.mov.toLowerCase()}.`,
        solutions: solutionsFor("cliente", c.cli, { var: c.var, vendor: c.vend, publico: c.publico })
      });
    }
    return { scenario: "ventas-clientes", Y: data.Y, umbral, meses, cerca, clients, vend, excluded, T, segRows, cneg, cpos, vneg, vpos, plan: plan2 };
  }

  // js/core/cartera.js
  var EXCLUDE_ZONES = /^(dni|facturas de servicios)$/i;
  function closestTo100(values) {
    const n = values.length, tot = sum(values);
    let acc = 0, best = 0, bestD = Infinity;
    const totals = values.map((v, k) => {
      acc += tot ? v / tot : 0;
      return acc + (k + 1) / n;
    });
    totals.forEach((t, k) => {
      const dd = Math.abs(t - 1);
      if (dd < bestD - 1e-12) {
        bestD = dd;
        best = k;
      }
    });
    return { cut: best, totals };
  }
  function cedisList(data) {
    const cnt = groupBy(data.recs, (r) => r.zona);
    return data.zonas.filter((z) => !EXCLUDE_ZONES.test(z) && new Set(cnt.get(z).map((r) => r.mes)).size >= 3);
  }
  function analyzeCartera(data, { cedis, mes } = {}) {
    const meses = data.meses.filter((m) => !mes || m <= mes);
    const MES = mes || meses.at(-1);
    const zonas = cedisList(data);
    const recs = data.recs.filter((r) => zonas.includes(r.zona));
    const m13 = meses.slice(-13);
    const byZone = groupBy(recs.filter((r) => m13.includes(r.mes)), (r) => r.zona);
    const conteo = zonas.map((z2) => {
      const rs = byZone.get(z2) || [];
      const per = Object.fromEntries(m13.map((m) => [m, sum(rs.filter((r) => r.mes === m), (r) => r.c15)]));
      return { zona: z2, per };
    }).sort((a, b) => b.per[MES] - a.per[MES] || a.zona.localeCompare(b.zona));
    const ranking = zonas.map((z2) => {
      const rs = (byZone.get(z2) || []).filter((r) => r.mes === MES);
      const v = sum(rs, (r) => r.v15), s = sum(rs, (r) => r.saldo);
      return { zona: z2, v15: v, saldo: s, pct: s ? v / s : 0 };
    }).sort((a, b) => b.pct - a.pct);
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
    cl.forEach((c, k) => {
      c.no = k + 1;
      c.pctNo = (k + 1) / cl.length;
      c.rel = totalAct ? c.act / totalAct : 0;
      acc += c.rel;
      c.cum = acc;
      c.total = cd.totals[k];
      c.amarillo = k <= cd.cut;
    });
    const vendAll = [...new Set(z.filter((r) => r.mes === MES).map((r) => r.vend).filter(Boolean))];
    const vv = vendAll.map((v) => ({ vend: v, n: cl.filter((c) => c.vend === v).length, v: sum(cl.filter((c) => c.vend === v), (c) => c.act) }));
    const side = (arr, key) => {
      const { cut, totals } = closestTo100(arr.map((x) => x[key]));
      const t = sum(arr, (x) => x[key]);
      let a2 = 0;
      return arr.map((x, k) => {
        a2 += t ? x[key] / t : 0;
        return { ...x, pctNo: (k + 1) / arr.length, rel: t ? x[key] / t : 0, cum: a2, total: totals[k], amarillo: k <= cut };
      });
    };
    const left = side([...vv].sort((a, b) => b.v - a.v || b.n - a.n), "v");
    const right = side([...vv].sort((a, b) => b.n - a.n || b.v - a.v), "n");
    const rk = ranking.findIndex((r) => r.zona === cedis);
    return {
      scenario: "cartera",
      cedis,
      mes: MES,
      m13,
      m5,
      conteo,
      ranking,
      clientes: cl,
      left,
      right,
      kpi: {
        clientes: cl.length,
        vencido: totalAct,
        pct: ranking[rk]?.pct ?? 0,
        rank: rk + 1,
        zonas: zonas.length,
        vendedores: vendAll.length,
        n80: cd.cut + 1,
        pct80: cl[cd.cut]?.cum ?? 0,
        totalCut: cl[cd.cut]?.total ?? 0,
        prevClientes: conteo.find((c) => c.zona === cedis)?.per[meses.at(-2)] ?? null
      }
    };
  }

  // js/core/reports.js
  var short = (s, n = 34) => s.length > n ? s.slice(0, n - 1) + "\u2026" : s;
  var catCols = [
    { key: "rank", label: "#", type: "int" },
    { key: "name", label: "Entidad", type: "text", fmt: nice },
    { key: "vAct", label: "Venta actual", type: "short" },
    { key: "varUlt", label: "\xDAltimo a\xF1o", type: "pct" },
    { key: "varAnt", label: "A\xF1o anterior", type: "pct" },
    { key: "impact", label: "Impacto", type: "shortSigned" },
    { key: "cum", label: "% acum.", type: "pct0" },
    { key: "category", label: "Categor\xEDa", type: "cat" }
  ];
  var barsFrom = (rows, tone, label = (r) => nice(r.name), max = 15) => rows.slice(0, max).map((r) => ({
    label: short(label(r), 40),
    value: Math.abs(r.impact),
    text: `${fmt.short(r.impact, true)} \xB7 ${fmt.pct(r.varUlt ?? r.var)}`,
    tone,
    extra: `${fmt.pct0(r.cum)} acum.`
  }));
  var topList = (rows, n = 3, f = (r) => `${nice(r.name)} (${fmt.short(r.impact, true)})`) => rows.slice(0, n).map(f).join(", ");
  function reportVentasAnual(A, meta) {
    const { Y, Y1, total: T } = A;
    const dimsMulti = A.dims.filter((d) => A.byDim[d].ents.length > 1);
    const famDim = A.dims.find((d) => dimKind(d) === "familia") || A.dims.at(-1);
    const venDim = A.dims.find((d) => dimKind(d) === "vendedor");
    const F = A.byDim[famDim], V = venDim ? A.byDim[venDim] : null;
    const exclV = sum(A.excluded, (r) => r.vY ?? 0);
    const cedisName = A.byDim[A.dims[0]].ents.length === 1 ? nice(A.byDim[A.dims[0]].ents[0].name) : `${A.byDim[A.dims[0]].ents.length} ${plural(A.dims[0])}`;
    const summary = [
      { fig: fmt.pct(T.varUlt), tone: T.impact < 0 ? "neg" : "pos", text: `<b>La venta ${T.impact < 0 ? "cae" : "crece"} ${fmt.short(T.impact, true)}</b>: de ${fmt.short(T.vPrev)} en ${Y1} a ${fmt.short(T.vAct)} en ${Y}. Clasificaci\xF3n general: <b>${T.category}</b> (${fmt.pct(T.varAnt)} el a\xF1o previo).` }
    ];
    if (F.neg.rows.length) summary.push({ fig: String(F.neg.n80), tone: "neg", text: `<b>${F.neg.n80} de ${F.neg.rows.length} ${plural(famDim)} explican el ${fmt.pct0(F.neg.cut)} de la ca\xEDda</b> (${fmt.short(-F.neg.total)}): ${topList(F.neg.rows)}.` });
    if (V) {
      const top = V.neg.rows[0];
      summary.push({ fig: `${V.falling}/${V.ents.length}`, tone: V.falling > V.growing ? "neg" : "pos", text: `<b>${V.falling} de ${V.ents.length} vendedores caen</b> y ${V.growing} crecen.${top ? ` La mayor ca\xEDda es ${nice(top.name)} (${fmt.short(top.impact, true)}, ${fmt.pct(top.varUlt)}).` : ""} ${V.counts["Acierto"] + V.counts["Recuperaci\xF3n"] === 0 ? "Ning\xFAn vendedor est\xE1 en Acierto ni en Recuperaci\xF3n." : `${V.counts["Acierto"]} en Acierto y ${V.counts["Recuperaci\xF3n"]} en Recuperaci\xF3n.`}` });
      if (V.counts["Desaceleraci\xF3n"]) summary.push({ fig: String(V.counts["Desaceleraci\xF3n"]), tone: "", text: `<b>${V.counts["Desaceleraci\xF3n"]} vendedores en Desaceleraci\xF3n</b>: crecieron m\xE1s de 10% en ${Y1} y hoy est\xE1n entre \xB110%.` });
    }
    if (F.pos.rows.length) summary.push({ fig: fmt.short(F.pos.total, true), tone: "pos", text: `<b>Crecimiento de ${F.pos.rows.length} ${plural(famDim)}</b> (+${fmt.short(F.pos.total)}), encabezado por ${topList(F.pos.rows)}.` });
    const risks = A.plan.filter((p) => p.inPareto).slice(0, 4).map((p) => `<b>${nice(p.entity)}</b> (${p.dim}, ${p.category}): ${fmt.pct(p.varUlt)}, ${fmt.short(p.impact, true)}.`);
    const actions = A.plan.filter((p) => p.inPareto).slice(0, 5).map((p) => `${nice(p.entity)}: ${p.solutions[0]}`);
    const sections = [];
    for (const d of A.dims) {
      const D = A.byDim[d];
      if (D.ents.length === 1) {
        const e = D.ents[0];
        sections.push({ id: `dim-${d}`, title: `An\xE1lisis por ${d}`, kicker: d, lead: `${nice(e.name)}: ${fmt.short(e.vAct)}, ${fmt.pct(e.varUlt)} contra ${Y1} (${fmt.pct(e.varAnt)} el a\xF1o previo) \u2192 <b>${e.category}</b>. Con una sola entidad no hay ranking ni Pareto.`, blocks: [] });
        continue;
      }
      sections.push({
        id: `dim-${d}`,
        title: `An\xE1lisis por ${d}`,
        kicker: `${D.ents.length} ${plural(d)}`,
        lead: `${D.falling} caen y ${D.growing} crecen. <b>${D.neg.n80} concentran el ${fmt.pct0(D.neg.cut)} del impacto negativo</b> (${fmt.short(-D.neg.total)}); ${D.pos.n80} concentran el ${fmt.pct0(D.pos.cut)} del positivo (+${fmt.short(D.pos.total)}).`,
        blocks: [
          { type: "bars", title: `Pareto de ca\xEDdas \xB7 ${d}`, rows: barsFrom(D.neg.rows.filter((r) => r.inPareto), "neg") },
          { type: "bars", title: `Pareto de crecimientos \xB7 ${d}`, rows: barsFrom(D.pos.rows.filter((r) => r.inPareto), "pos", void 0, 12) },
          { type: "matrix", title: `Matriz de clasificaci\xF3n \xB7 ${d}`, counts: D.counts, impacts: D.impacts, total: D.ents.length },
          { type: "table", title: `Ranking Pareto de ca\xEDdas \xB7 ${d}`, columns: catCols, rows: D.neg.rows.filter((r) => r.inPareto), pdfMax: 16 }
        ]
      });
    }
    sections.push(planSection(A.plan.map((p) => ({ ...p, title: nice(p.entity), tag: `${p.dim} \xB7 ${p.category}`, metric: `${fmt.pct(p.varUlt)} \xB7 ${fmt.short(p.impact, true)}` }))));
    return {
      scenario: "ventas-anual",
      title: "Ca\xEDdas y crecimientos de venta",
      subtitle: `${cedisName} \xB7 ${Y} vs ${Y1}`,
      file: meta.fileName,
      kpis: [
        { label: `Venta ${Y}`, value: T.vAct, type: "short", sub: `vs ${fmt.short(T.vPrev)} en ${Y1}` },
        { label: "Variaci\xF3n", value: T.varUlt, type: "pct", tone: T.varUlt < 0 ? "neg" : "pos", sub: `${Y1} vs ${Y1 - 1}: ${fmt.pct(T.varAnt)}` },
        { label: "Impacto neto", value: T.impact, type: "shortSigned", tone: T.impact < 0 ? "neg" : "pos", sub: `ca\xEDda bruta ${fmt.short(-F.neg.total)}` },
        { label: "Categor\xEDa", text: T.category, sub: "matriz \xB110 %" }
      ],
      summary,
      risks,
      actions,
      sections,
      notes: {
        method: [
          `"A\xF1o Anterior" = % variaci\xF3n ${Y1} vs ${Y1 - 1}; "\xDAltimo A\xF1o" = % variaci\xF3n ${Y} vs ${Y1}. Umbrales fijos de \xB110%.`,
          "Impacto = venta actual \u2212 venta anterior. Las dimensiones se agregan sumando renglones y el % se recalcula.",
          "Pareto: se acumula por impacto absoluto hasta cruzar el 80% (incluye la entidad que cruza)."
        ],
        quality: [
          `${A.rows.length} renglones analizados de ${A.rows.length + A.excluded.length}.`,
          A.excluded.length ? `Excluidos ${A.excluded.length} renglones de vendedores "Casa"/"Ocasional" (${fmt.short(exclV)}).` : null,
          `${A.rows.filter((r) => r.vY == null).length} sin venta ${Y} \xB7 ${A.rows.filter((r) => r.vY1 == null).length} sin venta ${Y1} \xB7 ${A.rows.filter((r) => /negativo/.test(r.obs)).length} montos negativos.`
        ].filter(Boolean),
        limits: ["Sin unidades, cuota, cliente ni zona en el archivo: las causas son hip\xF3tesis."]
      }
    };
  }
  function planSection(items, lead) {
    return {
      id: "plan",
      title: "Plan de acci\xF3n",
      kicker: "Ca\xEDdas relevantes",
      lead: lead || `${items.length} entidades en Ca\xEDda Libre, Alerta Roja, Alerta Amarilla o Suelo con impacto negativo. Primero las que est\xE1n dentro del Pareto 80%.`,
      blocks: [{ type: "plan", items }]
    };
  }
  function reportVentasFamilia(B, meta) {
    const F = B.byDim.Familia, G2 = B.byDim["Grupo familia"], T = B.total, L = B.lab;
    const altNeg = F.alt;
    const efecto = F.ents.filter((e) => e.category === "Efecto Rebote").sort((a, b) => a.impactAlt - b.impactAlt);
    const summary = [
      { fig: fmt.pct(T.varUlt), tone: T.impact < 0 ? "neg" : "pos", text: `<b>El ${L.ult.toLowerCase()} ${T.impact < 0 ? "cae" : "crece"} ${fmt.short(T.impact, true)}</b> (de ${fmt.short(T.vPrev)} a ${fmt.short(T.vAct)}). El ${L.ant.toLowerCase()} var\xEDa ${fmt.pct(T.varAnt)} (${fmt.short(T.impactAlt, true)}). Clasificaci\xF3n: <b>${T.category}</b>.` },
      { fig: `${F.neg.n80}`, tone: "neg", text: `<b>${F.falling} de ${F.ents.length} familias caen</b> (${fmt.short(-F.neg.total)}); ${F.neg.n80} explican el ${fmt.pct0(F.neg.cut)}: ${topList(F.neg.rows)}.` },
      { fig: `${F.pos.n80}`, tone: "pos", text: `<b>${F.growing} familias crecen</b> (+${fmt.short(F.pos.total)}); ${F.pos.n80} concentran el ${fmt.pct0(F.pos.cut)}: ${topList(F.pos.rows)}.` },
      { fig: fmt.short(G2.ents.find((g) => g.impact === Math.min(...G2.ents.map((x) => x.impact))).impact, true), tone: "", text: `<b>Por grupo:</b> ${G2.ents.map((g) => `${g.name} ${fmt.pct(g.varUlt)}`).join(" \xB7 ")}.` }
    ];
    if (efecto.length) summary.push({ fig: String(efecto.length), tone: "neg", text: `<b>${efecto.length} familias en Efecto Rebote</b>: crecen en ${L.ult.toLowerCase()} pero cayeron m\xE1s de 10% en ${L.ant.toLowerCase()}: ${efecto.slice(0, 3).map((e) => `${nice(e.name)} (${fmt.short(e.impactAlt, true)})`).join(", ")}.` });
    const famRow = (r) => ({ ...r });
    const sections = [
      {
        id: "familia",
        title: "Pareto por familia",
        kicker: `${F.ents.length} familias`,
        lead: `${F.neg.n80} familias concentran el ${fmt.pct0(F.neg.cut)} de la ca\xEDda; ${F.pos.n80} concentran el ${fmt.pct0(F.pos.cut)} del crecimiento.`,
        blocks: [
          { type: "bars", title: `Ca\xEDdas \xB7 ${L.ult.toLowerCase()}`, rows: barsFrom(F.neg.rows, "neg", void 0, 10) },
          { type: "bars", title: "Crecimientos (Pareto 80%)", rows: barsFrom(F.pos.rows.filter((r) => r.inPareto), "pos", void 0, 24) },
          { type: "matrix", title: "Matriz de clasificaci\xF3n \xB7 Familia", counts: F.counts, impacts: F.impacts, total: F.ents.length },
          { type: "table", title: "Ranking Pareto de ca\xEDdas \xB7 Familia", columns: [...catCols.slice(0, 2), { key: "grupo", label: "Grupo", type: "text" }, ...catCols.slice(2)], rows: F.neg.rows.map(famRow), pdfMax: 14 }
        ]
      },
      {
        id: "alt",
        title: `${L.ant} y grupos de familia`,
        kicker: "Lectura complementaria",
        lead: `El ${L.ant.toLowerCase()} cae ${fmt.short(-altNeg.total)} en ${altNeg.rows.length} familias; ${altNeg.n80} explican el ${fmt.pct0(altNeg.cut)}.`,
        blocks: [
          { type: "bars", title: `Ca\xEDdas \xB7 ${L.ant.toLowerCase()} (complementario)`, rows: altNeg.rows.filter((r) => r.inPareto).map((r) => ({ label: short(nice(r.name), 40), value: Math.abs(r.impact), text: `${fmt.short(r.impact, true)} \xB7 ${r.category}`, tone: "warn" })) },
          { type: "table", title: "Grupo familia", columns: [
            { key: "name", label: "Grupo", type: "text" },
            { key: "vAct", label: `Venta ${L.ult.toLowerCase()}`, type: "short" },
            { key: "varUlt", label: L.ult, type: "pct" },
            { key: "varAnt", label: L.ant, type: "pct" },
            { key: "impact", label: `Impacto ${L.ult.toLowerCase()}`, type: "shortSigned" },
            { key: "impactAlt", label: `Impacto ${L.ant.toLowerCase()}`, type: "shortSigned" },
            { key: "category", label: "Categor\xEDa", type: "cat" }
          ], rows: [...G2.ents].sort((a, b) => b.vAct - a.vAct) }
        ]
      },
      planSection(B.plan.map((p) => ({ ...p, title: nice(p.entity), tag: `${p.grupo} \xB7 ${p.category}`, metric: `${fmt.pct(p.varUlt)} \xB7 ${fmt.short(p.impact, true)}` })))
    ];
    return {
      scenario: "ventas-familia",
      title: "Ca\xEDdas y crecimientos por familia",
      subtitle: `${L.ult} y ${L.ant.toLowerCase()} \xB7 actual vs anterior`,
      file: meta.fileName,
      kpis: [
        { label: `Venta ${L.ult.toLowerCase()} actual`, value: T.vAct, type: "short", sub: `vs ${fmt.short(T.vPrev)}` },
        { label: `Variaci\xF3n ${L.ult.toLowerCase()}`, value: T.varUlt, type: "pct", tone: T.varUlt < 0 ? "neg" : "pos", sub: fmt.short(T.impact, true) },
        { label: `Variaci\xF3n ${L.ant.toLowerCase()}`, value: T.varAnt, type: "pct", tone: T.varAnt < 0 ? "neg" : "pos", sub: fmt.short(T.impactAlt, true) },
        { label: "Categor\xEDa", text: T.category, sub: "matriz \xB110 %" }
      ],
      summary,
      risks: B.plan.filter((p) => p.inPareto).slice(0, 4).map((p) => `<b>${nice(p.entity)}</b> (${p.category}): ${fmt.pct(p.varUlt)}, ${fmt.short(p.impact, true)}.`),
      actions: B.plan.slice(0, 5).map((p) => `${nice(p.entity)}: ${p.solutions[0]}`),
      sections,
      notes: {
        method: [
          `"\xDAltimo A\xF1o" = % ${L.ult} actual vs anterior (m\xE9trica principal y base del Pareto). "A\xF1o Anterior" = % ${L.ant}.`,
          "Los % se recalculan desde los pesos (el archivo los trae redondeados). Umbrales fijos de \xB110%."
        ],
        quality: [`${B.rows.length} renglones; ${F.ents.length} familias \xFAnicas.`, B.dupNames.length ? `Familias repetidas en dos grupos, consolidadas por nombre: ${B.dupNames.map(nice).join(", ")}.` : null].filter(Boolean),
        limits: ["El archivo no indica las fechas de cada corte.", "Sin vendedor, cliente, cuota ni unidades: las causas son hip\xF3tesis."]
      }
    };
  }
  function reportVentasClientes(C, meta) {
    const T = C.T, U = fmt.money(C.umbral);
    const vs = [...C.vend].sort((a, b) => b.pctArriba - a.pctArriba);
    const lowCover = C.vend.filter((v) => v.pctArriba < 0.5 && v.clientes >= 5).sort((a, b) => a.pctArriba - b.pctArriba);
    const lostTop = [...C.vend].sort((a, b) => b.perdidos - a.perdidos)[0];
    const casi = C.clients.filter((c) => c.activo && !c.nuevo && c.var < -0.75);
    const summary = [
      { fig: fmt.pct0(T.pctArriba), tone: "", text: `<b>${T.arriba} de ${T.clientes} clientes compran m\xE1s de ${U} al mes</b> y generan el ${fmt.pct(T.pctVentaArriba, false)} de la venta. Los otros ${T.clientes - T.arriba} aportan el ${fmt.pct(1 - T.pctVentaArriba, false)}.` },
      { fig: `${T.arriba - T.arriba25 >= 0 ? "+" : ""}${T.arriba - T.arriba25}`, tone: T.arriba >= T.arriba25 ? "pos" : "neg", text: `<b>Clientes arriba del umbral: de ${T.arriba25} a ${T.arriba}.</b> ${T.subieron} subieron de nivel y ${T.nuevosArriba} son nuevos arriba del umbral, contra ${T.bajaron} que bajaron.` },
      { fig: String(T.cerca), tone: "", text: `<b>Clientes a un paso del umbral</b> (${fmt.money(C.cerca)}\u2013${U} al mes). Es la palanca m\xE1s r\xE1pida para subir el indicador.` },
      { fig: String(C.cneg.n80), tone: "neg", text: `<b>Clientes que explican el 80% de la ca\xEDda</b> (${fmt.short(-C.cneg.total)} en ${C.cneg.rows.length} clientes que bajan). ${casi.length} clientes cayeron m\xE1s de 75%.` }
    ];
    if (lostTop && lostTop.perdidos > 0) summary.push({ fig: fmt.short(T.perdidos), tone: "neg", text: `<b>Venta del a\xF1o anterior de clientes que no compraron este a\xF1o (estimada)</b>. La mayor es de ${nice(lostTop.name)} (${fmt.short(lostTop.perdidos)}).` });
    const stackRows = vs.map((v) => ({
      label: nice(v.name),
      segs: [{ v: v.arriba, tone: "dark" }, { v: v.cerca, tone: "amber" }, { v: v.clientes - v.arriba - v.cerca, tone: "light" }],
      text: fmt.pct0(v.pctArriba),
      sub: `de ${v.clientes}`,
      alert: v.pctArriba < 0.5
    }));
    const vCols = [
      { key: "name", label: "Vendedor", type: "text", fmt: nice },
      { key: "clientes", label: "Clientes", type: "int" },
      { key: "arriba", label: `> ${U}`, type: "int" },
      { key: "pctArriba", label: "%", type: "pct0" },
      { key: "pctVentaArriba", label: "% venta", type: "pct0" },
      { key: "cerca", label: "Cerca", type: "int" },
      { key: "nuevos", label: "Nuevos", type: "int" },
      { key: "caen", label: "Caen", type: "int" },
      { key: "venta", label: "Venta", type: "short" },
      { key: "varV", label: "Var.", type: "pct" }
    ];
    const vTotal = {
      name: "Total",
      clientes: T.clientes,
      arriba: T.arriba,
      pctArriba: T.pctArriba,
      pctVentaArriba: T.pctVentaArriba,
      cerca: T.cerca,
      nuevos: T.nuevos,
      caen: sum(C.vend, (v) => v.caen),
      venta: T.venta,
      varV: T.var,
      _total: true
    };
    const sections = [
      {
        id: "vendedores",
        title: "Clientes por vendedor",
        kicker: "Cobertura de cartera",
        lead: `Ordenados por % de clientes arriba de ${U}/mes. En rojo, quienes tienen menos de la mitad de su cartera arriba del umbral.`,
        blocks: [
          { type: "stack", title: "Composici\xF3n de la cartera", rows: stackRows, legend: [{ tone: "dark", label: `Arriba de ${U}/mes` }, { tone: "amber", label: `Cerca (${fmt.money(C.cerca)}\u2013${U})` }, { tone: "light", label: "Resto" }] },
          { type: "table", title: "Detalle por vendedor", columns: vCols, rows: [...C.vend, vTotal], pdfMax: 30 }
        ]
      },
      {
        id: "segmentos",
        title: "Segmentos y movimiento",
        kicker: "Calidad de cartera",
        lead: `Promedio mensual = venta / ${C.meses} meses. Los clientes arriba de ${U} generan el ${fmt.pct(T.pctVentaArriba, false)} de la venta.`,
        blocks: [
          { type: "bars", title: "Clientes por compra mensual", rows: C.segRows.map((s) => ({ label: s.key, value: s.n, text: `${s.n} clientes \xB7 ${fmt.short(s.v)} (${fmt.pct0(s.v / T.ventaActiva)})`, tone: "dark" })), half: true },
          { type: "bridge", title: "Clientes arriba del umbral: a\xF1o anterior \u2192 actual", half: true, steps: [
            { label: "A\xF1o anterior", value: T.arriba25, kind: "base" },
            { label: "Subieron", value: T.subieron, kind: "up" },
            { label: "Nuevos", value: T.nuevosArriba, kind: "up" },
            { label: "Bajaron", value: -T.bajaron, kind: "down" },
            { label: "Actual", value: T.arriba, kind: "base" }
          ] }
        ]
      },
      {
        id: "pareto",
        title: "Pareto de clientes",
        kicker: "Fugas y crecimiento",
        lead: `${C.cneg.n80} de ${C.cneg.rows.length} clientes explican el 80% de la ca\xEDda (${fmt.short(-C.cneg.total)}); ${C.cpos.n80} de ${C.cpos.rows.length} explican el 80% del crecimiento (+${fmt.short(C.cpos.total)}).`,
        blocks: [
          { type: "bars", title: "Top 12 ca\xEDdas", rows: C.cneg.rows.slice(0, 12).map((r) => ({ label: short(`${nice(r.cli)} \xB7 ${nice(r.vend).split(" ").slice(0, 2).join(" ")}`, 46), value: r.absImpact, text: `${fmt.short(r.impact, true)} \xB7 ${fmt.pct(r.var)}`, tone: "neg" })) },
          { type: "bars", title: "Top 12 crecimientos", rows: C.cpos.rows.slice(0, 12).map((r) => ({ label: short(`${nice(r.cli)} \xB7 ${nice(r.vend).split(" ").slice(0, 2).join(" ")}`, 46), value: r.absImpact, text: `${fmt.short(r.impact, true)} \xB7 ${r.nuevo ? "nuevo" : fmt.pct(r.var)}`, tone: "pos" })) }
        ]
      },
      planSection(
        C.plan.map((p) => ({ ...p, title: nice(p.entity), tag: p.tipo === "Vendedor" ? `${p.severidad} \xB7 ${p.clientes} clientes` : `${nice(p.vendedor)} \xB7 ${p.severidad}`, metric: `${fmt.pct(p.varUlt)} \xB7 ${fmt.short(p.impact, true)}` })),
        `${C.plan.filter((p) => p.tipo === "Vendedor").length} vendedores en ca\xEDda y ${C.plan.filter((p) => p.tipo === "Cliente").length} clientes del Pareto 80% de ca\xEDdas.`
      )
    ];
    return {
      scenario: "ventas-clientes",
      title: `Clientes por vendedor y clientes arriba de ${U} al mes`,
      subtitle: `${C.vend.length} vendedores \xB7 ${C.Y || ""}`,
      file: meta.fileName,
      kpis: [
        { label: "Clientes activos", value: T.clientes, type: "int", sub: `${C.vend.length} vendedores` },
        { label: `Arriba de ${U}/mes`, value: T.arriba, type: "int", sub: `${fmt.pct0(T.pctArriba)} \xB7 eran ${T.arriba25}` },
        { label: "Venta de esos clientes", value: T.pctVentaArriba, type: "pct0", sub: `de ${fmt.short(T.venta)}` },
        { label: "Venta vs a\xF1o anterior", value: T.var, type: "pct", tone: T.var < 0 ? "neg" : "pos", sub: fmt.short(T.venta - T.vPrev, true) }
      ],
      summary,
      risks: [
        casi.length ? `<b>${casi.length} clientes casi perdidos</b> (caen m\xE1s de 75%).` : null,
        lowCover.length ? `<b>Carteras con pocos clientes grandes:</b> ${lowCover.slice(0, 4).map((v) => `${nice(v.name)} (${fmt.pct0(v.pctArriba)})`).join(", ")}.` : null,
        C.vend.filter((v) => v.impact < 0).length ? `<b>Vendedores en ca\xEDda:</b> ${C.vend.filter((v) => v.impact < 0).map((v) => nice(v.name)).join(", ")}.` : null
      ].filter(Boolean),
      actions: [
        "Visitas de reactivaci\xF3n en 7 d\xEDas a los clientes que cayeron m\xE1s de 75%.",
        lostTop && lostTop.perdidos > 0 ? `Recuperar la lista de clientes del a\xF1o anterior de ${nice(lostTop.name)} que no compraron este a\xF1o.` : null,
        `Campa\xF1a para subir a los ${T.cerca} clientes cercanos por encima de ${U}/mes.`,
        "Meta mensual por vendedor: n\xFAmero de clientes arriba del umbral."
      ].filter(Boolean),
      sections,
      notes: {
        method: [
          `Cliente arriba del umbral: venta del periodo / ${C.meses} meses > ${U}.`,
          'Cada cuenta "P\xFAblico en general" cuenta como 1 cliente.',
          "Venta del a\xF1o anterior por cliente = venta / (1 + % variaci\xF3n); sin % = cliente nuevo."
        ],
        quality: [
          C.excluded.length ? `Excluidos ${C.excluded.length} clientes de vendedores "Casa"/"Ocasional" (${fmt.short(sum(C.excluded, (r) => r.vY ?? 0))}).` : null,
          `${C.clients.filter((c) => !c.activo).length} clientes con venta neta \u2264 $0 quedan fuera del conteo.`
        ].filter(Boolean),
        limits: ["Sin venta mes a mes, el umbral es un promedio del periodo.", "Los clientes perdidos se estiman por diferencia contra el total del vendedor."]
      }
    };
  }
  function reportCartera(R, meta) {
    const K = R.kpi;
    const mcols = R.m5.map((m) => ({ key: `h_${m}`, label: m, type: "money", month: true }));
    const cl = R.clientes.map((c) => ({ ...c, ...Object.fromEntries(R.m5.map((m) => [`h_${m}`, c.hist[m]])) }));
    return {
      scenario: "cartera",
      title: "Cartera vencida \xB7 Gu\xEDa 80-20",
      subtitle: `${nice(R.cedis)} \xB7 ${R.mes}`,
      file: meta.fileName,
      kpis: [
        { label: "Clientes con deuda > 15 d\xEDas", value: K.clientes, type: "int", sub: K.prevClientes != null ? `mes anterior: ${K.prevClientes}` : "" },
        { label: "Vencido > 15 d\xEDas", value: K.vencido, type: "short", sub: `${K.vendedores} vendedores` },
        { label: "% a m\xE1s de 15 d\xEDas", value: K.pct, type: "pct2", sub: `lugar ${K.rank} de ${K.zonas} CEDIS` },
        { label: "Corte 80-20", value: K.n80, type: "int", sub: `clientes = ${fmt.pct0(K.pct80)} del vencido` }
      ],
      sections: [
        {
          id: "desplegado",
          title: "Desplegado Clientes",
          kicker: `${K.clientes} clientes`,
          lead: `Amarillo = desde el primer cliente hasta el que tiene el Total m\xE1s cercano a 100% (${fmt.pct(K.totalCut, false)}).`,
          blocks: [{
            type: "table",
            guia: true,
            columns: [
              { key: "no", label: "No", type: "int" },
              { key: "pctNo", label: "%", type: "pct2" },
              { key: "vend", label: "Vendedor", type: "text" },
              { key: "cli", label: "Cliente", type: "text" },
              ...mcols,
              { key: "rel", label: "% suma acum", type: "pct2" },
              { key: "cum", label: "% rel acum", type: "pct2" },
              { key: "total", label: "Total", type: "pct2" }
            ],
            rows: cl,
            highlight: "amarillo"
          }]
        },
        {
          id: "vencimiento",
          title: "Resumen Vencimiento",
          kicker: `${K.vendedores} vendedores`,
          lead: "Por vencimiento y por n\xFAmero de clientes; cada tabla con su propio corte 80-20.",
          blocks: [
            { type: "table", title: "Por vencimiento", half: true, highlight: "amarillo", columns: [
              { key: "pctNo", label: "%", type: "pct0" },
              { key: "vend", label: "Vendedor", type: "text" },
              { key: "n", label: "Clientes", type: "int" },
              { key: "v", label: "Vencido", type: "money" },
              { key: "rel", label: "% rel", type: "pct0" },
              { key: "cum", label: "% rel acum", type: "pct0" },
              { key: "total", label: "Total", type: "pct0" }
            ], rows: R.left },
            { type: "table", title: "Por clientes", half: true, highlight: "amarillo", columns: [
              { key: "pctNo", label: "%", type: "pct0" },
              { key: "vend", label: "Vendedor", type: "text" },
              { key: "n", label: "Clientes", type: "int" },
              { key: "v", label: "Vencido", type: "money" },
              { key: "rel", label: "% rel", type: "pct0" },
              { key: "cum", label: "% rel acum", type: "pct0" },
              { key: "total", label: "Total", type: "pct0" }
            ], rows: R.right }
          ]
        },
        {
          id: "resumen",
          title: "Resumen",
          kicker: "Todos los CEDIS",
          lead: `Clientes con cartera vencida a m\xE1s de 15 d\xEDas (sin autoconsumo) y ranking por % del ${R.mes}.`,
          blocks: [
            { type: "bars", title: "% a m\xE1s de 15 d\xEDas por CEDIS", rows: R.ranking.map((r) => ({ label: nice(r.zona), value: r.pct, text: `${fmt.pct(r.pct, false)} \xB7 ${fmt.short(r.v15)}`, tone: r.zona === R.cedis ? "neg" : "dark" })) },
            {
              type: "table",
              title: "Clientes con deuda > 15 d\xEDas",
              columns: [{ key: "zona", label: "Zona", type: "text" }, ...R.m13.map((m) => ({ key: `c_${m}`, label: m, type: "int", month: true }))],
              rows: R.conteo.map((c) => ({ zona: c.zona, _hl: c.zona === R.cedis, ...Object.fromEntries(R.m13.map((m) => [`c_${m}`, c.per[m]])) }))
            }
          ]
        }
      ]
    };
  }

  // js/ui/blocks.js
  var esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  function formatValue(v, type) {
    switch (type) {
      case "int":
        return fmt.int(v);
      case "money":
        return fmt.money(v);
      case "short":
        return fmt.short(v);
      case "shortSigned":
        return fmt.short(v, true);
      case "pct":
        return fmt.pct(v);
      case "pct0":
        return fmt.pct0(v);
      case "pct2":
        return v == null ? "\u2014" : `${(v * 100).toFixed(2)}%`;
      default:
        return v == null ? "" : String(v);
    }
  }
  function catClass(c) {
    if (["Acierto", "Recuperaci\xF3n", "Efecto Rebote"].includes(c)) return "cat--good";
    if (["Ca\xEDda Libre", "Alerta Roja"].includes(c)) return "cat--bad";
    if (["Alerta Amarilla", "Suelo"].includes(c)) return "cat--warn";
    return "";
  }
  function bars(block) {
    if (!block.rows?.length) return '<p class="empty-note">Sin datos para graficar.</p>';
    const max = Math.max(...block.rows.map((r) => r.value)) || 1;
    return `<div class="bars" role="list">${block.rows.map((r, i) => {
      const w = Math.max(0.6, r.value / max * 100);
      return `<div class="bar-row" role="listitem" style="--i:${i}" data-tip="${esc(r.label)}|${esc(r.text)}${r.extra ? " \xB7 " + esc(r.extra) : ""}">
      <span class="bar-label" title="${esc(r.label)}">${esc(r.label)}</span>
      <span class="bar-track"><svg class="bar-svg" aria-hidden="true"><rect class="track" x="0" y="2" width="100%" height="12" rx="6"/><rect class="bar t-${r.tone || "dark"}" x="0" y="2" width="${w.toFixed(2)}%" height="12" rx="6"/></svg>
      <span class="bar-val">${esc(r.text)}${r.extra ? ` <span class="x">\xB7 ${esc(r.extra)}</span>` : ""}</span></span></div>`;
    }).join("")}</div>`;
  }
  function stack(block) {
    const max = Math.max(...block.rows.map((r) => r.segs.reduce((t, s) => t + s.v, 0))) || 1;
    const legend = `<div class="legend">${block.legend.map((l) => `<span><i class="sw t-${l.tone}"></i>${esc(l.label)}</span>`).join("")}</div>`;
    return legend + `<div class="bars">${block.rows.map((r, i) => {
      let x = 0;
      const segs = r.segs.map((s, j) => {
        const w = s.v / max * 100;
        const out = s.v > 0 ? `<rect class="seg t-${s.tone}" style="--i:${i};--j:${j}" x="${x.toFixed(2)}%" y="2" width="${Math.max(w - 0.35, 0.3).toFixed(2)}%" height="12" rx="3"/>` + (w > 4 ? `<text class="seg-txt" style="--i:${i}" x="${(x + w / 2).toFixed(2)}%" y="11.5" text-anchor="middle" fill="${s.tone === "dark" ? "var(--bg)" : "var(--text)"}">${s.v}</text>` : "") : "";
        x += w;
        return out;
      }).join("");
      return `<div class="bar-row stack-row${r.alert ? " is-alert" : ""}" style="--i:${i}" data-tip="${esc(r.label)}|${r.segs.map((s, j) => `${block.legend[j].label}: ${s.v}`).join(" \xB7 ")}">
      <span class="bar-label">${esc(r.label)}</span>
      <span class="bar-track"><svg class="bar-svg" aria-hidden="true">${segs}</svg><span class="bar-val"><b>${esc(r.text)}</b> <span class="x">${esc(r.sub || "")}</span></span></span></div>`;
    }).join("")}</div>`;
  }
  function bridge(block) {
    const W = 420, H = 230, top = 26, bot = 40, n = block.steps.length;
    let run = 0;
    const pts = block.steps.map((s) => {
      let y0, y1;
      if (s.kind === "base") {
        y0 = 0;
        y1 = s.value;
        run = s.value;
      } else if (s.kind === "up") {
        y0 = run;
        y1 = run + s.value;
        run += s.value;
      } else {
        y0 = run + s.value;
        y1 = run;
        run += s.value;
      }
      return { ...s, y0, y1 };
    });
    const mx = Math.max(...pts.map((p) => p.y1)) * 1.08 || 1, sc = (H - top - bot) / mx, bw = 50, gap = (W - n * bw) / (n + 1);
    const cols = pts.map((p, i) => {
      const x = gap + i * (bw + gap), yt = H - bot - p.y1 * sc, h = Math.max((p.y1 - p.y0) * sc, 2);
      const cls = p.kind === "base" ? "t-dark" : p.kind === "up" ? "t-pos" : "t-neg";
      return `<rect class="bcol ${cls}" style="--i:${i}" x="${x}" y="${yt}" width="${bw}" height="${h}" rx="4"/>
      <text class="bval" style="--i:${i}" x="${x + bw / 2}" y="${yt - 7}" text-anchor="middle">${p.kind === "up" ? "+" : ""}${p.value}</text>
      <text class="blab" x="${x + bw / 2}" y="${H - bot + 18}" text-anchor="middle">${esc(p.label)}</text>`;
    }).join("");
    return `<svg class="bridge" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(block.title)}"><line class="base" x1="0" x2="${W}" y1="${H - bot}" y2="${H - bot}"/>${cols}</svg>`;
  }
  function matrix(block) {
    const mx = Math.max(...CATS.map((c) => block.counts[c] || 0)) || 1;
    let k = 0;
    const head = `<div class="mx-corner">A\xF1o ant. \u2193 / \xDAltimo \u2192</div>${["> +10 %", "\xB110 %", "< \u221210 %"].map((h) => `<div class="mx-h">${h}</div>`).join("")}`;
    const body = MATRIX_LAYOUT.map(([lab, cats]) => `<div class="mx-h row">${lab}</div>` + cats.map((c) => {
      const n = block.counts[c] || 0, a = n / mx * 0.9;
      return `<div class="mx-c${a > 0.5 ? " is-strong" : ""}" style="--a:${a.toFixed(3)};--i:${k++}" data-tip="${esc(c)}|${n} entidades \xB7 impacto ${esc(fmt.short(block.impacts[c] || 0, true))}">
      <b>${c}</b><span class="n" data-count="${n}">${n}</span><span class="s">${n ? esc(fmt.short(block.impacts[c] || 0, true)) : "\u2014"}</span></div>`;
    }).join("")).join("");
    const nc = block.counts["No clasificable"];
    return `<div class="matrix">${head}${body}</div>${nc ? `<p class="empty-note" style="margin-top:8px">${nc} no clasificable(s): sin base para calcular el %.</p>` : ""}`;
  }
  function table(block, { max } = {}) {
    const rows = max ? block.rows.slice(0, max) : block.rows;
    const isNum = (t) => !["text", "cat"].includes(t);
    const th = block.columns.map((c) => `<th class="${isNum(c.type) ? "" : "l"}">${esc(c.month ? monthLabel(c.label) : c.label)}</th>`).join("");
    const tb = rows.map((r) => {
      const cls = [r[block.highlight] ? "is-yellow" : "", r._hl ? "is-hl" : "", r._total ? "is-total" : ""].filter(Boolean).join(" ");
      return `<tr class="${cls}">${block.columns.map((c) => {
        let v = r[c.key];
        if (c.type === "cat") return `<td class="l"><span class="cat ${catClass(v)}">${esc(v)}</span></td>`;
        if (c.type === "text") {
          const s = c.fmt ? c.fmt(v) : v;
          return `<td class="l" title="${esc(s)}">${esc(s)}</td>`;
        }
        const tone = (c.type === "pct" || c.type === "shortSigned") && v != null ? v < 0 ? " tone-neg" : "" : "";
        return `<td class="num${tone}">${esc(formatValue(v, c.type))}</td>`;
      }).join("")}</tr>`;
    }).join("");
    const more = max && block.rows.length > max ? `<p class="pdf-note" style="margin-top:4px">Se muestran ${max} de ${block.rows.length} renglones; el detalle completo est\xE1 en el Excel.</p>` : "";
    return `<div class="tbl-wrap"><table class="tbl"><thead><tr>${th}</tr></thead><tbody>${tb}</tbody></table></div>${more}`;
  }
  function planCard(p, i) {
    return `<article class="plan-card" style="--i:${i % 12}">
    <div class="plan-top"><span class="plan-name">${esc(p.title)}${p.inPareto ? '<span class="pareto-flag">PARETO</span>' : ""}</span><span class="plan-metric">${esc(p.metric)}</span></div>
    <div class="plan-tag">${esc(p.tag)}</div><p class="plan-diag">${esc(p.diag)}</p>
    <ol>${p.solutions.map((s) => `<li>${esc(s)}</li>`).join("")}</ol></article>`;
  }
  function plan(block, { limit = 12 } = {}) {
    if (!block.items.length) return '<p class="empty-note">No hay entidades con ca\xEDda relevante: no se generan soluciones.</p>';
    const shown = block.items.slice(0, limit);
    return `<div class="plan-grid">${shown.map(planCard).join("")}</div>` + (block.items.length > limit ? `<div class="plan-more"><button class="btn" data-more-plan><i class="fa-solid fa-chevron-down"></i><span>Ver las ${block.items.length - limit} restantes</span></button></div>` : "");
  }
  function renderBlock(b, opts2 = {}) {
    const title = b.title && b.type !== "plan" ? `<div class="card-title">${esc(b.title)}</div>` : "";
    let inner = "";
    switch (b.type) {
      case "bars":
        inner = bars(b);
        break;
      case "stack":
        inner = stack(b);
        break;
      case "bridge":
        inner = bridge(b);
        break;
      case "matrix":
        inner = matrix(b);
        break;
      case "table":
        inner = table(b, { max: opts2.pdf ? b.pdfMax || 22 : null });
        break;
      case "plan":
        inner = plan(b, opts2);
        break;
      default:
        inner = "";
    }
    return `<section class="card${b.half ? " is-half" : ""}" data-block="${b.type}">${title}${inner}</section>`;
  }

  // js/ui/render.js
  var reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function kpiHTML(k, i) {
    const val2 = k.text != null ? `<div class="kpi-value is-text">${esc(k.text)}</div>` : `<div class="kpi-value ${k.tone ? "tone-" + k.tone : ""}" data-count="${k.value}" data-type="${k.type}">${esc(formatValue(k.value, k.type))}</div>`;
    return `<div class="kpi" style="--i:${i}"><div class="kpi-label">${esc(k.label)}</div>${val2}<div class="kpi-sub">${esc(k.sub || "")}</div></div>`;
  }
  function summaryPanel(rep) {
    if (!rep.summary) return "";
    const msgs = rep.summary.map((m, i) => `<div class="msg" style="--i:${i}"><div class="msg-fig ${m.tone ? "tone-" + m.tone : ""}">${esc(m.fig)}</div><div class="msg-text">${m.text}</div></div>`).join("");
    const list = (arr) => `<ul class="bullets">${(arr || []).map((x) => `<li>${x}</li>`).join("") || "<li>Sin elementos.</li>"}</ul>`;
    const notes = rep.notes ? `<section class="card"><div class="card-title">Metodolog\xEDa, calidad y limitaciones</div><div class="notes">
      <div><h4>Metodolog\xEDa</h4><ul>${rep.notes.method.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
      <div><h4>Calidad de datos</h4><ul>${rep.notes.quality.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
      <div><h4>Limitaciones</h4><ul>${rep.notes.limits.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div></div></section>` : "";
    return `<div class="tabpanel" data-panel="resumen"><div class="blocks">
    <section class="card"><div class="card-title">Hallazgos principales</div><div class="msgs">${msgs}</div></section>
    <section class="card is-half"><div class="card-title">Riesgos comerciales</div>${list(rep.risks)}</section>
    <section class="card is-half"><div class="card-title">Acciones prioritarias</div>${list(rep.actions)}</section>
    ${notes}</div></div>`;
  }
  function renderResults(root, rep) {
    const tabs = [...rep.summary ? [{ id: "resumen", title: "Resumen ejecutivo" }] : [], ...rep.sections.map((s) => ({ id: s.id, title: s.title }))];
    root.innerHTML = `
    <div class="kpis">${rep.kpis.map(kpiHTML).join("")}</div>
    <nav class="tabs" role="tablist"><span class="tab-ink" aria-hidden="true"></span>${tabs.map((t, i) => `<button class="tab${i ? "" : " is-active"}" role="tab" data-tab="${t.id}" aria-selected="${!i}">${esc(t.title)}</button>`).join("")}</nav>
    ${summaryPanel(rep)}
    ${rep.sections.map((s) => `<div class="tabpanel" data-panel="${s.id}">${s.lead ? `<p class="sec-lead">${s.lead}</p>` : ""}<div class="blocks">${s.blocks.map((b) => renderBlock(b)).join("")}</div></div>`).join("")}`;
    const panels = [...root.querySelectorAll(".tabpanel")], tabBtns = [...root.querySelectorAll(".tab")], ink = root.querySelector(".tab-ink");
    const moveInk = (btn) => {
      ink.style.width = `${btn.offsetWidth}px`;
      ink.style.transform = `translateX(${btn.offsetLeft}px)`;
    };
    const show = (id) => {
      tabBtns.forEach((b) => {
        const on = b.dataset.tab === id;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", on);
        if (on) {
          moveInk(b);
          b.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduce() ? "auto" : "smooth" });
        }
      });
      panels.forEach((p) => {
        const on = p.dataset.panel === id;
        p.classList.toggle("is-active", on);
        if (on) animateIn(p);
      });
    };
    tabBtns.forEach((b) => b.addEventListener("click", () => show(b.dataset.tab)));
    window.addEventListener("resize", () => {
      const a = root.querySelector(".tab.is-active");
      if (a) moveInk(a);
    });
    root.querySelectorAll("[data-more-plan]").forEach((btn) => btn.addEventListener("click", () => {
      const sec = rep.sections.find((s) => s.id === "plan"), grid = btn.closest(".card").querySelector(".plan-grid");
      const items = sec.blocks[0].items;
      grid.insertAdjacentHTML("beforeend", items.slice(12).map((p, i) => planCard(p, i)).join(""));
      btn.parentElement.remove();
    }));
    requestAnimationFrame(() => {
      show(tabs[0].id);
      countUp(root);
    });
  }
  var io = "IntersectionObserver" in window ? new IntersectionObserver((ents) => ents.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    }
  }), { rootMargin: "0px 0px -40px 0px" }) : null;
  function animateIn(panel) {
    panel.querySelectorAll(".card").forEach((c) => {
      if (c.classList.contains("is-in")) return;
      if (io) io.observe(c);
      else c.classList.add("is-in");
    });
    panel.querySelectorAll(".mx-c .n[data-count]").forEach((el) => tween(el, +el.dataset.count, (v) => String(Math.round(v)), 700));
  }
  function countUp(root) {
    root.querySelectorAll(".kpi-value[data-count]").forEach((el) => {
      const target = +el.dataset.count, type = el.dataset.type;
      tween(el, target, (v) => formatValue(type === "int" ? Math.round(v) : v, type), 1100);
    });
  }
  function tween(el, target, f, dur) {
    if (!Number.isFinite(target) || reduce()) {
      el.textContent = f(target);
      return;
    }
    const t0 = performance.now(), ease = (t) => 1 - Math.pow(1 - t, 4);
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      el.textContent = f(target * ease(t));
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = f(target);
    };
    requestAnimationFrame(step);
  }
  function initTooltips() {
    const tip = document.createElement("div");
    tip.className = "tip";
    tip.setAttribute("role", "tooltip");
    document.body.appendChild(tip);
    let cur = null;
    document.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const t = e.target.closest?.("[data-tip]");
      if (!t) {
        if (cur) {
          tip.classList.remove("is-on");
          cur = null;
        }
        return;
      }
      if (t !== cur) {
        const [a, b] = t.dataset.tip.split("|");
        tip.innerHTML = `<b>${esc(a)}</b><span class="mono">${esc(b || "")}</span>`;
        cur = t;
        tip.classList.add("is-on");
      }
      const x = Math.min(e.clientX + 14, window.innerWidth - tip.offsetWidth - 10), y = Math.min(e.clientY + 16, window.innerHeight - tip.offsetHeight - 10);
      tip.style.left = `${x}px`;
      tip.style.top = `${y}px`;
    }, { passive: true });
  }

  // js/export/excel.js
  var X = () => globalThis.ExcelJS;
  var FONT = "Arial";
  var NAVY = "FF1F3A5F";
  var MON = "$#,##0;-$#,##0;-";
  var PCT = "0.0%;-0.0%;0.0%";
  var INT = "#,##0;-#,##0;-";
  function sheet(wb, name, cols) {
    const ws = wb.addWorksheet(name, { views: [{ state: "frozen", ySplit: 1 }] });
    ws.columns = cols.map((c) => ({ header: c.h, key: c.k, width: c.w || 14, style: { font: { name: FONT, size: 10 }, numFmt: c.f } }));
    const hr = ws.getRow(1);
    hr.height = 40;
    hr.eachCell((cell) => {
      cell.font = { name: FONT, size: 10, bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
      cell.alignment = { wrapText: true, vertical: "middle", horizontal: "center" };
    });
    return ws;
  }
  var finish = (ws) => {
    if (ws.rowCount > 1) ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: ws.rowCount, column: ws.columnCount } };
  };
  var val = (x) => x == null || typeof x === "number" && !Number.isFinite(x) ? null : x;
  var wrapCols = (ws, keys) => ws.eachRow((row, i) => {
    if (i > 1) keys.forEach((k) => {
      const c = row.getCell(k);
      c.alignment = { wrapText: true, vertical: "top" };
    });
  });
  function notesSheet(wb, title, items) {
    const ws = wb.addWorksheet("Reglas y notas");
    ws.getColumn(1).width = 4;
    ws.getColumn(2).width = 28;
    ws.getColumn(3).width = 110;
    ws.getCell("B1").value = title;
    ws.getCell("B1").font = { name: FONT, size: 13, bold: true, color: { argb: NAVY } };
    ws.getCell("B2").value = `Generado por GAFI Analizador \xB7 ${todayLong()}`;
    ws.getCell("B2").font = { name: FONT, size: 9, italic: true };
    let r = 4;
    if (items.matrix) {
      ws.getCell(`B${r}`).value = "A\xF1o Anterior \u2193 / \xDAltimo A\xF1o \u2192";
      ws.getCell(`B${r}`).font = { name: FONT, bold: true, size: 9 };
      r++;
      ["", "> +10 %", "\xB110 %", "< \u221210 %"].forEach((h, j) => {
        if (h) {
          const c = ws.getCell(r, 2 + j);
          c.value = h;
          c.font = { name: FONT, bold: true, color: { argb: "FFFFFFFF" } };
          c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
        }
      });
      for (const [lab, cats] of MATRIX_LAYOUT) {
        r++;
        const c = ws.getCell(r, 2);
        c.value = lab;
        c.font = { name: FONT, bold: true, color: { argb: "FFFFFFFF" } };
        c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
        cats.forEach((v, j) => {
          const x = ws.getCell(r, 3 + j);
          x.value = v;
          x.font = { name: FONT };
          x.alignment = { horizontal: "center" };
        });
      }
      ws.getColumn(4).width = 22;
      ws.getColumn(5).width = 22;
      r += 2;
    }
    for (const [k, v] of items.rows) {
      ws.getCell(r, 2).value = k;
      ws.getCell(r, 2).font = { name: FONT, bold: true, size: 10 };
      ws.getCell(r, 3).value = v;
      ws.getCell(r, 3).font = { name: FONT, size: 10 };
      ws.getCell(r, 3).alignment = { wrapText: true, vertical: "top" };
      r++;
    }
  }
  function paretoRows(ws, level, rows, map) {
    for (const r of rows) ws.addRow({ nivel: level, rank: r.rank, ...map(r), share: r.share, cum: r.cum, p80: r.inPareto ? "S\xED" : "No" });
  }
  function resumenSheet(wb, dims, byDim, missing = []) {
    const cols = [
      { h: "Dimensi\xF3n", k: "dim", w: 26 },
      { h: "Estatus", k: "st", w: 22 },
      { h: "# Entidades", k: "n", w: 10, f: INT },
      ...[...CATS, NC].map((c) => ({ h: c, k: c, w: 11, f: INT })),
      { h: "Impacto ca\xEDdas $", k: "neg", w: 15, f: MON },
      { h: "Impacto crecimientos $", k: "pos", w: 15, f: MON },
      { h: "Impacto neto $", k: "net", w: 15, f: MON },
      { h: "# Pareto 80% ca\xEDdas", k: "pn", w: 11, f: INT },
      { h: "# Pareto 80% crecimientos", k: "pp", w: 11, f: INT }
    ];
    const ws = sheet(wb, "Resumen por dimensi\xF3n", cols);
    for (const m of missing) ws.addRow({ dim: m, st: "No disponible en archivo" });
    for (const d of dims) {
      const D = byDim[d];
      ws.addRow({ dim: d, st: D.ents.length > 1 ? "Analizada" : "Analizada (1 entidad)", n: D.ents.length, ...D.counts, neg: -D.neg.total, pos: D.pos.total, net: D.pos.total - D.neg.total, pn: D.neg.n80, pp: D.pos.n80 });
    }
    finish(ws);
  }
  async function toBlob(wb) {
    const buf = await wb.xlsx.writeBuffer();
    return new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  }
  async function excelVentasAnual(A) {
    const wb = new (X()).Workbook();
    wb.creator = "GAFI Analizador";
    const { Y, Y1, dims } = A;
    let ws = sheet(wb, "Datos depurados", [
      { h: "Fila origen", k: "fila", w: 9 },
      ...dims.map((d, i) => ({ h: d, k: `d${i}`, w: 28 })),
      { h: `Ventas pesos (${Y})`, k: "vY", w: 15, f: MON },
      { h: `Ventas pesos a\xF1o anterior (${Y1})`, k: "vY1", w: 15, f: MON },
      { h: `% Variacion pesos \u2014 \xDAltimo A\xF1o (${Y} vs ${Y1})`, k: "varY", w: 15, f: PCT },
      { h: `A\xF1o Anterior (% Var ${Y1} vs ${Y1 - 1})`, k: "varY1", w: 15, f: PCT },
      { h: `Ventas pesos ${Y1 - 1} (calculada)`, k: "v2", w: 15, f: MON },
      { h: "Variaci\xF3n $", k: "imp", w: 15, f: MON },
      { h: "Impacto absoluto", k: "abs", w: 14, f: MON },
      { h: "Categor\xEDa", k: "cat", w: 18 },
      { h: "Observaci\xF3n", k: "obs", w: 40 }
    ]);
    for (const r of A.rows) ws.addRow({
      fila: r.fila,
      ...Object.fromEntries(r.d.map((x, i) => [`d${i}`, x])),
      vY: val(r.vY),
      vY1: val(r.vY1),
      varY: val(r.varY),
      varY1: val(r.varY1),
      v2: val(r.vPrev2),
      imp: r.impact,
      abs: Math.abs(r.impact),
      cat: r.category,
      obs: r.obs || null
    });
    finish(ws);
    ws = sheet(wb, "Clasificaci\xF3n", [
      { h: "Dimensi\xF3n", k: "dim", w: 14 },
      { h: "Entidad", k: "name", w: 36 },
      { h: `Ventas pesos (${Y})`, k: "vAct", w: 15, f: MON },
      { h: `Ventas pesos (${Y1})`, k: "vPrev", w: 15, f: MON },
      { h: `Ventas pesos ${Y1 - 1} (calc.)`, k: "vPrev2", w: 15, f: MON },
      { h: `A\xF1o Anterior (${Y1} vs ${Y1 - 1})`, k: "varAnt", w: 14, f: PCT },
      { h: `\xDAltimo A\xF1o (${Y} vs ${Y1})`, k: "varUlt", w: 14, f: PCT },
      { h: "Variaci\xF3n $", k: "impact", w: 15, f: MON },
      { h: "Impacto absoluto", k: "absImpact", w: 14, f: MON },
      { h: "Categor\xEDa", k: "category", w: 18 },
      { h: "# Renglones", k: "n", w: 10, f: INT }
    ]);
    for (const d of dims) for (const e of A.byDim[d].ents) ws.addRow({ ...e, varAnt: val(e.varAnt), varUlt: val(e.varUlt), dim: d });
    finish(ws);
    const pcols = [
      { h: "Dimensi\xF3n", k: "nivel", w: 14 },
      { h: "Rank", k: "rank", w: 7 },
      { h: "Entidad", k: "name", w: 36 },
      { h: "Categor\xEDa", k: "category", w: 18 },
      { h: `Ventas (${Y})`, k: "vAct", w: 15, f: MON },
      { h: `Ventas (${Y1})`, k: "vPrev", w: 15, f: MON },
      { h: "\xDAltimo A\xF1o", k: "varUlt", w: 12, f: PCT },
      { h: "A\xF1o Anterior", k: "varAnt", w: 12, f: PCT },
      { h: "Variaci\xF3n $", k: "impact", w: 15, f: MON },
      { h: "% del impacto", k: "share", w: 11, f: PCT },
      { h: "% acumulado", k: "cum", w: 11, f: PCT },
      { h: "Dentro del Pareto 80%", k: "p80", w: 11 }
    ];
    for (const [name, key] of [["Pareto ca\xEDdas", "neg"], ["Pareto crecimientos", "pos"]]) {
      ws = sheet(wb, name, pcols);
      for (const d of dims) paretoRows(ws, d, A.byDim[d][key].rows, (r) => ({ name: r.name, category: r.category, vAct: r.vAct, vPrev: r.vPrev, varUlt: val(r.varUlt), varAnt: val(r.varAnt), impact: r.impact }));
      finish(ws);
    }
    resumenSheet(wb, dims, A.byDim, ["Desc. Cliente principal", "Desc. Cliente", "Zona"].filter((m) => !dims.includes(m)));
    planSheet(wb, A.plan.map((p) => ({ ...p, extra1: p.dim })), "Dimensi\xF3n");
    notesSheet(wb, "Reglas y notas \xB7 Ventas comparativo anual", { matrix: true, rows: [
      ["A\xF1o Anterior", `% variaci\xF3n ${Y1} vs ${Y1 - 1}`],
      ["\xDAltimo A\xF1o", `% variaci\xF3n ${Y} vs ${Y1} (m\xE9trica principal)`],
      ["Impacto", "Ventas a\xF1o actual \u2212 ventas a\xF1o anterior; Pareto por impacto absoluto hasta cruzar el 80%."],
      ["Exclusiones", A.excluded.length ? `${A.excluded.length} renglones de vendedores con "Casa"/"Ocasional" en el nombre (${fmt.money(sum(A.excluded, (r) => r.vY ?? 0))}).` : "Ninguna."],
      ["No disponibles", "Cubrimiento cuota, Ventas unidades, % Variacion unidades y las dimensiones que no vienen en el archivo."]
    ] });
    return toBlob(wb);
  }
  function planSheet(wb, plan2, extraLabel, extraKey = "extra1") {
    const ws = sheet(wb, "Plan de acci\xF3n", [
      { h: "Prioridad", k: "p", w: 9 },
      { h: "Entidad", k: "entity", w: 34 },
      { h: extraLabel, k: "extra", w: 14 },
      { h: "Categor\xEDa", k: "category", w: 17 },
      { h: "% Variacion pesos", k: "varUlt", w: 12, f: PCT },
      { h: "A\xF1o Anterior", k: "varAnt", w: 12, f: PCT },
      { h: "Variaci\xF3n $", k: "impact", w: 14, f: MON },
      { h: "Impacto absoluto", k: "absImpact", w: 14, f: MON },
      { h: "Ventas actuales", k: "vAct", w: 14, f: MON },
      { h: "Cubrimiento cuota", k: "cuota", w: 13 },
      { h: "% Variacion unidades", k: "unid", w: 13 },
      { h: "Dentro del Pareto 80%", k: "p80", w: 11 },
      { h: "Diagn\xF3stico (basado en datos)", k: "diag", w: 60 },
      { h: "Soluciones recomendadas", k: "sol", w: 90 }
    ]);
    plan2.forEach((x, i) => {
      const row = ws.addRow({
        p: i + 1,
        entity: x.entity,
        extra: x[extraKey],
        category: x.category,
        varUlt: val(x.varUlt),
        varAnt: val(x.varAnt),
        impact: x.impact,
        absImpact: x.absImpact,
        vAct: x.vAct,
        cuota: "No disponible",
        unid: "No disponible",
        p80: x.inPareto ? "S\xED" : "No",
        diag: x.diag,
        sol: x.solutions.map((s, k) => `${k + 1}. ${s}`).join("\n")
      });
      row.height = 15 * Math.max(4, x.solutions.length + 2);
    });
    wrapCols(ws, ["entity", "diag", "sol"]);
    finish(ws);
  }
  async function excelVentasFamilia(B) {
    const wb = new (X()).Workbook();
    wb.creator = "GAFI Analizador";
    const L = B.lab;
    let ws = sheet(wb, "Datos depurados", [
      { h: "Fila origen", k: "fila", w: 9 },
      { h: "Grupo familia", k: "grupo", w: 14 },
      { h: "Familia", k: "familia", w: 32 },
      { h: "Venta periodo Ant.", k: "pAnt", w: 14, f: MON },
      { h: "Venta periodo Act.", k: "pAct", w: 14, f: MON },
      { h: "Venta trimestre Ant.", k: "tAnt", w: 14, f: MON },
      { h: "Venta trimestre Act.", k: "tAct", w: 14, f: MON },
      { h: "% Periodo (recalc.)", k: "vp", w: 12, f: PCT },
      { h: "% Trimestre (recalc.)", k: "vt", w: 12, f: PCT },
      { h: "Variaci\xF3n $ periodo", k: "dp", w: 14, f: MON },
      { h: "Variaci\xF3n $ trimestre", k: "dt", w: 14, f: MON },
      { h: "Observaci\xF3n", k: "obs", w: 44 }
    ]);
    for (const r of B.rows) ws.addRow({
      ...r,
      pAnt: val(r.pAnt),
      pAct: val(r.pAct),
      tAnt: val(r.tAnt),
      tAct: val(r.tAct),
      vp: r.pAnt0 > 0 ? r.pAct0 / r.pAnt0 - 1 : null,
      vt: r.tAnt0 > 0 ? r.tAct0 / r.tAnt0 - 1 : null,
      dp: r.pAct0 - r.pAnt0,
      dt: r.tAct0 - r.tAnt0,
      obs: r.obs || null
    });
    finish(ws);
    ws = sheet(wb, "Clasificaci\xF3n", [
      { h: "Dimensi\xF3n", k: "dim", w: 14 },
      { h: "Entidad", k: "name", w: 34 },
      { h: "Grupo familia", k: "grupo", w: 13 },
      { h: "Venta periodo Ant.", k: "pAnt", w: 14, f: MON },
      { h: "Venta periodo Act.", k: "pAct", w: 14, f: MON },
      { h: "Venta trimestre Ant.", k: "tAnt", w: 14, f: MON },
      { h: "Venta trimestre Act.", k: "tAct", w: 14, f: MON },
      { h: `A\xF1o Anterior = % ${L.ant}`, k: "varAnt", w: 13, f: PCT },
      { h: `\xDAltimo A\xF1o = % ${L.ult}`, k: "varUlt", w: 13, f: PCT },
      { h: `Variaci\xF3n $ ${L.ult.toLowerCase()}`, k: "impact", w: 14, f: MON },
      { h: `Variaci\xF3n $ ${L.ant.toLowerCase()}`, k: "impactAlt", w: 14, f: MON },
      { h: "Categor\xEDa", k: "category", w: 18 }
    ]);
    for (const d of ["Grupo familia", "Familia"]) for (const e of B.byDim[d].ents) ws.addRow({ ...e, dim: d, varAnt: val(e.varAnt), varUlt: val(e.varUlt) });
    finish(ws);
    const pcols = [
      { h: "Dimensi\xF3n", k: "nivel", w: 16 },
      { h: "Rank", k: "rank", w: 7 },
      { h: "Entidad", k: "name", w: 34 },
      { h: "Categor\xEDa", k: "category", w: 18 },
      { h: `Venta ${L.ult.toLowerCase()} Act.`, k: "vAct", w: 14, f: MON },
      { h: `Venta ${L.ult.toLowerCase()} Ant.`, k: "vPrev", w: 14, f: MON },
      { h: `% ${L.ult}`, k: "varUlt", w: 11, f: PCT },
      { h: `% ${L.ant}`, k: "varAnt", w: 11, f: PCT },
      { h: "Variaci\xF3n $", k: "impact", w: 14, f: MON },
      { h: "% del impacto", k: "share", w: 11, f: PCT },
      { h: "% acumulado", k: "cum", w: 11, f: PCT },
      { h: "Dentro del Pareto 80%", k: "p80", w: 11 }
    ];
    const map = (r) => ({ name: r.name, category: r.category, vAct: r.vAct, vPrev: r.vPrev, varUlt: val(r.varUlt), varAnt: val(r.varAnt), impact: r.impact });
    for (const [name, key] of [["Pareto ca\xEDdas", "neg"], ["Pareto crecimientos", "pos"]]) {
      ws = sheet(wb, name, pcols);
      for (const d of ["Grupo familia", "Familia"]) paretoRows(ws, d, B.byDim[d][key].rows, map);
      finish(ws);
    }
    ws = sheet(wb, `Pareto ca\xEDdas ${L.ant.toLowerCase()}`, pcols);
    paretoRows(ws, `Familia (${L.ant.toLowerCase()})`, B.byDim.Familia.alt.rows, (r) => ({ ...map(r), impact: r.impact }));
    finish(ws);
    resumenSheet(wb, ["Familia", "Grupo familia"], B.byDim, ["Desc. Cliente principal", "Desc. Cliente", "Zona", "Vendedor"]);
    planSheet(wb, B.plan, "Grupo familia", "grupo");
    notesSheet(wb, "Reglas y notas \xB7 Ventas por familia", { matrix: true, rows: [
      ["Supuesto clave", `"\xDAltimo A\xF1o" = % ${L.ult} actual vs anterior (m\xE9trica principal y base del Pareto). "A\xF1o Anterior" = % ${L.ant}.`],
      ["Porcentajes", "Recalculados desde los pesos; el archivo los trae redondeados a enteros."],
      ["Consolidados", B.dupNames.length ? `Familias repetidas en dos grupos, sumadas por nombre: ${B.dupNames.join(", ")}.` : "Ninguno."],
      ["No disponibles", "Vendedor, cliente, zona, cubrimiento de cuota y unidades."]
    ] });
    return toBlob(wb);
  }
  async function excelVentasClientes(C) {
    const wb = new (X()).Workbook();
    wb.creator = "GAFI Analizador";
    const U = fmt.money(C.umbral);
    let ws = sheet(wb, "Resumen por vendedor", [
      { h: "Vendedor", k: "name", w: 32 },
      { h: "Clientes activos", k: "clientes", w: 10, f: INT },
      { h: `Clientes > ${U}/mes`, k: "arriba", w: 11, f: INT },
      { h: `% clientes > ${U}`, k: "pctArriba", w: 10, f: PCT },
      { h: `Clientes \u2264 ${U}/mes`, k: "menor", w: 11, f: INT },
      { h: `Cerca del umbral (${fmt.money(C.cerca)}\u2013${U})`, k: "cerca", w: 11, f: INT },
      { h: "Ventas pesos", k: "venta", w: 15, f: MON },
      { h: `Venta de clientes > ${U}`, k: "ventaArriba", w: 15, f: MON },
      { h: `% venta de clientes > ${U}`, k: "pctVentaArriba", w: 11, f: PCT },
      { h: "Promedio mensual por cliente", k: "prom", w: 13, f: MON },
      { h: "Clientes nuevos", k: "nuevos", w: 9, f: INT },
      { h: "Crecen > 10%", k: "crecen", w: 9, f: INT },
      { h: "Estables \xB110%", k: "estables", w: 9, f: INT },
      { h: "Caen > 10%", k: "caen", w: 9, f: INT },
      { h: "Subieron de nivel", k: "subieron", w: 9, f: INT },
      { h: "Bajaron de nivel", k: "bajaron", w: 9, f: INT },
      { h: `Clientes > ${U} a\xF1o anterior`, k: "arriba25", w: 11, f: INT },
      { h: "P\xFAblico en general (cuentas)", k: "publico", w: 10, f: INT },
      { h: "Venta P\xFAblico en general", k: "ventaPublico", w: 14, f: MON },
      { h: "Ventas a\xF1o anterior", k: "vPrev", w: 15, f: MON },
      { h: "% Variacion pesos", k: "varV", w: 10, f: PCT },
      { h: "Variaci\xF3n $", k: "impact", w: 14, f: MON },
      { h: "Venta a\xF1o anterior de clientes sin compra (est.)", k: "perdidos", w: 16, f: MON }
    ]);
    for (const v of C.vend) ws.addRow({ ...v, menor: v.clientes - v.arriba, varV: val(v.varV) });
    const T = C.T;
    const tr = ws.addRow({
      name: "Total",
      clientes: T.clientes,
      arriba: T.arriba,
      pctArriba: T.pctArriba,
      menor: T.clientes - T.arriba,
      cerca: T.cerca,
      venta: T.venta,
      ventaArriba: T.ventaArriba,
      pctVentaArriba: T.pctVentaArriba,
      prom: T.ventaActiva / T.clientes / C.meses,
      nuevos: T.nuevos,
      crecen: sum(C.vend, (v) => v.crecen),
      estables: sum(C.vend, (v) => v.estables),
      caen: sum(C.vend, (v) => v.caen),
      subieron: T.subieron,
      bajaron: T.bajaron,
      arriba25: T.arriba25,
      publico: T.publico,
      ventaPublico: T.ventaPublico,
      vPrev: T.vPrev,
      varV: T.var,
      impact: T.venta - T.vPrev,
      perdidos: T.perdidos
    });
    tr.eachCell((c) => {
      c.font = { name: FONT, size: 10, bold: true };
      c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEEF2F7" } };
    });
    ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: C.vend.length + 1, column: ws.columnCount } };
    ws = sheet(wb, "Datos depurados", [
      { h: "Fila origen", k: "fila", w: 9 },
      { h: "Vendedor", k: "vend", w: 30 },
      { h: "Desc. Cliente principal", k: "cli", w: 40 },
      { h: "P\xFAblico en general", k: "pub", w: 9 },
      { h: "Ventas pesos", k: "v", w: 14, f: MON },
      { h: "% Variacion pesos", k: "var", w: 11, f: PCT },
      { h: "Ventas a\xF1o anterior (calc.)", k: "vPrev", w: 14, f: MON },
      { h: "Variaci\xF3n $", k: "impact", w: 14, f: MON },
      { h: "Promedio mensual", k: "prom", w: 13, f: MON },
      { h: "Cliente activo", k: "act", w: 8 },
      { h: `> ${U}/mes`, k: "arr", w: 8 },
      { h: "Segmento mensual", k: "seg", w: 16 },
      { h: "Tendencia", k: "tend", w: 20 },
      { h: "Cerca del umbral", k: "cer", w: 9 },
      { h: "Movimiento vs umbral", k: "mov", w: 22 }
    ]);
    for (const c of [...C.clients].sort((a, b) => a.vend.localeCompare(b.vend) || b.v - a.v)) ws.addRow({ ...c, var: val(c.var), pub: c.publico ? "S\xED" : "No", act: c.activo ? "S\xED" : "No", arr: c.arriba ? "S\xED" : "No", cer: c.cerca ? "S\xED" : "No" });
    finish(ws);
    ws = sheet(wb, "Clasificaci\xF3n", [
      { h: "Vendedor", k: "name", w: 32 },
      ...C.segRows.map((s) => ({ h: s.key, k: s.key, w: 11, f: INT })),
      { h: "Total activos", k: "tot", w: 10, f: INT },
      { h: "Nuevos", k: "nuevos", w: 10, f: INT },
      { h: "Crecen > 10%", k: "crecen", w: 10, f: INT },
      { h: "Estables \xB110%", k: "estables", w: 10, f: INT },
      { h: "Caen > 10%", k: "caen", w: 10, f: INT }
    ]);
    for (const v of C.vend) ws.addRow({ name: v.name, ...Object.fromEntries(C.segRows.map((s) => [s.key, C.clients.filter((c) => c.vend === v.name && c.seg === s.key).length])), tot: v.clientes, nuevos: v.nuevos, crecen: v.crecen, estables: v.estables, caen: v.caen });
    finish(ws);
    const pcols = [
      { h: "Nivel", k: "nivel", w: 10 },
      { h: "Rank", k: "rank", w: 7 },
      { h: "Vendedor", k: "vend", w: 30 },
      { h: "Cliente", k: "cli", w: 40 },
      { h: "Ventas pesos", k: "v", w: 14, f: MON },
      { h: "Ventas a\xF1o anterior", k: "vPrev", w: 14, f: MON },
      { h: "% Variacion pesos", k: "var", w: 11, f: PCT },
      { h: "Variaci\xF3n $", k: "impact", w: 14, f: MON },
      { h: "% del impacto", k: "share", w: 11, f: PCT },
      { h: "% acumulado", k: "cum", w: 11, f: PCT },
      { h: "Dentro del Pareto 80%", k: "p80", w: 11 }
    ];
    for (const [name, cv, vv] of [["Pareto ca\xEDdas", C.cneg, C.vneg], ["Pareto crecimientos", C.cpos, C.vpos]]) {
      ws = sheet(wb, name, pcols);
      paretoRows(ws, "Vendedor", vv.rows, (r) => ({ vend: r.name, cli: "(total vendedor)", v: r.venta, vPrev: r.vPrev, var: val(r.varV), impact: r.impact }));
      paretoRows(ws, "Cliente", cv.rows, (r) => ({ vend: r.vend, cli: r.cli, v: r.v, vPrev: r.vPrev, var: val(r.var), impact: r.impact }));
      finish(ws);
    }
    ws = sheet(wb, "Plan de acci\xF3n", [
      { h: "Prioridad", k: "p", w: 9 },
      { h: "Tipo", k: "tipo", w: 10 },
      { h: "Entidad", k: "entity", w: 36 },
      { h: "Vendedor", k: "vendedor", w: 28 },
      { h: "Severidad", k: "severidad", w: 16 },
      { h: "% Variacion pesos", k: "varUlt", w: 11, f: PCT },
      { h: "Variaci\xF3n $", k: "impact", w: 14, f: MON },
      { h: "Ventas pesos", k: "vAct", w: 14, f: MON },
      { h: "Cubrimiento cuota", k: "cuota", w: 12 },
      { h: "% Variacion unidades", k: "unid", w: 12 },
      { h: "Diagn\xF3stico (basado en datos)", k: "diag", w: 60 },
      { h: "Soluciones recomendadas", k: "sol", w: 90 }
    ]);
    C.plan.forEach((x, i) => {
      const r = ws.addRow({ ...x, p: i + 1, varUlt: val(x.varUlt), cuota: "No disponible", unid: "No disponible", sol: x.solutions.map((s, k) => `${k + 1}. ${s}`).join("\n") });
      r.height = 15 * Math.max(4, x.solutions.length + 2);
    });
    wrapCols(ws, ["entity", "diag", "sol"]);
    finish(ws);
    ws = sheet(wb, "Excluidos", [
      { h: "Fila origen", k: "fila", w: 9 },
      { h: "Vendedor", k: "vend", w: 24 },
      { h: "Desc. Cliente principal", k: "cli", w: 40 },
      { h: "Ventas pesos", k: "vY", w: 14, f: MON },
      { h: "% Variacion pesos", k: "varY", w: 11, f: PCT },
      { h: "Motivo", k: "m", w: 44 }
    ]);
    for (const r of C.excluded) ws.addRow({ ...r, vY: val(r.vY), varY: val(r.varY), m: 'Vendedor con "Casa"/"Ocasional" en el nombre' });
    finish(ws);
    notesSheet(wb, "Par\xE1metros y reglas \xB7 Clientes por vendedor", { rows: [
      ["Umbral mensual", `${U} (promedio mensual = venta / ${C.meses} meses)`],
      ["Cerca del umbral", `${fmt.money(C.cerca)} a ${U} al mes`],
      ["Cliente activo", "Venta neta > $0."],
      ["P\xFAblico en general", "Cada cuenta cuenta como 1 cliente del vendedor."],
      ["Venta a\xF1o anterior", "Por cliente: venta / (1 + % variaci\xF3n); sin % = nuevo. Clientes sin compra en el a\xF1o actual se estiman por diferencia contra el total del vendedor."],
      ["Exclusiones", 'Vendedores con "Casa" u "Ocasional" en el nombre (hoja Excluidos).']
    ] });
    return toBlob(wb);
  }
  var G = { head: "FF3B618E", title: "FF808080", gray: "FFBFBFBF", light: "FFDCE6F2", yellow: "FFFFFF00", hl: "FFFCE4D6" };
  var thin = { style: "thin", color: { argb: "FF000000" } };
  var box = { top: thin, left: thin, bottom: thin, right: thin };
  var cal = (o = {}) => ({ name: "Calibri", size: o.size || 11, bold: !!o.bold, color: o.color ? { argb: o.color } : void 0 });
  var fill = (argb) => ({ type: "pattern", pattern: "solid", fgColor: { argb } });
  async function excelCartera(R) {
    const wb = new (X()).Workbook();
    wb.creator = "GAFI Analizador";
    const set = (ws2, addr, value, st = {}) => {
      const c = ws2.getCell(addr);
      c.value = value;
      c.font = cal(st);
      c.border = st.border === false ? void 0 : box;
      if (st.fill) c.fill = fill(st.fill);
      if (st.fmt) c.numFmt = st.fmt;
      c.alignment = { horizontal: st.align || (typeof value === "string" ? "left" : "right"), vertical: "middle", wrapText: !!st.wrap };
      return c;
    };
    const L = (n) => {
      let s = "";
      n++;
      while (n) {
        const m = (n - 1) % 26;
        s = String.fromCharCode(65 + m) + s;
        n = Math.floor((n - 1) / 26);
      }
      return s;
    };
    let ws = wb.addWorksheet("Resumen");
    ws.mergeCells("A1:N1");
    set(ws, "A1", "CLIENTES CON CARTERA VENCIDA A MAS DE 15 DIAS", { bold: true, size: 12, fill: G.title, color: "FFFFFFFF", align: "center" });
    ws.mergeCells("R1:S1");
    set(ws, "R1", "Sin Autoconsumo", { bold: true, fill: G.head, color: "FFFFFFFF", align: "center" });
    set(ws, "A2", "Zona", { bold: true, fill: G.head, color: "FFFFFFFF", align: "center" });
    R.m13.forEach((m, j) => set(ws, `${L(1 + j)}2`, keyToDate(m), { bold: true, fill: G.head, color: "FFFFFFFF", align: "center", fmt: "mmm-yy" }));
    ["Cve Zona", "Zona", " > 15 d\xEDas", " % 15 dias"].forEach((h, j) => set(ws, `${L(15 + j)}2`, h, { bold: true, fill: G.head, color: "FFFFFFFF", align: "center" }));
    R.conteo.forEach((z, i) => {
      const r = 3 + i, me = z.zona === R.cedis;
      set(ws, `A${r}`, z.zona, { bold: true, align: "center", fill: me ? G.hl : void 0 });
      R.m13.forEach((m, j) => set(ws, `${L(1 + j)}${r}`, z.per[m], { align: "center", fmt: "0", fill: me ? G.hl : void 0, bold: me }));
    });
    R.ranking.forEach((z, i) => {
      const r = 3 + i, me = z.zona === R.cedis;
      set(ws, `P${r}`, i + 1, { bold: true, fill: G.light, align: "center" });
      set(ws, `Q${r}`, z.zona, { align: "center", fill: me ? G.hl : void 0, bold: me });
      set(ws, `R${r}`, Math.round(z.v15 * 100) / 100, { fmt: '"$"#,##0', fill: me ? G.hl : void 0, bold: me });
      set(ws, `S${r}`, z.pct, { fmt: "0.00%", fill: me ? G.hl : void 0, bold: me });
    });
    const tr = 3 + R.conteo.length, last = tr - 1;
    set(ws, `A${tr}`, "Total general", { bold: true, fill: G.head, color: "FFFFFFFF", align: "center" });
    R.m13.forEach((m, j) => {
      const c = L(1 + j);
      set(ws, `${c}${tr}`, { formula: `SUM(${c}3:${c}${last})`, result: sum(R.conteo, (z) => z.per[m]) }, { fill: G.head, color: "FFFFFFFF", align: "center", fmt: "0" });
    });
    ws.mergeCells(`P${tr}:Q${tr}`);
    set(ws, `P${tr}`, "Total general", { bold: true, align: "center" });
    const tv = sum(R.ranking, (z) => z.v15), ts = sum(R.ranking, (z) => z.saldo);
    set(ws, `R${tr}`, { formula: `SUM(R3:R${last})`, result: tv }, { bold: true, fmt: '"$"#,##0' });
    set(ws, `S${tr}`, ts ? tv / ts : 0, { bold: true, fmt: "0.00%" });
    ws.addConditionalFormatting({ ref: `S3:S${last}`, rules: [{ type: "cellIs", operator: "greaterThan", formulae: ["0.0351"], style: { fill: { type: "pattern", pattern: "solid", bgColor: { argb: "FFFFEB9C" } }, font: { color: { argb: "FF9C6500" } } } }] });
    ws.getColumn(1).width = 16;
    for (let j = 1; j <= 13; j++) ws.getColumn(1 + j).width = 7.4;
    ws.getColumn(15).width = 3;
    ws.getColumn(16).width = 9;
    ws.getColumn(17).width = 20;
    ws.getColumn(18).width = 14;
    ws.getColumn(19).width = 11;
    ws = wb.addWorksheet("Desplegado Clientes", { views: [{ state: "frozen", ySplit: 1 }] });
    const H = ["No", "%", "VENDEDOR", "CLIENTE", ...R.m5, "% SUMA ACUM", "% REL ACUM", "Total", "COMENTARIOS"];
    H.forEach((h, j) => set(ws, `${L(j)}1`, j >= 4 && j < 9 ? keyToDate(h) : h, { bold: true, size: 12, fill: G.head, color: "FFFFFFFF", align: "center", fmt: j >= 4 && j < 9 ? "mmm-yy" : void 0, wrap: true }));
    ws.getRow(1).height = 46.5;
    const N = R.clientes.length, lastD = N + 1, totD = N + 2;
    R.clientes.forEach((c, k) => {
      const r = k + 2, y = c.amarillo ? G.yellow : void 0;
      set(ws, `A${r}`, k === 0 ? 1 : { formula: `1+A${r - 1}`, result: k + 1 }, { fill: y, align: "center", fmt: "0" });
      set(ws, `B${r}`, { formula: `+A${r}/A$${lastD}`, result: c.pctNo }, { fill: y, fmt: "0.00%" });
      set(ws, `C${r}`, c.vend, { fill: y });
      set(ws, `D${r}`, c.cli, { fill: y });
      R.m5.forEach((m, j) => set(ws, `${L(4 + j)}${r}`, Math.round(c.hist[m] * 100) / 100, { fill: y, fmt: '"$"#,##0' }));
      set(ws, `J${r}`, { formula: `+I${r}/I$${totD}`, result: c.rel }, { fill: y, fmt: "0.00%" });
      set(ws, `K${r}`, k === 0 ? { formula: `+J${r}`, result: c.cum } : { formula: `+J${r}+K${r - 1}`, result: c.cum }, { fill: y, fmt: "0.00%" });
      set(ws, `L${r}`, { formula: `+K${r}+B${r}`, result: c.total }, { fill: y, fmt: "0.00%" });
      set(ws, `M${r}`, null, { fill: y });
    });
    ["A", "B", "C", "D"].forEach((c) => set(ws, `${c}${totD}`, null, { fill: G.head }));
    R.m5.forEach((m, j) => {
      const c = L(4 + j);
      set(ws, `${c}${totD}`, { formula: j === 4 ? `SUBTOTAL(9,${c}2:${c}${lastD})` : `SUM(${c}2:${c}${lastD})`, result: sum(R.clientes, (x) => x.hist[m]) }, { bold: true, size: 12, fill: G.head, color: "FFFFFFFF", fmt: '"$"#,##0', align: "center" });
    });
    set(ws, `J${totD}`, { formula: `SUBTOTAL(9,J2:J${lastD})`, result: 1 }, { bold: true, size: 12, fill: G.head, color: "FFFFFFFF", fmt: "0.00%", align: "center" });
    [4.5, 9.5, 34.5, 35, 11, 11, 11, 11, 11, 10, 11.8, 11.3, 42].forEach((w, j) => {
      ws.getColumn(j + 1).width = w;
    });
    ws = wb.addWorksheet("Resumen Vencimiento");
    const NV = R.left.length, lastV = NV + 2, totV = NV + 3;
    const hdr = (c, v) => set(ws, c, v, { bold: true, size: 12, fill: G.gray, align: "center" });
    ws.mergeCells("A1:A2");
    hdr("A1", "%");
    ws.mergeCells("B1:G1");
    hdr("B1", "POR VENCIMIENTO");
    ws.mergeCells("I1:I2");
    hdr("I1", "%");
    ws.mergeCells("J1:O1");
    hdr("J1", "POR CLIENTES");
    ["VENDEDOR", "CLIENTES", "VENCIDO", "% REL", "% REL ACUM", "Total"].forEach((h, j) => {
      hdr(`${L(1 + j)}2`, h);
      hdr(`${L(9 + j)}2`, h);
    });
    const DC = "'Desplegado Clientes'!";
    const side = (rows, c0, keyCol) => rows.forEach((x, k) => {
      const r = k + 3, y = x.amarillo ? G.yellow : void 0, C0 = L(c0), Cv = L(c0 + 1), Cn = L(c0 + 2), Cd = L(c0 + 3), Ce = L(c0 + 4), Cf = L(c0 + 5), Cg = L(c0 + 6);
      set(ws, `${C0}${r}`, { formula: `${k + 1}/${NV}`, result: x.pctNo }, { fill: y, fmt: "0%" });
      set(ws, `${Cv}${r}`, x.vend, { fill: y });
      set(ws, `${Cn}${r}`, { formula: `COUNTIFS(${DC}$C$2:$C$${lastD},${Cv}${r})`, result: x.n }, { size: 12, fill: y, align: "center" });
      set(ws, `${Cd}${r}`, { formula: `SUMIFS(${DC}$I$2:$I$${lastD},${DC}$C$2:$C$${lastD},${Cv}${r})`, result: Math.round(x.v * 100) / 100 }, { size: 12, fill: y, fmt: '"$"#,##0' });
      set(ws, `${Ce}${r}`, { formula: `+${keyCol === "v" ? Cd : Cn}${r}/${keyCol === "v" ? Cd : Cn}$${totV}`, result: x.rel }, { size: 12, fill: y, fmt: "0%" });
      set(ws, `${Cf}${r}`, k === 0 ? { formula: `+${Ce}${r}`, result: x.cum } : { formula: `+${Ce}${r}+${Cf}${r - 1}`, result: x.cum }, { fill: y, fmt: "0%" });
      set(ws, `${Cg}${r}`, { formula: `+${Cf}${r}+${C0}${r}`, result: x.total }, { fill: y, fmt: "0%" });
    });
    side(R.left, 0, "v");
    side(R.right, 8, "n");
    for (const [c, f, res] of [["C", "0", sum(R.left, (x) => x.n)], ["D", '"$"#,##0', sum(R.left, (x) => x.v)], ["E", "0%", 1], ["K", "0", sum(R.right, (x) => x.n)], ["L", '"$"#,##0', sum(R.right, (x) => x.v)], ["M", "0%", 1]])
      set(ws, `${c}${totV}`, { formula: `SUM(${c}3:${c}${lastV})`, result: res }, { bold: true, size: 12, fill: G.gray, fmt: f, align: "center" });
    [5.7, 33.8, 9.2, 13, 7, 13.3, 7, 3.2, 5.4, 33.8, 9.2, 13, 7, 12.5, 7].forEach((w, j) => {
      ws.getColumn(j + 1).width = w;
    });
    return toBlob(wb);
  }

  // js/ui/logo-data.js
  var LOGO_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGcAAACMCAYAAABhwre4AABR3UlEQVR42u29d3xcx3U2/JyZufduQwcIEuy9gCIpi6YlqhFWL1axDbhHthOTiR2lvE5548QB1rGd2LHj15+T2JS75cgy4MiSJYrqAK1CSiLFCoi9gCRIEH2BbffOzPn+2F0IoimxiCop8/stAeyCu7hz7pz6nOcQ/gctZia0tAhqaDCjzz10/3u0it3UlRiodlLJpSqVeRf19UNmUhDZLEgwhBBgBnzhsF9cQtlYrEdFize7ZcUHx5Wp5zGx43Ga/ReHe5ajaMdzSK9gtkRk3+jfq/7HCKWpifIbZpi5CI8/tarr+NF372nf/a7BrmOzevbuxUj3cWQG+xEBISIJYQI8KSCUA99aJDJZ6kmmkXWcqoopU64tq5mE4qlTVo6fMmlr4tctW4uKS55YcfT4fUSUBEDMDCKixkYgHsdZC4v+G8pCAGAAXF8P2dzMXLiLmbly+DePfOHYrl23OV3Hpvft2onuA/ug00mu9DzrkCESEI4joZihdADFgICAJkaGBOB5sMrjTNbnRCLJCc2ypGYyxk2bCjVhIioXXbCles6sr9KK5S0wBv/ZePu4gwk1/PlvtWSBsxMQ/Xc+LQQCCMxHjlT4L2z7m23rn/2E3bd/XN/unRAjQ6bEcdkhiOJQWCjtg4MMSEmQJAAGrA0kSbC1ua1yFIwFfJ37WTkeID1kDdm+TIq7MxkRmzSJiufPs7OWv+el6tmT/h09f38vNWxIX7R6pbNp5V0aBP5vJRxmJgBoamoiNOWei1P8Ne9CbmwUFI8zA8DBvcv33v/g3cd++9z09NbtiGbSpjTmketKQZJABjDJLDwBuErCMsBgaDZgEKSSICHBlmEDA7YMQYAgCUc5CDQjqxkyGoKIhNDXP2S7hodF6ewZiC2/CJMvu+iBindN+iuadMVuBojwX1g4zExNTU1UW1tLVVVVVFdXZ3AWF9Tc3CwbGhoMHxosG3mx9Rs7n1336a7WVni9PWZCSUxElCDYAMQMWAvFAuD8lpGAYYYxnP9AAaUUGAQYCwJAJKAEQMzQWoOAvE3yoYWFF47AkOCBZJYHSJCumURTrqkbrL368t8//CeXr91wybXh+n95dICI+L+EcBobG0VtbS21t7dTPB7XJ7/eceT5iq6e4VBIUSjdZ4sHBga4fUv7tnj81adn48rVztK7VgXctn523549v9zzdNuFR1uf4kkhxdUlEZHNDIOEhbAAZzUcKSGlA19raKEgHBeSBAgSDAFAgiCgAwOCgee4gDXQ2oc2PgAGWQPXUWDByOgsWBKIAYddSDeGzoER0+m6csatN2HBZcsaS9//wS+NcRb4HSkcZqaWlhbR0tKClpaWUde2s7Oz/PmXXppBGZ7kRrx5w8MDlyUzw5dksmmnr79fDA0Nh2bPnp+8cOEF05cvX97PzNTS0CAGri4Tq1bdFfDGR27e+eSL39re8ptZFSMZXaGEcslAsw+HgLCQEGkfFGiokIMsDAJXICsVMpahh7MWac0SCkK50JTbIjIW0lgowSCHiEJShCIhCGNhMxlYSVCOgDEGAoDJarjSBXkxnMga282CSi95D0276rp/m1Q0/2/otvnDefVr3zGudOGUEJEBYABg+/btM3ft2rUknU5ftWbNQ7edONE3oedEH8KhEIgsRtJDkJJwor8Pc+bXYur0GR/91re+NXTnnd/2QOSP/8qd5ar5J5YPbF7U0fLrn6//wU9KFsQqTAysilkgnU1DeARjGFnfoNiJwEAjbQkZj7grmbADnBYyGqZwZYVwvTDgenAjUaiQi+JoEXQ2QH93NziVBOksUpk0Rvp6bJUX5pqSciFYUyIxDMkGpcVFCEwapDWQHEEVHBELxXhX67Om70j35+THPlrDzB8mIp+Z6bVOkHoLT4poaWmhhnwAODw8XP3www/fkslk6p559tn3nejujvX39yObzUJKB8zCJoYTNhxyKRaOiKHhIbOgdqFacOHir998zTVrPv75z0eP24OWAH55zWOZy//tN1dta3nonhe/96PwRaUVhkZSMgSJkLBgwyC4GLFpGOUgoQTSrHjYZ5sVUYkZU2X19EkonjaRJ0+bvK+0PLYm5dLzwg0Fim1MGlFqBBJWj3jCl9d2d/Vc0Ln34Exx4JDIHuvGzq5uRC2bqqJyWeQKJPp74bBF2PGArAUxQNmAZpaUysNHj/r7H1lzu3LRwhuPfoSIUm+bWmtsbBQAULAPHXv3Ltz84vOf6T7e/eFsJjtuYHAAff39IMDGojEWUghtmFQoAjIWfjKBkKtMYHy5YPGiZz7z+3945apVS+Vdd20KAKDrzjurJtRff+n+bbvuenL1XVWzArZTnbCgbICicAjDA32QUsAqAkIe0iTQlUwbv6hEVtQuhpgyo3/OokXriisrfoqo3o/+o0fo5o8NvOZN1gwX9exh9/MzsH/gup7evls7nn/hkpFt7ZQ8eJBnlpQgorOk2AeCACEZAgzAykVKOEh7Dk4E6aBq2cXOzBtu+nlJ9sDnjqdPVExY+ZUDb5lwCjalcFI2b9986eaNW/7w8JHDt/uBH+3r7QMzay8UItdxBDOT1kHuTxIKGW1ADJSGPe7r7rILFywYfM9FS666+Krrtzb+67/Gxo+bNOUP2zfvxNwZ7+qzdF/b6u9NLurvt9O8qJDDKURCIQwnBuG5Cq7rIB0EQDjM248escWLFsnquvcOTJy/6K6SD9z6LSLqPtXfXn/SNTW113M8/uq0DEkJu2nTZSe2tn/p0Lrf1p1YvwGlxrcVniNcwSAmWG2QzvqQjgsrCMIL8a7EiKm5+kZ1wfVX/n3P7q/9UJdenpy56mtDb7paa25ulgWbsmPHjgXb2rd/5eGH1t4yODgo+vr64DiOjkajEoDSOkA6nYaUEkopgBm+MbAEuK5CMjlip06eLCdWVt1z8VXXb125cqXzvDHBx6RJUDxu02sevrXjnnsmO0eP6+nFMWVHhgBBGMoMQcUcaFLIaoJ2YnZXbz9NuOoaOfPmGx6oqq38+tr2X+y4kW5LcGOjQFMT8g/O2wBzypsuF9YCaCKgCURkacmSZwB6Lz/x+J8eWzj3n7c/vMbp2bnTzKyokCaZQMh1ECvxkEql4ULB8YmqhSd3Pfy4LZpY/cfzr/3CM2ubbn4ODBobpNKbEaPE43G7cePGyqNHj97RsfPl+PDwcPT48eOIRCI6FApL388SM0PKXEKRORdxExFAgIGAFgJSCusPDNDiBbVdn/vw71/U9N1v9HR0dFBzS7MlEPNTT123tbXtvud/9uPQxWWVVJJKEguLlPVBrgcpXfgBMMIOH8sENOPG60ztzdd817nppjtvvtFG/uVD31bP7t0vAOBT8W8P5veDz+qac8IqGHXmF9be0rfnxJfaf/2bxcc3vKBrqyqVMCkQNGAZImAo6wChUhw1wiSqSuSFn6xvr3kvrn3fV744uOau46lXoqzzaFuIiOPxuF2//sVrtmzd/tzTzzz3jc5DR6JDgwlTWlIOR7oqm/VJkIQSDqwhAAKCHBBJgAVgBQgECYHMSNJOnj6FKqZUt9D4ou7a2lpqbm6xYICfe3Bi966O7x55Ym1kWpEHZTQJ6cEXDANGSIZgsoShEcsH0lme+dGG/sW33Xabc8MNdzZaK9Y8hNScT/xpItrRNRzt6Bp+Za/POjlZyN0xf/tOb9M/37CuomLkfcs+ecdvptZdr/afSJqMDCNtGUoJsDGQJGD9FCocLSNdnXrwmWdrE/tLVj1017GUXf09Z2yS8HwIRsXjccvMoeaWX69+8qknH9u6devsdDptQqEQu64ntTawzBCUOy02F4QBDDDzq7aFLEMasDAsS0qLUzOXzPweM1N9fT2jpVkQEduE/sPsy+3T+dhhU+4IIbRGxgTQbOG4HrLpAPCinFDKLrzlfbTovXV/Qddc8VBzc7OMA7bwcQ0tLaZhTJz1RlbTn34nGLjiKkXXf+5waM77Gpa+//2PjFu+XO493mNJefAzPiLhCISQMNqHzQ6hJiTFvidbuWvL3g9ysnVSS9kTtpCuesPCaWxtVPF4XB8+fHjSj39y9yMbN76w8tChg8Zaa8PhkLTWkrUWRGeuKKQUCLJZU11VRZPHT/jxshnLdrU0NOSyzQ0Nlp97rvzY/qMf2vr0ei6NFpEyFhIWigmOlXDIQYYZHSe67MxbrpUXXH/NF+iqK37M377TaxhTyznfKw7Ya+58so8bG0XTHArk7Mm3jr/5yrVlC+eLwGeryUEqm4UUEkoAMAGIIIo9zxxYv3FB19OJDzY0tJi2pib5hh2C5uZm2VDXoJ98ct0V9z/w0M937941WWsdFBcXO9ZapFJpOI5zDooCDDYy7HmDixct+Hq+HsNoaREEmORw8oP9ew7O1v1DpryqVFKQAoyBq1wIY5HVAjocslXz58iJVy57ADde87XnLp4UbnnmuP9WxHSU0yLURKSb+LnP2MR1L27/zurqaaEQe4Ioo30IRXBJwlUSMUjR3b6Hza6Dq3jHcz/DwuUDDNC5nhxqbGxUDQ0N5oGHHl750uZNj23Z8tLkbDZrotGow8yw1sJ13bN/YyJorW3I86hmfPWemTMXduZuyzg3tbczM4tUZ/cHOp97gSdGY1CBhrIEAkHrAK704Fuyg55DtR+8dXf0wuI/agPkpc8fTZ8v9XXGN1lrozj+2L8PTq9b8o0pV18pTgyNsBUORNhDMsjCdV0EmQw4mRQTWdlsZ9e8dO/IVQQwWlulOMcTI+LxuF6zdu0Xd+3sWL3z5ZfdiopK63me1FojCAJorc/h1OSEEwQBSstKMH5Cza8B5HJwuc+02LR+yfDhzvf6R7qoWDkCmSxYawhJMAB8A/SOpHly3eVUMXfSN2jaDcdWMFtmxlu5iMAdbR1iwnU/T2LC4ZaJ19XdnymvoN6REZMhQIVcJEdGwFZjQlkpvOERPvDMBjaDfR/ijSsjWLHCiHNSZQ0N5sE1a7688+VdX9r18m5dVFwM388KpRTy2VY4jgPf98/FHWchIKUirhxX8mTBg6qqqiIASCaSFwzu3aNqlKM9BrlCwgQBGAQVDiFprR0KuWLckgUbUHxkDTeyaCoUgd7i1RJv8VsbGxVVfPpw1Zzqn190+0005ErKGAMpFTzXgSsEbCaDUs+TcmAQJw533Yri2+YSEZ+VcFpbW1VDQ4O5/zcPNe7auftvd+/erYtLiiUAMsbC2lzwLIQobPQZva+1FkKIUSAFCKisLBt23WwXANTXt3NdXZ1mZjfVc/Qzw4cOokg6QhkDMEPJnPpMs0av0Tz/mqsoPGXcj2j+H3ShFvR6hbk3e62Ixw0zC4iBDc6C2Q/xlIlktDVB1oeQErCMIJVEUcilsA3ssa07lOmxC8/KW2ttbVV1dXX6gQcevKOjvb1p/7792vM8aYzJB5Ry7N0/eoLOVJUVft8YY13XRUllefuiRW1dObVWm3ujPc/P6j/R+247MgzPIbJWg5nAJMCCkLHWdvoZWTxn5tFQcfqlxsZGgQa8bYIpuDdtbW2C5jYcdSdWtE5cuoj6R5JQUsECEERQQsIPsvDTSfIPHobtT3+UN650xJmqsrq6Ov3AmjWX7mjv+Ld9+/YZ5ShhraWCAM5VpxPlMgM5d5sQBD5HIhHEouEnieK2tbVVFnJc2YHBGd379rsmNWykAmkTgCmfTREKGmxis2cgOW7C9/GfDds/Vt7v5Epfb+9qa2uzzEzF80MPRGrGHzXSkcRktbEwxkIIBSuBSNiFTCSQPNG7AFUrqsSZpPobGhpM+/79Uw/s3f+r/fv3R8vKynLVWaXO+HS8xnuPCqewjM7ZwUgouj1/Ya8IMpGO9h84ABOkYWGhYXPCIQlmIKWtnLl0KSpLivciDpq96P0G74AVj8ctWloElV61j4rLWstqahAYsmAJYwksBAxZhCIeYXgE/cd6qmDnlogzyCzThg27i198+rl7Dh08ON51HWOMOW9pn985cUTCdR0IafoBoLa2lltaci/JYTNXDCVBsLCSAUkgkUsBccBIprKiZNz4bIkM72sCArS1WbxTVns7MTOVlI3rKptQg7Q2kI4HkMx5mawhCcSpNBK9fWFkTex1N7mQ8j90aOvfdh4+tDydyehQKCSJCEIIBEHwBlxNKtiY0e+ZmQURYtEIe5ISGE2xNBgigvHN1Z4fQCkBKy2kVIAlyBxAw/pZDevbo7hhRUccsGhq4neMcGprmYi4LOwdjVZVYCiTIoYEk4Qlkc8aCDhSgtMZIJkpFqdzmR999NH3dXUd/fOjR47qcDgsmRnG5LSF67rnZGvGqjNr7eh7WGtBQiAaiQSeh/6TPDplktmSGAQkgYw1YAIMA4IEHCHZUQqBpU7pOIm8UMWC5vrYOwpeVBrtEREPw9ksCRIQUgCCYNnA6ADWGFg/ALIUEa+lztrb2/nAgQOlBw523rVv/wEnHA6Lgmc2upF5L+v1VsFFttYiCIKxXhmMMVBKQesc4EZKCWZmpVztusjm3Oj60Q9wiGyUJEIs4AgJHwwNAwmA/YBdT0Ir3WW1RnN9vWypb7HJd0f0O0IohetwAxLFJTBCAiQgBEPrNMAajiRIEnkX2yf1WuosHo+bRYvedeehQ4fGW2sNEcmxhjufZjmtQ2CtHf29UCgEIcSoMHJxDSMajUJrzel0SltrnCDQXjp9ClVoGQgMJBMEcndboShFbHJITZUTatWCBQQCH8JPM2Am0NvstTWN3vlhbS1svmYXmABCMlgQLFuACNJ1AHmKOKexsVHU19fbnp6emgMH9/9FV1eXDYVCohBgnmw3zsSuFARBRPB9H1prFNSjlBLDw8MmkUhQJBpzFixYMDB16tQ/XLbs+sN5/EFhU4lBBOXACgHDFmQBBwSRQ/vlBWic3yki0tvvTo8Kx2irU1kICDBbGK2hhIJkAgcGNjC5K9a++h3hdHR0EBHx2kef+IcjR44Wl5SUsLWWztUTKyRAhRDIZrM5XJcQcF0XUkokEgkTDoflxIkTE0uXXvSVW2/54JKbbrrpB2NBIYVDSJ5j2XNh8u8twZDEAFtoaPKNDwVbDoBXxOPmnWRq2pqaRD6NIaE1wp4La4N8NZgBbRGSLqwFsloDnkiLk09NS0uL3bDhpcUH9u/7cCqVtK7rnvLUnKlwCs5D4T08z4Prukgmk5xIJOyUKVPknDlz19/6gduv/HBD/d/NnDmxs4DYKWQQ86fQwFPphA6QMcwCCpIZChYMDRYgrX245Cxg5hLKpeneMXDjFfmvw8P+BJtMoSQUttYaOI4Dqw1gAFe5sMSwQgDR4v5T2Rxu79j+peFEIhKNRo3v+6JgG87FXVZKjQoob/CRTqetMQbz5s0Ts2bP/frtt970f4mIW1tbVVtbmx17YgqbTETMxC+kQ95yaXNtGcQEEoA1GtKRwtEOB8n0NKzbsJwZj6ClRbwWUOMtXx21DADDAwMLBo8eR8xzAJsCkQQxQ0IiCBjSC6OootKgyEmJsacmHo/b48cHZ3R1Hb16KJFgIhJKKZzrySnEQwWvTCmFdDptpRBi4cKF4qJ3vfuj77/t5r/Oe32irq5Ox08NTyUAMGXFTzmTJgBKIecSMKzRsGzguArl4YgZ6jzC/f19lxCBW1D/jlFrTS0NzLzaSff2Vnft2gMn7xHkMAUSUjkYyfosYjEUlZeNAMOvqLXa2lxy8dHHH/7rkZGRiOu61lpLZ5PAPJWnxsxwHAfpdBpEZI0xYvacuYPz5s6+9aqrrvhFc3OzzAvytHcATZ91yB1fbWRRifR9zTk3nQCygDXwhKSurdvJnDh+De/993H/r+bSyPv2faUab3/nhIgDFtunrnBS/iVIJVkwS1dJGGtAQkI4LoYyPqdcB5UTq3dh3X0nRCGuaWhoMMwc7u05ccPg4CBc16WCOip8PVt7I6WElBLGGESjUU4kEjR7zpzsjNmzP3rttdf+ZvXq1U6+ps+nOYIMAG6xf6B80qTDSSgkUll2Q2FoowEBWMuAtlJ397Lu67sYeuKVN804EYomR95+Z6CtSfCPrwwNdKWv6d62LVTheSbsKejAhzUGgWFo6SCtwDSuAl4s8iJ94jvDIp9clADosSeeaPB9f7IxxkgpRaEMcK72xlqLTCYDKSVSqZSZPn06z587d+VN1129dvXqjc6qVauCM027tzY2KqqaP1wxrurnXFwMDoVsxhhY5FqSdGAQEg6qPNce3rgJqS7/ti9M2Dt076J/7Oa3t5tC1NXFNd7z+QuTO/f+0ZGNW7go7Ertp6GEhJIuSLlIS4G056FyyUKIkvCzyAHFciltALzz5V3X9/T0sOd5o3bC9/1zKjcXhOo4Dqy1OlZUpMorKv7pfe+76WcrV650Vq1aelaJuRW1OYOqaia1lc2dhVTIE33JJKQXAkQuu+tIhZJIWHRufYlPdBy8HXvXXn/kR5+c3NTY+PZ5bS0txN++08v0uku7NrwUK81krbRZMjoLWEBAgqVC98gwDzpKlk6bMghvcBMACGameDxujx5NVFpr3zswMECFoNP3/dGq5rmsfOBphRBqxvQZ21b+waf/qbm5Wa5evfrsUyoNDRYAKiORTRXTpx84mh4RMhyyJh9VCyWR9X04sFSuBO9/fF04tSv5pYlTl4p4PG6b6+vlW39qGnNt9ZPrpna/tPPvjm/ewsWuEpINYuEwyFhASFipMJDK2JIZ07hycvU9+OE3DjAzibxKw/r1T9RLKccRkZZSUsHWhEKhN2JzeGBgAOXl5SOXXHHpx4louL6+nukcIvZR1XbhhYMVk2t+VT17BkiQ0UaDRV61aQOyGtXRmEi17+H9T224AOqCyw40/mlpfXOzfSubxRhMaKklBkg75Z/a0/bsODeZ5lLPIU8JpFIjuSyBtsj6ASgcogXvfjdFJ9AjlOugINHT08MA0N/fN+PgwUNcWloK3/cRBAGUUqPJynNxBjKZjJ04caKYMm36k4vnz9+eqwicO3lCT20tM0DVNaWPzlx+SepAT68UTpgNE7I6QDjswXAAx2pUCgd7H28Th3Z0fGvaxz7nEBE3NzeLt+zYtLZJamgweOTl92959JH/O7i1w0wurxASDB1kwFZDORKGgYw2pnjyZFE6dcoTEMee4Ry02YqGhgbLzMJae8XwcILyqg5CiNGg8UxUW8ErKyQ4tdbMzKK4KJZccsGSv8uD3N/Q9TY0NBg0Nkq898anvOmzflJ9wTKRsJ4RFIYCgykNKzMITArlnqKSZNoceLS1qnP9xq+BCO0NDW9F1oC4tVVRXZ3mthdu2LV+zU+PPPqEnRGJCUf7gAkgBeCQhUsW1hPYPdxP45a92xZPnPT/aNFnB5APawQAfumll2YEQbDIWgubi8ZH0/yFhOXpbMvYTLUxBoHWtqi4iKqrq1qXLFmwo9B9cB4u3hKAmnET7p94+YqRYxpi2LfsOA6UsBDIJUNJZ1Ed8aTeudscfeKpTx3/j+YfNG3cKBuIBOdjq/wxJ5wngTU2XqkAMP6mzuHNT9/evr7134488mB0kiJEggx5igAhwJYgpEKGDPopMOMvvECUzJvzgKqre4Sbm2WB/kUAwOHDh5cEQRCSUhkpBJ2L+6y1RgG35vs+pBDkuZ6ZOXPWNwFQIcg9H1DXjatXK1y9orV07vQfVb97sei12nI4BpMBYtqDGNFQmuEajcmxqOx/+hlz6Nf3/X7fvvbm5uRj1dTQYJ65/2tFAHD9n9zgXrRq1TnDkq+/++7iOx5qHr9x42qnrW1d7skftn3k0NMb7t17X8v0onTChl0jAuEjkU7BMOC4xchaF4MQvGt4kCZffnEwcWr5L4jIYEz9SgBAMjk85UTPCXgnVTYL35/u5BRUX8F1JiLruq6orKzqqq6uXg+AG/Le1vlYS1etCpoaYUvLkv829eorDmXHVYiDg0NWukVAIBF1InBdB8bPwB/sxuyymBx4foPpuPve23b/eNsDvOOxP77U2xb79vWzvLXfecTfeNcEcy7qjplp7cc/npyWGY4sXbrKPPucq03bb36y+9eP/nD7Pfc643XGOtmEgJ9AUdSFqxSMIYyks+DiUhzV1s665hpRtnjud3Hipw9sXLnSGWuTC3fM7Ew6A6nk7wjkTE9QAUbreR6CILCe54lJkyc+OGfOnGyh5H0+FfuX4rBx3LGHtz7cOOG9l/9k+49/yVUhycWeQ4IYqWwKjiuhIKBTg5heEpG92182L3fsXjpy6OYLZ6y4demfrG364mPXfqB/st0aWkDUN6ru2tt5FH9ABIzdg6YmQm0tob290JdjAOzn9S9e07Vl8z+0f6/5Pcdfet5OCCkSJiMcxyIChexgPyKREvgMUMjDvpERk62pkTOvvmpP5Q3j/5aoxQD0qj1SRIR0OjvLGA2p3NHy87ng0Qpla2OMUMpBUbT04dy1Vp13I8yrVzqtXRO4ZfGNP7/6ifunOiM63vXQY8aNSplM9MP1FKAIggFkAshAYnysSIYZZvcvH5CpzuN3OBu2XHPpH3+xLTpx/Hd4+FZDdQ2DeAXPhJPLFic3WDFzEX775IcGOrtWbf753UsGXtiobOdRM7OyTCobIGkAJ+yBDOA5IWRSWchwBH1B2naxFpfceuvw+KkT/oqobqTxyitVfN26V12jstZG7rprdU0QBBDSIWstpJSjaqqQkT6TcnS+PMBSShGJhP1hf2RPPrt0/iFKZQO2buVq2whQw9W3fWnwgQc51dv/pYPPPGGmlkalsQwTaHAQIOKEYC0hYIuQdOTiskru3riduzdtrsns2vVRNW/GB+csWXzA/Pahx4UXeQiLLtmLUGgAQFIombXauAAcACEgU4pNW6f2HTnyBy99+1t11HlofPqlzeju2IspJSV2woQq6Q8PA5KhhITxAaMtHDgIR6M44afsYT3CV33uszRp+cWfomWX3Z93AjQaG8WkjoR3pOVbaQCg559/fs7GjS9u27ZthxeORF91cs5GpRViG9/32VpLS5ZcODKuatLc2267tuv1iBDeeLAH2rR6pbpo5dV2/09T/97z6JqVQy9sCCpCMaeIJESgISiHcUszg6QAaYIKh5EIfHsiNQKORoRXUY5QZTmilZWIVFWbopLS7pKi4n4RclPpZDqczfiezmajfX29E3RPr8j09iDZ2wvd18NF1nJFUTEJo0kGGkoQAjYIhICVCmEtwRkLLaQ5pDTN+tTtYtbt132a5lzx44Lbnb8aWlDf5HS0xH0AUH19x0NaGy/vpOGNwGvz/4eVUhQOh7puvfWaPrwFWGSs+n7A9+xSM773ib8oi94yezdz3eHnNukZpZUyJAISFCCjsxAOIeQqDCUG4cCi0guJsPTgwOV0Vzcn9u3lhBCUDIVlXyhSQ65XkzEWqeQIXKFQGgnDpJIwqSRL37dTS0oEhCSWkiQHCGwAJgtSDkioHMGRULBOCMlsYLq1los//QmuvHHxn9OcK37CjSxQN9bOEHe0YLQ1Q0kZsjmtxCLXZ3322YCxNR8hBCvlgATtIqLsm3lqxp4f+u1vdesfrkuv+NnTH5hLH/rH2KTZq/Y//Dgqs4EpizpSKQvOZiAsY1wkCgosOJNGeSiKRMYnVzJVl8Zy/aokOMimYTNpdgLDMcskhYZjA3KkgFsSJbJhCcsILGChYAMLZQEHAhxYZNlCSgeBEOgcTmg5abK68LZbd1YvmhGnC268l+vrJcXpdZ0kFQSBZ60RfC6txKcAo1tr2VoDQHXnOdIkAP0WZBnx75+r57qplw8B+ENe99wO7Tr/3PnEk6F0csgUCxKV4RgFiWFIkesbTQca4QhBsUTGMmAASQKuJVKGoIQiUg4KWkWbAGwtJCQYhMAakHRBLKF9H65S+eosEIoWYdBos6+/n8IXXKDeddut66sXTl9Fy6/Zzo2Nik7BjvU7wrHWijfa9HUqVUiMNACsWLEC8bGez5uZna+vx5W/vrH4c/c8PExXLv9X3rZpfensyd/Z/diTlxze8CISJjBTyyqFEpKGRxIwEQep7AiUVHBkGIH2IaUCsYBgA5njjgK0hSVAsgNLQBAwWAhoJgilwJYBqQDXhZUSI6ms7T0xRFxdKed97CZMuvyi/690We3fUdX8YWaWRKTPmIBV5BChv+PSn005ml5ByeRSPzCht7x2Qg1mHTC4DgA3N0tadNEmZr6yrLLyb7sXLbqze8vm8qeffg5VgJk+vpokW3LZUJDJQFkFRzgQFgBZWBgEYBgQrA1ym0QE4UhYzSDKMY74xodyJWLhInt8YIgPDAyJ8ukzRPEVl2LcvHkbpy9a9A088d1Hmm5qSa5cvdohoqC5uVm2t7fz6dJZqmBWic4dYTM2S2CMLrxP8ZhC3tsgpwaTz4JrAE3Mvd+veuipfw7NmXMzDh0qOrhtG5JdRzChtMgUeS6EVII0SFubQ/QIQCqGNgZGAY7MdzM4ChxYWBIIjLG+Yj4x3AczkpDVU2dh2uWXIbpwQcfCpRd+DZdd+YsmIo4DmhlEa38tziYgV5FIJCuEhLVm1CV+lXo6w9TNmA4OobUGrJnHzIqI9FvjFJzyxrEggP++URBVHgXwUe4+NNPftP2zO+fOfa/f3TvfZlLets0vgY6fQIW1tjgc4ajnsWDBnNGk/YCkkjBKctYEyKYyGA4CkTGGAggRnT8XpQuuBbvhfVMWXnBw3MTxLbjqqu8TkWVAfonIsLXU0tIi0NCQbcAjaF3berWfSfZed/vNW16Xb23u3Ln9e/bsGSISJZyTCp1NjHNy54AQgoIgQCqdmdG2aVMpgN63F/ryCi8AkWCqnroPwOeFkDCbd77rROe+j4UWLH6X29+3pMwGpSM9PRjq7UNqaAikDVwl4WuNNAk40QjCkQjKyssQq6pEVqmDw+XjXpg8b+G6ytolLVRT3FP4SG5kQXEyjX//96M8c8ws1zy49k+O9R7/F2P8/wTwwZbXwdapSZMmHXccZ5fjOsustVzoIzybfs7fjYsYJ050hyafGBwHoLepqYnegDN4vk4RAyBubCTU1lJTQwPT4tkvAXiJV94cwaq/mgX2pkT7e6e5qewknU67TjJZFHacau1rP0t2gIqLkioU6S313IPh8rIjmFTVQRNmnRjLyltgnWpEExX6aAFg3brn3vWzn/3Hdzra25cLIn7Pey7eflq1RkT67p/97BBbXkYy10N6LjZnzOkhACadTjukaCGAl1esWCHOUy3nDZ8jise5cHc3NTYqHDtGbbt2+XUXXbENwLazfcPm+npZX18P1NdbIrLNtbWyvr4e8XjcxONxu+nll2sOvbzrL59/Yf0fHz9+TA32DQRzZ812yopiO86MLp/4UE6VvbLX56ra8nYHyWQSg/197wPQ3PZOav8bm1kYE2twY6NAbS21tbdTUU0NAcBwVxeviDeZpsYmaqqtpU0DA+KiOXMY+dJ+S0sL2hcsYADUno/nCsa+q79/6obn1390wzO//fOuziNVPSd6UVxUZKLRqPJcV5dGKw4Ar+4/OqVwjOFdJSXF3D+YgCAJGlPZPJ2ATn6diCClFKlUCj09PTeuX7+++pJLLul+u5yCsyninYJChlY0NlETgKb2dm5qajItLS1UVVVFPT093L5gwavcYcdx0Pr009fu7zzwoV+1/PK27hPd5ceOdsFTronFYgKWKfB9IhbHFl2y6MDpaMQUABRFIscqKiupt28AcNSr2gLPRDiF2Kbg6eXRO7a3t7fcWrsUwMN5lI/Gf53F8Xic46/uij7V9Yc2vLjh2pc7Xq4bHB5evmHD+mVd3cfQ29uLcCRiotGoML6WYIa21oYjERSXlIwASJ6RWqudM6fjRH//oB/4JY5SrByHCsUzKeWrgszXszmF76218DyPU6kUduzY8VkAa1asWGH+CwmGuLGRUnfeWcMhaygjRDablXsPHqxOplLVxlDtQP/ABYc7Dxf989e/MVu6an5vbx9O9PbAWMPRaMyWl5QLrbWUJKFcCR1oaGNQWlSMkoqSF4nIH0O3eWrhNDY2inlLlhy466672l3HvVQIYay1ox3T5wJizzdMyeFEgo8fP371tm3bFhHRG4ZG4S3ivY7H4/aeGbN+dPSHP7w96wdZx1GuIKEkqViOOp/hZ7LoH+jHcHIEmrUNR8K2JFYsIITQWksTGDByGG4eg54VSqK4rPjBM03fFFr7NlVUVFw6MjLChQJbKBQ6p3b2gjpUjmOTyaT74osvfhnALeeTtvLNwjUTkX1u49Z3bdr4/Cc3d7yMaDgKqRSCwIc1zMRgKQV7yuNQOExFZSUEYwXIinziN7ehedoUZobm3GEkIaRynOT4qVO3nM4ZGMt9wxMnTmktKytDKpUUBWz02Ero2S5jLDzPk0NDCdPT0/O+xx57rJ6IDDPLd6QeI0JTUxOYmXbu2nHXrt27UFVZaaLFEXZcwbGiKFdUllNZZbmIFcUkuUJltC/9QAubH05hjQXb3AMMsMm3wCgFpaSVUqKmZsKu2lmz9uWD/dfdXBHP907eeON1jwohO7XWQkppiQjZbPYNXWzg+wiFXOrq6uLdu3d/fXBwsLypqYlf1Vb4Dlnf+973nHg8btesfeDPeroOXxSMDBoXRpIfELI+UeBTkBqBziZhTRaSDJTIjcOxzLAMWCaABYgFJCkw54iHCEA2k2HP8zCuesJ/EBE3NjbKM5rSVF9fL4koHYlG11VUVHI6nbZjyYLObeUwBURC+L5vjhw5Mu3+++//f/F43NbU1EjgnTMeprm5Wa5atSrYdWDX/F279v3Tnl27TbSoSBjNEEyIRqJgBijfT0dCgAm5pCgMQDmaFyElSFCuFC5eAcloozmTyaji4mJdUlT6GHKFLnsmwkFzczMAYOasWQ9MmDCBksmkAACl1Kuous5Of1PeIFpEo1HV29ur9+3b94n777///6xatSpobW19R6i3Rm4U+bxX7JFHHv/PA51HXOWGKdBMTAK+scj6BkQOIBQYEoYFNAuwcAGhYCiP0Ml/tXmQJSinQYy2HA6Hefq0aXtXrFi+Mzecic5MOAXdd3XdFQ8GfrDHdZRwXccKAvxsBoLOTa1pYwAIWMsoKSmVR4522e072v/pgQfXfL6urk43NzfLt7Pjub6+XsYpbplZ3PXDH/7o5Y6d8622JhKJCSkUhFS5/qIxmXdmBlkGMSBFjgOB2IDZjj6Q/1mIApZPses65Djuj4hINzY2qjMdPpfPXjQqIvKnTp30q+rqcRgZTljXUSBRyALQWaeDlcxlG7Rh+IGm4pJS6jx8RO3bu/cbv3lo7d81NDSYpqYmejtsUGtrq2ppaTHM7H73u99ds7P95XqyZBwppQ5yGAtrDCzn6zusc1gFyhUmVY6QArAmvzM85pHb2VzPKjidzsiamgkDoZBzb34j7VmNBcunVwQzF3/1q1/d0tnZOTkajbIQJILAnDWRbgEqZa2FMSbHBJtzyzmZTNqFCxfKOXPn/+MtN1//BWttgThcv1VDlRoaGsyGDRsm7dy58/s7duy4fnAoYaLRImmtGY3vzpZx8Xc/y0IKMplMRi5ffln8E5/4WNNZFdvGptTzjsHAL3/5ywdSqdSdAwMDJhIJCyHEKxTmZ9kTOlZYoVAIqVSKysvLxfbt200ymfybu+++Z+6MGQs+e8kli7oL7SdvVqA6dgDGI488cv3GjRu/v3fvvknGaFNcXCyDQJ81P+nr4E2glMLIcIJmzpwFz3NaAdDpYptTqbXCHx8wM11yySVfi0QiIwDJXKu8PueG3QKVyvDwMJRScF0XIyMjVFFRITs7O82WrVvev/GlZ59/6KG1t4Jgicg2NjaK82WPmJny7fTU0NBgBgcHy3/1q19966WXXlq7Z8+eSczWMLMs0L6cR+piWGNMUVGRqK4ed++HPvShdY2NjXQ2N546uSCVP3ZHf/nLX/4skRj+7PBwwjiOK8+11d33fUgpUVJSgp6eHhQXF8NxHBhjkLtbA7N7166pgwMD99999z3/OWPOrK9cumzZ5rF3e1VVFbW1tdmmXCHrdTO5eYFSW1ubaGtrK4whNq7r4pe//NWqe+/95d8dOnRwUn//gM2zWEnHcaANn/K0nJNKy2VHuLe3h2oXzA9mzZr1NWbG2bbB0KlyS01NTbxr166KJ554oqOjvb0iFA7D2FefsjPVxWOx19lsFkKIV1GuMDOUknZ4eBixWJGYOm2aX1JS/FxNVeWPr7vxxl+dYmwWFdoHC1zTPT09nEez/A78rrc3Oam19ZHP9fT03NDb27v48OEjcBxlwuGwzGazUMoBs32VR3aqVNTZbqqx1lRUlsuZU6f++BN33PHpc+m0oNdjKfzNb9b84Y7tW77befiwiUSL5FiSIdd1X7fbukB4VxBMOp1GLBYbZY5yXXfUJo3p7zHpdFq6rouJEyfAdZ19saJY28yZM19c/J7FD1ZGKk8IIfRrbVZelRZt7eiYtWfn7tu6jh6do4PgmpFksqKzsxNKSuuFPDBDeJ4HHQTgMSr45JvtXASTvxmN7/uidsH8g+9+99Ir16xZc/QULFjnPsS1ublZ1tfX48c//uGDmzZtuUEqxziOIwu8BEEQjH49na4uqDit9as8oddoYWQANpkeITCLiooKVFRWIvD9hB8E+1zXSVRUVAxFIhHfdV0jiHh4ZMQdHByMJEdSjvb1TKHUNGtsLmucSMBxHB2LxQSYhRlzQ7wRZt+TuyvGdmNksxldVTVOLbt42QduvuGG+861P4lOl6F9/vnn5zz55FM79u0/IMrKykQqlaJC5qBg8M81OXpag5pf2axPQRDIUCiEouKiHH/bmAJfEATIZLK5zLHl/N9FWikHUkrJzDSW6PU8u+ZwHGdUZQshjOd5ctbsOfev+synb7/33nvPuXHsdf/SlStXOnfddVdw3wMP/HH79vbvHDlyRIfDYVVQa6lUCqFQ6FUkqudrCSFhjQEJgut6ADNnshkOgoDzNpdf6foWUEpR3pYRM0QOvcrnxS0+nVdaUN/WWmu0FvPmL9j/gfffenFNTU1fno+Mz3U8/Wuuu+66y1x55ZXqg7ff/q/Tpk+7LxaLKWOMzlM/jtqdN+PitTYwFjCGkclkkc5kiUiKUCgiPS8sQ+GwikZjKhyOKKVcZS1kJpOVxrDIzYHLXR6RzF/m6R70hpixpJTs+74dN26cnrfwgo/X1NT0NDc3vyHcxOkce9vW1mastfTxj37kUzNnztzp+74yWptwOFwAc7wpd2Ru+qEcvTMLhaxRw80YzT4UTpDjuHnjzqOvFZyYnF08/2k8YwzC4TBGRkZ0aWmpWvKud/3fa1Zctr4wX+iNvLc6EzBePrJOPPXU0x8PAv3Ent27S0BsHUeKV+C7lN+kQmaAIASd86ka22HnOM6ofSnwHBDl1Fnh+dwUkrHPyzGvmVHHhUicNb5xrPNwMtg/z3KiS0tLnblzZ//y1vfd9M3z1aCszpQ5o7m5Wb73vZdvamt7uiGTSa09cOAAmB0rBAkigjU5ryXQAdx8Jtf3cxQt52ZoTW6qes4xQGHumxCUs0eWYa0Z3SghCEo5Y7hFNbTm0ZtEKZljpGF7liaYodQrXqm1r3SbkxBgazTAatbMGc9/8o47/uDggQOivr7eng+EqzgbapPW1la1YsXljy+6YOFHp02dIrOZtJBCWGsMiBhCMAQBqVQSShAcJd8g4xSPZoIL3wMMazWAgrByj8LzubEtYwWJUaHkTvFrPUYZql/1IJJIpzNwXS8vGILnhWAtkMlkNJjV/LlzX7jhhutvIqKRMdBfvGXCAYC6ujrd2NiobrjhhubaRYs+MmvWLD+VSgkppXEcB6lUjqm7qKgI6UwGjqPepIInvc7zb46rXOBYKJA1ZTJpXVJcrBYtXrT58ituunHSpEl9K1eudM4n7JjOtRZSV1enH3/8qZteeunF+w8fPqyEEMZ1Xen7WWhtCuREIPGWDY4/D1tBr0u65Ps+XNdFOp3WFZWVamFt7ZMXXXnph+dNnNj7ZhBhnNPOFU7QNde8d01bW9u1oVDo7p07d04EoCORqMrNn1YIhULI+v9VQJ6v3RVr8iiaUMjjkZERUzWuSi2YN+8/PvqR+k8RUZAP2M87aFK8gYE9urm5Wa5YsaL1Pe95z+ULFy58FoDq7+/XVVVVDBDSmfR5j8jfOkG9UjAreCjZbIZmzpyhFi1a+O077vj4x4koyI99tngLlfdZTz9k5tDq1atX9/X1/d6hQ4fgeZ6RUslCke7kPp7XIxI/l4TjuY6JGdthXBDK6OcT4CiHhxIJUxSLqSlTpgzPmDH9/95y8y3/Xsjev5ngfDqfSEkiwpo1a/5s165dXzp8+HBRMpk00aISAWYqTP4o0H4VKMBOTq8U4pJXtzLSG9/812jNH03xwEKOtrQbyFzO0IwMj8ip06dhxvQZG+cuWPBH77nooo1XXnmlWrdunXmzG8LofNbm841TdvPmzUu2b9/6TwcOHLru4KEj8DzXhMNhYa0lrfVoGcH3fYxNor7WqTlbqpex5BUnT7ka+/NYISlByGYzkErB8zzT29tLJSUloqamZmTmjJmrb3//7V8gIr+xsVXF43X6rXJRzuu64447Qj/96U8zQgj8+te//qsjR4/9RVfXsapjx7oQjUYNEQlrLYXD4dHUSyHVMrZV/uSOuXPt8j7Vc4WMgZRydERzEGRZKWn9rE/MLCZNmoSpU6e2LFu27AuzZ8/eO1ZDvJX+45sFCGcAfOjQoZrNWzs+fbjzwJ90dnZWJRIJCCE0EQnP84iZ6VQnZaywTp7F83rCOpkT4WQamDENXvnWfMvGaGt0IJVSqKgox/jx458eP37812+99daHxthV+1b3tao3rcU8f1FTp07tAvDljRs3/nBCTc1nuo4e/Vxvb++4wcFBpFKpQv2DhBCiMC5ZKXXKAt6ZnKBTCWZsHixvi1hKadPpNHzfl+FwRFaPr8aUqVNbx48b97Xrr7/+sTyeWYwSv75NkdebjhNramqSBUzaxo0dE7qOH/z08ePHP3bkyJH5OggwMDBQKF1rKSUJIUjK3FDzQl5t1HDnh+6djofnFSAkQwjBBLAfBNb3swSGdD0P0WgUVVVVAzNnTF9bXl7271deeeWzhc95M4LKd5xwTgXmy/8sN27ZclHnwSOfOtx5aMXQ0OC8IAgwPDyMIAiQ9X0WJIzrOlBKkRBydO/HZsIYY/8hCCkYzOz7Pnw/YGM0EZF0HBeRSBjFxcUIhSPJcVWVW8aNH/+zebNnPjpjxoxDGAMeeTtU2NsqnNcSUv658Pr1Gy84fvzoRw4fOXxBJpOZLohmWGYMDg5iZGQE1lhYtuB8NvoVcbya5lFKCeU48BwH0WgMsaIYhBCZTDrdUTOxZs/kqdOfmTlvzkPTJ0w4iDGIo9raWnq7T8pbYnPOgKzBjIU4EVEawAv5B5g5tmHDM0v7eweXHzt+fOrA4GCZEKLc87wpzFylg8DjUbkQEwlDhACAFYL6AeoSREeLS0q6x4+vOjB16oyHZ8+effCkFAs1NzeLMyEI+h9zck4HBKyrqztlcJePR2R7e3tVKpUqCYKAhBAkhDDMHIRCoaRSStfW1iaklPpUoJM8WxMBsO9UgbzjhPNaqq/Q79/Q0MCvm5k8xXU1NjbSihUrRkfQvNmplv8xwnndFnRm5Ll0XrWa8jzQp4Pr/u/63/W/63/X/67/Xf+7/nfhv623VuAkQ74vpq2tDUCOnnjT7t10UVmZRXs705sXQ9Ap6slvhAWRzqJuTWOTEq9Fx5Wva52q8PfmeJDc2PjqaU1nMEzubH7/LAJVnNzoVXjtbFsUC4Hv2UBzTvEZdKbCPpeOcTqdUNoAUZfPKPP6zdPAw/N6E6lam0iUcJAMSyncwCCJkpJsRXHJLndK2fM0bcmBsdRYb/QkFYj0xo4fewUDLUdzbedae5JS2tduY6GTAB+vlORPVcJgZqmUMmPrSsYYh4iC89mfM4qQ57a2S7qPHfvMyIHOW5N9J8rRNwi/pw8yk0HIcZFlAy6Owp0wDqGJNYnYlInPVU+pfAI1L/wbTY9n3ghLYWEzfv7zn/8VgNu0DrQx1pFSZgFOZrPZkrKy8uOxWOzPbrzxxiOn+6zC6/fdd99Mrf3vDg4OlTiOaySRr61hQp6sJi8UZhAzZwE4UsrAGFPquk7KWlae57UvXLjwzpaWFh2Px+0DDzxQPdjf/xvDbIUgzQyptdae55W4rvuDD3/4w98pUIbhXBKfzCCsukgRUcAvPbv8yI59f715zcOXj+zqKDv6cgfcwPDEaMyoZIo9BrnSBYxGVgo+YgM56Kriivlzrx9ZuuT66MyZH+S2tX9FRM/yypWK7rorOFvuMyKyvb3JiT/96eov7tmzJ+Z67iguGwAGBgawYMECTJ06ZQuAL78eFTAAFF4noqXd3T3XbNy4CWVlZZBSjjZAcU4ooxlvN98cJWVu0HfI89DT24tFFyy6dPr06d+Mx+O7kaORnPfyrl3LhoaG8pBdiyAIYK3Fsovf85fM/AMiSp/pzapOeZbqOz3+7UNf3PfUus8ffuixyNC+PZhUEtGLS8JSpzLkCq0oIuCRhPF9FIU8FAuJInaRVZJPvLzTvryzg51JUy4euvrah/jxtb+HL37+af7Zz7L0e7+X5DxY/3R/XJ5Vlx99fM0njOWYZWQB4QgpWBsLIoHKqnF2/4GDoqS07Fpm/mfglREneH0sdo/W1nheyBIJkYNBC4BEnsKmULSzsABISPiBhpSSLIT1vAiBRIZDodQr4EORtiwMCQkSksEgLxS2QRBI8O80Hp8dqLC1sVHhs/VR/ekf/uNL9z/+xRd+9OOI6OnSs8pLuQyOcjKWdNZACBcyVIyklUzhEk4byWmTQ/kro2mcUnK666mynj6z7e5fFG9a8/g9+m+/9nf4y2/kx3yfmYqrq6uzALj7+LHLDx06xJ7nqdxAcyGFEFIpKY0xjrWWhoeHL7///gdvICI0n4EzEgQsKN9ZRQTJ1koAUkopHceRjqOkUlISkQz8QLquK2OxmFRKCSWldBwlmTkUZDIlYzLnBEASQQKQOR4HlpTrO6FzFs6O5ka3Lh7XmWsbvrjxgbV/vPneX5nJXoRLYiFltCY2AlqEYGJlfNyQ3jmYslt7R2jHUIa2DQ7Tvqy2uwYGdb817IY9FAOo9AM5A7A7mn8Veantt3+M1V9dRjkUZYEu5jVndNbnZknbp5/esDgI9FX5FkeRQ+vkZFtQG9FolA8dOsT9/f3vPTe3+tXd1L7v88jIiE2n08zMbK21mUyGh4eHOQgCm0wmub+/3wJIl0bKE6di7xj1W5nPGSCp8uTXlPlanHnnb69f/93//OP2X91nlk+ZIhw/TcOZYUTCRUimJYay2vQ7QtL48WrWRUsRLqmwJpPtgysqFQKxe+uLomPji5gWOHZ6OCIkLEo8JaZPHKfXPfCfTqq64gfMPCtfuSQ0NRKaWuhUNqK+vh4tLS3Ys2/3J4eHE14sFjNaa1nAvRXAGswMz/MomUxSMp364Pr1275yycUXnDgbJ4SZ4bi5rrg86ITKy8spnU7DWgPHcYjyvxcOh0nKXMddNBqNDYwkygAcfjNCGJXT/XFqevzJmo0/ffaHR9b9NrK0usbGRtJkdQqRqIMhHaA7G5iy2vnywisuG9ZTp3yvuryqIyqiwwgXbUIwMDXwh+ZFLl04ueaFxZ87svbx0r2HDpvxJWWyJ50wXUqoS+tvw5QpVfehpckh5CYyUjxuEX+tIR4NZufOo5VPtT70wZ6eHo5Go5ROp+G6LqSUnGcHoXw3t2Bmc6zr2IQD5btuwiWLftSUo83SZ4pxy2YyABE7jkPz588fnDBx4p0jQ4l+30+T44RISmUCDthxHGUMJV1HTSaikZGBol1vFhhEcXO9RPIFJ7lx8JsDz75Y4/YNmMqKKsmpFBxHwZcKhxMJW3P5VfKCW25aWzS5rJGWXfPiSe9zEMA6boQYt+qxxyfNnvmVA2taL9224XmOzJ4mL37f9SOzli/6Bjqavk4NG/zT3dV5kIXZ3rHxikQiMckYY4lIOI4Day2KimIkRK5p2PM8+L6PaDSKVHKEgyD7SWa+G4COx+NnlD1gZsic95dzC4TsvvXmG39+Nu7+m3Jy2v7tBK346j/MOrJh//Lk7v08vbSMKNDwrYFwPBwbHrYzLrtMLGq4/Tvqxlv/TxMRdn/7Tm/2hMs12ts5X+kCWlqoLdnu1NVcu455942TRuR3hydM+ujUC6Y/OvWy+d9Kbb23/evt12WZ159W3bS0tICI4GfTNx0/fpxDoRCPbZCdPn1GWkrJPT09ESEE8jhs4ftZ6uk5cfnatU/Ov/HGq7c1NrKIx0+v2ijX2wghZQ75E2SdLVu2RHfv3h0cO3aMAGDChAkMAMeOHaMJEyZwLBajcePG2aVLlwZ4k5aqW7dOc/YL16rujgmhlG9dzxGBZchoFD1+xnqTpohpV155RN146+eJSPPq1Q6tWpUFvoNTDDw13NwsieYkuLHxE1Wf+z9fxfjyXbkBQ7mb+HQjwvJBmtm8edfEZ5596iPpdJqi0ajQWiObzepYLCZLy0p/qBz3SCwW+8dUKmUdx5HMTEo5puvYMTlz5qxrAWyrrW2hs2n60Hn+Z2LoJUuWJM8lkOcx6bc32i2hiAjHDnff3H/gIIodxWw0jJTwA4bxwhxZUIuSmknfOT7+Wre5vtnSqobg5CPd0tJC9TkrDrS0gFtbVUtPDzdMqGhvbGwUvHGjg4susgC4paWF6usbLNGp1U2BWanz2MGrjxw9EpZSGgDSGINIJEKe5xEbbiNJXZMmT6ZtW7eOMooQEWXSaRw9euSzzPztM02Z5MiRFCwzZdJpMFDz22fWfyaTzfZJKUNkLQHQLEQgmKPGIHBd6fQlhvfdfvP1z+UD2/N/cqy14V1f+2b5/h3tmO1Icgokh0LyoK9lUU2NkdXTH7LvXs5Ay8n/X56uoysej58x0iWfWLStBw6EDjz9zJ+lkslR+i/HcazWWk6aNKk7EvF+O25cVbKn78QeKeVsa60VucSbAGC7u7unPPXUby8B8HTBfp1OreU7HoiIcLizM+Zns3dlMtl8FzZGyZSMtchmsmC2GD9hQt+WLVsWLF68uOfNwa2tfaoGWT+WSQxCjasAtEHgaxijbCCVrBpfsw5H9h+c+FA8dZKOEM3NkLe+Z/O8ZEZUuOmhYmUcoaNFPgtrjARLKRnGELIg41spJWekUn44eWALLb0ldXKmoAA2fPzxtgsOHzy0JE9SJLXWcF3XGmspGov9+4033tgDAL/4RcvdVVVVX+rr6+OCs+A4DqdSKXn06JE/BfDb9oJdPIOTI5WCy4xkMomOjg47lnio0JUgpWQiQm9vL3meV5QBokR04s0RjsyMJ5iisKMgOCCjU3CdEIxv2Y2GQIK30y23pLi+XlJLixnbRXBlectn1v/miW/27D7gVXkeXLYQYBgB+NDQsAipMIQGjK8xlA3gjq/ClMVz/hXAnWhsJOSHDY1dIyMDH0smRzgIAhsOhSUAJJNJMXPWLIrGijcWfq+8uvqp6t4TTceOHaNoNJrT78winU6j+0T3ip07j1bOmzex93TeYcE26CAY7Z52HEe4roNC0JuryeQCzFAoxEopUlKx1lK8eYjPqlJfELvWaChiSKvhekBGgCwxWKC0oG5yN/qVErkim86OhGf1t232Ei9t84siEalNGgQfJCyIDQlt4GvAES7DCyHQ1u51hKqo+tQUAGjp6DiZANZ0HOmoePi+Rz4+kk4WmrGglLLWWlFRXtZee9nFTxdqI9fWXb7h0P6962Ox2KUmV0OQlAcaBn5Qvnfv1lUAvnq6ZCgzg62FyRMuWWvh+741RrMQOQ/Odd0CQxVprW02mxVCCivIpzdPOF54kIAggAXyN0E2k0WgBRMxhJR9RMTN9fUSzbDAOrupqEgmmu+sSmndW+lFOAQlpqmQ9BQhmczA84CQEDDWQoYVfA0YJpSEYmwEk/R5AABi48erwqYVNnDoROZd3d09ZelUxlaUVYjA92Gs4Vgshmwm+NX8qqrhgjsUj8ft3Xff8/2Kiorlx44dQzgcBpghHAe9vT04dKjzZgBfyTNqvG7KV0oJ5OnJtNaIRCJCaw0igus6o+3u4YgHNhCBzsJxVVjqlPfmCWfc5OOG1DERClWNaM0lyiPWDHaVSKWTkBY38EO/+AHd/JGXGUxEZC9qHRb7B477JRNtmfFEThcLBoIAAgZSEKw1MBTAJwsoFybwQfAwoboaJeUVCgCmlJePqpqCbdjbvvsvOSARckOGCNBGIwgCvuCCC7CwdlGX67ro6soWVVTAHjw4qKzMvtTX35fs7OyMlZSUcCqVonA4LPr7+jgxnFi8adO2pUS06eSuNJE3aKMPayHyM4MqKyu5unr85qHBwaTjCJAQighKSgWlyEsmM0PjJ1QVl5WU7O/o2Hv0zZqqpWjcuOGOr3+jxwvH4OqABQtYYeGFPUHJFPccPjK/dPaKCQBeLtzdbQDqVrUMdT7+e5mu4QRlBxMG2QwF2QRFy8NstE+OH4iqWBRksyA/QCRSjMEsI7AWgfSGAKCnQH7NoDjFwcxFTY1fXjg0OISSkmLh+7kaiud58tixYzBG/+M3/+Vbf/Wzu/+/UD6lL8PhiNvX1xfN81aTzaknclxXJxLD4Zd3ta8C8JnXc3cLCc8gCKzneWLy5Mmdn/70J5cTUbbQ+W2MKagvJYQIrLWj1c1oNCpfT22e+8lhRrim+tichQvBG15gUgA7BGM0YpLswY2bxLTFF17WCLTV19czA9TS1iYAIJMOfjt72cVfqJw63/OshpEBjGvgeAr9W3ci3XkI4ayGKwjZwGBIaxo3expKi7wjrwo8m1plHHX64Ycev8MyT3Acx2gdSK01PM+DMYaOHz+Ozs7OciIqF0IgCDSIcnPSlFKjHpXruvCzWYRCIdHf34fjx45fy8wlRDSUx2CfMgAV+VbE/MStoKmpzRSwA9ZaO+ZkBPnqQFBQr2fDFX22JQOaNrPq6ejkSfpEIinCoQgcQxBZH1EhRPbAPuze+tLnm47smUhE3NbaKv9P8aMS3Chm3/2Ltncvu+yq6bfd+pc1t77v9yffdvU/TrvlvT+deNuN/znnyquQyhpYm2NdsgA6hwaErK7OjCsrfQEAVuQmYVBT0wqjlML2HVvuGBwaRCjiwVESnpdjcTfGIBaLobi4mCsqKmxJSYktLi6y5eXlNhwOcyQSGd3YMUzqwnEcbY2d8sADD96R72KQr0U1bK0FmJHN+tDaiI99bKIco/XoZJBH/uvZgOvPXjjP/Xl9CNUdzdlx5VtRVS4G0r5VEAhZoAySSpl5x2OPFPc8t+Ee3v/zKXV1dfpwYkN24101sqW+3tCKpa10+ZJv0IplP7r/+1d/fYT/8q/T6aENHZu3QQTWCuUiHWiocNgEsRB1i2AHLq9rbQQEEdkClOj557dfNDKSWJJKJdhCy+GREWht8s21wmazWZvNZjmVSiEIAhRoIo0xnE6nbTabtcwM3/cRiUQKaRM6dvwYH+/pvgYAv97cOCEESAgIQSCCTSQS9hTcK4VOhbekY0Fcckm9T9P/fHDee2ofLr10KQ6lkqzYQ9gqRJlQIpVwj3Xbjv9ouezwE4O/5h1P/TVu+em7lq5aFZwced/2k5XsOP/0qfYHn/7y8NYdXGRArC2M5+HwcAJTlr0LkxYveJGIbFNzM+W9NALAW7e+8PsCpCKRkLHGwgt5o/zTnhcSebphEQqFRC4hoIQxVgAQoVBYhMNhkefTHEsyIZPJJBttrn56w9MX5zdU/k5ljAiB1qPEFVJKEQqFzr5yKQpzWs6XQ9DQYDauXhkR84e/H162qD7YuHle75C24xxXBOkklHAwq7RM9OzZZ7f84GcXyuPXXxiaMX1z969/1VYUDp0IK7cXGpRiM6nrp0cuOvjCb27qeno9akUUrhBIWAETCtljw4Ny+oK5R2Z8cEXjw9df74mGhmwhtmHmkm9881+uPXGiG0VlRSIVZOFJD0HWR3FREWbPmX1Aa+srKcj3fZGjboxoY7W0DKWkyASBjh04cGByMpkcnTNHRFBK2RMnukN7doeuA7ChkGUerVjmnQHHccB5Bl2AqKcnesbBZVMT8ryk2rA1XGhVOak1/6xL1QoAHuyakFla8ZHDfPihv0i9fOW9+375YDhcOt4G1heSFTjtY5x0RHYobV/+3t0sqysvnLao9sJsNAptLKpLynCs8xAO7dqN1IkTdlZpGcUQ0Ij1QaUl6BxJcOXlF2PWRbV3E9X0bFy50uEcYlQCMPc/1voxIcRMy2yYIYkZ1hgLWFFWVtLxqU/esbQJyNa2tNCMGQsFACxdujRgblXr13vO8uXL08xc+uV/+IfN/X1900pKS63v+yJPNiG6u7sxafKk65j5q01NTSYnOIcKEz+UlMhmMjlh5k4eeZ48i41sKmDoxFjqzMIJzjUbkzpbIihVCOY2rl7pNPzg5sebGx7+o60B371p7WOYV1VlZCIpPW3A2keR44jyoiIMJhL2xPPP25FMiow26C8pQTIxzBVFRTSlqkLaZApGSSAawuGRpPZmzVGzrrv6xcqbwl9uBuTSPESqKZdp4GMH967oPHSQi8tKoLWGhEQ2m+XysnJMnTq1jYjSjY2NoiE3X8684gLXaQA6z0E62NLS8qC2uLO3t5cBwHVduK4nMtmM7e4+fsl99913eTwefyqftwKRGOXIKVC85GpDFhMmmDO2KYVMuvBcRwhFJl96yGazOQ5sQQD4rJn6RKEgsXTVXUHztDsE9v7HbyZdX/fN6R+6LXlQWHk0m9HGCbHnuCBjIAUQ9RwRU6QmlxTJKSVFMsRGVleVKjesJENDRD0MS+bOkYSOzp6rFt5yy9Hpsyr+4WDTk24DyBQmc6yLx03b+k3zTSbzvnQyRTbPmK4cl602IhQK+RdddNF3AVB+A8Y+XsVgx8xUW1v7r8yctdbKUCjEQRAgCHwUxaK281AnhkdG3v9K0c43Y/lDRZ7RI4dPcExf37QzjlsKAbROZ1LGaC5k0gtTT5gZljlzthOGxVg0Nn3qp5m2H/xHqurm9//Fslve+6dzP/KhPe7CBWpnYoCODg+brJKcARCkfESsQEhL6JQPBxLkW2T6EtA+o3ckbfZlUlR+6TK17CMfennqhHF3tCy75eHp8W8P5jg7iZ8YGBAAeN/eHR/tOXbci3mhIDOSZjBZP9BGKIWSkpLDM2fO3AOAx3ADjHVfOf+aISLMnz9/3/jxE7Yrx7HZbNbkWTpsKpUmrbUdHBz82AsvvDADAAy4yBhjmdn6vm+DILA6CGw6nbbGMPbvbz9ry26EIWOsMcZwHrJrE4mETSaThq3xzzZQ/R0dWLcO+kjjykj7N//87nlXz19xQcMH7lt8x8dTalGt3Joaof3ZNKi4COmsQTadQUlxCVhI+IZAkRLsTaRBs+bKpX/wB90zP/iB78SyPbfQjbc82UBkeMxdfteqVcE9w/uqLdnfHx7sJ4ekUxKKCS8UEdnAqvKKSpowccJGIsrmE518mgqqJCIzc9asf508eYpIp9PKWiuKi0tENBqVkUhY9A/2lx44dOhaAPA85buuJ5RSjuu4oigWE67nKcdxhBAonThRl54ppUtBrbmkyqPRiDLGUDablZ7niXA4rIqLi6VyvOonn1xfdT5bIIjrIfC5B28a6Mvckh3ou467uib57TtZdnWT7R1AJpOGjUXgVlah+sILOZg5M2uqqn5SMWHc99Zffvnu5UCGiPgkTjUiIv6b9fdUXzgUfX9x2kZDRgUsXHdABJ5WMhsiDOvedMv773j/AAqzLU9/LdzY2BhauOjCP2KjB0iqMiUkkyQCsmAWpUMDQ3d9+d57e//ls5+V1srf0zooAmzacZyI75ukEEIKQbuCIP3EWSBqCAD/4Af3F1VUyZVBNjsMwBWO40khPFiUSil/c/fdP17f3NxszzRG+v8BVthJXuWiYDwAAAAASUVORK5CYII=";

  // js/export/pdf.js
  var LIBS = {
    html2canvas: "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
    jspdf: "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
  };
  var loadScript = (src) => new Promise((ok, ko) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = ok;
    s.onerror = () => ko(new Error(`No se pudo cargar ${src}`));
    document.head.appendChild(s);
  });
  async function ensureLibs() {
    if (!window.html2canvas) await loadScript(LIBS.html2canvas);
    if (!window.jspdf) await loadScript(LIBS.jspdf);
  }
  async function buildPDF(rep, { logo = LOGO_DATA_URL, fileName = "Reporte GAFI.pdf", onProgress = () => {
  } } = {}) {
    await ensureLibs();
    const stage = document.createElement("div");
    stage.className = "pdf-stage";
    stage.setAttribute("aria-hidden", "true");
    document.body.appendChild(stage);
    const pages = [];
    const newPage = (cover = false) => {
      const p = document.createElement("section");
      p.className = `pdf-page${cover ? " pdf-cover" : ""}`;
      p.innerHTML = `<header class="pdf-hdr"><img src="${logo}" alt=""><div class="pdf-brand"><b>GAFI</b> Ferrelectrico</div><div class="rt">${esc(rep.title)}<br>${esc(rep.subtitle)}</div></header>
      <div class="pdf-body"></div><footer class="pdf-ftr"><span>GAFI Ferrelectrico \xB7 Direcci\xF3n Comercial \xB7 Elaborado el ${esc(todayLong())}</span><span class="pg"></span></footer>`;
      stage.appendChild(p);
      pages.push(p);
      return p.querySelector(".pdf-body");
    };
    const overflows = (body2) => body2.scrollHeight > body2.clientHeight + 1;
    let body;
    const add = (html, contTitle) => {
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      const el = tmp.firstElementChild;
      body.appendChild(el);
      if (overflows(body) && body.children.length > 1) {
        el.remove();
        body = newPage();
        if (contTitle) body.insertAdjacentHTML("beforeend", `<div class="pdf-kick">${esc(contTitle)} \xB7 continuaci\xF3n</div>`);
        body.appendChild(el);
      }
      return el;
    };
    body = newPage(true);
    body.insertAdjacentHTML("beforeend", `<img class="pdf-mark" src="${logo}" alt="">
    <div class="pdf-kick">Reporte ejecutivo \xB7 Direcci\xF3n comercial</div>
    <h1 class="pdf-h1">${esc(rep.title)}</h1>
    <p class="pdf-lead" style="font-size:13px">${esc(rep.subtitle)} \xB7 Archivo: ${esc(rep.file || "")}</p>
    <div class="pdf-kpis">${rep.kpis.map((k) => `<div class="pdf-kpi"><div class="v ${k.text != null ? "txt" : ""}" style="${k.tone === "neg" ? "color:#c62828" : k.tone === "pos" ? "color:#1c5cab" : ""}">${esc(k.text ?? formatValue(k.value, k.type))}</div><div class="l">${esc(k.label)}</div><div class="s">${esc(k.sub || "")}</div></div>`).join("")}</div>
    ${rep.notes ? `<div><div class="pdf-h3">Reglas del an\xE1lisis</div><div class="pdf-rules">${[...rep.notes.method, ...rep.notes.quality].map((t, i) => `<div><span>${String(i + 1).padStart(2, "0")}</span><p>${esc(t)}</p></div>`).join("")}</div></div>` : ""}`);
    if (rep.summary) {
      body = newPage();
      body.insertAdjacentHTML("beforeend", `<div><div class="pdf-kick">Resumen ejecutivo</div><h2 class="pdf-h2">Hallazgos principales</h2></div>
      <div class="msgs pdf-msgs">${rep.summary.map((m) => `<div class="msg"><div class="msg-fig" style="${m.tone === "neg" ? "color:#c62828" : m.tone === "pos" ? "color:#1c5cab" : ""}">${esc(m.fig)}</div><div class="msg-text">${m.text}</div></div>`).join("")}</div>
      <div class="pdf-cols"><div><div class="pdf-h3">Riesgos comerciales</div><ul class="bullets">${(rep.risks || []).map((x) => `<li>${x}</li>`).join("")}</ul></div>
      <div><div class="pdf-h3">Acciones prioritarias</div><ul class="bullets">${(rep.actions || []).map((x) => `<li>${x}</li>`).join("")}</ul></div></div>
      ${rep.notes ? `<div><div class="pdf-h3">Limitaciones</div><ul class="bullets">${rep.notes.limits.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>` : ""}`);
    }
    for (const sec of rep.sections) {
      const head = `<div><div class="pdf-kick">${esc(sec.kicker || "")}</div><h2 class="pdf-h2">${esc(sec.title)}</h2>${sec.lead ? `<p class="pdf-lead" style="margin-top:6px">${sec.lead}</p>` : ""}</div>`;
      if (sec.blocks.length) {
        body = newPage();
        body.insertAdjacentHTML("beforeend", head);
      } else {
        add(head);
        continue;
      }
      let halfBuf = [];
      const flushHalf = () => {
        if (!halfBuf.length) return;
        add(`<div class="pdf-cols">${halfBuf.join("")}</div>`, sec.title);
        halfBuf = [];
      };
      for (const b of sec.blocks) {
        if (b.type === "plan") {
          const items = b.items.slice(0, 12);
          add(`<div class="card"><div class="card-title">Plan de acci\xF3n \xB7 ${b.items.length} entidades${b.items.length > items.length ? ` (se muestran ${items.length}; el resto en el Excel)` : ""}</div></div>`, sec.title);
          for (let i = 0; i < items.length; i += 2) add(`<div class="plan-grid">${items.slice(i, i + 2).map(planCard).join("")}</div>`, sec.title);
          continue;
        }
        const html = renderBlock(b, { pdf: true });
        if (b.half) {
          halfBuf.push(html);
          if (halfBuf.length === 2) flushHalf();
          continue;
        }
        flushHalf();
        const el = add(html, sec.title);
        if (b.type === "table" && overflows(body)) {
          const rowsEl = el.querySelectorAll("tbody tr");
          for (let k = rowsEl.length - 1; k > 3 && overflows(body); k--) rowsEl[k].remove();
          if (!el.querySelector(".pdf-note")) el.insertAdjacentHTML("beforeend", '<p class="pdf-note" style="margin-top:4px">Detalle completo en el Excel.</p>');
        }
      }
      flushHalf();
    }
    pages.forEach((p, i) => {
      p.querySelector(".pg").textContent = `${String(i + 1).padStart(2, "0")} / ${String(pages.length).padStart(2, "0")}`;
    });
    await document.fonts.ready;
    await Promise.all([...stage.querySelectorAll("img")].map((im) => im.complete ? 0 : new Promise((r) => {
      im.onload = im.onerror = r;
    })));
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: "pt", format: "letter", orientation: "portrait", compress: true });
    for (let i = 0; i < pages.length; i++) {
      onProgress(i + 1, pages.length);
      const canvas = await window.html2canvas(pages[i], { scale: 2, backgroundColor: "#fbfaf7", useCORS: true, logging: false, windowWidth: 1400 });
      if (i) pdf.addPage("letter", "portrait");
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 612, 792, void 0, "FAST");
    }
    pdf.setProperties({ title: rep.title, subject: rep.subtitle, author: "GAFI Ferrelectrico", creator: "GAFI Analizador" });
    stage.remove();
    pdf.save(fileName);
    return pages.length;
  }

  // js/app.js
  var SHEETJS = "https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js";
  var loadScript2 = (src) => new Promise((ok, ko) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = ok;
    s.onerror = () => ko(new Error(`No se pudo cargar ${src.split("/").pop()}. Revisa tu conexi\xF3n a internet.`));
    document.head.appendChild(s);
  });
  var $ = (s, r = document) => r.querySelector(s);
  var $$ = (s, r = document) => [...r.querySelectorAll(s)];
  var S = { type: null, file: null, parsed: null, analysis: null, report: null };
  var THEME_KEY = "gafi-analizador-theme";
  function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    $("#themeBtn i").className = t === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    $("#themeBtn span").textContent = t === "dark" ? "Modo claro" : "Modo oscuro";
    $('meta[name="theme-color"]').setAttribute("content", t === "dark" ? "#08080a" : "#f5f4f1");
  }
  function initTheme() {
    let t = null;
    try {
      t = localStorage.getItem(THEME_KEY);
    } catch {
    }
    applyTheme(t || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));
    $("#themeBtn").addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      const go2 = () => {
        applyTheme(next);
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch {
        }
      };
      if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) document.startViewTransition(go2);
      else go2();
    });
  }
  function toast(title, msg = "", kind = "ok", ms = 4200) {
    const icon = { ok: "fa-circle-check", err: "fa-triangle-exclamation", info: "fa-circle-info" }[kind];
    const el = document.createElement("div");
    el.className = `toast toast--${kind} is-enter`;
    el.setAttribute("role", kind === "err" ? "alert" : "status");
    el.innerHTML = `<i class="fa-solid ${icon}"></i><div><b>${esc(title)}</b>${msg ? `<span>${esc(msg)}</span>` : ""}</div><button class="x" aria-label="Cerrar"><i class="fa-solid fa-xmark"></i></button>`;
    $("#toasts").appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove("is-enter")));
    let timer;
    const close = () => {
      clearTimeout(timer);
      el.classList.add("is-leave");
      setTimeout(() => el.remove(), 220);
    };
    const arm = () => {
      timer = setTimeout(close, ms);
    };
    el.addEventListener("mouseenter", () => clearTimeout(timer));
    el.addEventListener("mouseleave", arm);
    el.querySelector(".x").addEventListener("click", close);
    arm();
  }
  var loader = (on, text = "", sub = "") => {
    $("#loader").classList.toggle("is-on", on);
    if (text) $("#loaderText").textContent = text;
    $("#loaderSub").textContent = sub;
  };
  function go(step) {
    $$(".view").forEach((v) => v.classList.toggle("is-active", v.dataset.view === String(step)));
    $$(".step").forEach((s) => {
      const n = +s.dataset.step;
      s.classList.toggle("is-active", n === step);
      s.classList.toggle("is-done", n < step);
    });
    $("#newBtn").hidden = step < 4;
    window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  function initTypes() {
    $$(".type-card").forEach((c) => {
      c.addEventListener("pointermove", (e) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty("--mx", `${e.clientX - r.left}px`);
        c.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
      c.addEventListener("click", () => selectType(c.dataset.type));
    });
  }
  function selectType(t) {
    S.type = t;
    $("#fileKind").textContent = t === "ventas" ? "Ventas" : "Cartera vencida";
    $("#fileKindIcon").className = `fa-solid ${t === "ventas" ? "fa-chart-column" : "fa-file-invoice-dollar"}`;
    $("#dropHint").innerHTML = t === "ventas" ? "Reconoce: <b>Cedis \xB7 Vendedor \xB7 Familia</b> (2 a\xF1os), <b>Reporte Ventas por Familia</b> (periodo y trimestre) y <b>Vendedor \xB7 Cliente</b> (1 a\xF1o)." : "Reconoce el archivo <b>Cartera Vencida</b> (.xlsb / .xlsx) con la hoja <b>antiguedad</b>.";
    go(2);
  }
  function initDrop() {
    const drop = $("#drop"), input = $("#fileInput");
    drop.addEventListener("click", () => input.click());
    drop.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        input.click();
      }
    });
    input.addEventListener("change", () => {
      if (input.files[0]) handleFile(input.files[0]);
      input.value = "";
    });
    ["dragenter", "dragover"].forEach((ev) => drop.addEventListener(ev, (e) => {
      e.preventDefault();
      drop.classList.add("is-over");
    }));
    ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => {
      e.preventDefault();
      drop.classList.remove("is-over");
    }));
    drop.addEventListener("drop", (e) => {
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    });
    $("#backType").addEventListener("click", () => go(1));
  }
  function readInWorker(buf) {
    return new Promise((resolve, reject) => {
      let w;
      try {
        w = new Worker("js/core/reader.worker.js");
      } catch (e) {
        reject(Object.assign(e, { fallback: true }));
        return;
      }
      w.onmessage = ({ data }) => {
        if (data.progress) {
          loader(true, "Leyendo archivo", data.progress);
          return;
        }
        w.terminate();
        data.ok ? resolve(data) : reject(new Error(data.error));
      };
      w.onerror = (e) => {
        e.preventDefault?.();
        w.terminate();
        reject(Object.assign(new Error(e.message || "Worker no disponible"), { fallback: true }));
      };
      w.postMessage({ buf: buf.slice(0) });
    });
  }
  async function readInPage(buf) {
    if (!window.XLSX) await loadScript2(SHEETJS);
    if (!window.GAFIRead) await loadScript2("js/core/read-core.js");
    await new Promise((r) => setTimeout(r, 30));
    return window.GAFIRead.read(buf, (msg) => loader(true, "Leyendo archivo", msg));
  }
  async function readBook(buf) {
    if (location.protocol.startsWith("http")) {
      try {
        return await readInWorker(buf);
      } catch (err) {
        if (!err.fallback) throw err;
        console.warn("[lectura] sin worker, uso p\xE1gina principal", err);
      }
    }
    return readInPage(buf);
  }
  async function handleFile(file) {
    if (!/\.(xlsx|xlsm|xlsb|xls)$/i.test(file.name)) {
      toast("Formato no compatible", "Selecciona un archivo de Excel (.xlsx, .xlsb, .xls).", "err");
      return;
    }
    S.file = file;
    loader(true, "Leyendo archivo", `${file.name} \xB7 ${(file.size / 1048576).toFixed(1)} MB`);
    try {
      const buf = await file.arrayBuffer();
      const res = await readBook(buf);
      loader(true, "Detectando formato", res.sheet);
      await new Promise((r) => setTimeout(r, 30));
      const parsed = res.kind === "cartera" ? parseCartera(res.aoa) : parseSales(res.aoa);
      parsed.sheet = res.sheet;
      parsed.rowsRead = res.rows;
      const kind = SCENARIOS[parsed.scenario].kind;
      if (kind !== S.type) {
        toast("Cambi\xE9 el tipo de an\xE1lisis", `El archivo es de ${kind === "ventas" ? "Ventas" : "Cartera vencida"}.`, "info");
        S.type = kind;
      }
      S.parsed = parsed;
      buildConfig();
      loader(false);
      go(3);
    } catch (err) {
      loader(false);
      console.error(err);
      toast("No pude leer el archivo", err.message, "err", 7e3);
    }
  }
  function buildConfig() {
    const p = S.parsed, sc = SCENARIOS[p.scenario];
    $("#detIcon").className = `fa-solid ${sc.icon}`;
    $("#detName").textContent = sc.name;
    $("#detMeta").textContent = `${S.file.name} \xB7 hoja "${p.sheet}" \xB7 ${fmt.int(p.rowsRead)} renglones`;
    const f = $("#cfgFields"), rules = $("#cfgRules");
    let fields = "", r = [];
    if (p.scenario === "ventas-anual") {
      const d = p.data;
      fields = sw("excludeHouse", 'Excluir vendedores "Casa" / "Ocasional"', true, "Fuera de reportes y de c\xE1lculos de ca\xEDdas y crecimientos.");
      r = [
        `Comparativo ${d.Y} vs ${d.Y1} \xB7 dimensiones: ${d.dims.join(", ")}.`,
        `"A\xF1o Anterior" = % ${d.Y1} vs ${d.Y1 - 1}; "\xDAltimo A\xF1o" = % ${d.Y} vs ${d.Y1}; umbrales fijos \xB110%.`,
        "Pareto 80/20 por dimensi\xF3n y plan de acci\xF3n para Ca\xEDda Libre, Alerta Roja, Alerta Amarilla y Suelo."
      ];
    } else if (p.scenario === "ventas-familia") {
      fields = sw("swap", "Invertir cortes", false, 'Por defecto: "\xDAltimo A\xF1o" = Periodo y "A\xF1o Anterior" = Trimestre.');
      r = [`${p.data.rows.length} renglones de familia; las familias repetidas en dos grupos se consolidan por nombre.`, "Los % se recalculan desde los pesos (el archivo los redondea)."];
    } else if (p.scenario === "ventas-clientes") {
      fields = num2("umbral", "Umbral mensual por cliente ($)", 12e3, 1e3) + num2("meses", "Meses del periodo", 10, 1) + sw("excludeHouse", 'Excluir vendedores "Casa" / "Ocasional"', true, "Fuera del conteo y de los c\xE1lculos.");
      r = ["Cliente arriba del umbral = venta del periodo / meses > umbral.", 'Cada cuenta "P\xFAblico en general" cuenta como 1 cliente.', "Cliente activo = venta neta mayor a $0."];
    } else {
      const ced = cedisList(p.data), ms = p.data.meses;
      fields = sel("cedis", "CEDIS", ced.map((z) => [z, nice(z)]), ced.find((z) => /quer/i.test(z)) || ced[0]) + sel("mes", "Mes de corte", ms.map((m) => [m, monthLong(m)]).reverse(), ms.at(-1));
      r = [
        '"> 15 d\xEDas", solo Mostradores (sin autoconsumo) y gestores CR01-CR02.',
        'Vendedores "Casa" / "Ocasional" se mantienen en cartera.',
        "Amarillo: hasta la fila cuyo Total est\xE1 m\xE1s cerca de 100%.",
        'Se descarga como "Cartera Vencida.xlsx" con las hojas Resumen, Desplegado Clientes y Resumen Vencimiento.'
      ];
    }
    f.innerHTML = fields;
    rules.innerHTML = r.map((x) => `<li><i class="fa-solid fa-check"></i><span>${esc(x)}</span></li>`).join("");
  }
  var sw = (id, label, on, help) => `<label class="field switch" for="opt-${id}"><span>${esc(label)}<br><small>${esc(help)}</small></span><input type="checkbox" id="opt-${id}" data-opt="${id}" ${on ? "checked" : ""}></label>`;
  var num2 = (id, label, v, step) => `<div class="field"><label for="opt-${id}">${esc(label)}</label><input type="number" id="opt-${id}" data-opt="${id}" value="${v}" min="0" step="${step}"></div>`;
  var sel = (id, label, opts2, v) => `<div class="field"><label for="opt-${id}">${esc(label)}</label><select id="opt-${id}" data-opt="${id}">${opts2.map(([k, t]) => `<option value="${esc(k)}" ${k === v ? "selected" : ""}>${esc(t)}</option>`).join("")}</select></div>`;
  var opts = () => Object.fromEntries($$("[data-opt]").map((el) => [el.dataset.opt, el.type === "checkbox" ? el.checked : el.type === "number" ? +el.value : el.value]));
  async function runAnalysis() {
    const p = S.parsed, o = opts();
    loader(true, "Analizando", SCENARIOS[p.scenario].name);
    await new Promise((r) => setTimeout(r, 40));
    try {
      const meta = { fileName: S.file.name };
      if (p.scenario === "ventas-anual") {
        S.analysis = analyzeVentasAnual(p.data, o);
        S.report = reportVentasAnual(S.analysis, meta);
      } else if (p.scenario === "ventas-familia") {
        S.analysis = analyzeVentasFamilia(p.data, o);
        S.report = reportVentasFamilia(S.analysis, meta);
      } else if (p.scenario === "ventas-clientes") {
        if (!(o.umbral > 0) || !(o.meses > 0)) throw new Error("El umbral y los meses deben ser mayores a cero.");
        S.analysis = analyzeVentasClientes(p.data, o);
        S.report = reportVentasClientes(S.analysis, meta);
      } else {
        S.analysis = analyzeCartera(p.data, o);
        S.report = reportCartera(S.analysis, meta);
        S.report.subtitle = `${nice(o.cedis)} \xB7 ${monthLong(S.analysis.mes)}`;
      }
      const R = S.report;
      $("#resKicker").textContent = SCENARIOS[p.scenario].name;
      $("#resTitle").textContent = R.title;
      $("#resSub").innerHTML = `<span>${esc(R.subtitle)}</span><span class="chip"><i class="fa-solid fa-file"></i>${esc(S.file.name)}</span>`;
      $("#pdfBtn").hidden = p.scenario === "cartera";
      $("#xlsBtn span").textContent = p.scenario === "cartera" ? "Descargar Cartera Vencida.xlsx" : "Descargar Excel";
      renderResults($("#results"), R);
      loader(false);
      go(4);
      toast("An\xE1lisis listo", p.scenario === "cartera" ? `${S.analysis.kpi.clientes} clientes con deuda a m\xE1s de 15 d\xEDas.` : "Revisa las pesta\xF1as y descarga el PDF y el Excel.");
    } catch (err) {
      loader(false);
      console.error(err);
      toast("No pude completar el an\xE1lisis", err.message, "err", 7e3);
    }
  }
  var stamp = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  function download(blob, name) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 1500);
  }
  async function busy(btn, fn) {
    btn.classList.add("is-busy");
    btn.disabled = true;
    const i = btn.querySelector("i"), c = i.className;
    i.className = "fa-solid fa-circle-notch";
    try {
      await fn();
    } finally {
      i.className = c;
      btn.disabled = false;
      btn.classList.remove("is-busy");
    }
  }
  async function exportExcel() {
    await busy($("#xlsBtn"), async () => {
      try {
        if (!window.ExcelJS) await loadScript2("https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js");
        const sc = S.parsed.scenario, A = S.analysis;
        const blob = sc === "ventas-anual" ? await excelVentasAnual(A) : sc === "ventas-familia" ? await excelVentasFamilia(A) : sc === "ventas-clientes" ? await excelVentasClientes(A) : await excelCartera(A);
        const name = sc === "cartera" ? "Cartera Vencida.xlsx" : `Analisis de Ventas GAFI ${stamp()}.xlsx`;
        download(blob, name);
        toast("Excel descargado", name);
      } catch (err) {
        console.error(err);
        toast("No pude generar el Excel", err.message, "err", 7e3);
      }
    });
  }
  async function exportPDF() {
    await busy($("#pdfBtn"), async () => {
      try {
        loader(true, "Generando PDF", "Preparando p\xE1ginas\u2026");
        const n = await buildPDF(S.report, { fileName: `Reporte Ejecutivo GAFI ${stamp()}.pdf`, onProgress: (i, t) => loader(true, "Generando PDF", `P\xE1gina ${i} de ${t}`) });
        loader(false);
        toast("PDF descargado", `${n} p\xE1ginas con el logo de GAFI Ferrelectrico.`);
      } catch (err) {
        loader(false);
        console.error(err);
        toast("No pude generar el PDF", err.message, "err", 7e3);
      }
    });
  }
  function init() {
    initTheme();
    initTypes();
    initDrop();
    initTooltips();
    $("#runBtn").addEventListener("click", runAnalysis);
    $("#backFile").addEventListener("click", () => go(2));
    $("#newBtn").addEventListener("click", () => {
      S.parsed = S.analysis = S.report = null;
      go(1);
    });
    $("#xlsBtn").addEventListener("click", exportExcel);
    $("#pdfBtn").addEventListener("click", exportPDF);
    $$(".step").forEach((s) => s.addEventListener("click", () => {
      const n = +s.dataset.step;
      if (s.classList.contains("is-done")) go(n);
    }));
    window.__gafi = S;
  }
  init();
})();
