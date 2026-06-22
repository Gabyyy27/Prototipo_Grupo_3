import { mockNotifications } from '../data/mockNotifications.js';
import { useLocalStorage } from './useLocalStorage.js';

const NOTIFICATIONS_KEY = 'contfia.notifications.v1';

export function useNotifications() {
  const [notifications, setNotifications] = useLocalStorage(NOTIFICATIONS_KEY, mockNotifications);

  function markAsRead(notificationId) {
    setNotifications(notifications.map((notification) =>
      notification.id === notificationId ? { ...notification, read: true } : notification,
    ));
  }

  function markAllAsRead() {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })));
  }

  function addNotification(notification) {
    setNotifications([
      {
        ...notification,
        id: notification.id || `notification-${Date.now()}`,
        time: notification.time || 'Ahora',
        read: false,
      },
      ...notifications,
    ]);
  }

  return {
    notifications,
    unreadCount: notifications.filter((notification) => !notification.read).length,
    markAsRead,
    markAllAsRead,
    addNotification,
  };
}
