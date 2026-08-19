-- Change has_role to security invoker since it doesn't need to bypass RLS 
-- as it only queries user_roles tables which has policies that allow the user to read their own roles.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER -- Changed from DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Move claim_first_admin to a different schema to hide it from the public API
CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.claim_first_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _count int;
BEGIN
  SELECT count(*) INTO _count FROM public.user_roles WHERE role = 'admin';
  
  IF _count = 0 THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (auth.uid(), 'admin');
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$;

DROP FUNCTION IF EXISTS public.claim_first_admin();

-- Grant execute on private function to service_role
GRANT USAGE ON SCHEMA private TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.claim_first_admin() TO authenticated, service_role;
