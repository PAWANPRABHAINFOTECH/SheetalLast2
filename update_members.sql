-- 1. Create a migration to update member categories and order
DO $$ 
BEGIN
    -- Update existing members from 'विशेष सदस्य' to 'संस्थापक सदस्य'
    UPDATE public.members 
    SET category = 'संस्थापक सदस्य' 
    WHERE category = 'विशेष सदस्य';
END $$;

-- 2. Define the new list of names for 'स्थाई कार्यकारिणी'
CREATE TEMP TABLE new_permanent_members (name text);
INSERT INTO new_permanent_members (name) VALUES 
('श्री रामसागर मिश्रा'),
('श्री शैलेंद्र आठनेरिया'),
('श्री जितेंद्र लोखंडे'),
('श्री मनोज यादव'),
('श्री महेश नागर'),
('श्री रामाधार भदौरिया'),
('तरुण डेहरिया'),
('श्री पुरुषोत्तम राठौर'),
('श्री श्यामराव कड़वे'),
('श्री नीतेश झा'),
('श्री राम किशोर मालवी'),
('श्री राहुल अग्रवाल'),
('श्री श्रीओम सिंह'),
('श्री रोशन लोधी'),
('श्री मुकेश भागवत जी'),
('श्री सुरेंद्र सूर्यवंशी'),
('श्री विश्वनाथ दवंडे जी'),
('श्री देवेंद्र दीक्षित'),
('श्री स्वतंत्र कुमार द्विवेदी'),
('विक्की यादव'),
('श्री मुरारी पारे');

-- 3. Update existing members to the new category or insert new ones
DO $$
DECLARE
    member_name text;
    i int := 100; -- Starting display_order for 'स्थाई कार्यकारिणी' to keep them together if sorted
BEGIN
    FOR member_name IN SELECT name FROM new_permanent_members LOOP
        -- If member exists, update their category
        UPDATE public.members 
        SET category = 'स्थाई कार्यकारिणी'
        WHERE name = member_name;
        
        -- If not updated (didn't exist), insert new member
        IF NOT FOUND THEN
            INSERT INTO public.members (name, category, designation, is_active, display_order)
            VALUES (member_name, 'स्थाई कार्यकारिणी', 'सदस्य', true, i);
        END IF;
        
        i := i + 1;
    END LOOP;
END $$;

DROP TABLE new_permanent_members;
