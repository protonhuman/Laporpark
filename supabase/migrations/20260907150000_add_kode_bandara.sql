-- Add kode_bandara column to berita_acara
-- Defaults to 'BDJ' so existing records remain valid
ALTER TABLE public.berita_acara
  ADD COLUMN kode_bandara TEXT NOT NULL DEFAULT 'BDJ';
