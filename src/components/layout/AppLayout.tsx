import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Compass, 
  LayoutDashboard, 
  BookOpen, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { logout } from '../../firebase/auth';

export default function AppLayout() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Career Tree', href: '/career-tree', icon: BookOpen },
    { name: 'AI Strategies', href: '/ai-results', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-app)] flex">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="fixed top-0 left-0 bottom-0 bg-[var(--card-bg)] border-r border-[var(--card-border)] z-40 hidden md:flex flex-col"
      >
        <div className="p-6 h-20 flex items-center gap-3 overflow-hidden">
          <div className="min-w-[40px] h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Compass className="text-white" size={20} />
          </div>
          {isSidebarOpen && (
            <span className="text-lg font-black tracking-tighter whitespace-nowrap">CareerCompass</span>
          )}
        </div>

        <div className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link 
                key={item.name} 
                to={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                  isActive 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' 
                  : 'text-zinc-500 hover:text-[var(--text-app)] hover:bg-white/5'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-white' : 'group-hover:text-purple-400'} />
                {isSidebarOpen && <span className="font-bold text-sm">{item.name}</span>}
              </Link>
            );
          })}
        </div>

        <div className="p-4 mt-auto">
          {isSidebarOpen && (
            <div className="p-4 bg-gradient-to-br from-zinc-900 to-black border border-white/5 rounded-2xl mb-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 blur-2xl rounded-full" />
              <div className="relative z-10 text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Current Tier</div>
              <div className="relative z-10 flex items-center justify-between">
                 <span className="font-black text-white">PRO STRATEGY</span>
                 <Sparkles size={14} className="text-purple-400" />
              </div>
            </div>
          )}
          
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/5 transition-all transition-all group`}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-bold text-sm">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-70' : 'md:ml-20'}`}>
        {/* Top Bar */}
        <header className="h-20 border-b border-[var(--card-border)] bg-[var(--bg-app)]/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hidden md:block"
             >
               <Menu size={20} />
             </button>
             <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                <span>App</span>
                <ChevronRight size={14} />
                <span className="text-[var(--text-app)]">{navItems.find(i => i.href === location.pathname)?.name || 'Dashboard'}</span>
             </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-[var(--text-app)]">{profile?.displayName || user?.email?.split('@')[0]}</div>
                <div className="text-[10px] text-zinc-500 font-mono">ID: {user?.uid.slice(0, 8)}</div>
             </div>
             <div className="w-10 h-10 bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden">
                {profile?.photoURL ? <img src={profile.photoURL} alt="Avatar" /> : <div className="text-xs font-bold text-zinc-500">{user?.email?.charAt(0).toUpperCase()}</div>}
             </div>
          </div>
        </header>

        <div className="p-8 pb-32">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
