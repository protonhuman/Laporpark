const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkBA() {
  const { data, error } = await supabase.from('berita_acara').select('id, judul_masalah, kode_bandara');
  console.log(data, error);
}

checkBA();
