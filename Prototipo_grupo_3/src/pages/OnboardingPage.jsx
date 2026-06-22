import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Camera, Mic } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Logo } from '../components/layout/Header.jsx';

const slides = [
  {
    variant: 'sales',
    title: 'Registra ventas por WhatsApp',
    text: 'Administrar tu negocio nunca fue tan fácil. Solo envía un mensaje y nosotros hacemos el resto.',
  },
  {
    variant: 'media',
    title: 'Envía audio, texto o imágenes',
    text: 'Nuestra IA avanzada interpreta cualquier formato. Solo cuéntale a Contfia lo que necesitas registrar y nosotros haremos el resto.',
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  function finish() {
    navigate('/welcome');
  }

  function next() {
    if (index === slides.length - 1) finish();
    else setIndex(index + 1);
  }

  return (
    <section className={`onboarding-page onboarding-${slide.variant}`}>
      {slide.variant === 'media' && <MediaVisual />}
      <div className="onboarding-copy">
        <h1>{slide.title}</h1>
        {slide.variant === 'media' ? (
          <p>Nuestra IA avanzada interpreta cualquier formato. Solo cuéntale a <strong>Contfia</strong> lo que necesitas registrar y nosotros haremos el resto.</p>
        ) : (
          <p>{slide.text}</p>
        )}
      </div>
      {slide.variant === 'sales' && <SalesVisual />}
      <div className="onboarding-dots" aria-label={`Pantalla ${index + 1} de ${slides.length}`}>
        {slides.map((item, dotIndex) => (
          <span key={item.title} className={dotIndex === index ? 'active' : ''} />
        ))}
      </div>
      <Button className="onboarding-next" onClick={next}>
        Siguiente {slide.variant === 'media' && <ArrowRight size={17} />}
      </Button>
      <button className="text-button onboarding-skip" type="button" onClick={finish}>Omitir</button>
    </section>
  );
}

function SalesVisual() {
  return (
    <div className="sales-visual">
      <div className="whatsapp-bubble">
        <span>Vendí 3 brownies</span>
        <small>10:45 AM ✓✓</small>
      </div>
      <article className="bot-receipt">
        <header>
          <span className="receipt-logo"><Logo /></span>
          <strong>Contfia</strong>
        </header>
        <p>
          ¡Entendido! He registrado la venta de <strong>3 brownies.</strong> Total: <strong>L 120.00.</strong> Su inventario se ha actualizado.
        </p>
        <footer>
          <small>10:45 AM</small>
          <span>VENTA OK</span>
        </footer>
      </article>
    </div>
  );
}

function MediaVisual() {
  return (
    <>
      <div className="media-visual">
        <div className="media-phone">
          <div className="phone-top" />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="media-options">
        <article>
          <span><Mic size={24} /></span>
          <strong>Audio</strong>
        </article>
        <article>
          <span><Camera size={24} /></span>
          <strong>Imagen</strong>
        </article>
      </div>
    </>
  );
}
