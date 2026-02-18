
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { Button } from '../components/Button';

const Switch: React.FC<{ active: boolean; onChange: () => void }> = ({ active, onChange }) => (
  <button 
    type="button"
    onClick={(e) => { e.stopPropagation(); onChange(); }}
    className={`w-14 h-7 rounded-full transition-all duration-300 relative border ${
      active ? 'bg-cyan-400 border-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.3)]' : 'bg-slate-700 border-slate-600'
    }`}
  >
    <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ease-out ${
      active ? 'left-[1.85rem]' : 'left-0.5'
    }`}></div>
  </button>
);

const SettingItem: React.FC<{ 
  label: string; 
  value?: string; 
  icon?: string; 
  onClick?: () => void;
  showArrow?: boolean;
}> = ({ label, value, onClick, showArrow = true }) => (
  <button 
    type="button"
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 hover:bg-slate-800/30 active:bg-slate-800/50 transition-colors group text-left"
  >
    <span className="text-base text-slate-300 font-medium group-hover:text-white">{label}</span>
    <div className="flex items-center gap-4">
      {value && <span className="text-sm text-slate-500 font-medium">{value}</span>}
      {showArrow && <i className="fa-solid fa-chevron-right text-xs text-slate-600 group-hover:text-slate-400"></i>}
    </div>
  </button>
);

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  
  // Local States
  const [familyMode, setFamilyMode] = useState(false);
  const [bgDownload, setBgDownload] = useState(false);
  const [miniplayer, setMiniplayer] = useState(true);
  
  // UI States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');

  const handleCheckUpdate = () => {
    setIsCheckingUpdate(true);
    setTimeout(() => {
      setIsCheckingUpdate(false);
      alert("Your app is up to date! (Version 3.0.11)");
    }, 2000);
  };

  const handleLanguageSelect = (lang: string) => {
    setCurrentLang(lang);
    setShowLanguageModal(false);
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 relative min-h-screen animate-in fade-in duration-500">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md py-4 mb-6 flex items-center gap-6 px-4 -mx-4 border-b border-slate-900/50">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-slate-900 transition-colors"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <h1 className="text-xl font-bold text-white text-center flex-1 pr-10">Settings</h1>
      </div>

      <div className="space-y-8 px-4">
        {/* Section 1: App Preferences */}
        <section className="space-y-4">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Your app and preferences</h2>
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl overflow-hidden divide-y divide-slate-800/40 shadow-sm">
            <SettingItem label="Notifications" onClick={() => alert("Notification settings coming soon.")} />
            <SettingItem label="Language" value={currentLang} onClick={() => setShowLanguageModal(true)} />
            <SettingItem label="Watch Options" value="Streaming" onClick={() => alert("Watch options coming soon.")} />
            
            {/* Family Mode */}
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-base text-slate-300 font-medium">Family Mode</span>
                <Switch active={familyMode} onChange={() => setFamilyMode(!familyMode)} />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                This helps hide potentially mature videos. No filter is 100% accurate.
              </p>
            </div>

            {/* Download in background */}
            <div className="p-5 flex items-center justify-between hover:bg-slate-800/10 cursor-pointer" onClick={() => setBgDownload(!bgDownload)}>
              <span className="text-base text-slate-300 font-medium">Download in background</span>
              <Switch active={bgDownload} onChange={() => setBgDownload(!bgDownload)} />
            </div>

            {/* Miniplayer */}
            <div className="p-5 space-y-3 hover:bg-slate-800/10 cursor-pointer" onClick={() => setMiniplayer(!miniplayer)}>
              <div className="flex items-center justify-between">
                <span className="text-base text-slate-300 font-medium">Auto activate Miniplayer</span>
                <Switch active={miniplayer} onChange={() => setMiniplayer(!miniplayer)} />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                When enabled, switching pages during playback will automatically enable Miniplayer.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Info & Support */}
        <section className="space-y-4">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">More info and support</h2>
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl overflow-hidden divide-y divide-slate-800/40 shadow-sm">
            <SettingItem 
              label={isCheckingUpdate ? "Checking for updates..." : "Check update"} 
              onClick={handleCheckUpdate}
              showArrow={!isCheckingUpdate}
            />
            <SettingItem label="About us" onClick={() => alert("StreamMore v3.0.11 - Premium Streaming Experience.")} />
            <SettingItem label="Privacy Policy" onClick={() => navigate('/privacy-policy')} />
            <SettingItem label="User Agreement" onClick={() => navigate('/terms-of-service')} />
          </div>
        </section>

        {/* Auth Button - Visible only if NOT logged in */}
        {!user && (
          <div className="pt-4">
            <button 
              onClick={() => setShowAuthModal(true)}
              className="w-full py-5 rounded-2xl font-bold text-base text-slate-950 bg-gradient-to-r from-cyan-400 to-green-400 shadow-xl shadow-cyan-400/20 active:scale-[0.98] transition-all"
            >
              Log in/Sign up
            </button>
          </div>
        )}

        {/* Footer Info */}
        <div className="pt-8 text-center space-y-2 opacity-30 select-none">
          <p className="text-[10px] font-bold text-slate-500 tracking-tighter">
            3.0.11.1230.03-50020080 | 2525207596810781656 | 15 | 23076PC4BI | NETWORK_5G
          </p>
          <p className="text-[10px] font-bold text-slate-500 tracking-tighter uppercase">
            5.2GB | 41.4GB
          </p>
        </div>
      </div>

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowLanguageModal(false)}></div>
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-[2rem] p-6 shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Select Language</h3>
            <div className="space-y-2">
              {['English', 'Hindi', 'Spanish', 'French', 'German'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageSelect(lang)}
                  className={`w-full p-4 rounded-2xl text-left font-medium transition-all ${
                    currentLang === lang ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {lang}
                  {currentLang === lang && <i className="fa-solid fa-check float-right mt-1"></i>}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowLanguageModal(false)}
              className="w-full mt-4 py-3 text-slate-500 text-sm font-bold uppercase tracking-widest"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Auth Popup (Bottom Sheet) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowAuthModal(false)}
          ></div>
          <div className="relative bg-slate-900 border-t border-slate-800 rounded-t-[3rem] p-8 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom duration-300 ease-out">
            <div className="w-12 h-1.5 bg-slate-800 rounded-full mx-auto mb-8"></div>
            <div className="text-center mb-10">
              <h3 className="text-2xl font-black text-white mb-2">Welcome to StreamMore</h3>
              <p className="text-slate-500 text-sm">Join millions of viewers worldwide.</p>
            </div>
            
            <div className="space-y-4 max-w-sm mx-auto">
              <Button className="w-full py-5 rounded-2xl text-base shadow-lg shadow-blue-600/20" onClick={() => { setShowAuthModal(false); navigate('/login'); }}>
                Sign In with Email
              </Button>
              <Button variant="outline" className="w-full py-5 rounded-2xl border-slate-700 hover:border-slate-500 text-base" onClick={() => { setShowAuthModal(false); navigate('/signup'); }}>
                Create New Account
              </Button>
              <button 
                onClick={() => setShowAuthModal(false)}
                className="w-full py-4 text-slate-500 font-bold text-sm uppercase tracking-widest hover:text-slate-300 transition-colors"
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
