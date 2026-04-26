"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

type Journal = {
  _id: string;
  title?: string;
  content: string;
  mood: string;
  created_at: string;
  sentiment_score?: number;
  risk_level?: string;
  keywords_detected?: string[];
};

type Alert = {
  _id: string;
  risk_score: number;
  risk_level: string;
  triggered_by_journal_id?: string;
  status: "unresolved" | "resolved";
  created_at: string;
  detected_emotions?: string[];
  main_concern?: string;
  ai_summary?: string;
  message?: string;
  concern_category?: string;
  behavioral_analysis?: {
    emotions?: string[];
    concern_category?: string;
    behavioral_summary?: string;
    suggested_follow_up?: string;
  };
  channel_recommendations?: {
    recommended_channels: {
      category: string;
      channel_name: string;
      channel_slug: string;
      confidence: number;
    }[];
    recommendation_message: string;
  };
  // Alert-triggered approval fields
  approval_id?: string;
  triggered_by_alert?: boolean;
  alert_context?: {
    risk_score: number;
    detected_keywords: string[];
    evaluation_method: string;
  };
};

type Consent = {
  participation: boolean;
  share_ai_summaries: boolean;
  share_alerts: boolean;
  counselor_chat: boolean;
};

export default function AdolescentCasePage() {
  const router = useRouter();
  const params = useParams();
  const adolescentId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [journals, setJournals] = useState<Journal[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [patientName, setPatientName] = useState<string>("Adolescent Info");
  const [consent, setConsent] = useState<Consent | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // 1. Fetch assignments to get the name
        const assignRes = await fetch("/api/proxy/backend/counselor/assignments/me");
        if (assignRes.ok) {
          const assignments = await assignRes.json();
          const match = assignments.find((a: any) => a.adolescent_id === adolescentId);
          if (match) {
            setPatientName(match.full_name || match.email);
          }
        }

        // 2. Fetch Journals
        const jRes = await fetch(`/api/proxy/backend/journals/adolescent/${adolescentId}`);
        if (jRes.ok) {
          const jData = await jRes.json();
          setJournals(jData || []);
        } else if (jRes.status === 403) {
           setError("Consent settings prevent you from viewing this adolescent's data.");
        }

        // 3. Fetch Alerts (this also handles marking alerts as viewed in the backend)
        const aRes = await fetch(`/api/proxy/backend/alerts/adolescent/${adolescentId}`);
        if (aRes.ok) {
          const aData = await aRes.json();
          setAlerts(aData || []);
        }

        // 4. Fetch AI Alert Summary
        const sumRes = await fetch(`/api/proxy/backend/alerts/adolescent/${adolescentId}/summary`);
        if (sumRes.ok) {
          const sData = await sumRes.json();
          setAiSummary(sData?.summary || null);
        }

        // 5. Fetch Consents
        const consentRes = await fetch(`/api/proxy/backend/consents/adolescent/${adolescentId}`);
        if (consentRes.ok) {
          const cData = await consentRes.json();
          setConsent(cData);
        }

      } catch (err) {
        setError("Failed to load case data.");
      } finally {
        setLoading(false);
      }
    })();
  }, [adolescentId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb]">
        <div className="text-zinc-500 font-medium">Loading case details...</div>
      </div>
    );
  }

  const channelRecommendations = alerts.find(a => a.channel_recommendations)?.channel_recommendations;

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f7fb]">
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white shadow-sm">
        <div className="mx-auto flex w-full max-w-5xl items-center px-6 py-4">
          <Link href="/counselor/dashboard" className="mr-4 rounded-xl border border-zinc-200 bg-white p-2 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 leading-none">Case Dashboard</h1>
            <p className="text-xs font-medium text-zinc-500 mt-1">{patientName}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm animate-in fade-in">
            {error}
          </div>
        )}

        {consent && !consent.participation && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 shadow-sm animate-in fade-in flex items-center gap-3">
             <div className="shrink-0 w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-700">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/></svg>
             </div>
             <div>
               <p className="font-bold">AI Analysis Paused</p>
               <p className="text-xs opacity-80">Guardian has revoked AI participation consent. Journal analysis and risk detection are currently inactive.</p>
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT: Journals Timeline */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-200 pb-2">Journal History</h2>
            {journals.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500 shadow-sm">
                No recent journals or summaries available.
              </div>
            ) : (
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent">
                {journals.map((j) => (
                  <div key={j._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-zinc-100 text-zinc-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <div className={`w-3 h-3 rounded-full ${
                        j.risk_level === 'high' ? 'bg-red-500' : 
                        j.risk_level === 'medium' ? 'bg-orange-500' : 'bg-emerald-500'
                      }`}></div>
                    </div>
                    
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] rounded-2xl border border-zinc-200 bg-white shadow-sm p-5 hover:shadow-md transition">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 px-2 py-1 rounded-md">
                          {new Date(j.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-xs capitalize font-medium text-zinc-400">Mood: {j.mood}</span>
                      </div>
                      
                      <h4 className="font-bold text-zinc-900 text-sm mb-2">{j.title || "Untitled Entry"}</h4>
                      
                      {/* AI Summary/Meta instead of raw content based on the backend setting */}
                      {j.content ? (
                         <p className="text-sm text-zinc-600 line-clamp-3 mb-3">{j.content}</p>
                      ) : (
                         <p className="text-sm text-zinc-600 italic mb-3">Raw content protected. AI Summary available.</p>
                      )}
                      
                      {(j.risk_level || j.sentiment_score !== undefined) && (
                        <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center gap-3">
                           {j.risk_level && (
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                j.risk_level === 'high' ? 'bg-red-100 text-red-700' : 
                                j.risk_level === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'
                              }`}>
                                Risk: {j.risk_level}
                              </span>
                           )}
                           {j.sentiment_score !== undefined && (
                              <span className="text-xs text-zinc-400">Sent: {(j.sentiment_score * 10).toFixed(1)}/10</span>
                           )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Alerts & Vitals */}
          <div className="space-y-6">
            {consent && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Consent Status
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Participation", val: consent.participation },
                    { label: "AI Summaries", val: consent.share_ai_summaries },
                    { label: "Alerts", val: consent.share_alerts },
                    { label: "Counselor Chat", val: consent.counselor_chat },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500 font-medium">{c.label}</span>
                      <span className={`font-bold px-2 py-0.5 rounded-full ${c.val ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>
                        {c.val ? "Granted" : "Revoked"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {aiSummary && (
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10m0 0 8.66-5M12 12l-8.66-5"/><circle cx="12" cy="12" r="10"/></svg>
                  </div>
                  <h3 className="font-bold text-indigo-900">AI Overview</h3>
                </div>
                <p className="text-sm font-medium text-indigo-800/80 leading-relaxed">
                  {aiSummary}
                </p>
              </div>
            )}

            {channelRecommendations && (
              <div className="rounded-[2rem] border border-white bg-white/70 backdrop-blur-md p-8 shadow-sm ring-1 ring-zinc-200/50 mb-6">
                <div className="flex flex-col mb-6">
                  <h3 className="font-black text-zinc-900 border-b border-zinc-100 pb-3 mb-3 text-lg">Recommended Support Channels</h3>
                  <p className="text-xs font-bold text-zinc-500">{channelRecommendations.recommendation_message}</p>
                </div>
                {channelRecommendations.recommended_channels?.length > 0 && (
                  <div className="flex flex-col gap-4">
                    {channelRecommendations.recommended_channels.map((ch, idx) => (
                      <div key={idx} className="flex flex-col p-4 rounded-3xl border border-zinc-100 bg-zinc-50/50 hover:bg-slate-50 transition-all group shadow-sm hover:shadow-md hover:ring-2 hover:ring-indigo-100">
                        <div className="flex items-start justify-between">
                          <div>
                             <h4 className="font-bold text-zinc-900">{ch.channel_name}</h4>
                             <p className="text-[10px] uppercase tracking-[0.1em] font-black text-indigo-500 mt-1">{ch.category}</p>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200/70 shadow-inner">
                             {(ch.confidence * 100).toFixed(0)}% Match
                          </span>
                        </div>
                        <div className="mt-4 pt-3 border-t border-zinc-100">
                           <button className="w-full text-[10px] uppercase font-black tracking-[0.1em] bg-indigo-600 text-white rounded-xl py-3 hover:bg-indigo-700 transition shadow-sm hover:-translate-y-0.5 active:translate-y-0">
                             Join Channel
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <h2 className="text-lg font-bold text-zinc-900 border-b border-zinc-200 pb-2">Active Alerts</h2>
            {alerts.filter(a => a.status === 'unresolved').length === 0 ? (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center shadow-sm">
                <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3 text-emerald-600">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <h3 className="font-bold text-emerald-800">No Unresolved Alerts</h3>
                <p className="text-xs text-emerald-600 mt-1">This adolescent is currently stable.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {alerts.filter(a => a.status === 'unresolved').map((alert) => {
                  const emotions = alert.behavioral_analysis?.emotions || alert.detected_emotions || [];
                  const mainConcern = alert.behavioral_analysis?.concern_category || alert.concern_category || alert.main_concern || "";
                  const aiSummary = alert.behavioral_analysis?.behavioral_summary || alert.ai_summary || alert.message || "";
                  
                  return (
                    <div key={alert._id} className={`rounded-2xl border p-5 shadow-sm ${
                      alert.triggered_by_alert ? 'border-purple-200 bg-purple-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                         <div className="flex items-center gap-2">
                           <span className={`text-xs font-bold text-white px-2 py-1 rounded-md uppercase ${
                             alert.risk_level === 'high' ? 'bg-red-600' : 'bg-orange-600'
                           }`}>
                             {alert.risk_level} Risk
                           </span>
                           {alert.triggered_by_alert && (
                             <span className="text-xs font-bold text-white bg-purple-600 px-2 py-1 rounded-md uppercase flex items-center gap-1">
                               <span>⚡</span> Auto-Approval
                             </span>
                           )}
                         </div>
                         <span className={`text-xs font-medium ${alert.triggered_by_alert ? 'text-purple-600' : 'text-red-500'}`}>
                           Score: {(alert.risk_score * 100).toFixed(0)}%
                         </span>
                      </div>
                      
                      {mainConcern && (
                        <div className="mb-2">
                          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-zinc-800 text-white">
                            {mainConcern}
                          </span>
                        </div>
                      )}
                      
                      {aiSummary && (
                        <p className={`text-xs font-medium leading-relaxed mb-2 ${
                          alert.triggered_by_alert ? 'text-purple-800' : 'text-red-800'
                        }`}>
                          {aiSummary}
                        </p>
                      )}
                      
                      {/* Alert Context for triggered approvals */}
                      {alert.triggered_by_alert && alert.alert_context && (
                        <div className="mt-3 p-3 rounded-xl bg-white/70 border border-purple-200 flex gap-2 mb-2">
                          <div className="shrink-0">
                            <span className="text-lg">⚡</span>
                          </div>
                          <div className="flex-1 text-xs">
                            <p className="font-bold text-purple-900 mb-1">Approval Request Auto-Created</p>
                            {alert.alert_context.detected_keywords && alert.alert_context.detected_keywords.length > 0 && (
                              <p className="text-purple-700">
                                <span className="font-bold">Keywords:</span> {alert.alert_context.detected_keywords.join(", ")}
                              </p>
                            )}
                            <p className="text-purple-600 italic mt-1">
                              Guardian approval pending. Communication will be enabled once approved.
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {emotions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {emotions.slice(0, 4).map((emotion, i) => (
                            <span key={i} className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                              alert.triggered_by_alert 
                                ? 'bg-white/70 text-purple-600 border-purple-200' 
                                : 'bg-white/70 text-red-600 border-red-200'
                            }`}>
                              {emotion}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <p className={`text-xs mt-1 font-medium ${
                        alert.triggered_by_alert ? 'text-purple-700' : 'text-red-700'
                      }`}>
                        Triggered {new Date(alert.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="rounded-2xl border border-zinc-200 bg-zinc-900 text-white p-6 shadow-sm mt-8">
              <h3 className="font-bold mb-4 text-zinc-100">Intervention Protocol</h3>
              <ul className="text-sm space-y-3 text-zinc-400">
                 <li className="flex gap-2">
                   <div className="mt-0.5 bg-indigo-500 w-1.5 h-1.5 rounded-full shrink-0"></div>
                   Review recent AI journal summaries to understand the context.
                 </li>
                 <li className="flex gap-2">
                   <div className="mt-0.5 bg-indigo-500 w-1.5 h-1.5 rounded-full shrink-0"></div>
                   Contact the adolescent via the provided communication channels if a high-risk alert is triggered.
                 </li>
                 <li className="flex gap-2">
                   <div className="mt-0.5 bg-zinc-600 w-1.5 h-1.5 rounded-full shrink-0"></div>
                   Mark alerts as resolved from the dashboard once the intervention is complete.
                 </li>
              </ul>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
