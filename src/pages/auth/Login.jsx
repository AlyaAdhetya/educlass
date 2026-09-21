import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  BookOpen, 
  GraduationCap, 
  ShieldCheck, 
  Flame, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Zap, 
  School,
  FileCheck,
  TrendingUp
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('budi.santoso@student.kampus.ac.id');
  const [password, setPassword] = useState('••••••••');
  const [role, setRole] = useState('mahasiswa');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isNewStudent, setIsNewStudent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const roleConfigs = {
    mahasiswa: {
      title: 'Mahasiswa',
      subtitle: 'Belajar, latihan soal, & kumpulkan XP',
      icon: GraduationCap,
      color: 'blue',
      defaultEmail: 'budi.santoso@student.kampus.ac.id',
      badgeText: 'Portal Pembelajar',
      placeholder: 'nim@student.kampus.ac.id'
    },
    dosen: {
      title: 'Dosen / Pengajar',
      subtitle: 'Kelola kelas, tugas, & pantau progres',
      icon: School,
      color: 'indigo',
      defaultEmail: 'dr.hendra@kampus.ac.id',
      badgeText: 'Portal Instruktur',
      placeholder: 'nip.nama@kampus.ac.id'
    },
    admin: {
      title: 'Super Admin',
      subtitle: 'Manajemen pengguna & sistem akademik',
      icon: ShieldCheck,
      color: 'amber',
      defaultEmail: 'admin@educlass.ac.id',
      badgeText: 'Administrator',
      placeholder: 'admin@educlass.ac.id'
    }
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setEmail(roleConfigs[newRole].defaultEmail);
  };

  const handleQuickDemo = (demoRole, isNew = false) => {
    setRole(demoRole);
    setEmail(roleConfigs[demoRole].defaultEmail);
    setPassword('demo12345');
    setIsNewStudent(isNew);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      // Mock user authentication
      const hasTakenTest = role === 'mahasiswa' ? !isNewStudent : true;
      const userName = 
        role === 'mahasiswa' 
          ? (isNewStudent ? 'Maba Baru' : 'Budi Santoso') 
          : role === 'dosen' 
            ? 'Dr. Hendra, M.Hum.' 
            : 'Super Administrator';

      setAuth({ id: '1', email, name: userName }, role, hasTakenTest);
      setIsLoading(false);

      if (role === 'mahasiswa') {
        if (!hasTakenTest) {
          navigate('/placement-test');
        } else {
          navigate('/dashboard');
        }
      } else if (role === 'dosen') {
        navigate('/dosen');
      } else {
        navigate('/admin');
      }
    }, 450);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* SISI KIRI: Branding Akademik & Showcase Gamifikasi (Desktop Showcase) */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-[52%] flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
        
        {/* Background Ambient Glow & Grid Lines */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

        {/* Top Section: Logo & Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 ring-1 ring-white/20">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                EduClass<span className="text-blue-400">.</span>
              </span>
              <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">Academic English Hub</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/10 text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Standar CEFR & Gamifikasi
          </div>
        </div>

        {/* Middle Section: Hero Value Proposition & Interactive Gamification Showcase */}
        <div className="relative z-10 my-auto py-8 space-y-8 max-w-xl">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-300">
              <Award className="w-4 h-4 text-amber-400" />
              Pembelajaran Berbasis Kemampuan Nyata
            </div>
            <h1 className="text-3xl xl:text-4xl font-extrabold leading-tight tracking-tight text-white">
              Kuasai Bahasa Inggris Akademik dengan Alur yang Menyenangkan.
            </h1>
            <p className="text-slate-300 text-sm xl:text-base leading-relaxed">
              Platform blended learning terintegrasi kampus yang memadukan kurikulum berjenjang CEFR, persiapan TOEFL/IELTS, serta motivasi gamifikasi harian.
            </p>
          </div>

          {/* Gamification Live Preview Cards (Asik & Interaktif) */}
          <div className="grid grid-cols-2 gap-4">
            {/* Card 1: Streak */}
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all hover:bg-white/[0.07] group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center ring-1 ring-orange-500/30">
                  <Flame className="w-5 h-5 text-orange-400 fill-orange-400/30 animate-pulse" />
                </div>
                <span className="text-xs font-bold text-orange-300 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                  Aktif
                </span>
              </div>
              <div className="text-2xl font-extrabold text-white tracking-tight group-hover:text-orange-300 transition-colors">
                14 Hari
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Daily Study Streak! 🔥</div>
            </div>

            {/* Card 2: CEFR Level */}
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all hover:bg-white/[0.07] group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center ring-1 ring-emerald-500/30">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-xs font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  CEFR B2
                </span>
              </div>
              <div className="text-2xl font-extrabold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                2,450 XP
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Level Upper-Intermediate</div>
            </div>
          </div>

          {/* Academic Features checklist */}
          <div className="space-y-2.5 pt-2 text-sm text-slate-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span><strong>Placement Test Adaptif</strong> untuk penentuan level yang tepat dan objektif.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span><strong>Terkoneksi Ruang Kelas Dosen</strong> dengan sistem rekap tugas & penilaian otomatis.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span><strong>Simulasi TOEFL/IELTS</strong> terukur untuk kesiapan kelulusan dan karir global.</span>
            </div>
          </div>
        </div>

        {/* Bottom Section: Formal Footer Note */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-slate-400" />
            <span>EduClass Academic LMS Engine • Terhubung SIAD</span>
          </div>
          <span className="text-slate-500">v1.2 Standard</span>
        </div>
      </div>

      {/* SISI KANAN: Formulir Login Modern & Interaktif */}
      <div className="w-full lg:w-1/2 xl:w-[48%] flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 xl:p-16 relative">
        
        {/* Subtle decorative background for right pane */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md space-y-6 relative z-10">
          
          {/* Mobile Header (Shown on mobile only) */}
          <div className="lg:hidden flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                EduClass<span className="text-blue-600">.</span>
              </span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Kampus Portal
            </span>
          </div>

          {/* Form Header */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600">
              <Zap className="w-3.5 h-3.5" />
              Akses Portal Akademik
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Selamat Datang Kembali 👋
            </h2>
            <p className="text-sm text-slate-500">
              Pilih peran Anda dan masuk untuk melanjutkan aktivitas perkuliahan.
            </p>
          </div>

          {/* Role Selector Tabs (Modern Segmented Picker) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
              Masuk Sebagai Peran:
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80">
              {Object.entries(roleConfigs).map(([key, config]) => {
                const IconComponent = config.icon;
                const isSelected = role === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleRoleChange(key)}
                    className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-white text-blue-600 shadow-sm border border-slate-200 font-bold scale-[1.02]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 mb-1 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} />
                    <span className="truncate">{config.title.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Demo Switcher (Sangat Membantu Sidang & Presentasi!) */}
          <div className="p-3 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 rounded-xl border border-blue-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Isi Cepat Akun Demo (1-Klik):</span>
              </div>
              <span className="text-[10px] text-blue-600 bg-blue-100/60 font-medium px-1.5 py-0.5 rounded">
                Untuk Presentasi
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemo('mahasiswa', false)}
                className="text-[11px] px-2.5 py-1 bg-white hover:bg-blue-600 hover:text-white text-slate-700 font-medium rounded-lg border border-slate-200 shadow-xs transition-colors cursor-pointer"
              >
                🎓 Mhs Baru (Tes)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('mahasiswa', true)}
                className="text-[11px] px-2.5 py-1 bg-white hover:bg-blue-600 hover:text-white text-slate-700 font-medium rounded-lg border border-slate-200 shadow-xs transition-colors cursor-pointer"
              >
                🎓 Mhs Aktif (Dashboard)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('dosen', false)}
                className="text-[11px] px-2.5 py-1 bg-white hover:bg-indigo-600 hover:text-white text-slate-700 font-medium rounded-lg border border-slate-200 shadow-xs transition-colors cursor-pointer"
              >
                👨‍🏫 Dosen
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin', false)}
                className="text-[11px] px-2.5 py-1 bg-white hover:bg-amber-600 hover:text-white text-slate-700 font-medium rounded-lg border border-slate-200 shadow-xs transition-colors cursor-pointer"
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          {/* Main Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email Input */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-slate-700">
                Alamat Email Kampus / Akun
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={roleConfigs[role].placeholder}
                  className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>

            {/* Password Input with Show/Hide Toggle */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold text-slate-700">
                  Kata Sandi
                </label>
                <button
                  type="button"
                  onClick={() => alert('Fitur reset kata sandi: Silakan hubungi Unit Akademik Kampus atau gunakan fasilitas SSO.')}
                  className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-medium cursor-pointer"
                >
                  Lupa sandi?
                </button>
              </div>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi Anda"
                  className="block w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Student Placement Toggle */}
            <div className="flex flex-col gap-2 pt-1 text-xs">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 transition-colors cursor-pointer"
                  />
                  <span>Ingat sesi di perangkat ini</span>
                </label>

                {role === 'mahasiswa' && (
                  <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-600 hover:text-blue-600 font-medium">
                    <input
                      type="checkbox"
                      checked={isNewStudent}
                      onChange={(e) => setIsNewStudent(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <span>Alur Mahasiswa Baru (Placement Test)</span>
                  </label>
                )}
              </div>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60 disabled:pointer-events-none active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memverifikasi Kredensial...</span>
                </>
              ) : (
                <>
                  <span>Masuk sebagai {roleConfigs[role].title}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer & Registration Link */}
          <div className="pt-2 text-center text-xs text-slate-500 space-y-3">
            <p>
              Belum memiliki akun mahasiswa atau dosen?{' '}
              <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                Daftar akun baru di sini
              </Link>
            </p>

            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
              <Lock className="w-3 h-3 text-emerald-500" />
              <span>Koneksi terenkripsi SSL 256-bit standar akademik</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
