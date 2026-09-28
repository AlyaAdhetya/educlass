import React, { useRef } from 'react';
import { Lottie } from 'lottie-react';
import EduMascot from './EduMascot';

/**
 * Lottie JSON Animation Presets
 * Ringan, murni vektor 60 FPS, tidak pecah di resolusi tinggi.
 */

// Preset 1: Confetti & Sparkles Celebration
const celebrationLottie = {
  v: '5.5.7',
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: 'Celebration',
  ddd: 0,
  assets: [],
  layers: [
    // Confetti particles radiating
    ...[-60, -30, 0, 30, 60, 90, 120, 150, 180, 210, 240, 270].map((deg, i) => {
      const colors = [
        [0.98, 0.75, 0.15], // Gold
        [0.39, 0.4, 0.95], // Violet
        [0.06, 0.73, 0.5], // Emerald
        [0.96, 0.25, 0.37], // Coral
      ];
      const c = colors[i % colors.length];
      const rad = (deg * Math.PI) / 180;
      const x1 = Math.cos(rad) * 15;
      const y1 = Math.sin(rad) * 15;
      const x2 = Math.cos(rad) * 85;
      const y2 = Math.sin(rad) * 85;

      return {
        ddd: 0,
        ind: i + 1,
        ty: 4,
        nm: `Particle_${i}`,
        sr: 1,
        ks: {
          o: {
            a: 1,
            k: [
              { t: 0, s: [100], e: [100] },
              { t: 40, s: [100], e: [0] },
              { t: 60, s: [0] },
            ],
          },
          r: { a: 1, k: [{ t: 0, s: [0] }, { t: 60, s: [deg * 2] }] },
          p: {
            a: 1,
            k: [
              { t: 0, s: [100 + x1, 100 + y1, 0] },
              { t: 50, s: [100 + x2, 100 + y2, 0] },
            ],
          },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              { t: 0, s: [0, 0, 100] },
              { t: 15, s: [140, 140, 100] },
              { t: 60, s: [40, 40, 100] },
            ],
          },
        },
        ao: 0,
        shapes: [
          {
            ty: 'gr',
            it: [
              {
                ty: 'rc',
                d: 1,
                s: { a: 0, k: [10, 10] },
                p: { a: 0, k: [0, 0] },
                r: { a: 0, k: 3 },
              },
              {
                ty: 'fl',
                c: { a: 0, k: [...c, 1] },
                o: { a: 0, k: 100 },
              },
              {
                ty: 'tr',
                p: { a: 0, k: [0, 0] },
                a: { a: 0, k: [0, 0] },
                s: { a: 0, k: [100, 100] },
                r: { a: 0, k: 0 },
                o: { a: 0, k: 100 },
              },
            ],
          },
        ],
        ip: 0,
        op: 60,
        st: 0,
      };
    }),
  ],
};

// Preset 2: Streak Fire Flame
const fireStreakLottie = {
  v: '5.5.7',
  fr: 30,
  ip: 0,
  op: 45,
  w: 120,
  h: 120,
  nm: 'FireStreak',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'InnerFlame',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 1, k: [{ t: 0, s: [-3] }, { t: 22, s: [3] }, { t: 45, s: [-3] }] },
        p: { a: 0, k: [60, 65, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [95, 95, 100] },
            { t: 22, s: [105, 115, 100] },
            { t: 45, s: [95, 95, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              ty: 'el',
              d: 1,
              p: { a: 0, k: [0, 0] },
              s: { a: 0, k: [36, 48] },
            },
            {
              ty: 'fl',
              c: { a: 0, k: [0.98, 0.62, 0.08, 1] }, // Amber 500
              o: { a: 0, k: 90 },
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
        },
      ],
      ip: 0,
      op: 45,
      st: 0,
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: 'CoreGlow',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [60, 70, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [80, 80, 100] },
            { t: 22, s: [110, 110, 100] },
            { t: 45, s: [80, 80, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              ty: 'el',
              d: 1,
              p: { a: 0, k: [0, 0] },
              s: { a: 0, k: [22, 28] },
            },
            {
              ty: 'fl',
              c: { a: 0, k: [1, 0.95, 0.4, 1] }, // Bright Yellow
              o: { a: 0, k: 100 },
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
        },
      ],
      ip: 0,
      op: 45,
      st: 0,
    },
  ],
};

// Preset Map
const LOTTIE_PRESETS = {
  celebrate: celebrationLottie,
  confetti: celebrationLottie,
  fire: fireStreakLottie,
  streak: fireStreakLottie,
};

/**
 * LottieCharacter Component
 * Mendemonstrasikan penggunaan Lottie JSON animation di EduClass
 * dengan fallback ke EduMascot.
 */
export default function LottieCharacter({
  type = 'celebrate', // 'celebrate' | 'fire' | 'custom'
  animationData = null,
  loop = true,
  autoplay = true,
  size = 'md',
  className = '',
  speech = '',
  withMascot = false,
}) {
  const lottieRef = useRef(null);
  const data = animationData || LOTTIE_PRESETS[type] || celebrationLottie;

  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    hero: 'w-48 h-48',
  };

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble jika ada */}
      {speech && (
        <div className="mb-2 px-3 py-1 bg-white text-slate-800 rounded-xl text-xs font-bold shadow-md border-2 border-indigo-100 flex items-center gap-1.5 z-20">
          <span>{speech}</span>
        </div>
      )}

      <div className="relative flex items-center justify-center">
        {/* Karakter Kitsu di latar belakang jika withMascot = true */}
        {withMascot && (
          <div className="absolute inset-0 flex items-center justify-center -z-10 scale-90">
            <EduMascot mood={type === 'fire' ? 'fire' : 'celebrate'} size={size} />
          </div>
        )}

        {/* Lottie Animation Canvas */}
        <div className={`${sizeMap[size] || sizeMap.md} flex items-center justify-center pointer-events-none`}>
          <Lottie
            lottieRef={lottieRef}
            animationData={data}
            loop={loop}
            autoplay={autoplay}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </div>
  );
}
