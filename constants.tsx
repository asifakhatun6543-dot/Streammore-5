
import { Content, AdConfig, Comment } from './types';

export const CATEGORIES = [
  'All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Bollywood', 'Hollywood', 'Thriller', 'Animation', 'Crime', 'Anime', 'Western', 'Kids', 'Education', 'Hindi', 'Tamil', 'Telugu', 'Asian', 'Indian', 'LIVE'
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    userId: 'u1',
    username: 'Aryan Sharma',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan',
    text: 'This episode was absolutely insane! The animation quality in the final fight scene is next level.',
    timestamp: '2 hours ago',
    replies: []
  }
];

export const MOCK_CONTENT: Content[] = [
  {
    id: 't1',
    title: 'Taskaree: The Smuggler',
    description: 'A gripping crime drama following the intricate web of smuggling operations.',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    type: 'series',
    category: 'Drama',
    rating: 8.7,
    releaseYear: 2024,
    isFeatured: true,
    isTrending: true
  },
  {
    id: 'm1',
    title: 'Pehla Pyaar',
    description: 'A romantic story of first love and its complications.',
    thumbnail: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed0963c?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    type: 'movie',
    category: 'Hindi',
    rating: 7.2,
    releaseYear: 2024,
    isTrending: true
  },
  {
    id: 's1',
    title: 'Panchayat',
    description: 'An engineering graduate takes up a job as a secretary of a Panchayat office.',
    thumbnail: 'https://images.unsplash.com/photo-1524748969064-cf36abd7b801?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    type: 'series',
    category: 'Comedy',
    rating: 8.9,
    releaseYear: 2024,
    isFeatured: true
  },
  {
    id: 'k1',
    title: 'Bheem Boy',
    description: 'Adventures of a small boy with super strength.',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    type: 'series',
    category: 'Kids',
    rating: 9.2,
    releaseYear: 2023
  },
  {
    id: 'k2',
    title: 'Space Explorers',
    description: 'Kids learning about the galaxy.',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    type: 'movie',
    category: 'Kids',
    rating: 8.5,
    releaseYear: 2024
  },
  {
    id: 'k3',
    title: 'Magic Forest',
    description: 'A magical journey for the little ones.',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    type: 'movie',
    category: 'Kids',
    rating: 7.8,
    releaseYear: 2022
  },
  {
    id: 'k4',
    title: 'Toy Story Tales',
    description: 'Funny stories about living toys.',
    thumbnail: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    type: 'series',
    category: 'Kids',
    rating: 8.1,
    releaseYear: 2024
  },
  {
    id: 'k5',
    title: 'Alphabet Fun',
    description: 'Learning the ABCs.',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    type: 'series',
    category: 'Kids',
    rating: 9.5,
    releaseYear: 2024
  },
  {
    id: 'l1',
    title: 'India vs Australia',
    description: 'Live cricket final.',
    thumbnail: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    type: 'movie',
    category: 'LIVE',
    rating: 9.9,
    releaseYear: 2024
  },
  {
    id: 'a1',
    title: 'Solo Leveling',
    description: 'Epic anime adventure.',
    thumbnail: 'https://images.unsplash.com/photo-1578632738908-4521c726eebf?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    type: 'series',
    category: 'Anime',
    rating: 9.1,
    releaseYear: 2024
  },
  {
    id: 'e1',
    title: 'Coding for All',
    description: 'Learn to code in 30 days.',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    type: 'series',
    category: 'Education',
    rating: 8.4,
    releaseYear: 2024
  },
  {
    id: 'h1',
    title: 'Pathaan 2',
    description: 'Action thriller.',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    type: 'movie',
    category: 'Hindi',
    rating: 7.5,
    releaseYear: 2025
  }
];

export const MOCK_ADS: AdConfig[] = [
  { id: 'ad1', name: 'Banner Promo', code: '<!-- Ad Code -->', isActive: true, position: 'home' }
];
