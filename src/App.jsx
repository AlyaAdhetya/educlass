import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import MahasiswaDashboard from './pages/mahasiswa/Dashboard';
import Modules from './pages/mahasiswa/Modules';
import PlacementTest from './pages/mahasiswa/PlacementTest';
import Exam from './pages/mahasiswa/Exam';
import Leaderboard from './pages/mahasiswa/Leaderboard';
import DosenDashboard from './pages/dosen/Dashboard';
import DosenClasses from './pages/dosen/Classes';
import CreateClass from './pages/dosen/CreateClass';
import Materials from './pages/dosen/Materials';
import ClassTasks from './pages/dosen/ClassTasks';
import ClassStudents from './pages/dosen/ClassStudents';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminMonitoring from './pages/admin/Monitoring';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Placement Test (No Sidebar) */}
      <Route path="/placement-test" element={<PlacementTest />} />

      {/* Mahasiswa Routes */}
      <Route element={<DashboardLayout allowedRoles={['mahasiswa']} />}>
        <Route path="/dashboard" element={<MahasiswaDashboard />} />
        <Route path="/dashboard/modules" element={<Modules />} />
        <Route path="/dashboard/exams" element={<Exam />} />
        <Route path="/dashboard/leaderboard" element={<Leaderboard />} />
      </Route>

      {/* Dosen Routes */}
      <Route element={<DashboardLayout allowedRoles={['dosen']} />}>
        <Route path="/dosen" element={<DosenDashboard />} />
        <Route path="/dosen/classes" element={<DosenClasses />} />
        <Route path="/dosen/classes/new" element={<CreateClass />} />
        <Route path="/dosen/classes/:id/materials" element={<Materials />} />
        <Route path="/dosen/classes/:id/tasks" element={<ClassTasks />} />
        <Route path="/dosen/classes/:id/students" element={<ClassStudents />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<DashboardLayout allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/monitoring" element={<AdminMonitoring />} />
      </Route>
    </Routes>
  );
}
