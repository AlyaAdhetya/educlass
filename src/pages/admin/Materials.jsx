import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';

export default function AdminMaterials() {
  const { materials } = useDataStore();

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Kelola Materi</h1>
          <p className="text-slate-500 mt-2">Tambah, edit, dan kelola materi pembelajaran untuk mahasiswa.</p>
        </div>
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Tambah Materi
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Daftar Materi Pembelajaran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {materials.map(m => (
              <div key={m.id} className="flex justify-between items-center p-4 border border-slate-100 rounded-xl bg-white shadow-sm hover:border-blue-200 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">{m.category}</span>
                    <span className="text-xs font-bold text-slate-500">Level {m.level}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      m.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      m.status === 'active' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>{m.status}</span>
                  </div>
                  <h3 className="font-bold text-slate-800">{m.title}</h3>
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
