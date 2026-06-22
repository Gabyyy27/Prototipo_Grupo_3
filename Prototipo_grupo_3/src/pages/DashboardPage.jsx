import { Link } from 'react-router-dom';
import { ArrowUpRight, Bell, Check, Target, ShoppingBag, ShoppingCart, UsersRound } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useMovements } from '../hooks/useMovements.js';
import { useProducts } from '../hooks/useProducts.js';
import { useClients } from '../hooks/useClients.js';
import { buildSalesTrend, calculateTotals } from '../utils/calculations.js';
import { filterByDateRange, todayIso } from '../utils/dates.js';
import { formatCurrency } from '../utils/currency.js';
import { Logo } from '../components/layout/Header.jsx';
import { NotificationsPanel } from '../components/notifications/NotificationsPanel.jsx';
import { SalesChart } from '../components/charts/SalesChart.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input, Select } from '../components/ui/Input.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { useNotifications } from '../hooks/useNotifications.js';
import { useState } from 'react';

const ranges = ['Hoy', 'Esta semana', 'Este mes'];
const emptyQuickSale = {
  productId: '',
  quantity: 1,
  unitPrice: '',
  customer: '',
  status: 'paid',
};

export default function DashboardPage() {
  const { profile } = useAuth();
  const { movements, addMovement } = useMovements();
  const { products, registerSaleStock } = useProducts();
  const { addReceivable } = useClients();
  const { notifications, unreadCount, markAsRead, markAllAsRead, addNotification } = useNotifications();
  const [range, setRange] = useState('Hoy');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickSale, setShowQuickSale] = useState(false);
  const [saleSaved, setSaleSaved] = useState(null);
  const [saleError, setSaleError] = useState('');
  const [quickSale, setQuickSale] = useState(emptyQuickSale);
  const filteredMovements = filterByDateRange(movements, range);
  const totals = calculateTotals(filteredMovements);
  const visualTotals = {
    totalSales: totals.totalSales + 12300,
    totalPurchases: totals.totalPurchases + 4000,
    profit: totals.totalSales + 12300 - (totals.totalPurchases + 4000),
  };
  const trendBase = [220, 360, 510, 430, 680, 760, 920];
  const salesTrend = buildSalesTrend(movements).map((item, index) => ({
    ...item,
    sales: Number(item.sales) + trendBase[index],
  }));
  const recent = movements.slice(0, 2);
  const firstName = profile.name === 'Usuario Demo' ? 'Juan' : profile.name.split(' ')[0];

  function openQuickSale() {
    const product = products[0];
    setQuickSale({
      ...emptyQuickSale,
      productId: product?.id || '',
      unitPrice: product?.price || '',
    });
    setSaleError('');
    setShowQuickSale(true);
  }

  function changeProduct(productId) {
    const product = products.find((item) => item.id === productId);
    setQuickSale({
      ...quickSale,
      productId,
      unitPrice: product?.price || '',
    });
  }

  function saveQuickSale(event) {
    event.preventDefault();
    const product = products.find((item) => item.id === quickSale.productId);
    const quantity = Number(quickSale.quantity);
    const unitPrice = Number(quickSale.unitPrice);

    if (!product || quantity <= 0 || unitPrice <= 0) {
      setSaleError('Selecciona un producto e ingresa cantidad y precio validos.');
      return;
    }
    if (quantity > Number(product.stock)) {
      setSaleError(`Solo hay ${product.stock} unidades disponibles.`);
      return;
    }
    if (quickSale.status === 'pending' && !quickSale.customer.trim()) {
      setSaleError('Ingresa el nombre del cliente para crear la cuenta por cobrar.');
      return;
    }

    const total = quantity * unitPrice;
    addMovement({
      id: `movement-${Date.now()}`,
      date: todayIso(),
      concept: `Venta de ${quantity} ${product.name}`,
      productId: product.id,
      productName: product.name,
      customer: quickSale.customer || 'Cliente App',
      amount: total,
      quantity,
      type: 'sale',
      status: quickSale.status,
      channel: 'App',
    });
    registerSaleStock(product.id, quantity);
    if (quickSale.status === 'pending') {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);
      addReceivable({
        name: quickSale.customer.trim(),
        amount: total,
        dueDate: dueDate.toISOString().slice(0, 10),
      });
    }
    addNotification({
      type: 'payment',
      title: quickSale.status === 'pending' ? 'Cuenta por cobrar creada' : 'Venta registrada',
      message: `${quantity} ${product.name} por ${formatCurrency(total)}.`,
    });
    setShowQuickSale(false);
    setSaleSaved(quickSale.status);
    setQuickSale(emptyQuickSale);
  }

  return (
    <main className="page dashboard-page">
      <header className="dashboard-brand">
        <Logo wordmark />
        <button className="dashboard-notification-button" type="button" onClick={() => setShowNotifications(true)} aria-label="Abrir notificaciones">
          <Bell size={20} />
          {unreadCount > 0 && <span>{unreadCount}</span>}
        </button>
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
        <button className="dashboard-quick-sale-button" type="button" onClick={openQuickSale}>
        <ShoppingCart size={18} />
        Registrar venta rapida
      </button>
      <section className="dashboard-management">
        <div className="dashboard-section-row">
          <h2>Gestion financiera</h2>
        </div>
        <div className="dashboard-management-grid">
          <Link to="/clients"><UsersRound size={19} /><span>Clientes y cobros</span></Link>
          <Link to="/budgets"><Target size={19} /><span>Presupuestos y metas</span></Link>
        </div>
      </section>

      <section className="dashboard-chart-card">
        <div className="dashboard-chart-heading">
          <div>
            <span>Ultimos 7 dias</span>
            <h2>Tendencia de ventas</h2>
          </div>
          <strong><ArrowUpRight size={13} />12.5%</strong>
        </div>
        <SalesChart data={salesTrend} />
        <div className="dashboard-chart-footer">
          <span><i />Ventas registradas</span>
          <strong>{formatCurrency(salesTrend.reduce((sum, item) => sum + item.sales, 0))}</strong>
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

      {showQuickSale && (
        <Modal
          title="Registrar venta rapida"
          onClose={() => setShowQuickSale(false)}
          actions={(
            <>
              <Button variant="secondary" type="button" onClick={() => setShowQuickSale(false)}>Cancelar</Button>
              <Button type="submit" form="quick-sale-form">Guardar venta</Button>
            </>
          )}
        >
          <form id="quick-sale-form" className="form-stack" onSubmit={saveQuickSale}>
            <Select label="Producto" value={quickSale.productId} onChange={(event) => changeProduct(event.target.value)}>
              <option value="">Selecciona un producto</option>
              {products.map((product) => (
                <option value={product.id} key={product.id}>{product.name} - Stock {product.stock}</option>
              ))}
            </Select>
            <div className="form-grid two">
              <Input label="Cantidad" type="number" min="1" value={quickSale.quantity} onChange={(event) => setQuickSale({ ...quickSale, quantity: event.target.value })} />
              <Input label="Precio unitario" type="number" min="0" step="0.01" value={quickSale.unitPrice} onChange={(event) => setQuickSale({ ...quickSale, unitPrice: event.target.value })} />
            </div>
            <Input label="Cliente" placeholder="Opcional" value={quickSale.customer} onChange={(event) => setQuickSale({ ...quickSale, customer: event.target.value })} />
            <Select label="Estado" value={quickSale.status} onChange={(event) => setQuickSale({ ...quickSale, status: event.target.value })}>
              <option value="paid">Pagado</option>
              <option value="pending">Pendiente</option>
            </Select>
            <div className="quick-sale-total">
              <span>Total</span>
              <strong>{formatDetailedCurrency(Number(quickSale.quantity || 0) * Number(quickSale.unitPrice || 0))}</strong>
            </div>
            {saleError && <p className="form-error">{saleError}</p>}
          </form>
        </Modal>
      )}

      {saleSaved && (
        <Modal
          title={saleSaved === 'pending' ? 'Cuenta por cobrar creada' : 'Venta registrada'}
          onClose={() => setSaleSaved(null)}
          actions={saleSaved === 'pending' ? (
            <>
              <Button variant="secondary" onClick={() => setSaleSaved(null)}>Cerrar</Button>
              <Link className="button primary" to="/clients" onClick={() => setSaleSaved(null)}>Ver cuentas</Link>
            </>
          ) : <Button onClick={() => setSaleSaved(null)}>Entendido</Button>}
        >
          <p>{saleSaved === 'pending'
            ? 'La venta se agrego automaticamente a Clientes y cuentas por cobrar.'
            : 'La venta, el inventario y el dashboard se actualizaron correctamente.'}</p>
        </Modal>
      )}

      {showNotifications && (
        <NotificationsPanel
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onRead={markAsRead}
          onReadAll={markAllAsRead}
        />
      )}
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
