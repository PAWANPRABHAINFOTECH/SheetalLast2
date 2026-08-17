-- Enums for structured data
DO $$ BEGIN
    CREATE TYPE public.member_category AS ENUM ('संरक्षक', 'पदाधिकारी', 'स्थाई कार्यकारिणी', 'कार्यकारी सदस्य');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.gallery_category AS ENUM ('मंदिर', 'धार्मिक आयोजन', 'पूजा', 'बैठक', 'सामाजिक गतिविधियाँ', 'अन्य');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.notice_priority AS ENUM ('low', 'medium', 'high');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Site Settings
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name TEXT DEFAULT 'शीतल शिवालय समिति',
    address TEXT DEFAULT 'शीतल सिटीज, मंडीदीप, जिला-रायसेन (म.प्र.) – 462046',
    registration_no TEXT DEFAULT '01/02/03/43247/26',
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    logo_url TEXT,
    donation_qr_url TEXT,
    upi_id TEXT,
    bank_account_name TEXT,
    bank_name TEXT,
    bank_account_number TEXT,
    bank_ifsc TEXT,
    bank_branch TEXT,
    youtube_url TEXT,
    instagram_url TEXT,
    facebook_url TEXT,
    youtube_enabled BOOLEAN DEFAULT true,
    instagram_enabled BOOLEAN DEFAULT true,
    facebook_enabled BOOLEAN DEFAULT true,
    google_maps_embed_url TEXT,
    latitude TEXT,
    longitude TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Hero Slider
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    title TEXT,
    subtitle TEXT,
    button_text TEXT,
    button_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Notices/Ticker
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    link_url TEXT,
    link_text TEXT,
    priority notice_priority DEFAULT 'medium',
    is_active BOOLEAN DEFAULT true,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Advertisements/Programs Slider
CREATE TABLE IF NOT EXISTS public.advertisements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    button_text TEXT,
    button_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. News
CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    short_description TEXT,
    full_description TEXT,
    featured_image_url TEXT,
    publish_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Gallery
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    category gallery_category DEFAULT 'मंदिर',
    event_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Members
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    designation TEXT,
    photo_url TEXT,
    category member_category DEFAULT 'कार्यकारी सदस्य',
    display_order INTEGER DEFAULT 0,
    show_on_home BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Chairman Messages
CREATE TABLE IF NOT EXISTS public.chairman_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    designation TEXT DEFAULT 'अध्यक्ष',
    photo_url TEXT,
    message TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Temple Information
CREATE TABLE IF NOT EXISTS public.temple_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_name TEXT UNIQUE NOT NULL, -- 'about', 'history', etc.
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Temple Timings
CREATE TABLE IF NOT EXISTS public.temple_timings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    timing TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. Live Darshan
CREATE TABLE IF NOT EXISTS public.live_darshan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_url TEXT,
    youtube_url TEXT,
    mode TEXT DEFAULT 'youtube', -- 'upload' or 'youtube'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. Contact Enquiries
CREATE TABLE IF NOT EXISTS public.contact_enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT,
    address TEXT,
    message TEXT,
    is_read BOOLEAN DEFAULT false,
    is_replied BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. Policies
CREATE TABLE IF NOT EXISTS public.policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_type TEXT UNIQUE NOT NULL, -- 'privacy', 'terms', 'refund'
    content TEXT NOT NULL,
    last_revised DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- GRANTS
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT ON public.contact_enquiries TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chairman_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temple_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temple_timings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_darshan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;

-- POLICIES (Read-only for anon except enquiries)
CREATE POLICY "Public read access site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public read access hero_slides" ON public.hero_slides FOR SELECT USING (true);
CREATE POLICY "Public read access notices" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Public read access advertisements" ON public.advertisements FOR SELECT USING (true);
CREATE POLICY "Public read access news" ON public.news FOR SELECT USING (true);
CREATE POLICY "Public read access gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Public read access members" ON public.members FOR SELECT USING (true);
CREATE POLICY "Public read access chairman_messages" ON public.chairman_messages FOR SELECT USING (true);
CREATE POLICY "Public read access temple_info" ON public.temple_info FOR SELECT USING (true);
CREATE POLICY "Public read access temple_timings" ON public.temple_timings FOR SELECT USING (true);
CREATE POLICY "Public read access live_darshan" ON public.live_darshan FOR SELECT USING (true);
CREATE POLICY "Public read access policies" ON public.policies FOR SELECT USING (true);

CREATE POLICY "Public insert access enquiries" ON public.contact_enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access enquiries" ON public.contact_enquiries FOR ALL TO authenticated USING (true);

-- Admin policies
CREATE POLICY "Admin full access site_settings" ON public.site_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access hero_slides" ON public.hero_slides FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access notices" ON public.notices FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access advertisements" ON public.advertisements FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access news" ON public.news FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access gallery" ON public.gallery FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access members" ON public.members FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access chairman_messages" ON public.chairman_messages FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access temple_info" ON public.temple_info FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access temple_timings" ON public.temple_timings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access live_darshan" ON public.live_darshan FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access policies" ON public.policies FOR ALL TO authenticated USING (true);

-- INITIAL SEED DATA
INSERT INTO public.site_settings (site_name, address, registration_no) 
VALUES ('शीतल शिवालय समिति', 'शीतल सिटीज, मंडीदीप, जिला-रायसेन (म.प्र.) – 462046', '01/02/03/43247/26')
ON CONFLICT DO NOTHING;

INSERT INTO public.temple_info (section_name, content) VALUES 
('about', 'यह मुख्य रूप से भगवान शिव का मंदिर है जो शीतल सिटी में स्थित है। वर्तमान में मंदिर का निर्माण कार्य जारी है। मंदिर की पहली मंजिल में देवताओं के चार गर्भगृह हैं। इनमें से एक भगवान राम का मंदिर है...'),
('history', 'शीतल शिवालय समिति द्वारा मंदिर का निर्माण एक भव्य आध्यात्मिक केंद्र के रूप में किया जा रहा है...')
ON CONFLICT (section_name) DO NOTHING;

INSERT INTO public.temple_timings (title, timing, display_order) VALUES
('दर्शन', 'प्रातः 6:00 बजे से रात्रि 10:30 बजे तक', 1),
('प्रातःकालीन आरती', 'प्रातः 6:00 बजे', 2),
('संध्या आरती', 'सायं 7:30 बजे', 3),
('हवन एवं पूजन', 'विशेष अवसरों पर', 4)
ON CONFLICT DO NOTHING;

INSERT INTO public.members (name, designation, category, display_order, show_on_home) VALUES
('श्री प्रीतम सिंह अहिरवार', 'अध्यक्ष', 'पदाधिकारी', 1, true),
('श्री मनोज गावंडे', 'सचिव', 'पदाधिकारी', 2, true),
('श्री अजय पाराशर जी', 'कोषाध्यक्ष', 'पदाधिकारी', 3, true),
('श्री आर. के. गुप्ता जी', 'संरक्षक', 'संरक्षक', 4, false),
('श्री चंद्रकांत मिश्रा जी', 'संरक्षक', 'संरक्षक', 5, false),
('श्री पवन कुमार शुक्ला', 'उपाध्यक्ष', 'पदाधिकारी', 6, false),
('श्री पवन सोनी', 'सह सचिव', 'पदाधिकारी', 7, false),
('श्री रोहित कुशवाहा', 'सह कोषाध्यक्ष', 'पदाधिकारी', 8, false),
('श्री राहुल लोखंडे जी', 'मीडिया प्रभारी', 'पदाधिकारी', 9, false)
ON CONFLICT DO NOTHING;

INSERT INTO public.policies (policy_type, content) VALUES
('privacy', 'Privacy policy content here...'),
('terms', 'Terms and conditions here...'),
('refund', 'हमारी वेबसाइट पर सेवाओं का अनुरोध करने के लिए धन्यवाद। दान राशि की प्रकृति को ध्यान में रखते हुए सामान्यतः दान की गई राशि वापस नहीं की जाएगी।')
ON CONFLICT (policy_type) DO NOTHING;
