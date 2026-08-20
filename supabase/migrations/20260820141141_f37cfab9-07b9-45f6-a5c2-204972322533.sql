ALTER TABLE public.notices ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 1;
COMMENT ON COLUMN public.notices.sort_order IS 'क्रमांक for sorting notices (positive whole number)';
