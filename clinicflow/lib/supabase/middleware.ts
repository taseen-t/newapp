import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/database.types";

// Paths a signed-out visitor is allowed to see. "/" (marketing landing) is
// handled separately below so it stays public for everyone.
const PUBLIC_PREFIXES = ["/login", "/signup", "/auth", "/forgot-password"];

// Auth pages a signed-in user should be bounced away from (→ /dashboard).
const AUTH_PAGES = ["/login", "/signup", "/forgot-password"];

function matches(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

// Public for signed-out visitors: the landing page plus the auth/callback flow.
function isPublic(pathname: string) {
  return pathname === "/" || matches(pathname, PUBLIC_PREFIXES);
}

/**
 * Refreshes the Supabase auth session on every request and enforces the
 * top-level auth gate (signed-in vs. not). The "no clinic yet → /onboarding"
 * check lives in the protected (app) layout, not here, to avoid a DB round
 * trip on every request.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  let user = null;
  try {
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch {
    // Supabase unreachable / misconfigured — treat as signed out.
    user = null;
  }

  const { pathname } = request.nextUrl;

  // Signed-out visitor hitting a protected page → send to login (remember where).
  if (!user && !isPublic(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Signed-in user landing on an auth page → straight to the dashboard.
  // (The marketing landing "/" is intentionally NOT bounced, so a logged-in
  // user can still view it.)
  if (user && matches(pathname, AUTH_PAGES)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
