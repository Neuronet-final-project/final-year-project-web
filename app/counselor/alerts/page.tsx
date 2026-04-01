"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, AlertTriangle, ShieldCheck, Search, Filter } from "lucide-react";

type AuthMeResponse =
  | { authenticated: false }
  | { authenticated: true; email: string; role: string; _id: string };

type Alert = {
  _id: string;
  adolescent_id: string;
  counselor_email: string;
  risk_level: "low" | "medium" | "high";
  message: string;
  created_at: string;
  is_resolved: boolean;
};

export default function CounselorAlertsPage() {
  const router = useRouter();
  const [me, setMe] = useState<AuthMeResponse>({ authenticated: false });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

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

        const alertsRes = await fetch("/api/proxy/backend/alerts/unresolved");
        if (alertsRes.ok) {
          setAlerts(await alertsRes.json());
        } else {
          setError("Failed to load clinical alerts.");
        }
      } catch (err) {
        setError("Network error while loading alerts.");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const handleDismiss = async (alertId: string) => {
    try {
      const res = await fetch(`/api/proxy/backend/alerts/resolve/${alertId}`, {
        method: "PUT"
      });
      if (res.ok) {
        setAlerts(prev => prev.filter(a => a._id !== alertId));
      } else {
        alert("Failed to resolve alert.");
      }
    } catch (e) {
      alert("Network error.");
    }
  };

  const handleReview = (adolescentId: string) => {
    router.push(`/counselor/chat?adolescent_id=${adolescentId}`);
  };

  const filteredAlerts = alerts.filter(a => {
    const matchesSearch = a.message.toLowerCase().includes(search.toLowerCase()) || 
                          a.adolescent_id.toLowerCase().includes(search.toLowerCase()) ||
                          (a as any).adolescent_name?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || a.risk_level === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading || !me.authenticated) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-500">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Loading Alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight">System Alerts</h1>
            <p className="mt-2 text-sm font-medium text-zinc-500 max-w-md">Critical behavioral notifications requiring immediate clinical review.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 shadow-sm">
                <Bell size={18} />
                <span className="text-xs font-black uppercase tracking-widest">{alerts.length} Pending</span>
             </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
           <div className="relative flex-1">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
             <input 
               type="text"
               placeholder="Search by case ID or message..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full rounded-2xl border border-zinc-100 bg-white px-12 py-4 text-sm font-bold text-zinc-900 placeholder:text-zinc-300 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm"
             />
           </div>
           <div className="flex items-center gap-2 px-4 bg-white border border-zinc-100 rounded-2xl shadow-sm">
             <Filter size={16} className="text-zinc-400" />
             <select 
               value={filter}
               onChange={(e) => setFilter(e.target.value)}
               className="bg-transparent border-none text-xs font-black uppercase tracking-widest text-zinc-500 py-4 focus:ring-0 cursor-pointer"
             >
               <option value="all">All Risks</option>
               <option value="high">Critical Only</option>
               <option value="medium">Medium Only</option>
               <option value="low">Low Priority</option>
             </select>
           </div>
        </div>

        {/* LIST */}
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center border border-zinc-200 border-dashed rounded-[3rem] bg-white/40 backdrop-blur-sm">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-emerald-50 text-emerald-400 border border-emerald-100">
               <ShieldCheck size={40} />
            </div>
            <h3 className="text-2xl font-black text-zinc-400">All Clear</h3>
            <p className="mt-4 text-sm font-medium text-zinc-500 max-w-sm mx-auto">No behavioral alerts found matching your criteria. Outstanding work.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredAlerts.map((alert) => (
              <div 
                key={alert._id}
                className="group flex items-start gap-6 rounded-[2.5rem] border border-white bg-white/70 backdrop-blur-md p-8 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1 ring-1 ring-zinc-200/50"
              >
                <div className={`mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-inner ${
                  alert.risk_level === 'high' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                  alert.risk_level === 'medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                  'bg-indigo-50 text-indigo-600 border border-indigo-100'
                }`}>
                  <AlertTriangle size={24} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${
                      alert.risk_level === 'high' ? 'bg-rose-600 text-white border-rose-600' :
                      alert.risk_level === 'medium' ? 'bg-amber-600 text-white border-amber-600' :
                      'bg-indigo-600 text-white border-indigo-600'
                    }`}>
                      {alert.risk_level} Risk
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400">
                      {new Date(alert.created_at).toLocaleString()}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-zinc-900 mb-2 leading-snug">{alert.message}</h4>
                  <div className="flex items-center gap-4">
                     <p className="text-xs font-medium text-zinc-500">Adolescent: <span className="text-indigo-600 font-bold">{(alert as any).adolescent_name || "Unknown Case"}</span></p>
                     <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-l border-zinc-100 pl-4">Case ID: {alert.adolescent_id.substring(0, 8)}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => handleReview(alert.adolescent_id)}
                    className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all hover:scale-105 active:scale-95"
                  >
                    Open Chat
                  </button>
                  <button 
                    onClick={() => handleDismiss(alert._id)}
                    className="px-6 py-3 rounded-xl bg-white border border-zinc-100 text-zinc-400 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all"
                  >
                    Dismiss Alert
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
