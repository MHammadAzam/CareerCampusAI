import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { Compass, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: name });
      
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        createdAt: serverTimestamp(),
        plan: 'starter'
      });
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="p-2 bg-indigo-600 rounded-lg"><Compass className="text-white" size={24} /></div>
            <span className="text-2xl font-black tracking-tight">CareerCompass AI</span>
          </Link>
          <h1 className="text-3xl font-black text-[hsl(var(--foreground))]">Start Your Journey</h1>
          <p className="text-[hsl(var(--muted-foreground))] mt-2 font-medium">Map your trajectory with precision intelligence.</p>
        </div>

        <div className="bg-[hsl(var(--card))] p-8 rounded-[2.5rem] border border-[hsl(var(--border))] shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={100} className="text-indigo-600" />
           </div>
           
           <form onSubmit={handleSignup} className="space-y-4 relative z-10">
              <div>
                 <label className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))] ml-2 block mb-2">Professional Identity</label>
                 <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      className="w-full pl-12 pr-4 py-4 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                 </div>
              </div>
              <div>
                 <label className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))] ml-2 block mb-2">Email Protocol</label>
                 <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                    <input
                      type="email"
                      required
                      placeholder="jane@company.com"
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
                      placeholder="Minimum 8 characters"
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
                {loading ? 'Processing...' : 'Register Identity'} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </form>

           <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[hsl(var(--border))]"></div></div>
              <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest text-[hsl(var(--muted-foreground))] uppercase"><span className="bg-[hsl(var(--card))] px-4">Instant Access</span></div>
           </div>

           <button
             onClick={handleGoogleSignup}
             className="w-full flex items-center justify-center gap-3 py-4 border border-[hsl(var(--border))] rounded-2xl font-bold text-sm hover:bg-[hsl(var(--muted))] transition-all"
           >
             <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" referrerPolicy="no-referrer" />
             Register with Google
           </button>
        </div>

        <p className="text-center mt-8 text-sm font-medium text-[hsl(var(--muted-foreground))]">
          Already mapped?{' '}
          <Link to="/login" className="text-indigo-600 font-bold hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
