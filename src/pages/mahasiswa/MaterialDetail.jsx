import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDataStore } from '../../store/dataStore';
import HootieMascot from '../../components/mascot/HootieMascot';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function MaterialDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { materials, addXP, addGems } = useDataStore();

  const material = materials.find((m) => m.id === parseInt(id));
  const [currentPage, setCurrentPage] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [activeTab, setActiveTab] = useState('materi'); // 'materi' | 'glosarium'
  const [revealedCards, setRevealedCards] = useState({});

  if (!material) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8 bg-white rounded-3xl border border-indigo-100 shadow-sm">
          <p className="text-slate-600 text-sm font-bold mb-4">Modul materi tidak ditemukan.</p>
          <Link
            to="/dashboard"
            className="tactile-btn px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs"
          >
            ← Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const pages = material.pages || [];
  const totalPages = pages.length;
  const isLastPage = currentPage === totalPages - 1;
  const page = pages[currentPage] || { title: material.title, content: '' };
  const progress = Math.round(((currentPage + 1) / totalPages) * 100);

  // Mascot advice based on page index
  const mascotPrompts = [
    `Pelajari konsep ${material.category} ini baik-baik untuk persiapan kuis!`,
    'Tabel perbandingan ini adalah kunci membedakan ragam formal vs santai.',
    'Satu langkah lagi sebelum evaluasi kuis! Pastikan kamu memahami polanya.',
    'Luar biasa! Kamu sudah siap membuktikan kemampuanmu di kuis evaluasi!',
  ];
  const mascotSpeech = mascotPrompts[currentPage] || 'Terus semangat belajar!';

  const handleNext = () => {
    if (isLastPage) {
      setShowCompletion(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      setCurrentPage((p) => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/dashboard');
    }
  };

  const toggleCardReveal = (cardId) => {
    setRevealedCards((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  // Render stylized gamified content blocks
  const renderFormattedContent = (content) => {
    const lines = content.split('\n');

    // Parse table if exists
    const isTableContent = lines.some((l) => l.startsWith('|'));

    if (isTableContent) {
      const tableLines = lines.filter((l) => l.startsWith('|') && !l.includes('---'));
      const rows = tableLines.map((row) =>
        row
          .split('|')
          .filter((c) => c.trim())
          .map((c) => c.trim())
      );

      const headerRow = rows[0] || [];
      const bodyRows = rows.slice(1);

      return (
        <div className="space-y-4 my-4">
          <div className="flex items-center justify-between text-xs font-black text-indigo-900 bg-indigo-50/80 p-3 rounded-2xl border border-indigo-100">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-indigo-600">compare_arrows</span>
              Matriks Kosakata Akademik (Klik kartu untuk melihat konteks)
            </span>
            <span className="text-[10px] bg-indigo-200/70 text-indigo-800 px-2 py-0.5 rounded-md">
              {bodyRows.length} Kosakata
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {bodyRows.map((row, i) => {
              const informal = row[0];
              const academic = row[1];
              const meaning = row[2] || '';
              const isRevealed = revealedCards[i];

              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -2 }}
                  onClick={() => toggleCardReveal(i)}
                  className="p-4 rounded-2xl bg-white border-2 border-indigo-100/90 shadow-2xs hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-slate-400">
                        Bahasa Santai
                      </span>
                      <p className="text-sm font-bold text-slate-500 line-through decoration-rose-400 decoration-2">
                        {informal}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-indigo-500 text-sm">
                      arrow_forward
                    </span>
                    <div className="text-right">
                      <span className="text-[10px] font-extrabold uppercase text-indigo-600">
                        Standar Akademik
                      </span>
                      <p className="text-sm font-black text-indigo-700">{academic}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Arti: <strong className="text-slate-800">{meaning}</strong></span>
                    <span className="text-[10px] text-indigo-600 font-extrabold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-xs">volume_up</span> Dengarkan
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      );
    }

    // Default clean markdown parser
    return (
      <div className="space-y-4 text-slate-700 leading-relaxed text-sm md:text-base">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-2" />;

          // Header
          if (line.startsWith('**') && line.endsWith('**')) {
            return (
              <div
                key={idx}
                className="flex items-center gap-2 text-indigo-950 font-black text-base md:text-lg mt-5 mb-2 pb-1 border-b border-indigo-100"
              >
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                <h3>{line.replace(/\*\*/g, '')}</h3>
              </div>
            );
          }

          // Bullet points
          if (
            line.startsWith('- ') ||
            line.startsWith('✅') ||
            line.startsWith('1.') ||
            line.startsWith('2.')
          ) {
            return (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-100 text-xs md:text-sm"
              >
                <span className="material-symbols-outlined text-emerald-600 text-sm mt-0.5 fill-icon">
                  check_circle
                </span>
                <span className="font-semibold text-slate-800 leading-snug">
                  {line.replace(/^[-✅\d.]\s*/, '')}
                </span>
              </div>
            );
          }

          // Blockquote or Callout
          if (line.startsWith('> ')) {
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-amber-50/80 border-l-4 border-amber-500 text-amber-950 text-xs md:text-sm my-3 shadow-2xs"
              >
                <p className="font-bold flex items-center gap-1.5 mb-1">
                  <span className="material-symbols-outlined text-amber-600 text-base fill-icon">
                    lightbulb
                  </span>
                  Tips Akademis
                </p>
                <p className="italic text-slate-700">{line.replace('> ', '')}</p>
              </div>
            );
          }

          return (
            <p
              key={idx}
              className="text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: line
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-slate-900">$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em class="text-indigo-600 font-semibold">$1</em>')
                  .replace(/`([^`]+)`/g, '<code class="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-mono text-xs font-bold border border-indigo-200/80">$1</code>'),
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* ================= BREADCRUMB & HEADER INFO ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-indigo-100 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            title="Kembali ke Dashboard"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                {material.cefr || 'Menengah'}
              </span>
              <span className="text-xs text-slate-400 font-semibold">• {material.category}</span>
            </div>
            <h1 className="text-sm md:text-base font-black text-slate-900 mt-0.5">
              {material.unit}: {material.title}
            </h1>
          </div>
        </div>

        {/* Progress & XP Reward Pill */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Progres Baca</span>
            <span className="text-xs font-black text-indigo-600">
              Halaman {currentPage + 1} / {totalPages}
            </span>
          </div>
          <div className="w-24 sm:w-28 h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs font-black">
            <span className="material-symbols-outlined text-sm text-amber-500 fill-icon">bolt</span>
            +{material.xp_reward} XP
          </div>
        </div>
      </div>

      {/* ================= FULL-WIDTH LESSON CONTENT DECK ================= */}
      <div className="w-full bg-white rounded-3xl p-6 md:p-8 border border-indigo-100 shadow-sm flex flex-col justify-between min-h-[500px]">
        <div>
          {/* Slide Title Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-black shrink-0">
                {currentPage + 1}
              </span>
              <h2 className="text-lg md:text-xl font-black text-slate-900">{page.title}</h2>
            </div>
            <span className="text-[11px] font-extrabold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 shrink-0 self-start sm:self-auto">
              Langkah {currentPage + 1} dari {totalPages}
            </span>
          </div>

          {/* Compact Mascot Guidance Ribbon */}
          <div className="flex items-center gap-3.5 p-3.5 bg-indigo-50/80 rounded-2xl border border-indigo-100 mb-6">
            <HootieMascot mood={isLastPage ? 'cheer' : 'happy'} size="sm" />
            <div className="flex-1">
              <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-xs fill-icon">school</span>
                Tips Prof. Hootie
              </span>
              <p className="text-xs font-bold text-slate-700 mt-0.5">{mascotSpeech}</p>
            </div>
          </div>

          {/* Dynamic Lesson Body */}
          {renderFormattedContent(page.content)}
        </div>

          {/* Navigation Dock */}
          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-4">
            <button
              onClick={handleBack}
              disabled={currentPage === 0}
              className={`tactile-btn px-4 py-2.5 rounded-xl font-bold text-xs border-b-[3px] flex items-center gap-1.5 transition-all cursor-pointer ${
                currentPage > 0
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  : 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Sebelumnya
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {pages.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === currentPage
                      ? 'w-6 bg-indigo-600'
                      : i < currentPage
                      ? 'w-2 bg-emerald-400'
                      : 'w-2 bg-slate-200'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className={`tactile-btn px-6 py-2.5 text-white font-black text-xs rounded-xl border-b-[4px] flex items-center gap-2 shadow-xs cursor-pointer ${
                isLastPage
                  ? 'bg-emerald-500 hover:bg-emerald-600 border-emerald-700'
                  : 'bg-indigo-600 hover:bg-indigo-700 border-indigo-900'
              }`}
            >
              {isLastPage ? (
                <>
                  <span className="material-symbols-outlined text-base fill-icon">trophy</span>
                  Selesai & Evaluasi Kuis 🎯
                </>
              ) : (
                <>
                  Halaman Berikutnya
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </div>

      {/* ================= LESSON COMPLETION MODAL ================= */}
      <AnimatePresence>
        {showCompletion && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full text-center border-4 border-indigo-500 shadow-2xl relative"
            >
              <HootieMascot mood="celebrate" speech="Semua Halaman Selesai!" size="hero" />

              <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-4">
                Siap Evaluasi Kuis! 🎉
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Kamu telah menyelesaikan seluruh bacaan materi <strong className="text-slate-800">{material.title}</strong>. Buktikan pemahamanmu untuk meraih <strong className="text-amber-600">+{material.xp_reward} XP</strong>!
              </p>

              <div className="p-3.5 my-5 bg-indigo-50 rounded-2xl border border-indigo-200 text-left text-xs space-y-1">
                <div className="flex justify-between font-black text-indigo-950">
                  <span>Target Skor Kelulusan:</span>
                  <span className="text-indigo-600">{material.min_score}%</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Jumlah Pertanyaan:</span>
                  <span>{material.quiz?.length || 3} Soal</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => navigate(`/dashboard/modules/${material.id}/quiz`)}
                  className="tactile-btn w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl border-b-[5px] border-indigo-900 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base fill-icon">play_arrow</span>
                  Mulai Kuis Evaluasi Sekarang! 🚀
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Kembali ke Dashboard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
