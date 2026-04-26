"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Bell, AlertTriangle, ShieldCheck, Search, Filter, Brain, Eye, Info } from "lucide-react";

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
  // Stage 2 enriched fields
  detected_emotions?: string[];
  main_concern?: string;
  ai_summary?: string;
  concern_category?: string;
  adolescent_name?: string;
  behavioral_analysis?: {
    emotions?: string[];
    concern_category?: string;
    behavioral_summary?: string;
    suggested_follow_up?: string;
  };
  // Alert-triggered approval fields
  approval_id?: string;
  triggered_by_alert?: boolean;
  approval_status?: "pending" | "approved" | "denied" | "revoked" | "expired";
  alert_context?: {
    risk_score: number;
    detected_keywords: string[];
    evaluation_method: string;
  };
};

const EMOTION_COLORS: Record<string, string> = {
  sadness: "bg-blue-100 text-blue-700 border-blue-200",
  loneliness: "bg-violet-100 text-violet-700 border-violet-200",
  hopelessness: "bg-slate-100 text-slate-700 border-slate-200",
  fear: "bg-amber-100 text-amber-700 border-amber-200",
  anger: "bg-red-100 text-red-700 border-red-200",
  annoyance: "bg-orange-100 text-orange-700 border-orange-200",
  nervousness: "bg-yellow-100 text-yellow-700 border-yellow-200",
  anxiety: "bg-yellow-100 text-yellow-700 border-yellow-200",
  disappointment: "bg-teal-100 text-teal-700 border-teal-200",
  grief: "bg-indigo-100 text-indigo-700 border-indigo-200",
  disgust: "bg-emerald-100 text-emerald-700 border-emerald-200",
  remorse: "bg-purple-100 text-purple-700 border-purple-200",
  confusion: "bg-cyan-100 text-cyan-700 border-cyan-200",
  disapproval: "bg-rose-100 text-rose-700 border-rose-200",
  joy: "bg-green-100 text-green-700 border-green-200",
  love: "bg-pink-100 text-pink-700 border-pink-200",
  neutral: "bg-zinc-100 text-zinc-600 border-zinc-200",
};

function getEmotionClass(emotion: string): string {
  return EMOTION_COLORS[emotion.toLowerCase()] || "bg-zinc-100 text-zinc-600 border-zinc-200";
}

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

        const alertsRes = await fetch("/api/proxy/backend/alerts/counselor/me", { cache: "no-store" });
        if (alertsRes.ok) {
          const data = await alertsRes.json();
          setAlerts(Array.isArray(data) ? data : []);
        } else {
          const fallbackRes = await fetch("/api/proxy/backend/alerts/unresolved", { cache: "no-store" });
          if (fallbackRes.ok) {
            const data = await fallbackRes.json();
            setAlerts(Array.isArray(data) ? data : []);
          } else {
            setError("Failed to load clinical alerts.");
          }
        }
      } catch (err) {
        setError("Network error while loading alerts.");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const handleDismiss = async (alertId: string) => {
    const tid = toast.loading("Dismissing behavioral alert...");
    try {
      const res = await fetch(`/api/proxy/backend/alerts/resolve/${alertId}`, {
        method: "PUT"
      });
      if (res.ok) {
        setAlerts(prev => prev.filter(a => a._id !== alertId));
        toast.success("Alert resolved and archived", { id: tid });
      } else {
        toast.error("Failed to resolve clinical alert.", { id: tid });
      }
    } catch (e) {
      toast.error("Network error.", { id: tid });
    }
  };

  const handleReview = (adolescentId: string) => {
    router.push(`/counselor/chat?adolescent_id=${adolescentId}`);
  };

  const handleViewCase = (adolescentId: string) => {
    router.push(`/counselor/adolescent/${adolescentId}`);
  };

  const filteredAlerts = alerts.filter(a => {
    const matchesSearch = (a.message || "").toLowerCase().includes(search.toLowerCase()) || 
                          a.adolescent_id.toLowerCase().includes(search.toLowerCase()) ||
                          (a.adolescent_name || "").toLowerCase().includes(search.toLowerCase()) ||
                          (a.main_concern || "").toLowerCase().includes(search.toLowerCase()) ||
                          (a.detected_emotions || []).some(e => e.toLowerCase().includes(search.toLowerCase()));
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
            <p className="mt-2 text-sm font-medium text-zinc-500 max-w-md">AI-powered behavioral analysis with emotion detection and concern categorization.</p>
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
               placeholder="Search by name, concern, emotion, or message..."
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
            {filteredAlerts.map((alert) => {
              const emotions = alert.behavioral_analysis?.emotions || alert.detected_emotions || [];
              const mainConcern = alert.main_concern || "";
              const concernCategory = alert.behavioral_analysis?.concern_category || alert.concern_category || "";
              const behavioralSummary = alert.behavioral_analysis?.behavioral_summary || "";
              const suggestedFollowUp = alert.behavioral_analysis?.suggested_follow_up || "";
              const aiSummary = alert.ai_summary || alert.message || "";
              const hasEnrichedData = emotions.length > 0 || mainConcern;

              return (
                <div 
                  key={alert._id}
                  className="group rounded-[2.5rem] border border-white bg-white/70 backdrop-blur-md p-8 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1 ring-1 ring-zinc-200/50"
                >
                  {/* Top Row: Risk Badge + Date */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-inner ${
                        alert.risk_level === 'high' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                        alert.risk_level === 'medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        'bg-indigo-50 text-indigo-600 border border-indigo-100'
                      }`}>
                        <AlertTriangle size={24} />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border ${
                        alert.risk_level === 'high' ? 'bg-rose-600 text-white border-rose-600' :
                        alert.risk_level === 'medium' ? 'bg-amber-600 text-white border-amber-600' :
                        'bg-indigo-600 text-white border-indigo-600'
                      }`}>
                        {alert.risk_level} Risk
                      </span>
                      {mainConcern && (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-zinc-900 text-white border border-zinc-700">
                          {mainConcern}
                        </span>
                      )}
                      {alert.triggered_by_alert && (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1">
                          <span>⚡</span> Auto-Approval
                        </span>
                      )}
                      {alert.approval_status && (
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border flex items-center gap-1 ${
                          alert.approval_status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' :
                          alert.approval_status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                          alert.approval_status === 'denied' ? 'bg-red-100 text-red-700 border-red-200' :
                          alert.approval_status === 'revoked' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                          'bg-gray-100 text-gray-700 border-gray-200'
                        }`}>
                          {alert.approval_status === 'approved' && '✓'}
                          {alert.approval_status === 'pending' && '⏳'}
                          {alert.approval_status === 'denied' && '✗'}
                          {alert.approval_status === 'revoked' && '↩'}
                          {alert.approval_status === 'expired' && '⏱'}
                          {' '}{alert.approval_status}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400">
                      {new Date(alert.created_at).toLocaleString()}
                    </span>
                  </div>

                  {/* AI Summary */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain size={14} className="text-indigo-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">AI Analysis</span>
                      {concernCategory && (
                        <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                          {concernCategory}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-zinc-800 leading-relaxed">
                      {behavioralSummary || aiSummary}
                    </p>
                    
                    {/* Alert Context (if triggered by alert) */}
                    {alert.triggered_by_alert && alert.alert_context && (
                      <div className="mt-3 p-3 rounded-xl bg-purple-50 border border-purple-200 flex gap-2">
                        <div className="shrink-0 mt-0.5">
                          <span className="text-lg">⚡</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-purple-900 mb-2">Alert-Triggered Approval</p>
                          <div className="space-y-1">
                            <p className="text-xs text-purple-800">
                              <span className="font-bold">Risk Score:</span> {(alert.alert_context.risk_score * 100).toFixed(1)}%
                            </p>
                            {alert.alert_context.detected_keywords && alert.alert_context.detected_keywords.length > 0 && (
                              <p className="text-xs text-purple-800">
                                <span className="font-bold">Keywords:</span> {alert.alert_context.detected_keywords.join(", ")}
                              </p>
                            )}
                            <p className="text-xs text-purple-700 italic mt-2">
                              Guardian approval request auto-created. Awaiting response to enable communication.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {suggestedFollowUp && (
                      <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 flex gap-2">
                        <Info size={16} className="text-slate-500 shrink-0 mt-0.5" />
                        <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                          <span className="font-bold text-slate-900">Suggested Action: </span>{suggestedFollowUp}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Emotion Chips */}
                  {hasEnrichedData && emotions.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {emotions.slice(0, 5).map((emotion, i) => (
                        <span
                          key={i}
                          className={`text-[10px] font-bold px-3 py-1 rounded-full border ${getEmotionClass(emotion)}`}
                        >
                          {emotion}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bottom Row: Adolescent Info + Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                    <div className="flex items-center gap-4">
                       <p className="text-xs font-medium text-zinc-500">Adolescent: <span className="text-indigo-600 font-bold">{alert.adolescent_name || "Unknown Case"}</span></p>
                       <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-l border-zinc-100 pl-4">Case ID: {alert.adolescent_id.substring(0, 8)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleViewCase(alert.adolescent_id)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 shadow-lg shadow-zinc-200 transition-all hover:scale-105 active:scale-95"
                      >
                        <Eye size={12} />
                        View Journal
                      </button>
                      <button 
                        onClick={() => handleReview(alert.adolescent_id)}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all hover:scale-105 active:scale-95"
                      >
                        Open Chat
                      </button>
                      <button 
                        onClick={() => handleDismiss(alert._id)}
                        className="px-5 py-2.5 rounded-xl bg-white border border-zinc-100 text-zinc-400 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
