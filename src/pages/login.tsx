import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Logo from '@/components/ui/Logo';
import { useEffect, useState } from 'react';

export default function Login() {
  const supabase = useSupabaseClient();
  const [redirectTo, setRedirectTo] = useState<string>('');

  useEffect(() => {
    // Set redirectTo only on client side
    setRedirectTo(`${window.location.origin}/`);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-camherlightyellow p-4">
      <div className="mb-8">
        <Logo size={200} />
      </div>
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#FF9C20',
                  brandAccent: '#FFBE62',
                }
              }
            }
          }}
          providers={[]}
          redirectTo={redirectTo}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Correo electrónico',
                password_label: 'Contraseña',
                button_label: 'Iniciar sesión',
                email_input_placeholder: 'tu@email.com',
                password_input_placeholder: 'Tu contraseña',
                loading_button_label: 'Iniciando sesión...',
                link_text: '¿Ya tienes una cuenta? Inicia sesión'
              },
              sign_up: {
                email_label: 'Correo electrónico',
                password_label: 'Contraseña',
                button_label: 'Registrarse',
                email_input_placeholder: 'tu@email.com', 
                password_input_placeholder: 'Tu contraseña',
                loading_button_label: 'Registrando...',
                link_text: '¿No tienes una cuenta? Regístrate'
              }
            }
          }}
          view="sign_in"
        />
      </div>
    </div>
  );
}