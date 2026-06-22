export function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <section className="empty-state">
      {Icon && (
        <div className="empty-icon">
          <Icon size={28} />
        </div>
      )}
      <h2>{title}</h2>
      <p>{text}</p>
      {action}
    </section>
  );
}
