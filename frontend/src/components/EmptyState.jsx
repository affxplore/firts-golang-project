import React from 'react';
import { PackageSearch, Plus, RefreshCw, ServerOff } from 'lucide-react';

export default function EmptyState({ type = 'empty', searchTerm = '', onResetSearch, onOpenCreate, onRetry }) {
  if (type === 'offline') {
    return (
      <div className="empty-state glass-panel" id="empty-state-offline">
        <div className="empty-icon-circle" style={{ color: '#f43f5e', borderColor: 'rgba(244, 63, 94, 0.3)' }}>
          <ServerOff size={32} />
        </div>
        <h3 className="empty-title">Tidak Dapat Terhubung ke Backend Go</h3>
        <p className="empty-subtitle">
          Pastikan backend Go REST API Anda sedang aktif pada port <code>8080</code> dan PostgreSQL telah berjalan.
        </p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <button id="btn-retry-connection" className="btn btn-primary" onClick={onRetry}>
            <RefreshCw size={16} />
            <span>Coba Hubungkan Ulang</span>
          </button>
        </div>
      </div>
    );
  }

  if (type === 'search') {
    return (
      <div className="empty-state glass-panel" id="empty-state-search">
        <div className="empty-icon-circle" style={{ color: '#38bdf8' }}>
          <PackageSearch size={32} />
        </div>
        <h3 className="empty-title">Produk Tidak Ditemukan</h3>
        <p className="empty-subtitle">
          Tidak ada produk yang cocok dengan kata kunci <strong>"{searchTerm}"</strong> atau filter stok yang dipilih.
        </p>
        <button id="btn-reset-search" className="btn btn-secondary" onClick={onResetSearch}>
          Reset Filter & Pencarian
        </button>
      </div>
    );
  }

  return (
    <div className="empty-state glass-panel" id="empty-state-default">
      <div className="empty-icon-circle">
        <PackageSearch size={32} />
      </div>
      <h3 className="empty-title">Inventaris Masih Kosong</h3>
      <p className="empty-subtitle">
        Belum ada produk yang tersimpan di dalam database PostgreSQL. Mulai tambahkan produk pertama Anda sekarang!
      </p>
      <button id="btn-empty-create" className="btn btn-primary" onClick={onOpenCreate}>
        <Plus size={16} />
        <span>Tambah Produk Pertama</span>
      </button>
    </div>
  );
}
