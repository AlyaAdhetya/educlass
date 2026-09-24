import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Users, BookOpen, Activity, ClipboardList, Zap, ShieldCheck, FileBarChart2 } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { students, materials, quizzes } = useDataStore();

  const totalXP = students.reduce((acc, s) => acc + s.xp, 0);
  const avgScore = students.length
    ? Math.round(students.reduce((acc, s) => acc + s.avg_score, 0) / students.length)
    : 0;

  const statCards = [
    { label: 'Total Mahasiswa', value: students.length, icon: <Users className="h-5 w-5 text-blue-600" />, bg: 'bg-blue-50', border: 'border-blue-100', link: '/admin/users' },
    { label: 'Modul Materi', value: materials.length, icon: <BookOpen className="h-5 w-5 text-emerald-600" />, bg: 'bg-emerald-50', border: 'border-emerald-100', link: '/admin/materials' },
    { label: 'Kuis Tersedia', value: quizzes.length, icon: <ClipboardList className="h-5 w-5 text-purple-600" />, bg: 'bg-purple-50', border: 'border-purple-100', link: '/admin/quizzes' },
    { label: 'Rata-rata Skor', value: `${avgScore}`, icon: <Activity className="h-5 w-5 text-amber-600" />, bg: 'bg-amber-50', border: 'border-amber-100', link: '/admin/reports' },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Admin</h1>
        <p className="text-slate-500 mt-2">Kelola seluruh sistem EduClass — materi, kuis, mahasiswa, dan laporan.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <Link key={i} to={s.link}>
            <div className={`bg-white p-5 rounded-2xl border ${s.border} shadow-sm hover:shadow-md transition-all cursor-pointer group`}>
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
                {s.icon}
              </div>
              <p className="text-2xl font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">{s.value}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Student Table */}
        <div className="md:col-span-2">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Data Mahasiswa</CardTitle>
                <CardDescription>Progress belajar seluruh mahasiswa terdaftar.</CardDescription>
              </div>
              <Link to="/admin/reports">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <FileBarChart2 className="w-4 h-4" /> Laporan
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase border-b">
                    <tr>
                      <th className="px-4 py-3">Mahasiswa</th>
                      <th className="px-4 py-3">Level</th>
                      <th className="px-4 py-3">XP</th>
                      <th className="px-4 py-3">Avg Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-800">{s.name}</p>
                          <p className="text-xs text-slate-500">{s.nim}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg">{s.levelName}</span>
                        </td>
                        <td className="px-4 py-3 font-bold text-amber-600">{s.xp}</td>
                        <td className="px-4 py-3 font-bold text-emerald-600">{s.avg_score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-slate-600" /> Aksi Cepat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/materials">
                <Button variant="outline" className="w-full justify-start gap-2 mb-2 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200">
                  <BookOpen className="w-4 h-4" /> Tambah Materi Baru
                </Button>
              </Link>
              <Link to="/admin/quizzes">
                <Button variant="outline" className="w-full justify-start gap-2 mb-2 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200">
                  <ClipboardList className="w-4 h-4" /> Buat Kuis Baru
                </Button>
              </Link>
              <Link to="/admin/users">
                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200">
                  <Users className="w-4 h-4" /> Tambah Pengguna
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" /> Ringkasan XP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-extrabold text-slate-900">{totalXP.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-1">Total XP dikumpulkan seluruh mahasiswa</p>
              <div className="mt-4 space-y-2">
                {students.sort((a, b) => b.xp - a.xp).slice(0, 3).map((s, i) => (
                  <div key={s.id} className="flex justify-between items-center text-sm">
                    <span className="text-slate-700 font-medium">#{i + 1} {s.name}</span>
                    <span className="font-bold text-amber-600">{s.xp} XP</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
