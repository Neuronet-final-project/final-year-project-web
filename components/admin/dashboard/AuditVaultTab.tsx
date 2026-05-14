"use client";

import React from 'react';
import { History, Shield, RefreshCw, Activity, Terminal } from 'lucide-react';

interface AuditVaultProps {
  auditLogs: any[];
  auditLoading: boolean;
  loadAuditLogs: () => void;
}

export default function AuditVaultTab({ 
  auditLogs, auditLoading, loadAuditLogs 
}: AuditVaultProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
      {/* Vault Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:px-10 md:py-8 bg-zinc-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
         <div className="relative z-10 flex items-center gap-6">
            <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md">
               <Shield className="h-7 w-7 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Immutable Audit Ledger</h2>
              <p className="text-zinc-400 font-medium text-xs uppercase tracking-widest mt-1">Authorized Activity Logs Only</p>
            </div>
         </div>
         <button 
           onClick={loadAuditLogs}
           className="relative z-10 flex items-center gap-3 px-8 py-4 bg-white text-zinc-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95 shadow-xl shadow-indigo-500/10"
         >
           <RefreshCw className={`h-4 w-4 ${auditLoading ? 'animate-spin' : ''}`} />
           Sync Ledger
         </button>
      </div>

      <div className="overflow-hidden rounded-[3.5rem] border border-white/40 bg-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md min-h-[600px]">
        <div className="p-6 md:p-10 border-b border-zinc-100 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <Terminal className="h-5 w-5 text-zinc-400" />
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Streaming Real-Time System Events</p>
           </div>
           <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-lg">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Live</span>
           </div>
        </div>
        
        <div className="p-4 sm:p-10">
          <div className="grid grid-cols-1 gap-4">
            {auditLoading ? (
              <div className="py-40 text-center flex flex-col items-center gap-4">
                 <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                 <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Decrypting Secure Ledger...</span>
              </div>
            ) : auditLogs.length === 0 ? (
              <div className="py-40 text-center flex flex-col items-center gap-6 text-zinc-300 italic">
                 <History className="h-16 w-16 opacity-10" />
                 <p className="text-lg font-bold">The ledger is currently empty for this sector.</p>
              </div>
            ) : auditLogs.map((log, i) => (
              <div key={i} className="group flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-white/50 border border-zinc-100/50 rounded-[2rem] hover:bg-white hover:shadow-lg hover:shadow-zinc-100/50 transition-all duration-300">
                 <div className="shrink-0 flex items-center gap-4 pr-6 md:border-r border-zinc-100">
                    <div className="h-10 w-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-indigo-500 transition-colors">
                       <Activity className="h-4 w-4" />
                    </div>
                    <div>
                       <p className="text-[11px] font-black text-zinc-900 uppercase tracking-tighter">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                       <p className="text-[10px] font-bold text-zinc-400 mt-0.5">{new Date(log.timestamp).toLocaleDateString()}</p>
                    </div>
                 </div>
                 
                 <div className="shrink-0">
                    <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ring-1 ring-inset ${
                       log.actor_role === 'admin' ? 'bg-zinc-900 text-white ring-zinc-800' : 'bg-indigo-50 text-indigo-700 ring-indigo-200'
                    }`}>
                      {log.actor_role}
                    </span>
                 </div>
  
                 <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-zinc-800 capitalize group-hover:text-indigo-600 transition-colors leading-tight">{log.action_type.replace(/_/g, ' ')}</p>
                    <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">Resource: <span className="text-zinc-600">{log.resource_type}</span></p>
                 </div>
  
                 <div className="shrink-0 hidden xl:block">
                    <div className="px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-[10px] font-black text-zinc-400 uppercase tracking-[0.1em]">
                      ID: {i.toString().padStart(4, '0')}
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
