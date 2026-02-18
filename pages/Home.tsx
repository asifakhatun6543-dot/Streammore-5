
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store/AppContext';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ContentCard } from '../components/ContentCard';
import { AIAssistant } from '../components/AIAssistant';

export const Home: React.FC = () => {
  const { content, uiConfig } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);
  
  const liveSectionRef = useRef<HTMLDivElement>(null);
  const filter = searchParams.get('filter');

  const heroItems = content.filter(c => c.isFeatured || c.isTrending).slice(0, 6);

  // Auto-Scroll Logic
  useEffect(() => {
    if (heroItems.length === 0 || !uiConfig.homePage.showHeroBanner) return;
    const interval = setInterval(() => {
      setActiveHeroIdx((prev) => (prev + 1) % heroItems.length);
    }, 4500); 
    return () => clearInterval(interval);
  }, [heroItems.length, uiConfig.homePage.showHeroBanner]);

  // Handle manual navigation scrolling
  useEffect(() => {
    if (filter === 'live' && liveSectionRef.current) {
      liveSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [filter]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveHeroIdx((prev) => (prev + 1) % heroItems.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveHeroIdx((prev) => (prev - 1 + heroItems.length) % heroItems.length);
  };

  const genreExplorer = [
    { name: 'All', icon: 'fa-filter', img: 'https://picsum.photos/seed/all/300/150' },
    { name: 'Action', icon: 'fa-gun', img: 'https://picsum.photos/seed/action/300/150' },
    { name: 'Crime', icon: 'fa-user-secret', img: 'https://picsum.photos/seed/crime/300/150' },
    { name: 'Horror', icon: 'fa-ghost', img: 'https://picsum.photos/seed/horror/300/150' },
    { name: 'Sci-Fi', icon: 'fa-rocket', img: 'https://picsum.photos/seed/scifi/300/150' },
    { name: 'Drama', icon: 'fa-masks-theater', img: 'https://picsum.photos/seed/drama/300/150' },
  ];

  const renderRow = (title: string, items: any[], link: string, icon?: string, customColor: string = 'text-blue-500') => {
    if (items.length === 0) return null;
    return (
      <section className="animate-in fade-in slide-in-from-bottom-2 duration-700">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-base md:text-lg font-black text-white flex items-center gap-2 uppercase tracking-tight">
            {icon && <i className={`fa-solid ${icon} ${customColor} text-sm md:text-base`}></i>} {title}
          </h3>
          <Link to={link} className="text-slate-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1 hover:text-white transition-colors">
            View All <i className="fa-solid fa-chevron-right text-[7px]"></i>
          </Link>
        </div>
        <div className="flex items-start gap-3 md:gap-4 overflow-x-auto no-scrollbar pb-2 px-1">
           {items.map((item) => (
             <div 
               key={item.id} 
               onClick={() => navigate(`/watch/${item.id}`)}
               className="min-w-[110px] md:min-w-[170px] space-y-2 cursor-pointer group"
             >
                <div className="aspect-[3/4.5] rounded-xl overflow-hidden relative shadow-lg border border-white/5 bg-slate-900 group-hover:border-blue-500/50 transition-all duration-300">
                  <img src={item.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
                  {item.category === 'LIVE' && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 px-1.5 py-0.5 rounded font-black text-white text-[7px] uppercase z-10">
                       <span className="w-1 h-1 bg-white rounded-full animate-pulse"></span> LIVE
                    </div>
                  )}
                  <div className="absolute top-0 right-0 bg-black/70 px-1.5 py-0.5 rounded-bl-lg font-black text-white border-b border-l border-white/10 uppercase text-[7px]">
                    {item.category}
                  </div>
                </div>
                <p className="text-[9px] md:text-[11px] font-black text-slate-400 group-hover:text-white truncate transition-colors px-1 uppercase tracking-tight">
                  {item.title}
                </p>
             </div>
           ))}
        </div>
      </section>
    );
  };

  // Content Filtering
  const trendingItems = content.filter(c => c.isTrending);
  const liveContent = content.filter(c => c.category === 'LIVE');
  const movieContent = content.filter(c => c.type === 'movie' && c.category !== 'LIVE');
  const seriesContent = content.filter(c => c.type === 'series' && c.category !== 'Anime');
  const topBlockbusters = content.filter(c => c.rating >= 8.5);
  const top20Movies = [...content].filter(c => c.type === 'movie').sort((a,b) => b.rating - a.rating).slice(0, 20);
  
  const animeContent = content.filter(c => c.category === 'Anime');
  const kidsContent = content.filter(c => c.category === 'Kids');
  const eduContent = content.filter(c => c.category === 'Education');
  const hindiContent = content.filter(c => c.category === 'Hindi');
  const indianContent = content.filter(c => c.category === 'Indian');
  const asianContent = content.filter(c => c.category === 'Asian');
  const teluguContent = content.filter(c => c.category === 'Telugu');
  const tamilContent = content.filter(c => c.category === 'Tamil');

  return (
    <div className="bg-[#020202] min-h-screen text-slate-200 animate-in fade-in duration-700 pb-12 overflow-x-hidden">
      
      {/* 1. Automatic & Manual Scrolling Hero Banner */}
      {uiConfig.homePage.showHeroBanner && (
        <section className="relative w-full aspect-video md:aspect-[21/8] overflow-hidden group border-b border-white/5 shadow-2xl">
          <div 
            className="flex h-full transition-transform duration-1000 ease-in-out touch-pan-x" 
            style={{ transform: `translateX(-${activeHeroIdx * 100}%)` }}
          >
            {heroItems.map((item, idx) => (
              <div 
                key={item.id} 
                onClick={() => navigate(`/watch/${item.id}`)}
                className="min-w-full h-full relative cursor-pointer group/slide"
              >
                <img 
                  src={item.thumbnail} 
                  className="w-full h-full object-cover object-center transition-transform duration-[2000ms] group-hover/slide:scale-105"
                  alt={item.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/40 to-transparent"></div>
                
                <div className="absolute bottom-6 left-0 right-0 px-6 flex items-end justify-between pointer-events-none">
                  <div className="flex items-end gap-3 translate-y-4 group-hover/slide:translate-y-0 transition-transform duration-500">
                     <div className="space-y-1">
                        <h2 className="text-xl md:text-5xl font-black text-white drop-shadow-2xl leading-tight uppercase tracking-tighter">
                            {item.title}
                        </h2>
                        <div className="flex items-center gap-2 text-[9px] md:text-xs font-bold text-slate-300">
                           <span className="text-yellow-500">⭐ {item.rating}</span>
                           <span className="opacity-40">|</span>
                           <span className="text-blue-400">Featured #{idx + 1}</span>
                        </div>
                     </div>
                  </div>
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white text-2xl md:text-4xl shadow-2xl mb-1 group-hover/slide:scale-110 group-hover/slide:bg-blue-600 transition-all">
                    <i className="fa-solid fa-play ml-1"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Left/Right Manual Controls */}
          <button 
            onClick={handlePrev} 
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all active:scale-90"
          >
             <i className="fa-solid fa-chevron-left text-white text-sm md:text-lg"></i>
          </button>
          <button 
            onClick={handleNext} 
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all active:scale-90"
          >
             <i className="fa-solid fa-chevron-right text-white text-sm md:text-lg"></i>
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
             {heroItems.map((_, i) => (
               <button 
                 key={i} 
                 onClick={(e) => { e.stopPropagation(); setActiveHeroIdx(i); }}
                 className={`h-1 rounded-full transition-all duration-500 ${activeHeroIdx === i ? 'w-6 bg-blue-500' : 'w-2 bg-white/20'}`}
               ></button>
             ))}
          </div>
        </section>
      )}

      <div className="px-4 space-y-10 md:space-y-14 mt-8">
        
        {/* 2. Quick Explorer (Genres) */}
        {uiConfig.homePage.showGenreExplorer && (
          <section>
            <h3 className="text-[9px] font-black text-slate-500 mb-4 uppercase tracking-[0.2em] px-1">Quick Explore</h3>
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
               {genreExplorer.map((cat, i) => (
                 <button 
                  key={i} 
                  onClick={() => navigate(`/search?q=${cat.name === 'All' ? '' : cat.name}`)}
                  className="relative min-w-[120px] md:min-w-[150px] h-14 md:h-16 rounded-xl overflow-hidden flex-shrink-0 group border border-white/5 shadow-lg"
                 >
                   <img src={cat.img} className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-500" alt={cat.name} />
                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
                      <span className="font-black text-[9px] md:text-[10px] tracking-widest uppercase">{cat.name}</span>
                   </div>
                 </button>
               ))}
            </div>
          </section>
        )}

        {/* 3. ORDERED SECTIONS - STANDARDIZED SIZES */}
        
        {/* Trending Now */}
        {renderRow("🔥 Trending Now", trendingItems, "/home?filter=trending", "fa-fire", "text-orange-500")}
        
        {/* Live TV Section */}
        {renderRow("Live TV Section", liveContent, "/home?filter=live", "fa-broadcast-tower", "text-red-500")}
        
        {/* Top Blockbuster Section */}
        {renderRow("Top Blockbusters", topBlockbusters, "/search?type=movie", "fa-crown", "text-yellow-400")}
        
        {/* Top 20 Movies Section */}
        {renderRow("Top 20 Movies", top20Movies, "/search?type=movie", "fa-ranking-star", "text-cyan-400")}
        
        {/* Movie Section */}
        {renderRow("Movie Section", movieContent, "/search?type=movie", "fa-film", "text-blue-500")}
        
        {/* TV/Show Section */}
        {renderRow("TV/Show Section", seriesContent, "/search?type=series", "fa-tv", "text-indigo-400")}
        
        {/* Blockbuster Movie Section (Variant) */}
        {renderRow("Blockbuster Movies", movieContent.reverse().slice(0, 10), "/search?type=movie", "fa-clapperboard", "text-purple-400")}

        {/* Kid Section (5+ items optimized) */}
        {renderRow("Kid Section", kidsContent, "/search?q=Kids", "fa-child-reaching", "text-green-400")}

        {/* Education Section */}
        {renderRow("Education Section", eduContent, "/search?q=Education", "fa-book-open-reader", "text-emerald-400")}
        
        {/* Hindi Section */}
        {renderRow("Hindi Section", hindiContent, "/search?q=Hindi", "fa-language", "text-blue-600")}
        
        {/* Tamil Section */}
        {renderRow("Tamil Section", tamilContent, "/search?q=Tamil", "fa-music", "text-pink-500")}
        
        {/* Telugu Section */}
        {renderRow("Telugu Section", teluguContent, "/search?q=Telugu", "fa-bolt", "text-yellow-500")}
        
        {/* Asian Section */}
        {renderRow("Asian Section", asianContent, "/search?q=Asian", "fa-earth-asia", "text-cyan-500")}
        
        {/* Indian Section */}
        {renderRow("Indian Section", indianContent, "/search?q=Indian", "fa-flag", "text-orange-400")}
        
        {/* Anime Section */}
        {renderRow("Anime Section", animeContent, "/search?q=Anime", "fa-dragon", "text-red-400")}

        {/* 4. StreamMore Section (Gallery) */}
        {uiConfig.homePage.showInfiniteGrid && (
          <section className="pt-12 border-t border-white/5">
            <div className="flex flex-col items-center justify-center text-center mb-10 space-y-2">
               <h3 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                 StreamMore Gallery <i className="fa-solid fa-heart text-red-500"></i>
               </h3>
               <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest max-w-md opacity-70">
                  Explore our full library. Everything you love, in one place.
               </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
               {content.map((item, idx) => (
                 <div 
                   key={item.id} 
                   className="animate-in fade-in zoom-in duration-500"
                   style={{ animationDelay: `${idx * 50}ms` }}
                 >
                   <ContentCard content={item} />
                 </div>
               ))}
            </div>
            
            <div className="mt-24 py-16 text-center border-t border-white/5 bg-gradient-to-b from-transparent to-blue-500/5 rounded-t-[3rem] px-6">
               <div className="w-16 h-16 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <i className="fa-solid fa-play text-blue-500 text-2xl"></i>
               </div>
               <div className="space-y-6">
                  <h4 className="text-white font-black text-xl flex items-center justify-center gap-2">
                    All reserve by RS7 <span className="text-blue-500">💓</span>
                  </h4>
               </div>
               <p className="text-slate-800 font-black text-[9px] mt-12 uppercase tracking-[0.5em] opacity-40">
                 Premium Streaming • {new Date().getFullYear()}
               </p>
            </div>
          </section>
        )}
      </div>
      <AIAssistant />
    </div>
  );
};
