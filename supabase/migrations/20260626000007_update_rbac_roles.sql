-- ==========================================
-- 1. ADD NEW VALUE ENUMS TO USER_ROLE
-- ==========================================

-- PostgreSQL supports ADD VALUE IF NOT EXISTS in modern versions
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'VIEWER';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'MEMBER';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'AGENT';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'MANAGER';

-- ==========================================
-- 2. ALTER USERS TABLE WITH WORKSPACE SPECS
-- ==========================================

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS timezone VARCHAR(100) DEFAULT 'UTC';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS company VARCHAR(255);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS workspace_id UUID;

-- Update default role mapping to MEMBER
ALTER TABLE public.users ALTER COLUMN role SET DEFAULT 'MEMBER'::user_role;

-- Update all existing users with user role mapping to MEMBER if they are 'USER'
UPDATE public.users
SET role = 'MEMBER'::user_role
WHERE role = 'USER'::user_role;

-- ==========================================
-- 3. RE-DEFINE TRIGGERS WITH NEW ROLE DEFAULT
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
    tier,
    timezone,
    language
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
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'MEMBER'::user_role),
    'FREE',
    'UTC',
    'en'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
