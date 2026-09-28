import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDataStore } from '../../store/dataStore';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import EduMascot from '../../components/mascot/EduMascot';
import LottieCharacter from '../../components/mascot/LottieMascot';

export default function QuestSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { materials, userStats, completeMaterialAndUnlockNext, deductHeart, addXP, addGems } =
    useDataStore();

  const material = materials.find((m) => m.id === parseInt(id)) || materials[0];
  const steps = material.questSteps || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [placedWords, setPlacedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentStep = steps[currentIndex] || steps[0];
  const totalSteps = steps.length;
  const progressPercent = Math.round(
    ((currentIndex + (isAnswered ? 1 : 0)) / Math.max(1, totalSteps)) * 100
  );

  // Initialize per step
  useEffect(() => {
    if (currentStep) {
      if (currentStep.type === 'character_translate' || currentStep.type === 'word_arrange') {
        setAvailableWords(currentStep.wordBank ? [...currentStep.wordBank] : []);
        setPlacedWords([]);
      }
      setSelectedCardId(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setShowHint(false);

      if (currentStep.speechText) {
        speakText(currentStep.speechText, 0.9);
      }
    }
  }, [currentIndex, currentStep?.id]);

  // Native Web Speech API
  const speakText = (text, rate = 0.9) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate;
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Keyboard shortcut listener for cards (1, 2, 3)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentStep?.type === 'image_select' && !isAnswered) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= (currentStep.options?.length || 3)) {
          const selected = currentStep.options[num - 1];
          if (selected) {
            setSelectedCardId(selected.id);
            speakText(selected.label, 0.9);
          }
        }
      }
      if (e.key === 'Enter') {
        if (!isAnswered && !isCheckDisabled()) {
          handleCheck();
        } else if (isAnswered) {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, isAnswered, placedWords, selectedCardId]);

  // Click word chip from bank to answer slot
  const handleSelectWord = (word, index) => {
    if (isAnswered) return;
    setPlacedWords((prev) => [...prev, word]);
    setAvailableWords((prev) => prev.filter((_, i) => i !== index));
  };

  // Click placed word in answer slot to return to bank
  const handleRemoveWord = (word, index) => {
    if (isAnswered) return;
    setAvailableWords((prev) => [...prev, word]);
    setPlacedWords((prev) => prev.filter((_, i) => i !== index));
  };

  // Checking answer
  const handleCheck = () => {
    if (isAnswered) return;

    let correct = false;

    if (currentStep.type === 'image_select') {
      const selected = currentStep.options.find((opt) => opt.id === selectedCardId);
      correct = selected?.isCorrect || false;
    } else if (
      currentStep.type === 'character_translate' ||
      currentStep.type === 'word_arrange'
    ) {
      const currentSentence = placedWords.join(' ');
      const targetSentence = currentStep.targetWords.join(' ');
      correct = currentSentence.toLowerCase() === targetSentence.toLowerCase();
    } else if (currentStep.type === 'multiple_choice') {
      correct = selectedCardId === currentStep.answer;
    }

    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
      });
    } else {
      deductHeart();
    }
  };

  // Next step
  const handleNext = () => {
    if (currentIndex < totalSteps - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed full quest session
      completeMaterialAndUnlockNext(material.id, 100);
      addXP(material.xp_reward);
      addGems(35);
      setIsCompleted(true);
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
      });
    }
  };

  const isCheckDisabled = () => {
    if (currentStep.type === 'image_select' || currentStep.type === 'multiple_choice') {
      return selectedCardId === null;
    }
    if (
      currentStep.type === 'character_translate' ||
      currentStep.type === 'word_arrange'
    ) {
      return placedWords.length === 0;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-indigo-500 selection:text-white font-sans antialiased">
      {/* ================= 1. QUEST HEADER (Stitch RPG Header) ================= */}
      <header className="w-full max-w-5xl mx-auto px-4 pt-4 sm:pt-6 pb-2">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Close Quest Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-xl bg-[#141c2e] hover:bg-[#1f2b47] border border-[#243354] flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-sm group cursor-pointer"
            title="Keluar dari Quest"
          >
            <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">
              close
            </span>
          </button>

          {/* Center Progress Track */}
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                Tahap {currentIndex + 1} / {totalSteps} Soal
              </span>
              <span className="text-emerald-400 font-extrabold tracking-wide">
                {progressPercent}% SELESAI
              </span>
            </div>

            {/* Glowing XP Progress Bar */}
            <div className="h-3.5 w-full bg-[#131b2e] border border-[#233152] rounded-full overflow-hidden p-0.5 relative">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full relative shadow-[0_0_12px_rgba(16,185,129,0.7)]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4 }}
              >
                <div className="absolute inset-0 bg-white/20 rounded-full h-1/2" />
              </motion.div>
            </div>
          </div>

          {/* Gamified Player Status Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Daily Streak Counter */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141c2e] border border-[#243354] text-amber-400 font-black text-xs shadow-inner">
              <span className="material-symbols-outlined text-base fill-icon text-amber-400 animate-bounce">
                local_fire_department
              </span>
              <span>{userStats.current_streak}</span>
            </div>

            {/* Diamond / Gem Count */}
            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#141c2e] border border-[#243354] text-cyan-400 font-extrabold text-xs shadow-inner">
              <span className="material-symbols-outlined text-base fill-icon text-cyan-400">
                diamond
              </span>
              <span>{userStats.gems}</span>
            </div>

            {/* Player Health / Hearts */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-800/50 text-red-400 font-black text-xs shadow-[0_0_12px_rgba(239,68,68,0.2)]">
              <span className="material-symbols-outlined text-base fill-icon text-red-500 animate-pulse">
                favorite
              </span>
              <span>{userStats.hearts}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ================= 2. MAIN QUEST CONTENT ================= */}
      {!isCompleted && currentStep && (
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 flex flex-col justify-center">
          {/* Challenge Mode Selector & Level Badges */}
          <section className="flex flex-wrap items-center justify-between gap-2.5 mb-5">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-black uppercase tracking-wider shadow-[0_0_14px_rgba(99,102,241,0.3)]">
                <span className="material-symbols-outlined text-sm fill-icon text-indigo-400">
                  bolt
                </span>
                {currentStep.tag || 'Latihan Interaktif'}
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#131b2e] border border-slate-700/70 text-slate-400 text-xs font-semibold">
                <span>{material.cefr || 'CEFR B1'}</span>
                <span className="w-1 h-1 rounded-full bg-slate-500" />
                <span>{material.unit}</span>
              </div>
            </div>
          </section>

          {/* Primary Prompt Title */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            {currentStep.prompt}
          </h1>

          {/* ======================================================== */}
          {/* MODEL 1: AUDIO & SENTENCE BUILDER (Prof. Hootie Speech) */}
          {/* ======================================================== */}
          {currentStep.type === 'character_translate' && (
            <div className="space-y-6">
              {/* Kitsu Fox Audio Card Widget */}
              <div className="bg-[#11192b] border-2 border-[#202e4d] rounded-2xl p-4 sm:p-5 relative shadow-xl">
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-5">
                  {/* Avatar Kitsu The Scholar Fox */}
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-500/20 via-indigo-600/30 to-indigo-900/40 p-1 shadow-lg shadow-indigo-950 flex items-center justify-center border-2 border-indigo-400/30">
                      <EduMascot
                        size="sm"
                        showTail={false}
                        mood={isPlayingAudio ? 'cheer' : 'happy'}
                      />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#11192b] flex items-center justify-center text-[10px] text-white font-bold shadow">
                      ✓
                    </span>
                  </div>

                  {/* Audio Play Control & Waveform */}
                  <div className="flex-1 flex flex-col justify-center text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2">
                      {/* Large Sound Trigger Button */}
                      <button
                        onClick={() => speakText(currentStep.speechText, 0.9)}
                        className="tactile-button px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-2.5 shadow-[0_4px_0_#3730a3] hover:shadow-[0_2px_0_#3730a3] transition-all cursor-pointer"
                        title="Dengarkan Suara"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-lg fill-icon">
                          volume_up
                        </span>
                        <span>Putar Audio</span>
                      </button>

                      {/* Slow Audio (Turtle) */}
                      <button
                        onClick={() => speakText(currentStep.speechText, 0.65)}
                        className="w-10 h-10 rounded-xl bg-[#1a253e] hover:bg-[#253457] border border-[#2d3f66] flex items-center justify-center text-slate-300 hover:text-white transition-all font-bold text-xs cursor-pointer"
                        title="Putar Lebih Lambat (0.65x)"
                        type="button"
                      >
                        🐢
                      </button>

                      {/* Dynamic Audio Wave Visualizer (Guaranteed min-height & responsive) */}
                      <div className="flex items-center gap-1.5 px-3 py-2 bg-[#0a0f1d] rounded-xl border border-[#1b2844] h-10 shadow-inner">
                        {[
                          { idle: 8, active: [6, 22, 6], dur: 0.7, delay: 0 },
                          { idle: 16, active: [8, 26, 8], dur: 0.9, delay: 0.1 },
                          { idle: 22, active: [10, 28, 10], dur: 0.65, delay: 0.2 },
                          { idle: 16, active: [8, 24, 8], dur: 0.85, delay: 0.15 },
                          { idle: 8, active: [6, 20, 6], dur: 0.75, delay: 0.25 },
                        ].map((bar, idx) => (
                          <motion.span
                            key={idx}
                            className="w-1 min-w-[4px] bg-indigo-400 rounded-full block"
                            style={{ minHeight: '6px' }}
                            animate={{
                              height: isPlayingAudio ? bar.active : bar.idle,
                            }}
                            transition={
                              isPlayingAudio
                                ? {
                                    duration: bar.dur,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                    delay: bar.delay,
                                  }
                                : { duration: 0.2 }
                            }
                          />
                        ))}
                      </div>
                    </div>

                    {/* Spoken Sentence */}
                    <p className="text-base sm:text-lg font-bold text-white tracking-wide">
                      "{currentStep.speechText}"
                    </p>
                    <p className="text-xs sm:text-sm font-mono text-indigo-300/80 mt-0.5">
                      /{currentStep.phonetic}/
                    </p>
                  </div>
                </div>
              </div>

              {/* Target Sentence Assembler / Snap Slots */}
              <section>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Area Kalimat Jawaban:
                </label>
                <div className="min-h-[72px] sm:min-h-[82px] bg-[#0c1221] border-2 border-dashed border-[#2b3a5c] rounded-2xl p-3 flex flex-wrap items-center gap-2.5 transition-all shadow-inner">
                  {placedWords.length === 0 && (
                    <span className="text-slate-500 text-sm italic select-none">
                      Klik kata-kata di bawah secara berurutan untuk menyusun kalimat terjemahan...
                    </span>
                  )}
                  {placedWords.map((word, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRemoveWord(word, idx)}
                      className="tactile-button inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 border border-indigo-400/50 text-white font-bold text-sm sm:text-base shadow-[0_3px_0_#3730a3] cursor-pointer"
                      type="button"
                    >
                      <span>{word}</span>
                      <span className="text-xs text-indigo-200">✕</span>
                    </button>
                  ))}
                  <div className="h-7 w-1 bg-indigo-500 rounded-full animate-pulse my-auto" />
                </div>
              </section>

              {/* Word Bank Tile Options Deck */}
              <section>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Pilihan Kosakata:
                </label>
                <div className="flex flex-wrap gap-2.5 sm:gap-3.5">
                  {availableWords.map((word, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectWord(word, idx)}
                      className="tactile-button px-4 py-2.5 rounded-xl bg-[#19233a] hover:bg-[#223050] border-2 border-[#2b3c62] text-slate-100 font-bold text-sm sm:text-base shadow-[0_4px_0_#1b2640] hover:border-indigo-400/60 transition-all cursor-pointer"
                      type="button"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ======================================================== */}
          {/* MODEL 2: 3D ILLUSTRATED FLASHCARDS (Pilihan Gambar) */}
          {/* ======================================================== */}
          {currentStep.type === 'image_select' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {currentStep.options.map((opt, idx) => {
                const isSelected = selectedCardId === opt.id;
                let cardStyle =
                  'bg-[#12192a] border-2 border-[#202c47] hover:border-slate-500 text-white';

                if (isAnswered) {
                  if (opt.isCorrect) {
                    cardStyle =
                      'bg-[#131b2f] border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-2 ring-emerald-500/50';
                  } else if (isSelected && !isCorrect) {
                    cardStyle =
                      'bg-red-950/80 border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] ring-2 ring-red-500/50';
                  } else {
                    cardStyle = 'bg-[#12192a]/40 border-[#202c47]/50 opacity-40';
                  }
                } else if (isSelected) {
                  cardStyle =
                    'bg-[#131b2f] border-2 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.25)] ring-2 ring-indigo-500/50 -translate-y-1';
                }

                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      if (!isAnswered) {
                        setSelectedCardId(opt.id);
                        speakText(opt.label, 0.9);
                      }
                    }}
                    className={`flashcard-option cursor-pointer group relative rounded-2xl p-6 sm:p-7 flex flex-col items-center text-center transition-all shadow-md ${cardStyle}`}
                  >
                    {/* Shortcut Key Badge */}
                    <div className="absolute top-3 left-3 w-6 h-6 rounded-md bg-[#1f2a48] border border-[#2f3f6b] text-[11px] font-mono font-bold text-indigo-300 flex items-center justify-center shadow-sm">
                      {idx + 1}
                    </div>

                    {/* Radio selection indicator */}
                    <div
                      className={`absolute top-3.5 right-3.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[11px] font-black ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-600 text-white'
                          : 'border-slate-600 bg-transparent'
                      }`}
                    >
                      {isSelected && '✓'}
                    </div>

                    {/* Illustrated Icon Container */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-indigo-900/60 to-purple-900/50 border border-indigo-500/30 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-inner text-4xl sm:text-5xl">
                      <span>{opt.emoji}</span>
                    </div>

                    {/* Vocabulary Title */}
                    <h2 className="text-base sm:text-lg font-extrabold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                      <span>{opt.label}</span>
                      <span className="material-symbols-outlined text-sm text-indigo-400">
                        volume_up
                      </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">{opt.sub}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* ======================================================== */}
          {/* MODEL 3: WORD ARRANGE (Susun Kalimat Inggris) */}
          {/* ======================================================== */}
          {currentStep.type === 'word_arrange' && (
            <div className="space-y-6">
              {/* Meaning prompt box */}
              <div className="p-4 rounded-2xl bg-[#11192b] border border-[#202e4d]">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                  Arti Kalimat Indonesia:
                </span>
                <p className="text-base sm:text-lg font-bold text-white mt-1">
                  "{currentStep.targetMeaning}"
                </p>
              </div>

              {/* Placed Words Slot */}
              <section>
                <div className="min-h-[72px] sm:min-h-[82px] bg-[#0c1221] border-2 border-dashed border-[#2b3a5c] rounded-2xl p-3 flex flex-wrap items-center gap-2.5 transition-all shadow-inner">
                  {placedWords.length === 0 && (
                    <span className="text-slate-500 text-sm italic select-none">
                      Susun kata-kata bahasa Inggris di bawah ini...
                    </span>
                  )}
                  {placedWords.map((word, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRemoveWord(word, idx)}
                      className="tactile-button inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 border border-indigo-400/50 text-white font-bold text-sm sm:text-base shadow-[0_3px_0_#3730a3] cursor-pointer"
                      type="button"
                    >
                      <span>{word}</span>
                      <span className="text-xs text-indigo-200">✕</span>
                    </button>
                  ))}
                  <div className="h-7 w-1 bg-indigo-500 rounded-full animate-pulse my-auto" />
                </div>
              </section>

              {/* Word Bank Pool */}
              <div className="flex flex-wrap gap-2.5 sm:gap-3.5">
                {availableWords.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      handleSelectWord(word, idx);
                      speakText(word, 0.9);
                    }}
                    className="tactile-button px-4 py-2.5 rounded-xl bg-[#19233a] hover:bg-[#223050] border-2 border-[#2b3c62] text-slate-100 font-bold text-sm sm:text-base shadow-[0_4px_0_#1b2640] hover:border-indigo-400/60 transition-all cursor-pointer"
                    type="button"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MODEL 4: MULTIPLE CHOICE GRAMMAR */}
          {/* ======================================================== */}
          {currentStep.type === 'multiple_choice' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#11192b] border border-[#202e4d] mb-4">
                <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  {currentStep.sentence}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {currentStep.options.map((opt, idx) => {
                  const isSelected = selectedCardId === idx;
                  let style =
                    'bg-[#19233a] border-[#2b3c62] hover:bg-[#223050] text-slate-100 shadow-[0_4px_0_#1b2640]';

                  if (isAnswered) {
                    if (idx === currentStep.answer) {
                      style =
                        'bg-emerald-950 border-emerald-500 text-emerald-200 shadow-[0_4px_0_#059669]';
                    } else if (isSelected && !isCorrect) {
                      style =
                        'bg-red-950 border-red-500 text-red-200 shadow-[0_4px_0_#991b1b]';
                    } else {
                      style = 'bg-[#141d30]/50 border-slate-800 text-slate-600 opacity-40';
                    }
                  } else if (isSelected) {
                    style =
                      'bg-indigo-950 border-indigo-500 text-indigo-200 shadow-[0_4px_0_#3730a3] ring-1 ring-indigo-400';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (!isAnswered) setSelectedCardId(idx);
                      }}
                      className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-sm flex items-center justify-between transition-all cursor-pointer ${style}`}
                    >
                      <span>{opt}</span>
                      <span className="w-6 h-6 rounded-lg bg-slate-900 text-slate-400 text-xs font-bold flex items-center justify-center">
                        {String.fromCharCode(65 + idx)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tactical Booster & Helper Bar (From Stitch design) */}
          <div className="mt-8 pt-4 border-t border-[#1a253d] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400 font-semibold">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/50 border border-emerald-800/40 text-emerald-400 font-bold">
                🛡️ Pelindung Streak Aktif
              </span>
              <span className="hidden sm:inline-block text-slate-500">
                • Tidak kehilangan nyawa pertama
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHint(true)}
                className="px-3 py-1.5 rounded-lg bg-[#141d30] hover:bg-[#1e2a44] border border-[#253556] text-amber-300 font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Dapatkan petunjuk dengan menukar 20 XP"
                type="button"
              >
                <span>💡 Gunakan Petunjuk</span>
                <span className="text-[10px] text-amber-500/80">(-20 XP)</span>
              </button>
            </div>
          </div>

          {/* Hint Dropdown */}
          {showHint && (
            <div className="mt-3 p-3 bg-amber-950/50 border border-amber-800/60 rounded-xl text-amber-200 text-xs font-medium">
              💡 <strong>Petunjuk:</strong>{' '}
              {currentStep.phonetic
                ? `Perhatikan bunyi kata: /${currentStep.phonetic}/`
                : 'Perhatikan susunan subjek dan kata kerja bantu (auxiliary).'}
            </div>
          )}
        </main>
      )}

      {/* ================= 3. SESSION COMPLETE SCREEN ================= */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-auto px-6 py-12 text-center my-auto flex flex-col items-center"
        >
          {/* Animasi Kemenangan Lottie Confetti dengan Maskot Kitsu */}
          <LottieCharacter
            type="celebrate"
            size="hero"
            withMascot={true}
            speech="Luar Biasa! Level Up!"
            className="mb-2"
          />

          <h2 className="text-2xl sm:text-3xl font-black text-white">Quest Berhasil Selesai! 🎉</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Semua tantangan di <strong className="text-white">{material.title}</strong> telah kamu taklukkan dengan sempurna.
          </p>

          <div className="flex items-center gap-4 my-6">
            <div className="px-5 py-3 rounded-2xl bg-[#141c2e] border border-amber-700/60 text-center shadow-inner">
              <span className="material-symbols-outlined text-2xl text-amber-400 fill-icon">bolt</span>
              <p className="text-[10px] font-bold text-slate-400 mt-1">XP Didapat</p>
              <p className="text-base font-black text-amber-400">+{material.xp_reward} XP</p>
            </div>

            <div className="px-5 py-3 rounded-2xl bg-[#141c2e] border border-cyan-700/60 text-center shadow-inner">
              <span className="material-symbols-outlined text-2xl text-cyan-400 fill-icon">diamond</span>
              <p className="text-[10px] font-bold text-slate-400 mt-1">Permata</p>
              <p className="text-base font-black text-cyan-400">+35 Gems</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="tactile-button w-full py-3.5 px-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl border-b-[5px] border-emerald-700 shadow-md cursor-pointer"
          >
            Lanjutkan di Dashboard 🗺️
          </button>
        </motion.div>
      )}

      {/* ================= 4. BOTTOM ACTION DECK (Stitch Bottom Deck) ================= */}
      {!isCompleted && (
        <footer className="w-full bg-[#0d1322] border-t-2 border-[#1c273f] py-4 sm:py-5 px-4 sticky bottom-0 z-40 backdrop-blur-md">
          {/* Instant Feedback Banner */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className={`max-w-4xl mx-auto mb-4 p-4 rounded-2xl border-2 shadow-lg ${
                  isCorrect
                    ? 'bg-emerald-950/90 border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    : 'bg-red-950/90 border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shrink-0 ${
                        isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white'
                      }`}
                    >
                      {isCorrect ? '✓' : '✕'}
                    </div>

                    <div>
                      <h3
                        className={`font-extrabold text-base sm:text-lg flex items-center gap-2 ${
                          isCorrect ? 'text-emerald-300' : 'text-red-300'
                        }`}
                      >
                        {isCorrect ? 'Luar Biasa! Jawaban Sempurna' : 'Jawaban yang Benar:'}
                        {isCorrect && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-black">
                            +30 XP
                          </span>
                        )}
                      </h3>
                      <p
                        className={`text-xs sm:text-sm mt-0.5 ${
                          isCorrect ? 'text-emerald-200/80' : 'text-slate-300'
                        }`}
                      >
                        {isCorrect ? (
                          <span>
                            <strong className="font-bold">Penjelasan:</strong> Susunan tata bahasa dan kosakata akademis yang kamu pilih sudah tepat!
                          </span>
                        ) : (
                          <span>
                            {currentStep.targetWords?.join(' ') ||
                              currentStep.options?.find((o) => o.isCorrect)?.label ||
                              'Perhatikan kembali urutan kata dan konteksnya.'}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleNext}
                    className={`tactile-button whitespace-nowrap px-6 py-2.5 rounded-xl font-black text-sm tracking-wide shadow-md cursor-pointer ${
                      isCorrect
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_4px_0_#059669]'
                        : 'bg-red-500 hover:bg-red-400 text-white shadow-[0_4px_0_#991b1b]'
                    }`}
                    type="button"
                  >
                    {currentIndex < totalSteps - 1 ? 'Lanjut ke Soal Berikutnya →' : 'Selesaikan Quest 🏁'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Default Control Buttons Bar */}
          {!isAnswered && (
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
              <button
                onClick={() => {
                  deductHeart();
                  handleNext();
                }}
                className="tactile-button px-5 sm:px-7 py-3 rounded-xl bg-[#141c2e] hover:bg-[#1c273f] border-2 border-[#243354] text-slate-400 hover:text-white font-bold text-sm sm:text-base tracking-wide transition-colors cursor-pointer"
                type="button"
              >
                Lompati
              </button>

              <button
                onClick={handleCheck}
                disabled={isCheckDisabled()}
                className={`tactile-button px-7 sm:px-12 py-3 rounded-xl font-black text-sm sm:text-base tracking-wide transition-all flex items-center gap-2 cursor-pointer ${
                  !isCheckDisabled()
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_5px_0_#059669] active:shadow-[0_2px_0_#059669]'
                    : 'bg-[#141c2e] text-slate-600 border border-[#243354] cursor-not-allowed'
                }`}
                type="button"
              >
                <span>Periksa</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          )}
        </footer>
      )}
    </div>
  );
}
