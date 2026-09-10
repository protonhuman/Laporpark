-- Migration: Update RLS policies to allow superadmin and admin roles
-- Fixes RLS restrictions on berita_acara and ba_audit_log

-- 1. Update BA policy
DROP POLICY IF EXISTS "Hanya manager dan supervisor yang bisa update BA" ON public.berita_acara;
CREATE POLICY "Manager supervisor dan superadmin bisa update BA" ON public.berita_acara
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND (users.role = 'carpark_manager' OR users.role = 'supervisor' OR users.role = 'superadmin')
    )
  );

-- 2. Delete BA policy
DROP POLICY IF EXISTS "Hanya supervisor yang bisa delete BA" ON public.berita_acara;
CREATE POLICY "Supervisor dan superadmin bisa delete BA" ON public.berita_acara
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND (users.role = 'supervisor' OR users.role = 'superadmin')
    )
  );

-- 3. Audit log policy
DROP POLICY IF EXISTS "Hanya role tertentu yang bisa insert audit log" ON public.ba_audit_log;
CREATE POLICY "Manager supervisor dan superadmin bisa insert audit log" ON public.ba_audit_log
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND (users.role = 'carpark_manager' OR users.role = 'supervisor' OR users.role = 'superadmin')
    )
  );
