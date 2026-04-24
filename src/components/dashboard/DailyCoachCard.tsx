import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Clock, Target, Sparkles, RefreshCw, ChevronRight, BrainCircuit } from 'lucide-react';
import { generateDailyCoachPlan, CoachInput } from '../../services/coachService';
import ReactMarkdown from 'react-markdown';

export default function DailyCoachCard() {
  const [isSettingUp, setIsSettingUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const [inputs, setInputs] = useState<CoachInput>({
    careerInterest: '',
    skillLevel: 'beginner',
    dailyHours: 2
  });

  useEffect(() => {
    const saved = localStorage.getItem('career_coach_inputs');
    const savedPlan = localStorage.getItem('career_coach_plan_today');
    const savedDate = localStorage.getItem('career_coach_date');

    if (saved) {
      setInputs(JSON.parse(saved));
      if (savedPlan && savedDate === new Date().toDateString()) {
        setPlan(savedPlan);
        setIsSettingUp(false);
      }
    }
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    localStorage.setItem('career_coach_inputs', JSON.stringify(inputs));
    localStorage.setItem('career_coach_date', new Date().toDateString());
    
    try {
      const result = await generateDailyCoachPlan(inputs);
      setPlan(result);
      localStorage.setItem('career_coach_plan_today', result);
      setIsSettingUp(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-950 text-white border border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col h-full min-h-[480px] relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02] relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-600/20">
            <Zap size={18} />
          </div>
          <span className="font-bold tracking-tight text-sm uppercase tracking-widest text-indigo-400">Daily Coach</span>
        </div>
        {!isSettingUp && (
          <button 
            onClick={() => setIsSettingUp(true)}
            className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors"
          >
            Adjust Plan
          </button>
        )}
      </div>

      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar relative z-10">
        <AnimatePresence mode="wait">
          {isSettingUp ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Career Interest</label>
                <input 
                  type="text" 
                  placeholder="e.g. Frontend Developer"
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-white placeholder:text-zinc-700"
                  value={inputs.careerInterest}
                  onChange={(e) => setInputs({...inputs, careerInterest: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Skill Level</label>
                  <select 
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-white"
                    value={inputs.skillLevel}
                    onChange={(e) => setInputs({...inputs, skillLevel: e.target.value as any})}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Daily Hours</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="24"
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-white"
                    value={inputs.dailyHours}
                    onChange={(e) => setInputs({...inputs, dailyHours: parseInt(e.target.value) || 1})}
                  />
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={!inputs.careerInterest || loading}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
              >
                {loading ? <RefreshCw className="animate-spin" /> : <ChevronRight />}
                {loading ? 'Initializing...' : 'Get Daily Plan'}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="plan"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-invert prose-sm max-w-none"
            >
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-white border-b border-white/5 pb-4">
                      {children}
                    </h2>
                  ),
                  h2: ({ children }) => (
                    <h3 className="text-sm font-black uppercase tracking-widest mt-10 mb-4 text-indigo-400">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-zinc-400 font-medium leading-relaxed mb-4">
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <span className="text-white font-black">{children}</span>
                  ),
                  li: ({ children }) => (
                    <li className="mb-3 list-none flex items-start gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0 animate-pulse" />
                      <span className="text-zinc-300 font-medium">{children}</span>
                    </li>
                  ),
                  ul: ({ children }) => (
                    <ul className="pl-0 space-y-2 mb-8">
                      {children}
                    </ul>
                  )
                }}
              >
                {plan || ''}
              </ReactMarkdown>
              
              <div className="mt-12 p-8 bg-white/5 border border-white/10 text-white rounded-[2.5rem] relative overflow-hidden group hover:bg-white/[0.08] transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Sparkles size={100} />
                </div>
                <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                  <BrainCircuit size={14} /> Stratagem Protocol
                </div>
                <p className="font-bold text-sm leading-relaxed text-zinc-300">
                  You don't need 10 hours. You need consistency with the hours you have. Return tomorrow for your upgrade.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
