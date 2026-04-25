import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Compass } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import SEO from './components/shared/SEO';

// Pages
import Home from './pages/public/Home';
import HowItWorks from './pages/public/HowItWorks';
import Pricing from './pages/public/Pricing';
import SuccessStories from './pages/public/SuccessStories';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
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
        <p className="text-[hsl(var(--muted-foreground))] text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Neural Link Initializing</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  
  return (
    <div className="min-h-screen flex flex-col">
      <SEO />
      {!isAuthPage && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-[hsl(var(--muted))] border-t border-[hsl(var(--border))] py-12 px-4 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2">
           <Link to="/" className="text-xl font-black mb-4 tracking-tighter block hover:text-indigo-600 transition-colors">CareerCompass AI</Link>
           <p className="text-[hsl(var(--muted-foreground))] text-sm max-w-xs leading-relaxed">Systematically navigating the global workforce with advanced neural career mapping and strategic optimization.</p>
        </div>
        <div>
           <h4 className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--foreground))] mb-6">Product</h4>
           <div className="space-y-4">
              {['Pricing', 'How It Works', 'Roadmap', 'Safety'].map(i => <a key={i} href="#" className="block text-sm text-[hsl(var(--muted-foreground))] hover:text-indigo-600 transition-colors">{i}</a>)}
           </div>
        </div>
        <div>
           <h4 className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--foreground))] mb-6">Company</h4>
           <div className="space-y-4">
              {['About', 'Success Stories', 'Privacy', 'Contact'].map(i => <a key={i} href="#" className="block text-sm text-[hsl(var(--muted-foreground))] hover:text-indigo-600 transition-colors">{i}</a>)}
           </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-[hsl(var(--border))] flex flex-col md:flex-row justify-between items-center gap-6">
         <p className="text-xs text-[hsl(var(--muted-foreground))] font-medium">© 2026 Strategic Evolution Systems LLC. All rights reserved.</p>
         <div className="flex gap-6">
            <a href="#" className="text-xs font-bold text-[hsl(var(--muted-foreground))] hover:text-indigo-600">Twitter</a>
            <a href="#" className="text-xs font-bold text-[hsl(var(--muted-foreground))] hover:text-indigo-600">LinkedIn</a>
         </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/how-it-works" element={<PublicLayout><HowItWorks /></PublicLayout>} />
            <Route path="/pricing" element={<PublicLayout><Pricing /></PublicLayout>} />
            <Route path="/success-stories" element={<PublicLayout><SuccessStories /></PublicLayout>} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
            <Route path="/signup" element={<PublicLayout><Signup /></PublicLayout>} />
            
            {/* Private Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
