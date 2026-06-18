import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Banknote,
  BarChart3,
  Bot,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Edit3,
  Home,
  Image,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageCircle,
  Mic,
  Package,
  PackagePlus,
  Phone,
  Plus,
  ReceiptText,
  Search,
  Send,
  ShoppingBag,
  Trash2,
  TrendingUp,
  User,
  WalletCards,
  X,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const STORAGE_KEY = 'registrobot.webapp.v2';
const DEMO_EMAIL = 'demo@registrobot.com';
const DEMO_PASSWORD = '123456';

const today = () => new Date().toISOString().slice(0, 10);
const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
};

const initialProducts = [
  {
    id: 'p-brownie',
    name: 'Brownie de Chocolate',
    price: 50,
    cost: 25,
    stock: 15,
    category: 'Repostería',
    sold: 3,
  },
  {
    id: 'p-batido',
    name: 'Batido de Fresa',
    price: 85,
    cost: 40,
    stock: 3,
    category: 'Bebidas',
    sold: 1,
  },
  {
    id: 'p-croissant',
    name: 'Croissant de Mantequilla',
    price: 35,
    cost: 18,
    stock: 20,
    category: 'Panadería',
    sold: 0,
  },
  {
    id: 'p-latte',
    name: 'Iced Latte 12oz',
    price: 65,
    cost: 30,
    stock: 42,
    category: 'Bebidas',
    sold: 0,
  },
];

const initialMovements = [
  {
    id: 'm-1',
    date: today(),
    concept: 'Venta de 3 brownies',
    productId: 'p-brownie',
    productName: 'Brownie de Chocolate',
    client: 'Cliente WhatsApp',
    amount: 150,
    quantity: 3,
    type: 'venta',
    status: 'pagado',
    channel: 'WhatsApp',
    method: 'Efectivo',
  },
  {
    id: 'm-2',
    date: today(),
    concept: 'Compra de harina',
    productId: '',
    productName: 'Harina',
    client: '',
    amount: 200,
    quantity: 1,
    type: 'compra',
    status: 'pagado',
    channel: 'App',
    method: 'Transferencia',
  },
  {
    id: 'm-3',
    date: daysAgo(1),
    concept: 'Venta de 1 batido de fresa',
    productId: 'p-batido',
    productName: 'Batido de Fresa',
    client: 'Ana Rivera',
    amount: 85,
    quantity: 1,
    type: 'venta',
    status: 'pagado',
    channel: 'App',
    method: 'Efectivo',
  },
  {
    id: 'm-4',
    date: daysAgo(2),
    concept: 'Compra de ingredientes',
    productId: '',
    productName: 'Ingredientes',
    client: '',
    amount: 300,
    quantity: 1,
    type: 'compra',
    status: 'pagado',
    channel: 'WhatsApp',
    method: 'Tarjeta',
  },
  {
    id: 'm-5',
    date: daysAgo(3),
    concept: 'Pedido pendiente de repostería',
    productId: 'p-brownie',
    productName: 'Brownie de Chocolate',
    client: 'Carlos Mejía',
    amount: 250,
    quantity: 5,
    type: 'venta',
    status: 'pendiente',
    channel: 'WhatsApp',
    method: 'Transferencia',
  },
];

const seedState = {
  onboardingDone: false,
  session: false,
  users: [
    {
      id: 'u-demo',
      name: 'Usuario Demo',
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      businessName: 'RegistroBot Demo',
    },
  ],
  currentUserId: 'u-demo',
  profile: {
    name: 'Usuario Demo',
    email: DEMO_EMAIL,
    businessName: 'Dulces y Café Luna',
    countryCode: '+504',
    whatsappNumber: '9876-5432',
    chatbotConnected: true,
  },
  products: initialProducts,
  movements: initialMovements,
};

const onboardingScreens = [
  {
    title: 'Registra ventas por WhatsApp',
    text: 'Escribe lo que vendiste y RegistroBot lo convierte en ingresos, clientes e historial.',
    icon: MessageCircle,
    chips: ['Ventas', 'Pagos', 'Clientes'],
  },
  {
    title: 'Envía texto, audio o imágenes',
    text: 'Simula mensajes, notas de voz y fotos para organizar compras, stock y gastos.',
    icon: Bot,
    chips: ['Texto', 'Audio', 'Imagen'],
  },
  {
    title: 'Controla tu negocio en segundos',
    text: 'Consulta ganancias, pagos pendientes, inventario bajo y productos más vendidos.',
    icon: BarChart3,
    chips: ['Dashboard', 'Inventario', 'Flujo'],
  },
];

const paymentMethods = ['Todos', 'Efectivo', 'Transferencia', 'Tarjeta'];
const dateRanges = ['Hoy', 'Esta semana', 'Este mes', 'Personalizado'];

function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function money(value) {
  return `L ${Number(value || 0).toLocaleString('es-HN')}`;
}

function formatDate(date) {
  if (!date) return 'Sin fecha';
  const value = new Date(`${date}T12:00:00`);
  return value.toLocaleDateString('es-HN', { day: '2-digit', month: 'short' });
}

function stockLabel(stock) {
  if (Number(stock) <= 0) return 'Agotado';
  if (Number(stock) <= 5) return 'Bajo';
  return 'Disponible';
}

function stockClass(stock) {
  if (Number(stock) <= 0) return 'overdue';
  if (Number(stock) <= 5) return 'pending';
  return 'paid';
}

function useRegistroState() {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...seedState, ...JSON.parse(stored) } : seedState;
    } catch {
      return seedState;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const patch = (updates) => setState((current) => ({ ...current, ...updates }));
  return [state, setState, patch];
}

function byDateRange(movements, range, customRange = {}) {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 6);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return movements.filter((movement) => {
    const date = new Date(`${movement.date}T12:00:00`);
    if (range === 'Hoy') return movement.date === today();
    if (range === 'Esta semana') return date >= startOfWeek;
    if (range === 'Este mes') return date >= startOfMonth;
    if (range === 'Personalizado') {
      const start = customRange.start ? new Date(`${customRange.start}T00:00:00`) : null;
      const end = customRange.end ? new Date(`${customRange.end}T23:59:59`) : null;
      if (start && date < start) return false;
      if (end && date > end) return false;
      return true;
    }
    return true;
  });
}

function getTotals(movements) {
  const sales = movements.filter((item) => item.type === 'venta');
  const purchases = movements.filter((item) => item.type === 'compra');
  const totalSales = sales.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalPurchases = purchases.reduce((sum, item) => sum + Number(item.amount), 0);
  const pending = sales.filter((item) => item.status === 'pendiente').reduce((sum, item) => sum + Number(item.amount), 0);
  return {
    totalSales,
    totalPurchases,
    profit: totalSales - totalPurchases,
    pending,
  };
}

function trendFromMovements(movements) {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const iso = date.toISOString().slice(0, 10);
    return {
      date: iso,
      label: date.toLocaleDateString('es-HN', { weekday: 'short' }).replace('.', ''),
      ventas: 0,
      compras: 0,
    };
  });

  movements.forEach((movement) => {
    const bucket = days.find((day) => day.date === movement.date);
    if (!bucket) return;
    if (movement.type === 'venta') bucket.ventas += Number(movement.amount);
    if (movement.type === 'compra') bucket.compras += Number(movement.amount);
  });

  return days;
}

function productInitial(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function PhoneShell({ children }) {
  return (
    <div className="app-canvas">
      <div className="phone-shell">{children}</div>
    </div>
  );
}

function Logo({ large = false }) {
  return (
    <div className={large ? 'logo-mark large' : 'logo-mark'}>
      <MessageCircle size={large ? 38 : 22} />
      <Bot size={large ? 20 : 12} className="logo-bot" />
    </div>
  );
}

function AppHeader({ title, subtitle, backTo, action }) {
  return (
    <header className="app-header">
      {backTo ? (
        <Link className="icon-button" to={backTo} aria-label="Volver">
          <ArrowLeft size={20} />
        </Link>
      ) : (
        <Logo />
      )}
      <div className="header-copy">
        <span>{subtitle || 'RegistroBot'}</span>
        <h1>{title}</h1>
      </div>
      {action || <div className="header-spacer" />}
    </header>
  );
}

function AppScreen({ title, subtitle, backTo, children, nav = false, action }) {
  return (
    <main className={`screen ${nav ? 'with-nav' : ''}`}>
      <AppHeader title={title} subtitle={subtitle} backTo={backTo} action={action} />
      {children}
      {nav && <BottomNav />}
    </main>
  );
}

function BottomNav() {
  const items = [
    { to: '/dashboard', label: 'Inicio', icon: Home },
    { to: '/inventory', label: 'Inventario', icon: Package },
    { to: '/history', label: 'Historial', icon: WalletCards },
    { to: '/chatbot', label: 'Chatbot', icon: MessageCircle },
    { to: '/profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="bottom-nav">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Icon size={19} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

function Modal({ title, children, onClose, tone = 'default', actions }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className={`modal-card ${tone}`}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-button small" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {actions && <div className="modal-actions">{actions}</div>}
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <section className="empty-state">
      <div className="empty-icon">
        <Icon size={28} />
      </div>
      <h2>{title}</h2>
      <p>{text}</p>
      {action}
    </section>
  );
}

function Splash({ state }) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!state.onboardingDone) navigate('/onboarding/0');
      else if (state.session) navigate('/dashboard');
      else navigate('/welcome');
    }, 1800);
    return () => clearTimeout(timer);
  }, [navigate, state.onboardingDone, state.session]);

  return (
    <section className="splash-screen">
      <Logo large />
      <h1>RegistroBot</h1>
      <p>Registra tus ventas sin detener tu negocio</p>
      <div className="loader-track">
        <span />
      </div>
      <strong>Iniciando sistema...</strong>
    </section>
  );
}

function Onboarding({ patch }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const index = Number(pathname.split('/').pop()) || 0;
  const current = onboardingScreens[Math.min(index, onboardingScreens.length - 1)];
  const Icon = current.icon;

  function finish() {
    patch({ onboardingDone: true });
    navigate('/welcome');
  }

  function next() {
    if (index >= onboardingScreens.length - 1) finish();
    else navigate(`/onboarding/${index + 1}`);
  }

  return (
    <section className="onboarding-screen">
      <button className="skip-button" onClick={finish}>Omitir</button>
      <div className="progress-dots">
        {onboardingScreens.map((item, dotIndex) => (
          <span key={item.title} className={dotIndex <= index ? 'active' : ''} />
        ))}
      </div>
      <div className="feature-panel">
        <div className="feature-icon">
          <Icon size={44} />
        </div>
        <div className="floating-message left">Venta L 150</div>
        <div className="floating-message right">Stock actualizado</div>
      </div>
      <p className="eyebrow">Paso {index + 1} de {onboardingScreens.length}</p>
      <h1>{current.title}</h1>
      <p>{current.text}</p>
      <div className="chip-row">
        {current.chips.map((chip) => <span key={chip} className="info-chip">{chip}</span>)}
      </div>
      <button className="primary-button" onClick={next}>
        {index >= onboardingScreens.length - 1 ? 'Ir a bienvenida' : 'Siguiente'}
        <ArrowRight size={18} />
      </button>
    </section>
  );
}

function Welcome() {
  return (
    <section className="welcome-screen">
      <div className="welcome-hero">
        <Logo large />
        <div className="hero-card">
          <div className="chat-line bot">Vendí 3 brownies a L 50 cada uno</div>
          <div className="chat-line app">Venta guardada: L 150</div>
          <div className="mini-metric">
            <TrendingUp size={17} />
            <span>Ganancia neta al día</span>
          </div>
        </div>
      </div>
      <div className="welcome-copy">
        <span className="eyebrow">Bienvenido</span>
        <h1>RegistroBot</h1>
        <p>Tu asistente para registrar ventas, compras e inventario desde WhatsApp.</p>
      </div>
      <div className="button-stack">
        <Link className="primary-button" to="/login">Iniciar sesión</Link>
        <Link className="secondary-button" to="/signup">Crear cuenta</Link>
      </div>
    </section>
  );
}

function Login({ state, patch, openModal }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: DEMO_EMAIL, password: DEMO_PASSWORD });

  function submit(event) {
    event.preventDefault();
    if (!form.email || !form.password) {
      openModal('error', 'Formulario incompleto', 'Ingresa tu correo electrónico y contraseña.');
      return;
    }

    const user = state.users.find((item) => item.email === form.email && item.password === form.password);
    if (!user) {
      openModal('error', 'No pudimos iniciar sesión', 'Usa demo@registrobot.com con contraseña 123456 o crea una cuenta nueva.');
      return;
    }

    patch({
      session: true,
      currentUserId: user.id,
      profile: {
        ...state.profile,
        name: user.name,
        email: user.email,
        businessName: user.businessName || state.profile.businessName,
      },
    });
    navigate('/dashboard');
  }

  return (
    <AppScreen title="Iniciar sesión" subtitle="Acceso seguro" backTo="/welcome">
      <form className="form-card" onSubmit={submit}>
        <label>
          Correo electrónico
          <div className="field-with-icon">
            <Mail size={18} />
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </div>
        </label>
        <label>
          Contraseña
          <div className="field-with-icon">
            <KeyRound size={18} />
            <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          </div>
        </label>
        <button className="primary-button" type="submit">Iniciar sesión</button>
      </form>
      <Link className="text-link centered" to="/forgot-password">Olvidé mi contraseña</Link>
      <p className="form-helper">¿No tienes cuenta? <Link to="/signup">Crear cuenta</Link></p>
    </AppScreen>
  );
}

function Signup({ state, setState, openModal }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  function submit(event) {
    event.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      openModal('error', 'Formulario incompleto', 'Completa todos los campos para crear tu cuenta.');
      return;
    }
    if (form.password.length < 6) {
      openModal('error', 'Contraseña muy corta', 'Usa al menos 6 caracteres.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      openModal('error', 'Contraseñas diferentes', 'Confirma la misma contraseña.');
      return;
    }
    if (!form.terms) {
      openModal('error', 'Términos requeridos', 'Acepta los términos y condiciones para continuar.');
      return;
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name: form.name,
      email: form.email,
      password: form.password,
      businessName: 'Mi negocio',
    };

    setState((current) => ({
      ...current,
      users: [...current.users, newUser],
      currentUserId: newUser.id,
      session: true,
      profile: {
        ...current.profile,
        name: form.name,
        email: form.email,
        businessName: 'Mi negocio',
        chatbotConnected: false,
      },
    }));
    navigate('/whatsapp-setup');
  }

  return (
    <AppScreen title="Crear cuenta" subtitle="Nuevo negocio" backTo="/welcome">
      <form className="form-card" onSubmit={submit}>
        <label>
          Nombre completo
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </label>
        <label>
          Correo electrónico
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </label>
        <label>
          Contraseña
          <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        </label>
        <label>
          Confirmar contraseña
          <input type="password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} />
        </label>
        <label className="check-field">
          <input type="checkbox" checked={form.terms} onChange={(event) => setForm({ ...form, terms: event.target.checked })} />
          <span>Acepto términos y condiciones</span>
        </label>
        <button className="primary-button" type="submit">Crear cuenta</button>
      </form>
      <p className="form-helper">¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link></p>
    </AppScreen>
  );
}

function ForgotPassword({ openModal }) {
  const [email, setEmail] = useState('');

  function submit(event) {
    event.preventDefault();
    if (!email) {
      openModal('error', 'Correo requerido', 'Ingresa tu correo para enviar el enlace.');
      return;
    }
    openModal('success', 'Enlace enviado', `Simulamos el envío de recuperación a ${email}.`);
  }

  return (
    <AppScreen title="Recuperar contraseña" subtitle="Cuenta" backTo="/login">
      <form className="form-card" onSubmit={submit}>
        <label>
          Correo electrónico
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <button className="primary-button" type="submit">Enviar enlace</button>
      </form>
    </AppScreen>
  );
}

function WhatsAppSetup({ state, patch, openModal }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    countryCode: state.profile.countryCode || '+504',
    whatsappNumber: state.profile.whatsappNumber || '',
  });

  function submit(event) {
    event.preventDefault();
    if (!form.countryCode || !form.whatsappNumber) {
      openModal('error', 'Número incompleto', 'Agrega código de país y número de WhatsApp.');
      return;
    }
    patch({
      profile: {
        ...state.profile,
        countryCode: form.countryCode,
        whatsappNumber: form.whatsappNumber,
        chatbotConnected: false,
      },
    });
    navigate('/whatsapp-verify');
  }

  return (
    <AppScreen title="Vincular WhatsApp" subtitle="Configuración inicial" backTo="/signup">
      <section className="setup-card">
        <div className="setup-icon"><MessageCircle size={32} /></div>
        <h2>Conecta el número donde recibes pedidos</h2>
        <p>RegistroBot usará esta conexión simulada para convertir mensajes de ventas y compras en registros organizados.</p>
      </section>
      <form className="form-card" onSubmit={submit}>
        <div className="two-columns">
          <label>
            Código
            <input value={form.countryCode} onChange={(event) => setForm({ ...form, countryCode: event.target.value })} />
          </label>
          <label>
            Número de WhatsApp
            <input value={form.whatsappNumber} onChange={(event) => setForm({ ...form, whatsappNumber: event.target.value })} />
          </label>
        </div>
        <button className="primary-button" type="submit">
          Vincular WhatsApp <Phone size={18} />
        </button>
      </form>
    </AppScreen>
  );
}

function WhatsAppVerify({ state, patch, openModal }) {
  const navigate = useNavigate();
  const [code, setCode] = useState(['4', '8', '2', '9', '1', '0']);

  function updateDigit(index, value) {
    const next = [...code];
    next[index] = value.slice(-1).replace(/\D/g, '');
    setCode(next);
  }

  function verify(event) {
    event.preventDefault();
    if (code.join('').length !== 6) {
      openModal('error', 'Código incompleto', 'Ingresa los 6 dígitos enviados por WhatsApp.');
      return;
    }
    patch({ profile: { ...state.profile, chatbotConnected: true } });
    openModal('success', 'WhatsApp conectado', 'Tu chatbot quedó conectado correctamente.');
    navigate('/dashboard');
  }

  return (
    <AppScreen title="Verifica tu número" subtitle="WhatsApp" backTo="/whatsapp-setup">
      <section className="setup-card compact">
        <CheckCircle2 size={34} />
        <h2>Ingresa el código de 6 dígitos</h2>
        <p>Simulamos el envío al {state.profile.countryCode} {state.profile.whatsappNumber}.</p>
      </section>
      <form className="form-card" onSubmit={verify}>
        <div className="otp-grid">
          {code.map((digit, index) => (
            <input
              key={index}
              aria-label={`Dígito ${index + 1}`}
              value={digit}
              inputMode="numeric"
              maxLength={1}
              onChange={(event) => updateDigit(index, event.target.value)}
            />
          ))}
        </div>
        <button className="primary-button" type="submit">Verificar y conectar</button>
      </form>
      <button className="text-button" onClick={() => openModal('success', 'Código reenviado', 'Se simuló el reenvío del código.')}>
        Reenviar código
      </button>
    </AppScreen>
  );
}

function Dashboard({ state, addMovement }) {
  const navigate = useNavigate();
  const [range, setRange] = useState('Hoy');
  const [customRange, setCustomRange] = useState({ start: daysAgo(7), end: today() });
  const [movementModal, setMovementModal] = useState(null);
  const visibleMovements = byDateRange(state.movements, range, customRange);
  const totals = getTotals(visibleMovements);
  const sales = visibleMovements.filter((item) => item.type === 'venta');
  const recent = state.movements.slice(0, 5);
  const trend = trendFromMovements(state.movements);

  return (
    <AppScreen title="Inicio" subtitle={`Hola, ${state.profile.name.split(' ')[0]}`} nav>
      <section className="connection-strip">
        <span className="pulse-dot" />
        <div>
          <strong>WhatsApp conectado</strong>
          <p>{state.profile.countryCode} {state.profile.whatsappNumber}</p>
        </div>
        <CheckCircle2 size={20} />
      </section>

      <div className="segmented range-segment">
        {dateRanges.map((item) => (
          <button key={item} className={range === item ? 'active' : ''} onClick={() => setRange(item)}>{item}</button>
        ))}
      </div>
      {range === 'Personalizado' && (
        <div className="custom-range">
          <input type="date" value={customRange.start} onChange={(event) => setCustomRange({ ...customRange, start: event.target.value })} />
          <input type="date" value={customRange.end} onChange={(event) => setCustomRange({ ...customRange, end: event.target.value })} />
        </div>
      )}

      <section className="metric-grid">
        <MetricCard icon={Banknote} label="Ventas totales" value={money(totals.totalSales)} tone="blue" />
        <MetricCard icon={ShoppingBag} label="Gastos o compras" value={money(totals.totalPurchases)} tone="cyan" />
        <MetricCard icon={TrendingUp} label="Ganancias" value={money(totals.profit)} tone="green" />
        <MetricCard icon={Clock} label="Pagos pendientes" value={money(totals.pending)} tone="red" />
      </section>

      <section className="card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Tendencia de ventas</p>
            <h2>{money(totals.totalSales)}</h2>
          </div>
          <BarChart3 size={22} />
        </div>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0052cc" stopOpacity={0.34} />
                  <stop offset="95%" stopColor="#0052cc" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e1e2e4" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip formatter={(value) => money(value)} />
              <Area type="monotone" dataKey="ventas" stroke="#0052cc" strokeWidth={3} fill="url(#salesGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="quick-actions">
        <QuickAction icon={DollarSign} label="Registrar venta" onClick={() => setMovementModal('venta')} />
        <QuickAction icon={ShoppingBag} label="Registrar compra" onClick={() => setMovementModal('compra')} />
        <QuickAction icon={ReceiptText} label="Ver historial" onClick={() => navigate('/history')} />
        <QuickAction icon={MessageCircle} label="Abrir chatbot" onClick={() => navigate('/chatbot')} />
        <QuickAction icon={PackagePlus} label="Agregar producto" onClick={() => navigate('/inventory?new=1')} />
      </section>

      <section className="card">
        <div className="section-heading">
          <h2>Actividad reciente</h2>
          <Link className="mini-link" to="/history">Ver todo</Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState icon={ReceiptText} title="Sin ventas todavía" text="Registra una venta desde el chatbot o las acciones rápidas." />
        ) : (
          <div className="list-stack">
            {recent.map((movement) => <MovementRow key={movement.id} movement={movement} />)}
          </div>
        )}
      </section>

      {sales.length === 0 && (
        <EmptyState
          icon={Banknote}
          title="No hay ventas en este rango"
          text="Cuando registres una venta aparecerá aquí y actualizará tus métricas."
        />
      )}

      {movementModal && (
        <MovementFormModal
          type={movementModal}
          products={state.products}
          onClose={() => setMovementModal(null)}
          onSave={(movement) => {
            addMovement(movement, { showSuccess: true });
            setMovementModal(null);
          }}
        />
      )}
    </AppScreen>
  );
}

function MetricCard({ icon: Icon, label, value, tone }) {
  return (
    <article className={`metric-card ${tone}`}>
      <div className="metric-icon"><Icon size={19} /></div>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function QuickAction({ icon: Icon, label, onClick }) {
  return (
    <button className="quick-action" onClick={onClick}>
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
}

function MovementFormModal({ type, products, onSave, onClose }) {
  const isSale = type === 'venta';
  const defaultProduct = isSale ? products[0]?.id || '' : '';
  const [form, setForm] = useState({
    productId: defaultProduct,
    concept: isSale ? products[0]?.name || '' : 'Compra de insumos',
    client: isSale ? 'Cliente app' : '',
    amount: isSale ? products[0]?.price || 0 : 100,
    quantity: 1,
    status: isSale ? 'pagado' : 'pagado',
    channel: 'App',
    method: 'Efectivo',
  });

  function syncProduct(productId) {
    const product = products.find((item) => item.id === productId);
    if (!product) return setForm({ ...form, productId, concept: '', amount: 0 });
    setForm({
      ...form,
      productId,
      concept: product.name,
      amount: product.price * Number(form.quantity || 1),
    });
  }

  function submit(event) {
    event.preventDefault();
    if (!form.concept || Number(form.amount) <= 0) return;
    const product = products.find((item) => item.id === form.productId);
    onSave({
      id: `m-${Date.now()}`,
      date: today(),
      concept: isSale ? `Venta de ${form.quantity} ${form.concept}` : form.concept,
      productId: product?.id || '',
      productName: product?.name || form.concept,
      client: form.client,
      amount: Number(form.amount),
      quantity: Number(form.quantity),
      type,
      status: form.status,
      channel: form.channel,
      method: form.method,
    });
  }

  return (
    <Modal title={isSale ? 'Registrar venta' : 'Registrar compra'} onClose={onClose}>
      <form className="modal-form" onSubmit={submit}>
        {isSale ? (
          <label>
            Producto
            <select value={form.productId} onChange={(event) => syncProduct(event.target.value)}>
              {products.map((product) => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
          </label>
        ) : (
          <label>
            Concepto
            <input value={form.concept} onChange={(event) => setForm({ ...form, concept: event.target.value })} />
          </label>
        )}
        <div className="two-columns">
          <label>
            Cantidad
            <input type="number" min="1" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} />
          </label>
          <label>
            Monto
            <input type="number" min="1" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} />
          </label>
        </div>
        {isSale && (
          <label>
            Cliente
            <input value={form.client} onChange={(event) => setForm({ ...form, client: event.target.value })} />
          </label>
        )}
        <div className="two-columns">
          <label>
            Estado
            <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
              <option value="pagado">Pagado</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </label>
          <label>
            Método
            <select value={form.method} onChange={(event) => setForm({ ...form, method: event.target.value })}>
              <option>Efectivo</option>
              <option>Transferencia</option>
              <option>Tarjeta</option>
            </select>
          </label>
        </div>
        <button className="primary-button" type="submit">Guardar movimiento</button>
      </form>
    </Modal>
  );
}

function Inventory({ state, setState, openModal }) {
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [modal, setModal] = useState(location.search.includes('new=1') ? { type: 'create' } : null);
  const categories = ['Todos', ...Array.from(new Set(state.products.map((item) => item.category)))];
  const products = state.products.filter((product) => {
    const matchesQuery = normalize(product.name).includes(normalize(query));
    const matchesCategory = category === 'Todos' || product.category === category;
    return matchesQuery && matchesCategory;
  });

  function saveProduct(product) {
    setState((current) => {
      const exists = current.products.some((item) => item.id === product.id);
      return {
        ...current,
        products: exists
          ? current.products.map((item) => item.id === product.id ? product : item)
          : [{ ...product, id: `p-${Date.now()}`, sold: 0 }, ...current.products],
      };
    });
    setModal(null);
    openModal('success', 'Producto guardado', 'El inventario se actualizó correctamente.');
  }

  function deleteProduct(product) {
    setState((current) => ({
      ...current,
      products: current.products.filter((item) => item.id !== product.id),
    }));
    setModal(null);
    openModal('success', 'Producto eliminado', 'El producto fue eliminado del inventario.');
  }

  return (
    <AppScreen
      title="Inventario"
      subtitle="Productos"
      nav
      action={<button className="icon-button primary" onClick={() => setModal({ type: 'create' })} aria-label="Agregar producto"><Plus size={20} /></button>}
    >
      <div className="search-field">
        <Search size={18} />
        <input placeholder="Buscar producto" value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>
      <div className="filter-scroll">
        {categories.map((item) => (
          <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>
        ))}
      </div>
      {products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No hay productos"
          text="Agrega productos para controlar stock, precios y costos."
          action={<button className="primary-button" onClick={() => setModal({ type: 'create' })}>Agregar producto</button>}
        />
      ) : (
        <div className="product-list">
          {products.map((product) => (
            <button key={product.id} className="product-row" onClick={() => setModal({ type: 'detail', product })}>
              <div className="product-image">{productInitial(product.name)}</div>
              <div className="product-copy">
                <h3>{product.name}</h3>
                <p>{product.category}</p>
                <span>{money(product.price)} venta · {money(product.cost)} costo</span>
              </div>
              <div className="product-side">
                <strong>{product.stock}</strong>
                <span className={`status-chip ${stockClass(product.stock)}`}>{stockLabel(product.stock)}</span>
              </div>
            </button>
          ))}
        </div>
      )}
      <button className="floating-action" onClick={() => setModal({ type: 'create' })}>
        <Plus size={20} />
      </button>

      {modal?.type === 'create' && <ProductFormModal onClose={() => setModal(null)} onSave={saveProduct} />}
      {modal?.type === 'edit' && <ProductFormModal product={modal.product} onClose={() => setModal(null)} onSave={saveProduct} />}
      {modal?.type === 'detail' && (
        <ProductDetailModal
          product={modal.product}
          onClose={() => setModal(null)}
          onEdit={() => setModal({ type: 'edit', product: modal.product })}
          onDelete={() => setModal({ type: 'delete', product: modal.product })}
        />
      )}
      {modal?.type === 'delete' && (
        <Modal
          title="Eliminar producto"
          tone="danger"
          onClose={() => setModal(null)}
          actions={(
            <>
              <button className="secondary-button" onClick={() => setModal(null)}>Cancelar</button>
              <button className="danger-button" onClick={() => deleteProduct(modal.product)}>Eliminar</button>
            </>
          )}
        >
          <p>¿Deseas eliminar {modal.product.name}? Esta acción solo afecta los datos simulados.</p>
        </Modal>
      )}
    </AppScreen>
  );
}

function ProductFormModal({ product, onSave, onClose }) {
  const [form, setForm] = useState(product || {
    name: '',
    price: 0,
    cost: 0,
    stock: 0,
    category: 'Repostería',
    sold: 0,
  });

  function submit(event) {
    event.preventDefault();
    if (!form.name || !form.category || Number(form.price) <= 0) return;
    onSave({
      ...form,
      price: Number(form.price),
      cost: Number(form.cost),
      stock: Number(form.stock),
    });
  }

  return (
    <Modal title={product ? 'Editar producto' : 'Agregar producto'} onClose={onClose}>
      <form className="modal-form" onSubmit={submit}>
        <label>
          Nombre del producto
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </label>
        <label>
          Categoría
          <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
        </label>
        <div className="two-columns">
          <label>
            Precio
            <input type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
          </label>
          <label>
            Costo
            <input type="number" value={form.cost} onChange={(event) => setForm({ ...form, cost: event.target.value })} />
          </label>
        </div>
        <label>
          Stock
          <input type="number" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} />
        </label>
        <button className="primary-button" type="submit">Guardar producto</button>
      </form>
    </Modal>
  );
}

function ProductDetailModal({ product, onClose, onEdit, onDelete }) {
  return (
    <Modal title="Detalle de producto" onClose={onClose}>
      <div className="product-detail">
        <div className="product-image large">{productInitial(product.name)}</div>
        <h2>{product.name}</h2>
        <span className={`status-chip ${stockClass(product.stock)}`}>{stockLabel(product.stock)}</span>
        <div className="detail-grid">
          <Detail label="Precio" value={money(product.price)} />
          <Detail label="Costo" value={money(product.cost)} />
          <Detail label="Stock" value={product.stock} />
          <Detail label="Categoría" value={product.category} />
        </div>
        <div className="modal-actions inline">
          <button className="secondary-button" onClick={onEdit}><Edit3 size={17} /> Editar</button>
          <button className="danger-button" onClick={onDelete}><Trash2 size={17} /> Eliminar</button>
        </div>
      </div>
    </Modal>
  );
}

function History({ state }) {
  const [tab, setTab] = useState('Ventas');
  const [range, setRange] = useState('Esta semana');
  const [customRange, setCustomRange] = useState({ start: daysAgo(7), end: today() });
  const [type, setType] = useState('Todos');
  const [method, setMethod] = useState('Todos');
  const [detail, setDetail] = useState(null);
  const rangeMovements = byDateRange(state.movements, range, customRange);
  const filtered = rangeMovements.filter((movement) => {
    const tabOk = tab === 'Ventas' ? movement.type === 'venta' : tab === 'Compras' ? movement.type === 'compra' : true;
    const typeOk = type === 'Todos' || movement.type === type.toLowerCase();
    const methodOk = method === 'Todos' || movement.method === method;
    return tabOk && typeOk && methodOk;
  });
  const totals = getTotals(rangeMovements);
  const chart = trendFromMovements(state.movements);
  const topProducts = state.products
    .filter((product) => product.sold > 0)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 3);

  return (
    <AppScreen title="Historial" subtitle="Finanzas" nav>
      <div className="tabs">
        {['Ventas', 'Compras', 'Flujo'].map((item) => (
          <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item}</button>
        ))}
      </div>

      <div className="filter-grid">
        <select value={range} onChange={(event) => setRange(event.target.value)}>
          {dateRanges.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={type} onChange={(event) => setType(event.target.value)}>
          <option>Todos</option>
          <option>Venta</option>
          <option>Compra</option>
        </select>
        <select value={method} onChange={(event) => setMethod(event.target.value)}>
          {paymentMethods.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      {range === 'Personalizado' && (
        <div className="custom-range">
          <input type="date" value={customRange.start} onChange={(event) => setCustomRange({ ...customRange, start: event.target.value })} />
          <input type="date" value={customRange.end} onChange={(event) => setCustomRange({ ...customRange, end: event.target.value })} />
        </div>
      )}

      {tab === 'Flujo' ? (
        <section className="flow-panel">
          <div className="metric-grid">
            <MetricCard icon={Banknote} label="Total vendido" value={money(totals.totalSales)} tone="blue" />
            <MetricCard icon={ShoppingBag} label="Total gastado" value={money(totals.totalPurchases)} tone="cyan" />
            <MetricCard icon={TrendingUp} label="Ganancia neta" value={money(totals.profit)} tone="green" />
            <MetricCard icon={Clock} label="Pendiente" value={money(totals.pending)} tone="red" />
          </div>
          <section className="card premium-card">
            <div className="section-heading">
              <h2>Flujo premium</h2>
              <span className="status-chip paid">Resumen</span>
            </div>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart}>
                  <CartesianGrid stroke="#e1e2e4" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip formatter={(value) => money(value)} />
                  <Bar dataKey="ventas" fill="#0052cc" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="compras" fill="#00b8d9" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
          <section className="card">
            <h2>Productos más vendidos</h2>
            {topProducts.length === 0 ? (
              <EmptyState icon={Package} title="Sin productos vendidos" text="Registra ventas para generar este ranking." />
            ) : (
              <div className="list-stack">
                {topProducts.map((product) => (
                  <div className="ranking-row" key={product.id}>
                    <div className="product-image small">{productInitial(product.name)}</div>
                    <div>
                      <strong>{product.name}</strong>
                      <p>{product.sold} unidades vendidas</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </section>
      ) : (
        <section className="list-stack">
          {filtered.length === 0 ? (
            <EmptyState
              icon={ReceiptText}
              title={tab === 'Ventas' ? 'No hay ventas' : 'No hay compras'}
              text="Los movimientos aparecerán aquí cuando los registres."
            />
          ) : (
            filtered.map((movement) => (
              <button className="movement-button" key={movement.id} onClick={() => setDetail(movement)}>
                <MovementRow movement={movement} />
              </button>
            ))
          )}
        </section>
      )}

      {detail && (
        <Modal title="Detalle del movimiento" onClose={() => setDetail(null)}>
          <div className="detail-grid full">
            <Detail label="Fecha" value={formatDate(detail.date)} />
            <Detail label="Concepto" value={detail.concept} />
            <Detail label="Cliente" value={detail.client || 'No aplica'} />
            <Detail label="Monto" value={money(detail.amount)} />
            <Detail label="Tipo" value={detail.type} />
            <Detail label="Estado" value={detail.status} />
            <Detail label="Método" value={detail.method} />
            <Detail label="Canal" value={detail.channel} />
          </div>
        </Modal>
      )}
    </AppScreen>
  );
}

function MovementRow({ movement }) {
  const isSale = movement.type === 'venta';
  return (
    <article className="movement-row">
      <div className={`movement-icon ${isSale ? 'sale' : 'purchase'}`}>
        {isSale ? <Banknote size={20} /> : <ShoppingBag size={20} />}
      </div>
      <div className="movement-copy">
        <h3>{movement.productName || movement.concept}</h3>
        <p>{formatDate(movement.date)} · {movement.client || movement.channel}</p>
      </div>
      <div className="movement-side">
        <strong className={isSale ? 'positive' : 'negative'}>{isSale ? '+' : '-'}{money(movement.amount)}</strong>
        <span className={`status-chip ${movement.status === 'pagado' ? 'paid' : 'pending'}`}>{movement.status}</span>
      </div>
    </article>
  );
}

function Chatbot({ state, addMovement, openModal }) {
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(null);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hola, soy RegistroBot. Escríbeme una venta, compra o pregunta sobre tu negocio.' },
  ]);

  const addBot = (text, extra = {}) => setMessages((current) => [...current, { from: 'bot', text, ...extra }]);
  const addUser = (text) => setMessages((current) => [...current, { from: 'user', text }]);

  function processMessage(raw) {
    const text = raw.trim();
    if (!text) return;
    addUser(text);
    const normalized = normalize(text);

    if (normalized.includes('vendi') && normalized.includes('brownie')) {
      const movement = {
        id: `m-${Date.now()}`,
        date: today(),
        concept: 'Venta de 3 brownies',
        productId: 'p-brownie',
        productName: 'Brownie de Chocolate',
        client: 'Cliente WhatsApp',
        amount: 150,
        quantity: 3,
        type: 'venta',
        status: 'pagado',
        channel: 'WhatsApp',
        method: 'Efectivo',
      };
      setPending(movement);
      addBot('Detecté una venta: 3 brownies, total L 150. ¿Deseas guardarla?', { actions: true });
    } else if (normalized.includes('compre') && normalized.includes('ingredientes')) {
      const movement = {
        id: `m-${Date.now()}`,
        date: today(),
        concept: 'Compra de ingredientes',
        productId: '',
        productName: 'Ingredientes',
        client: '',
        amount: 300,
        quantity: 1,
        type: 'compra',
        status: 'pagado',
        channel: 'WhatsApp',
        method: 'Efectivo',
      };
      setPending(movement);
      addBot('Detecté una compra: ingredientes, total L 300. ¿Deseas guardarla?', { actions: true });
    } else if (normalized.includes('precio') && normalized.includes('brownie')) {
      const product = state.products.find((item) => normalize(item.name).includes('brownie'));
      addBot(product ? `El precio del brownie es ${money(product.price)}.` : 'No encontré brownie en el inventario.');
    } else if (normalized.includes('cuanto vendi') || normalized.includes('resumen de hoy')) {
      const total = state.movements
        .filter((item) => item.type === 'venta' && item.date === today())
        .reduce((sum, item) => sum + Number(item.amount), 0);
      addBot(`Hoy llevas vendido ${money(total)}.`);
    } else if (normalized.includes('ultima venta')) {
      const sale = state.movements.find((item) => item.type === 'venta');
      addBot(sale ? `Tu última venta fue ${sale.productName}, por ${money(sale.amount)}, estado ${sale.status}.` : 'Aún no hay ventas registradas.');
    } else if (normalized.includes('pulseras') && normalized.includes('inventario')) {
      const product = state.products.find((item) => normalize(item.name).includes('pulsera'));
      addBot(product ? `Tienes ${product.stock} pulseras en inventario.` : 'No tienes pulseras registradas en inventario. Puedes agregarlas desde Inventario.');
    } else {
      addBot('Puedo registrar ventas, compras, consultar precios, inventario y resumen del día.');
    }
    setInput('');
  }

  function submit(event) {
    event.preventDefault();
    processMessage(input);
  }

  function confirmPending() {
    if (!pending) return;
    addMovement(pending, { showSuccess: true });
    addBot(`${pending.type === 'venta' ? 'Venta' : 'Compra'} guardada. Dashboard e historial actualizados.`);
    setPending(null);
  }

  return (
    <AppScreen title="Chatbot" subtitle="Simulación WhatsApp" nav>
      <section className="whatsapp-status">
        <span className="pulse-dot" />
        <div>
          <strong>Chatbot conectado</strong>
          <p>Mensajes simulados, sin API real de WhatsApp</p>
        </div>
      </section>
      <div className="quick-chat">
        <button onClick={() => setInput('Vendí 3 brownies a L 50 cada uno')}>Registrar venta</button>
        <button onClick={() => setInput('Compré ingredientes por L 300')}>Registrar compra</button>
        <button onClick={() => setInput('¿Cuál es el precio del brownie?')}>Consultar precio</button>
        <button onClick={() => setInput('¿Cuánto vendí hoy?')}>Ver resumen de hoy</button>
      </div>
      <section className="chat-panel">
        {messages.map((message, index) => (
          <div key={`${message.text}-${index}`} className={`chat-bubble ${message.from}`}>
            <p>{message.text}</p>
            {message.actions && pending && (
              <div className="chat-actions">
                <button onClick={confirmPending}>Confirmar</button>
                <button onClick={() => {
                  setInput(pending.type === 'venta' ? 'Vendí 3 brownies a L 50 cada uno' : 'Compré ingredientes por L 300');
                  setPending(null);
                }}>Editar</button>
                <button onClick={() => {
                  setPending(null);
                  addBot('Registro cancelado.');
                }}>Cancelar</button>
              </div>
            )}
          </div>
        ))}
      </section>
      <form className="chat-compose" onSubmit={submit}>
        <button type="button" className="icon-button" onClick={() => openModal('success', 'Audio simulado', 'Se simuló el envío de una nota de voz.')}>
          <Mic size={18} />
        </button>
        <button type="button" className="icon-button" onClick={() => openModal('success', 'Imagen simulada', 'Se simuló el envío de una imagen.')}>
          <Image size={18} />
        </button>
        <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Escribe un mensaje" />
        <button className="icon-button primary" type="submit" aria-label="Enviar"><Send size={18} /></button>
      </form>
    </AppScreen>
  );
}

function Profile({ state, setState, openModal }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(state.profile);
  const [passwords, setPasswords] = useState({ current: '', next: '' });
  const [logoutOpen, setLogoutOpen] = useState(false);

  function saveProfile(event) {
    event.preventDefault();
    if (!form.name || !form.email || !form.businessName) {
      openModal('error', 'Perfil incompleto', 'Completa nombre, correo y nombre del negocio.');
      return;
    }
    setState((current) => ({ ...current, profile: form }));
    openModal('success', 'Perfil actualizado', 'Los cambios se guardaron en localStorage.');
  }

  function changePassword() {
    if (!passwords.next || passwords.next.length < 6) {
      openModal('error', 'Contraseña inválida', 'La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setState((current) => ({
      ...current,
      users: current.users.map((user) => user.id === current.currentUserId ? { ...user, password: passwords.next } : user),
    }));
    setPasswords({ current: '', next: '' });
    openModal('success', 'Contraseña actualizada', 'El cambio fue simulado correctamente.');
  }

  function logout() {
    setState((current) => ({ ...current, session: false }));
    setLogoutOpen(false);
    navigate('/welcome');
  }

  return (
    <AppScreen title="Perfil" subtitle="Cuenta" nav>
      <section className="profile-summary">
        <div className="avatar">{form.name.slice(0, 1).toUpperCase()}</div>
        <div>
          <h2>{form.businessName}</h2>
          <p>{form.name}</p>
          <span className="status-chip paid">Chatbot conectado</span>
        </div>
      </section>
      <form className="form-card" onSubmit={saveProfile}>
        <label>
          Nombre
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </label>
        <label>
          Correo
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </label>
        <label>
          Nombre del negocio
          <input value={form.businessName} onChange={(event) => setForm({ ...form, businessName: event.target.value })} />
        </label>
        <div className="two-columns">
          <label>
            Código
            <input value={form.countryCode} onChange={(event) => setForm({ ...form, countryCode: event.target.value })} />
          </label>
          <label>
            WhatsApp
            <input value={form.whatsappNumber} onChange={(event) => setForm({ ...form, whatsappNumber: event.target.value })} />
          </label>
        </div>
        <button className="primary-button" type="submit">Guardar cambios</button>
      </form>

      <section className="card">
        <h2>Cambiar contraseña</h2>
        <div className="form-grid">
          <input type="password" placeholder="Contraseña actual" value={passwords.current} onChange={(event) => setPasswords({ ...passwords, current: event.target.value })} />
          <input type="password" placeholder="Nueva contraseña" value={passwords.next} onChange={(event) => setPasswords({ ...passwords, next: event.target.value })} />
          <button className="secondary-button" onClick={changePassword}>Cambiar contraseña</button>
        </div>
      </section>

      <button className="danger-outline-button" onClick={() => setLogoutOpen(true)}>
        <LogOut size={18} /> Cerrar sesión
      </button>

      {logoutOpen && (
        <Modal
          title="Cerrar sesión"
          onClose={() => setLogoutOpen(false)}
          actions={(
            <>
              <button className="secondary-button" onClick={() => setLogoutOpen(false)}>Cancelar</button>
              <button className="danger-button" onClick={logout}>Cerrar sesión</button>
            </>
          )}
        >
          <p>¿Deseas salir de RegistroBot?</p>
        </Modal>
      )}
    </AppScreen>
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

export default function App() {
  const [state, setState, patch] = useRegistroState();
  const [globalModal, setGlobalModal] = useState(null);

  function openModal(type, title, text) {
    setGlobalModal({ type, title, text });
  }

  function addMovement(movement, options = {}) {
    setState((current) => {
      const nextProducts = current.products.map((product) => {
        if (movement.type !== 'venta' || product.id !== movement.productId) return product;
        return {
          ...product,
          stock: Math.max(0, Number(product.stock) - Number(movement.quantity || 1)),
          sold: Number(product.sold || 0) + Number(movement.quantity || 1),
        };
      });
      return {
        ...current,
        products: nextProducts,
        movements: [movement, ...current.movements],
      };
    });
    if (options.showSuccess) {
      openModal('success', movement.type === 'venta' ? 'Venta registrada' : 'Compra registrada', 'Dashboard e historial financiero actualizados.');
    }
  }

  return (
    <PhoneShell>
      <Routes>
        <Route path="/" element={<Splash state={state} />} />
        <Route path="/onboarding/:step" element={<Onboarding patch={patch} />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login state={state} patch={patch} openModal={openModal} />} />
        <Route path="/signup" element={<Signup state={state} setState={setState} openModal={openModal} />} />
        <Route path="/forgot-password" element={<ForgotPassword openModal={openModal} />} />
        <Route path="/whatsapp-setup" element={<WhatsAppSetup state={state} patch={patch} openModal={openModal} />} />
        <Route path="/whatsapp-verify" element={<WhatsAppVerify state={state} patch={patch} openModal={openModal} />} />
        <Route path="/dashboard" element={<Dashboard state={state} addMovement={addMovement} />} />
        <Route path="/inventory" element={<Inventory state={state} setState={setState} openModal={openModal} />} />
        <Route path="/history" element={<History state={state} />} />
        <Route path="/chatbot" element={<Chatbot state={state} addMovement={addMovement} openModal={openModal} />} />
        <Route path="/profile" element={<Profile state={state} setState={setState} openModal={openModal} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {globalModal && (
        <Modal
          title={globalModal.title}
          tone={globalModal.type === 'error' ? 'danger' : 'default'}
          onClose={() => setGlobalModal(null)}
          actions={<button className="primary-button" onClick={() => setGlobalModal(null)}>Entendido</button>}
        >
          <p>{globalModal.text}</p>
        </Modal>
      )}
    </PhoneShell>
  );
}
