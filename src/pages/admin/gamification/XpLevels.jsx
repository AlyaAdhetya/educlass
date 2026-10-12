import React, { useState } from 'react';
import { useDataStore } from '../../../store/dataStore';
import { Zap, Trophy, Plus, Edit, Trash2, Settings2, X, Check, AlertCircle } from 'lucide-react';

export default function AdminXpLevels() {
  const { levels, xpConfig, updateXpConfig, updateLevel, addLevel, deleteLevel } = useDataStore();

  // ===== XP CONFIG LOCAL STATE =====
  const [localXp, setLocalXp] = useState(() =>
    Object.fromEntries(Object.entries(xpConfig).map(([k, v]) => [k, v.value]))
  );
  const [xpSaved, setXpSaved] = useState(false);

  const handleXpChange = (key, val) => {
    setLocalXp(prev => ({ ...prev, [key]: Number(val) }));
    setXpSaved(false);
  };

  const handleSaveXp = () => {
    Object.entries(localXp).forEach(([key, val]) => updateXpConfig(key, val));
    setXpSaved(true);
    setTimeout(() => setXpSaved(false), 2500);
  };

  // ===== LEVEL MODALS =====
  const [isAddLevelOpen, setIsAddLevelOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState(null);
  const [deleteLevelId, setDeleteLevelId] = useState(null);

  const badgeOptions = ['🌱', '📖', '🔍', '⭐', '🏆', '👑', '🎖️', '💎', '🔥'];
  const colorOptions = ['gray', 'blue', 'indigo', 'violet', 'amber', 'rose'];

  const emptyLevelForm = {
    name: '',
    xpRequired: 0,
    badge: '🌱',
    color: 'indigo',
    description: '',
    perks: '',
  };
  const [levelForm, setLevelForm] = useState(emptyLevelForm);

  const openAddLevel = () => {
    setLevelForm(emptyLevelForm);
    setIsAddLevelOpen(true);
  };

  const openEditLevel = (level) => {
    setLevelForm({
      name: level.name,
      xpRequired: level.xpRequired,
      badge: level.badge,
      color: level.color,
      description: level.description,
      perks: level.perks,
    });
    setEditingLevel(level);
  };

  const handleLevelSubmit = (e) => {
    e.preventDefault();
    if (editingLevel) {
      updateLevel(editingLevel.id, { ...levelForm, xpRequired: Number(levelForm.xpRequired) });
      setEditingLevel(null);
    } else {
      const nextLevelNum = levels.length + 1;
      addLevel({ ...levelForm, level: nextLevelNum, xpRequired: Number(levelForm.xpRequired) });
      setIsAddLevelOpen(false);
    }
  };

  const handleDeleteLevel = () => {
    deleteLevel(deleteLevelId);
    setDeleteLevelId(null);
  };

  const bgMap = {
    gray: 'bg-slate-100', blue: 'bg-blue-100', indigo: 'bg-indigo-100',
    violet: 'bg-violet-100', amber: 'bg-amber-100', rose: 'bg-rose-100'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
      
      {/* TOAST */}
      {xpSaved && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold">Konfigurasi XP berhasil disimpan!</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">XP & Level System</h1>
          <p className="text-slate-500 text-sm mt-1">Configure experience points logic and student progression levels.</p>
        </div>
        <button
          onClick={handleSaveXp}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <Settings2 className="w-4 h-4" /> Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ===== XP CONFIGURATION ===== */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Zap className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Experience Points (XP)</h2>
              <p className="text-xs text-slate-500">Configure how much XP students earn per action</p>
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(xpConfig).map(([key, config]) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:border-amber-200 transition-colors">
                <div className="pr-4">
                  <p className="text-sm font-bold text-slate-800">{config.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{config.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number"
                    min={0}
                    max={999}
                    value={localXp[key] ?? config.value}
                    onChange={(e) => handleXpChange(key, e.target.value)}
                    className="w-20 px-3 py-1.5 text-right font-black text-amber-600 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-text"
                  />
                  <span className="text-[10px] font-bold text-slate-400">XP</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveXp}
            className="mt-5 w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" /> Simpan Perubahan XP
          </button>
        </div>

        {/* ===== LEVEL PROGRESSION ===== */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Level Progression</h2>
                <p className="text-xs text-slate-500">Define level thresholds and perks</p>
              </div>
            </div>
            <button
              onClick={openAddLevel}
              className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
              title="Tambah Level Baru"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 relative">
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-100 z-0" />

            {levels.map((level, index) => (
              <div key={level.id} className="relative z-10 flex gap-4 group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 border-4 border-white shadow-xs ${bgMap[level.color] || 'bg-slate-100'}`}>
                  {level.badge}
                </div>
                
                <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs group-hover:border-indigo-300 transition-colors">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Level {level.level}</span>
                      <h3 className="text-base font-black text-slate-900">{level.name}</h3>
                    </div>
                    <span className="text-xs font-black text-amber-500 bg-amber-50 px-2 py-1 rounded-lg shrink-0">
                      {level.xpRequired.toLocaleString()} XP
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-500">{level.description}</p>
                  
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                      Perk: {level.perks}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditLevel(level)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Level"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {index > 0 && (
                        <button
                          onClick={() => setDeleteLevelId(level.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Level"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== MODAL ADD / EDIT LEVEL ===== */}
      {(isAddLevelOpen || editingLevel) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {editingLevel ? `Edit Level ${editingLevel.level}` : 'Tambah Level Baru'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Konfigurasi threshold XP dan perks level mahasiswa</p>
              </div>
              <button
                onClick={() => { setIsAddLevelOpen(false); setEditingLevel(null); }}
                className="w-7 h-7 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLevelSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Level <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={levelForm.name}
                    onChange={(e) => setLevelForm({ ...levelForm, name: e.target.value })}
                    placeholder="Contoh: Advanced Learner"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Minimal XP <span className="text-rose-500">*</span></label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={levelForm.xpRequired}
                    onChange={(e) => setLevelForm({ ...levelForm, xpRequired: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Level</label>
                <input
                  type="text"
                  value={levelForm.description}
                  onChange={(e) => setLevelForm({ ...levelForm, description: e.target.value })}
                  placeholder="Deskripsi singkat kemampuan mahasiswa di level ini"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Perk / Keuntungan</label>
                <input
                  type="text"
                  value={levelForm.perks}
                  onChange={(e) => setLevelForm({ ...levelForm, perks: e.target.value })}
                  placeholder="Contoh: Access to quiz arena + intermediate materials"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Badge Emoji</label>
                  <div className="flex flex-wrap gap-2">
                    {badgeOptions.map(b => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setLevelForm({ ...levelForm, badge: b })}
                        className={`text-xl p-1.5 rounded-lg transition-all cursor-pointer ${levelForm.badge === b ? 'bg-indigo-100 ring-2 ring-indigo-500' : 'hover:bg-slate-100'}`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Warna Badge</label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setLevelForm({ ...levelForm, color: c })}
                        className={`w-7 h-7 rounded-full transition-all cursor-pointer ${bgMap[c]} ${levelForm.color === c ? 'ring-2 ring-offset-1 ring-indigo-500 scale-110' : 'hover:scale-110'}`}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsAddLevelOpen(false); setEditingLevel(null); }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  {editingLevel ? 'Simpan Perubahan' : 'Tambah Level'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== MODAL DELETE CONFIRMATION ===== */}
      {deleteLevelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 max-w-sm w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900">Hapus Level Ini?</h4>
              <p className="text-xs text-slate-500 mt-1">Level yang dihapus tidak dapat dipulihkan. Lanjutkan?</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteLevelId(null)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteLevel}
                className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
