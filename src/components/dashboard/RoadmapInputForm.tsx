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
    skills: '',
    education: '',
    goals: '',
    timeAvailability: '',
    country: ''
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isStepValid = () => {
    if (step === 1) return formData.interests && formData.skills;
    if (step === 2) return formData.education && formData.goals;
    if (step === 3) return formData.timeAvailability;
    return false;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600/10 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
          <Sparkles size={14} /> Stratagem Initialization
        </div>
        <h2 className="text-3xl font-black mb-4">Neural Mapping Entry</h2>
        <p className="text-[hsl(var(--muted-foreground))]">Feed the AI your current vectors to calculate the optimal career path.</p>
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
                  <BrainCircuit size={14} className="text-indigo-600" /> Professional Interests
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
                  <Target size={14} className="text-indigo-600" /> Current Core Skills
                </label>
                <textarea
                  name="skills"
                  placeholder="e.g. React, Node.js, AWS, Kubernetes, Team Leadership..."
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-2xl p-4 min-h-[100px] outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-[hsl(var(--muted-foreground))] flex items-center gap-2">
                  <GraduationCap size={14} className="text-indigo-600" /> Highest Education
                </label>
                <select
                  name="education"
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-600 appearance-none font-bold"
                  value={formData.education}
                  onChange={handleChange}
                >
                  <option value="">Select Level</option>
                  <option value="Associate">Associate Degree</option>
                  <option value="Bachelors">Bachelor's Degree</option>
                  <option value="Masters">Master's Degree</option>
                  <option value="PhD">PhD / Doctorate</option>
                  <option value="Self-Taught">Self-Taught / Bootcamp</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-[hsl(var(--muted-foreground))] flex items-center gap-2">
                  <Sparkles size={14} className="text-indigo-600" /> Ultimate Career Goal
                </label>
                <textarea
                  name="goals"
                  placeholder="e.g. Become a CTO within 5 years, Land a Staff Engineer role at Google..."
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-2xl p-4 min-h-[100px] outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                  value={formData.goals}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-[hsl(var(--muted-foreground))] flex items-center gap-2">
                  <Clock size={14} className="text-indigo-600" /> Weekly Availability
                </label>
                <select
                  name="timeAvailability"
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-600 appearance-none font-bold"
                  value={formData.timeAvailability}
                  onChange={handleChange}
                >
                  <option value="">Select Hours</option>
                  <option value="5-10">5-10 hours / week</option>
                  <option value="10-20">10-20 hours / week</option>
                  <option value="20-40">20-40 hours / week</option>
                  <option value="Full-Time">Full-Time Immersion</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-[hsl(var(--muted-foreground))] flex items-center gap-2">
                  <Globe size={14} className="text-indigo-600" /> Target Country (Optional)
                </label>
                <input
                  type="text"
                  name="country"
                  placeholder="e.g. USA, Remote, UK..."
                  className="w-full bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-bold"
                  value={formData.country}
                  onChange={handleChange}
                />
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
