import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  X, 
  Bot, 
  User as UserIcon, 
  Brain, 
  Zap, 
  Target, 
  BarChart3,
  Sparkles,
  RefreshCw,
  MoreVertical,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { createCareerChat, ChatRole, ModelSpeed } from '../../services/gemini';
import { GenerateContentResponse } from '@google/genai';
import { db, handleFirestoreError } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  feedback?: 'positive' | 'negative';
}

export default function CareerChat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<ChatRole>('strategist');
  const [speed, setSpeed] = useState<ModelSpeed>('general');
  const [chat, setChat] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !chat) {
      setChat(createCareerChat(role, speed));
    }
  }, [isOpen, role, speed]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const userMsgId = Date.now().toString();
    setInput('');
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const currentChat = chat || createCareerChat(role, speed);
      if (!chat) setChat(currentChat);

      const stream = await currentChat.sendMessageStream({ message: userMessage });
      
      let incomingText = '';
      const modelMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '' }]);

      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          incomingText += c.text;
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last.role === 'model' && last.id === modelMsgId) {
              return [...prev.slice(0, -1), { id: modelMsgId, role: 'model', text: incomingText }];
            }
            return prev;
          });
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorId = Date.now().toString();
      setMessages(prev => [...prev, { id: errorId, role: 'model', text: 'I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const roles: { id: ChatRole; label: string; icon: any; color: string }[] = [
    { id: 'strategist', label: 'Strategist', icon: Target, color: 'text-purple-400' },
    { id: 'analyst', label: 'Analyst', icon: Brain, color: 'text-blue-400' },
    { id: 'researcher', label: 'Researcher', icon: BarChart3, color: 'text-emerald-400' },
    { id: 'coach', label: 'Coach', icon: Zap, color: 'text-amber-400' },
  ];

  const speeds: { id: ModelSpeed; label: string; desc: string }[] = [
    { id: 'fast', label: 'Flash-Lite', desc: 'Fastest responses' },
    { id: 'general', label: 'Flash', desc: 'Balanced performance' },
    { id: 'complex', label: 'Pro', desc: 'Deep reasoning' },
  ];

  const resetChat = () => {
    setMessages([]);
    setChat(createCareerChat(role, speed));
  };

  const handleFeedback = async (messageId: string, feedbackType: 'positive' | 'negative') => {
    if (!user) return;

    // Optimistic UI update
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, feedback: feedbackType } : msg
    ));

    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    try {
      await addDoc(collection(db, 'chat_feedback'), {
        userId: user.uid,
        messageId,
        messageText: message.text,
        feedback: feedbackType,
        role,
        speed,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error saving feedback:', error);
      handleFirestoreError(error, 'create', 'chat_feedback');
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-purple-500/30 z-[60]"
      >
        <MessageSquare size={28} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
            />

            {/* Chat Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--bg-app)] border-l border-[var(--card-border)] shadow-2xl z-[80] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-[var(--card-border)] bg-[var(--card-bg)]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                      <Bot className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-[var(--text-app)] font-bold">Career Intelligent Multi-Chat</h3>
                      <p className="text-zinc-500 text-xs">AI Mentor System Online</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={resetChat}
                      className="p-2 text-zinc-500 hover:text-white transition-colors"
                      title="Reset Chat"
                    >
                      <RefreshCw size={18} />
                    </button>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="p-2 text-zinc-500 hover:text-white transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Role & Speed Selectors */}
                <div className="space-y-4">
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {roles.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          setRole(r.id);
                          setChat(null);
                        }}
                        className={`flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-2xl border transition-all ${
                          role === r.id 
                            ? 'bg-[var(--card-bg)] border-purple-500/50' 
                            : 'bg-[var(--bg-app)] border-[var(--card-border)] opacity-50'
                        }`}
                      >
                        <r.icon className={r.color} size={18} />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-app)]">{r.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {speeds.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSpeed(s.id);
                          setChat(null);
                        }}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          speed === s.id 
                            ? 'bg-purple-500/10 border-purple-500/50 text-purple-400' 
                            : 'bg-[var(--bg-app)] border-[var(--card-border)] text-zinc-500'
                        }`}
                      >
                        <div className="text-[10px] font-bold uppercase">{s.label}</div>
                        <div className="text-[8px] opacity-60">{s.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                    <Sparkles className="text-purple-500" size={40} />
                    <div>
                      <h4 className="text-[var(--text-app)] font-bold">Start an AI Consultation</h4>
                      <p className="text-zinc-500 text-sm max-w-[200px]">Ask about your roadmap, skill acquisition, or market trends.</p>
                    </div>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      msg.role === 'user' ? 'bg-[var(--card-bg)]' : 'bg-purple-600'
                    }`}>
                      {msg.role === 'user' ? <UserIcon size={16} className="text-zinc-500" /> : <Bot size={16} className="text-white" />}
                    </div>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed relative group ${
                      msg.role === 'user' 
                        ? 'bg-[var(--card-bg)] text-[var(--text-app)] border border-[var(--card-border)] rounded-tr-none' 
                        : 'bg-[var(--bg-app)] text-[var(--muted-text)] border border-[var(--card-border)] rounded-tl-none'
                    }`}>
                      {msg.text}
                      
                      {msg.role === 'model' && msg.text && !isLoading && (
                        <div className="absolute -bottom-10 left-0 flex items-center gap-2 transition-opacity">
                          <button
                            onClick={() => handleFeedback(msg.id, 'positive')}
                            className={`p-1.5 rounded-lg border transition-all ${
                              msg.feedback === 'positive'
                                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500'
                                : 'bg-[var(--card-bg)] border-[var(--card-border)] text-zinc-500 hover:text-emerald-500'
                            }`}
                          >
                            <ThumbsUp size={14} fill={msg.feedback === 'positive' ? "currentColor" : "none"} />
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.id, 'negative')}
                            className={`p-1.5 rounded-lg border transition-all ${
                              msg.feedback === 'negative'
                                ? 'bg-red-500/10 border-red-500/50 text-red-500'
                                : 'bg-[var(--card-bg)] border-[var(--card-border)] text-zinc-500 hover:text-red-500'
                            }`}
                          >
                            <ThumbsDown size={14} fill={msg.feedback === 'negative' ? "currentColor" : "none"} />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isLoading && messages[messages.length - 1]?.role === 'user' && (
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center shrink-0">
                      <Bot size={16} className="text-white animate-pulse" />
                    </div>
                    <div className="p-4 rounded-2xl bg-[var(--bg-app)] border border-[var(--card-border)] rounded-tl-none">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-6 border-t border-[var(--card-border)] bg-[var(--card-bg)]">
                <form onSubmit={handleSend} className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ask your ${role}...`}
                    className="w-full pl-6 pr-14 py-4 bg-[var(--bg-app)] border border-[var(--card-border)] rounded-2xl text-[var(--text-app)] placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 top-2 w-10 h-10 bg-[var(--text-app)] text-[var(--bg-app)] rounded-xl flex items-center justify-center hover:opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <Send size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </form>
                <p className="text-[10px] text-zinc-600 text-center mt-3 font-mono uppercase tracking-widest">
                  AI responses can be non-deterministic • Verify critical data
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
