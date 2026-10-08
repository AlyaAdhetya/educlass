import React, { useState } from 'react';
import { useDataStore } from '../../store/dataStore';
import { ClipboardList, Plus, Search, Edit, Trash2, Check, ArrowLeft, ArrowRight } from 'lucide-react';

export default function AdminQuestions() {
  const { materials } = useDataStore();
  const [selectedModuleId, setSelectedModuleId] = useState(materials[0]?.id || null);
  
  const selectedModule = materials.find(m => m.id === selectedModuleId);
  const questions = selectedModule?.quiz || [];
  const interactiveQuests = selectedModule?.questSteps || [];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
      
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
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-xs"
            />
          </div>
          
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Select Module</h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {materials.map(m => (
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
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                    selectedModuleId === m.id ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                  }`}>
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
                    {selectedModule.unit} • {selectedModule.category}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 leading-tight">{selectedModule.title}</h2>
                </div>
                <button className="shrink-0 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-xs">
                  <Plus className="w-4 h-4" /> Add Question
                </button>
              </div>

              {/* Standard Quiz Questions */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-indigo-500" /> Multiple Choice Questions ({questions.length})
                </h3>
                
                {questions.length === 0 ? (
                  <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 text-center text-slate-500">
                    <p className="text-sm font-bold mb-1">No multiple choice questions</p>
                    <p className="text-xs">Click 'Add Question' to create standard quiz questions.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {questions.map((q, idx) => (
                      <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs group">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <p className="text-sm font-bold text-slate-900 leading-relaxed">{q.q}</p>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-4 h-4"/></button>
                            <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4"/></button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-9">
                          {q.options.map((opt, oIdx) => (
                            <div 
                              key={oIdx} 
                              className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                                oIdx === q.answer 
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                                  : 'bg-slate-50 border-slate-100 text-slate-600'
                              }`}
                            >
                              {oIdx === q.answer ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />}
                              {opt}
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 pl-9">
                          <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-600 border border-slate-100">
                            <strong className="text-slate-800">Explanation:</strong> {q.explanation}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

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

    </div>
  );
}
