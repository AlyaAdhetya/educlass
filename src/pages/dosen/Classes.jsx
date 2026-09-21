import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const mockClasses = [
  { id: 1, name: 'Bahasa Inggris A - Kelas 3B', students: 40, activeTasks: 2 },
  { id: 2, name: 'Bahasa Inggris C - Kelas 3C', students: 35, activeTasks: 1 },
];

export default function Classes() {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Kelas</h1>
          <p className="text-muted-foreground mt-2">Kelola daftar kelas dan mahasiswa yang Anda ampu.</p>
        </div>
        <Button onClick={() => navigate('/dosen/classes/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Buat Kelas Baru
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {mockClasses.map((cls) => (
          <Card key={cls.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">{cls.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 my-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  {cls.students} Mahasiswa
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="font-semibold text-primary mr-1">{cls.activeTasks}</span> Tugas Aktif
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-6">
                <Button variant="default" className="w-full" onClick={() => navigate(`/dosen/classes/${cls.id}/materials`)}>
                  Kelola Materi & Modul
                </Button>
                <div className="flex gap-2 w-full">
                  <Button variant="outline" className="flex-1" onClick={() => navigate(`/dosen/classes/${cls.id}/students`)}>Mahasiswa</Button>
                  <Button variant="outline" className="flex-1" onClick={() => navigate(`/dosen/classes/${cls.id}/tasks`)}>Tugas</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
