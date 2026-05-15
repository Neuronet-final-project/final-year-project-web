import { NextResponse } from "next/server";

import { fetchWithRetry } from "@/lib/fetchWithRetry";

export async function POST(req: Request) {
  const body = await req.json();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    return NextResponse.json(
      { detail: "Missing NEXT_PUBLIC_API_BASE_URL" },
      { status: 500 },
    );
  }

  let res: Response;
  try {
    res = await fetchWithRetry(
      `${baseUrl}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
      20000,
      1,
    );
  } catch {
    return NextResponse.json(
      {
        detail:
          "Backend temporarily unavailable or waking up. Please retry in a few seconds.",
      },
      { status: 503 },
    );
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  // Role Restriction Check
  const requiredRole = body.requiredRole;
  if (requiredRole && data.role !== requiredRole) {
    return NextResponse.json(
      { detail: `Forbidden: This portal is only for ${requiredRole}s.` },
      { status: 403 },
    );
  }

  const token = data?.access_token;
  const refreshToken = data?.refresh_token;

  if (!token) {
    return NextResponse.json(
      { detail: "Login succeeded but token missing" },
      { status: 500 },
    );
  }

  const accessExpiresIn = Math.max(
    60,
    Number.isFinite(Number(data?.access_expires_in))
      ? Number(data.access_expires_in)
      : 60 * 60,
  );
  const refreshExpiresIn =
    refreshToken && Number.isFinite(Number(data?.refresh_expires_in))
      ? Math.max(60, Number(data.refresh_expires_in))
      : refreshToken
        ? 7 * 24 * 60 * 60
        : 0;

  const response = NextResponse.json(
    { email: data.email, role: data.role },
    { status: 200 },
  );

  response.cookies.set("access_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: accessExpiresIn,
  });

  if (refreshToken) {
    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: refreshExpiresIn,
    });
  }

  return response;
}

