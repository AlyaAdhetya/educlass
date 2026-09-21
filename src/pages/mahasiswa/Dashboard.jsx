import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MI = ({ name, fill = false, className = '' }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={{ fontVariationSettings: fill ? "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24" : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
  >
    {name}
  </span>
);

const roadmapLevels = [
  {
    id: 'A1', label: 'Level A1: Beginner', sub: 'Foundational Grammar, Greetings, Daily Phrases', status: 'done', pct: 100,
    nodes: [
      { icon: 'check', label: 'Unit 1: Basic Sentences', sub: '⭐⭐⭐', variant: 'done' },
      { icon: 'emoji_events', label: 'A1 Mastery Checkpoint', sub: 'Perfect Score (100/100)', variant: 'trophy' },
    ]
  },
  {
    id: 'A2', label: 'Level A2: Elementary', sub: 'Simple Narrative, Routine Communication', status: 'done', pct: 100,
    nodes: [
      { icon: 'menu_book', label: 'Unit 2: Daily Descriptions', sub: 'Passed with Honor', variant: 'done', offset: '-translate-x-12' },
      { icon: 'psychology_alt', label: 'A2 Milestone Test', sub: 'Trophy Unlocked', variant: 'done', offset: 'translate-x-12' },
    ]
  },
  {
    id: 'B1', label: 'Level B1: Intermediate', sub: 'Target Semester: Academic Essay Connectors & Formal Lectures', status: 'active', pct: 68,
    nodes: [
      { icon: 'draw', label: 'Node Unit 3', sub: 'Academic Essay Connectors', variant: 'active', badge: 'Sedang Aktif' },
      { icon: 'history_edu', label: 'Node Unit 4', sub: 'Past Perfect vs Past Simple', variant: 'next', xpLabel: '+25 XP', offset: 'translate-x-16' },
      { icon: 'headphones', label: 'Node Unit 5', sub: 'Listening to Campus Lectures', variant: 'upcoming', offset: '-translate-x-16' },
      { icon: 'workspace_premium', label: 'Node Unit 6', sub: 'Unit Milestone Quiz', variant: 'milestone', badge: 'Ujian Sertifikasi' },
    ]
  },
  {
    id: 'B2', label: 'Level B2: Upper Intermediate', sub: 'Complex Academic Synthesis & Debate', status: 'locked', pct: 0,
    nodes: []
  },
];

export default function MahasiswaDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('roadmap');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#131b2e]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Stats Header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6">
        {/* Streak */}
        <div className="rounded-xl bg-white border border-[#E2E8F0] p-4 shadow-sm hover:border-[#EA580C]/40 transition-colors flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center shrink-0">
            <MI name="local_fire_department" fill className="text-3xl" />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-widest text-[#64748B] uppercase">Daily Streak</p>
            <h3 className="text-base font-bold text-[#EA580C]">12 Hari</h3>
            <p className="text-xs text-[#64748B]">Berturut-turut 🔥</p>
          </div>
        </div>
        {/* XP */}
        <div className="rounded-xl bg-white border border-[#E2E8F0] p-4 shadow-sm hover:border-[#8d4b00]/40 transition-colors flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FFFBEB] text-[#8d4b00] flex items-center justify-center shrink-0">
            <MI name="bolt" fill className="text-3xl" />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-widest text-[#64748B] uppercase">Total XP</p>
            <h3 className="text-base font-bold text-[#8d4b00]">2,450 XP</h3>
            <p className="text-xs text-[#64748B]">+180 XP minggu ini ⚡</p>
          </div>
        </div>
        {/* Liga */}
        <div className="rounded-xl bg-white border border-[#E2E8F0] p-4 shadow-sm hover:border-[#006948]/40 transition-colors flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] text-[#006948] flex items-center justify-center shrink-0">
            <MI name="military_tech" fill className="text-3xl" />
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-widest text-[#64748B] uppercase">Divisi Liga</p>
            <h3 className="text-base font-bold text-[#006948]">Emerald League</h3>
            <p className="text-xs font-semibold text-[#006948]">Peringkat #3 Kelas 🏆</p>
          </div>
        </div>
        {/* CEFR */}
        <div className="rounded-xl bg-white border border-[#E2E8F0] p-4 shadow-sm hover:border-[#4b41e1]/40 transition-colors flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#EEF2FF] text-[#4b41e1] flex items-center justify-center shrink-0">
            <MI name="auto_graph" fill className="text-3xl" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold tracking-widest text-[#64748B] uppercase">CEFR Target</p>
            <h3 className="text-base font-bold text-[#4b41e1] truncate">Level B1 Inter.</h3>
            <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full mt-1">
              <div className="bg-[#4b41e1] h-full rounded-full" style={{ width: '68%' }} />
            </div>
            <p className="text-[11px] text-[#64748B] mt-0.5">68% menuju B2</p>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 px-6 pb-6">
        {/* Roadmap */}
        <div className="xl:col-span-8 rounded-2xl bg-white border border-[#E2E8F0] p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-6">
            <div>
              <span className="px-2.5 py-1 rounded-md bg-[#ECFDF5] text-[#006948] text-[11px] font-bold uppercase tracking-wider">Kurikulum Resmi CEFR</span>
              <h2 className="text-2xl font-bold text-[#131b2e] mt-1">Peta Pembelajaran Bahasa Inggris</h2>
              <p className="text-sm text-[#64748B]">Jelajahi unit pembelajaran, taklukkan kuis interaktif, dan validasi sertifikasi.</p>
            </div>
          </div>

          <div className="relative py-4 max-w-xl mx-auto flex flex-col items-center gap-0">
            {roadmapLevels.map((level, li) => (
              <React.Fragment key={level.id}>
                {li > 0 && (
                  <div className={`w-0.5 h-10 ${level.status === 'locked' ? 'border-l-2 border-dashed border-[#E2E8F0]' : 'border-l-4 border-[#006948]'} my-1`} />
                )}
                <div className={`w-full mb-8 ${level.status === 'locked' ? 'opacity-70' : ''}`}>
                  {/* Level Header */}
                  <div className={`flex items-center justify-between px-4 py-3 rounded-xl border mb-6 ${
                    level.status === 'active'
                      ? 'bg-gradient-to-r from-[#ECFDF5] via-white to-[#EEF2FF] border-2 border-[#006948] shadow-sm'
                      : level.status === 'locked'
                      ? 'bg-[#f2f3ff] border-[#E2E8F0]'
                      : 'bg-[#f2f3ff] border-[#E2E8F0]'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        level.status === 'active' ? 'bg-[#006948] text-white' :
                        level.status === 'locked' ? 'bg-[#dae2fd] text-[#64748B]' : 'bg-[#ECFDF5] text-[#006948]'
                      }`}>{level.id}</div>
                      <div>
                        <h3 className="font-bold text-[#131b2e] text-base">{level.label}</h3>
                        <p className="text-xs text-[#64748B]">{level.sub}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      level.status === 'done' ? 'bg-[#ECFDF5] border border-[#006948]/30 text-[#006948]' :
                      level.status === 'active' ? 'bg-[#006948] text-white animate-pulse' :
                      'bg-[#dae2fd] text-[#64748B]'
                    }`}>
                      {level.status === 'done' && <MI name="verified" fill className="text-sm text-amber-500" />}
                      {level.status === 'active' && 'Sedang Berjalan'}
                      {level.status === 'done' && `Selesai • 100%`}
                      {level.status === 'locked' && <><MI name="lock" className="text-sm" /> Terkunci</>}
                    </div>
                  </div>

                  {/* Nodes */}
                  {level.status === 'locked' ? (
                    <div className="flex flex-col items-center gap-3 py-2">
                      <div className="w-14 h-14 rounded-full bg-[#dae2fd] text-[#64748B] flex items-center justify-center border-4 border-[#E2E8F0]">
                        <MI name="lock" className="text-2xl" />
                      </div>
                      <p className="text-sm text-[#64748B]">Buka setelah lulus Level B1</p>
                    </div>
                  ) : (
                    <div className="relative flex flex-col items-center gap-8">
                      {level.nodes.map((node, ni) => (
                        <React.Fragment key={ni}>
                          {ni > 0 && (
                            <div className={`w-0.5 h-8 ${
                              level.status === 'active' && ni === 1 ? 'border-l-2 border-dashed border-[#006948]' :
                              level.status === 'active' ? 'border-l-2 border-dashed border-[#bccac0]' :
                              'bg-[#006948]/40 rounded'
                            }`} />
                          )}
                          <div className={`flex flex-col items-center cursor-pointer group ${node.offset || ''}`}>
                            {node.variant === 'active' && (
                              <div className="absolute -top-14 mb-2 bg-[#283044] text-[#eef0ff] px-4 py-2 rounded-xl shadow-xl border border-[#bccac0] flex items-center gap-2 animate-bounce z-30">
                                <MI name="lightbulb" fill className="text-amber-400 text-lg" />
                                <span className="text-xs font-bold whitespace-nowrap">Mulai Belajar Sekarang!</span>
                              </div>
                            )}
                            <button
                              onClick={() => navigate('/dashboard/modules')}
                              className={`flex items-center justify-center transition-all group-hover:scale-105 ${
                                node.variant === 'active'
                                  ? 'w-20 h-20 rounded-full bg-[#006948] text-white ring-4 ring-[#85f8c4] shadow-lg'
                                  : node.variant === 'trophy'
                                  ? 'w-14 h-14 rounded-full bg-[#ffdcc3] text-[#8d4b00] border-4 border-amber-300 shadow-md'
                                  : node.variant === 'milestone'
                                  ? 'w-16 h-16 rounded-full bg-[#EEF2FF] border-4 border-[#4b41e1] text-[#4b41e1] shadow-md'
                                  : node.variant === 'next'
                                  ? 'w-16 h-16 rounded-full bg-white border-4 border-[#006948] text-[#006948] shadow-md group-hover:bg-[#ECFDF5]'
                                  : node.variant === 'done'
                                  ? 'w-14 h-14 rounded-full bg-[#006948] text-white border-4 border-[#85f8c4] shadow-md'
                                  : 'w-16 h-16 rounded-full bg-white border-4 border-[#6d7a72] text-[#64748B] shadow-sm'
                              }`}
                            >
                              <MI name={node.icon} fill={['done', 'active', 'trophy'].includes(node.variant)} className="text-2xl" />
                            </button>
                            <div className="text-center mt-2">
                              {node.badge && (
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-1 ${
                                  node.variant === 'milestone' ? 'bg-[#EEF2FF] text-[#4b41e1]' : 'bg-[#ECFDF5] text-[#006948]'
                                }`}>{node.badge}</span>
                              )}
                              <h4 className="font-bold text-[#131b2e] text-sm">{node.label}</h4>
                              <p className="text-xs text-[#64748B]">{node.sub}</p>
                              {node.xpLabel && <p className="text-xs text-[#006948] font-semibold">{node.xpLabel}</p>}
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right Sidebar Widgets */}
        <div className="xl:col-span-4 space-y-4">
          {/* Daily Quest */}
          <div className="rounded-2xl bg-white border border-[#E2E8F0] p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] text-[#8d4b00] flex items-center justify-center">
                  <MI name="target" fill className="text-lg" />
                </div>
                <h3 className="font-bold text-[#131b2e] text-sm">Target & Quest Harian</h3>
              </div>
              <span className="text-[10px] font-bold text-[#8d4b00] bg-[#FFFBEB] px-2 py-0.5 rounded">Reset 8 Jam</span>
            </div>

            <div className="space-y-1.5 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-[#131b2e]">
                  <MI name="bolt" className="text-[#8d4b00] text-base" />
                  Dapatkan 50 XP hari ini
                </span>
                <span className="text-[#006948] font-bold">35 / 50 XP</span>
              </div>
              <div className="w-full bg-[#E2E8F0] h-2.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#006948] to-[#00855d] h-full rounded-full" style={{ width: '70%' }} />
              </div>
              <p className="text-[11px] text-[#64748B] text-right">Tersisa 15 XP untuk klaim peti</p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#EEF2FF] text-[#4b41e1] flex items-center justify-center shrink-0">
                  <MI name="headphones" className="text-base" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#131b2e]">1 Latihan Listening</p>
                  <p className="text-[11px] text-[#64748B]">Modul B1 Campus Dialogue</p>
                </div>
              </div>
              <button className="px-2.5 py-1 rounded bg-[#4b41e1] text-white text-[11px] font-bold" style={{ boxShadow: '0 3px 0 #3323cc' }}>
                Mulai
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FFF7ED] text-[#EA580C] flex items-center justify-center shrink-0">
                  <MI name="local_fire_department" fill className="text-base" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#131b2e]">Pertahankan Streak</p>
                  <p className="text-[11px] text-[#64748B]">Target: 13 Hari Besok</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#ECFDF5] text-[#006948] text-[11px] font-bold flex items-center gap-1">
                <MI name="check" className="text-xs" /> Aman
              </span>
            </div>
          </div>

          {/* Leaderboard Snippet */}
          <div className="rounded-2xl bg-white border border-[#E2E8F0] p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#006948] flex items-center justify-center">
                  <MI name="leaderboard" fill className="text-lg" />
                </div>
                <h3 className="font-bold text-[#131b2e] text-sm">Peringkat Kelas 3B</h3>
              </div>
              <button className="text-[11px] font-bold text-[#4b41e1] hover:underline" onClick={() => navigate('/dashboard/leaderboard')}>
                Lihat Semua
              </button>
            </div>
            {[
              { rank: '#1', name: 'Dewi Nurlita', xp: '3,120 XP', streak: '18', color: 'text-[#8d4b00]', bg: 'bg-[#FFFBEB]/50 border-amber-200' },
              { rank: '#2', name: 'Bagas Aditya', xp: '2,780 XP', streak: '15', color: 'text-slate-500', bg: 'bg-[#F8FAFC] border-[#E2E8F0]' },
              { rank: '#3', name: 'Rian (Anda)', xp: '2,450 XP', streak: '12', color: 'text-[#006948]', bg: 'bg-[#ECFDF5] border-2 border-[#006948]', you: true },
            ].map(r => (
              <div key={r.rank} className={`flex items-center justify-between p-2 rounded-xl border ${r.bg}`}>
                <div className="flex items-center gap-2.5">
                  <span className={`w-6 text-center font-extrabold text-sm ${r.color}`}>{r.rank}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${r.you ? 'bg-[#006948] text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {r.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#131b2e] truncate">{r.name}</p>
                    <p className="text-[10px] text-[#64748B]">{r.xp} • {r.streak}-Day Streak</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bonus CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-[#ECFDF5] to-[#f2f3ff] border border-[#006948]/20 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#006948]">
              <span>BONUS DRILL</span>
              <span className="bg-[#006948]/10 px-1.5 py-0.5 rounded text-[#006948] text-[11px] font-bold">+15 XP</span>
            </div>
            <p className="text-xs text-[#131b2e]">5-minute Academic Sentence Builder</p>
            <button
              className="w-full py-2 px-3 rounded-lg bg-[#006948] text-white text-xs font-bold flex items-center justify-center gap-1.5"
              style={{ boxShadow: '0 4px 0 #005137' }}
              onClick={() => navigate('/dashboard/modules')}
            >
              <MI name="play_arrow" className="text-base" />
              Quick Practice +15 XP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
