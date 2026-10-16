-- ============================================================
-- MAKE ADMIN - arutari640@gmail.com
-- Jalankan di Supabase SQL Editor
-- ============================================================

-- Step 1: Update user menjadi admin
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'arutari640@gmail.com';

-- Step 2: Tambah kolom grading ke user_stats (jika belum ada)
ALTER TABLE public.user_stats
  ADD COLUMN IF NOT EXISTS cefr_level          TEXT         DEFAULT 'A2',
  ADD COLUMN IF NOT EXISTS quiz_average        NUMERIC(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS assignment_average  NUMERIC(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS final_score         NUMERIC(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS letter_grade        TEXT         DEFAULT 'E';

-- Step 3: Recreate admin_student_overview view
DROP VIEW IF EXISTS public.admin_student_overview;
CREATE OR REPLACE VIEW public.admin_student_overview AS
SELECT
  p.id,
  p.name          AS full_name,
  p.email,
  p.nim,
  p.role,
  p.status,
  p.avatar_url,
  p.created_at,
  us.total_xp,
  us.gems,
  us.current_streak  AS streak_days,
  us.longest_streak,
  us.total_completed_materials,
  us.total_completed_quizzes,
  us.last_activity_date,
  l.name             AS level_name,
  l.level_number,
  l.badge_emoji      AS level_badge,
  l.cefr_equivalent  AS cefr_level,
  COALESCE(us.quiz_average, 0)          AS quiz_average,
  COALESCE(us.assignment_average, 0)    AS assignment_average,
  COALESCE(us.final_score, 0)           AS final_score,
  COALESCE(us.letter_grade, 'E')        AS letter_grade
FROM public.profiles p
LEFT JOIN public.user_stats us ON p.id = us.user_id
LEFT JOIN public.levels l ON p.current_level_id = l.id
WHERE p.role = 'mahasiswa';

GRANT SELECT ON public.admin_student_overview TO authenticated;
GRANT SELECT ON public.admin_student_overview TO anon;

-- Step 4: Verify
SELECT id, email, role FROM public.profiles WHERE email = 'arutari640@gmail.com';
