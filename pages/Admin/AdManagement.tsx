
import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Button } from '../../components/Button';

export const AdManagement: React.FC = () => {
  const { ads, setAds } = useApp();
  const [newAd, setNewAd] = useState({ name: '', position: 'home', code: '' });

  const handleAddAd = () => {
    if (!newAd.name || !newAd.code) return;
    setAds([...ads, { ...newAd, id: Date.now().toString(), isActive: true, position: newAd.position as any }]);
    setNewAd({ name: '', position: 'home', code: '' });
  };

  const toggleAd = (id: string) => {
    setAds(ads.map(ad => ad.id === id ? { ...ad, isActive: !ad.isActive } : ad));
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black">Advertisement Settings</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
            <h3 className="text-xl font-bold mb-6">Create New Ad Unit</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Unit Name</label>
                <input 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3" 
                  placeholder="e.g., Home Page Sidebar"
                  value={newAd.name}
                  onChange={(e) => setNewAd({...newAd, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Position</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3"
                  value={newAd.position}
                  onChange={(e) => setNewAd({...newAd, position: e.target.value})}
                >
                  <option value="home">Home Page</option>
                  <option value="watch_page">Watch Page</option>
                  <option value="sidebar">Global Sidebar</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">HTML/JS Code</label>
                <textarea 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 h-32 font-mono text-xs" 
                  placeholder="<script>...</script>"
                  value={newAd.code}
                  onChange={(e) => setNewAd({...newAd, code: e.target.value})}
                />
              </div>
              <Button className="w-full" onClick={handleAddAd}>Create Ad Unit</Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
            <div className="p-8 border-b border-slate-800">
              <h3 className="text-xl font-bold">Manage Ad Units</h3>
            </div>
            <div className="divide-y divide-slate-800">
              {ads.map(ad => (
                <div key={ad.id} className="p-6 flex items-center justify-between hover:bg-slate-800/20">
                  <div>
                    <h4 className="font-bold text-white mb-1">{ad.name}</h4>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">Position: {ad.position}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-black uppercase ${ad.isActive ? 'text-green-500' : 'text-red-500'}`}>
                        {ad.isActive ? 'Active' : 'Paused'}
                      </span>
                      <button 
                        onClick={() => toggleAd(ad.id)}
                        className={`w-12 h-6 rounded-full relative transition-all ${ad.isActive ? 'bg-blue-600' : 'bg-slate-700'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${ad.isActive ? 'left-7' : 'left-1'}`}></div>
                      </button>
                    </div>
                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-500"><i className="fa-solid fa-trash"></i></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
