import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, ArrowRight, Target, Sparkles, ChevronRight, GraduationCap, Clock, Globe, RefreshCw } from 'lucide-react';
import { UserInput } from '../../services/gemini';

interface RoadmapInputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

export default function RoadmapInputForm({ onSubmit, isLoading }: RoadmapInputFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserInput>({
    interests: '',
    skillLevel: 'Beginner',
    dailyHours: '2',
    yesterdayProgress: 'Done',
    mood: ''
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isStepValid = () => {
    if (step === 1) return formData.interests;
    if (step === 2) return true; // dailyHours and yesterdayProgress have defaults
    if (step === 3) return true; // mood is optional
    return false;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600/10 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
          <Sparkles size={14} /> Stratagem Initialization
        </div>
        <h2 className="text-3xl font-black mb-4">Neural Mapping Entry</h2>
        <p className="text-[hsl(var(--muted-foreground))]">Feed the AI your daily vectors to calculate your optimal trajectory.</p>
      </div>

      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[3rem] p-8 md:p-12 shadow-xl relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[hsl(var(--border))]">
          <motion.div 
            className="h-full bg-indigo-600" 
            initial={{ width: '33.33%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-8"
        >
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-[hsl(var(--muted-foreground))] flex items-center gap-2">
                  <BrainCircuit size={14} className="text-indigo-600" /> Career Interest
                </label>
                <textarea
                  name="interests"
                  placeholder="e.g. Distributed Systems, FinTech, SaaS, UI Architecture..."
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-2xl p-4 min-h-[100px] outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                  value={formData.interests}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-[hsl(var(--muted-foreground))] flex items-center gap-2">
                  <Target size={14} className="text-indigo-600" /> Skill Level
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {(['Beginner', 'Intermediate'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, skillLevel: level }))}
                      className={`p-4 rounded-2xl border font-bold transition-all ${
                        formData.skillLevel === level 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                        : 'bg-[hsl(var(--muted))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-indigo-600/50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-[hsl(var(--muted-foreground))] flex items-center gap-2">
                  <Clock size={14} className="text-indigo-600" /> Daily Available Hours
                </label>
                <select
                  name="dailyHours"
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-600 appearance-none font-bold"
                  value={formData.dailyHours}
                  onChange={handleChange}
                >
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="3">3 hours</option>
                  <option value="4">4 hours</option>
                  <option value="6">6 hours</option>
                  <option value="8">Full-Time (8+)</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-[hsl(var(--muted-foreground))] flex items-center gap-2">
                  <RefreshCw size={14} className="text-indigo-600" /> Yesterday's Progress
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {(['Done', 'Not Done'] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, yesterdayProgress: status }))}
                      className={`p-4 rounded-2xl border font-bold transition-all ${
                        formData.yesterdayProgress === status 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                        : 'bg-[hsl(var(--muted))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-indigo-600/50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-[hsl(var(--muted-foreground))] flex items-center gap-2">
                  <Sparkles size={14} className="text-indigo-600" /> Current Mood (Optional)
                </label>
                <input
                  type="text"
                  name="mood"
                  placeholder="e.g. Motivated, Tired, Focused, Overwhelmed..."
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-bold"
                  value={formData.mood}
                  onChange={handleChange}
                />
                <p className="text-[10px] text-[hsl(var(--muted-foreground))] font-medium pl-1">The AI will calibrate today's plan difficulty based on your energy levels.</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-8 border-t border-[hsl(var(--border))]">
            {step > 1 ? (
              <button
                onClick={prevStep}
                className="px-6 py-3 text-sm font-bold text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
              >
                Back
              </button>
            ) : <div />}

            <button
              disabled={!isStepValid() || isLoading}
              onClick={() => step === 3 ? onSubmit(formData) : nextStep()}
              className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-600/20 flex items-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50 active:scale-95"
            >
              {isLoading ? (
                <>Calculating Vectors... <RefreshCw size={18} className="animate-spin" /></>
              ) : (
                <>
                  {step === 3 ? 'Generate Roadmap' : 'Continue Mapping'} 
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
