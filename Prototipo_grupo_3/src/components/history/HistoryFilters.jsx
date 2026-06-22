const ranges = ['Hoy', 'Esta semana', 'Este mes'];

export function HistoryFilters({ range, setRange }) {
  return (
    <div className="segmented-control">
      {ranges.map((item) => (
        <button
          type="button"
          key={item}
          className={range === item ? 'active' : ''}
          onClick={() => setRange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
