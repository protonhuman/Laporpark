const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createUsers() {
  const usersToCreate = [
    { email: 'teamleader@laporpark.bdj.id', password: 'password123', name: 'Ahmad Rizki', role: 'team_leader' },
    { email: 'manager@laporpark.bdj.id', password: 'password123', name: 'Budi Santoso', role: 'carpark_manager' },
    { email: 'supervisor@laporpark.bdj.id', password: 'password123', name: 'Citra Dewi', role: 'supervisor' }
  ];

  for (const u of usersToCreate) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: {
        nama: u.name,
        role: u.role
      }
    });

    if (error) {
      console.error(`Error creating ${u.email}:`, error.message);
    } else {
      console.log(`Successfully created ${u.email}`);
    }
  }
}

createUsers();
