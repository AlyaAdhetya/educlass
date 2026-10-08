import React, { useState } from 'react';
import { useDataStore } from '../../store/dataStore';
import { 
  Users as UsersIcon, Shield, Search, Filter, MoreVertical, 
  Mail, Calendar, Award, Edit, Trash2, ShieldCheck, ChevronRight, CheckCircle2, XCircle
} from 'lucide-react';

export default function AdminUsers() {
  const { students, updateStudentStatus, deleteStudent } = useDataStore();
  const [activeTab, setActiveTab] = useState('mahasiswa');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredUsers = students.filter(user => {
    if (activeTab === 'mahasiswa' && user.role !== 'mahasiswa') return false;
    if (activeTab === 'admin' && user.role !== 'admin') return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return user.name.toLowerCase().includes(q) || 
             user.email.toLowerCase().includes(q) || 
             (user.nim && user.nim.toLowerCase().includes(q));
    }
    return true;
  });

  const getLevelColor = (level) => {
    if (!level) return 'bg-slate-100 text-slate-600';
    if (level >= 5) return 'bg-amber-100 text-amber-700';
    if (level >= 3) return 'bg-violet-100 text-violet-700';
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage student accounts, administrator access, and view user details.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-white text-slate-700 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-xs">
            <UsersIcon className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <UsersIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Total Students</p>
            <h3 className="text-2xl font-black text-slate-900">{students.filter(s => s.role === 'mahasiswa').length}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Active Accounts</p>
            <h3 className="text-2xl font-black text-slate-900">{students.filter(s => s.status === 'active').length}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Administrators</p>
            <h3 className="text-2xl font-black text-slate-900">{students.filter(s => s.role === 'admin').length}</h3>
          </div>
        </div>
      </div>

      {/* TABS & SEARCH */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="border-b border-slate-100 p-2 flex flex-col sm:flex-row justify-between gap-3 bg-slate-50/50">
          <div className="flex gap-1 p-1 bg-slate-200/50 rounded-xl inline-flex w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab('mahasiswa')}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'mahasiswa' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Students
            </button>
            <button 
              onClick={() => setActiveTab('admin')}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all ${
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
                {activeTab === 'mahasiswa' && <th className="py-4 px-6">Level & XP</th>}
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
                        {user.name.slice(0, 2).toUpperCase()}
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
                      <div className="flex flex-col items-start gap-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getLevelColor(user.level)}`}>
                          Lv.{user.level || 0} {user.levelName || 'Unranked'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-500 fill-amber-500" /> {user.xp ? user.xp.toLocaleString() : 0} XP
                        </span>
                      </div>
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
                      <Calendar className="w-3 h-3" /> {user.lastActivity || '-'}
                    </p>
                  </td>
                  
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit User">
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.role === 'mahasiswa' && (
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Progress">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteStudent(user.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" 
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
                      <p className="text-xs">Try adjusting your search filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
