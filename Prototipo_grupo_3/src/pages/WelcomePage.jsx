import { Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { Logo } from '../components/layout/Header.jsx';

export default function WelcomePage() {
  return (
    <section className="welcome-page">
      <div className="welcome-glow" />
      <div className="welcome-panel">
        <Logo large />
        <h1>&iexcl;Hola! Bienvenid@ a Contf&iacute;a</h1>
        <p>Tu asistente inteligente para la gesti&oacute;n y control de tu negocio.</p>
        <div className="welcome-actions">
          <Link className="button primary welcome-login" to="/login">
            <LogIn size={19} /> Iniciar Sesi&oacute;n
          </Link>
          <Link className="button secondary welcome-register" to="/register">
            <UserPlus size={18} /> Crear Cuenta
          </Link>
        </div>
      </div>
      <footer className="welcome-footer">
        <span>T&eacute;rminos</span>
        <i>&bull;</i>
        <span>Privacidad</span>
      </footer>
    </section>
  );
}
