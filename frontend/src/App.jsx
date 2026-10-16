import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Search,
  X,
  LayoutGrid,
  List,
  ArrowUpDown,
  Filter,
  Plus,
  RefreshCw,
  ServerOff,
  Sparkles,
} from 'lucide-react';

import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import ProductCard from './components/ProductCard';
import ProductTable from './components/ProductTable';
import ProductModal from './components/ProductModal';
import ProductDetailModal from './components/ProductDetailModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import ToastContainer from './components/Toast';
import EmptyState from './components/EmptyState';

import { productService } from './services/api';
import './App.css';

export default function App() {
  // Data State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBackendHealthy, setIsBackendHealthy] = useState(false);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); // 'all', 'in', 'low', 'out'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price_asc', 'price_desc', 'name_asc', 'stock_desc'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modals State
  const [modalMode, setModalMode] = useState('create');
  const [isCreateEditOpen, setIsCreateEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Action Loading States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast System
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, title, message) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    // Auto dismiss after 4.5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Search Debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 320);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Health Check
  const checkHealth = useCallback(async () => {
    setIsCheckingHealth(true);
    try {
      await productService.checkHealth();
      setIsBackendHealthy(true);
    } catch {
      setIsBackendHealthy(false);
    } finally {
      setIsCheckingHealth(false);
    }
  }, []);

  // Fetch Products
  const fetchProducts = useCallback(async (searchQuery = '') => {
    setLoading(true);
    try {
      const data = await productService.getAll(searchQuery);
      setProducts(data || []);
      setIsBackendHealthy(true);
    } catch (err) {
      console.error('Fetch error:', err);
      setIsBackendHealthy(false);
      addToast(
        'error',
        'Koneksi Backend Terkendala',
        err.message || 'Gagal memuat data dari server Go'
      );
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // Initial Load
  useEffect(() => {
    checkHealth();
    fetchProducts(debouncedSearch);
  }, [checkHealth, fetchProducts, debouncedSearch]);

  // Filter & Sort Logic
  const processedProducts = useMemo(() => {
    let result = [...products];

    // Filter Status Stok
    if (stockFilter === 'in') {
      result = result.filter((p) => Number(p.stock) > 5);
    } else if (stockFilter === 'low') {
      result = result.filter((p) => Number(p.stock) > 0 && Number(p.stock) <= 5);
    } else if (stockFilter === 'out') {
      result = result.filter((p) => Number(p.stock) <= 0);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'price_asc') return Number(a.price) - Number(b.price);
      if (sortBy === 'price_desc') return Number(b.price) - Number(a.price);
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'stock_desc') return Number(b.stock) - Number(a.stock);
      // default: newest
      return new Date(b.created_at || b.id) - new Date(a.created_at || a.id);
    });

    return result;
  }, [products, stockFilter, sortBy]);

  // Modal Handlers
  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedProduct(null);
    setIsCreateEditOpen(true);
  };

  const handleOpenEdit = (product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setIsCreateEditOpen(true);
  };

  const handleOpenDetail = (product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const handleOpenDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteOpen(true);
  };

  // Submit Create or Update
  const handleFormSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      if (modalMode === 'create') {
        const res = await productService.create(payload);
        addToast('success', 'Berhasil Ditambahkan', `Produk "${payload.name}" berhasil dibuat`);
      } else {
        await productService.update(selectedProduct.id, payload);
        addToast('success', 'Berhasil Diperbarui', `Informasi produk #${selectedProduct.id} telah diperbarui`);
      }
      setIsCreateEditOpen(false);
      fetchProducts(debouncedSearch);
    } catch (err) {
      addToast('error', 'Gagal Menyimpan Produk', err.message || 'Terjadi kesalahan pada backend');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Delete
  const handleDeleteConfirm = async (id) => {
    setIsDeleting(true);
    try {
      await productService.delete(id);
      addToast('success', 'Produk Dihapus', `Produk "${productToDelete?.name}" telah dihapus dari database`);
      setIsDeleteOpen(false);
      setProductToDelete(null);
      fetchProducts(debouncedSearch);
    } catch (err) {
      addToast('error', 'Gagal Menghapus', err.message || 'Terjadi kesalahan sistem');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="app-wrapper">
      {/* Navbar Header */}
      <Navbar
        isBackendHealthy={isBackendHealthy}
        isCheckingHealth={isCheckingHealth}
        onRefresh={() => {
          checkHealth();
          fetchProducts(debouncedSearch);
        }}
        onOpenCreate={handleOpenCreate}
      />

      <main className="main-container">
        {/* Banner Title */}
        <section className="hero-banner">
          <h1 className="hero-title" id="page-hero-title">
            <span>Katalog Inventaris Produk</span>
            <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600, background: 'rgba(56, 189, 248, 0.1)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
              Fullstack Suite
            </span>
          </h1>
          <p className="hero-subtitle">
            Kelola inventaris dan katalog barang secara real-time terintegrasi dengan REST API Go dan basis data PostgreSQL.
          </p>
        </section>

        {/* Notifikasi jika Backend Mati */}
        {!loading && !isBackendHealthy && (
          <div
            id="backend-offline-banner"
            style={{
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              padding: '14px 20px',
              borderRadius: '12px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              color: '#fecdd3',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ServerOff size={20} color="#f43f5e" />
              <span>
                Backend Go belum terdeteksi aktif pada port <code>8080</code>. Pastikan database PostgreSQL menyala dan jalankan <code>go run main.go</code> di folder <code>basic-go</code>.
              </span>
            </div>
            <button
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              onClick={() => {
                checkHealth();
                fetchProducts(debouncedSearch);
              }}
            >
              Cek Ulang
            </button>
          </div>
        )}

        {/* Statistik Ringkasan */}
        <StatsOverview products={products} />

        {/* Toolbar Pencarian & Filter */}
        <section className="toolbar-section glass-panel" id="catalog-toolbar">
          <div className="toolbar-main">
            {/* Search Input */}
            <div className="search-box-wrapper">
              <Search size={18} className="search-icon" />
              <input
                id="input-search-products"
                type="text"
                className="search-input"
                placeholder="Cari nama produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  id="btn-clear-search"
                  className="search-clear-btn"
                  onClick={() => setSearchTerm('')}
                  aria-label="Bersihkan pencarian"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Controls (Sort & View Switcher) */}
            <div className="toolbar-controls">
              {/* Sort Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowUpDown size={15} color="var(--text-muted)" />
                <select
                  id="select-sort-products"
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                >
                  <option value="newest">Terbaru Ditambahkan</option>
                  <option value="name_asc">Nama (A - Z)</option>
                  <option value="price_asc">Harga: Termurah</option>
                  <option value="price_desc">Harga: Tertinggi</option>
                  <option value="stock_desc">Stok Terbanyak</option>
                </select>
              </div>

              {/* View Switcher: Grid vs Table */}
              <div className="view-switcher" id="view-mode-switcher">
                <button
                  id="btn-view-grid"
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Tampilan Grid Card"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  id="btn-view-table"
                  className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                  onClick={() => setViewMode('table')}
                  title="Tampilan Tabel"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Status Stok Chips */}
          <div className="filter-chips" id="stock-filter-chips">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={13} /> Filter:
            </span>
            <button
              id="filter-chip-all"
              className={`filter-chip ${stockFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStockFilter('all')}
            >
              Semua ({products.length})
            </button>
            <button
              id="filter-chip-in"
              className={`filter-chip ${stockFilter === 'in' ? 'active' : ''}`}
              onClick={() => setStockFilter('in')}
            >
              Tersedia ({products.filter((p) => Number(p.stock) > 5).length})
            </button>
            <button
              id="filter-chip-low"
              className={`filter-chip ${stockFilter === 'low' ? 'active' : ''}`}
              onClick={() => setStockFilter('low')}
            >
              Menipis ({products.filter((p) => Number(p.stock) > 0 && Number(p.stock) <= 5).length})
            </button>
            <button
              id="filter-chip-out"
              className={`filter-chip ${stockFilter === 'out' ? 'active' : ''}`}
              onClick={() => setStockFilter('out')}
            >
              Habis ({products.filter((p) => Number(p.stock) <= 0).length})
            </button>
          </div>
        </section>

        {/* Content Section */}
        {loading ? (
          <div className="product-grid" id="loading-skeletons">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : processedProducts.length === 0 ? (
          <EmptyState
            type={!isBackendHealthy ? 'offline' : (searchTerm || stockFilter !== 'all') ? 'search' : 'empty'}
            searchTerm={searchTerm}
            onResetSearch={() => {
              setSearchTerm('');
              setStockFilter('all');
            }}
            onOpenCreate={handleOpenCreate}
            onRetry={() => {
              checkHealth();
              fetchProducts(debouncedSearch);
            }}
          />
        ) : viewMode === 'grid' ? (
          <div className="product-grid" id="products-grid-view">
            {processedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDetail={handleOpenDetail}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
              />
            ))}
          </div>
        ) : (
          <ProductTable
            products={processedProducts}
            onDetail={handleOpenDetail}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div>
          <strong>ProductFlow</strong> — Sistem Manajemen Inventaris Fullstack Modern.
        </div>
        <div style={{ marginTop: '4px', fontSize: '0.8rem' }}>
          Backend: <code>Golang Gin REST API</code> • Database: <code>PostgreSQL</code> • Frontend: <code>React (Vite)</code> • Reverse Proxy: <code>Nginx</code>
        </div>
      </footer>

      {/* Modals */}
      <ProductModal
        isOpen={isCreateEditOpen}
        mode={modalMode}
        initialData={selectedProduct}
        onClose={() => setIsCreateEditOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      <ProductDetailModal
        isOpen={isDetailOpen}
        product={selectedProduct}
        onClose={() => setIsDetailOpen(false)}
        onEdit={(prod) => {
          setIsDetailOpen(false);
          handleOpenEdit(prod);
        }}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        product={productToDelete}
        onClose={() => {
          setIsDeleteOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
