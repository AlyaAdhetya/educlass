import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDataStore } from '../../store/dataStore';
import { CheckCircle, XCircle, ArrowRight, BookOpen, RotateCcw, Trophy } from 'lucide-react';

export default function LessonQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { materials, completeMaterialAndUnlockNext, addXP } = useDataStore();

  const material = materials.find(m => m.id === parseInt(id));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  if (!material || !material.quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-slate-500 text-lg">Kuis tidak ditemukan.</p>
      </div>
    );
  }

  const questions = material.quiz;
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return; // Prevent changing answer
    setSelectedAnswer(index);

    if (index === questions[currentQuestion].answer) {
      setScore(s => s + (100 / questions.length));
    }

    setTimeout(() => {
      if (isLastQuestion) {
        handleFinish(score + (index === questions[currentQuestion].answer ? (100 / questions.length) : 0));
      } else {
        setCurrentQuestion(c => c + 1);
        setSelectedAnswer(null);
      }
    }, 1200); // 1.2s delay to show correct/incorrect color
  };

  const handleFinish = (finalScore) => {
    setShowResult(true);
    setScore(Math.round(finalScore));

    const isPassed = Math.round(finalScore) >= (material.min_score || 60);

    if (isPassed) {
      // Update store: complete this material, unlock next, and give XP
      completeMaterialAndUnlockNext(material.id, Math.round(finalScore));
      if (material.status !== 'completed') {
         addXP(material.xp_reward || 0);
      }
    }
  };

  const retryQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  if (showResult) {
    const isPassed = score >= (material.min_score || 60);

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100">
          
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ring-8 ${
            isPassed ? 'bg-emerald-100 ring-emerald-50 text-emerald-600' : 'bg-red-100 ring-red-50 text-red-500'
          }`}>
            {isPassed ? <Trophy className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            {isPassed ? 'Luar Biasa! 🎉' : 'Belum Lulus'}
          </h1>
          <p className="text-slate-500 mb-6">
            {isPassed 
              ? 'Kamu telah menyelesaikan evaluasi materi ini dengan sangat baik.' 
              : 'Skor kamu belum memenuhi standar minimum. Jangan menyerah!'}
          </p>

          <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Skor Akhir</p>
              <p className={`text-5xl font-extrabold ${isPassed ? 'text-emerald-600' : 'text-red-500'}`}>
                {score}
              </p>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <span className="text-sm font-medium text-slate-500">Target Skor: {material.min_score || 60}</span>
              {isPassed && material.status !== 'completed' && (
                <span className="text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                  +{material.xp_reward} XP
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {isPassed ? (
              <button
                onClick={() => navigate('/dashboard/modules')}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2"
              >
                Kembali ke Modul Belajar
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={retryQuiz}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md shadow-red-200 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Coba Ulangi Kuis
              </button>
            )}
            
            {!isPassed && (
              <button
                onClick={() => navigate(`/dashboard/modules/${material.id}`)}
                className="w-full py-3 text-slate-500 hover:text-slate-700 text-sm font-medium flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Pelajari Kembali Materi
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentQuestion];
  const progress = Math.round(((currentQuestion + 1) / questions.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Evaluasi Materi</span>
            <span className="text-sm font-bold text-slate-800">{material.title}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs font-bold text-blue-600">Soal {currentQuestion + 1} dari {questions.length}</span>
            </div>
            <div className="w-32 bg-slate-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-12">
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
            {q.q}
          </h2>
        </div>

        <div className="grid gap-3">
          {q.options.map((opt, i) => {
            const isSelected = selectedAnswer === i;
            const isCorrect = i === q.answer;
            const isAnswered = selectedAnswer !== null;

            let btnClass = "bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50";
            
            if (isAnswered) {
              if (isCorrect) {
                btnClass = "bg-emerald-50 border-2 border-emerald-500 text-emerald-700";
              } else if (isSelected && !isCorrect) {
                btnClass = "bg-red-50 border-2 border-red-500 text-red-700";
              } else {
                btnClass = "bg-white border-2 border-slate-100 text-slate-400 opacity-50";
              }
            } else if (isSelected) {
               btnClass = "bg-blue-50 border-2 border-blue-500 text-blue-700";
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={isAnswered}
                className={`relative w-full text-left p-5 rounded-2xl font-semibold transition-all duration-200 group ${btnClass}`}
              >
                <div className="flex items-center justify-between">
                  <span>{opt}</span>
                  {isAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
