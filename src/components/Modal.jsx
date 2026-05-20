import './Modal.css';

export default function ConfirmModal({ open, onConfirm, onCancel, secretId }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">🗑️</div>
        <h3 className="modal-title">Delete Secret?</h3>
        <p className="modal-desc">
          Secret <strong>#{secretId}</strong> will be permanently removed.<br />
          This action cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
          <button className="btn btn-accent" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}
