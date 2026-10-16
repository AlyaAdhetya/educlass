-- ============================================================
-- MINIMAL SETUP - Hanya tabel inti + admin profile
-- Jalankan ini di Supabase SQL Editor
-- Aman dijalankan berkali-kali (IF NOT EXISTS)
-- ============================================================

-- 1. LEVELS table
CREATE TABLE IF NOT EXISTS public.levels (
  id              INT4  PRIMARY KEY,
  level_number    INT4  NOT NULL UNIQUE,
  name            TEXT  NOT NULL,
  cefr_equivalent TEXT,
  xp_required     INT4  NOT NULL DEFAULT 0,
  badge_emoji     TEXT,
  color           TEXT,
  description     TEXT,
  perks           TEXT
);

INSERT INTO public.levels (id, level_number, name, cefr_equivalent, xp_required, color, description, perks) VALUES
  (1, 1, 'Beginner',         'A1', 0,    'gray',   'Starting your English learning journey',    'Access to beginner materials'),
  (2, 2, 'English Learner',  'A2', 200,  'blue',   'Building foundational English skills',      'Access to vocabulary and basic grammar'),
  (3, 3, 'English Explorer', 'B1', 500,  'indigo', 'Exploring intermediate concepts',           'Access to reading and listening modules'),
  (4, 4, 'Intermediate',     'B2', 1000, 'violet', 'Achieving solid English proficiency',       'Access to quiz arena + intermediate materials'),
  (5, 5, 'Advanced Learner', 'C1', 2000, 'amber',  'Demonstrating advanced English mastery',    'Unlock special quiz modes and rewards'),
  (6, 6, 'English Master',   'C2', 3500, 'rose',   'The highest level of English proficiency',  'All content unlocked + exclusive themes')
ON CONFLICT (id) DO NOTHING;

-- 2. PROFILES table
CREATE TABLE IF NOT EXISTS public.profiles (
  id               UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email            TEXT        NOT NULL UNIQUE,
  name             TEXT        NOT NULL DEFAULT '',
  nim              TEXT        UNIQUE,
  role             TEXT        NOT NULL DEFAULT 'mahasiswa' CHECK (role IN ('mahasiswa', 'admin')),
  status           TEXT        NOT NULL DEFAULT 'active'   CHECK (status IN ('active', 'inactive')),
  avatar_url       TEXT,
  current_level_id INT4        REFERENCES public.levels(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. USER_STATS table
CREATE TABLE IF NOT EXISTS public.user_stats (
  id                         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                    UUID        NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_xp                   INT4        NOT NULL DEFAULT 0,
  gems                       INT4        NOT NULL DEFAULT 0,
  hearts                     INT4        NOT NULL DEFAULT 5,
  max_hearts                 INT4        NOT NULL DEFAULT 5,
  current_streak             INT4        NOT NULL DEFAULT 0,
  longest_streak             INT4        NOT NULL DEFAULT 0,
  last_activity_date         DATE,
  total_completed_materials  INT4        NOT NULL DEFAULT 0,
  total_completed_quizzes    INT4        NOT NULL DEFAULT 0,
  active_theme_id            TEXT,
  cefr_level                 TEXT        DEFAULT 'A2',
  quiz_average               NUMERIC(5,2) DEFAULT 0,
  assignment_average         NUMERIC(5,2) DEFAULT 0,
  final_score                NUMERIC(5,2) DEFAULT 0,
  letter_grade               TEXT        DEFAULT 'E',
  updated_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Trigger functions
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

-- Drop and recreate triggers safely
DROP TRIGGER IF EXISTS trg_profiles_updated_at   ON public.profiles;
DROP TRIGGER IF EXISTS trg_user_stats_updated_at ON public.user_stats;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5. Handle new user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, nim, role, current_level_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'nim',
    COALESCE(NEW.raw_user_meta_data->>'role', 'mahasiswa'),
    1
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role;

  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. CATEGORIES table
CREATE TABLE IF NOT EXISTS public.categories (
  id          INT4        PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name        TEXT        NOT NULL UNIQUE,
  description TEXT,
  color       TEXT,
  icon        TEXT,
  status      TEXT        NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.categories (name, description, color, icon, status) VALUES
  ('Vocabulary',      'Word meaning, synonyms, antonyms, and academic vocabulary',     'violet',  'menu_book',          'active'),
  ('Grammar',         'Tenses, sentence structure, passive voice, conditionals',       'rose',    'spellcheck',         'active'),
  ('Reading',         'Reading comprehension, skimming, scanning, inference',          'sky',     'chrome_reader_mode', 'active'),
  ('Writing',         'Academic writing, paragraph structure, essay composition',      'lime',    'edit_note',          'active'),
  ('Listening',       'Listening comprehension and conversation interpretation',       'teal',    'headphones',         'active'),
  ('Conversation',    'Spoken English, academic dialogue, professional communication', 'indigo',  'forum',              'active'),
  ('Academic English','Formal academic language, research writing, citation',          'fuchsia', 'school',             'active'),
  ('Daily English',   'Everyday communication and practical English usage',            'emerald', 'today',              'active')
ON CONFLICT (name) DO NOTHING;

-- 7. MATERIALS table
CREATE TABLE IF NOT EXISTS public.materials (
  id                 INT4        PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  unit               TEXT        NOT NULL,
  title              TEXT        NOT NULL,
  category_id        INT4        REFERENCES public.categories(id),
  level_id           INT4        REFERENCES public.levels(id),
  cefr_label         TEXT,
  description        TEXT,
  status             TEXT        NOT NULL DEFAULT 'active'    CHECK (status IN ('active', 'locked', 'completed')),
  publish_status     TEXT        NOT NULL DEFAULT 'published' CHECK (publish_status IN ('draft', 'published')),
  xp_reward          INT4        NOT NULL DEFAULT 80,
  min_score          INT4        NOT NULL DEFAULT 60,
  time_limit_minutes INT4,
  max_attempts       INT4        NOT NULL DEFAULT 3,
  shuffle_questions  BOOLEAN     NOT NULL DEFAULT FALSE,
  show_explanations  BOOLEAN     NOT NULL DEFAULT TRUE,
  quiz_status        TEXT        NOT NULL DEFAULT 'active'    CHECK (quiz_status IN ('active', 'inactive')),
  sort_order         INT4        NOT NULL DEFAULT 0,
  created_by         UUID        REFERENCES public.profiles(id),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_materials_updated_at ON public.materials;
CREATE TRIGGER trg_materials_updated_at
  BEFORE UPDATE ON public.materials
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

INSERT INTO public.materials (unit, title, category_id, level_id, cefr_label, description, status, publish_status, xp_reward, min_score, max_attempts, sort_order)
VALUES
  ('Unit 1', 'Academic Vocabulary Mastery',          1, 1, 'Dasar - Menengah',  'Kenali dan kuasai kosakata akademik formal.',                'completed', 'published', 80,  60, 3, 1),
  ('Unit 2', 'Past Perfect vs Past Simple',           2, 1, 'Menengah',          'Pahami urutan kronologis masa lampau.',                       'completed', 'published', 90,  60, 3, 2),
  ('Unit 3', 'Passive Voice in Research Paper',       2, 2, 'Menengah Atas',     'Kuasai konstruksi kalimat formal dan Passive Voice.',         'active',    'published', 100, 70, 3, 3),
  ('Unit 4', 'Academic Reading Comprehension',        3, 2, 'Menengah Atas',     'Latih kemampuan membaca kritis pada artikel jurnal.',         'locked',    'published', 110, 75, 3, 4),
  ('Unit 5', 'Abstract and Thesis Argumentation',    4, 3, 'Mahir',              'Sintesis argumen ilmiah dan penyusunan abstrak.',             'locked',    'published', 130, 75, 3, 5),
  ('Unit 6', 'Literature Synthesis and Paraphrasing',7, 4, 'Menengah Atas',     'Teknik merangkum dan memparafrase rujukan ilmiah.',           'active',    'published', 120, 75, 3, 6),
  ('Unit 7', 'Academic Presentation and Q&A',         6, 5, 'Mahir',             'Penyampaian presentasi seminar dalam bahasa Inggris.',        'active',    'published', 140, 80, 3, 7),
  ('Unit 8', 'Journal Manuscript and Peer Review',    4, 6, 'Mahir',             'Penulisan naskah publikasi dan tanggapan reviewer.',          'active',    'published', 150, 80, 3, 8)
ON CONFLICT DO NOTHING;

-- 8. MATERIAL_PAGES table
CREATE TABLE IF NOT EXISTS public.material_pages (
  id          INT4 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  material_id INT4 NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  page_number INT4 NOT NULL DEFAULT 1,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  UNIQUE (material_id, page_number)
);

INSERT INTO public.material_pages (material_id, page_number, title, content) VALUES
  (1, 1, 'Pengenalan Academic Vocabulary', 'Academic Vocabulary adalah kata-kata yang umum dipakai dalam literatur ilmiah. Penguasaan kosakata akademis membedakan bahasa percakapan sehari-hari (casual English) dengan bahasa ilmiah (formal English).'),
  (1, 2, 'Contoh Kosakata Akademik',       'find out => determine / discover | get => obtain / acquire | think about => consider / examine | make sure => verify / substantiate | show => demonstrate / indicate'),
  (1, 3, 'Ringkasan dan Evaluasi',         'Kamu telah mempelajari kosakata formal dasar. Pastikan kamu mengingat perbedaan gaya bahasa casual dan akademis.'),
  (2, 1, 'Past Simple vs Past Perfect',   'Past Simple: Peristiwa lampau yang selesai di waktu tertentu (Subject + V2). Past Perfect: Peristiwa yang selesai SEBELUM peristiwa lampau lainnya (Subject + had + V3).'),
  (2, 2, 'Contoh Kalimat Riset',          'The researcher had prepared the samples before the observation began.'),
  (3, 1, 'Fungsi Passive Voice',           'Dalam artikel ilmiah, fokus utama adalah pada objek penelitian dan proses. Rumus: Subject + Be (is/was/were) + V3.'),
  (3, 2, 'Active vs Passive',             'Active: We collected fifty blood samples. Passive: Fifty blood samples were collected from the participants.'),
  (3, 3, 'Passive dengan Modal Verbs',    'Format: Modal + be + V3. Contoh: The error can be minimized by recalibrating the sensors.')
ON CONFLICT DO NOTHING;

-- 9. QUIZ_QUESTIONS table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id                   INT4        PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  material_id          INT4        NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  question_text        TEXT        NOT NULL,
  options              JSONB       NOT NULL,
  correct_answer_index INT2        NOT NULL CHECK (correct_answer_index BETWEEN 0 AND 3),
  explanation          TEXT,
  sort_order           INT4        NOT NULL DEFAULT 0,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.quiz_questions (material_id, question_text, options, correct_answer_index, explanation, sort_order) VALUES
  (1, 'Which word is the academic equivalent for "to find out"?',
   '["Determine", "Look up", "Guess", "Ignore"]'::jsonb, 0, '"Determine" adalah bentuk akademik formal.', 1),
  (1, 'What is the academic term for "to get"?',
   '["Grab", "Acquire", "Take away", "Catch"]'::jsonb, 1, '"Acquire" berarti memperoleh sesuatu secara formal.', 2),
  (2, 'By the time the professor arrived, the students _____ the experiment.',
   '["finished", "had finished", "have finished", "finishing"]'::jsonb, 1, 'Gunakan Past Perfect.', 1),
  (3, 'Convert to academic passive: "Researchers analyzed the survey data."',
   '["The survey data was analyzing.", "The survey data were analyzed by researchers.", "The survey data is analyzed.", "Researchers were analyzed data."]'::jsonb, 1, 'The survey data were analyzed adalah bentuk pasif lampau yang tepat.', 1)
ON CONFLICT DO NOTHING;

-- 10. XP_CONFIG
CREATE TABLE IF NOT EXISTS public.xp_config (
  id          TEXT        PRIMARY KEY,
  label       TEXT        NOT NULL,
  xp_value    INT4        NOT NULL DEFAULT 0,
  description TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.xp_config (id, label, xp_value, description) VALUES
  ('complete_module',       'Complete a Module',          80,  'XP earned when student completes a learning module'),
  ('complete_quiz_pass',    'Pass Module Quiz',           100, 'XP earned when student passes a module quiz'),
  ('quiz_arena_complete',   'Complete Quiz Arena',        50,  'XP earned for completing a quiz arena session'),
  ('first_login',           'First Login',                20,  'XP for first time logging in')
ON CONFLICT (id) DO NOTHING;

-- 11. BOSS_BATTLES
CREATE TABLE IF NOT EXISTS public.boss_battles (
  id                 INT4        PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  boss_name          TEXT        NOT NULL,
  title              TEXT        NOT NULL,
  cefr_phase         TEXT,
  max_hp             INT4        NOT NULL DEFAULT 10000,
  damage_per_hit     INT4        NOT NULL DEFAULT 350,
  time_limit_seconds INT4,
  status             TEXT        NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.boss_battles (boss_name, title, cefr_phase, max_hp, damage_per_hit, time_limit_seconds, status)
VALUES ('Grammar Challenge', 'Simulasi EELS: Structure & Written Expression', 'Fase Menengah Atas', 10000, 350, 2535, 'active')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS public.boss_battle_questions (
  id                   INT4 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  boss_battle_id       INT4 NOT NULL REFERENCES public.boss_battles(id) ON DELETE CASCADE,
  question_type        TEXT NOT NULL CHECK (question_type IN ('Structure', 'Written Expression', 'Listening', 'Reading')),
  question_text        TEXT NOT NULL,
  options              JSONB NOT NULL,
  correct_answer_index INT2 NOT NULL CHECK (correct_answer_index BETWEEN 0 AND 3),
  explanation          TEXT,
  sort_order           INT4 NOT NULL DEFAULT 0
);

INSERT INTO public.boss_battle_questions (boss_battle_id, question_type, question_text, options, correct_answer_index, explanation, sort_order) VALUES
  (1, 'Structure',
   'Not only _____ the research findings, but she also presented a compelling alternative model.',
   '["she challenged", "did she challenge", "she was challenging", "has she been challenge"]'::jsonb,
   1, 'Negative inversion setelah Not only: did + subject.', 1)
ON CONFLICT DO NOTHING;

-- 12. MATERIAL_PROGRESS
CREATE TABLE IF NOT EXISTS public.material_progress (
  id                    INT4        PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id               UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  material_id           INT4        NOT NULL REFERENCES public.materials(id),
  status                TEXT        NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  stars                 INT2        NOT NULL DEFAULT 0 CHECK (stars BETWEEN 0 AND 3),
  best_score            INT4,
  pages_read            INT4        NOT NULL DEFAULT 0,
  quest_steps_completed INT4        NOT NULL DEFAULT 0,
  started_at            TIMESTAMPTZ,
  completed_at          TIMESTAMPTZ,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, material_id)
);

-- 13. QUIZ_ATTEMPTS
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id                 INT4        PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id            UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  material_id        INT4        NOT NULL REFERENCES public.materials(id),
  attempt_number     INT4        NOT NULL DEFAULT 1,
  score              INT4        NOT NULL CHECK (score BETWEEN 0 AND 100),
  passed             BOOLEAN     NOT NULL DEFAULT FALSE,
  answers            JSONB,
  time_taken_seconds INT4,
  completed_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. VIEWS
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT
  p.id, p.name, p.nim, p.avatar_url,
  us.total_xp, us.current_streak, us.longest_streak,
  l.name AS level_name, l.badge_emoji AS level_badge, l.level_number,
  RANK() OVER (ORDER BY us.total_xp DESC) AS rank
FROM public.profiles p
JOIN public.user_stats us ON p.id = us.user_id
LEFT JOIN public.levels l ON p.current_level_id = l.id
WHERE p.role = 'mahasiswa' AND p.status = 'active';

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
  COALESCE(us.quiz_average, 0)       AS quiz_average,
  COALESCE(us.assignment_average, 0) AS assignment_average,
  COALESCE(us.final_score, 0)        AS final_score,
  COALESCE(us.letter_grade, 'E')     AS letter_grade
FROM public.profiles p
LEFT JOIN public.user_stats us ON p.id = us.user_id
LEFT JOIN public.levels l ON p.current_level_id = l.id
WHERE p.role = 'mahasiswa';

CREATE OR REPLACE VIEW public.material_with_category AS
SELECT
  m.*,
  c.name AS category_name, c.color AS category_color, c.icon AS category_icon,
  lv.name AS level_name, lv.level_number, lv.badge_emoji AS level_badge,
  (SELECT COUNT(*) FROM public.quiz_questions qq WHERE qq.material_id = m.id) AS quiz_question_count
FROM public.materials m
LEFT JOIN public.categories c ON m.category_id = c.id
LEFT JOIN public.levels lv ON m.level_id = lv.id;

-- 15. RLS - Disable semua dulu untuk development, aktifkan saat production
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.levels DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.boss_battles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.boss_battle_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts DISABLE ROW LEVEL SECURITY;

-- Grant akses view ke semua authenticated user
GRANT SELECT ON public.leaderboard              TO authenticated;
GRANT SELECT ON public.admin_student_overview   TO authenticated;
GRANT SELECT ON public.material_with_category   TO authenticated;
GRANT SELECT ON public.levels                   TO authenticated, anon;
GRANT SELECT ON public.categories              TO authenticated, anon;
GRANT SELECT ON public.materials               TO authenticated, anon;
GRANT SELECT ON public.material_pages          TO authenticated, anon;
GRANT SELECT ON public.quiz_questions          TO authenticated, anon;
GRANT SELECT ON public.boss_battles            TO authenticated, anon;
GRANT SELECT ON public.boss_battle_questions   TO authenticated, anon;
GRANT SELECT ON public.xp_config              TO authenticated, anon;
GRANT ALL     ON public.profiles               TO authenticated;
GRANT ALL     ON public.user_stats             TO authenticated;
GRANT ALL     ON public.material_progress      TO authenticated;
GRANT ALL     ON public.quiz_attempts          TO authenticated;

-- 16. BUAT PROFILE ADMIN - arutaria640@gmail.com
INSERT INTO public.profiles (id, email, name, nim, role, current_level_id)
VALUES (
  'e4a3337d-2636-4240-b044-654c1cfd96cc',
  'arutaria640@gmail.com',
  'Admin EduClass',
  NULL,
  'admin',
  1
)
ON CONFLICT (id) DO UPDATE SET role = 'admin';

INSERT INTO public.user_stats (user_id)
VALUES ('e4a3337d-2636-4240-b044-654c1cfd96cc')
ON CONFLICT (user_id) DO NOTHING;

-- VERIFIKASI AKHIR
SELECT id, email, role, name FROM public.profiles WHERE id = 'e4a3337d-2636-4240-b044-654c1cfd96cc';
