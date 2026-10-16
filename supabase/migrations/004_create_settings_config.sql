-- ============================================================
-- Migration 004: Platform Settings, XP Config, Streak Config
-- ============================================================

-- Platform settings (singleton row)
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id                            INT4    PRIMARY KEY DEFAULT 1,
  platform_name                 TEXT    NOT NULL DEFAULT 'EduClass',
  tagline                       TEXT    NULLABLE DEFAULT 'Gamified English Learning Platform',
  default_language              TEXT    NOT NULL DEFAULT 'id',
  default_min_score             INT4    NOT NULL DEFAULT 60,
  allow_retake                  BOOLEAN NOT NULL DEFAULT TRUE,
  max_retake_attempts           INT4    NOT NULL DEFAULT 3,
  completion_requires_passing   BOOLEAN NOT NULL DEFAULT TRUE,
  show_explanation_after_quiz   BOOLEAN NOT NULL DEFAULT TRUE,
  xp_enabled                   BOOLEAN NOT NULL DEFAULT TRUE,
  streak_enabled                BOOLEAN NOT NULL DEFAULT TRUE,
  achievements_enabled          BOOLEAN NOT NULL DEFAULT TRUE,
  rewards_enabled               BOOLEAN NOT NULL DEFAULT TRUE,
  leaderboard_enabled           BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at                    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT platform_settings_singleton CHECK (id = 1)
);

INSERT INTO public.platform_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- XP Configuration (admin can edit)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.xp_config (
  id          TEXT        PRIMARY KEY,  -- e.g. 'complete_module'
  label       TEXT        NOT NULL,
  xp_value    INT4        NOT NULL DEFAULT 0,
  description TEXT        NULLABLE,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.xp_config (id, label, xp_value, description) VALUES
  ('complete_module',       'Complete a Module',               80,  'XP earned when student completes a learning module'),
  ('complete_quiz_pass',    'Pass Module Quiz',                100, 'XP earned when student passes a module quiz'),
  ('quiz_arena_complete',   'Complete Quiz Arena',             50,  'XP earned for completing a quiz arena session'),
  ('quiz_arena_high_score', 'Quiz Arena High Score Bonus',     25,  'Extra XP when scoring above 90%'),
  ('streak_7_days',         '7-Day Streak Bonus',              50,  'XP bonus for maintaining a 7-day learning streak'),
  ('streak_30_days',        '30-Day Streak Bonus',             150, 'XP bonus for maintaining a 30-day learning streak'),
  ('first_login',           'First Login',                     20,  'XP for first time logging in to the platform'),
  ('repeat_quiz',           'Repeat Quiz (Max)',               0,   'XP from re-doing a quiz (0 = no repeat XP)')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Streak Configuration (singleton row)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.streak_config (
  id                      INT4    PRIMARY KEY DEFAULT 1,
  reset_on_missed_days    BOOLEAN NOT NULL DEFAULT TRUE,
  grace_period_hours      INT4    NOT NULL DEFAULT 0,
  activities_counted      JSONB   NOT NULL DEFAULT '["complete_module","complete_quiz","quiz_arena"]'::jsonb,
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT streak_config_singleton CHECK (id = 1)
);

INSERT INTO public.streak_config (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Streak Milestones
-- ============================================================
CREATE TABLE IF NOT EXISTS public.streak_milestones (
  id            INT4    PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  days_required INT4    NOT NULL UNIQUE,
  xp_bonus      INT4    NOT NULL DEFAULT 0,
  label         TEXT    NOT NULL,
  badge_emoji   TEXT    NULLABLE
);

INSERT INTO public.streak_milestones (days_required, xp_bonus, label, badge_emoji) VALUES
  (7,  50,  '7-Day Streak',  '🔥'),
  (14, 80,  '2-Week Streak', '⚡'),
  (30, 150, '30-Day Streak', '💎'),
  (60, 300, '60-Day Streak', '👑')
ON CONFLICT (days_required) DO NOTHING;
