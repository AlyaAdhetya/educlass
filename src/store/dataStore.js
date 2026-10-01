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
    id: 'perk_double_xp',
    category: 'perks',
    name: 'Elixir of Enlightenment (2x XP)',
    description: 'Lipatgandakan perolehan XP untuk 30 menit ke depan saat mengerjakan kuis atau boss.',
    priceGems: 150,
    icon: 'bolt',
    accentColor: 'indigo'
  },
  {
    id: 'perk_streak_freeze',
    category: 'perks',
    name: 'Frost Guardian (Streak Freeze)',
    description: 'Melindungi streak belajarmu dari reset jika kamu melewatkan sesi 1 hari.',
    priceGems: 200,
    icon: 'ac_unit',
    accentColor: 'sky'
  },
  {
    id: 'perk_heart_refill',
    category: 'perks',
    name: 'Vitality Core (Isi 5 Nyawa)',
    description: 'Langsung pulihkan 5 nyawa agar bisa terus berlatih kuis tanpa jeda tunggu.',
    priceGems: 100,
    icon: 'favorite',
    accentColor: 'rose'
  },
  {
    id: 'avatar_laurel',
    category: 'avatar',
    name: 'Mahkota Daun Perak (Silver Laurels)',
    description: 'Ornamen kepala eksklusif untuk mahasiswa berprestasi di Top 3 Divisi.',
    priceGems: 350,
    icon: 'workspace_premium',
    accentColor: 'amber'
  },
  {
    id: 'avatar_robe',
    category: 'avatar',
    name: 'Jubah Wisudawan Archmage',
    description: 'Jubah akademik berhiaskan runic glow ungu dengan bordir emas.',
    priceGems: 450,
    icon: 'styler',
    accentColor: 'purple'
  },
  {
    id: 'avatar_grimoire',
    category: 'avatar',
    name: 'Grimoire Kamus Oxford Legendaris',
    description: 'Buku mantra kuno berisi kamus idiomatik bahasa Inggris tingkat C2.',
    priceGems: 500,
    icon: 'menu_book',
    accentColor: 'emerald'
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

export const useDataStore = create((set) => ({
  materials: initialMaterials,
  userStats: initialUserStats,
  leaderboard: initialLeaderboard,
  dailyQuests: initialDailyQuests,
  shopItems: initialShopItems,
  inventory: ['perk_streak_freeze'],
  bossBattle: initialBossBattle,
  lecturerData: initialLecturerData,
  rooms: initialRooms,
  activeRoomId: 'room-3b',
  lecturerAssignments: initialLecturerAssignments,
  manualSubmissions: initialManualSubmissions,
  studentGrades: initialStudentGrades,

  // Lecturer Room Switcher
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

  // Buy item from shop
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
  })
}));
