import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import HootieMascot from '../../components/mascot/HootieMascot';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const QUIZ_CATALOGUE = [
  {
    id: 'vocabulary', title: 'Vocabulary Challenge', subtitle: 'Kuasai kosakata bahasa Inggris dari level dasar hingga akademik',
    icon: 'menu_book', color: 'from-violet-500 to-purple-700', border: 'border-violet-200', badgeBg: 'bg-violet-100', badgeText: 'text-violet-800',
    tag: 'Dasar - Menengah', xpReward: 400, gemReward: 100, duration: '20 Menit', totalQ: 15, difficulty: 'Menengah', diffColor: 'text-violet-600',
    questions_data: [
      { type: 'VOCABULARY', question: 'Choose the correct synonym of the word "benevolent".', options: ['Malicious', 'Kindhearted', 'Ignorant', 'Boisterous'], answer: 1, explanation: '"Benevolent" berarti dermawan dan baik hati. Sinonimnya yang tepat adalah "kindhearted".' },
      { type: 'VOCABULARY', question: 'The word "ubiquitous" most nearly means:', options: ['Rare and precious', 'Found everywhere', 'Extremely ancient', 'Highly complicated'], answer: 1, explanation: '"Ubiquitous" artinya ada di mana-mana.' },
      { type: 'VOCABULARY', question: 'Select the antonym of "affluent".', options: ['Wealthy', 'Prominent', 'Impoverished', 'Generous'], answer: 2, explanation: '"Affluent" berarti kaya. Antonimnya adalah "impoverished".' },
    ],
  },
  {
    id: 'grammar', title: 'Grammar Challenge', subtitle: 'Uji pemahaman tata bahasa Inggris: tense, structure, dan kaidah',
    icon: 'spellcheck', color: 'from-rose-500 to-pink-700', border: 'border-rose-200', badgeBg: 'bg-rose-100', badgeText: 'text-rose-800',
    tag: 'Menengah - Mahir', xpReward: 500, gemReward: 150, duration: '25 Menit', totalQ: 15, difficulty: 'Sulit', diffColor: 'text-rose-600',
    questions_data: [
      { type: 'STRUCTURE', question: 'Not only _____ the research findings, but she also presented a compelling alternative model.', options: ['she challenged', 'did she challenge', 'she was challenging', 'had she challenged'], answer: 1, explanation: 'Kaidah Inversi Negatif: "Not only" di awal kalimat mengharuskan subjek dan auxiliary verb dibalik.' },
      { type: 'STRUCTURE', question: 'By the time the professor arrived, the students _____ for over an hour.', options: ['waited', 'have waited', 'had been waiting', 'were waiting'], answer: 2, explanation: 'Past Perfect Continuous digunakan untuk menyatakan aksi yang berlangsung hingga titik waktu tertentu di masa lampau.' },
      { type: 'STRUCTURE', question: 'Neither the students nor the teacher _____ aware of the schedule change.', options: ['were', 'was', 'are', 'have been'], answer: 1, explanation: 'Dengan "neither ... nor", verb mengikuti subjek yang paling dekat dengannya.' },
    ],
  },
  {
    id: 'reading', title: 'Reading Challenge', subtitle: 'Latih kemampuan membaca dan memahami teks bahasa Inggris akademik',
    icon: 'chrome_reader_mode', color: 'from-sky-500 to-blue-700', border: 'border-sky-200', badgeBg: 'bg-sky-100', badgeText: 'text-sky-800',
    tag: 'Menengah Atas - Mahir', xpReward: 450, gemReward: 120, duration: '30 Menit', totalQ: 10, difficulty: 'Sulit', diffColor: 'text-sky-600',
    questions_data: [
      { type: 'READING', question: 'Photosynthesis converts light energy into chemical energy stored in glucose. What is the main product?', options: ['Light energy', 'Oxygen', 'Glucose', 'Carbon dioxide'], answer: 2, explanation: 'Kalimat secara eksplisit menyebutkan bahwa energi kimia disimpan dalam glukosa.' },
      { type: 'READING', question: 'The word "converts" is closest in meaning to:', options: ['Destroys', 'Transforms', 'Produces', 'Absorbs'], answer: 1, explanation: '"Converts" berarti mengubah dari satu bentuk ke bentuk lain.' },
      { type: 'READING', question: 'Which inference can be drawn? "Photosynthesis converts light into chemical energy stored in glucose."', options: ['It requires no sunlight', 'It occurs only in animals', 'It is a process that stores energy', 'It releases energy as heat'], answer: 2, explanation: 'Teks menyebut "chemical energy stored", menunjukkan bahwa fotosintesis adalah proses penyimpanan energi.' },
    ],
  },
  {
    id: 'daily', title: 'Daily English Quiz', subtitle: 'Latihan harian ringan untuk menjaga kebiasaan belajar bahasa Inggris',
    icon: 'today', color: 'from-emerald-500 to-teal-700', border: 'border-emerald-200', badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-800',
    tag: 'Semua Level', xpReward: 250, gemReward: 60, duration: '10 Menit', totalQ: 10, difficulty: 'Mudah', diffColor: 'text-emerald-600',
    questions_data: [
      { type: 'DAILY', question: 'Which sentence is grammatically correct?', options: ["She don't like coffee.", "She doesn't likes coffee.", "She doesn't like coffee.", "She not likes coffee."], answer: 2, explanation: 'Untuk subjek singular (she), gunakan "does not" + base form verb.' },
      { type: 'DAILY', question: 'Complete: "I _____ to the library yesterday."', options: ['go', 'goes', 'went', 'going'], answer: 2, explanation: '"Yesterday" menandakan past tense. Bentuk lampau dari "go" adalah "went".' },
      { type: 'DAILY', question: 'What is the plural form of "child"?', options: ['Childs', 'Childes', 'Children', 'Childrens'], answer: 2, explanation: '"Child" memiliki bentuk jamak tidak beraturan: "children".' },
    ],
  },
  {
    id: 'mixed', title: 'Mixed English Quiz', subtitle: 'Kombinasi soal vocabulary, grammar, dan reading dalam satu sesi',
    icon: 'shuffle', color: 'from-amber-500 to-orange-600', border: 'border-amber-200', badgeBg: 'bg-amber-100', badgeText: 'text-amber-800',
    tag: 'Menengah - Mahir', xpReward: 600, gemReward: 200, duration: '35 Menit', totalQ: 20, difficulty: 'Campuran', diffColor: 'text-amber-600',
    questions_data: [
      { type: 'MIXED', question: 'The scientist hypothesis was _____ by the experimental data.', options: ['refuted', 'elevated', 'diminished', 'prolonged'], answer: 0, explanation: '"Refuted" berarti dibantah. Hipotesis yang tidak didukung data dikatakan "refuted".' },
      { type: 'MIXED', question: 'If I _____ harder, I would have passed the exam.', options: ['study', 'studied', 'had studied', 'have studied'], answer: 2, explanation: 'Third Conditional: "If + Past Perfect, would have + V3".' },
      { type: 'MIXED', question: 'The antonym of "transparent" is:', options: ['Clear', 'Opaque', 'Luminous', 'Visible'], answer: 1, explanation: '"Transparent" berarti tembus cahaya. Antonimnya adalah "opaque".' },
    ],
  },
  {
    id: 'conversation', title: 'Conversation Challenge', subtitle: 'Simulasi percakapan bahasa Inggris dalam konteks akademik dan sosial',
    icon: 'forum', color: 'from-indigo-500 to-blue-700', border: 'border-indigo-200', badgeBg: 'bg-indigo-100', badgeText: 'text-indigo-800',
    tag: 'Dasar - Menengah', xpReward: 350, gemReward: 80, duration: '15 Menit', totalQ: 12, difficulty: 'Menengah', diffColor: 'text-indigo-600',
    questions_data: [
      { type: 'CONVERSATION', question: 'A: "Could you please explain the assignment deadline?" B: "_____"', options: ['"Yes, I can explain."', '"Sure! The deadline is next Friday at midnight."', '"I do not know when."', '"The deadline is very important."'], answer: 1, explanation: 'Respons terbaik adalah yang informatif dan langsung menjawab pertanyaan dengan detail yang diminta.' },
      { type: 'CONVERSATION', question: 'Which is the most polite way to ask for help in an academic setting?', options: ['"Give me the notes."', '"Hey, notes please."', '"Would you mind sharing your notes with me?"', '"I need your notes now."'], answer: 2, explanation: '"Would you mind...?" adalah ekspresi sopan yang tepat untuk meminta bantuan dalam situasi formal.' },
      { type: 'CONVERSATION', question: 'Professor: "Do you have any questions about the lecture?" Best student response:', options: ['"No."', '"Yes, could you elaborate on the third point?"', '"I have many questions."', '"The lecture was boring."'], answer: 1, explanation: 'Respons akademik yang baik harus spesifik, sopan, dan menunjukkan keterlibatan aktif dalam materi.' },
    ],
  },
];

function QuizSelectionScreen({ onSelectQuiz }) {
  const navigate = useNavigate();
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-black border border-rose-200">
          <span className="material-symbols-outlined text-sm">sports_esports</span>
          QUIZ ARENA
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
          Pilih Tantangan Kuis<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-600">yang Ingin Kamu Kerjakan</span>
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
          Setiap kuis dirancang untuk mengasah kemampuan bahasa Inggrismu secara terarah. Pilih kategori dan mulai tantanganmu!
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-wrap items-center justify-center gap-3 text-xs">
        {[
          { icon: 'bolt', label: '6 Kategori Kuis', color: 'text-amber-600' },
          { icon: 'workspace_premium', label: 'Reward XP & Gems', color: 'text-violet-600' },
          { icon: 'timer', label: '10 - 35 Menit', color: 'text-sky-600' },
          { icon: 'trending_up', label: 'Semua Level', color: 'text-emerald-600' },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-slate-200 shadow-xs font-bold text-slate-700">
            <span className={"material-symbols-outlined text-sm " + s.color}>{s.icon}</span>
            {s.label}
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {QUIZ_CATALOGUE.map((quiz, i) => (
          <motion.div key={quiz.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={"relative bg-white rounded-3xl border-2 " + quiz.border + " shadow-sm overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"}
            onClick={() => onSelectQuiz(quiz)}>
            <div className={"bg-gradient-to-br " + quiz.color + " p-5 relative overflow-hidden"}>
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full" />
              <div className="absolute -right-8 -bottom-6 w-32 h-32 bg-white/10 rounded-full" />
              <div className="relative flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <span className="material-symbols-outlined text-2xl text-white">{quiz.icon}</span>
                </div>
                <div className={quiz.badgeBg + " " + quiz.badgeText + " text-[10px] font-black px-2.5 py-1 rounded-full"}>{quiz.tag}</div>
              </div>
              <h3 className="mt-3 text-base font-black text-white leading-tight">{quiz.title}</h3>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{quiz.subtitle}</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: 'quiz', val: quiz.totalQ + ' Soal' },
                  { icon: 'timer', val: quiz.duration },
                  { icon: 'signal_cellular_alt', val: quiz.difficulty, cls: quiz.diffColor },
                ].map((s) => (
                  <div key={s.icon} className="flex flex-col items-center gap-0.5 bg-slate-50 rounded-xl p-2 border border-slate-100">
                    <span className={"material-symbols-outlined text-sm " + (s.cls || 'text-slate-500')}>{s.icon}</span>
                    <span className={"text-[10px] font-black " + (s.cls || 'text-slate-600')}>{s.val}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 rounded-lg border border-amber-200 text-amber-700 text-[10px] font-black">
                  <span className="material-symbols-outlined text-xs">bolt</span>+{quiz.xpReward} XP
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 bg-sky-50 rounded-lg border border-sky-200 text-sky-700 text-[10px] font-black">
                  <span className="material-symbols-outlined text-xs">diamond</span>+{quiz.gemReward} Gems
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.97 }}
                className={"w-full py-2.5 px-4 rounded-xl font-black text-xs text-white bg-gradient-to-r " + quiz.color + " border-b-[3px] border-black/20 shadow-sm flex items-center justify-center gap-1.5"}>
                <span className="material-symbols-outlined text-sm">play_arrow</span>
                Mulai Kuis
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center pt-2">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-800 font-bold transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}

function QuizArena({ quiz, onBack }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { userStats, addXP, addGems } = useDataStore();

  const questions = quiz.questions_data;
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [score, setScore] = useState(0);
  const [battleLog, setBattleLog] = useState([
    'Quiz "' + quiz.title + '" dimulai! Jawab setiap soal dengan tepat.',
    'Status Mahasiswa: Evaluasi aktif (' + userStats.sp_barrier + ' SP).',
  ]);

  const totalQuestions = questions.length;
  const secMap = { reading: 1800, mixed: 2100, grammar: 1500 };
  const [timeLeft, setTimeLeft] = useState(secMap[quiz.id] || 1200);

  useEffect(() => {
    const timer = setInterval(() => { setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)); }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m.toString().padStart(2, '0') + ':' + sec.toString().padStart(2, '0');
  };

  const currentQ = questions[currentQIndex];

  const handleSelectOption = (idx) => { if (!isAnswered) setSelectedOption(idx); };

  const handleSubmit = () => {
    if (selectedOption === null || isAnswered) return;
    const correct = selectedOption === currentQ.answer;
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) {
      setScore((prev) => prev + 25);
      setBattleLog((prev) => ['Jawaban TEPAT! Kamu memperoleh +25 Poin!', ...prev]);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      setBattleLog((prev) => ['Jawaban belum tepat. Cermati penjelasan kaidah dan coba soal berikutnya.', ...prev]);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    if (currentQIndex < totalQuestions - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      setIsVictory(true);
      addXP(quiz.xpReward);
      addGems(quiz.gemReward);
      confetti({ particleCount: 180, spread: 100, origin: { y: 0.5 } });
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 space-y-6">
      <section className="bg-white rounded-3xl p-5 md:p-6 border border-rose-200/80 shadow-md relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative shrink-0">
              <div className={"w-20 h-20 rounded-2xl bg-gradient-to-br " + quiz.color + " p-1 border-2 border-rose-400 shadow-md flex items-center justify-center text-white"}>
                <span className="material-symbols-outlined text-4xl">{quiz.icon}</span>
              </div>
              <span className="absolute -top-2 -left-2 bg-rose-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full border-2 border-white shadow-xs">Quiz Arena</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg md:text-xl font-black text-slate-900 leading-tight">{quiz.title}</h1>
                <span className={quiz.badgeBg + " " + quiz.badgeText + " px-2 py-0.5 rounded-md text-[10px] font-black border"}>{quiz.tag}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{quiz.subtitle}</p>
            </div>
          </div>
          <div className="w-full lg:flex-1 max-w-xl flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-black">
              <span className="text-rose-600 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">assignment_turned_in</span>
                Progress Tantangan Kuis
              </span>
              <span className="text-rose-900 font-extrabold">Soal {currentQIndex + 1} / {totalQuestions} - Skor: {score} Poin</span>
            </div>
            <div className="w-full h-5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <motion.div className={"h-full bg-gradient-to-r " + quiz.color + " rounded-full shadow-inner"} style={{ width: (currentQIndex / totalQuestions * 100) + '%' }} transition={{ duration: 0.5 }} />
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-500 font-bold">
              <button onClick={onBack} className="flex items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-xs">arrow_back</span>
                Ganti Kuis
              </button>
              <span className="text-emerald-600">+25 Poin per jawaban benar</span>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-3 bg-rose-50 border-2 border-rose-200 px-4 py-2.5 rounded-2xl shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center animate-bounce">
              <span className="material-symbols-outlined text-lg">alarm</span>
            </div>
            <div>
              <div className="text-[9px] font-black uppercase text-rose-500 tracking-wider">Waktu Tersisa</div>
              <div className="text-base font-black text-rose-900">{formatTime(timeLeft)}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-600">person</span>
                <span className="font-extrabold text-xs text-slate-800">Profil Mahasiswa</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-black">Level {userStats.level}</span>
            </div>
            <div className="my-4 flex flex-col items-center text-center">
              <HootieMascot mood={isCorrect ? 'cheer' : 'fire'} size="lg" />
              <h2 className="mt-2 text-sm font-black text-slate-900">{user ? user.name : 'Budi Santoso'}</h2>
              <p className="text-[11px] text-slate-500">{quiz.title}</p>
            </div>
            <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
              <div className="flex justify-between text-[11px] font-black">
                <span className="text-sky-600 flex items-center gap-1"><span className="material-symbols-outlined text-xs">security</span> Ketahanan Kuis</span>
                <span className="text-sky-700">{userStats.sp_barrier} / {userStats.max_sp} SP</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: (userStats.sp_barrier / userStats.max_sp * 100) + '%' }} />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
              <span className="material-symbols-outlined text-amber-500 text-sm">local_fire_department</span>
              <span className="text-[11px] font-bold">Bonus Streak: +20% Poin</span>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-sm flex flex-col justify-between min-h-[460px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={quiz.badgeBg + " " + quiz.badgeText + " px-3 py-1 rounded-full text-xs font-black uppercase"}>{currentQ.type} #{currentQIndex + 1}</span>
                <span className="text-xs font-bold text-slate-400">Skor: +25 Poin EELS</span>
              </div>
              <h3 className="text-base md:text-lg font-black text-slate-900 leading-relaxed mb-6">{currentQ.question}</h3>
              <div className="space-y-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  let style = 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800';
                  if (isAnswered) {
                    if (idx === currentQ.answer) style = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500';
                    else if (isSelected && !isCorrect) style = 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500';
                    else style = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                  } else if (isSelected) { style = 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-500'; }
                  return (
                    <motion.button key={idx} whileTap={{ scale: 0.98 }} onClick={() => handleSelectOption(idx)} disabled={isAnswered}
                      className={"w-full p-4 rounded-2xl border-2 border-b-[5px] text-left font-bold text-xs md:text-sm flex items-center justify-between transition-all cursor-pointer " + style}>
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-black">{String.fromCharCode(65 + idx)}</span>
                        <span>{opt}</span>
                      </div>
                      {isAnswered && idx === currentQ.answer && <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>}
                    </motion.button>
                  );
                })}
              </div>
            </div>
            <div className="pt-6 border-t border-slate-100 mt-6">
              <AnimatePresence>
                {isAnswered && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={"p-3.5 rounded-2xl mb-4 text-xs " + (isCorrect ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-rose-50 border border-rose-200 text-rose-900')}>
                    <p className="font-extrabold mb-1">{isCorrect ? 'Jawaban Tepat!' : 'Kaidah / Penjelasan:'}</p>
                    <p className="leading-relaxed opacity-90">{currentQ.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              {!isAnswered ? (
                <button onClick={handleSubmit} disabled={selectedOption === null}
                  className={"tactile-btn w-full py-3.5 px-4 font-black text-xs rounded-xl border-b-[4px] flex items-center justify-center gap-2 shadow-sm cursor-pointer " +
                    (selectedOption !== null ? "bg-gradient-to-r " + quiz.color + " text-white border-black/20" : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed')}>
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  Kirim Jawaban (+25 Poin)
                </button>
              ) : (
                <button onClick={handleNext} className="tactile-btn w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl border-b-[4px] border-indigo-900 flex items-center justify-center gap-2 shadow-sm cursor-pointer">
                  {currentQIndex < totalQuestions - 1 ? 'Lanjut ke Soal Berikutnya' : 'Selesaikan Kuis'}
                </button>
              )}
            </div>
          </div>
        </main>

        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-amber-500">receipt_long</span>
              <h4 className="font-extrabold text-xs text-slate-900">Catatan Aktivitas Kuis</h4>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto text-[11px] pr-1">
              {battleLog.map((log, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-700 leading-snug">{log}</div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-5 border border-indigo-200">
            <div className="flex items-center gap-2 mb-2 text-indigo-900">
              <span className="material-symbols-outlined text-base">menu_book</span>
              <h4 className="font-black text-xs">Petunjuk Kaidah (Hint)</h4>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {quiz.id === 'grammar' ? 'Perhatikan kaidah inversi, concord, dan tense consistency dalam setiap kalimat.'
               : quiz.id === 'vocabulary' ? 'Pahami konteks kalimat untuk menentukan sinonim atau antonim yang paling tepat.'
               : quiz.id === 'reading' ? 'Baca teks secara aktif: cari ide pokok dan apa yang penulis ingin sampaikan.'
               : quiz.id === 'conversation' ? 'Pilih respons yang paling sopan, informatif, dan sesuai konteks akademik.'
               : 'Gunakan strategi eliminasi: buang opsi yang jelas salah, fokus pada dua pilihan terbaik.'}
            </p>
          </div>
        </aside>
      </div>

      {isVictory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full text-center border-4 border-amber-400 shadow-2xl relative">
            <HootieMascot mood="celebrate" speech="KUIS SELESAI!" size="hero" />
            <h2 className="text-2xl font-black text-slate-900 mt-4">Hebat! Kuis Selesai!</h2>
            <p className="text-xs text-slate-600 mt-1">Kamu berhasil menuntaskan <strong>{quiz.title}</strong> di Quiz Arena!</p>
            <div className="flex items-center justify-center gap-4 my-6">
              <div className="px-4 py-2.5 bg-amber-50 rounded-2xl border border-amber-200">
                <p className="text-[10px] font-bold text-slate-500">Skor Akhir</p>
                <p className="text-base font-black text-amber-700">{score} Poin</p>
              </div>
              <div className="px-4 py-2.5 bg-violet-50 rounded-2xl border border-violet-200">
                <p className="text-[10px] font-bold text-slate-500">Bonus XP</p>
                <p className="text-base font-black text-violet-700">+{quiz.xpReward} XP</p>
              </div>
              <div className="px-4 py-2.5 bg-sky-50 rounded-2xl border border-sky-200">
                <p className="text-[10px] font-bold text-slate-500">Bonus Gems</p>
                <p className="text-base font-black text-sky-700">+{quiz.gemReward}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={onBack} className="tactile-btn w-full py-3.5 px-6 bg-gradient-to-r from-rose-500 to-indigo-600 text-white font-extrabold text-sm rounded-2xl border-b-[5px] border-indigo-900 shadow-md cursor-pointer">
                Coba Kuis Lain
              </button>
              <button onClick={() => navigate('/dashboard')} className="tactile-btn w-full py-3 px-6 bg-white text-slate-700 font-bold text-xs rounded-2xl border border-slate-200 shadow-sm cursor-pointer">
                Kembali ke Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default function BossBattle() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  if (!selectedQuiz) return React.createElement(QuizSelectionScreen, { onSelectQuiz: setSelectedQuiz });
  return React.createElement(QuizArena, { quiz: selectedQuiz, onBack: () => setSelectedQuiz(null) });
}