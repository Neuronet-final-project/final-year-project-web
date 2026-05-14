"use client";

import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, AlertTriangle, Users, Bot, Activity, Search } from 'lucide-react';

interface AssignmentsProps {
  assignLoading: boolean;
  assignResult: any;
  setAssignResult: (val: any) => void;
  handleAssign: (cEmail: string, aEmail: string) => void;
}

export default function AssignmentsTab({ 
  assignLoading, assignResult, setAssignResult, handleAssign 
}: AssignmentsProps) {
  const [context, setContext] = useState<any>(null);
  const [ctxLoading, setCtxLoading] = useState(true);
  const [selectedAdolescent, setSelectedAdolescent] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [recLoading, setRecLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchContext();
  }, []);

  useEffect(() => {
    if (assignResult?.ok) {
      const timer = setTimeout(() => {
        setSelectedAdolescent(null);
        setRecommendations([]);
        fetchContext();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [assignResult]);

  async function fetchContext() {
    setCtxLoading(true);
    try {
      const res = await fetch("/api/proxy/backend/dashboard/admin/assignments/context");
      if (res.ok) setContext(await res.json());
    } catch {}
    setCtxLoading(false);
  }

  async function selectAdolescent(adol: any) {
    setSelectedAdolescent(adol);
    setAssignResult(null);
    setRecLoading(true);
    setRecommendations([]);
    try {
      const res = await fetch("/api/proxy/backend/dashboard/admin/assignments/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adolescent_email: adol.email })
      });
      if (res.ok) setRecommendations(await res.json());
    } catch {}
    setRecLoading(false);
  }

  const unassigned = context?.unassigned_adolescents || [];
  const filteredUnassigned = unassigned.filter((a: any) => 
    a.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 lg:h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-8">
      {/* Left Panel: Queue */}
      <div className="w-full lg:w-1/3 flex flex-col bg-white/60 border border-white/40 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md overflow-hidden">
        <div className="p-8 border-b border-zinc-100/50 bg-zinc-50/30">
          <h3 className="text-xl font-black text-zinc-900 tracking-tight">Unassigned Queue</h3>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Pending Processing</p>
          
          <div className="mt-6 relative">
             <input 
               type="text" 
               placeholder="Search registry..." 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="w-full bg-white border border-zinc-200/50 rounded-2xl px-10 py-3 text-xs font-bold text-zinc-900 focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600/20 transition-all outline-none"
             />
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {ctxLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400">
               <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
               <span className="text-[10px] font-black uppercase tracking-widest">Querying Matrix...</span>
            </div>
          ) : filteredUnassigned.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400">
               <CheckCircle className="h-10 w-10 text-emerald-400 mb-4" />
               <span className="text-xs font-black uppercase tracking-widest text-emerald-600 text-center">All Users Assigned</span>
            </div>
          ) : (
            filteredUnassigned.map((adol: any) => (
              <button 
                key={adol.id}
                onClick={() => selectAdolescent(adol)}
                className={`w-full p-4 rounded-2xl border text-left transition-all ${
                  selectedAdolescent?.id === adol.id
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20"
                    : "bg-white border-zinc-100 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-900"
                }`}
              >
                 <h4 className="text-sm font-black">{adol.full_name || "Unverified User"}</h4>
                 <p className={`text-[10px] uppercase font-bold mt-1 ${selectedAdolescent?.id === adol.id ? "text-indigo-200" : "text-zinc-400"}`}>{adol.email}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Panel: Engine */}
      <div className="w-full lg:w-2/3 flex flex-col bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="p-10 border-b border-zinc-800 flex justify-between items-center z-10">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <Bot className="h-6 w-6 text-indigo-400" /> Smart Match Engine
            </h3>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-2">{selectedAdolescent ? `Evaluating: ${selectedAdolescent.full_name}` : "Awaiting Target Selection"}</p>
          </div>
          {selectedAdolescent && <Activity className="h-8 w-8 text-amber-400 animate-pulse" />}
        </div>

        <div className="flex-1 overflow-y-auto p-10 z-10 relative">
          {!selectedAdolescent && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600">
               <Users className="h-16 w-16 mb-6 opacity-20" />
               <p className="text-xs font-bold uppercase tracking-[0.2em]">Select an unassigned unit from the queue</p>
            </div>
          )}

          {selectedAdolescent && recLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-indigo-400">
               <Activity className="h-12 w-12 mb-6 animate-pulse" />
               <p className="text-xs font-black uppercase tracking-[0.3em] animate-pulse">Running Neural Heuristics...</p>
            </div>
          )}

          {selectedAdolescent && !recLoading && recommendations.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500">
               <AlertTriangle className="h-12 w-12 mb-6 opacity-20" />
               <p className="text-xs font-bold uppercase tracking-[0.2em] text-center w-2/3">No active counselors available to map to this user.<br/>Ensure counselors are registered and active.</p>
            </div>
          )}

          {selectedAdolescent && !recLoading && recommendations.length > 0 && (
            <div className="space-y-6">
              {assignResult && (
                <div className={`p-6 rounded-[2rem] flex items-center gap-4 text-xs font-black uppercase tracking-widest border ${
                  assignResult.ok 
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-900' 
                    : 'bg-rose-950 text-rose-400 border-rose-900'
                }`}>
                  {assignResult.ok ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                  {assignResult.msg}
                </div>
              )}

              {recommendations.map((rec: any, idx: number) => (
                <div key={rec.counselor_email} className="bg-black/40 border border-white/5 rounded-3xl p-6 hover:bg-black/60 transition-colors group relative overflow-hidden">
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h4 className="text-lg font-black text-white">{rec.counselor_name || "Verified Counselor"}</h4>
                        {idx === 0 && (
                          <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                            Top Match
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 font-medium leading-relaxed">{rec.reason}</p>
                      <div className="flex items-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                          <div className={`h-2.5 w-2.5 rounded-full ${rec.match_score > 80 ? "bg-emerald-400 shadow-[0_0_10px_#34d399]" : "bg-amber-400 shadow-[0_0_10px_#fbbf24]"}`} />
                          <span className="text-[11px] font-black text-white">{rec.match_score}% Affinity</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 text-zinc-500" />
                          <span className="text-[11px] font-bold text-zinc-400">Load: {rec.current_load}/{rec.max_load} assigned</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleAssign(rec.counselor_email, selectedAdolescent.email)}
                      disabled={assignLoading}
                      className="shrink-0 h-14 bg-indigo-600 text-white rounded-2xl px-8 flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50 w-full md:w-auto"
                    >
                      {assignLoading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="h-4 w-4" />}
                      Assign Counselor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
