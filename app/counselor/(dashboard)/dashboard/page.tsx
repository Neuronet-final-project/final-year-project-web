"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatCards from "@/components/counselor/dashboard/StatCards";
import AssignedList from "@/components/counselor/dashboard/AssignedList";
import RecentAlerts from "@/components/counselor/dashboard/RecentAlerts";

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
          fetch("/api/proxy/backend/dashboard/counselor", { cache: "no-store" }),
          fetch("/api/proxy/backend/alerts/counselor/me", { cache: "no-store" }),
          fetch("/api/proxy/backend/messaging/conversations", { cache: "no-store" }),
          fetch("/api/proxy/backend/channels/me", { cache: "no-store" })
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
  // Prioritize counts from dashData (which uses the centralized counselor_dashboard_service aggregate)
  const activeAlertsCount = (dashData?.unresolved_alerts?.length > 0) 
    ? dashData.unresolved_alerts.length 
    : alerts.length;
  const assignedCount = dashData?.assigned_adolescents?.length || 0;
  const unreadMessagesCount = conversations.length; 
  const activeChannelsCount = channels.length;

  return (
    <div className="animate-in fade-in duration-1000">
      <main className="relative mx-auto w-full max-w-7xl px-8 py-8 md:py-10">
        
        {/* PAGE TITLE / WELCOME */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Dashboard Overview</h1>
            <p className="mt-2 text-sm font-medium text-zinc-500 max-w-md">Welcome back. Here is a clinical snapshot of your current caseload and critical alerts.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-100 rounded-2xl shadow-sm">
             <div className="flex -space-x-2">
               {[1,2,3].map(i => (
                 <div key={i} className="h-8 w-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-zinc-400">
                   {String.fromCharCode(64+i)}
                 </div>
               ))}
             </div>
             <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-2 border-l border-zinc-100 ml-2">
               {dashData?.assigned_adolescents?.length || 0} Cases
             </p>
          </div>
        </div>

        {/* AI INSIGHTS BANNER */}
        {dashData?.ai_alert_summary && (
          <div className="mb-8 rounded-2xl bg-indigo-50 border border-indigo-100 p-6 flex items-start gap-4 shadow-sm">
            <div className="mt-1 flex shrink-0 h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10m0 0 8.66-5M12 12l-8.66-5"/><circle cx="12" cy="12" r="10"/></svg>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-indigo-900 mb-1 uppercase tracking-widest">AI Alert Summary</h4>
              <p className="text-sm font-medium text-indigo-800/80">{dashData.ai_alert_summary}</p>
            </div>
          </div>
        )}

        <StatCards 
          activeAlerts={activeAlertsCount}
          assignedAdolescents={assignedCount}
          unreadMessages={unreadMessagesCount}
          activeChannels={activeChannelsCount}
        />

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]">
          <AssignedList adolescents={dashData?.assigned_adolescents || []} />
          <RecentAlerts alerts={alerts} />
        </div>

        {/* Privacy Notice Footer */}
        <div className="mt-12 rounded-[2.5rem] border border-white bg-white/40 backdrop-blur-md p-10 shadow-sm flex items-start gap-6 ring-1 ring-zinc-200/40">
           <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.25rem] bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-inner">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
           </div>
           <div>
             <h4 className="text-base font-black text-emerald-900 mb-1">Clinic Protocol Alpha-6</h4>
             <p className="text-sm font-medium text-emerald-800/60 leading-relaxed max-w-2xl">
               You are viewing behavioral trends and AI-generated summaries. Raw journal content is protected by end-to-end encryption and is not accessible without explicit consent or emergency override protocols.
             </p>
           </div>
        </div>

      </main>
    </div>
  );
}



