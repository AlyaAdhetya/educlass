import React from 'react';
import { useDataStore } from '../../store/dataStore';
import { Trophy, Flame, Target, BookOpen, Star, Activity } from 'lucide-react';

export default function Progress() {
  const { userStats, materials, quizzes } = useDataStore();

  const totalMaterials = materials.length;
  const completedMaterials = materials.filter(m => m.status === 'completed').length;
  const materialProgress = Math.round((completedMaterials / totalMaterials) * 100) || 0;

  // Mock category progress
  const categories = [
    { name: 'Vocabulary', progress: 80, color: 'bg-blue-500' },
    { name: 'Grammar', progress: 45, color: 'bg-emerald-500' },
    { name: 'Reading', progress: 20, color: 'bg-amber-500' },
    { name: 'Daily English', progress: 100, color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Progress</h1>
          <p className="text-slate-500 mt-2">Pantau perkembangan belajarmu dan terus tingkatkan kemampuan.</p>
        </div>

        {/* Top Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <Trophy className="w-8 h-8 text-amber-500 mb-2" />
            <h3 className="text-2xl font-bold text-slate-900">{userStats.total_xp}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total XP</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <Flame className="w-8 h-8 text-orange-500 mb-2" />
            <h3 className="text-2xl font-bold text-slate-900">{userStats.current_streak} Hari</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Streak</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <BookOpen className="w-8 h-8 text-blue-500 mb-2" />
            <h3 className="text-2xl font-bold text-slate-900">{completedMaterials}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Materi Selesai</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <Star className="w-8 h-8 text-purple-500 mb-2" />
            <h3 className="text-2xl font-bold text-slate-900">Level {userStats.level}</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{userStats.levelName}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Overall Progress */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Kemajuan Keseluruhan
            </h2>
            
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-semibold text-slate-700">Penyelesaian Materi</span>
                <span className="text-sm font-bold text-blue-600">{materialProgress}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${materialProgress}%` }}></div>
              </div>
              <p className="text-xs text-slate-500 mt-2">{completedMaterials} dari {totalMaterials} materi terselesaikan</p>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-semibold text-slate-700">Akurasi Rata-rata</span>
                <span className="text-sm font-bold text-emerald-600">{userStats.average_score}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${userStats.average_score}%` }}></div>
              </div>
            </div>
          </div>

          {/* Progress per Category */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              Kemampuan per Kategori
            </h2>
            
            <div className="space-y-4">
              {categories.map((cat, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-700 uppercase tracking-wide">{cat.name}</span>
                    <span className="text-slate-500">{cat.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
