import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { Compass, Mail, Lock, ArrowRight, Github } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Invalid identity credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="p-2 bg-indigo-600 rounded-lg"><Compass className="text-white" size={24} /></div>
            <span className="text-2xl font-black tracking-tight">CareerCompass AI</span>
          </Link>
          <h1 className="text-3xl font-black text-[hsl(var(--foreground))]">Welcome Back</h1>
          <p className="text-[hsl(var(--muted-foreground))] mt-2 font-medium">Resume your strategic evolution.</p>
        </div>

        <div className="bg-[hsl(var(--card))] p-8 rounded-[2.5rem] border border-[hsl(var(--border))] shadow-xl">
           <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                 <label className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))] ml-2 block mb-2">Protocol Address</label>
                 <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      className="w-full pl-12 pr-4 py-4 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                 </div>
              </div>
              <div>
                 <label className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))] ml-2 block mb-2">Security Key</label>
                 <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-4 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                 </div>
              </div>
              
              {error && <p className="text-xs font-bold text-red-500 text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? 'Initializing...' : 'Authorize Session'} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </form>

           <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[hsl(var(--border))]"></div></div>
              <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))] uppercase"><span className="bg-[hsl(var(--card))] px-4">Social Access</span></div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-3 py-4 border border-[hsl(var(--border))] rounded-2xl font-bold text-sm hover:bg-[hsl(var(--muted))] transition-all"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" referrerPolicy="no-referrer" />
                Google
              </button>
              <button className="flex items-center justify-center gap-3 py-4 border border-[hsl(var(--border))] rounded-2xl font-bold text-sm hover:bg-[hsl(var(--muted))] transition-all opacity-50 cursor-not-allowed">
                <Github size={20} />
                GitHub
              </button>
           </div>
        </div>

        <p className="text-center mt-8 text-sm font-medium text-[hsl(var(--muted-foreground))]">
          New to the platform?{' '}
          <Link to="/signup" className="text-indigo-600 font-bold hover:underline">
            Request Access
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
