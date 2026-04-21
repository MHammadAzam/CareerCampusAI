import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';
import { motion } from 'motion/react';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-app)] selection:bg-purple-500/30">
      <Navbar />
      <main className="pt-20">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="py-20 border-t border-[var(--card-border)] bg-[var(--card-bg)]/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <Compass className="text-white" size={18} />
              </div>
              <span className="text-lg font-black tracking-tighter">CareerCompass AI</span>
            </div>
            <p className="text-zinc-500 text-sm max-w-sm">
              Level up your career with AI-powered strategy, roadmap generation, and precision market insights. Built for the next generation of professionals.
            </p>
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-600">Product</span>
              <Link to="/pricing" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Pricing</Link>
              <Link to="/how-it-works" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">How It Works</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-600">Company</span>
              <Link to="/success-stories" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Success Stories</Link>
              <Link to="/about" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">About Us</Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
          <span>© 2026 CareerCompass AI</span>
          <span>Security • Privacy • Terms</span>
        </div>
      </footer>
    </div>
  );
}

import { Compass } from 'lucide-react';
