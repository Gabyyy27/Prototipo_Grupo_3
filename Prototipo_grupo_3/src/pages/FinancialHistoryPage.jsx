import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ChevronLeft, Coffee, Filter, Package, ReceiptText, ShoppingBag } from 'lucide-react';
import { Modal } from '../components/ui/Modal.jsx';
import { Button } from '../components/ui/Button.jsx';
import { useMovements } from '../hooks/useMovements.js';
import { calculateTotals } from '../utils/calculations.js';
import { filterByDateRange, formatDate } from '../utils/dates.js';
import { formatCurrency } from '../utils/currency.js';

const tabs = ['Ventas', 'Compras', 'Flujo'];
const ranges = ['Hoy', 'Esta semana', 'Este mes'];
const times = ['09:20 AM', '04:45 PM', '11:15 AM', '08:30 AM'];

export default function FinancialHistoryPage() {
  const { movements } = useMovements();
  const [tab, setTab] = useState('Compras');
  const [rangeIndex, setRangeIndex] = useState(1);
  const [selected, setSelected] = useState(null);
  const range = ranges[rangeIndex];
  const rangedMovements = filterByDateRange(movements, range);
  const totals = calculateTotals(rangedMovements);
  const visibleMovements = rangedMovements.filter((movement) => {
    if (tab === 'Ventas') return movement.type === 'sale';
    if (tab === 'Compras') return movement.type === 'purchase';
    return true;
  });
  const monthlyTotal = totals.totalSales + 4265;

  function cycleRange() {
    setRangeIndex((current) => (current + 1) % ranges.length);
  }

  return (
    <main className="page financial-history-page">
      <header className="history-topbar">
        <Link to="/dashboard" aria-label="Volver al inicio"><ChevronLeft size={19} /></Link>
        <h1>Historial de ventas</h1>
        <span />
      </header>

      <section className="history-summary-card">
        <span>RESUMEN MENSUAL</span>
        <h2>Total Vendido: {formatCurrency(monthlyTotal)}</h2>
        <p>+12% vs mes pasado</p>
      </section>

      <nav className="history-tabs" aria-label="Tipo de historial">
        {tabs.map((item) => (
          <button key={item} className={tab === item ? 'is-active' : ''} type="button" onClick={() => setTab(item)}>
            {item}
          </button>
        ))}
      </nav>

      <section className="history-filter-card">
        <h2>Rango de fecha</h2>
        <button className="history-date-field" type="button" onClick={cycleRange}>
          <CalendarDays size={16} />
          <span>{dateRangeLabel(range)}</span>
        </button>
        <button className="history-filter-button" type="button" onClick={cycleRange}>
          <Filter size={14} />
          Filtrar
        </button>
      </section>

      <section className="history-recent-section">
        <h2>RECIENTES</h2>
        {tab === 'Flujo' ? (
          <FlowSummary totals={totals} />
        ) : visibleMovements.length === 0 ? (
          <p className="history-empty">No hay movimientos para este rango.</p>
        ) : (
          <div className="history-row-list">
            {visibleMovements.map((movement, index) => (
              <HistoryRow key={movement.id} movement={movement} index={index} onClick={() => setSelected(movement)} />
            ))}
          </div>
        )}
      </section>

      {selected && (
        <Modal
          title="Detalle del movimiento"
          onClose={() => setSelected(null)}
          actions={<Button onClick={() => setSelected(null)}>Cerrar</Button>}
        >
          <div className="detail-grid single">
            <Detail label="Fecha" value={formatDate(selected.date)} />
            <Detail label="Concepto" value={selected.concept} />
            <Detail label="Cliente" value={selected.customer || 'No aplica'} />
            <Detail label="Monto" value={formatCurrency(selected.amount)} />
            <Detail label="Tipo" value={selected.type === 'sale' ? 'Venta' : 'Compra'} />
            <Detail label="Estado" value={selected.status === 'paid' ? 'Pagado' : 'Pendiente'} />
          </div>
        </Modal>
      )}
    </main>
  );
}

function HistoryRow({ movement, index, onClick }) {
  const isSale = movement.type === 'sale';
  const Icon = pickIcon(movement, index);

  return (
    <button className="history-row-card" type="button" onClick={onClick}>
      <span className={`history-row-icon ${isSale ? 'sale' : `purchase purchase-${(index % 4) + 1}`}`}>
        <Icon size={15} />
      </span>
      <span className="history-row-copy">
        <strong>{historyTitle(movement)}</strong>
        <small>{historyDate(movement.date)} &middot; {times[index % times.length]}</small>
      </span>
      <span className="history-row-side">
        <strong>{formatDetailedCurrency(movement.amount)}</strong>
        <small className={movement.channel === 'WhatsApp' ? 'whatsapp' : 'app'}>
          {movement.channel === 'WhatsApp' ? 'WhatsApp' : 'App Directo'}
        </small>
      </span>
    </button>
  );
}

function FlowSummary({ totals }) {
  return (
    <div className="history-flow-grid">
      <article>
        <span>Total vendido</span>
        <strong>{formatCurrency(totals.totalSales)}</strong>
      </article>
      <article>
        <span>Total gastado</span>
        <strong>{formatCurrency(totals.totalPurchases)}</strong>
      </article>
      <article>
        <span>Ganancia neta</span>
        <strong>{formatCurrency(totals.profit)}</strong>
      </article>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function historyTitle(movement) {
  if (movement.productName) return movement.productName;
  return movement.concept.replace('Compra de ', '').replace('Venta de ', '');
}

function pickIcon(movement, index) {
  if (movement.type === 'sale') return ReceiptText;
  const icons = [Package, ShoppingBag, ReceiptText, Coffee];
  return icons[index % icons.length];
}

function historyDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('es-HN', {
    day: '2-digit',
    month: 'short',
  }).replace('.', '');
}

function dateRangeLabel(range) {
  if (range === 'Hoy') return 'Hoy';
  if (range === 'Este mes') return '01 Oct - 31 Oct, 2023';
  return '01 Oct - 15 Oct, 2023';
}

function formatDetailedCurrency(value) {
  return `L ${Number(value || 0).toLocaleString('es-HN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
