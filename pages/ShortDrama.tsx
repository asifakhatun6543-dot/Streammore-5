
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { ContentCard } from '../components/ContentCard';

export const ShortDrama: React.FC = () => {
  const { content } = useApp();
  const navigate = useNavigate();

  // Filtering content that fits the "Short Drama" vibe (usually Series or specifically tagged)
  const shortDramas = useMemo(() => {
    return content.filter(c => c.type === 'series' || c.category === 'Drama');
  }, [content]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-red-600 rounded text-[10px] font-black uppercase tracking-tighter text-white">Hot</div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Short Drama</h1>
        </div>
        <p className="text-slate-500 text-lg font-medium">Binge-worthy mini stories in minutes.</p>
      </div>

      {/* Featured Vertical Reel UI */}
      <section className="relative h-[450px] w-full rounded-[2.5rem] overflow-hidden group shadow-2xl">
        <img 
            src="https://picsum.photos/seed/drama-hero/1080/1920" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            alt="Hero Drama" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        <div className="absolute bottom-10 left-10 right-10 space-y-4">
            <span className="text-xs font-black bg-blue-600 text-white px-3 py-1 rounded-full uppercase">New Release</span>
            <h2 className="text-3xl font-black text-white">The CEO's Hidden Secret</h2>
            <p className="text-slate-300 text-sm max-w-md line-clamp-2">A high-stakes drama about love, betrayal, and a corporate empire at risk. Watch the full season in 15 minutes.</p>
            <button 
                onClick={() => navigate('/watch/2')}
                className="bg-white text-black px-8 py-3 rounded-2xl font-black text-sm hover:bg-blue-500 hover:text-white transition-all active:scale-95"
            >
                Start Watching
            </button>
        </div>
      </section>

      {/* Categories of Shorts */}
      <div className="space-y-12">
        <section>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <i className="fa-solid fa-bolt text-yellow-500"></i> Trending Shorts
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {shortDramas.map(item => (
                    <ContentCard key={item.id} content={item} />
                ))}
            </div>
        </section>

        <section className="bg-slate-900/30 border border-slate-800 rounded-[3rem] p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="aspect-[9/16] w-40 rounded-3xl overflow-hidden shadow-2xl shrink-0">
                    <img src="https://picsum.photos/seed/sd/400/700" className="w-full h-full object-cover" alt="Phone UI" />
                </div>
                <div className="space-y-6">
                    <h3 className="text-3xl font-black text-white">AI-Curated Stories</h3>
                    <p className="text-slate-400 text-lg leading-relaxed">Our bot "StreamBuddy" analyzes your taste to generate personalized mini-drama recommendations every 24 hours.</p>
                    <div className="flex gap-4">
                        <div className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Total Shorts</p>
                            <p className="text-xl font-black text-white">1,200+</p>
                        </div>
                        <div className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Daily Uploads</p>
                            <p className="text-xl font-black text-white">15+</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section>
            <h3 className="text-xl font-bold text-white mb-6">Mini Series Collection</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {shortDramas.slice(0, 5).reverse().map(item => (
                    <ContentCard key={item.id} content={item} />
                ))}
            </div>
        </section>
      </div>

      <div className="text-center py-10 opacity-30">
          <p className="text-[10px] font-black uppercase tracking-[0.5em]">End of Short Drama Collection</p>
      </div>
    </div>
  );
};
