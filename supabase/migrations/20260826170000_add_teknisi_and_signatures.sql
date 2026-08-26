-- Commit the current transaction to allow altering an ENUM type
COMMIT;

-- Add 'teknisi' to user_role ENUM (if it doesn't already exist)
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'teknisi';

-- Re-open transaction for the table alteration (managed by Supabase usually, but just in case)
BEGIN;

-- Add signature_url column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS signature_url TEXT;

-- Commit the transaction so the table alteration is saved!
COMMIT;
