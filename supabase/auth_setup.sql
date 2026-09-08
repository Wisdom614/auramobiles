-- ====================================================================
-- INSTANT SUPER ADMIN CREATION & EMAIL CONFIRMATION VIA SQL
-- Run this in your Supabase Dashboard -> SQL Editor
-- ====================================================================

-- 1. Ensure pgcrypto is enabled for secure password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. If the user already exists in auth.users, update password and mark confirmed:
UPDATE auth.users
SET 
  encrypted_password = crypt('wisdombesong123@gmail.com', gen_salt('bf')),
  email_confirmed_at = NOW(),
  confirmed_at = NOW(),
  updated_at = NOW()
WHERE email = 'wisdombesong123@gmail.com';

-- 3. If the user doesn't exist yet in auth.users, create them directly:
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
SELECT 
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'wisdombesong123@gmail.com',
  crypt('wisdombesong123@gmail.com', gen_salt('bf')),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Wisdom Besong","role":"super_admin"}'::jsonb,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'wisdombesong123@gmail.com'
);

-- 4. Ensure identity mapping exists for Supabase GoTrue Auth:
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT 
  u.id,
  u.id,
  json_build_object('sub', u.id::text, 'email', u.email)::jsonb,
  'email',
  u.id::text,
  NOW(),
  NOW(),
  NOW()
FROM auth.users u
WHERE u.email = 'wisdombesong123@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM auth.identities WHERE user_id = u.id
);

-- 5. Ensure super_admin authorization record in public.admin_users:
INSERT INTO public.admin_users (email, role, full_name, created_by)
VALUES ('wisdombesong123@gmail.com', 'super_admin', 'Wisdom Besong', 'system')
ON CONFLICT (email) DO NOTHING;
