import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../../store/dataStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { studentGrades, materials, quizzes } = useDataStore();

  const [activeModal, setActiveModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSuccess, setTaskSuccess] = useState('');

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskTitle) return;
    setTaskSuccess(`Tugas & Kuis "${taskTitle}" berhasil diterbitkan ke sistem mahasiswa!`);
    setTaskTitle('');
    setActiveModal(false);
    setTimeout(() => setTaskSuccess(''), 4000);
  };

  const handleExportCSV = () => {
    navigate('/admin/grading');
  };

  // Metrics calculation
  const totalStudents = studentGrades.length || 38;
  const avgScore = (
    studentGrades.reduce((acc, curr) => acc + curr.finalScore, 0) / (studentGrades.length || 1)
  ).toFixed(1);
  const passCount = studentGrades.filter(s => s.status === 'Lulus').length;
  const passRate = Math.round((passCount / totalStudents) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      
      {/* ================= HEADER ADMINISTRATOR ================= */}
      <section className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-amber-50 text-amber-800 font-extrabold text-[11px] rounded-full border border-amber-200">
                Pusat Kendali Administrator
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-[11px] rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Semester Ganjil 2026/2027
              </span>
              <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-md">
                EduClass Hub
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Sistem Pembelajaran & Monitoring Kuis Terpadu
            </h1>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-600 text-sm">admin_panel_settings</span>
              Pengelola: <strong className="text-slate-800">Super Administrator Akademik</strong>
              <span>• Akses Penuh: Monitoring Kuis, Modul, & Nilai Mahasiswa</span>
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveModal(true)}
              className="tactile-btn bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs border-b-[4px] border-indigo-900 flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              Terbitkan Kuis / Tugas
            </button>
            <button
              onClick={handleExportCSV}
              className="tactile-btn bg-white hover:bg-slate-50 text-slate-800 px-4 py-2.5 rounded-xl font-bold text-xs border-2 border-slate-200 border-b-[4px] border-b-slate-300 flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-emerald-600 text-base">download</span>
              Rekap Nilai (CSV)
            </button>
          </div>
        </div>
      </section>

      {/* Success Notification */}
      <AnimatePresence>
        {taskSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-black flex items-center gap-2 shadow-xs"
          >
            <span className="material-symbols-outlined text-emerald-600 fill-icon text-lg">check_circle</span>
            {taskSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= 4 METRIC CARDS ================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Mahasiswa */}
        <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">group</span>
            </div>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-black">
              100% Terdaftar
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block">Total Mahasiswa Aktif</span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{totalStudents} Mahasiswa</h3>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-emerald-500 text-xs">check_circle</span>
              Placement test telah diselesaikan
            </p>
          </div>
        </div>

        {/* Card 2: Rata-rata Level Kelas */}
        <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">trending_up</span>
            </div>
            <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[10px] font-black">
              Target B2
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block">Rata-rata Kemampuan CEFR</span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">CEFR B1 (Inter)</h3>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full w-[68%]" />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>A2 (Dasar)</span>
              <span className="font-bold text-indigo-600">68% Capai B1</span>
              <span>B2 (Mahir)</span>
            </div>
          </div>
        </div>

        {/* Card 3: Rata-rata Streak & Keaktifan */}
        <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl fill-icon">local_fire_department</span>
            </div>
            <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px] font-black">
              89% Aktif
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block">Konsistensi Belajar Harian</span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">🔥 11.4 Hari Streak</h3>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-amber-500 text-xs">bolt</span>
              Mahasiswa konsisten latihan harian
            </p>
          </div>
        </div>

        {/* Card 4: Monitoring Kuis Kelulusan */}
        <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">quiz</span>
            </div>
            <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px] font-black">
              Kelulusan {passRate}%
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block">Rata-rata Skor Kuis & Tugas</span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{avgScore} / 100</h3>
            <Link
              to="/admin/quizzes"
              className="text-[11px] text-indigo-600 font-bold hover:underline mt-1 flex items-center gap-1"
            >
              <span>Pantau monitoring kuis</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= MONITORING KUIS & EVALUASI MAHASISWA ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kolom Kiri (7 Cols): Real-time Quiz & Task Monitoring */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-indigo-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-600">monitoring</span>
                Monitoring Ketuntasan Kuis & Modul Mahasiswa
              </h3>
              <p className="text-[11px] text-slate-400">Pantau progres pengerjaan kuis real-time per modul</p>
            </div>
            <Link to="/admin/quizzes" className="text-xs font-bold text-indigo-600 hover:underline">
              Kelola Bank Soal →
            </Link>
          </div>

          <div className="space-y-3">
            {materials.map((m, idx) => {
              const submittedCount = idx === 0 ? 38 : idx === 1 ? 36 : 31;
              const percent = Math.round((submittedCount / totalStudents) * 100);
              return (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-indigo-200 transition-all space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-black rounded uppercase">
                          {m.unit}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold">{m.cefr || 'CEFR B1'}</span>
                      </div>
                      <h4 className="font-extrabold text-xs text-slate-900 mt-1">{m.title}</h4>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full">
                      Min. {m.min_score || 60}% Lulus
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pt-2 border-t border-slate-200/60">
                    <span>
                      Mahasiswa Selesai: <strong className="text-indigo-600">{submittedCount}</strong> / {totalStudents}
                    </span>
                    <span className="text-emerald-600 font-black">{percent}% Tuntas</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kolom Kanan (5 Cols): Ringkasan Nilai Tertinggi & Tindakan Cepat */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Box 1: Quick Actions */}
          <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-xs space-y-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">bolt</span>
              Menu Cepat Administrator
            </h3>
            
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <Link
                to="/admin/quizzes"
                className="p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-2xl transition-all block text-center"
              >
                <span className="material-symbols-outlined text-indigo-600 text-2xl block mb-1">quiz</span>
                <span className="text-xs font-black text-slate-800 block">Monitoring Kuis</span>
                <span className="text-[10px] text-slate-400">Bank soal & skor</span>
              </Link>

              <Link
                to="/admin/grading"
                className="p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-2xl transition-all block text-center"
              >
                <span className="material-symbols-outlined text-emerald-600 text-2xl block mb-1">table_view</span>
                <span className="text-xs font-black text-slate-800 block">Rekap Nilai</span>
                <span className="text-[10px] text-slate-400">Ekspor CSV SIAKAD</span>
              </Link>

              <Link
                to="/admin/materials"
                className="p-3 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-2xl transition-all block text-center"
              >
                <span className="material-symbols-outlined text-purple-600 text-2xl block mb-1">menu_book</span>
                <span className="text-xs font-black text-slate-800 block">Edu Module</span>
                <span className="text-[10px] text-slate-400">Kelola unit & materi</span>
              </Link>

              <Link
                to="/admin/users"
                className="p-3 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-2xl transition-all block text-center"
              >
                <span className="material-symbols-outlined text-amber-600 text-2xl block mb-1">group</span>
                <span className="text-xs font-black text-slate-800 block">Data Pengguna</span>
                <span className="text-[10px] text-slate-400">Mahasiswa & Admin</span>
              </Link>
            </div>
          </div>

          {/* Box 2: Snapshot Nilai Mahasiswa */}
          <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600">verified</span>
                Prestasi Mahasiswa Terbaik
              </h3>
              <Link to="/admin/grading" className="text-xs font-bold text-indigo-600 hover:underline">
                Lihat Semua ({totalStudents}) →
              </Link>
            </div>

            <div className="space-y-2.5">
              {studentGrades.slice(0, 4).map((st, i) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center text-xs font-black">
                      #{i + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 leading-tight">{st.name}</p>
                      <p className="text-[10px] text-slate-400">NIM: {st.nim} • {st.cefr}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-indigo-700 block font-mono">
                      {st.finalScore} / 100
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">Grade {st.letterGrade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ================= MODAL TERBITKAN TUGAS / KUIS ================= */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-indigo-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-black text-slate-900">Terbitkan Kuis / Tugas Baru</h3>
              <button
                onClick={() => setActiveModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Judul Kuis / Tugas
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Contoh: Academic Writing: Literature Review Analysis"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Tenggat Waktu Pengerjaan
                </label>
                <input
                  type="text"
                  defaultValue="3 Hari Lagi (Jumat 23:59 WIB)"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Instruksi & Rubrik Kelulusan
                </label>
                <textarea
                  rows="3"
                  defaultValue="Skor minimal kelulusan kuis 75%. Esai minimal 350 kata menggunakan passive voice akademik."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="tactile-btn px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl border-b-[4px] border-indigo-900 cursor-pointer"
                >
                  Terbitkan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
