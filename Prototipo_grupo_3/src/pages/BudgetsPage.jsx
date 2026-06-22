import { useMemo, useState } from 'react';
import { Plus, Target, WalletCards } from 'lucide-react';
import { Header } from '../components/layout/Header.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input, Select } from '../components/ui/Input.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { useBudgets } from '../hooks/useBudgets.js';
import { useNotifications } from '../hooks/useNotifications.js';
import { formatCurrency } from '../utils/currency.js';

const emptyBudget = {
  name: '',
  type: 'budget',
  target: '',
  current: '',
  period: 'Este mes',
};

export default function BudgetsPage() {
  const { budgets, addBudget, updateProgress } = useBudgets();
  const { addNotification } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyBudget);
  const [progressAmounts, setProgressAmounts] = useState({});
  const [error, setError] = useState('');
  const summary = useMemo(() => ({
    budgets: budgets.filter((item) => item.type === 'budget').length,
    goals: budgets.filter((item) => item.type === 'goal').length,
  }), [budgets]);

  function submit(event) {
    event.preventDefault();
    if (!form.name || Number(form.target) <= 0) {
      setError('Completa el nombre y un limite o meta mayor que cero.');
      return;
    }
    addBudget(form);
    setForm(emptyBudget);
    setError('');
    setShowForm(false);
  }

  function addProgress(item) {
    const amount = Number(progressAmounts[item.id] || 0);
    if (amount <= 0) return;
    updateProgress(item.id, amount);
    const nextValue = Number(item.current) + amount;
    const ratio = nextValue / Number(item.target || 1);
    if (item.type === 'budget' && ratio >= 0.8) {
      addNotification({
        type: 'budget',
        title: 'Presupuesto por agotarse',
        message: `${item.name} alcanzo el ${Math.round(ratio * 100)}% de su limite.`,
      });
    }
    setProgressAmounts({ ...progressAmounts, [item.id]: '' });
  }

  return (
    <main className="page budgets-page">
      <Header
        title="Presupuestos y metas"
        backTo="/dashboard"
        action={<button className="icon-button primary" type="button" onClick={() => setShowForm(true)} aria-label="Agregar presupuesto o meta"><Plus size={19} /></button>}
      />

      <section className="budget-summary-grid">
        <article><WalletCards size={20} /><span>Presupuestos</span><strong>{summary.budgets}</strong></article>
        <article><Target size={20} /><span>Metas activas</span><strong>{summary.goals}</strong></article>
      </section>

      <section className="budget-list">
        {budgets.map((item) => {
          const percentage = Math.min(100, Math.round((Number(item.current) / Number(item.target || 1)) * 100));
          return (
            <article className={`budget-card ${item.type}`} key={item.id}>
              <div className="budget-card-heading">
                <div>
                  <span>{item.type === 'budget' ? 'Limite de gasto' : 'Meta financiera'}</span>
                  <h2>{item.name}</h2>
                </div>
                <strong>{percentage}%</strong>
              </div>
              <div className="budget-values">
                <span>{formatCurrency(item.current)}</span>
                <span>de {formatCurrency(item.target)}</span>
              </div>
              <div className="budget-progress"><span style={{ width: `${percentage}%` }} /></div>
              <p>{item.period}</p>
              <div className="budget-update">
                <input
                  type="number"
                  min="0"
                  placeholder={item.type === 'budget' ? 'Registrar gasto' : 'Registrar ahorro'}
                  value={progressAmounts[item.id] || ''}
                  onChange={(event) => setProgressAmounts({ ...progressAmounts, [item.id]: event.target.value })}
                />
                <button type="button" onClick={() => addProgress(item)}>Actualizar</button>
              </div>
            </article>
          );
        })}
      </section>

      {showForm && (
        <Modal
          title="Nuevo presupuesto o meta"
          onClose={() => setShowForm(false)}
          actions={(
            <>
              <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancelar</Button>
              <Button type="submit" form="budget-form">Guardar</Button>
            </>
          )}
        >
          <form id="budget-form" className="form-stack" onSubmit={submit}>
            <Select label="Tipo" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
              <option value="budget">Presupuesto de gasto</option>
              <option value="goal">Meta financiera</option>
            </Select>
            <Input label="Nombre" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            <Input label="Limite o meta" type="number" min="1" value={form.target} onChange={(event) => setForm({ ...form, target: event.target.value })} />
            <Input label="Monto actual" type="number" min="0" value={form.current} onChange={(event) => setForm({ ...form, current: event.target.value })} />
            <Input label="Periodo" value={form.period} onChange={(event) => setForm({ ...form, period: event.target.value })} />
            {error && <p className="form-error">{error}</p>}
          </form>
        </Modal>
      )}
    </main>
  );
}
