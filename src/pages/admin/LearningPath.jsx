import React, { useState } from 'react';
import { useDataStore } from '../../store/dataStore';
import { MapPin, Plus, GripVertical, Edit, Trash2, ArrowRight } from 'lucide-react';

export default function AdminLearningPath() {
  const { learningPaths, materials, deleteLearningPath } = useDataStore();
  const [activePath, setActivePath] = useState(learningPaths[0]?.id || null);

  const currentPath = learningPaths.find(p => p.id === activePath);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Learning Paths</h1>
          <p className="text-slate-500 text-sm mt-1">Design structured curriculum journeys for students.</p>
        </div>
        
        <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-xs">
          <Plus className="w-4 h-4" /> Create New Path
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* PATH LIST SIDEBAR (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Available Paths</h3>
          {learningPaths.map(path => (
            <button
              key={path.id}
              onClick={() => setActivePath(path.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                activePath === path.id 
                  ? 'bg-indigo-50 border-indigo-200 shadow-xs' 
                  : 'bg-white border-slate-100 hover:border-slate-200'
              }`}
            >
              <h4 className={`font-black ${activePath === path.id ? 'text-indigo-900' : 'text-slate-900'}`}>
                {path.name}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{path.description}</p>
              
              <div className="flex items-center gap-2 mt-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-100 text-slate-600">
                  {path.level}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">
                  {path.items.length} Modules
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* PATH EDITOR (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-xs p-6">
          {currentPath ? (
            <>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900">{currentPath.name}</h2>
                  <p className="text-sm text-slate-500 mt-1">{currentPath.description}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5">
                    <Edit className="w-3.5 h-3.5" /> Edit Details
                  </button>
                  <button 
                    onClick={() => deleteLearningPath(currentPath.id)}
                    className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                <h3 className="text-xs font-black text-slate-700 uppercase mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-500" /> Path Sequence
                </h3>
                
                <div className="space-y-2">
                  {currentPath.items.sort((a, b) => a.order - b.order).map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 group">
                      <div className="cursor-grab text-slate-300 hover:text-slate-500">
                        <GripVertical className="w-5 h-5" />
                      </div>
                      
                      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-black shrink-0">
                        {item.order}
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{item.title}</p>
                        <p className="text-[10px] text-slate-500">{item.category}</p>
                      </div>
                      
                      <button className="opacity-0 group-hover:opacity-100 p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-3 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold text-xs hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Add Material to Path
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-500">
              <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold">No path selected</p>
              <p className="text-xs">Select a path from the sidebar to view or edit its contents.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
