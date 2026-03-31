"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthMeResponse =
  | { authenticated: false }
  | { authenticated: true; email: string; role: string };

export default function CounselorDashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<AuthMeResponse>({ authenticated: false });
  type AssignedAdolescentRow = {
    adolescent_id?: string;
    full_name?: string;
    email?: string;
    last_activity?: string;
  };
  type CounselorDashboardData = {
    assigned_adolescents?: AssignedAdolescentRow[];
    risk_alerts_count?: number;
    negative_journal_frequency?: number;
  };
  const [data, setData] = useState<CounselorDashboardData | null>(null);
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
      if (m.role !== "counselor") {
        router.replace(m.role === "admin" ? "/admin/dashboard" : "/login");
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseUrl) {
        setError("Missing NEXT_PUBLIC_API_BASE_URL");
        return;
      }

      // Call backend directly; auth is via JWT cookie only for /api/auth/* routes.
      // For now, we load dashboard using the token already stored server-side.
      const dash = await fetch("/api/proxy/dashboard/counselor");
      const dashData = await dash.json().catch(() => ({}));
      if (!dash.ok) {
        setError(dashData?.detail || "Failed to load dashboard");
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
            <h1 className="text-2xl font-semibold text-zinc-900">
              Counselor Dashboard
            </h1>
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
            <div className="text-sm text-zinc-600">Assigned adolescents</div>
            <div className="mt-2 text-2xl font-semibold text-zinc-900">
              {data?.assigned_adolescents?.length ?? "—"}
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="text-sm text-zinc-600">Risk alerts (window)</div>
            <div className="mt-2 text-2xl font-semibold text-zinc-900">
              {data?.risk_alerts_count ?? "—"}
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="text-sm text-zinc-600">Negative journals</div>
            <div className="mt-2 text-2xl font-semibold text-zinc-900">
              {data?.negative_journal_frequency ?? "—"}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="text-sm font-medium text-zinc-900">
            Assigned adolescents
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-zinc-600">
                <tr>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Last activity</th>
                </tr>
              </thead>
              <tbody className="text-zinc-900">
                {(data?.assigned_adolescents ?? []).map((a) => (
                  <tr key={a.adolescent_id || a.email} className="border-t">
                    <td className="py-2 pr-4">{a.full_name}</td>
                    <td className="py-2 pr-4">{a.email}</td>
                    <td className="py-2 pr-4">
                      {a.last_activity ? String(a.last_activity) : "—"}
                    </td>
                  </tr>
                ))}
                {!data?.assigned_adolescents?.length && (
                  <tr className="border-t">
                    <td className="py-3 text-zinc-600" colSpan={3}>
                      No assignments yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

