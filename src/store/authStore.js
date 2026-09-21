import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null, // will hold user object (id, email)
  role: null, // 'mahasiswa', 'dosen', 'admin'
  hasTakenTest: false,
  setAuth: (user, role, hasTakenTest = false) => set({ user, role, hasTakenTest }),
  setHasTakenTest: (status) => set({ hasTakenTest: status }),
  logout: () => set({ user: null, role: null, hasTakenTest: false }),
}));
