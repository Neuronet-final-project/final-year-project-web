import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function fetchWithRetry(url: string, init: RequestInit, timeoutMs = 20000, retries = 1): Promise<Response> {
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

async function handleProxy(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    return NextResponse.json({ detail: "Missing NEXT_PUBLIC_API_BASE_URL" }, { status: 500 });
  }

  const token = (await cookies()).get("access_token")?.value;
  if (!token) {
    return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
  }

  const resolvedParams = await params;
  const pathString = resolvedParams.path.join("/");
  const url = new URL(req.url);
  const backendUrl = `${baseUrl}/${pathString}${url.search}`;

  const init: RequestInit = {
    method: req.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": req.headers.get("Content-Type") || "application/json",
    },
  };

  // Next.js requires duplex: 'half' for streaming/POST requests in some edge runtimes
  (init as any).duplex = "half";

  if (req.method !== "GET" && req.method !== "HEAD") {
    const bodyText = await req.text();
    if (bodyText) {
      init.body = bodyText;
    }
  }

  try {
    const res = await fetchWithRetry(backendUrl, init as any, 20000, 1);
    
    // If response is 204 No Content, we can't parse JSON
    if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const contentType = res.headers.get("Content-Type") || "";
    
    if (contentType.includes("application/json")) {
      const data = await res.text();
      let jsonData = {};
      if (data) {
        try {
          jsonData = JSON.parse(data);
        } catch {
          jsonData = { detail: data };
        }
      }
      return NextResponse.json(jsonData, { status: res.status });
    } else {
      // Handle non-JSON responses (e.g., CSV, images, streams)
      const blob = await res.blob();
      return new NextResponse(blob, {
        status: res.status,
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": res.headers.get("Content-Disposition") || "",
        },
      });
    }
  } catch (err) {
    return NextResponse.json(
      { detail: "Backend temporarily unavailable. Please retry in a few seconds." },
      { status: 503 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
export const PATCH = handleProxy;
