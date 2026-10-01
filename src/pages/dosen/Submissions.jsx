import React, { useState } from 'react';
import { useDataStore } from '../../store/dataStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function DosenSubmissions() {
  const { manualSubmissions, gradeSubmission, rooms, activeRoomId } = useDataStore();
  const currentRoom = rooms.find(r => r.id === activeRoomId) || rooms[0];

  const [selectedSubId, setSelectedSubId] = useState(manualSubmissions[0]?.id || 'sub-1');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'pending' | 'graded'
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const selectedSub = manualSubmissions.find(s => s.id === selectedSubId) || manualSubmissions[0];

  // Form states initialized with selected submission data
  const [grammarScore, setGrammarScore] = useState(selectedSub?.grammarScore || 85);
  const [vocabScore, setVocabScore] = useState(selectedSub?.vocabScore || 85);
  const [fluencyScore, setFluencyScore] = useState(selectedSub?.fluencyScore || 85);
  const [feedback, setFeedback] = useState(selectedSub?.feedback || '');

  // When clicking another submission, sync the rubric values
  const handleSelectSubmission = (sub) => {
    setSelectedSubId(sub.id);
    setGrammarScore(sub.grammarScore || 85);
    setVocabScore(sub.vocabScore || 85);
    setFluencyScore(sub.fluencyScore || 85);
    setFeedback(sub.feedback || '');
    setIsPlayingAudio(false);
  };

  const handleSaveGrade = (e) => {
    e.preventDefault();
    if (!selectedSub) return;

    gradeSubmission(selectedSub.id, {
      grammarScore,
      vocabScore,
      fluencyScore,
      feedback
    });

    const compositeScore = Math.round((Number(grammarScore) + Number(vocabScore) + Number(fluencyScore)) / 3);
    setSuccessToast(`Nilai (${compositeScore}/100) untuk ${selectedSub.studentName} tersimpan & +50 XP diberikan!`);
    setTimeout(() => setSuccessToast(''), 4500);
  };

  const filteredList = manualSubmissions.filter((sub) => {
    if (filterStatus === 'pending') return sub.status === 'pending';
    if (filterStatus === 'graded') return sub.status === 'graded';
    return true;
  });

  const pendingCount = manualSubmissions.filter(s => s.status === 'pending').length;
  const compositeScore = Math.round((Number(grammarScore) + Number(vocabScore) + Number(fluencyScore)) / 3);

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
            <span className="px-3 py-1 bg-rose-50 text-rose-700 font-extrabold text-[11px] rounded-full border border-rose-100">
              Evaluasi Manual Dosen
            </span>
            <span className="text-xs text-slate-400">• {pendingCount} Submission Menunggu Penilaian</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Rubrik Penilaian Writing & Speaking
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Berikan evaluasi kualitatif dan skor objektif menggunakan indikator penilaian untuk esai teks dan rekaman audio mahasiswa.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200/80 shrink-0">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({manualSubmissions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              filterStatus === 'pending'
                ? 'bg-white text-rose-600 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⏳ Perlu Dinilai ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('graded')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              filterStatus === 'graded'
                ? 'bg-white text-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ✓ Selesai
          </button>
        </div>
      </section>

      {/* ================= 2-COLUMN EVALUATION WORKSPACE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Kolom Kiri: Roster Submissions (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider px-1">
            Daftar Berkas Mahasiswa ({filteredList.length})
          </h3>

          <div className="space-y-2.5">
            {filteredList.map((sub) => {
              const isSelected = sub.id === selectedSub?.id;
              const isPending = sub.status === 'pending';

              return (
                <div
                  key={sub.id}
                  onClick={() => handleSelectSubmission(sub)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-400 shadow-sm scale-[1.01]'
                      : 'bg-white border-slate-200 hover:border-indigo-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={sub.avatar}
                        alt={sub.studentName}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="text-xs font-black text-slate-900 leading-tight">
                          {sub.studentName}
                        </h4>
                        <p className="text-[10px] text-slate-400">NIM: {sub.nim}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                        isPending
                          ? 'bg-rose-100 text-rose-700 animate-pulse'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isPending ? 'Perlu Dinilai' : `Nilai: ${sub.finalScore}`}
                    </span>
                  </div>

                  <p className="text-[11px] font-bold text-slate-700 line-clamp-1">
                    {sub.taskTitle}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>{sub.submittedAt}</span>
                    <span className="font-mono text-indigo-600 font-bold">{sub.audioDuration}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kolom Kanan: Detail Submisi & Interactive Rubric Form (8 Cols) */}
        <div className="lg:col-span-8">
          {selectedSub ? (
            <form onSubmit={handleSaveGrade} className="bg-white rounded-3xl p-6 md:p-8 border border-indigo-100 shadow-sm space-y-6">
              
              {/* Submission Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedSub.avatar}
                    alt={selectedSub.studentName}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-indigo-200"
                  />
                  <div>
                    <h2 className="text-base font-black text-slate-900">{selectedSub.studentName}</h2>
                    <p className="text-xs text-slate-500">
                      NIM: <strong className="font-mono text-slate-800">{selectedSub.nim}</strong> • Kelas 3B (TI-2024) • {selectedSub.submittedAt}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Prediksi Nilai Akhir</span>
                  <span className="text-2xl font-black text-indigo-600 font-mono">
                    {compositeScore} <span className="text-xs text-slate-400">/ 100</span>
                  </span>
                </div>
              </div>

              {/* Task Subject */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700">
                <span className="font-bold text-slate-900 block mb-0.5">Topik Penugasan:</span>
                <span className="text-indigo-800 font-semibold">{selectedSub.topic}</span>
              </div>

              {/* SECTION 1: ESSAY TEXT VIEWER */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-indigo-600 text-base">description</span>
                    Naskah Esai Mahasiswa (Writing)
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md">
                    Format IMRAD • 412 Kata
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans max-h-56 overflow-y-auto whitespace-pre-line select-text">
                  {selectedSub.fullEssay || selectedSub.essayExcerpt}
                </div>
              </div>

              {/* SECTION 2: AUDIO SPEAKING PLAYER */}
              <div className="space-y-2">
                <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <span className="material-symbols-outlined text-indigo-600 text-base">mic</span>
                  Rekaman Audio Oral (Speaking Response)
                </h3>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="w-10 h-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shrink-0 shadow-sm transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xl">
                        {isPlayingAudio ? 'pause' : 'play_arrow'}
                      </span>
                    </button>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{selectedSub.audioFile}</h4>
                      <p className="text-[10px] text-slate-500">
                        {isPlayingAudio ? '▶ Sedang memutar suara rekaman mahasiswa...' : 'Klik putar untuk mengecek artikulasi, intonasi, & kelancaran'}
                      </p>
                    </div>
                  </div>

                  {/* Waveform / Duration */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <div className="flex items-end gap-0.5 h-6">
                      {[40, 70, 90, 50, 80, 100, 60, 85, 45, 95, 75, 50].map((h, i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-full transition-all ${
                            isPlayingAudio ? 'bg-indigo-600 animate-pulse' : 'bg-slate-300'
                          }`}
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-600 ml-2">
                      {selectedSub.audioDuration}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: INTERACTIVE RUBRIC SLIDERS */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-indigo-600 text-base">tune</span>
                  Rubrik Penilaian (Skala 0 - 100)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Slider 1 */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-800">Grammar & Syntax</span>
                      <span className="text-indigo-600 font-mono font-black">{grammarScore}/100</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={grammarScore}
                      onChange={(e) => setGrammarScore(e.target.value)}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <span className="text-[10px] text-slate-400 block">Ketepatan passive voice & inversi</span>
                  </div>

                  {/* Slider 2 */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-800">Academic Lexical</span>
                      <span className="text-indigo-600 font-mono font-black">{vocabScore}/100</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={vocabScore}
                      onChange={(e) => setVocabScore(e.target.value)}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <span className="text-[10px] text-slate-400 block">Kekayaan kosakata akademik</span>
                  </div>

                  {/* Slider 3 */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-800">Coherence & Fluency</span>
                      <span className="text-indigo-600 font-mono font-black">{fluencyScore}/100</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={fluencyScore}
                      onChange={(e) => setFluencyScore(e.target.value)}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <span className="text-[10px] text-slate-400 block">Kelancaran berbicara & transisi</span>
                  </div>
                </div>
              </div>

              {/* SECTION 4: QUALITATIVE FEEDBACK */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block">
                  Catatan Kualitatif / Feedback Dosen:
                </label>
                <textarea
                  rows="3"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Berikan saran konstruktif untuk mahasiswa..."
                  className="w-full text-xs p-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* ACTION BUTTON */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="tactile-btn px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl border-b-[4px] border-emerald-900 flex items-center gap-2 shadow-md cursor-pointer transition-transform active:translate-y-0.5"
                >
                  <span className="material-symbols-outlined text-lg">verified</span>
                  Simpan Nilai ({compositeScore}/100) & Berikan +50 XP
                </button>
              </div>

            </form>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-indigo-100">
              <span className="material-symbols-outlined text-5xl text-slate-300">drafts</span>
              <p className="text-sm font-bold text-slate-600 mt-2">Pilih mahasiswa di sebelah kiri untuk mulai menilai</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
