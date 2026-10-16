import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useAuthStore = create((set, get) => ({
  user: null,       // profile object from DB: { id, email, name, nim, role, ... }
  role: null,       // 'mahasiswa' | 'admin'
  session: null,    // Supabase session object
  loading: true,    // true while checking initial session

  // ── Set auth state (used after login / session restore) ──
  setAuth: (user, role, session = null) => set({ user, role, session }),

  // ── Logout ──
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, role: null, session: null });
  },

  // ── Initialize: called once on app start ──
  // Checks if there is an existing session and loads profile
  initialize: async () => {
    set({ loading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await get()._loadProfile(session.user.id, session);
      } else {
        set({ user: null, role: null, session: null, loading: false });
      }
    } catch {
      set({ user: null, role: null, session: null, loading: false });
    }
  },

  // ── Internal: load profile from DB ──
  _loadProfile: async (userId, session) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      set({ user: null, role: null, session: null, loading: false });
      return false;
    }

    set({
      user: profile,
      role: profile.role,
      session,
      loading: false,
    });
    return true;
  },

  // ── Login with email + password ──
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error };

    const profileLoaded = await get()._loadProfile(data.user.id, data.session);
    if (!profileLoaded) {
      return { 
        error: new Error('Akun terautentikasi tetapi profil tidak ditemukan di database (tabel profiles). Silakan jalankan script SQL migrasi/setup di Supabase SQL Editor.') 
      };
    }
    return { error: null };
  },

  // ── Register new user ──
  register: async ({ email, password, name, nim, role = 'mahasiswa' }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, nim, role },
      },
    });
    if (error) return { error };

    // Profile will be created by the DB trigger (handle_new_user)
    // Load profile if session exists (email confirmation may be disabled)
    if (data.session) {
      await get()._loadProfile(data.user.id, data.session);
    }
    return { error: null, needsConfirmation: !data.session };
  },
}));
