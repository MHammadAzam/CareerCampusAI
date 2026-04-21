import React from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight, Zap, Target, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const tiers = [
    {
      name: 'Starter',
      price: 'Free',
      desc: 'Perfect for exploring the AI-powered career roadmap.',
      features: ['Basic AI Profile Analysis', 'Standard Resume Templates', 'Job Search Tracker', 'Community Access'],
      cta: 'Begin For Free',
      popular: false
    },
    {
      name: 'Professional',
      price: '$29',
      unit: '/mo',
      desc: 'The complete suite for active job seekers and ladder climbers.',
      features: ['ATS-Optimized AI Resume Builder', 'Unlimited Interview Simulations', 'Industry Narrative Engineering', 'Personalized Roadmap Generation', 'Priority Support'],
      cta: 'Go Pro Now',
      popular: true
    },
    {
      name: 'Executive',
      price: '$99',
      unit: '/mo',
      desc: 'White-glove AI support for senior leadership transitions.',
      features: ['Everything in Pro', 'Thought Leadership Ghostwriting', 'Salary Negotiation Simulator', 'Board Seat Strategy', 'Dedicated Career Strategist'],
      cta: 'Start Executive Pivot',
      popular: false
    }
  ];

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-black mb-6">Invest in Your <span className="text-gradient">Trajectory</span></h1>
        <p className="text-[hsl(var(--muted-foreground))] text-lg max-w-2xl mx-auto">Flexible plans designed to yield massive professional ROI. Choose your level of intelligence.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-8 rounded-[3rem] border transition-all ${
              tier.popular 
                ? 'bg-zinc-950 text-white border-indigo-600 shadow-2xl shadow-indigo-600/20 scale-105 z-10' 
                : 'bg-[hsl(var(--card))] border-[hsl(var(--border))] hover:shadow-xl'
            }`}
          >
            {tier.popular && (
              <div className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full w-fit mb-6">Most Effective</div>
            )}
            <h3 className="text-2xl font-black mb-2">{tier.name}</h3>
            <p className={`text-sm mb-8 ${tier.popular ? 'text-zinc-400' : 'text-[hsl(var(--muted-foreground))]'}`}>{tier.desc}</p>
            
            <div className="flex items-baseline gap-1 mb-10">
              <span className="text-5xl font-black">{tier.price}</span>
              {tier.unit && <span className={`text-xl font-bold ${tier.popular ? 'text-zinc-400' : 'text-[hsl(var(--muted-foreground))]'}`}>{tier.unit}</span>}
            </div>

            <div className="space-y-4 mb-10">
              {tier.features.map(feature => (
                <div key={feature} className="flex items-start gap-3">
                  <div className={`mt-1 flex-shrink-0 p-0.5 rounded-full ${tier.popular ? 'bg-indigo-500' : 'bg-indigo-600'}`}>
                    <Check size={12} className="text-white" />
                  </div>
                  <span className={`text-sm font-medium ${tier.popular ? 'text-zinc-300' : 'text-[hsl(var(--foreground))]'}`}>{feature}</span>
                </div>
              ))}
            </div>

            <Link
              to="/signup"
              className={`block w-full py-5 text-center rounded-2xl font-black text-lg transition-all active:scale-95 ${
                tier.popular 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-600/30' 
                  : 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))]'
              }`}
            >
              {tier.cta}
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 p-12 bg-[hsl(var(--muted))] rounded-[3rem] border border-[hsl(var(--border))] flex flex-col md:flex-row items-center gap-12">
         <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-black mb-4">Enterprise Custom Solutions</h2>
            <p className="text-[hsl(var(--muted-foreground))]">Looking to deploy CareerCompass AI across your entire organization? Let's talk about corporate licenses and custom integration.</p>
         </div>
         <button className="px-8 py-4 bg-[hsl(var(--foreground))] text-[hsl(var(--background))] rounded-full font-bold">Contact Enterprise Team</button>
      </div>
    </div>
  );
}
