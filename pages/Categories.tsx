
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constants';

const CATEGORY_STYLES: Record<string, string> = {
  'Action': 'from-red-600 to-orange-600',
  'Comedy': 'from-yellow-400 to-orange-500',
  'Drama': 'from-blue-600 to-indigo-700',
  'Horror': 'from-slate-800 to-black',
  'Sci-Fi': 'from-cyan-500 to-blue-600',
  'Bollywood': 'from-pink-500 to-rose-600',
  'Hollywood': 'from-amber-400 to-yellow-600',
  'Thriller': 'from-purple-600 to-indigo-800',
  'Animation': 'from-green-400 to-emerald-600',
  'All': 'from-slate-700 to-slate-900'
};

const CATEGORY_ICONS: Record<string, string> = {
  'Action': 'fa-gun',
  'Comedy': 'fa-face-laugh-squint',
  'Drama': 'fa-masks-theater',
  'Horror': 'fa-ghost',
  'Sci-Fi': 'fa-rocket',
  'Bollywood': 'fa-music',
  'Hollywood': 'fa-star',
  'Thriller': 'fa-bolt',
  'Animation': 'fa-palette',
  'All': 'fa-border-all'
};

export const Categories: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-black text-white">Browse Genres</h1>
        <p className="text-slate-500 text-lg">Discover your next favorite story by category.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => navigate(`/search?q=${cat === 'All' ? '' : cat}`)}
            className="group relative aspect-square rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_STYLES[cat] || 'from-slate-700 to-slate-900'} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
            <div className="absolute inset-0 p-8 flex flex-col justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                <i className={`fa-solid ${CATEGORY_ICONS[cat] || 'fa-tag'}`}></i>
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-black text-white mb-1">{cat}</h3>
                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Explore Collection</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-20 transition-opacity">
               <i className={`fa-solid ${CATEGORY_ICONS[cat] || 'fa-tag'} text-8xl text-white -rotate-12`}></i>
            </div>
          </button>
        ))}
      </div>

      {/* Recommended for You Banner */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-[3rem] p-12 flex flex-col md:flex-row items-center justify-between gap-8 mt-12 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full"></div>
         <div className="relative z-10 space-y-4 max-w-xl">
           <h2 className="text-3xl font-black text-white">Can't decide what to watch?</h2>
           <p className="text-slate-400">Our AI assistant "StreamBuddy" can help you pick the perfect movie based on your current mood and preferences.</p>
         </div>
         <button className="relative z-10 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs px-10 py-5 rounded-2xl transition-all hover:scale-105">
           Talk to AI Assistant
         </button>
      </div>
    </div>
  );
};
