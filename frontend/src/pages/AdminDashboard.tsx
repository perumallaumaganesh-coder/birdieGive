import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Users, Heart, Trophy, Search, Loader2 } from 'lucide-react';
import { apiPath, authHeaders } from '../api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<any[]>([]);
  const [charities, setCharities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Charity form state
  const [charityName, setCharityName] = useState('');
  const [charityDesc, setCharityDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

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
      const [usersRes, charitiesRes] = await Promise.all([
        fetch(apiPath('/api/admin/users'), { headers }),
        fetch(apiPath('/api/charities'), { headers })
      ]);
      const usersData = await usersRes.json();
      const charitiesData = await charitiesRes.json();
      if (usersData.success) setUsers(usersData.data);
      if (charitiesData.success) setCharities(charitiesData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitCharity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch(apiPath('/api/charities'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        },
        body: JSON.stringify({ name: charityName, description: charityDesc })
      });
      setCharityName('');
      setCharityDesc('');
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  if (loading) return <div className="min-h-screen bg-brand-base flex items-center justify-center text-brand-accent"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-brand-base text-brand-light flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-white/10 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="text-xl font-display font-bold mb-12 text-brand-accent">ADMIN CONSOLE</div>
          <nav className="space-y-2">
            {[
              { id: 'users', icon: Users, label: 'Players' },
              { id: 'charities', icon: Heart, label: 'Charities' },
              { id: 'draws', icon: Trophy, label: 'Draws' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-semibold transition-colors ${
                  activeTab === tab.id ? 'bg-white/10 text-white' : 'text-brand-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <button onClick={logout} className="text-brand-muted hover:text-white transition-colors flex items-center gap-3 font-semibold uppercase tracking-widest text-xs px-4 mt-12 md:mt-0">
          <LogOut className="w-4 h-4" /> Exit Console
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-x-hidden">
        
        {/* Top Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12 pb-8 border-b border-white/10">
          <div>
            <div className="text-sm text-brand-muted uppercase tracking-widest font-semibold mb-2">Total Players</div>
            <div className="text-3xl font-display font-bold">{users.length}</div>
          </div>
          <div>
            <div className="text-sm text-brand-muted uppercase tracking-widest font-semibold mb-2">Active Subs</div>
            <div className="text-3xl font-display font-bold text-brand-accent">
              {users.filter(u => u.subscriptionStatus === 'ACTIVE').length}
            </div>
          </div>
          <div>
            <div className="text-sm text-brand-muted uppercase tracking-widest font-semibold mb-2">Charities</div>
            <div className="text-3xl font-display font-bold">{charities.length}</div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-display font-bold">Player Directory</h2>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                  <input type="text" placeholder="Search players..." className="bg-white/5 border border-white/10 pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-brand-accent w-64" />
                </div>
              </div>
              
              <div className="border border-white/10 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-xs uppercase tracking-widest text-brand-muted">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Email</th>
                      <th className="px-6 py-4 font-semibold">Role</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">{u.email}</td>
                        <td className="px-6 py-4"><span className="px-2 py-1 bg-white/10 text-xs font-semibold">{u.role}</span></td>
                        <td className="px-6 py-4">
                          {u.subscriptionStatus === 'ACTIVE' ? (
                            <span className="text-brand-accent flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-accent" /> Active</span>
                          ) : (
                            <span className="text-brand-muted">Inactive</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-brand-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'charities' && (
            <motion.div key="charities" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-display font-bold mb-6">Charity Directory</h2>
                <div className="space-y-4">
                  {charities.map(c => (
                    <div key={c.id} className="border border-white/10 p-6 hover:bg-white/[0.02] transition-colors flex gap-6 items-start">
                      <div className="w-16 h-16 bg-white/5 shrink-0 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-brand-muted" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">{c.name}</h3>
                        <p className="text-sm text-brand-muted line-clamp-2">{c.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-display font-bold mb-6">Add New Cause</h2>
                <form onSubmit={submitCharity} className="space-y-4 p-6 bg-white/5 border border-white/10">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-brand-muted font-semibold mb-2">Name</label>
                    <input required value={charityName} onChange={e => setCharityName(e.target.value)} className="w-full bg-transparent border-b border-white/20 pb-2 text-white focus:outline-none focus:border-brand-accent" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-brand-muted font-semibold mb-2">Description</label>
                    <textarea required value={charityDesc} onChange={e => setCharityDesc(e.target.value)} className="w-full bg-transparent border-b border-white/20 pb-2 text-white focus:outline-none focus:border-brand-accent min-h-[100px] resize-y" />
                  </div>
                  <button disabled={submitting} className="w-full bg-white text-black py-3 text-sm font-bold uppercase tracking-widest mt-4 hover:bg-brand-accent transition-colors">
                    {submitting ? 'Adding...' : 'Add Charity'}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'draws' && (
            <motion.div key="draws" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl">
              <h2 className="text-xl font-display font-bold mb-6">Draw Operations</h2>
              <div className="border border-white/10 p-12 text-center bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent)]">
                <Trophy className="w-12 h-12 text-brand-muted mx-auto mb-6" />
                <h3 className="text-2xl font-display font-bold mb-2">Simulation Engine</h3>
                <p className="text-brand-muted mb-8 max-w-md mx-auto">Run a simulated draw to calculate prize distributions and winner tiers based on current active subscribers.</p>
                <button className="bg-brand-accent text-brand-base px-8 py-3 font-bold uppercase tracking-widest text-sm hover-lift">
                  Run Simulation
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
