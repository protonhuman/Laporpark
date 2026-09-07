
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTestUsers() {
  const usersToCreate = [
    { email: 'superadmin@laporpark.id', password: 'password123', name: 'Super Admin', role: 'superadmin', kode_bandara: 'ALL' },
    { email: 'supervisor@laporpark.bpn.id', password: 'password123', name: 'SPV Balikpapan', role: 'supervisor', kode_bandara: 'BPN' },
    { email: 'supervisor@laporpark.dps.id', password: 'password123', name: 'SPV Denpasar', role: 'supervisor', kode_bandara: 'DPS' }
  ];

  for (const u of usersToCreate) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: {
        nama: u.name,
        role: u.role,
        kode_bandara: u.kode_bandara,
        password_display: u.password
      }
    });

    if (error) {
      console.error(`Error creating ${u.email}:`, error.message);
    } else {
      console.log(`Successfully created ${u.email} (${u.role})`);
      
      // Upsert into public.users
      if (data?.user) {
        await supabase.from('users').upsert({
          id: data.user.id,
          nama: u.name,
          email: u.email,
          role: u.role,
          kode_bandara: u.kode_bandara
        });
        console.log(`Updated profile for ${u.email}`);
      }
    }
  }
}

createTestUsers();
