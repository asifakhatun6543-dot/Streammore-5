
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

export const Feedback: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Viewing Experience',
    'Subtitles',
    'Download',
    'File Management',
    'Infringement of my copyright or IP',
    'Pornographic content',
    'Other'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) {
      alert('Please select a feedback category.');
      return;
    }
    alert('Thank you for your feedback!');
    navigate('/profile');
  };

  return (
    <div className="max-w-2xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md py-4 mb-6 flex items-center gap-6 px-4 -mx-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white hover:bg-slate-800 transition-colors"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <h1 className="text-xl font-black text-white">Feedback</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 px-4">
        {/* Category Selection */}
        <section className="space-y-4">
          <h2 className="text-lg font-black text-white">What's your feedback about?</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden divide-y divide-slate-800">
            {categories.map((cat) => (
              <label 
                key={cat} 
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-800/50 transition-colors"
              >
                <span className="text-sm text-slate-300 font-medium">{cat}</span>
                <input 
                  type="radio" 
                  name="category" 
                  value={cat}
                  checked={category === cat}
                  onChange={(e) => setCategory(e.target.value)}
                  className="hidden"
                />
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  category === cat ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700'
                }`}>
                  {category === cat && <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-in zoom-in duration-200"></div>}
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Text Area Description */}
        <section className="space-y-4">
          <h2 className="text-lg font-black text-white">Tell us a little more (Optional)</h2>
          <div className="relative">
            <textarea 
              maxLength={500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe the issue in detail, and if it's about a TV series, specify the season and episode number."
              className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 text-sm text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none h-48 resize-none"
            ></textarea>
            <div className="absolute bottom-4 right-6 text-[10px] font-bold text-slate-500">
              {description.length}/500
            </div>
          </div>

          {/* Screenshot Attachment */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer ${
              previewUrl ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-800 hover:border-slate-700 bg-slate-900'
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            {previewUrl ? (
              <div className="relative w-full max-w-xs">
                <img src={previewUrl} alt="Screenshot" className="w-full h-32 object-cover rounded-2xl border border-blue-500/30" />
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setPreviewUrl(null); }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <i className="fa-solid fa-xmark text-[10px]"></i>
                </button>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-slate-600 group-hover:text-blue-500">
                  <i className="fa-regular fa-image text-xl"></i>
                </div>
                <p className="text-xs text-slate-500 font-bold">For better assistance, please provide a screenshot.</p>
              </>
            )}
          </div>
        </section>

        {/* Contact Information */}
        <section className="space-y-4">
          <h2 className="text-lg font-black text-white">Can we get back to you? (Optional)</h2>
          <div className="flex bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-4 border-r border-slate-800 bg-slate-950/50">
              <span className="text-xs font-bold text-slate-300">IN +91</span>
              <i className="fa-solid fa-caret-down text-[10px] text-slate-500"></i>
            </div>
            <input 
              type="tel" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone number"
              className="flex-1 bg-transparent px-6 py-4 text-sm text-white focus:outline-none"
            />
          </div>
        </section>

        {/* Submit Button */}
        <div className="pt-6">
          <Button 
            type="submit" 
            className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs bg-gradient-to-r from-blue-600 to-blue-700 shadow-xl shadow-blue-600/20"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};
