export function formatCurrency(value) {
  return `L ${Number(value || 0).toLocaleString('es-HN')}`;
}
