-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all roles" ON public.user_roles
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Tighten content tables to admins only
DROP POLICY IF EXISTS "Admin full access advertisements" ON public.advertisements;
CREATE POLICY "Admins manage advertisements" ON public.advertisements FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Admin full access chairman_messages" ON public.chairman_messages;
CREATE POLICY "Admins manage chairman_messages" ON public.chairman_messages FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Admin full access gallery" ON public.gallery;
CREATE POLICY "Admins manage gallery" ON public.gallery FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Admin full access hero_slides" ON public.hero_slides;
CREATE POLICY "Admins manage hero_slides" ON public.hero_slides FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Admin full access live_darshan" ON public.live_darshan;
CREATE POLICY "Admins manage live_darshan" ON public.live_darshan FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Admin full access members" ON public.members;
CREATE POLICY "Admins manage members" ON public.members FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Admin full access news" ON public.news;
CREATE POLICY "Admins manage news" ON public.news FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Admin full access notices" ON public.notices;
CREATE POLICY "Admins manage notices" ON public.notices FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Admin full access policies" ON public.policies;
CREATE POLICY "Admins manage policies" ON public.policies FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Admin full access site_settings" ON public.site_settings;
CREATE POLICY "Admins manage site_settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Admin full access temple_info" ON public.temple_info;
CREATE POLICY "Admins manage temple_info" ON public.temple_info FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Admin full access temple_timings" ON public.temple_timings;
CREATE POLICY "Admins manage temple_timings" ON public.temple_timings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Admin full access enquiries" ON public.contact_enquiries;
CREATE POLICY "Admins manage enquiries" ON public.contact_enquiries FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Storage policies for media bucket
CREATE POLICY "Public read temple media" ON storage.objects
FOR SELECT USING (bucket_id = 'temple-media');

CREATE POLICY "Admins upload temple media" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'temple-media' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins update temple media" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'temple-media' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins delete temple media" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'temple-media' AND public.has_role(auth.uid(),'admin'));