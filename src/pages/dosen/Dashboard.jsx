import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, BookOpen, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

export default function DosenDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Dosen</h1>
        <p className="text-muted-foreground mt-2">Selamat datang, {user?.name || 'Bapak/Ibu Dosen'}. Berikut ringkasan kelas Anda.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mahasiswa</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
            <p className="text-xs text-muted-foreground mt-1">Di 3 Kelas aktif</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tugas Perlu Dinilai</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">15</div>
            <p className="text-xs text-muted-foreground mt-1">Essay Writing UTS</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tugas Aktif</CardTitle>
            <BookOpen className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground mt-1">Tersebar di 2 kelas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Kelas Aktif</CardTitle>
            <CardDescription>Daftar kelas yang Anda ampu semester ini.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-semibold">Bahasa Inggris A - Kelas 3B</h3>
                <p className="text-sm text-muted-foreground">40 Mahasiswa</p>
              </div>
              <Link to="/dosen/classes">
                <Button variant="outline" size="sm">Kelola</Button>
              </Link>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="font-semibold">Bahasa Inggris C - Kelas 3C</h3>
                <p className="text-sm text-muted-foreground">35 Mahasiswa</p>
              </div>
              <Link to="/dosen/classes">
                <Button variant="outline" size="sm">Kelola</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
