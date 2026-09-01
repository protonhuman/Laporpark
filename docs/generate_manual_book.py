import os
import base64
import subprocess

def get_base64_image(file_path):
    if os.path.exists(file_path):
        with open(file_path, "rb") as f:
            ext = "png" if file_path.lower().endswith(".png") else "jpeg"
            return f"data:image/{ext};base64,{base64.b64encode(f.read()).decode('utf-8')}"
    return ""

logo_aps = get_base64_image("d:/Website/Lapor Park/ba-parkir/public/logo-aps.png")
logo_cp = get_base64_image("d:/Website/Lapor Park/ba-parkir/public/logo-cp.png")

html_content = f"""<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Buku Panduan Praktis - Lapor Park Digital</title>
<style>
  @page {{
    size: A4 portrait;
    margin: 14mm 15mm 15mm 15mm;
    @bottom-right {{
      content: "Halaman " counter(page);
      font-size: 8pt;
      color: #64748b;
    }}
  }}

  * {{
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }}

  body {{
    font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
    color: #1e293b;
    background: #ffffff;
    line-height: 1.5;
    font-size: 9.5pt;
    margin: 0;
    padding: 0;
  }}

  .page-break {{
    page-break-after: always;
    break-after: page;
  }}

  .avoid-break {{
    page-break-inside: avoid;
    break-inside: avoid;
  }}

  /* HEADER DOKUMEN */
  .doc-header {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 8px;
    margin-bottom: 16px;
  }}
  .doc-header .brand {{
    font-size: 9pt;
    font-weight: 700;
    color: #0284c7;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }}
  .doc-header .doc-title {{
    font-size: 8.5pt;
    color: #64748b;
  }}

  /* COVER STYLES */
  .cover-container {{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 250mm;
    text-align: center;
    padding: 10mm 5mm 5mm 5mm;
  }}
  .cover-logos {{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 32px;
    margin-bottom: 25px;
  }}
  .cover-logos img {{
    height: 48px;
    object-fit: contain;
  }}
  .cover-badge {{
    display: inline-block;
    background: #f0f9ff;
    color: #0369a1;
    padding: 5px 16px;
    border-radius: 20px;
    font-size: 9pt;
    font-weight: 700;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 14px;
    border: 1px solid #bae6fd;
  }}
  .cover-title {{
    font-size: 26pt;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
    margin: 0 0 10px 0;
  }}
  .cover-title span {{
    color: #0284c7;
  }}
  .cover-subtitle {{
    font-size: 11.5pt;
    color: #475569;
    max-width: 520px;
    margin: 0 auto 24px auto;
    line-height: 1.45;
  }}
  .role-pill-group {{
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 24px;
  }}
  .role-pill {{
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 6px 14px;
    font-size: 9pt;
    font-weight: 700;
    color: #334155;
  }}
  .role-pill.tl {{ border-color: #818cf8; color: #4338ca; background: #eef2ff; }}
  .role-pill.tek {{ border-color: #34d399; color: #065f46; background: #ecfdf5; }}
  .role-pill.adm {{ border-color: #c084fc; color: #6b21a8; background: #faf5ff; }}

  /* OVERVIEW HERO BOX */
  .hero-box {{
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    border-radius: 14px;
    padding: 20px;
    color: white;
    text-align: left;
    margin-bottom: 24px;
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
  }}
  .hero-title {{
    font-size: 11pt;
    font-weight: 700;
    color: #38bdf8;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
  }}
  .hero-desc {{
    font-size: 9pt;
    color: #cbd5e1;
    line-height: 1.5;
    margin: 0;
  }}

  /* QUICK FLOW */
  .quick-flow {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 14px 12px;
    margin-bottom: 20px;
  }}
  .flow-item {{
    text-align: center;
    flex: 1;
  }}
  .flow-number {{
    width: 26px;
    height: 26px;
    line-height: 26px;
    background: #0284c7;
    color: white;
    border-radius: 50%;
    font-size: 9pt;
    font-weight: bold;
    margin: 0 auto 6px auto;
  }}
  .flow-label {{
    font-size: 8.5pt;
    font-weight: 700;
    color: #1e293b;
  }}
  .flow-sub {{
    font-size: 7.5pt;
    color: #64748b;
  }}
  .flow-arrow {{
    font-size: 14pt;
    color: #94a3b8;
    padding: 0 4px;
    font-weight: bold;
  }}

  .cover-footer {{
    border-top: 1px solid #e2e8f0;
    padding-top: 12px;
    display: flex;
    justify-content: space-between;
    font-size: 8pt;
    color: #64748b;
    text-align: left;
  }}

  /* SECTION HEADINGS */
  h2.step-header {{
    font-size: 13pt;
    font-weight: 800;
    color: #0f172a;
    border-bottom: 2px solid #0284c7;
    padding-bottom: 4px;
    margin-top: 12px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }}
  .step-badge {{
    background: #0284c7;
    color: white;
    font-size: 9pt;
    padding: 2px 8px;
    border-radius: 6px;
  }}

  /* INSTRUCTION CARDS */
  .card {{
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 12px 14px;
    margin-bottom: 12px;
  }}
  .card-title {{
    font-size: 9.5pt;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }}
  .card-tip {{
    background: #f0fdf4;
    border-left: 4px solid #16a34a;
    border-radius: 6px;
    padding: 9px 12px;
    margin: 10px 0;
    font-size: 8.8pt;
    color: #166534;
  }}
  .card-tip strong {{
    color: #14532d;
  }}
  .card-alert {{
    background: #fffbeb;
    border-left: 4px solid #f59e0b;
    border-radius: 6px;
    padding: 9px 12px;
    margin: 10px 0;
    font-size: 8.8pt;
    color: #92400e;
  }}
  .card-ai {{
    background: #faf5ff;
    border: 1px solid #d8b4fe;
    border-left: 4px solid #9333ea;
    border-radius: 8px;
    padding: 10px 14px;
    margin: 10px 0;
  }}

  /* TABLES */
  table.field-table {{
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0;
    font-size: 8.8pt;
  }}
  table.field-table th {{
    background: #f1f5f9;
    color: #334155;
    font-weight: 700;
    text-align: left;
    padding: 6px 10px;
    border: 1px solid #cbd5e1;
  }}
  table.field-table td {{
    padding: 6px 10px;
    border: 1px solid #e2e8f0;
    vertical-align: top;
  }}
  table.field-table tr:nth-child(even) {{
    background: #f8fafc;
  }}

  /* STEPS NUMBERED */
  .step-list {{
    margin: 0;
    padding: 0;
    list-style: none;
  }}
  .step-list-item {{
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    align-items: flex-start;
  }}
  .num-circle {{
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    background: #e0f2fe;
    color: #0369a1;
    border: 1px solid #bae6fd;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    font-weight: bold;
    font-size: 8.5pt;
  }}
  .step-text {{
    flex: 1;
  }}
  .step-text strong {{
    color: #0f172a;
  }}

  /* SIGNATURE PREVIEW */
  .sig-box {{
    border: 1px solid #334155;
    border-collapse: collapse;
    width: 100%;
    margin-top: 10px;
    text-align: center;
    font-size: 8.5pt;
  }}
  .sig-box th {{
    border: 1px solid #334155;
    background: #f8fafc;
    padding: 6px;
    font-weight: 700;
    width: 33.33%;
  }}
  .sig-box td {{
    border: 1px solid #334155;
    padding: 10px 6px 6px 6px;
    height: 58px;
    vertical-align: bottom;
  }}
  .sig-role {{
    font-size: 7.5pt;
    color: #64748b;
    margin-top: 2px;
  }}

  /* BADGES */
  .status-badge {{
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 8pt;
    font-weight: 700;
  }}
  .status-review {{ background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }}
  .status-check {{ background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }}
  .status-ok {{ background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }}

  code {{
    background: #f1f5f9;
    color: #0f172a;
    padding: 2px 5px;
    border-radius: 4px;
    font-family: Consolas, monospace;
    font-size: 8.5pt;
    border: 1px solid #e2e8f0;
  }}
</style>
</head>
<body>

<!-- ========================================================
     HALAMAN 1: COVER & ALUR KERJA CEPAT
======================================================== -->
<div class="cover-container page-break">
  <div>
    <div class="cover-logos">
      <img src="{logo_aps}" alt="Angkasa Pura Supports">
      <img src="{logo_cp}" alt="Centre Park">
    </div>

    <span class="cover-badge">Buku Panduan Praktis Petugas Lapangan</span>
    <h1 class="cover-title">LAPOR PARK <span>DIGITAL</span></h1>
    <p class="cover-subtitle">Panduan Operasional Pembuatan & Pelaporan Berita Acara Insiden Parkir Bandara Internasional Syamsudin Noor (BDJ)</p>

    <div class="role-pill-group">
      <div class="role-pill tl">Role: Team Leader</div>
      <div class="role-pill tek">Role: Teknisi</div>
      <div class="role-pill adm">Role: Admin Lapangan</div>
    </div>

    <div class="hero-box">
      <div class="hero-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        Tujuan Panduan Ini
      </div>
      <p class="hero-desc">
        Buku panduan ringkas ini disusun khusus bagi <strong>Team Leader</strong>, <strong>Teknisi</strong>, dan <strong>Admin</strong> agar dapat mengoperasikan sistem <strong>Lapor Park</strong> secara mudah, cepat, dan mandiri — mulai dari proses login, mencatat kronologi dengan asisten AI, melampirkan foto dokumentasi kejadian, hingga dokumen Berita Acara resmi selesai ditandatangani.
      </p>
    </div>

    <div style="text-align: left; margin-bottom: 8px;">
      <strong style="font-size: 9.5pt; color: #0f172a;">Alur 4 Langkah Mudah (End-to-End):</strong>
    </div>

    <div class="quick-flow">
      <div class="flow-item">
        <div class="flow-number">1</div>
        <div class="flow-label">Login Akun</div>
        <div class="flow-sub">Masuk via Web/HP</div>
      </div>
      <div class="flow-arrow">➔</div>
      <div class="flow-item">
        <div class="flow-number">2</div>
        <div class="flow-label">Buat Laporan</div>
        <div class="flow-sub">Isi Form & Rapi AI</div>
      </div>
      <div class="flow-arrow">➔</div>
      <div class="flow-item">
        <div class="flow-number">3</div>
        <div class="flow-label">Unggah Foto</div>
        <div class="flow-sub">Bukti Dokumentasi</div>
      </div>
      <div class="flow-arrow">➔</div>
      <div class="flow-item">
        <div class="flow-number">4</div>
        <div class="flow-label">Ttd & Cetak</div>
        <div class="flow-sub">Otomatis 3 Kolom</div>
      </div>
    </div>

    <div class="card-tip" style="text-align: left;">
      <strong>Catatan Hak Akses:</strong> Sebagai pelapor operasional, akun Anda langsung diarahkan ke menu <strong>Daftar Berita Acara</strong> setelah login. Anda berfokus pada pembuatan laporan akurat dan pengelolaan lampiran foto.
    </div>
  </div>

  <div class="cover-footer">
    <div><strong>Operasional:</strong> Bandara Internasional Syamsudin Noor (BDJ)</div>
    <div><strong>Versi Dokumen:</strong> 2.1 (Ringkas & Praktis) — 2026</div>
  </div>
</div>

<!-- ========================================================
     HALAMAN 2: LOGIN & PEMBUATAN BERITA ACARA (+ FITUR AI)
======================================================== -->
<div class="doc-header">
  <span class="brand">Lapor Park Digital</span>
  <span class="doc-title">Langkah 1 & 2: Login dan Pembuatan Laporan</span>
</div>

<h2 class="step-header">
  <span class="step-badge">Langkah 1</span> Login ke Aplikasi Lapor Park
</h2>

<div class="card">
  <ul class="step-list">
    <li class="step-list-item">
      <div class="num-circle">1</div>
      <div class="step-text">
        Buka browser di HP / Laptop (Google Chrome disarankan), lalu akses alamat web Lapor Park.
      </div>
    </li>
    <li class="step-list-item">
      <div class="num-circle">2</div>
      <div class="step-text">
        Masukkan <strong>Alamat Email</strong> dan <strong>Kata Sandi (Password)</strong> akun Anda.
      </div>
    </li>
    <li class="step-list-item">
      <div class="num-circle">3</div>
      <div class="step-text">
        Klik tombol <strong>"Masuk ke Sistem"</strong>. Setelah berhasil, Anda akan langsung diarahkan ke halaman utama: <strong>Daftar Berita Acara</strong>.
      </div>
    </li>
  </ul>
  <div class="card-tip" style="margin-top: 6px; margin-bottom: 0;">
    <strong>Tips Keamanan:</strong> Anda dapat mengubah password akun sendiri kapan saja melalui menu nama Anda di pojok kiri bawah layar.
  </div>
</div>

<h2 class="step-header">
  <span class="step-badge">Langkah 2</span> Membuat Berita Acara Baru & Fitur AI
</h2>

<div class="card">
  <p style="margin-top: 0; margin-bottom: 8px;">
    Klik tombol <strong>"+ Buat BA Baru"</strong> di bilah navigasi atau tombol di kanan atas layar, lalu lengkapi data kejadian berikut:
  </p>

  <table class="field-table">
    <thead>
      <tr>
        <th style="width: 25%;">Kolom Form</th>
        <th style="width: 75%;">Panduan Pengisian</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Waktu & Lokasi</strong></td>
        <td>Pilih <strong>Tanggal</strong>, <strong>Jam Kejadian</strong>, dan <strong>Lokasi/Zona</strong> (misal: <em>Gate Masuk Mobil, Pos Keluar B, Gedung Parkir</em>).</td>
      </tr>
      <tr>
        <td><strong>Jenis Insiden</strong></td>
        <td>Pilih kategori: <em>Kerusakan, Kerusakan Kendaraan, Komplain, Kehilangan, Gangguan Sistem, Gangguan Perangkat,</em> atau <em>Lainnya</em>.</td>
      </tr>
      <tr>
        <td><strong>Pihak Terlibat</strong></td>
        <td>Isi nama pengguna jasa / tamu, nomor telepon, dan nomor plat kendaraan (opsional bila insiden internal perangkat).</td>
      </tr>
      <tr>
        <td><strong>Judul Masalah</strong></td>
        <td>Ringkasan 1 baris permasalahan (misal: <em>"Portal Gate 02 Patah Tertabrak Mobil Avanza"</em>).</td>
      </tr>
      <tr>
        <td><strong>5 Kolom Narasi</strong></td>
        <td>
          Terdiri dari: <strong>Judul</strong>, <strong>Kronologi Kejadian</strong>, <strong>Tindakan yang Dilakukan</strong>, <strong>Penyelesaian Masalah</strong>, dan <strong>Langkah Mitigasi Pencegahan</strong>.
        </td>
      </tr>
    </tbody>
  </table>

  <!-- KOTAK FITUR AI -->
  <div class="card-ai">
    <div style="font-weight: 700; color: #7e22ce; font-size: 9pt; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
      Fitur Bantuan: "Minta AI untuk Merapikan Kronologi"
    </div>
    <div style="font-size: 8.8pt; color: #4c1d95; line-height: 1.45;">
      Di lapangan Anda tidak perlu khawatir mengetik panjang dengan bahasa baku. Cukup tuliskan poin-poin penting secara singkat di kolom kronologi, tindakan, penyelesaian, dan mitigasi, lalu klik tombol:
      <div style="text-align: center; margin: 8px 0;">
        <span style="background: linear-gradient(135deg, #9333ea, #6366f1); color: white; padding: 5px 14px; border-radius: 6px; font-weight: 700; font-size: 8.5pt; display: inline-block;">
          ✨ Minta AI untuk Merapikan Kronologi
        </span>
      </div>
      Asisten AI akan langsung menyusun ulang bahasa menjadi kalimat berita acara formal, rapi, dan profesional dalam beberapa detik <strong>tanpa mengubah fakta kejadian</strong>. Anda tetap dapat membaca dan mengoreksi hasilnya sebelum disimpan.
    </div>
  </div>

  <p style="margin-bottom: 0;">
    Setelah seluruh form terisi, klik <strong>"Simpan Berita Acara"</strong>. Nomor Berita Acara otomatis diterbitkan oleh sistem (contoh: <code>BA/BDJ/20260901/001</code>) dan statusnya otomatis masuk antrean <span class="status-badge status-review">Menunggu Review</span>.
  </p>
</div>

<div class="page-break"></div>

<!-- ========================================================
     HALAMAN 3: KELOLA FOTO, TANDA TANGAN & CETAK DOKUMEN
======================================================== -->
<div class="doc-header">
  <span class="brand">Lapor Park Digital</span>
  <span class="doc-title">Langkah 3 & 4: Foto Lampiran, Tanda Tangan & Cetak PDF</span>
</div>

<h2 class="step-header">
  <span class="step-badge">Langkah 3</span> Mengunggah & Mengelola Lampiran Foto
</h2>

<div class="card">
  <p style="margin-top: 0; margin-bottom: 8px;">
    Dokumentasi visual sangat penting untuk klaim, audit, dan bukti pertanggungjawaban. Sistem Lapor Park memberikan fleksibilitas penuh:
  </p>

  <ul class="step-list">
    <li class="step-list-item">
      <div class="num-circle">A</div>
      <div class="step-text">
        <strong>Saat Buat BA:</strong> Anda dapat mengunggah hingga beberapa foto langsung dari kamera HP atau galeri penyimpanan.
      </div>
    </li>
    <li class="step-list-item">
      <div class="num-circle">B</div>
      <div class="step-text">
        <strong>Setelah BA Dibuat (Kapan Saja):</strong> Jika bukti tambahan baru didapatkan (misal: bukti transfer ganti rugi, foto rekaman CCTV, atau foto alat sesudah diperbaiki), Anda tetap dapat menambahkannya!
        <div style="margin-top: 6px;">
          Cukup buka detail BA yang Anda buat, lalu klik tombol <strong>"Kelola Foto"</strong> di bagian Lampiran Foto. Anda bisa menambah foto baru atau menghapus foto yang keliru kapan saja.
        </div>
      </div>
    </li>
  </ul>
</div>

<h2 class="step-header">
  <span class="step-badge">Langkah 4</span> Alur Tanda Tangan Digital & Cetak Dokumen
</h2>

<div class="card">
  <p style="margin-top: 0; margin-bottom: 6px;">
    Sebagai pelapor operasional (<strong>Team Leader</strong>, <strong>Teknisi</strong>, atau <strong>Admin</strong>), Berita Acara yang Anda buat menggunakan <strong>Format Resmi 3 Kolom Tanda Tangan</strong>:
  </p>

  <table class="sig-box">
    <thead>
      <tr>
        <th>1. DIBUAT OLEH</th>
        <th>2. DIPERIKSA OLEH</th>
        <th>3. MENGETAHUI</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <span style="font-weight: bold; text-decoration: underline;">[Nama Anda]</span>
          <div class="sig-role">Team Leader / Teknisi / Admin</div>
          <div style="font-size: 7.5pt; color: #16a34a; font-weight: 600; margin-top: 2px;">(Tanda Tangan Otomatis)</div>
        </td>
        <td>
          <span style="font-weight: bold; text-decoration: underline;">[Nama Carpark Manager]</span>
          <div class="sig-role">Carpark Manager CP</div>
          <div style="font-size: 7.5pt; color: #0284c7; font-weight: 600; margin-top: 2px;">(Setelah Ditandai Diperiksa)</div>
        </td>
        <td>
          <span style="font-weight: bold; text-decoration: underline;">[Nama Supervisor]</span>
          <div class="sig-role">Supervisor Parkir</div>
          <div style="font-size: 7.5pt; color: #9333ea; font-weight: 600; margin-top: 2px;">(Setelah Disetujui Final)</div>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="card-tip" style="margin-top: 12px;">
    <strong>Bagaimana Tanda Tangan Anda Muncul?</strong><br>
    Tanda tangan Anda tersimpan aman di akun profil. Begitu Anda membuat Berita Acara, tanda tangan digital Anda otomatis terpasang rapi pada kolom <strong>"Dibuat Oleh"</strong> tanpa perlu upload tanda tangan berulang-ulang.
  </div>

  <div style="margin-top: 12px;">
    <strong style="font-size: 9.5pt; color: #0f172a;">Cara Mencetak Berita Acara Resmi:</strong>
    <ol style="margin-top: 6px; padding-left: 18px;">
      <li>Buka Berita Acara yang ingin dicetak dari menu <strong>Daftar Berita Acara</strong>.</li>
      <li>Pastikan status laporan sudah berstatus <span class="status-badge status-check">Diperiksa</span> atau <span class="status-badge status-ok">Disetujui</span>.</li>
      <li>Klik tombol <strong>"Cetak Berita Acara"</strong> di kanan atas halaman.</li>
      <li>
        Tampilan cetak standar resmi akan muncul (Font standar <strong>Arial 11pt</strong>, kop logo APS & CentrePark, dan tanda tangan lengkap).
      </li>
      <li>Pilih printer tujuan atau pilih <strong>"Save as PDF"</strong> untuk menyimpan file ke perangkat Anda.</li>
    </ol>
  </div>
</div>

<div class="card-alert">
  <strong>Butuh Bantuan Akun atau Reset Password?</strong><br>
  Jika Anda lupa password, mengalami kendala tanda tangan, atau butuh bantuan teknis, hubungi <strong>Supervisor Parkir Bandara Syamsudin Noor</strong> yang bertindak sebagai administrator sistem.
</div>

<div style="margin-top: 20px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 8pt; color: #94a3b8;">
  © 2026 PT Angkasa Pura Supports & PT Centrepark Citra Corpora. Sistem Berita Acara Parkir Digital (Lapor Park).
</div>

</body>
</html>
"""

html_file_path = "d:/Website/Lapor Park/manual_book_lapor_park.html"
pdf_file_path = "d:/Website/Lapor Park/MANUAL_BOOK_LAPOR_PARK_RINGKAS.pdf"
main_pdf_path = "d:/Website/Lapor Park/MANUAL_BOOK_LAPOR_PARK.pdf"

with open(html_file_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML manual book created at: {html_file_path}")

# Run Chrome headless to render PDF
chrome_path = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
cmd = [
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f"--print-to-pdf={pdf_file_path}",
    html_file_path
]

res = subprocess.run(cmd, capture_output=True, text=True)
print(f"Chrome Return code: {res.returncode}")
if os.path.exists(pdf_file_path):
    size_bytes = os.path.getsize(pdf_file_path)
    print(f"SUCCESS: PDF ringkas generated at: {pdf_file_path} ({size_bytes / 1024:.1f} KB)")
    # Coba copy ke nama utama jika tidak sedang dibuka/dikunci
    import shutil
    try:
        shutil.copyfile(pdf_file_path, main_pdf_path)
        print(f"SUCCESS: File utama {main_pdf_path} juga berhasil diperbarui!")
    except Exception as e:
        print(f"Catatan: {main_pdf_path} sedang dibuka di PDF viewer/browser. Silakan gunakan {pdf_file_path} atau tutup aplikasi penampil PDF untuk menimpa file utama.")
else:
    print(f"ERROR: PDF was not generated. Stderr: {res.stderr}")
