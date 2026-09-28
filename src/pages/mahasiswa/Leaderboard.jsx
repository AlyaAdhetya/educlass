import React, { useState } from 'react';
import { useDataStore } from '../../store/dataStore';
import { motion } from 'framer-motion';

export default function LeaderboardArena() {
  const { leaderboard, userStats } = useDataStore();
  const [activeTab, setActiveTab] = useState('kelas');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLeaderboard = leaderboard.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const top1 = leaderboard.find((item) => item.rank === 1);
  const top2 = leaderboard.find((item) => item.rank === 2);
  const top3 = leaderboard.find((item) => item.rank === 3);

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 space-y-8">
      {/* ================= 1. BANNER MUSIM LIGA ================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-6 md:p-8 text-white shadow-lg border-b-[6px] border-indigo-950">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-extrabold text-[10px] tracking-wide uppercase">
              <span className="material-symbols-outlined text-sm text-amber-300 fill-icon">
                military_tech
              </span>
              Turnamen Esports Akademik Mingguan
            </div>
            <h1 className="text-xl md:text-3xl font-black tracking-tight leading-tight">
              Liga Mahasiswa Semester Ganjil — Minggu ke-4
            </h1>
            <p className="text-xs md:text-sm text-white/90 leading-relaxed">
              Divisi <strong className="underline decoration-sky-300 underline-offset-4">Obsidian & Diamond</strong> (Kelas 3B Bahasa Inggris Akademis). Kumpulkan XP dari kuis harian, writing drill, dan grammar boss!
            </p>
          </div>

          {/* Countdown & Zone Status */}
          <div className="bg-black/25 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-4 shrink-0 shadow-inner">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black border-b-[3px] border-amber-600">
              <span className="material-symbols-outlined text-xl">timer</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/70 uppercase">Sisa Waktu Zona</p>
              <div className="text-base font-black text-white flex items-center gap-1.5">
                <span>2 Hari</span>
                <span className="text-amber-300">:</span>
                <span>14 Jam</span>
                <span className="text-[9px] font-extrabold text-white bg-rose-500/90 px-1.5 py-0.5 rounded-full ml-1 animate-pulse">
                  Menegangkan!
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. SUB-MODE TABS & SEARCH ================= */}
      <section className="flex flex-wrap items-center justify-between gap-4 border-b border-indigo-100 pb-4">
        <div className="inline-flex p-1.5 rounded-2xl bg-white border border-indigo-100 gap-1.5 shadow-xs">
          <button
            onClick={() => setActiveTab('kelas')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'kelas'
                ? 'bg-indigo-600 text-white shadow-xs border-b-2 border-indigo-900'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Leaderboard Kelas 3B
          </button>
          <button
            onClick={() => setActiveTab('guild')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'guild'
                ? 'bg-indigo-600 text-white shadow-xs border-b-2 border-indigo-900'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Turnamen Antar Kampus
          </button>
          <button
            onClick={() => setActiveTab('streak')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'streak'
                ? 'bg-indigo-600 text-white shadow-xs border-b-2 border-indigo-900'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Streak Hall of Fame
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-sm">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama mahasiswa..."
            className="pl-9 pr-4 py-2 text-xs bg-white rounded-xl border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400 shadow-xs"
          />
        </div>
      </section>

      {/* ================= 3. TOP 3 3D PODIUM SECTION ================= */}
      <section className="p-6 md:p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-indigo-100 shadow-sm relative overflow-hidden">
        <div className="text-center max-w-md mx-auto mb-8">
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] uppercase tracking-wider font-black">
            Panggung Kehormatan Mingguan
          </span>
          <h2 className="text-lg md:text-xl font-black text-slate-900 mt-1.5">
            Podium Tiga Jawara Akademik
          </h2>
          <p className="text-xs text-slate-500">
            Top 3 mahasiswa dengan kontribusi XP menulis esai & grammar duel tertinggi!
          </p>
        </div>

        {/* 3D Podium Visual */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end max-w-2xl mx-auto pt-8 pb-4">
          {/* RANK 2 (Silver) */}
          {top2 && (
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-xs flex items-center justify-center text-slate-700 z-10">
                  <span className="material-symbols-outlined text-base fill-icon">
                    workspace_premium
                  </span>
                </div>
                <img
                  src={top2.avatar}
                  alt={top2.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-4 border-slate-300 shadow-md"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-700 text-white text-[9px] font-black shadow-xs whitespace-nowrap">
                  #2 Perak
                </span>
              </div>

              <p className="font-bold text-xs text-slate-900 text-center truncate max-w-[100px]">
                {top2.name}
              </p>
              <p className="text-[10px] text-indigo-600 font-semibold">{top2.title}</p>

              {/* Podium block #2 */}
              <div className="w-full h-24 sm:h-28 bg-gradient-to-t from-slate-300 to-slate-200 rounded-t-2xl mt-3 flex items-center justify-center border-t-4 border-slate-400 shadow-inner">
                <span className="text-xl sm:text-2xl font-black text-slate-600">
                  {top2.xp.toLocaleString()} XP
                </span>
              </div>
            </div>
          )}

          {/* RANK 1 (Gold - Center & Highest) */}
          {top1 && (
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-amber-400 border-2 border-white shadow-md flex items-center justify-center text-amber-950 z-10 animate-bounce">
                  <span className="material-symbols-outlined text-lg fill-icon">crown</span>
                </div>
                <img
                  src={top1.avatar}
                  alt={top1.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-amber-400 shadow-lg"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black shadow-xs whitespace-nowrap">
                  #1 Emas
                </span>
              </div>

              <p className="font-black text-sm text-slate-900 text-center truncate max-w-[120px]">
                {top1.name}
              </p>
              <p className="text-[10px] text-amber-700 font-bold">{top1.title}</p>

              {/* Podium block #1 */}
              <div className="w-full h-32 sm:h-36 bg-gradient-to-t from-amber-400 to-amber-300 rounded-t-2xl mt-3 flex items-center justify-center border-t-4 border-amber-500 shadow-inner">
                <span className="text-xl sm:text-2xl font-black text-amber-950">
                  {top1.xp.toLocaleString()} XP
                </span>
              </div>
            </div>
          )}

          {/* RANK 3 (Bronze) */}
          {top3 && (
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-700 border-2 border-white shadow-xs flex items-center justify-center text-white z-10">
                  <span className="material-symbols-outlined text-base fill-icon">
                    military_tech
                  </span>
                </div>
                <img
                  src={top3.avatar}
                  alt={top3.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-4 border-amber-600 shadow-md"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-800 text-white text-[9px] font-black shadow-xs whitespace-nowrap">
                  #3 Perunggu
                </span>
              </div>

              <p className="font-bold text-xs text-slate-900 text-center truncate max-w-[100px]">
                {top3.name}
              </p>
              <p className="text-[10px] text-indigo-600 font-semibold">{top3.title}</p>

              {/* Podium block #3 */}
              <div className="w-full h-20 sm:h-24 bg-gradient-to-t from-amber-600 to-amber-500 rounded-t-2xl mt-3 flex items-center justify-center border-t-4 border-amber-700 shadow-inner">
                <span className="text-lg sm:text-xl font-black text-white">
                  {top3.xp.toLocaleString()} XP
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ================= 4. FULL STANDINGS TABLE ================= */}
      <section className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-xs">
        <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-indigo-600">format_list_numbered</span>
          Klasemen Lengkap Divisi Obsidian
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Peringkat</th>
                <th className="py-3 px-4">Mahasiswa</th>
                <th className="py-3 px-4">Gelar Akademik</th>
                <th className="py-3 px-4">Streak</th>
                <th className="py-3 px-4 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredLeaderboard.map((item) => (
                <tr
                  key={item.rank}
                  className={`hover:bg-slate-50 transition-colors ${
                    item.isCurrentUser ? 'bg-indigo-50/70 font-bold' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-black">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-xl ${
                        item.rank === 1
                          ? 'bg-amber-100 text-amber-800'
                          : item.rank === 2
                          ? 'bg-slate-200 text-slate-700'
                          : item.rank === 3
                          ? 'bg-amber-800/10 text-amber-800'
                          : 'text-slate-500'
                      }`}
                    >
                      #{item.rank}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-8 h-8 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <p className="font-extrabold text-slate-900">{item.name}</p>
                      <p className="text-[10px] text-slate-400">NIM: {item.nim}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-semibold">{item.title}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-amber-600 font-bold">
                      <span className="material-symbols-outlined text-sm fill-icon">
                        local_fire_department
                      </span>
                      {item.streak}d
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-indigo-700">
                    {item.xp.toLocaleString()} XP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
