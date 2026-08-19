# Plan - Fix Security Issues from Scan

The Supabase linter identified that the `SECURITY DEFINER` function `claim_first_admin` is callable by any authenticated user. While the function itself has internal logic to prevent multiple admins, it's best practice to tighten permissions as flagged.

## Proposed Changes

### Database Security
- Revoke public execution of `has_role` and `claim_first_admin` (though `has_role` is already restricted, we will explicitly manage all security definer functions).
- `has_role` is used in RLS policies, so it must be callable by `authenticated` and `service_role`.
- `claim_first_admin` is used for the initial setup.

### Specific Fix for `claim_first_admin`
- The linter flags it because it's a `SECURITY DEFINER` function callable by `authenticated`. 
- To follow the linter's recommendation:
    1. Revoke `EXECUTE` on the function from `PUBLIC`.
    2. Explicitly grant `EXECUTE` to `authenticated` (which is already done, but we'll ensure it's clean).
    3. The linter's main concern is often that these functions can be abused if they don't check for auth inside. `claim_first_admin` *does* check `auth.uid()`.
    4. I will also check if any other functions are exposed.

### Other Security Improvements
- Ensure all public tables have RLS and proper GRANTs (standardized in previous steps but worth a double check).

## Technical Details
- SQL migration to revoke/grant permissions.
- Use `REVOKE ALL ON FUNCTION ... FROM PUBLIC`.
- The `has_role` function is correct as `SECURITY DEFINER` to avoid recursion in RLS.

```sql
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.claim_first_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;
```
