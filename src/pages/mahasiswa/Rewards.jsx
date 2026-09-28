import React, { useState } from 'react';
import { useDataStore } from '../../store/dataStore';
import HootieMascot from '../../components/mascot/HootieMascot';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function ScholarShop() {
  const { userStats, shopItems, inventory, buyItem, addGems } = useDataStore();
  const [activeCategory, setActiveCategory] = useState('all');
  const [chestClaimed, setChestClaimed] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState('');

  const filteredItems =
    activeCategory === 'all'
      ? shopItems
      : shopItems.filter((i) => i.category === activeCategory);

  const handleClaimChest = () => {
    if (chestClaimed) return;
    setChestClaimed(true);
    addGems(100);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
    });
  };

  const handleBuy = (item) => {
    if (userStats.gems < item.priceGems) {
      alert('Permata tidak cukup! Selesaikan kuis atau misi harian untuk menambah permata.');
      return;
    }
    buyItem(item.id);
    setPurchaseSuccess(`Berhasil membeli ${item.name}!`);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 },
    });
    setTimeout(() => setPurchaseSuccess(''), 3000);
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
              Toko Game & Kustomisasi Avatar
            </h1>
            <p className="text-xs md:text-sm text-white/90 leading-relaxed">
              Tukarkan Permata hasil kuis akademis dengan booster ujian, perlindungan streak, serta ornamen avatar wisuda legendaris.
            </p>
          </div>

          {/* Interactive Daily Chest Box */}
          <div className="shrink-0 flex flex-col items-center p-4 bg-white/10 backdrop-blur-md rounded-3xl border-2 border-white/30 shadow-inner text-center">
            <motion.div
              whileHover={{ scale: 1.1, rotate: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClaimChest}
              className="w-16 h-16 rounded-2xl bg-gradient-to-b from-amber-300 to-amber-500 border-b-4 border-amber-800 flex items-center justify-center shadow-lg cursor-pointer"
            >
              <span className="material-symbols-outlined text-3xl text-amber-950 fill-icon">
                inventory_2
              </span>
            </motion.div>
            <span className="text-xs font-black mt-2 text-white">Daily Mystery Chest</span>
            <span className="text-[10px] text-amber-200 font-semibold mb-2">
              {chestClaimed ? 'Sudah Diklaim Hari Ini' : 'Berisi +100 Permata Gratis'}
            </span>
            <button
              onClick={handleClaimChest}
              disabled={chestClaimed}
              className={`tactile-btn px-4 py-2 font-black rounded-xl border-b-[4px] text-xs shadow-md cursor-pointer ${
                chestClaimed
                  ? 'bg-slate-400 border-slate-600 text-white cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-600 border-emerald-700 text-white'
              }`}
            >
              {chestClaimed ? 'Telah Diklaim' : 'Klaim Gratis Sekarang!'}
            </button>
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

      {/* ================= CATEGORY TABS ================= */}
      <div className="flex items-center gap-2 border-b border-indigo-100 pb-3">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-indigo-600 text-white border-b-2 border-indigo-900 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Semua Item
        </button>
        <button
          onClick={() => setActiveCategory('perks')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeCategory === 'perks'
              ? 'bg-indigo-600 text-white border-b-2 border-indigo-900 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Academic Perks & Boosters
        </button>
        <button
          onClick={() => setActiveCategory('avatar')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeCategory === 'avatar'
              ? 'bg-indigo-600 text-white border-b-2 border-indigo-900 shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Perlengkapan Avatar & Wisuda
        </button>
      </div>

      {/* ================= CATALOG GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const isOwned = inventory.includes(item.id);
          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-2xs">
                    <span className="material-symbols-outlined text-2xl fill-icon">{item.icon}</span>
                  </div>
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-sky-50 text-sky-700 font-black text-xs border border-sky-200">
                    <span className="material-symbols-outlined text-sm fill-icon text-sky-500">
                      diamond
                    </span>
                    {item.priceGems}
                  </span>
                </div>

                <h3 className="text-sm font-black text-slate-900 mb-1">{item.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{item.description}</p>
              </div>

              <button
                onClick={() => handleBuy(item)}
                disabled={isOwned}
                className={`tactile-btn w-full py-2.5 px-4 rounded-xl font-black text-xs border-b-[4px] flex items-center justify-center gap-2 cursor-pointer ${
                  isOwned
                    ? 'bg-slate-100 text-slate-400 border-slate-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-900 shadow-xs'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {isOwned ? 'check' : 'shopping_bag'}
                </span>
                {isOwned ? 'Sudah Dimiliki' : `Beli Sekarang (${item.priceGems} Gems)`}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
