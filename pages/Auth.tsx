
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { Button } from '../components/Button';

export const Auth: React.FC = () => {
  const { setUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const isForgot = location.pathname === '/forgot-password';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateUniqueId = () => {
    return Math.floor(10000000000 + Math.random() * 90000000000).toString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      if (isForgot) {
        alert('Reset link sent to your email!');
        navigate('/login');
      } else {
        const newId = generateUniqueId();
        setUser({
          id: newId,
          username: username || (isLogin ? email.split('@')[0] : 'Streamer'),
          email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newId}`,
          isPremium: false,
          isAdmin: email === 'admin@streammore.com'
        });
        navigate('/home');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4">
            <i className="fa-solid fa-play text-white text-xl"></i>
          </div>
          <h1 className="text-3xl font-black text-white">
            {isForgot ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Create Account')}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            {isForgot ? 'We will send you a reset link' : (isLogin ? 'Login to continue streaming' : 'Join the StreamMore community')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && !isForgot && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Username</label>
              <input 
                required
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white"
                placeholder="johndoe"
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white"
              placeholder="name@email.com"
            />
          </div>

          {!isForgot && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                {isLogin && (
                  <Link to="/forgot-password" className="text-xs text-blue-500 hover:underline">Forgot?</Link>
                )}
              </div>
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white"
                placeholder="••••••••"
              />
            </div>
          )}

          <Button type="submit" className="w-full py-4 rounded-xl" isLoading={isLoading}>
            {isForgot ? 'Send Link' : (isLogin ? 'Sign In' : 'Sign Up')}
          </Button>

          {isLogin && (
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className="bg-slate-900 px-4 text-slate-500 font-bold">Or continue with</span>
              </div>
            </div>
          )}

          {isLogin && (
            <Button variant="outline" type="button" className="w-full flex items-center gap-3 py-4 rounded-xl">
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5" alt="google" />
              Sign in with Google
            </Button>
          )}
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          {isLogin ? (
            <>Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline font-bold">Sign Up</Link></>
          ) : (
            <>Already have an account? <Link to="/login" className="text-blue-500 hover:underline font-bold">Login</Link></>
          )}
        </div>
      </div>
    </div>
  );
};
