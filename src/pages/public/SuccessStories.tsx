import React from 'react';
import { motion } from 'motion/react';
import { Quote, Briefcase, TrendingUp, Star } from 'lucide-react';

export default function SuccessStories() {
  const stories = [
    {
      name: 'Sarah Chen',
      role: 'Sr. Product Designer',
      before: 'Stuck in agency role, low visibility',
      after: 'Landed Lead Role at Stripe with 40% raise',
      text: 'The AI narrative mapper changed everything. It helped me realize that I wasn\'t selling my impact, just my skills. Within 2 weeks of using the system, I had three Tier-1 interviews.',
      image: 'https://picsum.photos/seed/sarah/200/200'
    },
    {
      name: 'Marcus Thorne',
      role: 'Staff Software Engineer',
      before: 'Failed 4 coding rounds at Big Tech',
      after: 'Offer from NVIDIA and 3 others',
      text: 'The Predictive Interviewing module identified a massive gap in how I communicated system design trade-offs. The feedback was surgical and remarkably accurate.',
      image: 'https://picsum.photos/seed/marcus/200/200'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Marketing Director',
      before: 'Post-layoff gap, confidence hit',
      after: 'Director of Growth at Series C Startup',
      text: 'Beyond the tools, CareerCompass gave me a strategy. The resume engineering got me through the ATS filters that were previously blocking me.',
      image: 'https://picsum.photos/seed/elena/200/200'
    }
  ];

  return (
    <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-20 px-4">
        <h1 className="text-4xl md:text-6xl font-black mb-6">Proven <span className="text-gradient">Results</span></h1>
        <p className="text-[hsl(var(--muted-foreground))] text-lg max-w-2xl mx-auto">Real stories from professionals who utilized our intelligence to pivot their trajectories.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {stories.map((story, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[2.5rem] shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 text-black/5 dark:text-white/5 opacity-50">
              <Quote size={80} />
            </div>
            
            <div className="flex items-center gap-4 mb-8">
              <img src={story.image} alt={story.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-600/20" referrerPolicy="no-referrer" />
              <div>
                <h3 className="font-bold text-lg">{story.name}</h3>
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{story.role}</p>
              </div>
            </div>

            <p className="italic text-[hsl(var(--muted-foreground))] leading-relaxed mb-8 relative z-10">"{story.text}"</p>

            <div className="space-y-4 pt-6 border-t border-[hsl(var(--border))]">
              <div className="flex items-center gap-3">
                <Briefcase size={16} className="text-red-500" />
                <span className="text-sm font-medium text-[hsl(var(--muted-foreground))] line-through">{story.before}</span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp size={16} className="text-emerald-500" />
                <span className="text-sm font-bold text-[hsl(var(--foreground))]">{story.after}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-32 text-center">
        <div className="flex justify-center gap-1 mb-6 text-amber-500">
          {[1,2,3,4,5].map(s => <Star key={s} fill="currentColor" size={24} />)}
        </div>
        <h2 className="text-3xl font-black mb-10">Average rating 4.9/5 from 2,000+ alumni</h2>
        <button className="px-10 py-5 bg-indigo-600 text-white rounded-full font-black text-xl shadow-xl shadow-indigo-600/25 hover:scale-105 transition-transform">Read Full Report</button>
      </div>
    </div>
  );
}
