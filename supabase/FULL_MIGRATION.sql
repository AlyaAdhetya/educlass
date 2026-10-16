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
-- ============================================================
-- Migration 002: Create categories table
-- ============================================================

CREATE TABLE IF NOT EXISTS public.categories (
  id          INT4    PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name        TEXT    NOT NULL UNIQUE,
  description TEXT    NULLABLE,
  color       TEXT    NULLABLE,
  icon        TEXT    NULLABLE,
  status      TEXT    NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed data
INSERT INTO public.categories (name, description, color, icon, status) VALUES
  ('Vocabulary',      'Word meaning, synonyms, antonyms, and academic vocabulary',             'violet',  'menu_book',         'active'),
  ('Grammar',         'Tenses, sentence structure, passive voice, conditionals',               'rose',    'spellcheck',        'active'),
  ('Reading',         'Reading comprehension, skimming, scanning, inference',                  'sky',     'chrome_reader_mode','active'),
  ('Writing',         'Academic writing, paragraph structure, essay composition',              'lime',    'edit_note',         'active'),
  ('Listening',       'Listening comprehension and conversation interpretation',               'teal',    'headphones',        'active'),
  ('Conversation',    'Spoken English, academic dialogue, professional communication',         'indigo',  'forum',             'active'),
  ('Academic English','Formal academic language, research writing, citation',                  'fuchsia', 'school',            'active'),
  ('Daily English',   'Everyday communication and practical English usage',                    'emerald', 'today',             'active')
ON CONFLICT (name) DO NOTHING;
-- ============================================================
-- Migration 003: Create profiles & user_stats tables
--                + trigger to auto-create on auth signup
-- ============================================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id                UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email             TEXT        NOT NULL UNIQUE,
  name              TEXT        NOT NULL DEFAULT '',
  nim               TEXT        NULLABLE UNIQUE,
  role              TEXT        NOT NULL DEFAULT 'mahasiswa' CHECK (role IN ('mahasiswa', 'admin')),
  status            TEXT        NOT NULL DEFAULT 'active'    CHECK (status IN ('active', 'inactive')),
  avatar_url        TEXT        NULLABLE,
  current_level_id  INT4        NULLABLE REFERENCES public.levels(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User stats table (gamification stats)
CREATE TABLE IF NOT EXISTS public.user_stats (
  id                            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                       UUID        NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_xp                      INT4        NOT NULL DEFAULT 0,
  gems                          INT4        NOT NULL DEFAULT 0,
  hearts                        INT4        NOT NULL DEFAULT 5,
  max_hearts                    INT4        NOT NULL DEFAULT 5,
  current_streak                INT4        NOT NULL DEFAULT 0,
  longest_streak                INT4        NOT NULL DEFAULT 0,
  last_activity_date            DATE        NULLABLE,
  total_completed_materials     INT4        NOT NULL DEFAULT 0,
  total_completed_quizzes       INT4        NOT NULL DEFAULT 0,
  active_theme_id               TEXT        NULLABLE,
  updated_at                    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Function: auto-update updated_at column
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger: profiles updated_at
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger: user_stats updated_at
DROP TRIGGER IF EXISTS trg_user_stats_updated_at ON public.user_stats;
CREATE TRIGGER trg_user_stats_updated_at
  BEFORE UPDATE ON public.user_stats
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- Function + Trigger: auto create profile & user_stats
--                     when a new user signs up via Supabase Auth
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role TEXT;
  v_name TEXT;
  v_nim  TEXT;
BEGIN
  -- Extract metadata from auth.users
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'mahasiswa');
  v_name := COALESCE(NEW.raw_user_meta_data->>'name', NEW.email);
  v_nim  := NEW.raw_user_meta_data->>'nim';

  -- Insert into profiles
  INSERT INTO public.profiles (id, email, name, nim, role, current_level_id)
  VALUES (
    NEW.id,
    NEW.email,
    v_name,
    v_nim,
    v_role,
    1  -- Default level: Beginner
  )
  ON CONFLICT (id) DO NOTHING;

  -- Insert initial user_stats
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Trigger: fire when user inserted into auth.users
DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- ============================================================
-- Migration 004: Platform Settings, XP Config, Streak Config
-- ============================================================

-- Platform settings (singleton row)
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id                            INT4    PRIMARY KEY DEFAULT 1,
  platform_name                 TEXT    NOT NULL DEFAULT 'EduClass',
  tagline                       TEXT    NULLABLE DEFAULT 'Gamified English Learning Platform',
  default_language              TEXT    NOT NULL DEFAULT 'id',
  default_min_score             INT4    NOT NULL DEFAULT 60,
  allow_retake                  BOOLEAN NOT NULL DEFAULT TRUE,
  max_retake_attempts           INT4    NOT NULL DEFAULT 3,
  completion_requires_passing   BOOLEAN NOT NULL DEFAULT TRUE,
  show_explanation_after_quiz   BOOLEAN NOT NULL DEFAULT TRUE,
  xp_enabled                   BOOLEAN NOT NULL DEFAULT TRUE,
  streak_enabled                BOOLEAN NOT NULL DEFAULT TRUE,
  achievements_enabled          BOOLEAN NOT NULL DEFAULT TRUE,
  rewards_enabled               BOOLEAN NOT NULL DEFAULT TRUE,
  leaderboard_enabled           BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at                    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT platform_settings_singleton CHECK (id = 1)
);

INSERT INTO public.platform_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- XP Configuration (admin can edit)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.xp_config (
  id          TEXT        PRIMARY KEY,  -- e.g. 'complete_module'
  label       TEXT        NOT NULL,
  xp_value    INT4        NOT NULL DEFAULT 0,
  description TEXT        NULLABLE,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.xp_config (id, label, xp_value, description) VALUES
  ('complete_module',       'Complete a Module',               80,  'XP earned when student completes a learning module'),
  ('complete_quiz_pass',    'Pass Module Quiz',                100, 'XP earned when student passes a module quiz'),
  ('quiz_arena_complete',   'Complete Quiz Arena',             50,  'XP earned for completing a quiz arena session'),
  ('quiz_arena_high_score', 'Quiz Arena High Score Bonus',     25,  'Extra XP when scoring above 90%'),
  ('streak_7_days',         '7-Day Streak Bonus',              50,  'XP bonus for maintaining a 7-day learning streak'),
  ('streak_30_days',        '30-Day Streak Bonus',             150, 'XP bonus for maintaining a 30-day learning streak'),
  ('first_login',           'First Login',                     20,  'XP for first time logging in to the platform'),
  ('repeat_quiz',           'Repeat Quiz (Max)',               0,   'XP from re-doing a quiz (0 = no repeat XP)')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Streak Configuration (singleton row)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.streak_config (
  id                      INT4    PRIMARY KEY DEFAULT 1,
  reset_on_missed_days    BOOLEAN NOT NULL DEFAULT TRUE,
  grace_period_hours      INT4    NOT NULL DEFAULT 0,
  activities_counted      JSONB   NOT NULL DEFAULT '["complete_module","complete_quiz","quiz_arena"]'::jsonb,
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT streak_config_singleton CHECK (id = 1)
);

INSERT INTO public.streak_config (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Streak Milestones
-- ============================================================
CREATE TABLE IF NOT EXISTS public.streak_milestones (
  id            INT4    PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  days_required INT4    NOT NULL UNIQUE,
  xp_bonus      INT4    NOT NULL DEFAULT 0,
  label         TEXT    NOT NULL,
  badge_emoji   TEXT    NULLABLE
);

INSERT INTO public.streak_milestones (days_required, xp_bonus, label, badge_emoji) VALUES
  (7,  50,  '7-Day Streak',  '🔥'),
  (14, 80,  '2-Week Streak', '⚡'),
  (30, 150, '30-Day Streak', '💎'),
  (60, 300, '60-Day Streak', '👑')
ON CONFLICT (days_required) DO NOTHING;
-- ============================================================
-- Migration 005: Materials, Material Pages, Quiz Questions,
--                Quest Steps
-- ============================================================

-- ============================================================
-- Materials (Global curriculum modules)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.materials (
  id                  INT4        PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  unit                TEXT        NOT NULL,
  title               TEXT        NOT NULL,
  category_id         INT4        NULLABLE REFERENCES public.categories(id),
  level_id            INT4        NULLABLE REFERENCES public.levels(id),
  cefr_label          TEXT        NULLABLE,
  description         TEXT        NULLABLE,
  status              TEXT        NOT NULL DEFAULT 'active'     CHECK (status IN ('active', 'locked', 'completed')),
  publish_status      TEXT        NOT NULL DEFAULT 'published'  CHECK (publish_status IN ('draft', 'published')),
  xp_reward           INT4        NOT NULL DEFAULT 80,
  min_score           INT4        NOT NULL DEFAULT 60,
  time_limit_minutes  INT4        NULLABLE,
  max_attempts        INT4        NOT NULL DEFAULT 3,
  shuffle_questions   BOOLEAN     NOT NULL DEFAULT FALSE,
  show_explanations   BOOLEAN     NOT NULL DEFAULT TRUE,
  quiz_status         TEXT        NOT NULL DEFAULT 'active'     CHECK (quiz_status IN ('active', 'inactive')),
  sort_order          INT4        NOT NULL DEFAULT 0,
  created_by          UUID        NULLABLE REFERENCES public.profiles(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_materials_updated_at ON public.materials;
CREATE TRIGGER trg_materials_updated_at
  BEFORE UPDATE ON public.materials
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- Material Pages (Multi-page content per module)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.material_pages (
  id          INT4  PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  material_id INT4  NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  page_number INT4  NOT NULL DEFAULT 1,
  title       TEXT  NOT NULL,
  content     TEXT  NOT NULL,
  UNIQUE (material_id, page_number)
);

-- ============================================================
-- Quiz Questions (Multiple choice for module quizzes)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id                    INT4        PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  material_id           INT4        NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  question_text         TEXT        NOT NULL,
  options               JSONB       NOT NULL,  -- ["opt A", "opt B", "opt C", "opt D"]
  correct_answer_index  INT2        NOT NULL CHECK (correct_answer_index BETWEEN 0 AND 3),
  explanation           TEXT        NULLABLE,
  sort_order            INT4        NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Quest Steps (Gamified interactive steps, Duolingo-style)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quest_steps (
  id          TEXT  PRIMARY KEY,  -- e.g. 'u1_q1'
  material_id INT4  NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  step_number INT4  NOT NULL DEFAULT 1,
  type        TEXT  NOT NULL CHECK (type IN ('image_select', 'word_arrange', 'character_translate', 'multiple_choice')),
  tag         TEXT  NULLABLE,
  prompt      TEXT  NOT NULL,
  config      JSONB NOT NULL DEFAULT '{}'::jsonb
  -- config stores type-specific fields:
  -- image_select:         { audioText, options: [{id, label, phonetic, sub, emoji, isCorrect}] }
  -- word_arrange:         { targetWords, wordBank, targetMeaning }
  -- character_translate:  { speechText, phonetic, targetWords, wordBank }
  -- multiple_choice:      { sentence, options, answer, explanation }
);

-- ============================================================
-- Seed: Materials
-- ============================================================
INSERT INTO public.materials
  (unit, title, category_id, level_id, cefr_label, description, status, publish_status, xp_reward, min_score, max_attempts, shuffle_questions, show_explanations, quiz_status, sort_order)
VALUES
  ('Unit 1', 'Academic Vocabulary Mastery',       1, 1, 'Dasar - Menengah',  'Kenali dan kuasai kosakata akademik formal untuk perkuliahan dan publikasi.',                                    'completed', 'published', 80,  60, 3, FALSE, TRUE, 'active', 1),
  ('Unit 2', 'Past Perfect vs Past Simple',        2, 1, 'Menengah',          'Pahami urutan kronologis masa lampau untuk melaporkan hasil penelitian dan riwayat literatur.',                  'completed', 'published', 90,  60, 3, FALSE, TRUE, 'active', 2),
  ('Unit 3', 'Passive Voice in Research Paper',    2, 2, 'Menengah Atas',     'Kuasai konstruksi kalimat formal dan Passive Voice untuk penulisan metodologi jurnal ilmiah.',                  'active',    'published', 100, 70, 3, FALSE, TRUE, 'active', 3),
  ('Unit 4', 'Academic Reading Comprehension',     3, 2, 'Menengah Atas',     'Latih kemampuan membaca kritis (skimming, scanning, inferensi) pada artikel jurnal internasional.',             'locked',    'published', 110, 75, 3, FALSE, TRUE, 'active', 4),
  ('Unit 5', 'Abstract & Thesis Argumentation',   4, 3, 'Mahir',              'Sintesis argumen ilmiah, perumusan thesis statement, dan penyusunan abstrak berbahasa Inggris.',               'locked',    'published', 130, 75, 3, FALSE, TRUE, 'active', 5),
  ('Unit 6', 'Literature Synthesis & Paraphrasing',7,4, 'Menengah Atas',     'Teknik merangkum dan memparafrase rujukan ilmiah internasional tanpa terkena plagiarisme.',                    'active',    'published', 120, 75, 3, FALSE, TRUE, 'active', 6),
  ('Unit 7', 'Academic Presentation & Q&A',        6, 5, 'Mahir',             'Penyampaian presentasi seminar proposal dan teknik menjawab pertanyaan penguji dalam bahasa Inggris.',         'active',    'published', 140, 80, 3, FALSE, TRUE, 'active', 7),
  ('Unit 8', 'Journal Manuscript & Peer Review',   4, 6, 'Mahir',             'Penulisan naskah publikasi Scopus/SINTA dan penanganan tanggapan reviewer jurnal internasional.',              'active',    'published', 150, 80, 3, FALSE, TRUE, 'active', 8)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Seed: Material Pages
-- ============================================================
INSERT INTO public.material_pages (material_id, page_number, title, content) VALUES
  -- Unit 1: Academic Vocabulary
  (1, 1, 'Pengenalan Academic Vocabulary',
   E'Academic Vocabulary adalah kata-kata yang umum dipakai dalam literatur ilmiah, perkuliahan formal, dan penulisan karya tulis ilmiah.\n\n**Mengapa Penting?**\nPenguasaan kosakata akademis membedakan bahasa percakapan sehari-hari (*casual English*) dengan bahasa ilmiah (*formal English*). Contohnya kata **"analyze"** lebih tepat digunakan daripada sekadar **"look at"**.'),
  (1, 2, 'Contoh Kosakata Akademik Populer',
   E'| Kata Informal | Kata Akademik | Arti |\n|---|---|---|\n| find out | determine / discover | menemukan / menentukan |\n| get | obtain / acquire | memperoleh |\n| think about | consider / examine | mempertimbangkan / menelaah |\n| make sure | verify / substantiate | memastikan / memverifikasi |\n| show | demonstrate / indicate | menunjukkan / mendemonstrasikan |'),
  (1, 3, 'Ringkasan & Evaluasi',
   E'Kamu telah mempelajari kosakata formal dasar! Pastikan kamu mengingat perbedaan gaya bahasa casual dan akademis.'),

  -- Unit 2: Past Perfect
  (2, 1, 'Past Simple vs Past Perfect',
   E'Dalam penulisan abstrak dan metodologi, kita sering perlu menceritakan dua kejadian yang terjadi di masa lampau di mana satu kejadian mendahului yang lain.\n\n- **Past Simple**: Peristiwa lampau yang selesai di waktu tertentu. (*Subject + V2*)\n- **Past Perfect**: Peristiwa yang telah selesai **SEBELUM** peristiwa lampau lainnya terjadi. (*Subject + had + V3*)'),
  (2, 2, 'Contoh Kalimat Riset',
   E'Contoh:\n"The researcher **had prepared** the samples before the observation **began**."\n- Aksi 1 (terjadi lebih dulu): *had prepared* (Past Perfect)\n- Aksi 2 (terjadi kemudian): *began* (Past Simple)'),

  -- Unit 3: Passive Voice
  (3, 1, 'Fungsi Passive Voice dalam Karya Ilmiah',
   E'Dalam artikel ilmiah, fokus utama adalah pada **objek penelitian** dan **proses**, bukan pada siapa pelakunya. Oleh karena itu, *Passive Voice* sangat sering digunakan pada bagian *Methodology* dan *Results*.\n\n**Rumus Utama:**\n`Subject (Objek Aksi) + Be (is/am/are/was/were/been) + Past Participle (V3)`'),
  (3, 2, 'Perbandingan Active vs Passive',
   E'**Active:**\n"We collected fifty blood samples from the participants."\n\n**Passive (Lebih Akademis):**\n"Fifty blood samples **were collected** from the participants."'),
  (3, 3, 'Passive Voice dengan Modal Verbs',
   E'Format: `Modal + be + V3`\n\nContoh:\n- The error **can be minimized** by recalibrating the sensors.\n- Further studies **should be conducted** to confirm the hypothesis.')
ON CONFLICT DO NOTHING;

-- ============================================================
-- Seed: Quiz Questions
-- ============================================================
INSERT INTO public.quiz_questions (material_id, question_text, options, correct_answer_index, explanation, sort_order) VALUES
  -- Unit 1
  (1, 'Which word is the academic equivalent for "to find out"?',
   '["Determine", "Look up", "Guess", "Ignore"]'::jsonb, 0,
   '"Determine" adalah bentuk akademik formal untuk mencari tahu fakta.', 1),
  (1, 'What is the academic term for "to get"?',
   '["Grab", "Acquire", "Take away", "Catch"]'::jsonb, 1,
   '"Acquire" berarti mendapatkan atau memperoleh sesuatu secara formal.', 2),
  (1, 'Choose the most formal phrase for a research paper:',
   '["The results show...", "The data demonstrates...", "Look at the data...", "Data is cool..."]'::jsonb, 1,
   '"The data demonstrates" adalah standar kalimat akademik.', 3),

  -- Unit 2
  (2, 'By the time the professor arrived, the students _____ the experiment.',
   '["finished", "had finished", "have finished", "finishing"]'::jsonb, 1,
   'Karena selesai sebelum profesor tiba di masa lampau, gunakan "had finished".', 1),
  (2, 'She said she _____ the academic journal before submitting her thesis.',
   '["readed", "had read", "has read", "reading"]'::jsonb, 1,
   'Gunakan Past Perfect "had read" untuk aksi sebelum penyerahan skripsi.', 2),

  -- Unit 3
  (3, 'Convert to academic passive: "Researchers analyzed the survey data."',
   '["The survey data was analyzing by researchers.", "The survey data were analyzed by researchers.", "The survey data is analyzed.", "Researchers were analyzed data."]'::jsonb, 1,
   '"The survey data were analyzed" adalah bentuk pasif lampau yang tepat.', 1),
  (3, 'Complete the sentence: "The chemical mixture _____ before testing."',
   '["must heated", "must be heated", "must heating", "must be heat"]'::jsonb, 1,
   'Gunakan Modal + be + V3: "must be heated".', 2),
  (3, 'Why is passive voice preferred in scientific methodologies?',
   '["To make the text longer", "To highlight the action and object rather than the agent", "Because active voice is grammatically wrong", "To make it harder to read"]'::jsonb, 1,
   'Passive voice menekankan metodologi dan data penelitian daripada individu pelaku.', 3),

  -- Unit 4
  (4, 'What is the purpose of skimming an academic abstract?',
   '["To memorize data", "To quickly grasp the research core argument", "To edit spelling errors", "To count words"]'::jsonb, 1,
   'Skimming bertujuan menangkap ide utama secara kilat.', 1),

  -- Unit 5
  (5, 'What does the "R" in IMRAD stand for?',
   '["Review", "Research", "Results", "Rationale"]'::jsonb, 2,
   'IMRAD: Introduction, Methods, Results, and Discussion.', 1),

  -- Unit 6
  (6, 'What is effective paraphrasing?',
   '["Swapping words randomly", "Rewriting ideas in your own words while retaining original meaning", "Copying with quotation marks only", "Removing the citations"]'::jsonb, 1,
   'Parafrase efektif menyampaikan inti pesan dengan struktur kalimat dan diksi sendiri tanpa menghilangkan sitasi.', 1),

  -- Unit 7
  (7, 'Which phrase is best for transitioning to a new topic in a presentation?',
   '["Hey listen to this", "Turning our attention to the next finding", "Stop looking there", "Next slide please quickly"]'::jsonb, 1,
   '"Turning our attention to..." adalah signposting formal dalam seminar ilmiah.', 1),

  -- Unit 8
  (8, 'How should an author respond to a critical reviewer comment?',
   '["Argue aggressively", "Acknowledge the constructive feedback and explain the revision clearly", "Ignore the comment", "Withdraw the paper immediately"]'::jsonb, 1,
   'Penulis harus merespon secara sopan, menyambut saran konstruktif, dan menjelaskan perbaikan yang dilakukan.', 1)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Seed: Quest Steps
-- ============================================================
INSERT INTO public.quest_steps (id, material_id, step_number, type, tag, prompt, config) VALUES
  -- Unit 1 Quest Steps
  ('u1_q1', 1, 1, 'image_select', 'KOSAKATA BARU',
   'Mana yang merepresentasikan "Academic Journal"?',
   '{
     "audioText": "Academic Journal",
     "options": [
       {"id": 1, "label": "Academic Journal", "phonetic": "æk.əˈdem.ɪk ˈdʒɜː.nəl", "sub": "jurnal ilmiah", "emoji": "📚", "isCorrect": true},
       {"id": 2, "label": "Coffee Cup", "phonetic": "ˈkɒf.i kʌp", "sub": "cangkir kopi", "emoji": "☕", "isCorrect": false},
       {"id": 3, "label": "Water Bottle", "phonetic": "ˈwɔː.tər ˈbɒt.əl", "sub": "botol air", "emoji": "🧴", "isCorrect": false}
     ]
   }'::jsonb),

  ('u1_q2', 1, 2, 'character_translate', 'DENGARKAN & TERJEMAHKAN',
   'Tuliskan dalam bahasa Indonesia apa yang diucapkan Prof. Hootie:',
   '{
     "speechText": "The researcher obtains the data.",
     "phonetic": "ðə rɪˈsɜː.tʃər əbˈteɪnz ðə ˈdeɪ.tə",
     "targetWords": ["Peneliti", "memperoleh", "data", "tersebut"],
     "wordBank": ["Peneliti", "memperoleh", "data", "tersebut", "tidur", "di", "laboratorium", "menolak"]
   }'::jsonb),

  ('u1_q3', 1, 3, 'word_arrange', 'SUSUN KALIMAT FORMAL',
   'Susun kalimat bahasa Inggris formal:',
   '{
     "targetMeaning": "Data tersebut membuktikan hipotesis kami.",
     "targetWords": ["The", "data", "demonstrates", "our", "hypothesis"],
     "wordBank": ["The", "data", "demonstrates", "our", "hypothesis", "proves", "look", "is"]
   }'::jsonb),

  -- Unit 2 Quest Steps
  ('u2_q1', 2, 1, 'image_select', 'KOSAKATA BARU',
   'Mana yang merepresentasikan "Graduation Ceremony"?',
   '{
     "audioText": "Graduation Ceremony",
     "options": [
       {"id": 1, "label": "Graduation Ceremony", "phonetic": "ˌɡrædʒ.uˈeɪ.ʃən", "sub": "wisuda sarjana", "emoji": "🎓", "isCorrect": true},
       {"id": 2, "label": "Running Race", "phonetic": "ˈrʌn.ɪŋ reɪs", "sub": "lomba lari", "emoji": "🏃", "isCorrect": false},
       {"id": 3, "label": "Movie Theater", "phonetic": "ˈmuː.vi ˌθɪə.tər", "sub": "bioskop film", "emoji": "🍿", "isCorrect": false}
     ]
   }'::jsonb),

  ('u2_q2', 2, 2, 'word_arrange', 'URUTAN WAKTU LAMPAU',
   'Susun kalimat Past Perfect yang tepat:',
   '{
     "targetMeaning": "Profesor telah tiba sebelum eksperimen dimulai.",
     "targetWords": ["The", "professor", "had", "arrived", "before", "the", "experiment"],
     "wordBank": ["The", "professor", "had", "arrived", "before", "the", "experiment", "has", "arriving"]
   }'::jsonb),

  -- Unit 3 Quest Steps
  ('u3_q1', 3, 1, 'image_select', 'KOSAKATA BARU',
   'Mana yang menggambarkan "Laboratory Experiment"?',
   '{
     "audioText": "Laboratory Experiment",
     "options": [
       {"id": 1, "label": "Laboratory Experiment", "phonetic": "ləˈbɒr.ə.tər.i ɪkˈsper.ɪ.mənt", "sub": "eksperimen lab", "emoji": "🧪", "isCorrect": true},
       {"id": 2, "label": "Music Concert", "phonetic": "ˈmjuː.zɪk ˈkɒn.sət", "sub": "konser musik", "emoji": "🎸", "isCorrect": false},
       {"id": 3, "label": "Fast Food", "phonetic": "fɑːst fuːd", "sub": "makanan cepat saji", "emoji": "🍔", "isCorrect": false}
     ]
   }'::jsonb),

  ('u3_q2', 3, 2, 'character_translate', 'PASSIVE VOICE',
   'Dengarkan Prof. Hootie dan susun kalimat bahasa Indonesia yang tepat:',
   '{
     "speechText": "Fifty samples were collected by the team.",
     "phonetic": "ˈfɪf.ti ˈsɑːm.pəlz wɜː kəˈlek.tɪd baɪ ðə tiːm",
     "targetWords": ["Lima", "puluh", "sampel", "dikumpulkan", "oleh", "tim"],
     "wordBank": ["Lima", "puluh", "sampel", "dikumpulkan", "oleh", "tim", "mengumpulkan", "kemarin", "kami"]
   }'::jsonb),

  ('u3_q3', 3, 3, 'word_arrange', 'SUSUN KALIMAT AKADEMIS',
   'Susun kalimat Passive Voice yang benar dalam bahasa Inggris:',
   '{
     "targetMeaning": "Hasil penelitian ini telah dianalisis secara mendalam.",
     "targetWords": ["The", "results", "were", "analyzed", "thoroughly"],
     "wordBank": ["The", "results", "were", "analyzed", "thoroughly", "was", "analyzing", "they"]
   }'::jsonb),

  ('u3_q4', 3, 4, 'multiple_choice', 'KAIDAH TATA BAHASA',
   'Lengkapi kalimat pasif akademik ini:',
   '{
     "sentence": "The formal methodology _____ approved by the ethical board.",
     "options": ["has been", "have were", "is being was", "did"],
     "answer": 0,
     "explanation": "Gunakan \"has been approved\" (Present Perfect Passive) untuk subjek tunggal \"The methodology\"."
   }'::jsonb)

ON CONFLICT (id) DO NOTHING;
-- ============================================================
-- Migration 006: Learning Paths & Path Items
-- ============================================================

CREATE TABLE IF NOT EXISTS public.learning_paths (
  id          INT4        PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  level_id    INT4        NOT NULL UNIQUE REFERENCES public.levels(id),
  name        TEXT        NOT NULL,
  description TEXT        NULLABLE,
  status      TEXT        NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_learning_paths_updated_at ON public.learning_paths;
CREATE TRIGGER trg_learning_paths_updated_at
  BEFORE UPDATE ON public.learning_paths
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE IF NOT EXISTS public.learning_path_items (
  id               INT4 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  learning_path_id INT4 NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
  material_id      INT4 NOT NULL REFERENCES public.materials(id),
  sort_order       INT4 NOT NULL DEFAULT 0,
  UNIQUE (learning_path_id, material_id)
);

-- ============================================================
-- Seed: Learning Paths
-- ============================================================
INSERT INTO public.learning_paths (level_id, name, description, status) VALUES
  (1, 'Level 1: Beginner English Path',          'Fondasi kosakata dasar dan pemahaman kalimat untuk mahasiswa baru.',             'active'),
  (2, 'Level 2: English Learner Path',            'Konstruksi kalimat pasif ilmiah dan teknik membaca teks akademik.',               'active'),
  (3, 'Level 3: English Explorer Path',           'Penulisan abstrak dan argumentasi skripsi dalam bahasa Inggris.',                 'active'),
  (4, 'Level 4: Intermediate Proficiency Path',   'Penyusunan sintesis literatur ilmiah dan presentasi akademik.',                   'active'),
  (5, 'Level 5: Advanced Learner Path',           'Persiapan simulasi EELS / TOEFL dan penulisan publikasi jurnal.',                 'active'),
  (6, 'Level 6: English Master Path',             'Penguasaan wacana akademik tingkat tinggi dan debat ilmiah.',                     'active')
ON CONFLICT (level_id) DO NOTHING;

-- Seed: Learning Path Items (material_id references the order inserted above: 1-8)
INSERT INTO public.learning_path_items (learning_path_id, material_id, sort_order) VALUES
  (1, 1, 1),  -- Level 1: Academic Vocabulary
  (1, 2, 2),  -- Level 1: Past Perfect vs Past Simple
  (2, 3, 1),  -- Level 2: Passive Voice
  (2, 4, 2),  -- Level 2: Academic Reading
  (3, 5, 1),  -- Level 3: Abstract & Thesis
  (4, 6, 1),  -- Level 4: Literature Synthesis
  (5, 7, 1),  -- Level 5: Academic Presentation
  (6, 8, 1)   -- Level 6: Journal Manuscript
ON CONFLICT DO NOTHING;
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
-- ============================================================
-- Migration 009: Boss Battles (EELS Simulation)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.boss_battles (
  id                  INT4        PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  boss_name           TEXT        NOT NULL,
  title               TEXT        NOT NULL,
  cefr_phase          TEXT        NULLABLE,
  max_hp              INT4        NOT NULL DEFAULT 10000,
  damage_per_hit      INT4        NOT NULL DEFAULT 350,
  time_limit_seconds  INT4        NULLABLE,
  status              TEXT        NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.boss_battle_questions (
  id                    INT4  PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  boss_battle_id        INT4  NOT NULL REFERENCES public.boss_battles(id) ON DELETE CASCADE,
  question_type         TEXT  NOT NULL CHECK (question_type IN ('Structure', 'Written Expression', 'Listening', 'Reading')),
  question_text         TEXT  NOT NULL,
  options               JSONB NOT NULL,
  correct_answer_index  INT2  NOT NULL CHECK (correct_answer_index BETWEEN 0 AND 3),
  explanation           TEXT  NULLABLE,
  sort_order            INT4  NOT NULL DEFAULT 0
);

-- ============================================================
-- Seed: Boss Battle
-- ============================================================
INSERT INTO public.boss_battles (boss_name, title, cefr_phase, max_hp, damage_per_hit, time_limit_seconds, status)
VALUES
  ('Grammar & Listening Challenge',
   'Simulasi EELS: Section 2 (Structure & Written Expression)',
   'Fase Menengah Atas',
   10000, 350, 2535, 'active')
ON CONFLICT DO NOTHING;

-- Seed: Boss Battle Questions (boss_battle_id = 1)
INSERT INTO public.boss_battle_questions (boss_battle_id, question_type, question_text, options, correct_answer_index, explanation, sort_order)
VALUES
  (1, 'Structure',
   'Not only _____ the research findings, but she also presented a compelling alternative model.',
   '["she challenged", "did she challenge", "she was challenging", "has she been challenge"]'::jsonb,
   1,
   'Negative inversion: setelah frasa "Not only" di awal klausa, gunakan inversi subjek-kata kerja bantu (auxiliary did + subject she + V1 challenge).',
   1),

  (1, 'Written Expression',
   'The committee decided to postpone the academic conference because of the delegates (A) had not yet (B) received their (C) travel authorizations (D).',
   '["because of", "had not yet", "received their", "authorizations"]'::jsonb,
   0,
   'Kesalahan ada pada (A) "because of". Karena diikuti oleh klausa lengkap (subject + verb: "the delegates had not yet received..."), kata yang tepat adalah konjungsi "because", bukan preposisi "because of".',
   2),

  (1, 'Structure',
   'Were the hypothesis _____ valid, the team would proceed with clinical trials immediately.',
   '["proven", "to be proven", "proved to", "proving"]'::jsonb,
   1,
   'Inverted Conditional Type 2: "Were the hypothesis to be proven valid..." menggantikan "If the hypothesis were to be proven valid...".',
   3)

ON CONFLICT DO NOTHING;
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
