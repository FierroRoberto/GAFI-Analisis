# GAFI Ferrelectrico · Analizador Comercial

App web (PWA) para analizar archivos de **ventas** y de **cartera vencida** de GAFI Ferrelectrico.
Todo se procesa **en el navegador**: los archivos nunca se suben a un servidor.

## Qué hace

| Tipo | Formato que reconoce | Entregables |
|---|---|---|
| Ventas · comparativo anual | Tabla dinámica *Ventas Dinámicas* con `Cedis · Vendedor · Familia` y columnas `Ventas pesos` / `% Variación pesos` de 2 años | PDF ejecutivo + Excel |
| Ventas · por familia | *Reporte Ventas por Familia* (`Venta periodo Ant./Act.`, `Venta trimestre Ant./Act.`) | PDF ejecutivo + Excel |
| Ventas · clientes por vendedor | *Ventas Dinámicas* de 1 año con `Cedis · Vendedor · Desc. Cliente principal` | PDF ejecutivo + Excel |
| Cartera vencida | Archivo *Cartera Vencida* (.xlsb/.xlsx) con la hoja `antiguedad` | `Cartera Vencida.xlsx` (Resumen, Desplegado Clientes, Resumen Vencimiento) |

La app **detecta el formato sola**; si eliges "Ventas" y subes una cartera (o al revés), cambia el tipo y te avisa.

### Reglas incluidas
- Matriz fija de 9 categorías con umbrales de ±10 %: Acierto, Desaceleración, Caída Libre, Recuperación, Sin Pena Ni Gloria, Alerta Amarilla, Efecto Rebote, Suelo y Alerta Roja.
- Pareto 80/20 por impacto absoluto en pesos; plan de acción (3–5 soluciones) solo para Caída Libre, Alerta Roja, Alerta Amarilla y Suelo con impacto negativo.
- **Ventas:** se excluyen los vendedores con "Casa" u "Ocasional" en el nombre (interruptor en la configuración).
- **Clientes:** umbral mensual configurable (por defecto $12,000 con 10 meses); "Público en general" cuenta como 1 cliente.
- **Cartera vencida:** columna "> 15 días", solo Mostradores (sin autoconsumo) y gestores CR01-CR02. Los vendedores Casa/Ocasional **se mantienen**. El amarillo va desde la primera fila hasta la fila cuyo **Total está más cerca de 100 %**, por separado en cada tabla.
- PDF con logo y nombre **GAFI Ferrelectrico** en cada página.

## Publicar en GitHub Pages

1. Crea un repositorio (por ejemplo `gafi-analizador`) y sube **todo el contenido de esta carpeta** a la raíz (`index.html` debe quedar en la raíz).
2. En GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, rama `main`, carpeta `/ (root)` → **Save**.
3. En 1–2 minutos queda en `https://<tu-usuario>.github.io/gafi-analizador/`.
4. Desde Chrome/Edge (o "Agregar a inicio" en el celular) se puede **instalar como app**.

> El repositorio puede ser público: no contiene datos de clientes, solo el código y el logo.
> GitHub Pages en repositorios privados requiere un plan de pago.

### Probar en tu computadora
Basta con abrir `index.html` con **doble clic** (necesita internet la primera vez para cargar las librerías de Excel y PDF).
Con doble clic no se instala como app ni funciona sin conexión; para eso usa GitHub Pages o un servidor local:

```bash
cd gafi-analizador
python -m http.server 8080
# abre http://localhost:8080
```

### Modificar el código
La página carga `js/app.bundle.js`, que se genera a partir de los módulos de `js/`. Si cambias algún archivo de `js/` (excepto `js/core/read-core.js` y `js/core/reader.worker.js`, que se usan directo), regenera el bundle con Node.js:

```bash
./build.sh
```

### Actualizar la app
El service worker guarda la app para usarla sin conexión. Cuando cambies archivos, sube el número de `VERSION` en `sw.js` (por ejemplo `v1.0.1`) para que los usuarios reciban la nueva versión.

## Estructura

```
index.html                 Interfaz (stepper: Tipo → Archivo → Configurar → Resultados)
manifest.json · sw.js      PWA (instalable, offline)
css/styles.css             Estilos: modo oscuro/claro, animaciones, estilos del PDF
js/app.bundle.js           Script que carga la página (generado con ./build.sh)
js/app.js                  Flujo de la app, tema, toasts, descargas (código fuente)
js/core/
  reader.worker.js · read-core.js   Lectura del Excel en segundo plano (SheetJS); respaldo en la página
  parsers.js               Detección de formato
  ventas-anual.js · ventas-familia.js · ventas-clientes.js · cartera.js   Análisis
  reports.js · solutions.js · utils.js                                  Textos, soluciones y utilidades
js/ui/blocks.js · render.js  Gráficas SVG animadas, matriz, tablas, plan, pestañas
js/export/excel.js         Excel con ExcelJS (incluye Cartera Vencida.xlsx con formato de la Guía)
js/export/pdf.js           PDF carta con html2canvas + jsPDF
assets/                    Logo, fuentes DM Sans y Space Mono, Font Awesome (locales)
icons/                     Íconos de la PWA
```

## Librerías (CDN, quedan en caché para uso sin conexión)
- [SheetJS](https://sheetjs.com) 0.20.3 — lectura de .xlsx/.xlsb
- [ExcelJS](https://github.com/exceljs/exceljs) 4.4.0 — Excel con formato
- [jsPDF](https://github.com/parallax/jsPDF) 2.5.1 y [html2canvas](https://html2canvas.hertzen.com) 1.4.1 — PDF
- Fuentes DM Sans y Space Mono (SIL OFL) y Font Awesome Free 6.5.2 incluidas en `assets/`

---
GAFI Ferrelectrico · Simplificamos el mundo ferretero
