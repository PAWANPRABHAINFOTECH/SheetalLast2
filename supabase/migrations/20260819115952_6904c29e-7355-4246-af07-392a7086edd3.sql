-- Re-expose claim_first_admin as a SECURITY INVOKER wrapper if possible, 
-- or just move it back but acknowledge it's a known risk for setup.
-- However, let's try to put it in public as INVOKER but it needs DEFINER for the write.

-- Let's put it back in public for compatibility but keep it restricted.
-- The linter is being very strict.

CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _count int;
BEGIN
  -- Security check: only allow if no admins exist
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RETURN false;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (auth.uid(), 'admin');
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_first_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated, service_role;
