import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  GraduationCap, Mail, Lock, User, CreditCard, Eye, EyeOff,
  ArrowRight, Shield, CheckCircle2, Sparkles, ShieldCheck
} from 'lucide-react';
import EduLogo from '../../components/mascot/EduLogo';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', nim: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();
  const { register } = useAuthStore();

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (form.password.length < 6) {
      setErrorMsg('Password minimal 6 karakter.');
      return;
    }
    if (form.password !== form.confirm) {
      setErrorMsg('Konfirmasi password tidak cocok.');
      return;
    }

    setIsLoading(true);
    const { error, needsConfirmation } = await register({
      email: form.email,
      password: form.password,
      name: form.name,
      nim: form.nim,
      role: 'mahasiswa',
    });
    setIsLoading(false);

    if (error) {
      setErrorMsg(
        error.message?.includes('already registered')
          ? 'Email ini sudah terdaftar. Silakan login.'
          : error.message || 'Registrasi gagal. Silakan coba lagi.'
      );
      return;
    }

    if (needsConfirmation) {
      setSuccessMsg('Registrasi berhasil! Cek email kamu untuk konfirmasi akun.');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white text-slate-900 font-sans">

      {/* Left: Branding */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-10 xl:p-14 overflow-hidden bg-gradient-to-br from-blue-50/90 via-indigo-50/60 to-sky-100/50 border-r border-slate-200/80">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <EduLogo size="md" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-blue-200 text-blue-700 text-xs font-bold shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            Official EELS Prep
          </div>
        </div>

        <div className="relative z-10 my-auto py-6 flex flex-col items-center text-center max-w-lg mx-auto">
          <div className="relative mb-5 bg-white px-5 py-3 rounded-2xl border border-blue-100 shadow-md max-w-md">
            <p className="text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-500" />
              Start your English journey today — for free!
            </p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-blue-100 transform rotate-45" />
          </div>

          <div className="relative w-56 h-56 xl:w-64 xl:h-64 my-2 flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-2xl -z-10" />
            <img
              src="/mascot.jpg"
              alt="Hootie the Scholar Owl"
              className="w-full h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500 rounded-3xl"
            />
          </div>

          <h2 className="text-lg xl:text-xl font-extrabold text-blue-900 mt-4">
            Join Thousands of English Learners
          </h2>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-md">
            Gamified English learning with XP, streaks, and boss battles — built for university students.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3 w-full max-w-xs">
            {[['🎯', 'Adaptive Quizzes'], ['🔥', 'Daily Streaks'], ['🏆', 'Leaderboard']].map(([icon, label]) => (
              <div key={label} className="flex flex-col items-center gap-1 bg-white/70 rounded-xl p-3 border border-blue-100">
                <span className="text-lg">{icon}</span>
                <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Register Form */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 overflow-y-auto">
        <div className="flex items-center justify-end gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Normal
          </span>
        </div>

        <div className="max-w-md w-full mx-auto my-auto py-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Create your account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Register as a student and start learning English today.
            </p>
          </div>

          {/* Role badge — always mahasiswa for self-register */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl">
            <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs font-bold text-blue-700">Registering as: Mahasiswa (Student)</span>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap Anda"
                  value={form.name}
                  onChange={set('name')}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Email Kampus / EduClass</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="nama@kampus.ac.id"
                  value={form.email}
                  onChange={set('email')}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800"
                />
              </div>
            </div>

            {/* NIM */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                NIM <span className="text-slate-400 font-normal">(Opsional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Nomor Induk Mahasiswa"
                  value={form.nim}
                  onChange={set('nim')}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Minimal 6 karakter"
                  value={form.password}
                  onChange={set('password')}
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Konfirmasi Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Ulangi password"
                  value={form.confirm}
                  onChange={set('confirm')}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 tracking-wider"
                />
              </div>
            </div>

            {/* Error / Success Messages */}
            {errorMsg && (
              <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 sm:py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold text-xs sm:text-sm rounded-xl border-b-2 border-blue-800 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div>
            Sudah punya akun?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Login di sini
            </Link>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            Standard Encryption Protocol
          </div>
        </div>
      </div>
    </div>
  );
}
