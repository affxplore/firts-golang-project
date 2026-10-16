/**
 * API Service untuk menghubungkan React Frontend ke Backend Go REST API
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Helper untuk menangani HTTP request dan response JSON
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `Request gagal dengan status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.details = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(`Tidak dapat terhubung ke server backend di ${API_BASE_URL || window.location.origin}. Pastikan server Go aktif di port 8080.`);
    }
    throw error;
  }
}

export const productService = {
  /**
   * Cek status konektivitas server Go
   */
  async checkHealth() {
    return request('/health');
  },

  /**
   * Ambil semua produk dengan opsi pencarian kata kunci nama
   */
  async getAll(search = '') {
    const query = search ? `?search=${encodeURIComponent(search.trim())}` : '';
    const res = await request(`/api/products${query}`);
    return res.data || [];
  },

  /**
   * Ambil detail produk berdasarkan ID
   */
  async getById(id) {
    const res = await request(`/api/products/${id}`);
    return res.data;
  },

  /**
   * Buat produk baru
   */
  async create(productData) {
    const payload = {
      name: productData.name,
      description: productData.description || '',
      price: parseFloat(productData.price) || 0,
      stock: parseInt(productData.stock, 10) || 0,
    };
    return request('/api/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update data produk yang sudah ada
   */
  async update(id, productData) {
    const payload = {
      name: productData.name,
      description: productData.description || '',
      price: parseFloat(productData.price) || 0,
      stock: parseInt(productData.stock, 10) || 0,
    };
    return request(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Hapus produk berdasarkan ID
   */
  async delete(id) {
    return request(`/api/products/${id}`, {
      method: 'DELETE',
    });
  },
};
