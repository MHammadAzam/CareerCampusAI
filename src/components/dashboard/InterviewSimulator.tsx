import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Send, RefreshCw, X, MessageSquare, Award, CheckCircle2, Play } from 'lucide-react';
import { conductInterview, analyzeInterview, InterviewMessage } from '../../services/gemini';

interface InterviewSimulatorProps {
  type: string;
  onClose: () => void;
}

export default function InterviewSimulator({ type, onClose }: InterviewSimulatorProps) {
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [analysis, setAnalysis] = useState<{ score: number; feedback: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial message from interviewer
    startSession();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startSession = async () => {
    setIsLoading(true);
    try {
      const response = await conductInterview([], `Interview Type: ${type}`);
      setMessages([{ role: 'interviewer', content: response }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || isFinished) return;

    const userMessage: InterviewMessage = { role: 'candidate', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await conductInterview(newMessages, `Interview Type: ${type}`);
      setMessages(prev => [...prev, { role: 'interviewer', content: response }]);
      
      if (response.toLowerCase().includes("concludes our session")) {
        handleFinish(newMessages.concat({ role: 'interviewer', content: response }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = async (finalMessages: InterviewMessage[]) => {
    setIsFinished(true);
    setIsLoading(true);
    try {
      const result = await analyzeInterview(finalMessages);
      setAnalysis(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[3rem] w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-[hsl(var(--border))] flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg animate-pulse">
              <Video size={24} />
            </div>
            <div>
              <h3 className="font-black text-lg">Neural Simulation: {type}</h3>
              <p className="text-[10px] uppercase font-bold text-[hsl(var(--muted-foreground))] tracking-widest">Protocol Active • End-to-End Encryption</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[hsl(var(--muted))] rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Conversation Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth"
        >
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'interviewer' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[80%] rounded-[2rem] p-6 shadow-sm ${
                msg.role === 'interviewer' 
                ? 'bg-zinc-100 dark:bg-zinc-800 text-[hsl(var(--foreground))] rounded-tl-none' 
                : 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-600/20'
              }`}>
                <div className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-50">
                  {msg.role === 'interviewer' ? 'Recruiter AI' : 'Strategic Candidate'}
                </div>
                <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && !isFinished && (
            <div className="flex justify-start">
              <div className="bg-zinc-100 dark:bg-zinc-800 rounded-[2rem] p-4 flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 rounded-full bg-indigo-600"
                  />
                ))}
              </div>
            </div>
          )}

          {isFinished && analysis && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 bg-zinc-950 text-white rounded-[2.5rem] border border-white/5 relative overflow-hidden text-center"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[80px] rounded-full" />
              <div className="relative z-10">
                <Award size={48} className="text-indigo-400 mx-auto mb-4" />
                <h4 className="text-3xl font-black mb-2">Performance Vector Score</h4>
                <div className="text-6xl font-black text-indigo-400 mb-8">{analysis.score}%</div>
                
                <div className="max-w-xl mx-auto text-left bg-white/5 p-6 rounded-3xl border border-white/10 space-y-6">
                  <div className="text-xs font-bold uppercase tracking-widest text-indigo-400">Strategic Feedback</div>
                  <div className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">
                    {analysis.feedback}
                  </div>
                </div>

                <div className="mt-10 flex gap-4 justify-center">
                  <button 
                    onClick={() => {
                       setMessages([]);
                       setIsFinished(false);
                       setAnalysis(null);
                       startSession();
                    }}
                    className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all"
                  >
                    <RefreshCw size={18} /> New Protocol
                  </button>
                  <button 
                    onClick={onClose}
                    className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
                  >
                    Close Console
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        {!isFinished && (
          <div className="p-6 border-t border-[hsl(var(--border))] bg-zinc-50 dark:bg-zinc-950/50">
            <div className="max-w-4xl mx-auto relative">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Compose strategic response..."
                className="w-full p-4 pr-16 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
                disabled={isLoading}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-2 p-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
