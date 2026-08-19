-- Fix for functions being reported by linter
-- Explicitly revoke from PUBLIC (which includes anon and authenticated)
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.claim_first_admin() FROM PUBLIC;

-- Grant back only what is necessary
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated, service_role;
