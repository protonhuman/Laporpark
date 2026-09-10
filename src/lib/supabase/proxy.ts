import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Creates a Supabase client suitable for the Next.js 16 proxy (middleware) layer.
 *
 * This wires getAll/setAll to the request + response cookies so that
 * token refresh results are propagated back to the browser.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in proxy");
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Set cookies on the request (for downstream Server Components)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );

          // Recreate the response so it carries the updated request headers
          supabaseResponse = NextResponse.next({ request });

          // Set cookies on the response (for the browser)
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Call getUser() to trigger a token refresh if needed.
  // Wrap in try-catch so invalid/revoked legacy cookies redirect cleanly to login instead of 500 error
  let user = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (!error && data?.user) {
      user = data.user;
    }
  } catch (authErr) {
    console.warn("Auth session error in proxy, redirecting to login:", authErr);
    user = null;
  }

  // Redirect unauthenticated users to login (skip root/login/auth/api paths)
  const { pathname } = request.nextUrl;
  const isPublicPath =
    pathname === "/" ||
    pathname === "/login" ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/api/");

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If user is logged in and tries to access /login, redirect to dashboard
  if (user && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
