
export type ContentType = 'movie' | 'series';

export interface CastMember {
  name: string;
  photo: string;
  role?: string;
}

export interface Episode {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  description: string;
}

export interface Season {
  number: number;
  episodes: Episode[];
}

export interface Content {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  type: ContentType;
  category: string;
  rating: number;
  releaseYear: number;
  duration?: string;
  seasons?: Season[];
  isFeatured?: boolean;
  isTrending?: boolean;
  cast?: CastMember[];
  director?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  isPremium: boolean;
  isAdmin: boolean;
}

export interface AdConfig {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  position: 'home' | 'watch_page' | 'sidebar';
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
  replies: Comment[];
}

export interface UIConfig {
  navigation: {
    showShortDrama: boolean;
    showDownloads: boolean;
    showSearch: boolean;
  };
  homePage: {
    showHeroBanner: boolean;
    showLiveSection: boolean;
    showGenreExplorer: boolean;
    showInfiniteGrid: boolean;
  };
  watchPage: {
    showComments: boolean;
    showDownloads: boolean;
    showShare: boolean;
    showWatchlist: boolean;
    showRecommendations: boolean;
  };
  global: {
    showAIAssistant: boolean;
    enableDarkModeToggle: boolean;
  };
}

export interface SupportTicket {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  assignedTo?: string;
  screenshot?: string;
}
