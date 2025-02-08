import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Logo from '@/components/ui/Logo';

export default function Login() {
  const supabase = useSupabaseClient();

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
          localization={{
            variables: {
              sign_in: {
                email_label: 'Correo electrónico',
                password_label: 'Contraseña',
                button_label: 'Iniciar sesión',
              },
              sign_up: {
                email_label: 'Correo electrónico',
                password_label: 'Contraseña',
                button_label: 'Registrarse',
              }
            }
          }}
        />
      </div>
    </div>
  );
}