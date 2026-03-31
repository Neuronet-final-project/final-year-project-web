"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type AuthMeResponse =
  | { authenticated: false }
  | { authenticated: true; email: string; role: string; _id: string };

type Channel = {
  id: string;
  name: string;
  description?: string;
  is_group: boolean;
  created_by: string;
  is_active: boolean;
};

export default function CounselorChannelsPage() {
  const router = useRouter();
  const [me, setMe] = useState<AuthMeResponse>({ authenticated: false });
  const [loading, setLoading] = useState(true);
  const [channels, setChannels] = useState<Channel[]>([]);
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

        const chRes = await fetch("/api/proxy/backend/channels/me");
        if (chRes.ok) {
          const data = await chRes.json();
          // Backend returns list of subscriptions, each has a 'channel' field or flat depending on list_channels_for_user
          // Looking at channel_routes.py, list_channels_for_user returns flat dicts representing the channel directly
          setChannels(data || []);
        } else {
          setError("Failed to load active channels.");
        }
      } catch (err) {
        setError("Network error while loading channels.");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading || !me.authenticated) {
    return <div className="flex h-screen items-center justify-center bg-slate-50 text-zinc-500">Loading channel directory...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 relative overflow-hidden">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-transparent"></div>
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-100 via-transparent to-transparent"></div>

      {/* HEADER */}
      <header className="shrink-0 border-b border-white/20 bg-white/60 backdrop-blur-md shadow-sm z-30">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
             <Link href="/counselor/dashboard" className="rounded-xl border border-zinc-200 bg-white p-2 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
             </Link>
             <div className="flex items-center gap-3">
               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1] to-[#06b6d4] shadow-[0_4px_20px_rgb(99,102,241,0.3)]">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
               </div>
               <div>
                 <h1 className="text-xl font-bold text-zinc-900 leading-none">Channel Directory</h1>
                 <p className="text-xs font-medium text-zinc-500 mt-1">Group Broadcasts & Topics</p>
               </div>
             </div>
          </div>
          <div className="hidden sm:block text-right">
             <p className="text-sm font-semibold text-zinc-900">{(me as any).email}</p>
             <p className="text-xs text-emerald-600 font-medium flex items-center justify-end gap-1">
               <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
             </p>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex flex-1 flex-col mx-auto w-full max-w-7xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#06b6d4]">Active Subscriptions</h2>
            <p className="text-zinc-500 font-medium">Browse and manage your active group channels.</p>
          </div>
          <button className="hidden sm:flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-[#6366f1] to-[#06b6d4] text-white font-bold rounded-2xl shadow-[0_8px_30px_rgb(99,102,241,0.3)] hover:scale-105 transition-all duration-300">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            Create Topic
          </button>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600 font-medium shadow-sm">
            {error}
          </div>
        ) : channels.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-zinc-200 rounded-[2rem] bg-white/50 backdrop-blur-sm">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-700">No Channels Found</h3>
            <p className="mt-2 text-zinc-500 max-w-sm">You are not subscribed to any organizational or group topics yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {channels.map((ch, idx) => (
              <div 
                key={ch.id || idx}
                className="group flex flex-col justify-between rounded-[2rem] border border-white/60 bg-white/70 backdrop-blur-xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(99,102,241,0.15)] hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366f1]/10 to-[#06b6d4]/10 text-[#06b6d4] shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-zinc-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#6366f1] group-hover:to-[#06b6d4] transition-all">
                    {ch.name}
                  </h3>
                  <p className="mt-3 text-sm text-zinc-500 font-medium leading-relaxed">
                    {ch.description || "Generic organizational channel for broadcasts."}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-zinc-100 pt-6">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-emerald-600">Active</span>
                  </div>
                  <button className="text-sm font-bold text-[#6366f1] flex items-center gap-1 hover:text-[#06b6d4] transition-colors">
                    View <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
