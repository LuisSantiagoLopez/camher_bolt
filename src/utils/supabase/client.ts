// Before (possibly using auth-helpers)
// import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

// After:
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
