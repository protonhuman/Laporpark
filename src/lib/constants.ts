// ============================================================
// Lapor Park — Daftar Bandara (Airport Constants)
// Master list of supported airport locations
// ============================================================

export interface Bandara {
  kode: string;
  nama: string;
  lokasi: string;
}

/**
 * Master list of all supported airports.
 * Sorted alphabetically by airport code.
 */
export const DAFTAR_BANDARA: Bandara[] = [
  { kode: "AMQ", nama: "Bandara Pattimura", lokasi: "Ambon" },
  { kode: "BDJ", nama: "Bandara Internasional Syamsudin Noor", lokasi: "Banjarmasin" },
  { kode: "BIK", nama: "Bandara Internasional Frans Kaisiepo", lokasi: "Biak" },
  { kode: "BPN", nama: "Bandara Internasional Sultan Aji Muhammad Sulaiman Sepinggan", lokasi: "Balikpapan" },
  { kode: "DJJ", nama: "Bandara Internasional Sentani", lokasi: "Jayapura" },
  { kode: "DPS", nama: "Bandara Internasional I Gusti Ngurah Rai", lokasi: "Denpasar" },
  { kode: "KOE", nama: "Bandara Internasional El Tari", lokasi: "Kupang" },
  { kode: "LOP", nama: "Bandara Internasional Zainuddin Abdul Madjid", lokasi: "Lombok" },
  { kode: "MDC", nama: "Bandara Internasional Sam Ratulangi", lokasi: "Manado" },
  { kode: "SOC", nama: "Bandara Internasional Adi Soemarmo", lokasi: "Solo" },
  { kode: "SRG", nama: "Bandara Internasional Jenderal Ahmad Yani", lokasi: "Semarang" },
  { kode: "SUB", nama: "Bandara Internasional Juanda", lokasi: "Surabaya" },
  { kode: "UPG", nama: "Bandara Internasional Sultan Hasanuddin", lokasi: "Makassar" },
  { kode: "YIA", nama: "Bandara Internasional Yogyakarta", lokasi: "Yogyakarta" },
];

/**
 * Quick lookup: airport code → display label "Nama (KODE)"
 */
export const BANDARA_LABELS: Record<string, string> = Object.fromEntries(
  DAFTAR_BANDARA.map((b) => [b.kode, `${b.nama} (${b.kode})`])
);

/**
 * Quick lookup: airport code → full Bandara object
 */
export function getBandaraByKode(kode: string): Bandara | undefined {
  return DAFTAR_BANDARA.find((b) => b.kode === kode);
}

/** Set of valid airport codes for quick validation */
const VALID_KODE_SET = new Set(DAFTAR_BANDARA.map((b) => b.kode));

/**
 * Extract airport code from an email address.
 * Expected format: user@laporpark.{kode}.id  (e.g. supervisor@laporpark.bdj.id → BDJ)
 * Falls back to 'BDJ' if the email doesn't match the expected pattern or kode is unknown.
 */
export function extractKodeBandaraFromEmail(email: string): string {
  const domain = email.split("@")[1] ?? "";
  // Expected: laporpark.{kode}.id
  const parts = domain.split(".");
  // parts = ["laporpark", "bdj", "id"]
  if (parts.length >= 3 && parts[0].toLowerCase() === "laporpark") {
    const kode = parts[1].toUpperCase();
    if (kode === "HO") return "ALL";
    if (VALID_KODE_SET.has(kode)) {
      return kode;
    }
  }
  return "BDJ";
}
