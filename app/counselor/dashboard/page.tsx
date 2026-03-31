"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/counselor/DashboardHeader";
import { StatCards } from "@/components/counselor/StatCards";
import { AssignedList } from "@/components/counselor/AssignedList";
import { RecentAlerts } from "@/components/counselor/RecentAlerts";

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
    return <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb] text-zinc-500">Loading workspace...</div>;
  }

  // Calculate stats
  const activeAlertsCount = alerts.length;
  const assignedCount = dashData?.assigned_adolescents?.length || 0;
  const unreadMessagesCount = conversations.length; // Simplified proxy for now 
  const activeChannelsCount = channels.length;

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc]">
      <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8">
        
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

        {/* Privacy Notice Footer (As requested in the layout example) */}
        <div className="mt-8 rounded-xl bg-emerald-50 border border-emerald-100 p-4 shadow-sm flex items-start gap-3">
           <div className="mt-0.5 text-emerald-600">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
           </div>
           <p className="text-sm font-medium text-emerald-800">
             <span className="font-bold">Privacy Notice:</span> You can view behavioral trends and AI-generated summaries only. Raw journal content is not accessible to protect adolescent privacy unless explicit consent is provided.
           </p>
        </div>

      </main>
    </div>
  );
}
