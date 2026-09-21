import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useNavigate } from 'react-router-dom';

export default function CreateClass() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    level: 'Beginner',
    studentCount: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Save to DB
    console.log("Simpan Kelas:", formData);
    navigate('/dosen/classes');
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Buat Kelas Baru</h1>
        <p className="text-muted-foreground mt-2">Masukkan informasi detail untuk kelas bahasa Inggris baru.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Kelas</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Kelas / Mata Kuliah</Label>
              <Input 
                id="name" 
                placeholder="Contoh: Bahasa Inggris A - Kelas 3B" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="level">Tingkat Kesulitan (Level)</Label>
              <select 
                id="level"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: e.target.value})}
              >
                <option value="Beginner">Beginner (A1)</option>
                <option value="Elementary">Elementary (A2)</option>
                <option value="Intermediate">Intermediate (B1)</option>
                <option value="Upper Intermediate">Upper Intermediate (B2)</option>
                <option value="Advanced">Advanced (C1)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="students">Kapasitas Mahasiswa</Label>
              <Input 
                id="students" 
                type="number"
                min="1"
                placeholder="Jumlah mahasiswa" 
                value={formData.studentCount}
                onChange={(e) => setFormData({...formData, studentCount: e.target.value})}
                required 
              />
            </div>
            
            <div className="pt-4 flex gap-4">
              <Button type="button" variant="outline" onClick={() => navigate('/dosen/classes')} className="w-full">
                Batal
              </Button>
              <Button type="submit" className="w-full">
                Simpan Kelas
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
