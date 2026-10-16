import React from 'react';
import { Eye, Edit3, Trash2 } from 'lucide-react';
import { formatRupiah, formatDate, getStockStatus } from '../utils/formatters';

export default function ProductTable({ products, onDetail, onEdit, onDelete }) {
  return (
    <div className="table-container">
      <table className="product-table" id="product-list-table">
        <thead>
          <tr>
            <th style={{ width: '70px' }}>ID</th>
            <th>Nama Produk</th>
            <th>Harga</th>
            <th style={{ width: '100px' }}>Stok</th>
            <th>Status</th>
            <th>Diperbarui</th>
            <th style={{ width: '140px', textAlign: 'center' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const stockInfo = getStockStatus(product.stock);
            return (
              <tr key={product.id} id={`table-row-${product.id}`}>
                <td>
                  <span className="product-id-tag">#{product.id}</span>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{product.name}</div>
                  {product.description && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {product.description}
                    </div>
                  )}
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: '#38bdf8' }}>
                    {formatRupiah(product.price)}
                  </span>
                </td>
                <td>
                  <span style={{ fontWeight: 600 }}>{product.stock} pcs</span>
                </td>
                <td>
                  <span className={`badge ${stockInfo.className}`}>
                    {stockInfo.label}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {formatDate(product.updated_at || product.created_at)}
                  </span>
                </td>
                <td>
                  <div className="table-actions" style={{ justifyContent: 'center' }}>
                    <button
                      id={`btn-table-detail-${product.id}`}
                      className="btn-icon"
                      onClick={() => onDetail(product)}
                      title="Lihat Detail"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      id={`btn-table-edit-${product.id}`}
                      className="btn-icon"
                      onClick={() => onEdit(product)}
                      title="Edit Produk"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      id={`btn-table-delete-${product.id}`}
                      className="btn-icon"
                      onClick={() => onDelete(product)}
                      title="Hapus Produk"
                      style={{ color: '#f43f5e' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
