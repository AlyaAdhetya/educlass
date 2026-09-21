import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { BookOpen, CheckCircle, Clock, Upload, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const mockTasks = [
  { id: 1, title: 'Essay Writing UTS', deadline: '2026-10-15T23:59', description: 'Tulis sebuah esai tentang topik kehidupan kampus minimal 300 kata.', submissions: 15, total: 40 },
  { id: 2, title: 'Grammar Exercise 1', deadline: '2026-10-08T23:59', description: 'Kerjakan latihan grammar yang telah dibagikan.', submissions: 32, total: 40 },
];

function formatDeadline(dt) {
  return new Date(dt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });
}

export default function ClassTasks() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({ title: '', description: '', deadline: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ title: '', description: '', deadline: '' });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kelola Tugas Kelas</h1>
          <p className="text-muted-foreground mt-2">Berikan tugas, atur deadline, dan pantau pengumpulan dari mahasiswa.</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dosen/classes')}>
          Kembali ke Kelas
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form Tugas */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Buat Tugas Baru</CardTitle>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <p className="font-semibold text-green-700">Tugas berhasil diberikan!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="t-title">Judul Tugas</Label>
                  <Input id="t-title" placeholder="Contoh: Reading Exercise 2" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="t-desc">Keterangan / Instruksi</Label>
                  <textarea
                    id="t-desc"
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    rows={4}
                    placeholder="Instruksi detail untuk mahasiswa..."
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="t-file">Upload Soal / Referensi (PDF)</Label>
                  <Input id="t-file" type="file" accept=".pdf" />
                  <p className="text-xs text-muted-foreground">Maks. 10MB. Format: PDF</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="t-deadline">Batas Pengumpulan (Deadline)</Label>
                  <Input id="t-deadline" type="datetime-local" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} required />
                </div>
                <Button type="submit" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload & Tugaskan
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Daftar Tugas */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-semibold text-xl">Tugas Aktif ({mockTasks.length})</h2>
          {mockTasks.map(task => (
            <Card key={task.id}>
              <CardContent className="pt-5">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg">{task.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        <p className="text-xs text-destructive font-medium mt-2 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Deadline: {formatDeadline(task.deadline)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Penerimaan Tugas */}
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">Penerimaan Tugas</span>
                      <span className="font-bold text-primary">{task.submissions}/{task.total} Mahasiswa</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${(task.submissions / task.total) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{task.submissions} sudah mengumpulkan</span>
                      <span>{task.total - task.submissions} belum</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="self-end">Lihat Semua Pengumpulan</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
