
-- 1. Alter youtube_videos table
ALTER TABLE public.youtube_videos 
ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'synced' CHECK (source_type IN ('synced', 'special')),
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- 2. Update existing videos to 'synced' (though default already handles it)
UPDATE public.youtube_videos SET source_type = 'synced' WHERE source_type IS NULL;

-- 3. Ensure RLS policies are up to date (CRUD handled by admin role)
-- Grant select to all
GRANT SELECT ON public.youtube_videos TO anon;
GRANT SELECT ON public.youtube_videos TO authenticated;
GRANT ALL ON public.youtube_videos TO service_role;

-- 4. Add unique constraint if not exists (already likely exists on youtube_id)
-- We need to handle special videos that might have the same ID but different source_type?
-- The user said: "Use YouTube Video ID to prevent accidental duplicate records within the same source."
-- So unique (youtube_id, source_type)
ALTER TABLE public.youtube_videos DROP CONSTRAINT IF EXISTS youtube_videos_youtube_id_key;
ALTER TABLE public.youtube_videos ADD CONSTRAINT youtube_videos_youtube_id_source_type_key UNIQUE (youtube_id, source_type);
