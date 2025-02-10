// src/utils/supabase/useSession.ts
import { useEffect, useState } from 'react';
// Import the browser client from @supabase/ssr
import { createBrowserClient } from '@supabase/ssr';
// Import the Session type from supabase-js to properly type our state
import type { Session } from '@supabase/supabase-js';

/**
 * Custom hook to fetch and return the current session.
 * It creates a Supabase browser client and calls getSession on mount.
 */
export function useSession() {
  // Initialize state with type Session | null
  const [session, setSession] = useState<Session | null>(null);

  // Create a browser client instance
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchSession() {
      // Retrieve the current session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session); // Now session is Session | null
    }
    fetchSession();
  }, [supabase]);

  return session;
}
