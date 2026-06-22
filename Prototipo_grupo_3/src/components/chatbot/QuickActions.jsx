const actions = [
  'Vend\u00ed 3 brownies a L 50 cada uno',
  'Compr\u00e9 ingredientes por L 300',
  '\u00bfCu\u00e1l es el precio del brownie?',
  '\u00bfCu\u00e1nto vend\u00ed hoy?',
  'Mu\u00e9strame mi \u00faltima venta',
  '\u00bfCu\u00e1ntas pulseras tengo en inventario?',
];

export function QuickActions({ onSelect }) {
  return (
    <div className="quick-chat-actions">
      {actions.map((action) => (
        <button type="button" key={action} onClick={() => onSelect(action)}>
          {action}
        </button>
      ))}
    </div>
  );
}
