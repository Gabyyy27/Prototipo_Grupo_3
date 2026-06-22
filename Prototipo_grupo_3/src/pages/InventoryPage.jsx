import { Link } from 'react-router-dom';
import { ChevronLeft, Package, Plus, Search } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { ProductCard } from '../components/inventory/ProductCard.jsx';
import { useProducts } from '../hooks/useProducts.js';
import { useState } from 'react';

function normalize(value) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export default function InventoryPage() {
  const { products, deleteProduct } = useProducts();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [productToDelete, setProductToDelete] = useState(null);
  const categories = ['Todos', ...Array.from(new Set(products.map((product) => product.category)))];
  const visibleProducts = products.filter((product) => {
    const matchesQuery = normalize(product.name).includes(normalize(query));
    const matchesCategory = category === 'Todos' || product.category === category;
    return matchesQuery && matchesCategory;
  });

  function confirmDelete() {
    deleteProduct(productToDelete.id);
    setProductToDelete(null);
  }

  return (
    <main className="page inventory-page">
      <header className="inventory-topbar">
        <Link to="/dashboard" aria-label="Volver al inicio"><ChevronLeft size={19} /></Link>
        <h1>Inventario</h1>
        <span />
      </header>

      <div className="inventory-search">
        <Search size={18} />
        <input value={query} placeholder="Buscar productos..." onChange={(event) => setQuery(event.target.value)} />
      </div>

      <div className="inventory-category-row">
        {categories.map((item) => (
          <button key={item} className={category === item ? 'is-active' : ''} type="button" onClick={() => setCategory(item)}>
            {item}
          </button>
        ))}
      </div>

      {visibleProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No hay productos"
          text="Agrega productos para controlar precio, costo y stock."
          action={<Link className="button primary compact" to="/inventory/new">Agregar producto</Link>}
        />
      ) : (
        <div className="inventory-list">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} onDelete={setProductToDelete} />
          ))}
        </div>
      )}

      <Link className="inventory-fab" to="/inventory/new" aria-label="Agregar producto">
        <Plus size={25} />
      </Link>

      {productToDelete && (
        <Modal
          title="Eliminar producto"
          tone="danger"
          onClose={() => setProductToDelete(null)}
          actions={(
            <>
              <Button variant="secondary" onClick={() => setProductToDelete(null)}>Cancelar</Button>
              <Button variant="danger" onClick={confirmDelete}>Eliminar</Button>
            </>
          )}
        >
          <p>&iquest;Deseas eliminar {productToDelete.name} del inventario?</p>
        </Modal>
      )}
    </main>
  );
}
