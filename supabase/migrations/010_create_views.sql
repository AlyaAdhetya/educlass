-- ============================================================
-- Migration 010: Views
-- ============================================================

-- ============================================================
-- View: leaderboard
-- Aggregates user_stats + profiles + levels for ranking
-- ============================================================
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT
  p.id,
  p.name,
  p.nim,
  p.avatar_url,
  us.total_xp,
  us.current_streak,
  us.longest_streak,
  l.name           AS level_name,
  l.badge_emoji    AS level_badge,
  l.level_number,
  RANK() OVER (ORDER BY us.total_xp DESC) AS rank
FROM public.profiles  p
JOIN public.user_stats us ON p.id = us.user_id
LEFT JOIN public.levels l  ON p.current_level_id = l.id
WHERE p.role   = 'mahasiswa'
  AND p.status = 'active';

-- ============================================================
-- View: admin_student_overview
-- For admin dashboard: student stats summary
-- ============================================================
CREATE OR REPLACE VIEW public.admin_student_overview AS
SELECT
  p.id,
  p.name,
  p.email,
  p.nim,
  p.role,
  p.status,
  p.avatar_url,
  p.created_at,
  us.total_xp,
  us.gems,
  us.current_streak,
  us.longest_streak,
  us.total_completed_materials,
  us.total_completed_quizzes,
  us.last_activity_date,
  l.name         AS level_name,
  l.level_number,
  l.badge_emoji  AS level_badge,
  l.cefr_equivalent AS cefr
FROM public.profiles  p
LEFT JOIN public.user_stats us ON p.id = us.user_id
LEFT JOIN public.levels l       ON p.current_level_id = l.id;

-- ============================================================
-- View: material_with_category
-- Materials joined with category name for frontend display
-- ============================================================
CREATE OR REPLACE VIEW public.material_with_category AS
SELECT
  m.*,
  c.name  AS category_name,
  c.color AS category_color,
  c.icon  AS category_icon,
  lv.name AS level_name,
  lv.level_number,
  lv.badge_emoji AS level_badge,
  (SELECT COUNT(*) FROM public.quiz_questions qq WHERE qq.material_id = m.id) AS quiz_question_count,
  (SELECT COUNT(*) FROM public.quest_steps    qs WHERE qs.material_id = m.id) AS quest_step_count
FROM public.materials m
LEFT JOIN public.categories c  ON m.category_id = c.id
LEFT JOIN public.levels     lv ON m.level_id    = lv.id;
