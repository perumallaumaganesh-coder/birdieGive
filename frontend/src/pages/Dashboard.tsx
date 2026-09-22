import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Plus, Activity, Heart, Trophy, ChevronRight, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { apiPath, authHeaders } from '../api';

export default function Dashboard() {
  const [scores, setScores] = useState<any[]>([]);
  const [charities, setCharities] = useState<any[]>([]);
  const [points, setPoints] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/auth');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = authHeaders();
      const [scoresRes, charitiesRes] = await Promise.all([
        fetch(apiPath('/api/scores'), { headers }),
        fetch(apiPath('/api/charities'))
      ]);
      const scoresData = await scoresRes.json();
      const charitiesData = await charitiesRes.json();
      if (scoresData.success) setScores(scoresData.data);
      if (charitiesData.success) setCharities(charitiesData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch(apiPath('/api/scores'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        },
        body: JSON.stringify({ points: Number(points), date })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      
      setPoints('');
      setDate(new Date().toISOString().split('T')[0]);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const getRating = (pts: number) => {
    if (pts >= 36) return { label: 'Excellent', color: 'text-brand-accent' };
    if (pts >= 30) return { label: 'Good', color: 'text-white' };
    return { label: 'Below Par', color: 'text-brand-muted' };
  };

  if (loading) return <div className="min-h-screen bg-brand-base flex items-center justify-center text-brand-accent"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b.points, 0) / scores.length) : 0;
  const selectedCharity = charities.find(c => c.id === user.charityId);

  return (
    <div className="min-h-screen bg-brand-base text-brand-light flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-white/10 p-6 md:min-h-screen flex flex-col justify-between">
        <div>
          <div className="text-xl font-display font-bold mb-12">DIGITAL HEROES.</div>
          <nav className="space-y-4">
            <div className="text-brand-accent flex items-center gap-3 font-semibold uppercase tracking-widest text-xs">
              <Activity className="w-4 h-4" /> Overview
            </div>
            <div className="text-brand-muted hover:text-white transition-colors flex items-center gap-3 font-semibold uppercase tracking-widest text-xs cursor-pointer">
              <Trophy className="w-4 h-4" /> Draw & Winnings
            </div>
            <div className="text-brand-muted hover:text-white transition-colors flex items-center gap-3 font-semibold uppercase tracking-widest text-xs cursor-pointer">
              <Heart className="w-4 h-4" /> My Charity
            </div>
          </nav>
        </div>
        <button onClick={logout} className="text-brand-muted hover:text-white transition-colors flex items-center gap-3 font-semibold uppercase tracking-widest text-xs mt-12 md:mt-0">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 max-w-5xl">
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
            Good morning, {user.email.split('@')[0]}.
          </h1>
          <div className="flex items-center gap-3 text-sm text-brand-muted">
            <span>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <span className="flex items-center gap-2 text-brand-accent">
              <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse" />
              Subscription Active
            </span>
          </div>
        </header>

        {/* Priority 1: Score Performance (Visual) */}
        <section className="mb-16">
          <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-4">
            <h2 className="text-2xl font-display font-bold">Recent Form</h2>
            <div className="text-right">
              <div className="text-3xl font-display font-bold text-white">{avgScore || '-'}</div>
              <div className="text-xs uppercase tracking-widest text-brand-muted">Rolling Avg</div>
            </div>
          </div>
          
          <div className="flex gap-4 h-32 items-end">
            {scores.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center border border-white/10 border-dashed text-brand-muted">
                No scores recorded yet. Add your first round below.
              </div>
            ) : (
              [...scores].reverse().map((s, i) => (
                <motion.div 
                  key={s.id}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: `${(s.points / 45) * 100}%`, opacity: 1 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  className="flex-1 bg-white/10 hover:bg-white/20 transition-colors relative group rounded-t-sm"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    {s.points}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Column */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Score Entry */}
            <section>
              <h3 className="text-xs uppercase tracking-widest text-brand-muted font-semibold mb-6 flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Latest Round
              </h3>
              
              <form onSubmit={submitScore} className="bg-white/5 border border-white/10 p-6">
                {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4"/>{error}</div>}
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-brand-muted mb-2">Stableford Points</label>
                    <input 
                      type="number" min="1" max="45" required
                      value={points} onChange={e => setPoints(e.target.value)}
                      className="w-full bg-transparent border-b border-white/20 pb-2 text-3xl font-display text-white focus:outline-none focus:border-brand-accent transition-colors"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-brand-muted mb-2">Date Played</label>
                    <input 
                      type="date" required
                      value={date} onChange={e => setDate(e.target.value)}
                      className="w-full bg-transparent border-b border-white/20 pb-2 text-lg text-white focus:outline-none focus:border-brand-accent transition-colors mt-2"
                    />
                  </div>
                </div>
                
                <button 
                  disabled={submitting}
                  className="group flex items-center gap-3 text-sm font-bold uppercase tracking-widest hover:text-brand-accent transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Score'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </section>

            {/* Score Log */}
            <section>
              <h3 className="text-xs uppercase tracking-widest text-brand-muted font-semibold mb-6">Score History (Last 5)</h3>
              <div className="space-y-2">
                <AnimatePresence>
                  {scores.map((score, i) => {
                    const rating = getRating(score.points);
                    return (
                      <motion.div 
                        key={score.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-4 border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-colors"
                      >
                        <div>
                          <div className="text-xl font-display font-bold">{score.points} <span className="text-sm font-sans font-normal text-brand-muted">pts</span></div>
                          <div className="text-xs text-brand-muted mt-1">{new Date(score.date).toLocaleDateString()}</div>
                        </div>
                        <div className={`text-xs uppercase tracking-widest font-semibold ${rating.color}`}>
                          {rating.label}
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </section>

          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-5 space-y-8">
            {/* Draw Status */}
            <div className="bg-brand-accent text-brand-base p-8 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 opacity-10">
                <Trophy className="w-48 h-48" />
              </div>
              <h3 className="text-xs uppercase tracking-widest font-bold mb-8">Next Draw</h3>
              <div className="text-5xl font-display font-bold mb-2">£12,500</div>
              <div className="text-sm font-semibold opacity-80 mb-8">Current Prize Pool</div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest border-t border-black/10 pt-4">
                <span>Status</span>
                <span>Active Entry</span>
              </div>
            </div>

            {/* Charity Impact */}
            <div className="border border-white/10 p-8">
              <h3 className="text-xs uppercase tracking-widest text-brand-muted font-semibold mb-8">My Impact</h3>
              <div className="text-3xl font-display font-bold mb-2">{user.charityPercentage || 10}%</div>
              <div className="text-sm text-brand-muted mb-8">of subscription directed to:</div>
              
              <div className="flex items-center gap-4 group cursor-pointer">
                {selectedCharity ? (
                  <>
                    <div className="w-12 h-12 bg-white/10 rounded-full overflow-hidden flex-shrink-0">
                      {selectedCharity.imageUrl ? (
                        <img src={selectedCharity.imageUrl} alt={selectedCharity.name} className="w-full h-full object-cover" />
                      ) : (
                        <Heart className="w-6 h-6 m-3 text-brand-muted" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold group-hover:text-brand-accent transition-colors">{selectedCharity.name}</div>
                      <div className="text-xs text-brand-muted flex items-center gap-1 mt-1">Change charity <ChevronRight className="w-3 h-3" /></div>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-brand-muted italic">No charity selected.</div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
