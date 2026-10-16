import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, BookOpen, Trophy, ShoppingBag, User, Settings, HelpCircle,
  Play, Bell, Flame, Gem, Zap, GraduationCap, ShieldCheck,
  FileSpreadsheet, Users, BarChart3, Award, ChevronDown, ChevronRight,
  Package, Target, Star, Layers, MapPin, ClipboardList,
  FileText, Wrench, BookMarked, ListChecks, Activity, TrendingUp
} from 'lucide-react';
import EduLogo from '../components/mascot/EduLogo';

export default function DashboardLayout({ allowedRoles }) {
  const { user, role, logout, loading } = useAuthStore();
  const [userStats, setUserStats] = useState({ total_xp: 0, gems: 0, streak_days: 0 });
  const navigate  = useNavigate();
  const location  = useLocation();
  const [expandedGroups, setExpandedGroups] = useState({ content: true, quiz: false, gamification: false });

  useEffect(() => {
    if (user?.id) {
      supabase.from('user_stats').select('total_xp,gems,current_streak').eq('user_id', user.id).single()
        .then(({ data }) => { if (data) setUserStats({ total_xp: data.total_xp, gems: data.gems, streak_days: data.current_streak }); });
    }
  }, [user?.id]);

  // While Supabase is restoring the session, show a loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-400">Memuat sesi...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;


  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'mahasiswa') return <Navigate to="/dashboard" replace />;
    if (role === 'admin') return <Navigate to="/admin" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleGroup = (group) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  // Navigasi Mahasiswa
  const mahasiswaNav = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, badge: null },
    { name: 'Quiz Arena', path: '/dashboard/boss', icon: Trophy, badge: null },
    { name: 'Edu Module', path: '/dashboard/modules', icon: BookOpen, badge: null },
    { name: 'Rewards', path: '/dashboard/rewards', icon: ShoppingBag, badge: null },
    { name: 'My Progress', path: '/dashboard/progress', icon: BarChart3, badge: null },
  ];

  // Navigasi Admin — grouped structure
  const adminNavGroups = [
    {
      label: null,
      items: [
        { name: 'Dashboard', path: '/admin', icon: Home, exact: true },
        { name: 'Users', path: '/admin/users', icon: Users },
      ]
    },
    {
      label: 'Learning Content',
      key: 'content',
      items: [
        { name: 'Materials', path: '/admin/materials', icon: BookOpen },
        { name: 'Categories', path: '/admin/categories', icon: Layers },
        { name: 'Learning Path', path: '/admin/learning-path', icon: MapPin },
      ]
    },
    {
      label: 'Quiz',
      key: 'quiz',
      items: [
        { name: 'Quizzes', path: '/admin/quizzes', icon: ClipboardList },
        { name: 'Questions', path: '/admin/questions', icon: ListChecks },
      ]
    },
    {
      label: 'Gamification',
      key: 'gamification',
      items: [
        { name: 'XP & Levels', path: '/admin/gamification/xp', icon: Zap },
        { name: 'Rewards', path: '/admin/gamification/rewards', icon: Star },
        { name: 'Streak', path: '/admin/gamification/streak', icon: Flame },
      ]
    },
    {
      label: null,
      items: [
        { name: 'Reports', path: '/admin/reports', icon: FileText },
        { name: 'Settings', path: '/admin/settings', icon: Wrench },
      ]
    },
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path));
  };

  const currentNavFlat = role === 'admin'
    ? adminNavGroups.flatMap(g => g.items)
    : mahasiswaNav;
  const homePath = role === 'admin' ? '/admin' : '/dashboard';

  return (
    <div className={`min-h-screen ${userStats?.activeTheme || 'bg-[#f8fafc]'} flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-colors duration-500`}>
      {/* TOP BAR */}
      <header className="sticky top-0 z-50 h-16 bg-white border-b border-slate-200/90 px-4 md:px-6 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3 sm:gap-5">
          <Link to={homePath} className="flex items-center">
            <EduLogo size="sm" />
          </Link>
          <div className="h-5 w-px bg-slate-200 hidden sm:block" />
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-extrabold text-slate-800 hidden sm:block">
              {role === 'admin' ? 'Admin Panel' : 'Dashboard Mahasiswa'}
            </h1>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              {role === 'admin' ? 'Administrator' : 'Mahasiswa'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {role === 'mahasiswa' && (
            <>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50/80 border border-orange-200 text-orange-700 text-xs font-black shadow-2xs">
                <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                <span>{userStats?.streak_days || 0} Hari</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50/80 border border-purple-200 text-purple-700 text-xs font-black shadow-2xs hidden sm:flex">
                <Gem className="w-4 h-4 text-purple-600" />
                <span>{(userStats?.gems || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50/80 border border-amber-200 text-amber-700 text-xs font-black shadow-2xs">
                <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{(userStats?.total_xp || 0).toLocaleString()} XP</span>
              </div>
            </>
          )}

          {role === 'admin' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-200 text-indigo-700 text-xs font-black shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Admin Access</span>
            </div>
          )}

          <button type="button" className="relative p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          <Link to="/profile" className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full hover:bg-slate-100 transition-colors border border-slate-200/80">
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-extrabold flex items-center justify-center text-xs border border-blue-200">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
            </div>
            <div className="hidden md:block text-left leading-tight">
              <p className="text-xs font-extrabold text-slate-800">{user?.name || (role === 'admin' ? 'Super Administrator' : 'Student')}</p>
              <p className="text-[10px] text-slate-400 font-bold">{role === 'admin' ? 'Administrator' : 'Mahasiswa'}</p>
            </div>
          </Link>
        </div>
      </header>

      {/* MAIN WRAPPER */}
      <div className="flex-1 flex w-full">
        {/* SIDEBAR DESKTOP */}
        <aside className="w-60 bg-white border-r border-slate-200/90 p-4 shrink-0 hidden lg:flex flex-col justify-between sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="space-y-1">
            {role === 'admin' ? (
              // Admin grouped navigation
              <nav className="space-y-0.5">
                {adminNavGroups.map((group, gi) => (
                  <div key={gi} className={gi > 0 && group.label === null ? 'pt-2 mt-2 border-t border-slate-100' : ''}>
                    {group.label && (
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.key)}
                        className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                      >
                        <span>{group.label}</span>
                        {expandedGroups[group.key]
                          ? <ChevronDown className="w-3 h-3" />
                          : <ChevronRight className="w-3 h-3" />
                        }
                      </button>
                    )}
                    <AnimatePresence initial={false}>
                      {(!group.label || expandedGroups[group.key]) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden space-y-0.5"
                        >
                          {group.items.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path, item.exact);
                            return (
                              <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2 rounded-xl font-bold text-xs transition-all ${
                                  active
                                    ? 'bg-indigo-50 text-indigo-700 font-extrabold shadow-2xs'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                } ${group.label ? 'ml-2' : ''}`}
                              >
                                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                                <span>{item.name}</span>
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>
            ) : (
              // Mahasiswa flat navigation
              <nav className="space-y-1">
                {mahasiswaNav.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path, item.path === '/dashboard');
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                        active ? 'bg-blue-50 text-blue-600 font-extrabold shadow-2xs' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-black bg-blue-600 text-white">{item.badge}</span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors">
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Account Settings</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 pb-16 lg:pb-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-4 flex justify-around items-center z-50 shadow-lg">
        {currentNavFlat.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-1 ${active ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
              <Icon className="w-5 h-5" />
              <span className="text-[10px]">{item.name.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
