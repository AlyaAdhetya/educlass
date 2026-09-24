import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Download, FileSpreadsheet } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';

export default function AdminReports() {
  const { students } = useDataStore();
  
  const handleExport = () => {
    // Mock export to excel
    alert('Laporan sedang digenerate ke dalam format Excel (.xlsx).');
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Laporan Global</h1>
          <p className="text-slate-500 mt-2">Lihat laporan seluruh mahasiswa, ekspor ke Excel, dan bagikan.</p>
        </div>
        <Button onClick={handleExport} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700">
          <FileSpreadsheet className="w-4 h-4" /> Export ke Excel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Laporan Seluruh Mahasiswa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Mahasiswa</th>
                  <th className="px-4 py-3">NIM</th>
                  <th className="px-4 py-3">Level</th>
                  <th className="px-4 py-3">XP Terkumpul</th>
                  <th className="px-4 py-3">Rata-rata Skor</th>
                  <th className="px-4 py-3">Streak</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 font-bold text-slate-800">{s.name}</td>
                    <td className="px-4 py-4 text-slate-500">{s.nim}</td>
                    <td className="px-4 py-4"><span className="px-2 py-1 bg-purple-50 text-purple-700 font-semibold rounded text-xs">{s.level} ({s.levelName})</span></td>
                    <td className="px-4 py-4 font-semibold text-amber-600">{s.xp}</td>
                    <td className="px-4 py-4 font-semibold text-emerald-600">{s.avg_score}</td>
                    <td className="px-4 py-4 font-semibold text-orange-500">{s.streak} 🔥</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
