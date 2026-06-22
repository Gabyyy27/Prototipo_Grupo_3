import { useState } from 'react';
import { Header } from '../components/layout/Header.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Modal } from '../components/ui/Modal.jsx';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function submit(event) {
    event.preventDefault();
    if (!email) {
      setMessage('Ingresa tu correo electrónico.');
      return;
    }
    setMessage(`Se simuló el envío de recuperación a ${email}.`);
  }

  return (
    <main className="page">
      <Header title="Recuperar contraseña" eyebrow="Cuenta" backTo="/login" />
      <form className="form-card" onSubmit={submit}>
        <Input label="Correo electrónico" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <Button type="submit">Enviar enlace</Button>
      </form>
      {message && (
        <Modal
          title="Recuperación simulada"
          onClose={() => setMessage('')}
          actions={<Button onClick={() => setMessage('')}>Entendido</Button>}
        >
          <p>{message}</p>
        </Modal>
      )}
    </main>
  );
}
