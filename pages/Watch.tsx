
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { Content } from '../types';
import { getAIRecommendations } from '../services/geminiService';
import { Button } from '../components/Button';

declare const Hls: any;

type DrawerType = 'none' | 'playlist' | 'settings' | 'help';
type FitMode = 'contain' | 'cover' | 'fill';

export const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    content, watchlist, setActiveVideoId, isGlobalPlaying, 
    setIsGlobalPlaying, saveProgress, downloads, playbackProgress 
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
  const [errorState, setErrorState] = useState(false);
  
  // UI States
  const [videoFit, setVideoFit] = useState<FitMode>('contain');
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>('none');
  const [showInfo, setShowInfo] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(false);

  // Video Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<any>(null);
  const controlsTimeout = useRef<number | null>(null);

  useEffect(() => {
    const item = content.find(c => c.id === id);
    if (item) {
      setActiveContent(item);
      setActiveVideoId(item.id);
      getAIRecommendations(item, content).then(setRecommendations);
      setIsGlobalPlaying(true);
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
    if (videoRef.current) {
      if (isGlobalPlaying) videoRef.current.play().catch(() => setErrorState(true));
      else videoRef.current.pause();
    }
  }, [isGlobalPlaying]);

  useEffect(() => {
    if (!activeContent || !videoRef.current) return;
    const video = videoRef.current;
    const url = activeContent.videoUrl;

    if (typeof Hls !== 'undefined' && Hls.isSupported() && url.includes('.m3u8')) {
      if (hlsRef.current) hlsRef.current.destroy();
      hlsRef.current = new Hls();
      hlsRef.current.loadSource(url);
      hlsRef.current.attachMedia(video);
    } else {
      video.src = url;
    }

    const handleLoaded = () => setDuration(video.duration);
    video.addEventListener('loadedmetadata', handleLoaded);
    return () => {
      video.removeEventListener('loadedmetadata', handleLoaded);
      if (activeContent) saveProgress(activeContent.id, video.currentTime);
    };
  }, [activeContent]);

  useEffect(() => {
    if (showControls && isGlobalPlaying && !isLocked) {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
      controlsTimeout.current = window.setTimeout(() => setShowControls(false), 5000);
    }
    return () => { if (controlsTimeout.current) clearTimeout(controlsTimeout.current); };
  }, [showControls, isGlobalPlaying, isLocked]);

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

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!activeContent) return null;
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-[#020202] min-h-screen text-white select-none overflow-hidden relative">
      <div className={`transition-all duration-700 ease-in-out ${isRotated ? 'fixed inset-0 z-[1000] rotate-90 w-[100dvh] h-[100dvw]' : 'flex flex-col h-screen'}`}>
        
        {!isRotated && (
          <div className="absolute top-0 left-0 right-0 z-[100] p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/5 active:scale-90">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          </div>
        )}

        <div className={`relative bg-black flex items-center justify-center overflow-hidden shrink-0 ${isRotated ? 'w-full h-full' : 'aspect-video w-full'}`} 
             onClick={() => setShowControls(!showControls)}>
          
          <video 
            ref={videoRef}
            className="w-full h-full pointer-events-none"
            style={{ objectFit: videoFit }}
            onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
            playsInline
          />

          {showControls && (
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-sm font-bold uppercase tracking-widest">{activeContent.title}</h2>
                <div className="flex gap-4">
                   <button onClick={(e) => { e.stopPropagation(); setActiveDrawer('settings'); }} className="text-white opacity-60 hover:opacity-100"><i className="fa-solid fa-gear"></i></button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-12">
                <button onClick={(e) => {e.stopPropagation(); handleSeekRel(-10);}} className="text-2xl opacity-80"><i className="fa-solid fa-rotate-left"></i></button>
                <button onClick={handlePlayPause} className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-4xl border border-white/20">
                  <i className={`fa-solid ${isGlobalPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                </button>
                <button onClick={(e) => {e.stopPropagation(); handleSeekRel(10);}} className="text-2xl opacity-80"><i className="fa-solid fa-rotate-right"></i></button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-[10px] font-bold">
                  <span>{formatTime(currentTime)}</span>
                  <div className="flex-1 h-1 bg-white/20 rounded-full relative">
                    <div className="absolute h-full bg-blue-500 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                  <span>{formatTime(duration)}</span>
                </div>
                <div className="flex justify-between">
                   <button onClick={(e) => { e.stopPropagation(); setIsRotated(!isRotated); }} className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                     <i className="fa-solid fa-expand"></i> {isRotated ? 'Exit Full' : 'Fullscreen'}
                   </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {!isRotated && (
          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#020202]">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black uppercase tracking-tight">{activeContent.title}</h1>
                {/* FIXED LINE BELOW: Changed > to &gt; */}
                <button onClick={() => setShowInfo(!showInfo)} className="text-blue-500 text-[10px] font-black uppercase tracking-widest hover:opacity-80">Info &gt;</button>
              </div>
              <div className="flex gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                 <span className="text-yellow-500">⭐ {activeContent.rating}</span>
                 <span>{activeContent.releaseYear}</span>
                 <span className="bg-white/5 px-2 rounded">{activeContent.category}</span>
              </div>
              <p className={`text-sm text-slate-400 leading-relaxed ${showInfo ? '' : 'line-clamp-2'}`}>
                {activeContent.description}
              </p>
            </section>

            <section className="space-y-4">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Suggested For You</h3>
               <div className="grid grid-cols-2 gap-4">
                 {recommendations.map(item => (
                   <div key={item.id} onClick={() => navigate(`/watch/${item.id}`)} className="space-y-2 cursor-pointer group">
                      <div className="aspect-video rounded-xl overflow-hidden border border-white/5 bg-slate-900">
                        <img src={item.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-tight text-slate-400 group-hover:text-white truncate">{item.title}</p>
                   </div>
                 ))}
               </div>
            </section>
          </div>
        )}
      </div>

      {activeDrawer !== 'none' && (
        <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex justify-end">
           <div className="w-full max-w-xs bg-[#0a0a0a] h-full p-8 border-l border-white/10 animate-in slide-in-from-right duration-300">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xs font-black uppercase tracking-widest">Settings</h3>
                <button onClick={() => setActiveDrawer('none')} className="text-xl"><i className="fa-solid fa-xmark"></i></button>
              </div>
              <div className="space-y-6">
                 <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase mb-4">Video Fit</p>
                   <div className="grid grid-cols-1 gap-2">
                     {(['contain', 'cover', 'fill'] as const).map(f => (
                       <button key={f} onClick={() => setVideoFit(f)} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase ${videoFit === f ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400'}`}>{f}</button>
                     ))}
                   </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
