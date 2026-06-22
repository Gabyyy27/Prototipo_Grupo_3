import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, Lock, Mail } from 'lucide-react';
import { Logo } from '../components/layout/Header.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { useAuth } from '../hooks/useAuth.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: 'demo@contfia.com', password: '123456' });
  const [error, setError] = useState('');

  function submit(event) {
    event.preventDefault();
    if (!form.email || !form.password) {
      setError('Ingresa correo electrónico y contraseña.');
      return;
    }

    const result = login(form.email, form.password);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate('/dashboard');
  }

  return (
    <main className="login-page">
      <header className="auth-brand">
        <Logo wordmark />
      </header>

      <section className="login-card">
        <div className="login-heading">
          <h1>Bienvenido</h1>
          <p>Gestiona tus finanzas con claridad y control total.</p>
        </div>

        <form className="login-form" onSubmit={submit}>
          <label>
            <span>Correo</span>
            <div className="login-input">
              <Mail size={18} />
              <input
                type="email"
                placeholder="ejemplo@empresa.com"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </div>
          </label>

          <label>
            <span className="label-row">
              Contraseña
              <Link to="/forgot-password">Olvidé mi contraseña</Link>
            </span>
            <div className="login-input">
              <Lock size={18} />
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
              />
              <Eye size={17} />
            </div>
          </label>

          <Button className="login-submit" type="submit">
            Iniciar Sesión <ArrowRight size={18} />
          </Button>
        </form>

        <p className="login-register">¿No tienes una cuenta? <Link to="/register">Crear cuenta</Link></p>


        
      </section>

      {error && (
        <Modal
          title="No pudimos continuar"
          tone="danger"
          onClose={() => setError('')}
          actions={<Button onClick={() => setError('')}>Entendido</Button>}
        >
          <p>{error}</p>
        </Modal>
      )}
    </main>
  );
}
