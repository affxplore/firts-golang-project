import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" id="toast-notifications-container">
      {toasts.map((toast) => {
        let Icon = Info;
        let toastClass = 'toast-info';

        if (toast.type === 'success') {
          Icon = CheckCircle;
          toastClass = 'toast-success';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          toastClass = 'toast-error';
        }

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`toast ${toastClass}`}
          >
            <div style={{ marginTop: '2px', color: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#f43f5e' : '#38bdf8' }}>
              <Icon size={18} />
            </div>
            <div className="toast-content">
              {toast.title && <div className="toast-title">{toast.title}</div>}
              <div className="toast-message">{toast.message}</div>
            </div>
            <button
              className="toast-close"
              onClick={() => onDismiss(toast.id)}
              aria-label="Tutup notifikasi"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
