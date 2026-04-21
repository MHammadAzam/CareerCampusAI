import React from 'react';
import { motion } from 'motion/react';
import { Bot, LineChart, ShieldCheck, Zap, Compass, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  const steps = [
    {
      title: 'Neural Profile Mapping',
      desc: 'Our AI analyzes your complete professional footprint—skills, achievements, and untapped potential—against trillions of market data points.',
      icon: Compass,
      color: 'bg-blue-600'
    },
    {
      title: 'Narrative Engineering',
      desc: ' We rewrite your professional story utilizing psychology-backed frameworks designed to trigger positive recruiter bias and ATS dominance.',
      icon: Zap,
      color: 'bg-purple-600'
    },
    {
      title: 'Predictive Training',
      desc: 'Engage in ultra-realistic interview simulations tailored to your target roles, receiving instant feedback on delivery, logic, and impact.',
      icon: Bot,
      color: 'bg-emerald-600'
    },
    {
      title: 'Market Execution',
      desc: 'Deploy your optimized profile. Track applications, manage networking, and utilize our negotiation engine when the offers arrive.',
      icon: LineChart,
      color: 'bg-amber-600'
    }
  ];

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-black mb-6">The Science of Your <span className="text-gradient">Next Move</span></h1>
        <p className="text-[hsl(var(--muted-foreground))] text-lg max-w-2xl mx-auto">CareerCompass AI isn't just a tool—it's a systematic approach to professional dominance.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-32 items-center">
         <div className="space-y-12">
            {steps.map((step, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="flex gap-6 group"
               >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${step.color} group-hover:scale-110 transition-transform`}>
                     <step.icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-[hsl(var(--muted-foreground))] leading-relaxed text-sm md:text-base">{step.desc}</p>
                  </div>
               </motion.div>
            ))}
         </div>
         <div className="relative">
            <div className="absolute inset-0 bg-indigo-600/20 blur-[120px] rounded-full" />
            <div className="relative bg-zinc-900 border border-white/10 rounded-[3rem] p-4 shadow-2xl overflow-hidden aspect-square flex items-center justify-center">
               <div className="p-8 text-center space-y-6">
                  <div className="w-20 h-20 bg-indigo-600 rounded-full mx-auto flex items-center justify-center shadow-2xl shadow-indigo-600/50">
                     <Users className="text-white" size={32} />
                  </div>
                  <h4 className="text-2xl font-black text-white">Join the Network</h4>
                  <p className="text-zinc-400 text-sm">Become part of an elite collective of professionals using AI to outpace the market.</p>
                  <div className="pt-4 grid grid-cols-3 gap-2">
                     {[1,2,3].map(i => (
                        <div key={i} className="h-2 bg-white/10 rounded-full animate-pulse" />
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Security Info */}
      <div className="p-12 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[3rem] text-center max-w-4xl mx-auto">
         <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-8">
            <ShieldCheck size={32} />
         </div>
         <h2 className="text-3xl font-black mb-4">Enterprise-Grade Security</h2>
         <p className="text-[hsl(var(--muted-foreground))] mb-8">Your professional data is yours alone. We encrypt everything and never sell your profile to third parties or recruiters. We use SOC2 compliant infrastructure provided by Firebase.</p>
         <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-[hsl(var(--muted))] rounded-full text-xs font-bold uppercase tracking-widest">End-to-End Encryption</span>
            <span className="px-4 py-2 bg-[hsl(var(--muted))] rounded-full text-xs font-bold uppercase tracking-widest">No Data Selling</span>
            <span className="px-4 py-2 bg-[hsl(var(--muted))] rounded-full text-xs font-bold uppercase tracking-widest">Privacy First</span>
         </div>
      </div>

      <div className="mt-32 text-center">
         <Link
            to="/signup"
            className="px-10 py-5 bg-indigo-600 text-white rounded-full font-black text-xl shadow-xl shadow-indigo-600/25 hover:scale-105 transition-transform inline-block"
         >
            Start Mapping Now
         </Link>
      </div>
    </div>
  );
}
