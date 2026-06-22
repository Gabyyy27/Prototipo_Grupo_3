import { useMemo, useState } from 'react';
import { CheckCircle2, MessageCircle, Plus, UsersRound } from 'lucide-react';
import { Header } from '../components/layout/Header.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { useClients } from '../hooks/useClients.js';
import { useNotifications } from '../hooks/useNotifications.js';
import { formatCurrency } from '../utils/currency.js';

const emptyClient = {
  name: '',
  phone: '',
  email: '',
  pendingBalance: '',
  dueDate: '',
};

export default function ClientsPage() {
  const { clients, addClient, markAsPaid, sendReminder } = useClients();
  const { addNotification } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyClient);
  const [error, setError] = useState('');
  const totalPending = useMemo(() => clients.reduce((sum, client) => sum + Number(client.pendingBalance || 0), 0), [clients]);

  function submit(event) {
    event.preventDefault();
    if (!form.name || !form.phone) {
      setError('Completa nombre y telefono.');
      return;
    }
    addClient(form);
    setForm(emptyClient);
    setError('');
    setShowForm(false);
  }

  function remind(client) {
    sendReminder(client.id);
    addNotification({
      type: 'payment',
      title: 'Recordatorio enviado',
      message: `Se envio un recordatorio de cobro a ${client.name}.`,
    });
  }

  return (
    <main className="page clients-page">
      <Header
        title="Clientes y cobros"
        backTo="/dashboard"
        action={<button className="icon-button primary" type="button" onClick={() => setShowForm(true)} aria-label="Agregar cliente"><Plus size={19} /></button>}
      />

      <section className="clients-summary">
        <span>Saldo pendiente total</span>
        <strong>{formatCurrency(totalPending)}</strong>
        <p>{clients.filter((client) => client.status === 'pending').length} cuentas por cobrar</p>
      </section>

      {clients.length === 0 ? (
        <EmptyState icon={UsersRound} title="Sin clientes" text="Registra tu primer cliente para controlar sus saldos." />
      ) : (
        <section className="clients-list">
          {clients.map((client) => (
            <article className="client-card" key={client.id}>
              <div className="client-card-top">
                <span className="client-avatar">{client.name.slice(0, 2).toUpperCase()}</span>
                <div>
                  <h2>{client.name}</h2>
                  <p>{client.phone}{client.email ? ` - ${client.email}` : ''}</p>
                </div>
                <strong className={client.status === 'paid' ? 'paid' : ''}>{formatCurrency(client.pendingBalance)}</strong>
              </div>
              {client.dueDate && client.status === 'pending' && <p className="client-due">Vence: {client.dueDate}</p>}
              {client.lastAction && !client.lastAction.toLowerCase().includes('enlace') && <p className="client-feedback">{client.lastAction}</p>}
              <div className="client-actions">
                <button type="button" onClick={() => remind(client)} disabled={client.status === 'paid'}><MessageCircle size={15} />Recordar</button>
                <button type="button" onClick={() => markAsPaid(client.id)} disabled={client.status === 'paid'}><CheckCircle2 size={15} />Pagado</button>
              </div>
            </article>
          ))}
        </section>
      )}

      {showForm && (
        <Modal
          title="Registrar cliente"
          onClose={() => setShowForm(false)}
          actions={(
            <>
              <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button type="submit" form="client-form">Guardar</Button>
            </>
          )}
        >
          <form id="client-form" className="form-stack" onSubmit={submit}>
            <Input label="Nombre" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            <Input label="Telefono" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            <Input label="Correo" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            <Input label="Saldo pendiente" type="number" min="0" value={form.pendingBalance} onChange={(event) => setForm({ ...form, pendingBalance: event.target.value })} />
            <Input label="Fecha de vencimiento" type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} />
            {error && <p className="form-error">{error}</p>}
          </form>
        </Modal>
      )}
    </main>
  );
}
