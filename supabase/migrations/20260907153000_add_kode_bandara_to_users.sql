-- Add kode_bandara column to users table
-- Defaults to 'BDJ' so existing records remain valid
ALTER TABLE public.users
  ADD COLUMN kode_bandara TEXT NOT NULL DEFAULT 'BDJ';
