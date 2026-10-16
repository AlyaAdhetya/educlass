import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import HootieMascot from '../../components/mascot/HootieMascot';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function LessonQuiz() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { user }   = useAuthStore();

  const [material, setMaterial]   = useState(null);
  const [questions, setQuestions] = useState([]);
  const [hearts, setHearts]       = useState(5);
  const [loadingQuiz, setLoadingQuiz] = useState(true);

  useEffect(() => {
    async function fetchQuiz() {
      setLoadingQuiz(true);
      const { data: mat } = await supabase
        .from('material_with_category')
        .select('*')
        .eq('id', id)
        .single();
      if (mat) setMaterial(mat);

      const { data: qs } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('material_id', id)
        .order('sort_order');
      if (qs) setQuestions(qs.map(q => ({
        q:           q.question_text,
        options:     q.options,
        answer:      q.correct_answer_index,
        explanation: q.explanation || ''
      })));
      setLoadingQuiz(false);
    }
    if (id) fetchQuiz();
  }, [id]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100);

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || isAnswered) return;
    const correct = selectedOption === currentQ.answer;
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) {
      setScore((prev) => prev + 1);
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    } else {
      setHearts(h => Math.max(0, h - 1));
    }
  };

  const handleNextQuestion = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      const totalCorrect = score + (isCorrect ? 1 : 0);
      const finalScore   = Math.round((totalCorrect / questions.length) * 100);
      const xpReward     = material?.xp_reward || 100;
      const gemsReward   = 35;

      // Save progress to Supabase
      if (user?.id && id) {
        await supabase.from('material_progress').upsert({
          user_id:      user.id,
          material_id:  id,
          status:       finalScore >= (material?.min_score || 70) ? 'completed' : 'in_progress',
          score:        finalScore,
          xp_earned:    xpReward,
          attempts:     1,
          completed_at: finalScore >= (material?.min_score || 70) ? new Date().toISOString() : null,
        }, { onConflict: 'user_id,material_id' });

        // Update user_stats XP and gems
        await supabase.rpc('increment_user_stats', {
          p_user_id: user.id,
          p_xp:      xpReward,
          p_gems:    gemsReward
        }).catch(() => {
          // Fallback if RPC not available
          supabase.from('user_stats')
            .select('total_xp,gems,materials_completed')
            .eq('user_id', user.id)
            .single()
            .then(({ data }) => {
              if (data) {
                supabase.from('user_stats').update({
                  total_xp:            (data.total_xp || 0) + xpReward,
                  gems:                (data.gems || 0) + gemsReward,
                  materials_completed: (data.materials_completed || 0) + 1,
                }).eq('user_id', user.id);
              }
            });
        });

        // Log activity
        await supabase.from('activity_log').insert({
          user_id:     user.id,
          action_type: 'quiz_complete',
          material_id: id,
          xp_earned:   xpReward,
          metadata:    { score: finalScore, correct: totalCorrect, total: questions.length }
        });
      }

      setIsCompleted(true);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  };

  if (loadingQuiz) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  if (!material || questions.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-slate-500 gap-3">
      <span className="text-4xl">📭</span>
      <p className="font-bold">Belum ada soal kuis untuk materi ini.</p>
      <button onClick={() => navigate('/dashboard/modules')} className="text-indigo-600 font-bold text-sm mt-2 underline cursor-pointer">← Kembali ke Modul</button>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between max-w-3xl mx-auto px-4 py-6">
      {/* ================= TOP QUIZ BAR ================= */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Progress Bar */}
        <div className="flex-1 h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 rounded-xl border border-rose-200 text-rose-600 font-extrabold text-xs shadow-2xs">
          <span className="material-symbols-outlined fill-icon text-rose-500 text-base">
            favorite
          </span>
        <span>{hearts}</span>
        </div>
      </div>

      {/* ================= MAIN QUESTION AREA ================= */}
      {!isCompleted && currentQ ? (
        <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full my-auto">
          {/* Question Header */}
          <div className="mb-6 flex items-start gap-3">
            <HootieMascot
              mood={isAnswered ? (isCorrect ? 'cheer' : 'thinking') : 'happy'}
              size="sm"
            />
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                Soal {currentIndex + 1} dari {questions.length} • {material.category}
              </span>
              <h2 className="text-lg md:text-xl font-black text-slate-900 mt-2 leading-relaxed">
                {currentQ.q}
              </h2>
            </div>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              let btnStyle = 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800';

              if (isAnswered) {
                if (idx === currentQ.answer) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                btnStyle = 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-500';
              }

              return (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-2xl border-2 border-b-[5px] text-left font-bold text-sm md:text-base flex items-center justify-between transition-all cursor-pointer shadow-xs ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-black">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {isAnswered && idx === currentQ.answer && (
                    <span className="material-symbols-outlined text-emerald-600 fill-icon">
                      check_circle
                    </span>
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <span className="material-symbols-outlined text-rose-600 fill-icon">
                      cancel
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* ================= QUIZ COMPLETE SCREEN ================= */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center text-center p-6 my-auto"
        >
          <HootieMascot mood="celebrate" speech="Luar Biasa! Kamu Hebat!" size="hero" />

          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-6">
            Unit Berhasil Ditaklukkan!
          </h2>
          <p className="text-slate-500 text-sm max-w-sm mt-1">
            Kamu telah menyelesaikan evaluasi <strong className="text-slate-800">{material.title}</strong>{' '}
            dengan sangat baik.
          </p>

          {/* Reward Badges */}
          <div className="flex items-center gap-4 my-6">
            <div className="px-5 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
              <span className="material-symbols-outlined fill-icon text-amber-500 text-2xl">bolt</span>
              <p className="text-xs font-bold text-slate-500 mt-0.5">XP Didapat</p>
              <p className="text-lg font-black text-amber-700">+{material.xp_reward} XP</p>
            </div>

            <div className="px-5 py-3 rounded-2xl bg-sky-50 border border-sky-200 text-center">
              <span className="material-symbols-outlined fill-icon text-sky-500 text-2xl">diamond</span>
              <p className="text-xs font-bold text-slate-500 mt-0.5">Permata</p>
              <p className="text-lg font-black text-sky-700">+35 Gems</p>
            </div>

            <div className="px-5 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="material-symbols-outlined fill-icon text-emerald-500 text-2xl">star</span>
              <p className="text-xs font-bold text-slate-500 mt-0.5">Skor Akhir</p>
              <p className="text-lg font-black text-emerald-700">100%</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="tactile-btn px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl border-b-[5px] border-indigo-900 shadow-md cursor-pointer"
          >
            Lanjutkan Perjalanan Map 🚀
          </button>
        </motion.div>
      )}

      {/* ================= BOTTOM FEEDBACK / ACTION DOCK ================= */}
      {!isCompleted && (
        <div className="pt-4 border-t border-slate-200">
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className={`p-4 rounded-2xl mb-4 flex items-start gap-3 border ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                  }`}
                >
                  <span className="material-symbols-outlined fill-icon text-xl">
                    {isCorrect ? 'check' : 'priority_high'}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-black">
                    {isCorrect ? 'Luar biasa! Jawaban Benar!' : 'Kurang tepat! Pelajari kaidah ini:'}
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">
                    {currentQ.explanation ||
                      (isCorrect
                        ? 'Pemahaman kaidah tata bahasamu sudah tepat!'
                        : 'Perhatikan kata kunci dan konteks akademik dalam kalimat.')}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-end">
            {!isAnswered ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
                className={`tactile-btn w-full sm:w-auto px-8 py-3.5 rounded-2xl font-extrabold text-sm border-b-[4px] transition-all cursor-pointer ${
                  selectedOption !== null
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-900 shadow-md'
                    : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                }`}
              >
                Periksa Jawaban
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className={`tactile-btn w-full sm:w-auto px-8 py-3.5 rounded-2xl font-extrabold text-sm border-b-[4px] text-white shadow-md cursor-pointer ${
                  isCorrect
                    ? 'bg-emerald-500 hover:bg-emerald-600 border-emerald-700'
                    : 'bg-rose-500 hover:bg-rose-600 border-rose-700'
                }`}
              >
                {currentIndex < questions.length - 1 ? 'Lanjut ke Soal Berikutnya' : 'Selesaikan Kuis 🏁'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
