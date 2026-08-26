-- ================================================================
-- Seed Data untuk Testing Lokal
-- ================================================================
-- PENTING: User harus dibuat TERLEBIH DAHULU via Supabase Auth.
--
-- Cara membuat user di Supabase lokal:
-- 1. Jalankan `npx supabase start`
-- 2. Buka Supabase Studio: http://localhost:54323
-- 3. Pergi ke Authentication → Users → Add User
-- 4. Buat 3 user berikut:
--    - teamleader@laporpark.bdj.id  / password123
--    - manager@laporpark.bdj.id     / password123
--    - supervisor@laporpark.bdj.id  / password123
-- 5. Catat UUID masing-masing user
-- 6. Ganti placeholder UUID di bawah ini dengan UUID yang benar
-- 7. Jalankan script ini via SQL Editor di Supabase Studio
--
-- ATAU gunakan Supabase Auth API:
-- curl -X POST 'http://localhost:54321/auth/v1/signup' \
--   -H 'apikey: YOUR_ANON_KEY' \
--   -H 'Content-Type: application/json' \
--   -d '{"email":"teamleader@laporpark.bdj.id","password":"password123"}'

-- Ganti UUID di bawah dengan UUID asli dari Supabase Auth
-- INSERT INTO public.users (id, nama, email, role) VALUES
--   ('UUID_TEAM_LEADER', 'Ahmad Rizki', 'teamleader@laporpark.bdj.id', 'team_leader'),
--   ('UUID_CARPARK_MANAGER', 'Budi Santoso', 'manager@laporpark.bdj.id', 'carpark_manager'),
--   ('UUID_SUPERVISOR', 'Citra Dewi', 'supervisor@laporpark.bdj.id', 'supervisor');

-- ================================================================
-- Alternatif: Gunakan function untuk auto-create via auth + profile
-- ================================================================
-- Jika Anda ingin otomatis insert ke public.users saat user signup,
-- tambahkan trigger berikut:

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, nama, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nama', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(
      (NEW.raw_user_meta_data->>'role')::public.user_role,
      'team_leader'::public.user_role
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists (idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
