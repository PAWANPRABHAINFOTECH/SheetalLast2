CREATE TABLE IF NOT EXISTS public.youtube_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    youtube_id TEXT UNIQUE NOT NULL,
    title TEXT,
    thumbnail TEXT,
    published_at TIMESTAMPTZ,
    url TEXT,
    description TEXT,
    channel_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS youtube_channel_url TEXT,
ADD COLUMN IF NOT EXISTS youtube_channel_name TEXT,
ADD COLUMN IF NOT EXISTS youtube_channel_logo TEXT,
ADD COLUMN IF NOT EXISTS youtube_subscriber_count TEXT,
ADD COLUMN IF NOT EXISTS youtube_last_sync_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS youtube_video_count INTEGER DEFAULT 0;

GRANT SELECT ON public.youtube_videos TO anon;
GRANT ALL ON public.youtube_videos TO authenticated;
GRANT ALL ON public.youtube_videos TO service_role;
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access youtube_videos" ON public.youtube_videos FOR SELECT USING (true);
CREATE POLICY "Admin full access youtube_videos" ON public.youtube_videos FOR ALL TO authenticated USING (true);