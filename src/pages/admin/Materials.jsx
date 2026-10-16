import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  BookOpen, Plus, Search, Filter, MoreVertical, 
  Edit, Trash2, Layout, CheckCircle2, AlertCircle, PlayCircle, Clock,
  X, HelpCircle, FileText, Check, Award, ChevronRight, Sparkles, Layers
} from 'lucide-react';

export default function AdminMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  
  const [searchQuery, setSearchQuery]   = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLevel, setFilterLevel]   = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [activeModalTab, setActiveModalTab]   = useState('info');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toastMessage, setToastMessage]       = useState(null);

  useEffect(() => { fetchMaterials(); }, []);

  async function fetchMaterials() {
    setLoading(true);
    const { data, error } = await supabase
      .from('material_with_category')
      .select('*, material_pages(*), quiz_questions(*)')
      .order('sort_order', { ascending: true });
    if (!error && data) {
      // Shape data to match UI expectations
      const shaped = data.map(m => ({
        ...m,
        category:   m.category_name || 'General',
        level:      m.level_number  || 1,
        cefr:       m.cefr_label    || '',
        pages:      (m.material_pages || []).sort((a,b) => a.page_number - b.page_number)
                      .map(p => ({ title: p.title, content: p.content })),
        quiz:       (m.quiz_questions || []).sort((a,b) => a.sort_order - b.sort_order)
                      .map(q => ({ q: q.question_text, options: q.options, answer: q.correct_answer_index, explanation: q.explanation || '' })),
      }));
      setMaterials(shaped);
    }
    setLoading(false);
  }

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Categories list
  const categoryOptions = [
    'Vocabulary', 'Grammar', 'Reading', 'Writing', 
    'Listening', 'Conversation', 'Academic English', 'Daily English'
  ];

  // CEFR levels
  const cefrOptions = [
    'Dasar', 'Dasar - Menengah', 'Menengah', 'Menengah Atas', 'Mahir'
  ];

  // Form State
  const initialFormState = {
    unit: 'Unit',
    title: '',
    category: 'Vocabulary',
    level: 1,
    cefr: 'Dasar',
    description: '',
    xp_reward: 100,
    min_score: 70,
    status: 'completed',
    pages: [{ title: 'Pengantar Materi', content: 'Tuliskan materi pembelajaran teori atau literatur akademik di sini...' }],
    quiz: [{ q: 'Pertanyaan evaluasi kuis pertama...', options: ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'], answer: 0, explanation: 'Penjelasan mengapa jawaban ini benar.' }]
  };

  const [formData, setFormData] = useState(initialFormState);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingMaterial(null);
    setFormData({ ...initialFormState, unit: `Unit ${materials.length + 1}` });
    setActiveModalTab('info');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (material) => {
    setEditingMaterial(material);
    setFormData({
      unit: material.unit || `Unit ${material.id}`,
      title: material.title || '',
      category: material.category || 'Vocabulary',
      level: material.level || 1,
      cefr: material.cefr || 'Dasar',
      description: material.description || '',
      xp_reward: material.xp_reward || 100,
      min_score: material.min_score || 70,
      status: material.status === 'completed' || material.status === 'active' ? 'completed' : 'draft',
      pages: material.pages && material.pages.length > 0 
        ? JSON.parse(JSON.stringify(material.pages)) 
        : [{ title: 'Pengantar Materi', content: '' }],
      quiz: material.quiz && material.quiz.length > 0
        ? JSON.parse(JSON.stringify(material.quiz))
        : [{ q: '', options: ['', '', '', ''], answer: 0, explanation: '' }]
    });
    setActiveModalTab('info');
    setIsModalOpen(true);
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) { alert('Judul materi wajib diisi!'); return; }
    setSaving(true);
    try {
      // Find category_id
      const { data: cats } = await supabase.from('categories').select('id,name');
      const catObj = cats?.find(c => c.name === formData.category);

      // Find level_id
      const levelId = Number(formData.level);

      const payload = {
        unit:           formData.unit,
        title:          formData.title,
        category_id:    catObj?.id || null,
        level_id:       levelId,
        cefr_label:     formData.cefr,
        description:    formData.description,
        xp_reward:      Number(formData.xp_reward),
        min_score:      Number(formData.min_score),
        publish_status: formData.status === 'completed' ? 'published' : 'draft',
        status:         formData.status === 'completed' ? 'active' : 'locked',
        sort_order:     materials.length + 1,
      };

      let materialId;
      if (editingMaterial) {
        const { error } = await supabase.from('materials').update(payload).eq('id', editingMaterial.id);
        if (error) throw error;
        materialId = editingMaterial.id;
        // Delete old pages & quiz, re-insert
        await supabase.from('material_pages').delete().eq('material_id', materialId);
        await supabase.from('quiz_questions').delete().eq('material_id', materialId);
      } else {
        const { data: mat, error } = await supabase.from('materials').insert(payload).select().single();
        if (error) throw error;
        materialId = mat.id;
      }

      // Insert pages
      if (formData.pages.length > 0) {
        await supabase.from('material_pages').insert(
          formData.pages.map((p, i) => ({ material_id: materialId, page_number: i + 1, title: p.title, content: p.content }))
        );
      }

      // Insert quiz questions
      if (formData.quiz.length > 0) {
        await supabase.from('quiz_questions').insert(
          formData.quiz.map((q, i) => ({
            material_id:          materialId,
            question_text:        q.q,
            options:              q.options,
            correct_answer_index: q.answer,
            explanation:          q.explanation,
            sort_order:           i + 1,
          }))
        );
      }

      await fetchMaterials();
      setIsModalOpen(false);
      showToast(editingMaterial ? `Materi "${formData.title}" berhasil diperbarui!` : `Materi baru "${formData.title}" berhasil ditambahkan!`);
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Delete Material Handler
  const handleDelete = async (id) => {
    setSaving(true);
    try {
      const { error } = await supabase.from('materials').delete().eq('id', id);
      if (error) throw error;
      await fetchMaterials();
      setDeleteConfirmId(null);
      showToast('Materi berhasil dihapus.');
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Handlers for Pages inside modal
  const handleAddPage = () => {
    setFormData(prev => ({
      ...prev,
      pages: [
        ...prev.pages,
        { title: `Bagian ${prev.pages.length + 1}`, content: '' }
      ]
    }));
  };

  const handleUpdatePage = (index, field, value) => {
    setFormData(prev => {
      const newPages = [...prev.pages];
      newPages[index] = { ...newPages[index], [field]: value };
      return { ...prev, pages: newPages };
    });
  };

  const handleRemovePage = (index) => {
    if (formData.pages.length <= 1) {
      alert('Minimal harus ada 1 halaman materi.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      pages: prev.pages.filter((_, i) => i !== index)
    }));
  };

  // Handlers for Quiz questions inside modal
  const handleAddQuizQuestion = () => {
    setFormData(prev => ({
      ...prev,
      quiz: [
        ...prev.quiz,
        {
          q: '',
          options: ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'],
          answer: 0,
          explanation: ''
        }
      ]
    }));
  };

  const handleUpdateQuizQuestion = (qIndex, field, value) => {
    setFormData(prev => {
      const newQuiz = [...prev.quiz];
      newQuiz[qIndex] = { ...newQuiz[qIndex], [field]: value };
      return { ...prev, quiz: newQuiz };
    });
  };

  const handleUpdateQuizOption = (qIndex, optIndex, value) => {
    setFormData(prev => {
      const newQuiz = [...prev.quiz];
      const newOptions = [...newQuiz[qIndex].options];
      newOptions[optIndex] = value;
      newQuiz[qIndex] = { ...newQuiz[qIndex], options: newOptions };
      return { ...prev, quiz: newQuiz };
    });
  };

  const handleRemoveQuizQuestion = (qIndex) => {
    if (formData.quiz.length <= 1) {
      alert('Minimal harus ada 1 pertanyaan evaluasi kuis.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      quiz: prev.quiz.filter((_, i) => i !== qIndex)
    }));
  };

  // Filtering materials
  const filteredMaterials = materials.filter(m => {
    const matchesSearch = 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (m.category && m.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.unit && m.unit.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'published' && (m.status === 'completed' || m.status === 'active')) ||
      (filterStatus === 'draft' && m.status !== 'completed' && m.status !== 'active');

    const matchesLevel = 
      filterLevel === 'all' || 
      m.level === Number(filterLevel);

    return matchesSearch && matchesStatus && matchesLevel;
  });

  const getStatusBadge = (status) => {
    if (status === 'completed' || status === 'active') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3" /> Published
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-700 border border-amber-200">
        <Clock className="w-3 h-3" /> Draft
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Learning Materials</h1>
          <p className="text-slate-500 text-sm mt-1">Manage interactive modules, reading content, and unit structures per level.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm hover:shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Material
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden p-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>

            <select 
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">Semua Level</option>
              <option value="1">Level 1 (Beginner)</option>
              <option value="2">Level 2 (English Learner)</option>
              <option value="3">Level 3 (English Explorer)</option>
              <option value="4">Level 4 (Intermediate)</option>
              <option value="5">Level 5 (Advanced Learner)</option>
              <option value="6">Level 6 (English Master)</option>
            </select>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text"
              placeholder="Cari materi, unit, atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* MATERIALS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map(material => (
          <div 
            key={material.id} 
            className="bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all overflow-hidden flex flex-col group"
          >
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-3">
                {getStatusBadge(material.status)}
                <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                  Level {material.level || 1}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {material.unit}
                </span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  {material.category}
                </span>
                {material.cefr && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                    {material.cefr}
                  </span>
                )}
              </div>
              
              <h3 className="text-base font-black text-slate-900 leading-snug mb-2 group-hover:text-indigo-600 transition-colors">
                {material.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {material.description || 'Tidak ada deskripsi materi.'}
              </p>
            </div>
            
            <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between mt-auto">
              <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500">
                <span className="flex items-center gap-1" title="Halaman Materi Teori">
                  <Layout className="w-3.5 h-3.5 text-indigo-500" /> {material.pages?.length || 0} Pages
                </span>
                <span className="flex items-center gap-1" title="Soal Kuis Evaluasi">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-500" /> {material.quiz?.length || 0} Quizzes
                </span>
                <span className="flex items-center gap-1 text-amber-600" title="XP Reward">
                  <Award className="w-3.5 h-3.5" /> +{material.xp_reward || 100} XP
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button 
                  onClick={() => handleOpenEditModal(material)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer" 
                  title="Edit Materi"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setDeleteConfirmId(material.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer" 
                  title="Hapus Materi"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* CREATE NEW CARD (SESUAI SCREENSHOT USER) */}
        <button 
          type="button"
          onClick={handleOpenCreateModal}
          className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all min-h-[220px] cursor-pointer group"
        >
          <div className="w-12 h-12 bg-white rounded-full shadow-xs flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all text-indigo-600">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-bold text-sm text-slate-700 group-hover:text-indigo-600">Create New Material</span>
          <span className="text-xs text-slate-400 mt-1">Interactive module or reading</span>
        </button>
      </div>

      {filteredMaterials.length === 0 && (
        <div className="py-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-100 p-8">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">Tidak ada materi ditemukan</p>
          <p className="text-xs text-slate-400 mt-1">Sesuaikan filter atau buat materi baru menggunakan tombol di atas.</p>
        </div>
      )}

      {/* ================= MODAL CREATE / EDIT MATERIAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-3xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            
            {/* MODAL HEADER */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingMaterial ? 'Edit Learning Material' : 'Create New Material'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lengkapi format modul belajar, bab bacaan, dan latihan kuis interaktif.
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* MODAL TABS */}
            <div className="flex border-b border-slate-100 px-6 gap-2 bg-white">
              <button
                type="button"
                onClick={() => setActiveModalTab('info')}
                className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                  activeModalTab === 'info'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <FileText className="w-4 h-4" /> 1. Detail Materi
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('pages')}
                className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                  activeModalTab === 'pages'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <Layout className="w-4 h-4" /> 2. Halaman Bacaan ({formData.pages.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('quiz')}
                className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
                  activeModalTab === 'quiz'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <HelpCircle className="w-4 h-4" /> 3. Soal Kuis ({formData.quiz.length})
              </button>
            </div>

            {/* MODAL CONTENT BODY */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB 1: INFORMASI DETAIL MATERI */}
              {activeModalTab === 'info' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nomor / Kode Unit <span className="text-rose-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        required
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        placeholder="Contoh: Unit 7"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Kategori Materi <span className="text-rose-500">*</span>
                      </label>
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      >
                        {categoryOptions.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Judul Materi <span className="text-rose-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Contoh: Academic Writing & Sentence Structure"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Target Level Mahasiswa <span className="text-rose-500">*</span>
                      </label>
                      <select 
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      >
                        <option value={1}>Level 1 - Beginner</option>
                        <option value={2}>Level 2 - English Learner</option>
                        <option value={3}>Level 3 - English Explorer</option>
                        <option value={4}>Level 4 - Intermediate</option>
                        <option value={5}>Level 5 - Advanced Learner</option>
                        <option value={6}>Level 6 - English Master</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Tahap CEFR
                      </label>
                      <select 
                        value={formData.cefr}
                        onChange={(e) => setFormData({ ...formData, cefr: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      >
                        {cefrOptions.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Deskripsi Ringkas Materi
                    </label>
                    <textarea 
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Ringkasan penjelasan kompetensi dan tujuan pembelajaran modul ini..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        XP Reward
                      </label>
                      <input 
                        type="number" 
                        min={10}
                        max={500}
                        value={formData.xp_reward}
                        onChange={(e) => setFormData({ ...formData, xp_reward: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Skor Kelulusan (%)
                      </label>
                      <input 
                        type="number" 
                        min={10}
                        max={100}
                        value={formData.min_score}
                        onChange={(e) => setFormData({ ...formData, min_score: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Status Publikasi
                      </label>
                      <select 
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="completed">Published (Aktif)</option>
                        <option value="draft">Draft (Disimpan)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: HALAMAN BACAAN TEORI */}
              {activeModalTab === 'pages' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                      Tambahkan bab teori atau artikel referensi yang akan dibaca mahasiswa sebelum kuis.
                    </p>
                    <button 
                      type="button"
                      onClick={handleAddPage}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah Halaman
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.pages.map((page, index) => (
                      <div key={index} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 relative group">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-indigo-600 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[10px]">
                              {index + 1}
                            </span>
                            Halaman {index + 1}
                          </span>
                          
                          {formData.pages.length > 1 && (
                            <button 
                              type="button"
                              onClick={() => handleRemovePage(index)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                              title="Hapus Halaman"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div>
                          <input 
                            type="text" 
                            required
                            placeholder="Judul Halaman / Sub-topik..."
                            value={page.title}
                            onChange={(e) => handleUpdatePage(index, 'title', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <textarea 
                            rows={4}
                            required
                            placeholder="Isi materi penjelasan teori atau contoh bacaan..."
                            value={page.content}
                            onChange={(e) => handleUpdatePage(index, 'content', e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: SOAL KUIS EVALUASI */}
              {activeModalTab === 'quiz' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                      Soal evaluasi untuk menguji pemahaman mahasiswa dan syarat kelulusan modul.
                    </p>
                    <button 
                      type="button"
                      onClick={handleAddQuizQuestion}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah Soal
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.quiz.map((qItem, qIdx) => (
                      <div key={qIdx} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">
                              {qIdx + 1}
                            </span>
                            Pertanyaan #{qIdx + 1}
                          </span>

                          {formData.quiz.length > 1 && (
                            <button 
                              type="button"
                              onClick={() => handleRemoveQuizQuestion(qIdx)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                              title="Hapus Soal"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Pertanyaan
                          </label>
                          <input 
                            type="text" 
                            required
                            placeholder="Tuliskan pertanyaan kuis..."
                            value={qItem.q}
                            onChange={(e) => handleUpdateQuizQuestion(qIdx, 'q', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                            Pilihan Jawaban (Pilih radio untuk menentukan kunci jawaban yang benar)
                          </label>
                          <div className="space-y-2">
                            {qItem.options.map((opt, optIdx) => (
                              <div key={optIdx} className="flex items-center gap-2">
                                <input 
                                  type="radio" 
                                  name={`correct_answer_${qIdx}`}
                                  checked={qItem.answer === optIdx}
                                  onChange={() => handleUpdateQuizQuestion(qIdx, 'answer', optIdx)}
                                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                />
                                <span className="text-xs font-bold text-slate-400 w-4">
                                  {String.fromCharCode(65 + optIdx)}.
                                </span>
                                <input 
                                  type="text" 
                                  required
                                  value={opt}
                                  onChange={(e) => handleUpdateQuizOption(qIdx, optIdx, e.target.value)}
                                  placeholder={`Pilihan ${String.fromCharCode(65 + optIdx)}`}
                                  className={`flex-1 px-3 py-1 text-xs rounded-lg border focus:outline-none ${
                                    qItem.answer === optIdx 
                                      ? 'border-emerald-300 bg-emerald-50/30' 
                                      : 'border-slate-200 bg-white'
                                  }`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">
                            Penjelasan / Pembahasan Jawaban
                          </label>
                          <input 
                            type="text" 
                            placeholder="Alasan mengapa jawaban tersebut benar..."
                            value={qItem.explanation}
                            onChange={(e) => handleUpdateQuizQuestion(qIdx, 'explanation', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MODAL FOOTER BUTTONS */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                
                <div className="flex items-center gap-2">
                  {activeModalTab !== 'info' && (
                    <button
                      type="button"
                      onClick={() => setActiveModalTab(activeModalTab === 'quiz' ? 'pages' : 'info')}
                      className="px-4 py-2 text-xs font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                    >
                      Sebelumnya
                    </button>
                  )}

                  {activeModalTab !== 'quiz' ? (
                    <button
                      type="button"
                      onClick={() => setActiveModalTab(activeModalTab === 'info' ? 'pages' : 'quiz')}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      Lanjut <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button 
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" /> {editingMaterial ? 'Simpan Perubahan' : 'Buat Materi Sekarang'}
                    </button>
                  )}
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL KONFIRMASI DELETE ================= */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 max-w-sm w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900">Hapus Materi Ini?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Materi yang dihapus tidak dapat dipulihkan. Apakah Anda yakin ingin melanjutkan?
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
