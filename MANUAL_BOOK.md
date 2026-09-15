# 📖 Manual Book — LaporPark
### Sistem Manajemen Berita Acara Parkir
**Angkasa Pura Supports — Unit Parkir**

---

> [!NOTE]
> Manual ini mencakup panduan penggunaan aplikasi **LaporPark** untuk seluruh tingkatan pengguna **kecuali Superadmin**. Setiap bagian ditandai dengan role yang memiliki akses terhadap fitur tersebut.

---

## Daftar Isi

1. [Pengenalan Sistem](#1-pengenalan-sistem)
2. [Hierarki Peran Pengguna](#2-hierarki-peran-pengguna)
3. [Login & Autentikasi](#3-login--autentikasi)
4. [Navigasi & Sidebar](#4-navigasi--sidebar)
5. [Panduan per Tingkatan](#5-panduan-per-tingkatan)
   - [5.1 Admin](#51-admin)
   - [5.2 Supervisor](#52-supervisor)
   - [5.3 Carpark Manager](#53-carpark-manager)
   - [5.4 Team Leader](#54-team-leader)
   - [5.5 Teknisi](#55-teknisi)
6. [Fitur Umum — Berita Acara](#6-fitur-umum--berita-acara)
7. [Alur Persetujuan (Approval Workflow)](#7-alur-persetujuan-approval-workflow)
8. [Cetak & PDF](#8-cetak--pdf)
9. [Ganti Password](#9-ganti-password)
10. [Dark Mode / Light Mode](#10-dark-mode--light-mode)
11. [FAQ & Troubleshooting](#11-faq--troubleshooting)

---

## 1. Pengenalan Sistem

**LaporPark** adalah aplikasi web berbasis *Berita Acara* yang digunakan untuk mencatat, melacak, dan menyelesaikan insiden yang terjadi di area parkir bandara di bawah naungan **Angkasa Pura Supports** bekerja sama dengan **Centre Park**.

### Jenis Insiden yang Dicatat:

| Kode | Label | Deskripsi |
|------|-------|-----------|
| `kerusakan` | Kerusakan | Kerusakan fasilitas/infrastruktur parkir |
| `kerusakan_kendaraan` | Kerusakan Kendaraan | Kerusakan yang melibatkan kendaraan |
| `komplain` | Komplain | Keluhan dari pengguna jasa parkir |
| `kehilangan` | Kehilangan | Laporan kehilangan barang/kendaraan |
| `gangguan_sistem` | Gangguan Sistem | Gangguan pada sistem IT/perangkat lunak |
| `gangguan_perangkat` | Gangguan Perangkat | Gangguan pada perangkat keras |
| `lainnya` | Lainnya | Insiden yang tidak termasuk kategori di atas |

### Bandara yang Didukung:

| Kode | Nama Bandara | Lokasi |
|------|-------------|--------|
| AMQ | Bandara Pattimura | Ambon |
| BDJ | Bandara Intl. Syamsudin Noor | Banjarmasin |
| BIK | Bandara Intl. Frans Kaisiepo | Biak |
| BPN | Bandara Intl. Sultan Aji Muhammad Sulaiman | Balikpapan |
| DJJ | Bandara Intl. Sentani | Jayapura |
| DPS | Bandara Intl. I Gusti Ngurah Rai | Denpasar |
| KOE | Bandara Intl. El Tari | Kupang |
| LOP | Bandara Intl. Zainuddin Abdul Madjid | Lombok |
| MDC | Bandara Intl. Sam Ratulangi | Manado |
| SOC | Bandara Intl. Adi Soemarmo | Solo |
| SRG | Bandara Intl. Jenderal Ahmad Yani | Semarang |
| SUB | Bandara Intl. Juanda | Surabaya |
| UPG | Bandara Intl. Sultan Hasanuddin | Makassar |
| YIA | Bandara Intl. Yogyakarta | Yogyakarta |

---

## 2. Hierarki Peran Pengguna

Sistem **LaporPark** memiliki struktur peran berjenjang yang membedakan kewenangan antara **Kantor Pusat (Head Office / HO)** dan **Kantor Cabang Bandara**.

### Struktur Tingkatan:

1. **👑 Superadmin (Officer HO)** — *Tingkat Tertinggi / Kantor Pusat*  
   Memegang kewenangan penuh atas sistem dan memonitor seluruh 14 bandara (`kode_bandara: ALL`). Menggunakan email domain `@laporpark.id` (tanpa kode bandara).
2. **🛡️ Supervisor** — *Tingkat Pimpinan Cabang*  
   Kepala operasional tertinggi di bandara cabang. Memegang hak persetujuan akhir Berita Acara (*Diketahui* dan *Selesai*), mengembalikan revisi, serta manajemen pengguna (CRUD staf) di cabangnya.
3. **📋 Carpark Manager** — *Tingkat Manajerial Cabang*  
   Manajer parkir cabang yang bertanggung jawab memvalidasi dan menandai BA telah *Diperiksa* sebelum disetujui Supervisor.
4. **👥 🔧 📝 Level Operasional Cabang (Tingkatan Setara / Sama)**:  
   Tiga peran berikut memiliki **level operasional yang setara** di lapangan:
   - **Team Leader**: Pemimpin regu lapangan yang membuat laporan Berita Acara insiden operasional.
   - **Teknisi**: Staf teknis pemeliharaan fasilitas dan peralatan parkir yang melaporkan insiden teknis.
   - **Admin Parkir (Admin Cabang)**: Staf administrasi operasional cabang yang mencatat dan merekap laporan Berita Acara.

```mermaid
graph TD
    subgraph HO["🏢 Tingkat Kantor Pusat (Head Office)"]
        SA["👑 Superadmin (Officer HO)<br/><small>Akses Lintas 14 Bandara (kode: ALL)</small><br/><code>xxxx@laporpark.id</code>"]
    end

    subgraph CABANG["✈️ Tingkat Cabang Bandara"]
        SPV["🛡️ Supervisor<br/><small>Pimpinan Operasional Cabang (Approval & User)</small><br/><code>spv@laporpark.{kode}.id</code>"]
        CPM["📋 Carpark Manager<br/><small>Pemeriksaan & Validasi Lapangan (Diperiksa)</small><br/><code>cpm@laporpark.{kode}.id</code>"]
        
        subgraph OPR["Level Operasional Cabang (Tingkatan Setara)"]
            TL["👥 Team Leader<br/><small>Regu Lapangan</small><br/><code>tl@laporpark.{kode}.id</code>"]
            TEK["🔧 Teknisi<br/><small>Pemeliharaan Alat</small><br/><code>teknisi@laporpark.{kode}.id</code>"]
            ADM["📝 Admin Parkir<br/><small>Administrasi Cabang</small><br/><code>admin@laporpark.{kode}.id</code>"]
        end
    end

    SA --> SPV
    SPV --> CPM
    CPM --> OPR

    style SA fill:#e11d48,color:#fff,stroke:#be123c
    style SPV fill:#f59e0b,color:#fff,stroke:#d97706
    style CPM fill:#0ea5e9,color:#fff,stroke:#0284c7
    style TL fill:#6366f1,color:#fff,stroke:#4f46e5
    style TEK fill:#10b981,color:#fff,stroke:#059669
    style ADM fill:#8b5cf6,color:#fff,stroke:#7c3aed
    style OPR fill:#f8fafc,stroke:#94a3b8,stroke-dasharray: 5 5
    style HO fill:#fff1f2,stroke:#f43f5e
    style CABANG fill:#f0fdf4,stroke:#22c55e
```

### ⚠️ Perbedaan Penting: Superadmin (Officer HO) vs Admin Parkir Cabang

Sangat penting untuk membedakan antara **Superadmin** di Kantor Pusat dengan **Admin Parkir** di cabang bandara:

| Aspek | 👑 Superadmin (Officer HO) | 📝 Admin Parkir (Admin Cabang) |
|-------|----------------------------|--------------------------------|
| **Kedudukan** | Kantor Pusat (Head Office / HO) | Kantor Cabang Bandara |
| **Cakupan Akses Data** | Seluruh 14 Bandara di Indonesia (`ALL`) | Hanya 1 Bandara tempat bertugas |
| **Format Domain Email** | `xxxx@laporpark.id` *(tanpa kode bandara)* | `xxxx@laporpark.{kode_bandara}.id` |
| **Contoh Email** | `officer@laporpark.id` / `superadmin@laporpark.id` | `admin@laporpark.sub.id`, `admin@laporpark.dps.id` |
| **Tingkatan Hak Akses** | Tingkat 1 (Akses Tertinggi Global) | Tingkat 4 (Setara Team Leader & Teknisi) |
| **Fungsi Utama** | Monitoring nasional, master data, filter lintas bandara | Input BA, pencatatan administrasi insiden cabang |

---

### 2.1 Ringkasan Hak Akses per Role

| Fitur | Superadmin (Officer HO) | Supervisor (Cabang) | Carpark Manager (Cabang) | Team Leader (Operasional) | Teknisi (Operasional) | Admin Parkir (Operasional) |
|-------|:-----------------------:|:-------------------:|:------------------------:|:-------------------------:|:---------------------:|:--------------------------:|
| **Cakupan Bandara** | Seluruh 14 Bandara | Cabang Sendiri | Cabang Sendiri | Cabang Sendiri | Cabang Sendiri | Cabang Sendiri |
| **Dashboard Statistik** | ✅ (Semua Bandara) | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Daftar Berita Acara** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Buat BA Baru** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Status Awal BA Baru** | Mengetahui | Diketahui | Diperiksa | Menunggu Review | Menunggu Review | Menunggu Review |
| **Edit BA** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Hapus BA** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Tandai "Diperiksa"** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Setujui BA ("Diketahui")** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Kembalikan ke Revisi** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Tandai "Selesai"** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Kelola Foto Lampiran** | ✅ | ✅ | ✅ | ✅* | ✅* | ❌ |
| **Manajemen Pengguna** | ✅ (Semua Bandara) | ✅ (Cabang Saja) | ❌ | ❌ | ❌ | ❌ |
| **Cetak / PDF** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Ganti Password Sendiri** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

> *\*Team Leader & Teknisi hanya dapat mengelola foto pada BA yang mereka buat sendiri.*  
> *\*Team Leader, Teknisi, dan Admin Parkir berada di level operasional yang sama di cabang.*

---

## 3. Login & Autentikasi

### 3.1 Halaman Login

Buka aplikasi LaporPark melalui browser (`http://localhost:3000/login` atau URL domain produksi).

**Langkah-langkah:**

1. Masukkan **Email**:
   - **Untuk Pengguna Cabang (Supervisor, CM, TL, Teknisi, Admin Parkir):**  
     Format email wajib menggunakan domain bandara masing-masing:  
     👉 `xxxx@laporpark.{kode_bandara}.id` (atau pola umum: `xxxx@laporpark.xxx.id`)
     
     **Contoh sesuai bandara penugasan:**
     - `admin@laporpark.sub.id` — Admin Parkir Bandara Juanda (Surabaya)
     - `spv@laporpark.dps.id` — Supervisor Bandara I Gusti Ngurah Rai (Denpasar)
     - `cpm@laporpark.upg.id` — Carpark Manager Bandara Sultan Hasanuddin (Makassar)
     - `tl@laporpark.bpn.id` — Team Leader Bandara SAMS Sepinggan (Balikpapan)
     - `teknisi@laporpark.yia.id` — Teknisi Bandara Yogyakarta (YIA)
     - `budi@laporpark.bdj.id` — Petugas Bandara Syamsudin Noor (Banjarmasin)
     - *(Menyesuaikan 14 kode bandara resmi: AMQ, BDJ, BIK, BPN, DJJ, DPS, KOE, LOP, MDC, SOC, SRG, SUB, UPG, YIA)*

   - **Untuk Superadmin (Officer HO - Kantor Pusat):**  
     Menggunakan domain kantor pusat tanpa kode bandara:  
     👉 `xxxx@laporpark.id` (contoh: `officer@laporpark.id` atau `superadmin@laporpark.id`)

2. Masukkan **Password** Anda.
   - Password default saat akun dibuat: `123123`
   - Anda dapat mengklik ikon 👁️ mata untuk menampilkan/menyembunyikan password.

3. *(Opsional)* Centang **"Ingat Saya"** agar email dan password tersimpan di browser untuk login berikutnya.

4. Klik tombol **"Masuk"**.

> [!TIP]
> Setelah login pertama kali, segera ubah password default Anda melalui menu **Ganti Password** di sidebar untuk keamanan akun.

### 3.2 Setelah Login Berhasil

Setelah login berhasil, animasi transisi akan muncul dan Anda akan diarahkan ke:
- **Dashboard** — jika role Anda adalah **Supervisor**, **Carpark Manager**, atau **Superadmin**
- **Daftar Berita Acara** — jika role Anda berada di level operasional (**Team Leader**, **Teknisi**, atau **Admin Parkir Cabang**)

---

## 4. Navigasi & Sidebar

Sidebar adalah panel navigasi utama yang terletak di sisi kiri layar (desktop) atau dapat diakses melalui ikon ☰ hamburger (mobile).

### Menu yang Tampil Berdasarkan Role:

| Menu | Icon | Superadmin (HO) | Supervisor (Cabang) | Carpark Manager | Team Leader | Teknisi | Admin Parkir Cabang |
|------|------|:---------------:|:-------------------:|:---------------:|:-----------:|:-------:|:-------------------:|
| Dashboard | 📊 | ✅ *(Semua Bandara)* | ✅ | ✅ | ❌ | ❌ | ❌ |
| Daftar Berita Acara | 📄 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Buat BA Baru | ➕ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manajemen Pengguna | 👥 | ✅ *(Semua Bandara)* | ✅ *(Cabang Saja)* | ❌ | ❌ | ❌ | ❌ |

### Informasi di Sidebar:
- **Nama Pengguna** — nama lengkap yang terdaftar
- **Role** — tingkatan/jabatan Anda di sistem
- **Bandara** — lokasi bandara tempat Anda bertugas (atau "Semua Bandara" untuk Superadmin)
- **Tombol Ganti Password** — untuk mengubah password
- **Tombol Theme** — beralih antara mode terang dan gelap
- **Tombol Keluar** — logout dari sistem

---

## 5. Panduan per Tingkatan

Sesuai hierarki operasional:
1. **Supervisor** (Pimpinan Operasional Cabang)
2. **Carpark Manager** (Manajer Operasional Cabang)
3. **Level Operasional Cabang — Tingkatan Setara**: **Team Leader**, **Teknisi**, dan **Admin Parkir Cabang**

---

### 5.1 Supervisor

> **Tingkatan:** Kepala operasional bandara — memiliki akses paling luas di tingkat cabang (di bawah Superadmin HO)

| Akses | Keterangan |
|-------|------------|
| Dashboard | ✅ Statistik lengkap bandara sendiri |
| Daftar BA | ✅ Melihat semua BA di bandara sendiri |
| Buat BA Baru | ✅ BA langsung berstatus **"Diketahui"** |
| Edit BA | ✅ Dapat mengedit BA (selama belum Diketahui/Selesai) |
| Hapus BA | ✅ Dapat menghapus BA |
| Setujui BA | ✅ Menandai BA sebagai **"Diketahui"** |
| Tandai Selesai | ✅ Menandai BA sebagai **"Selesai"** |
| Revisi | ✅ Mengembalikan BA untuk diperbaiki |
| Kelola Foto | ✅ Menambah/menghapus foto lampiran |
| Manajemen Pengguna | ✅ CRUD pengguna di bandara sendiri |

**Halaman Utama setelah Login:** Dashboard

#### 5.2.1 Dashboard

Dashboard menampilkan ringkasan statistik berikut:

- **Kartu Statistik:**
  - Jumlah BA berstatus **Diperiksa**
  - Jumlah BA berstatus **Revisi**
  - Jumlah BA berstatus **Selesai**
  - **Total BA** keseluruhan

- **Quick Actions:**
  - 🆕 Buat Berita Acara Baru
  - 📋 Lihat Semua BA

- **Berita Acara Terbaru:** 5 BA terakhir beserta nomor, status, judul, dan pembuat.

#### 5.2.2 Tindakan Persetujuan (Approval)

Pada halaman detail BA, Supervisor memiliki panel tindakan berikut:

| Status BA Saat Ini | Tindakan yang Tersedia |
|---------------------|----------------------|
| Menunggu Review | ✅ Setujui BA · ✅ Kembalikan untuk Revisi |
| Diperiksa | ✅ Setujui BA · ✅ Kembalikan untuk Revisi |
| Revisi | ✅ Setujui BA |
| Diketahui | ✅ Tandai Selesai |
| Selesai | *(tidak ada tindakan)* |

**Cara Menyetujui BA:**
1. Buka halaman **Daftar Berita Acara**.
2. Klik nomor BA atau judul untuk membuka detail.
3. Pada panel **"Tindakan"** di bagian atas, klik tombol yang sesuai:
   - 🟢 **"Setujui Berita Acara"** — Mengubah status menjadi *Diketahui*
   - 🔵 **"Tandai Selesai"** — Mengubah status menjadi *Selesai* (hanya jika sudah Diketahui)
   - 🔴 **"Kembalikan untuk Revisi"** — Mengembalikan BA ke pembuat untuk diperbaiki

#### 5.2.3 Edit Berita Acara

1. Buka halaman detail BA.
2. Klik tombol **"Edit"** di bagian kanan atas.
3. Ubah field yang diperlukan (Judul, Kronologi, Tindakan, Penyelesaian, Mitigasi, dll).
4. Klik **"Simpan"** untuk menyimpan perubahan.

> [!IMPORTANT]
> BA yang sudah berstatus **"Diketahui"** atau **"Selesai"** **tidak dapat diedit** kecuali foto lampiran.

#### 5.2.4 Hapus Berita Acara

1. Buka halaman detail BA.
2. Klik tombol **"Hapus"** (ikon 🗑️) di bagian kanan atas.
3. Konfirmasi penghapusan pada dialog yang muncul.

> [!CAUTION]
> Penghapusan BA bersifat **permanen** dan tidak dapat dikembalikan. Pastikan Anda benar-benar yakin sebelum menghapus.

#### 5.2.5 Manajemen Pengguna

Supervisor dapat mengelola akun pengguna di bandara mereka.

**Akses:** Menu sidebar → **Manajemen Pengguna**

**Fitur yang Tersedia:**

| Fitur | Deskripsi |
|-------|-----------|
| 👀 Lihat Daftar Pengguna | Melihat semua pengguna di bandara sendiri |
| ➕ Buat Pengguna Baru | Membuat akun baru untuk anggota tim |
| ✏️ Edit Profil Pengguna | Mengubah nama, email, dan tanda tangan |
| 🔑 Reset Password | Mengubah password pengguna lain |
| 🗑️ Hapus Pengguna | Menghapus akun pengguna |

**Cara Membuat Pengguna Baru:**
1. Klik tombol **"Buat Pengguna Baru"**.
2. Isi form yang muncul:
   - **Nama Lengkap** — nama pengguna baru
   - **Email** — harus menggunakan format `nama@laporpark.{kode_bandara}.id`
   - **Password** — opsional (default: `123123`)
   - **Role** — pilih tingkatan akses: Team Leader, Teknisi, Carpark Manager, dll.
   - **Tanda Tangan** — opsional, upload gambar tanda tangan digital
3. Klik **"Simpan"**.

> [!WARNING]
> Supervisor **hanya dapat membuat pengguna untuk bandara sendiri**. Email harus menggunakan domain bandara yang sesuai (contoh: `@laporpark.bdj.id` untuk Banjarmasin).

---

### 5.2 Carpark Manager

> **Tingkatan:** Manajer operasional cabang — bertanggung jawab memeriksa dan memverifikasi BA sebelum diajukan ke Supervisor

| Akses | Keterangan |
|-------|------------|
| Dashboard | ✅ Statistik bandara sendiri |
| Daftar BA | ✅ Melihat semua BA di bandara sendiri |
| Buat BA Baru | ✅ BA langsung berstatus **"Diperiksa"** |
| Edit BA | ✅ Dapat mengedit BA (selama belum Diketahui/Selesai) |
| Hapus BA | ❌ Tidak tersedia |
| Tandai Diperiksa | ✅ Menandai BA telah diperiksa |
| Revisi | ✅ Mengembalikan BA untuk diperbaiki |
| Kelola Foto | ✅ Menambah/menghapus foto lampiran |
| Manajemen Pengguna | ❌ Tidak tersedia |

**Halaman Utama setelah Login:** Dashboard

#### 5.2.1 Tindakan Carpark Manager

Pada halaman detail BA, Carpark Manager memiliki panel tindakan berikut:

| Status BA Saat Ini | Tindakan yang Tersedia |
|---------------------|----------------------|
| Menunggu Review | ✅ Tandai Telah Diperiksa · ✅ Kembalikan untuk Revisi |
| Revisi | ✅ Tandai Telah Diperiksa |
| Diperiksa / Diketahui / Selesai | *(tidak ada tindakan tambahan)* |

**Cara Menandai BA Telah Diperiksa:**
1. Buka halaman detail BA yang berstatus **"Menunggu Review"** atau **"Revisi"**.
2. Pada panel **"Tindakan"**, klik tombol 🔵 **"Tandai Telah Diperiksa"**.
3. Status BA akan berubah menjadi **"Diperiksa"** dan menunggu persetujuan Supervisor.

#### 5.2.2 Perbedaan Status Awal BA

Ketika Carpark Manager **membuat BA baru**, status awal BA akan otomatis menjadi **"Diperiksa"** (melewati tahap Menunggu Review), karena pembuatan oleh CM dianggap sudah melalui tahap pemeriksaan.

---

### 5.3 Team Leader

> **Tingkatan:** Level Operasional Cabang (setara dengan Teknisi dan Admin Parkir) — pembuat laporan BA insiden lapangan

| Akses | Keterangan |
|-------|------------|
| Dashboard | ❌ Tidak tersedia |
| Daftar BA | ✅ Melihat semua BA di bandara sendiri |
| Buat BA Baru | ✅ BA berstatus **"Menunggu Review"** |
| Edit BA | ❌ Tidak tersedia |
| Hapus BA | ❌ Tidak tersedia |
| Approval | ❌ Tidak tersedia |
| Kelola Foto | ✅ Hanya pada BA yang dibuat sendiri |
| Manajemen Pengguna | ❌ Tidak tersedia |

**Halaman Utama setelah Login:** Daftar Berita Acara

#### 5.3.1 Membuat Berita Acara Baru

Ini adalah tugas utama Team Leader — melaporkan insiden yang terjadi di lapangan.

**Langkah-langkah:**
1. Klik menu **"Buat BA Baru"** di sidebar, atau tombol **"Buat BA Baru"** di halaman Daftar BA.
2. Isi form berikut:

| Field | Deskripsi | Wajib |
|-------|-----------|:-----:|
| Tanggal Kejadian | Tanggal insiden terjadi | ✅ |
| Waktu Kejadian | Jam insiden terjadi | ✅ |
| Lokasi / Zona | Area spesifik di parkir bandara | ✅ |
| Jenis Insiden | Pilih dari dropdown kategori | ✅ |
| Pihak Terlibat | Nama/pihak yang terlibat (jika ada) | ❌ |
| Judul Masalah | Ringkasan singkat insiden | ✅ |
| Kronologi | Uraian lengkap kejadian | ✅ |
| Tindakan yang Dilakukan | Langkah yang sudah diambil | ✅ |
| Penyelesaian | Hasil penyelesaian insiden | ✅ |
| Mitigasi | Langkah pencegahan ke depan | ✅ |
| Lampiran Foto | Upload foto bukti/dokumentasi | ❌ |

3. *(Opsional)* Klik tombol **✨ AI Cleanup** untuk merapikan teks kronologi, tindakan, penyelesaian, dan mitigasi secara otomatis menggunakan AI.
   - Setelah AI menerapkan perubahan, tombol **↩️ Undo** akan muncul untuk mengembalikan teks asli.

4. *(Opsional)* Klik tombol **👁️ Preview** untuk melihat tampilan BA sebelum dikirim.

5. Klik tombol **"Kirim Berita Acara"** untuk mengirim.

> [!NOTE]
> BA yang dibuat oleh Team Leader akan otomatis mendapatkan status **"Menunggu Review"** dan menunggu pemeriksaan oleh Carpark Manager.

> [!TIP]
> **Nomor BA** akan di-generate otomatis dengan format: `BA/PARKIR/{KODE_BANDARA}/{TAHUN}/{BULAN}/{NOMOR_URUT}`  
> Contoh: `BA/PARKIR/SUB/2026/09/0001` (menyesuaikan kode bandara masing-masing)

#### 5.3.2 Menambah Foto pada BA yang Sudah Dibuat

1. Buka halaman detail BA yang Anda buat.
2. Pada bagian **"Lampiran Foto"**, klik tombol **"Kelola Foto"**.
3. Upload foto baru atau hapus foto yang ada.
4. Klik **"Simpan"**.

> [!TIP]
> Fitur kelola foto tetap tersedia meskipun BA sudah berstatus "Diketahui" atau "Selesai", selama Anda adalah pembuat BA tersebut.

---

### 5.4 Teknisi

> **Tingkatan:** Level Operasional Cabang (setara dengan Team Leader dan Admin Parkir) — pelapor insiden teknis dan peralatan

| Akses | Keterangan |
|-------|------------|
| Dashboard | ❌ Tidak tersedia |
| Daftar BA | ✅ Melihat semua BA di bandara sendiri |
| Buat BA Baru | ✅ BA berstatus **"Menunggu Review"** |
| Edit BA | ❌ Tidak tersedia |
| Hapus BA | ❌ Tidak tersedia |
| Approval | ❌ Tidak tersedia |
| Kelola Foto | ✅ Hanya pada BA yang dibuat sendiri |
| Manajemen Pengguna | ❌ Tidak tersedia |

**Halaman Utama setelah Login:** Daftar Berita Acara

Panduan penggunaan Teknisi **identik dengan Team Leader** (lihat [Bagian 5.3](#53-team-leader)). Fokus Teknisi umumnya pada kategori insiden *Gangguan Perangkat*, *Gangguan Sistem*, atau *Kerusakan Fasilitas*.

---

### 5.5 Admin Parkir Cabang

> **Tingkatan:** Level Operasional Cabang (setara dengan Team Leader dan Teknisi) — staf administrasi dan pencatatan laporan BA cabang

| Akses | Keterangan |
|-------|------------|
| Dashboard | ❌ Tidak tersedia |
| Daftar BA | ✅ Melihat semua BA di bandara sendiri |
| Buat BA Baru | ✅ BA berstatus **"Menunggu Review"** |
| Edit BA | ❌ Tidak tersedia |
| Hapus BA | ❌ Tidak tersedia |
| Approval | ❌ Tidak tersedia |
| Kelola Foto | ❌ Tidak tersedia |
| Manajemen Pengguna | ❌ Tidak tersedia |

**Halaman Utama setelah Login:** Daftar Berita Acara

**Panduan Penggunaan Admin Parkir Cabang:**
1. Membantu menginput dan merapikan Berita Acara insiden administratif di bandara cabang.
2. Mencetak laporan Berita Acara resmi (format PDF) untuk keperluan arsip fisik atau lampiran rapat operasional cabang.
3. Memantau progres status BA di bandara cabang apakah sudah diperiksa oleh Carpark Manager atau disetujui oleh Supervisor.

> [!IMPORTANT]
> **Ingat:** Akun **Admin Parkir Cabang** menggunakan email `admin@laporpark.{kode_bandara}.id` (contoh: `admin@laporpark.sub.id`) dan hanya memiliki akses pada bandara penugasannya, **berbeda dengan Superadmin (Officer HO)** yang memiliki email `xxxx@laporpark.id` dan mengawasi seluruh bandara.

---

## 6. Fitur Umum — Berita Acara

Fitur-fitur berikut tersedia untuk **semua role**.

### 6.1 Melihat Daftar Berita Acara

**Menu:** Sidebar → **Daftar Berita Acara**

Halaman ini menampilkan seluruh BA di bandara Anda dengan fitur:

- **🔍 Pencarian** — Cari berdasarkan judul masalah atau nomor BA
- **📊 Filter Status** — Filter berdasarkan status: Semua, Draft, Menunggu Review, Diperiksa, Revisi, Diketahui, Selesai
- **📋 Tabel/Kartu** — Tampilan tabel (desktop) atau kartu (mobile)
- **📄 Pagination** — Navigasi halaman (10 item per halaman)

### 6.2 Melihat Detail Berita Acara

Klik pada **Nomor BA** atau **Judul Masalah** dari daftar untuk membuka halaman detail yang berisi:

- **Header:** Nomor BA, status, judul masalah
- **Info Meta:**
  - 🏢 Bandara
  - 📅 Tanggal kejadian
  - 🕐 Waktu kejadian
  - 📍 Lokasi/Zona
  - 🏷️ Jenis insiden
- **Pihak Terlibat** (jika ada)
- **Detail Narasi:**
  - Kronologi
  - Tindakan yang Dilakukan
  - Penyelesaian
  - Mitigasi
- **Lampiran Foto** — galeri foto dokumentasi
- **Informasi Pelapor:**
  - Dibuat oleh (nama + role + tanggal)
  - Diperiksa oleh (Carpark Manager + tanggal)
  - Mengetahui (Supervisor + tanggal)
- **Riwayat Perubahan** — log audit setiap perubahan pada BA

### 6.3 Status Berita Acara

Setiap BA memiliki status yang menunjukkan posisinya dalam alur persetujuan:

| Status | Warna Badge | Deskripsi |
|--------|:-----------:|-----------|
| Draft | ⬜ Abu-abu | BA masih dalam draft (belum digunakan secara aktif) |
| Menunggu Review | 🟡 Kuning | BA baru dibuat, menunggu pemeriksaan CM |
| Diperiksa | 🔵 Biru | CM sudah memeriksa, menunggu persetujuan Supervisor |
| Revisi | 🟠 Oranye | BA dikembalikan untuk diperbaiki oleh pembuat |
| Diketahui | 🟢 Hijau | Supervisor sudah menyetujui BA |
| Selesai | ✅ Teal | BA telah selesai dan ditutup |

---

## 7. Alur Persetujuan (Approval Workflow)

Berikut adalah alur standar sebuah Berita Acara dari pembuatan hingga selesai:

```mermaid
graph LR
    A["📝 Dibuat oleh TL/Teknisi"] --> B["⏳ Menunggu Review"]
    B --> C["✅ Diperiksa oleh CM"]
    C --> D["📋 Diketahui oleh SPV"]
    D --> E["🏁 Selesai"]
    
    B --> F["🔄 Revisi"]
    C --> F
    F --> B

    style A fill:#6366f1,color:#fff
    style B fill:#f59e0b,color:#fff
    style C fill:#3b82f6,color:#fff
    style D fill:#10b981,color:#fff
    style E fill:#06b6d4,color:#fff
    style F fill:#f97316,color:#fff
```

### Alur Detail:

1. **Team Leader / Teknisi** membuat BA baru → status otomatis **"Menunggu Review"**
2. **Carpark Manager** memeriksa BA:
   - Jika sesuai → klik **"Tandai Telah Diperiksa"** → status menjadi **"Diperiksa"**
   - Jika perlu perbaikan → klik **"Kembalikan untuk Revisi"** → status menjadi **"Revisi"**
3. **Supervisor** mereview BA yang sudah diperiksa:
   - Jika setuju → klik **"Setujui Berita Acara"** → status menjadi **"Diketahui"**
   - Jika perlu perbaikan → klik **"Kembalikan untuk Revisi"** → status menjadi **"Revisi"**
4. **Supervisor** menandai BA yang sudah disetujui → klik **"Tandai Selesai"** → status menjadi **"Selesai"**

### Alur Khusus:

| Pembuat BA | Status Awal |
|------------|-------------|
| Team Leader | Menunggu Review |
| Teknisi | Menunggu Review |
| Carpark Manager | Diperiksa (melewati tahap review) |
| Supervisor | Diketahui (melewati tahap review dan periksa) |

---

## 8. Cetak & PDF

Semua pengguna dapat mencetak BA dalam format dokumen resmi.

**Cara Mencetak:**
1. Buka halaman **Detail Berita Acara**.
2. Klik tombol **"Print/PDF"** di bagian kanan atas.
3. Jendela cetak browser akan terbuka.
4. Pilih **printer** atau pilih **"Save as PDF"** untuk menyimpan sebagai file PDF.

**Layout cetak** akan menampilkan format dokumen resmi lengkap dengan:
- Kop surat Angkasa Pura Supports & Centre Park
- Nomor BA
- Seluruh detail insiden
- Tanda tangan digital (jika tersedia):
  - Yang Membuat (pembuat BA)
  - Yang Memeriksa (Carpark Manager)
  - Mengetahui (Supervisor)

---

## 9. Ganti Password

Semua pengguna dapat mengubah password mereka sendiri.

**Cara Ganti Password:**
1. Pada sidebar, klik tombol **"Ganti Password"** (ikon 🔑).
2. Modal akan muncul dengan form:
   - **Password Baru** — minimal 6 karakter
   - **Konfirmasi Password** — ketik ulang password baru
3. Klik **"Simpan"**.

> [!WARNING]
> Setelah mengganti password, password display yang terlihat di Manajemen Pengguna **tidak akan otomatis terupdate** kecuali password diubah melalui Manajemen Pengguna oleh Supervisor.

---

## 10. Dark Mode / Light Mode

LaporPark mendukung tema **gelap** dan **terang**.

**Cara Mengganti Tema:**

- **Desktop:** Klik ikon 🌙/☀️ di bagian bawah sidebar.
- **Mobile:** Klik ikon tema di header bar atas.

Tema akan langsung diterapkan tanpa perlu refresh halaman.

---

## 11. FAQ & Troubleshooting

### ❓ Saya tidak bisa login

- Pastikan email dan password sudah benar.
- Pastikan format email sesuai: `nama@laporpark.{kode_bandara}.id`
- Hubungi Supervisor Anda untuk memastikan akun sudah dibuat.
- Jika masih gagal, minta Supervisor untuk melakukan reset password.

### ❓ Saya tidak bisa melihat Dashboard

Dashboard hanya tersedia untuk role **Supervisor** dan **Carpark Manager**. Jika Anda adalah Team Leader, Teknisi, atau Admin, Anda akan langsung diarahkan ke Daftar Berita Acara.

### ❓ Saya tidak bisa mengedit BA

Hanya **Carpark Manager** dan **Supervisor** yang dapat mengedit BA. Selain itu, BA yang sudah berstatus **"Diketahui"** atau **"Selesai"** tidak dapat diedit.

### ❓ Saya tidak bisa melihat BA dari bandara lain

Ini adalah fitur **Isolasi Multi-Cabang**. Setiap pengguna hanya dapat melihat BA dari bandara tempat mereka ditugaskan. Ini dikendalikan berdasarkan kode bandara di email Anda.

### ❓ Tombol approval tidak muncul di halaman detail BA

Tombol approval hanya tampil sesuai role dan status BA saat ini. Lihat [Bagian 7](#7-alur-persetujuan-approval-workflow) untuk alur lengkapnya.

### ❓ Saya ingin menambahkan foto tapi tombol "Kelola Foto" tidak muncul

Tombol ini muncul jika:
- Anda adalah **Supervisor**, **Carpark Manager**, atau
- Anda adalah **pembuat BA tersebut** (Team Leader/Teknisi)

### ❓ Nomor BA tidak berurut

Nomor BA digenerate otomatis berdasarkan **bulan dan tahun** saat BA dibuat. Jika ada BA yang dihapus, nomor tersebut tidak akan dipakai ulang.

---

> [!NOTE]
> **Versi Manual:** 1.0 — September 2026
> **Aplikasi:** LaporPark — Sistem Manajemen Berita Acara Parkir
> **Organisasi:** Angkasa Pura Supports × Centre Park
