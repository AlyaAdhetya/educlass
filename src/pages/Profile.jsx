import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { UserCircle, Camera, Save, CheckCircle2, Loader2, KeyRound } from 'lucide-react';

export default function Profile() {
  const { user, setAuth, session } = useAuthStore();
  const [formData, setFormData] = useState({
    name:  user?.name  || '',
    email: user?.email || '',
    nim:   user?.nim   || '',
    bio:   user?.bio   || '',
  });
  const [newPassword, setNewPassword]   = useState('');
  const [saving, setSaving]             = useState(false);
  const [toast, setToast]               = useState(null); // { msg, type: 'success'|'error' }

  useEffect(() => {
    if (user) {
      setFormData({
        name:  user.name  || '',
        email: user.email || '',
        nim:   user.nim   || '',
        bio:   user.bio   || '',
      });
    }
  }, [user]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    try {
      // Update profile table
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update({ name: formData.name, nim: formData.nim || null, bio: formData.bio || null })
        .eq('id', user.id)
        .select()
        .single();
      if (error) throw error;

      // Update password if provided
      if (newPassword.trim().length >= 6) {
        const { error: pwErr } = await supabase.auth.updateUser({ password: newPassword });
        if (pwErr) throw pwErr;
        setNewPassword('');
      }

      // Refresh auth state
      if (updatedProfile) {
        setAuth(updatedProfile, updatedProfile.role, session);
      }
      showToast('Profil berhasil diperbarui!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const initials = formData.name
    ? formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 bg-slate-50 min-h-screen">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl text-xs font-bold text-white shadow-lg flex items-center gap-2 transition-all ${
          toast.type === 'error' ? 'bg-rose-600' : 'bg-emerald-600'
        }`}>
          <CheckCircle2 className="w-4 h-4" />
          {toast.msg}
        </div>
      )}

      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Profil Pengguna</h1>
        <p className="text-slate-500 mt-2">Kelola informasi akun dan biodata Anda.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Avatar Card */}
        <div className="md:col-span-1 bg-white rounded-3xl border border-slate-100 shadow-xs p-6 flex flex-col items-center text-center gap-3">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-3xl font-black shadow-lg select-none">
            {initials}
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">{formData.name || 'User'}</h2>
            <p className="text-sm text-slate-500 capitalize mt-0.5">{user?.role || 'mahasiswa'}</p>
            {user?.nim && (
              <p className="text-xs font-mono font-bold text-indigo-600 mt-1 bg-indigo-50 px-2 py-0.5 rounded-lg">NIM: {user.nim}</p>
            )}
          </div>
          <div className="w-full pt-3 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Email</p>
            <p className="text-xs text-slate-600 font-medium mt-0.5 break-all">{user?.email}</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-xs p-6 space-y-4">
          <h3 className="font-black text-slate-900">Pengaturan Biodata</h3>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-600">Nama Lengkap</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nama lengkap kamu"
            />
          </div>

          {user?.role === 'mahasiswa' && (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-600">NIM (Nomor Induk Mahasiswa)</label>
              <input
                type="text"
                value={formData.nim}
                onChange={e => setFormData({ ...formData, nim: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Contoh: 2401099"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-600">Email</label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
            />
            <p className="text-[10px] text-slate-400">Email tidak dapat diubah</p>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-600">Biodata Singkat</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Ceritakan sedikit tentang dirimu..."
            />
          </div>

          {/* Password Reset */}
          <div className="pt-3 border-t border-slate-100 space-y-1">
            <label className="block text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" /> Ganti Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Kosongkan jika tidak ingin mengubah (min. 6 karakter)"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
