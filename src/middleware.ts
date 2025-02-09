import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { Database } from '@/types/database';

export async function middleware(request: NextRequest) {
  // Initialize a response object that you will update with cookies
  let response = NextResponse.next({ request: { headers: request.headers } });
  
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Set the cookie on the request if needed (depending on your framework)
            // and on the response.
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Get the user session
  const { data: { user } } = await supabase.auth.getUser();

  // Redirect logic: if no user and not on the login page, redirect to /login
  if (!user && request.nextUrl.pathname !== '/login') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
  }
  
  // If user is present and is on /login, redirect to home page
  if (user && request.nextUrl.pathname === '/login') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/';
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    // Exclude static files and images from middleware processing
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
