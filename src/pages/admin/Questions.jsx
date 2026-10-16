import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  ClipboardList, Plus, Search, Edit, Trash2, Check,
  X, CheckCircle2, HelpCircle
} from 'lucide-react';

export default function AdminQuestions() {
  const [materials, setMaterials] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [moduleSearch, setModuleSearch] = useState('');
  const [saving, setSaving] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => { fetchMaterials(); }, []);

  async function fetchMaterials() {
    const { data } = await supabase
      .from('material_with_category')
      .select('id, title, unit, category_name')
      .order('sort_order');
    if (data) {
      setMaterials(data);
      if (!selectedModuleId && data.length > 0) setSelectedModuleId(data[0].id);
    }
  }

  useEffect(() => {
    if (selectedModuleId) fetchQuestions(selectedModuleId);
  }, [selectedModuleId]);

  async function fetchQuestions(materialId) {
    const { data } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('material_id', materialId)
      .order('sort_order');
    setQuestions(data || []);
  }

  // Question modal / form state
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null); // full question row
  const [deletingId, setDeletingId] = useState(null);
  const [questionForm, setQuestionForm] = useState({
    q: '',
    options: ['', '', '', ''],
    answer: 0,
    explanation: ''
  });

  const selectedModule = materials.find(m => m.id === selectedModuleId);

  const filteredMaterials = materials.filter(m =>
    (m.title || '').toLowerCase().includes(moduleSearch.toLowerCase()) ||
    (m.unit || '').toLowerCase().includes(moduleSearch.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingQuestion(null);
    setQuestionForm({ q: '', options: ['', '', '', ''], answer: 0, explanation: '' });
    setQuestionModalOpen(true);
  };

  const handleOpenEdit = (q) => {
    setEditingQuestion(q);
    setQuestionForm({
      q:           q.question_text || '',
      options:     q.options && q.options.length ? [...q.options] : ['', '', '', ''],
      answer:      q.correct_answer_index || 0,
      explanation: q.explanation || ''
    });
    setQuestionModalOpen(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!selectedModule) return;
    if (!questionForm.q.trim()) { alert('Pertanyaan tidak boleh kosong.'); return; }
    if (questionForm.options.some(opt => !opt.trim())) { alert('Semua 4 pilihan jawaban harus diisi.'); return; }

    setSaving(true);
    const payload = {
      material_id:          selectedModuleId,
      question_text:        questionForm.q.trim(),
      options:              questionForm.options.map(o => o.trim()),
      correct_answer_index: Number(questionForm.answer),
      explanation:          questionForm.explanation.trim(),
      sort_order:           editingQuestion ? editingQuestion.sort_order : (questions.length + 1),
    };

    if (editingQuestion) {
      await supabase.from('quiz_questions').update(payload).eq('id', editingQuestion.id);
      showToast('Soal berhasil diperbarui!');
    } else {
      await supabase.from('quiz_questions').insert(payload);
      showToast('Soal baru berhasil ditambahkan!');
    }
    setSaving(false);
    setQuestionModalOpen(false);
    fetchQuestions(selectedModuleId);
  };

  const handleDelete = async (id) => {
    await supabase.from('quiz_questions').delete().eq('id', id);
    setDeletingId(null);
    showToast('Soal berhasil dihapus.');
    fetchQuestions(selectedModuleId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Question Bank</h1>
          <p className="text-slate-500 text-sm mt-1">Manage multiple-choice questions and interactive quests per module.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* MODULE SELECTOR SIDEBAR (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text"
              placeholder="Search modules..."
              value={moduleSearch}
              onChange={(e) => setModuleSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-xs"
            />
          </div>
          
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Select Module</h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {filteredMaterials.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedModuleId(m.id)}
                className={`w-full text-left p-3 rounded-2xl border transition-all ${
                  selectedModuleId === m.id 
                    ? 'bg-indigo-50 border-indigo-200 shadow-xs ring-1 ring-indigo-200' 
                    : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                    selectedModuleId === m.id ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                  }">
                    {m.unit}
                  </span>
                </div>
                <h4 className={`text-sm font-bold leading-tight ${selectedModuleId === m.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                  {m.title}
                </h4>
                <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-slate-400">
                  <span>{m.quiz?.length || 0} Questions</span>
                  <span>{m.questSteps?.length || 0} Quests</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* QUESTIONS EDITOR (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedModule ? (
            <>
              {/* Header Info */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider mb-2 inline-block">
                {selectedModule.unit} • {selectedModule.category_name || 'General'}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 leading-tight">{selectedModule.title}</h2>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="shrink-0 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Question
                </button>
              </div>

              {/* Standard Quiz Questions */}
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-indigo-500" /> Multiple Choice Questions ({questions.length})
                </h3>
                
                {questions.length === 0 ? (
                  <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 text-center text-slate-500">
                    <p className="text-sm font-bold mb-1">No multiple choice questions</p>
                    <p className="text-xs mb-3">Click 'Add Question' to create standard quiz questions.</p>
                    <button
                      type="button"
                      onClick={handleOpenAdd}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah Soal
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                      {questions.map((q) => (
                      <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs group">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                              {q.sort_order}
                            </span>
                            <p className="text-sm font-bold text-slate-900 leading-relaxed">{q.question_text}</p>
                          </div>
                          
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(q)}
                              title="Edit Soal"
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4"/>
                            </button>
                            
                            {deletingId === q.id ? (
                              <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                                <span className="text-[10px] font-bold text-rose-700 px-1">Hapus?</span>
                                <button type="button" onClick={() => handleDelete(q.id)} className="p-1 bg-rose-600 text-white rounded text-[10px] font-black">Ya</button>
                                <button type="button" onClick={() => setDeletingId(null)} className="p-1 text-slate-500 hover:bg-slate-200 rounded text-[10px]">Batal</button>
                              </div>
                            ) : (
                              <button type="button" onClick={() => setDeletingId(q.id)} title="Hapus Soal" className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4"/>
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-9">
                          {q.options && q.options.map((opt, oIdx) => (
                            <div key={oIdx} className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                              oIdx === q.correct_answer_index
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
                                : 'bg-slate-50 border-slate-100 text-slate-600'
                            }`}>
                              {oIdx === q.correct_answer_index ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />}
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>
                        {q.explanation && (
                          <div className="mt-4 pl-9">
                            <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-600 border border-slate-100">
                              <strong className="text-slate-800">Explanation:</strong> {q.explanation}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

            </>
          ) : (
            <div className="py-20 text-center text-slate-400">
              <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-bold text-slate-500">Select a Module</p>
              <p className="text-sm">Choose a module from the sidebar to manage its questions.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: ADD / EDIT QUESTION */}
      {questionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingQuestion ? `Edit Question` : 'Add New Question'}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedModule?.title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuestionModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Question Prompt <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={questionForm.q}
                  onChange={(e) => setQuestionForm({ ...questionForm, q: e.target.value })}
                  placeholder="Enter the question..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Answer Options (Select the correct option) <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2">
                  {['A', 'B', 'C', 'D'].map((lbl, optIdx) => (
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
                        id={`qopt_${optIdx}`}
                        name="correctAnswer"
                        checked={questionForm.answer === optIdx}
                        onChange={() => setQuestionForm({ ...questionForm, answer: optIdx })}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                        questionForm.answer === optIdx ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {lbl}
                      </span>
                      <input
                        type="text"
                        value={questionForm.options[optIdx] || ''}
                        onChange={(e) => {
                          const newOpts = [...questionForm.options];
                          newOpts[optIdx] = e.target.value;
                          setQuestionForm({ ...questionForm, options: newOpts });
                        }}
                        placeholder={`Option ${lbl}...`}
                        className="flex-1 text-xs py-1 px-2 border-0 bg-transparent focus:outline-none font-medium"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Explanation
                </label>
                <input
                  type="text"
                  value={questionForm.explanation}
                  onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                  placeholder="Why is this answer correct?"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setQuestionModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
                >
                  {editingQuestion ? 'Save Changes' : 'Create Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
