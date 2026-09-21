import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Activity, BookOpen, GraduationCap } from 'lucide-react';

const mockRooms = [
  { id: 1, name: 'Bahasa Inggris A - Kelas 3B', dosen: 'Dr. Andi', activity: 'Tinggi', tasks: 2, students: 40 },
  { id: 2, name: 'Bahasa Inggris C - Kelas 3C', dosen: 'Bpk. Budi', activity: 'Sedang', tasks: 1, students: 35 },
];

const mockActivityLog = [
  { id: 1, user: 'Budi Santoso', role: 'Mahasiswa', action: 'Menyelesaikan Unit 3: Grammar Tenses', time: '2 menit lalu', color: 'text-green-600' },
  { id: 2, user: 'Dr. Andi', role: 'Dosen', action: 'Mengupload materi "Unit 4: Reading Comprehension"', time: '15 menit lalu', color: 'text-primary' },
  { id: 3, user: 'Siti Aminah', role: 'Mahasiswa', action: 'Memulai Placement Test', time: '22 menit lalu', color: 'text-green-600' },
  { id: 4, user: 'Bpk. Budi', role: 'Dosen', action: 'Membuat tugas baru "Essay Writing UTS"', time: '1 jam lalu', color: 'text-primary' },
  { id: 5, user: 'Raka Pratama', role: 'Mahasiswa', action: 'Mengumpulkan tugas "Grammar Exercise 1"', time: '2 jam lalu', color: 'text-green-600' },
  { id: 6, user: 'Dr. Andi', role: 'Dosen', action: 'Membuat kelas baru "Bahasa Inggris A - Kelas 3B"', time: '3 jam lalu', color: 'text-primary' },
];

export default function AdminMonitoring() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Monitoring Aktivitas</h1>
        <p className="text-muted-foreground mt-2">Pantau secara real-time semua aktivitas dosen dan mahasiswa di platform.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Log Aktivitas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Log Aktivitas Real-time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockActivityLog.map(log => (
                <div key={log.id} className="flex items-start gap-4 p-3 rounded-lg border hover:bg-muted/40 transition-colors">
                  <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${log.role === 'Mahasiswa' ? 'bg-green-500' : 'bg-primary'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{log.user}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${log.role === 'Mahasiswa' ? 'bg-green-100 text-green-700' : 'bg-primary/10 text-primary'}`}>
                        {log.role}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{log.action}</p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{log.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monitoring Kelas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Status Aktivitas Kelas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRooms.map(room => (
                <div key={room.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{room.name}</h3>
                    <div className="flex gap-4 mt-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <BookOpen className="h-3 w-3" /> Dosen: {room.dosen}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <GraduationCap className="h-3 w-3" /> {room.students} Mahasiswa
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm">
                        Aktivitas:{' '}
                        <span className={`font-semibold ${room.activity === 'Tinggi' ? 'text-green-500' : 'text-yellow-500'}`}>
                          {room.activity}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">{room.tasks} Tugas Aktif</div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${room.activity === 'Tinggi' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
