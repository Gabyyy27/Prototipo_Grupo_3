import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, AtSign, Lock, Mail, RotateCcw, User } from 'lucide-react';
import { Logo } from '../components/layout/Header.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { useAuth } from '../hooks/useAuth.js';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState('');
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
      setError('Completa todos los campos.');
      return;
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!form.terms) {
      setError('Debes aceptar términos y condiciones.');
      return;
    }

    const result = register(form);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate('/whatsapp-link');
  }

  return (
    <main className="register-page">
      <header className="register-brand">
        <Logo wordmark />
      </header>

      <section className="register-card">
        <div className="register-heading">
          <h1>Crear cuenta</h1>
          <p>Ingresa tus datos para comenzar a gestionar tu negocio.</p>
        </div>

        <form className="register-form" onSubmit={submit}>
          <RegisterField
            icon={User}
            label="Nombre completo"
            placeholder="Ej. Juan Pérez"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
          <RegisterField
            icon={Mail}
            label="Correo electrónico"
            type="email"
            placeholder="nombre@empresa.com"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
          <RegisterField
            icon={Lock}
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
          <RegisterField
            icon={RotateCcw}
            label="Confirmar contraseña"
            type="password"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
          />

          <label className="register-terms">
            <input type="checkbox" checked={form.terms} onChange={(event) => setForm({ ...form, terms: event.target.checked })} />
            <span>Acepto los <b>términos y condiciones</b> de servicio y la política de privacidad.</span>
          </label>

          <Button className="register-submit" type="submit">
            Crear cuenta <ArrowRight size={17} />
          </Button>
        </form>

        <div className="register-divider" />
        <p className="register-login">¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
      </section>

      {error && (
        <Modal
          title="Formulario incompleto"
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

function RegisterField({ icon: Icon, label, ...props }) {
  return (
    <label className="register-field">
      <span>{label}</span>
      <div>
        <Icon size={18} />
        <input {...props} />
      </div>
    </label>
  );
}
