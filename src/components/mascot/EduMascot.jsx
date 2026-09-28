import React from 'react';
import { motion } from 'framer-motion';

/**
 * Kitsu the Scholar Fox - Maskot Resmi & Ikon EduClass
 * Karakter rubah pintar (clever fox) ber-toga akademik, berkacamata emas,
 * dengan ekspresi interaktif, telinga bergerak, dan ekor berayun.
 * 100% orisinal, bebas dari kemiripan burung hantu (Duolingo)!
 */
export default function EduMascot({
  mood = 'happy', // 'happy' | 'cheer' | 'thinking' | 'fire' | 'celebrate'
  speech = '',
  size = 'md', // 'xs' | 'sm' | 'md' | 'lg' | 'hero'
  className = '',
  showTail = true,
  onClick,
}) {
  const sizeMap = {
    xs: { box: 'w-8 h-8', svg: 32 },
    sm: { box: 'w-11 h-11', svg: 44 },
    md: { box: 'w-16 h-16', svg: 64 },
    lg: { box: 'w-24 h-24', svg: 96 },
    hero: { box: 'w-36 h-36', svg: 144 },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Animasi tubuh berdasarkan mood
  const bodyAnimation = {
    celebrate: {
      y: [0, -12, 0],
      rotate: [0, -4, 4, 0],
      transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
    },
    cheer: {
      y: [0, -8, 0],
      scale: [1, 1.05, 1],
      transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' },
    },
    fire: {
      scale: [1, 1.08, 0.98, 1],
      y: [0, -4, 0],
      transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
    },
    thinking: {
      rotate: [0, -6, -2, 0],
      y: [0, -2, 0],
      transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
    },
    happy: {
      y: [0, -4, 0],
      transition: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
    },
  }[mood] || { y: [0, -4, 0], transition: { duration: 2.2, repeat: Infinity } };

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none ${className}`}
      onClick={onClick}
    >
      {/* Balon Ucapan (Speech Bubble) */}
      {speech && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          className="mb-2 relative px-3 py-1.5 bg-white text-slate-800 rounded-xl text-xs font-bold shadow-lg border-2 border-indigo-100 whitespace-nowrap flex items-center gap-1.5 z-20"
        >
          <span>{speech}</span>
          {mood === 'fire' && <span className="text-orange-500">🔥</span>}
          {mood === 'cheer' && <span className="text-yellow-500">⭐</span>}
          {mood === 'thinking' && <span className="text-indigo-500">💡</span>}
          {/* Ekor balon */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-indigo-100 rotate-45" />
        </motion.div>
      )}

      {/* Kontainer Avatar Maskot */}
      <motion.div
        animate={bodyAnimation}
        whileHover={{ scale: 1.1, rotate: 2 }}
        whileTap={{ scale: 0.94 }}
        className={`${currentSize.box} relative flex items-center justify-center cursor-pointer`}
      >
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          <defs>
            {/* Gradien Bulu Oranye Kitsu */}
            <linearGradient id="foxFur" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>

            {/* Gradien Topi Wisuda */}
            <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#312E81" />
              <stop offset="100%" stopColor="#1E1B4B" />
            </linearGradient>

            {/* Gradien Jubah Akademik */}
            <linearGradient id="robeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#4338CA" />
            </linearGradient>

            {/* Glow Aura untuk Mood Fire / Streak */}
            <filter id="fireGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Lingkaran Latar Belakang (Aura / Badge) */}
          <circle
            cx="60"
            cy="64"
            r="48"
            fill={
              mood === 'fire'
                ? '#FFF7ED'
                : mood === 'celebrate'
                ? '#FEF3C7'
                : '#EEF2FF'
            }
            stroke={
              mood === 'fire'
                ? '#F97316'
                : mood === 'celebrate'
                ? '#F59E0B'
                : '#818CF8'
            }
            strokeWidth="3.5"
            strokeDasharray={mood === 'fire' ? '5 3' : 'none'}
          />

          {/* Ekor Rubah Berbulu (Fluffy Tail) */}
          {showTail && (
            <motion.g
              animate={{ rotate: [-6, 6, -6] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '85px 85px' }}
            >
              <path
                d="M 75 75 C 95 65 112 72 108 92 C 105 106 85 100 78 88 Z"
                fill="url(#foxFur)"
              />
              {/* Ujung Ekor Putih */}
              <path
                d="M 102 74 C 110 80 108 90 100 95 C 98 88 98 80 102 74 Z"
                fill="#FFFFFF"
              />
            </motion.g>
          )}

          {/* Jubah Akademik (Scholar Robe) */}
          <path
            d="M 36 78 C 36 68 84 68 84 78 L 88 100 C 88 104 32 104 32 100 Z"
            fill="url(#robeGrad)"
          />
          {/* Kerah Jubah V Putih */}
          <path
            d="M 50 74 L 60 88 L 70 74 Z"
            fill="#FFFFFF"
          />
          {/* Dasi Pita Emas */}
          <circle cx="60" cy="88" r="3.5" fill="#F59E0B" />
          <path d="M 58 89 L 55 98 L 60 95 L 65 98 L 62 89 Z" fill="#F59E0B" />

          {/* Telinga Kiri Rubah */}
          <motion.g
            animate={{ rotate: mood === 'thinking' ? [-4, 6, -4] : [-2, 3, -2] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '36px 38px' }}
          >
            <polygon
              points="24,42 36,16 48,38"
              fill="url(#foxFur)"
            />
            {/* Bagian Dalam Telinga Kiri (Pink Fluff) */}
            <polygon
              points="28,39 36,24 44,37"
              fill="#FBCFE8"
            />
            <path
              d="M 24 42 L 36 16"
              stroke="#C2410C"
              strokeWidth="1.5"
            />
          </motion.g>

          {/* Telinga Kanan Rubah */}
          <motion.g
            animate={{ rotate: mood === 'thinking' ? [4, -6, 4] : [2, -3, 2] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
            style={{ transformOrigin: '84px 38px' }}
          >
            <polygon
              points="72,38 84,16 96,42"
              fill="url(#foxFur)"
            />
            {/* Bagian Dalam Telinga Kanan (Pink Fluff) */}
            <polygon
              points="76,37 84,24 92,39"
              fill="#FBCFE8"
            />
            <path
              d="M 96 42 L 84 16"
              stroke="#C2410C"
              strokeWidth="1.5"
            />
          </motion.g>

          {/* Kepala Rubah (Fox Head) */}
          <ellipse
            cx="60"
            cy="52"
            rx="28"
            ry="24"
            fill="url(#foxFur)"
          />

          {/* Pipi Berbulu Kiri & Kanan (Fox Fur Tuft) */}
          <polygon points="30,55 22,60 32,66" fill="url(#foxFur)" />
          <polygon points="90,55 98,60 88,66" fill="url(#foxFur)" />

          {/* Moncong Putih Bagian Bawah (White Muzzle) */}
          <path
            d="M 40 56 C 40 48 80 48 80 56 C 80 72 40 72 40 56 Z"
            fill="#FFFFFF"
          />

          {/* Blush Pipi Merah Muda */}
          <circle cx="39" cy="58" r="4" fill="#FCA5A5" opacity="0.6" />
          <circle cx="81" cy="58" r="4" fill="#FCA5A5" opacity="0.6" />

          {/* Hidung Hitam Imut */}
          <ellipse cx="60" cy="58" rx="3.5" ry="2.5" fill="#1E293B" />

          {/* Mulut Tersenyum (w style) */}
          <path
            d="M 54 62 Q 57 65 60 62 Q 63 65 66 62"
            fill="none"
            stroke="#1E293B"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Mata Cerdas & Kacamata Emas */}
          {mood === 'celebrate' || mood === 'cheer' ? (
            /* Mata Lengkung Bahagia (^ ^) */
            <>
              <path
                d="M 44 48 Q 48 43 52 48"
                fill="none"
                stroke="#1E293B"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d="M 68 48 Q 72 43 76 48"
                fill="none"
                stroke="#1E293B"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </>
          ) : (
            /* Mata Bulat Cerdas dengan Kilau */
            <>
              <circle cx="48" cy="48" r="5" fill="#1E293B" />
              <circle cx="46.5" cy="46.5" r="1.8" fill="#FFFFFF" />
              <circle cx="72" cy="48" r="5" fill="#1E293B" />
              <circle cx="70.5" cy="46.5" r="1.8" fill="#FFFFFF" />
            </>
          )}

          {/* Kacamata Bulat Akademik Emas (Smart Glasses) */}
          <circle
            cx="48"
            cy="48"
            r="9"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2.2"
          />
          <circle
            cx="72"
            cy="48"
            r="9"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2.2"
          />
          {/* Jembatan Kacamata */}
          <path
            d="M 57 48 Q 60 46 63 48"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2.2"
          />

          {/* Topi Wisuda Akademik (Mortarboard Cap) */}
          <g>
            {/* Mahkota Belah Ketupat */}
            <polygon
              points="60,20 86,29 60,37 34,29"
              fill="url(#capGrad)"
              stroke="#4338CA"
              strokeWidth="1.2"
            />
            {/* Dudukan Topi */}
            <path
              d="M 45 32 L 45 37 C 45 42 75 42 75 37 L 75 32 Z"
              fill="#1E1B4B"
            />
            {/* Kancing Emas Tengah */}
            <circle cx="60" cy="28.5" r="2.5" fill="#FBBF24" />

            {/* Rumbai Emas Berayun (Swinging Golden Tassel) */}
            <motion.path
              d="M 60 28.5 Q 74 30 78 40 L 78 46"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeLinecap="round"
              animate={{
                d: [
                  'M 60 28.5 Q 74 30 78 40 L 78 46',
                  'M 60 28.5 Q 76 31 82 41 L 82 47',
                  'M 60 28.5 Q 74 30 78 40 L 78 46',
                ],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <circle cx="78" cy="46" r="2" fill="#D97706" />
          </g>

          {/* Efek Bintang / Api Ekstra */}
          {mood === 'fire' && (
            <text x="50" y="14" fontSize="16" className="select-none">
              🔥
            </text>
          )}
          {mood === 'celebrate' && (
            <text x="18" y="24" fontSize="14" className="select-none animate-bounce">
              ✨
            </text>
          )}
          {mood === 'celebrate' && (
            <text x="86" y="24" fontSize="14" className="select-none animate-bounce">
              🎉
            </text>
          )}
          {mood === 'thinking' && (
            <text x="84" y="22" fontSize="14" className="select-none">
              💡
            </text>
          )}
        </svg>
      </motion.div>
    </div>
  );
}
