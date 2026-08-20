-- Check existing members to avoid duplicates
DO $$
DECLARE
    member_names text[] := ARRAY[
        'श्री रामसागर मिश्रा',
        'श्री शैलेंद्र आठनेरिया',
        'श्री जितेंद्र लोखंडे',
        'श्री मनोज यादव',
        'श्री महेश नागर',
        'श्री रामाधार भदौरिया',
        'तरुण डेहरिया',
        'श्री पुरुषोत्तम राठौर',
        'श्री श्यामराव कड़वे',
        'श्री नीतेश झा',
        'श्री राम किशोर मालवी',
        'श्री राहुल अग्रवाल',
        'श्री श्रीओम सिंह',
        'श्री रोशन लोधी',
        'श्री मुकेश भागवत जी',
        'श्री सुरेंद्र सूर्यवंशी',
        'श्री विश्वनाथ दवंडे जी',
        'श्री देवेंद्र दीक्षित',
        'श्री स्वतंत्र कुमार द्विवेदी',
        'विक्की यादव',
        'श्री मुरारी पारे'
    ];
    m_name text;
    i int := 1000;
BEGIN
    -- Update existing members from 'विशेष सदस्य' to 'संस्थापक सदस्य'
    UPDATE public.members 
    SET category = 'संस्थापक सदस्य' 
    WHERE category::text = 'विशेष सदस्य';

    FOREACH m_name IN ARRAY member_names LOOP
        -- Check if exists
        IF EXISTS (SELECT 1 FROM public.members WHERE name = m_name) THEN
            UPDATE public.members 
            SET category = 'स्थाई कार्यकारिणी', is_active = true
            WHERE name = m_name;
        ELSE
            INSERT INTO public.members (name, category, designation, is_active, display_order)
            VALUES (m_name, 'स्थाई कार्यकारिणी', 'सदस्य', true, i);
        END IF;
        i := i + 1;
    END LOOP;
END $$;
