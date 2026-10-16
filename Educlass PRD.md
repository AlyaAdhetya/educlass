# Product Requirements Document (PRD)
# EduClass – Platform Pembelajaran Bahasa Inggris Berbasis Level

**Versi:** 1.0
**Tanggal:** 10 September 2026
**Disusun untuk:** Tugas Akhir / Project Mata Kuliah
**Status:** Draft

---

## 1. Ringkasan Eksekutif

EduClass adalah platform pembelajaran bahasa Inggris berbasis web yang mengadopsi konsep gamifikasi ala Duolingo, dipadukan dengan struktur pembelajaran akademik berjenjang (level) dan fitur simulasi tes bahasa Inggris standar (model TOEFL/IELTS). Platform ini memiliki dua peran utama pengguna: **Mahasiswa** sebagai pembelajar, dan **Dosen** sebagai admin yang mengelola kelas, materi, tugas, dan penilaian.

Tujuan utama EduClass adalah menjadikan proses belajar bahasa Inggris di lingkungan kampus lebih interaktif, terstruktur berdasarkan level kemampuan, terukur progresnya, dan dapat diintegrasikan langsung ke dalam proses perkuliahan (tugas, penilaian, rekap nilai).

---

## 2. Latar Belakang & Masalah

- Pembelajaran bahasa Inggris konvensional di kelas sering kali bersifat satu arah dan kurang interaktif.
- Mahasiswa memiliki kemampuan awal yang berbeda-beda, sehingga materi yang seragam kurang efektif.
- Dosen kesulitan memantau progres belajar mandiri mahasiswa di luar jam kelas.
- Belum ada media latihan simulasi tes bahasa Inggris yang terintegrasi dengan aktivitas kelas.
- Aplikasi belajar bahasa yang ada di pasaran (Duolingo, dsb.) tidak dirancang untuk kebutuhan akademik (tidak ada fitur tugas, kelas, atau penilaian dosen).

---

## 3. Tujuan Produk (Goals)

1. Menyediakan pembelajaran bahasa Inggris yang terstruktur berdasarkan level kemampuan (Beginner–Advanced).
2. Meningkatkan motivasi belajar mahasiswa melalui elemen gamifikasi.
3. Memberikan sarana simulasi tes bahasa Inggris yang realistis dan terukur.
4. Memberikan dosen kontrol penuh sebagai admin kelas: mengelola materi, tugas, dan penilaian.
5. Menyediakan data progres belajar yang dapat digunakan sebagai bahan evaluasi akademik.

### Non-Goals (di luar cakupan awal)
- Sertifikasi resmi bahasa Inggris (bukan pengganti TOEFL/IELTS resmi).
- Pembelajaran bahasa selain Inggris (versi awal fokus 1 bahasa).
- Fitur kelas tatap muka/video conference (bukan LMS penuh).

---

## 4. Target Pengguna & Peran

### 4.1 Mahasiswa (Learner)
- Mengikuti placement test untuk menentukan level awal.
- Mengakses modul pembelajaran sesuai level.
- Mengerjakan latihan harian, tugas dari dosen, dan simulasi tes.
- Melihat progres belajar, XP, streak, dan skor.

### 4.2 Dosen (Admin/Instructor)
- Mengelola kelas (membuat kelas, menambahkan mahasiswa).
- Mengelola materi per level (menambah/mengedit modul, soal).
- Membuat dan menugaskan tugas dengan deadline.
- Memberi penilaian manual untuk tugas writing/speaking.
- Memantau dashboard progres seluruh mahasiswa di kelasnya.
- Mengekspor rekap nilai/progres (rekapitulasi nilai akhir mahasiswa).

### 4.3 (Opsional Fase Lanjut) Super Admin
- Mengelola akun dosen, struktur kampus/prodi, dan konfigurasi global sistem.

---

## 5. Struktur Level Pembelajaran

Mengacu pada masukan dosen pembimbing, sistem level dirancang mengikuti kerangka umum kemampuan bahasa (dapat dipetakan ke standar CEFR):

| Level Internal | Setara CEFR | Deskripsi |
|---|---|---|
| Beginner | A1 | Dasar: kosakata umum, kalimat sederhana |
| Elementary | A2 | Grammar dasar, percakapan sehari-hari |
| Intermediate | B1 | Grammar menengah, teks lebih kompleks |
| Upper Intermediate | B2 | Reading/listening akademik ringan |
| Advanced | C1 | Persiapan simulasi tes, writing esai |

**Mekanisme kenaikan level:**
- Mahasiswa baru mengikuti **Placement Test** otomatis menentukan level awal.
- Progres ke level berikutnya terbuka setelah menyelesaikan modul minimum & memenuhi skor kelulusan (misal ≥70%).
- Dosen dapat melakukan override manual (menaikkan/menurunkan level mahasiswa tertentu).

---

## 5.1 Model Kepemilikan Konten & Konsep Room/Kelas

Salah satu keputusan arsitektur penting di EduClass adalah **siapa yang menyediakan materi belajar di tiap level**. EduClass menggunakan pendekatan **Hybrid**, terdiri dari dua layer konten yang terpisah namun saling melengkapi:

### Layer 1 — Kurikulum Global (Default per Level)
- Materi lengkap (Vocabulary, Grammar, Reading, Listening, Writing, Speaking) untuk tiap level (Beginner–Advanced) disediakan **secara default oleh platform**, bukan oleh dosen.
- Bersifat **universal**: sama untuk semua mahasiswa, terlepas dari kelas/room mana pun mereka berada.
- Digunakan untuk sistem gamifikasi utama (XP, streak, unlock level) dan progres belajar mandiri (self-paced learning), persis seperti Duolingo.
- Dikelola/dikurasi oleh tim pengembang (atau super admin), bukan tanggung jawab dosen pengajar.

### Layer 2 — Room/Kelas (Dikelola Dosen)
- Dosen membuat **Room/Kelas** sebagai wadah untuk mahasiswa yang diampunya (misal: "Bahasa Inggris A — Kelas 3B").
- Di dalam Room, dosen **tidak wajib membuat kurikulum dari nol**, melainkan:
  - Menugaskan (assign) modul dari Kurikulum Global sebagai tugas wajib dengan deadline (contoh: "Selesaikan Unit 3 Grammar sebelum tanggal X").
  - Menambahkan **materi/soal tambahan** yang sifatnya spesifik untuk kelasnya (misal soal essay writing dengan tema UTS, atau simulasi tes khusus).
  - Memantau progres & memberi nilai untuk mahasiswa dalam room tersebut.
- Room bersifat privat per kelas: hanya mahasiswa yang ter-enroll yang bisa melihat tugas & materi tambahan dari dosen tersebut.

### Kenapa Hybrid?
| Pendekatan | Masalah jika dipakai sendiri |
|---|---|
| Full Default (tanpa Room) | Dosen tidak punya kontrol nyata sebagai admin kelas |
| Full dari Dosen (tanpa Kurikulum Global) | Beban dosen terlalu berat, konten tidak konsisten antar kelas, progres level jadi sulit distandarisasi |
| **Hybrid (dipilih)** | Mahasiswa tetap punya jalur belajar mandiri yang konsisten & gamified, sementara dosen tetap berperan aktif melalui Room tanpa harus membuat kurikulum dari nol |

### Implikasi ke Struktur Data (Ringkas)
- **Level/Modul Global** → entity independen, tidak terikat kelas mana pun.
- **Room/Kelas** → entity terpisah, memiliki relasi many-to-many dengan Mahasiswa (enrollment) dan relasi ke satu Dosen pengampu.
- **Tugas** → entity yang terikat ke Room tertentu, bisa mereferensikan Modul Global (assign existing content) atau berisi materi/soal baru buatan dosen.

---

## 6. Daftar Fitur (Feature List)

### 6.1 Fitur Inti — Mahasiswa

| Fitur | Deskripsi | Prioritas |
|---|---|---|
| Registrasi & Login | Autentikasi mahasiswa (email kampus / NIM) | Must Have |
| Placement Test | Tes awal penentu level otomatis | Must Have |
| Modul Belajar per Level | Konten terstruktur: Vocabulary, Grammar, Reading, Listening, Writing, Speaking | Must Have |
| Micro-lesson | Sesi belajar singkat (5–10 menit) per unit | Must Have |
| Variasi Tipe Soal | Pilihan ganda, isian, drag & drop, listening, rekam suara (speaking), susun kalimat | Must Have |
| Progress Tracker | Progress bar per level & per skill | Must Have |
| Gamifikasi (XP, Streak, Badge) | Poin pengalaman, hari beruntun belajar, lencana pencapaian | Should Have |
| Leaderboard Kelas | Papan peringkat antar mahasiswa dalam satu kelas | Should Have |
| Simulasi Tes | Tes simulasi model TOEFL/IELTS (Listening, Structure, Reading) dengan timer & skor otomatis | Must Have |
| Riwayat Tugas & Nilai | Melihat tugas dari dosen, status pengumpulan, dan nilai | Must Have |
| Notifikasi | Reminder streak harian & deadline tugas | Should Have |
| Forum Diskusi Kelas | Tanya jawab antar mahasiswa/dosen per kelas | Could Have |
| Sertifikat/Laporan Progres | Unduh laporan progres belajar berkala | Could Have

### 6.2 Fitur Inti — Dosen (Admin Kelas)

| Fitur | Deskripsi | Prioritas |
|---|---|---|
| Dashboard Kelas | Ringkasan progres seluruh mahasiswa dalam Room (rata-rata skor, completion rate) | Must Have |
| Manajemen Room/Kelas | Membuat Room, menambah/menghapus mahasiswa (enrollment) | Must Have |
| Assign Modul Global | Menugaskan modul dari Kurikulum Global sebagai tugas wajib dengan deadline | Must Have |
| Materi/Soal Tambahan | Menambahkan materi atau soal khusus milik Room (di luar Kurikulum Global) | Should Have |
| Bank Soal | Membuat soal kustom (pilihan ganda, essay, dsb.) untuk materi tambahan | Should Have |
| Manajemen Tugas | Membuat tugas dalam Room, atur deadline, assign ke seluruh/individu mahasiswa | Must Have |
| Penilaian Manual | Menilai submission writing/speaking yang butuh evaluasi manusia | Must Have |
| Override Level Mahasiswa | Menyesuaikan level mahasiswa secara manual | Should Have |
| Export Rekap Nilai | Ekspor data nilai/progres (CSV/Excel/PDF) | Should Have |
| Notifikasi ke Mahasiswa | Kirim pengumuman/reminder ke kelas | Could Have |

### 6.3 Fitur Sistem (Cross-cutting)

| Fitur | Deskripsi |
|---|---|
| Role-based Access Control | Pembeda hak akses Mahasiswa vs Dosen vs (opsional) Super Admin |
| Responsive Design | Bisa diakses optimal dari desktop maupun mobile browser |
| Analitik Pembelajaran | Statistik kesalahan umum, skill terlemah mahasiswa (untuk insight dosen) |
| Sistem Audio/Speech | Text-to-speech untuk listening, speech recognition sederhana untuk speaking |

---

## 7. Alur Pengguna Utama (User Flow)

### 7.1 Alur Mahasiswa Baru
1. Registrasi/Login → 2. Placement Test → 3. Sistem menentukan level awal →
4. Mahasiswa masuk ke dashboard sesuai level → 5. Mengerjakan modul/latihan harian →
6. Mendapat XP/streak → 7. Menyelesaikan level → naik ke level berikutnya →
8. Sewaktu-waktu mengerjakan tugas dari dosen & simulasi tes.

### 7.2 Alur Dosen
1. Login sebagai Dosen → 2. Membuat/memilih kelas →
3. Menambahkan/mengelola materi sesuai level → 4. Membuat tugas dengan deadline →
5. Memantau dashboard progres mahasiswa → 6. Menilai tugas yang butuh evaluasi manual →
7. Mengekspor rekap nilai di akhir periode.

---

## 8. Kebutuhan Non-Fungsional

- **Usability:** antarmuka sederhana dan intuitif, cocok untuk pengguna non-teknis (dosen).
- **Performance:** waktu load halaman < 2 detik untuk konten teks/soal standar.
- **Scalability:** mampu menangani banyak kelas & mahasiswa secara bersamaan (tergantung skala kampus).
- **Security:** autentikasi aman, data nilai mahasiswa terlindungi (role-based access).
- **Availability:** target uptime tinggi selama masa aktif perkuliahan/ujian.
- **Compatibility:** dapat diakses dari browser modern (Chrome, Firefox, Edge) desktop & mobile.

---

## 9. Saran Tech Stack (Opsional — Sesuaikan dengan Kemampuan Tim)

| Layer | Rekomendasi |
|---|---|
| Frontend | React.js / Next.js + Tailwind CSS |
| Backend | Node.js (Express/NestJS) atau Laravel (PHP) |
| Database | PostgreSQL / MySQL |
| Autentikasi | JWT-based auth / OAuth (Google login kampus) |
| Audio (Listening/Speaking) | Web Speech API / library TTS-STT pihak ketiga |
| Hosting | Vercel/Netlify (frontend), Railway/Render/VPS kampus (backend) |
| Realtime/Notifikasi | WebSocket atau polling sederhana |

---

## 10. Metrik Keberhasilan (Success Metrics / KPI)

- Jumlah mahasiswa aktif menyelesaikan placement test.
- Rata-rata streak harian mahasiswa.
- Tingkat penyelesaian modul per level (completion rate).
- Rata-rata skor simulasi tes dari waktu ke waktu (menunjukkan peningkatan kemampuan).
- Tingkat pengumpulan tugas tepat waktu.
- Feedback kepuasan pengguna (survei sederhana ke mahasiswa & dosen).

---

## 11. Roadmap Pengembangan (Bertahap)

### Fase 1 — MVP (Minimum Viable Product)
- Autentikasi (Mahasiswa & Dosen)
- Placement test sederhana
- Modul belajar per level (minimal 2–3 level: Beginner, Intermediate, Advanced)
- Latihan soal dasar (pilihan ganda, isian)
- Manajemen kelas & tugas oleh dosen
- Dashboard progres sederhana

### Fase 2 — Pengembangan Lanjutan
- Gamifikasi penuh (XP, streak, leaderboard, badge)
- Simulasi tes lengkap dengan timer & skor otomatis
- Fitur speaking (rekam suara) & listening (audio)
- Bank soal kustom untuk dosen
- Export rekap nilai

### Fase 3 — Penyempurnaan
- Forum diskusi
- Analitik pembelajaran lanjutan (kelemahan skill per mahasiswa)
- Sertifikat/laporan progres otomatis
- Optimasi mobile (PWA)

---

## 12. Asumsi & Risiko

**Asumsi:**
- Mahasiswa memiliki akses internet dan perangkat yang memadai.
- Dosen bersedia meluangkan waktu mengelola konten & tugas secara berkala.
- Placement test cukup akurat untuk estimasi level awal.

**Risiko:**
- Evaluasi otomatis untuk speaking/writing memiliki keterbatasan akurasi (mungkin tetap perlu penilaian manual dosen).
- Beban kerja dosen bertambah jika sistem penilaian manual tidak efisien.
- Engagement mahasiswa bisa menurun jika gamifikasi tidak dieksekusi dengan baik (fitur "flat").

---

## 13. Lampiran

- Placeholder untuk wireframe/mockup (dapat ditambahkan pada iterasi berikutnya).
- Placeholder untuk skema database (ERD) — disarankan dibuat sebagai dokumen terpisah setelah fitur final disepakati.

---

*Dokumen ini merupakan draft awal dan dapat direvisi sesuai masukan dosen pembimbing serta kebutuhan pengembangan lebih lanjut.*
