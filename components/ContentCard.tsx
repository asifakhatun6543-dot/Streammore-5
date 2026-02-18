
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Content } from '../types';
import { useApp } from '../store/AppContext';

interface ContentCardProps {
  content: Content;
}

export const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
  const { watchlist, toggleWatchlist, downloads } = useApp();
  const [isCopied, setIsCopied] = useState(false);
  const isInWatchlist = watchlist.includes(content.id);
  const isDownloaded = downloads.includes(content.id);

  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist(content.id);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareData = {
      title: content.title,
      text: content.description,
      url: `${window.location.origin}/#/watch/${content.id}`
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <div className="group relative">
      <Link 
        to={`/watch/${content.id}`} 
        className="block relative overflow-hidden rounded-[1.25rem] transition-all duration-500 ease-out hover:scale-[1.04] hover:z-20 bg-slate-900 shadow-xl hover:shadow-[0_20px_50px_rgba(37,99,235,0.15)] border border-slate-800/60 hover:border-blue-500/40"
      >
        <div className="aspect-[16/9] w-full relative overflow-hidden">
          {/* Main Thumbnail */}
          <img 
            src={content.thumbnail} 
            alt={content.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:opacity-60"
          />
          
          {/* Subtle Overlay Shine */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          
          {/* Offline Indicator */}
          {isDownloaded && (
            <div className="absolute top-2.5 left-2.5 z-10 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-green-900/20 animate-in fade-in zoom-in border border-white/20">
              <i className="fa-solid fa-circle-check text-[10px]"></i>
            </div>
          )}
          
          {/* Overlay Content */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
              <h3 className="text-white font-black text-lg leading-tight mb-2 drop-shadow-md">{content.title}</h3>
              <div className="flex items-center gap-3 text-[10px] text-slate-200 font-black uppercase tracking-widest delay-75 transition-all">
                <span className="flex items-center gap-1 text-yellow-500">
                  <i className="fa-solid fa-star text-[9px]"></i>
                  {content.rating}
                </span>
                <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                <span>{content.releaseYear}</span>
                <span className="bg-blue-600 text-white px-2 py-0.5 rounded-md text-[8px] font-black">
                  {content.type}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Action Buttons Container */}
      <div className="absolute top-3 right-3 z-30 flex gap-2">
        {/* Share Button */}
        <button
          onClick={handleShare}
          className={`w-9 h-9 rounded-xl backdrop-blur-md border transition-all duration-300 flex items-center justify-center opacity-0 translate-y-[-8px] group-hover:opacity-100 group-hover:translate-y-0 shadow-xl ${
            isCopied 
              ? 'bg-green-600 border-green-400 text-white' 
              : 'border-slate-700/50 bg-slate-950/40 text-slate-300 hover:bg-blue-600 hover:border-blue-500 hover:text-white hover:scale-110'
          }`}
          title={isCopied ? "Copied!" : "Share Content"}
        >
          <i className={`fa-solid ${isCopied ? 'fa-check' : 'fa-share-nodes'} text-xs`}></i>
        </button>

        {/* Add to Watchlist Button */}
        <button
          onClick={handleToggleWatchlist}
          className={`w-9 h-9 rounded-xl backdrop-blur-md border transition-all duration-300 flex items-center justify-center opacity-0 translate-y-[-8px] group-hover:opacity-100 group-hover:translate-y-0 shadow-xl ${
            isInWatchlist 
              ? 'bg-blue-600 border-blue-400 text-white scale-100' 
              : 'bg-slate-950/40 border-slate-700/50 text-slate-300 hover:bg-blue-600 hover:border-blue-500 hover:text-white hover:scale-110'
          }`}
          title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        >
          <i className={`fa-solid ${isInWatchlist ? 'fa-check' : 'fa-plus'} text-xs`}></i>
        </button>
      </div>
    </div>
  );
};
