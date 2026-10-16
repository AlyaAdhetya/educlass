-- ============================================================
-- Migration 007: Gamification — Achievements, Rewards,
--                User Achievements, User Inventory,
--                Daily Quests, Daily Quest Progress
-- ============================================================

-- ============================================================
-- Achievements (global definitions)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id                  INT4        PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name                TEXT        NOT NULL UNIQUE,
  description         TEXT        NOT NULL,
  category            TEXT        NOT NULL CHECK (category IN ('learning', 'streak', 'performance')),
  requirement_type    TEXT        NOT NULL,
  requirement_value   INT4        NOT NULL DEFAULT 0,
  requirement_label   TEXT        NULLABLE,
  icon_emoji          TEXT        NULLABLE,
  xp_bonus            INT4        NOT NULL DEFAULT 0,
  status              TEXT        NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.achievements
  (name, description, category, requirement_type, requirement_value, requirement_label, icon_emoji, xp_bonus, status)
VALUES
  ('First Step',        'Complete your first quiz',                      'learning',    'complete_quiz',      1,   'Complete 1 quiz',              '🎯', 20,  'active'),
  ('7-Day Warrior',     'Maintain a 7-day learning streak',              'streak',      'streak_days',        7,   'Reach 7-day streak',           '🔥', 50,  'active'),
  ('Perfect Score',     'Get 100% on any quiz',                          'performance', 'score_100',          100, 'Score 100% on a quiz',         '💯', 30,  'active'),
  ('Quiz Master',       'Complete 20 quizzes',                           'learning',    'complete_quiz',      20,  'Complete 20 quizzes',          '🏆', 100, 'active'),
  ('Consistent Learner','Maintain 30-day streak',                        'streak',      'streak_days',        30,  'Reach 30-day streak',          '💎', 150, 'active'),
  ('Module Scholar',    'Complete all available modules',                'learning',    'complete_all_modules',5,  'Complete all 5 modules',       '📚', 200, 'active'),
  ('Speed Learner',     'Complete 3 modules in one week',                'performance', 'modules_week',       3,   'Complete 3 modules in 7 days', '⚡', 75,  'active'),
  ('Grammar Guru',      'Pass all Grammar quizzes with 90+',             'performance', 'grammar_score',      90,  'Score 90%+ on all Grammar quizzes', '✍️', 80, 'inactive')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- User Achievements (earned per user)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id             INT4        PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id        UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id INT4        NOT NULL REFERENCES public.achievements(id),
  earned_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, achievement_id)
);

-- ============================================================
-- Rewards (shop items / unlockable themes)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.rewards (
  id                  TEXT        PRIMARY KEY,
  name                TEXT        NOT NULL,
  description         TEXT        NULLABLE,
  type                TEXT        NOT NULL CHECK (type IN ('theme', 'content', 'item')),
  theme_class         TEXT        NULLABLE,
  preview_color       TEXT        NULLABLE,
  requirement_type    TEXT        NOT NULL DEFAULT 'default',
  requirement_value   INT4        NULLABLE,
  requirement_label   TEXT        NULLABLE,
  price_gems          INT4        NOT NULL DEFAULT 0,
  icon_emoji          TEXT        NULLABLE,
  status              TEXT        NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
);

INSERT INTO public.rewards
  (id, name, description, type, theme_class, preview_color, requirement_type, requirement_value, requirement_label, price_gems, icon_emoji, status)
VALUES
  ('theme_default',      'Classic Bright',       'Clean bright default theme',                           'theme',   'bg-[#f8fafc]',   '#f8fafc', 'default',      NULL, 'Available by default',  0,   '☀️', 'active'),
  ('theme_slate',        'Midnight Slate',        'Dark and elegant dark mode theme',                     'theme',   'bg-slate-900',   '#0f172a', 'xp',           500,  'Reach 500 XP',          150, '🌑', 'active'),
  ('theme_indigo',       'Deep Indigo',           'Deep blue-purple mystical theme',                      'theme',   'bg-indigo-950',  '#1e1b4b', 'xp',           1000, 'Reach 1000 XP',         250, '🌌', 'active'),
  ('theme_emerald',      'Forest Emerald',        'Nature-inspired refreshing green',                     'theme',   'bg-emerald-950', '#022c22', 'xp',           1500, 'Reach 1500 XP',         300, '🌲', 'active'),
  ('theme_rose',         'Crimson Rose',          'Passionate dark red theme',                            'theme',   'bg-rose-950',    '#4c0519', 'xp',           2000, 'Reach 2000 XP',         400, '🌹', 'active'),
  ('theme_amber',        'Golden Amber',          'Premium golden dark theme for high achievers',         'theme',   'bg-[#1a1205]',   '#1a1205', 'xp',           3000, 'Reach 3000 XP',         500, '✨', 'active'),
  ('bonus_lesson_500',   'Bonus Lesson Pack',     'Unlock exclusive bonus vocabulary lesson',             'content', NULL,             NULL,      'xp',           500,  'Reach 500 XP',          0,   '🎁', 'active'),
  ('special_quiz_1000',  'Special EELS Quiz',     'Unlock special EELS simulation quiz',                  'content', NULL,             NULL,      'xp',           1000, 'Reach 1000 XP',         0,   '🎯', 'active')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- User Inventory (rewards owned by user)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_inventory (
  id          INT4        PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reward_id   TEXT        NOT NULL REFERENCES public.rewards(id),
  acquired_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, reward_id)
);

-- ============================================================
-- Daily Quests (templates)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.daily_quests (
  id           INT4    PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title        TEXT    NOT NULL,
  target_value INT4    NOT NULL DEFAULT 1,
  unit         TEXT    NOT NULL DEFAULT 'unit',
  reward_gems  INT4    NOT NULL DEFAULT 0,
  reward_xp    INT4    NOT NULL DEFAULT 0,
  icon         TEXT    NULLABLE,
  quest_type   TEXT    NOT NULL,
  status       TEXT    NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
);

INSERT INTO public.daily_quests (title, target_value, unit, reward_gems, reward_xp, icon, quest_type, status) VALUES
  ('Dapatkan 50 XP dari Quiz atau Modul',    50, 'XP',     25, 50, 'bolt',                  'earn_xp',          'active'),
  ('Kerjakan 1 Latihan EELS Boss Battle',     1, 'Battle',  50, 75, 'swords',                'boss_battle',      'active'),
  ('Pertahankan Streak Belajar Hari Ini',     1, 'Streak',  20, 30, 'local_fire_department', 'maintain_streak',  'active')
ON CONFLICT DO NOTHING;

-- ============================================================
-- Daily Quest Progress (per user per day)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.daily_quest_progress (
  id            INT4        PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id       UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quest_id      INT4        NOT NULL REFERENCES public.daily_quests(id),
  quest_date    DATE        NOT NULL DEFAULT CURRENT_DATE,
  current_value INT4        NOT NULL DEFAULT 0,
  completed     BOOLEAN     NOT NULL DEFAULT FALSE,
  completed_at  TIMESTAMPTZ NULLABLE,
  UNIQUE (user_id, quest_id, quest_date)
);
