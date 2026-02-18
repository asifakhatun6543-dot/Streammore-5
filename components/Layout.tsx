
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../store/AppContext';

declare const Hls: any;

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    uiConfig, isMiniplayerActive, setMiniplayerActive, 
    activeVideoId, content, isGlobalPlaying, setIsGlobalPlaying,
    triggerGlobalSeek
  } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  
  const isHomePage = location.pathname === '/home';
  const isWatchPage = location.pathname.startsWith('/watch/');

  const filterParam = searchParams.get('filter');
  const queryParam = searchParams.get('q');
  const typeParam = searchParams.get('type');
  const activeCategory = queryParam || typeParam || (filterParam === 'trending' ? 'Trending' : filterParam === 'live' ? 'LIVE' : 'Home');

  const activeContent = content.find(c => c.id === activeVideoId);

  // Initial position calculation for the miniplayer (bottom right with 16px gap)
  const getInitialPosition = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const miniWidth = width < 768 ? 256 : 320; 
    const miniHeight = miniWidth * (9/16);
    return {
      x: width - miniWidth - 16,
      y: height - miniHeight - 100 
    };
  };

  const [miniPosition, setMiniPosition] = useState(getInitialPosition());
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const miniRef = useRef<HTMLDivElement>(null);

  // Miniplayer video playback logic
  const miniVideoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<any>(null);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    if (q !== searchQuery) setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim() && searchQuery !== (searchParams.get('q') || '')) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`, { replace: true });
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery, navigate, searchParams]);

  // Handle window resizing to keep miniplayer in view
  useEffect(() => {
    const handleResize = () => {
      setMiniPosition(prev => {
        const miniWidth = window.innerWidth < 768 ? 256 : 320;
        const miniHeight = miniWidth * (9/16);
        const maxX = window.innerWidth - miniWidth - 16;
        const maxY = window.innerHeight - miniHeight - 16;
        return {
          x: Math.min(prev.x, maxX),
          y: Math.min(prev.y, maxY)
        };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync Miniplayer Video
  useEffect(() => {
    if (isMiniplayerActive && activeContent && miniVideoRef.current) {
      const video = miniVideoRef.current;
      const url = activeContent.videoUrl;
      
      if (typeof Hls !== 'undefined' && Hls.isSupported() && url.includes('.m3u8')) {
        if (hlsRef.current) hlsRef.current.destroy();
        hlsRef.current = new Hls();
        hlsRef.current.loadSource(url);
        hlsRef.current.attachMedia(video);
      } else {
        video.src = url;
      }
      
      if (isGlobalPlaying) video.play().catch(() => {});
      else video.pause();

      return () => {
        if (hlsRef.current) hlsRef.current.destroy();
        video.pause();
      };
    }
  }, [isMiniplayerActive, activeContent, isGlobalPlaying]);

  // Enhanced Drag Handlers using Global Listeners
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!miniRef.current) return;
    setIsDragging(true);
    const rect = miniRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    // Using setPointerCapture to handle move events even if finger leaves element
    miniRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const miniWidth = window.innerWidth < 768 ? 256 : 320;
    const miniHeight = miniWidth * (9/16);
    
    let newX = e.clientX - dragOffset.current.x;
    let newY = e.clientY - dragOffset.current.y;
    
    // Viewport clamping
    newX = Math.max(0, Math.min(newX, window.innerWidth - miniWidth));
    newY = Math.max(0, Math.min(newY, window.innerHeight - miniHeight));
    
    setMiniPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    if (miniRef.current) {
      miniRef.current.releasePointerCapture(e.pointerId);
    }
  };

  const navCategories = [
    { label: 'Trending', path: '/home?filter=trending' },
    { label: 'TV', path: '/search?type=series' },
    { label: 'Anime', path: '/search?q=Anime' },
    ...(uiConfig.navigation.showShortDrama ? [{ label: 'ShortTV', path: '/short-drama' }] : []),
    { label: 'Kids', path: '/search?q=Kids' },
    { label: 'Education', path: '/search?q=Education' },
    { label: 'Hindi', path: '/search?q=Hindi' },
    { label: 'Asian', path: '/search?q=Asian' },
    { label: 'Western', path: '/search?q=Western' },
    { label: 'Indian', path: '/search?q=Indian' },
    { label: 'Telugu', path: '/search?q=Telugu' },
    { label: 'Tamil', path: '/search?q=Tamil' },
    { label: 'LIVE', path: '/home?filter=live', icon: 'fa-broadcast-tower' },
  ];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const menuItems = [
    { label: 'Home', path: '/home', icon: 'fa-house' },
    ...(uiConfig.navigation.showShortDrama ? [{ label: 'Short Drama', path: '/short-drama', icon: 'fa-film' }] : []),
    ...(uiConfig.navigation.showDownloads ? [{ label: 'Downloads', path: '/downloads', icon: 'fa-download' }] : []),
    { label: 'Profile', path: '/profile', icon: 'fa-user' },
  ];

  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password' || location.pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  const handleMiniplayerPlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsGlobalPlaying(!isGlobalPlaying);
  };

  const handleReturnToFull = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeContent) {
      setMiniplayerActive(false);
      navigate(`/watch/${activeContent.id}`);
    }
  };

  const handleSeek = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    triggerGlobalSeek(delta);
  };

  return (
    <div className="min-h-screen bg-[#020202] flex flex-col md:flex-row overflow-hidden text-slate-200">
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-900 bg-black p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
            <i className="fa-solid fa-play text-white"></i>
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">StreamMore</h1>
        </div>
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path ? 'bg-blue-600/10 text-blue-500' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}>
              <i className={`fa-solid ${item.icon} w-5`}></i>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className={`flex-1 flex flex-col h-screen overflow-y-auto md:pb-0 scroll-smooth relative ${isWatchPage ? 'pb-0' : 'pb-20'}`}>
        {isHomePage ? (
          <header className="sticky top-0 z-50 bg-[#020202]/90 backdrop-blur-xl border-b border-white/5 px-4 pt-4 animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-3 mb-3">
               <Link to="/home" className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg"><i className="fa-solid fa-play text-white text-xl"></i></div>
               </Link>
               {uiConfig.navigation.showSearch && (
                 <form onSubmit={handleSearchSubmit} className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500 relative flex items-center bg-white/10 rounded-xl overflow-hidden px-4 py-2 border border-white/10">
                    <i className="fa-solid fa-magnifying-glass text-slate-400 mr-2 text-sm"></i>
                    <input 
                      type="text" 
                      placeholder="Search live sports or movies..." 
                      className="bg-transparent text-white text-sm outline-none w-full placeholder:text-slate-500" 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                    <button type="submit" className="text-[#34d399] font-black text-sm px-2 hover:opacity-80 transition-opacity uppercase tracking-tight ml-2">Search</button>
                 </form>
               )}
            </div>
            <nav className="flex items-center gap-8 overflow-x-auto no-scrollbar pb-3 px-2">
               {navCategories.map((cat, idx) => (
                   <Link key={idx} to={cat.path} className={`text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 pb-1 border-b-2 ${activeCategory.toLowerCase() === cat.label.toLowerCase() ? 'text-white border-white' : 'text-slate-400 border-transparent hover:text-white'}`}>
                     {cat.icon && <i className={`fa-solid ${cat.icon} ${cat.label === 'LIVE' ? 'text-red-500' : ''}`}></i>}
                     {cat.label}
                   </Link>
               ))}
            </nav>
          </header>
        ) : null}

        <div className="flex-1">
          {children}
        </div>

        {isMiniplayerActive && activeContent && !isWatchPage && (
          <div 
            ref={miniRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className={`fixed z-[100] w-64 md:w-80 aspect-video bg-black rounded-3xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.9)] border border-white/10 group animate-in slide-in-from-right-10 duration-500 touch-none ${isDragging ? 'cursor-grabbing select-none scale-105' : 'cursor-grab transition-all duration-300'}`}
            style={{
              transform: `translate3d(${miniPosition.x}px, ${miniPosition.y}px, 0)`,
              top: 0,
              left: 0,
              willChange: 'transform'
            }}
          >
            <div className={`relative w-full h-full ${isDragging ? 'pointer-events-none' : ''}`}>
              <video 
                ref={miniVideoRef}
                className="w-full h-full object-cover opacity-80 pointer-events-none"
                muted
                playsInline
              />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={handleReturnToFull}
                  className="w-14 h-14 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white shadow-2xl hover:bg-white/10 transition-all active:scale-90 mb-4"
                >
                  <i className="fa-solid fa-expand text-xl"></i>
                </button>

                <div className="flex items-center gap-8">
                   <button 
                      onClick={(e) => handleSeek(e, -10)}
                      className="text-white/60 hover:text-white transition-colors active:scale-90"
                   >
                      <i className="fa-solid fa-rotate-left text-lg"></i>
                   </button>

                   <button 
                    onClick={handleMiniplayerPlayPause}
                    className="w-12 h-12 flex items-center justify-center text-white transition-all bg-transparent border-none active:scale-90"
                  >
                    <i className={`fa-solid ${isGlobalPlaying ? 'fa-pause' : 'fa-play'} text-2xl ${!isGlobalPlaying ? 'ml-1' : ''}`}></i>
                  </button>

                  <button 
                      onClick={(e) => handleSeek(e, 10)}
                      className="text-white/60 hover:text-white transition-colors active:scale-90"
                   >
                      <i className="fa-solid fa-rotate-right text-lg"></i>
                   </button>
                </div>
              </div>

              <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-center z-10">
                 <button 
                   className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-90"
                   onClick={(e) => { e.stopPropagation(); navigate('/settings'); }}
                 >
                   <i className="fa-solid fa-gear text-xs"></i>
                 </button>

                 <button 
                   className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-red-500 transition-all active:scale-90"
                   onClick={(e) => {
                     e.stopPropagation();
                     setMiniplayerActive(false);
                   }}
                 >
                   <i className="fa-solid fa-xmark text-xs"></i>
                 </button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                 <div 
                   className={`h-full bg-white transition-all duration-300 ${isGlobalPlaying ? 'animate-pulse' : ''}`} 
                   style={{ width: '35%' }}
                 ></div>
              </div>
            </div>
          </div>
        )}
      </main>

      {!isWatchPage && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#020202]/95 backdrop-blur-3xl border-t border-white/5 flex justify-around p-4 z-40">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-1 ${location.pathname === item.path ? 'text-blue-500' : 'text-slate-500'}`}>
              <i className={`fa-solid ${item.icon} text-xl`}></i>
              <span className="text-[10px] uppercase tracking-wider font-bold">{item.label}</span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
};
