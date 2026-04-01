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
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#09090b] text-white">
        <div className="h-12 w-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-6" />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Initializing Workspace</p>
      </div>
    );
  }

  // Calculate stats
  const activeAlertsCount = alerts.length;
  const assignedCount = dashData?.assigned_adolescents?.length || 0;
  const unreadMessagesCount = conversations.length; 
  const activeChannelsCount = channels.length;

  return (
    <div className="flex min-h-screen flex-col bg-[#050505] relative overflow-x-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-[600px] w-[600px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />
      
      <main className="relative z-10 mx-auto w-full max-w-7xl px-6 py-12 md:px-12 animate-in fade-in zoom-in duration-1000">
        
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

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr] items-stretch">
          <AssignedList adolescents={dashData?.assigned_adolescents || []} />
          <RecentAlerts alerts={alerts} />
        </div>

        {/* Privacy Notice Footer */}
        <div className="mt-12 rounded-[2.5rem] border border-white/5 bg-[#09090b] p-10 shadow-2xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
           <div className="relative flex items-center gap-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-1">Privacy Protocol Active</h4>
                <p className="text-md font-bold text-zinc-400 leading-relaxed max-w-3xl">
                  You are viewing behavioral trends and aggregate analytics. Direct access to private journals is restricted and requires specific authorization to ensure the highest standards of adolescent privacy.
                </p>
              </div>
           </div>
        </div>

      </main>
    </div>
  );
}

