import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import { SelectedToolContextProvider } from '@/context/SelectedToolContext';
import { FlowContextProvider } from '@/context/FlowContext';
import NavBar from '@/components/ui/Layout/NavBar';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <FlowContextProvider>
        <SelectedToolContextProvider>
          <div className="min-h-screen bg-camherlightyellow">
            <NavBar />
            <Component {...pageProps} />
          </div>
        </SelectedToolContextProvider>
      </FlowContextProvider>
    </SessionContextProvider>
  );
}