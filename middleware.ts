import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/api")) {
    const response = NextResponse.next();
    
    const accessToken = request.cookies.get("accessToken")?.value;
    if (accessToken) {
      response.headers.set("Authorization", `Bearer ${accessToken}`);
    }
    
    const tenantId = request.cookies.get("currentTenantId")?.value;
    if (tenantId) {
      response.headers.set("x-tenant-id", tenantId);
    }
    
    response.headers.set("Access-Control-Allow-Origin", request.headers.get("origin") || "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-tenant-id");
    response.headers.set("Access-Control-Allow-Credentials", "true");
    
    return response;
  }

  const accessToken = request.cookies.get("accessToken")?.value
  const tenantId = request.cookies.get("currentTenantId")?.value

  const publicPaths = ["/login"]

  const authOnlyPaths = ["/select-tenant"]

  if (!publicPaths.includes(pathname) && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (pathname === "/login" && accessToken) {
    if (!tenantId) {
      return NextResponse.redirect(new URL("/select-tenant", request.url))
    }
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (pathname.startsWith("/dashboard")) {
    if (!tenantId) {
      return NextResponse.redirect(new URL("/select-tenant", request.url))
    }
  }

  if (pathname === "/select-tenant" && tenantId) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}

