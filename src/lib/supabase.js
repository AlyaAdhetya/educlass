import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// ============================================================
// Auth Helpers
// ============================================================

export const signUp = async ({ email, password, name, nim, role = 'mahasiswa' }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, nim, role },
    },
  })
  return { data, error }
}

export const signIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession()
  return { data, error }
}

// ============================================================
// Profile Helpers
// ============================================================

export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, levels(*)')
    .eq('id', userId)
    .single()
  return { data, error }
}

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  return { data, error }
}

// ============================================================
// User Stats Helpers
// ============================================================

export const getUserStats = async (userId) => {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single()
  return { data, error }
}

export const updateUserStats = async (userId, updates) => {
  const { data, error } = await supabase
    .from('user_stats')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()
  return { data, error }
}

// ============================================================
// Materials Helpers
// ============================================================

export const getMaterials = async () => {
  const { data, error } = await supabase
    .from('material_with_category')
    .select('*')
    .eq('publish_status', 'published')
    .order('sort_order', { ascending: true })
  return { data, error }
}

export const getMaterialById = async (id) => {
  const { data: material, error: materialError } = await supabase
    .from('material_with_category')
    .select('*')
    .eq('id', id)
    .single()

  if (materialError) return { data: null, error: materialError }

  const { data: pages } = await supabase
    .from('material_pages')
    .select('*')
    .eq('material_id', id)
    .order('page_number', { ascending: true })

  const { data: quiz } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('material_id', id)
    .order('sort_order', { ascending: true })

  const { data: questSteps } = await supabase
    .from('quest_steps')
    .select('*')
    .eq('material_id', id)
    .order('step_number', { ascending: true })

  return {
    data: { ...material, pages: pages || [], quiz: quiz || [], questSteps: questSteps || [] },
    error: null,
  }
}

// ============================================================
// Progress Helpers
// ============================================================

export const getMaterialProgress = async (userId) => {
  const { data, error } = await supabase
    .from('material_progress')
    .select('*')
    .eq('user_id', userId)
  return { data, error }
}

export const upsertMaterialProgress = async (userId, materialId, updates) => {
  const { data, error } = await supabase
    .from('material_progress')
    .upsert({ user_id: userId, material_id: materialId, ...updates }, { onConflict: 'user_id,material_id' })
    .select()
    .single()
  return { data, error }
}

// ============================================================
// Quiz Attempt Helpers
// ============================================================

export const saveQuizAttempt = async (userId, materialId, { score, passed, answers, timeTakenSeconds }) => {
  // Get current attempt count
  const { count } = await supabase
    .from('quiz_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('material_id', materialId)

  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: userId,
      material_id: materialId,
      attempt_number: (count || 0) + 1,
      score,
      passed,
      answers,
      time_taken_seconds: timeTakenSeconds,
    })
    .select()
    .single()
  return { data, error }
}

// ============================================================
// Activity Log Helpers
// ============================================================

export const logActivity = async (userId, { activityType, detail, materialId, score, xpEarned }) => {
  const { data, error } = await supabase
    .from('activity_log')
    .insert({
      user_id: userId,
      activity_type: activityType,
      detail,
      material_id: materialId || null,
      score: score || null,
      xp_earned: xpEarned || 0,
    })
    .select()
    .single()
  return { data, error }
}

export const getActivityLog = async (userId, limit = 20) => {
  const { data, error } = await supabase
    .from('activity_log')
    .select('*, materials(title, unit)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return { data, error }
}

// ============================================================
// Leaderboard Helper
// ============================================================

export const getLeaderboard = async (limit = 20) => {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('rank', { ascending: true })
    .limit(limit)
  return { data, error }
}

// ============================================================
// Gamification Helpers
// ============================================================

export const getUserAchievements = async (userId) => {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*, achievements(*)')
    .eq('user_id', userId)
  return { data, error }
}

export const getUserInventory = async (userId) => {
  const { data, error } = await supabase
    .from('user_inventory')
    .select('*, rewards(*)')
    .eq('user_id', userId)
  return { data, error }
}

export const getDailyQuestProgress = async (userId) => {
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('daily_quest_progress')
    .select('*, daily_quests(*)')
    .eq('user_id', userId)
    .eq('quest_date', today)
  return { data, error }
}

// ============================================================
// Admin Helpers
// ============================================================

export const adminGetAllStudents = async () => {
  const { data, error } = await supabase
    .from('admin_student_overview')
    .select('*')
    .order('total_xp', { ascending: false })
  return { data, error }
}

export const adminGetActivityLog = async (limit = 50) => {
  const { data, error } = await supabase
    .from('activity_log')
    .select('*, profiles(name, nim)')
    .order('created_at', { ascending: false })
    .limit(limit)
  return { data, error }
}

export const adminGetQuizAttempts = async (limit = 100) => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*, profiles(name, nim), materials(title, unit)')
    .order('completed_at', { ascending: false })
    .limit(limit)
  return { data, error }
}
