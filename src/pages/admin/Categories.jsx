import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Search, Edit, Trash2, BookOpen, X, Check, AlertCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const ICON_MAP = {
  menu_book: LucideIcons.Book,
  spellcheck: LucideIcons.Type,
  chrome_reader_mode: LucideIcons.BookOpen,
  edit_note: LucideIcons.Edit3,
  headphones: LucideIcons.Headphones,
  forum: LucideIcons.MessageSquare,
  school: LucideIcons.GraduationCap,
  today: LucideIcons.Calendar,
  layers: LucideIcons.Layers,
  star: LucideIcons.Star,
  zap: LucideIcons.Zap,
  globe: LucideIcons.Globe,
};

const COLOR_OPTIONS = [
  { key: 'violet', bg: 'bg-violet-100', text: 'text-violet-600', pill: 'bg-violet-50 text-violet-600' },
  { key: 'rose',   bg: 'bg-rose-100',   text: 'text-rose-600',   pill: 'bg-rose-50 text-rose-600' },
  { key: 'sky',    bg: 'bg-sky-100',    text: 'text-sky-600',    pill: 'bg-sky-50 text-sky-600' },
  { key: 'lime',   bg: 'bg-lime-100',   text: 'text-lime-600',   pill: 'bg-lime-50 text-lime-600' },
  { key: 'teal',   bg: 'bg-teal-100',   text: 'text-teal-600',   pill: 'bg-teal-50 text-teal-600' },
  { key: 'indigo', bg: 'bg-indigo-100', text: 'text-indigo-600', pill: 'bg-indigo-50 text-indigo-600' },
  { key: 'fuchsia',bg: 'bg-fuchsia-100',text: 'text-fuchsia-600',pill: 'bg-fuchsia-50 text-fuchsia-600' },
  { key: 'emerald',bg: 'bg-emerald-100',text: 'text-emerald-600',pill: 'bg-emerald-50 text-emerald-600' },
  { key: 'amber',  bg: 'bg-amber-100',  text: 'text-amber-600',  pill: 'bg-amber-50 text-amber-600' },
];

const ICON_OPTIONS = Object.keys(ICON_MAP);

const getColor = (colorName) =>
  COLOR_OPTIONS.find(c => c.key === colorName) || COLOR_OPTIONS[0];

const emptyForm = {
  name: '',
  description: '',
  color: 'indigo',
  icon: 'menu_book',
  is_active: true,
};

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchCategories(); }, []);

  async function fetchCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*, materials(id)')
      .order('sort_order');
    if (data) setCategories(data.map(c => ({ ...c, materialCount: c.materials?.length || 0 })));
  }

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deletingId, setDeletingId] = useState(null);
  const [savedToast, setSavedToast] = useState(false);

  const filteredCategories = categories.filter(c =>
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAdd = () => {
    setForm(emptyForm);
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setForm({
      name:        cat.name,
      description: cat.description || '',
      color:       cat.color || 'indigo',
      icon:        cat.icon  || 'menu_book',
      is_active:   cat.is_active !== false,
    });
    setEditTarget(cat);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editTarget) {
      await supabase.from('categories').update(form).eq('id', editTarget.id);
    } else {
      await supabase.from('categories').insert({ ...form, sort_order: categories.length + 1 });
    }
    setModalOpen(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
    fetchCategories();
  };

  const handleDelete = async () => {
    await supabase.from('categories').delete().eq('id', deletingId);
    setDeletingId(null);
    fetchCategories();
  };

  const toggleStatus = async (cat) => {
    await supabase.from('categories').update({ is_active: !cat.is_active }).eq('id', cat.id);
    fetchCategories();
  };

  const renderIcon = (iconName, className) => {
    const Icon = ICON_MAP[iconName] || LucideIcons.Layers;
    return <Icon className={className} />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">

      {/* TOAST */}
      {savedToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold">Kategori berhasil disimpan!</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Material Categories</h1>
          <p className="text-slate-500 text-sm mt-1">Organize learning content into thematic categories.</p>
        </div>
        <button
          onClick={openAdd}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCategories.map(cat => {
          const c = getColor(cat.color);
          return (
            <div
              key={cat.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all p-5 flex flex-col group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${c.bg} ${c.text}`}>
                  {renderIcon(cat.icon, 'w-6 h-6')}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingId(cat.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-black text-slate-900 mb-1">{cat.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1">{cat.description}</p>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 mt-auto">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>{cat.materialCount} Materials</span>
                </div>
                <button
                  onClick={() => toggleStatus(cat)}
                  className={`px-2 py-0.5 rounded-md text-[11px] cursor-pointer transition-colors ${
                    cat.is_active !== false
                      ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                  title="Klik untuk toggle status"
                >
                  {cat.is_active !== false ? 'active' : 'inactive'}
                </button>
              </div>
            </div>
          );
        })}

        {/* Add new placeholder card */}
        <button
          onClick={openAdd}
          className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all min-h-[200px] cursor-pointer"
        >
          <div className="w-12 h-12 bg-white rounded-full shadow-xs flex items-center justify-center mb-3">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-bold text-sm">Create Category</span>
        </button>
      </div>

      {/* ===== MODAL ADD / EDIT ===== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {editTarget ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Isi detail kategori materi pembelajaran</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Kategori <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Contoh: Listening"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Deskripsi</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Deskripsi singkat isi kategori ini"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Color picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Warna</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map(c => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => setForm({ ...form, color: c.key })}
                      className={`w-7 h-7 rounded-full ${c.bg} transition-all cursor-pointer ${
                        form.color === c.key ? 'ring-2 ring-offset-1 ring-indigo-500 scale-110' : 'hover:scale-110'
                      }`}
                      title={c.key}
                    />
                  ))}
                </div>
              </div>

              {/* Icon picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map(iconKey => {
                    const Icon = ICON_MAP[iconKey];
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => setForm({ ...form, icon: iconKey })}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                          form.icon === iconKey
                            ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-500'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                        title={iconKey}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status toggle */}
              <div
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 cursor-pointer"
                onClick={() => setForm({ ...form, is_active: !form.is_active })}
              >
                <div>
                  <p className="text-xs font-bold text-slate-700">Status Kategori</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Kategori aktif akan tampil di halaman materi mahasiswa</p>
                </div>
                <div className={`relative w-11 h-6 rounded-full transition-colors ${form.is_active ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                  <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  {editTarget ? 'Simpan Perubahan' : 'Tambah Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== MODAL DELETE CONFIRM ===== */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 max-w-sm w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900">Hapus Kategori Ini?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Kategori yang dihapus tidak bisa dipulihkan. Materi yang menggunakan kategori ini tidak terpengaruh.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl cursor-pointer"
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
