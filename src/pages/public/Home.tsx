import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Target, Zap, CheckCircle2, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600/10 border border-indigo-600/20 rounded-full text-indigo-500 text-xs font-bold uppercase tracking-widest mb-8"
        >
          <Sparkles size={14} /> The Future of Career Strategy is Here
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]"
        >
          Navigate Your Career with <br />
          <span className="text-gradient">Precision Intelligence</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Stop guessing and start leading. CareerCompass AI uses advanced neural networks to map your trajectory, optimize your narrative, and land your dream role.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg shadow-xl shadow-indigo-600/25 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            Start Your Journey <ArrowRight size={20} />
          </Link>
          <Link
            to="/how-it-works"
            className="w-full sm:w-auto px-8 py-4 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-full font-bold text-lg hover:bg-[hsl(var(--accent))] transition-all"
          >
            Watch Demo
          </Link>
        </motion.div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 relative p-4 bg-zinc-900 rounded-3xl border border-white/10 shadow-2xl hero-animate"
        >
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/20 blur-[100px] rounded-full" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 blur-[100px] rounded-full" />
          <div className="aspect-video bg-zinc-950 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden">
             <div className="p-8 text-left space-y-4 w-full max-w-lg">
                <div className="flex gap-2 mb-4">
                   <div className="w-3 h-3 rounded-full bg-red-500/80" />
                   <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                   <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="h-4 w-3/4 bg-white/10 rounded-full animate-pulse" />
                <div className="h-4 w-1/2 bg-white/5 rounded-full animate-pulse" />
                <div className="h-4 w-2/3 bg-white/10 rounded-full animate-pulse" />
                <div className="pt-4 grid grid-cols-2 gap-4">
                   <div className="h-20 bg-indigo-600/20 border border-indigo-600/30 rounded-xl p-4">
                      <div className="h-2 w-1/2 bg-indigo-400 rounded-full mb-2" />
                      <div className="h-4 w-full bg-indigo-400/50 rounded-full" />
                   </div>
                   <div className="h-20 bg-emerald-600/20 border border-emerald-600/30 rounded-xl p-4">
                      <div className="h-2 w-1/2 bg-emerald-400 rounded-full mb-2" />
                      <div className="h-4 w-full bg-emerald-400/50 rounded-full" />
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Social Proof */}
      <section className="mt-40 px-4 max-w-7xl mx-auto">
        <p className="text-center text-sm font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-[0.2em] mb-12">Trusted by leaders at</p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-40 grayscale transition-all hover:grayscale-0">
          {['Google', 'Microsoft', 'NVIDIA', 'FAANG', 'OpenAI', 'SpaceX'].map(brand => (
             <div key={brand} className="text-2xl font-black text-center">{brand}</div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mt-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black mb-4">Strategic Advantage</h2>
          <p className="text-[hsl(var(--muted-foreground))]">Beyond resumes. We build comprehensive professional systems.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
           {[
             { title: 'AI Resume Engineering', desc: 'Reverse-engineered ATS algorithms to guarantee your documents get read by humans.', icon: Sparkles, color: 'text-indigo-500' },
             { title: 'Predictive Interviewing', desc: 'Simulate specific company interviews with precision feedback and response optimization.', icon: Target, color: 'text-purple-500' },
             { title: 'Narrative Mapping', desc: 'Craft a powerful professional story that aligns with high-growth market demands.', icon: Zap, color: 'text-emerald-500' }
           ].map((item, i) => (
             <motion.div
               key={i}
               whileHover={{ y: -10 }}
               className="p-8 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-3xl shadow-sm hover:shadow-xl transition-all"
             >
               <div className={`p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 w-fit mb-6 ${item.color}`}>
                 <item.icon size={28} />
               </div>
               <h3 className="text-xl font-bold mb-4">{item.title}</h3>
               <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">{item.desc}</p>
             </motion.div>
           ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-40 px-4">
        <div className="max-w-7xl mx-auto bg-indigo-600 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <h2 className="text-4xl md:text-5xl font-black mb-6">Ready for your next pivot?</h2>
          <p className="text-indigo-100 mb-10 max-w-xl mx-auto text-lg leading-relaxed">Join 50,000+ professionals who upgraded their trajectory using CareerCompass AI.</p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-indigo-600 rounded-full font-black text-xl shadow-2xl hover:scale-105 transition-transform"
          >
            Claim Your Identity <ArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
