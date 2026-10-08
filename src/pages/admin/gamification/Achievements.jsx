import React, { useState } from 'react';
import { useDataStore } from '../../../store/dataStore';
import { Award, Plus, Search, Filter, Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminAchievements() {
  const { achievements, deleteAchievement } = useDataStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredAchievements = achievements.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || a.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Achievements</h1>
          <p className="text-slate-500 text-sm mt-1">Manage unlockable badges and milestones for students.</p>
        </div>
        
        <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-xs">
          <Plus className="w-4 h-4" /> Create Achievement
        </button>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-4 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Categories</option>
            <option value="learning">Learning</option>
            <option value="streak">Streak</option>
            <option value="performance">Performance</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input 
            type="text"
            placeholder="Search achievements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>
      </div>

      {/* ACHIEVEMENTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAchievements.map(achievement => (
          <div key={achievement.id} className="bg-white rounded-3xl border border-slate-100 shadow-xs p-5 flex flex-col group hover:border-indigo-200 transition-colors">
            
            <div className="flex justify-between items-start mb-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl shadow-inner border border-indigo-100/50">
                {achievement.icon}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                  achievement.status === 'active' 
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}>
                  {achievement.status === 'active' ? 'Active' : 'Inactive'}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded"><Edit className="w-3.5 h-3.5"/></button>
                  <button onClick={() => deleteAchievement(achievement.id)} className="p-1 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded"><Trash2 className="w-3.5 h-3.5"/></button>
                </div>
              </div>
            </div>

            <div className="mb-4 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">{achievement.category}</span>
              </div>
              <h3 className="text-base font-black text-slate-900 leading-tight mb-1">{achievement.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{achievement.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-slate-500">Requirement:</span>
                <span className="font-bold text-slate-700">{achievement.requirementLabel}</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-slate-500">Reward:</span>
                <span className="font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">+{achievement.xpBonus} XP</span>
              </div>
            </div>

          </div>
        ))}
        
        {/* ADD NEW CARD */}
        <button className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all min-h-[240px] cursor-pointer">
          <div className="w-12 h-12 bg-white rounded-full shadow-xs flex items-center justify-center mb-3">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-bold text-sm">Create Achievement</span>
        </button>
      </div>

    </div>
  );
}
