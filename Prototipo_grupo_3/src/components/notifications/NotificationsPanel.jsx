import { BellRing, CircleDollarSign, ReceiptText, TriangleAlert, WalletCards, X } from 'lucide-react';

const iconByType = {
  payment: CircleDollarSign,
  budget: WalletCards,
  expense: TriangleAlert,
  tax: ReceiptText,
};

export function NotificationsPanel({ notifications, onClose, onRead, onReadAll }) {
  return (
    <div className="notifications-overlay" role="dialog" aria-modal="true" aria-label="Notificaciones">
      <section className="notifications-panel">
        <header>
          <div>
            <span>Centro de alertas</span>
            <h2>Notificaciones</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar notificaciones"><X size={19} /></button>
        </header>

        <button className="notifications-read-all" type="button" onClick={onReadAll}>
          Marcar todas como leidas
        </button>

        <div className="notifications-list">
          {notifications.length === 0 ? (
            <div className="notifications-empty">
              <BellRing size={24} />
              <p>No tienes alertas pendientes.</p>
            </div>
          ) : notifications.map((notification) => {
            const Icon = iconByType[notification.type] || BellRing;
            return (
              <button
                className={`notification-item ${notification.read ? 'is-read' : ''}`}
                type="button"
                key={notification.id}
                onClick={() => onRead(notification.id)}
              >
                <span className={`notification-icon ${notification.type}`}><Icon size={17} /></span>
                <span className="notification-copy">
                  <strong>{notification.title}</strong>
                  <p>{notification.message}</p>
                  <small>{notification.time}</small>
                </span>
                {!notification.read && <i aria-label="No leida" />}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
