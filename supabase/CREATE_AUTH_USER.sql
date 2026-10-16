-- ============================================================
-- CREATE ADMIN USER DIRECTLY - via Supabase Auth
-- Jalankan di Supabase SQL Editor
-- ============================================================
-- Catatan: Cara terbaik adalah via Supabase Dashboard:
-- Authentication > Users > Add User
-- ATAU gunakan SQL di bawah ini:
-- ============================================================

-- OPSI A: Gunakan fungsi Supabase bawaan untuk buat user admin
-- (Ganti password sesuai kebutuhan)
SELECT auth.uid(); -- cek apakah session aktif

-- Buat user baru langsung di auth.users dengan password terenkripsi
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  role,
  aud
)
SELECT
  gen_random_uuid(),                          -- id baru
  '00000000-0000-0000-0000-000000000000',     -- instance_id default Supabase
  'arutari640@gmail.com',                     -- email
  crypt('EduAdmin123!', gen_salt('bf')),      -- password (ganti jika perlu)
  NOW(),                                      -- sudah terverifikasi
  NOW(),
  NOW(),
  '{"name": "Admin EduClass", "role": "admin"}'::jsonb,
  'authenticated',
  'authenticated'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'arutari640@gmail.com'
);

-- Verifikasi user berhasil dibuat
SELECT id, email, created_at, confirmed_at
FROM auth.users
WHERE email = 'arutari640@gmail.com';
