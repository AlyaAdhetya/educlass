import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Search, Users, GraduationCap, Shield, X, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockMahasiswa = [
  { id: 1, name: 'Budi Santoso', email: 'budi@kampus.ac.id', nim: '2021001', level: 'Intermediate', status: 'Aktif' },
  { id: 2, name: 'Siti Aminah', email: 'siti@kampus.ac.id', nim: '2021002', level: 'Beginner', status: 'Aktif' },
  { id: 3, name: 'Raka Pratama', email: 'raka@kampus.ac.id', nim: '2021003', level: 'Advanced', status: 'Aktif' },
];

const mockAdmins = [
  { id: 1, name: 'Super Administrator', email: 'admin@educlass.ac.id', role: 'Super Admin', status: 'Aktif' },
  { id: 2, name: 'Staf Akademik Bahasa', email: 'staf.akademik@kampus.ac.id', role: 'Evaluator Kuis', status: 'Aktif' },
];

function EditModal({ user, type, onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg border shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold">Edit Pengguna — {type}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>Nama Lengkap</Label>
            <Input defaultValue={user?.name} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" defaultValue={user?.email} />
          </div>
          {type === 'Mahasiswa' && (
            <div className="space-y-2">
              <Label>NIM</Label>
              <Input defaultValue={user?.nim} />
            </div>
          )}
          {type === 'Administrator' && (
            <div className="space-y-2">
              <Label>Peran Sistem</Label>
              <Input defaultValue={user?.role} />
            </div>
          )}
          <div className="space-y-2">
            <Label>Reset Password Baru</Label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Kosongkan jika tidak ingin ubah"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 p-6 border-t">
          <Button variant="outline" className="flex-1" onClick={onClose}>Batal</Button>
          <Button className="flex-1" onClick={onClose}>Simpan Perubahan</Button>
        </div>
      </div>
    </div>
  );
}

function UserTable({ data, type, onEdit }) {
  const [search, setSearch] = useState('');
  const filtered = data.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center flex-wrap gap-3">
          <CardTitle className="flex items-center gap-2">
            {type === 'Mahasiswa'
              ? <GraduationCap className="h-5 w-5 text-primary" />
              : <Shield className="h-5 w-5 text-primary" />}
            Data {type}
          </CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Cari ${type}...`}
              className="pl-8"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Nama Lengkap</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">{type === 'Mahasiswa' ? 'NIM' : 'Peran'}</th>
                {type === 'Mahasiswa' && <th className="px-4 py-3 font-medium">Level</th>}
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-t hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{type === 'Mahasiswa' ? u.nim : u.role}</td>
                  {type === 'Mahasiswa' && (
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">{u.level}</span>
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{u.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(u, type)}>Edit</Button>
                    <Button variant="ghost" size="sm" className="text-destructive">Hapus</Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">Tidak ada data ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminUsers() {
  const navigate = useNavigate();
  const [editTarget, setEditTarget] = useState(null);
  const [editType, setEditType] = useState('');

  const handleEdit = (user, type) => {
    setEditTarget(user);
    setEditType(type);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h1>
        <p className="text-muted-foreground mt-2">Kelola akun Mahasiswa dan Administrator yang terdaftar di sistem.</p>
      </div>

      {/* Monitoring Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <button
          className="text-left"
          onClick={() => document.getElementById('section-mahasiswa').scrollIntoView({ behavior: 'smooth' })}
        >
          <Card className="hover:shadow-md hover:border-primary/40 transition-all cursor-pointer">
            <CardContent className="flex items-center gap-6 pt-6">
              <div className="bg-primary/10 p-4 rounded-full">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Mahasiswa</p>
                <p className="text-4xl font-extrabold">{mockMahasiswa.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Klik untuk lihat data</p>
              </div>
            </CardContent>
          </Card>
        </button>

        <button
          className="text-left"
          onClick={() => document.getElementById('section-admin').scrollIntoView({ behavior: 'smooth' })}
        >
          <Card className="hover:shadow-md hover:border-primary/40 transition-all cursor-pointer">
            <CardContent className="flex items-center gap-6 pt-6">
              <div className="bg-secondary p-4 rounded-full">
                <Shield className="h-8 w-8 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Administrator & Staf</p>
                <p className="text-4xl font-extrabold">{mockAdmins.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Klik untuk lihat data</p>
              </div>
            </CardContent>
          </Card>
        </button>
      </div>

      {/* Mahasiswa Table */}
      <div id="section-mahasiswa">
        <UserTable data={mockMahasiswa} type="Mahasiswa" onEdit={handleEdit} />
      </div>

      {/* Admin Table */}
      <div id="section-admin">
        <UserTable data={mockAdmins} type="Administrator" onEdit={handleEdit} />
      </div>

      {/* Edit Modal */}
      {editTarget && (
        <EditModal user={editTarget} type={editType} onClose={() => setEditTarget(null)} />
      )}
    </div>
  );
}
