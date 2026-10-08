import React, { useState } from 'react';
import { useDataStore } from '../../store/dataStore';
import { FileSpreadsheet, Download, Filter, Search, TrendingUp, Users, Award, BookOpen } from 'lucide-react';

export default function AdminReports() {
  const { students } = useDataStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  const mahasiswaList = students.filter(s => s.role === 'mahasiswa');

  const filteredStudents = mahasiswaList.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.nim && s.nim.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleExport = () => {
    alert('Generating report to Excel (.xlsx)...');
  };

  // Metrics
  const totalStudents = mahasiswaList.length;
  const avgXp = totalStudents > 0 ? Math.round(mahasiswaList.reduce((acc, curr) => acc + (curr.xp || 0), 0) / totalStudents) : 0;
  const avgScore = totalStudents > 0 ? Math.round(mahasiswaList.reduce((acc, curr) => acc + (curr.avgScore || 0), 0) / totalStudents) : 0;
  const activeStreak = mahasiswaList.filter(s => s.streak > 0).length;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Global Reports</h1>
          <p className="text-slate-500 text-sm mt-1">View overall student performance, export data, and track metrics.</p>
        </div>
        
        <button onClick={handleExport} className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-xs">
          <FileSpreadsheet className="w-4 h-4" /> Export to Excel
        </button>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <Users className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">Total Students</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900">{totalStudents}</h3>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <Award className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">Average XP</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900">{avgXp.toLocaleString()}</h3>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <BookOpen className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">Avg Quiz Score</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900">{avgScore}%</h3>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs">
          <div className="flex items-center gap-2 text-orange-500 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider">Active Streaks</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900">{activeStreak}</h3>
        </div>
      </div>

      {/* REPORT TABLE */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
          <h2 className="text-base font-black text-slate-900 self-center">Student Performance Data</h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text"
              placeholder="Search by name or NIM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 uppercase tracking-wider font-bold text-[10px] border-b border-slate-100">
                <th className="py-4 px-6">Student</th>
                <th className="py-4 px-6">NIM</th>
                <th className="py-4 px-6">Level</th>
                <th className="py-4 px-6">XP Earned</th>
                <th className="py-4 px-6">Avg Score</th>
                <th className="py-4 px-6 text-right">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-800">{s.name}</td>
                  <td className="py-4 px-6 font-mono text-xs text-slate-500">{s.nim || '-'}</td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg text-[10px]">
                      Lv.{s.level || 0} {s.levelName}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-black text-amber-600">{(s.xp || 0).toLocaleString()}</td>
                  <td className="py-4 px-6 font-black text-emerald-600">{s.avgScore || 0}%</td>
                  <td className="py-4 px-6 font-black text-orange-500 text-right">{s.streak || 0} 🔥</td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 text-slate-300" />
                      <p className="text-sm font-bold">No students found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
