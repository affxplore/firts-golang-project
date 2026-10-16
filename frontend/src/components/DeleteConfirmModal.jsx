import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, product, onClose, onConfirm, isDeleting }) {
  if (!isOpen || !product) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-panel" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{ borderBottom: 'none', paddingBottom: '4px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f43f5e' }}>
            <AlertTriangle size={22} />
          </div>
          <button
            id="btn-close-delete-modal"
            className="btn-icon"
            onClick={onClose}
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ paddingTop: '8px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px', color: '#fff' }}>
            Hapus Produk Ini?
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            Apakah Anda yakin ingin menghapus produk <strong style={{ color: '#fff' }}>"{product.name}"</strong> (ID #{product.id})? Tindakan ini akan menghapus rekaman secara permanen dari PostgreSQL dan tidak dapat dibatalkan.
          </p>
        </div>

        <div className="modal-footer" style={{ borderTop: 'none', background: 'transparent' }}>
          <button
            id="btn-cancel-delete"
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Batal
          </button>
          <button
            id="btn-confirm-delete"
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(product.id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="status-dot status-dot-red animate-pulse" />
                <span>Menghapus...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Ya, Hapus Produk</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
