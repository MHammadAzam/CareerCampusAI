import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Compass, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const { user, profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Success Stories', path: '/success-stories' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--background))]/80 backdrop-blur-md border-b border-[hsl(var(--border))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-indigo-600 rounded-lg group-hover:rotate-12 transition-transform duration-300">
              <Compass className="text-white" size={20} />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[hsl(var(--foreground))]">
              CareerCompass <span className="text-indigo-600">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-colors ${
                  isActive(link.path) ? 'text-indigo-600' : 'text-[hsl(var(--muted-foreground))] hover:text-indigo-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[hsl(var(--muted))] transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <Link
                to="/dashboard"
                className="px-5 py-2 bg-indigo-600 text-white rounded-full text-sm font-bold shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 transition-all active:scale-95"
              >
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-semibold text-[hsl(var(--muted-foreground))] hover:text-indigo-500">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-full text-sm font-bold shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 transition-all active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[hsl(var(--muted))] transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-[hsl(var(--muted-foreground))]"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[hsl(var(--background))] border-b border-[hsl(var(--border))] px-4 pt-2 pb-6 space-y-4"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block text-base font-semibold text-[hsl(var(--muted-foreground))]"
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center py-3 bg-indigo-600 text-white rounded-xl font-bold"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center py-3 border border-[hsl(var(--border))] rounded-xl font-bold"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center py-3 bg-indigo-600 text-white rounded-xl font-bold"
              >
                Sign Up
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </nav>
  );
}
