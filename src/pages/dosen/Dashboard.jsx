import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDataStore } from '../../store/dataStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function DosenDashboard() {
  const navigate = useNavigate();
  const { 
    lecturerData, 
    rooms, 
    activeRoomId, 
    setActiveRoom, 
    lecturerAssignments, 
    manualSubmissions, 
    gradeSubmission 
  } = useDataStore();

  const currentRoom = rooms.find(r => r.id === activeRoomId) || rooms[0];
  const pendingSubmissions = manualSubmissions.filter(s => s.status === 'pending');
  const activeSubmission = pendingSubmissions[0] || manualSubmissions[0];

  // Quick grading state in dashboard
  const [grammarVal, setGrammarVal] = useState(88);
  const [vocabVal, setVocabVal] = useState(82);
  const [fluencyVal, setFluencyVal] = useState(90);
  const [feedbackText, setFeedbackText] = useState('Penggunaan passive voice sangat tepat. Pelafalan audio jelas dan intonasi akademik terjaga.');
  const [gradeSuccess, setGradeSuccess] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Curriculum view toggle
  const [curriculumTab, setCurriculumTab] = useState('global'); // 'global' | 'custom'

  const handleQuickGrade = () => {
    if (!activeSubmission) return;
    gradeSubmission(activeSubmission.id, {
      grammarScore: grammarVal,
      vocabScore: vocabVal,
      fluencyScore: fluencyVal,
      feedback: feedbackText
    });
    setGradeSuccess(`Nilai untuk ${activeSubmission.studentName} berhasil disimpan (+50 XP diberikan)!`);
    setTimeout(() => setGradeSuccess(''), 4500);
  };

  const handleExportQuickCSV = () => {
    navigate('/dosen/grading');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      
      {/* ================= HEADER KELAS & DOSEN COMMAND CENTER ================= */}
      <section className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-extrabold text-[11px] rounded-full border border-indigo-100">
                Command Center Dosen
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 font-extrabold text-[11px] rounded-full flex items-center gap-1.5 border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {currentRoom.semester}
              </span>
              <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 font-bold text-[10px] rounded-md border border-amber-200">
                Kode Room: <strong className="font-mono font-black">{currentRoom.code}</strong>
              </span>
            </div>

            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                {currentRoom.name}
              </h1>
              <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                <span className="material-symbols-outlined text-indigo-600 text-sm">person</span>
                Dosen Pengampu: <strong className="text-slate-800">{lecturerData.lecturerName}</strong>
                <span className="text-slate-300">•</span>
                <span>NIP: {lecturerData.nip}</span>
                <span className="text-slate-300">•</span>
                <span className="text-indigo-600 font-bold">{currentRoom.schedule}</span>
              </p>
            </div>
          </div>

          {/* Quick CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Room Switcher Dropdown */}
            <div className="relative">
              <select
                value={activeRoomId}
                onChange={(e) => setActiveRoom(e.target.value)}
                className="bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs py-2.5 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>
                    🏛️ {room.shortName}
                  </option>
                ))}
              </select>
            </div>

            <Link
              to="/dosen/assignments"
              className="tactile-btn bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-black text-xs border-b-[4px] border-indigo-900 flex items-center gap-1.5 shadow-sm transition-transform active:translate-y-0.5"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              Tugaskan Misi
            </Link>

            <Link
              to="/dosen/grading"
              className="tactile-btn bg-white hover:bg-slate-50 text-slate-800 px-4 py-2.5 rounded-xl font-bold text-xs border border-slate-200 border-b-[4px] border-b-slate-300 flex items-center gap-1.5 shadow-xs transition-transform active:translate-y-0.5"
            >
              <span className="material-symbols-outlined text-emerald-600 text-base">download</span>
              Rekap Nilai (CSV)
            </Link>
          </div>
        </div>
      </section>

      {/* Grade Success Alert */}
      <AnimatePresence>
        {gradeSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-black flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 fill-icon text-lg">check_circle</span>
              {gradeSuccess}
            </div>
            <Link to="/dosen/submissions" className="text-emerald-700 underline text-[11px] font-bold">
              Lihat Antrean Lainnya →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= 4 GAMIFIED METRIC CARDS ================= */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Mahasiswa */}
        <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-xs flex flex-col justify-between hover:border-indigo-200 transition-all">
          <div className="flex justify-between items-start mb-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">group</span>
            </div>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-black border border-emerald-100">
              100% Ikut
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block">Total Mahasiswa Enrolled</span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{currentRoom.totalStudents} Mahasiswa</h3>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-emerald-500 text-xs">check_circle</span>
              Semua telah ikut placement test
            </p>
          </div>
        </div>

        {/* Card 2: Rata-rata Level Kelas */}
        <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-xs flex flex-col justify-between hover:border-indigo-200 transition-all">
          <div className="flex justify-between items-start mb-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">trending_up</span>
            </div>
            <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[10px] font-black border border-indigo-100">
              Target {currentRoom.levelTarget}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block">Rata-rata Kemampuan Kelas</span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{currentRoom.avgLevel}</h3>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full w-[68%]" />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>A2 Dasar</span>
              <span className="font-bold text-indigo-600">68% Capai B1</span>
              <span>B2 Akademik</span>
            </div>
          </div>
        </div>

        {/* Card 3: Rata-rata Streak Kelas */}
        <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-xs flex flex-col justify-between hover:border-indigo-200 transition-all">
          <div className="flex justify-between items-start mb-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl fill-icon">local_fire_department</span>
            </div>
            <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px] font-black">
              {currentRoom.streakRate} Aktif
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block">Rata-rata Streak Harian</span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">🔥 11.4 Hari Belajar</h3>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-amber-500 text-xs">bolt</span>
              Konsistensi pengerjaan quest tinggi
            </p>
          </div>
        </div>

        {/* Card 4: Antrean Penilaian Manual */}
        <div className="bg-white rounded-3xl p-5 border-2 border-rose-200 shadow-xs flex flex-col justify-between bg-rose-50/20 relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">pending_actions</span>
            </div>
            <span className="bg-rose-500 text-white px-2 py-0.5 rounded text-[10px] font-black animate-pulse">
              {pendingSubmissions.length} Tugas Masuk
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-rose-700 block">Penilaian Manual (Writing & Speaking)</span>
            <h3 className="text-xl font-black text-rose-600 mt-0.5">{pendingSubmissions.length} Submission</h3>
            <Link
              to="/dosen/submissions"
              className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold mt-1 flex items-center gap-1"
            >
              <span>Periksa esai & audio sekarang</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 2-COLUMN MAIN CONTENT: HYBRID CURRICULUM & QUICK EVALUATION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kolom Kiri (7 Cols): Hybrid Curriculum Controller & Roadmap */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Box 1: Kontrol Kurikulum Hybrid */}
          <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-600">hub</span>
                  Kontrol Kurikulum Hybrid Dosen
                </h2>
                <p className="text-[11px] text-slate-500">
                  Sinkronisasi modul global sistem & penugasan tugas kelas
                </p>
              </div>

              {/* Segmented Switcher */}
              <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setCurriculumTab('global')}
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
                    curriculumTab === 'global'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Kurikulum Global (Assigned)
                </button>
                <button
                  type="button"
                  onClick={() => setCurriculumTab('custom')}
                  className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
                    curriculumTab === 'custom'
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tugas Khusus Kelas
                </button>
              </div>
            </div>

            {/* Active Hybrid Assignment Card */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/90 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 border-b-[3px] border-indigo-900 shadow-xs">
                    <span className="material-symbols-outlined text-2xl">auto_stories</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-extrabold rounded uppercase">
                        Unit 3
                      </span>
                      <span className="text-[11px] text-indigo-800 font-bold">
                        Kurikulum Inti Bahasa Inggris
                      </span>
                    </div>
                    <h3 className="text-xs md:text-sm font-black text-slate-900 mt-1">
                      Academic Reading & Passive Voice in Scientific Abstracts
                    </h3>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full shrink-0">
                  Sedang Berjalan
                </span>
              </div>

              {/* Progress & Deadline */}
              <div className="pt-2 border-t border-indigo-100/80 flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[11px] font-bold">
                  <span className="text-slate-500">Tenggat: 14 Okt 2026, 23:59 WIB</span>
                  <span className="text-indigo-600">31 dari 38 Mahasiswa Selesai (81%)</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full w-[81%]" />
                </div>
              </div>
            </div>

            {/* Quick Action Bar */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs text-slate-600">
                <span className="material-symbols-outlined text-amber-500">lightbulb</span>
                <span>Tersedia <strong>42 Modul Global</strong> (Vocabulary, Grammar, EELS Prep).</span>
              </div>
              <Link
                to="/dosen/assignments"
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl border-b-[3px] border-indigo-900 text-center"
              >
                + Assign Modul Lain
              </Link>
            </div>
          </div>

          {/* Box 2: Visual Gamification Roadmap Snapshot */}
          <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-600">map</span>
                  Roadmap Pembelajaran Semester 3 (Quest Progress)
                </h3>
                <p className="text-[11px] text-slate-500">Alur modul yang sedang ditempuh mahasiswa di kelas ini</p>
              </div>
              <Link to="/dosen/assignments" className="text-xs font-bold text-indigo-600 hover:underline">
                Kelola Semua Misi →
              </Link>
            </div>

            {/* Visual Step Tracker */}
            <div className="flex items-center justify-between relative py-4 px-2">
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1.5 bg-slate-100 z-0">
                <div className="h-full bg-emerald-500 w-[65%]" />
              </div>

              {/* Node 1 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md border-2 border-white ring-4 ring-emerald-100">
                  <span className="material-symbols-outlined text-base">check</span>
                </div>
                <span className="text-[10px] font-bold text-slate-800 mt-1.5">Unit 1: Vocab</span>
                <span className="text-[9px] text-emerald-600 font-extrabold">100% Selesai</span>
              </div>

              {/* Node 2 */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md border-2 border-white ring-4 ring-emerald-100">
                  <span className="material-symbols-outlined text-base">check</span>
                </div>
                <span className="text-[10px] font-bold text-slate-800 mt-1.5">Unit 2: Tenses</span>
                <span className="text-[9px] text-emerald-600 font-extrabold">94% Selesai</span>
              </div>

              {/* Node 3 (Active) */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg border-2 border-white ring-4 ring-indigo-200 animate-bounce">
                  <span className="material-symbols-outlined text-base">play_arrow</span>
                </div>
                <span className="text-[10px] font-bold text-indigo-700 mt-1.5">Unit 3: Passive</span>
                <span className="text-[9px] text-indigo-600 font-extrabold">Aktif (81%)</span>
              </div>

              {/* Node 4 (Locked) */}
              <div className="relative z-10 flex flex-col items-center opacity-60">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold border-2 border-white">
                  <span className="material-symbols-outlined text-base">lock</span>
                </div>
                <span className="text-[10px] font-bold text-slate-600 mt-1.5">Unit 4: Abstract</span>
                <span className="text-[9px] text-slate-400">Minggu Depan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan (5 Cols): Live Manual Evaluation Drawer Widget */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 border-2 border-indigo-100 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-600">rate_review</span>
                <h3 className="text-sm font-black text-slate-900">Evaluasi Cepat Esai & Audio</h3>
              </div>
              <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-black rounded-full">
                Antrean {pendingSubmissions.length} Belum Dinilai
              </span>
            </div>

            {activeSubmission ? (
              <div className="space-y-4">
                {/* Student Info Card */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={activeSubmission.avatar}
                      alt={activeSubmission.studentName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{activeSubmission.studentName}</h4>
                      <p className="text-[10px] text-slate-400">NIM: {activeSubmission.nim} • {activeSubmission.submittedAt}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 text-indigo-800">
                    Esai + Audio
                  </span>
                </div>

                {/* Excerpt */}
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Kutipan Esai Mahasiswa:</p>
                  <blockquote className="mt-1 text-xs italic bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700 max-h-24 overflow-y-auto">
                    {activeSubmission.essayExcerpt}
                  </blockquote>
                </div>

                {/* Simulated Audio Player */}
                <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isPlayingAudio ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                    <div>
                      <p className="text-[11px] font-bold text-slate-800 leading-tight">
                        {activeSubmission.audioFile}
                      </p>
                      <span className="text-[9px] text-indigo-600 font-semibold">
                        {isPlayingAudio ? '▶ Sedang memutar rekaman...' : 'Klik untuk dengarkan pronunciation'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500">
                    {activeSubmission.audioDuration}
                  </span>
                </div>

                {/* Rubric Sliders */}
                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold mb-1">
                      <span className="text-slate-700">1. Grammar & Passive Accuracy</span>
                      <span className="text-indigo-600 font-mono">{grammarVal}/100</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={grammarVal}
                      onChange={(e) => setGrammarVal(e.target.value)}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold mb-1">
                      <span className="text-slate-700">2. Academic Lexical Resource</span>
                      <span className="text-indigo-600 font-mono">{vocabVal}/100</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={vocabVal}
                      onChange={(e) => setVocabVal(e.target.value)}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold mb-1">
                      <span className="text-slate-700">3. Spoken Fluency & Coherence</span>
                      <span className="text-indigo-600 font-mono">{fluencyVal}/100</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={fluencyVal}
                      onChange={(e) => setFluencyVal(e.target.value)}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                </div>

                {/* Feedback Input */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Feedback / Catatan Dosen:
                  </label>
                  <textarea
                    rows="2"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Submit Grading Button */}
                <button
                  type="button"
                  onClick={handleQuickGrade}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs border-b-[4px] border-emerald-900 flex items-center justify-center gap-2 shadow-sm transition-transform active:translate-y-0.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">verified</span>
                  Simpan Nilai & Berikan +50 XP
                </button>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <span className="material-symbols-outlined text-4xl text-emerald-500">task_alt</span>
                <p className="text-xs font-bold">Semua tugas mahasiswa telah dinilai!</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
