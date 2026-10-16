# ProductFlow - Frontend React (Vite)

Frontend Single Page Application (SPA) untuk sistem manajemen inventaris produk, terintegrasi penuh dengan backend **Go REST API** dan basis data **PostgreSQL**.

---

## 🎨 Fitur Antarmuka & UX

- **Sleek Modern Glassmorphism & Dark Mode**: Desain bertema gelap futuristik dengan efek kaca transparan dan aksen warna elegan.
- **Full CRUD Management**: Tambah barang, ubah detail, hapus dengan konfirmasi keamanan, serta lihat pratinjau spesifikasi lengkap.
- **Real-Time Live Search (Debounce)**: Mengetik di kotak pencarian otomatis memanggil endpoint backend `GET /api/products?search=...` tanpa membebani server.
- **Filter & Sorting Interaktif**:
  - Filter ketersediaan unit: *Semua*, *Tersedia*, *Menipis (≤ 5)*, dan *Habis*.
  - Pengurutan: *Terbaru*, *Nama (A - Z)*, *Harga Termurah/Tertinggi*, dan *Stok Terbanyak*.
  - Dua mode tampilan: **Grid Card View** & **Table View**.
- **Live Currency Preview (IDR)**: Pratinjau otomatis format Rupiah saat menginput harga (contoh: `Rp 18.500.000`).
- **Health Indicator & Offline Fallback**: Mendeteksi secara langsung apakah backend Go aktif, serta memberikan panduan ramah jika backend belum dinyalakan.
- **Dynamic Toast Feedback**: Pesan sukses dan kesalahan yang muncul halus di sudut layar.

---

## ⚙️ Variabel Lingkungan (.env)

Buat file `.env` di folder `frontend/`:

```env
# Alamat dasar backend Go REST API
# Kosongkan atau gunakan http://localhost:8080
VITE_API_BASE_URL=http://localhost:8080
```

*Catatan: Selama development lokal, Vite telah dikonfigurasi dengan proxy otomatis di `vite.config.js` sehingga request `/api` dan `/health` dapat diteruskan langsung ke backend.*

---

## 🛠️ Perintah Menjalankan

```bash
# 1. Pasang dependensi
npm install

# 2. Jalankan development server
npm run dev

# 3. Build bundle untuk produksi (menghasilkan folder dist/)
npm run build

# 4. Pratinjau hasil build produksi di lokal
npm run preview
```

---

## 📂 Struktur File Frontend

```text
src/
├── components/
│   ├── Navbar.jsx             # Bar navigasi atas, status API & aksi cepat
│   ├── StatsOverview.jsx      # Kartu metrik (Total Produk, Valuasi, Stok Tipis, Avg Harga)
│   ├── ProductCard.jsx        # Komponen kartu produk untuk tampilan Grid
│   ├── ProductTable.jsx       # Komponen tabel produk untuk tampilan Tabular
│   ├── ProductModal.jsx       # Modal dialog Tambah & Edit Produk
│   ├── ProductDetailModal.jsx # Modal dialog Detail & Spesifikasi lengkap
│   ├── DeleteConfirmModal.jsx # Modal konfirmasi hapus data
│   ├── Toast.jsx              # Komponen tumpukan notifikasi toast
│   └── EmptyState.jsx         # Status kosong & pesan kendala koneksi
├── services/
│   └── api.js                 # Layanan pemanggilan API REST (fetch & error handler)
├── utils/
│   └── formatters.js          # Helper mata uang Rupiah, tanggal, & stok
├── App.jsx                    # State utama & logika bisnis tampilan
├── App.css                    # Styling layout & komponen antarmuka
├── index.css                  # Variabel CSS tema, reset dasar & animasi
└── main.jsx                   # Mount ke DOM React
```
