import React from 'react';
import { Outlet, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/button';
import {
  LogOut, BookOpen, Users, LayoutDashboard,
  ClipboardList, Activity, Gift, FileBarChart2
} from 'lucide-react';

export default function DashboardLayout({ allowedRoles }) {
  const { user, role, logout } = useAuthStore();
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

  const navItems = {
    mahasiswa: [
      { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5 mr-3" /> },
      { name: 'Modul Belajar', path: '/dashboard/modules', icon: <BookOpen className="h-5 w-5 mr-3" /> },
      { name: 'My Progress', path: '/dashboard/progress', icon: <Activity className="h-5 w-5 mr-3" /> },
      { name: 'Rewards', path: '/dashboard/rewards', icon: <Gift className="h-5 w-5 mr-3" /> },
    ],
    admin: [
      { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="h-5 w-5 mr-3" /> },
      { name: 'Manajemen Pengguna', path: '/admin/users', icon: <Users className="h-5 w-5 mr-3" /> },
      { name: 'Kelola Materi', path: '/admin/materials', icon: <BookOpen className="h-5 w-5 mr-3" /> },
      { name: 'Kelola Kuis & Evaluasi', path: '/admin/quizzes', icon: <ClipboardList className="h-5 w-5 mr-3" /> },
      { name: 'Laporan Global', path: '/admin/reports', icon: <FileBarChart2 className="h-5 w-5 mr-3" /> },
    ],
  };

  const currentNav = navItems[role] || [];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm shrink-0">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="font-extrabold text-lg text-slate-900 tracking-tight">EduClass</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {currentNav.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User section with Profile link */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-2 py-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors group"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-sm shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate leading-tight">{user?.name || user?.email}</p>
              <p className="text-xs text-slate-500 capitalize">{role} · Edit Profil</p>
            </div>
          </Link>
          <Button
            variant="outline"
            className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
