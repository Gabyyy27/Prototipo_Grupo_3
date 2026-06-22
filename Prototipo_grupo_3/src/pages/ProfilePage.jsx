import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Header } from '../components/layout/Header.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { useAuth } from '../hooks/useAuth.js';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { profile, updateProfile, updatePassword, logout } = useAuth();
  const [form, setForm] = useState(profile);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [confirmLogout, setConfirmLogout] = useState(false);

  function saveProfile(event) {
    event.preventDefault();
    if (!form.name || !form.email || !form.businessName) {
      setMessage('Completa nombre, correo y nombre del negocio.');
      return;
    }
    updateProfile(form);
    setMessage('Perfil actualizado correctamente.');
  }

  function savePassword() {
    if (password.length < 6) {
      setMessage('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    updatePassword(password);
    setPassword('');
    setMessage('Contraseña actualizada de forma simulada.');
  }

  function closeSession() {
    logout();
    navigate('/welcome');
  }

  return (
    <main className="page">
      <section className="profile-card">
        <div className="avatar">{form.name.slice(0, 1).toUpperCase()}</div>
        <div>
          <h2>{form.businessName}</h2>
          <p>{form.name}</p>
          <Badge tone="success">Chatbot conectado</Badge>
        </div>
      </section>
      <form className="form-card" onSubmit={saveProfile}>
        <Input label="Nombre" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <Input label="Correo" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <Input label="Nombre del negocio" value={form.businessName} onChange={(event) => setForm({ ...form, businessName: event.target.value })} />
        <div className="form-grid two">
          <Input label="Código" value={form.countryCode} onChange={(event) => setForm({ ...form, countryCode: event.target.value })} />
          <Input label="WhatsApp" value={form.whatsappNumber} onChange={(event) => setForm({ ...form, whatsappNumber: event.target.value })} />
        </div>
        <Button type="submit">Guardar perfil</Button>
      </form>
      <Card>
        <h2>Cambiar contraseña</h2>
        <div className="form-stack">
          <Input label="Nueva contraseña" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <Button variant="secondary" onClick={savePassword}>Cambiar contraseña</Button>
        </div>
      </Card>
      <Button variant="danger-outline" onClick={() => setConfirmLogout(true)}>
        <LogOut size={18} /> Cerrar sesión
      </Button>

      {message && (
        <Modal
          title="Perfil"
          onClose={() => setMessage('')}
          actions={<Button onClick={() => setMessage('')}>Entendido</Button>}
        >
          <p>{message}</p>
        </Modal>
      )}
      {confirmLogout && (
        <Modal
          title="Cerrar sesión"
          onClose={() => setConfirmLogout(false)}
          actions={(
            <>
              <Button variant="secondary" onClick={() => setConfirmLogout(false)}>Cancelar</Button>
              <Button variant="danger" onClick={closeSession}>Cerrar sesión</Button>
            </>
          )}
        >
          <p>¿Deseas salir de Contfia?</p>
        </Modal>
      )}
    </main>
  );
}
