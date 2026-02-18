
import React from 'react';
import { useApp } from '../../store/AppContext';

const ControlToggle: React.FC<{ 
  label: string; 
  description: string; 
  active: boolean; 
  onChange: () => void;
  isPremium?: boolean;
}> = ({ label, description, active, onChange, isPremium }) => (
  <div 
    onClick={onChange}
    className={`flex items-center justify-between p-6 rounded-3xl border transition-all duration-300 cursor-pointer group select-none ${
      active 
        ? 'bg-blue-600/5 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.05)]' 
        : 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700'
    }`}
  >
    <div className="space-y-1.5 pr-4">
      <div className="flex items-center gap-2">
        <h4 className={`font-black uppercase tracking-tight text-sm ${active ? 'text-blue-400' : 'text-white'}`}>
          {label}
        </h4>
        {isPremium && (
          <span className="bg-gradient-to-r from-indigo-500 to-blue-500 text-[8px] font-black text-white px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
            AI Pro
          </span>
        )}
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed font-medium group-hover:text-slate-400 transition-colors">
        {description}
      </p>
    </div>
    <button 
      className={`w-14 h-7 rounded-full relative transition-all duration-500 shrink-0 ${
        active ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-slate-700'
      }`}
    >
      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-lg ${
        active ? 'left-8' : 'left-1'
      }`}></div>
    </button>
  </div>
);

export const AppControl: React.FC = () => {
  const { uiConfig, updateUIConfig } = useApp();

  const toggleFeature = (category: keyof typeof uiConfig, feature: string) => {
    const newConfig = { ...uiConfig };
    (newConfig[category] as any)[feature] = !(newConfig[category] as any)[feature];
    updateUIConfig(newConfig);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/30">
                <i className="fa-solid fa-sliders text-white text-xl"></i>
             </div>
             <h1 className="text-4xl font-black text-white tracking-tighter uppercase">App Control</h1>
          </div>
          <p className="text-slate-500 font-medium ml-1">Configure global feature flags and layout components in real-time.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl">
           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Sync Status: Active</span>
        </div>
      </div>

      <div className="grid gap-12">
        {/* Experience & Intelligence */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Experience & Intelligence</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <ControlToggle 
              label="StreamBuddy AI Assistant" 
              description="Deploy a conversational Gemini-powered floating assistant to help users find content." 
              active={uiConfig.global.showAIAssistant}
              onChange={() => toggleFeature('global', 'showAIAssistant')}
              isPremium
            />
            <ControlToggle 
              label="Interactive Search" 
              description="Enable real-time predictive search with genre and format filtering capabilities." 
              active={uiConfig.navigation.showSearch}
              onChange={() => toggleFeature('navigation', 'showSearch')}
            />
            <ControlToggle 
              label="AI Recommendation Engine" 
              description="Replace static similar items with content-aware suggestions powered by LLMs." 
              active={uiConfig.watchPage.showRecommendations}
              onChange={() => toggleFeature('watchPage', 'showRecommendations')}
              isPremium
            />
            <ControlToggle 
              label="Theme Engine" 
              description="Allow users to toggle between cinematic dark mode and professional light mode." 
              active={uiConfig.global.enableDarkModeToggle}
              onChange={() => toggleFeature('global', 'enableDarkModeToggle')}
            />
          </div>
        </section>

        {/* Home Ecosystem */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Home Ecosystem</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <ControlToggle 
              label="Hero Content Slider" 
              description="Dynamic carousel for featured blockbusters and trending announcements." 
              active={uiConfig.homePage.showHeroBanner}
              onChange={() => toggleFeature('homePage', 'showHeroBanner')}
            />
            <ControlToggle 
              label="Short Drama Reels" 
              description="Vertical video integration for bite-sized narrative content and binge watching." 
              active={uiConfig.navigation.showShortDrama}
              onChange={() => toggleFeature('navigation', 'showShortDrama')}
            />
            <ControlToggle 
              label="Live Broadcast Pipeline" 
              description="Specialized UI for real-time sporting events and TV broadcasts." 
              active={uiConfig.homePage.showLiveSection}
              onChange={() => toggleFeature('homePage', 'showLiveSection')}
            />
            <ControlToggle 
              label="Endless Discovery Grid" 
              description="Masonry-style content grid at the bottom of the landing page for infinite browsing." 
              active={uiConfig.homePage.showInfiniteGrid}
              onChange={() => toggleFeature('homePage', 'showInfiniteGrid')}
            />
          </div>
        </section>

        {/* Playback & Engagement */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Playback & Engagement</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <ControlToggle 
              label="Universal Comments" 
              description="Community discussion threads below video playback. Moderation enabled." 
              active={uiConfig.watchPage.showComments}
              onChange={() => toggleFeature('watchPage', 'showComments')}
            />
            <ControlToggle 
              label="Offline Download Manager" 
              description="Allow users to cache encrypted video files for local playback without network." 
              active={uiConfig.watchPage.showDownloads}
              onChange={() => toggleFeature('watchPage', 'showDownloads')}
            />
          </div>
        </section>
      </div>

      <div className="bg-gradient-to-tr from-slate-900 to-slate-950 border border-white/5 rounded-[3rem] p-10 flex items-center justify-between mt-12 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full group-hover:bg-blue-600/10 transition-colors"></div>
        <div className="relative z-10">
          <h4 className="text-white font-black text-lg uppercase tracking-tight mb-2">System Performance</h4>
          <p className="text-slate-500 text-xs font-medium max-w-md">The app is currently performing optimally. All configuration changes are reflected across the CDN in under 300ms.</p>
        </div>
        <button className="relative z-10 bg-slate-800 hover:bg-slate-700 text-white font-black text-[10px] uppercase tracking-widest px-8 py-4 rounded-2xl transition-all active:scale-95">
          View Logs
        </button>
      </div>
    </div>
  );
};
