import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Target, Heart, Trophy } from 'lucide-react';

export default function App() {
  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 70, damping: 20 } }
  };

  return (
    <div className="min-h-screen bg-brand-base text-brand-light overflow-x-hidden selection:bg-brand-accent selection:text-brand-base">
      {/* Editorial Navigation */}
      <nav className="fixed top-0 w-full z-50 mix-blend-difference px-6 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xl font-display font-bold tracking-tight">DIGITAL HEROES.</div>
          <div className="flex gap-8 items-center text-sm font-medium">
            <a href="#impact" className="hover:text-brand-accent transition-colors">Impact</a>
            <a href="#how" className="hover:text-brand-accent transition-colors">Method</a>
            <Link to="/auth" className="uppercase tracking-widest text-xs border-b border-brand-accent pb-1 hover:text-brand-accent transition-all">Sign In</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center px-6 pt-24">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <motion.div 
          initial="hidden" animate="visible" variants={stagger}
          className="max-w-7xl mx-auto w-full z-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
                <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse" />
                <span className="text-brand-accent uppercase tracking-widest text-xs font-semibold">September Draw Live</span>
              </motion.div>
              
              <h1 className="text-6xl md:text-8xl lg:text-[120px] font-display font-bold leading-[0.9] tracking-tighter uppercase">
                <motion.div variants={fadeUp}>Play.</motion.div>
                <motion.div variants={fadeUp} className="text-brand-muted">Give.</motion.div>
                <motion.div variants={fadeUp} className="text-brand-accent">Win.</motion.div>
              </h1>
            </div>
            
            <div className="lg:col-span-4 flex flex-col justify-end pb-4">
              <motion.p variants={fadeUp} className="text-lg md:text-xl text-brand-muted leading-relaxed mb-10 max-w-md">
                Your game can create something bigger. Track your Stableford scores, fund vital charities, and enter our monthly draw—all in one elegant platform.
              </motion.p>
              
              <motion.div variants={fadeUp}>
                <Link to="/auth" className="group inline-flex items-center gap-6 bg-brand-accent text-brand-base px-8 py-5 rounded-none font-bold uppercase tracking-widest hover-lift">
                  Join The Movement
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Impact Stats */}
      <section id="impact" className="border-y border-white/10 bg-white/5 py-16 px-6">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {[
            { label: 'Active Heroes', value: '2,400+' },
            { label: 'Directed to Charity', value: '£184K' },
            { label: 'Current Prize Pool', value: '£12,500' }
          ].map((stat, i) => (
            <motion.div key={i} variants={fadeUp} className="relative">
              <div className="text-brand-accent text-xs font-bold mb-4">0{i+1}</div>
              <div className="text-5xl md:text-6xl font-display font-bold mb-2">{stat.value}</div>
              <div className="text-brand-muted uppercase tracking-widest text-xs">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How it Works - Editorial Layout */}
      <section id="how" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-4xl md:text-6xl font-display font-bold mb-24 max-w-2xl"
          >
            A system designed for impact.
          </motion.h2>

          <div className="space-y-32">
            {[
              { icon: Heart, title: 'Subscribe & Support', desc: 'A minimum of 10% of your subscription goes directly to a cause you care about. We facilitate the impact; you drive it.' },
              { icon: Target, title: 'Track Your Game', desc: 'Log your Stableford scores after every round. Our engine maintains your rolling 5-score average, pushing you to improve.' },
              { icon: Trophy, title: 'The Monthly Draw', desc: 'Your active subscription secures your entry. Match your numbers to win a share of the expanding community prize pool.' }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center"
              >
                <div className={`md:col-span-5 ${i % 2 !== 0 ? 'md:order-last' : ''}`}>
                  <div className="aspect-square bg-white/5 border border-white/10 flex items-center justify-center">
                    <step.icon className="w-24 h-24 text-brand-muted" strokeWidth={1} />
                  </div>
                </div>
                <div className="md:col-span-7">
                  <div className="text-brand-accent font-display text-2xl mb-6">0{i+1}.</div>
                  <h3 className="text-3xl md:text-4xl font-display font-bold mb-6">{step.title}</h3>
                  <p className="text-xl text-brand-muted leading-relaxed max-w-lg">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xl font-display font-bold">DIGITAL HEROES.</div>
          <div className="text-sm text-brand-muted">© 2026. Design by humans.</div>
        </div>
      </footer>
    </div>
  );
}
