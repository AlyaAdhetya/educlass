import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Play,
  CheckCircle2,
  Check,
  Lock,
  Headphones,
  BookOpen,
  Trophy,
  Award,
  Zap,
  Target,
  Sparkles,
  TrendingUp,
  Flame,
  Gem,
  ArrowRight,
  HelpCircle,
  Clock,
  ChevronRight,
  Star,
  CheckSquare
} from 'lucide-react';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { userStats } = useDataStore();

  // State for Daily Micro-Quiz
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const microQuiz = {
    question: '"Not only ________ the examination with top honors, but she also received a research fellowship."',
    options: [
      { id: 'A', text: 'she passed' },
      { id: 'B', text: 'did she pass' },
      { id: 'C', text: 'she had passed' },
      { id: 'D', text: 'she has passed' },
    ],
    correctAnswer: 'B',
    tip: "Aturan Negative Inversion diawali dengan 'Not only + auxiliary verb'."
  };

  const handleCheckQuiz = () => {
    if (!selectedOption) return;
    const correct = selectedOption === microQuiz.correctAnswer;
    setIsCorrect(correct);
    setQuizChecked(true);

    if (correct) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  const handleResetQuiz = () => {
    setSelectedOption(null);
    setQuizChecked(false);
    setIsCorrect(false);
  };

  return (
    <div className="max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* 2-COLUMN MAIN CONTENT GRID (Sesuai Image 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= SISI KIRI / TENGAH (COLS 8) ================= */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. HERO WELCOME CARD (Sesuai Image 2) */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50/90 via-indigo-50/50 to-white border border-blue-100 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-6 relative z-10">
              
              {/* Left Content */}
              <div className="flex-1 space-y-4 text-left">
                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 text-xs font-extrabold border border-blue-200">
                    <Target className="w-3.5 h-3.5" />
                    Target: B2 Upper-Intermediate (TOEFL 550+)
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-black">
                    +75 XP Hari Ini
                  </span>
                </div>

                {/* Heading & Subtitle */}
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
                    Halo, {user?.name ? user.name.split(' ')[0] : 'Budi'}! Siap taklukkan target belajar hari ini? 🎓
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    Kamu berada di peringkat 5% teratas minggu ini. Selesaikan materi untuk terus meningkatkan level dan mempertahankan status beasiswa!
                  </p>
                </div>

                {/* Daily Mission Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-500">Target Misi Harian</span>
                    <span className="text-slate-700">3 dari 5 misi selesai (60%)</span>
                  </div>
                  <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: '60%' }} 
                    />
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <button
                    onClick={() => navigate('/dashboard/quest/unit-2')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Lanjutkan Belajar: Structure & Written Expression #4</span>
                  </button>
                </div>
              </div>

              {/* Right Mascot Image */}
              <div className="w-36 h-36 sm:w-48 sm:h-48 shrink-0 flex items-center justify-center">
                <img
                  src="/mascot.jpg"
                  alt="EduClass Owl Mascot"
                  className="w-full h-full object-contain rounded-2xl drop-shadow-md hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

          {/* 2. JALUR PEMBELAJARAN INTERAKTIF (Interactive Learning Path - Sesuai Image 2) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            
            {/* Section Header */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  Jalur Pembelajaran Interaktif
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kurikulum Terstruktur CEFR & TOEFL ITP Standardized Modules
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold border border-blue-200">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                Modul 2 dari 5
              </span>
            </div>

            {/* Vertical Stepper Nodes (Sesuai Desain Image 2) */}
            <div className="relative py-4 space-y-8">
              
              {/* Connecting line */}
              <div className="absolute left-[28px] sm:left-1/2 top-4 bottom-4 w-1 bg-slate-200 -translate-x-1/2 z-0" />

              {/* UNIT 1 (Selesai - Mastered) */}
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Left Description */}
                <div className="sm:w-[42%] text-left sm:text-right pl-14 sm:pl-0">
                  <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">
                    UNIT 1 • SELESAI
                  </span>
                  <h3 className="text-sm font-black text-slate-900 mt-0.5">
                    Foundations of Academic Vocabulary
                  </h3>
                  <div className="flex items-center sm:justify-end gap-1 text-amber-400 mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                  </div>
                </div>

                {/* Center Node (Green Completed) */}
                <div className="absolute left-0 sm:left-1/2 -translate-x-0 sm:-translate-x-1/2 w-14 h-14 rounded-full bg-emerald-50 border-4 border-emerald-500 text-emerald-600 flex items-center justify-center shadow-md">
                  <Award className="w-6 h-6" />
                </div>

                {/* Right Status Badge */}
                <div className="sm:w-[42%] text-left pl-14 sm:pl-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                    <Check className="w-3.5 h-3.5" />
                    Skor: 100% (Mastered)
                  </span>
                </div>
              </div>

              {/* UNIT 2 (Sedang Aktif) */}
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Left Description */}
                <div className="sm:w-[42%] text-left sm:text-right pl-14 sm:pl-0">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase mb-1">
                    SEDANG AKTIF
                  </span>
                  <h3 className="text-sm font-black text-slate-900">
                    Sentence Structure & Inversion
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Latihan 4 dari 8 Sesi</p>
                </div>

                {/* Center Node (Active Blue) */}
                <div className="absolute left-0 sm:left-1/2 -translate-x-0 sm:-translate-x-1/2 w-14 h-14 rounded-full bg-blue-600 border-4 border-blue-200 text-white flex items-center justify-center shadow-lg ring-4 ring-blue-100">
                  <BookOpen className="w-6 h-6" />
                </div>

                {/* Right Action Button */}
                <div className="sm:w-[42%] text-left pl-14 sm:pl-4">
                  <button
                    onClick={() => navigate('/dashboard/quest/unit-2')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md transition-all cursor-pointer"
                  >
                    <span>Mulai Sesi</span>
                    <span className="px-1.5 py-0.2 rounded bg-blue-500 text-[10px] font-bold">+25 XP</span>
                  </button>
                </div>
              </div>

              {/* UNIT 3 (Siap Diakses) */}
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Left Description */}
                <div className="sm:w-[42%] text-left sm:text-right pl-14 sm:pl-0">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    UNIT 3 • SIAP DIAKSES
                  </span>
                  <h3 className="text-sm font-black text-slate-700 mt-0.5">
                    Academic Listening: Campus Conversations
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">TOEFL Part A & B</p>
                </div>

                {/* Center Node */}
                <div className="absolute left-0 sm:left-1/2 -translate-x-0 sm:-translate-x-1/2 w-14 h-14 rounded-full bg-slate-100 border-4 border-slate-300 text-slate-500 flex items-center justify-center shadow-xs">
                  <Headphones className="w-6 h-6" />
                </div>

                {/* Right Status */}
                <div className="sm:w-[42%] text-left pl-14 sm:pl-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                    Prasyarat Terpenuhi
                  </span>
                </div>
              </div>

              {/* UNIT 4 (Terkunci) */}
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 opacity-75">
                {/* Left Description */}
                <div className="sm:w-[42%] text-left sm:text-right pl-14 sm:pl-0">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    UNIT 4 • TERKUNCI
                  </span>
                  <h3 className="text-sm font-bold text-slate-600 mt-0.5">
                    Reading Comprehension: Science & Arts
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Skimming & Inference</p>
                </div>

                {/* Center Node (Locked) */}
                <div className="absolute left-0 sm:left-1/2 -translate-x-0 sm:-translate-x-1/2 w-14 h-14 rounded-full bg-slate-100 border-4 border-slate-300 text-slate-400 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>

                {/* Right Status */}
                <div className="sm:w-[42%] text-left pl-14 sm:pl-4">
                  <span className="text-xs text-slate-400 font-medium">
                    Tuntaskan Unit 2 & 3
                  </span>
                </div>
              </div>

              {/* UJIAN PUNCAK (Full Practice Test) */}
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Left Description */}
                <div className="sm:w-[42%] text-left sm:text-right pl-14 sm:pl-0">
                  <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">
                    UJIAN PUNCAK
                  </span>
                  <h3 className="text-sm font-black text-slate-800 mt-0.5">
                    Full Practice Test Simulasi ITP #1
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">140 Soal • 115 Menit</p>
                </div>

                {/* Center Node (Gold Trophy) */}
                <div className="absolute left-0 sm:left-1/2 -translate-x-0 sm:-translate-x-1/2 w-14 h-14 rounded-full bg-amber-50 border-4 border-amber-400 text-amber-600 flex items-center justify-center shadow-md">
                  <Trophy className="w-6 h-6" />
                </div>

                {/* Right Status */}
                <div className="sm:w-[42%] text-left pl-14 sm:pl-4">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    Sertifikat Prediksi TOEFL
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. CARD: UJI PEMAHAMAN CEPAT (Daily Micro-Quiz - Sesuai Image 2) */}
          <div id="microquiz" className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                  Uji Pemahaman Cepat (Daily Micro-Quiz)
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                Reward: +10 XP
              </span>
            </div>

            {/* Prompt Question */}
            <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
              {microQuiz.question}
            </p>

            {/* 2x2 Options Grid (Sesuai Image 2) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {microQuiz.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                let optionStyle = 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800';

                if (quizChecked) {
                  if (opt.id === microQuiz.correctAnswer) {
                    optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-300';
                  } else {
                    optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-300';
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      if (!quizChecked) setSelectedOption(opt.id);
                    }}
                    className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium flex items-center gap-3 transition-all cursor-pointer ${optionStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-black shrink-0">
                      {opt.id}
                    </span>
                    <span className="font-semibold">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Tip & Action Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="text-[11px] text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-800">💡 Tips:</span> {microQuiz.tip}
              </div>

              {!quizChecked ? (
                <button
                  type="button"
                  onClick={handleCheckQuiz}
                  disabled={!selectedOption}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
                >
                  Periksa Jawaban
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer shrink-0"
                >
                  Coba Lagi
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ================= SISI KANAN / WIDGETS (COLS 4 - Sesuai Image 2) ================= */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* WIDGET 0: GRAFIK PROGRES BELAJAR MAHASISWA (Fitur Baru: Visual Activity & Skill Chart) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 leading-tight">Grafik Progres Belajar</h3>
                  <span className="text-[10px] text-slate-400">Aktivitas Mingguan & Skill</span>
                </div>
              </div>
              <Link
                to="/dashboard/progress"
                className="text-[11px] font-extrabold text-blue-600 hover:underline"
              >
                Detail →
              </Link>
            </div>

            {/* Grafik Batang Mingguan (Weekly Activity Bar Chart) */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-bold text-slate-600">XP Harian (Pekan Ini)</span>
                <span className="font-black text-emerald-600">+1.005 XP (Aktif)</span>
              </div>

              {/* Bar Chart Visualization */}
              <div className="flex items-end justify-between gap-1.5 h-20 pt-2 px-1">
                {[
                  { day: 'Sn', xp: 120, height: 55, active: false },
                  { day: 'Sl', xp: 85, height: 40, active: false },
                  { day: 'Rb', xp: 190, height: 80, active: false },
                  { day: 'Km', xp: 140, height: 65, active: false },
                  { day: 'Jm', xp: 220, height: 95, active: true },
                  { day: 'Sb', xp: 90, height: 45, active: false },
                  { day: 'Mn', xp: 160, height: 75, active: false },
                ].map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <span className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[9px] font-bold py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap z-20 shadow-xs">
                      {bar.xp} XP
                    </span>
                    <div className="w-full bg-slate-200 rounded-t-md h-16 flex items-end overflow-hidden">
                      <div
                        style={{ height: `${bar.height}%` }}
                        className={`w-full rounded-t-md transition-all ${
                          bar.active
                            ? 'bg-blue-600 ring-2 ring-blue-300'
                            : 'bg-blue-400 hover:bg-blue-500'
                        }`}
                      />
                    </div>
                    <span className={`text-[10px] font-bold ${bar.active ? 'text-blue-600 font-black' : 'text-slate-400'}`}>
                      {bar.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Penguasaan Skill CEFR */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Tingkat Penguasaan Skill
              </span>

              {[
                { skill: 'Reading & Comprehension', score: 92, color: 'bg-emerald-500' },
                { skill: 'Academic Vocabulary', score: 88, color: 'bg-blue-600' },
                { skill: 'Grammar & Syntax', score: 76, color: 'bg-purple-600' },
                { skill: 'Listening & TOEFL Prep', score: 82, color: 'bg-amber-500' },
              ].map((s, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-600">{s.skill}</span>
                    <span className="text-slate-900">{s.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WIDGET 1: TARGET SKOR TOEFL ITP */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-slate-900">Target Skor TOEFL ITP</h3>
              <Target className="w-4 h-4 text-slate-400" />
            </div>

            {/* Score Big Display */}
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-black text-slate-900">510</span>
                <span className="text-sm font-bold text-slate-400 ml-1">/ 550 Target</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                +30 Poin dari tes awal
              </span>
            </div>

            {/* Progress Track */}
            <div className="space-y-1">
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: '85%' }} 
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>Skor Masuk: 480</span>
                <span>Terbina: 40 Poin</span>
                <span>Target: 550</span>
              </div>
            </div>

            {/* Rincian Kemampuan Seksi */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                Rincian Kemampuan Seksi
              </p>

              {/* Listening */}
              <div className="flex items-start justify-between text-xs">
                <div className="flex items-start gap-2">
                  <Headphones className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800">Listening Comprehension</p>
                    <p className="text-[10px] text-emerald-600 font-bold">Kekuatan: Short Dialogues</p>
                  </div>
                </div>
                <span className="font-black text-slate-800">52 / 68</span>
              </div>

              {/* Structure */}
              <div className="flex items-start justify-between text-xs">
                <div className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800">Structure & Expression</p>
                    <p className="text-[10px] text-amber-600 font-bold">Perlu latihan inversion</p>
                  </div>
                </div>
                <span className="font-black text-slate-800">48 / 68</span>
              </div>

              {/* Reading */}
              <div className="flex items-start justify-between text-xs">
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800">Reading Comprehension</p>
                    <p className="text-[10px] text-slate-500 font-bold">Vocabulary in context stabil</p>
                  </div>
                </div>
                <span className="font-black text-slate-800">53 / 67</span>
              </div>
            </div>

            {/* Bottom Diagnostic Link */}
            <Link
              to="/dashboard/progress"
              className="block w-full py-2.5 text-center text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50/60 rounded-xl transition-colors border border-blue-100"
            >
              Lihat Analisis Diagnostik Lengkap →
            </Link>
          </div>

          {/* WIDGET 2: MISI HARIAN (Quests - Sesuai Image 2) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                <h3 className="font-black text-sm text-slate-900">Misi Harian (Quests)</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Reset: 7 Jam lagi</span>
            </div>

            {/* Quests List */}
            <div className="space-y-3">
              {/* Quest 1 */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Raih 50 XP Hari Ini</span>
                  <span className="text-[10px] font-black text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <Gem className="w-2.5 h-2.5" /> +10
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '70%' }} />
                </div>
                <p className="text-[10px] text-slate-500">35 / 50 XP dikumpulkan</p>
              </div>

              {/* Quest 2 (Selesai) */}
              <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-900">1 Sesi Listening Tanpa Salah</span>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <p className="text-[10px] text-emerald-700 font-bold">1 / 1 Selesai • Klaim Sukses</p>
              </div>

              {/* Quest 3 */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">Latihan 15 Menit Berturut-turut</span>
                  <span className="text-[10px] font-black text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <Gem className="w-2.5 h-2.5" /> +15
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '80%' }} />
                </div>
                <p className="text-[10px] text-slate-500">12 / 15 Menit aktif</p>
              </div>
            </div>
          </div>

          {/* WIDGET 3: LIGA MAHASISWA (Liga Ruby - Sesuai Image 2) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h3 className="font-black text-sm text-slate-900">Liga Mahasiswa</h3>
              </div>
              <span className="text-[10px] font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                Liga Ruby
              </span>
            </div>

            {/* Promotion Banner */}
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zona Promosi ke Liga Diamond (Sisa 2 Hari)!</span>
            </div>

            {/* Leaderboard Top 3 list */}
            <div className="space-y-2.5 pt-1">
              {/* Rank 1 */}
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 text-xs font-black text-slate-400">1</span>
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs flex items-center justify-center">
                    AS
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-800 leading-tight">Adinda S.</p>
                    <p className="text-[10px] text-slate-400">Univ. Indonesia</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black text-slate-800">6.200</span>
                  <span className="text-[10px] text-slate-400">XP</span>
                  <span className="text-sm">🥇</span>
                </div>
              </div>

              {/* Rank 2 (User) */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-blue-50/70 border border-blue-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 text-xs font-black text-blue-600">2</span>
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center">
                    BS
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-blue-900 leading-tight">
                      {user?.name || 'Budi Santoso'} <span className="text-[10px] text-blue-600 font-bold">(Kamu)</span>
                    </p>
                    <p className="text-[10px] text-slate-400">Teknik Informatika</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black text-blue-900">4.850</span>
                  <span className="text-[10px] text-slate-400">XP</span>
                  <span className="text-sm">🥈</span>
                </div>
              </div>

              {/* Rank 3 */}
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 text-xs font-black text-slate-400">3</span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-extrabold text-xs flex items-center justify-center">
                    BS
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-800 leading-tight">Budi Santoso</p>
                    <p className="text-[10px] text-slate-400">UGM Yogyakarta</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black text-slate-800">4.620</span>
                  <span className="text-[10px] text-slate-400">XP</span>
                  <span className="text-sm">🥉</span>
                </div>
              </div>
            </div>

            {/* Full Leaderboard Link */}
            <Link
              to="/dashboard/leaderboard"
              className="block text-center text-xs font-bold text-slate-500 hover:text-blue-600 pt-1"
            >
              Lihat 50 Peringkat Nasional →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
