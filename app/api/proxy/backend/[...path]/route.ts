import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { fetchWithRetry } from "@/lib/fetchWithRetry";

async function handleProxy(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    return NextResponse.json({ detail: "Missing NEXT_PUBLIC_API_BASE_URL" }, { status: 500 });
  }

  const token = (await cookies()).get("access_token")?.value;


  const resolvedParams = await params;
  const pathString = resolvedParams.path.join("/");
  const url = new URL(req.url);
  const backendUrl = `${baseUrl}/${pathString}${url.search}`;

  const contentType = req.headers.get("Content-Type") || "";
  const isMultipart = contentType.includes("multipart/form-data");

  const init: RequestInit = {
    method: req.method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // For multipart, do NOT set Content-Type — the browser/fetch will set it with boundary
      ...(!isMultipart ? { "Content-Type": contentType || "application/json" } : {}),
    },
  };

  // Next.js requires duplex: 'half' for streaming/POST requests in some edge runtimes
  (init as any).duplex = "half";

  if (req.method !== "GET" && req.method !== "HEAD") {
    if (isMultipart) {
      // Forward the raw body for file uploads — pass through the FormData
      const formData = await req.formData();
      init.body = formData;
    } else {
      const bodyText = await req.text();
      if (bodyText) {
        init.body = bodyText;
      }
    }
  }

  try {
    const res = await fetchWithRetry(backendUrl, init as any, 30000, 1);
    
    // If response is 204 No Content, we can't parse JSON
    if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const resContentType = res.headers.get("Content-Type") || "";
    
    if (resContentType.includes("application/json")) {
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
          "Content-Type": resContentType,
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
