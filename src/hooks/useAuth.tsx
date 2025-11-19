import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (newPassword: string) => Promise<{ error: any }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state change:', event, 'User:', session?.user?.email || 'null');
      
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    // Check for existing session and validate it
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Session retrieval error:', error);
          // Clear any stale session data
          setSession(null);
          setUser(null);
        } else if (session) {
          console.log('✅ Valid session found:', session.user?.email);
          setSession(session);
          setUser(session.user);
        } else {
          console.log('ℹ️ No active session');
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        setSession(null);
        setUser(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/auth`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔑 Attempting sign in for:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('❌ Sign in error:', error);
    } else {
      console.log('✅ Sign in successful:', data.user?.email);
    }
    
    return { error };
  };

  const signOut = async () => {
    console.log('👋 Signing out...');
    
    // Clear state immediately for UI responsiveness
    setSession(null);
    setUser(null);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // Ignore "Auth session missing" errors as we've already cleared the state
        if (error.message === 'Auth session missing!') {
          console.log('ℹ️ Session already cleared');
        } else {
          console.error('❌ Sign out error:', error);
        }
      } else {
        console.log('✅ Signed out successfully');
      }
    } catch (error: any) {
      // Handle any unexpected errors
      if (error?.message !== 'Auth session missing!') {
        console.error('❌ Sign out error:', error);
      }
    }
    
    // Ensure localStorage is cleared
    try {
      localStorage.removeItem('supabase.auth.token');
    } catch (e) {
      console.error('❌ LocalStorage clear error:', e);
    }
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/reset-password`;
    
    console.log('🔐 Password reset requested for:', email);
    console.log('🔗 Redirect URL being sent:', redirectUrl);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    
    if (error) {
      console.error('❌ Password reset error:', error);
    } else {
      console.log('✅ Password reset email sent successfully');
    }
    
    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (!error) {
      // Sign out to clear the recovery session
      await supabase.auth.signOut();
    }
    
    return { error };
  };

  return (
    <AuthContext.Provider value={{ user, session, signUp, signIn, signOut, resetPassword, updatePassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
