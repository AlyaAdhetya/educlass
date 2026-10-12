import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  ClipboardList, Activity, Search, Edit, Trash2, CheckCircle2,
  AlertCircle, Plus, X, Check, Settings, Sliders, HelpCircle,
  Clock, Zap, Shield, RotateCcw, Sparkles, ExternalLink
} from 'lucide-react';
import { useDataStore } from '../../store/dataStore';

export default function AdminQuizzes() {
  const navigate = useNavigate();
  const { materials, activityLog, updateMaterial, settings, updateSettings } = useDataStore();
  
  const [activeTab, setActiveTab] = useState('bank'); // 'bank' (Configurations) | 'monitoring'
  const [searchStudent, setSearchStudent] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [quizSearch, setQuizSearch] = useState('');

  // Toast state
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // --- MODAL: EDIT QUIZ SETTINGS ---
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [selectedQuizMaterial, setSelectedQuizMaterial] = useState(null);
  const [settingsForm, setSettingsForm] = useState({
    title: '',
    unit: '',
    xp_reward: 80,
    min_score: 60,
    time_limit: 15,
    max_attempts: 3,
    shuffle_questions: false,
    show_explanations: true,
    quiz_status: 'active'
  });

  const openSettingsModal = (material) => {
    setSelectedQuizMaterial(material);
    setSettingsForm({
      title: material.title || '',
      unit: material.unit || '',
      xp_reward: material.xp_reward || 80,
      min_score: material.min_score || 60,
      time_limit: material.time_limit !== undefined ? material.time_limit : 15,
      max_attempts: material.max_attempts || 3,
      shuffle_questions: material.shuffle_questions || false,
      show_explanations: material.show_explanations !== undefined ? material.show_explanations : true,
      quiz_status: material.quiz_status || 'active'
    });
    setSettingsModalOpen(true);
  };

  const handleSaveQuizSettings = (e) => {
    e.preventDefault();
    if (!selectedQuizMaterial) return;

    updateMaterial(selectedQuizMaterial.id, {
      xp_reward: Number(settingsForm.xp_reward),
      min_score: Number(settingsForm.min_score),
      time_limit: Number(settingsForm.time_limit),
      max_attempts: Number(settingsForm.max_attempts),
      shuffle_questions: Boolean(settingsForm.shuffle_questions),
      show_explanations: Boolean(settingsForm.show_explanations),
      quiz_status: settingsForm.quiz_status
    });

    setSettingsModalOpen(false);
    showToast(`Pengaturan kuis "${selectedQuizMaterial.title}" berhasil disimpan!`);
  };

  // --- MODAL: MANAGE QUESTIONS ---
  const [questionsModalOpen, setQuestionsModalOpen] = useState(false);
  const [managingMaterial, setManagingMaterial] = useState(null);
  
  // Question edit/create sub-state
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [questionForm, setQuestionForm] = useState({
    q: '',
    options: ['', '', '', ''],
    answer: 0,
    explanation: ''
  });
  const [deletingQuestionIdx, setDeletingQuestionIdx] = useState(null);

  const openQuestionsModal = (material) => {
    setManagingMaterial(material);
    setIsEditingQuestion(false);
    setEditingQuestionIndex(null);
    setDeletingQuestionIdx(null);
    setQuestionsModalOpen(true);
  };

  // Refresh current managing material from materials state
  const currentManaging = managingMaterial
    ? materials.find(m => m.id === managingMaterial.id) || managingMaterial
    : null;
  const currentQuestions = currentManaging?.quiz || [];

  const handleStartAddQuestion = () => {
    setIsEditingQuestion(true);
    setEditingQuestionIndex(null);
    setQuestionForm({
      q: '',
      options: ['', '', '', ''],
      answer: 0,
      explanation: ''
    });
  };

  const handleStartEditQuestion = (index) => {
    const q = currentQuestions[index];
    if (!q) return;
    setIsEditingQuestion(true);
    setEditingQuestionIndex(index);
    setQuestionForm({
      q: q.q || '',
      options: q.options && q.options.length ? [...q.options] : ['', '', '', ''],
      answer: q.answer || 0,
      explanation: q.explanation || ''
    });
  };

  const handleSaveQuestion = (e) => {
    e.preventDefault();
    if (!currentManaging) return;

    if (!questionForm.q.trim()) {
      alert('Pertanyaan kuis tidak boleh kosong.');
      return;
    }

    if (questionForm.options.some(opt => !opt.trim())) {
      alert('Semua 4 pilihan jawaban harus diisi.');
      return;
    }

    let updatedQuestions = [...currentQuestions];
    const newQ = {
      q: questionForm.q.trim(),
      options: questionForm.options.map(o => o.trim()),
      answer: Number(questionForm.answer),
      explanation: questionForm.explanation.trim()
    };

    if (editingQuestionIndex !== null) {
      updatedQuestions[editingQuestionIndex] = newQ;
    } else {
      updatedQuestions.push(newQ);
    }

    updateMaterial(currentManaging.id, { quiz: updatedQuestions });
    setIsEditingQuestion(false);
    setEditingQuestionIndex(null);
    showToast(editingQuestionIndex !== null ? 'Soal kuis berhasil diperbarui!' : 'Soal baru berhasil ditambahkan!');
  };

  const handleDeleteQuestion = (index) => {
    if (!currentManaging) return;
    const updatedQuestions = currentQuestions.filter((_, idx) => idx !== index);
    updateMaterial(currentManaging.id, { quiz: updatedQuestions });
    setDeletingQuestionIdx(null);
    showToast('Soal kuis berhasil dihapus.');
  };

  // --- GLOBAL SETTINGS MODAL ---
  const [globalModalOpen, setGlobalModalOpen] = useState(false);
  const [globalSettingsForm, setGlobalSettingsForm] = useState({
    minPassingScore: settings?.learning?.minPassingScore || 60,
    maxRetakes: settings?.learning?.maxRetakes || 3,
    allowRetake: settings?.learning?.allowRetake !== undefined ? settings?.learning?.allowRetake : true,
    showExplanation: settings?.learning?.showExplanation !== undefined ? settings?.learning?.showExplanation : true,
  });

  const openGlobalModal = () => {
    setGlobalSettingsForm({
      minPassingScore: settings?.learning?.minPassingScore || 60,
      maxRetakes: settings?.learning?.maxRetakes || 3,
      allowRetake: settings?.learning?.allowRetake !== undefined ? settings?.learning?.allowRetake : true,
      showExplanation: settings?.learning?.showExplanation !== undefined ? settings?.learning?.showExplanation : true,
    });
    setGlobalModalOpen(true);
  };

  const handleSaveGlobalSettings = (e) => {
    e.preventDefault();
    updateSettings('learning', {
      minPassingScore: Number(globalSettingsForm.minPassingScore),
      maxRetakes: Number(globalSettingsForm.maxRetakes),
      allowRetake: Boolean(globalSettingsForm.allowRetake),
      showExplanation: Boolean(globalSettingsForm.showExplanation),
    });
    setGlobalModalOpen(false);
    showToast('Pengaturan global kuis berhasil diperbarui!');
  };

  // Submissions for monitoring
  const quizSubmissions = activityLog
    .filter(a => a.type === 'quiz')
    .map(log => ({
      id: log.id,
      name: log.studentName,
      quiz: log.detail,
      score: log.score,
      status: log.score >= 60 ? 'Lulus' : 'Remedial',
      date: new Date(log.date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
    }));

  const filteredMonitoring = quizSubmissions.filter((sub) => {
    const matchName = sub.name.toLowerCase().includes(searchStudent.toLowerCase());
    const matchStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchName && matchStatus;
  });

  const passedCount = quizSubmissions.filter(s => s.status === 'Lulus').length;
  const totalCount = quizSubmissions.length;
  const passRate = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;
  const avgScore = totalCount > 0 ? Math.round(quizSubmissions.reduce((acc, curr) => acc + curr.score, 0) / totalCount) : 0;

  // Filter materials for configuration tab
  const filteredMaterials = materials.filter(m =>
    (m.title || '').toLowerCase().includes(quizSearch.toLowerCase()) ||
    (m.unit || '').toLowerCase().includes(quizSearch.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 min-h-screen">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Quiz Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor student quiz attempts and manage module quiz configurations.
          </p>
        </div>

        {/* Tab switch & Global Settings */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={openGlobalModal}
            className="rounded-2xl text-xs font-bold border-slate-200 hover:bg-slate-50 text-slate-700"
          >
            <Sliders className="w-3.5 h-3.5 mr-1.5 text-indigo-600" /> Global Rules
          </Button>

          <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('bank')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'bank'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ClipboardList className="w-4 h-4 inline-block mr-1.5" /> Quiz Configurations
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('monitoring')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'monitoring'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-4 h-4 inline-block mr-1.5" /> Monitoring
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Attempts</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{totalCount}</h3>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Average Score</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{avgScore} / 100</h3>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pass Rate</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">{passRate}%</h3>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Needs Attention</span>
          <h3 className="text-2xl font-black text-rose-600 mt-1">{totalCount - passedCount}</h3>
        </div>
      </div>

      {/* TAB 1: CONFIGURATION (Default) */}
      {activeTab === 'bank' && (
        <Card className="rounded-3xl border border-slate-100 shadow-xs">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-slate-100 gap-4">
            <div>
              <CardTitle className="text-base font-black text-slate-900">
                Module Quizzes
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Konfigurasi bobot XP, passing grade, durasi, serta kelola butir soal per modul.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari modul kuis..."
                  value={quizSearch}
                  onChange={(e) => setQuizSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-52 bg-slate-50 focus:bg-white transition-all"
                />
              </div>

              <Button
                onClick={() => navigate('/admin/questions')}
                variant="outline"
                size="sm"
                className="rounded-xl text-xs font-bold border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100/50"
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Question Bank
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-4">
              {filteredMaterials.map((m) => {
                const questionCount = m.quiz?.length || 0;
                const isConfigured = questionCount > 0;
                const isActive = m.quiz_status !== 'inactive';

                return (
                  <div
                    key={m.id}
                    className="p-5 border border-slate-200 rounded-2xl bg-white shadow-xs hover:border-indigo-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-black rounded uppercase">
                          {m.unit}
                        </span>
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 flex items-center gap-1">
                          <Zap className="w-3 h-3 fill-amber-500" /> {m.xp_reward || 80} XP
                        </span>
                        <span className="text-xs text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          Passing: {m.min_score || 60}%
                        </span>
                        {m.time_limit !== undefined && m.time_limit > 0 && (
                          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {m.time_limit} Menit
                          </span>
                        )}
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <h3 className="font-extrabold text-base text-slate-900">{m.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {questionCount} Multiple choice questions • {m.questSteps?.length || 0} Interactive quests
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openSettingsModal(m)}
                        className="rounded-xl text-xs font-bold border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50"
                      >
                        <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit Settings
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => openQuestionsModal(m)}
                        className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                      >
                        <ClipboardList className="w-3.5 h-3.5 mr-1.5" /> Manage Questions
                        <span className="ml-1.5 px-1.5 py-0.2 bg-indigo-500/80 text-[10px] rounded-full font-mono">
                          {questionCount}
                        </span>
                      </Button>
                    </div>
                  </div>
                );
              })}

              {filteredMaterials.length === 0 && (
                <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <ClipboardList className="w-10 h-10 mx-auto mb-2 opacity-30 text-slate-400" />
                  <p className="text-sm font-bold text-slate-600">Tidak ada modul kuis ditemukan</p>
                  <p className="text-xs text-slate-400 mt-1">Coba kata kunci pencarian yang lain.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: MONITORING */}
      {activeTab === 'monitoring' && (
        <Card className="rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-white p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-black text-slate-900">
                  Quiz Attempts Log
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Riwayat pengerjaan kuis terbaru oleh mahasiswa beserta status kelulusan.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search name..."
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="Lulus">Passed</option>
                  <option value="Remedial">Failed</option>
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-100 uppercase tracking-wider font-extrabold text-[10px]">
                    <th className="py-3 px-6">Student Name</th>
                    <th className="py-3 px-6">Quiz Module</th>
                    <th className="py-3 px-6">Score</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6">Date Completed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMonitoring.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-6 font-bold text-slate-900">{sub.name}</td>
                      <td className="py-3.5 px-6 text-slate-700">{sub.quiz}</td>
                      <td className="py-3.5 px-6 font-black font-mono text-sm text-indigo-700">
                        {sub.score}
                      </td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] inline-flex items-center gap-1 ${
                            sub.status === 'Lulus'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {sub.status === 'Lulus' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {sub.status === 'Lulus' ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-slate-500 font-medium">{sub.date}</td>
                    </tr>
                  ))}
                  {filteredMonitoring.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 text-sm font-medium">
                        No quiz attempts found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: EDIT QUIZ SETTINGS                               */}
      {/* ======================================================== */}
      {settingsModalOpen && selectedQuizMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {selectedQuizMaterial.unit}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">Quiz Settings</h3>
                <p className="text-xs text-slate-500 font-medium truncate max-w-xs sm:max-w-md">
                  {selectedQuizMaterial.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSettingsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuizSettings} className="space-y-4 mt-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> XP Reward
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    step="5"
                    value={settingsForm.xp_reward}
                    onChange={(e) => setSettingsForm({ ...settingsForm, xp_reward: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold font-mono"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Bonus XP saat lulus kuis</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" /> Min. Passing Score (%)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={settingsForm.min_score}
                    onChange={(e) => setSettingsForm({ ...settingsForm, min_score: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold font-mono"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Skor minimum kelulusan</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" /> Durasi / Time Limit
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={settingsForm.time_limit}
                    onChange={(e) => setSettingsForm({ ...settingsForm, time_limit: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Menit (0 = tanpa batas waktu)</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5 text-sky-500" /> Max Attempts / Retakes
                  </label>
                  <select
                    value={settingsForm.max_attempts}
                    onChange={(e) => setSettingsForm({ ...settingsForm, max_attempts: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold bg-white"
                  >
                    <option value="1">1 kali (Tidak ada retake)</option>
                    <option value="2">2 kali kesempatan</option>
                    <option value="3">3 kali kesempatan</option>
                    <option value="5">5 kali kesempatan</option>
                    <option value="999">Tak Terbatas (Unlimited)</option>
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1">Batas percobaan kuis</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-3">
                <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Acak Urutan Soal (Shuffle)</span>
                    <span className="text-[11px] text-slate-500">Acak nomor soal setiap mahasiswa memulai tes</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsForm.shuffle_questions}
                    onChange={(e) => setSettingsForm({ ...settingsForm, shuffle_questions: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition-colors">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Tampilkan Pembahasan Soal</span>
                    <span className="text-[11px] text-slate-500">Berikan penjelasan jawaban setelah selesai menjawab</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsForm.show_explanations}
                    onChange={(e) => setSettingsForm({ ...settingsForm, show_explanations: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </label>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Status Kuis Modul</span>
                    <span className="text-[11px] text-slate-500">Buka atau tutup kuis ini untuk mahasiswa</span>
                  </div>
                  <select
                    value={settingsForm.quiz_status}
                    onChange={(e) => setSettingsForm({ ...settingsForm, quiz_status: e.target.value })}
                    className="text-xs font-bold p-1.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="active">Active (Tersedia)</option>
                    <option value="inactive">Inactive (Terkunci)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSettingsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" /> Simpan Pengaturan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: MANAGE QUESTIONS                                */}
      {/* ======================================================== */}
      {questionsModalOpen && currentManaging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {currentManaging.unit}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {currentQuestions.length} Butir Soal Terdaftar
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  Manage Questions: {currentManaging.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {!isEditingQuestion && (
                  <button
                    type="button"
                    onClick={handleStartAddQuestion}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Soal
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setQuestionsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Question List OR Form */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {isEditingQuestion ? (
                /* QUESTION EDIT / ADD FORM */
                <form onSubmit={handleSaveQuestion} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <h4 className="text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-indigo-600" />
                      {editingQuestionIndex !== null ? `Edit Soal #${editingQuestionIndex + 1}` : 'Buat Soal Pilihan Ganda Baru'}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsEditingQuestion(false)}
                      className="text-xs font-bold text-slate-400 hover:text-slate-700"
                    >
                      Batal
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Pertanyaan / Soal <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={questionForm.q}
                      onChange={(e) => setQuestionForm({ ...questionForm, q: e.target.value })}
                      placeholder="Contoh: What is the formal equivalent of 'to find out'?"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Pilihan Jawaban (Pilih radio button untuk jawaban yang benar) <span className="text-rose-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {['A', 'B', 'C', 'D'].map((optLabel, optIdx) => (
                        <div
                          key={optIdx}
                          className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                            questionForm.answer === optIdx
                              ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-200'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <input
                            type="radio"
                            id={`opt_${optIdx}`}
                            name="correctAnswer"
                            checked={questionForm.answer === optIdx}
                            onChange={() => setQuestionForm({ ...questionForm, answer: optIdx })}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                            questionForm.answer === optIdx ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {optLabel}
                          </span>
                          <input
                            type="text"
                            value={questionForm.options[optIdx] || ''}
                            onChange={(e) => {
                              const newOptions = [...questionForm.options];
                              newOptions[optIdx] = e.target.value;
                              setQuestionForm({ ...questionForm, options: newOptions });
                            }}
                            placeholder={`Pilihan ${optLabel}...`}
                            className="flex-1 text-xs py-1 px-2 border-0 bg-transparent focus:outline-none focus:ring-0 font-medium"
                            required
                          />
                          {questionForm.answer === optIdx && (
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full mr-1">
                              Jawaban Benar
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Penjelasan / Pembahasan Jawaban
                    </label>
                    <input
                      type="text"
                      value={questionForm.explanation}
                      onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                      placeholder="Penjelasan ringkas mengapa jawaban tersebut benar..."
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingQuestion(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
                    >
                      {editingQuestionIndex !== null ? 'Perbarui Soal' : 'Simpan Soal'}
                    </button>
                  </div>
                </form>
              ) : (
                /* LIST OF QUESTIONS */
                <>
                  {currentQuestions.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <HelpCircle className="w-10 h-10 mx-auto mb-2 opacity-30 text-indigo-400" />
                      <p className="text-sm font-bold text-slate-700">Belum ada butir soal kuis</p>
                      <p className="text-xs text-slate-400 mt-1">Klik tombol "Tambah Soal" untuk membuat soal pilihan ganda.</p>
                      <button
                        type="button"
                        onClick={handleStartAddQuestion}
                        className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                      >
                        <Plus className="w-3.5 h-3.5" /> Tambah Soal Pertama
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentQuestions.map((q, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-xs transition-all space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                              <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <p className="text-xs font-extrabold text-slate-900 leading-relaxed">
                                {q.q}
                              </p>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleStartEditQuestion(idx)}
                                title="Edit Soal"
                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              
                              {deletingQuestionIdx === idx ? (
                                <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                                  <span className="text-[10px] font-bold text-rose-700 px-1">Hapus?</span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(idx)}
                                    className="p-1 bg-rose-600 text-white rounded hover:bg-rose-700 text-[10px] font-black"
                                  >
                                    Ya
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeletingQuestionIdx(null)}
                                    className="p-1 text-slate-500 hover:bg-slate-200 rounded text-[10px]"
                                  >
                                    Batal
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setDeletingQuestionIdx(idx)}
                                  title="Hapus Soal"
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Options grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8">
                            {q.options && q.options.map((opt, oIdx) => {
                              const isCorrect = oIdx === q.answer;
                              return (
                                <div
                                  key={oIdx}
                                  className={`p-2 rounded-xl text-xs font-medium flex items-center gap-2 border ${
                                    isCorrect
                                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
                                      : 'bg-slate-50/80 border-slate-100 text-slate-600'
                                  }`}
                                >
                                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                                    isCorrect ? 'bg-emerald-600 text-white' : 'border border-slate-300 text-slate-400'
                                  }`}>
                                    {isCorrect ? <Check className="w-2.5 h-2.5" /> : String.fromCharCode(65 + oIdx)}
                                  </span>
                                  <span className="truncate">{opt}</span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Explanation */}
                          {q.explanation && (
                            <div className="ml-8 text-[11px] bg-slate-50 text-slate-600 rounded-xl p-2.5 border border-slate-100">
                              <strong className="text-slate-800">Pembahasan:</strong> {q.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setQuestionsModalOpen(false);
                  navigate('/admin/questions');
                }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Buka di Question Bank Editor
              </button>

              <button
                type="button"
                onClick={() => setQuestionsModalOpen(false)}
                className="px-5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: GLOBAL QUIZ RULES                                */}
      {/* ======================================================== */}
      {globalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Global Quiz Rules</h3>
                  <p className="text-xs text-slate-500">Aturan standar kuis untuk semua modul</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGlobalModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGlobalSettings} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Default Min. Passing Score (%)
                </label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={globalSettingsForm.minPassingScore}
                  onChange={(e) => setGlobalSettingsForm({ ...globalSettingsForm, minPassingScore: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-bold font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Default Max Retakes
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={globalSettingsForm.maxRetakes}
                  onChange={(e) => setGlobalSettingsForm({ ...globalSettingsForm, maxRetakes: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 font-bold font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
                  <span className="text-xs font-bold text-slate-800">Izinkan Mahasiswa Retake Kuis</span>
                  <input
                    type="checkbox"
                    checked={globalSettingsForm.allowRetake}
                    onChange={(e) => setGlobalSettingsForm({ ...globalSettingsForm, allowRetake: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
                  <span className="text-xs font-bold text-slate-800">Tampilkan Pembahasan Standar</span>
                  <input
                    type="checkbox"
                    checked={globalSettingsForm.showExplanation}
                    onChange={(e) => setGlobalSettingsForm({ ...globalSettingsForm, showExplanation: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGlobalModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
                >
                  Simpan Aturan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
