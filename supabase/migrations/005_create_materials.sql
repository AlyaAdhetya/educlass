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
