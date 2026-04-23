import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Target, 
  Video, 
  BrainCircuit, 
  Settings, 
  LogOut,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import CareerChat from '../components/dashboard/CareerChat';
import MotivationCard from '../components/dashboard/MotivationCard';
import { MentorContext } from '../services/mentorService';

export default function Dashboard() {
  const { user, profile, loading, signOut } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading Strategy...</div>;
  if (!user) return <Navigate to="/login" />;

  const stats = [
    { label: 'Profile Matching', value: '84%', icon: Target, color: 'text-indigo-500' },
    { label: 'Market Visibility', value: '+12%', icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Prep Hours', value: '18.5', icon: Clock, color: 'text-purple-500' },
  ];

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Overview', active: true },
    { icon: BrainCircuit, label: 'Neural Mapping' },
    { icon: FileText, label: 'AI Resume Engine' },
    { icon: Video, label: 'Interview Simulator' },
    { icon: Settings, label: 'Configuration' },
  ];

  const mentorContext: MentorContext = {
    displayName: profile?.displayName || 'Strategic User',
    goals: 'Transition to Staff Engineering Roles at Tier-1 Tech Companies',
    skillLevel: 'intermediate',
    stage: 'Narrative Engineering & Market Deployment',
    struggles: 'Matching executive narrative expectations and cultural alignment'
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-[hsl(var(--border))] hidden lg:flex flex-col bg-zinc-50 dark:bg-zinc-950/50">
        <div className="p-8 border-b border-[hsl(var(--border))]">
          <div className="flex items-center gap-3 font-black text-xl tracking-tight">
             <div className="p-1.5 bg-indigo-600 rounded-lg text-white"><BrainCircuit size={20} /></div>
             CareerCompass AI
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
           <p className="text-[10px] font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-[0.2em] mb-4 ml-4">Strategic Console</p>
           {sidebarItems.map((item, i) => (
             <button key={i} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${item.active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]'}`}>
                <item.icon size={20} />
                <span className="font-bold text-sm">{item.label}</span>
             </button>
           ))}
        </nav>

        <div className="p-6 border-t border-[hsl(var(--border))]">
           <button 
             onClick={signOut}
             className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all"
           >
              <LogOut size={20} />
              <span className="font-bold text-sm">Terminate Session</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-24 lg:pt-0">
         <div className="max-w-6xl mx-auto p-4 md:p-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
               <div>
                  <h1 className="text-3xl font-black mb-2">Welcome back, {profile?.displayName?.split(' ')[0]}</h1>
                  <p className="text-[hsl(var(--muted-foreground))] font-medium">Your career trajectory is currently up 12.4% this week.</p>
               </div>
               <div className="flex gap-4">
                  <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 text-sm hover:-translate-y-0.5 transition-all">Generate New Roadmap</button>
               </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
               {stats.map((stat, i) => (
                 <div key={i} className="p-6 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-3xl shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                       <div className={`p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 ${stat.color}`}>
                          <stat.icon size={20} />
                       </div>
                       <span className="text-xs font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-widest">{stat.label}</span>
                    </div>
                    <div className="text-3xl font-black">{stat.value}</div>
                 </div>
               ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
               {/* Activity Card */}
               <div className="lg:col-span-2 space-y-8">
                  <MotivationCard context={mentorContext} />
                  
                  <div className="p-8 bg-zinc-950 text-white rounded-[2.5rem] relative overflow-hidden group border border-white/5">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
                     <div className="relative z-10">
                        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
                           <Sparkles size={14} /> Intelligence Suggestion
                        </div>
                        <h2 className="text-2xl font-black mb-4">Optimize Narrative for "Staff Engineer" roles</h2>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-lg">Our analysis indicates your current resume narrative is indexed for "Senior" level. We have generated 4 specific narrative interventions to pivot for Staff/Principal status.</p>
                        <button className="flex items-center gap-2 font-bold group-hover:translate-x-2 transition-transform">
                           View Interventions <ArrowRight size={18} />
                        </button>
                     </div>
                  </div>

                  <div className="p-8 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[2.5rem]">
                     <h2 className="text-xl font-black mb-8">Ongoing Simulations</h2>
                     <div className="space-y-4">
                        {[
                          { title: 'System Design Mastery', status: 'In Progress', progress: 65, icon: BrainCircuit },
                          { title: 'SaaS Architecture Pitch', status: 'Completed', progress: 100, icon: Target },
                          { title: 'Salary Negotiation: Tier 1', status: 'Scheduled', progress: 0, icon: Clock },
                        ].map((item, i) => (
                           <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-[hsl(var(--muted))] transition-colors group cursor-pointer">
                              <div className="p-3 bg-[hsl(var(--muted))] rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                 <item.icon size={20} />
                              </div>
                              <div className="flex-1">
                                 <div className="font-bold text-sm mb-1">{item.title}</div>
                                 <div className="text-[10px] uppercase font-bold text-[hsl(var(--muted-foreground))] tracking-widest">{item.status}</div>
                              </div>
                              <div className="text-right">
                                 <div className="text-sm font-black mb-1">{item.progress}%</div>
                                 <div className="w-24 h-1.5 bg-[hsl(var(--border))] rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${item.progress}%` }} />
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Right Panel */}
               <div className="space-y-8">
                  <div className="p-8 bg-indigo-600 text-white rounded-[2.5rem] shadow-xl shadow-indigo-600/20">
                     <h3 className="font-black text-lg mb-4">Strategic Advisor</h3>
                     <p className="text-indigo-100 text-xs leading-relaxed mb-6 italic">"Your narrative matching for Stripe is currently 92%. We recommend one more interview simulation focusing on 'Cultural Alignment' before you apply."</p>
                     <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm shadow-lg">Start Simulation</button>
                  </div>

                  <div className="p-8 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[3rem]">
                     <h3 className="text-lg font-black mb-6">Target Roadmap</h3>
                     <div className="relative pl-8 space-y-8 border-l border-zinc-200 dark:border-zinc-800 ml-2">
                        {[
                          { date: 'Step 1', title: 'Narrative Pivot', done: true },
                          { date: 'Step 2', title: 'Resume Engineering', done: true },
                          { date: 'Step 3', title: 'Market Deployment', done: false },
                        ].map((step, i) => (
                           <div key={i} className="relative">
                              <div className={`absolute -left-10 top-0.5 w-4 h-4 rounded-full border-2 ${step.done ? 'bg-indigo-600 border-indigo-600' : 'bg-[hsl(var(--card))] border-[hsl(var(--border))]'}`} />
                              <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">{step.date}</div>
                              <div className={`text-sm font-bold ${step.done ? 'text-[hsl(var(--foreground))]' : 'text-[hsl(var(--muted-foreground))]'}`}>{step.title}</div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </main>
      <CareerChat />
    </div>
  );
}
