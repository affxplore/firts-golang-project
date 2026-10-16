# Basic Go PostgreSQL CRUD API

Aplikasi backend RESTful API menggunakan bahasa pemrograman **Go (Golang)**, framework **Gin**, dan basis data **PostgreSQL**. Berfungsi sebagai penyedia API (*backend service*) untuk antarmuka pengguna **Frontend React** yang terletak di folder berdampingan `../frontend`. Dilengkapi dengan panduan inisialisasi database, pengujian endpoint, deployment menggunakan **Systemd**, dan reverse proxy **Nginx**.

---

## 📁 Struktur Proyek & Hubungan dengan Frontend

```text
try-go-postgresql-nginx/
├── basic-go/                     # Direktori ini (Backend Go API)
│   ├── config/                   # Manajemen environment variable & konfigurasi
│   ├── database/                 # Koneksi ke PostgreSQL & connection pooling
│   ├── deployment/
│   │   ├── basic-go-crud.service # Unit file Systemd untuk service Linux
│   │   └── nginx.conf            # Reverse Proxy Nginx untuk Frontend + Backend
│   ├── handlers/                 # HTTP Controller / Request Handler
│   ├── models/                   # Model entitas & DTO input/output
│   ├── repository/               # Query database & data access layer
│   ├── routes/                   # Router Gin, registrasi endpoint & CORS
│   ├── .env.example              # Template variabel lingkungan
│   ├── .gitignore                # File yang diabaikan Git
│   ├── go.mod                    # Modul Go
│   ├── go.sum                    # Checksum dependensi Go
│   ├── main.go                   # Titik masuk utama aplikasi (entrypoint)
│   ├── README.md                 # Dokumentasi backend ini
│   └── schema.sql                # Skrip SQL pembuat database & tabel
│
└── frontend/                     # Frontend React SPA (Katalog Produk & Dashboard)
```

---

## 🗄️ 1. Setup Database PostgreSQL

### Opsi A: Eksekusi File SQL Secara Otomatis
Jika Anda memiliki akses terminal dengan utilitas `psql`:

```bash
# 1. Buat database crud_db
createdb -U postgres crud_db
# atau via psql:
# psql -U postgres -c "CREATE DATABASE crud_db;"

# 2. Impor tabel, trigger, dan data awal dari schema.sql
psql -U postgres -d crud_db -f schema.sql
```

---

### Opsi B: Eksekusi SQL Command Secara Manual
Buka terminal PostgreSQL Anda:
```bash
sudo -u postgres psql
```

Kemudian jalankan perintah SQL berikut baris demi baris:

```sql
-- 1. Buat Database
CREATE DATABASE crud_db;

-- 2. Pindah ke database crud_db (khusus CLI psql)
\c crud_db;

-- (Opsional) Jika ingin membuat user khusus:
-- CREATE USER app_user WITH ENCRYPTED PASSWORD 'rahasia123';
-- GRANT ALL PRIVILEGES ON DATABASE crud_db TO app_user;
-- GRANT ALL ON SCHEMA public TO app_user;

-- 3. Buat Tabel "products"
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Buat Indeks Pencarian Nama
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- 5. Fungsi & Trigger untuk Otomatisasi Timestamp updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_products_timestamp ON products;
CREATE TRIGGER trigger_update_products_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- 6. Insert Data Awal (Dummy / Seed Data)
INSERT INTO products (name, description, price, stock) VALUES
('Laptop Gaming ASUS ROG', 'Laptop spesifikasi tinggi untuk editing dan gaming', 18500000.00, 10),
('Mechanical Keyboard TKL', 'Keyboard mekanikal dengan switch red dan RGB', 750000.00, 25),
('Wireless Mouse Ergonomis', 'Mouse nirkabel dengan sensor presisi tinggi', 350000.00, 50),
('Monitor 27 Inch 144Hz', 'Monitor IPS Full HD refresh rate 144Hz', 2800000.00, 15);
```

---

## 💻 2. Menjalankan Aplikasi di Lokal

### 1. Salin File Environment
```bash
cp .env.example .env
```
Sesuaikan konfigurasi koneksi database di dalam file `.env`:
```ini
PORT=8080
GIN_MODE=debug

DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password_postgres_kamu
DB_NAME=crud_db
DB_SSLMODE=disable
```

### 2. Download Dependensi
```bash
go mod tidy
```

### 3. Jalankan Aplikasi
```bash
go run main.go
```
Aplikasi akan aktif di port `8080`.

---

## 📡 3. Dokumentasi REST API

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/health` | Memeriksa status kesehatan server |
| `GET` | `/api/products` | Mengambil seluruh daftar produk (bisa filter nama) |
| `GET` | `/api/products/:id` | Mengambil detail 1 produk berdasarkan ID |
| `POST` | `/api/products` | Menambahkan produk baru |
| `PUT` | `/api/products/:id` | Mengubah informasi produk berdasarkan ID |
| `DELETE` | `/api/products/:id` | Menghapus produk berdasarkan ID |

### Contoh Pemanggilan dengan `curl`:

#### 1. Health Check
```bash
curl -X GET http://localhost:8080/health
```

#### 2. Dapatkan Semua Produk (Filter Opsional)
```bash
# Semua produk
curl -X GET http://localhost:8080/api/products

# Filter berdasarkan pencarian nama
curl -X GET "http://localhost:8080/api/products?search=Keyboard"
```

#### 3. Dapatkan Detail Produk Berdasarkan ID
```bash
curl -X GET http://localhost:8080/api/products/1
```

#### 4. Tambah Produk Baru
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Headset Bluetooth Sony",
    "description": "Headset wireless dengan Active Noise Cancelling",
    "price": 2499000.00,
    "stock": 12
  }'
```

#### 5. Update Produk
```bash
curl -X PUT http://localhost:8080/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Gaming ASUS ROG Strix G16",
    "description": "Edisi terbaru intel Core i9 & RTX 4070",
    "price": 22500000.00,
    "stock": 8
  }'
```

#### 6. Hapus Produk
```bash
curl -X DELETE http://localhost:8080/api/products/1
```

---

## 🚀 4. Panduan Deployment ke Linux Server (Systemd + Nginx)

Berikut adalah panduan langkah demi langkah untuk mendeploy aplikasi ini ke VPS/Server Linux (misal Ubuntu 22.04 / 24.04 atau Debian).

### Langkah 1: Compile Binary Go
Anda bisa melakukan build langsung di server, atau melakukan *cross-compilation* dari komputer lokal Anda:

#### Opsi 1: Cross-compile dari Komputer Lokal (Mac / Windows)
```bash
# Build untuk Linux AMD64 (arsitektur VPS x86_64 pada umumnya)
GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o basic-go-crud-linux .

# Kirim binary dan file .env ke server via SCP:
scp basic-go-crud-linux user@ip_server:/tmp/basic-go-crud
scp .env.example user@ip_server:/tmp/.env
```

#### Opsi 2: Build Langsung di Server
```bash
# Di dalam direktori server:
go build -ldflags="-s -w" -o basic-go-crud .
```

---

### Langkah 2: Persiapkan Direktori di Server
Login ke server Anda via SSH:
```bash
# 1. Buat direktori aplikasi di /var/www/
sudo mkdir -p /var/www/basic-go-crud

# 2. Pindahkan binary ke direktori tersebut
sudo mv /tmp/basic-go-crud-linux /var/www/basic-go-crud/basic-go-crud
# Berikan hak akses eksekusi
sudo chmod +x /var/www/basic-go-crud/basic-go-crud

# 3. Siapkan file .env produksi
sudo cp /tmp/.env /var/www/basic-go-crud/.env
sudo nano /var/www/basic-go-crud/.env
# Pastikan password database, port, dan GIN_MODE=release sudah benar

# 4. Berikan kepemilikan folder ke user sistem (contoh: www-data)
sudo chown -R www-data:www-data /var/www/basic-go-crud
```

---

### Langkah 3: Konfigurasi Systemd Service
Systemd bertugas menjalankan aplikasi di latar belakang (*background*), otomatis restart jika crash, dan otomatis menyala saat server restart (*reboot*).

1. Buat file service baru di `/etc/systemd/system/basic-go-crud.service`:
   ```bash
   sudo nano /etc/systemd/system/basic-go-crud.service
   ```

2. Tempelkan konfigurasi berikut (sudah tersedia di `deployment/basic-go-crud.service`):
   ```ini
   [Unit]
   Description=Basic Go CRUD REST API Service
   After=network.target postgresql.service
   Wants=postgresql.service

   [Service]
   Type=simple
   User=www-data
   Group=www-data
   WorkingDirectory=/var/www/basic-go-crud
   ExecStart=/var/www/basic-go-crud/basic-go-crud
   Restart=always
   RestartSec=5s

   # Membaca variabel lingkungan dari file .env
   EnvironmentFile=/var/www/basic-go-crud/.env

   LimitNOFILE=65536
   StandardOutput=journal
   StandardError=journal
   SyslogIdentifier=basic-go-crud

   [Install]
   WantedBy=multi-user.target
   ```

3. Jalankan dan aktifkan service:
   ```bash
   # Reload konfigurasi systemd
   sudo systemctl daemon-reload

   # Aktifkan agar jalan otomatis saat server boot
   sudo systemctl enable basic-go-crud

   # Jalankan service sekarang
   sudo systemctl start basic-go-crud

   # Periksa status service
   sudo systemctl status basic-go-crud
   ```

4. Periksa log aplikasi jika terjadi kendala:
   ```bash
   sudo journalctl -u basic-go-crud -f
   ```

---

### Langkah 4: Konfigurasi Nginx Reverse Proxy
Nginx bertindak sebagai gerbang terdepan yang dapat menyajikan file statis React Frontend (`dist/`) pada route root (`/`) dan meneruskan request API (`/api/` dan `/health`) ke backend Go internal (`127.0.0.1:8080`).

1. Install Nginx jika belum terpasang:
   ```bash
   sudo apt update
   sudo apt install -y nginx
   ```

2. Buat konfigurasi virtual host baru:
   ```bash
   sudo nano /etc/nginx/sites-available/productflow
   ```

3. Masukkan konfigurasi Fullstack berikut (tersedia di `deployment/nginx.conf`):
   ```nginx
   server {
       listen 80;
       server_name app.domainanda.com; # Ganti dengan domain atau IP Public server Anda

       access_log /var/log/nginx/productflow.access.log;
       error_log /var/log/nginx/productflow.error.log;

       client_max_body_size 10M;

       # 1. Reverse proxy endpoint API ke Go Gin
       location /api/ {
           proxy_pass http://127.0.0.1:8080;
           proxy_http_version 1.1;

           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;

           proxy_connect_timeout 60s;
           proxy_send_timeout 60s;
           proxy_read_timeout 60s;
       }

       # 2. Reverse proxy endpoint health check
       location /health {
           proxy_pass http://127.0.0.1:8080/health;
           proxy_http_version 1.1;

           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       # 3. Sajikan file statis React SPA (hasil build `npm run build` di /var/www/frontend/dist)
       location / {
           root /var/www/frontend/dist;
           index index.html;
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. Aktifkan konfigurasi dan uji sintaks Nginx:
   ```bash
   # Buat symlink ke sites-enabled
   sudo ln -s /etc/nginx/sites-available/productflow /etc/nginx/sites-enabled/

   # (Opsional) Nonaktifkan default site jika tidak diperlukan
   # sudo rm /etc/nginx/sites-enabled/default

   # Uji sintaks konfigurasi nginx
   sudo nginx -t

   # Restart atau reload Nginx
   sudo systemctl reload nginx
   ```

5. Uji akses melalui domain atau IP server:
   ```bash
   curl -i http://api.domainanda.com/health
   ```

---

### Langkah 5: (Bonus) Pasang SSL / HTTPS Gratis (Let's Encrypt)
Jika Anda menggunakan nama domain aktif yang sudah diarahkan ke IP server:

1. Pasang Certbot:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   ```

2. Dapatkan sertifikat SSL otomatis:
   ```bash
   sudo certbot --nginx -d api.domainanda.com
   ```
   Certbot akan otomatis memperbarui file konfigurasi Nginx dan mengatur auto-renewal sertifikat.
