// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { SessionContextProvider } from '@/context/SessionContext'; // Our new session context provider
import { FlowContextProvider } from '@/context/FlowContext';
import { SelectedToolContextProvider } from '@/context/SelectedToolContext';
import NavBar from '@/components/ui/Layout/NavBar';

/**
 * Main application component that wraps the app with:
 * - SessionContextProvider: Provides the current Supabase session.
 * - FlowContextProvider: Manages user role and related info.
 * - SelectedToolContextProvider: Manages selected tools in the app.
 */
export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionContextProvider>
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
