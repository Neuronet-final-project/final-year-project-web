"use client";

import React from 'react';
import { History, Shield, RefreshCw } from 'lucide-react';

interface AuditVaultProps {
  auditLogs: any[];
  auditLoading: boolean;
  loadAuditLogs: () => void;
}

export default function AuditVaultTab({ 
  auditLogs, auditLoading, loadAuditLogs 
}: AuditVaultProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      {/* Vault Header */}
      <div className="flex items-center justify-between">
         <div>
           <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Audit Vault</h2>
           <p className="text-zinc-500 font-medium mt-1">Immutable system logs documenting all administrative and high-risk events.</p>
         </div>
         <button 
           onClick={loadAuditLogs}
           className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-all shadow-sm"
         >
           <RefreshCw className={`h-4 w-4 ${auditLoading ? 'animate-spin' : ''}`} />
           Sync Latest
         </button>
      </div>

      <div className="bg-white border border-zinc-100 rounded-[3rem] shadow-sm p-4 overflow-hidden min-h-[500px]">
        <div className="p-8 border-b border-zinc-50 flex items-center gap-3">
           <div className="h-8 w-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white">
              <Shield className="h-4 w-4" />
           </div>
           <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Live Activity Log</p>
        </div>
        
        <div className="divide-y divide-zinc-50">
          {auditLoading ? (
            <div className="py-40 text-center animate-pulse text-zinc-300 font-black uppercase tracking-[0.3em] text-xs">Decrypting Ledger...</div>
          ) : auditLogs.length === 0 ? (
            <div className="py-40 text-center flex flex-col items-center gap-4 text-zinc-400">
               <History className="h-10 w-10 opacity-10" />
               <p className="text-sm font-medium">No activity tracked in the current log cycle.</p>
            </div>
          ) : auditLogs.map((log, i) => (
            <div key={i} className="flex items-center gap-8 p-6 hover:bg-purple-50/20 rounded-2xl transition-all group">
               <div className="shrink-0 w-32 border-r border-zinc-100">
                  <p className="text-xs font-black text-zinc-800">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                  <p className="text-[10px] font-bold text-zinc-400 mt-0.5">{new Date(log.timestamp).toLocaleDateString()}</p>
               </div>
               
               <div className="shrink-0">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                     log.actor_role === 'admin' ? 'bg-zinc-900 text-white' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {log.actor_role}
                  </span>
               </div>

               <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-zinc-700 capitalize group-hover:text-[#6b21a8] transition-colors">{log.action_type.replace(/_/g, ' ')}</p>
               </div>

               <div className="shrink-0">
                  <span className="px-3 py-1 bg-zinc-50 border border-zinc-100 rounded-lg text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                    {log.resource_type}
                  </span>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
