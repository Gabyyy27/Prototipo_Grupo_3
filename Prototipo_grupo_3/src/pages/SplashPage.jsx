import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/layout/Header.jsx';

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/onboarding'), 1600);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <section className="splash-page">
      <div className="splash-logo-badge">
        <Logo large />
      </div>
      <h1>Contfia</h1>
      <p>Registra tus ventas sin detener tu negocio</p>
      <div className="loader-track">
        <span />
      </div>
      <strong>Iniciando sistema...</strong>
    </section>
  );
}
