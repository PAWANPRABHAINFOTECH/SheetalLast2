-- Grant proper permissions just in case (though migration seems to have them)
GRANT SELECT ON public.youtube_videos TO anon;
GRANT SELECT ON public.youtube_videos TO authenticated;

-- Fix the existing special video data that was missing video ID and thumbnail
UPDATE public.youtube_videos 
SET 
  youtube_id = 'AYFwoMwqG80', 
  title = 'Sheetal Shivalaya Samiti', 
  thumbnail = 'https://i.ytimg.com/vi/AYFwoMwqG80/hqdefault.jpg',
  is_active = true
WHERE source_type = 'special' AND (youtube_id IS NULL OR youtube_id = '');

-- Fix the existing synced video title if it's empty
UPDATE public.youtube_videos
SET title = 'Sheetal Shivalaya Samiti'
WHERE source_type = 'synced' AND (title IS NULL OR title = '');