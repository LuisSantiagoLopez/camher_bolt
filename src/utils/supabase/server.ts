// src/utils/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

/**
 * Creates a Supabase server client with proper cookie handling.
 * Uses Next.js's cookies() API with getAll() and setAll().
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Retrieves all cookies from the request.
        getAll() {
          return cookieStore.getAll();
        },
        // Sets cookies by passing an object to cookieStore.set().
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Spread options into a single object as required by Next.js's cookies API.
            cookieStore.set({ name, value, ...options });
          });
        },
      },
    }
  );
}
