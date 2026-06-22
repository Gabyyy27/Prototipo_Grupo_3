import { Link, useNavigate, useParams } from 'react-router-dom';
import { Edit3, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Header } from '../components/layout/Header.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { useProducts } from '../hooks/useProducts.js';
import { formatCurrency } from '../utils/currency.js';

function initials(name) {
  return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function stockTone(stock) {
  if (Number(stock) <= 0) return 'danger';
  if (Number(stock) <= 5) return 'warning';
  return 'success';
}

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { getProduct, deleteProduct } = useProducts();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const product = getProduct(productId);

  if (!product) {
    return (
      <main className="page">
        <Header title="Producto" eyebrow="Inventario" backTo="/inventory" />
        <Card><p>Producto no encontrado.</p></Card>
      </main>
    );
  }

  function removeProduct() {
    deleteProduct(product.id);
    navigate('/inventory');
  }

  return (
    <main className="page">
      <Header title="Detalle" eyebrow="Inventario" backTo="/inventory" />
      <Card className="product-detail-card">
        <div className="product-thumb large">{initials(product.name)}</div>
        <h2>{product.name}</h2>
        <Badge tone={stockTone(product.stock)}>{Number(product.stock) <= 5 ? 'Stock bajo' : 'Disponible'}</Badge>
        <div className="detail-grid">
          <Detail label="Precio" value={formatCurrency(product.price)} />
          <Detail label="Costo" value={formatCurrency(product.cost)} />
          <Detail label="Stock" value={product.stock} />
          <Detail label="Categor\u00eda" value={product.category} />
        </div>
        <div className="action-row">
          <Link className="button secondary" to={`/inventory/${product.id}/edit`}><Edit3 size={17} />Editar</Link>
          <Button variant="danger" onClick={() => setConfirmDelete(true)}><Trash2 size={17} />Eliminar</Button>
        </div>
      </Card>
      {confirmDelete && (
        <Modal
          title="Eliminar producto"
          tone="danger"
          onClose={() => setConfirmDelete(false)}
          actions={(
            <>
              <Button variant="secondary" onClick={() => setConfirmDelete(false)}>Cancelar</Button>
              <Button variant="danger" onClick={removeProduct}>Eliminar</Button>
            </>
          )}
        >
          <p>&iquest;Deseas eliminar {product.name} del inventario?</p>
        </Modal>
      )}
    </main>
  );
}

function Detail({ label, value }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
