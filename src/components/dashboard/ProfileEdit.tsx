import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Save, User, Image, CreditCard, CheckCircle2, AlertCircle, Loader2, Camera, Upload, X } from 'lucide-react';

export default function ProfileEdit() {
  const { profile, updateProfile, updateSubscriptionPlan } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || '');
  const [plan, setPlan] = useState(profile?.plan || 'Basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Could not access camera. Please check permissions.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPhotoURL(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setShowCamera(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  React.useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setPhotoURL(profile.photoURL || '');
      setPlan(profile.plan || 'Basic');
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!displayName.trim()) {
      setError('Display name is required');
      setLoading(false);
      return;
    }

    try {
      await updateProfile({ displayName, photoURL });
      await updateSubscriptionPlan(plan as any);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-black mb-2">Profile Intelligence</h2>
        <p className="text-[hsl(var(--muted-foreground))]">Update your strategic identity and resource access levels.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Identity Section */}
        <div className="p-8 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[2.5rem] shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-2">
            <User size={14} /> Identity Vectors
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2rem] overflow-hidden bg-zinc-100 border-4 border-white shadow-xl flex-shrink-0 relative">
                {photoURL ? (
                  <img src={photoURL} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300">
                    <User size={48} />
                  </div>
                )}
                {loading && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Loader2 className="animate-spin text-white" size={24} />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 flex gap-1">
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
                  title="Upload Photo"
                >
                  <Upload size={14} />
                </button>
                <button 
                  type="button"
                  onClick={startCamera}
                  className="p-2 bg-zinc-900 text-white rounded-xl shadow-lg hover:bg-black transition-all"
                  title="Take Photo"
                >
                  <Camera size={14} />
                </button>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Display Name</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Tactical Navigator"
                  className="w-full p-4 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Avatar Source (URL)</label>
                <div className="relative">
                  <input 
                    type="url" 
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-4 bg-[hsl(var(--muted))] border border-[hsl(var(--border))] rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-bold pl-12"
                  />
                  <Image className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[hsl(var(--card))] rounded-[2.5rem] overflow-hidden max-w-md w-full relative">
              <button 
                onClick={stopCamera}
                className="absolute top-4 right-4 p-2 text-white bg-black/20 rounded-full hover:bg-black/40 transition-all z-10"
              >
                <X size={20} />
              </button>
              <div className="aspect-video bg-black relative">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 text-center">
                <h3 className="text-xl font-black mb-2">Capture Identity</h3>
                <p className="text-[hsl(var(--muted-foreground))] text-sm mb-6">Align your face for the strategic profile scan.</p>
                <button 
                  type="button"
                  onClick={capturePhoto}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mx-auto"
                >
                  <Camera size={20} /> Capture Frame
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Section */}
        <div className="p-8 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[2.5rem] shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-2">
            <CreditCard size={14} /> Resource Allocation
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['Basic', 'Pro', 'Enterprise'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPlan(p)}
                className={`p-4 rounded-2xl border-2 transition-all text-left ${
                  plan === p 
                  ? 'border-indigo-600 bg-indigo-600/5 ring-4 ring-indigo-600/10' 
                  : 'border-[hsl(var(--border))] hover:border-zinc-300'
                }`}
              >
                <div className="font-black text-sm mb-1">{p}</div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  {p === 'Basic' ? 'Standard Protocol' : p === 'Pro' ? 'Neural Advanced' : 'Strategic Global'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Feedback & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-red-500 text-sm font-bold"
              >
                <AlertCircle size={16} /> {error}
              </motion.div>
            )}
            {success && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-emerald-500 text-sm font-bold"
              >
                <CheckCircle2 size={16} /> Identity parameters synchronized.
              </motion.div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 whitespace-nowrap"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            {loading ? 'Synchronizing...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}
