import React, { useState } from 'react';
import { useDataStore } from '../../store/dataStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function DosenClasses() {
  const { rooms, activeRoomId, setActiveRoom, createRoom, studentGrades, lecturerData } = useDataStore();
  const currentRoom = rooms.find(r => r.id === activeRoomId) || rooms[0];

  const [copiedCode, setCopiedCode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Form state for new room
  const [newRoomName, setNewRoomName] = useState('');
  const [newDepartment, setNewDepartment] = useState('Teknik Informatika');
  const [newSchedule, setNewSchedule] = useState('Kamis, 10:00 - 12:30 WIB');
  const [newTargetCEFR, setNewTargetCEFR] = useState('CEFR B2');

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setSuccessToast(`Kode kelas "${code}" disalin! Bagikan ke grup mahasiswa.`);
    setTimeout(() => {
      setCopiedCode(false);
      setSuccessToast('');
    }, 3500);
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!newRoomName) return;

    const shortCode = `ENG-${Math.floor(100 + Math.random() * 900)}-2026`;
    const created = {
      name: newRoomName,
      shortName: newRoomName.length > 20 ? newRoomName.substring(0, 20) + '...' : newRoomName,
      code: shortCode,
      department: newDepartment,
      semester: 'Semester Ganjil 2026/2027',
      schedule: newSchedule,
      cefrTarget: newTargetCEFR
    };

    createRoom(created);
    setNewRoomName('');
    setShowModal(false);
    setSuccessToast(`Room kelas "${created.name}" berhasil dibuat dengan kode: ${shortCode}!`);
    setTimeout(() => setSuccessToast(''), 4500);
  };

  const filteredStudents = studentGrades.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nim.includes(searchQuery)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-black flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 fill-icon text-lg">check_circle</span>
              {successToast}
            </div>
            <button
              onClick={() => setSuccessToast('')}
              className="text-emerald-700 font-bold hover:text-emerald-900"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= HEADER SECTION ================= */}
      <section className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-extrabold text-[11px] rounded-full">
              Manajemen Room Perkuliahan
            </span>
            <span className="text-xs text-slate-400">• Total {rooms.length} Kelas Terdaftar</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Ruang Kelas & Kode Gabung Mahasiswa
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Mahasiswa cukup memasukkan kode room di aplikasi mereka untuk bergabung ke kelas ini secara otomatis.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="tactile-btn bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-black text-xs border-b-[4px] border-indigo-900 flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">add_circle</span>
          + Buat Room Baru
        </button>
      </section>

      {/* ================= ACTIVE ROOM SHOWCASE CARD ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Active Room Highlight Card (Col 2) */}
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 border border-indigo-800 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-indigo-200 text-[10px] font-extrabold uppercase tracking-wider border border-white/10">
                Ruang Perkuliahan Aktif
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                {currentRoom.schedule}
              </span>
            </div>

            <div>
              <h2 className="text-lg md:text-2xl font-black tracking-tight">{currentRoom.name}</h2>
              <p className="text-xs text-indigo-200 mt-1">
                Program Studi {currentRoom.department} • {currentRoom.semester}
              </p>
            </div>

            {/* Room Code Display Box */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest block">
                  KODE GABUNG KELAS (ROOM CODE)
                </span>
                <span className="text-2xl font-black font-mono tracking-widest text-amber-300">
                  {currentRoom.code}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopyCode(currentRoom.code)}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl border-b-[3px] border-amber-600 flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">
                  {copiedCode ? 'check' : 'content_copy'}
                </span>
                {copiedCode ? 'Tersalin!' : 'Salin Kode Kelas'}
              </button>
            </div>
          </div>

          <div className="relative z-10 pt-4 mt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="text-[10px] text-indigo-300 block">Mahasiswa Terdaftar</span>
              <span className="text-sm font-black text-white">{currentRoom.totalStudents} Orang</span>
            </div>
            <div>
              <span className="text-[10px] text-indigo-300 block">Target Kemampuan</span>
              <span className="text-sm font-black text-emerald-400">{currentRoom.cefrTarget}</span>
            </div>
            <div>
              <span className="text-[10px] text-indigo-300 block">Dosen Pengampu</span>
              <span className="text-sm font-black text-white truncate block">{lecturerData.lecturerName.split(',')[0]}</span>
            </div>
          </div>
        </div>

        {/* List of All Rooms (Col 1) */}
        <div className="bg-white rounded-3xl p-6 border border-indigo-100 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-600">meeting_room</span>
              Daftar Semua Room Dosen
            </h3>
            <p className="text-[11px] text-slate-400 mb-3">Klik tombol untuk berganti kelas yang dipantau</p>

            <div className="space-y-2.5">
              {rooms.map((room) => {
                const isSelected = room.id === activeRoomId;
                return (
                  <div
                    key={room.id}
                    onClick={() => setActiveRoom(room.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-300 shadow-xs'
                        : 'bg-slate-50 border-slate-200/80 hover:border-indigo-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-900 truncate">{room.shortName}</h4>
                      {isSelected ? (
                        <span className="px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-black rounded-full">
                          Aktif
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="text-[10px] font-bold text-indigo-600 hover:underline"
                        >
                          Pilih
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                      <span>Kode: <strong>{room.code}</strong></span>
                      <span>{room.totalStudents} Mahasiswa</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Tambah Kelas Baru
          </button>
        </div>

      </div>

      {/* ================= ENROLLED STUDENT ROSTER ================= */}
      <section className="bg-white rounded-3xl border border-indigo-100 shadow-sm overflow-hidden">
        {/* Table Header Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-600">group</span>
              Daftar Mahasiswa Terdaftar ({currentRoom.shortName})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Mahasiswa yang telah bergabung menggunakan kode room <strong className="font-mono">{currentRoom.code}</strong>
            </p>
          </div>

          {/* Search box */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-base">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari NIM atau nama..."
              className="pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-100 uppercase tracking-wider font-extrabold text-[10px]">
                <th className="py-3 px-6">NIM</th>
                <th className="py-3 px-6">Nama Mahasiswa</th>
                <th className="py-3 px-6">Level Placement CEFR</th>
                <th className="py-3 px-6">Streak Belajar</th>
                <th className="py-3 px-6">Rata-rata Skor</th>
                <th className="py-3 px-6">Status Perkuliahan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="py-3.5 px-6 font-mono font-bold text-slate-700">{st.nim}</td>
                  <td className="py-3.5 px-6 font-extrabold text-slate-900">{st.name}</td>
                  <td className="py-3.5 px-6">
                    <span className="px-2.5 py-0.5 rounded-full font-black text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {st.cefr}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="flex items-center gap-1 font-bold text-amber-600">
                      <span className="material-symbols-outlined text-sm fill-icon">local_fire_department</span>
                      {st.streak} Hari
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-extrabold text-slate-800">{st.finalScore} / 100</td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        st.status === 'Lulus'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {st.status === 'Lulus' ? '✓ Aktif & Memenuhi Standar' : '⚠️ Perlu Remedial'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ================= MODAL BUAT ROOM BARU ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-indigo-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Buat Room Perkuliahan Baru</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Kelas & Angkatan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Academic English B — Kelas 1A (TI-2025)"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Program Studi
                  </label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Teknik Informatika">Teknik Informatika</option>
                    <option value="Sistem Informasi">Sistem Informasi</option>
                    <option value="Teknik Komputer">Teknik Komputer</option>
                    <option value="Manajemen Bisnis">Manajemen Bisnis</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Target Level CEFR
                  </label>
                  <select
                    value={newTargetCEFR}
                    onChange={(e) => setNewTargetCEFR(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="CEFR A2">A2 (Elementary)</option>
                    <option value="CEFR B1">B1 (Intermediate)</option>
                    <option value="CEFR B2">B2 (Upper Intermediate)</option>
                    <option value="CEFR C1">C1 (Advanced Academic)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Jadwal Pertemuan Mingguan
                </label>
                <input
                  type="text"
                  value={newSchedule}
                  onChange={(e) => setNewSchedule(e.target.value)}
                  placeholder="Contoh: Senin, 08:00 - 10:30 WIB"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="tactile-btn px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl border-b-[4px] border-indigo-900 cursor-pointer"
                >
                  Terbitkan Room & Generate Kode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
