import React from 'react';
import { Eye, Edit3, Trash2, Layers } from 'lucide-react';
import { formatRupiah, getStockStatus } from '../utils/formatters';

export default function ProductCard({ product, onDetail, onEdit, onDelete }) {
  const stockInfo = getStockStatus(product.stock);

  return (
    <article className="product-card glass-panel" id={`product-card-${product.id}`}>
      <div className="card-top">
        <span className="product-id-tag">ID: #{product.id}</span>
        <span className={`badge ${stockInfo.className}`}>
          {stockInfo.label}
        </span>
      </div>

      <div className="product-main-info">
        <h3 className="product-name" title={product.name}>
          {product.name}
        </h3>
        <p className="product-desc" title={product.description || 'Tidak ada deskripsi'}>
          {product.description || <span style={{ opacity: 0.5, fontStyle: 'italic' }}>Tidak ada deskripsi tambahan.</span>}
        </p>
      </div>

      <div className="product-meta-row">
        <div>
          <div className="price-label">Harga Satuan</div>
          <div className="product-price">{formatRupiah(product.price)}</div>
        </div>
        <div className="stock-info">
          <div className="price-label">Total Unit</div>
          <div className="stock-count">{product.stock} pcs</div>
        </div>
      </div>

      <div className="card-actions">
        <button
          id={`btn-detail-${product.id}`}
          className="btn btn-secondary"
          onClick={() => onDetail(product)}
          title="Lihat detail spesifikasi"
        >
          <Eye size={15} />
          <span>Detail</span>
        </button>

        <button
          id={`btn-edit-${product.id}`}
          className="btn btn-secondary"
          onClick={() => onEdit(product)}
          title="Edit informasi produk"
        >
          <Edit3 size={15} />
          <span>Edit</span>
        </button>

        <button
          id={`btn-delete-${product.id}`}
          className="btn btn-icon"
          onClick={() => onDelete(product)}
          title="Hapus produk"
          style={{ color: '#f43f5e' }}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}
