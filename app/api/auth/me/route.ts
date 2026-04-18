import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { fetchWithRetry } from "@/lib/fetchWithRetry";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    return NextResponse.json(
      { detail: "Missing NEXT_PUBLIC_API_BASE_URL" },
      { status: 500 },
    );
  }

  const cookieStore = await cookies();
  let token = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  const tryMe = async (authToken: string) => {
    try {
      const res = await fetchWithRetry(
        `${baseUrl}/auth/me`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
          cache: "no-store",
        },
        20000,
        1,
      );
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error("fetchWithRetry /auth/me error:", err);
    }
    return null;
  };

  let userData = token ? await tryMe(token) : null;

  // If token was invalid but we have a refresh token, try to refresh
  if (!userData && refreshToken) {
    try {
      const refreshRes = await fetch(`${baseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        const newToken = refreshData.access_token;
        if (newToken) {
          userData = await tryMe(newToken);
          if (userData) {
            const response = NextResponse.json({ authenticated: true, ...userData }, { status: 200 });
            response.cookies.set("access_token", newToken, {
              httpOnly: true,
              sameSite: "lax",
              secure: process.env.NODE_ENV === "production",
              path: "/",
              maxAge: 60 * 60, // 1h
            });
            return response;
          }
        }
      } else {
        // Refresh failed, clear tokens
        const response = NextResponse.json({ authenticated: false }, { status: 200 });
        response.cookies.set("access_token", "", { maxAge: 0, path: "/" });
        response.cookies.set("refresh_token", "", { maxAge: 0, path: "/" });
        return response;
      }
    } catch (refreshErr) {
      console.error("Auth me refresh error:", refreshErr);
    }
  }

  if (!userData) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  return NextResponse.json({ authenticated: true, ...userData }, { status: 200 });
}

