# Fullstack ProductFlow: Go, React, PostgreSQL & Nginx

Sistem manajemen inventaris produk fullstack modern dengan performa tinggi. Dibangun menggunakan arsitektur monorepo modular yang memisahkan **Frontend (React)** dan **Backend (Go Gin)**, terhubung dengan basis data **PostgreSQL**, serta siap dideploy menggunakan **Systemd** dan **Nginx Reverse Proxy**.

---

## 🏗️ Arsitektur Sistem & Alur Aplikasi

```text
[ Browser / Client ]
         │
         ▼
[ Nginx Reverse Proxy (Port 80 / 443) ]
         ├───► [ / ]          ──► React Single Page App (Dist / Static Files)
         ├───► [ /api/... ]   ──► Go Gin REST API (Port 8080)
         └───► [ /health ]    ──► Go Gin Health Check
                                     │
                                     ▼
                             [ PostgreSQL Database ]
                                     └── Tabel "products"
```

1. **Frontend (React + Vite)**:
   - Antarmuka dashboard modern bergaya *glassmorphism* & *dark mode*.
   - Manajemen katalog lengkap (CRUD): Tambah, Edit, Hapus, dan Detail Produk.
   - Fitur pencarian *real-time* (debounce) berdasarkan nama produk.
   - Filter ketersediaan stok (*Tersedia*, *Menipis*, *Habis*) dan pengurutan (harga, nama, stok, tanggal).
   - Indikator kesehatan koneksi backend (*live health indicator*).
   - Metrik statistik otomatis: Total Produk, Total Nilai Stok (IDR), Peringatan Stok Menipis, dan Rata-rata Harga.

2. **Backend (Go Gin + pgx PostgreSQL)**:
   - RESTful API modular (*handlers, repository, models, config*).
   - Connection pooling PostgreSQL untuk throughput tinggi.
   - Endpoint CRUD dengan response standar JSON (`models.APIResponse`).
   - Dukungan CORS untuk integrasi frontend lokal dan produksi.

---

## 📁 Struktur Folder Proyek

```text
try-go-postgresql-nginx/
├── basic-go/                     # BACKEND: REST API Go Gin
│   ├── config/                   # Manajemen konfigurasi & .env
│   ├── database/                 # Koneksi PostgreSQL & pooling
│   ├── deployment/               # Skrip deployment Linux
│   │   ├── basic-go-crud.service # Systemd service unit
│   │   └── nginx.conf            # Reverse Proxy Nginx untuk Fullstack
│   ├── handlers/                 # Controller HTTP REST API
│   ├── models/                   # Struct data entitas & payload DTO
│   ├── repository/               # Query SQL & data access layer
│   ├── routes/                   # Routing Gin & CORS middleware
│   ├── .env.example              # Template variabel lingkungan backend
│   ├── go.mod                    # Modul Go
│   ├── go.sum                    # Checksum Go
│   ├── main.go                   # Entry point aplikasi backend Go
│   ├── README.md                 # Dokumentasi spesifik backend
│   └── schema.sql                # Skema DDL tabel database & data awal
│
└── frontend/                     # FRONTEND: React.js (Vite)
    ├── public/                   # Asset statis publik
    ├── src/
    │   ├── components/           # Komponen UI modular
    │   │   ├── Navbar.jsx        # Header, brand, status backend & tombol aksi
    │   │   ├── StatsOverview.jsx # Kartu metrik statistik inventaris
    │   │   ├── ProductCard.jsx   # Tampilan katalog kartu (Grid view)
    │   │   ├── ProductTable.jsx  # Tampilan katalog tabular (Table view)
    │   │   ├── ProductModal.jsx  # Modal Form Tambah & Edit Produk
    │   │   ├── ProductDetailModal.jsx # Modal detail spesifikasi lengkap
    │   │   ├── DeleteConfirmModal.jsx # Dialog konfirmasi hapus data
    │   │   ├── Toast.jsx         # Notifikasi feedback otomatis
    │   │   └── EmptyState.jsx    # Tampilan kosong & status koneksi terputus
    │   ├── services/
    │   │   └── api.js            # Client HTTP fetch terintegrasi ke Go API
    │   ├── utils/
    │   │   └── formatters.js     # Formatter Rupiah, tanggal, status stok
    │   ├── App.jsx               # State management utama & filtering
    │   ├── App.css               # Styling layout & komponen UI
    │   ├── index.css             # Design tokens, animasi & tema glassmorphic
    │   └── main.jsx              # Entry point React DOM
    ├── .env.example              # Template variabel lingkungan frontend
    ├── package.json              # Dependensi React, Vite, & Lucide Icons
    ├── vite.config.js            # Konfigurasi Vite & dev server proxy
    └── README.md                 # Panduan frontend
```

---

## 🚀 Panduan Menjalankan di Lokal (Development)

### 1. Persiapan Database PostgreSQL
Pastikan service PostgreSQL di komputer Anda telah berjalan, lalu inisialisasi database dan tabel:

```bash
# Masuk ke folder basic-go
cd basic-go

# Eksekusi schema.sql ke PostgreSQL
psql -U postgres -d postgres -c "CREATE DATABASE crud_db;"
psql -U postgres -d crud_db -f schema.sql
```

### 2. Menjalankan Backend Go
1. Salin `.env.example` menjadi `.env` di dalam folder `basic-go`:
   ```bash
   cp .env.example .env
   ```
2. Sesuaikan username dan password PostgreSQL pada file `.env`:
   ```ini
   PORT=8080
   GIN_MODE=debug
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=password_postgres_anda
   DB_NAME=crud_db
   DB_SSLMODE=disable
   ```
3. Unduh dependensi dan jalankan server Go:
   ```bash
   go mod tidy
   go run main.go
   ```
   *Backend akan aktif di `http://localhost:8080`.*

### 3. Menjalankan Frontend React
Buka terminal baru di direktori `frontend`:

```bash
cd frontend

# Pasang dependensi
npm install

# Jalankan dev server Vite
npm run dev
```
*Frontend akan aktif di `http://localhost:3000` (atau port yang tertera di terminal).*

Aplikasi secara otomatis terhubung ke backend `http://localhost:8080` melalui proxy Vite dan file `.env` frontend.

---

## 📡 Daftar Endpoint REST API

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/health` | Memeriksa ketersediaan server Go |
| `GET` | `/api/products` | Mengambil seluruh katalog produk |
| `GET` | `/api/products?search=nama` | Mencari produk berdasarkan kata kunci nama |
| `GET` | `/api/products/:id` | Mengambil detail 1 produk berdasarkan ID |
| `POST` | `/api/products` | Menambahkan produk baru |
| `PUT` | `/api/products/:id` | Mengubah informasi produk berdasarkan ID |
| `DELETE` | `/api/products/:id` | Menghapus produk berdasarkan ID |

### Format JSON Request (POST / PUT)
```json
{
  "name": "Keyboard Mechanical RGB TKL",
  "description": "Keyboard mekanikal dengan switch red dan RGB",
  "price": 750000.00,
  "stock": 25
}
```

---

## 🌐 Panduan Deployment Produksi (Linux + Nginx + Systemd)

Dalam skenario deployment server Linux (VPS Ubuntu/Debian), **Nginx** bertindak sebagai gerbang terpadu:
- Menyajikan file statis React yang sudah dibuild (`dist/`) pada route root `/`.
- Meneruskan (*reverse proxy*) request `/api/` dan `/health` ke service binary Go yang dikelola oleh **Systemd**.

### Langkah 1: Build Frontend React
Di komputer lokal atau server:
```bash
cd frontend
npm run build
```
Hasil build akan berada di direktori `frontend/dist`. Pindahkan folder ini ke direktori server:
```bash
sudo mkdir -p /var/www/frontend
sudo cp -r dist /var/www/frontend/
```

### Langkah 2: Build & Jalankan Backend Go via Systemd
1. Compile binary Go:
   ```bash
   cd basic-go
   GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o basic-go-crud .
   ```
2. Pindahkan binary ke `/var/www/basic-go-crud/` dan buat service systemd menggunakan file yang sudah disiapkan di `basic-go/deployment/basic-go-crud.service`.
3. Aktifkan dan jalankan service:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable basic-go-crud
   sudo systemctl start basic-go-crud
   ```

### Langkah 3: Konfigurasi Nginx
Gunakan template konfigurasi yang telah disediakan di `basic-go/deployment/nginx.conf`:
```bash
sudo cp basic-go/deployment/nginx.conf /etc/nginx/sites-available/productflow
sudo ln -s /etc/nginx/sites-available/productflow /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Dengan konfigurasi ini, pengguna cukup mengakses domain Anda (misal `http://app.domainanda.com`) untuk menggunakan seluruh aplikasi frontend dan backend secara seamless tanpa masalah CORS!
