-- 1. Correct address text across all tables
UPDATE public.site_settings SET 
  address = 'शीतल सिटी, मंडीदीप, जिला-रायसेन (म.प्र.) – 462046', 
  email = 'info@sheetalshivayalaya.org',
  phone = '+91 831 932 2374',
  whatsapp = '+91 831 932 2374';

UPDATE public.notices SET content = REPLACE(content, 'शीतल सिटीज', 'शीतल सिटी');
UPDATE public.news SET 
  short_description = REPLACE(short_description, 'शीतल सिटीज', 'शीतल सिटी'), 
  full_description = REPLACE(full_description, 'शीतल सिटीज', 'शीतल सिटी');
UPDATE public.temple_info SET content = REPLACE(content, 'शीतल सिटीज', 'शीतल सिटी');

-- 2. Update First Hero Slide
-- Identify the first slide by display_order
UPDATE public.hero_slides 
SET title = 'दिव्य शिव मंदिर', 
    subtitle = 'समिति आपका हार्दिक स्वागत करती है'
WHERE id = (SELECT id FROM public.hero_slides ORDER BY display_order ASC LIMIT 1);
