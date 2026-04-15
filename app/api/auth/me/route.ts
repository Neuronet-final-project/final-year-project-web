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

  const token = (await cookies()).get("access_token")?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  let res: Response;
  try {
    res = await fetchWithRetry(
      `${baseUrl}/auth/me`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
      20000,
      1,
    );
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  return NextResponse.json({ authenticated: true, ...data }, { status: 200 });
}

