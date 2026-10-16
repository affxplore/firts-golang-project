import React from 'react';
import { Boxes, Coins, AlertTriangle, TrendingUp } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

export default function StatsOverview({ products = [] }) {
  const totalCount = products.length;

  const totalInventoryValue = products.reduce((acc, p) => {
    const price = Number(p.price) || 0;
    const stock = Number(p.stock) || 0;
    return acc + price * stock;
  }, 0);

  const lowStockCount = products.filter((p) => Number(p.stock) <= 5).length;

  const avgPrice = totalCount > 0
    ? products.reduce((acc, p) => acc + (Number(p.price) || 0), 0) / totalCount
    : 0;

  const stats = [
    {
      id: 'stat-total-products',
      label: 'Total Katalog',
      value: `${totalCount} Produk`,
      desc: 'Terdaftar di database',
      icon: Boxes,
      color: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.25)',
    },
    {
      id: 'stat-inventory-val',
      label: 'Nilai Total Stok',
      value: formatRupiah(totalInventoryValue),
      desc: 'Valuasi seluruh inventaris',
      icon: Coins,
      color: '#10b981',
      glow: 'rgba(16, 185, 129, 0.25)',
    },
    {
      id: 'stat-low-stock',
      label: 'Perlu Perhatian',
      value: `${lowStockCount} Item`,
      desc: 'Stok ≤ 5 unit / Habis',
      icon: AlertTriangle,
      color: lowStockCount > 0 ? '#f59e0b' : '#94a3b8',
      glow: 'rgba(245, 158, 11, 0.25)',
    },
    {
      id: 'stat-avg-price',
      label: 'Rata-rata Harga',
      value: formatRupiah(avgPrice),
      desc: 'Per unit barang',
      icon: TrendingUp,
      color: '#818cf8',
      glow: 'rgba(129, 140, 248, 0.25)',
    },
  ];

  return (
    <section className="stats-grid" id="stats-overview-section">
      {stats.map((item) => {
        const IconComponent = item.icon;
        return (
          <div
            key={item.id}
            id={item.id}
            className="stat-card glass-panel"
            style={{
              '--stat-color': item.color,
              '--stat-glow': item.glow,
            }}
          >
            <div className="stat-info">
              <span className="stat-label">{item.label}</span>
              <span className="stat-value">{item.value}</span>
              <span className="stat-desc">{item.desc}</span>
            </div>
            <div className="stat-icon-wrapper">
              <IconComponent size={22} />
            </div>
          </div>
        );
      })}
    </section>
  );
}
