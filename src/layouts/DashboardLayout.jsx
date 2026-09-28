import React from 'react';
import { Outlet, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useDataStore } from '../store/dataStore';
import { motion } from 'framer-motion';
import { 
  Home, 
  BookOpen, 
  CheckSquare, 
  Trophy, 
  ShoppingBag, 
  User, 
  Settings, 
  HelpCircle, 
  Play, 
  Bell, 
  Flame, 
  Gem, 
  Zap, 
  GraduationCap,
  ShieldCheck,
  FileSpreadsheet,
  Users,
  BarChart3,
  Award
} from 'lucide-react';
import EduLogo from '../components/mascot/EduLogo';

export default function DashboardLayout({ allowedRoles }) {
  const { user, role, logout } = useAuthStore();
  const { userStats } = useDataStore();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'mahasiswa') return <Navigate to="/dashboard" replace />;
    if (role === 'admin') return <Navigate to="/admin" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigasi Mahasiswa - Nama tetap sesuai spesifikasi sistem
  const mahasiswaNav = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, badge: null },
    { name: 'Quiz Arena', path: '/dashboard/boss', icon: Trophy, badge: null },
    { name: 'Edu Module', path: '/dashboard/modules', icon: BookOpen, badge: null },
    { name: 'Marketplace & Avatar', path: '/dashboard/rewards', icon: ShoppingBag, badge: null },
    { name: 'My Progress', path: '/dashboard/progress', icon: BarChart3, badge: null },
  ];

  // Navigasi Admin
  const adminNav = [
    { name: 'Dashboard', path: '/admin', icon: Home, badge: null },
    { name: 'Monitoring Kuis', path: '/admin/quizzes', icon: Award, badge: 'Live' },
    { name: 'Rekap Nilai & Evaluasi', path: '/admin/grading', icon: FileSpreadsheet, badge: 'CSV' },
    { name: 'Edu Module & Materi', path: '/admin/materials', icon: BookOpen, badge: null },
    { name: 'Manajemen Pengguna', path: '/admin/users', icon: Users, badge: null },
    { name: 'Laporan Akademik', path: '/admin/reports', icon: BarChart3, badge: null },
  ];

  const currentNav = role === 'admin' ? adminNav : mahasiswaNav;
  const homePath = role === 'admin' ? '/admin' : '/dashboard';

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* ================= TOP GAMIFIED APP BAR (Sesuai Image 2) ================= */}
      <header className="sticky top-0 z-50 h-16 bg-white border-b border-slate-200/90 px-4 md:px-6 flex items-center justify-between shadow-2xs">
        {/* Brand & Left Info */}
        <div className="flex items-center gap-3 sm:gap-5">
          <Link to={homePath} className="flex items-center">
            <EduLogo size="sm" />
          </Link>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* Page / Section Indicator */}
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-extrabold text-slate-800 hidden sm:block">
              {role === 'admin' ? 'Portal Administrator' : 'Dashboard Mahasiswa'}
            </h1>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              {role === 'admin' ? 'Live Sistem' : 'Semester Genap'}
            </span>
          </div>
        </div>

        {/* Right Status Cluster (Streak, Gems, XP, Notification, Profile) */}
        <div className="flex items-center gap-2 md:gap-3">
          {role === 'mahasiswa' && (
            <>
              {/* Streak Pill */}
              <div 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50/80 border border-orange-200 text-orange-700 text-xs font-black shadow-2xs"
                title="14 Hari Streak Konsisten"
              >
                <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                <span>14 Hari</span>
              </div>

              {/* Gems Pill */}
              <div 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50/80 border border-purple-200 text-purple-700 text-xs font-black shadow-2xs hidden sm:flex"
                title="1.240 Gems Permata"
              >
                <Gem className="w-4 h-4 text-purple-600" />
                <span>1.240</span>
              </div>

              {/* XP Pill */}
              <div 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50/80 border border-amber-200 text-amber-700 text-xs font-black shadow-2xs"
                title="4.850 Total XP"
              >
                <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>4.850 XP</span>
              </div>
            </>
          )}

          {/* Notification Bell with red dot */}
          <button 
            type="button" 
            className="relative p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {/* User Profile Pill Badge (Matches Image 2) */}
          <Link
            to="/profile"
            className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full hover:bg-slate-100 transition-colors border border-slate-200/80"
          >
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-extrabold flex items-center justify-center text-xs border border-blue-200">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'BS'}
            </div>
            <div className="hidden md:block text-left leading-tight">
              <p className="text-xs font-extrabold text-slate-800">
                {user?.name || (role === 'admin' ? 'Super Administrator' : 'Budi Santoso')}
              </p>
              <p className="text-[10px] text-slate-400 font-bold">
                {role === 'admin' ? 'Administrator' : 'Mahasiswa'}
              </p>
            </div>
          </Link>
        </div>
      </header>

      {/* ================= MAIN WRAPPER WITH SIDEBAR ================= */}
      <div className="flex-1 flex w-full">
        {/* SIDE NAVIGATION (Desktop) - Matches Image 2 */}
        <aside className="w-60 bg-white border-r border-slate-200/90 p-4 shrink-0 hidden lg:flex flex-col justify-between sticky top-16 h-[calc(100vh-4rem)]">
          <div className="space-y-4">
            {/* Nav Menu */}
            <nav className="space-y-1">
              {currentNav.map((item) => {
                const IconComponent = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/dashboard' &&
                    item.path !== '/admin' &&
                    location.pathname.startsWith(item.path));

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 font-extrabold shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent
                        className={`w-4 h-4 ${
                          isActive ? 'text-blue-600' : 'text-slate-400'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-black bg-blue-600 text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Actions of Sidebar */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <Link 
              to="/profile" 
              className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Pengaturan Akun</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Keluar Akun</span>
            </button>
          </div>
        </aside>

        {/* MAIN BODY OUTLET */}
        <main className="flex-1 min-w-0 pb-16 lg:pb-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-4 flex justify-around items-center z-50 shadow-lg">
        {currentNav.slice(0, 5).map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center gap-1 ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-400'
              }`}
            >
              <IconComponent className="w-5 h-5" />
              <span className="text-[10px]">{item.name.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
