import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { Profile, UserRole } from '@/types/database';
import { OWNER_PROFILE } from '@/data/ownerProfile';
import { getScoreForUser } from '@/lib/scoring/ats';

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  role: UserRole;
  loading: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  signInWithOtp: (email: string) => Promise<{ error: any | null }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: any | null; isNewUser?: boolean }>;
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

  // Initialize session and auth state listener
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      const savedPersona = localStorage.getItem('dmiher_demo_persona');

      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            const { data: userProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (userProfile && mounted) {
              const calibratedProfile = {
                ...userProfile,
                ats_score: getScoreForUser(userProfile),
              };
              setProfile(calibratedProfile);
              setLoading(false);
              return;
            } else if (mounted) {
              // Create default profile if user exists in auth but not profiles
              const defaultP: Profile = {
                id: session.user.id,
                full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Student',
                email: session.user.email || '',
                role: 'student',
                profile_completion: 0,
                ats_score: 0,
              };
              setProfile(defaultP);
              setLoading(false);
              return;
            }
          }
        } catch (err) {
          console.warn('Supabase auth session check failed', err);
        }
      }

      // Persona fallback
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
      } else if (savedPersona === 'owner') {
        setUser({ id: OWNER_PROFILE.id, email: OWNER_PROFILE.email });
        setProfile(OWNER_PROFILE);
      } else if (savedPersona && savedPersona.startsWith('student_')) {
        const studentId = savedPersona.replace('student_', '');
        const savedData = localStorage.getItem(`dmiher_student_profile_${studentId}`);
        let pName = 'Student';
        let pEmail = '';
        let pComp = 0;
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);
            pName = parsed.formData?.full_name || 'Student';
            pEmail = parsed.formData?.email || '';
            pComp = parsed.profile_completion ?? 0;
          } catch (e) {
            console.warn(e);
          }
        }
        const stProfile: Profile = {
          id: studentId,
          full_name: pName,
          email: pEmail,
          role: 'student',
          profile_completion: pComp,
          ats_score: getScoreForUser({ id: studentId, full_name: pName, email: pEmail, role: 'student', profile_completion: pComp }),
        };
        setUser({ id: studentId, email: pEmail });
        setProfile(stProfile);
      } else {
        setUser(null);
        setProfile(null);
      }

      if (mounted) setLoading(false);
    }

    initAuth();

    // Listen for OAuth / Magic Link hash callbacks
    const { data: authListener } = isSupabaseConfigured
      ? supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user && mounted) {
            setUser(session.user);
            const { data: userProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            if (userProfile) {
              setProfile({
                ...userProfile,
                ats_score: getScoreForUser(userProfile),
              });
            }
          }
        })
      : { data: { subscription: { unsubscribe: () => {} } } };

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const signInWithOtp = async (email: string) => {
    if (isSupabaseConfigured) {
      const redirectUrl = typeof window !== 'undefined' ? window.location.origin : undefined;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: redirectUrl,
        },
      });
      return { error };
    }
    return { error: null };
  };

  const verifyOtp = async (email: string, token: string) => {
    if (isSupabaseConfigured) {
      // Clean token (trim whitespace)
      const cleanToken = token.trim();

      // Try type 'email' first (standard magiclink / OTP)
      let { data, error } = await supabase.auth.verifyOtp({
        email,
        token: cleanToken,
        type: 'email',
      });

      // If that failed, attempt type 'signup' (if new user signup confirmation is required)
      if (error) {
        const signupAttempt = await supabase.auth.verifyOtp({
          email,
          token: cleanToken,
          type: 'signup',
        });
        if (!signupAttempt.error) {
          data = signupAttempt.data;
          error = null;
        }
      }

      if (data?.user) {
        setUser(data.user);
        const { data: p } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        let isNewUser = false;
        if (p) {
          const calibratedProfile = {
            ...p,
            ats_score: getScoreForUser(p),
          };
          setProfile(calibratedProfile);
          isNewUser = !p.profile_completion || p.profile_completion < 50;
        } else {
          isNewUser = true;
          const newProfile: Profile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: data.user.user_metadata?.full_name || email.split('@')[0],
            role: email.toLowerCase().includes('feat2230') ? 'admin' : 'student',
            profile_completion: 0,
            ats_score: 0,
          };
          try {
            await supabase.from('profiles').upsert(newProfile);
          } catch (e) {
            console.warn(e);
          }
          setProfile(newProfile);
        }
        return { error, isNewUser };
      }
      return { error, isNewUser: false };
    }

    // Dev verification
    if (email.toLowerCase().includes('feat2230') || email.toLowerCase().includes('admin')) {
      switchDemoUser('admin');
      return { error: null, isNewUser: false };
    } else if (email.trim().toLowerCase() === '123himanshuchamatkar@gmail.com' || email.trim().toLowerCase() === 'owner@dmiher.edu.in') {
      switchDemoUser('owner');
      return { error: null, isNewUser: false };
    } else {
      const studentId = 'student-' + Math.random().toString(36).substring(2, 9);
      const newStudentProfile: Profile = {
        id: studentId,
        full_name: email.split('@')[0],
        email: email,
        role: 'student',
        profile_completion: 0,
        ats_score: 0,
      };
      setUser({ id: studentId, email });
      setProfile(newStudentProfile);
      localStorage.setItem('dmiher_demo_persona', `student_${studentId}`);
      return { error: null, isNewUser: true };
    }
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
