import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus, Edit, Trash2, CheckCircle2, AlertCircle, Search } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';

const mockQuizSubmissions = [
  { id: 1, nim: '2401082', name: 'Nabila Putri', quiz: 'Unit 3: Academic Reading & Passive Voice', score: 95, attempt: 1, status: 'Lulus', date: 'Hari ini, 10:15 WIB' },
  { id: 2, nim: '2401001', name: 'Budi Santoso', quiz: 'Unit 3: Academic Reading & Passive Voice', score: 85, attempt: 1, status: 'Lulus', date: 'Hari ini, 09:30 WIB' },
  { id: 3, nim: '2401002', name: 'Siti Aminah', quiz: 'Unit 3: Academic Reading & Passive Voice', score: 100, attempt: 1, status: 'Lulus', date: 'Kemarin, 16:40 WIB' },
  { id: 4, nim: '2401003', name: 'Raka Pratama', quiz: 'Unit 2: Past Perfect vs Past Simple', score: 80, attempt: 2, status: 'Lulus', date: 'Kemarin, 14:20 WIB' },
  { id: 5, nim: '2401034', name: 'Farhan Maulana', quiz: 'Unit 2: Past Perfect vs Past Simple', score: 55, attempt: 2, status: 'Remedial', date: 'Kemarin, 11:10 WIB' },
  { id: 6, nim: '2401015', name: 'Dimas Aditya', quiz: 'Unit 1: Academic Vocabulary Mastery', score: 90, attempt: 1, status: 'Lulus', date: '2 hari lalu' },
  { id: 7, nim: '2401022', name: 'Anisa Rahmawati', quiz: 'Unit 3: Academic Reading & Passive Voice', score: 90, attempt: 1, status: 'Lulus', date: '2 hari lalu' },
];

export default function AdminQuizzes() {
  const { materials } = useDataStore();
  const [activeTab, setActiveTab] = useState('monitoring'); // 'monitoring' | 'bank'
  const [searchStudent, setSearchStudent] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredMonitoring = mockQuizSubmissions.filter((sub) => {
    const matchName = sub.name.toLowerCase().includes(searchStudent.toLowerCase()) || sub.nim.includes(searchStudent);
    const matchStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchName && matchStatus;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-black rounded-full uppercase">
              Admin Quiz Center
            </span>
            <span className="text-xs text-slate-400">• Monitoring Kuis & Bank Soal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Monitoring Kuis & Evaluasi Belajar
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pantau hasil pengerjaan kuis mahasiswa secara real-time dan kelola bank soal di seluruh modul.
          </p>
        </div>

        {/* Tab switch */}
        <div className="inline-flex p-1 bg-slate-200/70 rounded-2xl border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('monitoring')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'monitoring'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📊 Monitoring Nilai Kuis
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bank')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'bank'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📚 Bank Soal Kuis
          </button>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block">Total Kuis Dikerjakan</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">142 Kali</h3>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">↑ +28 pengerjaan pekan ini</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block">Rata-rata Skor Kuis</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">86.2 / 100</h3>
          <p className="text-[11px] text-indigo-600 font-bold mt-1">Standar kelulusan ≥60</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block">Tingkat Kelulusan Kuis</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">91.4%</h3>
          <p className="text-[11px] text-slate-500 font-medium mt-1">130 dari 142 lulus kuis</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 block">Kuis Perlu Perhatian</span>
          <h3 className="text-2xl font-black text-rose-600 mt-1">Unit 2 Grammar</h3>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Tingkat remedial: 12%</p>
        </div>
      </div>

      {/* TAB 1: MONITORING HASIL KUIS MAHASISWA */}
      {activeTab === 'monitoring' && (
        <Card className="rounded-3xl border border-indigo-100 shadow-xs overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-white p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-black text-slate-900">
                  Daftar Pengerjaan Kuis Mahasiswa
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Laporan otomatis nilai kuis dari modul dan simulasi tes
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari NIM atau nama..."
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700"
                >
                  <option value="all">Semua Status</option>
                  <option value="Lulus">Lulus</option>
                  <option value="Remedial">Remedial</option>
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-100 uppercase tracking-wider font-extrabold text-[10px]">
                    <th className="py-3 px-6">NIM</th>
                    <th className="py-3 px-6">Nama Mahasiswa</th>
                    <th className="py-3 px-6">Modul Kuis</th>
                    <th className="py-3 px-6">Skor Pengerjaan</th>
                    <th className="py-3 px-6">Percobaan</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6">Waktu Selesai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMonitoring.map((sub) => (
                    <tr key={sub.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="py-3.5 px-6 font-mono font-bold text-slate-700">{sub.nim}</td>
                      <td className="py-3.5 px-6 font-extrabold text-slate-900">{sub.name}</td>
                      <td className="py-3.5 px-6 text-slate-700 font-semibold">{sub.quiz}</td>
                      <td className="py-3.5 px-6 font-black font-mono text-sm text-indigo-700">
                        {sub.score} / 100
                      </td>
                      <td className="py-3.5 px-6 text-slate-500 font-bold">Attempt #{sub.attempt}</td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] inline-flex items-center gap-1 ${
                            sub.status === 'Lulus'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {sub.status === 'Lulus' ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                          )}
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-slate-400 font-medium">{sub.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: BANK SOAL KUIS */}
      {activeTab === 'bank' && (
        <Card className="rounded-3xl border border-indigo-100 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-slate-100">
            <div>
              <CardTitle className="text-base font-black text-slate-900">
                Bank Soal Kuis per Unit Modul
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola butir soal pilihan ganda, kunci jawaban, dan pembahasan
              </p>
            </div>
            <Button className="flex items-center gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
              <Plus className="w-4 h-4" /> Tambah Soal Kuis
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {materials.map((m) => (
                <div
                  key={m.id}
                  className="p-4 border border-slate-200 rounded-2xl bg-white shadow-xs hover:border-indigo-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded">
                        {m.unit}
                      </span>
                      <span className="text-xs font-bold text-amber-600">
                        +{m.xp_reward} XP (Passing: {m.min_score || 60}%)
                      </span>
                      <span className="text-xs text-slate-400">• Kategori: {m.category}</span>
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-900">{m.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Jumlah Soal: {m.quiz?.length || 3} butir pilihan ganda interaktif.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1">
                      <Edit className="w-3.5 h-3.5 text-slate-600" /> Edit Soal
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-xl hover:bg-red-50 hover:text-red-600">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
