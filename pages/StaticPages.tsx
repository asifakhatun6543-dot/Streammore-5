
import React, { useState, useRef } from 'react';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

const PageWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="max-w-4xl mx-auto py-10 px-4 space-y-8 animate-in fade-in duration-500">
    <div className="space-y-2 border-b border-slate-800 pb-8">
      <h1 className="text-4xl font-black text-white">{title}</h1>
      <p className="text-slate-500 text-sm italic">Last updated: October 2024</p>
    </div>
    <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-6">
      {children}
    </div>
  </div>
);

export const ContactSupport: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <PageWrapper title="Contact Support">
      <div className="grid md:grid-cols-2 gap-8 not-prose">
        <div className="space-y-6 bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <h3 className="text-xl font-bold text-white">Send us a message</h3>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Ticket submitted successfully!'); }}>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Subject</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-white">
                <option>Billing Issue</option>
                <option>Technical Problem</option>
                <option>Feature Request</option>
                <option>Account Access</option>
                <option>Others</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Message</label>
              <textarea required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-32 text-white" placeholder="Describe your issue in detail..."></textarea>
            </div>

            {/* Screenshot Attachment Section */}
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2">Attach Screenshot</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-4 transition-all flex flex-col items-center justify-center gap-2 group ${
                  previewUrl ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-800 hover:border-slate-700 bg-slate-950/50'
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
                  <div className="relative w-full">
                    <img src={previewUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeFile(); }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <i className="fa-solid fa-xmark text-[10px]"></i>
                    </button>
                    <p className="text-[10px] text-blue-400 mt-2 text-center font-bold truncate px-4">{selectedFile?.name}</p>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 group-hover:text-blue-500 transition-colors">
                      <i className="fa-solid fa-camera"></i>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Click to upload or drag & drop</p>
                    <p className="text-[9px] text-slate-600 uppercase tracking-tighter">PNG, JPG up to 5MB</p>
                  </>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full py-4 rounded-xl mt-4">Submit Support Ticket</Button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
             <h4 className="font-bold text-white mb-4">Direct Contact</h4>
             <div className="space-y-4">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500">
                   <i className="fa-solid fa-envelope"></i>
                 </div>
                 <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase">Email</p>
                   <p className="text-sm">support@streammore.com</p>
                 </div>
               </div>
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-green-600/10 flex items-center justify-center text-green-500">
                   <i className="fa-brands fa-whatsapp"></i>
                 </div>
                 <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase">WhatsApp</p>
                   <p className="text-sm">+91 98765 43210</p>
                 </div>
               </div>
             </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
             <h4 className="font-bold text-white mb-2">Self Help</h4>
             <p className="text-sm text-slate-400 mb-4">Check our frequently asked questions for instant answers.</p>
             <button className="text-blue-500 text-sm font-bold flex items-center gap-2">
               Browse Knowledge Base <i className="fa-solid fa-arrow-right"></i>
             </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export const PrivacyPolicy: React.FC = () => (
  <PageWrapper title="Privacy Policy">
    <section className="space-y-4">
      <h3 className="text-xl font-bold text-white">1. Data Collection</h3>
      <p>We collect information you provide directly to us, such as when you create an account, purchase a subscription, or communicate with our support team.</p>
    </section>
    <section className="space-y-4">
      <h3 className="text-xl font-bold text-white">2. Use of Information</h3>
      <p>Your information is used to provide and improve our streaming services, personalize your experience with AI-powered recommendations, and send you important service updates.</p>
    </section>
    <section className="space-y-4">
      <h3 className="text-xl font-bold text-white">3. Security</h3>
      <p>We implement industry-standard security measures to protect your personal data from unauthorized access or disclosure.</p>
    </section>
  </PageWrapper>
);

export const TermsOfService: React.FC = () => (
  <PageWrapper title="Terms of Service">
    <section className="space-y-4">
      <h3 className="text-xl font-bold text-white">1. Use of Service</h3>
      <p>StreamMore provides a subscription-based streaming service. By using our platform, you agree to follow our community guidelines and not engage in illegal content sharing.</p>
    </section>
    <section className="space-y-4">
      <h3 className="text-xl font-bold text-white">2. Subscription & Billing</h3>
      <p>Premium plans are billed on a recurring basis. You can cancel at any time, but refunds are subject to our standard refund policy.</p>
    </section>
    <section className="space-y-4">
      <h3 className="text-xl font-bold text-white">3. User Conduct</h3>
      <p>Users are responsible for maintaining the confidentiality of their account credentials. Sharing accounts beyond the allowed device limit may result in temporary suspension.</p>
    </section>
  </PageWrapper>
);
