import React from 'react';
import { useDataStore } from '../../../store/dataStore';
import { Zap, Trophy, Plus, Edit, Trash2, Shield, Settings2 } from 'lucide-react';

export default function AdminXpLevels() {
  const { levels, xpConfig } = useDataStore();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">XP & Level System</h1>
          <p className="text-slate-500 text-sm mt-1">Configure experience points logic and student progression levels.</p>
        </div>
        <button className="px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 shadow-xs">
          <Settings2 className="w-4 h-4" /> Save Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* XP CONFIGURATION */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <Zap className="w-5 h-5 fill-amber-500" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Experience Points (XP)</h2>
                <p className="text-xs text-slate-500">Configure how much XP students earn per action</p>
              </div>
            </div>

            <div className="space-y-3">
              {Object.entries(xpConfig).map(([key, config]) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:border-amber-200 transition-colors">
                  <div className="pr-4">
                    <p className="text-sm font-bold text-slate-800">{config.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{config.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <input 
                      type="number" 
                      defaultValue={config.value}
                      className="w-20 px-3 py-1.5 text-right font-black text-amber-600 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-[10px] font-bold text-slate-400">XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LEVEL PROGRESSION */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Level Progression</h2>
                  <p className="text-xs text-slate-500">Define level thresholds and perks</p>
                </div>
              </div>
              <button className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 relative">
              {/* Connecting line */}
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-100 z-0" />

              {levels.map((level, index) => (
                <div key={level.id} className="relative z-10 flex gap-4 group">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 border-4 border-white shadow-xs ${
                    level.color === 'gray' ? 'bg-slate-100' :
                    level.color === 'blue' ? 'bg-blue-100' :
                    level.color === 'indigo' ? 'bg-indigo-100' :
                    level.color === 'violet' ? 'bg-violet-100' :
                    level.color === 'amber' ? 'bg-amber-100' :
                    'bg-rose-100'
                  }`}>
                    {level.badge}
                  </div>
                  
                  <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs group-hover:border-indigo-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Level {level.level}</span>
                        </div>
                        <h3 className="text-base font-black text-slate-900">{level.name}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                          {level.xpRequired.toLocaleString()} XP
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-500">{level.description}</p>
                    
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                        Perk: {level.perks}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit className="w-3.5 h-3.5"/></button>
                        {index > 0 && <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-3.5 h-3.5"/></button>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
