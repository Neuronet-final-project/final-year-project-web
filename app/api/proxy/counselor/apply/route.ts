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
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    return NextResponse.json(
      { detail: "Missing NEXT_PUBLIC_API_BASE_URL" },
      { status: 500 },
    );
  }

  const body = await req.json();
  let res: Response;
  try {
    res = await fetchWithRetry(
      `${baseUrl}/counselor/apply`,
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
  return NextResponse.json(data, { status: res.status });
}

