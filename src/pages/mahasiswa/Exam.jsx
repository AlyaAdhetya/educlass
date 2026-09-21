import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MI = ({ name, fill = false, className = '' }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={{ fontVariationSettings: fill ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400", display: 'inline-block', verticalAlign: 'middle', lineHeight: 1 }}
  >
    {name}
  </span>
);

const QUESTIONS = [
  {
    id: 1, section: 'Structure & Written Expression', level: 'B2', type: 'Written Expression',
    prompt: 'Identify the one underlined word or phrase that must be changed:',
    sentence: '"During the early nineteenth century, (A) although the steam-powered locomotive drastically transformed freight transit, the overland transportation of perishable goods (B) remained strikingly difficult until the introduction of (C) refrigeration railway cars that operated (D) more efficient than previous ice-cooled freight models."',
    options: [{ id: 'A', word: 'although', hint: 'Conjunction (Line 1)', correct: false }, { id: 'B', word: 'remained', hint: 'Past tense (Line 2)', correct: false }, { id: 'C', word: 'refrigeration', hint: 'Noun adjunct (Line 3)', correct: false }, { id: 'D', word: 'more efficient', hint: 'Should be: "more efficiently"', correct: true }],
  },
  {
    id: 2, section: 'Structure & Written Expression', level: 'B1', type: 'Structure',
    prompt: 'Choose the one word or phrase that best completes the sentence:',
    sentence: '"By the time the researchers _____ their findings, the committee had already made a decision."',
    options: [{ id: 'A', word: 'will publish', hint: 'Future tense', correct: false }, { id: 'B', word: 'published', hint: 'Simple past', correct: true }, { id: 'C', word: 'have published', hint: 'Present perfect', correct: false }, { id: 'D', word: 'are publishing', hint: 'Present progressive', correct: false }],
  },
];

const TOTAL_Q = 40;
const ANSWERED = new Set([1,2,3,4,5,7,8,9,10,11,14,15,16,17,18,19,20]);
const FLAGGED = new Set([6,13]);

export default function ExamSimulation() {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState({ 0: 'D', 1: '' });
  const [flagged, setFlagged] = useState(new Set([13]));
  const [showSubmit, setShowSubmit] = useState(false);
  const [timeLeft, setTimeLeft] = useState(23 * 60 + 45);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const q = QUESTIONS[currentQ] || QUESTIONS[0];
  const isFlagged = flagged.has(q.id);
  const isLow = timeLeft < 5 * 60;

  const toggleFlag = () => setFlagged(prev => {
    const n = new Set(prev);
    if (n.has(q.id)) n.delete(q.id); else n.add(q.id);
    return n;
  });

  const getQStatus = (n) => {
    const qn = n;
    if (ANSWERED.has(qn) || selected[currentQ]) return 'answered';
    if (FLAGGED.has(qn) || flagged.has(qn)) return 'flagged';
    return 'empty';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#131b2e] flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-white shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between px-4 lg:px-6 py-2.5 gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-[#006948] tracking-tight">EduClass</span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#EEF2FF] text-[#4b41e1] border border-[#e2dfff]">INSTITUTIONAL SIMULATION</span>
          </div>
          <div className="hidden md:block w-px h-5 bg-[#E2E8F0]" />
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-[#131b2e] truncate max-w-md lg:max-w-xl">
              EduClass TOEFL ITP Simulation – Section 2: Structure & Written Expression
            </h1>
            <span className="text-xs text-[#64748B]">Kelas: ENGL-302 | Pengawas: Dosen Penilai</span>
          </div>
        </div>
        <div className="flex items-center justify-between md:justify-end gap-3">
          {/* Timer */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border shadow-sm ${isLow ? 'bg-[#FFF7ED] border-[#EA580C]/30 text-[#EA580C] animate-pulse' : 'bg-[#f2f3ff] border-[#E2E8F0] text-[#131b2e]'}`}>
            <MI name="timer" className={`text-lg ${isLow ? 'text-[#EA580C]' : 'text-[#64748B]'}`} />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold leading-none">SISA WAKTU</span>
              <span className="font-bold tracking-tight text-base leading-none">{fmt(timeLeft)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[#F8FAFC] text-[#131b2e] border border-[#E2E8F0] text-xs font-semibold hover:bg-[#f2f3ff]">
              <MI name="menu_book" className="text-[#64748B]" />
              <span>Panduan Ujian</span>
            </button>
            <button
              className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${isFlagged ? 'bg-amber-200 border-amber-400 text-[#8d4b00]' : 'bg-[#FFFBEB] text-[#8d4b00] border-amber-300 hover:bg-amber-100'}`}
              onClick={toggleFlag}
            >
              <MI name="flag" className="text-[#8d4b00]" />
              <span className="hidden md:inline">{isFlagged ? 'Ragu-ragu Terpasang 🚩' : 'Flag Soal (Ragu-ragu)'}</span>
            </button>
            <button
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#006948] text-white font-bold text-xs border-b-[3px] border-[#047857] active:translate-y-0.5"
              onClick={() => setShowSubmit(true)}
            >
              <MI name="send" className="text-white" />
              <span>Kirim Jawaban Akhir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <section className="lg:col-span-8 flex flex-col gap-4">
          {/* General Directions */}
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1.5 text-[#4b41e1]">
              <MI name="info" className="text-[#4b41e1]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#4b41e1]">General Directions</h2>
            </div>
            <p className="text-sm text-[#131b2e]">
              Questions 11–15 are based on academic passage and grammatical conventions. In each sentence, choose the one word or phrase that correctly completes the sentence or the underlined section that must be modified to satisfy formal American English syntax.
            </p>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-4 lg:p-6 shadow-sm flex flex-col gap-4">
            {/* Header Row */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-[#4b41e1] text-white text-xs font-semibold">Question {currentQ + 1} of 40</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EEF2FF] text-[#4b41e1]">{q.type}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ECFDF5] text-[#006948]">CEFR Level {q.level}</span>
              </div>
              <button
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold border transition-colors ${isFlagged ? 'bg-amber-200 border-amber-400 text-[#8d4b00]' : 'bg-[#FFFBEB] border-amber-300 text-[#8d4b00] hover:bg-amber-100'}`}
                onClick={toggleFlag}
              >
                <MI name="flag" className="text-sm text-[#8d4b00]" />
                <span>{isFlagged ? 'Ragu-ragu 🚩' : 'Flag Soal 🚩'}</span>
              </button>
            </div>

            {/* Prompt */}
            <p className="text-sm font-semibold text-[#131b2e]">{q.prompt}</p>

            {/* Sentence */}
            <div className="p-4 lg:p-6 bg-[#f2f3ff] rounded-lg border border-[#E2E8F0] text-[#131b2e] text-base leading-relaxed font-serif">
              {q.sentence}
            </div>

            {/* Options */}
            <div className="space-y-3" role="radiogroup">
              {q.options.map(opt => {
                const sel = selected[currentQ] === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-150 ${
                      sel ? 'border-[#4b41e1] bg-[#EEF2FF] shadow-sm' : 'border-[#E2E8F0] bg-white hover:border-[#4b41e1]/40'
                    }`}
                    onClick={() => setSelected(prev => ({ ...prev, [currentQ]: opt.id }))}
                  >
                    <span className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-sm ${sel ? 'bg-[#4b41e1] text-white border-[#4b41e1]' : 'border-[#E2E8F0] text-[#64748B] bg-[#F8FAFC]'}`}>
                      {opt.id}
                    </span>
                    <div className="flex-1">
                      <span className={`font-bold ${sel ? 'text-[#4b41e1]' : 'text-[#131b2e]'}`}>{opt.word}</span>
                      <span className="text-xs text-[#64748B] ml-2">{opt.hint}</span>
                    </div>
                    {sel && <MI name="check_circle" fill className="text-[#4b41e1] text-xl" />}
                  </label>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#E2E8F0]">
              <button
                disabled={currentQ === 0}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#131b2e] font-semibold text-xs disabled:opacity-40"
                onClick={() => setCurrentQ(c => c - 1)}
              >
                <MI name="arrow_back" />
                <span>Soal Sebelumnya</span>
              </button>
              <div className="text-xs text-[#64748B]">Auto-saved: <span className="text-[#006948] font-semibold">12:04:18 WIB</span></div>
              <button
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-[#006948] text-white font-bold text-xs border-b-[3px] border-[#047857] active:translate-y-0.5"
                onClick={() => setCurrentQ(c => Math.min(c + 1, QUESTIONS.length - 1))}
              >
                <span>Soal Selanjutnya</span>
                <MI name="arrow_forward" className="text-white" />
              </button>
            </div>
          </div>

          {/* Tip */}
          <div className="bg-[#f2f3ff] rounded-lg p-4 border border-[#E2E8F0] flex items-start gap-3">
            <MI name="psychology" className="text-[#64748B] mt-0.5" />
            <div>
              <span className="text-xs font-bold text-[#131b2e]">Tips TOEFL Structure Section</span>
              <p className="text-xs text-[#64748B] mt-0.5">
                Pastikan memeriksa kesesuaian antara subjek dan kata kerja (subject-verb agreement), bentuk paralelisme dalam klausa panjang, serta konversi penggunaan kata sifat (adjective) versus kata keterangan (adverb) yang mendeskripsikan tindakan.
              </p>
            </div>
          </div>
        </section>

        {/* Right Column */}
        <aside className="lg:col-span-4 flex flex-col gap-4">
          {/* Progress Widget */}
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#131b2e]">Kemajuan Ujian</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#006948]">50% Terselesaikan</span>
            </div>
            <div className="w-full bg-[#E2E8F0] h-2.5 rounded-full overflow-hidden mb-3">
              <div className="bg-gradient-to-r from-emerald-500 to-[#006948] h-full rounded-full" style={{ width: '50%' }} />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E2E8F0] text-center">
              <div className="flex flex-col items-center p-1.5 rounded bg-[#ECFDF5]/60">
                <span className="font-bold text-[#006948] text-base">18</span>
                <span className="text-[10px] text-[#006948]">Terjawab</span>
              </div>
              <div className="flex flex-col items-center p-1.5 rounded bg-[#FFFBEB]">
                <span className="font-bold text-[#8d4b00] text-base">2</span>
                <span className="text-[10px] text-[#8d4b00]">Ragu-ragu</span>
              </div>
              <div className="flex flex-col items-center p-1.5 rounded bg-[#F8FAFC]">
                <span className="font-bold text-[#64748B] text-base">20</span>
                <span className="text-[10px] text-[#64748B]">Belum Ada</span>
              </div>
            </div>
          </div>

          {/* Audio Player */}
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <MI name="volume_up" className="text-[#4b41e1]" />
                <span className="text-xs font-bold text-[#131b2e]">Listening Track Preview</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-[#F8FAFC] text-[#64748B] rounded">Sec 1 Audio</span>
            </div>
            <p className="text-xs text-[#64748B] mb-2">Academic Lecture 4: Geothermal Energy</p>
            <div className="h-8 bg-[#f2f3ff] rounded flex items-center justify-center px-3 gap-1 overflow-hidden">
              {[3,5,2,6,4,7,3,5,2,4,3,5,2,6,3].map((h, i) => (
                <div key={i} className={`w-1 rounded-full ${i < 8 ? 'bg-[#4b41e1]' : 'bg-[#bccac0]'} ${i === 3 || i === 5 ? 'animate-pulse' : ''}`} style={{ height: `${h * 4}px` }} />
              ))}
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#64748B] mt-1.5">
              <span>01:14</span>
              <span className="text-[#006948] font-semibold">Audio Selesai Diputar</span>
              <span>02:45</span>
            </div>
          </div>

          {/* Question Palette */}
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-4 shadow-sm flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E2E8F0]">
              <span className="text-xs font-bold text-[#131b2e]">Nomor Soal (1–40)</span>
              <span className="text-xs text-[#64748B]">Klik untuk berpindah</span>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 overflow-y-auto max-h-80 p-1">
              {[...Array(TOTAL_Q)].map((_, i) => {
                const n = i + 1;
                const isActive = n === currentQ + 1;
                const status = getQStatus(n);
                return (
                  <button
                    key={n}
                    className={`h-9 w-9 mx-auto rounded-lg text-xs font-bold flex items-center justify-center relative transition-all active:scale-95 ${
                      isActive ? 'bg-[#4b41e1] text-white ring-2 ring-[#4b41e1] ring-offset-2 shadow' :
                      status === 'answered' ? 'bg-[#ECFDF5] border-2 border-[#006948] text-[#006948]' :
                      status === 'flagged' ? 'bg-[#FFFBEB] border-2 border-[#8d4b00] text-[#8d4b00]' :
                      'bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#4b41e1] hover:text-[#4b41e1]'
                    }`}
                    onClick={() => setCurrentQ(i)}
                  >
                    {n}
                    {status === 'flagged' && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#8d4b00] rounded-full" />}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
              <span className="flex items-center gap-1">
                <MI name="lock" className="text-[#006948] text-sm" />
                Secure Lockdown Active
              </span>
              <span className="text-xs text-[#4b41e1] font-semibold">Sesi: #2024-ENG302</span>
            </div>
          </div>
        </aside>
      </main>

      {/* Submit Modal */}
      {showSubmit && (
        <div className="fixed inset-0 bg-[#283044]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-[#E2E8F0] p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-3 text-[#4b41e1]">
              <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center">
                <MI name="assignment_turned_in" fill className="text-[#4b41e1]" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#131b2e]">Konfirmasi Selesai Ujian</h3>
                <p className="text-xs text-[#64748B]">Section 2: Structure & Written Expression</p>
              </div>
            </div>
            <div className="bg-[#f2f3ff] rounded-lg p-3 text-xs space-y-1.5 border border-[#E2E8F0]">
              <div className="flex justify-between"><span className="text-[#64748B]">Total Soal:</span><span className="font-bold text-[#131b2e]">40 Soal</span></div>
              <div className="flex justify-between"><span className="text-[#64748B]">Sudah Terjawab:</span><span className="font-bold text-[#006948]">18 Soal</span></div>
              <div className="flex justify-between"><span className="text-[#64748B]">Masih Ragu-ragu:</span><span className="font-bold text-[#8d4b00]">2 Soal</span></div>
              <div className="flex justify-between"><span className="text-[#64748B]">Belum Terjawab:</span><span className="font-bold text-[#E11D48]">20 Soal</span></div>
            </div>
            <p className="text-xs text-[#64748B]">Apakah Anda yakin ingin mengakhiri sesi ujian simulasi ini? Lembar jawaban akan langsung dievaluasi oleh sistem EduClass.</p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button className="px-4 py-2 rounded-lg bg-[#F8FAFC] hover:bg-[#f2f3ff] border border-[#E2E8F0] text-[#131b2e] font-semibold text-xs" onClick={() => setShowSubmit(false)}>
                Lanjut Mengerjakan
              </button>
              <button className="px-4 py-2 rounded-lg bg-[#006948] text-white font-bold text-xs border-b-[3px] border-[#047857]" onClick={() => navigate('/dashboard')}>
                Ya, Kirim Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
