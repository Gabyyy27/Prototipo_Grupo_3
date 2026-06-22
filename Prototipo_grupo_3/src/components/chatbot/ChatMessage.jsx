export function ChatMessage({ message, children }) {
  if (message.from === 'system') {
    return <div className="chat-date-chip">{message.text}</div>;
  }

  return (
    <div className={`chat-message ${message.from}`}>
      <p>{message.text}</p>
      <span className="chat-time">
        {message.time}
        {message.from === 'user' && <i>{'\u2713\u2713'}</i>}
      </span>
      {children}
    </div>
  );
}
