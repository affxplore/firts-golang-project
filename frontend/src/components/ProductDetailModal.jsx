import React from 'react';
import { X, Calendar, Layers, DollarSign, Clock, Edit3, Tag } from 'lucide-react';
import { formatRupiah, formatDate, getStockStatus } from '../utils/formatters';

export default function ProductDetailModal({ isOpen, product, onClose, onEdit }) {
  if (!isOpen || !product) return null;

  const stockInfo = getStockStatus(product.stock);
  const totalVal = (Number(product.price) || 0) * (Number(product.stock) || 0);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <Tag size={20} color="#38bdf8" />
            <span>Detail Spesifikasi Produk</span>
          </h3>
          <button
            id="btn-close-detail-modal"
            className="btn-icon"
            onClick={onClose}
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span className="product-id-tag">Database Record ID: #{product.id}</span>
            <span className={`badge ${stockInfo.className}`}>
              {stockInfo.label}
            </span>
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px', color: '#fff' }}>
            {product.name}
          </h2>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '12px', marginBottom: '20px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>
              Deskripsi Produk
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {product.description || 'Tidak ada deskripsi detail untuk produk ini.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(56, 189, 248, 0.06)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>HARGA SATUAN</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                {formatRupiah(product.price)}
              </div>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.06)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>TOTAL NILAI STOK</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                {formatRupiah(totalVal)}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: 'var(--text-dim)', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={14} color="var(--text-muted)" />
              <span>Dibuat pada: <strong style={{ color: 'var(--text-muted)' }}>{formatDate(product.created_at)}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={14} color="var(--text-muted)" />
              <span>Pembaruan terakhir: <strong style={{ color: 'var(--text-muted)' }}>{formatDate(product.updated_at)}</strong></span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            id="btn-close-detail-footer"
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Tutup
          </button>
          <button
            id="btn-edit-from-detail"
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onEdit(product);
            }}
          >
            <Edit3 size={15} />
            <span>Edit Data Produk</span>
          </button>
        </div>
      </div>
    </div>
  );
}
