"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  const params = useParams();
  const adolescentId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [journals, setJournals] = useState<Journal[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [patientName, setPatientName] = useState<string>("Adolescent Info");
  const [consent, setConsent] = useState<Consent | null>(null);
  
  // Alert filtering state
  const [alertFilter, setAlertFilter] = useState<'today' | 'week' | 'all'>('today');
  const [showAllAlerts, setShowAllAlerts] = useState(false);

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

        // 3. Fetch Alerts and sort by date (newest first)
        const aRes = await fetch(`/api/proxy/backend/alerts/adolescent/${adolescentId}`);
        if (aRes.ok) {
          const aData = await aRes.json();
          const sortedAlerts = (aData || []).sort((a: Alert, b: Alert) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setAlerts(sortedAlerts);
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
          <div className="text-slate-600 font-medium">Loading case details...</div>
        </div>
      </div>
    );
  }

  const unresolvedAlerts = alerts.filter(a => a.status === 'unresolved');
  
  // Filter alerts by date
  const getFilteredAlerts = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    let filtered = unresolvedAlerts;
    
    if (alertFilter === 'today') {
      filtered = unresolvedAlerts.filter(a => new Date(a.created_at) >= today);
    } else if (alertFilter === 'week') {
      filtered = unresolvedAlerts.filter(a => new Date(a.created_at) >= weekAgo);
    }
    
    // Limit to 5 unless "show all" is clicked
    return showAllAlerts ? filtered : filtered.slice(0, 5);
  };
  
  const filteredAlerts = getFilteredAlerts();
  const hasMoreAlerts = !showAllAlerts && unresolvedAlerts.length > 5;
  
  const channelRecommendations = alerts.find(a => a.channel_recommendations)?.channel_recommendations;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-6 py-4">
          <Link 
            href="/counselor/dashboard" 
            className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all hover:shadow-md"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-slate-900 leading-none tracking-tight">Case Dashboard</h1>
            <p className="text-sm font-semibold text-blue-600 mt-0.5">{patientName}</p>
          </div>
          <Link
            href={`/counselor/adolescent/${adolescentId}/recommendations`}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            View AI Recommendations
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 rounded-2xl border-2 border-red-200 bg-red-50 p-5 text-sm text-red-700 shadow-lg animate-in fade-in slide-in-from-top-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div className="flex-1 font-semibold">{error}</div>
          </div>
        )}

        {/* Consent Warning */}
        {consent && !consent.participation && (
          <div className="mb-6 rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 p-6 shadow-lg animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-amber-200 flex items-center justify-center text-amber-700">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-black text-amber-900 text-lg mb-1">AI Analysis Paused</h3>
                <p className="text-sm text-amber-800 leading-relaxed">
                  Guardian has revoked AI participation consent. Journal analysis and risk detection are currently inactive.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN - Alerts & AI Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* AI Overview */}
            {aiSummary && (
              <div className="rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v10m0 0 8.66-5M12 12l-8.66-5"/>
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                  </div>
                  <h3 className="font-black text-indigo-900 text-lg">AI Overview</h3>
                </div>
                <p className="text-sm font-medium text-indigo-900/80 leading-relaxed">
                  {aiSummary}
                </p>
              </div>
            )}

            {/* Active Alerts */}
            <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Active Alerts
                  <span className="ml-2 text-sm font-bold px-3 py-1 rounded-full bg-red-100 text-red-700">
                    {unresolvedAlerts.length}
                  </span>
                </h2>
              </div>
              
              {/* Date Filter */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => { setAlertFilter('today'); setShowAllAlerts(false); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    alertFilter === 'today' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => { setAlertFilter('week'); setShowAllAlerts(false); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    alertFilter === 'week' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => { setAlertFilter('all'); setShowAllAlerts(false); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    alertFilter === 'all' 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Time
                </button>
              </div>
              
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-3 text-emerald-600">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <h3 className="font-bold text-emerald-800 text-lg">All Clear</h3>
                  <p className="text-sm text-emerald-600 mt-1">
                    {alertFilter === 'today' ? 'No alerts today' : 
                     alertFilter === 'week' ? 'No alerts this week' : 
                     'No unresolved alerts'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {filteredAlerts.map((alert) => {
                    const emotions = alert.behavioral_analysis?.emotions || alert.detected_emotions || [];
                    const mainConcern = alert.behavioral_analysis?.concern_category || alert.concern_category || alert.main_concern || "";
                    const aiSummary = alert.behavioral_analysis?.behavioral_summary || alert.ai_summary || alert.message || "";
                    // Fix: risk_score is 0-1, convert to percentage
                    const riskPercentage = Math.round(alert.risk_score * 100);
                    
                    return (
                      <div 
                        key={alert._id} 
                        className={`rounded-2xl border-2 p-4 transition-all hover:shadow-lg ${
                          alert.triggered_by_alert 
                            ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50' 
                            : 'border-red-200 bg-gradient-to-br from-red-50 to-orange-50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-xs font-black text-white px-3 py-1.5 rounded-lg uppercase shadow-md ${
                              alert.risk_level === 'high' ? 'bg-gradient-to-r from-red-600 to-red-700' : 'bg-gradient-to-r from-orange-600 to-orange-700'
                            }`}>
                              {alert.risk_level} Risk
                            </span>
                            {alert.triggered_by_alert && (
                              <span className="text-xs font-black text-white bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1.5 rounded-lg uppercase flex items-center gap-1 shadow-md">
                                <span>⚡</span> Auto
                              </span>
                            )}
                          </div>
                          <span className={`text-sm font-black ${alert.triggered_by_alert ? 'text-purple-700' : 'text-red-700'}`}>
                            {riskPercentage}%
                          </span>
                        </div>
                        
                        {mainConcern && (
                          <div className="mb-2">
                            <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-900 text-white">
                              {mainConcern}
                            </span>
                          </div>
                        )}
                        
                        {aiSummary && (
                          <p className={`text-xs font-medium leading-relaxed mb-3 ${
                            alert.triggered_by_alert ? 'text-purple-900' : 'text-red-900'
                          }`}>
                            {aiSummary}
                          </p>
                        )}
                        
                        {emotions.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {emotions.slice(0, 4).map((emotion, i) => (
                              <span 
                                key={i} 
                                className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${
                                  alert.triggered_by_alert 
                                    ? 'bg-white/80 text-purple-700 border-purple-300' 
                                    : 'bg-white/80 text-red-700 border-red-300'
                                }`}
                              >
                                {emotion}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <p className={`text-xs font-semibold ${
                          alert.triggered_by_alert ? 'text-purple-600' : 'text-red-600'
                        }`}>
                          {new Date(alert.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    );
                  })}
                  </div>
                  
                  {/* View All History Button */}
                  {hasMoreAlerts && (
                    <button
                      onClick={() => setShowAllAlerts(true)}
                      className="w-full mt-4 px-4 py-3 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 text-sm font-bold hover:from-slate-200 hover:to-slate-300 transition-all flex items-center justify-center gap-2"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                      View All History ({unresolvedAlerts.length} total)
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Consent Status */}
            {consent && (
              <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-xl">
                <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Consent Status
                </h3>
                <div className="space-y-2.5">
                  {[
                    { label: "Participation", val: consent.participation },
                    { label: "AI Summaries", val: consent.share_ai_summaries },
                    { label: "Alerts", val: consent.share_alerts },
                    { label: "Counselor Chat", val: consent.counselor_chat },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center justify-between text-sm p-2.5 rounded-xl bg-slate-50">
                      <span className="text-slate-700 font-semibold">{c.label}</span>
                      <span className={`font-black text-xs px-3 py-1 rounded-lg ${
                        c.val ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                      }`}>
                        {c.val ? "✓ Granted" : "✗ Revoked"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* MIDDLE & RIGHT COLUMNS - Journals & Channels */}
          <div className="lg:col-span-2 space-y-6">
            {/* Support Channels */}
            {channelRecommendations && channelRecommendations.recommended_channels?.length > 0 && (
              <div className="rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 shadow-xl">
                <div className="mb-5">
                  <h3 className="font-black text-blue-900 text-xl mb-2 flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    Recommended Support Channels
                  </h3>
                  <p className="text-sm font-semibold text-blue-700">{channelRecommendations.recommendation_message}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {channelRecommendations.recommended_channels.map((ch, idx) => {
                    // Fix: confidence is 0-1, convert to percentage
                    const confidencePercentage = Math.round(ch.confidence * 100);
                    
                    return (
                      <div 
                        key={idx} 
                        className="rounded-2xl border-2 border-white bg-white/80 backdrop-blur-sm p-5 hover:shadow-xl transition-all hover:-translate-y-1 group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-black text-slate-900 text-base mb-1">{ch.channel_name}</h4>
                            <p className="text-[10px] uppercase tracking-widest font-black text-blue-600">{ch.category}</p>
                          </div>
                          <span className="text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
                            {confidencePercentage}%
                          </span>
                        </div>
                        <button 
                          onClick={() => window.open(`/counselor/channels/${ch.channel_slug}`, '_blank')}
                          className="w-full text-xs uppercase font-black tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl py-3 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg group-hover:-translate-y-0.5"
                        >
                          View Channel
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Journal Timeline */}
            <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-xl">
              <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                Journal History
              </h2>
              
              {journals.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-4 text-slate-400">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <p className="text-slate-500 font-semibold">No journal entries available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {journals.map((j) => (
                    <div 
                      key={j._id} 
                      className="rounded-2xl border-2 border-slate-100 bg-gradient-to-br from-slate-50 to-white p-5 hover:shadow-lg transition-all hover:border-slate-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                          {new Date(j.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs capitalize font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                            {j.mood}
                          </span>
                          {j.risk_level && (
                            <div className={`w-3 h-3 rounded-full ${
                              j.risk_level === 'high' ? 'bg-red-500' : 
                              j.risk_level === 'medium' ? 'bg-orange-500' : 'bg-emerald-500'
                            }`}></div>
                          )}
                        </div>
                      </div>
                      
                      <h4 className="font-bold text-slate-900 text-base mb-2">{j.title || "Untitled Entry"}</h4>
                      
                      {j.content ? (
                        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">{j.content}</p>
                      ) : (
                        <p className="text-sm text-slate-500 italic">Content protected. AI summary available.</p>
                      )}
                      
                      {(j.risk_level || j.sentiment_score !== undefined) && (
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
                          {j.risk_level && (
                            <span className={`text-xs font-black uppercase px-3 py-1 rounded-lg ${
                              j.risk_level === 'high' ? 'bg-red-100 text-red-700' : 
                              j.risk_level === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {j.risk_level} Risk
                            </span>
                          )}
                          {j.sentiment_score !== undefined && (
                            <span className="text-xs font-semibold text-slate-500">
                              Sentiment: {(j.sentiment_score * 10).toFixed(1)}/10
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
