"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthMeResponse =
  | { authenticated: false }
  | { authenticated: true; email: string; role: string };

type AdminDashboardData = {
  total_users?: number;
  total_adolescents?: number;
  pending_counselor_applications?: number;
  total_high_risk_adolescents?: number;
};

type CounselorApplication = {
  email: string;
  full_name: string;
  qualification: string;
  experience_years: number;
  status: "pending" | "approved" | "rejected";
  created_at?: string;
};

type TabNode = "overview" | "applications" | "assign";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<AuthMeResponse>({ authenticated: false });
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabNode>("overview");

  // Applications state
  const [applications, setApplications] = useState<CounselorApplication[]>([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [processingEmail, setProcessingEmail] = useState<string | null>(null);

  // Assign state
  const [cEmail, setCEmail] = useState("");
  const [aEmail, setAEmail] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignResult, setAssignResult] = useState<{ok: boolean, msg: string} | null>(null);

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

      fetchDashboard();
    })();
  }, [router]);

  async function fetchDashboard() {
    const dash = await fetch("/api/proxy/dashboard/admin");
    const dashData = await dash.json().catch(() => ({}));
    if (dash.ok) {
      setData(dashData);
    } else {
      setError(dashData?.detail || "Failed to load admin dashboard summary.");
    }
  }

  // Fetch applications when tab switches
  useEffect(() => {
    if (activeTab === "applications" && applications.length === 0) {
      loadApplications();
    }
  }, [activeTab]);

  async function loadApplications() {
    setAppsLoading(true);
    try {
      const res = await fetch("/api/proxy/backend/counselor/applications");
      if (res.ok) {
        const data = await res.json();
        setApplications(data || []);
      }
    } finally {
      setAppsLoading(false);
    }
  }

  async function handleApplication(email: string, action: "approve" | "reject") {
    setProcessingEmail(email);
    try {
      const res = await fetch(`/api/proxy/backend/counselor/${action}/${encodeURIComponent(email)}`, {
        method: "POST",
      });
      if (res.ok) {
        // Refresh
        await loadApplications();
        if (action === "approve") fetchDashboard();
      } else {
        const d = await res.json().catch(() => ({}));
        alert(d?.detail || `Failed to ${action} counselor`);
      }
    } finally {
      setProcessingEmail(null);
    }
  }

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    setAssignLoading(true);
    setAssignResult(null);
    try {
      const res = await fetch("/api/proxy/backend/counselor/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ counselor_email: cEmail, adolescent_email: aEmail }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok) {
        setAssignResult({ ok: true, msg: "Counselor assigned successfully." });
        setCEmail("");
        setAEmail("");
      } else {
        setAssignResult({ ok: false, msg: d?.detail || "Failed to assign counselor." });
      }
    } finally {
      setAssignLoading(false);
    }
  }

  if (!me.authenticated) {
    return <div className="p-10 text-center text-zinc-500">Loading workspace...</div>;
  }

  return (
    <div className="flex flex-1 flex-col bg-[#f4f7fb]">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white shadow-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 shadow-inner">
               <span className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_10px_cyan]" />
             </div>
             <div>
               <h1 className="text-xl font-bold text-zinc-900 leading-none">Admin Workspace</h1>
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
              className={`pb-3 transition-colors ${activeTab === "overview" ? "border-b-2 border-zinc-900 text-zinc-900" : "text-zinc-500 hover:text-zinc-700"}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`pb-3 transition-colors ${activeTab === "applications" ? "border-b-2 border-zinc-900 text-zinc-900" : "text-zinc-500 hover:text-zinc-700"}`}
            >
              Counselor Applications
              {data?.pending_counselor_applications ? (
                <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600">
                  {data.pending_counselor_applications}
                </span>
              ) : null}
            </button>
            <button
              onClick={() => setActiveTab("assign")}
              className={`pb-3 transition-colors ${activeTab === "assign" ? "border-b-2 border-zinc-900 text-zinc-900" : "text-zinc-500 hover:text-zinc-700"}`}
            >
              Assignments
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-medium text-zinc-500">Total Users</div>
                <div className="mt-2 text-3xl font-bold text-zinc-900">{data?.total_users ?? "—"}</div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-medium text-zinc-500">Adolescents</div>
                <div className="mt-2 text-3xl font-bold text-blue-600">{data?.total_adolescents ?? "—"}</div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-medium text-zinc-500">Pending Counselors</div>
                <div className="mt-2 text-3xl font-bold text-orange-600">{data?.pending_counselor_applications ?? "—"}</div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-medium text-zinc-500">High Risk (7 days)</div>
                <div className="mt-2 text-3xl font-bold text-red-600">{data?.total_high_risk_adolescents ?? "—"}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-zinc-900">System Status</h3>
              <p className="mt-2 text-sm text-zinc-600">
                The AI sentiment engine and alert system are fully operational. Access management controls are active.
              </p>
            </div>
          </div>
        )}

        {/* ── COUNSELOR APPLICATIONS TAB ── */}
        {activeTab === "applications" && (
          <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="border-b border-zinc-200 bg-zinc-50 px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-bold text-zinc-900">Pending & History</h2>
              <button 
                disabled={appsLoading} 
                onClick={loadApplications}
                className="text-sm font-medium text-[#4F46E5] hover:underline disabled:opacity-50"
              >
                {appsLoading ? "Refreshing..." : "Refresh list"}
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-600">
                <thead className="bg-white text-zinc-500 border-b border-zinc-200">
                  <tr>
                    <th className="px-6 py-3 font-medium">Applicant</th>
                    <th className="px-6 py-3 font-medium">Qualification</th>
                    <th className="px-6 py-3 font-medium">Exp (Yrs)</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {applications.length === 0 ? (
                     <tr>
                       <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                         {appsLoading ? "Loading applications..." : "No applications found."}
                       </td>
                     </tr>
                  ) : (
                    applications.map((app) => (
                      <tr key={app.email} className="hover:bg-zinc-50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-zinc-900">{app.full_name}</div>
                          <div className="text-xs text-zinc-500">{app.email}</div>
                        </td>
                        <td className="px-6 py-4">{app.qualification}</td>
                        <td className="px-6 py-4">{app.experience_years}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                            app.status === "pending" ? "bg-orange-100 text-orange-800" :
                            app.status === "approved" ? "bg-emerald-100 text-emerald-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {app.status === "pending" ? (
                            <div className="flex justify-end gap-2">
                              <button
                                disabled={processingEmail === app.email}
                                onClick={() => handleApplication(app.email, "approve")}
                                className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                              >
                                Approve
                              </button>
                              <button
                                disabled={processingEmail === app.email}
                                onClick={() => handleApplication(app.email, "reject")}
                                className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-zinc-400">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ASSIGNMENTS TAB ── */}
        {activeTab === "assign" && (
           <div className="max-w-xl mx-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="mb-6">
               <div className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-[#4F46E5] mb-2">
                 CASE MANAGEMENT
               </div>
               <h2 className="text-xl font-bold text-zinc-900">Map Counselor to Adolescent</h2>
               <p className="mt-1 text-sm text-zinc-600">
                 Assign an active counselor to oversee an adolescent's case and view their alerts.
               </p>
             </div>

             <form onSubmit={handleAssign} className="space-y-4">
               <div>
                 <label className="mb-1 block text-sm font-medium text-zinc-900">Counselor Email</label>
                 <input
                   type="email"
                   className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
                   value={cEmail}
                   onChange={(e) => setCEmail(e.target.value)}
                   required
                 />
               </div>
               <div>
                 <label className="mb-1 block text-sm font-medium text-zinc-900">Adolescent Email</label>
                 <input
                   type="email"
                   className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
                   value={aEmail}
                   onChange={(e) => setAEmail(e.target.value)}
                   required
                 />
               </div>

               {assignResult && (
                 <div className={`rounded-xl p-3 text-sm ${assignResult.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                   {assignResult.msg}
                 </div>
               )}

               <button
                 type="submit"
                 disabled={assignLoading}
                 className="w-full rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
               >
                 {assignLoading ? "Assigning..." : "Create Assignment"}
               </button>
             </form>
           </div>
        )}

      </main>
    </div>
  );
}
