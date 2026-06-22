import { Link } from 'react-router-dom';
import { Edit3, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/currency.js';

const productSymbols = {
  'brownie-chocolate': 0x1F36B,
  'batido-fresa': 0x1F37C,
  'croissant-mantequilla': 0x1F950,
  'iced-latte-12oz': 0x2615,
};

function stockLabel(product) {
  const stock = Number(product.stock);
  if (stock <= 0) return 'AGOTADO';
  if (stock <= 5) return 'STOCK BAJO';
  return `${stock} UNIDADES`;
}

export function ProductCard({ product, onDelete }) {
  const isLowStock = Number(product.stock) <= 5;
  const symbol = String.fromCodePoint(productSymbols[product.id] || 0x1F4E6);

  return (
    <article className="inventory-product-card">
      <Link className={`inventory-product-photo product-${product.id}`} to={`/inventory/${product.id}`} aria-label={`Ver ${product.name}`}>
        <span>{symbol}</span>
      </Link>

      <Link className="inventory-product-copy" to={`/inventory/${product.id}`}>
        <h3>{product.name}</h3>
        <strong>{formatCurrency(product.price)}</strong>
        {isLowStock ? (
          <p className="stock-inline low">{Number(product.stock)} unidades</p>
        ) : (
          <p className="stock-pill">{stockLabel(product)}</p>
        )}
      </Link>

      <div className="inventory-product-actions">
        {isLowStock && <span className="stock-warning">{stockLabel(product)}</span>}
        <div>
          <Link to={`/inventory/${product.id}/edit`} aria-label={`Editar ${product.name}`}>
            <Edit3 size={15} />
          </Link>
          <button type="button" onClick={() => onDelete(product)} aria-label={`Eliminar ${product.name}`}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
