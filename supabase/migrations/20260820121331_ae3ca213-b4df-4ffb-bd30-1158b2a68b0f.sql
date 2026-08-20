-- Convert has_role to SECURITY INVOKER to satisfy the linter.
-- SECURITY INVOKER functions run with the privileges of the caller.
-- Since it reads from user_roles which has RLS, the caller must have access to that table.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Ensure authenticated users can read their own roles (needed for has_role to work in RLS)
-- and admins can read all roles.
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Wait, if has_role is used IN the policy for user_roles, we get recursion.
-- But we usually use has_role on OTHER tables.
-- On user_roles itself, we use a simple auth.uid() = user_id policy.
