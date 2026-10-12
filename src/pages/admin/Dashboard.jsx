import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'framer-motion';
import {
  Users, BookOpen, Activity, TrendingUp, Zap,
  Award, ArrowUpRight, BarChart3, ChevronRight
} from 'lucide-react';

// Simple SVG bar chart (no external dep)
function MiniBarChart({ data, color = '#6366f1' }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-1.5 h-16">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md transition-all"
            style={{ height: `${(d.value / max) * 56}px`, backgroundColor: color, opacity: 0.7 + (i / data.length) * 0.3 }}
            title={`${d.label}: ${d.value}`}
          />
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const { students, materials, activityLog, levels } = useDataStore();

  // === Computed statistics ===
  const mahasiswaList = students.filter(s => s.role === 'mahasiswa');
  const totalStudents = mahasiswaList.length;
  const activeStudents = mahasiswaList.filter(s => s.status === 'active').length;
  const totalMaterials = materials.length;
  const publishedMaterials = materials.filter(m => m.status === 'completed' || m.publishStatus === 'published').length;
  const totalActivities = activityLog.length;

  // Level distribution
  const levelDist = levels.map(lv => {
    const count = mahasiswaList.filter(s => s.levelName === lv.name).length;
    return { name: lv.name, count, badge: lv.badge, color: lv.color };
  });

  // Weekly activity chart (mock 7 days)
  const weeklyActivity = [
    { label: 'Mon', value: 12 },
    { label: 'Tue', value: 18 },
    { label: 'Wed', value: 8 },
    { label: 'Thu', value: 22 },
    { label: 'Fri', value: 15 },
    { label: 'Sat', value: 9 },
    { label: 'Sun', value: 19 },
  ];

  const statCards = [
    {
      label: 'Total Students',
      value: totalStudents,
      sub: `${activeStudents} active`,
      icon: Users,
      color: 'indigo',
      link: '/admin/users',
    },
    {
      label: 'Total Materials',
      value: totalMaterials,
      sub: `${publishedMaterials} published`,
      icon: BookOpen,
      color: 'emerald',
      link: '/admin/materials',
    },
    {
      label: 'Learning Activities',
      value: totalActivities,
      sub: 'This week',
      icon: Activity,
      color: 'violet',
      link: '/admin/reports',
    },
  ];

  const colorMap = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-100' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', ring: 'ring-violet-100' },
  };

  const quickActions = [
    { label: 'Add Material', icon: BookOpen, path: '/admin/materials', color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' },
    { label: 'Manage Users', icon: Users, path: '/admin/users', color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' },
    { label: 'View Reports', icon: BarChart3, path: '/admin/reports', color: 'text-amber-600 bg-amber-50 hover:bg-amber-100' },
    { label: 'Learning Path', icon: Activity, path: '/admin/learning-path', color: 'text-violet-600 bg-violet-50 hover:bg-violet-100' },
    { label: 'XP & Levels', icon: Zap, path: '/admin/gamification/xp', color: 'text-sky-600 bg-sky-50 hover:bg-sky-100' },
    { label: 'Settings', icon: Award, path: '/admin/settings', color: 'text-rose-600 bg-rose-50 hover:bg-rose-100' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">

      {/* ===== HEADER ===== */}
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-[11px] font-black rounded-full border border-white/30">
                Admin Panel
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-400/30 text-emerald-100 text-[11px] font-black rounded-full border border-emerald-400/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                System Active
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Admin'} 👋
            </h1>
            <p className="text-sm text-indigo-100 mt-1">
              EduClass Management Dashboard — Semester Ganjil 2026/2027
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/admin/materials"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-bold rounded-xl border border-white/30 flex items-center gap-2 transition-all"
            >
              <BookOpen className="w-4 h-4" /> Add Material
            </Link>
            <Link
              to="/admin/reports"
              className="px-4 py-2 bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-bold rounded-xl flex items-center gap-2 transition-all"
            >
              <Activity className="w-4 h-4" /> View Reports
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ===== STAT CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          const c = colorMap[card.color];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Link to={card.link} className="block bg-white rounded-3xl p-5 border border-slate-100 shadow-xs hover:border-indigo-200 hover:shadow-sm transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-2xl ${c.bg} flex items-center justify-center ring-4 ${c.ring}`}>
                    <Icon className={`w-5 h-5 ${c.text}`} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                </div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{card.label}</p>
                <h3 className="text-2xl font-black text-slate-900 mt-0.5">{card.value}</h3>
                <p className="text-[11px] text-slate-500 mt-1">{card.sub}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* ===== QUICK ACTIONS ===== */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
        <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" /> Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((a, i) => {
            const Icon = a.icon;
            return (
              <Link
                key={i}
                to={a.path}
                className={`flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-2.5 p-3.5 rounded-2xl text-xs font-bold transition-all ${a.color}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{a.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ===== MAIN CHARTS & DISTRIBUTION ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Weekly Activity Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-500" /> Learning Activity
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Student activities over the past 7 days</p>
              </div>
              <Link to="/admin/reports" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <MiniBarChart data={weeklyActivity} color="#6366f1" />

            <div className="flex justify-between mt-2">
              {weeklyActivity.map((d, i) => (
                <span key={i} className="flex-1 text-center text-[10px] font-bold text-slate-400">{d.label}</span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-100">
            <div className="text-center">
              <p className="text-xs font-black text-slate-900">103</p>
              <p className="text-[10px] text-slate-400">This week</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-black text-indigo-600">↑ 18%</p>
              <p className="text-[10px] text-slate-400">vs last week</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-black text-slate-900">14.7</p>
              <p className="text-[10px] text-slate-400">Daily avg</p>
            </div>
          </div>
        </div>

        {/* Student Level Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" /> Level Distribution
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Students across all proficiency levels</p>
            </div>
            <Link to="/admin/gamification/xp" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
              Manage <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {levelDist.map((lv, i) => {
              const pct = totalStudents > 0 ? Math.round((lv.count / totalStudents) * 100) : 0;
              const barColors = ['bg-slate-300', 'bg-blue-400', 'bg-indigo-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500'];
              return (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{lv.badge}</span>
                      <span className="font-bold text-slate-700">{lv.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900">{lv.count}</span>
                      <span className="text-slate-400 font-medium text-[10px]">{pct}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`${barColors[i] || 'bg-indigo-500'} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
