import { Banknote, ShoppingBag } from 'lucide-react';
import { Badge } from '../ui/Badge.jsx';
import { formatCurrency } from '../../utils/currency.js';
import { formatDate } from '../../utils/dates.js';

export function MovementCard({ movement, onClick }) {
  const isSale = movement.type === 'sale';

  return (
    <button className="movement-card" type="button" onClick={onClick}>
      <div className={isSale ? 'movement-icon sale' : 'movement-icon purchase'}>
        {isSale ? <Banknote size={20} /> : <ShoppingBag size={20} />}
      </div>
      <div className="movement-info">
        <h3>{movement.productName || movement.concept}</h3>
        <p>{formatDate(movement.date)} · {movement.channel}</p>
        {movement.customer && <span>{movement.customer}</span>}
      </div>
      <div className="movement-side">
        <strong className={isSale ? 'positive' : 'negative'}>
          {isSale ? '+' : '-'}{formatCurrency(movement.amount)}
        </strong>
        <Badge tone={movement.status === 'paid' ? 'success' : 'warning'}>
          {movement.status === 'paid' ? 'Pagado' : 'Pendiente'}
        </Badge>
      </div>
    </button>
  );
}
