-- Ensure all tables have RLS enabled
DO $$ 
DECLARE 
    r RECORD;
BEGIN 
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP 
        EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' ENABLE ROW LEVEL SECURITY;';
    END LOOP; 
END $$;

-- Fix has_role if it was not set as SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Ensure proper grants for all tables (Admins get all, Public gets SELECT on active/public content)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- Revoke specific sensitive table access from anon
REVOKE SELECT ON public.contact_enquiries FROM anon;
GRANT INSERT ON public.contact_enquiries TO anon;
REVOKE SELECT ON public.user_roles FROM anon;
GRANT SELECT ON public.user_roles TO authenticated;

-- Refresh policies for YouTube Videos (User reported visibility issues)
DROP POLICY IF EXISTS "Public read access youtube_videos" ON public.youtube_videos;
CREATE POLICY "Public read access youtube_videos" ON public.youtube_videos
FOR SELECT TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Admin full access youtube_videos" ON public.youtube_videos;
CREATE POLICY "Admin full access youtube_videos" ON public.youtube_videos
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Ensure testimonials and comments have proper public read access
DROP POLICY IF EXISTS "Anyone can view active testimonials" ON public.testimonials;
CREATE POLICY "Anyone can view active testimonials" ON public.testimonials
FOR SELECT TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Anyone can view approved comments" ON public.comments;
CREATE POLICY "Anyone can view approved comments" ON public.comments
FOR SELECT TO anon, authenticated
USING (status = 'approved');

-- Fix news visibility
DROP POLICY IF EXISTS "Public read access news" ON public.news;
CREATE POLICY "Public read access news" ON public.news
FOR SELECT TO anon, authenticated
USING (is_active = true);
