import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const realm = "Naman Studio Admin";
const sessionCookie = "naman_admin_session";

function credentials() {
  const user = process.env.ADMIN_USER ?? "Naman Studio";
  const password = process.env.ADMIN_PASSWORD ?? "Naman Studio";
  return { user, password, token: btoa(`${user}:${password}`) };
}

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${realm}", charset="UTF-8"`,
    },
  });
}

export function middleware(request: NextRequest) {
  const { token } = credentials();
  const cookie = request.cookies.get(sessionCookie)?.value;
  if (cookie === token) return NextResponse.next();

  const header = request.headers.get("authorization");
  if (header === `Basic ${token}`) {
    const response = NextResponse.next();
    response.cookies.set(sessionCookie, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
    return response;
  }

  return unauthorized();
}

export const config = {
  matcher: ["/admin/:path*", "/api/content/:path*"],
};
