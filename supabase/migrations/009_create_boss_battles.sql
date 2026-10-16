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
