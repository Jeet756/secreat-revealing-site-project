import { useEffect, useState } from 'react';
import './Toast.css';

export default function Toast({ toasts, onRemove }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // mount animation
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration ?? 4000);

    return () => clearTimeout(timer);
  }, []);

  const icons = { success: '✓', error: '✕', info: 'i', warning: '!' };

  return (
    <div className={`toast toast-${toast.type} ${visible ? 'toast-in' : 'toast-out'}`}>
      <div className={`toast-icon toast-icon-${toast.type}`}>
        {icons[toast.type] || 'i'}
      </div>
      <span className="toast-msg">{toast.msg}</span>
      <button className="toast-close" onClick={() => {
        setVisible(false);
        setTimeout(() => onRemove(toast.id), 300);
      }}>×</button>
    </div>
  );
}
