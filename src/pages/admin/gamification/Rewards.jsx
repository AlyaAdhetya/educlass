import React, { useState } from 'react';
import { Star, Plus, Search, Edit, Trash2, Palette, Unlock } from 'lucide-react';

const STATIC_REWARDS = [
  { id: 1, name: 'Ocean Breeze', type: 'theme', status: 'active', description: 'Tema biru laut yang menenangkan.', icon: 'waves', preview: '#bfdbfe', requirementLabel: '50 Gems' },
  { id: 2, name: 'Forest Night', type: 'theme', status: 'active', description: 'Tema hijau gelap nuansa hutan.', icon: 'forest', preview: '#bbf7d0', requirementLabel: '75 Gems' },
  { id: 3, name: 'Sunset Glow', type: 'theme', status: 'active', description: 'Tema oranye hangat seperti matahari terbenam.', icon: 'wb_sunny', preview: '#fed7aa', requirementLabel: '100 Gems' },
];

export default function AdminGamificationRewards() {
  const [rewards]      = useState(STATIC_REWARDS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRewards = rewards.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Rewards & Shop</h1>
          <p className="text-slate-500 text-sm mt-1">Manage themes, content unlocks, and items available to students.</p>
        </div>
        
        <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-xs">
          <Plus className="w-4 h-4" /> Create Reward
        </button>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input 
          type="text"
          placeholder="Search rewards..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-xs"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredRewards.map(reward => (
          <div key={reward.id} className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden flex flex-col group hover:border-indigo-200 transition-all">
            
            {/* Visual Preview */}
            <div 
              className={`h-24 w-full relative flex items-center justify-center border-b border-slate-100 ${
                reward.type === 'content' ? 'bg-slate-100' : ''
              }`}
              style={reward.type === 'theme' ? { backgroundColor: reward.preview } : {}}
            >
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-2xl shadow-inner">
                {reward.icon}
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 text-white bg-black/20 hover:bg-black/40 rounded-lg backdrop-blur-sm"><Edit className="w-3.5 h-3.5"/></button>
                <button onClick={() => alert('Hapus reward: ' + reward.name)} className="p-1.5 text-white bg-rose-500/80 hover:bg-rose-600 rounded-lg backdrop-blur-sm"><Trash2 className="w-3.5 h-3.5"/></button>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-full flex items-center gap-1 ${
                  reward.type === 'theme' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                }`}>
                  {reward.type === 'theme' ? <Palette className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  {reward.type}
                </span>
                <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-full border ${
                  reward.status === 'active' ? 'bg-slate-50 text-slate-500 border-slate-200' : 'bg-rose-50 text-rose-500 border-rose-200'
                }`}>
                  {reward.status}
                </span>
              </div>
              
              <h3 className="text-base font-black text-slate-900 leading-tight mb-1">{reward.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1">{reward.description}</p>
              
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span className="font-bold text-slate-400">Unlock Condition:</span>
                <span className="font-black text-amber-500 bg-amber-50 px-2 py-1 rounded-md">{reward.requirementLabel}</span>
              </div>
            </div>
            
          </div>
        ))}
        
        {/* ADD NEW CARD */}
        <button className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all min-h-[260px] cursor-pointer">
          <div className="w-12 h-12 bg-white rounded-full shadow-xs flex items-center justify-center mb-3">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-bold text-sm">Create Reward</span>
        </button>
      </div>

    </div>
  );
}
