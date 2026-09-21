import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { GraduationCap, Trophy, Flame, Mail } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const mockStudents = [
  { id: 1, name: 'Budi Santoso', email: 'budi@kampus.ac.id', nim: '2021001', level: 'Intermediate', xp: 1250, streak: 5, tasksCompleted: 3, tasksPending: 1 },
  { id: 2, name: 'Siti Aminah', email: 'siti@kampus.ac.id', nim: '2021002', level: 'Beginner', xp: 450, streak: 2, tasksCompleted: 1, tasksPending: 2 },
  { id: 3, name: 'Raka Pratama', email: 'raka@kampus.ac.id', nim: '2021003', level: 'Advanced', xp: 3800, streak: 12, tasksCompleted: 4, tasksPending: 0 },
];

export default function ClassStudents() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Mahasiswa Kelas</h1>
          <p className="text-muted-foreground mt-2">Lihat data lengkap dan progres belajar setiap mahasiswa di kelas ini.</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dosen/classes')}>
          Kembali ke Kelas
        </Button>
      </div>

      <div className="grid gap-4">
        {mockStudents.map(student => (
          <Card key={student.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Avatar & Info */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-lg">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">{student.nim}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Mail className="h-3 w-3" /> {student.email}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 md:ml-auto">
                  <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-lg">
                    <Trophy className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Level</p>
                      <p className="font-semibold text-sm">{student.level}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg">
                    <div className="h-4 w-4 rounded-full bg-yellow-400 flex items-center justify-center text-[9px] font-bold text-yellow-900">XP</div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total XP</p>
                      <p className="font-semibold text-sm">{student.xp.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-lg">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Streak</p>
                      <p className="font-semibold text-sm">{student.streak} hari</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                    <GraduationCap className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Tugas Selesai</p>
                      <p className="font-semibold text-sm">{student.tasksCompleted} / {student.tasksCompleted + student.tasksPending}</p>
                    </div>
                  </div>
                </div>

                {/* Pending Tag */}
                {student.tasksPending > 0 && (
                  <span className="text-xs bg-destructive/10 text-destructive font-medium px-3 py-1 rounded-full self-start md:self-center flex-shrink-0">
                    {student.tasksPending} tugas belum dikumpulkan
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
