-- ============================================================
-- Migration 008: Progress Tracking — Activity Log,
--                Quiz Attempts, Material Progress, Streak Logs
-- ============================================================

-- ============================================================
-- Activity Log (all user learning activities)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.activity_log (
  id            INT4        PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id       UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_type TEXT        NOT NULL CHECK (activity_type IN ('quiz', 'module', 'arena', 'achievement', 'level', 'boss_battle')),
  detail        TEXT        NULLABLE,
  material_id   INT4        NULLABLE REFERENCES public.materials(id),
  score         INT4        NULLABLE,
  xp_earned     INT4        NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast user-based queries
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id   ON public.activity_log (user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON public.activity_log (created_at DESC);

-- ============================================================
-- Quiz Attempts (per user per material)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id                  INT4        PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id             UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  material_id         INT4        NOT NULL REFERENCES public.materials(id),
  attempt_number      INT4        NOT NULL DEFAULT 1,
  score               INT4        NOT NULL CHECK (score BETWEEN 0 AND 100),
  passed              BOOLEAN     NOT NULL DEFAULT FALSE,
  answers             JSONB       NULLABLE,  -- [{question_id, chosen_index, is_correct}]
  time_taken_seconds  INT4        NULLABLE,
  completed_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id     ON public.quiz_attempts (user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_material_id ON public.quiz_attempts (material_id);

-- ============================================================
-- Material Progress (per user per material)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.material_progress (
  id                      INT4        PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id                 UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  material_id             INT4        NOT NULL REFERENCES public.materials(id),
  status                  TEXT        NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  stars                   INT2        NOT NULL DEFAULT 0 CHECK (stars BETWEEN 0 AND 3),
  best_score              INT4        NULLABLE,
  pages_read              INT4        NOT NULL DEFAULT 0,
  quest_steps_completed   INT4        NOT NULL DEFAULT 0,
  started_at              TIMESTAMPTZ NULLABLE,
  completed_at            TIMESTAMPTZ NULLABLE,
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, material_id)
);

DROP TRIGGER IF EXISTS trg_material_progress_updated_at ON public.material_progress;
CREATE TRIGGER trg_material_progress_updated_at
  BEFORE UPDATE ON public.material_progress
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_material_progress_user_id ON public.material_progress (user_id);

-- ============================================================
-- Streak Logs (daily check-in record per user)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.streak_logs (
  id             INT4 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_date  DATE NOT NULL,
  streak_count   INT4 NOT NULL DEFAULT 1,
  UNIQUE (user_id, activity_date)
);

CREATE INDEX IF NOT EXISTS idx_streak_logs_user_id ON public.streak_logs (user_id);
