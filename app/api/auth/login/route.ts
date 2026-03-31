import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    return NextResponse.json(
      { detail: "Missing NEXT_PUBLIC_API_BASE_URL" },
      { status: 500 },
    );
  }

  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
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

