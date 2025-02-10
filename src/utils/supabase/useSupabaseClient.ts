// src/utils/supabase/useSupabaseClient.tsx
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

/**
 * Custom hook to initialize the Supabase client on the browser.
 * This client is created only once.
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
