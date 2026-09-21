import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MI = ({ name, fill = false, className = '' }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={{ fontVariationSettings: fill ? "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24" : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24", display: 'inline-block', verticalAlign: 'middle', lineHeight: 1 }}
  >
    {name}
  </span>
);

const questions = [
  { q: 'Pilih konjungsi akademis yang tepat:', sentence: 'The university library extended its opening hours during final exam week; _____, students reported significantly reduced study-related stress.', blank: 'subsequently', options: [{ id: 'A', word: 'subsequently', hint: 'konsekuensi / kelanjutan logis', correct: true }, { id: 'B', word: 'on the contrary', hint: 'pertentangan / kontras', correct: false }, { id: 'C', word: 'in spite of', hint: 'konsesi / pertentangan', correct: false }, { id: 'D', word: 'otherwise', hint: 'kondisional / jika tidak', correct: false }], tip: '💡 "Subsequently" menunjukkan hubungan sebab-akibat waktu yang logis dalam penulisan ilmiah formal. Gunakan setelah tanda titik koma (;) untuk menghubungkan dua klausa independen.' },
  { q: 'Pilih kata yang tepat melengkapi kalimat:', sentence: 'She has been studying English _____ three years.', blank: 'for', options: [{ id: 'A', word: 'for', hint: 'durasi waktu', correct: true }, { id: 'B', word: 'since', hint: 'titik waktu tertentu', correct: false }, { id: 'C', word: 'during', hint: 'selama periode tertentu', correct: false }, { id: 'D', word: 'while', hint: 'bersamaan dengan', correct: false }], tip: '💡 "For" digunakan dengan durasi waktu (3 years, a week). "Since" digunakan dengan titik waktu spesifik (2020, last Monday).' },
];

export default function MicroLesson() {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState('');
  const [answered, setAnswered] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const [sessionXP, setSessionXP] = useState(0);
  const [lives, setLives] = useState(3);

  const q = questions[currentQ];
  const progress = ((currentQ) / questions.length) * 100;
  const correct = selected && q.options.find(o => o.id === selected)?.correct;

  const handleAnswer = () => {
    if (!selected) return;
    setAnswered(true);
    if (correct) setSessionXP(prev => prev + 10);
    else setLives(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected('');
      setAnswered(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#131b2e] flex flex-col select-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <button
            aria-label="Tutup Sesi Latihan"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#64748B] hover:text-[#131b2e] hover:bg-[#f2f3ff] transition-colors"
            onClick={() => setShowExit(true)}
          >
            <MI name="close" className="text-2xl" />
          </button>

          {/* Progress */}
          <div className="flex-1 max-w-md flex items-center gap-3">
            <div className="w-full bg-[#E2E8F0] h-3.5 rounded-full overflow-hidden p-0.5 flex items-center">
              <div
                className="bg-gradient-to-r from-[#006948] to-[#00855d] h-full rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${Math.max(progress, 5)}%` }}
              >
                <div className="absolute right-1 top-0.5 bottom-0.5 w-2 bg-white/40 rounded-full" />
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#64748B] whitespace-nowrap hidden sm:inline">{currentQ + 1} / {questions.length}</span>
          </div>

          {/* Lives + XP */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-0.5 bg-[#FFF1F2] px-2.5 py-1 rounded-full border border-[#E11D48]/20 text-[#E11D48]">
              {[...Array(3)].map((_, i) => (
                <MI key={i} name="favorite" fill={i < lives} className={`text-lg ${i >= lives ? 'opacity-30' : ''}`} />
              ))}
              <span className="text-xs font-bold ml-1">{lives}</span>
            </div>
            <div className="flex items-center gap-1 bg-[#FFFBEB] px-2.5 py-1 rounded-full border border-[#8d4b00]/20 text-[#8d4b00]">
              <MI name="bolt" fill className="text-lg" />
              <span className="text-xs font-bold">+{sessionXP} XP</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Unit Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 bg-[#EEF2FF] px-3 py-1 rounded-full border border-[#4b41e1]/20">
              <MI name="school" className="text-[#4b41e1] text-base" />
              <span className="text-[#4b41e1] text-xs font-semibold">Unit 3: Academic Connectors & Cause-Effect (CEFR B1)</span>
            </div>
            <span className="text-[11px] font-bold text-[#64748B] bg-[#f2f3ff] px-2 py-0.5 rounded">Soal No. {currentQ + 1}</span>
          </div>

          {/* Question */}
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#131b2e]">{q.q}</h1>
            <p className="text-xs text-[#64748B] mt-1">Identifikasi kata penghubung formal yang tepat pada konteks akademik.</p>
          </div>

          {/* Sentence Box */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-[#E2E8F0] shadow-sm">
            <div className="flex items-start gap-4">
              <button className="w-11 h-11 shrink-0 rounded-full bg-[#ECFDF5] text-[#006948] border border-[#006948]/20 flex items-center justify-center hover:bg-[#006948] hover:text-white transition-colors">
                <MI name="volume_up" className="text-2xl" />
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1.5 text-[#006948] text-xs font-semibold">
                  <MI name="record_voice_over" className="text-base" />
                  <span>Listen & Fill the Blank</span>
                </div>
                <p className="text-base text-[#131b2e] leading-relaxed font-medium">
                  "{q.sentence.replace(q.blank, '')}
                  <span className="inline-flex items-center justify-center min-w-[120px] px-3 py-1 mx-1.5 bg-[#ECFDF5] text-[#006948] border-b-2 border-[#006948] rounded font-bold text-base">
                    {answered ? q.blank : '___________'}
                  </span>"
                </p>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {q.options.map(opt => {
              const isSelected = selected === opt.id;
              const showResult = answered && isSelected;
              return (
                <button
                  key={opt.id}
                  disabled={answered}
                  className={`text-left p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    showResult && opt.correct
                      ? 'border-[#006948] bg-[#ECFDF5]/50'
                      : showResult && !opt.correct
                      ? 'border-[#E11D48] bg-[#FFF1F2]/50'
                      : isSelected
                      ? 'border-[#006948] bg-[#ECFDF5]/50 shadow-[0_3px_0_#006948]'
                      : 'border-[#E2E8F0] bg-white hover:border-[#006948]/50 hover:bg-[#f2f3ff] shadow-[0_3px_0_#E2E8F0] hover:shadow-[0_5px_0_#CBD5E1] hover:-translate-y-0.5'
                  }`}
                  onClick={() => !answered && setSelected(opt.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
                      isSelected ? 'bg-[#006948] text-white' : 'bg-[#f2f3ff] text-[#64748B]'
                    }`}>{opt.id}</div>
                    <div>
                      <span className={`font-bold block text-base ${isSelected ? 'text-[#006948]' : 'text-[#131b2e]'}`}>{opt.word}</span>
                      <span className={`text-[11px] ${isSelected ? 'text-[#006948]/80' : 'text-[#64748B]'}`}>{opt.hint}</span>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-[#006948] bg-[#006948]' : 'border-[#E2E8F0]'
                  }`}>
                    {isSelected && <MI name="check" className="text-white text-xs" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Grammar Tip */}
          <div className="bg-[#FFFBEB]/70 border border-[#8d4b00]/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#ffdcc3] text-[#8d4b00] flex items-center justify-center shrink-0">
                <MI name="lightbulb" fill className="text-xl" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8d4b00]">Academic Grammar Insight</span>
                  <span className="text-[10px] bg-[#8d4b00]/10 text-[#8d4b00] px-2 py-0.5 rounded-full font-semibold">CEFR B1 Rubric</span>
                </div>
                <p className="text-sm text-[#131b2e] mt-1">{q.tip}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="h-28" />
      </main>

      {/* Bottom Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E2E8F0] shadow-lg">
        {answered && (
          <div className={`${correct ? 'bg-[#ECFDF5] border-b border-[#006948]/20' : 'bg-[#FFF1F2] border-b border-[#E11D48]/20'}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${correct ? 'bg-[#006948]' : 'bg-[#E11D48]'} text-white shadow-sm`}>
                  <MI name={correct ? 'task_alt' : 'close'} fill className="text-xl" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className={`font-bold text-base ${correct ? 'text-[#006948]' : 'text-[#E11D48]'}`}>
                      {correct ? 'Jawaban Tepat! 🎉' : 'Belum Tepat 😅'}
                    </h2>
                    {correct && <span className="bg-[#006948] text-white text-[11px] px-2 py-0.5 rounded-full font-bold shadow-xs">+10 XP</span>}
                  </div>
                  <p className="text-xs text-[#3d4a42]">
                    {correct ? 'Tepat sekali! Kata penghubung ini merefleksikan hubungan sebab-akibat dengan presisi.' : `Jawaban yang benar adalah "${q.blank}".`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <button className="hidden sm:flex items-center gap-1.5 text-[#64748B] hover:text-[#131b2e] text-xs transition-colors px-2 py-1 rounded">
            <MI name="flag" className="text-lg" />
            <span>Laporkan Soal</span>
          </button>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-end ml-auto">
            <div className="text-right hidden sm:block">
              <span className="block text-[11px] text-[#64748B]">Target Unit 3</span>
              <span className="block text-xs font-bold text-[#006948]">{questions.length - currentQ - 1} Soal Tersisa</span>
            </div>
            {!answered ? (
              <button
                disabled={!selected}
                className={`w-full sm:w-auto min-w-[200px] text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all ${selected ? 'bg-[#006948] cursor-pointer' : 'bg-[#64748B] cursor-not-allowed opacity-60'}`}
                style={selected ? { boxShadow: '0 4px 0 #005137' } : {}}
                onClick={handleAnswer}
              >
                <span>Cek Jawaban</span>
              </button>
            ) : (
              <button
                className="w-full sm:w-auto min-w-[200px] bg-[#006948] text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
                style={{ boxShadow: '0 4px 0 #005137' }}
                onClick={handleNext}
              >
                <span>Lanjut Soal Berikutnya</span>
                <MI name="arrow_forward" className="text-xl" />
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Exit Modal */}
      {showExit && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#E2E8F0] space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FFFBEB] text-[#8d4b00] flex items-center justify-center mx-auto">
              <MI name="warning" className="text-3xl" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-[#131b2e]">Keluar dari Sesi Latihan?</h3>
              <p className="text-sm text-[#64748B]">Kemajuan unit ini akan disimpan sebagian, namun bonus streak harian Anda hanya dihitung setelah unit selesai.</p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button className="w-full bg-[#006948] text-white font-bold py-2.5 rounded-lg" style={{ boxShadow: '0 4px 0 #005137' }} onClick={() => setShowExit(false)}>
                Lanjutkan Latihan
              </button>
              <button className="w-full py-2 text-[#64748B] hover:text-[#E11D48] text-sm font-medium transition-colors" onClick={() => navigate('/dashboard')}>
                Keluar ke Roadmap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
