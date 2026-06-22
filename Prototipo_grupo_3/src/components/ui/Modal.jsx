import { X } from 'lucide-react';

export function Modal({ title, children, actions, onClose, tone = 'default' }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className={`modal-card ${tone}`}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="icon-button small" type="button" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>
        <div className="modal-content">{children}</div>
        {actions && <div className="modal-actions">{actions}</div>}
      </div>
    </div>
  );
}
