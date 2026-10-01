import React, { useState } from 'react';
import { useDataStore } from '../../store/dataStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function DosenGrading() {
  const { studentGrades, rooms, activeRoomId } = useDataStore();
  const currentRoom = rooms.find(r => r.id === activeRoomId) || rooms[0];

  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [exportNotice, setExportNotice] = useState('');

  // Real CSV Export Handler with UTF-8 BOM
  const handleExportCSV = () => {
    const headers = [
      'No',
      'NIM',
      'Nama Mahasiswa',
      'Level',
      'Streak Belajar (Hari)',
      'Nilai Kuis Modul (Bobot 40%)',
      'Nilai Tugas Esai (Bobot 60%)',
      'Nilai Akhir (0-100)',
      'Grade Huruf',
      'Status Kelulusan'
    ];

    const rows = studentGrades.map((st, index) => [
      index + 1,
      `"${st.nim}"`,
      `"${st.name}"`,
      `"${st.cefr}"`,
      st.streak,
      st.quizAvg,
      st.assignmentAvg,
      st.finalScore,
      `"${st.letterGrade}"`,
      `"${st.status}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Rekap_Nilai_EduClass_${currentRoom.code}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(`File CSV rekap nilai kelas ${currentRoom.shortName} berhasil diunduh!`);
    setTimeout(() => setExportNotice(''), 4500);
  };

  const filteredGrades = studentGrades.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.nim.includes(searchQuery);
    const matchesLevel = levelFilter === 'all' || st.cefr.includes(levelFilter);
    const matchesStatus = statusFilter === 'all' || st.status === statusFilter;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const avgFinalScore = (
    studentGrades.reduce((acc, curr) => acc + curr.finalScore, 0) / studentGrades.length
  ).toFixed(1);

  const passedCount = studentGrades.filter(s => s.status === 'Lulus').length;
  const passRate = Math.round((passedCount / studentGrades.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {exportNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-black flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 fill-icon text-lg">check_circle</span>
              {exportNotice}
            </div>
            <button onClick={() => setExportNotice('')} className="text-emerald-700 font-bold">
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= HEADER SECTION ================= */}
      <section className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-[11px] rounded-full border border-emerald-100">
              Rekapitulasi Akademik SIAKAD
            </span>
            <span className="text-xs text-slate-400">• {currentRoom.name}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Transkrip Nilai & Ekspor Excel/CSV
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Data penilaian terintegrasi dari kuis otomatis dan penugasan esai/speaking untuk penginputan nilai akhir semester.
          </p>
        </div>

        {/* Big Export Button */}
        <button
          type="button"
          onClick={handleExportCSV}
          className="tactile-btn bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl font-black text-xs border-b-[4px] border-emerald-900 flex items-center gap-2 shadow-sm shrink-0 cursor-pointer transition-transform active:translate-y-0.5"
        >
          <span className="material-symbols-outlined text-xl">download</span>
          Ekspor ke CSV / Excel
        </button>
      </section>

      {/* ================= 3 SUMMARY STAT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">analytics</span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block">Rata-rata Nilai Akhir</span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{avgFinalScore} / 100</h3>
            <span className="text-[10px] text-emerald-600 font-bold">Grade Rata-rata: A-</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl">verified</span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block">Tingkat Kelulusan</span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{passRate}% Mahasiswa</h3>
            <span className="text-[10px] text-slate-500 font-bold">{passedCount} dari {studentGrades.length} memenuhi standar</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-2xl fill-icon">emoji_events</span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block">Skor Tertinggi Kelas</span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">Clara Oktaviani (95.2)</h3>
            <span className="text-[10px] text-amber-600 font-bold">🔥 15 Hari Belajar Berturut</span>
          </div>
        </div>
      </div>

      {/* ================= MAIN GRADES TABLE ================= */}
      <section className="bg-white rounded-3xl border border-indigo-100 shadow-sm overflow-hidden space-y-4">
        
        {/* Table Filter Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-black text-slate-900">
              Tabel Komparasi Penilaian Mahasiswa
            </h2>
            <p className="text-xs text-slate-500">
              Formula: Nilai Akhir = (Kuis Modul × 40%) + (Tugas Writing & Speaking × 60%)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2 text-slate-400 text-sm">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari NIM / Nama..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-40 sm:w-48"
              />
            </div>

            {/* Level Filter */}
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700"
            >
              <option value="all">Semua Level</option>
              <option value="B2">Level B2</option>
              <option value="B1">Level B1</option>
              <option value="A2">Level A2</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700"
            >
              <option value="all">Semua Status</option>
              <option value="Lulus">Lulus</option>
              <option value="Perlu Perhatian">Perlu Perhatian</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-100 uppercase tracking-wider font-extrabold text-[10px]">
                <th className="py-3 px-4 text-center">No</th>
                <th className="py-3 px-4">NIM</th>
                <th className="py-3 px-4">Nama Mahasiswa</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Streak Belajar</th>
                <th className="py-3 px-4">Kuis Modul (40%)</th>
                <th className="py-3 px-4">Tugas Esai (60%)</th>
                <th className="py-3 px-4">Nilai Akhir</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredGrades.map((st, index) => (
                <tr key={st.id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="py-3.5 px-4 text-center text-slate-400 font-bold">{index + 1}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{st.nim}</td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">{st.name}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full font-black text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {st.cefr}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="flex items-center gap-1 font-bold text-amber-600">
                      <span className="material-symbols-outlined text-sm fill-icon">local_fire_department</span>
                      {st.streak} Hari
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">{st.quizAvg}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">{st.assignmentAvg}</td>
                  <td className="py-3.5 px-4 font-black font-mono text-indigo-700 text-sm">
                    {st.finalScore}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="w-7 h-7 mx-auto rounded-lg bg-indigo-100 text-indigo-800 font-black flex items-center justify-center text-xs">
                      {st.letterGrade}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        st.status === 'Lulus'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {st.status === 'Lulus' ? '✓ Lulus' : '⚠️ Perlu Perhatian'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 text-center text-xs text-slate-500 border-t border-slate-100">
          Menampilkan {filteredGrades.length} dari {studentGrades.length} mahasiswa dalam kelas {currentRoom.shortName}.
        </div>
      </section>

    </div>
  );
}
