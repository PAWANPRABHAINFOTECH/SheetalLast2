ALTER TABLE public.members ADD COLUMN IF NOT EXISTS mobile_number text;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS devotee_count text;

-- Re-enable RLS just in case (standard practice)
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Ensure grants are correct
GRANT SELECT, INSERT, UPDATE, DELETE ON public.members TO authenticated;
GRANT ALL ON public.members TO service_role;
GRANT SELECT ON public.members TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
GRANT SELECT ON public.site_settings TO anon;
