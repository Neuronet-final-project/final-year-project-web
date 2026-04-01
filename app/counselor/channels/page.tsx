"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type AuthMeResponse =
  | { authenticated: false }
  | { authenticated: true; email: string; role: string; _id: string };

type Channel = {
  id?: string;
  channel_id?: string;
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

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);

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

  async function handleCreateChannel(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;

    setCreating(true);
    try {
      const res = await fetch("/api/proxy/backend/channels/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          description: newDesc,
          is_group: true
        })
      });
      if (res.ok) {
        const result = await res.json();
        // Assuming backend returns {"channel_id": "..."} or {"message": "...", "channel": {...}}
        // Refresh the channels list to be safe
        const chRes = await fetch("/api/proxy/backend/channels/me");
        if (chRes.ok) {
          const data = await chRes.json();
          setChannels(data || []);
        }
        setIsCreateOpen(false);
        setNewName("");
        setNewDesc("");
      } else {
        alert("Failed to create topic.");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setCreating(false);
    }
  }

  if (loading || !me.authenticated) {
    return <div className="flex h-screen items-center justify-center bg-slate-50 text-zinc-500">Loading channel directory...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc] relative overflow-x-hidden">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-transparent"></div>
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-100 via-transparent to-transparent"></div>

      {/* HEADER */}
      <header className="shrink-0 border-b border-white bg-white/60 backdrop-blur-md shadow-sm z-30">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
             <Link href="/counselor/dashboard" className="rounded-xl border border-zinc-200 bg-white p-2 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition shadow-sm">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
             </Link>
             <div className="flex items-center gap-3">
               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#0891b2] shadow-lg shadow-indigo-200">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
               </div>
               <div>
                 <h1 className="text-lg font-black text-zinc-900 leading-none">Topic Directory</h1>
                 <p className="text-[10px] font-bold text-zinc-500 mt-1 uppercase tracking-widest">Counselor Broadcasts</p>
               </div>
             </div>
          </div>
          <div className="hidden sm:flex items-center gap-3">
             <div className="text-right">
               <p className="text-xs font-bold text-zinc-900">{me.authenticated ? (me as any).email : ""}</p>
               <p className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-1 uppercase tracking-tighter">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Authorized
               </p>
             </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 mx-auto w-full max-w-7xl p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-[#4f46e5] to-[#0891b2]">Active Subscriptions</h2>
            <p className="mt-2 text-sm font-medium text-zinc-500 max-w-md">Manage your participation in specialized group topics and automated alert broadcasts.</p>
          </div>
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-600 border border-indigo-100 font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100/50 hover:bg-slate-50 hover:scale-105 transition-all duration-300"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            Propose Topic
          </button>
        </div>

        {error ? (
          <div className="rounded-[2.5rem] border border-rose-100 bg-rose-50/50 p-8 text-rose-600 font-bold flex items-center gap-4 shadow-sm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        ) : channels.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center border border-zinc-200 border-dashed rounded-[3rem] bg-white/40 backdrop-blur-sm">
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-zinc-100 text-zinc-300 shadow-inner">
               <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
            </div>
            <h3 className="text-2xl font-black text-zinc-400">Directory Empty</h3>
            <p className="mt-4 text-sm font-medium text-zinc-500 max-w-sm mx-auto">You haven't established or joined any specific group topics yet. Start by proposing a new discussion area.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {channels.map((ch, idx) => (
              <div 
                key={ch.id || idx}
                className="group flex flex-col justify-between rounded-[2.5rem] border border-white bg-white/70 backdrop-blur-md p-10 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-2 ring-1 ring-zinc-200/50 hover:ring-indigo-200"
              >
                <div>
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-zinc-900 group-hover:text-indigo-600 transition-colors">
                    {ch.name}
                  </h3>
                  <p className="mt-4 text-sm text-zinc-400 font-bold leading-relaxed">
                    {ch.description || "General organizational broadcast channel for coordinated adolescent support."}
                  </p>
                </div>

                <div className="mt-10 flex items-center justify-between border-t border-zinc-100/50 pt-8">
                  <div className="flex items-center gap-2">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified</span>
                  </div>
                  <Link href={`/counselor/channels/${ch.channel_id || ch.id}`} className="flex items-center gap-2 py-2 px-6 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all hover:scale-105 active:scale-95">
                    Connect
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CREATE CHANNEL MODAL */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-900/10 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="w-full max-w-lg rounded-[3rem] bg-white p-12 shadow-2xl relative overflow-hidden border border-zinc-100">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#4f46e5] to-[#0891b2]"></div>
               <button onClick={() => setIsCreateOpen(false)} className="absolute top-8 right-10 text-zinc-300 hover:text-zinc-600 transition-colors">
                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
               </button>
               
               <h3 className="text-3xl font-black text-zinc-900 tracking-tight">Propose New Topic</h3>
               <p className="text-sm text-zinc-400 font-bold mt-2 uppercase tracking-tight">Deployment Protocol Alpha</p>

               <form onSubmit={handleCreateChannel} className="mt-10 flex flex-col gap-6">
                 <div>
                   <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">Channel Identifier</label>
                   <input
                     type="text"
                     value={newName}
                     onChange={e => setNewName(e.target.value)}
                     className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 px-6 py-5 text-sm font-bold text-zinc-900 placeholder:text-zinc-200 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all shadow-inner"
                     placeholder="e.g. Behavioral Crisis Unit"
                     required
                   />
                 </div>
                 <div>
                   <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 px-1">Scope & Purpose</label>
                   <textarea
                     value={newDesc}
                     onChange={e => setNewDesc(e.target.value)}
                     className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 px-6 py-5 text-sm font-bold text-zinc-900 placeholder:text-zinc-200 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all min-h-[120px] resize-none shadow-inner"
                     placeholder="Describe the clinical objective of this topic..."
                   />
                 </div>
                 <button
                   type="submit"
                   disabled={creating || !newName.trim()}
                   className="mt-4 w-full rounded-2xl bg-indigo-600 py-5 text-xs font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                 >
                   {creating ? "Provisioning..." : "Initialize Channel"}
                 </button>
               </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

