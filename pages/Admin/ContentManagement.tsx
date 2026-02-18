
import React, { useState, useEffect } from 'react';
import { useApp } from '../../store/AppContext';
import { Button } from '../../components/Button';
import { Content } from '../../types';

export const ContentManagement: React.FC = () => {
  const { content, setContent } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [linkType, setLinkType] = useState<'direct' | 'youtube' | 'vimeo' | 'unknown'>('direct');
  const [showPreview, setShowPreview] = useState(false);
  
  const initialFormData: Partial<Content> = {
    title: '',
    type: 'movie',
    category: 'Action',
    description: '',
    thumbnail: 'https://picsum.photos/800/450',
    videoUrl: '',
    rating: 8.0,
    releaseYear: 2024,
    isFeatured: false,
    isTrending: false
  };

  const [formData, setFormData] = useState<Partial<Content>>(initialFormData);

  // Link Analyzer Logic
  useEffect(() => {
    const url = formData.videoUrl || '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      setLinkType('youtube');
    } else if (url.includes('vimeo.com')) {
      setLinkType('vimeo');
    } else if (url.match(/\.(mp4|m3u8|webm|ogg)$/) || url.includes('blob:')) {
      setLinkType('direct');
    } else if (url.length > 5) {
      setLinkType('direct'); // Default to direct/embed for unknown but valid looking links
    } else {
      setLinkType('unknown');
    }
  }, [formData.videoUrl]);

  const getCleanEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      const id = (match && match[2].length === 11) ? match[2] : null;
      return `https://www.youtube.com/embed/${id}?modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&controls=1&autoplay=0`;
    }
    if (url.includes('vimeo.com')) {
      const id = url.split('/').pop();
      return `https://player.vimeo.com/video/${id}?badge=0&autopause=0&player_id=0&app_id=58479`;
    }
    return url;
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      setContent(content.filter(c => c.id !== id));
    }
  };

  const toggleFeatured = (id: string) => {
    setContent(content.map(c => c.id === id ? { ...c, isFeatured: !c.isFeatured } : c));
  };

  const toggleTrending = (id: string) => {
    setContent(content.map(c => c.id === id ? { ...c, isTrending: !c.isTrending } : c));
  };

  const handleEdit = (item: Content) => {
    setEditingId(item.id);
    setFormData(item);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setContent(content.map(c => c.id === editingId ? { ...formData as Content, id: editingId } : c));
    } else {
      const newContent: Content = {
        ...formData as Content,
        id: Date.now().toString()
      };
      setContent([newContent, ...content]);
    }
    setIsFormOpen(false);
    setEditingId(null);
    setFormData(initialFormData);
    setShowPreview(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Content Library</h1>
          <p className="text-slate-500 text-sm">Universal Stream & Link Management</p>
        </div>
        {!isFormOpen && (
          <Button onClick={handleAddNew}>
            <i className="fa-solid fa-plus mr-2"></i> Add New Content
          </Button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-slate-900 border border-blue-500/30 rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold flex items-center gap-3">
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><i className="fa-solid fa-clapperboard text-sm"></i></div>
               {editingId ? 'Modify Content' : 'Add Universal Content'}
            </h2>
            <button onClick={() => setIsFormOpen(false)} className="text-slate-500 hover:text-white transition-colors">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Content Title</label>
                <input 
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white font-bold" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter content title..."
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
                  Universal Video Link 
                  <span className="ml-2 text-[10px] text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded uppercase">{linkType} detected</span>
                </label>
                <div className="relative group">
                   <input 
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none text-white font-mono text-xs" 
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                    placeholder="YouTube, Vimeo, HLS (.m3u8) or MP4 link..."
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg active:scale-90 transition-all shadow-lg"
                  >
                    {showPreview ? 'Close Preview' : 'Analyze & Preview'}
                  </button>
                </div>
              </div>

              {showPreview && formData.videoUrl && (
                <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
                  <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-white uppercase border border-white/10">
                    Clean Embed Preview
                  </div>
                  {linkType === 'youtube' || linkType === 'vimeo' ? (
                    <iframe 
                      src={getCleanEmbedUrl(formData.videoUrl)}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video src={formData.videoUrl} controls className="w-full h-full object-contain" />
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Plot Description</label>
                <textarea 
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none h-40 text-white resize-none text-sm leading-relaxed" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Tell the story..."
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Type</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white font-bold"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                  >
                    <option value="movie">Movie</option>
                    <option value="series">Series</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Genre</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white font-bold"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Action</option>
                    <option>Comedy</option>
                    <option>Drama</option>
                    <option>Sci-Fi</option>
                    <option>Bollywood</option>
                    <option>Anime</option>
                    <option>Kids</option>
                    <option>LIVE</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Poster/Thumbnail URL</label>
                <input 
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none text-white font-bold" 
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">User Rating</label>
                  <input 
                    type="number" step="0.1" max="10" min="0"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white font-bold"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Year</label>
                  <input 
                    type="number"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white font-bold"
                    value={formData.releaseYear}
                    onChange={(e) => setFormData({...formData, releaseYear: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                 <label className="flex items-center gap-3 cursor-pointer flex-1 justify-center py-2 bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                      checked={formData.isFeatured} 
                      onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} 
                    />
                    <span className="text-[10px] font-black uppercase text-slate-400">Featured</span>
                 </label>
                 <label className="flex items-center gap-3 cursor-pointer flex-1 justify-center py-2 bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-orange-600 focus:ring-orange-500"
                      checked={formData.isTrending} 
                      onChange={(e) => setFormData({...formData, isTrending: e.target.checked})} 
                    />
                    <span className="text-[10px] font-black uppercase text-slate-400">Trending</span>
                 </label>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1 py-5 text-base rounded-2xl shadow-xl shadow-blue-600/20">
                  {editingId ? 'Update Library Item' : 'Add to Stream Library'}
                </Button>
                <Button type="button" variant="outline" className="px-8 rounded-2xl" onClick={() => { setIsFormOpen(false); setEditingId(null); }}>
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950 border-b border-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              <tr>
                <th className="px-6 py-6">Visual</th>
                <th className="px-6 py-6">Title & Stream Link</th>
                <th className="px-6 py-6">Type</th>
                <th className="px-6 py-6">Genre</th>
                <th className="px-6 py-6">Promotion</th>
                <th className="px-6 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {content.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/20 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="relative w-24 aspect-video rounded-xl overflow-hidden border border-white/5 bg-slate-950 shadow-lg">
                      <img src={item.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt={item.title} />
                    </div>
                  </td>
                  <td className="px-6 py-5">
                      <div className="font-black text-white text-sm mb-1">{item.title}</div>
                      <div className="text-[10px] text-blue-500 font-mono truncate max-w-[200px]">{item.videoUrl}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="bg-slate-800 text-slate-400 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase border border-slate-700">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-xs font-bold text-slate-400">{item.category}</div>
                    <div className="text-[10px] text-slate-600 mt-1">{item.releaseYear} • ⭐ {item.rating}</div>
                  </td>
                  <td className="px-6 py-5">
                     <div className="flex items-center gap-3">
                        <button 
                          onClick={() => toggleFeatured(item.id)}
                          className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg transition-all border ${item.isFeatured ? 'bg-blue-600/10 border-blue-500/30 text-blue-500 shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-700'}`}
                        >
                           Hero
                        </button>
                        <button 
                          onClick={() => toggleTrending(item.id)}
                          className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg transition-all border ${item.isTrending ? 'bg-orange-600/10 border-orange-500/30 text-orange-500 shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-700'}`}
                        >
                           Trend
                        </button>
                     </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-blue-500 hover:bg-blue-500/10 rounded-xl"
                        onClick={() => handleEdit(item)}
                      >
                        <i className="fa-solid fa-pen-to-square text-sm"></i>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:bg-red-500/10 rounded-xl" 
                        onClick={() => handleDelete(item.id)}
                      >
                        <i className="fa-solid fa-trash-can text-sm"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
