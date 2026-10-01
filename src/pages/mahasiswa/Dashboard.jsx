import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
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
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { materials, userStats } = useDataStore();

  // Edu Module yang sedang aktif / dipilih
  const activeMaterial =
    materials.find((m) => m.status === 'active') ||
    materials.find((m) => m.status !== 'locked') ||
    materials[0];

  // 6 Jenjang Sistem Level Mahasiswa & Cakupan 7 Modul Edu Module
  const levelMapData = [
    {
      level: 1,
      title: 'Beginner',
      code: 'Pemula',
      status: 'completed',
      statusLabel: 'Selesai (100%)',
      description: 'Fondasi dasar bahasa Inggris, kosakata esensial perkuliahan, dan pengenalan tata bahasa kalimat sederhana.',
      stars: 3,
      skills: [
        { name: 'Vocabulary', topic: 'Daily Objects & Campus Words', status: 'done', icon: BookOpen },
        { name: 'Grammar', topic: 'Simple Present & Pronouns', status: 'done', icon: Layers },
        { name: 'Reading', topic: 'Short Descriptive Texts', status: 'done', icon: FileText },
        { name: 'Writing', topic: 'Basic Sentence Construction', status: 'done', icon: PenTool },
        { name: 'Conversation', topic: 'Greetings & Introduction', status: 'done', icon: MessageSquare },
        { name: 'Daily English', topic: 'Routine & Common Expressions', status: 'done', icon: Globe },
        { name: 'Academic English', topic: 'Campus Orientation Terms', status: 'done', icon: GraduationCap },
      ],
    },
    {
      level: 2,
      title: 'Learner',
      code: 'Dasar - Menengah',
      status: 'active',
      statusLabel: 'Sedang Ditempuh (4/7 Tuntas)',
      description: 'Pengembangan tata bahasa terstruktur, passive voice, serta pemahaman bacaan dan dialog perkuliahan.',
      progress: '57%',
      skills: [
        { name: 'Vocabulary', topic: 'Phrasal Verbs & Contextual Clues', status: 'done', icon: BookOpen },
        { name: 'Grammar', topic: 'Past Perfect & Passive Voice', status: 'done', icon: Layers },
        { name: 'Reading', topic: 'Expository & Narrative Texts', status: 'done', icon: FileText },
        { name: 'Writing', topic: 'Structured Paragraphs & Linking', status: 'done', icon: PenTool },
        { name: 'Conversation', topic: 'Classroom Inquiries & Dialog', status: 'in_progress', icon: MessageSquare },
        { name: 'Daily English', topic: 'Social Interactions & Campus Life', status: 'pending', icon: Globe },
        { name: 'Academic English', topic: 'Intro to Research Abstracts', status: 'pending', icon: GraduationCap },
      ],
    },
    {
      level: 3,
      title: 'English Explore',
      code: 'Menengah',
      status: 'ready',
      statusLabel: 'Siap Diakses',
      description: 'Eksplorasi wacana semi-formal, argumentasi opini, dan pemahaman audio percakapan perkuliahan.',
      prerequisite: 'Selesaikan Level 2 (Learner)',
      skills: [
        { name: 'Vocabulary', topic: 'Academic Word List (AWL) I', status: 'ready', icon: BookOpen },
        { name: 'Grammar', topic: 'Conditionals & Relative Clauses', status: 'ready', icon: Layers },
        { name: 'Reading', topic: 'Short Academic Articles & Skimming', status: 'ready', icon: FileText },
        { name: 'Writing', topic: 'Argumentative Outlines & Essays', status: 'ready', icon: PenTool },
        { name: 'Conversation', topic: 'Debates & Opinion Sharing', status: 'ready', icon: MessageSquare },
        { name: 'Daily English', topic: 'Idioms & Natural Phrases', status: 'ready', icon: Globe },
        { name: 'Academic English', topic: 'Listening EELS Part A & Lectures', status: 'ready', icon: GraduationCap },
      ],
    },
    {
      level: 4,
      title: 'Intermediate',
      code: 'Menengah - Mahir',
      status: 'locked',
      statusLabel: 'Terkunci',
      description: 'Pemantapan kompetensi membaca kritis, struktur inversi tingkat lanjut, dan komunikasi akademik formal.',
      prerequisite: 'Tuntaskan Level 3 (English Explore)',
      skills: [
        { name: 'Vocabulary', topic: 'Collocations & AWL Sublist 4-7', status: 'locked', icon: BookOpen },
        { name: 'Grammar', topic: 'Negative Inversion & Subjunctive', status: 'locked', icon: Layers },
        { name: 'Reading', topic: 'Peer-Reviewed Literature & Inference', status: 'locked', icon: FileText },
        { name: 'Writing', topic: 'Literature Synthesis & APA Citations', status: 'locked', icon: PenTool },
        { name: 'Conversation', topic: 'Academic Presentations & Q&A', status: 'locked', icon: MessageSquare },
        { name: 'Daily English', topic: 'Professional Etiquette & Nuance', status: 'locked', icon: Globe },
        { name: 'Academic English', topic: 'EELS Structure & Error Recognition', status: 'locked', icon: GraduationCap },
      ],
    },
    {
      level: 5,
      title: 'Advance Learner',
      code: 'Mahir',
      status: 'locked',
      statusLabel: 'Terkunci',
      description: 'Analisis literatur ilmiah mendalam, penulisan artikel jurnal, dan kesiapan simulasi resmi EELS (Educlass English Learning Standart).',
      prerequisite: 'Tuntaskan Level 4 (Intermediate)',
      skills: [
        { name: 'Vocabulary', topic: 'Discipline-Specific Terminology', status: 'locked', icon: BookOpen },
        { name: 'Grammar', topic: 'Complex Syntactic Variations', status: 'locked', icon: Layers },
        { name: 'Reading', topic: 'Critical Evaluation of Research Papers', status: 'locked', icon: FileText },
        { name: 'Writing', topic: 'Thesis Drafts & Research Methodologies', status: 'locked', icon: PenTool },
        { name: 'Conversation', topic: 'Scholarly Discourse & Oral Defense', status: 'locked', icon: MessageSquare },
        { name: 'Daily English', topic: 'Subtle Cultural & Idiomatic Nuances', status: 'locked', icon: Globe },
        { name: 'Academic English', topic: 'Advanced EELS Full Practice', status: 'locked', icon: GraduationCap },
      ],
    },
    {
      level: 6,
      title: 'English Master',
      code: 'Mahir / EELS 550+',
      status: 'locked',
      isCapstone: true,
      statusLabel: 'Puncak Kemahiran & Sertifikasi',
      description: 'Puncak kemahiran berbahasa Inggris akademik, kelulusan standar beasiswa luar negeri, dan sertifikasi resmi.',
      prerequisite: 'Tuntaskan Level 1-5',
      skills: [
        { name: 'Vocabulary', topic: 'Advanced Lexical Precision (C1)', status: 'locked', icon: BookOpen },
        { name: 'Grammar', topic: 'Flawless Academic Stylistics', status: 'locked', icon: Layers },
        { name: 'Reading', topic: 'Comprehensive Synthesis & Speed Reading', status: 'locked', icon: FileText },
        { name: 'Writing', topic: 'International Journal Publication Ready', status: 'locked', icon: PenTool },
        { name: 'Conversation', topic: 'International Conferences & Keynotes', status: 'locked', icon: MessageSquare },
        { name: 'Daily English', topic: 'Near-Native Conversational Fluency', status: 'locked', icon: Globe },
        { name: 'Academic English', topic: 'EELS 550-600+ Mastery & Cert', status: 'locked', icon: GraduationCap },
      ],
    },
  ];

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
                    Level 2: Learner
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 text-xs font-extrabold border border-blue-200">
                    <Target className="w-3.5 h-3.5" />
                    Target: B2 Upper-Intermediate (EELS 550+)
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
                    onClick={() => navigate(`/dashboard/modules/${activeMaterial?.id || 1}`)}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Lanjutkan Belajar: {activeMaterial?.title || 'Edu Module'}</span>
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
                  6 Jenjang Kemahiran Mahasiswa • Terintegrasi 7 Pembelajaran Edu Module
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold border border-blue-200">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  Level 2 dari 6: Learner (Aktif)
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
                Total Progres: Level 2 (57%)
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

            {/* Penguasaan Skill */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Tingkat Penguasaan Skill
              </span>

              {[
                { skill: 'Reading & Comprehension', score: 92, color: 'bg-emerald-500' },
                { skill: 'Academic Vocabulary', score: 88, color: 'bg-blue-600' },
                { skill: 'Grammar & Syntax', score: 76, color: 'bg-purple-600' },
                { skill: 'Listening & EELS Prep', score: 82, color: 'bg-amber-500' },
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


        </div>
      </div>
    </div>
  );
}
