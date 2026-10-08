import React, { useState } from 'react';
import { useDataStore } from '../../store/dataStore';
import { Layers, Plus, Search, MoreVertical, Edit, Trash2, BookOpen } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export default function AdminCategories() {
  const { categories, deleteCategory } = useDataStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to safely render dynamic icons
  const renderIcon = (iconName, className) => {
    // Map material symbols names to Lucide icons roughly
    const iconMap = {
      'menu_book': LucideIcons.Book,
      'spellcheck': LucideIcons.Type,
      'chrome_reader_mode': LucideIcons.BookOpen,
      'edit_note': LucideIcons.Edit3,
      'headphones': LucideIcons.Headphones,
      'forum': LucideIcons.MessageSquare,
      'school': LucideIcons.GraduationCap,
      'today': LucideIcons.Calendar,
    };
    const IconComponent = iconMap[iconName] || LucideIcons.Layers;
    return <IconComponent className={className} />;
  };

  const getColorClasses = (colorName) => {
    const map = {
      violet: 'bg-violet-50 text-violet-600',
      rose: 'bg-rose-50 text-rose-600',
      sky: 'bg-sky-50 text-sky-600',
      lime: 'bg-lime-50 text-lime-600',
      teal: 'bg-teal-50 text-teal-600',
      indigo: 'bg-indigo-50 text-indigo-600',
      fuchsia: 'bg-fuchsia-50 text-fuchsia-600',
      emerald: 'bg-emerald-50 text-emerald-600',
    };
    return map[colorName] || 'bg-slate-50 text-slate-600';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Material Categories</h1>
          <p className="text-slate-500 text-sm mt-1">Organize learning content into thematic categories.</p>
        </div>
        
        <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-xs">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input 
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredCategories.map(category => (
          <div key={category.id} className="bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all p-5 flex flex-col group">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getColorClasses(category.color)}`}>
                {renderIcon(category.icon, "w-6 h-6")}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg"><Edit className="w-4 h-4"/></button>
                <button 
                  onClick={() => deleteCategory(category.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                >
                  <Trash2 className="w-4 h-4"/>
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-black text-slate-900 mb-1">{category.name}</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1">
              {category.description}
            </p>
            
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 mt-auto">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>{category.materialCount} Materials</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md ${category.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                {category.status}
              </span>
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <button className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all min-h-[200px] cursor-pointer">
          <div className="w-12 h-12 bg-white rounded-full shadow-xs flex items-center justify-center mb-3">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-bold text-sm">Create Category</span>
        </button>
      </div>

    </div>
  );
}
