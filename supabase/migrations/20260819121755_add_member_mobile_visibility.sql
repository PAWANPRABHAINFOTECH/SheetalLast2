-- Add show_mobile_number column to members table
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS show_mobile_number BOOLEAN DEFAULT FALSE;

-- The grants for the table should already exist from previous migrations, 
-- but ensuring they are applied to the new column is good practice.
-- Since it's a new column on an existing table, no new GRANTs are strictly needed 
-- if the table-level grants are already in place.
