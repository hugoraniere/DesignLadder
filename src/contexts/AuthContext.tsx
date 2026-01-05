import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    console.log('[AuthContext] signUp iniciado para:', email);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + '/#app',
        data: {
          full_name: fullName,
        },
      },
    });

    console.log('[AuthContext] signUp resposta:', {
      hasUser: !!data.user,
      hasSession: !!data.session,
      error: error?.message
    });

    if (!error && data.user) {
      console.log('[AuthContext] Usuário criado:', data.user.id);
      if (data.session) {
        console.log('[AuthContext] Sessão criada, setando estado...');
        setUser(data.user);
        setSession(data.session);
      } else {
        console.warn('[AuthContext] Usuário criado mas sem sessão - confirmação de email pode estar habilitada');
      }
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('[AuthContext] signIn iniciado para:', email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('[AuthContext] signIn resposta:', {
      hasUser: !!data.user,
      hasSession: !!data.session,
      error: error?.message
    });

    if (!error && data.session) {
      console.log('[AuthContext] Login bem-sucedido!');
    }

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
