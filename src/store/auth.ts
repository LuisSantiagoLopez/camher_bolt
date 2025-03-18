import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Profile, UserRole } from '../types';

interface AuthState {
  user: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // After successful sign in, load the user profile
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('No user found after sign in');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) throw profileError;
      if (!profile.is_verified) throw new Error('Usuario no verificado');
      
      set({ user: profile });
    } catch (error: any) {
      // Handle specific error cases
      if (error.message === 'Invalid login credentials') {
        throw new Error('Credenciales inválidas');
      }
      throw error;
    }
  },
  signUp: async (email: string, password: string, role: UserRole) => {
    try {
      // Check if email exists in either profiles or providers
      const [profileCheck, providerCheck] = await Promise.all([
        supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .maybeSingle(),
        supabase
          .from('providers')
          .select('id')
          .eq('email', email)
          .maybeSingle()
      ]);

      if (profileCheck.data || providerCheck.data) {
        throw new Error('Este correo electrónico ya está registrado');
      }

      // Create auth user with selected role
      const { data: { user: authUser }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role
          }
        }
      });

      if (signUpError) throw signUpError;
      if (!authUser) throw new Error('No user data returned from signup');

      // Create profile record with selected role (unverified)
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authUser.id,
          email: email,
          role,
          is_verified: false
        });

      if (profileError) throw profileError;

      // Create verification request
      const { error: verificationError } = await supabase
        .from('verification_requests')
        .insert({
          profile_id: authUser.id,
          role,
          status: 'pending'
        });

      if (verificationError) throw verificationError;

      // If role is provider, create provider record
      if (role === 'proveedor') {
        const { error: providerError } = await supabase
          .from('providers')
          .insert({
            profile_id: authUser.id,
            name: email.split('@')[0], // Temporary name from email
            email: email
          });

        if (providerError) throw providerError;
      }

      throw new Error('Cuenta creada exitosamente. Por favor espera la verificación del administrador.');
    } catch (error: any) {
      // Handle specific error cases
      if (error.message === 'User already registered') {
        throw new Error('Este correo electrónico ya está registrado');
      }
      throw error;
    }
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },
  loadUser: async () => {
    try {
      set({ loading: true });
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        set({ user: null, loading: false });
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) {
        set({ user: null, loading: false });
        return;
      }

      if (!profile.is_verified) {
        set({ user: null, loading: false });
        return;
      }

      set({ user: profile, loading: false });
    } catch (error) {
      console.error('Error loading user:', error);
      set({ user: null, loading: false });
    }
  },
}));