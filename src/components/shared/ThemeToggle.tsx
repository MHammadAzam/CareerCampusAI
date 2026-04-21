import React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-3 glass rounded-2xl text-zinc-400 hover:text-white transition-all overflow-hidden relative group"
    >
      <div className="relative z-10">
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </div>
      
      {/* Hover background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );
}
