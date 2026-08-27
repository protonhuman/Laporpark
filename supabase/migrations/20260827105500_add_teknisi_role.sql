-- Tambahkan role 'teknisi' ke enum user_role
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'teknisi';
