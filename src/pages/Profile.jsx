import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuthStore } from '../store/authStore';
import { UserCircle, Camera, Save } from 'lucide-react';

export default function Profile() {
  const { user, role } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    username: user?.name?.toLowerCase().replace(/\s/g, '') || '',
    bio: 'Saya sangat antusias belajar Bahasa Inggris!',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert('Profil berhasil diperbarui!');
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Profil Pengguna</h1>
        <p className="text-slate-500 mt-2">Kelola informasi akun dan biodata Anda.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-slate-200 shadow-sm text-center">
          <CardContent className="pt-6 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-slate-200 flex items-center justify-center mb-4 relative overflow-hidden group cursor-pointer border-4 border-white shadow-md">
              <UserCircle className="w-20 h-20 text-slate-400" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{formData.name || 'User'}</h2>
            <p className="text-sm text-slate-500 capitalize">{role}</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Pengaturan Biodata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Username</Label>
                <Input name="username" value={formData.username} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Biodata Singkat</Label>
              <textarea 
                className="w-full h-24 p-3 border border-slate-200 rounded-md text-sm bg-background"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <Label>Reset Password</Label>
              <Input type="password" placeholder="Masukkan password baru jika ingin mengubah" />
            </div>
            <div className="pt-4 flex justify-end">
              <Button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4" /> Simpan Perubahan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
