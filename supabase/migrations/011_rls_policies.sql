-- ============================================================
-- Migration 011: Row Level Security (RLS) Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_pages        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_steps           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_path_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_inventory        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_quests          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_quest_progress  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_progress     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streak_logs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boss_battles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boss_battle_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_config             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streak_config         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streak_milestones     ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Helper: is_admin() function
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ============================================================
-- PROFILES
-- ============================================================
-- Users can read their own profile; admins can read all
CREATE POLICY "profiles_select_own"  ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "profiles_update_own"  ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "profiles_insert_self" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================
-- USER STATS
-- ============================================================
CREATE POLICY "user_stats_select" ON public.user_stats FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "user_stats_update" ON public.user_stats FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "user_stats_insert" ON public.user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- READ-ONLY PUBLIC CONTENT (levels, categories, etc.)
-- All authenticated users can read; only admins can write
-- ============================================================

-- Levels
CREATE POLICY "levels_select_all"  ON public.levels FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "levels_admin_write" ON public.levels FOR ALL    USING (public.is_admin());

-- Categories
CREATE POLICY "categories_select_all"  ON public.categories FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "categories_admin_write" ON public.categories FOR ALL    USING (public.is_admin());

-- Materials (published visible to all auth users, draft only to admins)
CREATE POLICY "materials_select_published" ON public.materials FOR SELECT
  USING (publish_status = 'published' OR public.is_admin());
CREATE POLICY "materials_admin_write" ON public.materials FOR ALL USING (public.is_admin());

-- Material Pages
CREATE POLICY "material_pages_select" ON public.material_pages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "material_pages_admin_write" ON public.material_pages FOR ALL USING (public.is_admin());

-- Quiz Questions
CREATE POLICY "quiz_questions_select" ON public.quiz_questions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "quiz_questions_admin_write" ON public.quiz_questions FOR ALL USING (public.is_admin());

-- Quest Steps
CREATE POLICY "quest_steps_select" ON public.quest_steps FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "quest_steps_admin_write" ON public.quest_steps FOR ALL USING (public.is_admin());

-- Learning Paths
CREATE POLICY "learning_paths_select" ON public.learning_paths FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "learning_paths_admin_write" ON public.learning_paths FOR ALL USING (public.is_admin());

-- Learning Path Items
CREATE POLICY "learning_path_items_select" ON public.learning_path_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "learning_path_items_admin_write" ON public.learning_path_items FOR ALL USING (public.is_admin());

-- Achievements
CREATE POLICY "achievements_select" ON public.achievements FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "achievements_admin_write" ON public.achievements FOR ALL USING (public.is_admin());

-- Rewards
CREATE POLICY "rewards_select" ON public.rewards FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "rewards_admin_write" ON public.rewards FOR ALL USING (public.is_admin());

-- Daily Quests
CREATE POLICY "daily_quests_select" ON public.daily_quests FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "daily_quests_admin_write" ON public.daily_quests FOR ALL USING (public.is_admin());

-- Boss Battles
CREATE POLICY "boss_battles_select" ON public.boss_battles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "boss_battles_admin_write" ON public.boss_battles FOR ALL USING (public.is_admin());

-- Boss Battle Questions
CREATE POLICY "boss_battle_questions_select" ON public.boss_battle_questions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "boss_battle_questions_admin_write" ON public.boss_battle_questions FOR ALL USING (public.is_admin());

-- Platform Settings (all auth users can read, only admins write)
CREATE POLICY "platform_settings_select" ON public.platform_settings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "platform_settings_admin_write" ON public.platform_settings FOR ALL USING (public.is_admin());

-- XP Config
CREATE POLICY "xp_config_select" ON public.xp_config FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "xp_config_admin_write" ON public.xp_config FOR ALL USING (public.is_admin());

-- Streak Config
CREATE POLICY "streak_config_select" ON public.streak_config FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "streak_config_admin_write" ON public.streak_config FOR ALL USING (public.is_admin());

-- Streak Milestones
CREATE POLICY "streak_milestones_select" ON public.streak_milestones FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "streak_milestones_admin_write" ON public.streak_milestones FOR ALL USING (public.is_admin());

-- ============================================================
-- USER-OWNED DATA (own rows only)
-- ============================================================

-- User Achievements
CREATE POLICY "user_achievements_select" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "user_achievements_insert" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Inventory
CREATE POLICY "user_inventory_select" ON public.user_inventory FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "user_inventory_insert" ON public.user_inventory FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Daily Quest Progress
CREATE POLICY "daily_quest_progress_select" ON public.daily_quest_progress FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "daily_quest_progress_insert" ON public.daily_quest_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "daily_quest_progress_update" ON public.daily_quest_progress FOR UPDATE USING (auth.uid() = user_id);

-- Activity Log
CREATE POLICY "activity_log_select" ON public.activity_log FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "activity_log_insert" ON public.activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Quiz Attempts
CREATE POLICY "quiz_attempts_select" ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "quiz_attempts_insert" ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Material Progress
CREATE POLICY "material_progress_select" ON public.material_progress FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "material_progress_insert" ON public.material_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "material_progress_update" ON public.material_progress FOR UPDATE USING (auth.uid() = user_id);

-- Streak Logs
CREATE POLICY "streak_logs_select" ON public.streak_logs FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "streak_logs_insert" ON public.streak_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
