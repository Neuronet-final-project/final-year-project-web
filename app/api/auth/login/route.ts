import { NextResponse } from "next/server";

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  timeoutMs = 20000,
  retries = 1,
): Promise<Response> {
  let lastErr: unknown;
  for (let i = 0; i <= retries; i++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { ...init, signal: controller.signal });
    } catch (err) {
      lastErr = err;
      if (i < retries) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr;
}

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
  if (!token) {
    return NextResponse.json(
      { detail: "Login succeeded but token missing" },
      { status: 500 },
    );
  }

  const response = NextResponse.json(
    { email: data.email, role: data.role },
    { status: 200 },
  );

  response.cookies.set("access_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60, // 1h
  });

  return response;
}

