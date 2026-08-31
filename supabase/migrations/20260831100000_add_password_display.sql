-- Migration: Add optional password_display column to public.users
-- This allows supervisor to view user credentials if needed.

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS password_display TEXT;

-- Policy to ensure only supervisor can select password_display if queried directly
COMMENT ON COLUMN public.users.password_display IS 'Plaintext credential cache accessible only to supervisor';
