import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import contfiaMark from '../../assets/images/contfia-mark.png';
import contfiaWordmark from '../../assets/images/contfia-wordmark.png';

export function Logo({ large = false, wordmark = false }) {
  return (
    <img
      className={`logo-mark ${large ? 'large' : ''} ${wordmark ? 'wordmark' : ''}`.trim()}
      src={wordmark ? contfiaWordmark : contfiaMark}
      alt="Contfia"
    />
  );
}

export function Header({ title, eyebrow = 'Contfia', backTo, action }) {
  return (
    <header className="app-header">
      {backTo ? (
        <Link className="icon-button" to={backTo} aria-label="Volver">
          <ArrowLeft size={20} />
        </Link>
      ) : (
        <Logo />
      )}
      <div className="header-copy">
        <span>{eyebrow}</span>
        <h1>{title}</h1>
      </div>
      {action || <div className="header-spacer" />}
    </header>
  );
}
