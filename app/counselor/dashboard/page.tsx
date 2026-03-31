"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type AuthMeResponse =
  | { authenticated: false }
  | { authenticated: true; email: string; role: string; _id: string };

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

type Alert = {
  _id: string;
  adolescent_id: string;
  adolescent_email: string;
  risk_score: number;
  risk_level: string;
  triggered_by_journal_id?: string;
  status: "unresolved" | "resolved";
  created_at: string;
};

type TabNode = "overview" | "alerts";

export default function CounselorDashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<AuthMeResponse>({ authenticated: false });
  const [data, setData] = useState<CounselorDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabNode>("overview");

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

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

      fetchDashboard();
    })();
  }, [router]);

  async function fetchDashboard() {
    const dash = await fetch("/api/proxy/dashboard/counselor");
    const dashData = await dash.json().catch(() => ({}));
    if (dash.ok) {
      setData(dashData);
    } else {
      setError(dashData?.detail || "Failed to load dashboard");
    }
  }

  useEffect(() => {
    if (activeTab === "alerts" && alerts.length === 0) {
      loadAlerts();
    }
  }, [activeTab]);

  async function loadAlerts() {
    setAlertsLoading(true);
    try {
      // Backend automatically checks assignments for the counselor
      const res = await fetch("/api/proxy/backend/alerts/unresolved");
      if (res.ok) {
        const data = await res.json();
        setAlerts(data || []);
      }
    } finally {
      setAlertsLoading(false);
    }
  }

  async function handleResolve(alertId: string) {
    setResolvingId(alertId);
    try {
      const res = await fetch(`/api/proxy/backend/alerts/resolve/${alertId}`, {
        method: "PUT",
      });
      if (res.ok) {
        await loadAlerts();
        fetchDashboard();
      } else {
        const d = await res.json().catch(() => ({}));
        alert(d?.detail || "Failed to resolve alert");
      }
    } finally {
      setResolvingId(null);
    }
  }

  if (!me.authenticated) {
    return <div className="p-10 text-center text-zinc-500">Loading workspace...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f7fb]">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white shadow-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-inner">
               <span className="text-white font-bold text-lg">C</span>
             </div>
             <div>
               <h1 className="text-xl font-bold text-zinc-900 leading-none">Counselor Portal</h1>
               <p className="text-xs font-medium text-zinc-500 mt-1">{me.email}</p>
             </div>
          </div>
          <form
            action={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }}
          >
            <button className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:text-red-600">
              Sign out
            </button>
          </form>
        </div>
        
        {/* TABS */}
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="flex gap-6 border-b border-zinc-200 text-sm font-medium">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-3 transition-colors ${activeTab === "overview" ? "border-b-2 border-indigo-600 text-indigo-700" : "text-zinc-500 hover:text-zinc-700"}`}
            >
              Overview & Caseload
            </button>
            <button
              onClick={() => setActiveTab("alerts")}
              className={`pb-3 transition-colors ${activeTab === "alerts" ? "border-b-2 border-indigo-600 text-indigo-700" : "text-zinc-500 hover:text-zinc-700"}`}
            >
              Unresolved Alerts
              {data?.risk_alerts_count ? (
                <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600 font-bold">
                  {data.risk_alerts_count}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-medium text-zinc-500">Assigned adolescents</div>
                <div className="mt-2 text-3xl font-bold text-indigo-600">
                  {data?.assigned_adolescents?.length ?? "—"}
                </div>
              </div>
              <div className="rounded-2xl border border-red-100 bg-red-50 p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                  </span>
                  <div className="text-sm font-medium text-red-800">Risk alerts (unresolved)</div>
                </div>
                <div className="mt-2 text-3xl font-bold text-red-700">
                  {data?.risk_alerts_count ?? "—"}
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-medium text-zinc-500">Negative journal frequency</div>
                <div className="mt-2 text-3xl font-bold text-zinc-900">
                  {data?.negative_journal_frequency ?? "—"}
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-zinc-200 bg-zinc-50 px-6 py-4">
                <h3 className="text-lg font-bold text-zinc-900">My Caseload</h3>
                <p className="text-sm text-zinc-500">Adolescents explicitly assigned to you. Click to review case history.</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm text-zinc-600">
                  <thead className="bg-white border-b border-zinc-200">
                    <tr>
                      <th className="px-6 py-3 font-medium">Name</th>
                      <th className="px-6 py-3 font-medium">Email</th>
                      <th className="px-6 py-3 font-medium">Last Activity</th>
                      <th className="px-6 py-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {(data?.assigned_adolescents ?? []).map((a) => (
                      <tr key={a.adolescent_id || a.email} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-zinc-900">{a.full_name}</td>
                        <td className="px-6 py-4">{a.email}</td>
                        <td className="px-6 py-4">
                          {a.last_activity ? new Date(a.last_activity).toLocaleDateString() : "No recent activity"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link 
                            href={`/counselor/adolescent/${a.adolescent_id}`}
                            className="text-indigo-600 font-semibold hover:underline"
                          >
                            Review Case &rarr;
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {!data?.assigned_adolescents?.length && (
                      <tr className="border-t">
                        <td className="px-6 py-8 text-center text-zinc-500" colSpan={4}>
                          You have no assigned adolescents yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── ALERTS TAB ── */}
        {activeTab === "alerts" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="rounded-2xl border border-red-100 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-red-100 bg-red-50/50 px-6 py-4 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-zinc-900">Unresolved Risk Alerts</h2>
                  <p className="text-sm text-zinc-600">Prioritize these based on risk level and score.</p>
                </div>
                <button 
                  disabled={alertsLoading} 
                  onClick={loadAlerts}
                  className="text-sm font-medium text-indigo-600 hover:underline disabled:opacity-50"
                >
                  {alertsLoading ? "Refreshing..." : "Refresh Queue"}
                </button>
              </div>
              
              <div className="p-0">
                {alerts.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500">
                     {alertsLoading ? "Loading alerts..." : "No unresolved alerts in your queue! Good job."}
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-100">
                    {alerts.map((alert) => (
                      <div key={alert._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 hover:bg-zinc-50 transition">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              alert.risk_level === 'high' ? 'bg-red-100 text-red-800 border border-red-200' :
                              alert.risk_level === 'medium' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                              'bg-zinc-100 text-zinc-800 border border-zinc-200'
                            }`}>
                              {alert.risk_level.toUpperCase()}
                            </span>
                            <span className="text-sm font-medium text-zinc-900 border border-zinc-200 bg-white px-2 py-0.5 rounded-full">
                              Score: {(alert.risk_score * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-zinc-600">
                            Adolescent: <span className="font-semibold text-zinc-900">{alert.adolescent_email}</span>
                          </div>
                          <div className="text-xs text-zinc-400 mt-1">
                            Triggered at: {new Date(alert.created_at).toLocaleString()}
                          </div>
                        </div>

                        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                          {alert.triggered_by_journal_id && (
                            <Link 
                              href={`/counselor/adolescent/${alert.adolescent_id}`}
                              className="text-sm font-semibold text-indigo-600 border border-indigo-200 bg-indigo-50 px-4 py-2 rounded-xl text-center hover:bg-indigo-100 transition"
                            >
                              View Case
                            </Link>
                          )}
                          <button
                            disabled={resolvingId === alert._id}
                            onClick={() => handleResolve(alert._id)}
                            className="text-sm font-semibold text-white bg-zinc-900 px-4 py-2 rounded-xl text-center hover:bg-zinc-800 transition disabled:opacity-50"
                          >
                            Mark Resolved
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
