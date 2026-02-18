
import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { ContentCard } from '../components/ContentCard';
import { Button } from '../components/Button';
import { CATEGORIES } from '../constants';
import { ContentType } from '../types';

export const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { content } = useApp();
  const query = searchParams.get('q')?.toLowerCase() || '';

  // Filter States
  const [selectedType, setSelectedType] = useState<'all' | ContentType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Combined Filtering Logic
  const results = useMemo(() => {
    return content.filter(item => {
      const matchesQuery = !query || 
        item.title.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query);
      
      const matchesType = selectedType === 'all' || item.type === selectedType;
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

      return matchesQuery && matchesType && matchesCategory;
    });
  }, [content, query, selectedType, selectedCategory]);

  const trendingItems = content.filter(item => item.isTrending).slice(0, 5);
  const popularItems = content.filter(item => !item.isTrending).sort((a, b) => b.rating - a.rating).slice(0, 5);

  const resetFilters = () => {
    setSelectedType('all');
    setSelectedCategory('All');
  };

  const hasActiveFilters = selectedType !== 'all' || selectedCategory !== 'All';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black text-white">
            {query ? `Search Results for "${query}"` : 'Explore All Content'}
          </h2>
          {query && (
            <p className="text-slate-500 text-sm">
              Found {results.length} item{results.length !== 1 ? 's' : ''} matching your query.
            </p>
          )}
        </div>
        
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
            className="text-blue-500 hover:text-blue-400 font-black uppercase tracking-widest text-[10px]"
          >
            <i className="fa-solid fa-filter-circle-xmark mr-2"></i> Clear Filters
          </Button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="space-y-6 bg-slate-900/40 p-6 rounded-[2rem] border border-slate-800/60 backdrop-blur-sm">
        {/* Type Filter */}
        <div className="space-y-3">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Format</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'All Formats', value: 'all', icon: 'fa-border-all' },
              { label: 'Movies', value: 'movie', icon: 'fa-film' },
              { label: 'TV Series', value: 'series', icon: 'fa-tv' }
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value as any)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  selectedType === type.value 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-600'
                }`}
              >
                <i className={`fa-solid ${type.icon} text-[10px]`}></i>
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-3">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Genres</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  selectedCategory === cat 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {results.map(item => (
            <div key={item.id} className="animate-in fade-in zoom-in duration-300">
              <ContentCard content={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-16">
          {/* Empty State Message */}
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-slate-900/30 rounded-3xl border border-slate-800/50 p-8">
            <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center text-slate-700 text-4xl shadow-inner border border-slate-800">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-white">No matches found</h3>
              <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
                We couldn't find any {selectedType === 'all' ? 'content' : selectedType + 's'} in {selectedCategory === 'All' ? 'any genre' : selectedCategory} {query ? `matching "${query}"` : ''}.
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" size="md" className="rounded-xl px-8" onClick={resetFilters}>
                Clear All Filters
              </Button>
              <Button variant="primary" size="md" className="rounded-xl px-8" onClick={() => navigate('/home')}>
                Back to Home
              </Button>
            </div>
          </div>

          {/* Suggestions: Trending */}
          {trendingItems.length > 0 && !hasActiveFilters && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-3 text-white">
                  <i className="fa-solid fa-fire text-orange-500"></i> Trending Now
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {trendingItems.map(item => (
                  <ContentCard key={item.id} content={item} />
                ))}
              </div>
            </section>
          )}

          {/* Suggestions: Popular */}
          {popularItems.length > 0 && !hasActiveFilters && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-3 text-white">
                  <i className="fa-solid fa-star text-blue-500"></i> Highly Rated Picks
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {popularItems.map(item => (
                  <ContentCard key={item.id} content={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
