import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request });

  let user = null;
  try {
    const supabase = await createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {},
        },
      },
    );
    const { data: { user: userData }, error } = await supabase.auth.getUser();
    if (!error && userData) {
      user = userData;
    }
  } catch {}

  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname.startsWith("/admin/login");
  const isAdminRoute = pathname.startsWith("/admin");

  if (isLoginPage) {
    return supabaseResponse;
  }

  if (isAdminRoute && !user) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/admin" && user) {
    const dashboardUrl = new URL("/admin/offers", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
