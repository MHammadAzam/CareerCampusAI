import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
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
  Clock,
  Home,
  Compass
} from 'lucide-react';
import CareerChat from '../components/dashboard/CareerChat';
import MotivationCard from '../components/dashboard/MotivationCard';
import DailyCoachCard from '../components/dashboard/DailyCoachCard';
import { MentorContext } from '../services/mentorService';
import RoadmapDisplay from '../components/dashboard/RoadmapDisplay';
import RoadmapInputForm from '../components/dashboard/RoadmapInputForm';
import ProfileEdit from '../components/dashboard/ProfileEdit';
import { generateCareerRoadmap, UserInput } from '../services/gemini';
import { Menu, X, CheckCircle2, RefreshCw, Upload, Play, Check } from 'lucide-react';

type DashboardView = 'overview' | 'neural-mapping' | 'resume-engine' | 'interview-sim' | 'config';

export default function Dashboard() {
  const { user, profile, loading, signOut } = useAuth();
  const [activeView, setActiveView] = React.useState<DashboardView>('overview');
  const [roadmap, setRoadmap] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isInputting, setIsInputting] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isSimulating, setIsSimulating] = React.useState(false);
  const [activeSimulation, setActiveSimulation] = React.useState<string | null>(null);
  const [uploadedResume, setUploadedResume] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[hsl(var(--background))]">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-600 blur-[40px] opacity-20 animate-pulse" />
        <div className="relative p-6 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white animate-[bounce_2s_infinite]">
            <Compass size={24} />
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center gap-2">
        <Link to="/" className="text-xl font-black tracking-tighter hover:text-indigo-600 transition-colors">CareerCompass AI</Link>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 h-1.5 rounded-full bg-indigo-600"
            />
          ))}
        </div>
        <p className="text-[hsl(var(--muted-foreground))] text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Uploading Strategy Vectors</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;

  const handleGenerateRoadmap = async (input: UserInput) => {
    setIsGenerating(true);
    try {
      const result = await generateCareerRoadmap(input);
      setRoadmap(result);
      setIsInputting(false);
      setActiveView('neural-mapping');
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const initializeRoadmapGeneration = () => {
    setRoadmap(null);
    setIsInputting(true);
    setActiveView('neural-mapping');
  };

  const startSimulation = (name: string) => {
    setActiveSimulation(name);
    setIsSimulating(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setUploadedResume(e.target.files[0]);
    }
  };

  const sidebarItems: { icon: any; label: string; id: DashboardView }[] = [
    { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
    { icon: BrainCircuit, label: 'Neural Mapping', id: 'neural-mapping' },
    { icon: FileText, label: 'AI Resume Engine', id: 'resume-engine' },
    { icon: Video, label: 'Interview Simulator', id: 'interview-sim' },
    { icon: Settings, label: 'Profile & Settings', id: 'config' },
  ];

  const navigateTo = (view: DashboardView) => {
    setActiveView(view);
    setIsSidebarOpen(false);
  };

  const mentorContext: MentorContext = {
    displayName: profile?.displayName || 'Strategic User',
    goals: 'Transition to Staff Engineering Roles at Tier-1 Tech Companies',
    skillLevel: 'intermediate',
    stage: 'Narrative Engineering & Market Deployment',
    struggles: 'Matching executive narrative expectations and cultural alignment'
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-24 right-4 z-50 p-3 bg-indigo-600 text-white rounded-2xl shadow-xl active:scale-95 transition-all"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-0 z-40 lg:relative lg:z-0 lg:flex w-72 border-r border-[hsl(var(--border))] flex-col bg-zinc-50 dark:bg-zinc-950/50 transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Link to="/" className="p-8 border-b border-[hsl(var(--border))] hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors block">
          <div className="flex items-center gap-3 font-black text-xl tracking-tight">
             <div className="p-1.5 bg-indigo-600 rounded-lg text-white"><BrainCircuit size={20} /></div>
             CareerCompass AI
          </div>
        </Link>
        
        <nav className="flex-1 p-6 space-y-2">
           <Link 
             to="/"
             className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-indigo-600 transition-all mb-4"
           >
              <Home size={20} />
              <span className="font-bold text-sm">Exit to Website</span>
           </Link>

           <div className="h-px bg-[hsl(var(--border))] mx-4 mb-4" />

           <p className="text-[10px] font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-[0.2em] mb-4 ml-4">Strategic Console</p>
           {sidebarItems.map((item, i) => (
             <button 
               key={i} 
               onClick={() => navigateTo(item.id)}
               className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${activeView === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]'}`}
             >
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
          {activeView === 'overview' && (
            <div className="max-w-6xl mx-auto p-4 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                  <div>
                     <h1 className="text-3xl font-black mb-2">Welcome back, {profile?.displayName?.split(' ')[0]}</h1>
                     <p className="text-[hsl(var(--muted-foreground))] font-medium">Your career trajectory is currently up 12.4% this week.</p>
                  </div>
                  <div className="flex gap-4">
                     <button 
                        onClick={initializeRoadmapGeneration}
                        disabled={isGenerating}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 text-sm hover:-translate-y-0.5 transition-all disabled:opacity-50"
                     >
                        {isGenerating ? 'Mapping Trajectory...' : 'Generate New Roadmap'}
                     </button>
                  </div>
               </header>

               {/* Stats Grid */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  {[
                    { label: 'Profile Matching', value: '84%', icon: Target, color: 'text-indigo-500' },
                    { label: 'Market Visibility', value: '+12%', icon: TrendingUp, color: 'text-emerald-500' },
                    { label: 'Prep Hours', value: '18.5', icon: Clock, color: 'text-purple-500' },
                  ].map((stat, i) => (
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
                     <div className="grid md:grid-cols-2 gap-8 items-start">
                        <MotivationCard context={mentorContext} />
                        <DailyCoachCard />
                     </div>
                     
                     <div className="p-8 bg-zinc-950 text-white rounded-[2.5rem] relative overflow-hidden group border border-white/5">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10">
                           <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
                              <Sparkles size={14} /> Intelligence Suggestion
                           </div>
                           <h2 className="text-2xl font-black mb-4">Optimize Narrative for "Staff Engineer" roles</h2>
                           <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-lg">Our analysis indicates your current resume narrative is indexed for "Senior" level. We have generated 4 specific narrative interventions to pivot for Staff/Principal status.</p>
                           <button 
                             onClick={() => setActiveView('resume-engine')}
                             className="flex items-center gap-2 font-bold group-hover:translate-x-2 transition-transform"
                           >
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
                        <button 
                          onClick={() => setActiveView('interview-sim')}
                          className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm shadow-lg whitespace-nowrap overflow-hidden transition-all active:scale-95"
                        >
                          Start Simulation
                        </button>
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
          )}

          {activeView === 'neural-mapping' && (
            <div className="max-w-7xl mx-auto p-4 md:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
               {isInputting ? (
                 <RoadmapInputForm onSubmit={handleGenerateRoadmap} isLoading={isGenerating} />
               ) : roadmap ? (
                 <RoadmapDisplay 
                   content={roadmap} 
                   onReset={() => {
                     setRoadmap(null);
                     setIsInputting(true);
                   }} 
                 />
               ) : (
                 <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="w-20 h-20 bg-indigo-600/10 rounded-[2rem] flex items-center justify-center mb-6">
                       <BrainCircuit size={40} className="text-indigo-600" />
                    </div>
                    <h2 className="text-3xl font-black mb-4">No Active Neural Map</h2>
                    <p className="text-[hsl(var(--muted-foreground))] max-w-sm mb-8">Generate a precision roadmap to start your career transformation.</p>
                    <button 
                      onClick={initializeRoadmapGeneration}
                      disabled={isGenerating}
                      className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-xl shadow-indigo-600/20"
                    >
                      <Target size={20} /> Initialize Roadmap Generation
                    </button>
                 </div>
               )}
            </div>
          )}

          {activeView === 'resume-engine' && (
            <div className="max-w-6xl mx-auto p-4 md:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
               <h2 className="text-3xl font-black mb-8">AI Resume Engineering</h2>
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-12 bg-[hsl(var(--card))] border border-dashed border-[hsl(var(--border))] rounded-[3rem] flex flex-col items-center justify-center text-center group cursor-pointer hover:border-indigo-600/50 transition-all">
                     <input 
                       type="file" 
                       ref={fileInputRef} 
                       onChange={handleFileUpload} 
                       className="hidden" 
                       accept=".pdf,.doc,.docx"
                     />
                     <FileText size={48} className={`mb-6 transition-colors ${uploadedResume ? 'text-emerald-500' : 'text-zinc-300 group-hover:text-indigo-400'}`} />
                     {uploadedResume ? (
                        <div>
                          <p className="text-emerald-500 font-bold mb-2">Analysis Complete</p>
                          <p className="text-zinc-500 text-sm mb-8">{uploadedResume.name}</p>
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs font-bold text-indigo-600 hover:underline"
                          >
                            Replace Document
                          </button>
                        </div>
                     ) : (
                        <>
                          <p className="text-zinc-500 mb-8 max-w-xs">Drop your existing resume here or click to upload for comprehensive narrative analysis.</p>
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2"
                          >
                            <Upload size={18} /> Upload Source Document
                          </button>
                        </>
                     )}
                  </div>
                  <div className="space-y-6">
                     <div className="p-8 bg-zinc-950 text-white rounded-[2.5rem]">
                        <h3 className="font-bold mb-4">Active Narrative Interventions</h3>
                        <div className="space-y-4">
                           {['Shift focus from "Lead" to "Strategic Partner"', 'Emphasize architectural trade-off reasoning', 'Quantify outcome with business terminology'].map(t => (
                              <div key={t} className="flex items-center gap-3 text-sm text-zinc-400">
                                 <CheckCircle2 size={16} className="text-emerald-500" /> {t}
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeView === 'interview-sim' && (
            <div className="max-w-6xl mx-auto p-4 md:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
               <h2 className="text-3xl font-black mb-8">Neural Interview Simulation</h2>
               {activeSimulation ? (
                  <div className="p-12 bg-zinc-950 text-white rounded-[3rem] border border-white/5 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[100px] rounded-full" />
                     <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center animate-pulse mb-8">
                           <Video size={40} />
                        </div>
                        <h3 className="text-2xl font-black mb-2">Protocol: {activeSimulation}</h3>
                        <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest mb-8">System Initializing neural link...</p>
                        <div className="space-y-4 mb-10 w-full max-w-md text-left">
                           {['Establishing environment...', 'Loading cultural markers...', 'Calibrating bias detection...'].map((t, i) => (
                              <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.5 }}
                                className="flex items-center gap-3 text-zinc-500 text-sm"
                              >
                                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" /> {t}
                              </motion.div>
                           ))}
                        </div>
                        <button 
                          onClick={() => setActiveSimulation(null)}
                          className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold shadow-xl active:scale-95"
                        >
                          Terminate Protocol
                        </button>
                     </div>
                  </div>
               ) : (
                  <div className="grid md:grid-cols-3 gap-6">
                     {['Technical High-Concurrency', 'System Design: Tier-1', 'Behavioral: Leadership'].map((s, i) => (
                       <div key={i} className="p-8 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-3xl group cursor-pointer hover:border-indigo-600 transition-all">
                          <div className="w-12 h-12 bg-[hsl(var(--muted))] rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                             <Video size={24} />
                          </div>
                          <h3 className="font-bold mb-2">{s}</h3>
                          <p className="text-xs text-[hsl(var(--muted-foreground))] mb-6">Targeting Staff+ levels at global infrastructure firms.</p>
                          <button 
                            onClick={() => startSimulation(s)}
                            className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2"
                          >
                             <Play size={16} fill="white" /> Start Protocol
                          </button>
                       </div>
                     ))}
                  </div>
               )}
            </div>
          )}

          {activeView === 'config' && (
            <div className="max-w-6xl mx-auto p-4 md:p-12 animate-in fade-in slide-in-from-right-4 duration-500">
               <ProfileEdit />
            </div>
          )}
      </main>
      <CareerChat />
    </div>
  );
}
