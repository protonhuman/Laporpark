/**
 * backup_db.js — Lapor Park Database Backup Script
 * =====================================================
 * Mengekspor semua tabel Supabase ke file JSON lokal
 * dengan timestamp agar mudah di-restore jika diperlukan.
 *
 * Cara pakai:
 *   node backup_db.js
 *
 * Hasil backup disimpan di folder:
 *   ./backups/YYYY-MM-DD_HH-MM-SS/
 */

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// ── Konfigurasi ──────────────────────────────────────────────
const SUPABASE_URL = "https://ouaphnqctltzzutozqih.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91YXBobnFjdGx0enp1dG96cWloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzcxOTc4NSwiZXhwIjoyMTAzMjk1Nzg1fQ.FHQ-Nw4YvmS0K0NAtb2M1R234zoHTJ8Tle9wvNKEUzM";

// Tabel yang akan di-backup (urutkan dari parent ke child)
const TABLES = [
  "users",
  "berita_acara",
  "ba_audit_log",
];

// Maksimal baris per halaman (pagination)
const PAGE_SIZE = 1000;
// ─────────────────────────────────────────────────────────────

// Warna terminal
const C = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
};

function log(color, prefix, msg) {
  console.log(`${color}${C.bright}[${prefix}]${C.reset} ${msg}`);
}

// Buat timestamp untuk nama folder
function getTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
    `_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`
  );
}

// Ambil semua data dari satu tabel dengan pagination
async function fetchAllRows(supabase, table) {
  let allRows = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .range(from, from + PAGE_SIZE - 1)
      .order("created_at", { ascending: true });

    if (error) {
      // Coba tanpa order jika kolom created_at tidak ada
      const { data: data2, error: error2 } = await supabase
        .from(table)
        .select("*")
        .range(from, from + PAGE_SIZE - 1);

      if (error2) throw new Error(`Gagal fetch tabel "${table}": ${error2.message}`);
      allRows = allRows.concat(data2 || []);
      if ((data2 || []).length < PAGE_SIZE) break;
    } else {
      allRows = allRows.concat(data || []);
      if ((data || []).length < PAGE_SIZE) break;
    }

    from += PAGE_SIZE;
  }

  return allRows;
}

// Format ukuran file
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function runBackup() {
  const timestamp = getTimestamp();
  const backupDir = path.join(__dirname, "backups", timestamp);

  console.log("");
  console.log(`${C.bright}${C.cyan}╔══════════════════════════════════════════╗${C.reset}`);
  console.log(`${C.bright}${C.cyan}║   Lapor Park — Database Backup Script    ║${C.reset}`);
  console.log(`${C.bright}${C.cyan}╚══════════════════════════════════════════╝${C.reset}`);
  console.log(`${C.dim}  Timestamp : ${timestamp}${C.reset}`);
  console.log(`${C.dim}  Output    : ${backupDir}${C.reset}`);
  console.log("");

  // Init Supabase admin client
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Buat folder backup
  fs.mkdirSync(backupDir, { recursive: true });

  const summary = [];
  let totalRows = 0;
  let totalBytes = 0;
  let hasError = false;

  // Backup tiap tabel
  for (const table of TABLES) {
    process.stdout.write(`  ${C.yellow}o${C.reset} Mengekspor tabel "${C.bright}${table}${C.reset}" ... `);

    try {
      const rows = await fetchAllRows(supabase, table);
      const json = JSON.stringify({ table, exported_at: new Date().toISOString(), count: rows.length, rows }, null, 2);
      const filePath = path.join(backupDir, `${table}.json`);
      fs.writeFileSync(filePath, json, "utf8");

      const bytes = Buffer.byteLength(json, "utf8");
      totalRows += rows.length;
      totalBytes += bytes;

      console.log(`${C.green}OK${C.reset} ${rows.length} baris (${formatBytes(bytes)})`);
      summary.push({ table, rows: rows.length, size: formatBytes(bytes), status: "OK" });
    } catch (err) {
      console.log(`${C.red}GAGAL${C.reset}`);
      console.log(`    ${C.red}-> ${err.message}${C.reset}`);
      summary.push({ table, rows: 0, size: "-", status: `GAGAL: ${err.message}` });
      hasError = true;
    }
  }

  // Tulis file manifest (ringkasan backup)
  const manifest = {
    backup_timestamp: timestamp,
    created_at: new Date().toISOString(),
    supabase_url: SUPABASE_URL,
    tables: summary,
    total_rows: totalRows,
    total_size_bytes: totalBytes,
    status: hasError ? "PARTIAL" : "SUCCESS",
  };
  const manifestPath = path.join(backupDir, "_manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");

  // Ringkasan akhir
  console.log("");
  console.log(`${C.dim}  ------------------------------------------${C.reset}`);
  if (hasError) {
    log(C.yellow, "PERINGATAN", "Backup selesai dengan beberapa error.");
  } else {
    log(C.green, "SELESAI", "Semua tabel berhasil di-backup!");
  }
  console.log(`${C.dim}  Total baris  : ${totalRows.toLocaleString()}${C.reset}`);
  console.log(`${C.dim}  Total ukuran : ${formatBytes(totalBytes)}${C.reset}`);
  console.log(`${C.dim}  Lokasi       : ${backupDir}${C.reset}`);
  console.log("");
  console.log(`${C.dim}  Tip: Salin folder backups/ ke Google Drive / USB untuk keamanan ekstra.${C.reset}`);
  console.log("");
}

runBackup().catch((err) => {
  console.error(`\nERROR FATAL: ${err.message}`);
  process.exit(1);
});
