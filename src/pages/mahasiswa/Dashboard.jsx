import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDataStore } from '../../store/dataStore';
import { BookOpen, Trophy, Flame, ChevronRight, CheckCircle, Lock, PlayCircle, Star } from 'lucide-react';

export default function MahasiswaDashboard() {
  const navigate = useNavigate();
  const { userStats, materials } = useDataStore();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      
      {/* Header Profile Summary */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Selamat datang kembali!</h1>
          <p className="text-slate-500 text-sm">Lanjutkan perjalanan belajarmu hari ini.</p>
          
          {/* Top Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Level Kamu</p>
                <p className="text-lg font-extrabold text-blue-700">{userStats.level} <span className="text-sm font-medium text-blue-600/70">({userStats.levelName})</span></p>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Total Poin</p>
                <p className="text-lg font-extrabold text-amber-700">{userStats.total_xp} XP</p>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Streak Belajar</p>
                <p className="text-lg font-extrabold text-orange-700">{userStats.current_streak} Hari</p>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Materi Selesai</p>
                <p className="text-lg font-extrabold text-emerald-700">{materials.filter(m => m.status === 'completed').length} Modul</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Roadmap Area */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-slate-900">Alur Pembelajaran</h2>
          <Link to="/dashboard/modules">
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl transition-colors">
              Lihat Semua Modul
            </button>
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          
          <div className="relative py-4 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
            {/* Connecting Line background */}
            <div className="absolute left-1/2 md:left-0 top-0 md:top-1/2 w-1 h-full md:w-full md:h-1 bg-slate-100 -translate-x-1/2 md:-translate-x-0 md:-translate-y-1/2 z-0"></div>
            
            {/* Nodes based on actual materials */}
            {materials.slice(0, 4).map((mod, i) => (
              <div key={mod.id} className="relative z-10 flex flex-col items-center group">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-4 transition-transform shadow-sm ${
                  mod.status === 'completed' ? 'bg-emerald-500 border-emerald-100 text-white cursor-pointer hover:scale-105' :
                  mod.status === 'active' ? 'bg-blue-600 border-blue-100 text-white ring-4 ring-blue-600/20 shadow-blue-500/30 cursor-pointer hover:scale-105' :
                  'bg-white border-slate-200 text-slate-300'
                }`}
                onClick={() => {
                  if (mod.status !== 'locked') navigate(`/dashboard/modules/${mod.id}`);
                }}
                >
                  {mod.status === 'completed' ? <CheckCircle className="w-6 h-6 md:w-8 md:h-8" /> :
                   mod.status === 'active' ? <PlayCircle className="w-6 h-6 md:w-8 md:h-8" /> :
                   <Lock className="w-5 h-5 md:w-6 md:h-6" />}
                </div>
                
                <div className="mt-3 text-center bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm max-w-[120px]">
                  <p className={`text-xs font-extrabold truncate ${mod.status === 'active' ? 'text-blue-700' : 'text-slate-700'}`}>{mod.title}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{mod.category}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}
