"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthMeResponse =
  | { authenticated: false }
  | { authenticated: true; email: string; role: string };

export default function AdminDashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<AuthMeResponse>({ authenticated: false });
  type AdminDashboardData = {
    total_users?: number;
    total_adolescents?: number;
    pending_counselor_applications?: number;
    total_high_risk_adolescents?: number;
  };
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const m = (await res.json()) as AuthMeResponse;
      setMe(m);
      if (!("authenticated" in m) || !m.authenticated) {
        router.replace("/login");
        return;
      }
      if (m.role !== "admin") {
        router.replace(m.role === "counselor" ? "/counselor/dashboard" : "/login");
        return;
      }

      const dash = await fetch("/api/proxy/dashboard/admin");
      const dashData = await dash.json().catch(() => ({}));
      if (!dash.ok) {
        setError(dashData?.detail || "Failed to load admin dashboard");
        return;
      }
      setData(dashData);
    })();
  }, [router]);

  return (
    <div className="flex flex-1 bg-zinc-50">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">Admin Dashboard</h1>
            {"authenticated" in me && me.authenticated && (
              <p className="mt-1 text-sm text-zinc-600">{me.email}</p>
            )}
          </div>
          <form
            action={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }}
          >
            <button className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50">
              Sign out
            </button>
          </form>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="text-sm text-zinc-600">Total users</div>
            <div className="mt-2 text-2xl font-semibold text-zinc-900">
              {data?.total_users ?? "—"}
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="text-sm text-zinc-600">Total adolescents</div>
            <div className="mt-2 text-2xl font-semibold text-zinc-900">
              {data?.total_adolescents ?? "—"}
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="text-sm text-zinc-600">Pending counselor applications</div>
            <div className="mt-2 text-2xl font-semibold text-zinc-900">
              {data?.pending_counselor_applications ?? "—"}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="text-sm font-medium text-zinc-900">Risk snapshot</div>
          <div className="mt-2 text-sm text-zinc-600">
            High-risk adolescents (last 7 days):{" "}
            <span className="font-medium text-zinc-900">
              {data?.total_high_risk_adolescents ?? "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

