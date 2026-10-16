import React, { useState, useEffect } from 'react';
import { X, Save, PlusCircle, AlertCircle } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

export default function ProductModal({ isOpen, mode = 'create', initialData = null, onClose, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price?.toString() || '0',
        stock: initialData.stock?.toString() || '0',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '0',
      });
    }
    setErrors({});
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Nama produk wajib diisi';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Nama produk minimal 2 karakter';
    }

    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) < 0) {
      errs.price = 'Harga wajib diisi angka non-negatif (≥ 0)';
    }

    if (formData.stock === '' || isNaN(formData.stock) || Number(formData.stock) < 0) {
      errs.stock = 'Stok wajib berupa bilangan bulat ≥ 0';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock, 10) || 0,
    });
  };

  const isEdit = mode === 'edit';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {isEdit ? <Save size={20} color="#38bdf8" /> : <PlusCircle size={20} color="#38bdf8" />}
            <span>{isEdit ? `Edit Produk #${initialData?.id}` : 'Tambah Produk Baru'}</span>
          </h3>
          <button
            id="btn-close-modal"
            className="btn-icon"
            onClick={onClose}
            aria-label="Tutup Modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} id="product-form">
          <div className="modal-body">
            {/* Input Nama */}
            <div className="form-group">
              <label className="form-label" htmlFor="input-product-name">
                Nama Produk <span className="required">*</span>
              </label>
              <input
                id="input-product-name"
                type="text"
                className="form-input"
                placeholder="Contoh: Keyboard Mechanical RGB TKL"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                autoFocus
              />
              {errors.name && (
                <div style={{ color: '#f43f5e', fontSize: '0.78rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={13} /> {errors.name}
                </div>
              )}
            </div>

            {/* Input Harga */}
            <div className="form-group">
              <label className="form-label" htmlFor="input-product-price">
                Harga Produk (IDR) <span className="required">*</span>
              </label>
              <input
                id="input-product-price"
                type="number"
                step="any"
                min="0"
                className="form-input"
                placeholder="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
              <div style={{ fontSize: '0.78rem', color: '#38bdf8', marginTop: '4px', fontWeight: 600 }}>
                Pratinjau: {formatRupiah(formData.price || 0)}
              </div>
              {errors.price && (
                <div style={{ color: '#f43f5e', fontSize: '0.78rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={13} /> {errors.price}
                </div>
              )}
            </div>

            {/* Input Stok */}
            <div className="form-group">
              <label className="form-label" htmlFor="input-product-stock">
                Jumlah Stok Unit <span className="required">*</span>
              </label>
              <input
                id="input-product-stock"
                type="number"
                min="0"
                step="1"
                className="form-input"
                placeholder="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
              {errors.stock && (
                <div style={{ color: '#f43f5e', fontSize: '0.78rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={13} /> {errors.stock}
                </div>
              )}
            </div>

            {/* Input Deskripsi */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="input-product-description">
                Deskripsi / Spesifikasi Produk
              </label>
              <textarea
                id="input-product-description"
                className="form-textarea"
                placeholder="Tuliskan spesifikasi produk, fitur unggulan, atau catatan inventaris..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              id="btn-cancel-modal"
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              id="btn-submit-modal"
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="status-dot status-dot-green animate-pulse" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{isEdit ? 'Simpan Perubahan' : 'Tambahkan Produk'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
