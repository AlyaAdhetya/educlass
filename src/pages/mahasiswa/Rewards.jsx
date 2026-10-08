import React, { useState } from 'react';
import { useDataStore } from '../../store/dataStore';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function ScholarShop() {
  const { userStats, shopItems, inventory, buyItem, setActiveTheme } = useDataStore();
  const [purchaseSuccess, setPurchaseSuccess] = useState('');

  const filteredItems = shopItems; // Only themes now

  const handleBuy = (item) => {
    if (userStats.gems < item.priceGems) {
      alert('Permata tidak cukup! Selesaikan kuis atau misi harian untuk menambah permata.');
      return;
    }
    buyItem(item.id);
    setActiveTheme(item.themeClass);
    setPurchaseSuccess(`Berhasil mendapatkan tema ${item.name}!`);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 },
    });
    setTimeout(() => setPurchaseSuccess(''), 3000);
  };

  const handleEquip = (item) => {
    setActiveTheme(item.themeClass);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 space-y-8">
      {/* ================= HERO BANNER: DAILY FREE MYSTERY CHEST ================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-600 p-6 md:p-8 text-white shadow-lg border-b-[6px] border-indigo-950">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-extrabold tracking-wide uppercase">
              <span className="material-symbols-outlined text-sm text-amber-300 fill-icon">stars</span>
              Bonus Harian Mahasiswa
            </div>
            <h1 className="text-xl md:text-3xl font-black tracking-tight leading-tight">
              Toko Tema & Warna Latar
            </h1>
            <p className="text-xs md:text-sm text-white/90 leading-relaxed">
              Tukarkan Permata (Gems) hasil belajar dengan tema warna latar belakang eksklusif. Kumpulkan lebih banyak permata dari kuis!
            </p>
          </div>

        </div>
      </section>

      {/* Success alert */}
      {purchaseSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-black flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-emerald-600 fill-icon text-base">check_circle</span>
          {purchaseSuccess}
        </motion.div>
      )}

      {/* ================= CATALOG GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-indigo-100">
        {filteredItems.map((item) => {
          const isOwned = inventory.includes(item.id);
          const isActive = userStats.activeTheme === item.themeClass;
          
          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              className={`bg-white rounded-3xl p-5 border shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                isActive ? 'border-amber-400 ring-2 ring-amber-100' : 'border-indigo-100'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-2xs text-${item.accentColor}-600 bg-${item.accentColor}-50 border-${item.accentColor}-100`}>
                    <span className="material-symbols-outlined text-2xl fill-icon">{item.icon}</span>
                  </div>
                  {isOwned ? (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black text-xs border border-emerald-200">
                      <span className="material-symbols-outlined text-sm fill-icon text-emerald-500">check_circle</span>
                      Dimiliki
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-sky-50 text-sky-700 font-black text-xs border border-sky-200">
                      <span className="material-symbols-outlined text-sm fill-icon text-sky-500">diamond</span>
                      {item.priceGems}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-black text-slate-900">{item.name}</h3>
                  {isActive && <span className="bg-amber-400 text-white text-[9px] px-2 py-0.5 rounded-full font-black">AKTIF</span>}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{item.description}</p>
              </div>

              {isOwned ? (
                <button
                  onClick={() => handleEquip(item)}
                  disabled={isActive}
                  className={`tactile-btn w-full py-2.5 px-4 rounded-xl font-black text-xs border-b-[4px] flex items-center justify-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-amber-100 text-amber-600 border-amber-200 cursor-default'
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {isActive ? 'check' : 'palette'}
                  </span>
                  {isActive ? 'Sedang Digunakan' : 'Gunakan Tema'}
                </button>
              ) : (
                <button
                  onClick={() => handleBuy(item)}
                  className="tactile-btn w-full py-2.5 px-4 rounded-xl font-black text-xs border-b-[4px] flex items-center justify-center gap-2 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-900 shadow-xs"
                >
                  <span className="material-symbols-outlined text-sm">lock_open</span>
                  Beli Tema ({item.priceGems} Gems)
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
