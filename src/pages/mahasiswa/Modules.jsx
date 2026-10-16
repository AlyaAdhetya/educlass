import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

export default function Modules() {
  const navigate       = useNavigate();
  const { user }       = useAuthStore();
  const [materials, setMaterials]               = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => { fetchMaterials(); }, [user?.id]);

  async function fetchMaterials() {
    setLoading(true);
    const { data, error } = await supabase
      .from('material_with_category')
      .select('*')
      .eq('publish_status', 'published')
      .order('sort_order');

    if (!error && data && user?.id) {
      // Fetch user profile level
      const { data: prof } = await supabase
        .from('profiles')
        .select('current_level_id')
        .eq('id', user.id)
        .single();
      const userLevel = prof?.current_level_id || 1;

      // Fetch user progress for each material
      const { data: prog } = await supabase
        .from('material_progress')
        .select('material_id, status')
        .eq('user_id', user.id);

      const progressMap = {};
      (prog || []).forEach(p => { progressMap[p.material_id] = p.status; });

      const shaped = data.map((m, idx, arr) => {
        const matLevel = m.level_id || m.level_number || 1;
        const pStatus = progressMap[m.id];
        let status = 'locked';

        if (pStatus === 'completed') {
          status = 'completed';
        } else if (pStatus === 'in_progress') {
          status = 'active';
        } else if (matLevel > userLevel) {
          status = 'locked';
        } else if (matLevel < userLevel) {
          status = 'unlocked';
        } else {
          // In user's current level: sequential unlock
          const matsInSameLevel = arr.filter(x => (x.level_id || x.level_number || 1) === matLevel);
          const posInLevel = matsInSameLevel.findIndex(x => x.id === m.id);
          if (posInLevel <= 0) {
            status = 'active';
          } else {
            const prevMat = matsInSameLevel[posInLevel - 1];
            if (progressMap[prevMat.id] === 'completed') {
              status = 'active';
            } else {
              status = 'locked';
            }
          }
        }

        return {
          ...m,
          category: m.category_name || 'General',
          level:    m.level_number  || 1,
          cefr:     m.cefr_label    || '',
          status,
        };
      });
      setMaterials(shaped);
    } else if (!error && data) {
      setMaterials(data.map(m => ({ ...m, category: m.category_name || 'General', level: m.level_number || 1, cefr: m.cefr_label || '', status: 'unlocked' })));
    }
    setLoading(false);
  }

  const categories = ['All', ...new Set(materials.map((m) => m.category))];
  const filteredMaterials = selectedCategory === 'All' ? materials : materials.filter((m) => m.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-black text-[10px] uppercase tracking-wider border border-blue-100">
            Kurikulum Bahasa Inggris
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
              {loading ? '...' : `${materials.filter((m) => m.status === 'completed').length} / ${materials.length} Unit`}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMaterials.map((material, i) => {
          const isCompleted = material.status === 'completed';
          const isActive = material.status === 'active';
          const isLocked = material.status === 'locked';

          const getModuleTheme = (category, status) => {
            if (status === 'locked') {
              return {
                color: 'from-slate-400 to-slate-500',
                border: 'border-slate-200',
                badgeBg: 'bg-white/30',
                badgeText: 'text-white',
                icon: 'lock',
                textColor: 'text-slate-500'
              };
            }
          
            switch (category?.toLowerCase()) {
              case 'vocabulary':
                return {
                  color: 'from-cyan-500 to-blue-600',
                  border: 'border-cyan-200',
                  badgeBg: 'bg-white/20',
                  badgeText: 'text-white',
                  icon: 'menu_book',
                  textColor: 'text-cyan-600'
                };
              case 'grammar':
                return {
                  color: 'from-fuchsia-500 to-pink-600',
                  border: 'border-fuchsia-200',
                  badgeBg: 'bg-white/20',
                  badgeText: 'text-white',
                  icon: 'spellcheck',
                  textColor: 'text-fuchsia-600'
                };
              case 'reading':
                return {
                  color: 'from-emerald-500 to-teal-600',
                  border: 'border-emerald-200',
                  badgeBg: 'bg-white/20',
                  badgeText: 'text-white',
                  icon: 'chrome_reader_mode',
                  textColor: 'text-emerald-600'
                };
              case 'writing':
                return {
                  color: 'from-orange-400 to-red-500',
                  border: 'border-orange-200',
                  badgeBg: 'bg-white/20',
                  badgeText: 'text-white',
                  icon: 'edit_document',
                  textColor: 'text-orange-600'
                };
              default:
                return {
                  color: 'from-indigo-400 to-indigo-600',
                  border: 'border-indigo-200',
                  badgeBg: 'bg-white/20',
                  badgeText: 'text-white',
                  icon: 'auto_stories',
                  textColor: 'text-indigo-600'
                };
            }
          };

          const theme = getModuleTheme(material.category, material.status);

          return (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => {
                if (!isLocked) navigate(`/dashboard/modules/${material.id}`);
              }}
              className={`relative bg-white rounded-3xl border-2 ${theme.border} shadow-sm overflow-hidden transition-all duration-300 ${
                isLocked ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer hover:shadow-xl group hover:-translate-y-1'
              }`}
            >
              <div className={`bg-gradient-to-br ${theme.color} p-5 relative overflow-hidden ${isLocked ? 'grayscale-[40%]' : ''}`}>
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full" />
                <div className="absolute -right-8 -bottom-6 w-32 h-32 bg-white/10 rounded-full" />
                <div className="relative flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-sm">
                    <span className="material-symbols-outlined text-2xl text-white">{theme.icon}</span>
                  </div>
                  <div className={`${theme.badgeBg} ${theme.badgeText} text-[10px] font-black px-2.5 py-1 rounded-full backdrop-blur-sm shadow-xs uppercase`}>
                    {material.cefr || `Level ${material.level}`}
                  </div>
                </div>
                <div className="mt-3 relative">
                  <span className="text-[10px] font-black text-white/80 uppercase tracking-wider">
                    {material.unit} • {material.category}
                  </span>
                  <h3 className="text-base font-black text-white leading-tight mt-0.5">{material.title}</h3>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{material.description}</p>
                
                <div className="grid grid-cols-2 gap-2">
                   <div className="flex flex-col items-center gap-0.5 bg-slate-50 rounded-xl p-2 border border-slate-100">
                     <span className={`material-symbols-outlined text-sm ${theme.textColor}`}>
                       {isCompleted ? 'check_circle' : (isActive ? 'play_arrow' : 'lock')}
                     </span>
                     <span className="text-[10px] font-black text-slate-600">
                       {isCompleted ? 'Selesai' : (isActive ? 'Sedang Aktif' : 'Terkunci')}
                     </span>
                   </div>
                   <div className="flex flex-col items-center gap-0.5 bg-slate-50 rounded-xl p-2 border border-slate-100">
                     <span className="material-symbols-outlined text-sm text-amber-500">bolt</span>
                     <span className="text-[10px] font-black text-slate-600">+{material.xp_reward} XP</span>
                   </div>
                </div>

                {!isLocked ? (
                  <motion.button whileTap={{ scale: 0.97 }}
                    className={`w-full py-2.5 px-4 rounded-xl font-black text-xs text-white bg-gradient-to-r ${theme.color} border-b-[3px] border-black/20 shadow-sm flex items-center justify-center gap-1.5`}
                  >
                    <span className="material-symbols-outlined text-sm">{isCompleted ? 'refresh' : 'play_arrow'}</span>
                    {isCompleted ? 'Pelajari Ulang' : 'Mulai Belajar'}
                  </motion.button>
                ) : (
                  <div className="w-full py-2.5 px-4 rounded-xl font-black text-xs text-slate-400 bg-slate-100 border-b-[3px] border-slate-200 flex items-center justify-center gap-1.5 cursor-not-allowed">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    Kunci Unit Sebelumnya
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
