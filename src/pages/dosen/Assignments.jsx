import React, { useState } from 'react';
import { useDataStore } from '../../store/dataStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function DosenAssignments() {
  const { 
    rooms, 
    activeRoomId, 
    lecturerAssignments, 
    createAssignment, 
    materials 
  } = useDataStore();

  const currentRoom = rooms.find(r => r.id === activeRoomId) || rooms[0];

  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'assign_global' | 'create_custom'
  const [successToast, setSuccessToast] = useState('');

  // Form states for Assign Global Module
  const [selectedGlobalModule, setSelectedGlobalModule] = useState(materials[0]?.id || 1);
  const [globalDeadline, setGlobalDeadline] = useState('Jumat, 23:59 WIB');
  const [globalMinScore, setGlobalMinScore] = useState(70);
  const [globalXPReward, setGlobalXPReward] = useState(120);

  // Form states for Custom Task
  const [customTitle, setCustomTitle] = useState('');
  const [customType, setCustomType] = useState('custom_task'); // 'custom_task' | 'custom_quiz'
  const [customCefr, setCustomCefr] = useState('CEFR B2 Academic');
  const [customDeadline, setCustomDeadline] = useState('3 Hari Lagi (Minggu 23:59 WIB)');
  const [customRubric, setCustomRubric] = useState('Min 400 kata format IMRAD + Audio Speaking ringkasan 2 menit.');
  const [customDesc, setCustomDesc] = useState('');

  const handleAssignGlobal = (e) => {
    e.preventDefault();
    const mod = materials.find(m => m.id === Number(selectedGlobalModule)) || materials[0];

    createAssignment({
      title: `${mod.unit}: ${mod.title}`,
      type: 'global_module',
      targetUnit: mod.unit,
      cefr: mod.cefr || 'CEFR B1',
      deadline: globalDeadline,
      minScore: Number(globalMinScore),
      xpReward: Number(globalXPReward),
      rubric: `Penyelesaian seluruh modul ${mod.unit} & skor kuis minimal ${globalMinScore}%`,
      description: mod.description || `Selesaikan quest step ${mod.unit} di Quest Map.`
    });

    setSuccessToast(`Modul Global "${mod.unit}: ${mod.title}" berhasil ditugaskan ke ${currentRoom.shortName}!`);
    setActiveTab('list');
    setTimeout(() => setSuccessToast(''), 4500);
  };

  const handleCreateCustom = (e) => {
    e.preventDefault();
    if (!customTitle) return;

    createAssignment({
      title: customTitle,
      type: customType,
      targetUnit: 'Tugas Khusus Dosen',
      cefr: customCefr,
      deadline: customDeadline,
      minScore: 75,
      xpReward: 150,
      rubric: customRubric,
      description: customDesc || 'Ikuti rubrik akademik dan kumpulkan tepat waktu.'
    });

    setSuccessToast(`Tugas kustom "${customTitle}" berhasil diterbitkan ke ${currentRoom.shortName}!`);
    setCustomTitle('');
    setCustomDesc('');
    setActiveTab('list');
    setTimeout(() => setSuccessToast(''), 4500);
  };

  const filteredAssignments = lecturerAssignments.filter(
    (a) => !a.roomId || a.roomId === activeRoomId
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-black flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 fill-icon text-lg">check_circle</span>
              {successToast}
            </div>
            <button onClick={() => setSuccessToast('')} className="text-emerald-700 font-bold">
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= HEADER SECTION ================= */}
      <section className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-extrabold text-[11px] rounded-full">
              Pusat Penugasan Hybrid
            </span>
            <span className="text-xs text-slate-400">• {currentRoom.shortName}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Penugasan Misi & Tugas Akademik
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gunakan pendekatan <strong>Hybrid</strong>: Tugaskan modul dari kurikulum global EduClass atau terbitkan tugas kustom khusus kelas Anda.
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200/80 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'list'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📋 Daftar Tugas ({filteredAssignments.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('assign_global')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'assign_global'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ✨ Assign Modul Global
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('create_custom')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'create_custom'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ✍️ Buat Tugas Kustom
          </button>
        </div>
      </section>

      {/* ================= TAB 1: DAFTAR TUGAS AKTIF ================= */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAssignments.map((asg) => {
              const completionPercent = Math.round((asg.submittedCount / asg.totalCount) * 100);
              const isGlobal = asg.type === 'global_module';

              return (
                <div
                  key={asg.id}
                  className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-black text-[10px] ${
                          isGlobal
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                            : 'bg-purple-50 text-purple-700 border border-purple-100'
                        }`}
                      >
                        {isGlobal ? '🌐 Kurikulum Global (Quest Map)' : '📝 Tugas Kustom Dosen'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        +{asg.xpReward} XP
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-slate-900 leading-snug">
                      {asg.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {asg.description}
                    </p>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600 space-y-1">
                      <p className="flex items-center gap-1 font-semibold text-rose-600">
                        <span className="material-symbols-outlined text-xs">timer</span>
                        Tenggat: {asg.deadline}
                      </p>
                      <p className="flex items-center gap-1 text-slate-600">
                        <span className="material-symbols-outlined text-xs text-indigo-500">verified</span>
                        Rubrik: {asg.rubric}
                      </p>
                    </div>
                  </div>

                  {/* Submission Progress Bar */}
                  <div className="pt-3 border-t border-slate-100 space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-slate-500">Pengumpulan:</span>
                      <span className="text-indigo-600">
                        {asg.submittedCount} / {asg.totalCount} ({completionPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          completionPercent >= 80
                            ? 'bg-emerald-500'
                            : 'bg-indigo-600'
                        }`}
                        style={{ width: `${completionPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 2: ASSIGN MODUL GLOBAL ================= */}
      {activeTab === 'assign_global' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-indigo-100 shadow-sm max-w-3xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-full uppercase tracking-wider">
              Hybrid Feature: Zero-Effort Teaching
            </span>
            <h2 className="text-lg font-black text-slate-900 mt-1">
              Tugaskan Modul Global dari Quest Map
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Anda tidak perlu membuat materi dari nol. Pilih modul terstruktur CEFR yang sudah disediakan sistem untuk ditugaskan ke mahasiswa.
            </p>
          </div>

          <form onSubmit={handleAssignGlobal} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Pilih Modul Pembelajaran Global
              </label>
              <select
                value={selectedGlobalModule}
                onChange={(e) => setSelectedGlobalModule(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.unit}: {m.title} — ({m.cefr || 'CEFR Intermediate'}) • Kategori: {m.category}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tenggat Pengumpulan (Deadline)
                </label>
                <input
                  type="text"
                  required
                  value={globalDeadline}
                  onChange={(e) => setGlobalDeadline(e.target.value)}
                  placeholder="Contoh: Jumat, 23:59 WIB"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Passing Score Minimal
                </label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={globalMinScore}
                  onChange={(e) => setGlobalMinScore(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Bonus Reward XP
                </label>
                <input
                  type="number"
                  min="50"
                  max="500"
                  value={globalXPReward}
                  onChange={(e) => setGlobalXPReward(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600">info</span>
              <span>Modul yang Anda pilih akan muncul sebagai <strong>"Wajib Selesai"</strong> dengan lencana deadline di Quest Map mahasiswa kelas 3B.</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                className="tactile-btn px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl border-b-[4px] border-indigo-900 cursor-pointer"
              >
                Tugaskan ke Kelas Sekarang
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= TAB 3: BUAT TUGAS KUSTOM ================= */}
      {activeTab === 'create_custom' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-indigo-100 shadow-sm max-w-3xl mx-auto space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-black rounded-full uppercase tracking-wider">
              Custom Assignment
            </span>
            <h2 className="text-lg font-black text-slate-900 mt-1">
              Buat Tugas Kustom Khusus Kelas (Writing / Speaking / Kuis)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ideal untuk tugas mingguan spesifik topik mata kuliah, persiapan UTS/UAS, atau latihan esai akademik.
            </p>
          </div>

          <form onSubmit={handleCreateCustom} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Judul Tugas Akademik
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Academic Writing: Microservices Architecture Critical Review"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Format Tugas
                </label>
                <select
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="custom_task">Esai Writing + Audio Speaking (Manual Rubric)</option>
                  <option value="custom_quiz">Kuis Pilihan Ganda (Auto-Graded)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Standar CEFR
                </label>
                <select
                  value={customCefr}
                  onChange={(e) => setCustomCefr(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="CEFR B1 Intermediate">B1 (Intermediate)</option>
                  <option value="CEFR B2 Academic">B2 (Academic Upper-Intermediate)</option>
                  <option value="CEFR C1 Advanced">C1 (Advanced IELTS/TOEFL Level)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tenggat Waktu Pengumpulan
              </label>
              <input
                type="text"
                required
                value={customDeadline}
                onChange={(e) => setCustomDeadline(e.target.value)}
                placeholder="Contoh: 18 Okt 2026, 23:59 WIB"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Rubrik Penilaian yang Digunakan
              </label>
              <input
                type="text"
                required
                value={customRubric}
                onChange={(e) => setCustomRubric(e.target.value)}
                placeholder="Contoh: Min 400 kata format IMRAD + Audio Speaking ringkasan 2 menit."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Instruksi & Prompt Soal untuk Mahasiswa
              </label>
              <textarea
                rows="3"
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                placeholder="Tuliskan petunjuk pengerjaan tugas, struktur esai yang diharapkan, serta kriteria speaking..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                className="tactile-btn px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl border-b-[4px] border-indigo-900 cursor-pointer"
              >
                Terbitkan Tugas Kustom
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
