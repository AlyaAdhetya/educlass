import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users as UsersIcon, Search, Filter, Mail, Calendar, 
  Edit, Trash2, ShieldCheck, ChevronRight, CheckCircle2, XCircle,
  X, Plus, UserCheck, AlertTriangle, Loader2
} from 'lucide-react';

const availableLevels = [
  { level: 1, name: 'Beginner' },
  { level: 2, name: 'English Learner' },
  { level: 3, name: 'English Explorer' },
  { level: 4, name: 'Intermediate' },
  { level: 5, name: 'Advanced Learner' },
  { level: 6, name: 'English Master' },
];

export default function AdminUsers() {
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeTab, setActiveTab]   = useState('mahasiswa');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [levelFilter, setLevelFilter]   = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser]   = useState(null);
  const [viewingUser, setViewingUser]   = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', role: 'mahasiswa', nim: '', level: 1, status: 'active'
  });

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id, email, name, nim, role, status, avatar_url, current_level_id, created_at,
        user_stats (*),
        levels (*)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const formatted = data.map(p => {
        const stats = Array.isArray(p.user_stats) ? p.user_stats[0] : (p.user_stats || {});
        const lvl = Array.isArray(p.levels) ? p.levels[0] : (p.levels || {});
        const displayName = p.name || p.email?.split('@')[0] || 'User';
        return {
          ...p,
          name: displayName,
          full_name: displayName,
          level_name: lvl.name || 'Beginner',
          level_number: lvl.level_number || p.current_level_id || 1,
          level_badge: lvl.badge_emoji || '🌱',
          cefr_level: lvl.cefr_equivalent || 'A1',
          total_xp: stats.total_xp || 0,
          gems: stats.gems || 0,
          streak_days: stats.current_streak || 0,
          longest_streak: stats.longest_streak || 0,
          total_completed_materials: stats.total_completed_materials || 0,
          total_completed_quizzes: stats.total_completed_quizzes || 0,
          last_activity_date: stats.last_activity_date,
          quiz_average: stats.quiz_average || 0,
          assignment_average: stats.assignment_average || 0,
          final_score: stats.final_score || 0,
          letter_grade: stats.letter_grade || 'E',
        };
      });
      setUsers(formatted);
    }
    setLoading(false);
  }

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const isFilterActive = statusFilter !== 'all' || levelFilter !== 'all';
  const resetFilters   = () => { setStatusFilter('all'); setLevelFilter('all'); };

  const filteredUsers = users.filter(user => {
    if (activeTab === 'mahasiswa' && user.role !== 'mahasiswa') return false;
    if (activeTab === 'admin'     && user.role !== 'admin')     return false;
    if (statusFilter !== 'all'   && user.status !== statusFilter) return false;
    if (levelFilter  !== 'all'   && user.level_number !== Number(levelFilter)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const userName = (user.name || user.full_name || '').toLowerCase();
      return userName.includes(q) ||
             user.email?.toLowerCase().includes(q) ||
             user.nim?.toLowerCase().includes(q);
    }
    return true;
  });

  const getLevelColor = (lvl) => {
    if (!lvl) return 'bg-slate-100 text-slate-600';
    if (lvl >= 5) return 'bg-amber-100 text-amber-700';
    if (lvl >= 3) return 'bg-violet-100 text-violet-700';
    return 'bg-blue-100 text-blue-700';
  };

  // Handle Add User — create via Supabase Auth + profile insert
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSaving(true);
    try {
      // Insert profile directly (admin pre-creates user)
      // In a real app, you'd invite via email or use service_role to create auth user
      // For now we insert into profiles only (user can register themselves)
      const { error } = await supabase.from('profiles').upsert({
        email: formData.email,
        name: formData.name,
        nim: formData.nim || null,
        role: formData.role,
        status: formData.status,
        current_level_id: Number(formData.level),
      });
      if (error) throw error;
      await fetchUsers();
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', role: 'mahasiswa', nim: '', level: 1, status: 'active' });
      showToast(`User "${formData.name}" berhasil ditambahkan!`);
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Handle Edit User
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name:             editingUser.name,
          nim:              editingUser.nim || null,
          status:           editingUser.status,
          current_level_id: Number(editingUser.level_number) || 1,
        })
        .eq('id', editingUser.id);
      if (error) throw error;
      await fetchUsers();
      const savedName = editingUser.name;
      setEditingUser(null);
      showToast(`Perubahan data "${savedName}" berhasil disimpan!`);
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Handle Delete User (profiles only — auth user remains)
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'inactive' })
        .eq('id', userToDelete.id);
      if (error) throw error;
      await fetchUsers();
      const deletedName = userToDelete.name;
      setUserToDelete(null);
      showToast(`User "${deletedName}" berhasil dinonaktifkan.`);
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
      
      {/* TOAST ALERT */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-6 right-6 z-50 p-4 bg-emerald-600 text-white rounded-2xl text-xs font-bold shadow-lg flex items-center gap-3 border border-emerald-500"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage('')} className="ml-2 hover:opacity-75 text-white/80 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage student accounts, administrator access, and user records.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => setShowFilter(!showFilter)}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-2 cursor-pointer ${
              showFilter || isFilterActive
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-black shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-4 h-4" /> 
            <span>Filter</span>
            {isFilterActive && (
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            )}
          </button>
          
          <button 
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      {/* EXPANDABLE FILTER PANEL */}
      <AnimatePresence>
        {showFilter && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-xs flex flex-wrap items-center justify-between gap-3 overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-4">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs font-bold py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden focus:border-indigo-500"
                >
                  <option value="all">Semua Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Level Filter (applicable to mahasiswa) */}
              {activeTab === 'mahasiswa' && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Level:</span>
                  <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                    className="text-xs font-bold py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="all">Semua Level</option>
                    {availableLevels.map(lv => (
                      <option key={lv.level} value={lv.level}>
                        Level {lv.level} - {lv.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {isFilterActive && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
              >
                Reset Filter
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <UsersIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Students</p>
            {loading ? <div className="w-12 h-6 bg-slate-100 rounded animate-pulse mt-1" /> :
              <h3 className="text-2xl font-black text-slate-900">{users.filter(s => s.role === 'mahasiswa').length}</h3>
            }
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Active Accounts</p>
            {loading ? <div className="w-12 h-6 bg-slate-100 rounded animate-pulse mt-1" /> :
              <h3 className="text-2xl font-black text-slate-900">{users.filter(s => s.status === 'active').length}</h3>
            }
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Administrators</p>
            {loading ? <div className="w-12 h-6 bg-slate-100 rounded animate-pulse mt-1" /> :
              <h3 className="text-2xl font-black text-slate-900">{users.filter(s => s.role === 'admin').length}</h3>
            }
          </div>
        </div>
      </div>

      {/* TABS & SEARCH */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="border-b border-slate-100 p-2 flex flex-col sm:flex-row justify-between gap-3 bg-slate-50/50">
          <div className="flex gap-1 p-1 bg-slate-200/50 rounded-xl inline-flex w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab('mahasiswa')}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'mahasiswa' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Students
            </button>
            <button 
              onClick={() => setActiveTab('admin')}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'admin' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Administrators
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-white text-slate-400 uppercase tracking-wider font-bold text-[10px] border-b border-slate-100">
                <th className="py-4 px-6">User</th>
                {activeTab === 'mahasiswa' && <th className="py-4 px-6">NIM</th>}
                {activeTab === 'mahasiswa' && <th className="py-4 px-6">Level</th>}
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Last Active</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {(user.name || user.email || 'US').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{user.name}</p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" /> {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  {activeTab === 'mahasiswa' && (
                    <td className="py-4 px-6">
                      <span className="font-mono text-xs font-bold text-slate-600">{user.nim}</span>
                    </td>
                  )}
                  
                  {activeTab === 'mahasiswa' && (
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold inline-flex items-center gap-1 ${getLevelColor(user.level_number)}`}>
                        Lv.{user.level_number || 1} {user.level_name || 'Beginner'}
                      </span>
                    </td>
                  )}
                  
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      user.status === 'active' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {user.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {user.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  
                  <td className="py-4 px-6">
                    <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" /> {user.last_activity_date 
                        ? new Date(user.last_activity_date).toLocaleDateString('id-ID') 
                        : '-'}
                    </p>
                  </td>
                  
                  {/* ACTION BUTTONS (AKTIF & SELALU TERSEDIA) */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        type="button"
                        onClick={() => setEditingUser({ ...user })}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer" 
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      {user.role === 'mahasiswa' && (
                        <button 
                          type="button"
                          onClick={() => setViewingUser(user)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" 
                          title="View Details"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button 
                        type="button"
                        onClick={() => setUserToDelete(user)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer" 
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={activeTab === 'mahasiswa' ? 6 : 4} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 text-slate-300" />
                      <p className="text-sm font-bold">No users found</p>
                      <p className="text-xs">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: ADD USER ================= */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900">Add New User</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role Akun</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full text-xs font-bold py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-indigo-600"
                  >
                    <option value="mahasiswa">Mahasiswa (Student)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rian Pratama"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-indigo-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="nama@kampus.ac.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-indigo-600 font-medium"
                  />
                </div>

                {formData.role === 'mahasiswa' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">NIM (Nomor Induk Mahasiswa)</label>
                      <input
                        type="text"
                        placeholder="Contoh: 2401099"
                        value={formData.nim}
                        onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                        className="w-full text-xs py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-indigo-600 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat Level Awal</label>
                      <select
                        value={formData.level}
                        onChange={(e) => {
                          const lvl = Number(e.target.value);
                          const obj = availableLevels.find(l => l.level === lvl);
                          setFormData({ ...formData, level: lvl, levelName: obj?.name || 'Beginner' });
                        }}
                        className="w-full text-xs font-bold py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-indigo-600"
                      >
                        {availableLevels.map(lv => (
                          <option key={lv.level} value={lv.level}>
                            Level {lv.level} — {lv.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status Akun</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full text-xs font-bold py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-indigo-600"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    Simpan User
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: EDIT USER ================= */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Edit className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900">Edit User Details</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full text-xs py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-indigo-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full text-xs py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-indigo-600 font-medium"
                  />
                </div>

                {editingUser.role === 'mahasiswa' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">NIM</label>
                      <input
                        type="text"
                        value={editingUser.nim || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, nim: e.target.value })}
                        className="w-full text-xs py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-indigo-600 font-medium font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Level</label>
                      <select
                        value={editingUser.level || 1}
                        onChange={(e) => {
                          const lvl = Number(e.target.value);
                          const obj = availableLevels.find(l => l.level === lvl);
                          setEditingUser({ ...editingUser, level: lvl, levelName: obj?.name || 'Beginner' });
                        }}
                        className="w-full text-xs font-bold py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-indigo-600"
                      >
                        {availableLevels.map(lv => (
                          <option key={lv.level} value={lv.level}>
                            Level {lv.level} — {lv.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                    className="w-full text-xs font-bold py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-indigo-600"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: VIEW DETAILS ================= */}
      <AnimatePresence>
        {viewingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-slate-100 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900">User Profile Overview</h3>
                <button
                  type="button"
                  onClick={() => setViewingUser(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-700 font-black text-xl flex items-center justify-center shadow-inner">
                  {(viewingUser.name || viewingUser.email || 'US').slice(0, 2).toUpperCase()}
                </div>
                <h4 className="font-extrabold text-base text-slate-900">{viewingUser.name}</h4>
                <p className="text-xs text-slate-500 font-medium">{viewingUser.email}</p>
                
                <div className="flex items-center gap-2 pt-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    viewingUser.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {viewingUser.status === 'active' ? 'Active Account' : 'Inactive'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                    {viewingUser.role === 'admin' ? 'Administrator' : 'Mahasiswa'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5 border border-slate-100 text-xs">
                {viewingUser.role === 'mahasiswa' && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-bold">NIM:</span>
                      <span className="font-mono font-bold text-slate-800">{viewingUser.nim || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-bold">Level Belajar:</span>
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${getLevelColor(viewingUser.level)}`}>
                        Level {viewingUser.level || 1} — {viewingUser.levelName || 'Beginner'}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold">Aktivitas Terakhir:</span>
                  <span className="font-bold text-slate-700">{viewingUser.lastActivity || '-'}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setViewingUser(null)}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      <AnimatePresence>
        {userToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-slate-100 space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-extrabold text-base text-slate-900">Hapus Pengguna?</h3>
                <p className="text-xs text-slate-500">
                  Apakah Anda yakin ingin menghapus akun <strong className="text-slate-800">{userToDelete.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUserToDelete(null)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
