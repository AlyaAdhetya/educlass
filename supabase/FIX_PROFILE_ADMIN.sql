-- ============================================================
-- FIX PROFILE + SET ADMIN
-- Email: arutaria640@gmail.com (UUID diketahui langsung)
-- ============================================================

DO $$
DECLARE
  v_user_id   UUID := 'e4a3337d-2636-4240-b044-654c1cfd96cc';
  v_email     TEXT := 'arutaria640@gmail.com';
  v_name      TEXT := 'Admin EduClass';
  v_existing  UUID;
BEGIN
  -- Cek apakah profile sudah ada
  SELECT id INTO v_existing
  FROM   public.profiles
  WHERE  id = v_user_id;

  IF v_existing IS NOT NULL THEN
    -- Profile sudah ada -> update role saja
    UPDATE public.profiles
    SET    role = 'admin'
    WHERE  id = v_user_id;
    RAISE NOTICE 'Profile sudah ada -> role diupdate ke admin';
  ELSE
    -- Profile belum ada -> insert baru (nim=NULL agar tidak konflik)
    INSERT INTO public.profiles (id, email, name, nim, role, current_level_id)
    VALUES (v_user_id, v_email, v_name, NULL, 'admin', 1);
    RAISE NOTICE 'Profile baru dibuat dengan role admin';
  END IF;

  -- Pastikan user_stats ada
  INSERT INTO public.user_stats (user_id)
  VALUES (v_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  RAISE NOTICE 'Selesai! Sekarang bisa login sebagai admin.';
END $$;

-- Tambah kolom grading ke user_stats (aman jika sudah ada)
ALTER TABLE public.user_stats
  ADD COLUMN IF NOT EXISTS cefr_level          TEXT         DEFAULT 'A2',
  ADD COLUMN IF NOT EXISTS quiz_average        NUMERIC(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS assignment_average  NUMERIC(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS final_score         NUMERIC(5,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS letter_grade        TEXT         DEFAULT 'E';

-- Recreate admin_student_overview view
DROP VIEW IF EXISTS public.admin_student_overview CASCADE;
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

-- Verifikasi akhir
SELECT id, email, role, name, nim
FROM   public.profiles
WHERE  id = 'e4a3337d-2636-4240-b044-654c1cfd96cc';
