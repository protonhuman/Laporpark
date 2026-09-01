-- Migration: Tambahkan nilai 'kerusakan' ke enum jenis_insiden
ALTER TYPE public.jenis_insiden ADD VALUE IF NOT EXISTS 'kerusakan';
