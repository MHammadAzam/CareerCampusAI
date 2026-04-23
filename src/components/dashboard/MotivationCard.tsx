import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, RefreshCw, Quote } from 'lucide-react';
import { generateDailyMotivation, MentorContext } from '../../services/mentorService';
import ReactMarkdown from 'react-markdown';

interface MotivationCardProps {
  context: MentorContext;
}

export default function MotivationCard({ context }: MotivationCardProps) {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchMotivation = async () => {
    setLoading(true);
    const dailyKey = `motivation_${new Date().toDateString()}_${context.displayName}`;
    const cached = localStorage.getItem(dailyKey);

    if (cached) {
      setMessage(cached);
      setLoading(false);
      return;
    }

    const newMessage = await generateDailyMotivation(context);
    setMessage(newMessage);
    localStorage.setItem(dailyKey, newMessage);
    setLoading(false);
  };

  useEffect(() => {
    fetchMotivation();
  }, [context.displayName]);

  return (
    <div className="p-8 bg-zinc-950 text-white rounded-[2.5rem] relative overflow-hidden group border border-white/5">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            <Sparkles size={14} /> AI Mentor Protocol
          </div>
          <button 
            onClick={fetchMotivation}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-500 hover:text-white"
            title="Refresh Guidance"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="h-6 w-3/4 bg-white/5 rounded-lg animate-pulse" />
            <div className="h-4 w-full bg-white/5 rounded-lg animate-pulse" />
            <div className="h-4 w-5/6 bg-white/5 rounded-lg animate-pulse" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-invert prose-sm max-w-none"
          >
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h2 className="text-xl font-black mb-4 text-white">{children}</h2>,
                p: ({ children }) => <p className="text-zinc-400 leading-relaxed mb-4 italic">{children}</p>,
                strong: ({ children }) => <strong className="text-indigo-400 font-bold block mt-6 mb-2">{children}</strong>
              }}
            >
              {message}
            </ReactMarkdown>
          </motion.div>
        )}
      </div>
      
      <Quote className="absolute bottom-6 right-8 text-white/5" size={80} strokeWidth={1} />
    </div>
  );
}
