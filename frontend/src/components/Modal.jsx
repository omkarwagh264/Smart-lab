// src/components/Modal.jsx
import { useEffect } from 'react';

export default function Modal({ title, onClose, children, width }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal"
        style={width ? { maxWidth: width } : undefined}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal__header">
          <h2>{title}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close dialog">×</button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
