import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import HootieMascot from '../../components/mascot/HootieMascot';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function BossBattle() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { bossBattle, userStats, damageBoss, addXP, addGems } = useDataStore();

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [damageDealt, setDamageDealt] = useState(null);
  const [isBossHurt, setIsBossHurt] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [battleLog, setBattleLog] = useState([
    'Tantangan Quiz Arena dimulai! Selesaikan soal Structure & Written Expression.',
    'Status Mahasiswa: Evaluasi aktif (850 SP).',
  ]);

  // Countdown timer in seconds
  const [timeLeft, setTimeLeft] = useState(bossBattle.timeRemainingSec || 2535);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = bossBattle.questions[currentQIndex] || bossBattle.questions[0];
  const hpPercent = Math.max(0, Math.round((bossBattle.currentHp / bossBattle.maxHp) * 100));

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleAttackBoss = () => {
    if (selectedOption === null || isAnswered) return;

    const correct = selectedOption === currentQ.answer;
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      const dmg = bossBattle.damagePerHit || 350;
      setDamageDealt(dmg);
      setIsBossHurt(true);
      damageBoss(dmg);

      setBattleLog((prev) => [
        `✅ JAWABAN TEPAT! Kamu memperoleh +${dmg} Poin evaluasi kuis!`,
        ...prev,
      ]);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });

      if (bossBattle.currentHp - dmg <= 0) {
        setIsVictory(true);
        addXP(500);
        addGems(150);
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
        });
      }
    } else {
      setBattleLog((prev) => [
        `❌ Jawaban belum tepat. Cermati petunjuk kaidah tata bahasa dan coba lagi.`,
        ...prev,
      ]);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setDamageDealt(null);
    setIsBossHurt(false);

    if (currentQIndex < bossBattle.questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      setCurrentQIndex(0); // Loop question pool
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 space-y-6">
      {/* ================= TOP BOSS ARENA HEADER ================= */}
      <section className="bg-white rounded-3xl p-5 md:p-6 border border-rose-200/80 shadow-md relative overflow-hidden">
        {/* Glow shape */}
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          {/* Boss Thumbnail & Info */}
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative shrink-0">
              <motion.div
                animate={isBossHurt ? { x: [-10, 10, -5, 5, 0], scale: 0.95 } : { y: [0, -4, 0] }}
                transition={{ duration: 0.5 }}
                className="w-18 h-18 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-rose-500 to-purple-800 p-1 border-2 border-rose-400 shadow-md flex items-center justify-center text-white"
              >
                <span className="material-symbols-outlined text-4xl">swords</span>
              </motion.div>
              <span className="absolute -top-2 -left-2 bg-rose-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full border-2 border-white shadow-xs">
                Quiz Arena
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg md:text-xl font-black text-slate-900 leading-tight">
                  {bossBattle.bossName}
                </h1>
                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-md text-[10px] font-black border border-rose-200">
                  {bossBattle.cefrPhase}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{bossBattle.title}</p>
            </div>
          </div>

          {/* Boss Health Bar */}
          <div className="w-full lg:flex-1 max-w-xl flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-black">
              <span className="text-rose-600 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">assignment_turned_in</span>
                Progress Tantangan Kuis
              </span>
              <span className="text-rose-900 font-extrabold">
                {bossBattle.currentHp.toLocaleString()} / {bossBattle.maxHp.toLocaleString()} Poin (
                {hpPercent}%)
              </span>
            </div>

            {/* HP Track & Bar */}
            <div className="w-full h-5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <motion.div
                className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-400 rounded-full transition-all duration-500 shadow-inner"
                style={{ width: `${hpPercent}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-500 font-bold">
              <span>Tantangan Berjalan</span>
              <span className="text-emerald-600">+{bossBattle.damagePerHit} Poin per jawaban benar</span>
            </div>
          </div>

          {/* Dungeon Countdown Bomb */}
          <div className="shrink-0 flex items-center gap-3 bg-rose-50 border-2 border-rose-200 px-4 py-2.5 rounded-2xl shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center animate-bounce">
              <span className="material-symbols-outlined text-lg">alarm</span>
            </div>
            <div>
              <div className="text-[9px] font-black uppercase text-rose-500 tracking-wider">
                Waktu Tersisa
              </div>
              <div className="text-base font-black text-rose-900">{formatTime(timeLeft)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3-COLUMN TACTICAL BENTO LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SISI KIRI: Player Character Battler Card (Cols 3) */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-600">person</span>
                <span className="font-extrabold text-xs text-slate-800">Profil Mahasiswa</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-black">
                Level {userStats.level}
              </span>
            </div>

            <div className="my-4 flex flex-col items-center text-center">
              <div className="relative">
                <HootieMascot mood={isCorrect ? 'cheer' : 'fire'} size="lg" />
              </div>
              <h2 className="mt-2 text-sm font-black text-slate-900">
                {user?.name || 'Alex "Syntax" Ward'}
              </h2>
              <p className="text-[11px] text-slate-500">Simulasi TOEFL ITP</p>
            </div>

            {/* Defense Barrier Stats */}
            <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
              <div className="flex justify-between text-[11px] font-black">
                <span className="text-sky-600 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">security</span> Ketahanan Kuis
                </span>
                <span className="text-sky-700">
                  {userStats.sp_barrier} / {userStats.max_sp} SP
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full"
                  style={{ width: `${(userStats.sp_barrier / userStats.max_sp) * 100}%` }}
                />
              </div>
            </div>

            {/* Buffs Active */}
            <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
              <span className="material-symbols-outlined text-amber-500 text-sm fill-icon">
                local_fire_department
              </span>
              <span className="text-[11px] font-bold">Bonus Streak: +20% Poin</span>
            </div>
          </div>
        </aside>

        {/* SISI TENGAH: Tactical Combat Question (Cols 6) */}
        <main className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-sm flex flex-col justify-between min-h-[460px]">
            <div>
              {/* Question Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-black uppercase">
                  {currentQ.type} Question #{currentQIndex + 1}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  Simulasi Skor: +25 Poin TOEFL
                </span>
              </div>

              {/* Prompt Text */}
              <h3 className="text-base md:text-lg font-black text-slate-900 leading-relaxed mb-6">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  let style = 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800';

                  if (isAnswered) {
                    if (idx === currentQ.answer) {
                      style = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500';
                    } else if (isSelected && !isCorrect) {
                      style = 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500';
                    } else {
                      style = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                    }
                  } else if (isSelected) {
                    style = 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-500';
                  }

                  return (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full p-4 rounded-2xl border-2 border-b-[5px] text-left font-bold text-xs md:text-sm flex items-center justify-between transition-all cursor-pointer ${style}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-black">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isAnswered && idx === currentQ.answer && (
                        <span className="material-symbols-outlined text-emerald-600 fill-icon text-lg">
                          check_circle
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Answer Explanation & Action */}
            <div className="pt-6 border-t border-slate-100 mt-6">
              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3.5 rounded-2xl mb-4 text-xs ${
                      isCorrect
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                        : 'bg-rose-50 border border-rose-200 text-rose-900'
                    }`}
                  >
                    <p className="font-extrabold mb-1">
                      {isCorrect ? '✅ Analisis Gramatikal Tepat!' : '❌ Kaidah Tata Bahasa:'}
                    </p>
                    <p className="leading-relaxed opacity-90">{currentQ.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isAnswered ? (
                <button
                  onClick={handleAttackBoss}
                  disabled={selectedOption === null}
                  className={`tactile-btn w-full py-3.5 px-4 font-black text-xs rounded-xl border-b-[4px] flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                    selectedOption !== null
                      ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white border-rose-900'
                      : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  Kirim Jawaban (+350 Poin)
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="tactile-btn w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl border-b-[4px] border-indigo-900 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  Lanjut ke Soal Berikutnya →
                </button>
              )}
            </div>
          </div>
        </main>

        {/* SISI KANAN: Battle Log & Academic Notes (Cols 3) */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-amber-500">receipt_long</span>
              <h4 className="font-extrabold text-xs text-slate-900">Catatan Aktivitas Kuis</h4>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto text-[11px] pr-1">
              {battleLog.map((log, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-700 leading-snug"
                >
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Grimoire Hint */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-5 border border-indigo-200">
            <div className="flex items-center gap-2 mb-2 text-indigo-900">
              <span className="material-symbols-outlined text-base">menu_book</span>
              <h4 className="font-black text-xs">Petunjuk Kaidah (Hint)</h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Ingat kaidah Inversi Negatif pada TOEFL: Frasa seperti <em>Not only, Barely, Scarcely, Seldom</em> di awal kalimat mewajibkan pembalikan subjek dan auxiliary.
            </p>
          </div>
        </aside>
      </div>

      {/* VICTORY MODAL POPUP */}
      {isVictory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full text-center border-4 border-amber-400 shadow-2xl relative"
          >
            <HootieMascot mood="celebrate" speech="SIMULASI SELESAI!" size="hero" />

            <h2 className="text-2xl font-black text-slate-900 mt-4">Simulasi Berhasil!</h2>
            <p className="text-xs text-slate-600 mt-1">
              Kamu berhasil menuntaskan Simulasi TOEFL ITP Section 2 di Quiz Arena!
            </p>

            <div className="flex items-center justify-center gap-4 my-6">
              <div className="px-4 py-2.5 bg-amber-50 rounded-2xl border border-amber-200">
                <p className="text-[10px] font-bold text-slate-500">Bonus XP</p>
                <p className="text-base font-black text-amber-700">+500 XP</p>
              </div>
              <div className="px-4 py-2.5 bg-sky-50 rounded-2xl border border-sky-200">
                <p className="text-[10px] font-bold text-slate-500">Bonus Gems</p>
                <p className="text-base font-black text-sky-700">+150 Gems</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="tactile-btn w-full py-3.5 px-6 bg-indigo-600 text-white font-extrabold text-sm rounded-2xl border-b-[5px] border-indigo-900 shadow-md cursor-pointer"
            >
              Kembali ke Dashboard 🏆
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
