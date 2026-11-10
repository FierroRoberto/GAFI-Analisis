/* ==========================================================================
   Diagnóstico y soluciones genéricas (sector ferretero) para caídas relevantes
   ========================================================================== */
import { fmt, nice } from './utils.js';

export function dimKind(name) {
  const n = String(name).toLowerCase();
  if (n.includes('vendedor')) return 'vendedor';
  if (n.includes('familia') || n.includes('grupo')) return 'familia';
  if (n.includes('cliente')) return 'cliente';
  if (n.includes('cedis') || n.includes('zona')) return 'cedis';
  return 'otro';
}

/** profile: { broad:boolean, topName, topShare, category } */
export function solutionsFor(kind, entity, profile = {}) {
  const s = [];
  const top = profile.topName ? nice(profile.topName) : null;
  const twoYears = profile.category === 'Alerta Roja' || profile.category === 'Suelo';
  if (kind === 'vendedor') {
    if (profile.house) return [
      'Identificar a los clientes de esta cuenta y asignarlos a un vendedor con cuota.',
      'Campaña de reactivación (llamada y visita) a los clientes de mayor compra del año anterior.',
      'Validar en el sistema si hubo reclasificación de clientes hacia otras cuentas.',
      'Definir reglas de uso de cuentas casa y ocasional para que la venta quede atribuida.'];
    if (top && profile.topShare >= 0.3) s.push(`Plan de recuperación enfocado en ${top}: identificar los clientes que redujeron compra y acordar su reactivación.`);
    s.push('Revisar cartera: clientes activos contra el año anterior, frecuencia de visita y clientes con baja mayor a 20%.');
    s.push('Revisión 1 a 1 semanal con gerencia sobre los 5 conceptos con mayor caída y los clientes que los explican.');
    s.push('Ampliar surtido por cliente con las familias que crecen en el resto de la fuerza de ventas.');
    s.push('Revisar cuota e incentivos del periodo restante para premiar la recuperación.');
    return s.slice(0, 5);
  }
  if (kind === 'familia') {
    if (profile.broad) {
      s.push(`Revisar disponibilidad e inventario de ${nice(entity)} en el CEDIS: quiebres, tiempos de surtido y códigos descontinuados.`);
      s.push('Revisar precio neto, descuentos y condiciones contra la competencia local.');
      s.push('Lanzar una mecánica comercial (promoción por volumen o combo con familias en crecimiento) con meta semanal por vendedor.');
    } else {
      if (top) s.push(`Plan de recuperación con los clientes que dejaron de comprar la familia, empezando por la cartera de ${top}.`);
      s.push('Revisar precio, descuentos y condiciones otorgadas a los clientes que bajaron su compra.');
    }
    if (twoYears) s.push('Revisar vigencia del surtido: depurar códigos de baja rotación y definir surtido mínimo por perfil de cliente.');
    s.push('Benchmark de competencia y sustitución: identificar si el cliente cambió de proveedor, marca o material.');
    s.push('Incluir la familia en el tablero semanal de seguimiento contra el mismo periodo del año anterior.');
    return s.slice(0, 5);
  }
  if (kind === 'cliente') {
    const v = profile.vendor ? nice(profile.vendor) : 'el vendedor';
    if (profile.publico) return ['Revisar la atención de mostrador y la disponibilidad de los productos más pedidos.',
      'Identificar compradores recurrentes dentro de "Público en general" y darlos de alta como clientes.',
      'Promoción de mostrador con las familias en crecimiento.'];
    if (profile.var < -0.75) return [`Visita del gerente con ${v} en los próximos 7 días para conocer el motivo de la baja.`,
      'Revisar crédito, saldo vencido o incidencias de servicio (entregas, faltantes, devoluciones).',
      'Preparar una oferta de regreso en sus familias principales del año anterior.',
      'Si se fue a la competencia, documentar el motivo para el análisis de precios.'];
    if (profile.var < -0.25) return ['Identificar las familias que dejó de comprar y ofrecerlas de nuevo.',
      'Revisar precio neto y condiciones contra la competencia en esas familias.',
      `Aumentar la frecuencia de visita de ${v} y acordar una meta trimestral de recuperación.`,
      'Seguimiento mensual en el tablero de clientes clave.'];
    return ['Revisar surtido y condiciones comerciales con el cliente.', 'Mantener la frecuencia de visita y ofrecer familias en crecimiento.', 'Seguimiento mensual de la tendencia.'];
  }
  return ['Revisar cobertura, frecuencia de visita y cartera de clientes de mayor impacto.',
    'Revisar surtido, disponibilidad y quiebres de inventario de las familias en caída.',
    'Revisar precios, descuentos y condiciones contra la competencia.',
    'Seguimiento semanal por vendedor con metas de recuperación.'];
}

export function plural(dim) {
  const n = String(dim).toLowerCase();
  if (n.includes('vendedor')) return 'vendedores';
  if (n.includes('grupo')) return 'grupos';
  if (n.includes('familia')) return 'familias';
  if (n.includes('cliente')) return 'clientes';
  if (n.includes('cedis')) return 'CEDIS';
  if (n.includes('zona')) return 'zonas';
  return n;
}

export function diagnosisText(e, extra = '') {
  return `${fmt.pct(e.varUlt)} en el último año tras ${fmt.pct(e.varAnt)} el año previo; impacto ${fmt.short(e.impact, true)}. ${extra}`.trim();
}
