import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    return NextResponse.json(
      { detail: "Missing NEXT_PUBLIC_API_BASE_URL" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(`${baseUrl}/auth/verify-reset-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: body.email, otp: body.otp }),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { detail: "Backend temporarily unavailable. Please try again." },
      { status: 503 },
    );
  }
}
