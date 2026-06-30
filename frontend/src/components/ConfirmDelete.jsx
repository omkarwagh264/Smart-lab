// src/components/ConfirmDelete.jsx
export default function ConfirmDelete({ item, onConfirm, onCancel }) {
  return (
    <div className="confirm-delete">
      <p>
        Delete <strong>{item.name}</strong> (<span className="mono">{item.serial_number}</span>)?
        This can&apos;t be undone.
      </p>
      <div className="form-actions">
        <button className="btn btn--ghost" onClick={onCancel}>Cancel</button>
        <button className="btn btn--danger" onClick={onConfirm}>Delete</button>
      </div>
    </div>
  );
}
