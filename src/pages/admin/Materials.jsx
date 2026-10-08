import React, { useState } from 'react';
import { useDataStore } from '../../store/dataStore';
import { 
  BookOpen, Plus, Search, Filter, MoreVertical, 
  Edit, Trash2, Eye, Layout, CheckCircle2, AlertCircle, PlayCircle, Clock
} from 'lucide-react';

export default function AdminMaterials() {
  const { materials, deleteMaterial } = useDataStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'published' && m.status === 'completed') ||
                          (filterStatus === 'draft' && m.status !== 'completed');
    return matchesSearch && matchesStatus;
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
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Learning Materials</h1>
          <p className="text-slate-500 text-sm mt-1">Manage interactive modules, reading content, and unit structures.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-xs">
            <Plus className="w-4 h-4" /> Create Material
          </button>
        </div>
      </div>

      {/* TABS & SEARCH */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-2">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text"
              placeholder="Search materials or categories..."
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
          <div key={material.id} className="bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all overflow-hidden flex flex-col group">
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-3">
                {getStatusBadge(material.status)}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 text-slate-400 hover:text-indigo-600 rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {material.unit}
                </span>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {material.category}
                </span>
              </div>
              
              <h3 className="text-base font-black text-slate-900 leading-tight mb-2 group-hover:text-indigo-700 transition-colors">
                {material.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {material.description}
              </p>
            </div>
            
            <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between mt-auto">
              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
                <span className="flex items-center gap-1" title="Interactive Quests">
                  <PlayCircle className="w-3.5 h-3.5" /> {material.questSteps?.length || 0}
                </span>
                <span className="flex items-center gap-1" title="Reading Pages">
                  <Layout className="w-3.5 h-3.5" /> {material.pages?.length || 0}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => deleteMaterial(material.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" 
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* CREATE NEW CARD */}
        <button className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all min-h-[220px] cursor-pointer">
          <div className="w-12 h-12 bg-white rounded-full shadow-xs flex items-center justify-center mb-3">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-bold text-sm">Create New Material</span>
          <span className="text-xs text-slate-400 mt-1">Interactive module or reading</span>
        </button>
      </div>

      {filteredMaterials.length === 0 && (
        <div className="py-12 text-center text-slate-500">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold">No materials found</p>
          <p className="text-xs">Adjust your search or create a new material.</p>
        </div>
      )}

    </div>
  );
}
