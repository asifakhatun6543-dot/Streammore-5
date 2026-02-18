
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import { chatWithAssistant } from '../services/geminiService';

export const AIAssistant: React.FC = () => {
  const { content, uiConfig } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Namaste! I'm StreamBuddy, your dedicated entertainment guide. Are you in the mood for a Blockbuster Movie or a quick Short Drama? Tell me your vibe!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    const botResponse = await chatWithAssistant(userMsg, content);
    setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    setIsTyping(false);
  };

  if (!uiConfig.global.showAIAssistant) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-6 md:bottom-8 md:right-8 z-[200] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
          isOpen 
            ? 'bg-slate-800 rotate-90 border border-slate-700' 
            : 'bg-blue-600 hover:scale-110 shadow-blue-600/30'
        }`}
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-robot'} text-white text-xl`}></i>
        {!isOpen && (
          <>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-slate-950"></span>
            </span>
            <div className="absolute right-full mr-4 bg-white text-slate-900 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
              Need help?
            </div>
          </>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-40 right-4 left-4 md:left-auto md:bottom-24 md:right-8 z-[190] w-auto md:w-[420px] h-[600px] bg-slate-950/90 backdrop-blur-3xl border border-slate-800/60 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 zoom-in-95 duration-500">
          <div className="p-6 border-b border-slate-800/50 flex items-center justify-between bg-gradient-to-r from-blue-600/20 to-indigo-600/20">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-blue-500/10">
                <i className="fa-solid fa-sparkles text-white text-sm"></i>
                </div>
                <div>
                <h3 className="text-sm font-black text-white tracking-tight uppercase">StreamBuddy AI</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.1em]">Online • Premium Support</p>
                </div>
                </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors">
                <i className="fa-solid fa-minus text-xs"></i>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[85%] px-5 py-3.5 rounded-3xl text-sm leading-relaxed shadow-sm ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-900 text-slate-200 rounded-tl-none border border-slate-800/80 shadow-inner'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-900 border border-slate-800 px-5 py-3.5 rounded-3xl rounded-tl-none">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-6 bg-slate-950/40 border-t border-slate-800/40 flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Suggest something epic..."
              className="flex-1 bg-slate-900/60 border border-slate-800 rounded-2xl px-5 py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            />
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white hover:bg-blue-700 transition-all disabled:opacity-40 disabled:grayscale shadow-xl shadow-blue-600/20 active:scale-90"
            >
              <i className="fa-solid fa-paper-plane-top text-xs"></i>
            </button>
          </form>
          <div className="px-6 pb-4 bg-slate-950/40 text-center">
             <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Official AI Engine by RS7</p>
          </div>
        </div>
      )}
    </>
  );
};
