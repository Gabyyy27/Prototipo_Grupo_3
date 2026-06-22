import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Keyboard, Link2, Smartphone, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { useAuth } from '../hooks/useAuth.js';

export default function WhatsAppLinkPage() {
  const navigate = useNavigate();
  const { profile, linkWhatsApp } = useAuth();
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    countryCode: profile.countryCode || '+504',
    whatsappNumber: profile.whatsappNumber || '',
  });

  function submit(event) {
    event.preventDefault();
    if (!form.countryCode || !form.whatsappNumber) {
      setError('Agrega código de país y número de WhatsApp.');
      return;
    }
    linkWhatsApp(form);
    navigate('/whatsapp-verify');
  }

  return (
    <main className="whatsapp-link-page">
      <header className="whatsapp-link-header">
        <Link to="/register" aria-label="Volver"><ArrowLeft size={18} /></Link>
        <strong>Contfia</strong>
        <span />
      </header>

      <section className="whatsapp-hero">
        <div className="whatsapp-phone-art">
          <div className="phone-art-screen">
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>

      <section className="whatsapp-title">
        <h1>Conecta tu negocio a WhatsApp</h1>
        <p>Gestiona tus pedidos, inventario y finanzas directamente desde Whatsapp</p>
      </section>

      <section className="whatsapp-steps">
        <Step icon={Smartphone} title="1. Ingresa" text="Tu número de teléfono" />
        <Step icon={Keyboard} title="2. Recibe" text="Código de verificación" />
        <Step icon={Check} title="3. ¡Listo!" text="Negocio vinculado" done />
      </section>

      <form className="whatsapp-link-card" onSubmit={submit}>
        <label>
          <span>Número de WhatsApp</span>
          <div className="whatsapp-number-field">
            <input
              value={form.countryCode}
              aria-label="Código de país"
              onChange={(event) => setForm({ ...form, countryCode: event.target.value })}
            />
            <input
              value={form.whatsappNumber}
              aria-label="Número de WhatsApp"
              placeholder="9999-9999"
              onChange={(event) => setForm({ ...form, whatsappNumber: event.target.value })}
            />
          </div>
        </label>
        <Button className="whatsapp-link-button" type="submit">
          <Link2 size={16} /> Vincular WhatsApp
        </Button>
        <p>Al vincular, aceptas que Contfia envíe mensajes automáticos para la gestión de tu negocio.</p>
      </form>

      <aside className="whatsapp-privacy">
        <ShieldCheck size={17} />
        <p>No compartiremos tu número con terceros. Tu privacidad y seguridad son nuestra prioridad financiera.</p>
      </aside>

      {error && (
        <Modal
          title="Número incompleto"
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

function Step({ icon: Icon, title, text, done = false }) {
  return (
    <article className={done ? 'done' : ''}>
      <span><Icon size={18} /></span>
      <strong>{title}</strong>
      <p>{text}</p>
    </article>
  );
}
