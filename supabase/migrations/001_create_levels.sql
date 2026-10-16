-- ============================================================
-- Migration 001: Create levels table
-- ============================================================

CREATE TABLE IF NOT EXISTS public.levels (
  id             INT4    PRIMARY KEY,
  level_number   INT4    NOT NULL UNIQUE,
  name           TEXT    NOT NULL,
  cefr_equivalent TEXT   NULLABLE,
  xp_required    INT4    NOT NULL DEFAULT 0,
  badge_emoji    TEXT    NULLABLE,
  color          TEXT    NULLABLE,
  description    TEXT    NULLABLE,
  perks          TEXT    NULLABLE
);

-- Seed data
INSERT INTO public.levels (id, level_number, name, cefr_equivalent, xp_required, badge_emoji, color, description, perks) VALUES
  (1, 1, 'Beginner',         'A1', 0,    '🌱', 'gray',   'Starting your English learning journey',       'Access to beginner materials'),
  (2, 2, 'English Learner',  'A2', 200,  '📖', 'blue',   'Building foundational English skills',         'Access to vocabulary and basic grammar'),
  (3, 3, 'English Explorer', 'B1', 500,  '🔍', 'indigo', 'Exploring intermediate concepts',              'Access to reading and listening modules'),
  (4, 4, 'Intermediate',     'B2', 1000, '⭐', 'violet', 'Achieving solid English proficiency',          'Access to quiz arena + intermediate materials'),
  (5, 5, 'Advanced Learner', 'C1', 2000, '🏆', 'amber',  'Demonstrating advanced English mastery',       'Unlock special quiz modes and rewards'),
  (6, 6, 'English Master',   'C2', 3500, '👑', 'rose',   'The highest level of English proficiency',     'All content unlocked + exclusive themes')
ON CONFLICT (id) DO NOTHING;
