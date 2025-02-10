// src/pages/login.tsx
import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@/utils/supabase/useSupabaseClient';
import Logo from '@/components/ui/Logo';

export default function Login() {
  const supabase = useSupabaseClient();
  const [redirectTo, setRedirectTo] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setRedirectTo(window.location.origin + '/');
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Attempting sign in with:', { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Sign in response:', { data, error });

      if (error) {
        setMessage(`Error: ${error.message}`);
        console.error('Sign in error details:', error);
      } else {
        window.location.href = redirectTo;
      }
    } catch (err) {
      console.error('Unexpected error during sign in:', err);
      setMessage(`Unexpected error: ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Attempting sign up with:', { email });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo
        }
      });

      console.log('Sign up response:', { data, error });

      if (error) {
        setMessage(`Error: ${error.message}`);
        console.error('Sign up error details:', error);
      } else {
        setMessage('Sign-up successful! Check your email for a confirmation link.');
      }
    } catch (err) {
      console.error('Unexpected error during sign up:', err);
      setMessage(`Unexpected error: ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-camherlightyellow p-4">
      <div className="mb-8">
        <Logo size={200} />
      </div>
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <form onSubmit={handleSignIn} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded"
            required
            minLength={6}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-camhergreen hover:bg-green-400 text-white rounded"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
        <div className="mt-4">
          <button
            onClick={handleSignUp}
            disabled={isLoading}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </button>
        </div>
        {message && (
          <div className={`mt-4 p-4 rounded ${
            message.toLowerCase().includes('error') 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}