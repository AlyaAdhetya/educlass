-- ============================================================
-- DIAGNOSTIC: Cek semua user di auth.users
-- Jalankan ini dulu untuk melihat email yang terdaftar
-- ============================================================

SELECT
  id,
  email,
  created_at,
  confirmed_at,
  raw_user_meta_data->>'name' AS name,
  raw_user_meta_data->>'nim'  AS nim,
  raw_user_meta_data->>'role' AS role_meta
FROM auth.users
ORDER BY created_at DESC;
