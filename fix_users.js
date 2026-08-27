const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixUsers() {
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) {
    console.error('Error fetching auth users:', authError);
    return;
  }

  for (const user of authData.users) {
    console.log(`Checking user: ${user.email}`);
    
    // Check if exists in public.users
    const { data: publicUser, error: publicError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!publicUser) {
      console.log(`User ${user.email} not in public.users, inserting...`);
      const nama = user.user_metadata?.nama || user.email.split('@')[0];
      const role = user.user_metadata?.role || 'team_leader';
      
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          nama: nama,
          email: user.email,
          role: role
        });
        
      if (insertError) {
        console.error(`Failed to insert ${user.email}:`, insertError.message);
      } else {
        console.log(`Successfully inserted ${user.email} into public.users`);
      }
    } else {
      console.log(`User ${user.email} already exists in public.users`);
    }
  }
}

fixUsers();
