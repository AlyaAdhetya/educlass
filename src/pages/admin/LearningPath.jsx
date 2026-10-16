import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  MapPin, Plus, GripVertical, Edit, Trash2, ArrowUp, ArrowDown, 
  CheckCircle2, AlertCircle, Users, BookOpen, Layers, X, Check,
  ShieldCheck, Sparkles, ChevronRight, Filter, Award
} from 'lucide-react';

const DEFAULT_PATHS = [
  { id: 1, name: 'Level 1: Beginner English Path', description: 'Kurikulum terstruktur untuk mahasiswa Beginner.', levelNumber: 1, level: 'Beginner', status: 'active', items: [] },
  { id: 2, name: 'Level 2: English Learner Path',  description: 'Kurikulum terstruktur untuk mahasiswa English Learner.', levelNumber: 2, level: 'English Learner', status: 'active', items: [] },
];

export default function AdminLearningPath() {
  const [learningPaths, setLearningPaths] = useState(DEFAULT_PATHS);
  const [materials,     setMaterials]     = useState([]);
  const [students,      setStudents]      = useState([]);

  useEffect(() => {
    async function load() {
      const [mRes, sRes] = await Promise.all([
        supabase.from('material_with_category').select('*').order('unit'),
        supabase.from('profiles').select('*').eq('role', 'mahasiswa'),
      ]);
      if (mRes.data) setMaterials(mRes.data);
      if (sRes.data) setStudents(sRes.data);
    }
    load();
  }, []);

  const addLearningPath    = (path)         => setLearningPaths(prev => [...prev, { ...path, id: Date.now(), items: [] }]);
  const updateLearningPath = (id, updates)  => setLearningPaths(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  const deleteLearningPath = (id)           => setLearningPaths(prev => prev.filter(p => p.id !== id));

  const [activePathId, setActivePathId] = useState(learningPaths[0]?.id || 1);
  const [levelFilter, setLevelFilter] = useState('all');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMaterialModalOpen, setIsAddMaterialModalOpen] = useState(false);
  const [deleteConfirmPathId, setDeleteConfirmPathId] = useState(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Path form state
  const [pathFormData, setPathFormData] = useState({
    name: '',
    description: '',
    levelNumber: 1,
    level: 'Beginner',
    status: 'active'
  });

  const levelOptions = [
    { num: 1, name: 'Beginner', title: 'Level 1: Beginner English Path' },
    { num: 2, name: 'English Learner', title: 'Level 2: English Learner Path' },
    { num: 3, name: 'English Explorer', title: 'Level 3: English Explorer Path' },
    { num: 4, name: 'Intermediate', title: 'Level 4: Intermediate Proficiency Path' },
    { num: 5, name: 'Advanced Learner', title: 'Level 5: Advanced Learner Path' },
    { num: 6, name: 'English Master', title: 'Level 6: English Master Path' }
  ];

  // Current active path
  const currentPath = learningPaths.find(p => p.id === activePathId) || learningPaths[0];

  // Filtered available paths list
  const filteredPaths = learningPaths.filter(p => {
    if (levelFilter === 'all') return true;
    return (p.levelNumber || 1) === Number(levelFilter);
  });

  // Open Create Path Modal
  const handleOpenCreatePath = () => {
    const nextLevelNum = (learningPaths.length % 6) + 1;
    const defaultLevel = levelOptions.find(l => l.num === nextLevelNum) || levelOptions[0];
    setPathFormData({
      name: defaultLevel.title,
      description: `Kurikulum terstruktur untuk mahasiswa ${defaultLevel.name}.`,
      levelNumber: defaultLevel.num,
      level: defaultLevel.name,
      status: 'active'
    });
    setIsCreateModalOpen(true);
  };

  // Open Edit Path Modal
  const handleOpenEditPath = () => {
    if (!currentPath) return;
    setPathFormData({
      name: currentPath.name,
      description: currentPath.description || '',
      levelNumber: currentPath.levelNumber || 1,
      level: currentPath.level || 'Beginner',
      status: currentPath.status || 'active'
    });
    setIsEditModalOpen(true);
  };

  // Handle Submit Create Path
  const handleCreatePathSubmit = (e) => {
    e.preventDefault();
    if (!pathFormData.name.trim()) return;

    addLearningPath({
      name: pathFormData.name,
      description: pathFormData.description,
      levelNumber: Number(pathFormData.levelNumber),
      level: pathFormData.level,
      status: pathFormData.status,
      items: []
    });

    setIsCreateModalOpen(false);
    showToast(`Learning path "${pathFormData.name}" berhasil dibuat!`);
  };

  // Handle Submit Edit Path
  const handleEditPathSubmit = (e) => {
    e.preventDefault();
    if (!pathFormData.name.trim() || !currentPath) return;

    updateLearningPath(currentPath.id, {
      name: pathFormData.name,
      description: pathFormData.description,
      levelNumber: Number(pathFormData.levelNumber),
      level: pathFormData.level,
      status: pathFormData.status
    });

    setIsEditModalOpen(false);
    showToast(`Detail path "${pathFormData.name}" berhasil diperbarui!`);
  };

  // Handle Delete Path
  const handleDeletePath = (pathId) => {
    deleteLearningPath(pathId);
    setDeleteConfirmPathId(null);
    const remaining = learningPaths.filter(p => p.id !== pathId);
    if (remaining.length > 0) {
      setActivePathId(remaining[0].id);
    }
    showToast('Learning path berhasil dihapus.');
  };

  // Sequence: Move Up
  const handleMoveUp = (index) => {
    if (index === 0 || !currentPath) return;
    const newItems = [...currentPath.items];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    // Re-index orders
    const reordered = newItems.map((item, idx) => ({ ...item, order: idx + 1 }));
    updateLearningPath(currentPath.id, { items: reordered });
  };

  // Sequence: Move Down
  const handleMoveDown = (index) => {
    if (!currentPath || index >= currentPath.items.length - 1) return;
    const newItems = [...currentPath.items];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    // Re-index orders
    const reordered = newItems.map((item, idx) => ({ ...item, order: idx + 1 }));
    updateLearningPath(currentPath.id, { items: reordered });
  };

  // Sequence: Remove Material from Path
  const handleRemoveItem = (index) => {
    if (!currentPath) return;
    const newItems = currentPath.items.filter((_, idx) => idx !== index);
    const reordered = newItems.map((item, idx) => ({ ...item, order: idx + 1 }));
    updateLearningPath(currentPath.id, { items: reordered });
    showToast('Materi dihapus dari urutan path.');
  };

  // Add Material to Path
  const handleAddMaterialToPath = (material) => {
    if (!currentPath) return;

    // Check if material already in path
    const alreadyInPath = currentPath.items.some(it => it.refId === material.id);
    if (alreadyInPath) {
      alert('Materi ini sudah ada di dalam sequence path.');
      return;
    }

    const newItem = {
      order: currentPath.items.length + 1,
      type: 'material',
      refId: material.id,
      title: material.title,
      category: material.category,
      level: material.level || currentPath.levelNumber || 1
    };

    updateLearningPath(currentPath.id, {
      items: [...currentPath.items, newItem]
    });

    setIsAddMaterialModalOpen(false);
    showToast(`"${material.title}" ditambahkan ke ${currentPath.name}!`);
  };

  // Materials available for adding to current path
  // Filtered by current level to prevent duplicate cross-level progress issues
  const currentLevelNumber = currentPath?.levelNumber || 1;
  const currentPathItemRefIds = currentPath?.items.map(it => it.refId) || [];
  
  // Available materials matching current level and not yet added
  const availableMaterialsForLevel = materials.filter(m => 
    (m.level === currentLevelNumber) && !currentPathItemRefIds.includes(m.id)
  );

  // Other materials (different levels, if admin wants to inspect)
  const otherMaterials = materials.filter(m => 
    (m.level !== currentLevelNumber) && !currentPathItemRefIds.includes(m.id)
  );

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
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Learning Paths</h1>
          <p className="text-slate-500 text-sm mt-1">
            Design structured curriculum journeys for students. Diatur ketat per level agar tidak ada double status progres mahasiswa.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleOpenCreatePath}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create New Path
          </button>
        </div>
      </div>

      {/* STATS STRIP: PROGRES AMAN PER LEVEL */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Path</p>
            <p className="text-lg font-black text-slate-900">{learningPaths.length} Kurikulum</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status Progres</p>
            <p className="text-lg font-black text-emerald-600">Terpetakan Aman</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Materi</p>
            <p className="text-lg font-black text-slate-900">{materials.length} Modul</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mahasiswa Aktif</p>
            <p className="text-lg font-black text-slate-900">
              {students.filter(s => s.role === 'mahasiswa' && s.status === 'active').length} Siswa
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* PATH LIST SIDEBAR (4 Cols) - MATCHING SCREENSHOT */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Available Paths</h3>
            
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="text-[11px] font-bold border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">Semua Level</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
              <option value="4">Level 4</option>
              <option value="5">Level 5</option>
              <option value="6">Level 6</option>
            </select>
          </div>

          <div className="space-y-2.5">
            {filteredPaths.map(path => {
              const isSelected = currentPath?.id === path.id;

              return (
                <button
                  key={path.id}
                  onClick={() => setActivePathId(path.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-indigo-50/80 border-indigo-200 shadow-xs ring-1 ring-indigo-200' 
                      : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`font-black text-sm ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>
                      {path.name}
                    </h4>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-indigo-100/70 text-indigo-700 shrink-0">
                      Lvl {path.levelNumber || 1}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {path.description || 'Tidak ada deskripsi path.'}
                  </p>
                  
                  <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100/80">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-100 text-slate-600">
                      {path.level}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {path.items?.length || 0} Modules
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredPaths.length === 0 && (
            <div className="p-6 text-center bg-white rounded-2xl border border-slate-100 text-slate-400">
              <p className="text-xs font-bold">Tidak ada path untuk level ini</p>
            </div>
          )}
        </div>

        {/* PATH EDITOR (8 Cols) - MATCHING SCREENSHOT */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-xs p-6 space-y-6">
          {currentPath ? (
            <>
              {/* CURRENT PATH HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                      Level {currentPath.levelNumber || 1} • {currentPath.level}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      <ShieldCheck className="w-3 h-3" /> Progres Aman
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                    {currentPath.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                    {currentPath.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={handleOpenEditPath}
                    className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit Details
                  </button>
                  <button 
                    onClick={() => setDeleteConfirmPathId(currentPath.id)}
                    className="p-1.5 text-rose-500 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                    title="Hapus Path"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* PATH SEQUENCE - MATCHING SCREENSHOT */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-700 uppercase flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-500" /> Path Sequence ({currentPath.items?.length || 0} Materi)
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold">
                    Urutan kurikulum yang ditempuh mahasiswa
                  </span>
                </div>
                
                <div className="space-y-2">
                  {currentPath.items && currentPath.items.length > 0 ? (
                    currentPath.items
                      .sort((a, b) => a.order - b.order)
                      .map((item, index) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200 hover:border-indigo-200 transition-all group shadow-xs"
                        >
                          <div className="cursor-grab text-slate-300 group-hover:text-slate-500">
                            <GripVertical className="w-4 h-4" />
                          </div>
                          
                          <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-black shrink-0">
                            {item.order || index + 1}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
                              <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">
                                Level {item.level || currentPath.levelNumber || 1}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-0.5">{item.category}</p>
                          </div>

                          {/* REORDER BUTTONS */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleMoveUp(index)}
                              className={`p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors ${
                                index === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                              }`}
                              title="Pindahkan ke atas"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={index === currentPath.items.length - 1}
                              onClick={() => handleMoveDown(index)}
                              className={`p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors ${
                                index === currentPath.items.length - 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                              }`}
                              title="Pindahkan ke bawah"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            
                            <button 
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all ml-1 cursor-pointer"
                              title="Hapus dari sequence"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="py-8 text-center bg-white rounded-xl border border-dashed border-slate-200">
                      <BookOpen className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
                      <p className="text-xs font-bold text-slate-600">Belum ada materi di sequence ini</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Tambahkan materi di bawah agar mahasiswa level ini memiliki alur belajar.
                      </p>
                    </div>
                  )}
                </div>

                {/* ADD MATERIAL BUTTON - MATCHING SCREENSHOT */}
                <button 
                  type="button"
                  onClick={() => setIsAddMaterialModalOpen(true)}
                  className="w-full mt-3 py-3 border-2 border-dashed border-slate-200 hover:border-indigo-300 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer bg-white"
                >
                  <Plus className="w-4 h-4" /> Add Material to Path
                </button>
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-slate-500">
              <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">Tidak ada path yang dipilih</p>
              <p className="text-xs text-slate-400 mt-1">Pilih path dari daftar di sebelah kiri atau buat path baru.</p>
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL: ADD MATERIAL TO PATH ================= */}
      {isAddMaterialModalOpen && currentPath && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-base font-black text-slate-900">Tambahkan Materi ke Path</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Target: <span className="font-bold text-indigo-600">{currentPath.name}</span> (Level {currentLevelNumber})
                </p>
              </div>
              <button 
                onClick={() => setIsAddMaterialModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4">
              <div>
                <p className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Materi Rekomendasi Level {currentLevelNumber} ({availableMaterialsForLevel.length})
                </p>

                {availableMaterialsForLevel.length > 0 ? (
                  <div className="space-y-2">
                    {availableMaterialsForLevel.map(mat => (
                      <div 
                        key={mat.id}
                        className="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all flex items-center justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                              {mat.unit}
                            </span>
                            <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {mat.category}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-900 truncate">{mat.title}</p>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{mat.description}</p>
                        </div>

                        <button
                          onClick={() => handleAddMaterialToPath(mat)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg transition-colors shrink-0 cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Pilih
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-xl text-center text-slate-400">
                    <p className="text-xs font-bold">Semua materi Level {currentLevelNumber} sudah ada di path ini.</p>
                    <p className="text-[10px] mt-0.5">Buat materi baru di menu Learning Materials untuk menambahkannya.</p>
                  </div>
                )}
              </div>

              {/* OTHER LEVEL MATERIALS (OPTIONAL) */}
              {otherMaterials.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Materi Dari Level Lain ({otherMaterials.length})
                  </p>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {otherMaterials.map(mat => (
                      <div 
                        key={mat.id}
                        className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-300 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="truncate">
                          <span className="text-[10px] font-bold text-slate-400 mr-2">Level {mat.level || 1}</span>
                          <span className="font-bold text-slate-700">{mat.title}</span>
                        </div>
                        <button
                          onClick={() => handleAddMaterialToPath(mat)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-600 text-[10px] font-bold rounded-md transition-colors cursor-pointer"
                        >
                          + Tambah
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button 
                onClick={() => setIsAddMaterialModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE / EDIT PATH ================= */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {isCreateModalOpen ? 'Create New Learning Path' : 'Edit Learning Path'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Atur kurikulum dan target level mahasiswa
                </p>
              </div>
              <button 
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="w-7 h-7 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={isCreateModalOpen ? handleCreatePathSubmit : handleEditPathSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Learning Path <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  value={pathFormData.name}
                  onChange={(e) => setPathFormData({ ...pathFormData, name: e.target.value })}
                  placeholder="Contoh: Level 1: Beginner English Path"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Level Mahasiswa <span className="text-rose-500">*</span>
                </label>
                <select 
                  value={pathFormData.levelNumber}
                  onChange={(e) => {
                    const selectedNum = Number(e.target.value);
                    const opt = levelOptions.find(l => l.num === selectedNum);
                    setPathFormData({
                      ...pathFormData,
                      levelNumber: selectedNum,
                      level: opt ? opt.name : 'Beginner'
                    });
                  }}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {levelOptions.map(l => (
                    <option key={l.num} value={l.num}>
                      Level {l.num} - {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi Kurikulum
                </label>
                <textarea 
                  rows={3}
                  value={pathFormData.description}
                  onChange={(e) => setPathFormData({ ...pathFormData, description: e.target.value })}
                  placeholder="Penjelasan ringkas kompetensi yang akan dicapai mahasiswa di level ini..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  {isCreateModalOpen ? 'Buat Path' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE PATH CONFIRMATION ================= */}
      {deleteConfirmPathId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 max-w-sm w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900">Hapus Learning Path?</h4>
              <p className="text-xs text-slate-500 mt-1">
                Seluruh urutan kurikulum di dalam path ini akan dihapus. Lanjutkan?
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => setDeleteConfirmPathId(null)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button 
                onClick={() => handleDeletePath(deleteConfirmPathId)}
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
