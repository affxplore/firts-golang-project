/**
 * Helper utility formatting untuk Rupiah, Tanggal, dan Status Stok
 */

export function formatRupiah(number) {
  const val = Number(number) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
}

export function formatDate(dateString) {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function getStockStatus(stock) {
  const count = Number(stock) || 0;
  if (count <= 0) {
    return {
      label: 'Stok Habis',
      className: 'badge-out-of-stock',
      level: 'out',
    };
  }
  if (count <= 5) {
    return {
      label: `Stok Menipis (${count})`,
      className: 'badge-low-stock',
      level: 'low',
    };
  }
  return {
    label: `Tersedia (${count})`,
    className: 'badge-in-stock',
    level: 'ok',
  };
}
