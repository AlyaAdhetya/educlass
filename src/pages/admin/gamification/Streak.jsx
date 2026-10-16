import React, { useState } from 'react';
import { Flame, Save, Edit, Trash2, Plus, Calendar, Clock, Target } from 'lucide-react';

const DEFAULT_STREAK_CONFIG = {
  activitiesCountedForStreak: ['complete_module', 'complete_quiz', 'quiz_arena'],
  gracePeriodHours: 2,
  resetOnMissedDays: true,
  milestones: [
    { days: 3,  badge: '🔥', label: 'Hot Start',      xpBonus: 50 },
    { days: 7,  badge: '⚡', label: 'One Week Streak', xpBonus: 100 },
    { days: 14, badge: '🌟', label: 'Two Weeks Strong', xpBonus: 200 },
    { days: 30, badge: '🏆', label: 'Monthly Warrior',  xpBonus: 500 },
  ],
};

export default function AdminStreak() {
  const [streakConfig] = useState(DEFAULT_STREAK_CONFIG);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Streak Configuration</h1>
          <p className="text-slate-500 text-sm mt-1">Manage daily learning streaks and milestone bonuses.</p>
        </div>
        <button className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 shadow-xs">
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SETTINGS (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-orange-500" /> General Rules
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Activities counted for streak</label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                  {['complete_module', 'complete_quiz', 'quiz_arena'].map(act => (
                    <label key={act} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <input 
                        type="checkbox" 
                        defaultChecked={streakConfig.activitiesCountedForStreak.includes(act)}
                        className="rounded text-orange-500 focus:ring-orange-500 border-slate-300"
                      />
                      {act.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Grace period (Hours)</label>
                <input 
                  type="number" 
                  defaultValue={streakConfig.gracePeriodHours}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-[10px] text-slate-400">Hours allowed after midnight before streak breaks (0 = strict midnight cutoff).</p>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2 text-xs text-slate-700 font-bold cursor-pointer">
                  <input 
                    type="checkbox" 
                    defaultChecked={streakConfig.resetOnMissedDays}
                    className="mt-0.5 rounded text-orange-500 focus:ring-orange-500 border-slate-300"
                  />
                  <span>Reset streak to 0 on missed days<br/>
                    <span className="text-[10px] text-slate-400 font-normal">If unchecked, streak pauses instead of resetting.</span>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* MILESTONES (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-orange-500" /> Milestone Bonuses
              </h2>
              <button className="px-3 py-1.5 bg-orange-50 text-orange-600 text-xs font-bold rounded-lg hover:bg-orange-100 transition-colors flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add Milestone
              </button>
            </div>

            <div className="space-y-3 relative">
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-100 z-0" />

              {streakConfig.milestones.map((ms, idx) => (
                <div key={idx} className="relative z-10 flex gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl shrink-0 border-4 border-white shadow-xs">
                    {ms.badge}
                  </div>
                  
                  <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs group-hover:border-orange-300 transition-colors flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Reach</span>
                        <span className="text-xs font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">{ms.days} Days</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{ms.label}</h3>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 font-bold mb-0.5">Bonus Reward</p>
                        <span className="text-sm font-black text-amber-500">+{ms.xpBonus} XP</span>
                      </div>
                      
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity pl-4 border-l border-slate-100">
                        <button className="p-1 text-slate-400 hover:text-indigo-600 rounded"><Edit className="w-3.5 h-3.5"/></button>
                        <button className="p-1 text-slate-400 hover:text-rose-600 rounded"><Trash2 className="w-3.5 h-3.5"/></button>
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
