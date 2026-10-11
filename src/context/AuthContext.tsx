import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { Profile, UserRole } from '@/types/database';
import { OWNER_PROFILE } from '@/data/ownerProfile';

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  role: UserRole;
  loading: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  signInWithOtp: (email: string) => Promise<{ error: any | null }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updated: Partial<Profile>) => Promise<void>;
  // Dev helper to switch role or demo persona safely
  switchDemoUser: (role: 'owner' | 'admin' | 'guest') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize session
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      // Check local stored demo persona or Supabase session
      const savedPersona = localStorage.getItem('dmiher_demo_persona');

      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            // Fetch profile
            const { data: userProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (userProfile && mounted) {
              setProfile(userProfile);
              setLoading(false);
              return;
            }
          }
        } catch (err) {
          console.warn('Supabase auth session check failed, using local profile fallback', err);
        }
      }

      // Default or local persona fallback
      if (savedPersona === 'admin') {
        const adminProfile: Profile = {
          id: 'admin-feat2230',
          full_name: 'Dr. T&P Officer / Admin',
          email: 'feat2230@gmail.com',
          role: 'admin',
          institution: 'DMIHER FEAT',
          department: 'Training & Placement Cell',
          profile_completion: 100,
        };
        setUser({ id: 'admin-feat2230', email: 'feat2230@gmail.com' });
        setProfile(adminProfile);
      } else {
        // Default to Owner Himanshu Chamatkar
        setUser({ id: OWNER_PROFILE.id, email: OWNER_PROFILE.email });
        setProfile(OWNER_PROFILE);
      }

      if (mounted) setLoading(false);
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signInWithOtp = async (email: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });
      return { error };
    }
    // Simulation fallback
    return { error: null };
  };

  const verifyOtp = async (email: string, token: string) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });
      if (data?.user) {
        setUser(data.user);
        const { data: p } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        if (p) setProfile(p);
      }
      return { error };
    }

    // Dev verification
    if (email.toLowerCase().includes('feat2230') || email.toLowerCase().includes('admin')) {
      switchDemoUser('admin');
    } else {
      switchDemoUser('owner');
    }
    return { error: null };
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn(e);
      }
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem('dmiher_demo_persona');
  };

  const updateProfile = async (updated: Partial<Profile>) => {
    if (!profile) return;
    const newProfile = { ...profile, ...updated, updated_at: new Date().toISOString() };
    setProfile(newProfile);

    if (isSupabaseConfigured && user) {
      try {
        await supabase.from('profiles').upsert(newProfile);
      } catch (err) {
        console.warn('Failed to update profile to Supabase', err);
      }
    }
  };

  const switchDemoUser = (persona: 'owner' | 'admin' | 'guest') => {
    localStorage.setItem('dmiher_demo_persona', persona);
    if (persona === 'admin') {
      const adminProfile: Profile = {
        id: 'admin-feat2230',
        full_name: 'Dr. T&P Officer / Admin',
        email: 'feat2230@gmail.com',
        role: 'admin',
        institution: 'DMIHER FEAT',
        department: 'Training & Placement Cell',
        profile_completion: 100,
      };
      setUser({ id: 'admin-feat2230', email: 'feat2230@gmail.com' });
      setProfile(adminProfile);
    } else if (persona === 'owner') {
      setUser({ id: OWNER_PROFILE.id, email: OWNER_PROFILE.email });
      setProfile(OWNER_PROFILE);
    } else {
      setUser(null);
      setProfile(null);
    }
  };

  const role: UserRole = profile?.role || 'student';
  const isAdmin = role === 'admin';
  const isStudent = role === 'student';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        loading,
        isAdmin,
        isStudent,
        signInWithOtp,
        verifyOtp,
        signOut,
        updateProfile,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
