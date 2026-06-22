import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Header } from '../components/layout/Header.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ProductForm } from '../components/inventory/ProductForm.jsx';
import { useProducts } from '../hooks/useProducts.js';

const emptyProduct = {
  name: '',
  category: 'Reposter\u00eda',
  price: 0,
  cost: 0,
  stock: 0,
};

export default function ProductFormPage({ mode }) {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { getProduct, createProduct, updateProduct } = useProducts();
  const product = mode === 'edit' ? getProduct(productId) : null;
  const [error, setError] = useState('');
  const [form, setForm] = useState(product || emptyProduct);

  function submit(event) {
    event.preventDefault();
    if (!form.name || !form.category || Number(form.price) <= 0) {
      setError('Completa nombre, categor\u00eda y precio.');
      return;
    }

    if (mode === 'edit') updateProduct(productId, form);
    else createProduct(form);
    navigate('/inventory');
  }

  return (
    <main className="page">
      <Header title={mode === 'edit' ? 'Editar producto' : 'Agregar producto'} eyebrow="Inventario" backTo={mode === 'edit' ? `/inventory/${productId}` : '/inventory'} />
      <ProductForm form={form} setForm={setForm} onSubmit={submit} submitLabel={mode === 'edit' ? 'Guardar cambios' : 'Crear producto'} />
      {error && (
        <Modal
          title="Formulario incompleto"
          tone="danger"
          onClose={() => setError('')}
          actions={<Button onClick={() => setError('')}>Entendido</Button>}
        >
          <p>{error}</p>
        </Modal>
      )}
    </main>
  );
}
