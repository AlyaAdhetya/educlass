import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { FileText, Clock } from 'lucide-react';

const mockExams = [
  { id: 1, title: 'Simulasi TOEFL - Bagian 1 (Listening)', duration: '45 Menit', status: 'available' },
  { id: 2, title: 'Ujian Tengah Semester - Grammar', duration: '60 Menit', status: 'available' },
  { id: 3, title: 'Ujian Akhir Semester', duration: '90 Menit', status: 'locked' },
];

export default function Exams() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tes & Ujian</h1>
        <p className="text-muted-foreground mt-2">Daftar tes yang ditugaskan oleh dosen dan simulasi standar.</p>
      </div>

      <div className="grid gap-4">
        {mockExams.map((exam) => (
          <Card key={exam.id} className={exam.status === 'locked' ? 'opacity-60' : ''}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                {exam.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                Durasi: {exam.duration}
              </div>
              <Button disabled={exam.status === 'locked'}>
                {exam.status === 'locked' ? 'Terkunci' : 'Mulai Tes'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
