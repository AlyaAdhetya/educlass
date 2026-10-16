-- ============================================================
-- Migration 003: Create profiles & user_stats tables
--                + trigger to auto-create on auth signup
-- ============================================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id                UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email             TEXT        NOT NULL UNIQUE,
  name              TEXT        NOT NULL DEFAULT '',
  nim               TEXT        NULLABLE UNIQUE,
  role              TEXT        NOT NULL DEFAULT 'mahasiswa' CHECK (role IN ('mahasiswa', 'admin')),
  status            TEXT        NOT NULL DEFAULT 'active'    CHECK (status IN ('active', 'inactive')),
  avatar_url        TEXT        NULLABLE,
  current_level_id  INT4        NULLABLE REFERENCES public.levels(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User stats table (gamification stats)
CREATE TABLE IF NOT EXISTS public.user_stats (
  id                            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                       UUID        NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_xp                      INT4        NOT NULL DEFAULT 0,
  gems                          INT4        NOT NULL DEFAULT 0,
  hearts                        INT4        NOT NULL DEFAULT 5,
  max_hearts                    INT4        NOT NULL DEFAULT 5,
  current_streak                INT4        NOT NULL DEFAULT 0,
  longest_streak                INT4        NOT NULL DEFAULT 0,
  last_activity_date            DATE        NULLABLE,
  total_completed_materials     INT4        NOT NULL DEFAULT 0,
  total_completed_quizzes       INT4        NOT NULL DEFAULT 0,
  active_theme_id               TEXT        NULLABLE,
  updated_at                    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Function: auto-update updated_at column
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger: profiles updated_at
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger: user_stats updated_at
DROP TRIGGER IF EXISTS trg_user_stats_updated_at ON public.user_stats;
CREATE TRIGGER trg_user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- Function + Trigger: auto create profile & user_stats
--                     when a new user signs up via Supabase Auth
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role TEXT;
  v_name TEXT;
  v_nim  TEXT;
BEGIN
  -- Extract metadata from auth.users
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'mahasiswa');
  v_name := COALESCE(NEW.raw_user_meta_data->>'name', NEW.email);
  v_nim  := NEW.raw_user_meta_data->>'nim';

  -- Insert into profiles
  INSERT INTO public.profiles (id, email, name, nim, role, current_level_id)
  VALUES (
    NEW.id,
    NEW.email,
    v_name,
    v_nim,
    v_role,
    1  -- Default level: Beginner
  )
  ON CONFLICT (id) DO NOTHING;

  -- Insert initial user_stats
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Trigger: fire when user inserted into auth.users
DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
