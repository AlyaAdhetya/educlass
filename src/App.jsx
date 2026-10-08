import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/Profile';

// Mahasiswa Pages
import MahasiswaDashboard from './pages/mahasiswa/Dashboard';
import Modules from './pages/mahasiswa/Modules';
import Progress from './pages/mahasiswa/Progress';
import Rewards from './pages/mahasiswa/Rewards';
import MaterialDetail from './pages/mahasiswa/MaterialDetail';
import LessonQuiz from './pages/mahasiswa/LessonQuiz';
import BossBattle from './pages/mahasiswa/BossBattle';
import Leaderboard from './pages/mahasiswa/Leaderboard';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminMaterials from './pages/admin/Materials';
import AdminQuizzes from './pages/admin/Quizzes';
import AdminGrading from './pages/admin/Grading';
import AdminReports from './pages/admin/Reports';

// New Admin Pages
import AdminCategories from './pages/admin/Categories';
import AdminLearningPath from './pages/admin/LearningPath';
import AdminQuestions from './pages/admin/Questions';
import AdminXpLevels from './pages/admin/gamification/XpLevels';
import AdminAchievements from './pages/admin/gamification/Achievements';
import AdminGamificationRewards from './pages/admin/gamification/Rewards';
import AdminStreak from './pages/admin/gamification/Streak';
import AdminMonitoring from './pages/admin/Monitoring';
import AdminSettings from './pages/admin/Settings';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Shared Protected Route (Profile - accessible by any logged-in user) */}
      <Route element={<DashboardLayout />}>
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Mahasiswa Routes */}
      <Route element={<DashboardLayout allowedRoles={['mahasiswa']} />}>
        <Route path="/dashboard" element={<MahasiswaDashboard />} />
        <Route path="/dashboard/boss" element={<BossBattle />} />
        <Route path="/dashboard/leaderboard" element={<Leaderboard />} />
        <Route path="/dashboard/modules" element={<Modules />} />
        <Route path="/dashboard/modules/:id" element={<MaterialDetail />} />
        <Route path="/dashboard/modules/:id/quiz" element={<LessonQuiz />} />
        <Route path="/dashboard/progress" element={<Progress />} />
        <Route path="/dashboard/rewards" element={<Rewards />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<DashboardLayout allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/quizzes" element={<AdminQuizzes />} />
        <Route path="/admin/questions" element={<AdminQuestions />} />
        <Route path="/admin/grading" element={<AdminGrading />} />
        <Route path="/admin/materials" element={<AdminMaterials />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/learning-path" element={<AdminLearningPath />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/monitoring" element={<AdminMonitoring />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        
        {/* Admin Gamification Routes */}
        <Route path="/admin/gamification/xp" element={<AdminXpLevels />} />
        <Route path="/admin/gamification/achievements" element={<AdminAchievements />} />
        <Route path="/admin/gamification/rewards" element={<AdminGamificationRewards />} />
        <Route path="/admin/gamification/streak" element={<AdminStreak />} />
      </Route>
    </Routes>
  );
}
