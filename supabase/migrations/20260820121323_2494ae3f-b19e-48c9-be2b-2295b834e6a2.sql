-- 1. Revoke execute on SECURITY DEFINER functions from PUBLIC
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;

-- 2. Grant execute only to roles that strictly need it (authenticated and service_role)
-- Note: 'anon' should NOT be able to call has_role as it's an admin check.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

-- 3. Move it to a private schema if extra protection is needed, 
-- but since RLS handles it, restricted EXECUTE is usually sufficient for internal checks.
