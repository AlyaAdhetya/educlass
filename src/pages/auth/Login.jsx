import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  GraduationCap, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  BookOpen,
  Flame,
  Users,
  Shield,
  Building2,
  Sparkles
} from 'lucide-react';
import EduLogo from '../../components/mascot/EduLogo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const { login } = useAuthStore();


  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const { error } = await login(email, password);

    setIsLoading(false);
    if (error) {
      setErrorMsg(
        error.message?.includes('Invalid login')
          ? 'Email atau password salah. Silakan coba lagi.'
          : error.message || 'Login gagal. Silakan coba lagi.'
      );
      return;
    }

    // Navigate based on role stored in DB (loaded by authStore)
    const { role: dbRole } = useAuthStore.getState();
    if (dbRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* SISI KIRI: Showcase Maskot & Branding Akademik (Sesuai Desain Image 3) */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-[50%] flex-col justify-between p-10 xl:p-14 overflow-hidden bg-gradient-to-br from-blue-50/90 via-indigo-50/60 to-sky-100/50 border-r border-slate-200/80">
        
        {/* Soft Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header: Logo & Official Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <EduLogo size="md" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-blue-200 text-blue-700 text-xs font-bold shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            Official EELS Prep
          </div>
        </div>

        {/* Center: Speech Bubble, Mascot Image, & Headlines */}
        <div className="relative z-10 my-auto py-6 flex flex-col items-center text-center max-w-lg mx-auto">
          {/* Floating Speech Bubble */}
          <div className="relative mb-5 bg-white px-5 py-3 rounded-2xl border border-blue-100 shadow-md max-w-md animate-fade-in">
            <p className="text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5">
              Hello Future Scholar! Ready to conquer your EELS target score today?
            </p>
            {/* Bubble arrow */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-blue-100 transform rotate-45" />
          </div>

          {/* 3D Mascot Image with subtle floating shadow */}
          <div className="relative w-64 h-64 xl:w-72 xl:h-72 my-2 flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-2xl -z-10" />
            <img
              src="/mascot.jpg"
              alt="Hootie the Scholar Owl"
              className="w-full h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500 rounded-3xl"
            />
          </div>

          {/* Headlines */}
          <h2 className="text-lg xl:text-xl font-extrabold text-blue-900 mt-4">
            Learn Smart, Achieve Your Dreams
          </h2>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-md">
            An adaptive English learning platform and official EELS simulation based on university curriculum.
          </p>
        </div>

      </div>

      {/* SISI KANAN: Formulir Login Akademik (Sesuai Desain Image 3) */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 overflow-y-auto">
        {/* Top Utility Links */}
        <div className="flex items-center justify-end gap-3 text-xs text-slate-500">
          <button className="hover:text-blue-600 flex items-center gap-1 transition-colors">
            <HelpCircle className="w-3.5 h-3.5" />
            Help Center
          </button>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Normal
          </span>
        </div>

        {/* Main Login Form Container */}
        <div className="max-w-md w-full mx-auto my-auto py-6 space-y-6">
          {/* Header Title */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Log in to EduClass
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Welcome back! Please enter your details.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold text-slate-700">
                University Email / EduClass Account
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com atau akun EduClass"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-slate-800 tracking-wider"
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

            {/* Remember & Safe Connection Badges */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-600">Remember me</span>
              </label>

              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Secure Connection
              </span>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 sm:py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold text-xs sm:text-sm rounded-xl border-b-2 border-blue-800 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Log In Now</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div>
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">
              Register for free now
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
