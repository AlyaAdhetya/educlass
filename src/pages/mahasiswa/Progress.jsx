import React from 'react';
import { useDataStore } from '../../store/dataStore';
import HootieMascot from '../../components/mascot/HootieMascot';
import { motion } from 'framer-motion';

export default function StudentProgress() {
  const { userStats, materials } = useDataStore();

  const totalMaterials = materials.length;
  const completedMaterials = materials.filter((m) => m.status === 'completed').length;
  const materialProgress = Math.round((completedMaterials / totalMaterials) * 100) || 0;

  const categories = [
    { name: 'Academic Vocabulary', progress: 100, level: 'Menengah', color: 'bg-emerald-500' },
    { name: 'Grammar & Syntax', progress: 75, level: 'Menengah Atas', color: 'bg-indigo-600' },
    { name: 'Reading Comprehension', progress: 30, level: 'Menengah Atas', color: 'bg-amber-500' },
    { name: 'Academic Writing', progress: 15, level: 'Mahir', color: 'bg-purple-600' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-6">
      {/* Top Banner with Mascot */}
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-indigo-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-black text-[10px] uppercase tracking-wider">
            Progres Belajar
          </span>
          <h1 className="text-xl md:text-3xl font-black text-slate-900 mt-2">
            My Progress
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-lg leading-relaxed">
            Performa kumulatif penguasaan materi, konsistensi streak harian, dan skor kuis pembelajaran.
          </p>
        </div>

        <HootieMascot
          mood="cheer"
          speech="Perkembanganmu luar biasa minggu ini! 🎉"
          size="lg"
        />
      </section>

      {/* Top Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-xs flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-xl fill-icon">bolt</span>
          </div>
          <h3 className="text-xl font-black text-slate-900">{userStats.total_xp.toLocaleString()}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total XP</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-xs flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-xl fill-icon">local_fire_department</span>
          </div>
          <h3 className="text-xl font-black text-slate-900">{userStats.current_streak} Hari</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Streak Konsisten</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-xs flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-xl fill-icon">check_circle</span>
          </div>
          <h3 className="text-xl font-black text-slate-900">
            {completedMaterials} / {totalMaterials}
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unit Tuntas</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-xs flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-xl fill-icon">school</span>
          </div>
          <h3 className="text-xl font-black text-slate-900">Level {userStats.level}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate max-w-[120px]">
            {userStats.levelName}
          </p>
        </div>
      </div>

      {/* Progress Breakdown Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Overall Curriculum Mastery */}
        <div className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-xs space-y-5">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600">monitoring</span>
            Penguasaan Silabus
          </h2>

          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-800">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400">{cat.level}</span>
                    <span className="font-black text-indigo-600">{cat.progress}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className={`${cat.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${cat.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnostic Milestone & EELS Ready */}
        <div className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">verified</span>
              Prediksi Kesiapan Ujian EELS
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Berdasarkan performa di Quiz Arena dan evaluasi modul pembelajaran:
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
              <div className="flex justify-between text-xs font-black text-indigo-950">
                <span>Estimasi Skor EELS:</span>
                <span className="text-indigo-600 font-extrabold">520 - 550</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Kekuatan Utama:</span>
                <span className="text-emerald-700 font-bold">Structure & Passive Voice</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Fokus Peningkatan:</span>
                <span className="text-rose-700 font-bold">Reading Inference Speed</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => window.location.assign('/dashboard/boss')}
            className="tactile-btn w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl border-b-[4px] border-indigo-900 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">swords</span>
            Uji Ulang di Quiz Arena
          </button>
        </div>
      </div>
    </div>
  );
}
