-- Insert 3 initial demo slides for the Hero Slider
INSERT INTO public.hero_slides (title, subtitle, image_url, button_text, button_url, display_order, is_active)
VALUES 
('शीतल शिवालय मंदिर', 'शीतल सिटीज, मंडीदीप, जिला-रायसेन (मध्यप्रदेश)', 'https://images.unsplash.com/photo-1609766914176-e7130a74bc33?auto=format&fit=crop&q=80&w=2000', 'दर्शन करें', '/about', 1, true),
('भव्य शिव मंदिर', 'आध्यात्मिक शांति और भक्ति का केंद्र', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=2000', 'लाइव दर्शन', '/live-darshan', 2, true),
('समिति की गतिविधियां', 'आगामी धार्मिक आयोजन एवं मंदिर के विकास कार्यों की जानकारी', 'https://images.unsplash.com/photo-1600100395420-40aa0e665948?auto=format&fit=crop&q=80&w=2000', 'समाचार देखें', '/news', 3, true);

-- Ensure public read access is granted correctly (re-affirming privileges)
GRANT SELECT ON public.hero_slides TO anon;
GRANT SELECT ON public.hero_slides TO authenticated;
GRANT ALL ON public.hero_slides TO service_role;
