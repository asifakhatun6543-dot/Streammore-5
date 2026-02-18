
import React, { useMemo } from 'react';
import { useApp } from '../store/AppContext';
import { ContentCard } from '../components/ContentCard';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

export const Downloads: React.FC = () => {
  const { content, downloads, toggleDownload } = useApp();
  const navigate = useNavigate();

  const downloadedItems = useMemo(() => {
    return content.filter(item => downloads.includes(item.id));
  }, [content, downloads]);

  // Mock storage calculation
  const totalStorage = 64; // GB
  const usedStorage = (downloadedItems.length * 1.2).toFixed(1); // Avg 1.2GB per movie
  const storagePercentage = (parseFloat(usedStorage) / totalStorage) * 100;

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete ALL offline downloads?')) {
      downloadedItems.forEach(item => toggleDownload(item.id));
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-white">Offline Library</h1>
          <p className="text-slate-500 text-lg">Movies and series available to watch without internet.</p>
        </div>
        
        {downloadedItems.length > 0 && (
          <Button 
            variant="ghost" 
            className="text-red-500 hover:text-red-400 font-black uppercase tracking-widest text-xs"
            onClick={handleClearAll}
          >
            <i className="fa-solid fa-trash-can mr-2"></i> Clear All Downloads
          </Button>
        )}
      </div>

      {/* Storage Indicator */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 shrink-0">
          <i className="fa-solid fa-hard-drive text-2xl"></i>
        </div>
        <div className="flex-1 w-full space-y-4">
          <div className="flex justify-between items-end">
             <div className="space-y-1">
               <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Device Storage</p>
               <h3 className="text-xl font-black text-white">{usedStorage} GB <span className="text-slate-500 font-medium text-sm">used of {totalStorage} GB</span></h3>
             </div>
             <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{downloadedItems.length} items offline</p>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-1000 ease-out" 
              style={{ width: `${storagePercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {downloadedItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {downloadedItems.map(item => (
            <div key={item.id} className="relative group animate-in zoom-in duration-300">
              <ContentCard content={item} />
              <div className="absolute top-3 left-3 z-30">
                <div className="bg-green-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-lg flex items-center gap-1 border border-green-500">
                  <i className="fa-solid fa-circle-check"></i> Available Offline
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-8 bg-slate-900/30 rounded-[3rem] border border-dashed border-slate-800 p-12">
          <div className="w-32 h-32 bg-slate-900 rounded-full flex items-center justify-center text-slate-700 text-5xl shadow-inner border border-slate-800">
            <i className="fa-solid fa-cloud-arrow-down animate-bounce"></i>
          </div>
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-white">Your library is empty</h3>
            <p className="text-slate-400 max-w-sm mx-auto leading-relaxed">
              Download your favorite movies and shows to watch them on the go, even when you're offline.
            </p>
          </div>
          <Button 
            size="lg" 
            className="rounded-2xl px-12 py-5 font-black uppercase tracking-widest text-xs"
            onClick={() => navigate('/home')}
          >
            Browse Trending Hits
          </Button>
        </div>
      )}

      {/* Tips Section */}
      <div className="grid md:grid-cols-3 gap-6 pt-12">
        {[
          { title: 'Data Saver', desc: 'Choose lower quality to save storage space and data.', icon: 'fa-gauge-high' },
          { title: 'Auto-Delete', desc: 'Finished episodes can be set to delete automatically.', icon: 'fa-broom' },
          { title: 'Wi-Fi Only', desc: 'Downloads will pause if you switch to mobile data.', icon: 'fa-wifi' }
        ].map((tip, i) => (
          <div key={i} className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800/60 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-slate-500 shrink-0">
               <i className={`fa-solid ${tip.icon}`}></i>
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">{tip.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{tip.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
