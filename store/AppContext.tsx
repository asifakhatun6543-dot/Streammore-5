
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Content, AdConfig, UIConfig } from '../types';
import { MOCK_CONTENT, MOCK_ADS } from '../constants';

type Theme = 'dark' | 'light';

const DEFAULT_UI_CONFIG: UIConfig = {
  navigation: {
    showShortDrama: true,
    showDownloads: true,
    showSearch: true,
  },
  homePage: {
    showHeroBanner: true,
    showLiveSection: true,
    showGenreExplorer: true,
    showInfiniteGrid: true,
  },
  watchPage: {
    showComments: true,
    showDownloads: true,
    showShare: true,
    showWatchlist: true,
    showRecommendations: true,
  },
  global: {
    showAIAssistant: true,
    enableDarkModeToggle: true,
  },
};

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  content: Content[];
  setContent: (content: Content[]) => void;
  ads: AdConfig[];
  setAds: (ads: AdConfig[]) => void;
  watchlist: string[];
  toggleWatchlist: (id: string) => void;
  downloads: string[];
  toggleDownload: (id: string) => void;
  theme: Theme;
  toggleTheme: () => void;
  isLoading: boolean;
  logout: () => void;
  playbackProgress: Record<string, number>;
  saveProgress: (contentId: string, timestamp: number) => void;
  clearProgress: (contentId: string) => void;
  uiConfig: UIConfig;
  updateUIConfig: (newConfig: UIConfig) => void;
  // Global Player States
  activeVideoId: string | null;
  setActiveVideoId: (id: string | null) => void;
  isMiniplayerActive: boolean;
  setMiniplayerActive: (active: boolean) => void;
  isGlobalPlaying: boolean;
  setIsGlobalPlaying: (playing: boolean) => void;
  globalSeekTrigger: number; // Increment this to trigger a seek
  triggerGlobalSeek: (delta: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [content, setContent] = useState<Content[]>(MOCK_CONTENT);
  const [ads, setAds] = useState<AdConfig[]>(MOCK_ADS);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [downloads, setDownloads] = useState<string[]>(() => {
    const saved = localStorage.getItem('streammore_downloads');
    return saved ? JSON.parse(saved) : [];
  });
  const [playbackProgress, setPlaybackProgress] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('streammore_progress');
    return saved ? JSON.parse(saved) : {};
  });
  const [uiConfig, setUiConfig] = useState<UIConfig>(() => {
    const saved = localStorage.getItem('streammore_ui_config');
    return saved ? JSON.parse(saved) : DEFAULT_UI_CONFIG;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('streammore_theme') as Theme) || 'dark';
  });

  // Global Player States
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isMiniplayerActive, setMiniplayerActive] = useState(false);
  const [isGlobalPlaying, setIsGlobalPlaying] = useState(false);
  const [globalSeekTrigger, setGlobalSeekTrigger] = useState(0);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    localStorage.setItem('streammore_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('streammore_downloads', JSON.stringify(downloads));
  }, [downloads]);

  useEffect(() => {
    localStorage.setItem('streammore_progress', JSON.stringify(playbackProgress));
  }, [playbackProgress]);

  useEffect(() => {
    localStorage.setItem('streammore_ui_config', JSON.stringify(uiConfig));
  }, [uiConfig]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const triggerGlobalSeek = (delta: number) => {
    setGlobalSeekTrigger(prev => prev + delta);
  };

  const toggleWatchlist = (id: string) => {
    setWatchlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleDownload = (id: string) => {
    setDownloads(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const saveProgress = (contentId: string, timestamp: number) => {
    setPlaybackProgress(prev => ({
      ...prev,
      [contentId]: timestamp
    }));
  };

  const clearProgress = (contentId: string) => {
    setPlaybackProgress(prev => {
      const next = { ...prev };
      delete next[contentId];
      return next;
    });
  };

  const updateUIConfig = (newConfig: UIConfig) => {
    setUiConfig(newConfig);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const logout = () => {
    setUser(null);
    setWatchlist([]);
  };

  return (
    <AppContext.Provider value={{ 
      user, setUser, content, setContent, ads, setAds, watchlist, toggleWatchlist,
      downloads, toggleDownload, theme, toggleTheme, isLoading, logout,
      playbackProgress, saveProgress, clearProgress, uiConfig, updateUIConfig,
      activeVideoId, setActiveVideoId, isMiniplayerActive, setMiniplayerActive,
      isGlobalPlaying, setIsGlobalPlaying, globalSeekTrigger, triggerGlobalSeek
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
