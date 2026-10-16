import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import HootieMascot from '../../components/mascot/HootieMascot';
import { motion } from 'framer-motion';

export default function StudentProgress() {
  const { user } = useAuthStore();
  const [userStats,  setUserStats]  = useState({ total_xp: 0, streak_days: 0 });
  const [levelInfo,  setLevelInfo]  = useState({ level_number: 1, name: 'Beginner' });
  const [completed,  setCompleted]  = useState(0);
  const [totalMats,  setTotalMats]  = useState(0);
  const [catProgress, setCatProgress] = useState([]);

  useEffect(() => {
    if (user?.id) fetchProgress();
  }, [user?.id]);

  async function fetchProgress() {
    // user stats
    const { data: us } = await supabase
      .from('user_stats').select('*').eq('user_id', user.id).single();
    if (us) setUserStats(us);

    // level from profile
    const { data: prof } = await supabase
      .from('profiles').select('levels(level_number, name)').eq('id', user.id).single();
    if (prof?.levels) setLevelInfo(prof.levels);

    // Fetch all published materials
    const { data: mats } = await supabase
      .from('material_with_category')
      .select('id, category_name')
      .eq('publish_status', 'published');
    const totalMaterialsList = mats || [];
    setTotalMats(totalMaterialsList.length);

    // Fetch user material progress
    const { data: prog } = await supabase
      .from('material_progress')
      .select('material_id, status')
      .eq('user_id', user.id);

    const completedSet = new Set((prog || []).filter(p => p.status === 'completed').map(p => p.material_id));
    setCompleted(completedSet.size);

    // Category progress
    const catMap = {};
    totalMaterialsList.forEach(m => {
      const cat = m.category_name || 'General';
      if (!catMap[cat]) catMap[cat] = { total: 0, done: 0 };
      catMap[cat].total++;
      if (completedSet.has(m.id)) catMap[cat].done++;
    });

    const colors = ['bg-emerald-500','bg-indigo-600','bg-amber-500','bg-purple-600','bg-rose-500','bg-cyan-600'];
    setCatProgress(Object.entries(catMap).map(([name, v], i) => ({
      name,
      progress: v.total > 0 ? Math.round((v.done / v.total) * 100) : 0,
      color: colors[i % colors.length]
    })));
  }

  const materialProgress = totalMats > 0 ? Math.round((completed / totalMats) * 100) : 0;

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
          <h3 className="text-xl font-black text-slate-900">{(userStats.total_xp || 0).toLocaleString()}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total XP</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-xs flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-xl fill-icon">local_fire_department</span>
          </div>
          <h3 className="text-xl font-black text-slate-900">{userStats.streak_days || 0} Hari</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Streak Konsisten</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-xs flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-xl fill-icon">check_circle</span>
          </div>
          <h3 className="text-xl font-black text-slate-900">
            {completed} / {totalMats}
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unit Tuntas</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-indigo-100 shadow-xs flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-xl fill-icon">school</span>
          </div>
          <h3 className="text-xl font-black text-slate-900">Level {levelInfo.level_number}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate max-w-[120px]">
            {levelInfo.name}
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
            {catProgress.length > 0 ? catProgress.map((cat) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-800">{cat.name}</span>
                  <span className="font-black text-indigo-600">{cat.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className={`${cat.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${cat.progress}%` }}
                  />
                </div>
              </div>
            )) : (
              <p className="text-xs text-slate-400 text-center py-4">Belum ada progres belajar.</p>
            )}
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
