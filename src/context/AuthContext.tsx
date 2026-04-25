import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { handleFirestoreError } from '../firebase/config';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  plan?: 'Basic' | 'Pro' | 'Enterprise';
  createdAt: any;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>;
  updateSubscriptionPlan: (plan: 'Basic' | 'Pro' | 'Enterprise') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            // Create profile if missing (e.g. initial Google login)
            const newProfile = {
              uid: user.uid,
              email: user.email!,
              displayName: user.displayName || 'Strategic User',
              photoURL: user.photoURL || undefined,
              createdAt: serverTimestamp(),
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile as any);
          }
        } catch (error) {
          console.error("Auth profile fetch error:", error);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    await auth.signOut();
  };

  const updateProfile = async (data: { displayName?: string; photoURL?: string }) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { ...data }, { merge: true });
      
      // Also update Firebase Auth profile for consistency
      const { updateProfile: authUpdateProfile } = await import('firebase/auth');
      await authUpdateProfile(user, data);
      
      // Update local profile state
      setProfile(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  };

  const updateSubscriptionPlan = async (plan: 'Basic' | 'Pro' | 'Enterprise') => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { plan }, { merge: true });
      setProfile(prev => prev ? { ...prev, plan } : null);
    } catch (error) {
      console.error("Subscription update error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, updateProfile, updateSubscriptionPlan }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
