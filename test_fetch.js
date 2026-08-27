const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'teamleader@laporpark.bdj.id',
    password: 'password123'
  });

  if (authError) {
    console.error('Login error:', authError);
    return;
  }

  console.log('Logged in as:', authData.user.id);

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (error) {
    console.error('Fetch error:', error);
  } else {
    console.log('Profile data:', data);
  }
}

test();
