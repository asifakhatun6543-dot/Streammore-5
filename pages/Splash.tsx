
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useApp } from '../store/AppContext';

export const Splash: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, user } = useApp();

  const generateUniqueId = () => {
    // Generates a random 11-digit number like 36384738347
    return Math.floor(10000000000 + Math.random() * 90000000000).toString();
  };

  const handleWatchNow = () => {
    if (!user) {
      const newId = generateUniqueId();
      setUser({
        id: newId,
        username: `Guest_${newId.slice(-4)}`,
        email: 'guest@streammore.com',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newId}`,
        isPremium: false,
        isAdmin: false
      });
    }
    navigate('/home');
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-950">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/streaming/1920/1080?blur=10" 
          alt="Splash BG"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-slate-950/80 to-slate-950"></div>
      </div>

      <div className="relative z-10 text-center max-w-2xl px-6 animate-fade-in flex-1 flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-blue-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl shadow-blue-500/50 rotate-3 transform hover:rotate-0 transition-all duration-500 cursor-pointer">
          <i className="fa-solid fa-play text-white text-5xl"></i>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          StreamMore
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 mb-12 font-medium">
          Experience entertainment like never before. Anytime. Anywhere.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="w-full sm:w-auto text-lg px-10 py-5 rounded-2xl group"
            onClick={handleWatchNow}
          >
            Watch Now 
            <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto text-lg px-10 py-5 rounded-2xl"
            onClick={() => navigate('/login')}
          >
            Login / Sign Up
          </Button>
        </div>
      </div>

      <div className="relative z-10 pb-10 w-full px-6 flex flex-col items-center gap-6">
        <div className="flex gap-4 text-slate-600 text-[10px] md:text-xs font-bold tracking-widest uppercase opacity-60">
          <span>Movies</span>
          <span>•</span>
          <span>Series</span>
          <span>•</span>
          <span>Live TV</span>
        </div>
        
        <div className="grid place-items-center w-full max-w-screen-xl border-t border-slate-900/50 pt-6">
          <p className="text-slate-500 text-[10px] md:text-xs font-medium tracking-widest uppercase">
            All right reserve RS7
          </p>
        </div>
      </div>
    </div>
  );
};
