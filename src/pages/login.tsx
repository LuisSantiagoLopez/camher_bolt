// src/pages/login.tsx
import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@/utils/supabase/useSupabaseClient';
import Logo from '@/components/ui/Logo';

/**
 * A simple login page that implements email/password authentication.
 * You can later extend this to support OAuth as needed.
 */
export default function Login() {
  const supabase = useSupabaseClient();
  const [redirectTo, setRedirectTo] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Set redirect URL on the client side
    setRedirectTo(window.location.origin + '/');
  }, []);

  // Handle sign-in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      // Redirect if sign in successful (you may want to use router.push)
      window.location.href = redirectTo;
    }
    setIsLoading(false);
  };

  // Handle sign-up (if desired)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Sign-up successful! Check your email for a confirmation link.');
    }
    setIsLoading(false);
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
          <div className="mt-4 p-4 rounded bg-gray-100 text-gray-800">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
