import React from 'react';
import { motion } from 'framer-motion';
import EduMascot from './EduMascot';

/**
 * EduLogo - Logo Resmi EduClass dengan Maskot Kitsu the Scholar Fox
 * Digunakan di Navbar, Halaman Login/Register, Footer, dan Splash.
 */
export default function EduLogo({
  size = 'md',
  showSubtitle = true,
  className = '',
}) {
  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* 3D Owl Mascot Avatar */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-9 h-9 rounded-xl overflow-hidden shadow-xs border border-blue-200 bg-blue-50 flex items-center justify-center shrink-0"
      >
        <img
          src="/mascot.jpg"
          alt="EduClass Mascot"
          className="w-full h-full object-cover object-top"
        />
      </motion.div>

      {/* Brand Typography */}
      <div className="flex items-center gap-1.5">
        <span className="font-black text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
          Edu<span className="text-blue-600">Class</span>
        </span>
        <span className="text-[9px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
          ACADEMIC
        </span>
      </div>
    </div>
  );
}
