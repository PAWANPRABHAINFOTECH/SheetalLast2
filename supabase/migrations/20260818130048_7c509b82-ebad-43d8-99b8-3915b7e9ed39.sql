CREATE OR REPLACE FUNCTION public.claim_first_admin()
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

GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;
