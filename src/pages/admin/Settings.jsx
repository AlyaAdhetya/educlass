import React, { useState } from 'react';
import { useDataStore } from '../../store/dataStore';
import {
  Settings, Save, Globe, BookOpen, Gamepad2, Check,
  RefreshCcw, Shield, ChevronRight, AlertCircle
} from 'lucide-react';

const navItems = [
  { key: 'general', label: 'General', icon: Globe, desc: 'Identitas platform & semester' },
  { key: 'learning', label: 'Learning Rules', icon: BookOpen, desc: 'Aturan kuis, retake & kelulusan' },
  { key: 'gamification', label: 'Gamification', icon: Gamepad2, desc: 'XP, streak, rewards & leaderboard' },
];

export default function AdminSettings() {
  const { settings, updateSettings } = useDataStore();

  const [activeSection, setActiveSection] = useState('general');
  const [localSettings, setLocalSettings] = useState(() => JSON.parse(JSON.stringify(settings)));
  const [savedSection, setSavedSection] = useState(null);

  const handleChange = (section, key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: value }
    }));
  };

  const handleSave = () => {
    updateSettings('general', localSettings.general);
    updateSettings('learning', localSettings.learning);
    updateSettings('gamification', localSettings.gamification);
    setSavedSection(activeSection);
    setTimeout(() => setSavedSection(null), 2500);
  };

  const handleReset = () => {
    setLocalSettings(JSON.parse(JSON.stringify(settings)));
  };

  const ToggleSwitch = ({ section, field, label, desc }) => {
    const val = localSettings[section][field];
    return (
      <div
        className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 transition-colors cursor-pointer"
        onClick={() => handleChange(section, field, !val)}
      >
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-800">{label}</p>
          {desc && <p className="text-xs text-slate-500 mt-0.5">{desc}</p>}
        </div>
        <button
          type="button"
          className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${val ? 'bg-indigo-600' : 'bg-slate-300'}`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${val ? 'translate-x-5' : 'translate-x-0'}`}
          />
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-6">

      {/* TOAST */}
      {savedSection && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold">Pengaturan berhasil disimpan!</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Platform Settings</h1>
          <p className="text-slate-500 text-sm mt-1">
            Konfigurasi global platform EduClass — nama, aturan belajar, dan fitur gamifikasi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RefreshCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* SIDEBAR NAV */}
        <div className="lg:col-span-3 space-y-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`w-full text-left px-4 py-3.5 rounded-2xl flex items-center gap-3 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 border border-indigo-200 text-indigo-800 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black">{item.label}</p>
                  <p className="text-[10px] text-slate-400 truncate">{item.desc}</p>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
              </button>
            );
          })}

          {/* Info card */}
          <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-amber-800">Data Dummy</p>
                <p className="text-[10px] text-amber-700 mt-0.5 leading-relaxed">
                  Semua pengaturan disimpan di Zustand state (in-memory). Tidak terhubung ke backend.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SETTINGS PANEL */}
        <div className="lg:col-span-9">

          {/* ===== GENERAL ===== */}
          {activeSection === 'general' && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-500" /> General Settings
                </h2>
                <p className="text-xs text-slate-500 mt-1">Informasi dasar dan identitas platform pembelajaran.</p>
              </div>

              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Platform</label>
                  <input
                    type="text"
                    value={localSettings.general.platformName}
                    onChange={(e) => handleChange('general', 'platformName', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Tagline / Slogan Platform</label>
                  <input
                    type="text"
                    value={localSettings.general.tagline}
                    onChange={(e) => handleChange('general', 'tagline', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>



                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Bahasa Default</label>
                  <select
                    value={localSettings.general.defaultLanguage}
                    onChange={(e) => handleChange('general', 'defaultLanguage', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ===== LEARNING RULES ===== */}
          {activeSection === 'learning' && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-500" /> Learning Rules
                </h2>
                <p className="text-xs text-slate-500 mt-1">Aturan kuis, batas pengulangan, dan syarat kelulusan modul.</p>
              </div>

              <div className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Skor Minimum Kelulusan (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={localSettings.learning.defaultMinScore}
                      onChange={(e) => handleChange('learning', 'defaultMinScore', Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Maks. Percobaan Retake</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={localSettings.learning.maxRetakeAttempts}
                      onChange={(e) => handleChange('learning', 'maxRetakeAttempts', Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <ToggleSwitch
                    section="learning"
                    field="allowRetake"
                    label="Izinkan Retake Kuis"
                    desc="Mahasiswa dapat mengulang kuis jika gagal melampaui skor minimum."
                  />
                  <ToggleSwitch
                    section="learning"
                    field="completionRequiresPassing"
                    label="Kelulusan Wajib untuk Menyelesaikan Modul"
                    desc="Modul dianggap selesai hanya jika mahasiswa lulus kuis dengan skor minimum."
                  />
                  <ToggleSwitch
                    section="learning"
                    field="showExplanationAfterQuiz"
                    label="Tampilkan Penjelasan Jawaban Setelah Kuis"
                    desc="Mahasiswa dapat melihat pembahasan soal setelah mengerjakan kuis."
                  />
                </div>
              </div>
            </div>
          )}

          {/* ===== GAMIFICATION ===== */}
          {activeSection === 'gamification' && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-indigo-500" /> Gamification Settings
                </h2>
                <p className="text-xs text-slate-500 mt-1">Aktifkan atau nonaktifkan fitur gamifikasi di platform.</p>
              </div>

              <div className="space-y-3 max-w-2xl">
                <ToggleSwitch
                  section="gamification"
                  field="xpEnabled"
                  label="Sistem XP (Experience Points)"
                  desc="Mahasiswa mendapatkan XP dari setiap aktivitas belajar dan kuis."
                />
                <ToggleSwitch
                  section="gamification"
                  field="streakEnabled"
                  label="Streak Belajar Harian"
                  desc="Hitung streak hari berturut-turut mahasiswa aktif belajar."
                />
                <ToggleSwitch
                  section="gamification"
                  field="rewardsEnabled"
                  label="Sistem Rewards & Toko Item"
                  desc="Mahasiswa dapat menukar Gems dengan item dekorasi dan tema."
                />
                <ToggleSwitch
                  section="gamification"
                  field="leaderboardEnabled"
                  label="Leaderboard Global"
                  desc="Tampilkan peringkat mahasiswa berdasarkan total XP yang dikumpulkan."
                />
              </div>

              {/* Preview current state */}
              <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-3">Status Fitur Saat Ini</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(localSettings.gamification).map(([key, val]) => {
                    const labels = {
                      xpEnabled: 'XP System',
                      streakEnabled: 'Streak',
                      achievementsEnabled: 'Achievements',
                      rewardsEnabled: 'Rewards',
                      leaderboardEnabled: 'Leaderboard',
                    };
                    return (
                      <span
                        key={key}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                          val
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                        }`}
                      >
                        {val ? '✓' : '✗'} {labels[key] || key}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SAVE BUTTON AT BOTTOM */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" /> Simpan Semua Perubahan
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
