import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function AuthLayout() {
  const { user, role } = useAuthStore();

  // If user is already logged in, redirect them to their respective dashboard
  if (user) {
    if (role === 'mahasiswa') return <Navigate to="/dashboard" replace />;
    if (role === 'dosen') return <Navigate to="/dosen" replace />;
    if (role === 'admin') return <Navigate to="/admin" replace />;
  }

  return (
    <>
      <Outlet />
    </>
  );
}
