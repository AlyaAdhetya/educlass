import { create } from 'zustand';

// === MOCK MATERIALS WITH PAGINATED CONTENT ===
const initialMaterials = [
  {
    id: 1,
    title: 'Basic Vocabulary',
    category: 'Vocabulary',
    level: 1,
    status: 'completed',
    xp_reward: 30,
    min_score: 60,
    description: 'Kenali dan hafalkan kosakata dasar Bahasa Inggris sehari-hari.',
    pages: [
      {
        title: 'Apa itu Vocabulary?',
        content: `Vocabulary (kosakata) adalah kumpulan kata-kata yang kita ketahui dan gunakan dalam berkomunikasi. Semakin banyak vocabulary yang kamu kuasai, semakin mudah kamu memahami dan berbicara dalam Bahasa Inggris.

**Mengapa Vocabulary Penting?**
Vocabulary adalah fondasi utama dalam belajar bahasa. Tanpa kosakata yang cukup, kita tidak bisa menyampaikan pikiran atau memahami orang lain.`
      },
      {
        title: 'Kosakata Dasar: Benda Sehari-hari',
        content: `Berikut adalah kosakata benda sehari-hari yang sering digunakan:

| Bahasa Inggris | Bahasa Indonesia |
|---|---|
| Book | Buku |
| Pen | Pulpen |
| Table | Meja |
| Chair | Kursi |
| Window | Jendela |
| Door | Pintu |
| Phone | Telepon / HP |
| Bag | Tas |

**Tips:** Coba hubungkan setiap kata dengan benda yang ada di sekitarmu!`
      },
      {
        title: 'Kosakata Dasar: Kata Kerja',
        content: `Kata kerja (verb) adalah kata yang menyatakan tindakan atau keadaan. Berikut kata kerja dasar yang wajib kamu hafal:

| Kata Kerja | Arti |
|---|---|
| Eat | Makan |
| Drink | Minum |
| Sleep | Tidur |
| Walk | Berjalan |
| Read | Membaca |
| Write | Menulis |
| Run | Berlari |
| Study | Belajar |

**Contoh Kalimat:**
- I **eat** rice every day. (Saya makan nasi setiap hari.)
- She **reads** a book. (Dia membaca buku.)`
      },
      {
        title: 'Latihan & Ringkasan',
        content: `Selamat! Kamu telah mempelajari kosakata dasar Bahasa Inggris.

**Ringkasan yang telah dipelajari:**
✅ Pengertian Vocabulary
✅ Kosakata benda sehari-hari (Book, Pen, Table, dll.)
✅ Kosakata kata kerja dasar (Eat, Drink, Sleep, dll.)

**Tantangan untuk kamu:**
Coba tuliskan 5 benda yang ada di sekitarmu dalam Bahasa Inggris!

Kamu siap untuk mengerjakan kuis evaluasi? Klik tombol di bawah untuk membuktikan pemahamanmu! 🎯`
      }
    ],
    quiz: [
      { q: 'What is the English word for "Buku"?', options: ['Pen', 'Book', 'Chair', 'Bag'], answer: 1 },
      { q: 'What does the word "Eat" mean?', options: ['Tidur', 'Berlari', 'Makan', 'Membaca'], answer: 2 },
      { q: 'Which of these is a verb (kata kerja)?', options: ['Table', 'Window', 'Run', 'Phone'], answer: 2 },
      { q: 'What is the English word for "Menulis"?', options: ['Read', 'Walk', 'Study', 'Write'], answer: 3 },
    ]
  },
  {
    id: 2,
    title: 'Daily English Phrases',
    category: 'Daily English',
    level: 1,
    status: 'active',
    xp_reward: 30,
    min_score: 60,
    description: 'Pelajari ungkapan sehari-hari yang paling sering digunakan dalam percakapan.',
    pages: [
      {
        title: 'Ungkapan Salam (Greetings)',
        content: `Salam adalah hal pertama yang kamu ucapkan saat bertemu seseorang. Berikut ungkapan salam yang umum:

**Salam Formal:**
- Good morning! (Selamat pagi!)
- Good afternoon! (Selamat siang!)
- Good evening! (Selamat sore/malam!)
- How do you do? (Apa kabar? — Formal)

**Salam Informal:**
- Hi! / Hey! (Hai!)
- What's up? (Apa kabar? — Santai)
- How are you? (Bagaimana kabarmu?)
- How's it going? (Bagaimana keadaanmu?)`
      },
      {
        title: 'Ungkapan Perpisahan (Farewells)',
        content: `Sama pentingnya dengan salam, ungkapan perpisahan juga penting dikuasai:

**Perpisahan Umum:**
- Goodbye! / Bye! (Selamat tinggal!)
- See you later! (Sampai jumpa!)
- See you tomorrow! (Sampai jumpa besok!)
- Take care! (Jaga diri baik-baik!)

**Perpisahan Malam:**
- Good night! (Selamat malam!)
- Sweet dreams! (Mimpi indah!)

**Contoh Dialog:**
> A: Goodbye, have a nice day!
> B: You too! Take care!`
      },
      {
        title: 'Ungkapan Terima Kasih & Maaf',
        content: `Sopan santun adalah kunci komunikasi yang baik!

**Terima Kasih:**
- Thank you! / Thanks! (Terima kasih!)
- Thank you so much! (Terima kasih banyak!)
- I really appreciate it. (Saya sangat menghargainya.)

**Respons Terima Kasih:**
- You're welcome! (Sama-sama!)
- No problem! (Tidak masalah!)
- My pleasure! (Dengan senang hati!)

**Meminta Maaf:**
- I'm sorry! (Maaf!)
- Excuse me! (Permisi! / Maaf!)
- I apologize. (Saya meminta maaf.)`
      },
      {
        title: 'Ringkasan & Siap Evaluasi',
        content: `Luar biasa! Kamu telah menguasai ungkapan sehari-hari dalam Bahasa Inggris.

**Yang sudah kamu pelajari:**
✅ Ungkapan Salam (Greetings) — formal & informal
✅ Ungkapan Perpisahan (Farewells)
✅ Terima Kasih & Meminta Maaf

**Praktikkan setiap hari!**
Coba gunakan ungkapan-ungkapan ini saat berinteraksi dengan teman atau ketika melihat konten berbahasa Inggris.

Kamu siap untuk evaluasi? Pastikan kamu sudah memahami semua materi di atas! 💪`
      }
    ],
    quiz: [
      { q: 'What is the Indonesian meaning of "Good morning"?', options: ['Selamat malam', 'Selamat pagi', 'Selamat sore', 'Selamat tidur'], answer: 1 },
      { q: 'Which phrase is used to say goodbye informally?', options: ['Good morning', 'How do you do', 'See you later', 'I apologize'], answer: 2 },
      { q: 'What is the correct response to "Thank you"?', options: ['Excuse me', "You're welcome", 'I am sorry', 'How are you'], answer: 1 },
      { q: '"Excuse me" is used to...', options: ['Say hello', 'Say goodbye', 'Ask for attention or apologize', 'Express gratitude'], answer: 2 },
    ]
  },
  {
    id: 3,
    title: 'Present Tense',
    category: 'Grammar',
    level: 2,
    status: 'locked',
    xp_reward: 40,
    min_score: 70,
    description: 'Pelajari penggunaan Present Tense yang benar dalam kalimat Bahasa Inggris.',
    pages: [
      {
        title: 'Apa itu Present Tense?',
        content: `Present Tense adalah bentuk kata kerja yang digunakan untuk menyatakan kejadian yang berlangsung **saat ini**, kebiasaan, atau fakta umum.

**Jenis Present Tense:**
1. Simple Present Tense
2. Present Continuous Tense
3. Present Perfect Tense

Kita akan fokus pada **Simple Present Tense** dulu karena ini yang paling sering digunakan.`
      },
      {
        title: 'Simple Present Tense',
        content: `**Rumus Simple Present Tense:**
- Subject + Verb (base form)
- Untuk he/she/it: Subject + Verb + **s/es**

**Contoh Kalimat:**
- I **study** English every day.
- She **reads** a book every night.
- They **go** to school by bus.
- He **watches** TV in the evening.

**Kapan Digunakan?**
✅ Kebiasaan (I brush my teeth every morning.)
✅ Fakta umum (The sun rises in the east.)
✅ Jadwal (The train leaves at 8 AM.)`
      },
      {
        title: 'Kalimat Negatif & Tanya',
        content: `**Kalimat Negatif:**
Gunakan **do not (don't)** atau **does not (doesn't)** untuk he/she/it.

- I **don't** like coffee.
- She **doesn't** play basketball.
- They **don't** work on Sundays.

**Kalimat Tanya (Interrogative):**
Gunakan **Do** atau **Does** di awal kalimat.

- **Do** you speak English?
- **Does** he live in Jakarta?
- **Do** they study together?

**Jawaban Singkat:**
- Yes, I do. / No, I don't.
- Yes, she does. / No, she doesn't.`
      },
      {
        title: 'Ringkasan & Siap Evaluasi',
        content: `Hebat! Kamu sudah memahami dasar-dasar Present Tense!

**Rangkuman:**
✅ Simple Present Tense untuk kebiasaan, fakta, dan jadwal
✅ Tambahkan -s/-es untuk subjek he/she/it
✅ Gunakan don't / doesn't untuk kalimat negatif
✅ Gunakan Do / Does untuk kalimat tanya

**Ingat:**
- I/You/We/They → do, don't, + verb dasar
- He/She/It → does, doesn't, + verb + s/es

Siap buktikan pemahamanmu? Kerjakan kuis di bawah! 🚀`
      }
    ],
    quiz: [
      { q: 'Which sentence uses Simple Present Tense correctly?', options: ['She studying now', 'He study every day', 'They studies English', 'She studies every morning'], answer: 3 },
      { q: 'Fill in the blank: "He _____ not like spicy food."', options: ['do', 'does', 'did', 'is'], answer: 1 },
      { q: 'Which is correct?', options: ['Do she work here?', 'Does she works here?', 'Does she work here?', 'She does work here?'], answer: 2 },
      { q: '"The sun _____ in the east." (rise)', options: ['rise', 'rising', 'rises', 'rose'], answer: 2 },
    ]
  },
  {
    id: 4,
    title: 'Reading Comprehension 1',
    category: 'Reading',
    level: 2,
    status: 'locked',
    xp_reward: 40,
    min_score: 70,
    description: 'Latih kemampuan membaca dan memahami teks pendek berbahasa Inggris.',
    pages: [
      {
        title: 'Strategi Membaca Efektif',
        content: `Reading Comprehension adalah kemampuan memahami isi bacaan. Ada beberapa strategi yang bisa membantu kamu:

**1. Skimming**
Membaca cepat untuk mendapatkan gambaran umum teks. Fokus pada judul, subjudul, dan kalimat pertama setiap paragraf.

**2. Scanning**
Mencari informasi spesifik dalam teks. Contoh: mencari tanggal, nama, atau angka tertentu.

**3. Careful Reading**
Membaca detail untuk memahami makna mendalam teks.`
      },
      {
        title: 'Membaca Teks: A Day at School',
        content: `Baca teks berikut dengan cermat:

---

**A Day at School**

Every morning, Rina wakes up at 6 o'clock. She takes a shower and eats breakfast. Then, she goes to school by bicycle. She arrives at school at 7:30 AM.

At school, Rina's favorite subject is English. She likes to read stories and practice speaking with her friends. Her English teacher, Mr. Budi, always gives interesting activities.

After school, Rina goes to the library. She reads books and does her homework there. She arrives home at 4 PM and helps her mother cook dinner.

---

Baca teks di atas dengan cermat. Kita akan menjawab pertanyaan tentang teks ini!`
      },
      {
        title: 'Analisis Teks',
        content: `Mari kita analisis teks "A Day at School" bersama-sama:

**Informasi Utama:**
- Nama tokoh: **Rina**
- Rina bangun pukul: **6 pagi**
- Cara ke sekolah: **Naik sepeda**
- Mata pelajaran favorit: **Bahasa Inggris**
- Nama guru: **Mr. Budi**

**Kosakata Penting:**
- wakes up = bangun tidur
- takes a shower = mandi
- arrives = tiba/sampai
- favorite subject = mata pelajaran favorit
- interesting activities = kegiatan menarik

**Tips Memahami Teks:**
Saat membaca, selalu tanya diri sendiri:
- Siapa? (Who?)
- Apa? (What?)
- Kapan? (When?)
- Di mana? (Where?)`
      },
      {
        title: 'Ringkasan & Siap Evaluasi',
        content: `Luar biasa! Kamu sudah menyelesaikan materi Reading Comprehension.

**Yang sudah kamu pelajari:**
✅ Strategi membaca: Skimming, Scanning, Careful Reading
✅ Membaca dan memahami teks pendek "A Day at School"
✅ Menganalisis informasi utama dari teks
✅ Mengenal kosakata baru dari konteks

**Ingat strategi 5W:**
Who? What? When? Where? Why?
Gunakan ini setiap kali membaca teks berbahasa Inggris!

Kamu siap untuk kuis evaluasi? Klik tombol di bawah! 📖`
      }
    ],
    quiz: [
      { q: 'What time does Rina wake up?', options: ['5 AM', '6 AM', '7 AM', '7:30 AM'], answer: 1 },
      { q: 'How does Rina go to school?', options: ['By bus', 'By car', 'By bicycle', 'On foot'], answer: 2 },
      { q: "What is Rina's favorite subject?", options: ['Math', 'Science', 'History', 'English'], answer: 3 },
      { q: 'What is "Skimming" used for?', options: ['Finding specific information', 'Getting the general idea quickly', 'Reading for details', 'Memorizing vocabulary'], answer: 1 },
    ]
  },
  {
    id: 5,
    title: 'Academic Writing Intro',
    category: 'Writing',
    level: 3,
    status: 'locked',
    xp_reward: 50,
    min_score: 75,
    description: 'Pengantar penulisan akademik dalam Bahasa Inggris.',
    pages: [
      { title: 'Pengantar Penulisan Akademik', content: 'Materi penulisan akademik akan membahas struktur esai, paragraph writing, dan penggunaan kata transisi dalam Bahasa Inggris akademik.' },
      { title: 'Struktur Esai', content: 'Sebuah esai akademik terdiri dari Introduction, Body Paragraphs, dan Conclusion. Setiap bagian memiliki fungsi yang berbeda.' },
      { title: 'Ringkasan', content: 'Kamu telah menyelesaikan pengantar penulisan akademik. Siap untuk evaluasi?' }
    ],
    quiz: [
      { q: 'What is the first part of an essay?', options: ['Body', 'Conclusion', 'Introduction', 'Title'], answer: 2 },
      { q: 'How many main parts does an academic essay have?', options: ['2', '3', '4', '5'], answer: 1 },
    ]
  }
];

const initialUserStats = {
  total_xp: 30,
  level: 1,
  levelName: 'Beginner',
  current_streak: 1,
  longest_streak: 1,
  total_completed_materials: 1,
  average_score: 0,
};

const initialStudents = [
  { id: 101, name: 'Dewi Nurlita', nim: '230101', level: 5, levelName: 'Advanced Learner', xp: 3120, streak: 18, avg_score: 95 },
  { id: 102, name: 'Bagas Aditya', nim: '230102', level: 4, levelName: 'Intermediate', xp: 2780, streak: 15, avg_score: 88 },
  { id: 103, name: 'Budi Santoso', nim: '230103', level: 1, levelName: 'Beginner', xp: 30, streak: 1, avg_score: 0 },
  { id: 104, name: 'Siti Aminah', nim: '230104', level: 2, levelName: 'Elementary', xp: 250, streak: 2, avg_score: 75 },
  { id: 105, name: 'Reza Rahadian', nim: '230105', level: 3, levelName: 'Pre-Intermediate', xp: 1200, streak: 5, avg_score: 82 },
];

const initialQuizzes = [
  { id: 1, title: 'Vocabulary Challenge', type: 'Vocabulary', xp_reward: 20, min_score: 70 },
  { id: 2, title: 'Grammar Challenge', type: 'Grammar', xp_reward: 20, min_score: 70 },
];

const initialAchievements = [
  { id: 'first_quiz', name: 'First Quiz', description: 'Menyelesaikan kuis pertama', icon: '🎯' },
  { id: 'streak_7', name: '7 Day Streak', description: 'Belajar 7 hari berturut-turut', icon: '🔥' },
];

const initialRewards = [
  { id: 'theme_ocean', name: 'Ocean Theme', type: 'theme', requirement_xp: 500, icon: '🌊' },
  { id: 'theme_forest', name: 'Forest Theme', type: 'theme', requirement_xp: 1000, icon: '🌲' },
];

const initialUnlocked = {
  achievements: ['first_quiz', 'streak_7'],
  rewards: []
};

const LEVEL_NAMES = ['Beginner', 'Elementary', 'Pre-Intermediate', 'Intermediate', 'Upper-Intermediate', 'Advanced'];

const getLevelName = (xp) => {
  const lvl = Math.floor(xp / 200);
  return LEVEL_NAMES[Math.min(lvl, LEVEL_NAMES.length - 1)];
};

export const useDataStore = create((set) => ({
  materials: initialMaterials,
  userStats: initialUserStats,
  students: initialStudents,
  quizzes: initialQuizzes,
  achievements: initialAchievements,
  rewards: initialRewards,
  unlocked: initialUnlocked,

  // Add XP and auto-update level
  addXP: (amount) => set((state) => {
    const newXP = state.userStats.total_xp + amount;
    const newLevel = Math.floor(newXP / 200) + 1;
    return {
      userStats: {
        ...state.userStats,
        total_xp: newXP,
        level: newLevel,
        levelName: getLevelName(newXP),
      }
    };
  }),

  // Mark material complete AND unlock the next one
  completeMaterialAndUnlockNext: (materialId, score) => set((state) => {
    const idx = state.materials.findIndex(m => m.id === materialId);
    const material = state.materials[idx];
    const passed = score >= (material?.min_score || 60);

    const updatedMaterials = state.materials.map((m, i) => {
      if (m.id === materialId) return { ...m, status: 'completed', last_score: score };
      if (i === idx + 1 && passed) return { ...m, status: m.status === 'locked' ? 'active' : m.status };
      return m;
    });

    return { materials: updatedMaterials };
  }),
}));
