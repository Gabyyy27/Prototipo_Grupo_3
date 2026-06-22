import { NavLink } from 'react-router-dom';
import { Home, MessageCircle, Package, User, WalletCards } from 'lucide-react';

const items = [
  { to: '/dashboard', label: 'Inicio', icon: Home },
  { to: '/inventory', label: 'Inventario', icon: Package },
  { to: '/history', label: 'Historial', icon: WalletCards },
  { to: '/chatbot', label: 'Chatbot', icon: MessageCircle },
  { to: '/profile', label: 'Perfil', icon: User },
];

export function BottomNav() {
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
