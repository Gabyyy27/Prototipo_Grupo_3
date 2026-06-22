export const mockNotifications = [
  {
    id: 'notification-payment',
    type: 'payment',
    title: 'Pago proximo',
    message: 'El cobro de Cafe Central vence manana por L 850.',
    time: 'Hace 10 min',
    read: false,
  },
  {
    id: 'notification-budget',
    type: 'budget',
    title: 'Presupuesto por agotarse',
    message: 'Ingredientes alcanzo el 84% del limite mensual.',
    time: 'Hace 1 hora',
    read: false,
  },
  {
    id: 'notification-expense',
    type: 'expense',
    title: 'Gasto elevado detectado',
    message: 'Tus compras de esta semana superan el promedio habitual.',
    time: 'Hoy',
    read: true,
  },
  {
    id: 'notification-tax',
    type: 'tax',
    title: 'Recordatorio de impuesto',
    message: 'Revisa tus registros antes del cierre mensual.',
    time: 'Ayer',
    read: true,
  },
];
