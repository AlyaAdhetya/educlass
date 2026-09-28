import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../store/dataStore';
import { motion } from 'framer-motion';

export default function Modules() {
  const navigate = useNavigate();
  const { materials, userStats } = useDataStore();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(materials.map((m) => m.category))];

  const filteredMaterials =
    selectedCategory === 'All'
      ? materials
      : materials.filter((m) => m.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-black text-[10px] uppercase tracking-wider border border-blue-100">
            Kurikulum CEFR Bahasa Inggris
          </span>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-2">
            Edu Module
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-xl">
            Pelajari materi tata bahasa, kosakata, dan pemahaman teks bahasa Inggris untuk mengumpulkan XP dan menyelesaikan kuis evaluasi.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 bg-blue-50/70 rounded-2xl border border-blue-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Selesai</span>
            <span className="text-base font-black text-blue-700">
              {materials.filter((m) => m.status === 'completed').length} / {materials.length} Unit
            </span>
          </div>
        </div>
      </section>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white border-b-2 border-blue-800 shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {cat === 'All' ? 'Semua Kategori' : cat}
          </button>
        ))}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => {
          const isCompleted = material.status === 'completed';
          const isActive = material.status === 'active';
          const isLocked = material.status === 'locked';

          return (
            <motion.div
              key={material.id}
              whileHover={{ y: isLocked ? 0 : -4 }}
              onClick={() => {
                if (!isLocked) navigate(`/dashboard/modules/${material.id}`);
              }}
              className={`rounded-3xl p-5 border-2 flex flex-col justify-between transition-all ${
                isLocked
                  ? 'bg-slate-50/80 border-slate-200/80 opacity-60 cursor-not-allowed'
                  : isCompleted
                  ? 'bg-white border-emerald-200 shadow-xs hover:border-emerald-400 cursor-pointer'
                  : 'bg-white border-indigo-300 shadow-md ring-2 ring-indigo-100 hover:border-indigo-500 cursor-pointer'
              }`}
            >
              <div>
                {/* Status & Level Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-black uppercase">
                    {material.cefr || `Level ${material.level}`}
                  </span>

                  {isCompleted && (
                    <span className="flex items-center gap-1 text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <span className="material-symbols-outlined text-xs fill-icon">check_circle</span>
                      Selesai
                    </span>
                  )}
                  {isActive && (
                    <span className="flex items-center gap-1 text-[11px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      <span className="material-symbols-outlined text-xs fill-icon">play_arrow</span>
                      Sedang Aktif
                    </span>
                  )}
                  {isLocked && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-xs">lock</span>
                      Terkunci
                    </span>
                  )}
                </div>

                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-500">
                  {material.unit} • {material.category}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1 mb-2 leading-snug">
                  {material.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {material.description}
                </p>
              </div>

              {/* Card Footer: Reward & Action */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs font-black text-amber-700">
                  <span className="material-symbols-outlined text-sm text-amber-500 fill-icon">bolt</span>
                  +{material.xp_reward} XP
                </div>

                {!isLocked ? (
                  <button
                    className={`tactile-btn px-4 py-2 rounded-xl text-xs font-black border-b-[3px] flex items-center gap-1 shadow-2xs ${
                      isCompleted
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-700'
                        : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-800'
                    }`}
                  >
                    <span>{isCompleted ? 'Pelajari Ulang' : 'Mulai Belajar'}</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400 font-bold">Kunci Unit Sebelumnya</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
