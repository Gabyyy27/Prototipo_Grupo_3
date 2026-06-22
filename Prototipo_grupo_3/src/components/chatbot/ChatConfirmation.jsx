import { CheckCircle2, Pencil, X } from 'lucide-react';

export function ChatConfirmation({ onConfirm, onEdit, onCancel }) {
  return (
    <div className="chat-confirmation">
      <button className="confirm" type="button" onClick={onConfirm}>
        <CheckCircle2 size={14} />
        Confirmar
      </button>
      <div>
        <button className="edit" type="button" onClick={onEdit}>
          <Pencil size={13} />
          Editar
        </button>
        <button className="cancel" type="button" onClick={onCancel}>
          <X size={13} />
          Cancelar
        </button>
      </div>
    </div>
  );
}
