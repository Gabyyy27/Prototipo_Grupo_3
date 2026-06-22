export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function daysAgoIso(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

export function formatDate(date) {
  if (!date) return 'Sin fecha';
  return new Date(`${date}T12:00:00`).toLocaleDateString('es-HN', {
    day: '2-digit',
    month: 'short',
  });
}

export function filterByDateRange(items, range) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 6);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return items.filter((item) => {
    const value = new Date(`${item.date}T12:00:00`);
    if (range === 'Hoy') return item.date === todayIso();
    if (range === 'Esta semana') return value >= weekStart;
    if (range === 'Este mes') return value >= monthStart;
    return true;
  });
}
