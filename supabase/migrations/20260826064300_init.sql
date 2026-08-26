-- Create custom types
CREATE TYPE public.user_role AS ENUM ('team_leader', 'carpark_manager', 'supervisor');
CREATE TYPE public.jenis_insiden AS ENUM ('kerusakan_kendaraan', 'sengketa', 'komplain', 'kehilangan', 'lainnya');
CREATE TYPE public.status_ba AS ENUM ('draft', 'menunggu_review', 'revisi', 'disetujui', 'selesai');

-- Create users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nama TEXT NOT NULL,
  email TEXT NOT NULL,
  role public.user_role NOT NULL DEFAULT 'team_leader'
);

-- Enable RLS on users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all users" ON public.users
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Create berita_acara table
CREATE TABLE public.berita_acara (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nomor_ba TEXT UNIQUE NOT NULL,
  tanggal_kejadian DATE NOT NULL,
  waktu_kejadian TIME NOT NULL,
  lokasi_zona TEXT NOT NULL,
  jenis_insiden public.jenis_insiden NOT NULL,
  pihak_terlibat TEXT,
  judul_masalah TEXT NOT NULL,
  kronologi TEXT NOT NULL,
  tindakan_dilakukan TEXT NOT NULL,
  penyelesaian TEXT NOT NULL,
  mitigasi TEXT NOT NULL,
  lampiran_foto TEXT[], -- Array of URLs or paths
  status public.status_ba NOT NULL DEFAULT 'draft',
  dibuat_oleh UUID REFERENCES public.users(id) NOT NULL,
  direview_oleh UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on berita_acara
ALTER TABLE public.berita_acara ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Semua user terautentikasi bisa melihat BA" ON public.berita_acara
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Semua user terautentikasi bisa membuat BA" ON public.berita_acara
  FOR INSERT WITH CHECK (auth.uid() = dibuat_oleh);

CREATE POLICY "Hanya manager dan supervisor yang bisa update BA" ON public.berita_acara
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND (users.role = 'carpark_manager' OR users.role = 'supervisor')
    )
  );

CREATE POLICY "Hanya supervisor yang bisa delete BA" ON public.berita_acara
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'supervisor'
    )
  );

-- Create audit log table
CREATE TABLE public.ba_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ba_id UUID REFERENCES public.berita_acara(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  field_changed TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE public.ba_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Semua user terautentikasi bisa melihat audit log" ON public.ba_audit_log
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Hanya role tertentu yang bisa insert audit log" ON public.ba_audit_log
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND (users.role = 'carpark_manager' OR users.role = 'supervisor')
    )
  );

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('ba_lampiran', 'ba_lampiran', false);

-- Storage Policies
CREATE POLICY "Authenticated users can upload lampiran" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'ba_lampiran' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view lampiran" ON storage.objects
  FOR SELECT USING (bucket_id = 'ba_lampiran' AND auth.uid() IS NOT NULL);
