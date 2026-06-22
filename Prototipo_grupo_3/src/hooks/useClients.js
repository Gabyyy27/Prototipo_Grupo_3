import { mockClients } from '../data/mockClients.js';
import { useLocalStorage } from './useLocalStorage.js';

const CLIENTS_KEY = 'contfia.clients.v1';

export function useClients() {
  const [clients, setClients] = useLocalStorage(CLIENTS_KEY, mockClients);

  function addClient(client) {
    setClients([
      {
        ...client,
        id: `client-${Date.now()}`,
        pendingBalance: Number(client.pendingBalance || 0),
        status: Number(client.pendingBalance || 0) > 0 ? 'pending' : 'paid',
        lastAction: '',
      },
      ...clients,
    ]);
  }

  function markAsPaid(clientId) {
    setClients(clients.map((client) =>
      client.id === clientId
        ? { ...client, pendingBalance: 0, status: 'paid', lastAction: 'Cuenta marcada como pagada' }
        : client,
    ));
  }

  function sendReminder(clientId) {
    setClients(clients.map((client) =>
      client.id === clientId
        ? { ...client, lastAction: 'Recordatorio enviado por WhatsApp' }
        : client,
    ));
  }

  function addReceivable({ name, amount, dueDate }) {
    const normalizedName = name.trim().toLowerCase();
    const existingClient = clients.find((client) => client.name.trim().toLowerCase() === normalizedName);

    if (existingClient) {
      setClients(clients.map((client) =>
        client.id === existingClient.id
          ? {
              ...client,
              pendingBalance: Number(client.pendingBalance || 0) + Number(amount || 0),
              dueDate,
              status: 'pending',
              lastAction: 'Venta pendiente registrada desde la app',
            }
          : client,
      ));
      return existingClient.id;
    }

    const clientId = `client-${Date.now()}`;
    setClients([
      {
        id: clientId,
        name,
        phone: '',
        email: '',
        pendingBalance: Number(amount || 0),
        dueDate,
        status: 'pending',
        lastAction: 'Venta pendiente registrada desde la app',
      },
      ...clients,
    ]);
    return clientId;
  }

  return {
    clients,
    addClient,
    markAsPaid,
    sendReminder,
    addReceivable,
  };
}
