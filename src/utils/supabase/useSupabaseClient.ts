// src/utils/supabase/useSupabaseClient.tsx
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

/**
 * Custom hook to initialize the Supabase client on the browser.
 * This hook creates the client only once and returns it.
 */
export function useSupabaseClient() {
  const [client] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );
  return client;
}
