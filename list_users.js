const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listUsers() {
  const { data, error } = await supabase.from('users').select('id, email, nama, role, kode_bandara');
  if (error) {
    console.error(error);
  } else {
    console.table(data);
  }
}

listUsers();
