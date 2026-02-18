
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { Content } from '../types';
import { getAIRecommendations } from '../services/geminiService';
import { Home } from './Home';
import { Button } from '../components/Button';

declare const Hls: any;

type DrawerType = 'none' | 'playlist' | 'language' | 'style' | 'audio' | 'speed' | 'quality' | 'settings';
type FitMode = 'contain' | 'cover' | 'fill';

export const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    content, watchlist, toggleWatchlist, setActiveVideoId, isGlobalPlaying, 
    setIsGlobalPlaying, saveProgress, downloads, toggleDownload, playbackProgress, user
  } = useApp();
  const navigate = useNavigate();

  // Core States
  const [activeContent, setActiveContent] = useState<Content | null>(null);
  const [recommendations, setRecommendations] = useState<Content[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isRotated, setIsRotated] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [isPipActive, setIsPipActive] = useState(false);
  const [playerType, setPlayerType] = useState<'native' | 'youtube' | 'vimeo'>('native');
  const [errorState, setErrorState] = useState(false);
  
  // UI States
  const [videoFit, setVideoFit] = useState<FitMode>('contain');
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>('none');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('AUTO');
  const [isLiked, setIsLiked] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [activeSeason, setActiveSeason] = useState(1);
  const [showResumePrompt, setShowResumePrompt] = useState(false);

  // Video Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<any>(null);
  const controlsTimeout = useRef<number | null>(null);
  const lastTapRef = useRef<{ time: number; x: number }>({ time: 0, x: 0 });

  const parseVideoUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      const videoId = (match && match[2].length === 11) ? match[2] : null;
      return { type: 'youtube', url: `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&controls=0&autoplay=1&mute=0` };
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop();
      return { type: 'vimeo', url: `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1` };
    }
    return { type: 'native', url };
  };

  useEffect(() => {
    const item = content.find(c => c.id === id);
    if (item) {
      setActiveContent(item);
      setActiveVideoId(item.id);
      getAIRecommendations(item, content).then(setRecommendations);
      setIsGlobalPlaying(true);
      setActiveDrawer('none');
      setPlayerType(parseVideoUrl(item.videoUrl).type as any);
      setErrorState(false);

      const savedProgress = playbackProgress[item.id];
      if (savedProgress && savedProgress > 10) {
        setShowResumePrompt(true);
      }
    } else {
      navigate('/home');
    }
  }, [id, content, navigate]);

  useEffect(() => {
    if (videoRef.current && playerType === 'native') {
      if (isGlobalPlaying) videoRef.current.play().catch(() => setErrorState(true));
      else videoRef.current.pause();
    }
  }, [isGlobalPlaying, playerType]);

  useEffect(() => {
    if (!activeContent || playerType !== 'native' || !videoRef.current) return;
    const video = videoRef.current;
    const url = activeContent.videoUrl;

    if (typeof Hls !== 'undefined' && Hls.isSupported() && url.includes('.m3u8')) {
      if (hlsRef.current) hlsRef.current.destroy();
      hlsRef.current = new Hls();
      hlsRef.current.loadSource(url);
      hlsRef.current.attachMedia(video);
      hlsRef.current.on(Hls.Events.ERROR, () => setErrorState(true));
    } else {
      video.src = url;
    }

    const handleLoaded = () => setDuration(video.duration);
    const handleError = () => setErrorState(true);
    video.addEventListener('loadedmetadata', handleLoaded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoaded);
      video.removeEventListener('error', handleError);
      if (activeContent) saveProgress(activeContent.id, video.currentTime);
    };
  }, [activeContent, playerType]);

  useEffect(() => {
    if (showControls && isGlobalPlaying && !isLocked && activeDrawer === 'none') {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
      controlsTimeout.current = window.setTimeout(() => setShowControls(false), 5000);
    }
    return () => { if (controlsTimeout.current) clearTimeout(controlsTimeout.current); };
  }, [showControls, isGlobalPlaying, isLocked, activeDrawer]);

  const handlePlayPause = (e?: any) => {
    e?.stopPropagation();
    if (isLocked) return;
    setIsGlobalPlaying(!isGlobalPlaying);
    setShowControls(true);
  };

  const handleSeekRel = (secs: number) => {
    if (isLocked || !videoRef.current) return;
    videoRef.current.currentTime += secs;
    setShowControls(true);
  };

  const handleNext = () => {
    if (recommendations.length > 0) navigate(`/watch/${recommendations[0].id}`);
  };

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleVideoTouch = (e: React.MouseEvent) => {
    const now = Date.now();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isDoubleTap = now - lastTapRef.current.time < 300;

    if (isDoubleTap) {
      if (x < rect.width / 2) handleSeekRel(-10);
      else handleSeekRel(10);
      lastTapRef.current = { time: 0, x: 0 };
    } else {
      setShowControls(!showControls);
      lastTapRef.current = { time: now, x };
    }
  };

  const handleResume = () => {
    if (videoRef.current && activeContent) {
      videoRef.current.currentTime = playbackProgress[activeContent.id] || 0;
    }
    setShowResumePrompt(false);
  };

  if (!activeContent) return null;
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isInWatchlist = watchlist.includes(activeContent.id);
  const isDownloaded = downloads.includes(activeContent.id);

  const SideDrawer: React.FC<{ title: string; width: string; children: React.ReactNode }> = ({ title, width, children }) => (
    <div 
      className={`absolute top-0 right-0 h-full ${width} bg-black/95 backdrop-blur-3xl z-[100] border-l border-white/10 animate-in slide-in-from-right duration-300 shadow-2xl p-8 overflow-y-auto no-scrollbar`}
      onClick={(e) => e.stopPropagation()}
    >
       <div className="flex items-center justify-between mb-8">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{title}</h3>
          <button onClick={() => setActiveDrawer('none')} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 active:scale-75 transition-transform"><i className="fa-solid fa-xmark"></i></button>
       </div>
       <div className="space-y-6">{children}</div>
    </div>
  );

  return (
    <div className="bg-[#020202] min-h-screen text-white select-none overflow-hidden relative">
      
      {isPipActive && !isRotated && (
        <div className="fixed inset-0 z-[2000] bg-[#020202] animate-in fade-in duration-500 overflow-y-auto no-scrollbar pb-20">
           <Home />
           <button onClick={() => setIsPipActive(false)} className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-blue-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl animate-bounce">Return to Player</button>
        </div>
      )}

      <div className={`transition-all duration-700 ease-in-out ${isRotated ? 'fixed inset-0 z-[1000] rotate-0' : 'flex flex-col h-screen'}`}
           style={isRotated ? { width: '100dvh', height: '100dvw', transform: 'translate(-50%, -50%) rotate(90deg)', top: '50%', left: '50%' } : {}}>
        
        {/* Top Navigation (Portrait Only) */}
        {!isRotated && (
          <div className="absolute top-0 left-0 right-0 z-[100] p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/5 active:scale-90 pointer-events-auto shadow-lg">
              <i className="fa-solid fa-chevron-left text-sm"></i>
            </button>
            <button onClick={() => navigate('/feedback')} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/5 active:scale-90 pointer-events-auto shadow-lg">
              <i className="fa-solid fa-circle-question text-sm"></i>
            </button>
          </div>
        )}

        {/* Video Surface Area */}
        <div 
          className={`relative bg-black flex items-center justify-center overflow-hidden shrink-0 ${isRotated ? 'w-full h-full' : 'aspect-video w-full'}`} 
          onClick={handleVideoTouch}
        >
          {playerType === 'native' ? (
            <video 
              ref={videoRef}
              className="w-full h-full pointer-events-none"
              style={{ objectFit: videoFit }}
              onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
              playsInline
            />
          ) : (
            <iframe src={parseVideoUrl(activeContent.videoUrl).url} className="w-full h-full scale-[1.01]" frameBorder="0" allow="autoplay; fullscreen" />
          )}

          {errorState && (
            <div className="absolute inset-0 z-[150] bg-black/80 flex flex-col items-center justify-center p-10 text-center space-y-4">
              <i className="fa-solid fa-triangle-exclamation text-4xl text-red-500"></i>
              <h2 className="text-xl font-black uppercase">Video failed to load</h2>
              <p className="text-slate-400 text-sm max-w-xs">There was an issue playing this video. Please check your connection or try another source.</p>
              <Button onClick={() => window.location.reload()} className="px-8 py-3 rounded-xl bg-blue-600">Retry Playback</Button>
            </div>
          )}

          {showResumePrompt && !isRotated && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[200] bg-blue-600/90 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-4 animate-in slide-in-from-top duration-500">
              <p className="text-[10px] font-black uppercase tracking-widest">Resume from {formatTime(playbackProgress[activeContent.id] || 0)}?</p>
              <div className="flex gap-2">
                <button onClick={handleResume} className="bg-white text-blue-600 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase">Yes</button>
                <button onClick={() => setShowResumePrompt(false)} className="bg-black/20 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase">Start Over</button>
              </div>
            </div>
          )}

          {/* LANDSCAPE PLAYER OVERLAY */}
          {isRotated && (
            <div className={`absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 transition-opacity duration-500 z-50 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="flex flex-col h-full p-8 justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <button onClick={(e) => {e.stopPropagation(); setIsRotated(false);}} className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md active:scale-90"><i className="fa-solid fa-chevron-left"></i></button>
                    <div>
                      <h2 className="text-base font-black uppercase tracking-tight">{activeContent.title}</h2>
                      <p className="text-[10px] font-bold text-white/40 uppercase">Streaming Ultra HD 4K</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={(e) => {e.stopPropagation(); setActiveDrawer('help');}} className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md active:scale-90"><i className="fa-solid fa-circle-question"></i></button>
                    <button onClick={(e) => {e.stopPropagation(); setActiveDrawer('settings');}} className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md active:scale-90"><i className="fa-solid fa-gear"></i></button>
                  </div>
                </div>

                {!isLocked && (
                  <div className="flex items-center justify-center gap-16 md:gap-24">
                    <button onClick={(e) => {e.stopPropagation(); handleSeekRel(-10);}} className="w-16 h-16 flex items-center justify-center text-white/40 hover:text-white active:scale-75 transition-all"><i className="fa-solid fa-rotate-left text-3xl"></i></button>
                    <button onClick={handlePlayPause} className="w-28 h-28 flex items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-3xl shadow-2xl active:scale-75 transition-all text-5xl"><i className={`fa-solid ${isGlobalPlaying ? 'fa-pause' : 'fa-play'}`}></i></button>
                    <button onClick={(e) => {e.stopPropagation(); handleSeekRel(10);}} className="w-16 h-16 flex items-center justify-center text-white/40 hover:text-white active:scale-75 transition-all"><i className="fa-solid fa-rotate-right text-3xl"></i></button>
                  </div>
                )}

                <button onClick={(e) => {e.stopPropagation(); setIsLocked(!isLocked);}} className={`absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md z-[60] active:scale-90 transition-all ${isLocked ? 'text-blue-500 bg-blue-500/10 border border-blue-500/50' : 'text-white'}`}>
                  <i className={`fa-solid ${isLocked ? 'fa-lock' : 'fa-lock-open'}`}></i>
                </button>

                <div className="space-y-6">
                  {!isLocked && playerType === 'native' && (
                    <div className="flex items-center gap-6">
                      <span className="text-[11px] font-black w-12 text-right">{formatTime(currentTime)}</span>
                      <div className="flex-1 relative h-2 bg-white/10 rounded-full group">
                         <div className="absolute top-0 left-0 h-full bg-blue-600 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                         <input type="range" min="0" max={duration} value={currentTime} onChange={e => {if(videoRef.current) videoRef.current.currentTime = parseFloat(e.target.value);}} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      </div>
                      <span className="text-[11px] font-black w-12">{formatTime(duration)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                       <button onClick={handlePlayPause} className="w-10 h-10 flex items-center justify-center text-2xl active:scale-75"><i className={`fa-solid ${isGlobalPlaying ? 'fa-pause' : 'fa-play'}`}></i></button>
                       {activeContent.type === 'series' && (
                         <button onClick={(e) => {e.stopPropagation(); handleNext();}} className="flex items-center gap-2 text-[10px] font-black uppercase text-white/60 hover:text-white"><i className="fa-solid fa-forward-step"></i> Next Episode</button>
                       )}
                    </div>
                    <div className="flex items-center gap-8">
                      <button onClick={(e) => {e.stopPropagation(); setActiveDrawer('playlist');}} className="flex flex-col items-center gap-1 text-[9px] font-black uppercase text-white/60 hover:text-white"><i className="fa-solid fa-list-ul text-lg"></i> Playlist</button>
                      <button onClick={(e) => {e.stopPropagation(); setActiveDrawer('language');}} className="flex flex-col items-center gap-1 text-[9px] font-black uppercase text-white/60 hover:text-white"><i className="fa-solid fa-closed-captioning text-lg"></i> Language</button>
                      <button onClick={(e) => {e.stopPropagation(); setActiveDrawer('speed');}} className="flex flex-col items-center gap-1 text-[9px] font-black uppercase text-white/60 hover:text-white"><i className="fa-solid fa-gauge-high text-lg"></i> {playbackSpeed}x</button>
                      <button onClick={(e) => {e.stopPropagation(); setActiveDrawer('quality');}} className="flex flex-col items-center gap-1 text-[9px] font-black uppercase text-white/60 hover:text-white"><i className="fa-solid fa-sliders text-lg"></i> {quality}</button>
                    </div>
                  </div>
                </div>
              </div>

              {activeDrawer !== 'none' && (
                <>
                  {activeDrawer === 'playlist' && (
                    <SideDrawer title="Playlist" width="w-[60%]">
                       <div className="space-y-6">
                          <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Episodes</h4>
                          <div className="grid grid-cols-6 md:grid-cols-8 gap-3">
                             {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                               <button key={num} onClick={() => setActiveSeason(num)} className={`aspect-square rounded-xl border font-black text-sm flex items-center justify-center transition-all ${activeSeason === num ? 'bg-blue-600 border-blue-500' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>{num.toString().padStart(2, '0')}</button>
                             ))}
                          </div>
                          <h4 className="text-[11px] font-black uppercase text-slate-500 tracking-widest pt-4">More for You</h4>
                          <div className="space-y-4">
                             {recommendations.map(item => (
                               <button key={item.id} onClick={() => navigate(`/watch/${item.id}`)} className="w-full flex items-center gap-6 p-4 rounded-[2rem] bg-white/5 hover:bg-white/10 transition-all text-left">
                                 <img src={item.thumbnail} className="w-32 aspect-video rounded-2xl object-cover" />
                                 <div className="flex-1 min-w-0">
                                   <p className="text-[10px] font-black uppercase truncate mb-1">{item.title}</p>
                                   <p className="text-[8px] text-blue-500 font-bold uppercase tracking-widest">Recommended</p>
                                 </div>
                               </button>
                             ))}
                          </div>
                       </div>
                    </SideDrawer>
                  )}
                  {activeDrawer === 'language' && (
                    <SideDrawer title="Language & Subtitles" width="w-[60%]">
                       <div className="space-y-4">
                          {['Off', 'English', 'Hindi', 'Tamil', 'Spanish'].map(l => (
                            <button key={l} onClick={() => setActiveDrawer('none')} className="w-full p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-[11px] font-black uppercase text-slate-400 hover:text-white">
                               {l} {l === 'English' && <i className="fa-solid fa-check text-blue-500"></i>}
                            </button>
                          ))}
                       </div>
                       <div className="absolute bottom-10 left-8 right-8 flex gap-4">
                          <button onClick={() => setActiveDrawer('style')} className="flex-1 p-5 rounded-2xl bg-slate-900 border border-white/10 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"><i className="fa-solid fa-palette"></i> Style</button>
                          <button onClick={() => setActiveDrawer('audio')} className="flex-1 p-5 rounded-2xl bg-slate-900 border border-white/10 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"><i className="fa-solid fa-volume-high"></i> Audio</button>
                       </div>
                    </SideDrawer>
                  )}
                </>
              )}
            </div>
          )}

          {/* PORTRAIT PLAYER OVERLAY */}
          {!isRotated && (
            <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
               <div className="absolute inset-0 flex items-center justify-center">
                  <button onClick={handlePlayPause} className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center shadow-2xl active:scale-75 transition-transform">
                    <i className={`fa-solid ${isGlobalPlaying ? 'fa-pause' : 'fa-play'} text-2xl`}></i>
                  </button>
               </div>
               
               <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-4 bg-black/60 backdrop-blur-xl p-3 px-4 rounded-[1.5rem] border border-white/10 shadow-2xl">
                     <button onClick={handlePlayPause} className="text-xl w-8 flex items-center justify-center active:scale-75 transition-all">
                        <i className={`fa-solid ${isGlobalPlaying ? 'fa-pause' : 'fa-play'} text-sm`}></i>
                     </button>
                     <span className="text-[10px] font-black text-slate-300 w-10 text-center">{formatTime(currentTime)}</span>
                     <div className="flex-1 relative h-6 flex items-center">
                        <div className="absolute w-full h-1 bg-white/10 rounded-full"></div>
                        <div className="absolute h-1 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" style={{ width: `${progressPercent}%` }}></div>
                        <input type="range" min="0" max={duration} value={currentTime} onChange={e => { if(videoRef.current) videoRef.current.currentTime = parseFloat(e.target.value); }} className="absolute inset-0 w-full opacity-0 z-20 cursor-pointer" />
                     </div>
                     <span className="text-[10px] font-black text-slate-300 w-10 text-center">{formatTime(duration)}</span>
                     <button onClick={() => setIsPipActive(true)} className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white active:scale-75 transition-all"><i className="fa-solid fa-layer-group text-[12px]"></i></button>
                     <button onClick={() => setIsRotated(true)} className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white active:scale-75 transition-all"><i className="fa-solid fa-expand text-[12px]"></i></button>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* --- PORTRAIT CONTENT AREA OVERHAUL --- */}
        {!isRotated && (
          <div className="flex-1 overflow-y-auto no-scrollbar bg-[#020202]">
            <div className="px-4 py-5 space-y-6">
              
              {/* Title & Metadata Card */}
              <div className="bg-[#0a0a0a] border border-white/5 rounded-[1.5rem] p-5 space-y-3 shadow-xl">
                 <div className="flex items-center justify-between">
                    <h1 className="text-lg font-black text-white tracking-tight uppercase truncate">{activeContent.title}</h1>
                    <button onClick={() => setShowInfo(!showInfo)} className="text-blue-500 text-[10px] font-black uppercase tracking-widest hover:opacity-80">Info ></button>
                 </div>
                 
                 <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <div className="flex items-center gap-1 text-slate-400">
                       <i className="fa-solid fa-masks-theater text-[9px] text-blue-500"></i>
                       <span>{activeContent.category}</span>
                    </div>
                    <span className="opacity-20">|</span>
                    <div className="flex items-center gap-1 text-yellow-500">
                       <i className="fa-solid fa-star text-[8px]"></i>
                       <span>8.5</span>
                    </div>
                    <span className="opacity-20">|</span>
                    <span>2018</span>
                    <span className="opacity-20">|</span>
                    <span>India</span>
                    <span className="opacity-20">|</span>
                    <span className="text-slate-400">Action</span>
                    <span className="opacity-20">|</span>
                    <span className="text-blue-500">3 seasons</span>
                 </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                 <button onClick={() => toggleWatchlist(activeContent.id)} className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-black text-[9px] uppercase tracking-tighter transition-all shrink-0 ${isInWatchlist ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#0f0f0f] border-white/5 text-slate-400'}`}>
                    <i className={`fa-solid ${isInWatchlist ? 'fa-check' : 'fa-plus'}`}></i> Add to list
                 </button>
                 <button className="flex items-center gap-2 px-4 py-3 rounded-xl border bg-[#0f0f0f] border-white/5 text-slate-400 font-black text-[9px] uppercase tracking-tighter shrink-0 active:bg-white/5">
                    <i className="fa-solid fa-share-nodes"></i> Share
                 </button>
                 <button onClick={() => toggleDownload(activeContent.id)} className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-black text-[9px] uppercase tracking-tighter transition-all shrink-0 ${isDownloaded ? 'bg-green-600 border-green-500 text-white' : 'bg-[#0f0f0f] border-white/5 text-slate-400'}`}>
                    <i className={`fa-solid ${isDownloaded ? 'fa-check' : 'fa-download'}`}></i> Download
                 </button>
                 <button onClick={() => navigate('/downloads')} className="flex items-center gap-2 px-4 py-3 rounded-xl border bg-[#0f0f0f] border-white/5 text-slate-400 font-black text-[9px] uppercase tracking-tighter shrink-0">
                    <i className="fa-solid fa-folder-open"></i> View downl
                 </button>
              </div>

              {/* Uploader & Selectors */}
              <div className="space-y-4">
                 <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                    Resources Uploaded by <span className="text-slate-400">2TR\LaGazel etc. ?</span>
                 </p>
                 <div className="flex gap-3">
                    <button onClick={() => setActiveDrawer('language')} className="flex-1 flex items-center justify-between px-4 py-3 bg-[#0a0a0a] border border-white/5 rounded-xl text-[10px] font-black uppercase text-slate-400">
                       English <i className="fa-solid fa-caret-down text-[8px] text-slate-700"></i>
                    </button>
                    <button onClick={() => setActiveDrawer('playlist')} className="flex-1 flex items-center justify-between px-4 py-3 bg-[#0a0a0a] border border-white/5 rounded-xl text-[10px] font-black uppercase text-slate-400">
                       Season 0{activeSeason} <i className="fa-solid fa-caret-down text-[8px] text-slate-700"></i>
                    </button>
                 </div>
              </div>

              {/* Numbered Episode Scroll */}
              <div className="space-y-3">
                 <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <button className="h-9 px-5 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">All</button>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                       <button key={n} onClick={() => {}} className="h-9 w-11 flex-shrink-0 bg-[#0a0a0a] border border-white/5 text-slate-500 rounded-lg text-[10px] font-black hover:border-blue-500 hover:text-white transition-all">
                          {n.toString().padStart(2, '0')}
                       </button>
                    ))}
                 </div>
              </div>

              {/* For You / Recommended Section */}
              <div className="pt-6 border-t border-white/5 space-y-6">
                 <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">For you</h3>
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-white/5 rounded-full">
                       <span className="text-[9px] font-black text-slate-500 uppercase">Comments</span>
                       <span className="text-[9px] font-black text-blue-500">99+</span>
                    </div>
                 </div>
                 <div className="grid grid-cols-3 gap-3">
                    {recommendations.map(item => (
                      <div key={item.id} onClick={() => navigate(`/watch/${item.id}`)} className="space-y-2 group cursor-pointer">
                        <div className="aspect-[3/4.5] rounded-xl overflow-hidden relative border border-white/5 bg-slate-900 shadow-xl group-hover:border-blue-500/30 transition-all">
                           <img src={item.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform opacity-70" />
                        </div>
                        <h4 className="text-[8px] font-black text-slate-500 truncate uppercase tracking-tighter text-center">{item.title}</h4>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!isRotated && activeDrawer !== 'none' && (
        <div className="fixed inset-0 z-[2100] flex flex-col justify-end">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveDrawer('none')}></div>
           <div className="relative bg-[#0f0f0f] border-t border-white/5 rounded-t-[2rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
              <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto mb-8"></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 text-center">{activeDrawer} Options</h3>
              <div className="space-y-3 max-h-[50vh] overflow-y-auto no-scrollbar">
                 {activeDrawer === 'language' && ['English', 'Hindi (Org)', 'Tamil', 'Telugu'].map(lang => (
                   <button key={lang} onClick={() => setActiveDrawer('none')} className="w-full p-4 rounded-xl bg-slate-950 border border-white/5 text-left text-xs font-black uppercase text-slate-400 active:bg-blue-600 active:text-white transition-all">{lang}</button>
                 ))}
                 {activeDrawer === 'playlist' && [1, 2, 3].map(s => (
                   <button key={s} onClick={() => { setActiveSeason(s); setActiveDrawer('none'); }} className={`w-full p-4 rounded-xl border text-left text-xs font-black uppercase transition-all ${activeSeason === s ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950 border-white/5 text-slate-400'}`}>Season 0{s}</button>
                 ))}
              </div>
              <button onClick={() => setActiveDrawer('none')} className="w-full mt-6 py-3 text-[10px] font-black uppercase text-slate-500 tracking-widest">Close</button>
           </div>
        </div>
      )}
    </div>
  );
};
