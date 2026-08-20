-- Double check and fix RLS one more time for absolute certainty
DROP POLICY IF EXISTS "Public read access youtube_videos" ON public.youtube_videos;
CREATE POLICY "Public read access youtube_videos" ON public.youtube_videos
FOR SELECT TO anon, authenticated USING (is_active = true);

GRANT SELECT ON public.youtube_videos TO anon;
GRANT SELECT ON public.youtube_videos TO authenticated;

-- Ensure we have the latest site settings updated for the specific channel to show the section
UPDATE public.site_settings 
SET 
  youtube_channel_url = 'https://www.youtube.com/@SheetalShivalayaSamiti',
  youtube_channel_name = 'Sheetal Shivalaya Samiti',
  youtube_last_sync_at = now()
WHERE id IN (SELECT id FROM public.site_settings LIMIT 1);