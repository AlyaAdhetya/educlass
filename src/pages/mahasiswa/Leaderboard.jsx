import React from 'react';
import { useNavigate } from 'react-router-dom';

const MI = ({ name, fill = false, className = '' }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={{ fontVariationSettings: fill ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400", display: 'inline-block', verticalAlign: 'middle', lineHeight: 1 }}
  >
    {name}
  </span>
);

const LEADERBOARD_DATA = [
  { rank: 4, name: 'Aisyah Zahra', nim: '2201904', module: '28/30', streak: 15, xp: '2,740', status: 'Lengkap (2/2)', statusBg: 'bg-[#ECFDF5]', statusText: 'text-[#006948]' },
  { rank: 5, name: 'Dimas Setiawan', nim: '2201955', module: '26/30', streak: 11, xp: '2,510', status: 'Lengkap (2/2)', statusBg: 'bg-[#ECFDF5]', statusText: 'text-[#006948]' },
  { rank: 6, name: 'Sarah Widjaja', nim: '2201923', module: '25/30', streak: 8, xp: '2,380', status: '1 Menunggu Nilai', statusBg: 'bg-[#FFFBEB]', statusText: 'text-[#8d4b00]' },
  { rank: 7, name: 'Budi Hartono', nim: '2201977', module: '23/30', streak: 9, xp: '2,210', status: 'Lengkap (2/2)', statusBg: 'bg-[#ECFDF5]', statusText: 'text-[#006948]' },
  { rank: 8, name: 'Jessica Tan', nim: '2201934', module: '22/30', streak: 5, xp: '2,050', status: '1 Terlambat', statusBg: 'bg-[#FFF1F2]', statusText: 'text-[#E11D48]' },
  { rank: 9, name: 'Kevin Sanjaya', nim: '2201981', module: '20/30', streak: 7, xp: '1,940', status: 'Lengkap (2/2)', statusBg: 'bg-[#ECFDF5]', statusText: 'text-[#006948]' },
];

export default function Leaderboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#131b2e] flex flex-col font-body-md" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Hero Header */}
        <section className="bg-white rounded-xl p-4 sm:p-6 border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#4b41e1] font-bold text-[10px] uppercase tracking-wide border border-[#e2dfff]">Kelas Terverifikasi</span>
              <span className="text-[#64748B] text-xs">• Semester Ganjil 2026/2027</span>
            </div>
            <h1 className="text-2xl font-bold text-[#131b2e]">Progres Akademik & Papan Peringkat Kelas</h1>
            <p className="text-sm text-[#64748B] flex items-center gap-1.5">
              <MI name="meeting_room" className="text-[#006948] text-base" />
              Ruang Kuliah: <strong className="text-[#131b2e] font-semibold">Bahasa Inggris Akademik III - 3B</strong> (Kode: ENGL-302)
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="flex items-center bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] px-3 py-2 shadow-sm">
              <MI name="calendar_month" className="text-[#64748B] text-lg mr-2" />
              <select className="bg-transparent border-0 text-[#131b2e] font-semibold text-xs focus:ring-0 cursor-pointer p-0 pr-2">
                <option value="minggu">Minggu Ini</option>
                <option value="bulan">Bulan Ini</option>
                <option selected value="semester">Sepanjang Semester</option>
              </select>
            </div>
            <button className="bg-[#EEF2FF] text-[#4b41e1] hover:bg-[#e2dfff] p-2 rounded-lg border border-[#4b41e1]/20 transition-colors" title="Export Laporan Kelas">
              <MI name="file_download" className="text-xl" />
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Gamified Leaderboard */}
          <section className="lg:col-span-7 space-y-6">
            
            {/* Podium */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm overflow-hidden relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MI name="emoji_events" fill className="text-amber-500 text-2xl" />
                  <h3 className="font-bold text-lg text-[#131b2e]">Peringkat 3 Besar Teratas</h3>
                </div>
                <span className="text-[10px] font-bold bg-[#FFFBEB] text-[#8d4b00] px-2.5 py-0.5 rounded-full border border-amber-200">
                  Diperbarui Real-time
                </span>
              </div>
              
              <div className="pt-6 pb-2 flex items-end justify-center gap-3 sm:gap-6 border-b border-[#E2E8F0]">
                {/* 2nd Place */}
                <div className="flex flex-col items-center flex-1 max-w-[150px]">
                  <div className="relative mb-2">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-slate-300 bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl shadow-sm">
                      NP
                    </div>
                    <div className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-slate-700 text-xs font-bold shadow-sm">2</div>
                  </div>
                  <h4 className="font-bold text-sm text-[#131b2e] text-center w-full truncate">Nabila Putri</h4>
                  <p className="text-xs text-[#64748B] text-center">NIM 2201912</p>
                  <div className="flex items-center gap-1 text-[#EA580C] bg-[#FFF7ED] px-2 py-0.5 rounded-full text-[10px] font-bold mt-1">
                    <MI name="local_fire_department" fill className="text-[12px]" />
                    <span>19 Hari</span>
                  </div>
                  <div className="w-full bg-slate-50 border-t-4 border-slate-300 rounded-t-lg mt-3 py-3 px-2 text-center flex flex-col items-center justify-center">
                    <MI name="workspace_premium" className="text-slate-400 text-2xl" />
                    <span className="font-bold text-[#131b2e] text-xs">3,180 XP</span>
                    <span className="text-[10px] text-slate-500">Silver Medal</span>
                  </div>
                </div>

                {/* 1st Place */}
                <div className="flex flex-col items-center flex-1 max-w-[170px] -mt-6">
                  <div className="animate-bounce mb-1">
                    <MI name="crown" fill className="text-amber-500 text-3xl" />
                  </div>
                  <div className="relative mb-2">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-amber-400 bg-amber-100 flex items-center justify-center text-amber-500 font-bold text-3xl shadow-md">
                      FM
                    </div>
                    <div className="absolute -bottom-2 -right-1 w-8 h-8 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-amber-900 font-extrabold shadow-sm">1</div>
                  </div>
                  <h4 className="font-bold text-sm text-[#131b2e] text-center w-full truncate">Farhan Maulana</h4>
                  <p className="text-xs text-[#64748B] text-center">NIM 2201948</p>
                  <div className="flex items-center gap-1 text-[#EA580C] bg-[#FFF7ED] px-2 py-0.5 rounded-full text-[10px] font-bold mt-1">
                    <MI name="local_fire_department" fill className="text-[12px]" />
                    <span>24 Hari</span>
                  </div>
                  <div className="w-full bg-amber-50 border-t-4 border-amber-400 rounded-t-lg mt-3 py-5 px-2 text-center flex flex-col items-center justify-center shadow-sm">
                    <MI name="military_tech" fill className="text-amber-500 text-3xl" />
                    <span className="font-extrabold text-amber-900 text-sm">3,420 XP</span>
                    <span className="text-[10px] font-bold text-amber-700">Gold Champion</span>
                  </div>
                </div>

                {/* 3rd Place (You) */}
                <div className="flex flex-col items-center flex-1 max-w-[150px]">
                  <div className="relative mb-2">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-amber-700/60 bg-[#006948] flex items-center justify-center text-white font-bold text-xl shadow-sm ring-2 ring-[#006948]">
                      RP
                    </div>
                    <div className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-amber-700 border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-sm">3</div>
                  </div>
                  <div className="flex items-center gap-1 justify-center w-full">
                    <h4 className="font-bold text-sm text-[#131b2e] text-center truncate">Rian Pratama</h4>
                  </div>
                  <div className="bg-[#006948] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm mt-0.5">YOU</div>
                  <div className="flex items-center gap-1 text-[#EA580C] bg-[#FFF7ED] px-2 py-0.5 rounded-full text-[10px] font-bold mt-1.5">
                    <MI name="local_fire_department" fill className="text-[12px]" />
                    <span>12 Hari</span>
                  </div>
                  <div className="w-full bg-orange-50 border-t-4 border-amber-700/60 rounded-t-lg mt-3 py-2 px-2 text-center flex flex-col items-center justify-center">
                    <MI name="workspace_premium" className="text-amber-700 text-2xl" />
                    <span className="font-bold text-[#131b2e] text-xs">2,890 XP</span>
                    <span className="text-[10px] text-amber-900">Bronze Medal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E2E8F0]">
                <div>
                  <h3 className="font-bold text-base text-[#131b2e]">Daftar Peringkat Teman Sekelas</h3>
                  <p className="text-xs text-[#64748B]">Total 32 Mahasiswa terdaftar di ENGL-302</p>
                </div>
                <span className="text-xs text-[#64748B]">Posisi Anda: <strong className="text-[#006948] font-bold">#3</strong></span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] text-[#64748B] text-[10px] font-bold uppercase tracking-wider">
                      <th className="py-2 px-3 text-center">Rank</th>
                      <th className="py-2 px-3">Mahasiswa</th>
                      <th className="py-2 px-3 text-center">Modul</th>
                      <th className="py-2 px-3 text-center">Streak</th>
                      <th className="py-2 px-3 text-right">Total XP</th>
                      <th className="py-2 px-3 text-center">Tugas ENGL-302</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-xs">
                    {LEADERBOARD_DATA.map(user => (
                      <tr key={user.rank} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-2.5 px-3 text-center font-bold text-[#131b2e]">#{user.rank}</td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full border border-[#E2E8F0] bg-[#f2f3ff] text-[#4b41e1] font-bold flex items-center justify-center text-[10px]">
                              {user.name.split(' ').map(w=>w[0]).join('')}
                            </div>
                            <div>
                              <p className="font-bold text-[#131b2e] leading-tight">{user.name}</p>
                              <p className="text-[10px] text-[#64748B]">NIM {user.nim}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center font-medium text-[#131b2e]">{user.module}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-flex items-center gap-0.5 text-[#EA580C] bg-[#FFF7ED] px-2 py-0.5 rounded-full text-[10px] font-bold">
                            <MI name="local_fire_department" fill className="text-[12px]" /> {user.streak}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#006948]">{user.xp} XP</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${user.statusBg} ${user.statusText}`}>
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr className="hover:bg-[#F8FAFC] transition-colors bg-[#f2f3ff]/30">
                      <td className="py-3 px-3 text-center font-bold text-[#64748B]">#10-15</td>
                      <td className="py-3 px-3 text-[#64748B]" colSpan="3">Rizky, Tiara, Gilang, Amanda, Fajar, Nadya (1,400 - 1,890 XP)</td>
                      <td className="py-3 px-3 text-right text-[#64748B] font-bold">1,620 XP avg</td>
                      <td className="py-3 px-3 text-center"><button className="text-[10px] font-bold text-[#4b41e1] hover:underline" onClick={() => {}}>Lihat Semua (32)</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 p-3 bg-[#ECFDF5] rounded-lg border border-[#006948]/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MI name="verified" fill className="text-[#006948]" />
                  <span className="text-xs text-[#131b2e]">Kamu hanya butuh <strong className="font-bold">290 XP</strong> lagi untuk menyalip Nabila Putri di posisi #2!</span>
                </div>
                <button className="bg-[#006948] text-white font-bold text-[11px] px-3 py-1.5 rounded-lg border-b-[2px] border-[#005137] active:translate-y-px" onClick={() => navigate('/dashboard/modules')}>
                  Kejar Sekarang
                </button>
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN: CEFR Analytics & Recap */}
          <section className="lg:col-span-5 space-y-6">
            
            {/* CEFR Analytics Card */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                <div className="flex items-center gap-2">
                  <MI name="radar" fill className="text-[#4b41e1]" />
                  <h3 className="font-bold text-base text-[#131b2e]">Analisis Kemahiran CEFR</h3>
                </div>
                <div className="px-2.5 py-1 bg-[#EEF2FF] text-[#4b41e1] font-bold text-[10px] rounded-full border border-[#4b41e1]/20">
                  Target Semester: B2
                </div>
              </div>

              <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#64748B]">Status Estimasi CEFR Anda:</p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-extrabold text-[#006948]">B1+</span>
                    <span className="text-[10px] font-semibold text-[#64748B]">Independent User (Skor: 74/100)</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#ECFDF5] text-[#006948] border-2 border-[#006948] flex items-center justify-center font-bold text-base">
                  74%
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-[#131b2e] flex items-center gap-1.5"><MI name="spellcheck" className="text-[#006948] text-sm" /> Grammar & Structure</span>
                    <span className="text-[10px] font-bold text-[#006948] bg-[#ECFDF5] px-2 py-0.5 rounded">B2 • 85%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#10B981] to-[#006948] rounded-full" style={{ width: '85%' }} /></div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-[#131b2e] flex items-center gap-1.5"><MI name="auto_stories" className="text-[#006948] text-sm" /> Academic Reading</span>
                    <span className="text-[10px] font-bold text-[#006948] bg-[#ECFDF5] px-2 py-0.5 rounded">B2 • 82%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#10B981] to-[#006948] rounded-full" style={{ width: '82%' }} /></div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-[#131b2e] flex items-center gap-1.5"><MI name="headphones" className="text-[#4b41e1] text-sm" /> Listening Comprehension</span>
                    <span className="text-[10px] font-bold text-[#4b41e1] bg-[#EEF2FF] px-2 py-0.5 rounded">B1+ • 76%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-[#4b41e1] rounded-full" style={{ width: '76%' }} /></div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-[#131b2e] flex items-center gap-1.5"><MI name="edit_note" className="text-[#8d4b00] text-sm" /> Academic Writing</span>
                    <span className="text-[10px] font-bold text-[#8d4b00] bg-[#FFFBEB] px-2 py-0.5 rounded">B1 • 64%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-amber-500 rounded-full" style={{ width: '64%' }} /></div>
                  <p className="text-[9px] text-[#64748B] mt-0.5 pl-6">1 tugas dosen dinilai (Perlu penguatan transisi paragraf)</p>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-[#131b2e] flex items-center gap-1.5"><MI name="mic" className="text-[#E11D48] text-sm" /> Spoken Production & Fluency</span>
                    <span className="text-[10px] font-bold text-[#E11D48] bg-[#FFF1F2] px-2 py-0.5 rounded">B1- • 58%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-[#E11D48] rounded-full" style={{ width: '58%' }} /></div>
                  <p className="text-[9px] text-[#E11D48] font-bold mt-0.5 pl-6 flex items-center gap-1"><MI name="info" className="text-[10px]" /> Butuh latihan modul speaking minggu ini</p>
                </div>
              </div>
            </div>

            {/* Rekap Nilai Tugas */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                <div className="flex items-center gap-2">
                  <MI name="assignment_turned_in" className="text-[#006948]" />
                  <h3 className="font-bold text-base text-[#131b2e]">Rekap Nilai Tugas Dosen</h3>
                </div>
                <span className="text-[10px] font-bold text-[#64748B]">Pengampu: Dr. Aris Subagyo</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-[#E2E8F0] hover:border-[#006948]/40 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#131b2e]">Assignment 1 (Essay)</span>
                        <span className="px-2 py-0.5 rounded bg-[#ECFDF5] text-[#006948] font-bold text-[10px]">88 / 100</span>
                      </div>
                      <p className="text-[10px] text-[#64748B] mt-0.5">Dinilai oleh Dr. Aris • "Analisis solid, sitasi akurat."</p>
                    </div>
                    <button className="text-[#4b41e1] hover:text-[#131b2e] p-1 text-[10px] font-bold flex items-center gap-0.5">
                      <span>Rubrik</span> <MI name="open_in_new" className="text-xs" />
                    </button>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg border border-[#E2E8F0] hover:border-[#006948]/40 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#131b2e]">Assignment 2 (Speaking)</span>
                        <span className="px-2 py-0.5 rounded bg-[#FFFBEB] text-[#8d4b00] font-bold text-[10px]">78 / 100</span>
                      </div>
                      <p className="text-[10px] text-[#64748B] mt-0.5">Feedback audio terlampir • Pelafalan butuh konsistensi.</p>
                    </div>
                    <button className="text-[#4b41e1] hover:text-[#131b2e] p-1 text-[10px] font-bold flex items-center gap-0.5">
                      <MI name="play_circle" className="text-xs" /> <span>Dengar</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-[#E2E8F0] bg-[#EEF2FF]/40 hover:border-[#4b41e1]/40 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#131b2e]">Midterm TOEFL Simulation</span>
                        <span className="px-2 py-0.5 rounded bg-[#e2dfff] text-[#0f0069] font-bold text-[10px]">520 Pts</span>
                      </div>
                      <p className="text-[10px] text-[#64748B] mt-0.5">Equivalent CEFR: B1 • Structure tertinggi (58/68).</p>
                    </div>
                    <button className="text-[#4b41e1] hover:text-[#131b2e] p-1 text-[10px] font-bold flex items-center gap-0.5">
                      <span>Detail</span> <MI name="chevron_right" className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
                <div className="flex items-center gap-2">
                  <MI name="stars" fill className="text-amber-500" />
                  <h3 className="font-bold text-base text-[#131b2e]">Lencana & Prestasi</h3>
                </div>
                <span className="text-[10px] text-[#64748B] font-bold">4/12 Terbuka</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <div className="flex flex-col items-center p-2.5 rounded-lg bg-[#ECFDF5] border border-[#006948]/20 text-center">
                  <div className="w-10 h-10 rounded-full bg-[#006948] text-white flex items-center justify-center mb-1 shadow-sm"><MI name="spellcheck" /></div>
                  <span className="text-[10px] font-bold text-[#131b2e]">Grammar Master</span>
                </div>
                <div className="flex flex-col items-center p-2.5 rounded-lg bg-[#FFF7ED] border border-orange-200 text-center">
                  <div className="w-10 h-10 rounded-full bg-[#EA580C] text-white flex items-center justify-center mb-1 shadow-sm"><MI name="local_fire_department" fill /></div>
                  <span className="text-[10px] font-bold text-[#131b2e]">10-Day Streak</span>
                </div>
                <div className="flex flex-col items-center p-2.5 rounded-lg bg-[#EEF2FF] border border-[#4b41e1]/20 text-center">
                  <div className="w-10 h-10 rounded-full bg-[#4b41e1] text-white flex items-center justify-center mb-1 shadow-sm"><MI name="school" /></div>
                  <span className="text-[10px] font-bold text-[#131b2e]">Academic Scholar</span>
                </div>
                <div className="flex flex-col items-center p-2.5 rounded-lg bg-[#FFFBEB] border border-amber-200 text-center opacity-60 grayscale">
                  <div className="w-10 h-10 rounded-full bg-slate-300 text-white flex items-center justify-center mb-1"><MI name="lock" /></div>
                  <span className="text-[10px] font-bold text-[#64748B]">B2 Certified</span>
                </div>
              </div>
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}
