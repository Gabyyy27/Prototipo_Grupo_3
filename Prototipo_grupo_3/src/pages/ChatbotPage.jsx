import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, ChevronLeft, MoreVertical, Paperclip, Send, Smile } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { ChatMessage } from '../components/chatbot/ChatMessage.jsx';
import { ChatConfirmation } from '../components/chatbot/ChatConfirmation.jsx';
import { Logo } from '../components/layout/Header.jsx';
import { useProducts } from '../hooks/useProducts.js';
import { useMovements } from '../hooks/useMovements.js';
import { parseChatbotMessage } from '../utils/chatbotParser.js';
import { todayIso } from '../utils/dates.js';

const INITIAL_CONFIRMATION_ID = 'initial-sale-confirmation';

function initialSaleMovement() {
  return {
    id: `movement-${Date.now()}`,
    date: todayIso(),
    concept: 'Venta de 3 brownies',
    productId: 'brownie-chocolate',
    productName: 'Brownie de Chocolate',
    customer: 'Cliente WhatsApp',
    amount: 150,
    quantity: 3,
    type: 'sale',
    status: 'paid',
    channel: 'WhatsApp',
  };
}

function currentTime() {
  return new Date().toLocaleTimeString('es-HN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function messageId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function ChatbotPage() {
  const { products, registerSaleStock } = useProducts();
  const { movements, addMovement } = useMovements();
  const chatWindowRef = useRef(null);
  const [input, setInput] = useState('');
  const [notice, setNotice] = useState('');
  const [pendingMovement, setPendingMovement] = useState(initialSaleMovement);
  const [pendingConfirmationId, setPendingConfirmationId] = useState(INITIAL_CONFIRMATION_ID);
  const [messages, setMessages] = useState([
    { id: 'date-today', from: 'system', text: 'HOY' },
    { id: 'initial-user-sale', from: 'user', text: 'Vend\u00ed 3 brownies a L 50 cada uno', time: '10:45 AM' },
    {
      id: INITIAL_CONFIRMATION_ID,
      from: 'bot',
      text: '\u00a1Entendido! He registrado la venta de 3 brownies por un total de L 150.00.\nSu inventario se ha actualizado.\n\u00bfDeseas guardar esta venta?',
      time: '10:45 AM',
      needsConfirmation: true,
    },
  ]);

  useEffect(() => {
    const chatWindow = chatWindowRef.current;
    if (!chatWindow) return;

    chatWindow.scrollTo({
      top: chatWindow.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, pendingConfirmationId]);

  function sendMessage(text) {
    const value = text.trim();
    if (!value) return;
    const result = parseChatbotMessage(value, { products, movements });
    const confirmationId = result.kind === 'confirmation' ? messageId('confirmation') : null;
    setMessages((current) => [
      ...current,
      { id: messageId('user'), from: 'user', text: value, time: currentTime() },
      {
        id: confirmationId || messageId('bot'),
        from: 'bot',
        text: result.response,
        time: currentTime(),
        needsConfirmation: result.kind === 'confirmation',
      },
    ]);
    setPendingMovement(result.kind === 'confirmation' ? result.movement : null);
    setPendingConfirmationId(confirmationId);
    setInput('');
  }

  function submit(event) {
    event.preventDefault();
    sendMessage(input);
  }

  function confirmMovement() {
    if (!pendingMovement) return;
    const confirmationId = pendingConfirmationId;
    addMovement(pendingMovement);
    if (pendingMovement.type === 'sale') {
      registerSaleStock(pendingMovement.productId, pendingMovement.quantity);
    }
    setMessages((current) => [
      ...current.map((message) => (
        message.id === confirmationId ? { ...message, needsConfirmation: false } : message
      )),
      { id: messageId('bot'), from: 'bot', text: 'Movimiento guardado en tu historial.', time: currentTime() },
    ]);
    setPendingMovement(null);
    setPendingConfirmationId(null);
  }

  function editMovement() {
    if (!pendingMovement) return;
    const confirmationId = pendingConfirmationId;
    setInput(pendingMovement.type === 'sale'
      ? 'Vend\u00ed 3 brownies a L 50 cada uno'
      : 'Compr\u00e9 ingredientes por L 300');
    setMessages((current) => current.map((message) => (
      message.id === confirmationId ? { ...message, needsConfirmation: false } : message
    )));
    setPendingMovement(null);
    setPendingConfirmationId(null);
  }

  function cancelMovement() {
    const confirmationId = pendingConfirmationId;
    setPendingMovement(null);
    setPendingConfirmationId(null);
    setMessages((current) => [
      ...current.map((message) => (
        message.id === confirmationId ? { ...message, needsConfirmation: false } : message
      )),
      { id: messageId('bot'), from: 'bot', text: 'Registro cancelado.', time: currentTime() },
    ]);
  }

  return (
    <main className="chatbot-page">
      <header className="chatbot-header">
        <Link to="/dashboard" aria-label="Volver al inicio"><ChevronLeft size={20} /></Link>
        <div className="chatbot-avatar">
          <Logo />
        </div>
        <div className="chatbot-title">
          <h1>Contfia</h1>
          <p>En l&iacute;nea</p>
        </div>
        <button type="button" aria-label="Mas opciones" onClick={() => setNotice('Opciones del chatbot simuladas.')}>
          <MoreVertical size={17} />
        </button>
      </header>

      <section className="whatsapp-chat-window" ref={chatWindowRef}>
        <div className="chat-sparkles" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message}>
            {message.needsConfirmation && pendingMovement && message.id === pendingConfirmationId && (
              <ChatConfirmation
                onConfirm={confirmMovement}
                onEdit={editMovement}
                onCancel={cancelMovement}
              />
            )}
          </ChatMessage>
        ))}
      </section>

      <form className="whatsapp-compose" onSubmit={submit}>
        <button type="button" aria-label="Emoji" onClick={() => setNotice('Selector de emoji simulado.')}>
          <Smile size={17} />
        </button>
        <input value={input} placeholder="Mensaje" onChange={(event) => setInput(event.target.value)} />
        <button type="button" aria-label="Adjuntar" onClick={() => setNotice('Archivo simulado adjuntado.')}>
          <Paperclip size={17} />
        </button>
        <button type={input.trim() ? 'submit' : 'button'} aria-label={input.trim() ? 'Enviar' : 'Camara'} onClick={() => !input.trim() && setNotice('Camara simulada lista.')}>
          {input.trim() ? <Send size={17} /> : <Camera size={17} />}
        </button>
      </form>

      {notice && (
        <Modal
          title="Simulacion"
          onClose={() => setNotice('')}
          actions={<Button onClick={() => setNotice('')}>Entendido</Button>}
        >
          <p>{notice}</p>
        </Modal>
      )}
    </main>
  );
}
