import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import {
  Users, BookOpen, Activity, TrendingUp, Zap,
  Award, ArrowUpRight, BarChart3, ChevronRight,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats]         = useState({ students: 0, active: 0, materials: 0, published: 0, activities: 0 });
  const [levelDist, setLevelDist] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      // Students
      const { data: students } = await supabase
        .from('profiles').select('id, status').eq('role', 'mahasiswa');
      const totalStudents  = students?.length ?? 0;
      const activeStudents = students?.filter(s => s.status === 'active').length ?? 0;

      // Materials
      const { count: totalMaterials }    = await supabase.from('materials').select('*', { count: 'exact', head: true });
      const { count: publishedMaterials } = await supabase.from('materials').select('*', { count: 'exact', head: true }).eq('publish_status', 'published');

      // Activity last 7 days
      const since = new Date(); since.setDate(since.getDate() - 7);
      const { count: activities } = await supabase.from('activity_log').select('*', { count: 'exact', head: true }).gte('created_at', since.toISOString());

      setStats({ students: totalStudents, active: activeStudents, materials: totalMaterials ?? 0, published: publishedMaterials ?? 0, activities: activities ?? 0 });

      // Level distribution
      const { data: levels }       = await supabase.from('levels').select('id, name, badge_emoji, color').order('level_number');
      const { data: profileLevels } = await supabase.from('profiles').select('current_level_id').eq('role', 'mahasiswa');
      if (levels && profileLevels) {
        setLevelDist(levels.map(lv => ({
          name:  lv.name,
          badge: lv.badge_emoji ?? '📚',
          color: lv.color,
          count: profileLevels.filter(p => p.current_level_id === lv.id).length,
        })));
      }

      // Weekly chart
      const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      const counts = Array(7).fill(0);
      const { data: recentAct } = await supabase.from('activity_log').select('created_at').gte('created_at', since.toISOString());
      recentAct?.forEach(r => { const d = new Date(r.created_at).getDay(); counts[d]++; });
      const today   = new Date().getDay();
      const ordered = [];
      for (let i = 1; i <= 7; i++) {
        const idx = (today - 7 + i + 7) % 7;
        ordered.push({ label: days[idx], value: counts[idx] });
      }
      setWeeklyData(ordered);
    } catch (e) {
      console.error('Dashboard fetch error:', e);
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    { label: 'Total Students',      value: stats.students,   sub: `${stats.active} active`,       icon: Users,    color: 'indigo',  link: '/admin/users' },
    { label: 'Total Materials',     value: stats.materials,  sub: `${stats.published} published`, icon: BookOpen, color: 'emerald', link: '/admin/materials' },
    { label: 'Learning Activities', value: stats.activities, sub: 'Last 7 days',                  icon: Activity, color: 'violet',  link: '/admin/reports' },
  ];

  const colorMap = {
    indigo:  { bg: 'bg-indigo-50',  text: 'text-indigo-600',  ring: 'ring-indigo-100' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100' },
    violet:  { bg: 'bg-violet-50',  text: 'text-violet-600',  ring: 'ring-violet-100' },
  };

  const quickActions = [
    { label: 'Add Material',  icon: BookOpen, path: '/admin/materials',       color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' },
    { label: 'Manage Users',  icon: Users,    path: '/admin/users',           color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' },
    { label: 'View Reports',  icon: BarChart3,path: '/admin/reports',         color: 'text-amber-600 bg-amber-50 hover:bg-amber-100' },
    { label: 'Learning Path', icon: Activity, path: '/admin/learning-path',   color: 'text-violet-600 bg-violet-50 hover:bg-violet-100' },
    { label: 'XP & Levels',   icon: Zap,      path: '/admin/gamification/xp', color: 'text-sky-600 bg-sky-50 hover:bg-sky-100' },
    { label: 'Settings',      icon: Award,    path: '/admin/settings',        color: 'text-rose-600 bg-rose-50 hover:bg-rose-100' },
  ];

  const barMax = Math.max(...weeklyData.map(d => d.value), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">

      {/* HEADER */}
      <motion.section
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-[11px] font-black rounded-full border border-white/30">Admin Panel</span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-400/30 text-emerald-100 text-[11px] font-black rounded-full border border-emerald-400/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> System Active
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Admin'}
            </h1>
            <p className="text-sm text-indigo-100 mt-1">EduClass Management Dashboard</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/materials" className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-bold rounded-xl border border-white/30 flex items-center gap-2 transition-all">
              <BookOpen className="w-4 h-4" /> Add Material
            </Link>
            <Link to="/admin/reports" className="px-4 py-2 bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-bold rounded-xl flex items-center gap-2 transition-all">
              <Activity className="w-4 h-4" /> View Reports
            </Link>
          </div>
        </div>
      </motion.section>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          const c    = colorMap[card.color];
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Link to={card.link} className="block bg-white rounded-3xl p-5 border border-slate-100 shadow-xs hover:border-indigo-200 hover:shadow-sm transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-2xl ${c.bg} flex items-center justify-center ring-4 ${c.ring}`}>
                    <Icon className={`w-5 h-5 ${c.text}`} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                </div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{card.label}</p>
                {loading
                  ? <div className="w-16 h-7 bg-slate-100 rounded-lg animate-pulse mt-1" />
                  : <h3 className="text-2xl font-black text-slate-900 mt-0.5">{card.value}</h3>
                }
                <p className="text-[11px] text-slate-500 mt-1">{card.sub}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs">
        <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" /> Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((a, i) => {
            const Icon = a.icon;
            return (
              <Link key={i} to={a.path} className={`flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-2.5 p-3.5 rounded-2xl text-xs font-bold transition-all ${a.color}`}>
                <Icon className="w-4 h-4 shrink-0" />
                <span>{a.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Weekly Activity */}
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

            {loading ? (
              <div className="h-16 bg-slate-100 rounded-xl animate-pulse" />
            ) : (
              <>
                <div className="flex items-end gap-1.5 h-16">
                  {weeklyData.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-md bg-indigo-500 transition-all"
                        style={{ height: `${Math.max(2, (d.value / barMax) * 56)}px`, opacity: 0.5 + (i / 7) * 0.5 }}
                        title={`${d.label}: ${d.value}`}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {weeklyData.map((d, i) => (
                    <span key={i} className="flex-1 text-center text-[10px] font-bold text-slate-400">{d.label}</span>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-100">
            <div className="text-center">
              <p className="text-xs font-black text-slate-900">{stats.activities}</p>
              <p className="text-[10px] text-slate-400">This week</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-black text-indigo-600">Live</p>
              <p className="text-[10px] text-slate-400">from Supabase</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-black text-slate-900">{(stats.activities / 7).toFixed(1)}</p>
              <p className="text-[10px] text-slate-400">Daily avg</p>
            </div>
          </div>
        </div>

        {/* Level Distribution */}
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

          {loading ? (
            <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-8 bg-slate-100 rounded-xl animate-pulse" />)}</div>
          ) : (
            <div className="space-y-3">
              {levelDist.map((lv, i) => {
                const pct = stats.students > 0 ? Math.round((lv.count / stats.students) * 100) : 0;
                const barColors = ['bg-slate-300','bg-blue-400','bg-indigo-500','bg-violet-500','bg-amber-500','bg-rose-500'];
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
                      <div className={`${barColors[i] || 'bg-indigo-500'} h-full rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
