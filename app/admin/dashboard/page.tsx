"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type AuthMeResponse =
  | { authenticated: false }
  | { authenticated: true; email: string; role: string; _id: string };

type AdminDashboardData = {
  total_users: number;
  total_adolescents: number;
  role_counts: Record<string, number>;
  pending_counselor_applications: number;
  total_journals_count: number;
  total_alerts: number;
  total_high_risk_adolescents: number;
  system_wide_mood_distribution: { mood: string; count: number }[];
  high_risk_clusters: { counselor: string; high_risk_count: number }[];
};

type UserAccount = {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  created_at?: string;
  is_active: boolean;
};

type CounselorApplication = {
  email: string;
  full_name: string;
  qualification: string;
  experience_years: number;
  status: "pending" | "approved" | "rejected";
  created_at?: string;
};

type AuditLog = {
  timestamp: string;
  actor_role: string;
  action_type: string;
  resource_type: string;
  metadata?: any;
};

type TabNode = "overview" | "users" | "applications" | "assign" | "audit" | "content";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<AuthMeResponse>({ authenticated: false });
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabNode>("overview");

  // User Management State
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [usersLoading, setUsersLoading] = useState(false);

  // Applications State
  const [applications, setApplications] = useState<CounselorApplication[]>([]);
  const [appsLoading, setAppsLoading] = useState(false);

  // Assignments State
  const [cEmail, setCEmail] = useState("");
  const [aEmail, setAEmail] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignResult, setAssignResult] = useState<{ok: boolean, msg: string} | null>(null);

  // Audit State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
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
        await fetchDashboard();
      } catch (err) {
        setError("Failed to authenticate session.");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  async function fetchDashboard() {
    const res = await fetch("/api/proxy/dashboard/admin");
    if (res.ok) {
      const d = await res.json();
      setData(d);
    }
  }

  // Effect to load tab-specific data
  useEffect(() => {
    if (activeTab === "users") loadUsers();
    if (activeTab === "applications") loadApplications();
    if (activeTab === "audit") loadAuditLogs();
  }, [activeTab]);

  async function loadUsers() {
    setUsersLoading(true);
    let url = "/api/proxy/backend/admin/users";
    const params = new URLSearchParams();
    if (userRoleFilter) params.append("role", userRoleFilter);
    if (userSearch) params.append("search", userSearch);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url);
    if (res.ok) {
      setUsers(await res.json());
    }
    setUsersLoading(false);
  }

  async function loadApplications() {
    setAppsLoading(true);
    const res = await fetch("/api/proxy/backend/counselor/applications");
    if (res.ok) setApplications(await res.json());
    setAppsLoading(false);
  }

  async function loadAuditLogs() {
    setAuditLoading(true);
    const res = await fetch("/api/proxy/backend/audit/logs");
    if (res.ok) setAuditLogs(await res.json());
    setAuditLoading(false);
  }

  async function handleToggleUserStatus(email: string, currentStatus: boolean) {
    const res = await fetch(`/api/proxy/backend/admin/users/${encodeURIComponent(email)}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !currentStatus })
    });
    if (res.ok) loadUsers();
  }

  async function handleApplication(email: string, action: "approve" | "reject") {
    const res = await fetch(`/api/proxy/backend/counselor/${action}/${encodeURIComponent(email)}`, { method: "POST" });
    if (res.ok) {
      loadApplications();
      fetchDashboard();
    }
  }

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    setAssignLoading(true);
    setAssignResult(null);
    const res = await fetch("/api/proxy/backend/counselor/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ counselor_email: cEmail, adolescent_email: aEmail }),
    });
    if (res.ok) {
      setAssignResult({ ok: true, msg: "Case assigned successfully." });
      setCEmail(""); setAEmail("");
      fetchDashboard();
    } else {
      const d = await res.json().catch(() => ({}));
      setAssignResult({ ok: false, msg: d?.detail || "Assignment failed." });
    }
    setAssignLoading(false);
  }

  if (loading || !me.authenticated) {
    return <div className="flex h-screen items-center justify-center bg-slate-50 text-zinc-500 font-medium">Initializing Admin Workspace...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/30 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-100/30 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-72 shrink-0 border-r border-zinc-200 bg-white/70 backdrop-blur-xl flex flex-col z-40">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-700 p-0.5 shadow-lg">
               <div className="h-full w-full rounded-[10px] bg-zinc-900 flex items-center justify-center">
                 <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
               </div>
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-zinc-900 leading-none">NEURONET</h2>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1 block">Central Admin</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: "overview", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
              { id: "users", label: "User Management", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
              { id: "applications", label: "Counselors", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", badge: data?.pending_counselor_applications },
              { id: "assign", label: "Case Assignments", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" },
              { id: "audit", label: "Audit Vault", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              { id: "content", label: "Content Mgmt", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabNode)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 group ${
                  activeTab === item.id 
                    ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-200' 
                    : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className={`h-5 w-5 transition-colors ${activeTab === item.id ? 'text-cyan-400' : 'text-zinc-400 group-hover:text-zinc-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  {item.label}
                </div>
                {item.badge ? (
                  <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{item.badge}</span>
                ) : null}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-zinc-100">
           <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-2xl border border-zinc-200">
             <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">AD</div>
             <div className="flex-1 min-w-0">
               <p className="text-xs font-bold text-zinc-900 truncate">Administrator</p>
               <p className="text-[10px] font-medium text-zinc-500 truncate">{me.email}</p>
             </div>
             <button onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); window.location.href = "/login"; }} className="text-zinc-400 hover:text-red-500 transition-colors">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
             </button>
           </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 shrink-0 flex items-center justify-between px-10 bg-white/40 backdrop-blur-md border-b border-zinc-200 z-30">
           <h2 className="text-2xl font-black text-zinc-900 capitalize tracking-tight">{activeTab.replace("-", " ")}</h2>
           <div className="flex items-center gap-4">
             <div className="relative">
               <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
               <div className="h-10 w-10 rounded-full bg-zinc-100 border border-zinc-200" />
             </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {[
                   { label: "Total Users", val: data?.total_users, desc: "Across all system roles", color: "from-zinc-800 to-zinc-900" },
                   { label: "High Risk Flags", val: data?.total_high_risk_adolescents, desc: "Detected in last 7 days", color: "from-red-500 to-rose-600", highlight: true },
                   { label: "Active Journals", val: data?.total_journals_count, desc: "Private reflections logged", color: "from-indigo-500 to-blue-600" },
                   { label: "Pending Reviews", val: data?.pending_counselor_applications, desc: "New counselor applicants", color: "from-orange-400 to-amber-500" },
                 ].map((stat, i) => (
                   <div key={i} className={`relative overflow-hidden p-6 rounded-[2rem] bg-white border border-zinc-200 shadow-sm transition-transform hover:scale-[1.02] ${stat.highlight ? 'ring-2 ring-red-100' : ''}`}>
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-[0.03] -translate-y-1/2 translate-x-1/2 rounded-full`} />
                      <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                      <h3 className="text-4xl font-black text-zinc-900 mt-2">{stat.val ?? "0"}</h3>
                      <p className="text-xs font-medium text-zinc-400 mt-1">{stat.desc}</p>
                   </div>
                 ))}
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Mood Distribution Card */}
                  {data?.system_wide_mood_distribution && (
                    <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-white border border-zinc-200 shadow-sm relative overflow-hidden">
                      <div className="flex items-center justify-between mb-8">
                         <h3 className="text-xl font-black text-zinc-900">System Emotional Health</h3>
                         <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 px-3 py-1 rounded-full border border-zinc-100">Live Feedback</span>
                      </div>
                      <div className="flex items-end gap-3 h-40">
                         {data.system_wide_mood_distribution.map((m, i) => {
                           const max = Math.max(...data.system_wide_mood_distribution.map(x=>x.count));
                           const pct = (m.count / (max || 1)) * 100;
                           return (
                             <div key={i} className="flex-1 flex flex-col items-center group">
                               <div className="w-full relative flex flex-col justify-end h-32 mb-3">
                                 <div 
                                   style={{ height: `${pct}%` }} 
                                   className="w-full bg-gradient-to-t from-indigo-500 to-cyan-400 rounded-xl transition-all duration-1000 origin-bottom shadow-inner" 
                                 />
                               </div>
                               <span className="text-[10px] font-black uppercase text-zinc-500 group-hover:text-zinc-900 transition-colors truncate w-full text-center">{m.mood}</span>
                             </div>
                           )
                         })}
                      </div>
                    </div>
                  )}

                  {/* High Risk Clusters */}
                  <div className="p-8 rounded-[2.5rem] bg-zinc-900 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent pointer-events-none" />
                    <h3 className="text-xl font-bold mb-1">Risk Clusters</h3>
                    <p className="text-xs text-zinc-400 mb-6 font-medium">Consolidated risk metrics by counselor assignment.</p>
                    <div className="space-y-4 relative z-10">
                       {!data?.high_risk_clusters || data.high_risk_clusters.length === 0 ? (
                         <div className="text-center py-10 text-zinc-500 text-sm italic">No active clusters found.</div>
                       ) : data.high_risk_clusters.map((c, i) => (
                         <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                           <div className="min-w-0">
                             <p className="text-xs font-bold text-white truncate">{c.counselor}</p>
                             <p className="text-[10px] text-zinc-400 uppercase font-black tracking-tighter">Assigned Counselor</p>
                           </div>
                           <div className="flex items-center gap-2">
                             <span className="text-lg font-black text-red-400">{c.high_risk_count}</span>
                             <div className="h-1.5 w-1.5 rounded-full bg-red-400 animate-ping" />
                           </div>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* USER MANAGEMENT TAB */}
          {activeTab === "users" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
               <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full md:w-96">
                    <input 
                      type="text" 
                      placeholder="Search users by name or email..." 
                      value={userSearch}
                      onChange={e => setUserSearch(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && loadUsers()}
                      className="w-full bg-white border border-zinc-200 rounded-2xl px-12 py-3.5 text-sm font-semibold outline-none focus:ring-4 focus:ring-indigo-100 transition-all" 
                    />
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  </div>
                  <div className="flex items-center gap-3">
                     <select 
                       value={userRoleFilter} 
                       onChange={e => setUserRoleFilter(e.target.value)}
                       className="bg-white border border-zinc-200 rounded-2xl px-6 py-3.5 text-sm font-bold text-zinc-700 outline-none hover:bg-zinc-50 transition-colors appearance-none"
                     >
                       <option value="">All Roles</option>
                       <option value="adolescent">Adolescents</option>
                       <option value="counselor">Counselors</option>
                       <option value="guardian">Guardians</option>
                       <option value="admin">Admins</option>
                     </select>
                     <button onClick={loadUsers} className="bg-indigo-600 text-white rounded-2xl p-3.5 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors">
                        <svg className={`h-5 w-5 ${usersLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                     </button>
                  </div>
               </div>

               <div className="bg-white border border-zinc-200 rounded-[2.5rem] shadow-sm overflow-hidden min-h-[400px]">
                 <table className="w-full text-left">
                   <thead className="bg-zinc-50/50 border-b border-zinc-100 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                     <tr>
                       <th className="px-8 py-5">User Profile</th>
                       <th className="px-8 py-5">System Role</th>
                       <th className="px-8 py-5">Joined Date</th>
                       <th className="px-8 py-5">Status</th>
                       <th className="px-8 py-5 text-right">Access Control</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-zinc-50">
                     {usersLoading ? (
                       <tr><td colSpan={5} className="py-20 text-center text-zinc-400 font-medium animate-pulse">Retrieving user database...</td></tr>
                     ) : users.length === 0 ? (
                        <tr><td colSpan={5} className="py-20 text-center text-zinc-400 font-medium">No system users match your criteria.</td></tr>
                     ) : users.map(user => (
                       <tr key={user.id} className="group hover:bg-zinc-50/50 transition-colors">
                         <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-xs text-zinc-500 uppercase">
                                {user.full_name?.substring(0, 2) || user.email.substring(0, 2)}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-zinc-900 leading-none mb-1">{user.full_name || "Self-Registered User"}</p>
                                <p className="text-xs font-medium text-zinc-400">{user.email}</p>
                              </div>
                            </div>
                         </td>
                         <td className="px-8 py-5">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                             user.role === 'admin' ? 'bg-zinc-100 text-zinc-800' :
                             user.role === 'counselor' ? 'bg-indigo-50 text-indigo-700' :
                             user.role === 'adolescent' ? 'bg-emerald-50 text-emerald-700' :
                             'bg-amber-50 text-amber-700'
                           }`}>
                             {user.role}
                           </span>
                         </td>
                         <td className="px-8 py-5 text-xs font-bold text-zinc-500">
                           {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Historical Account"}
                         </td>
                         <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <span className={`h-1.5 w-1.5 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                              <span className="text-xs font-bold text-zinc-700">{user.is_active ? 'Active' : 'Disabled'}</span>
                            </div>
                         </td>
                         <td className="px-8 py-5 text-right">
                            <button 
                              onClick={() => handleToggleUserStatus(user.email, user.is_active)}
                              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                user.is_active 
                                  ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' 
                                  : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                              }`}
                            >
                              {user.is_active ? 'Suspend' : 'Activate'}
                            </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {/* COUNSELOR APPLICATIONS TAB */}
          {activeTab === "applications" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
               <div className="grid grid-cols-1 gap-6">
                 {applications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-zinc-200 rounded-[3rem] bg-white text-zinc-400">
                      <svg className="h-16 w-16 mb-4 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      <h3 className="text-xl font-bold text-zinc-700">No Applications Logged</h3>
                      <p className="text-sm">There are no pending or historic counselor requests currently.</p>
                    </div>
                 ) : (
                   applications.map((app) => (
                     <div key={app.email} className="p-8 bg-white border border-zinc-200 rounded-[2rem] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-10 hover:shadow-md transition-shadow">
                        <div className="flex gap-6 items-center">
                           <div className="h-16 w-16 rounded-[1.5rem] bg-zinc-50 border border-zinc-200 flex items-center justify-center text-xl font-bold text-zinc-900 transition-transform hover:scale-110">
                             {app.full_name.substring(0, 1)}
                           </div>
                           <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-black text-zinc-900 truncate">{app.full_name}</h3>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                  app.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                  app.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                  'bg-red-100 text-red-700'
                                }`}>{app.status}</span>
                              </div>
                              <p className="text-sm font-semibold text-zinc-400 mb-2">{app.email}</p>
                              <div className="flex gap-6 mt-4">
                                <div className="text-center bg-zinc-50 px-4 py-2 rounded-xl border border-zinc-100">
                                   <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Experience</p>
                                   <p className="text-lg font-black text-zinc-900 leading-none">{app.experience_years} years</p>
                                </div>
                                <div className="flex-1">
                                   <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Qualification</p>
                                   <p className="text-sm font-bold text-zinc-700 leading-tight truncate">{app.qualification}</p>
                                </div>
                              </div>
                           </div>
                        </div>

                        {app.status === 'pending' && (
                          <div className="flex items-center gap-3 shrink-0">
                             <button onClick={() => handleApplication(app.email, "approve")} className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95 shadow-lg">Verify & Approve</button>
                             <button onClick={() => handleApplication(app.email, "reject")} className="px-8 py-4 border border-zinc-200 bg-white text-red-600 rounded-2xl font-bold text-sm hover:bg-red-50 transition-all">Dismiss</button>
                          </div>
                        )}
                     </div>
                   ))
                 )}
               </div>
            </div>
          )}

          {/* ASSIGNMENTS TAB */}
          {activeTab === "assign" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl mx-auto py-10">
               <div className="bg-white border border-zinc-200 p-12 rounded-[3rem] shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-[3rem] pointer-events-none" />
                  
                  <div className="relative z-10">
                    <h2 className="text-3xl font-black tracking-tight text-zinc-900 mb-2">Relational Mapping</h2>
                    <p className="text-zinc-500 font-medium mb-10 max-w-md">Assign an active counselor to oversee an adolescent's case and view their secure alerts.</p>

                    <form onSubmit={handleAssign} className="space-y-6">
                       <div>
                         <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2 px-1">Verified Counselor Email</label>
                         <input 
                           type="email" 
                           value={cEmail}
                           onChange={e => setCEmail(e.target.value)}
                           required
                           className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 text-sm font-bold text-zinc-900 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all outline-none" 
                           placeholder="counselor@neuronets.org"
                         />
                       </div>
                       <div>
                         <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2 px-1">Assigned Adolescent Email</label>
                         <input 
                           type="email" 
                           value={aEmail}
                           onChange={e => setAEmail(e.target.value)}
                           required
                           className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 text-sm font-bold text-zinc-900 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all outline-none" 
                           placeholder="adolescent@user.com"
                         />
                       </div>

                       {assignResult && (
                         <div className={`p-4 rounded-2xl text-xs font-bold animate-in zoom-in-95 ${assignResult.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                           {assignResult.msg}
                         </div>
                       )}

                       <button 
                         type="submit"
                         disabled={assignLoading}
                         className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-zinc-200 disabled:opacity-50"
                       >
                         {assignLoading ? "Mapping Case..." : "Establish Assignment"}
                       </button>
                    </form>
                  </div>
               </div>
            </div>
          )}

          {/* AUDIT VAULT TAB */}
          {activeTab === "audit" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
               <div className="bg-white border border-zinc-200 rounded-[2.5rem] shadow-sm p-4 overflow-hidden">
                 <div className="border-b border-zinc-100 px-6 py-4 mb-4 flex items-center justify-between">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Immutable System Logs</p>
                    <button onClick={loadAuditLogs} className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Fresh Sync</button>
                 </div>
                 <div className="space-y-1">
                   {auditLoading ? (
                     <div className="py-20 text-center animate-pulse text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Accessing Vault...</div>
                   ) : auditLogs.length === 0 ? (
                     <div className="py-20 text-center text-zinc-400">Vault is empty or inaccessible.</div>
                   ) : auditLogs.map((log, i) => (
                     <div key={i} className="flex items-center gap-6 p-4 hover:bg-zinc-50 rounded-2xl transition-colors text-sm border-b border-zinc-50 last:border-0">
                        <div className="shrink-0 w-24 text-[10px] font-black text-zinc-400">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                        <div className={`shrink-0 px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
                           log.actor_role === 'admin' ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-600'
                        }`}>
                          {log.actor_role}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="font-bold text-zinc-700 truncate capitalize">{log.action_type.replace(/_/g, ' ')}</p>
                        </div>
                        <div className="shrink-0 text-[10px] font-black text-zinc-400 uppercase tracking-widest bg-zinc-50 px-2 py-1 rounded-lg border border-zinc-200">
                           {log.resource_type}
                        </div>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          )}

          {/* CONTENT MANAGEMENT PLACEHOLDER */}
          {activeTab === "content" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 p-20 flex flex-col items-center justify-center text-center">
               <div className="h-20 w-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-6">
                 <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
               </div>
               <h3 className="text-2xl font-black text-zinc-900 mb-2">Content Orchestration</h3>
               <p className="text-zinc-500 max-w-md">This module allows the administration of educational resources and guidance pages. Edit/Update controls coming in the next phase.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
