import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null, // will hold user object (id, email, name)
  role: null, // 'mahasiswa' | 'admin'
  setAuth: (user, role) => set({ user, role }),
  logout: () => set({ user: null, role: null }),
}));
