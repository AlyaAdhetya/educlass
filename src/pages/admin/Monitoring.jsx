import React, { useState } from 'react';
import { useDataStore } from '../../store/dataStore';
import { Activity, Search, Filter, Clock, ChevronRight } from 'lucide-react';

const activityMeta = {
  quiz:        { label: 'Quiz',        color: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500' },
  module:      { label: 'Module',      color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  arena:       { label: 'Quiz Arena',  color: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
  achievement: { label: 'Achievement', color: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500' },
  level:       { label: 'Level Up',    color: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500' },
};

function RelativeTime({ dateStr }) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 60000);
  if (diff < 1) return <span>Just now</span>;
  if (diff < 60) return <span>{diff}m ago</span>;
  const hours = Math.floor(diff / 60);
  if (hours < 24) return <span>{hours}h ago</span>;
  return <span>{Math.floor(hours / 24)}d ago</span>;
}

export default function AdminMonitoring() {
  const { activityLog } = useDataStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredLogs = activityLog.filter(log => {
    const matchesSearch = log.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.detail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || log.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Live Monitoring</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time feed of student activities, module completions, and quiz attempts.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-4 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Activities</option>
            <option value="quiz">Quiz</option>
            <option value="module">Module</option>
            <option value="arena">Quiz Arena</option>
            <option value="achievement">Achievements</option>
            <option value="level">Level Ups</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input 
            type="text"
            placeholder="Search student or activity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredLogs.map(log => {
            const meta = activityMeta[log.type] || activityMeta.quiz;
            return (
              <div key={log.id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black shrink-0 border-2 border-white shadow-sm ${meta.color}`}>
                  {log.studentName.slice(0, 2).toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-sm">
                      <strong className="text-slate-900">{log.studentName}</strong>
                      <span className="text-slate-500"> {log.activity.toLowerCase()} </span>
                      <strong className="text-slate-800">{log.detail}</strong>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${meta.color}`}>
                        {meta.label}
                      </span>
                      {log.score !== null && (
                        <span className="text-[10px] font-bold text-slate-500 border-l border-slate-200 pl-2">
                          Score: <span className={log.score >= 60 ? 'text-emerald-600' : 'text-rose-600'}>{log.score}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-right shrink-0">
                    {log.xpEarned > 0 && (
                      <span className="text-xs font-black text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                        +{log.xpEarned} XP
                      </span>
                    )}
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 min-w-[80px] justify-end">
                      <Clock className="w-3 h-3" /> <RelativeTime dateStr={log.date} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredLogs.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              <Activity className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold">No activities found</p>
              <p className="text-xs">Try adjusting your search filters.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
