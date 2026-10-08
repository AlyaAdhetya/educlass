import { create } from 'zustand';

// === MOCK MATERIALS WITH PAGINATED CONTENT ===
const initialMaterials = [
  {
    id: 1,
    unit: 'Unit 1',
    title: 'Academic Vocabulary Mastery',
    category: 'Vocabulary',
    cefr: 'Dasar - Menengah',
    level: 1,
    status: 'completed',
    xp_reward: 80,
    min_score: 60,
    stars: 3,
    description: 'Kenali dan kuasai kosakata akademik formal untuk perkuliahan dan publikasi.',
    pages: [
      {
        title: 'Pengenalan Academic Vocabulary',
        content: `Academic Vocabulary adalah kata-kata yang umum dipakai dalam literatur ilmiah, perkuliahan formal, dan penulisan karya tulis ilmiah.

**Mengapa Penting?**
Penguasaan kosakata akademis membedakan bahasa percakapan sehari-hari (*casual English*) dengan bahasa ilmiah (*formal English*). Contohnya kata **"analyze"** lebih tepat digunakan daripada sekadar **"look at"**.`
      },
      {
        title: 'Contoh Kosakata Akademik Populer',
        content: `| Kata Informal | Kata Akademik | Arti |
|---|---|---|
| find out | determine / discover | menemukan / menentukan |
| get | obtain / acquire | memperoleh |
| think about | consider / examine | mempertimbangkan / menelaah |
| make sure | verify / substantiate | memastikan / memverifikasi |
| show | demonstrate / indicate | menunjukkan / mendemonstrasikan |`
      },
      {
        title: 'Ringkasan & Evaluasi',
        content: `Kamu telah mempelajari kosakata formal dasar! Pastikan kamu mengingat perbedaan gaya bahasa casual dan akademis.`
      }
    ],
    quiz: [
      { q: 'Which word is the academic equivalent for "to find out"?', options: ['Determine', 'Look up', 'Guess', 'Ignore'], answer: 0, explanation: '"Determine" adalah bentuk akademik formal untuk mencari tahu fakta.' },
      { q: 'What is the academic term for "to get"?', options: ['Grab', 'Acquire', 'Take away', 'Catch'], answer: 1, explanation: '"Acquire" berarti mendapatkan atau memperoleh sesuatu secara formal.' },
      { q: 'Choose the most formal phrase for a research paper:', options: ['The results show...', 'The data demonstrates...', 'Look at the data...', 'Data is cool...'], answer: 1, explanation: '"The data demonstrates" adalah standar kalimat akademik.' },
    ],
    questSteps: [
      {
        id: 'u1_q1',
        type: 'image_select',
        tag: 'KOSAKATA BARU',
        prompt: 'Mana yang merepresentasikan "Academic Journal"?',
        audioText: 'Academic Journal',
        options: [
          { id: 1, label: 'Academic Journal', phonetic: 'æk.əˈdem.ɪk ˈdʒɜː.nəl', sub: 'jurnal ilmiah', emoji: '📚', isCorrect: true },
          { id: 2, label: 'Coffee Cup', phonetic: 'ˈkɒf.i kʌp', sub: 'cangkir kopi', emoji: '☕', isCorrect: false },
          { id: 3, label: 'Water Bottle', phonetic: 'ˈwɔː.tər ˈbɒt.əl', sub: 'botol air', emoji: '🧴', isCorrect: false }
        ]
      },
      {
        id: 'u1_q2',
        type: 'character_translate',
        tag: 'DENGARKAN & TERJEMAHKAN',
        prompt: 'Tuliskan dalam bahasa Indonesia apa yang diucapkan Prof. Hootie:',
        speechText: 'The researcher obtains the data.',
        phonetic: 'ðə rɪˈsɜː.tʃər əbˈteɪnz ðə ˈdeɪ.tə',
        targetWords: ['Peneliti', 'memperoleh', 'data', 'tersebut'],
        wordBank: ['Peneliti', 'memperoleh', 'data', 'tersebut', 'tidur', 'di', 'laboratorium', 'menolak']
      },
      {
        id: 'u1_q3',
        type: 'word_arrange',
        tag: 'SUSUN KALIMAT FORMAL',
        prompt: 'Susun kalimat bahasa Inggris formal:',
        targetMeaning: 'Data tersebut membuktikan hipotesis kami.',
        targetWords: ['The', 'data', 'demonstrates', 'our', 'hypothesis'],
        wordBank: ['The', 'data', 'demonstrates', 'our', 'hypothesis', 'proves', 'look', 'is']
      }
    ]
  },
  {
    id: 2,
    unit: 'Unit 2',
    title: 'Past Perfect vs Past Simple',
    category: 'Grammar',
    cefr: 'Menengah',
    level: 1,
    status: 'completed',
    xp_reward: 90,
    min_score: 60,
    stars: 3,
    description: 'Pahami urutan kronologis masa lampau untuk melaporkan hasil penelitian dan riwayat literatur.',
    pages: [
      {
        title: 'Past Simple vs Past Perfect',
        content: `Dalam penulisan abstrak dan metodologi, kita sering perlu menceritakan dua kejadian yang terjadi di masa lampau di mana satu kejadian mendahului yang lain.

- **Past Simple**: Peristiwa lampau yang selesai di waktu tertentu. (*Subject + V2*)
- **Past Perfect**: Peristiwa yang telah selesai **SEBELUM** peristiwa lampau lainnya terjadi. (*Subject + had + V3*)`
      },
      {
        title: 'Contoh Kalimat Riset',
        content: `Contoh:
"The researcher **had prepared** the samples before the observation **began**."
- Aksi 1 (terjadi lebih dulu): *had prepared* (Past Perfect)
- Aksi 2 (terjadi kemudian): *began* (Past Simple)`
      }
    ],
    quiz: [
      { q: 'By the time the professor arrived, the students _____ the experiment.', options: ['finished', 'had finished', 'have finished', 'finishing'], answer: 1, explanation: 'Karena selesai sebelum profesor tiba di masa lampau, gunakan "had finished".' },
      { q: 'She said she _____ the academic journal before submitting her thesis.', options: ['readed', 'had read', 'has read', 'reading'], answer: 1, explanation: 'Gunakan Past Perfect "had read" untuk aksi sebelum penyerahan skripsi.' },
    ],
    questSteps: [
      {
        id: 'u2_q1',
        type: 'image_select',
        tag: 'KOSAKATA BARU',
        prompt: 'Mana yang merepresentasikan "Graduation Ceremony"?',
        audioText: 'Graduation Ceremony',
        options: [
          { id: 1, label: 'Graduation Ceremony', phonetic: 'ˌɡrædʒ.uˈeɪ.ʃən', sub: 'wisuda sarjana', emoji: '🎓', isCorrect: true },
          { id: 2, label: 'Running Race', phonetic: 'ˈrʌn.ɪŋ reɪs', sub: 'lomba lari', emoji: '🏃', isCorrect: false },
          { id: 3, label: 'Movie Theater', phonetic: 'ˈmuː.vi ˌθɪə.tər', sub: 'bioskop film', emoji: '🍿', isCorrect: false }
        ]
      },
      {
        id: 'u2_q2',
        type: 'word_arrange',
        tag: 'URUTAN WAKTU LAMPAU',
        prompt: 'Susun kalimat Past Perfect yang tepat:',
        targetMeaning: 'Profesor telah tiba sebelum eksperimen dimulai.',
        targetWords: ['The', 'professor', 'had', 'arrived', 'before', 'the', 'experiment'],
        wordBank: ['The', 'professor', 'had', 'arrived', 'before', 'the', 'experiment', 'has', 'arriving']
      }
    ]
  },
  {
    id: 3,
    unit: 'Unit 3',
    title: 'Passive Voice in Research Paper',
    category: 'Grammar',
    cefr: 'Menengah Atas',
    level: 2,
    status: 'active',
    xp_reward: 100,
    min_score: 70,
    stars: 0,
    description: 'Kuasai konstruksi kalimat formal dan Passive Voice untuk penulisan metodologi jurnal ilmiah.',
    pages: [
      {
        title: 'Fungsi Passive Voice dalam Karya Ilmiah',
        content: `Dalam artikel ilmiah, fokus utama adalah pada **objek penelitian** dan **proses**, bukan pada siapa pelakunya. Oleh karena itu, *Passive Voice* sangat sering digunakan pada bagian *Methodology* dan *Results*.

**Rumus Utama:**
\`Subject (Objek Aksi) + Be (is/am/are/was/were/been) + Past Participle (V3)\``
      },
      {
        title: 'Perbandingan Active vs Passive',
        content: `**Active:**
"We collected fifty blood samples from the participants."

**Passive (Lebih Akademis):**
"Fifty blood samples **were collected** from the participants."`
      },
      {
        title: 'Passive Voice dengan Modal Verbs',
        content: `Format: \`Modal + be + V3\`

Contoh:
- The error **can be minimized** by recalibrating the sensors.
- Further studies **should be conducted** to confirm the hypothesis.`
      }
    ],
    quiz: [
      { q: 'Convert to academic passive: "Researchers analyzed the survey data."', options: ['The survey data was analyzing by researchers.', 'The survey data were analyzed by researchers.', 'The survey data is analyzed.', 'Researchers were analyzed data.'], answer: 1, explanation: '"The survey data were analyzed" adalah bentuk pasif lampau yang tepat.' },
      { q: 'Complete the sentence: "The chemical mixture _____ before testing."', options: ['must heated', 'must be heated', 'must heating', 'must be heat'], answer: 1, explanation: 'Gunakan Modal + be + V3: "must be heated".' },
      { q: 'Why is passive voice preferred in scientific methodologies?', options: ['To make the text longer', 'To highlight the action and object rather than the agent', 'Because active voice is grammatically wrong', 'To make it harder to read'], answer: 1, explanation: 'Passive voice menekankan metodologi dan data penelitian daripada individu pelaku.' },
    ],
    questSteps: [
      {
        id: 'u3_q1',
        type: 'image_select',
        tag: 'KOSAKATA BARU',
        prompt: 'Mana yang menggambarkan "Laboratory Experiment"?',
        audioText: 'Laboratory Experiment',
        options: [
          { id: 1, label: 'Laboratory Experiment', phonetic: 'ləˈbɒr.ə.tər.i ɪkˈsper.ɪ.mənt', sub: 'eksperimen lab', emoji: '🧪', isCorrect: true },
          { id: 2, label: 'Music Concert', phonetic: 'ˈmjuː.zɪk ˈkɒn.sət', sub: 'konser musik', emoji: '🎸', isCorrect: false },
          { id: 3, label: 'Fast Food', phonetic: 'fɑːst fuːd', sub: 'makanan cepat saji', emoji: '🍔', isCorrect: false }
        ]
      },
      {
        id: 'u3_q2',
        type: 'character_translate',
        tag: 'PASSIVE VOICE',
        prompt: 'Dengarkan Prof. Hootie dan susun kalimat bahasa Indonesia yang tepat:',
        speechText: 'Fifty samples were collected by the team.',
        phonetic: 'ˈfɪf.ti ˈsɑːm.pəlz wɜː kəˈlek.tɪd baɪ ðə tiːm',
        targetWords: ['Lima', 'puluh', 'sampel', 'dikumpulkan', 'oleh', 'tim'],
        wordBank: ['Lima', 'puluh', 'sampel', 'dikumpulkan', 'oleh', 'tim', 'mengumpulkan', 'kemarin', 'kami']
      },
      {
        id: 'u3_q3',
        type: 'word_arrange',
        tag: 'SUSUN KALIMAT AKADEMIS',
        prompt: 'Susun kalimat Passive Voice yang benar dalam bahasa Inggris:',
        targetMeaning: 'Hasil penelitian ini telah dianalisis secara mendalam.',
        targetWords: ['The', 'results', 'were', 'analyzed', 'thoroughly'],
        wordBank: ['The', 'results', 'were', 'analyzed', 'thoroughly', 'was', 'analyzing', 'they']
      },
      {
        id: 'u3_q4',
        type: 'multiple_choice',
        tag: 'KAIDAH TATA BAHASA',
        prompt: 'Lengkapi kalimat pasif akademik ini:',
        sentence: 'The formal methodology _____ approved by the ethical board.',
        options: ['has been', 'have were', 'is being was', 'did'],
        answer: 0,
        explanation: 'Gunakan "has been approved" (Present Perfect Passive) untuk subjek tunggal "The methodology".'
      }
    ]
  },
  {
    id: 4,
    unit: 'Unit 4',
    title: 'Academic Reading Comprehension',
    category: 'Reading',
    cefr: 'Menengah Atas',
    level: 2,
    status: 'locked',
    xp_reward: 110,
    min_score: 75,
    stars: 0,
    description: 'Latih kemampuan membaca kritis (skimming, scanning, inferensi) pada artikel jurnal internasional.',
    pages: [
      { title: 'Skimming and Scanning', content: 'Teknik membaca cepat untuk menemukan argumen sentral dan bukti spesifik dalam teks akademik.' }
    ],
    quiz: [
      { q: 'What is the purpose of skimming an academic abstract?', options: ['To memorize data', 'To quickly grasp the research core argument', 'To edit spelling errors', 'To count words'], answer: 1, explanation: 'Skimming bertujuan menangkap ide utama secara kilat.' }
    ]
  },
  {
    id: 5,
    unit: 'Unit 5',
    title: 'Abstract & Thesis Argumentation',
    category: 'Writing',
    cefr: 'Mahir',
    level: 3,
    status: 'locked',
    xp_reward: 130,
    min_score: 75,
    stars: 0,
    description: 'Sintesis argumen ilmiah, perumusan thesis statement, dan penyusunan abstrak berbahasa Inggris.',
    pages: [
      { title: 'Menulis Abstrak Efektif', content: 'Struktur IMRAD dalam abstrak: Introduction, Method, Results, and Discussion.' }
    ],
    quiz: [
      { q: 'What does the "R" in IMRAD stand for?', options: ['Review', 'Research', 'Results', 'Rationale'], answer: 2, explanation: 'IMRAD: Introduction, Methods, Results, and Discussion.' }
    ]
  }
];

const initialUserStats = {
  total_xp: 2450,
  level: 14,
  levelName: 'Archmage of Grammar',
  current_streak: 14,
  longest_streak: 21,
  gems: 850,
  hearts: 5,
  maxHearts: 5,
  sp_barrier: 850,
  max_sp: 1000,
  roomName: 'Bahasa Inggris 3B',
  cefrLevel: 'Menengah',
  total_completed_materials: 2,
  activeTheme: 'bg-[#f8fafc]',
};

const initialLeaderboard = [
  {
    rank: 1,
    name: 'Dimas Setiawan',
    nim: '230101',
    title: 'Supreme Scholar',
    xp: 3120,
    streak: 19,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    tier: 'Gold',
    badge: 'crown'
  },
  {
    rank: 2,
    name: 'Kamu (Naufal)',
    nim: '230103',
    title: 'Archmage of Grammar',
    xp: 2450,
    streak: 14,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&h=120&q=80',
    tier: 'Silver',
    isCurrentUser: true,
    badge: 'silver'
  },
  {
    rank: 3,
    name: 'Nabila Putri',
    nim: '230104',
    title: 'Syntax Virtuoso',
    xp: 2390,
    streak: 12,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80',
    tier: 'Bronze',
    badge: 'bronze'
  },
  {
    rank: 4,
    name: 'Bagas Aditya',
    nim: '230102',
    title: 'Grammar Knight',
    xp: 2180,
    streak: 10,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    tier: 'Diamond'
  },
  {
    rank: 5,
    name: 'Siti Aminah',
    nim: '230105',
    title: 'Vocabulary Adept',
    xp: 1950,
    streak: 8,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
    tier: 'Platinum'
  },
  {
    rank: 6,
    name: 'Reza Rahadian',
    nim: '230106',
    title: 'Reading Explorer',
    xp: 1820,
    streak: 7,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    tier: 'Platinum'
  }
];

const initialDailyQuests = [
  {
    id: 1,
    title: 'Dapatkan 50 XP dari Quiz atau Modul',
    current: 35,
    target: 50,
    unit: 'XP',
    rewardGems: 25,
    rewardXp: 50,
    icon: 'bolt',
    completed: false
  },
  {
    id: 2,
    title: 'Kerjakan 1 Latihan EELS Boss Battle',
    current: 1,
    target: 1,
    unit: 'Battle',
    rewardGems: 50,
    rewardXp: 75,
    icon: 'swords',
    completed: true
  },
  {
    id: 3,
    title: 'Pertahankan Streak Belajar Hari Ini',
    current: 1,
    target: 1,
    unit: 'Streak',
    rewardGems: 20,
    rewardXp: 30,
    icon: 'local_fire_department',
    completed: true
  }
];

const initialShopItems = [
  {
    id: 'theme_slate',
    category: 'theme',
    name: 'Midnight Slate',
    description: 'Warna latar gelap dan elegan untuk fokus maksimal di malam hari.',
    priceGems: 150,
    icon: 'dark_mode',
    accentColor: 'slate',
    themeClass: 'bg-slate-900'
  },
  {
    id: 'theme_indigo',
    category: 'theme',
    name: 'Deep Indigo',
    description: 'Warna ungu-kebiruan misterius yang menenangkan.',
    priceGems: 250,
    icon: 'nightlight',
    accentColor: 'indigo',
    themeClass: 'bg-indigo-950'
  },
  {
    id: 'theme_emerald',
    category: 'theme',
    name: 'Forest Emerald',
    description: 'Nuansa hijau alam yang menyegarkan untuk sesi belajar panjang.',
    priceGems: 300,
    icon: 'forest',
    accentColor: 'emerald',
    themeClass: 'bg-emerald-950'
  },
  {
    id: 'theme_rose',
    category: 'theme',
    name: 'Crimson Rose',
    description: 'Warna merah mawar gelap untuk semangat berapi-api.',
    priceGems: 400,
    icon: 'local_fire_department',
    accentColor: 'rose',
    themeClass: 'bg-rose-950'
  },
  {
    id: 'theme_amber',
    category: 'theme',
    name: 'Golden Amber',
    description: 'Sentuhan keemasan premium untuk mahasiswa berprestasi.',
    priceGems: 500,
    icon: 'stars',
    accentColor: 'amber',
    themeClass: 'bg-[#1a1205]' // Dark amber/brown
  },
  {
    id: 'theme_default',
    category: 'theme',
    name: 'Classic Bright',
    description: 'Tampilan cerah bawaan sistem yang bersih dan rapi.',
    priceGems: 0,
    icon: 'light_mode',
    accentColor: 'blue',
    themeClass: 'bg-[#f8fafc]'
  }
];

// EELS Boss Battle Dataset
const initialBossBattle = {
  bossName: 'Grammar & Listening Challenge',
  title: 'Simulasi EELS: Section 2 (Structure & Written Expression)',
  cefrPhase: 'Fase Menengah Atas',
  maxHp: 10000,
  currentHp: 4200,
  damagePerHit: 350,
  timeRemainingSec: 2535, // ~42:15
  questions: [
    {
      id: 1,
      type: 'Structure',
      question: 'Not only _____ the research findings, but she also presented a compelling alternative model.',
      options: [
        'she challenged',
        'did she challenge',
        'she was challenging',
        'has she been challenge'
      ],
      answer: 1,
      explanation: 'Negative inversion: setelah frasa "Not only" di awal klausa, gunakan inversi subjek-kata kerja bantu (auxiliary did + subject she + V1 challenge).'
    },
    {
      id: 2,
      type: 'Written Expression',
      question: 'The committee decided to postpone the academic conference because of the delegates (A) had not yet (B) received their (C) travel authorizations (D).',
      options: [
        'because of',
        'had not yet',
        'received their',
        'authorizations'
      ],
      answer: 0,
      explanation: 'Kesalahan ada pada (A) "because of". Karena diikuti oleh klausa lengkap (subject + verb: "the delegates had not yet received..."), kata yang tepat adalah konjungsi "because", bukan preposisi "because of".'
    },
    {
      id: 3,
      type: 'Structure',
      question: 'Were the hypothesis _____ valid, the team would proceed with clinical trials immediately.',
      options: [
        'proven',
        'to be proven',
        'proved to',
        'proving'
      ],
      answer: 1,
      explanation: 'Inverted Conditional Type 2: "Were the hypothesis to be proven valid..." menggantikan "If the hypothesis were to be proven valid...".'
    }
  ]
};

// Dosen / Lecturer Class Data & Rooms
const initialRooms = [
  {
    id: 'room-3b',
    name: 'Bahasa Inggris Akademik A — Kelas 3B (TI-2024)',
    shortName: 'Kelas 3B (TI-2024)',
    code: 'ENG-3B-2026',
    department: 'Teknik Informatika',
    semester: 'Semester Ganjil 2026/2027',
    schedule: 'Senin, 08:00 - 10:30 WIB',
    totalStudents: 38,
    levelTarget: 'Menengah Atas',
    avgLevel: 'Menengah (68%)',
    streakRate: '89%',
    avgScore: '86.4'
  },
  {
    id: 'room-2a',
    name: 'English for IT & Communication — Kelas 2A (SI-2024)',
    shortName: 'Kelas 2A (SI-2024)',
    code: 'ENG-2A-2026',
    department: 'Sistem Informasi',
    semester: 'Semester Ganjil 2026/2027',
    schedule: 'Rabu, 13:00 - 15:30 WIB',
    totalStudents: 32,
    levelTarget: 'Menengah',
    avgLevel: 'Dasar (80%)',
    streakRate: '75%',
    avgScore: '81.2'
  }
];

const initialLecturerAssignments = [
  {
    id: 'asg-1',
    roomId: 'room-3b',
    title: 'Unit 3: Academic Reading & Passive Voice in Scientific Abstracts',
    type: 'global_module',
    targetUnit: 'Unit 3',
    cefr: 'Menengah',
    deadline: '14 Okt 2026, 23:59 WIB',
    submittedCount: 31,
    totalCount: 38,
    status: 'active',
    minScore: 70,
    xpReward: 120,
    rubric: 'Penyelesaian Quest Unit 3 & Skor Kuis Min. 70%',
    description: 'Selesaikan seluruh step pembelajaran pada Quest Unit 3 di Quest Map dan selesaikan quiz review pemahaman.'
  },
  {
    id: 'asg-2',
    roomId: 'room-3b',
    title: 'Academic Writing & Speaking: The Future Impact of AI on Software Engineering',
    type: 'custom_task',
    targetUnit: 'Tugas Akademik Khusus',
    cefr: 'Menengah Atas',
    deadline: '18 Okt 2026, 23:59 WIB',
    submittedCount: 32,
    totalCount: 38,
    status: 'active',
    minScore: 75,
    xpReward: 200,
    rubric: 'Min 350 kata format IMRAD + Audio Speaking 2 menit',
    description: 'Tulis esai terstruktur mengenai dampak Gen-AI terhadap arsitektur perangkat lunak serta rekam ringkasan oral presentasi.'
  },
  {
    id: 'asg-3',
    roomId: 'room-3b',
    title: 'Grammar Duel: Inverted Conditionals & Passive Voice',
    type: 'custom_quiz',
    targetUnit: 'Kuis Singkat',
    cefr: 'Mahir',
    deadline: '22 Okt 2026, 23:59 WIB',
    submittedCount: 28,
    totalCount: 38,
    status: 'active',
    minScore: 65,
    xpReward: 90,
    rubric: 'Skor minimal evaluasi 75%',
    description: '10 butir soal pilihan ganda evaluasi pemahaman inversion grammar tipe 1, 2, dan 3.'
  }
];

const initialManualSubmissions = [
  {
    id: 'sub-1',
    roomId: 'room-3b',
    studentName: 'Nabila Putri',
    nim: '2401082',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    taskTitle: 'Writing & Speaking: AI Impact on Software Engineering',
    topic: 'The Future Impact of Generative AI on Software Engineering',
    submittedAt: 'Kemarin, 21:15 WIB',
    status: 'pending',
    essayExcerpt: '...In conclusion, while automated code completion might accelerate standard scaffolding, the fundamental necessity of critical architectural evaluation and robust edge-case validation remains entirely human-driven. Therefore, software engineers must augment their cognitive versatility rather than merely relying on stochastic output generation...',
    fullEssay: `Abstract & Introduction:
Recent advancements in generative artificial intelligence have precipitated paradigm shifts across contemporary software engineering methodologies. Automated synthesis engines now routinely assist practitioners in boilerplate formulation, unit test authoring, and defect diagnosis.

Methodology & Discussion:
However, empirical observations reveal that automated language models frequently propagate latent security anti-patterns and syntactical hallucinations. While code completion velocity increases exponentially, systemic resilience necessitates rigorous peer evaluation. In our departmental case study involving twenty undergraduate developers, static analysis revealed that algorithmic correctness diminished when relying exclusively on unverified prompt iterations.

Conclusion:
In conclusion, while automated code completion might accelerate standard scaffolding, the fundamental necessity of critical architectural evaluation and robust edge-case validation remains entirely human-driven. Therefore, software engineers must augment their cognitive versatility rather than merely relying on stochastic output generation.`,
    audioFile: 'Speaking_Response_Nabila.wav',
    audioDuration: '01:42',
    grammarScore: 88,
    vocabScore: 82,
    fluencyScore: 90,
    finalScore: 87,
    feedback: ''
  },
  {
    id: 'sub-2',
    roomId: 'room-3b',
    studentName: 'Budi Santoso',
    nim: '2401001',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    taskTitle: 'Writing & Speaking: AI Impact on Software Engineering',
    topic: 'Autonomous Cloud Architecture & Microservices',
    submittedAt: 'Hari ini, 09:30 WIB',
    status: 'pending',
    essayExcerpt: '...Distributed serverless computing has transformed high-availability deployment pipelines. The integration of containerization ensures that microservices can scale horizontally with minimal latency degradation...',
    fullEssay: 'Distributed serverless computing has transformed high-availability deployment pipelines. The integration of containerization ensures that microservices can scale horizontally with minimal latency degradation. Nevertheless, monitoring multi-tenant orchestration remains challenging without automated tracing frameworks.',
    audioFile: 'Speaking_Budi_Cloud.wav',
    audioDuration: '01:15',
    grammarScore: 80,
    vocabScore: 85,
    fluencyScore: 78,
    finalScore: 81,
    feedback: ''
  },
  {
    id: 'sub-3',
    roomId: 'room-3b',
    studentName: 'Siti Aminah',
    nim: '2401002',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    taskTitle: 'Writing & Speaking: AI Impact on Software Engineering',
    topic: 'Ethical Implications of Algorithmic Biases in FinTech',
    submittedAt: '2 hari lalu',
    status: 'graded',
    essayExcerpt: '...Algorithmic bias must be mitigated by comprehensive demographic parity audits prior to commercial loan underwriting deployments...',
    fullEssay: 'Algorithmic bias must be mitigated by comprehensive demographic parity audits prior to commercial loan underwriting deployments. Machine learning models trained on historical redlining datasets inherently mirror systemic socioeconomic inequities.',
    audioFile: 'Speaking_Siti_Fintech.wav',
    audioDuration: '01:55',
    grammarScore: 94,
    vocabScore: 92,
    fluencyScore: 90,
    finalScore: 92,
    feedback: 'Analisis etika sangat mendalam dan pemilihan vocabulary akademik (demographic parity, systemic inequities) sangat akurat. Pertahankan!'
  },
  {
    id: 'sub-4',
    roomId: 'room-3b',
    studentName: 'Raka Pratama',
    nim: '2401003',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    taskTitle: 'Writing & Speaking: AI Impact on Software Engineering',
    topic: 'Cybersecurity Threat Modeling in Zero-Trust Environments',
    submittedAt: 'Hari ini, 07:45 WIB',
    status: 'pending',
    essayExcerpt: '...Zero-trust network architecture assumes perpetual adversarial compromise. Consequently, continuous mutual cryptographic authentication is mandated at every perimeter ingress...',
    fullEssay: 'Zero-trust network architecture assumes perpetual adversarial compromise. Consequently, continuous mutual cryptographic authentication is mandated at every perimeter ingress. Legacy VPN frameworks are demonstrably inadequate for decentralized workforce models.',
    audioFile: 'Speaking_Raka_ZeroTrust.wav',
    audioDuration: '01:30',
    grammarScore: 85,
    vocabScore: 88,
    fluencyScore: 84,
    finalScore: 86,
    feedback: ''
  }
];

const initialStudentGrades = [
  { id: 1, nim: '2401082', name: 'Nabila Putri', cefr: 'Menengah Atas', streak: 14, quizAvg: 92, assignmentAvg: 87, finalScore: 90.0, letterGrade: 'A', status: 'Lulus' },
  { id: 2, nim: '2401001', name: 'Budi Santoso', cefr: 'Menengah', streak: 14, quizAvg: 85, assignmentAvg: 81, finalScore: 83.4, letterGrade: 'A-', status: 'Lulus' },
  { id: 3, nim: '2401002', name: 'Siti Aminah', cefr: 'Menengah Atas', streak: 12, quizAvg: 95, assignmentAvg: 92, finalScore: 93.8, letterGrade: 'A', status: 'Lulus' },
  { id: 4, nim: '2401003', name: 'Raka Pratama', cefr: 'Menengah', streak: 9, quizAvg: 80, assignmentAvg: 86, finalScore: 82.4, letterGrade: 'B+', status: 'Lulus' },
  { id: 5, nim: '2401015', name: 'Dimas Aditya', cefr: 'Menengah', streak: 8, quizAvg: 78, assignmentAvg: 75, finalScore: 76.8, letterGrade: 'B', status: 'Lulus' },
  { id: 6, nim: '2401022', name: 'Anisa Rahmawati', cefr: 'Menengah Atas', streak: 11, quizAvg: 88, assignmentAvg: 89, finalScore: 88.4, letterGrade: 'A', status: 'Lulus' },
  { id: 7, nim: '2401034', name: 'Farhan Maulana', cefr: 'Dasar', streak: 4, quizAvg: 68, assignmentAvg: 70, finalScore: 68.8, letterGrade: 'C+', status: 'Perlu Perhatian' },
  { id: 8, nim: '2401041', name: 'Tiara Larasati', cefr: 'Menengah', streak: 7, quizAvg: 82, assignmentAvg: 80, finalScore: 81.2, letterGrade: 'B+', status: 'Lulus' },
  { id: 9, nim: '2401053', name: 'Bayu Wicaksono', cefr: 'Menengah', streak: 10, quizAvg: 84, assignmentAvg: 83, finalScore: 83.6, letterGrade: 'A-', status: 'Lulus' },
  { id: 10, nim: '2401067', name: 'Clara Oktaviani', cefr: 'Menengah Atas', streak: 15, quizAvg: 96, assignmentAvg: 94, finalScore: 95.2, letterGrade: 'A', status: 'Lulus' },
];

const initialLecturerData = {
  className: 'Bahasa Inggris Akademik A — Kelas 3B (TI-2024)',
  lecturerName: 'Dr. Hendra Wijaya, M.Hum.',
  nip: '198204122010121003',
  semester: 'Semester Ganjil 2026/2027',
  metrics: {
    totalStudents: 38,
    placementTestRate: '100%',
    avgClassLevel: 'Menengah (68%)',
    activeStreakRate: '89%',
    avgScore: '86.4 / 100',
    pendingGradingCount: 3
  },
  assignments: initialLecturerAssignments
};

// ============================================================
// === ADMIN DATA SECTION =====================================
// ============================================================

// Extended student list for Admin User Management
const initialStudents = [
  { id: 1, name: 'Nabila Putri', email: 'nabila@kampus.ac.id', nim: '2401082', role: 'mahasiswa', status: 'active', level: 4, levelName: 'Intermediate', xp: 2390, streak: 14, lastActivity: '07 Oct 2026', quizAvg: 92, completedMaterials: 4, completedQuizzes: 18, avgScore: 92, longestStreak: 20 },
  { id: 2, name: 'Budi Santoso', email: 'budi@kampus.ac.id', nim: '2401001', role: 'mahasiswa', status: 'active', level: 4, levelName: 'Intermediate', xp: 2450, streak: 14, lastActivity: '07 Oct 2026', quizAvg: 85, completedMaterials: 3, completedQuizzes: 15, avgScore: 85, longestStreak: 21 },
  { id: 3, name: 'Siti Aminah', email: 'siti@kampus.ac.id', nim: '2401002', role: 'mahasiswa', status: 'active', level: 5, levelName: 'Advanced Learner', xp: 2850, streak: 12, lastActivity: '07 Oct 2026', quizAvg: 95, completedMaterials: 4, completedQuizzes: 22, avgScore: 95, longestStreak: 18 },
  { id: 4, name: 'Raka Pratama', email: 'raka@kampus.ac.id', nim: '2401003', role: 'mahasiswa', status: 'active', level: 3, levelName: 'English Explorer', xp: 1820, streak: 9, lastActivity: '06 Oct 2026', quizAvg: 80, completedMaterials: 3, completedQuizzes: 12, avgScore: 80, longestStreak: 15 },
  { id: 5, name: 'Dimas Aditya', email: 'dimas@kampus.ac.id', nim: '2401015', role: 'mahasiswa', status: 'active', level: 3, levelName: 'English Explorer', xp: 1650, streak: 8, lastActivity: '06 Oct 2026', quizAvg: 78, completedMaterials: 2, completedQuizzes: 10, avgScore: 78, longestStreak: 12 },
  { id: 6, name: 'Anisa Rahmawati', email: 'anisa@kampus.ac.id', nim: '2401022', role: 'mahasiswa', status: 'active', level: 4, levelName: 'Intermediate', xp: 2100, streak: 11, lastActivity: '07 Oct 2026', quizAvg: 88, completedMaterials: 4, completedQuizzes: 16, avgScore: 88, longestStreak: 17 },
  { id: 7, name: 'Farhan Maulana', email: 'farhan@kampus.ac.id', nim: '2401034', role: 'mahasiswa', status: 'active', level: 2, levelName: 'English Learner', xp: 820, streak: 4, lastActivity: '05 Oct 2026', quizAvg: 68, completedMaterials: 1, completedQuizzes: 6, avgScore: 68, longestStreak: 7 },
  { id: 8, name: 'Tiara Larasati', email: 'tiara@kampus.ac.id', nim: '2401041', role: 'mahasiswa', status: 'active', level: 3, levelName: 'English Explorer', xp: 1480, streak: 7, lastActivity: '06 Oct 2026', quizAvg: 82, completedMaterials: 2, completedQuizzes: 11, avgScore: 82, longestStreak: 10 },
  { id: 9, name: 'Bayu Wicaksono', email: 'bayu@kampus.ac.id', nim: '2401053', role: 'mahasiswa', status: 'active', level: 3, levelName: 'English Explorer', xp: 1720, streak: 10, lastActivity: '07 Oct 2026', quizAvg: 84, completedMaterials: 3, completedQuizzes: 13, avgScore: 84, longestStreak: 14 },
  { id: 10, name: 'Clara Oktaviani', email: 'clara@kampus.ac.id', nim: '2401067', role: 'mahasiswa', status: 'active', level: 5, levelName: 'Advanced Learner', xp: 3120, streak: 15, lastActivity: '07 Oct 2026', quizAvg: 96, completedMaterials: 5, completedQuizzes: 24, avgScore: 96, longestStreak: 25 },
  { id: 11, name: 'Dimas Setiawan', email: 'dimas.s@kampus.ac.id', nim: '2401068', role: 'mahasiswa', status: 'inactive', level: 1, levelName: 'Beginner', xp: 200, streak: 0, lastActivity: '01 Oct 2026', quizAvg: 55, completedMaterials: 0, completedQuizzes: 2, avgScore: 55, longestStreak: 3 },
  { id: 12, name: 'Super Administrator', email: 'admin@educlass.ac.id', nim: '-', role: 'admin', status: 'active', level: null, levelName: null, xp: null, streak: null, lastActivity: '07 Oct 2026', quizAvg: null, completedMaterials: null, completedQuizzes: null, avgScore: null, longestStreak: null },
];

// Categories for material management
const initialCategories = [
  { id: 1, name: 'Vocabulary', description: 'Word meaning, synonyms, antonyms, and academic vocabulary', color: 'violet', materialCount: 1, icon: 'menu_book', status: 'active' },
  { id: 2, name: 'Grammar', description: 'Tenses, sentence structure, passive voice, conditionals', color: 'rose', materialCount: 2, icon: 'spellcheck', status: 'active' },
  { id: 3, name: 'Reading', description: 'Reading comprehension, skimming, scanning, inference', color: 'sky', materialCount: 1, icon: 'chrome_reader_mode', status: 'active' },
  { id: 4, name: 'Writing', description: 'Academic writing, paragraph structure, essay composition', color: 'lime', materialCount: 1, icon: 'edit_note', status: 'active' },
  { id: 5, name: 'Listening', description: 'Listening comprehension and conversation interpretation', color: 'teal', materialCount: 0, icon: 'headphones', status: 'active' },
  { id: 6, name: 'Conversation', description: 'Spoken English, academic dialogue, professional communication', color: 'indigo', materialCount: 0, icon: 'forum', status: 'active' },
  { id: 7, name: 'Academic English', description: 'Formal academic language, research writing, citation', color: 'fuchsia', materialCount: 0, icon: 'school', status: 'active' },
  { id: 8, name: 'Daily English', description: 'Everyday communication and practical English usage', color: 'emerald', materialCount: 0, icon: 'today', status: 'active' },
];

// Level system definitions
const initialLevels = [
  { id: 1, level: 1, name: 'Beginner', xpRequired: 0, badge: '🌱', color: 'gray', description: 'Starting your English learning journey', perks: 'Access to beginner materials' },
  { id: 2, level: 2, name: 'English Learner', xpRequired: 200, badge: '📖', color: 'blue', description: 'Building foundational English skills', perks: 'Access to vocabulary and basic grammar' },
  { id: 3, level: 3, name: 'English Explorer', xpRequired: 500, badge: '🔍', color: 'indigo', description: 'Exploring intermediate concepts', perks: 'Access to reading and listening modules' },
  { id: 4, level: 4, name: 'Intermediate', xpRequired: 1000, badge: '⭐', color: 'violet', description: 'Achieving solid English proficiency', perks: 'Access to quiz arena + intermediate materials' },
  { id: 5, level: 5, name: 'Advanced Learner', xpRequired: 2000, badge: '🏆', color: 'amber', description: 'Demonstrating advanced English mastery', perks: 'Unlock special quiz modes and rewards' },
  { id: 6, level: 6, name: 'English Master', xpRequired: 3500, badge: '👑', color: 'rose', description: 'The highest level of English proficiency', perks: 'All content unlocked + exclusive themes' },
];

// XP Configuration
const initialXpConfig = {
  completeModule: { label: 'Complete a Module', value: 80, description: 'XP earned when student completes a learning module' },
  completeQuizPass: { label: 'Pass Module Quiz', value: 100, description: 'XP earned when student passes a module quiz' },
  quizArenaComplete: { label: 'Complete Quiz Arena', value: 50, description: 'XP earned for completing a quiz arena session' },
  quizArenaHighScore: { label: 'Quiz Arena High Score Bonus', value: 25, description: 'Extra XP when scoring above 90%' },
  streak7Days: { label: '7-Day Streak Bonus', value: 50, description: 'XP bonus for maintaining a 7-day learning streak' },
  streak30Days: { label: '30-Day Streak Bonus', value: 150, description: 'XP bonus for maintaining a 30-day learning streak' },
  firstLogin: { label: 'First Login', value: 20, description: 'XP for first time logging in to the platform' },
  repeatQuiz: { label: 'Repeat Quiz (Max)', value: 0, description: 'XP from re-doing a quiz (0 = no repeat XP)' },
};

// Streak Configuration
const initialStreakConfig = {
  activitiesCountedForStreak: ['complete_module', 'complete_quiz', 'quiz_arena'],
  resetOnMissedDays: true,
  gracePeriodHours: 0,
  milestones: [
    { days: 7, xpBonus: 50, label: '7-Day Streak', badge: '🔥' },
    { days: 14, xpBonus: 80, label: '2-Week Streak', badge: '⚡' },
    { days: 30, xpBonus: 150, label: '30-Day Streak', badge: '💎' },
    { days: 60, xpBonus: 300, label: '60-Day Streak', badge: '👑' },
  ]
};

// Achievements
const initialAchievements = [
  { id: 1, name: 'First Step', description: 'Complete your first quiz', requirement: 'complete_quiz_1', requirementValue: 1, requirementLabel: 'Complete 1 quiz', icon: '🎯', xpBonus: 20, status: 'active', category: 'learning' },
  { id: 2, name: '7-Day Warrior', description: 'Maintain a 7-day learning streak', requirement: 'streak_7', requirementValue: 7, requirementLabel: 'Reach 7-day streak', icon: '🔥', xpBonus: 50, status: 'active', category: 'streak' },
  { id: 3, name: 'Perfect Score', description: 'Get 100% on any quiz', requirement: 'score_100', requirementValue: 100, requirementLabel: 'Score 100% on a quiz', icon: '💯', xpBonus: 30, status: 'active', category: 'performance' },
  { id: 4, name: 'Quiz Master', description: 'Complete 20 quizzes', requirement: 'complete_quiz_20', requirementValue: 20, requirementLabel: 'Complete 20 quizzes', icon: '🏆', xpBonus: 100, status: 'active', category: 'learning' },
  { id: 5, name: 'Consistent Learner', description: 'Maintain 30-day streak', requirement: 'streak_30', requirementValue: 30, requirementLabel: 'Reach 30-day streak', icon: '💎', xpBonus: 150, status: 'active', category: 'streak' },
  { id: 6, name: 'Module Scholar', description: 'Complete all available modules', requirement: 'complete_all_modules', requirementValue: 5, requirementLabel: 'Complete all 5 modules', icon: '📚', xpBonus: 200, status: 'active', category: 'learning' },
  { id: 7, name: 'Speed Learner', description: 'Complete 3 modules in one week', requirement: 'modules_week_3', requirementValue: 3, requirementLabel: 'Complete 3 modules in 7 days', icon: '⚡', xpBonus: 75, status: 'active', category: 'performance' },
  { id: 8, name: 'Grammar Guru', description: 'Pass all Grammar quizzes with 90+', requirement: 'grammar_90', requirementValue: 90, requirementLabel: 'Score 90%+ on all Grammar quizzes', icon: '✍️', xpBonus: 80, status: 'inactive', category: 'performance' },
];

// Rewards / Themes
const initialRewards = [
  { id: 'theme_default', name: 'Classic Bright', description: 'Clean bright default theme', type: 'theme', themeClass: 'bg-[#f8fafc]', requirement: 'default', requirementLabel: 'Available by default', icon: '☀️', status: 'active', preview: '#f8fafc' },
  { id: 'theme_slate', name: 'Midnight Slate', description: 'Dark and elegant dark mode theme', type: 'theme', themeClass: 'bg-slate-900', requirement: 'xp_500', requirementLabel: 'Reach 500 XP', icon: '🌑', status: 'active', preview: '#0f172a' },
  { id: 'theme_indigo', name: 'Deep Indigo', description: 'Deep blue-purple mystical theme', type: 'theme', themeClass: 'bg-indigo-950', requirement: 'xp_1000', requirementLabel: 'Reach 1000 XP', icon: '🌌', status: 'active', preview: '#1e1b4b' },
  { id: 'theme_emerald', name: 'Forest Emerald', description: 'Nature-inspired refreshing green', type: 'theme', themeClass: 'bg-emerald-950', requirement: 'xp_1500', requirementLabel: 'Reach 1500 XP', icon: '🌲', status: 'active', preview: '#022c22' },
  { id: 'theme_rose', name: 'Crimson Rose', description: 'Passionate dark red theme', type: 'theme', themeClass: 'bg-rose-950', requirement: 'xp_2000', requirementLabel: 'Reach 2000 XP', icon: '🌹', status: 'active', preview: '#4c0519' },
  { id: 'theme_amber', name: 'Golden Amber', description: 'Premium golden dark theme for high achievers', type: 'theme', themeClass: 'bg-[#1a1205]', requirement: 'xp_3000', requirementLabel: 'Reach 3000 XP', icon: '✨', status: 'active', preview: '#1a1205' },
  { id: 'bonus_lesson_500', name: 'Bonus Lesson Pack', description: 'Unlock exclusive bonus vocabulary lesson', type: 'content', themeClass: null, requirement: 'xp_500', requirementLabel: 'Reach 500 XP', icon: '🎁', status: 'active', preview: null },
  { id: 'special_quiz_1000', name: 'Special EELS Quiz', description: 'Unlock special EELS simulation quiz', type: 'content', themeClass: null, requirement: 'xp_1000', requirementLabel: 'Reach 1000 XP', icon: '🎯', status: 'active', preview: null },
];

// Activity Log
const initialActivityLog = [
  { id: 1, studentId: 10, studentName: 'Clara Oktaviani', activity: 'Completed Quiz', detail: 'Grammar Challenge', score: 96, xpEarned: 100, level: 5, date: '2026-10-07T10:15:00', type: 'quiz' },
  { id: 2, studentId: 3, studentName: 'Siti Aminah', activity: 'Completed Module', detail: 'Passive Voice in Research Paper', score: 95, xpEarned: 100, level: 5, date: '2026-10-07T09:40:00', type: 'module' },
  { id: 3, studentId: 1, studentName: 'Nabila Putri', activity: 'Completed Quiz', detail: 'Vocabulary Challenge', score: 90, xpEarned: 100, level: 4, date: '2026-10-07T09:10:00', type: 'quiz' },
  { id: 4, studentId: 2, studentName: 'Budi Santoso', activity: 'Quiz Arena', detail: 'Daily English Quiz', score: 85, xpEarned: 50, level: 4, date: '2026-10-07T08:55:00', type: 'arena' },
  { id: 5, studentId: 6, studentName: 'Anisa Rahmawati', activity: 'Achievement Unlocked', detail: '7-Day Warrior', score: null, xpEarned: 50, level: 4, date: '2026-10-07T08:30:00', type: 'achievement' },
  { id: 6, studentId: 9, studentName: 'Bayu Wicaksono', activity: 'Completed Module', detail: 'Academic Vocabulary Mastery', score: 80, xpEarned: 80, level: 3, date: '2026-10-06T21:20:00', type: 'module' },
  { id: 7, studentId: 4, studentName: 'Raka Pratama', activity: 'Level Up', detail: 'Reached English Explorer (Level 3)', score: null, xpEarned: 0, level: 3, date: '2026-10-06T18:45:00', type: 'level' },
  { id: 8, studentId: 8, studentName: 'Tiara Larasati', activity: 'Completed Quiz', detail: 'Reading Challenge', score: 78, xpEarned: 80, level: 3, date: '2026-10-06T17:00:00', type: 'quiz' },
  { id: 9, studentId: 5, studentName: 'Dimas Aditya', activity: 'Quiz Arena', detail: 'Mixed English Quiz', score: 72, xpEarned: 50, level: 3, date: '2026-10-06T15:30:00', type: 'arena' },
  { id: 10, studentId: 7, studentName: 'Farhan Maulana', activity: 'Completed Module', detail: 'Past Perfect vs Past Simple', score: 65, xpEarned: 80, level: 2, date: '2026-10-06T14:10:00', type: 'module' },
];

// Learning Paths
const initialLearningPaths = [
  {
    id: 1,
    name: 'Beginner English Path',
    description: 'Perfect starting path for English beginners',
    level: 'Beginner',
    status: 'active',
    items: [
      { order: 1, type: 'material', refId: 1, title: 'Academic Vocabulary Mastery', category: 'Vocabulary' },
      { order: 2, type: 'material', refId: 2, title: 'Past Perfect vs Past Simple', category: 'Grammar' },
    ]
  },
  {
    id: 2,
    name: 'Intermediate Research Writing Path',
    description: 'Develop academic and research writing skills',
    level: 'Intermediate',
    status: 'active',
    items: [
      { order: 1, type: 'material', refId: 2, title: 'Past Perfect vs Past Simple', category: 'Grammar' },
      { order: 2, type: 'material', refId: 3, title: 'Passive Voice in Research Paper', category: 'Grammar' },
      { order: 3, type: 'material', refId: 4, title: 'Academic Reading Comprehension', category: 'Reading' },
      { order: 4, type: 'material', refId: 5, title: 'Abstract & Thesis Argumentation', category: 'Writing' },
    ]
  },
];

// Platform Settings
const initialSettings = {
  general: {
    platformName: 'EduClass',
    tagline: 'Gamified English Learning Platform',
    defaultLanguage: 'id',
    semester: 'Semester Ganjil 2026/2027',
  },
  learning: {
    defaultMinScore: 60,
    allowRetake: true,
    maxRetakeAttempts: 3,
    completionRequiresPassing: true,
    showExplanationAfterQuiz: true,
  },
  gamification: {
    xpEnabled: true,
    streakEnabled: true,
    achievementsEnabled: true,
    rewardsEnabled: true,
    leaderboardEnabled: true,
  }
};

export const useDataStore = create((set) => ({
  materials: initialMaterials,
  userStats: initialUserStats,
  leaderboard: initialLeaderboard,
  dailyQuests: initialDailyQuests,
  shopItems: initialShopItems,
  inventory: ['theme_default'],
  bossBattle: initialBossBattle,
  lecturerData: initialLecturerData,
  rooms: initialRooms,
  activeRoomId: 'room-3b',
  lecturerAssignments: initialLecturerAssignments,
  manualSubmissions: initialManualSubmissions,
  studentGrades: initialStudentGrades,

  // === ADMIN DATA ===
  students: initialStudents,
  categories: initialCategories,
  levels: initialLevels,
  xpConfig: initialXpConfig,
  streakConfig: initialStreakConfig,
  achievements: initialAchievements,
  rewards: initialRewards,
  activityLog: initialActivityLog,
  learningPaths: initialLearningPaths,
  settings: initialSettings,

  // === ADMIN ACTIONS ===

  // Student management
  updateStudentStatus: (studentId, status) => set((state) => ({
    students: state.students.map(s => s.id === studentId ? { ...s, status } : s)
  })),
  deleteStudent: (studentId) => set((state) => ({
    students: state.students.filter(s => s.id !== studentId)
  })),
  addStudent: (student) => set((state) => ({
    students: [{ id: Date.now(), ...student }, ...state.students]
  })),
  updateStudent: (studentId, data) => set((state) => ({
    students: state.students.map(s => s.id === studentId ? { ...s, ...data } : s)
  })),

  // Material management
  addMaterial: (material) => set((state) => ({
    materials: [...state.materials, { id: Date.now(), ...material }]
  })),
  updateMaterial: (materialId, data) => set((state) => ({
    materials: state.materials.map(m => m.id === materialId ? { ...m, ...data } : m)
  })),
  deleteMaterial: (materialId) => set((state) => ({
    materials: state.materials.filter(m => m.id !== materialId)
  })),
  publishMaterial: (materialId) => set((state) => ({
    materials: state.materials.map(m => m.id === materialId ? { ...m, publishStatus: 'published' } : m)
  })),

  // Category management
  addCategory: (category) => set((state) => ({
    categories: [...state.categories, { id: Date.now(), materialCount: 0, ...category }]
  })),
  updateCategory: (categoryId, data) => set((state) => ({
    categories: state.categories.map(c => c.id === categoryId ? { ...c, ...data } : c)
  })),
  deleteCategory: (categoryId) => set((state) => ({
    categories: state.categories.filter(c => c.id !== categoryId)
  })),

  // Level management
  updateLevel: (levelId, data) => set((state) => ({
    levels: state.levels.map(l => l.id === levelId ? { ...l, ...data } : l)
  })),
  addLevel: (level) => set((state) => ({
    levels: [...state.levels, { id: Date.now(), ...level }].sort((a, b) => a.level - b.level)
  })),
  deleteLevel: (levelId) => set((state) => ({
    levels: state.levels.filter(l => l.id !== levelId)
  })),

  // XP config
  updateXpConfig: (key, value) => set((state) => ({
    xpConfig: { ...state.xpConfig, [key]: { ...state.xpConfig[key], value } }
  })),

  // Streak config
  updateStreakConfig: (data) => set((state) => ({
    streakConfig: { ...state.streakConfig, ...data }
  })),

  // Achievement management
  addAchievement: (achievement) => set((state) => ({
    achievements: [...state.achievements, { id: Date.now(), ...achievement }]
  })),
  updateAchievement: (achievementId, data) => set((state) => ({
    achievements: state.achievements.map(a => a.id === achievementId ? { ...a, ...data } : a)
  })),
  deleteAchievement: (achievementId) => set((state) => ({
    achievements: state.achievements.filter(a => a.id !== achievementId)
  })),

  // Reward management
  addReward: (reward) => set((state) => ({
    rewards: [...state.rewards, { id: `reward_${Date.now()}`, ...reward }]
  })),
  updateReward: (rewardId, data) => set((state) => ({
    rewards: state.rewards.map(r => r.id === rewardId ? { ...r, ...data } : r)
  })),
  deleteReward: (rewardId) => set((state) => ({
    rewards: state.rewards.filter(r => r.id !== rewardId)
  })),

  // Activity log
  addActivity: (activity) => set((state) => ({
    activityLog: [{ id: Date.now(), date: new Date().toISOString(), ...activity }, ...state.activityLog]
  })),

  // Learning path management
  addLearningPath: (path) => set((state) => ({
    learningPaths: [...state.learningPaths, { id: Date.now(), items: [], ...path }]
  })),
  updateLearningPath: (pathId, data) => set((state) => ({
    learningPaths: state.learningPaths.map(p => p.id === pathId ? { ...p, ...data } : p)
  })),
  deleteLearningPath: (pathId) => set((state) => ({
    learningPaths: state.learningPaths.filter(p => p.id !== pathId)
  })),

  // Settings
  updateSettings: (section, data) => set((state) => ({
    settings: { ...state.settings, [section]: { ...state.settings[section], ...data } }
  })),


  setActiveRoom: (roomId) => set((state) => {
    const selectedRoom = state.rooms.find(r => r.id === roomId);
    if (!selectedRoom) return state;
    return {
      activeRoomId: roomId,
      lecturerData: {
        ...state.lecturerData,
        className: selectedRoom.name,
        semester: selectedRoom.semester,
        metrics: {
          ...state.lecturerData.metrics,
          totalStudents: selectedRoom.totalStudents,
          avgClassLevel: selectedRoom.avgLevel,
          activeStreakRate: selectedRoom.streakRate,
          avgScore: `${selectedRoom.avgScore} / 100`
        }
      }
    };
  }),

  // Lecturer Room Creation
  createRoom: (newRoom) => set((state) => {
    const fullRoom = {
      id: `room-${Date.now()}`,
      totalStudents: 0,
      avgLevel: 'Menunggu Tes',
      streakRate: '0%',
      avgScore: '0',
      ...newRoom
    };
    return {
      rooms: [fullRoom, ...state.rooms],
      activeRoomId: fullRoom.id,
      lecturerData: {
        ...state.lecturerData,
        className: fullRoom.name
      }
    };
  }),

  // Lecturer Hybrid Assignment Creation
  createAssignment: (newAsg) => set((state) => {
    const created = {
      id: `asg-${Date.now()}`,
      roomId: state.activeRoomId,
      submittedCount: 0,
      totalCount: state.lecturerData.metrics.totalStudents || 38,
      status: 'active',
      ...newAsg
    };
    const updatedAssignments = [created, ...state.lecturerAssignments];
    return {
      lecturerAssignments: updatedAssignments,
      lecturerData: {
        ...state.lecturerData,
        assignments: updatedAssignments
      }
    };
  }),

  // Lecturer Manual Grading (Rubrics)
  gradeSubmission: (submissionId, { grammarScore, vocabScore, fluencyScore, feedback }) => set((state) => {
    const finalScore = Math.round((Number(grammarScore) + Number(vocabScore) + Number(fluencyScore)) / 3);
    const updatedSubmissions = state.manualSubmissions.map((sub) => {
      if (sub.id === submissionId) {
        return {
          ...sub,
          status: 'graded',
          grammarScore: Number(grammarScore),
          vocabScore: Number(vocabScore),
          fluencyScore: Number(fluencyScore),
          finalScore,
          feedback
        };
      }
      return sub;
    });

    // Also update studentGrades table
    const targetSub = state.manualSubmissions.find(s => s.id === submissionId);
    let updatedGrades = state.studentGrades;
    if (targetSub) {
      updatedGrades = state.studentGrades.map((grade) => {
        if (grade.nim === targetSub.nim) {
          const newAssignmentAvg = Math.round((grade.assignmentAvg + finalScore) / 2);
          const newFinalScore = Number(((grade.quizAvg * 0.4) + (newAssignmentAvg * 0.6)).toFixed(1));
          let letterGrade = 'B';
          if (newFinalScore >= 85) letterGrade = 'A';
          else if (newFinalScore >= 80) letterGrade = 'A-';
          else if (newFinalScore >= 75) letterGrade = 'B+';
          else if (newFinalScore >= 70) letterGrade = 'B';
          else if (newFinalScore >= 65) letterGrade = 'C+';
          return {
            ...grade,
            assignmentAvg: newAssignmentAvg,
            finalScore: newFinalScore,
            letterGrade,
            status: newFinalScore >= 70 ? 'Lulus' : 'Perlu Perhatian'
          };
        }
        return grade;
      });
    }

    const pendingCount = updatedSubmissions.filter(s => s.status === 'pending').length;

    return {
      manualSubmissions: updatedSubmissions,
      studentGrades: updatedGrades,
      lecturerData: {
        ...state.lecturerData,
        metrics: {
          ...state.lecturerData.metrics,
          pendingGradingCount: pendingCount
        }
      }
    };
  }),

  // Add XP and handle leveling
  addXP: (amount) => set((state) => {
    const newXP = state.userStats.total_xp + amount;
    const newLevel = Math.floor(newXP / 180) + 1;
    return {
      userStats: {
        ...state.userStats,
        total_xp: newXP,
        level: newLevel,
      }
    };
  }),

  // Add & Spend Gems
  addGems: (amount) => set((state) => ({
    userStats: { ...state.userStats, gems: state.userStats.gems + amount }
  })),

  spendGems: (amount) => set((state) => {
    if (state.userStats.gems < amount) return state;
    return {
      userStats: { ...state.userStats, gems: state.userStats.gems - amount }
    };
  }),

  // Hearts logic (Duolingo style)
  deductHeart: () => set((state) => ({
    userStats: { ...state.userStats, hearts: Math.max(0, state.userStats.hearts - 1) }
  })),

  restoreHearts: () => set((state) => ({
    userStats: { ...state.userStats, hearts: state.userStats.maxHearts }
  })),

  // Mark material complete & unlock next
  completeMaterialAndUnlockNext: (materialId, score) => set((state) => {
    const idx = state.materials.findIndex(m => m.id === materialId);
    const material = state.materials[idx];
    const passed = score >= (material?.min_score || 60);

    const updatedMaterials = state.materials.map((m, i) => {
      if (m.id === materialId) {
        return {
          ...m,
          status: 'completed',
          stars: passed ? 3 : 1,
          last_score: score
        };
      }
      if (i === idx + 1 && passed) {
        return {
          ...m,
          status: m.status === 'locked' ? 'active' : m.status
        };
      }
      return m;
    });

    return {
      materials: updatedMaterials,
      userStats: {
        ...state.userStats,
        total_completed_materials: updatedMaterials.filter(m => m.status === 'completed').length,
        gems: state.userStats.gems + 50
      }
    };
  }),

  // Boss Battle damage action
  damageBoss: (amount) => set((state) => {
    const newHp = Math.max(0, state.bossBattle.currentHp - amount);
    return {
      bossBattle: {
        ...state.bossBattle,
        currentHp: newHp
      }
    };
  }),

  // Buy item from shop (Now using Gems)
  buyItem: (itemId) => set((state) => {
    const item = state.shopItems.find(i => i.id === itemId);
    if (!item || state.userStats.gems < item.priceGems) return state;
    
    return {
      userStats: {
        ...state.userStats,
        gems: state.userStats.gems - item.priceGems
      },
      inventory: [...state.inventory, itemId]
    };
  }),

  // Set active background theme
  setActiveTheme: (themeClass) => set((state) => ({
    userStats: {
      ...state.userStats,
      activeTheme: themeClass
    }
  }))
}));
