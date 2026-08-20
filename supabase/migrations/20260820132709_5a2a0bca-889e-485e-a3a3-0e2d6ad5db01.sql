DO $$
DECLARE
  _new_email TEXT := 'sheetalshivalayasamiti26@gmail.com';
  _new_password TEXT := 'Sheetal@#8888';
  _user_id UUID;
BEGIN
  -- 1. Check if the user already exists in auth.users
  SELECT id INTO _user_id FROM auth.users WHERE email = _new_email;

  IF _user_id IS NULL THEN
    -- Create new user
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      _new_email,
      crypt(_new_password, gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO _user_id;
  ELSE
    -- Update existing user's password
    UPDATE auth.users
    SET encrypted_password = crypt(_new_password, gen_salt('bf')),
        updated_at = now(),
        email_confirmed_at = COALESCE(email_confirmed_at, now())
    WHERE id = _user_id;
  END IF;

  -- 2. Ensure the user has the 'admin' role in public.user_roles
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_user_id, 'admin');
  END IF;

  -- 3. Remove the admin role from the old email
  DELETE FROM public.user_roles
  WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'pankajjain.je@gmail.com')
  AND role = 'admin';

END $$;
