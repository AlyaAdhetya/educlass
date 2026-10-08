import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus, Edit, Trash2, CheckCircle2, AlertCircle, Search, Activity, ClipboardList } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';

export default function AdminQuizzes() {
  const { materials, activityLog } = useDataStore();
  const [activeTab, setActiveTab] = useState('monitoring'); // 'monitoring' | 'bank'
  const [searchStudent, setSearchStudent] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Extract quiz submissions from activityLog
  const quizSubmissions = activityLog
    .filter(a => a.type === 'quiz')
    .map(log => ({
      id: log.id,
      name: log.studentName,
      quiz: log.detail,
      score: log.score,
      status: log.score >= 60 ? 'Lulus' : 'Remedial',
      date: new Date(log.date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
    }));

  const filteredMonitoring = quizSubmissions.filter((sub) => {
    const matchName = sub.name.toLowerCase().includes(searchStudent.toLowerCase());
    const matchStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchName && matchStatus;
  });

  const passedCount = quizSubmissions.filter(s => s.status === 'Lulus').length;
  const totalCount = quizSubmissions.length;
  const passRate = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;
  const avgScore = totalCount > 0 ? Math.round(quizSubmissions.reduce((acc, curr) => acc + curr.score, 0) / totalCount) : 0;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Quiz Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor student quiz attempts and manage module quiz configurations.
          </p>
        </div>

        {/* Tab switch */}
        <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('monitoring')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'monitoring'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 inline-block mr-1.5" /> Monitoring
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bank')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'bank'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-4 h-4 inline-block mr-1.5" /> Quiz Configurations
          </button>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Attempts</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{totalCount}</h3>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Average Score</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">{avgScore} / 100</h3>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pass Rate</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">{passRate}%</h3>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Needs Attention</span>
          <h3 className="text-2xl font-black text-rose-600 mt-1">{totalCount - passedCount}</h3>
        </div>
      </div>

      {/* TAB 1: MONITORING */}
      {activeTab === 'monitoring' && (
        <Card className="rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-white p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-black text-slate-900">
                  Quiz Attempts Log
                </CardTitle>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search name..."
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="Lulus">Passed</option>
                  <option value="Remedial">Failed</option>
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-100 uppercase tracking-wider font-extrabold text-[10px]">
                    <th className="py-3 px-6">Student Name</th>
                    <th className="py-3 px-6">Quiz Module</th>
                    <th className="py-3 px-6">Score</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6">Date Completed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMonitoring.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-6 font-bold text-slate-900">{sub.name}</td>
                      <td className="py-3.5 px-6 text-slate-700">{sub.quiz}</td>
                      <td className="py-3.5 px-6 font-black font-mono text-sm text-indigo-700">
                        {sub.score}
                      </td>
                      <td className="py-3.5 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] inline-flex items-center gap-1 ${
                            sub.status === 'Lulus'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {sub.status === 'Lulus' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          {sub.status === 'Lulus' ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-slate-500 font-medium">{sub.date}</td>
                    </tr>
                  ))}
                  {filteredMonitoring.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 text-sm font-medium">
                        No quiz attempts found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: CONFIGURATION */}
      {activeTab === 'bank' && (
        <Card className="rounded-3xl border border-slate-100 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-slate-100">
            <div>
              <CardTitle className="text-base font-black text-slate-900">
                Module Quizzes
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {materials.map((m) => (
                <div
                  key={m.id}
                  className="p-5 border border-slate-200 rounded-2xl bg-white shadow-xs hover:border-indigo-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-black rounded uppercase">
                        {m.unit}
                      </span>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                        {m.xp_reward} XP
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Passing: {m.min_score || 60}%</span>
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900">{m.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {m.quiz?.length || 0} Multiple choice questions • {m.questSteps?.length || 0} Interactive quests
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl text-xs font-bold">
                      <Edit className="w-3.5 h-3.5 mr-1.5" /> Edit Settings
                    </Button>
                    <Button className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white">
                      <ClipboardList className="w-3.5 h-3.5 mr-1.5" /> Manage Questions
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
