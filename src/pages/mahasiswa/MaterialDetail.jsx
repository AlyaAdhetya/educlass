import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDataStore } from '../../store/dataStore';
import { ChevronLeft, ChevronRight, CheckCircle, BookOpen, Trophy } from 'lucide-react';

export default function MaterialDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { materials } = useDataStore();

  const material = materials.find(m => m.id === parseInt(id));
  const [currentPage, setCurrentPage] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  if (!material) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <p className="text-slate-500 text-lg">Materi tidak ditemukan.</p>
          <button onClick={() => navigate('/dashboard/modules')} className="mt-4 text-blue-600 font-bold">
            ← Kembali
          </button>
        </div>
      </div>
    );
  }

  const pages = material.pages || [];
  const totalPages = pages.length;
  const isLastPage = currentPage === totalPages - 1;
  const page = pages[currentPage];
  const progress = Math.round(((currentPage + 1) / totalPages) * 100);

  const handleNext = () => {
    if (isLastPage) {
      setShowCompletion(true);
    } else {
      setCurrentPage(p => p + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(p => p - 1);
      window.scrollTo(0, 0);
    } else {
      navigate('/dashboard/modules');
    }
  };

  // Render markdown-like text
  const renderContent = (text) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (!line.trim()) return <div key={i} className="h-3" />;
      if (line.startsWith('| ')) {
        // Simple table row detection
        const cells = line.split('|').filter(c => c.trim() && c.trim() !== '---');
        if (cells.length > 0) {
          return (
            <div key={i} className="flex border-b border-slate-100 last:border-0">
              {cells.map((cell, j) => (
                <div key={j} className={`flex-1 px-3 py-2 text-sm ${j === 0 ? 'font-semibold text-slate-700' : 'text-slate-600'}`}>
                  {cell.trim()}
                </div>
              ))}
            </div>
          );
        }
        return null;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <h3 key={i} className="font-bold text-slate-800 text-base mt-4 mb-2">{line.replace(/\*\*/g, '')}</h3>;
      }
      if (line.startsWith('- ') || line.startsWith('✅') || line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.')) {
        return <li key={i} className="text-slate-700 text-[15px] leading-7 ml-4 list-disc">{line.replace(/^[-✅\d.]\s*/, '')}</li>;
      }
      if (line.startsWith('#')) {
        const text = line.replace(/^#+\s/, '');
        return <h2 key={i} className="text-xl font-extrabold text-slate-900 mt-6 mb-3">{text}</h2>;
      }
      if (line.startsWith('> ')) {
        return <blockquote key={i} className="border-l-4 border-blue-300 pl-4 italic text-slate-600 my-2">{line.replace('> ', '')}</blockquote>;
      }
      if (line.startsWith('---')) {
        return <hr key={i} className="border-slate-200 my-4" />;
      }
      return (
        <p key={i} className="text-slate-700 text-[15px] leading-7"
          dangerouslySetInnerHTML={{
            __html: line
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
          }}
        />
      );
    });
  };

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-blue-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-emerald-50">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Materi Selesai! 🎉</h1>
          <p className="text-slate-500 mb-2">Kamu telah menyelesaikan seluruh halaman materi</p>
          <div className="bg-blue-50 rounded-2xl px-4 py-3 mb-8 border border-blue-100">
            <p className="font-bold text-blue-800 text-sm">{material.title}</p>
            <p className="text-blue-600 text-xs">{totalPages} halaman · {material.category}</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              <p className="font-bold text-amber-800 text-sm">Selesaikan Evaluasi untuk mendapatkan XP!</p>
            </div>
            <p className="text-amber-700 text-xs">
              Kerjakan kuis evaluasi dan dapatkan hingga <strong>+{material.xp_reward} XP</strong>. Skor minimum {material.min_score} untuk membuka level berikutnya.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate(`/dashboard/modules/${material.id}/quiz`)}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-md shadow-blue-200 transition-all text-sm flex items-center justify-center gap-2"
            >
              <Trophy className="w-5 h-5" />
              Mulai Evaluasi Materi
            </button>
            <button
              onClick={() => navigate('/dashboard/modules')}
              className="w-full py-3 text-slate-500 hover:text-slate-700 text-sm font-medium"
            >
              Kembali ke Daftar Materi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <button onClick={handleBack} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors">
            <ChevronLeft className="w-4 h-4" />
            {currentPage === 0 ? 'Kembali' : 'Halaman Sebelumnya'}
          </button>

          <div className="flex-1 flex flex-col items-center gap-1 max-w-xs">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-bold text-blue-700 truncate max-w-[140px]">{material.title}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <span className="text-xs font-bold text-slate-500 shrink-0">
            {currentPage + 1} / {totalPages}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Page Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-blue-200 text-xs font-bold uppercase tracking-wider">
                Halaman {currentPage + 1} dari {totalPages}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-white">{page?.title}</h1>
          </div>

          {/* Page Body */}
          <div className="p-6 md:p-8 space-y-2">
            {/* Table header if needed */}
            {pages[currentPage]?.content?.includes('| Bahasa Inggris') && (
              <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200 mb-4">
                <div className="flex bg-slate-100 border-b border-slate-200">
                  <div className="flex-1 px-3 py-2 text-xs font-bold text-slate-600 uppercase">Bahasa Inggris</div>
                  <div className="flex-1 px-3 py-2 text-xs font-bold text-slate-600 uppercase">Bahasa Indonesia</div>
                </div>
              </div>
            )}
            {renderContent(page?.content || '')}
          </div>

          {/* Navigation */}
          <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between gap-4">
            <button
              onClick={handleBack}
              disabled={currentPage === 0}
              className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Sebelumnya
            </button>

            <div className="flex gap-1.5">
              {pages.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all ${
                    i === currentPage ? 'w-6 h-2 bg-blue-600' :
                    i < currentPage ? 'w-2 h-2 bg-blue-300' :
                    'w-2 h-2 bg-slate-200'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className={`flex items-center gap-2 px-5 py-2.5 font-bold text-sm rounded-xl transition-all shadow-sm ${
                isLastPage
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
              }`}
            >
              {isLastPage ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Selesai Membaca
                </>
              ) : (
                <>
                  Selanjutnya
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
