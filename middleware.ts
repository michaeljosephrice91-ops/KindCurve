import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/onboarding", "/pie", "/consistency", "/success", "/dashboard"];
const AUTH_ROUTES = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({
          request: { headers: request.headers },
        });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({
          request: { headers: request.headers },
        });
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  try {
    const { data: { user } } = await supabase.auth.getUser();
    const pathname = request.nextUrl.pathname;

    const isProtected = PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route)
    );
    const isAuthRoute = AUTH_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    if (isProtected && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/signup";
      return NextResponse.redirect(url);
    }

    if (isAuthRoute && user) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding/q1";
      return NextResponse.redirect(url);
    }
  } catch (e) {
    return NextResponse.next();
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
