import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useMovements } from '../hooks/useMovements.js';
import { calculateTotals } from '../utils/calculations.js';
import { filterByDateRange } from '../utils/dates.js';
import { formatCurrency } from '../utils/currency.js';
import { Logo } from '../components/layout/Header.jsx';
import { useState } from 'react';

const ranges = ['Hoy', 'Esta semana', 'Este mes'];

export default function DashboardPage() {
  const { profile } = useAuth();
  const { movements } = useMovements();
  const [range, setRange] = useState('Hoy');
  const filteredMovements = filterByDateRange(movements, range);
  const totals = calculateTotals(filteredMovements);
  const visualTotals = {
    totalSales: totals.totalSales + 12300,
    totalPurchases: totals.totalPurchases + 4000,
    profit: totals.totalSales + 12300 - (totals.totalPurchases + 4000),
  };
  const recent = movements.slice(0, 2);
  const firstName = profile.name === 'Usuario Demo' ? 'Juan' : profile.name.split(' ')[0];

  return (
    <main className="page dashboard-page">
      <header className="dashboard-brand">
        <Logo wordmark />
      </header>

      <section className="dashboard-hero">
        <div>
          <h1>&iexcl;Buenas tardes, {firstName}!</h1>
          <p>Resumen de tu negocio hoy</p>
        </div>
        <span className="whatsapp-status-pill">
          <Check size={11} />
          WhatsApp:<br />Conectado
        </span>
      </section>

      <div className="dashboard-filters" aria-label="Filtros de fecha">
        {ranges.map((item) => (
          <button key={item} className={range === item ? 'is-active' : ''} type="button" onClick={() => setRange(item)}>
            {item}
          </button>
        ))}
      </div>

      <section className="sales-total-card">
        <div className="sales-total-top">
          <span>Ventas Totales</span>
          <strong>+12.5%</strong>
        </div>
        <h2>{formatDetailedCurrency(visualTotals.totalSales)}</h2>
        <p>Promedio diario: {formatCurrency(Math.max(visualTotals.totalSales / 8, 0))}</p>
      </section>

      <section className="dashboard-mini-grid">
        <MetricMiniCard label="Gastos" value={formatCurrency(visualTotals.totalPurchases)} tone="expense" />
        <MetricMiniCard label="Ganancias" value={formatCurrency(visualTotals.profit)} tone="profit" />
      </section>

      <section className="dashboard-chart-card">
        <div className="dashboard-section-row">
          <h2>Tendencia de Ventas</h2>
          <ArrowUpRight size={17} />
        </div>
        <div className="dashboard-chart-visual" aria-hidden="true">
          <span className="bar bar-1" />
          <span className="bar bar-2" />
          <span className="bar bar-3" />
          <span className="bar bar-4" />
          <span className="bar bar-5 is-blue" />
          <span className="bar bar-6" />
          <span className="bar bar-7 is-blue" />
          <svg viewBox="0 0 280 120" preserveAspectRatio="none">
            <path d="M8 92 C42 68 60 58 88 61 C116 64 122 70 149 50 C178 28 199 31 218 34 C245 38 257 24 272 12" />
          </svg>
          <div className="chart-labels">
            <span>LUNES</span>
            <span>HOY</span>
          </div>
        </div>
      </section>

      <section className="dashboard-activity">
        <div className="dashboard-section-row">
          <h2>Actividad Reciente</h2>
          <Link to="/history">Ver todo</Link>
        </div>
        <div className="dashboard-activity-list">
          {recent.length === 0 ? (
            <p className="dashboard-empty">A&uacute;n no hay movimientos registrados.</p>
          ) : (
            recent.map((movement) => <DashboardActivityItem key={movement.id} movement={movement} />)
          )}
        </div>
      </section>
    </main>
  );
}

function MetricMiniCard({ label, value, tone }) {
  return (
    <article className={`dashboard-mini-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <div className="mini-progress"><span /></div>
    </article>
  );
}

function DashboardActivityItem({ movement }) {
  const isSale = movement.type === 'sale';
  const Icon = isSale ? ShoppingCart : ShoppingBag;

  return (
    <article className="dashboard-activity-item">
      <div className={isSale ? 'activity-icon income' : 'activity-icon expense'}>
        <Icon size={16} />
      </div>
      <div className="activity-copy">
        <h3>{isSale ? movement.concept.replace('Venta de ', 'Venta ') : movement.concept.replace('Compra de ', 'Compra ')}</h3>
        <p>{isSale ? 'Hace 15 min' : 'Hace 2 horas'} &middot; {movement.channel}</p>
      </div>
      <div className="activity-amount">
        <strong className={isSale ? 'income' : 'expense'}>
          {isSale ? '' : '- '}{formatCurrency(movement.amount)}
        </strong>
        <span>{isSale ? 'Ingreso' : 'Gasto'}</span>
      </div>
    </article>
  );
}

function formatDetailedCurrency(value) {
  return `L ${Number(value || 0).toLocaleString('es-HN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
