import React from 'react';
import { useDataStore } from '../../store/dataStore';
import { Gift, Award, Lock, Sparkles } from 'lucide-react';

export default function Rewards() {
  const { userStats, achievements, rewards, unlocked } = useDataStore();

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Rewards & Achievements</h1>
          <p className="text-slate-500 mt-2">Kumpulkan XP untuk membuka tema dan konten eksklusif.</p>
        </div>

        {/* Current XP Status */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="w-32 h-32" />
          </div>
          <div className="relative z-10 text-center md:text-left">
            <p className="text-amber-100 font-bold uppercase tracking-wider text-sm mb-1">Total XP Kamu</p>
            <h2 className="text-4xl md:text-5xl font-extrabold">{userStats.total_xp} XP</h2>
          </div>
          <div className="relative z-10 bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
            <p className="text-sm font-semibold text-amber-50 mb-1">Level Saat Ini</p>
            <p className="text-xl font-bold">{userStats.levelName}</p>
          </div>
        </div>

        {/* Unlocks / Rewards */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
            <Gift className="w-5 h-5 text-blue-600" />
            Unlockable Rewards
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rewards.map(reward => {
              const isUnlocked = userStats.total_xp >= reward.requirement_xp;
              return (
                <div key={reward.id} className={`p-5 rounded-2xl border flex items-center gap-4 transition-all ${
                  isUnlocked ? 'bg-white border-emerald-200 shadow-sm' : 'bg-slate-100 border-slate-200 opacity-80'
                }`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shrink-0 ${
                    isUnlocked ? 'bg-emerald-100' : 'bg-slate-200 grayscale'
                  }`}>
                    {reward.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-sm ${isUnlocked ? 'text-slate-900' : 'text-slate-500'}`}>{reward.name}</h3>
                    <p className="text-xs text-slate-500">{reward.type === 'theme' ? 'Tema Tampilan' : 'Konten Ekstra'}</p>
                    
                    <div className="mt-2 text-[11px] font-bold">
                      {isUnlocked ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          Terbuka 🎉
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Butuh {reward.requirement_xp} XP
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges / Achievements */}
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
            <Award className="w-5 h-5 text-purple-600" />
            Badges & Achievements
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {achievements.map(achieve => {
              const hasBadge = unlocked.achievements.includes(achieve.id);
              return (
                <div key={achieve.id} className={`p-4 rounded-2xl border flex items-center gap-4 ${
                  hasBadge ? 'bg-white border-purple-200 shadow-sm' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                    hasBadge ? 'bg-purple-100 shadow-inner' : 'bg-slate-200 grayscale opacity-40'
                  }`}>
                    {achieve.icon}
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm ${hasBadge ? 'text-slate-900' : 'text-slate-500'}`}>{achieve.name}</h3>
                    <p className="text-xs text-slate-500">{achieve.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
