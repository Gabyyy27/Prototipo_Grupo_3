import { daysAgoIso } from './dates.js';

export function calculateTotals(movements) {
  const sales = movements.filter((movement) => movement.type === 'sale');
  const purchases = movements.filter((movement) => movement.type === 'purchase');
  const totalSales = sales.reduce((sum, movement) => sum + Number(movement.amount), 0);
  const totalPurchases = purchases.reduce((sum, movement) => sum + Number(movement.amount), 0);
  const pending = sales
    .filter((movement) => movement.status === 'pending')
    .reduce((sum, movement) => sum + Number(movement.amount), 0);

  return {
    totalSales,
    totalPurchases,
    profit: totalSales - totalPurchases,
    pending,
  };
}

export function buildSalesTrend(movements) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = daysAgoIso(6 - index);
    const label = new Date(`${date}T12:00:00`)
      .toLocaleDateString('es-HN', { weekday: 'short' })
      .replace('.', '');
    const sales = movements
      .filter((movement) => movement.type === 'sale' && movement.date === date)
      .reduce((sum, movement) => sum + Number(movement.amount), 0);

    return { date, label, sales };
  });
}

export function getLatestSale(movements) {
  return movements.find((movement) => movement.type === 'sale') || null;
}
