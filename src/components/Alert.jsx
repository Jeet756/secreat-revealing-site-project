import './Alert.css';

export default function Alert({ type = 'info', msg }) {
  if (!msg) return null;
  const icons = { info: 'ℹ', success: '✓', error: '✕', warning: '!' };
  return (
    <div className={`alert alert-${type}`}>
      <span className="alert-icon">{icons[type]}</span>
      {msg}
    </div>
  );
}
