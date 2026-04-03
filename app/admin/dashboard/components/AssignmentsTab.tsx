"use client";

import React from 'react';
import { Link2, Send, CheckCircle, AlertTriangle, Users } from 'lucide-react';

interface AssignmentsProps {
  cEmail: string;
  setCEmail: (v: string) => void;
  aEmail: string;
  setAEmail: (v: string) => void;
  assignLoading: boolean;
  assignResult: any;
  handleAssign: (e: React.FormEvent) => void;
}

export default function AssignmentsTab({ 
  cEmail, setCEmail, aEmail, setAEmail, assignLoading, assignResult, handleAssign 
}: AssignmentsProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl mx-auto py-10 px-4">
      <div className="overflow-hidden rounded-[4rem] border border-white/40 bg-white/60 p-[1px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] backdrop-blur-xl">
        <div className="bg-white/80 rounded-[3.9rem] p-10 md:p-16 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="h-20 w-20 bg-zinc-900 rounded-[2.5rem] flex items-center justify-center text-white mb-10 shadow-2xl shadow-indigo-100 ring-8 ring-indigo-50">
               <Link2 className="h-8 w-8" />
            </div>
            
            <h2 className="text-4xl font-black tracking-tighter text-zinc-900 mb-4">Relational Node Link</h2>
            <p className="text-zinc-500 font-medium max-w-md leading-relaxed mb-12">
              Manually establish an encrypted administrative bridge between a verified Counselor and an Adolescent account.
            </p>

            <form onSubmit={handleAssign} className="w-full space-y-10 group">
              <div className="space-y-4 text-left">
                <label className="flex items-center gap-3 text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] px-2">
                  <Users className="h-3.5 w-3.5 text-indigo-500" />
                  Primary Counselor Email
                </label>
                <div className="relative">
                   <input 
                     type="email" 
                     value={cEmail}
                     onChange={e => setCEmail(e.target.value)}
                     required
                     className="w-full bg-zinc-50/50 border border-zinc-100 rounded-3xl px-8 py-5 text-sm font-bold text-zinc-900 focus:bg-white focus:ring-8 focus:ring-indigo-600/5 focus:border-indigo-600/20 transition-all outline-none" 
                     placeholder="counselor_unique_id@neuronet.ai"
                   />
                </div>
              </div>

              <div className="space-y-4 text-left">
                <label className="flex items-center gap-3 text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] px-2">
                  <Users className="h-3.5 w-3.5 text-cyan-500" />
                  Target Adolescent Email
                </label>
                <div className="relative">
                   <input 
                     type="email" 
                     value={aEmail}
                     onChange={e => setAEmail(e.target.value)}
                     required
                     className="w-full bg-zinc-50/50 border border-zinc-100 rounded-3xl px-8 py-5 text-sm font-bold text-zinc-900 focus:bg-white focus:ring-8 focus:ring-indigo-600/5 focus:border-indigo-600/20 transition-all outline-none" 
                     placeholder="adolescent_subject@user.com"
                   />
                </div>
              </div>

              {assignResult && (
                <div className={`p-6 rounded-[2rem] flex items-center gap-4 text-xs font-black uppercase tracking-widest animate-in zoom-in-95 border ${
                  assignResult.ok 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-lg shadow-emerald-50' 
                    : 'bg-rose-50 text-rose-700 border-rose-100 shadow-lg shadow-rose-50'
                }`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${assignResult.ok ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                    {assignResult.ok ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                  </div>
                  {assignResult.msg}
                </div>
              )}

              <button 
                type="submit"
                disabled={assignLoading}
                className="w-full h-16 bg-zinc-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-zinc-200 disabled:opacity-50 flex items-center justify-center gap-3 group/btn"
              >
                {assignLoading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Synchronizing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    Initialize Assignment
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
