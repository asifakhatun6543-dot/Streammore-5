
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { ContentCard } from '../components/ContentCard';
import { Button } from '../components/Button';

export const Watchlist: React.FC = () => {
  const { watchlist, content } = useApp();
  const navigate = useNavigate();

  const watchlistItems = useMemo(() => {
    return content.filter(item => watchlist.includes(item.id));
  }, [content, watchlist]);

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Header with Back Button */}
      <div className="flex items-center gap-6">
        <button 
          onClick={() => navigate('/profile')}
          className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white hover:bg-slate-800 hover:scale-105 transition-all active:scale-95"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <div>
          <h1 className="text-3xl font-black text-white">My Watchlist</h1>
          <p className="text-slate-500 text-sm font-medium">Saved movies and shows for later.</p>
        </div>
        <div className="ml-auto bg-blue-600/10 text-blue-500 border border-blue-600/20 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
            {watchlistItems.length} Items
        </div>
      </div>

      {watchlistItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {watchlistItems.map(item => (
            <div key={item.id} className="animate-in zoom-in duration-300">
              <ContentCard content={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-[2.5rem] p-24 text-center space-y-6">
          <div className="w-24 h-24 bg-slate-900 rounded-3xl mx-auto flex items-center justify-center text-slate-700 text-4xl shadow-inner border border-slate-800">
            <i className="fa-solid fa-bookmark"></i>
          </div>
          <div className="space-y-3">
            <h4 className="text-2xl font-black text-white">Your watchlist is empty</h4>
            <p className="text-slate-500 max-w-sm mx-auto text-sm leading-relaxed">
              Start adding your favorite content by clicking the plus icon on any movie or series card.
            </p>
          </div>
          <Button 
            variant="primary" 
            onClick={() => navigate('/home')} 
            className="rounded-2xl px-12 py-4 uppercase font-black text-xs tracking-widest shadow-xl shadow-blue-600/20"
          >
            Explore Movies
          </Button>
        </div>
      )}

      {/* Recommended Section (If empty or short) */}
      {watchlistItems.length < 5 && (
          <div className="pt-10">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-600 mb-8 text-center">You might also like</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 duration-500">
                {content.slice(0, 5).map(item => (
                    <ContentCard key={item.id} content={item} />
                ))}
              </div>
          </div>
      )}
    </div>
  );
};
