
import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { Button } from '../components/Button';

export const Profile: React.FC = () => {
  const { user, logout, theme, toggleTheme, playbackProgress, content } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Filter content items that have saved playback progress
  const continueWatchingItems = useMemo(() => {
    const realProgress = content
      .filter(item => playbackProgress[item.id] !== undefined && playbackProgress[item.id] > 0)
      .map(item => ({
        ...item,
        progress: playbackProgress[item.id],
        isReal: true
      }));

    if (realProgress.length > 0) return realProgress;

    // Placeholder data
    return content.filter(c => c.isTrending).slice(0, 2).map(c => ({
      ...c,
      progress: 0,
      isReal: false
    }));
  }, [content, playbackProgress]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-slate-700 text-3xl">
          <i className="fa-solid fa-user-slash"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold">Not Logged In</h2>
          <p className="text-slate-500 mt-2">Please login to manage your profile.</p>
        </div>
        <Button onClick={() => navigate('/login')}>Sign In</Button>
      </div>
    );
  }

  const sections = [
    {
      title: 'Account Settings',
      links: [
        { 
          label: 'Edit Profile', 
          icon: 'fa-user-pen', 
          path: '#', 
          onClick: (e: any) => { e.preventDefault(); alert('Coming soon...'); } 
        },
        { 
            label: 'My Watchlist', 
            icon: 'fa-bookmark', 
            path: '/watchlist' 
        },
        { 
          label: 'Appearance', 
          icon: theme === 'dark' ? 'fa-moon' : 'fa-sun', 
          path: '#', 
          value: theme === 'dark' ? 'Dark Mode' : 'Light Mode', 
          onClick: (e: any) => { e.preventDefault(); toggleTheme(); } 
        },
        { label: 'General Settings', icon: 'fa-gear', path: '/settings' },
        { label: 'Billing History', icon: 'fa-receipt', path: '/admin/payments' },
        { label: 'Parental Controls', icon: 'fa-shield-halved', path: '#' },
      ]
    },
    {
      title: 'Support & Legal',
      links: [
        { label: 'Premium Membership', icon: 'fa-crown', path: '/premium', highlight: true },
        { label: 'Contact Support', icon: 'fa-headset', path: '/contact-support' },
        { label: 'Feedback', icon: 'fa-comment-dots', path: '/feedback' },
        { label: 'Privacy Policy', icon: 'fa-user-lock', path: '/privacy-policy' },
        { label: 'Terms of Service', icon: 'fa-file-lines', path: '/terms-of-service' },
      ]
    }
  ];

  const formatTime = (seconds: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20 px-4 md:px-0">
      {/* Header Profile Card */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden p-6 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full"></div>
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative group">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-blue-600 p-1 bg-slate-950 shadow-2xl overflow-hidden">
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-3">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">{user.username}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
               <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-500">
                 ID: {user.id}
               </span>
               {user.isPremium && (
                 <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 flex items-center gap-1.5">
                   <i className="fa-solid fa-crown"></i> Premium
                 </span>
               )}
               {user.isAdmin && (
                 <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400 flex items-center gap-1.5">
                   <i className="fa-solid fa-shield-halved"></i> Admin
                 </span>
               )}
            </div>
          </div>

          <Button variant="danger" className="rounded-xl px-6 py-3 text-[10px] font-black uppercase" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </div>

      {/* ADMIN SHORTCUT (Only for Admins) */}
      {user.isAdmin && (
        <section className="animate-in slide-in-from-top duration-700">
          <div 
            onClick={() => navigate('/admin')}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-[2rem] shadow-xl shadow-blue-900/20 cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
               <i className="fa-solid fa-shield-halved text-8xl text-white -rotate-12"></i>
            </div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Admin Dashboard</h3>
                <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Manage Content, Ads, and Support Tickets</p>
              </div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white group-hover:bg-white/30 transition-all">
                <i className="fa-solid fa-arrow-right"></i>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CONTINUE WATCHING */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
            <div className="w-1 h-3 bg-blue-600 rounded-full"></div>
            {continueWatchingItems[0]?.isReal ? "Continue Watching" : "Recommended for You"}
          </h3>
          <Link to="/home" className="text-[9px] font-black text-blue-500 uppercase hover:underline">Explore More</Link>
        </div>
        
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
          {continueWatchingItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => navigate(`/watch/${item.id}`)}
              className="min-w-[280px] md:min-w-[340px] group cursor-pointer"
            >
              <div className="aspect-[16/7] relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl group-hover:border-blue-500/40 transition-all duration-300">
                <img 
                  src={item.thumbnail} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-70 group-hover:opacity-100"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 flex flex-col justify-end">
                   <h4 className="text-xs font-black text-white truncate mb-0.5">{item.title}</h4>
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                      {item.isReal ? `Paused at ${formatTime(item.progress)}` : "Start watching now"}
                   </p>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                   <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                      <i className="fa-solid fa-play text-white text-xs ml-0.5"></i>
                   </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                   <div 
                      className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                      style={{ width: item.isReal ? '45%' : '0%' }}
                   ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Menu Sections */}
      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-slate-900/40 border border-slate-800/60 rounded-[2rem] p-6 md:p-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 px-2 flex items-center gap-2">
               <div className="w-1 h-3 bg-slate-700 rounded-full"></div>
               {section.title}
            </h3>
            <div className="space-y-2">
              {section.links.map((link, lIdx) => (
                <Link 
                  key={lIdx} 
                  to={link.path}
                  onClick={(e) => link.onClick ? link.onClick(e) : null}
                  className={`flex items-center justify-between p-4 rounded-2xl hover:bg-slate-800/60 transition-all group border border-transparent ${
                    link.highlight ? 'bg-blue-600/5 border-blue-600/10' : 'bg-slate-950/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      link.highlight ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-900 text-slate-500 group-hover:text-blue-500'
                    }`}>
                      <i className={`fa-solid ${link.icon} text-xs`}></i>
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold tracking-tight ${link.highlight ? 'text-white' : 'text-slate-300'}`}>{link.label}</span>
                      {link.value && <span className="text-[9px] text-slate-500 font-bold uppercase">{link.value}</span>}
                    </div>
                  </div>
                  <i className="fa-solid fa-chevron-right text-[8px] text-slate-800 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"></i>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info & Disclaimers */}
      <div className="pt-12 pb-8 text-center border-t border-white/5 space-y-6">
        <div className="space-y-2">
           <h4 className="text-white font-black text-lg flex items-center justify-center gap-2">
             All reserve by RS7 <span className="text-red-500 animate-pulse">💓</span>
           </h4>
           <div className="max-w-xl mx-auto space-y-1">
              <p className="text-slate-600 text-[9px] leading-relaxed font-bold uppercase tracking-widest opacity-80">
                All the content of streammore doesn't store it server. 
              </p>
              <p className="text-slate-600 text-[9px] leading-relaxed font-bold uppercase tracking-widest opacity-80">
                All content provide non- affiliated third party app / website
              </p>
           </div>
        </div>
        
        <div className="inline-flex items-center gap-2 text-slate-800 text-[8px] font-black uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity cursor-default">
           <i className="fa-solid fa-shield-halved"></i>
           Secure Streaming • v2.5.0
        </div>
      </div>
    </div>
  );
};
