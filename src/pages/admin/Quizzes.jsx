import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';

export default function AdminQuizzes() {
  const { quizzes } = useDataStore();
  
  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manajemen Global Kuis</h1>
          <p className="text-slate-500 mt-2">Kelola bank soal Quiz Center dan Challenge untuk seluruh sistem.</p>
        </div>
        <Button className="flex items-center gap-2"><Plus className="w-4 h-4" /> Buat Tantangan Baru</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bank Soal Kuis (Quiz Center)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quizzes.map(q => (
              <div key={q.id} className="flex justify-between items-center p-4 border rounded-xl bg-white shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded">{q.type}</span>
                    <span className="text-xs font-bold text-orange-500">+{q.xp_reward} XP (Min Score: {q.min_score})</span>
                  </div>
                  <h3 className="font-bold text-slate-800">{q.title}</h3>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon"><Edit className="w-4 h-4 text-slate-600" /></Button>
                  <Button variant="outline" size="icon" className="hover:bg-red-50 hover:text-red-600"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
