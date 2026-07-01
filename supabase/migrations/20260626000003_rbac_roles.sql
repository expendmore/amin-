-- ==========================================
-- 1. CREATE ENUM FOR ROLE-BASED ACCESS CONTROL
-- ==========================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('GUEST', 'USER', 'PREMIUM', 'ADMIN', 'SUPER_ADMIN');
  END IF;
END
$$;

-- ==========================================
-- 2. ALTER USERS TABLE WITH RBAC SPECS
-- ==========================================

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'email';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'USER';

-- Sync any existing users' values
UPDATE public.users 
SET 
  full_name = COALESCE(full_name, display_name, 'New User'),
  avatar = COALESCE(avatar, avatar_url, ''),
  role = COALESCE(role, 'USER');

-- ==========================================
-- 3. RE-DEFINE TRIGGERS WITH DIRECT MAPS
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id, 
    clerk_id, 
    email, 
    display_name, 
    full_name,
    avatar_url, 
    avatar,
    provider,
    role,
    tier
  )
  VALUES (
    NEW.id,
    NEW.id::text,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar', NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.app_metadata->>'provider', 'email'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'USER'::user_role),
    'FREE'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
