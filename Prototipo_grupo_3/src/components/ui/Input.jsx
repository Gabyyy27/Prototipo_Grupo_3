export function Input({ label, error, className = '', ...props }) {
  return (
    <label className={`field ${className}`.trim()}>
      {label && <span>{label}</span>}
      <input {...props} />
      {error && <small>{error}</small>}
    </label>
  );
}

export function Select({ label, children, className = '', ...props }) {
  return (
    <label className={`field ${className}`.trim()}>
      {label && <span>{label}</span>}
      <select {...props}>{children}</select>
    </label>
  );
}
