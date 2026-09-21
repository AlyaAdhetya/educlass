import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Upload, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockMaterials = [
  { id: 1, title: 'Unit 1: Kosakata Dasar', type: 'PDF' },
  { id: 2, title: 'Unit 2: Simple Present Tense', type: 'Video' },
];

export default function Materials() {
  const navigate = useNavigate();
  const [newMaterial, setNewMaterial] = useState('');

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kelola Materi & Modul</h1>
          <p className="text-muted-foreground mt-2">Materi yang diupload di sini akan muncul di halaman "Modul Belajar" Mahasiswa.</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dosen/classes')}>
          Kembali ke Kelas
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Upload Materi Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor="title">Judul Materi / Modul</Label>
                <Input 
                  id="title" 
                  placeholder="Contoh: Unit 3: Grammar" 
                  value={newMaterial}
                  onChange={e => setNewMaterial(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">File Materi (PDF/Video)</Label>
                <Input id="file" type="file" />
              </div>
              <Button type="submit" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Upload ke Kelas
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Daftar Materi Kelas Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockMaterials.map(m => (
                <div key={m.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-3 text-primary" />
                    <div>
                      <h3 className="font-semibold">{m.title}</h3>
                      <p className="text-xs text-muted-foreground">Tipe: {m.type}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm" className="text-destructive">Hapus</Button>
                  </div>
                </div>
              ))}
              {mockMaterials.length === 0 && (
                <div className="text-center p-8 text-muted-foreground border-dashed border-2 rounded-md">
                  Belum ada materi. Upload materi pertama Anda.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
