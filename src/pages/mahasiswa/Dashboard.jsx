import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
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
  Compass,
  Layers,
  PenTool,
  MessageSquare,
  Globe,
  FileText,
  GraduationCap,
  Crown
} from 'lucide-react';

export default function StudentDashboard() {
  const navigate  = useNavigate();
  const { user }  = useAuthStore();

  // Live data from Supabase
  const [stats, setStats]             = useState({ total_xp: 0, gems: 0, streak_days: 0, total_completed_materials: 0, final_score: 0, quiz_average: 0 });
  const [activeMaterial, setActiveMaterial] = useState(null);
  const [weeklyXP, setWeeklyXP]       = useState([0, 0, 0, 0, 0, 0, 0]);
  const [levelName, setLevelName]     = useState('Beginner');
  const [levelNumber, setLevelNumber] = useState(1);
  const [missionProgress, setMissionProgress] = useState({ done: 0, total: 3 });
  const [currentLevelCompleted, setCurrentLevelCompleted] = useState(0);
  const [currentLevelTotal, setCurrentLevelTotal]         = useState(8);
  const [categoryMastery, setCategoryMastery]             = useState({ reading: 0, vocab: 0, grammar: 0, listening: 0 });
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    if (user?.id) fetchDashboardData();
  }, [user?.id]);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      // 1. User stats
      const { data: us } = await supabase
        .from('user_stats').select('*').eq('user_id', user.id).single();
      if (us) setStats(us);

      // 2. Profile & Level
      const { data: prof } = await supabase
        .from('profiles').select('current_level_id, levels(level_number, name)').eq('id', user.id).single();
      const userLevelNum = prof?.levels?.level_number || prof?.current_level_id || 1;
      const userLvlName  = prof?.levels?.name || 'Beginner';
      setLevelName(userLvlName);
      setLevelNumber(userLevelNum);

      // 3. User material progress
      const { data: progList } = await supabase
        .from('material_progress')
        .select('material_id, status, score, completed_at, materials(id, level_id, category_id, categories(name))')
        .eq('user_id', user.id);

      const completedMatIds = new Set();
      (progList || []).forEach(p => {
        if (p.status === 'completed') completedMatIds.add(p.material_id);
      });

      // 4. All published materials
      const { data: allMats } = await supabase
        .from('materials')
        .select('id, title, unit, level_id, category_id, sort_order, categories(name)')
        .eq('publish_status', 'published')
        .order('sort_order', { ascending: true });

      const mats = allMats || [];
      const currentLevelMats = mats.filter(m => (m.level_id || 1) === userLevelNum);
      const doneInLevel = currentLevelMats.filter(m => completedMatIds.has(m.id)).length;
      setCurrentLevelCompleted(doneInLevel);
      setCurrentLevelTotal(currentLevelMats.length || 8);

      // Active material
      let nextMat = currentLevelMats.find(m => !completedMatIds.has(m.id));
      if (!nextMat && mats.length > 0) nextMat = mats[0];
      setActiveMaterial(nextMat || null);

      // 5. Weekly XP from activity_log
      const since = new Date(); since.setDate(since.getDate() - 7);
      const { data: acts } = await supabase
        .from('activity_log').select('created_at, xp_earned').eq('user_id', user.id)
        .gte('created_at', since.toISOString());
      
      const days = [0, 0, 0, 0, 0, 0, 0];
      if (acts && acts.length > 0) {
        const today = new Date().getDay();
        acts.forEach(a => {
          const d = new Date(a.created_at).getDay();
          const offset = (d - today + 7) % 7;
          if (offset >= 0 && offset < 7) {
            days[6 - offset] = (days[6 - offset] || 0) + (a.xp_earned || 0);
          }
        });
      }
      setWeeklyXP(days);

      // 6. Category Mastery calculation
      const catCount = { Reading: { total: 0, done: 0 }, Vocabulary: { total: 0, done: 0 }, Grammar: { total: 0, done: 0 }, Listening: { total: 0, done: 0 } };
      mats.forEach(m => {
        const catName = m.categories?.name;
        if (catName && catCount[catName]) {
          catCount[catName].total++;
          if (completedMatIds.has(m.id)) catCount[catName].done++;
        }
      });
      const calcPct = (cat) => {
        const item = catCount[cat];
        return item && item.total > 0 ? Math.round((item.done / item.total) * 100) : 0;
      };
      setCategoryMastery({
        reading:   calcPct('Reading'),
        vocab:     calcPct('Vocabulary'),
        grammar:   calcPct('Grammar'),
        listening: calcPct('Listening'),
      });

      // 7. Daily Mission / Quests
      const todayIso = new Date().toISOString().split('T')[0];
      const todayXp = (acts || [])
        .filter(a => a.created_at?.startsWith(todayIso))
        .reduce((sum, a) => sum + (a.xp_earned || 0), 0);
      const todayModules = (progList || [])
        .filter(p => p.status === 'completed' && p.completed_at?.startsWith(todayIso)).length;
      
      let missionsDone = 0;
      if (todayXp >= 50) missionsDone++;
      if (todayModules >= 1) missionsDone++;
      if ((us?.current_streak || 0) > 0) missionsDone++;
      setMissionProgress({ done: missionsDone, total: 3 });

    } catch (e) {
      console.error('Dashboard fetch error:', e);
    } finally {
      setLoading(false);
    }
  }

  const weeklyXPMax = Math.max(...weeklyXP, 1);
  const weekDays   = ['Sn','Sl','Rb','Km','Jm','Sb','Mn'];
  const weeklyTotalXP = weeklyXP.reduce((a, b) => a + b, 0);
  const currentLevelProgress = currentLevelTotal > 0 ? Math.round((currentLevelCompleted / currentLevelTotal) * 100) : 0;
  const missionPercent = missionProgress.total > 0 ? Math.round((missionProgress.done / missionProgress.total) * 100) : 0;

  const levelsConfig = [
    {
      level: 1,
      title: 'Beginner',
      code: 'Pemula (A1)',
      description: 'Fondasi dasar bahasa Inggris, kosakata esensial perkuliahan, dan pengenalan tata bahasa kalimat sederhana.',
      skills: [
        { name: 'Vocabulary', topic: 'Daily Objects & Campus Words', icon: BookOpen },
        { name: 'Grammar', topic: 'Simple Present & Pronouns', icon: Layers },
        { name: 'Reading', topic: 'Short Descriptive Texts', icon: FileText },
        { name: 'Writing', topic: 'Basic Sentence Construction', icon: PenTool },
        { name: 'Conversation', topic: 'Greetings & Introduction', icon: MessageSquare },
        { name: 'Daily English', topic: 'Routine & Common Expressions', icon: Globe },
        { name: 'Academic English', topic: 'Campus Orientation Terms', icon: GraduationCap },
      ],
    },
    {
      level: 2,
      title: 'Learner',
      code: 'Dasar - Menengah (A2)',
      description: 'Pengembangan tata bahasa terstruktur, passive voice, serta pemahaman bacaan dan dialog perkuliahan.',
      skills: [
        { name: 'Vocabulary', topic: 'Phrasal Verbs & Contextual Clues', icon: BookOpen },
        { name: 'Grammar', topic: 'Past Perfect & Passive Voice', icon: Layers },
        { name: 'Reading', topic: 'Expository & Narrative Texts', icon: FileText },
        { name: 'Writing', topic: 'Structured Paragraphs & Linking', icon: PenTool },
        { name: 'Conversation', topic: 'Classroom Inquiries & Dialog', icon: MessageSquare },
        { name: 'Daily English', topic: 'Social Interactions & Campus Life', icon: Globe },
        { name: 'Academic English', topic: 'Intro to Research Abstracts', icon: GraduationCap },
      ],
    },
    {
      level: 3,
      title: 'English Explore',
      code: 'Menengah (B1)',
      description: 'Eksplorasi wacana semi-formal, argumentasi opini, dan pemahaman audio percakapan perkuliahan.',
      skills: [
        { name: 'Vocabulary', topic: 'Academic Word List (AWL) I', icon: BookOpen },
        { name: 'Grammar', topic: 'Conditionals & Relative Clauses', icon: Layers },
        { name: 'Reading', topic: 'Short Academic Articles & Skimming', icon: FileText },
        { name: 'Writing', topic: 'Argumentative Outlines & Essays', icon: PenTool },
        { name: 'Conversation', topic: 'Debates & Opinion Sharing', icon: MessageSquare },
        { name: 'Daily English', topic: 'Idioms & Natural Phrases', icon: Globe },
        { name: 'Academic English', topic: 'Listening EELS Part A & Lectures', icon: GraduationCap },
      ],
    },
    {
      level: 4,
      title: 'Intermediate',
      code: 'Menengah - Mahir (B2)',
      description: 'Pemantapan kompetensi membaca kritis, struktur inversi tingkat lanjut, dan komunikasi akademik formal.',
      skills: [
        { name: 'Vocabulary', topic: 'Collocations & AWL Sublist 4-7', icon: BookOpen },
        { name: 'Grammar', topic: 'Negative Inversion & Subjunctive', icon: Layers },
        { name: 'Reading', topic: 'Peer-Reviewed Literature & Inference', icon: FileText },
        { name: 'Writing', topic: 'Literature Synthesis & APA Citations', icon: PenTool },
        { name: 'Conversation', topic: 'Academic Presentations & Q&A', icon: MessageSquare },
        { name: 'Daily English', topic: 'Professional Etiquette & Nuance', icon: Globe },
        { name: 'Academic English', topic: 'EELS Structure & Error Recognition', icon: GraduationCap },
      ],
    },
    {
      level: 5,
      title: 'Advance Learner',
      code: 'Mahir (C1)',
      description: 'Analisis literatur ilmiah mendalam, penulisan artikel jurnal, dan kesiapan simulasi resmi EELS (Educlass English Learning Standart).',
      skills: [
        { name: 'Vocabulary', topic: 'Discipline-Specific Terminology', icon: BookOpen },
        { name: 'Grammar', topic: 'Complex Syntactic Variations', icon: Layers },
        { name: 'Reading', topic: 'Critical Evaluation of Research Papers', icon: FileText },
        { name: 'Writing', topic: 'Thesis Drafts & Research Methodologies', icon: PenTool },
        { name: 'Conversation', topic: 'Scholarly Discourse & Oral Defense', icon: MessageSquare },
        { name: 'Daily English', topic: 'Subtle Cultural & Idiomatic Nuances', icon: Globe },
        { name: 'Academic English', topic: 'Advanced EELS Full Practice', icon: GraduationCap },
      ],
    },
    {
      level: 6,
      title: 'English Master',
      code: 'Mahir / EELS 550+ (C2)',
      isCapstone: true,
      description: 'Puncak kemahiran berbahasa Inggris akademik, kelulusan standar beasiswa luar negeri, dan sertifikasi resmi.',
      skills: [
        { name: 'Vocabulary', topic: 'Advanced Lexical Precision (C1)', icon: BookOpen },
        { name: 'Grammar', topic: 'Flawless Academic Stylistics', icon: Layers },
        { name: 'Reading', topic: 'Comprehensive Synthesis & Speed Reading', icon: FileText },
        { name: 'Writing', topic: 'International Journal Publication Ready', icon: PenTool },
        { name: 'Conversation', topic: 'International Conferences & Keynotes', icon: MessageSquare },
        { name: 'Daily English', topic: 'Near-Native Conversational Fluency', icon: Globe },
        { name: 'Academic English', topic: 'EELS 550-600+ Mastery & Cert', icon: GraduationCap },
      ],
    },
  ];

  const levelMapData = levelsConfig.map(lvl => {
    const isCompleted = lvl.level < levelNumber;
    const isActive = lvl.level === levelNumber;

    let status = 'locked';
    let statusLabel = 'Terkunci';
    let progress = '0%';

    if (isCompleted) {
      status = 'completed';
      statusLabel = 'Selesai (100%)';
      progress = '100%';
    } else if (isActive) {
      status = 'active';
      statusLabel = `Sedang Ditempuh (${currentLevelCompleted}/${currentLevelTotal} Tuntas)`;
      progress = `${currentLevelProgress}%`;
    } else {
      status = 'locked';
      statusLabel = 'Terkunci';
    }

    return {
      ...lvl,
      status,
      statusLabel,
      progress,
      prerequisite: lvl.level > 1 ? `Tuntaskan Level ${lvl.level - 1}` : null,
      skills: lvl.skills.map((s, idx) => {
        let skillStatus = 'locked';
        if (isCompleted) {
          skillStatus = 'done';
        } else if (isActive) {
          if (idx < currentLevelCompleted) {
            skillStatus = 'done';
          } else if (idx === currentLevelCompleted) {
            skillStatus = 'in_progress';
          } else {
            skillStatus = 'ready';
          }
        }
        return { ...s, status: skillStatus };
      }),
    };
  });


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
                  {/* Lencana Level Mahasiswa Sesuai Map Sistem Level */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-black shadow-xs ring-2 ring-blue-100">
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    Level {levelNumber}: {levelName}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 text-xs font-extrabold border border-blue-200">
                    <Target className="w-3.5 h-3.5" />
                    Target: B2 Upper-Intermediate (EELS 550+)
                  </span>
                  {stats.total_xp > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-black">
                      {stats.total_xp} XP Total
                    </span>
                  )}
                </div>

                {/* Heading & Subtitle */}
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight">
                    Halo, {user?.name ? user.name.split(' ')[0] : 'Mahasiswa'}! Siap taklukkan target belajar hari ini? 🎓
                  </h1>
                  {stats.total_xp === 0 ? (
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      Selamat datang di EduClass! Akunmu telah siap. Mulailah petualangan belajarmu dari Level 1 untuk mengumpulkan XP, menaikkan level, dan membangun streak belajarmu!
                    </p>
                  ) : (
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                      Kamu telah mengumpulkan <strong>{stats.total_xp} XP</strong>. Selesaikan materi harian untuk terus meningkatkan level dan mempertahankan status belajarmu!
                    </p>
                  )}
                </div>

                {/* Daily Mission Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-500">Target Misi Harian</span>
                    <span className="text-slate-700">{missionProgress.done} dari {missionProgress.total} misi selesai ({missionPercent}%)</span>
                  </div>
                  <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${missionPercent}%` }} 
                    />
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <button
                    onClick={() => navigate(`/dashboard/modules/${activeMaterial?.id || 1}`)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>
                      {loading
                        ? 'Memuat materi...'
                        : activeMaterial
                        ? `${stats.total_completed_materials === 0 ? 'Mulai Belajar' : 'Lanjutkan'}: ${activeMaterial.title}`
                        : 'Lihat Modul'}
                    </span>
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

          {/* 2. MAP SISTEM LEVEL PEMBELAJARAN (Level Progression Map) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            
            {/* Section Header */}
            <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Compass className="w-4 h-4" />
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    Map Sistem Level Pembelajaran
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  6 Jenjang Kemahiran Mahasiswa • Terintegrasi Kurikulum Edu Module
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold border border-blue-200">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  Level {levelNumber} dari 6: {levelName} (Aktif)
                </span>
              </div>
            </div>

            {/* Quick Summary Pill Banner */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>
                  Setiap level memuat kurikulum komprehensif: <strong>Vocabulary, Grammar, Reading, Writing, Conversation, Daily English,</strong> dan <strong>Academic English</strong>.
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
                Total Progres: Level {levelNumber} ({currentLevelProgress}%)
              </span>
            </div>

            {/* Stepper / Level Roadmap */}
            <div className="relative py-2 space-y-6">
              
              {/* Connecting vertical line */}
              <div className="absolute left-[20px] sm:left-[24px] top-6 bottom-6 w-1 bg-gradient-to-b from-emerald-400 via-blue-500 to-slate-200 z-0 rounded-full" />

              {levelMapData.map((lvl) => {
                const isCompleted = lvl.status === 'completed';
                const isActive = lvl.status === 'active';
                const isReady = lvl.status === 'ready';
                const isLocked = lvl.status === 'locked';

                // Node Avatar Styling
                let nodeStyle = 'bg-slate-100 border-slate-300 text-slate-400';
                let NodeIcon = Lock;

                if (isCompleted) {
                  nodeStyle = 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-sm';
                  NodeIcon = Award;
                } else if (isActive) {
                  nodeStyle = 'bg-blue-600 border-blue-200 text-white shadow-md ring-4 ring-blue-100';
                  NodeIcon = Zap;
                } else if (isReady) {
                  nodeStyle = 'bg-indigo-50 border-indigo-300 text-indigo-600 shadow-xs';
                  NodeIcon = Compass;
                } else if (lvl.isCapstone) {
                  nodeStyle = 'bg-amber-50 border-amber-300 text-amber-600 shadow-sm';
                  NodeIcon = Crown;
                }

                // Card Container Styling
                let cardStyle = 'bg-white border-slate-200/90';
                if (isActive) {
                  cardStyle = 'bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30 border-blue-300 shadow-sm ring-1 ring-blue-100';
                } else if (isCompleted) {
                  cardStyle = 'bg-emerald-50/20 border-emerald-200/90 shadow-2xs';
                } else if (isLocked) {
                  cardStyle = 'bg-slate-50/60 border-slate-200 opacity-85';
                }

                return (
                  <div key={lvl.level} className="relative z-10 flex items-start gap-3.5 sm:gap-5">
                    
                    {/* Stepper Node Avatar */}
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border-2 sm:border-3 flex items-center justify-center shrink-0 transition-transform select-none ${nodeStyle}`}
                    >
                      <NodeIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>

                    {/* Level Card Body */}
                    <div className={`flex-1 rounded-2xl p-4 sm:p-5 border space-y-3.5 transition-all select-none ${cardStyle}`}>
                      
                      {/* Card Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                              isCompleted 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : isActive 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-slate-200 text-slate-600'
                            }`}>
                              LEVEL {lvl.level} • {lvl.code}
                            </span>
                            {lvl.isCapstone && (
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                                👑 CAPSTONE
                              </span>
                            )}
                          </div>
                          
                          <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1 leading-tight flex items-center gap-2">
                            Level {lvl.level}: {lvl.title}
                            {isCompleted && (
                              <span className="inline-flex items-center text-amber-400 gap-0.5">
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                              </span>
                            )}
                          </h3>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0">
                          {isCompleted && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              {lvl.statusLabel}
                            </span>
                          )}
                          {isActive && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-100 border border-blue-300 text-blue-800 text-xs font-black">
                              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                              {lvl.statusLabel}
                            </span>
                          )}
                          {isReady && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                              {lvl.statusLabel}
                            </span>
                          )}
                          {isLocked && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-xs font-bold">
                              <Lock className="w-3 h-3 text-slate-400" />
                              {lvl.prerequisite || 'Terkunci'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {lvl.description}
                      </p>

                      {/* Edu Module 7 Learning Components */}
                      <div className="pt-2.5 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                            <BookOpen className="w-3 h-3 text-blue-600" />
                            Cakupan 7 Pembelajaran Edu Modul:
                          </span>
                          {isCompleted && (
                            <span className="text-[10px] font-extrabold text-emerald-600 flex items-center gap-1">
                              <Check className="w-3 h-3" /> 7/7 Tuntas
                            </span>
                          )}
                          {isActive && (
                            <span className="text-[10px] font-extrabold text-blue-600 flex items-center gap-1">
                              Progres Level: {lvl.progress}
                            </span>
                          )}
                        </div>

                        {/* 7 Modules Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-1.5">
                          {lvl.skills.map((skill, sIdx) => {
                            const SkillIcon = skill.icon;
                            let chipStyle = 'bg-slate-50 border-slate-200/80 text-slate-600';
                            let statusIcon = <Lock className="w-2.5 h-2.5 text-slate-400 shrink-0" />;

                            if (skill.status === 'done') {
                              chipStyle = 'bg-emerald-50/80 border-emerald-200 text-emerald-900';
                              statusIcon = <Check className="w-2.5 h-2.5 text-emerald-600 shrink-0" />;
                            } else if (skill.status === 'in_progress') {
                              chipStyle = 'bg-blue-50 border-blue-300 text-blue-900 ring-1 ring-blue-200';
                              statusIcon = <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse shrink-0" />;
                            } else if (skill.status === 'ready') {
                              chipStyle = 'bg-indigo-50/70 border-indigo-200 text-indigo-800';
                              statusIcon = <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />;
                            }

                            return (
                              <div
                                key={sIdx}
                                className={`p-2 rounded-xl border flex flex-col justify-between transition-all ${chipStyle}`}
                                title={`${skill.name}: ${skill.topic}`}
                              >
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <div className="flex items-center gap-1 overflow-hidden">
                                    <SkillIcon className="w-3 h-3 text-slate-500 shrink-0" />
                                    <span className="font-extrabold text-[10px] leading-tight truncate">
                                      {skill.name}
                                    </span>
                                  </div>
                                  {statusIcon}
                                </div>
                                <span className="text-[9px] text-slate-500 leading-tight line-clamp-1">
                                  {skill.topic}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                <span className="font-black text-emerald-600">+{weeklyTotalXP} XP Total</span>
              </div>

              {/* Bar Chart Visualization - Live Data */}
              <div className="flex items-end justify-between gap-1.5 h-20 pt-2 px-1">
                {weeklyXP.map((xp, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <span className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[9px] font-bold py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap z-20 shadow-xs">
                      {xp} XP
                    </span>
                    <div className="w-full bg-slate-200 rounded-t-md h-16 flex items-end overflow-hidden">
                      <div
                        style={{ height: `${weeklyTotalXP > 0 ? Math.max(4, (xp / weeklyXPMax) * 100) : 4}%` }}
                        className={`w-full rounded-t-md transition-all ${
                          idx === 4
                            ? 'bg-blue-600 ring-2 ring-blue-300'
                            : 'bg-blue-400 hover:bg-blue-500'
                        }`}
                      />
                    </div>
                    <span className={`text-[10px] font-bold ${idx === 4 ? 'text-blue-600 font-black' : 'text-slate-400'}`}>
                      {weekDays[idx]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Penguasaan Skill */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Tingkat Penguasaan Skill
              </span>

              {[
                { skill: 'Reading & Comprehension', score: categoryMastery.reading, color: 'bg-emerald-500' },
                { skill: 'Academic Vocabulary', score: categoryMastery.vocab, color: 'bg-blue-600' },
                { skill: 'Grammar & Syntax', score: categoryMastery.grammar, color: 'bg-purple-600' },
                { skill: 'Listening & EELS Prep', score: categoryMastery.listening, color: 'bg-amber-500' },
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

          {/* WIDGET 1: TARGET SKOR EELS */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-slate-900">Target Skor EELS (Educlass English Learning Standart)</h3>
              <Target className="w-4 h-4 text-slate-400" />
            </div>

            {/* Score Big Display */}
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-black text-slate-900">{stats.final_score || 0}</span>
                <span className="text-sm font-bold text-slate-400 ml-1">/ 550 Target</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-200">
                {stats.final_score > 0 ? `+${stats.final_score} Poin tes` : 'Level 1: Beginner'}
              </span>
            </div>

            {/* Progress Track */}
            <div className="space-y-1">
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.round(((stats.final_score || 0) / 550) * 100))}%` }} 
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>Skor Saat Ini: {stats.final_score || 0}</span>
                <span>Terbina: {stats.total_xp} XP</span>
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
                    <p className="text-[10px] text-slate-500 font-bold">
                      {categoryMastery.listening > 0 ? `Penguasaan: ${categoryMastery.listening}%` : 'Belum ada latihan modul'}
                    </p>
                  </div>
                </div>
                <span className="font-black text-slate-800">
                  {categoryMastery.listening > 0 ? Math.round((categoryMastery.listening / 100) * 68) : 0} / 68
                </span>
              </div>

              {/* Structure */}
              <div className="flex items-start justify-between text-xs">
                <div className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800">Structure & Expression</p>
                    <p className="text-[10px] text-slate-500 font-bold">
                      {categoryMastery.grammar > 0 ? `Penguasaan: ${categoryMastery.grammar}%` : 'Belum ada latihan modul'}
                    </p>
                  </div>
                </div>
                <span className="font-black text-slate-800">
                  {categoryMastery.grammar > 0 ? Math.round((categoryMastery.grammar / 100) * 68) : 0} / 68
                </span>
              </div>

              {/* Reading */}
              <div className="flex items-start justify-between text-xs">
                <div className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800">Reading Comprehension</p>
                    <p className="text-[10px] text-slate-500 font-bold">
                      {categoryMastery.reading > 0 ? `Penguasaan: ${categoryMastery.reading}%` : 'Belum ada latihan modul'}
                    </p>
                  </div>
                </div>
                <span className="font-black text-slate-800">
                  {categoryMastery.reading > 0 ? Math.round((categoryMastery.reading / 100) * 67) : 0} / 67
                </span>
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
              <span className="text-[10px] font-bold text-slate-400">Reset: 24 Jam</span>
            </div>

            {/* Quests List */}
            <div className="space-y-3">
              {/* Quest 1 */}
              <div className={`p-3 rounded-2xl border space-y-1.5 ${
                stats.total_xp >= 50 ? 'bg-emerald-50/80 border-emerald-200/70' : 'bg-slate-50 border-slate-200/70'
              }`}>
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-bold ${stats.total_xp >= 50 ? 'text-emerald-900' : 'text-slate-800'}`}>
                    Raih 50 XP Hari Ini
                  </span>
                  <span className="text-[10px] font-black text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <Gem className="w-2.5 h-2.5" /> +10
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`${stats.total_xp >= 50 ? 'bg-emerald-500' : 'bg-blue-600'} h-full rounded-full`} 
                    style={{ width: `${Math.min(100, Math.round((Math.min(50, stats.total_xp) / 50) * 100))}%` }} 
                  />
                </div>
                <p className={`text-[10px] ${stats.total_xp >= 50 ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                  {Math.min(50, stats.total_xp)} / 50 XP dikumpulkan {stats.total_xp >= 50 && '• Selesai'}
                </p>
              </div>

              {/* Quest 2 */}
              <div className={`p-3 rounded-2xl border space-y-1.5 ${
                stats.total_completed_materials >= 1 ? 'bg-emerald-50/80 border-emerald-200/70' : 'bg-slate-50 border-slate-200/70'
              }`}>
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-bold ${stats.total_completed_materials >= 1 ? 'text-emerald-900' : 'text-slate-800'}`}>
                    Tuntaskan 1 Modul Pembelajaran
                  </span>
                  {stats.total_completed_materials >= 1 ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <span className="text-[10px] font-black text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <Gem className="w-2.5 h-2.5" /> +15
                    </span>
                  )}
                </div>
                <p className={`text-[10px] ${stats.total_completed_materials >= 1 ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                  {stats.total_completed_materials >= 1 ? '1 / 1 Selesai • Klaim Sukses' : '0 / 1 Modul Selesai'}
                </p>
              </div>

              {/* Quest 3 */}
              <div className={`p-3 rounded-2xl border space-y-1.5 ${
                stats.current_streak >= 1 ? 'bg-emerald-50/80 border-emerald-200/70' : 'bg-slate-50 border-slate-200/70'
              }`}>
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-bold ${stats.current_streak >= 1 ? 'text-emerald-900' : 'text-slate-800'}`}>
                    Bangun Streak Belajar Pertama
                  </span>
                  {stats.current_streak >= 1 ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <span className="text-[10px] font-black text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <Gem className="w-2.5 h-2.5" /> +20
                    </span>
                  )}
                </div>
                <p className={`text-[10px] ${stats.current_streak >= 1 ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                  {stats.current_streak >= 1 ? `${stats.current_streak} Hari Berturut-turut • Aktif` : '0 / 1 Hari Streak Aktif'}
                </p>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
