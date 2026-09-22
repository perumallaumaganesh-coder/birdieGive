import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { apiPath } from '../api';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.role === 'ADMIN') navigate('/admin');
        else navigate('/dashboard');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(apiPath(endpoint), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      
      if (data.data.user.role === 'ADMIN') navigate('/admin');
      else navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-brand-base text-brand-light">
      {/* Left side - Editorial Brand */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 border-r border-white/10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent)]">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-brand-muted hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to platform
          </Link>
        </div>
        
        <div>
          <h1 className="text-6xl font-display font-bold leading-tight mb-8">
            Access your<br/>command center.
          </h1>
          <div className="grid grid-cols-2 gap-8 max-w-md">
            <div>
              <div className="text-3xl font-display font-bold text-brand-accent mb-1">£184K</div>
              <div className="text-xs text-brand-muted uppercase tracking-widest">Charity Impact</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-brand-accent mb-1">2.4K</div>
              <div className="text-xs text-brand-muted uppercase tracking-widest">Active Players</div>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-brand-muted">
          DIGITAL HEROES © 2026
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-24">
        <Link to="/" className="lg:hidden inline-flex items-center gap-2 text-brand-muted mb-12 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        
        <div className="max-w-md w-full mx-auto">
          <div className="flex gap-8 mb-12 border-b border-white/10 pb-4">
            <button 
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`text-sm font-bold uppercase tracking-widest transition-colors ${isLogin ? 'text-brand-accent' : 'text-brand-muted hover:text-white'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`text-sm font-bold uppercase tracking-widest transition-colors ${!isLogin ? 'text-brand-accent' : 'text-brand-muted hover:text-white'}`}
            >
              Create Account
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form 
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-brand-muted font-semibold">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-brand-accent transition-colors"
                  placeholder="name@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-brand-muted font-semibold">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-brand-accent transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full group flex items-center justify-center gap-4 bg-white text-black px-6 py-4 font-bold uppercase tracking-widest hover:bg-brand-accent transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    {isLogin ? 'Enter Platform' : 'Create Account'}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.form>
          </AnimatePresence>
          
          <div className="mt-12 p-6 border border-white/10 bg-white/5">
            <h3 className="text-xs uppercase tracking-widest text-brand-muted font-semibold mb-4">Demo Credentials</h3>
            <div className="space-y-2 text-sm text-brand-muted font-mono">
              <div><span className="text-white">Player:</span> player@digitalheroes.com / demo123</div>
              <div><span className="text-white">Admin:</span> admin@digitalheroes.com / admin123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
