import React from 'react';
import { Outlet, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/button';
import { LogOut, BookOpen, Users, LayoutDashboard, Settings, ClipboardList, Trophy } from 'lucide-react';

export default function DashboardLayout({ allowedRoles }) {
  const { user, role, logout, hasTakenTest } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Guard: Mahasiswa wajib selesaikan placement test sebelum bisa akses dashboard
  if (role === 'mahasiswa' && !hasTakenTest) {
    return <Navigate to="/placement-test" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'mahasiswa') return <Navigate to="/dashboard" replace />;
    if (role === 'dosen') return <Navigate to="/dosen" replace />;
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
      { name: 'Tes / Ujian', path: '/dashboard/exams', icon: <ClipboardList className="h-5 w-5 mr-3" /> },
      { name: 'Leaderboard', path: '/dashboard/leaderboard', icon: <Trophy className="h-5 w-5 mr-3" /> },
    ],
    dosen: [
      { name: 'Dashboard Dosen', path: '/dosen', icon: <LayoutDashboard className="h-5 w-5 mr-3" /> },
      { name: 'Manajemen Kelas', path: '/dosen/classes', icon: <Users className="h-5 w-5 mr-3" /> },
    ],
    admin: [
      { name: 'Dashboard Admin', path: '/admin', icon: <LayoutDashboard className="h-5 w-5 mr-3" /> },
      { name: 'Manajemen Pengguna', path: '/admin/users', icon: <Users className="h-5 w-5 mr-3" /> },
      { name: 'Monitoring Kelas', path: '/admin/monitoring', icon: <Settings className="h-5 w-5 mr-3" /> },
    ]
  };

  const currentNav = navItems[role] || [];

  return (
    <div className="min-h-screen bg-muted/40 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <BookOpen className="h-6 w-6 text-primary mr-2" />
          <span className="font-bold text-lg">EduClass</span>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {currentNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-foreground"
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <div className="mb-4 px-2">
            <p className="text-sm font-medium">{user.name || user.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{role}</p>
          </div>
          <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
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
