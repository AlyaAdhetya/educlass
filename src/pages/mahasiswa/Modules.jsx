import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../store/dataStore';
import { BookOpen, CheckCircle, Lock, PlayCircle } from 'lucide-react';

export default function Modules() {
  const navigate = useNavigate();
  const { materials, userStats } = useDataStore();

  const categories = [...new Set(materials.map(m => m.category))];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Materi Pembelajaran</h1>
          <p className="text-slate-500 mt-2">Pilih materi sesuai levelmu dan kumpulkan XP dengan menyelesaikannya.</p>
        </div>

        {categories.map(category => (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-200 pb-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              {category}
            </h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {materials.filter(m => m.category === category).map(material => (
                <div 
                  key={material.id} 
                  className={`relative p-4 rounded-xl border flex flex-col justify-between ${
                    material.status === 'locked' 
                      ? 'bg-slate-100 border-slate-200 opacity-70' 
                      : material.status === 'completed'
                      ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                      : 'bg-white border-blue-200 shadow-md hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer'
                  }`}
                  onClick={() => {
                    if (material.status !== 'locked') {
                      navigate(`/dashboard/modules/${material.id}`);
                    }
                  }}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Level {material.level}
                      </span>
                      {material.status === 'completed' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                      {material.status === 'locked' && <Lock className="w-4 h-4 text-slate-400" />}
                      {material.status === 'active' && <PlayCircle className="w-4 h-4 text-blue-500" />}
                    </div>
                    <h3 className={`font-bold text-base mb-1 leading-tight ${material.status === 'locked' ? 'text-slate-600' : 'text-slate-900'}`}>
                      {material.title}
                    </h3>
                  </div>
                  
                  {material.status !== 'locked' && (
                    <button 
                      className={`w-full py-1.5 mt-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors ${
                        material.status === 'completed' 
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      {material.status === 'completed' ? 'Ulangi' : 'Belajar'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
