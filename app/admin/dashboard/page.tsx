"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard } from "lucide-react";

// Modular Components
import DashboardSidebar from "./components/DashboardSidebar";
import DashboardHeader from "./components/DashboardHeader";
import OverviewTab from "./components/OverviewTab";
import UserManagementTab from "./components/UserManagementTab";
import CounselorApplicationsTab from "./components/CounselorApplicationsTab";
import AssignmentsTab from "./components/AssignmentsTab";
import AuditVaultTab from "./components/AuditVaultTab";

type AuthMeResponse =
  | { authenticated: false }
  | { authenticated: true; email: string; role: string; _id: string };

type TabNode = "overview" | "users" | "applications" | "assign" | "audit" | "config" | "ai" | "analytics" | "reports" | "access";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<AuthMeResponse>({ authenticated: false });
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabNode>("overview");

  // User Management State
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [usersLoading, setUsersLoading] = useState(false);

  // Applications State
  const [applications, setApplications] = useState<any[]>([]);
  const [appsLoading, setAppsLoading] = useState(false);

  // Assignments State
  const [cEmail, setCEmail] = useState("");
  const [aEmail, setAEmail] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignResult, setAssignResult] = useState<{ok: boolean, msg: string} | null>(null);

  // Audit State
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
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

  // Load tab-specific data
  useEffect(() => {
    if (activeTab === "users" || activeTab === "overview") loadUsers();
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
    if (res.ok) setUsers(await res.json());
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

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  if (loading || !me.authenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
           <div className="h-12 w-12 border-4 border-[#6b21a8]/20 border-t-[#6b21a8] rounded-full animate-spin" />
           <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Initialising Admin Workspace...</p>
        </div>
      </div>
    );
  }

  const tabTitles: Record<TabNode, string> = {
    overview: "Administrator Dashboard",
    users: "User Management Directory",
    applications: "Counselor Applications",
    assign: "Relational Mapping",
    audit: "Audit Vault (Ledger)",
    config: "System Configuration",
    ai: "AI Model Settings",
    analytics: "System Analytics",
    reports: "Reporting Engine",
    access: "Access Control"
  };

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <DashboardSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        pendingApps={data?.pending_counselor_applications}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader 
          title={tabTitles[activeTab] || "Admin"} 
          adminEmail={me.email} 
        />

        <main className="flex-1 overflow-y-auto p-10">
          {activeTab === "overview" && (
            <OverviewTab data={data} recentUsers={users.slice(0, 4)} />
          )}
          {activeTab === "users" && (
            <UserManagementTab 
              users={users}
              userSearch={userSearch}
              setUserSearch={setUserSearch}
              userRoleFilter={userRoleFilter}
              setUserRoleFilter={setUserRoleFilter}
              usersLoading={usersLoading}
              loadUsers={loadUsers}
              handleToggleUserStatus={handleToggleUserStatus}
            />
          )}
          {activeTab === "applications" && (
            <CounselorApplicationsTab 
              applications={applications}
              appsLoading={appsLoading}
              handleApplication={handleApplication}
            />
          )}
          {activeTab === "assign" && (
            <AssignmentsTab 
              cEmail={cEmail}
              setCEmail={setCEmail}
              aEmail={aEmail}
              setAEmail={setAEmail}
              assignLoading={assignLoading}
              assignResult={assignResult}
              handleAssign={handleAssign}
            />
          )}
          {activeTab === "audit" && (
            <AuditVaultTab 
              auditLogs={auditLogs}
              auditLoading={auditLoading}
              loadAuditLogs={loadAuditLogs}
            />
          )}

          {/* Placeholder for other tabs */}
          {["config", "ai", "analytics", "reports", "access"].includes(activeTab) && (
            <div className="h-full flex flex-col items-center justify-center text-center p-20 animate-in fade-in zoom-in duration-500">
               <div className="h-24 w-24 bg-purple-50 rounded-[2rem] flex items-center justify-center text-purple-600 mb-8 border border-purple-100 shadow-sm">
                  <LayoutDashboard className="h-10 w-10" />
               </div>
               <h3 className="text-2xl font-black text-zinc-900 mb-2 capitalize">{activeTab.replace("-", " ")} Module</h3>
               <p className="text-zinc-500 max-w-md font-medium">This functional module is currently being integrated with the production backend. Real-time controls will be available in the next deployment cycle.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
