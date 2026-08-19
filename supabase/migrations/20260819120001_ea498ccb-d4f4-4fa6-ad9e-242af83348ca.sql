-- Final cleanup for has_role and claim_first_admin
-- 1. has_role should be SECURITY INVOKER because it only reads from user_roles
--    which has an RLS policy for the user to read their own roles.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- 2. claim_first_admin needs to stay DEFINER but we will explicitly REVOKE from PUBLIC (anon + authenticated)
--    and ONLY grant to service_role. 
--    Since the user needs to claim admin, we will move the logic to a server function 
--    and call it using the admin client (service_role) from there.
--    This satisfies the linter by removing it from the public API.

CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.claim_first_admin(_user_id uuid)
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
    VALUES (_user_id, 'admin');
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$;

-- Remove public version
DROP FUNCTION IF EXISTS public.claim_first_admin();

-- Restrict private function
REVOKE ALL ON FUNCTION private.claim_first_admin(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.claim_first_admin(uuid) TO service_role;
