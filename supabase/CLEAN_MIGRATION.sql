-- ============================================================
-- EDUCLASS - CORE TABLES MIGRATION (No Emoji Version)
-- Run in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- LEVELS
-- ============================================================
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

-- ============================================================
-- CATEGORIES
-- ============================================================
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

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id               UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email            TEXT        NOT NULL UNIQUE,
  name             TEXT        NOT NULL DEFAULT '',
  nim              TEXT        UNIQUE,
  role             TEXT        NOT NULL DEFAULT 'mahasiswa' CHECK (role IN ('mahasiswa', 'admin')),
  status           TEXT        NOT NULL DEFAULT 'active'    CHECK (status IN ('active', 'inactive')),
  avatar_url       TEXT,
  current_level_id INT4        REFERENCES public.levels(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- USER STATS
-- ============================================================
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
  updated_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- updated_at trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- Auto-create profile on signup trigger
-- ============================================================
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
    nim  = COALESCE(EXCLUDED.nim, profiles.nim),
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

-- ============================================================
-- PLATFORM SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id                         INT4    PRIMARY KEY DEFAULT 1,
  platform_name              TEXT    NOT NULL DEFAULT 'EduClass',
  default_language           TEXT    NOT NULL DEFAULT 'id',
  default_min_score          INT4    NOT NULL DEFAULT 60,
  allow_retake               BOOLEAN NOT NULL DEFAULT TRUE,
  max_retake_attempts        INT4    NOT NULL DEFAULT 3,
  xp_enabled                 BOOLEAN NOT NULL DEFAULT TRUE,
  streak_enabled             BOOLEAN NOT NULL DEFAULT TRUE,
  achievements_enabled       BOOLEAN NOT NULL DEFAULT TRUE,
  rewards_enabled            BOOLEAN NOT NULL DEFAULT TRUE,
  leaderboard_enabled        BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT platform_settings_singleton CHECK (id = 1)
);

INSERT INTO public.platform_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- XP CONFIG
-- ============================================================
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
  ('quiz_arena_high_score', 'Quiz Arena High Score Bonus',25,  'Extra XP when scoring above 90%'),
  ('streak_7_days',         '7-Day Streak Bonus',         50,  'XP bonus for maintaining a 7-day learning streak'),
  ('streak_30_days',        '30-Day Streak Bonus',        150, 'XP bonus for maintaining a 30-day learning streak'),
  ('first_login',           'First Login',                20,  'XP for first time logging in')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STREAK CONFIG
-- ============================================================
CREATE TABLE IF NOT EXISTS public.streak_config (
  id                   INT4    PRIMARY KEY DEFAULT 1,
  reset_on_missed_days BOOLEAN NOT NULL DEFAULT TRUE,
  grace_period_hours   INT4    NOT NULL DEFAULT 0,
  activities_counted   JSONB   NOT NULL DEFAULT '["complete_module","complete_quiz","quiz_arena"]'::jsonb,
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT streak_config_singleton CHECK (id = 1)
);

INSERT INTO public.streak_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STREAK MILESTONES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.streak_milestones (
  id            INT4 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  days_required INT4 NOT NULL UNIQUE,
  xp_bonus      INT4 NOT NULL DEFAULT 0,
  label         TEXT NOT NULL
);

INSERT INTO public.streak_milestones (days_required, xp_bonus, label) VALUES
  (7,  50,  '7-Day Streak'),
  (14, 80,  '2-Week Streak'),
  (30, 150, '30-Day Streak'),
  (60, 300, '60-Day Streak')
ON CONFLICT (days_required) DO NOTHING;

-- ============================================================
-- MATERIALS
-- ============================================================
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

-- ============================================================
-- MATERIAL PAGES
-- ============================================================
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
  (2, 2, 'Contoh Kalimat Riset',          'The researcher had prepared the samples before the observation began. Aksi 1 (lebih dulu): had prepared (Past Perfect). Aksi 2 (kemudian): began (Past Simple).'),
  (3, 1, 'Fungsi Passive Voice',           'Dalam artikel ilmiah, fokus utama adalah pada objek penelitian dan proses. Rumus: Subject + Be (is/was/were) + V3.'),
  (3, 2, 'Active vs Passive',             'Active: We collected fifty blood samples. Passive (Lebih Akademis): Fifty blood samples were collected from the participants.'),
  (3, 3, 'Passive dengan Modal Verbs',    'Format: Modal + be + V3. Contoh: The error can be minimized by recalibrating the sensors.')
ON CONFLICT DO NOTHING;

-- ============================================================
-- QUIZ QUESTIONS
-- ============================================================
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
  (1, 'Choose the most formal phrase for a research paper:',
   '["The results show...", "The data demonstrates...", "Look at the data...", "Data is cool..."]'::jsonb, 1, '"The data demonstrates" adalah standar kalimat akademik.', 3),
  (2, 'By the time the professor arrived, the students _____ the experiment.',
   '["finished", "had finished", "have finished", "finishing"]'::jsonb, 1, 'Selesai sebelum profesor tiba di masa lampau: "had finished".', 1),
  (2, 'She said she _____ the academic journal before submitting her thesis.',
   '["readed", "had read", "has read", "reading"]'::jsonb, 1, 'Gunakan Past Perfect "had read" untuk aksi sebelum penyerahan.', 2),
  (3, 'Convert to academic passive: "Researchers analyzed the survey data."',
   '["The survey data was analyzing.", "The survey data were analyzed by researchers.", "The survey data is analyzed.", "Researchers were analyzed data."]'::jsonb, 1, '"The survey data were analyzed" adalah bentuk pasif lampau yang tepat.', 1),
  (3, 'Complete: "The chemical mixture _____ before testing."',
   '["must heated", "must be heated", "must heating", "must be heat"]'::jsonb, 1, 'Gunakan Modal + be + V3: "must be heated".', 2),
  (3, 'Why is passive voice preferred in scientific methodologies?',
   '["To make text longer", "To highlight the action rather than the agent", "Active is grammatically wrong", "To make it harder to read"]'::jsonb, 1, 'Passive menekankan metodologi dan data, bukan individu pelaku.', 3),
  (4, 'What is the purpose of skimming an academic abstract?',
   '["To memorize data", "To quickly grasp the research core argument", "To edit spelling", "To count words"]'::jsonb, 1, 'Skimming bertujuan menangkap ide utama secara kilat.', 1)
ON CONFLICT DO NOTHING;

-- ============================================================
-- QUEST STEPS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quest_steps (
  id          TEXT PRIMARY KEY,
  material_id INT4 NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  step_number INT4 NOT NULL DEFAULT 1,
  type        TEXT NOT NULL CHECK (type IN ('image_select', 'word_arrange', 'character_translate', 'multiple_choice')),
  tag         TEXT,
  prompt      TEXT NOT NULL,
  config      JSONB NOT NULL DEFAULT '{}'::jsonb
);

INSERT INTO public.quest_steps (id, material_id, step_number, type, tag, prompt, config) VALUES
  ('u1_q1', 1, 1, 'image_select', 'KOSAKATA BARU', 'Mana yang merepresentasikan "Academic Journal"?',
   '{"audioText": "Academic Journal", "options": [{"id": 1, "label": "Academic Journal", "phonetic": "ae.ka.dem.ik", "sub": "jurnal ilmiah", "emoji": "book", "isCorrect": true}, {"id": 2, "label": "Coffee Cup", "phonetic": "ko.fi kap", "sub": "cangkir kopi", "emoji": "coffee", "isCorrect": false}, {"id": 3, "label": "Water Bottle", "phonetic": "wo.ter bo.tel", "sub": "botol air", "emoji": "water", "isCorrect": false}]}'::jsonb),
  ('u1_q2', 1, 2, 'word_arrange', 'SUSUN KALIMAT', 'Susun kalimat bahasa Inggris formal:',
   '{"targetMeaning": "Data tersebut membuktikan hipotesis kami.", "targetWords": ["The", "data", "demonstrates", "our", "hypothesis"], "wordBank": ["The", "data", "demonstrates", "our", "hypothesis", "proves", "look", "is"]}'::jsonb),
  ('u2_q1', 2, 1, 'word_arrange', 'URUTAN WAKTU LAMPAU', 'Susun kalimat Past Perfect yang tepat:',
   '{"targetMeaning": "Profesor telah tiba sebelum eksperimen dimulai.", "targetWords": ["The", "professor", "had", "arrived", "before", "the", "experiment"], "wordBank": ["The", "professor", "had", "arrived", "before", "the", "experiment", "has", "arriving"]}'::jsonb),
  ('u3_q1', 3, 1, 'word_arrange', 'PASSIVE VOICE', 'Susun kalimat Passive Voice yang benar:',
   '{"targetMeaning": "Hasil penelitian ini telah dianalisis secara mendalam.", "targetWords": ["The", "results", "were", "analyzed", "thoroughly"], "wordBank": ["The", "results", "were", "analyzed", "thoroughly", "was", "analyzing", "they"]}'::jsonb),
  ('u3_q2', 3, 2, 'multiple_choice', 'KAIDAH TATA BAHASA', 'Lengkapi kalimat pasif akademik ini:',
   '{"sentence": "The formal methodology _____ approved by the ethical board.", "options": ["has been", "have were", "is being was", "did"], "answer": 0, "explanation": "Gunakan has been approved (Present Perfect Passive) untuk subjek tunggal."}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- LEARNING PATHS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.learning_paths (
  id          INT4        PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  level_id    INT4        NOT NULL UNIQUE REFERENCES public.levels(id),
  name        TEXT        NOT NULL,
  description TEXT,
  status      TEXT        NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_learning_paths_updated_at
  BEFORE UPDATE ON public.learning_paths
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

INSERT INTO public.learning_paths (level_id, name, description, status) VALUES
  (1, 'Level 1: Beginner English Path',        'Fondasi kosakata dasar dan pemahaman kalimat.',           'active'),
  (2, 'Level 2: English Learner Path',          'Konstruksi kalimat pasif ilmiah dan membaca teks.',       'active'),
  (3, 'Level 3: English Explorer Path',         'Penulisan abstrak dan argumentasi skripsi.',              'active'),
  (4, 'Level 4: Intermediate Path',             'Penyusunan sintesis literatur dan presentasi akademik.',  'active'),
  (5, 'Level 5: Advanced Learner Path',         'Persiapan simulasi EELS dan penulisan jurnal.',           'active'),
  (6, 'Level 6: English Master Path',           'Penguasaan wacana akademik tingkat tinggi.',              'active')
ON CONFLICT (level_id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.learning_path_items (
  id               INT4 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  learning_path_id INT4 NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
  material_id      INT4 NOT NULL REFERENCES public.materials(id),
  sort_order       INT4 NOT NULL DEFAULT 0,
  UNIQUE (learning_path_id, material_id)
);

INSERT INTO public.learning_path_items (learning_path_id, material_id, sort_order) VALUES
  (1, 1, 1), (1, 2, 2),
  (2, 3, 1), (2, 4, 2),
  (3, 5, 1),
  (4, 6, 1),
  (5, 7, 1),
  (6, 8, 1)
ON CONFLICT DO NOTHING;

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id                INT4        PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name              TEXT        NOT NULL UNIQUE,
  description       TEXT        NOT NULL,
  category          TEXT        NOT NULL CHECK (category IN ('learning', 'streak', 'performance')),
  requirement_type  TEXT        NOT NULL,
  requirement_value INT4        NOT NULL DEFAULT 0,
  requirement_label TEXT,
  icon_emoji        TEXT,
  xp_bonus          INT4        NOT NULL DEFAULT 0,
  status            TEXT        NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.achievements (name, description, category, requirement_type, requirement_value, requirement_label, xp_bonus) VALUES
  ('First Step',        'Complete your first quiz',            'learning',    'complete_quiz', 1,   'Complete 1 quiz',     20),
  ('7-Day Warrior',     'Maintain a 7-day learning streak',    'streak',      'streak_days',   7,   'Reach 7-day streak',  50),
  ('Perfect Score',     'Get 100% on any quiz',                'performance', 'score_100',     100, 'Score 100% on quiz',  30),
  ('Quiz Master',       'Complete 20 quizzes',                 'learning',    'complete_quiz', 20,  'Complete 20 quizzes', 100),
  ('Consistent Learner','Maintain 30-day streak',              'streak',      'streak_days',   30,  'Reach 30-day streak', 150)
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- USER ACHIEVEMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id             INT4        PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id        UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id INT4        NOT NULL REFERENCES public.achievements(id),
  earned_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, achievement_id)
);

-- ============================================================
-- REWARDS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.rewards (
  id                TEXT  PRIMARY KEY,
  name              TEXT  NOT NULL,
  description       TEXT,
  type              TEXT  NOT NULL CHECK (type IN ('theme', 'content', 'item')),
  theme_class       TEXT,
  preview_color     TEXT,
  requirement_type  TEXT  NOT NULL DEFAULT 'default',
  requirement_value INT4,
  requirement_label TEXT,
  price_gems        INT4  NOT NULL DEFAULT 0,
  icon_emoji        TEXT,
  status            TEXT  NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
);

INSERT INTO public.rewards (id, name, description, type, theme_class, preview_color, requirement_type, requirement_value, requirement_label, price_gems, status) VALUES
  ('theme_default',  'Classic Bright',  'Clean bright default theme',         'theme', 'bg-[#f8fafc]',   '#f8fafc', 'default', NULL, 'Available by default', 0,   'active'),
  ('theme_slate',    'Midnight Slate',  'Dark and elegant dark mode theme',   'theme', 'bg-slate-900',   '#0f172a', 'xp',      500,  'Reach 500 XP',        150, 'active'),
  ('theme_indigo',   'Deep Indigo',     'Deep blue-purple mystical theme',    'theme', 'bg-indigo-950',  '#1e1b4b', 'xp',      1000, 'Reach 1000 XP',       250, 'active'),
  ('theme_emerald',  'Forest Emerald',  'Nature-inspired refreshing green',   'theme', 'bg-emerald-950', '#022c22', 'xp',      1500, 'Reach 1500 XP',       300, 'active'),
  ('theme_rose',     'Crimson Rose',    'Passionate dark red theme',          'theme', 'bg-rose-950',    '#4c0519', 'xp',      2000, 'Reach 2000 XP',       400, 'active'),
  ('theme_amber',    'Golden Amber',    'Premium golden theme for achievers', 'theme', 'bg-[#1a1205]',   '#1a1205', 'xp',      3000, 'Reach 3000 XP',       500, 'active')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- USER INVENTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_inventory (
  id          INT4        PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reward_id   TEXT        NOT NULL REFERENCES public.rewards(id),
  acquired_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, reward_id)
);

-- ============================================================
-- DAILY QUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.daily_quests (
  id           INT4 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title        TEXT NOT NULL,
  target_value INT4 NOT NULL DEFAULT 1,
  unit         TEXT NOT NULL DEFAULT 'unit',
  reward_gems  INT4 NOT NULL DEFAULT 0,
  reward_xp    INT4 NOT NULL DEFAULT 0,
  icon         TEXT,
  quest_type   TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
);

INSERT INTO public.daily_quests (title, target_value, unit, reward_gems, reward_xp, icon, quest_type, status) VALUES
  ('Dapatkan 50 XP dari Quiz atau Modul',  50, 'XP',    25, 50, 'bolt',                  'earn_xp',         'active'),
  ('Kerjakan 1 Latihan EELS Boss Battle',   1, 'Battle', 50, 75, 'swords',                'boss_battle',     'active'),
  ('Pertahankan Streak Belajar Hari Ini',   1, 'Streak', 20, 30, 'local_fire_department', 'maintain_streak', 'active')
ON CONFLICT DO NOTHING;

-- ============================================================
-- DAILY QUEST PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.daily_quest_progress (
  id            INT4        PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id       UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quest_id      INT4        NOT NULL REFERENCES public.daily_quests(id),
  quest_date    DATE        NOT NULL DEFAULT CURRENT_DATE,
  current_value INT4        NOT NULL DEFAULT 0,
  completed     BOOLEAN     NOT NULL DEFAULT FALSE,
  completed_at  TIMESTAMPTZ,
  UNIQUE (user_id, quest_id, quest_date)
);

-- ============================================================
-- ACTIVITY LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS public.activity_log (
  id            INT4        PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id       UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_type TEXT        NOT NULL CHECK (activity_type IN ('quiz', 'module', 'arena', 'achievement', 'level', 'boss_battle')),
  detail        TEXT,
  material_id   INT4        REFERENCES public.materials(id),
  score         INT4,
  xp_earned     INT4        NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_log_user_id    ON public.activity_log (user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON public.activity_log (created_at DESC);

-- ============================================================
-- QUIZ ATTEMPTS
-- ============================================================
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

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id     ON public.quiz_attempts (user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_material_id ON public.quiz_attempts (material_id);

-- ============================================================
-- MATERIAL PROGRESS
-- ============================================================
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

CREATE TRIGGER trg_material_progress_updated_at
  BEFORE UPDATE ON public.material_progress
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_material_progress_user_id ON public.material_progress (user_id);

-- ============================================================
-- STREAK LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.streak_logs (
  id             INT4 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_date  DATE NOT NULL,
  streak_count   INT4 NOT NULL DEFAULT 1,
  UNIQUE (user_id, activity_date)
);

-- ============================================================
-- BOSS BATTLES
-- ============================================================
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
   1, 'Negative inversion: setelah "Not only" di awal klausa, gunakan inversi auxiliary did + subject.', 1),
  (1, 'Written Expression',
   'The committee decided to postpone the academic conference because of the delegates (A) had not yet (B) received their (C) travel authorizations (D).',
   '["because of", "had not yet", "received their", "authorizations"]'::jsonb,
   0, 'Kesalahan pada (A) "because of" - seharusnya "because" karena diikuti klausa lengkap.', 2),
  (1, 'Structure',
   'Were the hypothesis _____ valid, the team would proceed with clinical trials immediately.',
   '["proven", "to be proven", "proved to", "proving"]'::jsonb,
   1, 'Inverted Conditional Type 2: "Were the hypothesis to be proven valid..."', 3)
ON CONFLICT DO NOTHING;

-- ============================================================
-- VIEWS
-- ============================================================
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

CREATE OR REPLACE VIEW public.admin_student_overview AS
SELECT
  p.id, p.name, p.email, p.nim, p.role, p.status, p.avatar_url, p.created_at,
  us.total_xp, us.gems, us.current_streak, us.longest_streak,
  us.total_completed_materials, us.total_completed_quizzes, us.last_activity_date,
  l.name AS level_name, l.level_number, l.badge_emoji AS level_badge, l.cefr_equivalent AS cefr
FROM public.profiles p
LEFT JOIN public.user_stats us ON p.id = us.user_id
LEFT JOIN public.levels l ON p.current_level_id = l.id;

CREATE OR REPLACE VIEW public.material_with_category AS
SELECT
  m.*,
  c.name AS category_name, c.color AS category_color, c.icon AS category_icon,
  lv.name AS level_name, lv.level_number, lv.badge_emoji AS level_badge,
  (SELECT COUNT(*) FROM public.quiz_questions qq WHERE qq.material_id = m.id) AS quiz_question_count,
  (SELECT COUNT(*) FROM public.quest_steps qs WHERE qs.material_id = m.id) AS quest_step_count
FROM public.materials m
LEFT JOIN public.categories c ON m.category_id = c.id
LEFT JOIN public.levels lv ON m.level_id = lv.id;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
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

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
$$;

-- Public read policies
CREATE POLICY "levels_select"    ON public.levels    FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "categories_select"ON public.categories FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "materials_select" ON public.materials  FOR SELECT USING (publish_status = 'published' OR public.is_admin());
CREATE POLICY "mat_pages_select" ON public.material_pages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "quiz_q_select"    ON public.quiz_questions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "quest_s_select"   ON public.quest_steps FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "lp_select"        ON public.learning_paths FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "lpi_select"       ON public.learning_path_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ach_select"       ON public.achievements FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "rew_select"       ON public.rewards FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "dq_select"        ON public.daily_quests FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "bb_select"        ON public.boss_battles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "bbq_select"       ON public.boss_battle_questions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "ps_select"        ON public.platform_settings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "xp_select"        ON public.xp_config FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "sc_select"        ON public.streak_config FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "sm_select"        ON public.streak_milestones FOR SELECT USING (auth.role() = 'authenticated');

-- Admin write policies
CREATE POLICY "levels_admin"     ON public.levels    FOR ALL USING (public.is_admin());
CREATE POLICY "categories_admin" ON public.categories FOR ALL USING (public.is_admin());
CREATE POLICY "materials_admin"  ON public.materials  FOR ALL USING (public.is_admin());
CREATE POLICY "mat_pages_admin"  ON public.material_pages FOR ALL USING (public.is_admin());
CREATE POLICY "quiz_q_admin"     ON public.quiz_questions FOR ALL USING (public.is_admin());
CREATE POLICY "quest_s_admin"    ON public.quest_steps FOR ALL USING (public.is_admin());
CREATE POLICY "lp_admin"         ON public.learning_paths FOR ALL USING (public.is_admin());
CREATE POLICY "lpi_admin"        ON public.learning_path_items FOR ALL USING (public.is_admin());
CREATE POLICY "ach_admin"        ON public.achievements FOR ALL USING (public.is_admin());
CREATE POLICY "rew_admin"        ON public.rewards FOR ALL USING (public.is_admin());
CREATE POLICY "dq_admin"         ON public.daily_quests FOR ALL USING (public.is_admin());
CREATE POLICY "bb_admin"         ON public.boss_battles FOR ALL USING (public.is_admin());
CREATE POLICY "bbq_admin"        ON public.boss_battle_questions FOR ALL USING (public.is_admin());
CREATE POLICY "ps_admin"         ON public.platform_settings FOR ALL USING (public.is_admin());
CREATE POLICY "xp_admin"         ON public.xp_config FOR ALL USING (public.is_admin());
CREATE POLICY "sc_admin"         ON public.streak_config FOR ALL USING (public.is_admin());
CREATE POLICY "sm_admin"         ON public.streak_milestones FOR ALL USING (public.is_admin());

-- User-owned policies (profiles)
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User-owned policies (user_stats)
CREATE POLICY "us_select" ON public.user_stats FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "us_update" ON public.user_stats FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "us_insert" ON public.user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User-owned policies (other tables)
CREATE POLICY "ua_select" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "ua_insert" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ui_select" ON public.user_inventory FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "ui_insert" ON public.user_inventory FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "dqp_select" ON public.daily_quest_progress FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "dqp_insert" ON public.daily_quest_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "dqp_update" ON public.daily_quest_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "al_select"  ON public.activity_log FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "al_insert"  ON public.activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "qa_select"  ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "qa_insert"  ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "mp_select"  ON public.material_progress FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "mp_insert"  ON public.material_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "mp_update"  ON public.material_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "sl_select"  ON public.streak_logs FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "sl_insert"  ON public.streak_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- BACKFILL existing auth users into profiles
-- ============================================================
INSERT INTO public.profiles (id, email, name, nim, role, current_level_id)
SELECT
  u.id, u.email,
  COALESCE(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
  u.raw_user_meta_data->>'nim',
  COALESCE(u.raw_user_meta_data->>'role', 'mahasiswa'),
  1
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_stats (user_id)
SELECT id FROM public.profiles
WHERE NOT EXISTS (SELECT 1 FROM public.user_stats us WHERE us.user_id = profiles.id)
ON CONFLICT (user_id) DO NOTHING;

-- Verify
SELECT p.id, p.email, p.name, p.role, us.total_xp
FROM public.profiles p
LEFT JOIN public.user_stats us ON p.id = us.user_id;
