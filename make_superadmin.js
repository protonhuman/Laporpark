const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function makeSuperAdmin() {
  // Update in auth schema
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  const afifUser = users?.users.find(u => u.email === 'afif@laporpark.ho.id');
  
  if (afifUser) {
    await supabase.auth.admin.updateUserById(afifUser.id, {
      user_metadata: {
        ...afifUser.user_metadata,
        role: 'superadmin',
        kode_bandara: 'ALL'
      }
    });
    
    // Update in public schema
    const { error: dbError } = await supabase.from('users').update({ role: 'superadmin', kode_bandara: 'ALL' }).eq('id', afifUser.id);
    if (dbError) {
      console.error("DB Error:", dbError);
    } else {
      console.log("afif@laporpark.ho.id is now a superadmin!");
    }
  } else {
    console.log("Could not find user.");
  }
}

makeSuperAdmin();
