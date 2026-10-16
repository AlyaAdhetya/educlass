-- ================================================================
-- VIEWS MIGRATION - Run this AFTER CLEAN_MIGRATION.sql
-- Creates all views needed by the EduClass frontend
-- ================================================================

-- 1. leaderboard_view: ranked list of students by XP
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT
  p.id           AS user_id,
  p.name,
  p.nim,
  p.email,
  l.name         AS level_name,
  l.badge_emoji,
  us.total_xp,
  us.streak_days,
  us.gems,
  RANK() OVER (ORDER BY us.total_xp DESC) AS rank
FROM profiles p
JOIN user_stats us ON us.user_id = p.id
LEFT JOIN levels l ON l.id = p.current_level_id
WHERE p.role = 'mahasiswa'
  AND p.status = 'active';

-- Enable read access for authenticated users
ALTER VIEW leaderboard_view OWNER TO postgres;
GRANT SELECT ON leaderboard_view TO authenticated;

-- 2. admin_student_overview: comprehensive student list for admin
CREATE OR REPLACE VIEW admin_student_overview AS
SELECT
  p.id,
  p.name,
  p.email,
  p.nim,
  p.role,
  p.status,
  l.level_number,
  l.name         AS level_name,
  l.badge_emoji,
  us.total_xp,
  us.streak_days,
  us.gems,
  us.materials_completed,
  (
    SELECT MAX(al.created_at)
    FROM activity_log al
    WHERE al.user_id = p.id
  ) AS last_activity_date
FROM profiles p
LEFT JOIN user_stats us ON us.user_id = p.id
LEFT JOIN levels l      ON l.id = p.current_level_id;

GRANT SELECT ON admin_student_overview TO authenticated;

-- 3. material_with_category: materials joined with level & category info
CREATE OR REPLACE VIEW material_with_category AS
SELECT
  m.*,
  c.name         AS category_name,
  c.icon         AS category_icon,
  lv.level_number,
  lv.name        AS level_name,
  lv.badge_emoji AS level_badge
FROM materials m
LEFT JOIN categories c ON c.id = m.category_id
LEFT JOIN levels lv    ON lv.id = m.level_id;

GRANT SELECT ON material_with_category TO authenticated;
GRANT SELECT ON material_with_category TO anon;

-- 4. user_progress_summary: per-user progress overview
CREATE OR REPLACE VIEW user_progress_summary AS
SELECT
  mp.user_id,
  mp.material_id,
  mp.status,
  mp.score,
  mp.xp_earned,
  mp.attempts,
  mp.completed_at,
  mp.updated_at,
  m.title        AS material_title,
  m.unit,
  m.xp_reward    AS material_xp_reward,
  m.min_score,
  c.name         AS category_name,
  lv.level_number,
  lv.name        AS level_name
FROM material_progress mp
JOIN materials m   ON m.id = mp.material_id
LEFT JOIN categories c  ON c.id = m.category_id
LEFT JOIN levels lv     ON lv.id = m.level_id;

GRANT SELECT ON user_progress_summary TO authenticated;

-- 5. daily_quest_progress table (if not exists)
CREATE TABLE IF NOT EXISTS daily_quest_progress (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quest_name  TEXT NOT NULL,
  quest_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  completed   BOOLEAN DEFAULT FALSE,
  xp_reward   INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, quest_name, quest_date)
);

ALTER TABLE daily_quest_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own quests" ON daily_quest_progress
  FOR ALL USING (auth.uid() = user_id);

-- 6. activity_log table (if not exists)
CREATE TABLE IF NOT EXISTS activity_log (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'quiz_complete', 'material_read', 'level_up', etc.
  material_id UUID REFERENCES materials(id),
  xp_earned   INTEGER DEFAULT 0,
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own activity" ON activity_log
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins see all activity" ON activity_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
