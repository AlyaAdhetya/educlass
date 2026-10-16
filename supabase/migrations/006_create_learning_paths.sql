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
