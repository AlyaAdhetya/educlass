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
