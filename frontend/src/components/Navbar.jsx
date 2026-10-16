import React from 'react';
import { Package, Plus, RefreshCw, Server, AlertCircle } from 'lucide-react';

export default function Navbar({ isBackendHealthy, isCheckingHealth, onRefresh, onOpenCreateModal }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand" id="brand-logo" onClick={onRefresh} title="ProductFlow Dashboard">
          <div className="brand-icon-box">
            <Package size={24} />
          </div>
          <div>
            <div className="brand-title">ProductFlow</div>
            <div className="brand-subtitle">Go Gin • PostgreSQL • Nginx</div>
          </div>
        </div>

        <div className="nav-actions">
          {/* Status Server Backend */}
          <div
            id="backend-status-indicator"
            className={`badge-status ${isBackendHealthy ? 'badge-status-online' : 'badge-status-offline'}`}
            title={isBackendHealthy ? 'Backend Go API Online' : 'Backend Go API Offline / Sedang dimuat'}
          >
            <span className={`status-dot ${isBackendHealthy ? 'status-dot-green' : 'status-dot-red'} ${isCheckingHealth ? 'animate-pulse' : ''}`} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>
              {isCheckingHealth ? 'Memeriksa...' : isBackendHealthy ? 'API Online' : 'API Offline'}
            </span>
          </div>

          {/* Tombol Reload Data */}
          <button
            id="btn-refresh-data"
            className="btn btn-secondary btn-icon"
            onClick={onRefresh}
            title="Muat ulang data dari server"
          >
            <RefreshCw size={17} />
          </button>

          {/* Tombol Tambah Produk */}
          <button
            id="btn-open-create-modal"
            className="btn btn-primary"
            onClick={onOpenCreateModal}
          >
            <Plus size={18} />
            <span>Tambah Produk</span>
          </button>
        </div>
      </div>
    </header>
  );
}
