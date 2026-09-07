const { createClient } = require('@supabase/supabase-js');
const DAFTAR_BANDARA = [
  { kode: "AMQ", nama: "Bandara Pattimura Ambon", lokasi: "Ambon" },
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
  { kode: "SUB", nama: "Bandara Internasional Juanda", lokasi: "Sidoarjo Surabaya" },
  { kode: "UPG", nama: "Bandara Internasional Sultan Hasanuddin", lokasi: "Makassar" },
  { kode: "YIA", nama: "Bandara Internasional Yogyakarta", lokasi: "Yogyakarta" },
];

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTestUsers() {
  for (const b of DAFTAR_BANDARA) {
    if (b.kode === 'BDJ' || b.kode === 'BPN' || b.kode === 'DPS') {
      continue; // Skip these since they probably have users
    }
    
    const email = `supervisor@laporpark.${b.kode.toLowerCase()}.id`;
    const password = 'password123';
    const name = `SPV ${b.nama}`;
    const role = 'supervisor';
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        nama: name,
        role: role,
        kode_bandara: b.kode,
        password_display: password
      }
    });

    if (error) {
      console.error(`Error creating ${email}:`, error.message);
    } else {
      console.log(`Successfully created ${email}`);
      if (data?.user) {
        await supabase.from('users').upsert({
          id: data.user.id,
          nama: name,
          email,
          role,
          kode_bandara: b.kode
        });
      }
    }
  }
}

createTestUsers();
