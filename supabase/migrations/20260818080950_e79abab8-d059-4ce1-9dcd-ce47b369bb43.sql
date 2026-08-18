
  -- Enable all social media platforms and add demo URLs for verification
  UPDATE public.site_settings 
  SET 
    facebook_enabled = true,
    facebook_url = 'https://facebook.com/shitalshivalaya',
    instagram_enabled = true,
    instagram_url = 'https://instagram.com/shitalshivalaya',
    youtube_enabled = true,
    youtube_url = 'https://youtube.com/@shitalshivalaya'
  WHERE id = (SELECT id FROM public.site_settings LIMIT 1);
