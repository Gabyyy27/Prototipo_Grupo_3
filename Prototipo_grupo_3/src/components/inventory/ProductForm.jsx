import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';

export function ProductForm({ form, setForm, onSubmit, submitLabel }) {
  return (
    <form className="form-card" onSubmit={onSubmit}>
      <Input
        label="Nombre del producto"
        value={form.name}
        onChange={(event) => setForm({ ...form, name: event.target.value })}
      />
      <Input
        label="Categoria"
        value={form.category}
        onChange={(event) => setForm({ ...form, category: event.target.value })}
      />
      <div className="form-grid two">
        <Input
          label="Precio"
          type="number"
          min="0"
          value={form.price}
          onChange={(event) => setForm({ ...form, price: event.target.value })}
        />
        <Input
          label="Costo"
          type="number"
          min="0"
          value={form.cost}
          onChange={(event) => setForm({ ...form, cost: event.target.value })}
        />
      </div>
      <Input
        label="Stock"
        type="number"
        min="0"
        value={form.stock}
        onChange={(event) => setForm({ ...form, stock: event.target.value })}
      />
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
