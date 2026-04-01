"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "./components/DashboardHeader";
import StatCards from "./components/StatCards";
import AssignedList from "./components/AssignedList";
import RecentAlerts from "./components/RecentAlerts";

type AuthMeResponse =
  | { authenticated: false }
  | { authenticated: true; email: string; role: string; _id: string };

export default function CounselorDashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<AuthMeResponse>({ authenticated: false });

  // Data States
  const [dashData, setDashData] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        if (m.role !== "counselor") {
          router.replace(m.role === "admin" ? "/admin/dashboard" : "/login");
          return;
        }

        // Fetch all required data concurrently
        const [dashRes, alertsRes, convsRes, chansRes] = await Promise.all([
          fetch("/api/proxy/dashboard/counselor"),
          fetch("/api/proxy/backend/alerts/unresolved"),
          fetch("/api/proxy/backend/messaging/conversations"),
          fetch("/api/proxy/backend/channels/me")
        ]);

        if (dashRes.ok) setDashData(await dashRes.json());
        else setError("Failed to load dashboard overview.");

        if (alertsRes.ok) setAlerts(await alertsRes.json());
        if (convsRes.ok) setConversations(await convsRes.json());
        if (chansRes.ok) setChannels(await chansRes.json());

      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading || !me.authenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-zinc-500">
        <div className="h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Initializing Workspace...</p>
      </div>
    );
  }

  // Calculate stats
  const activeAlertsCount = alerts.length;
  const assignedCount = dashData?.assigned_adolescents?.length || 0;
  const unreadMessagesCount = conversations.length; 
  const activeChannelsCount = channels.length;

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] relative overflow-x-hidden">
      {/* Dynamic Background Mesh */}
      <div className="absolute top-0 right-0 h-[800px] w-[800px] bg-indigo-50/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-[600px] w-[600px] bg-cyan-50/50 rounded-full blur-[120px] pointer-events-none" />
      
      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 md:px-8 animate-in fade-in duration-1000">
        
        <DashboardHeader 
          email={me.email} 
          alertCount={activeAlertsCount} 
        />

        <StatCards 
          activeAlerts={activeAlertsCount}
          assignedAdolescents={assignedCount}
          unreadMessages={unreadMessagesCount}
          activeChannels={activeChannelsCount}
        />

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr] items-stretch">
          <AssignedList adolescents={dashData?.assigned_adolescents || []} />
          <RecentAlerts alerts={alerts} />
        </div>

        {/* Privacy Notice Footer */}
        <div className="mt-8 rounded-[2rem] border border-white bg-white/60 backdrop-blur-md p-8 shadow-sm flex items-start gap-4 ring-1 ring-zinc-200/50">
           <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
           </div>
           <div>
             <h4 className="text-sm font-bold text-emerald-800 mb-1">Privacy Notice & Protocol</h4>
             <p className="text-sm font-medium text-emerald-700/80 leading-relaxed">
               You are viewing behavioral trends and AI-generated summaries. Raw journal content is protected by end-to-end encryption and is not accessible without explicit consent or emergency override protocols.
             </p>
           </div>
        </div>

      </main>
    </div>
  );
}


