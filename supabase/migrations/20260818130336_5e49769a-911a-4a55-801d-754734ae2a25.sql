INSERT INTO public.user_roles (user_id, role)
VALUES ('b1da4a0b-27be-4039-82a9-6a024a9a25b7', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;