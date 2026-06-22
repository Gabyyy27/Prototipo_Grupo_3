import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { useAuth } from '../hooks/useAuth.js';

export default function WhatsAppVerifyPage() {
  const navigate = useNavigate();
  const { verifyWhatsApp } = useAuth();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [message, setMessage] = useState('');

  function setDigit(index, value) {
    const next = [...code];
    next[index] = value.slice(-1).replace(/\D/g, '');
    setCode(next);
  }

  function submit(event) {
    event.preventDefault();
    if (code.join('').length !== 6) {
      setMessage('Ingresa los 6 dígitos del código.');
      return;
    }
    verifyWhatsApp();
    navigate('/dashboard');
  }

  return (
    <main className="whatsapp-verify-page">
      <header className="whatsapp-link-header verify-header">
        <Link to="/whatsapp-link" aria-label="Volver"><ArrowLeft size={18} /></Link>
        <strong>Contfia</strong>
        <span />
      </header>

      <section className="verify-intro">
        <div className="verify-icon">
          <TrendingUp size={28} />
        </div>
        <h1>Verifica tu número</h1>
        <p>Hemos enviado un código de 6 dígitos al número asociado a tu cuenta de WhatsApp.</p>
      </section>

      <form className="verify-card" onSubmit={submit}>
        <div className="verify-otp-grid">
          {code.map((digit, index) => (
            <input
              key={index}
              value={digit}
              maxLength={1}
              inputMode="numeric"
              aria-label={`Dígito ${index + 1}`}
              onChange={(event) => setDigit(index, event.target.value)}
            />
          ))}
        </div>
        <button className="verify-resend" type="button" onClick={() => setMessage('Código reenviado de forma simulada.')}>
          No recibí el código. Reenviar
        </button>
        <Button className="verify-submit" type="submit">Verificar y Conectar</Button>
      </form>

      <footer className="verify-secure-note">
        <Lock size={12} />
        <span>Conexión cifrada de punto a punto</span>
      </footer>

      {message && (
        <Modal
          title="Verificación"
          onClose={() => setMessage('')}
          actions={<Button onClick={() => setMessage('')}>Entendido</Button>}
        >
          <p>{message}</p>
        </Modal>
      )}
    </main>
  );
}
