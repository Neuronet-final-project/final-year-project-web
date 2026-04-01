"use client";

import React from 'react';
import { Link2, Send, CheckCircle2, AlertTriangle, Users } from 'lucide-react';

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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl mx-auto py-10">
      <div className="bg-white border border-zinc-100 p-12 rounded-[3.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#6b21a8]/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="h-16 w-16 bg-[#6b21a8] rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-purple-200">
             <Link2 className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 mb-2">Relational Mapping</h2>
          <p className="text-zinc-500 font-medium mb-12 leading-relaxed">
            Securely link a verified counselor to an adolescent. This enables dedicated oversight, private journaling access, and emergency alert routing.
          </p>

          <form onSubmit={handleAssign} className="space-y-8">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] px-1">
                <Users className="h-3 w-3" />
                Verified Counselor Email
              </label>
              <input 
                type="email" 
                value={cEmail}
                onChange={e => setCEmail(e.target.value)}
                required
                className="w-full bg-zinc-50 border-none rounded-2xl px-6 py-5 text-sm font-bold text-zinc-900 focus:bg-white focus:ring-4 focus:ring-purple-100 transition-all outline-none" 
                placeholder="counselor@neuronets.org"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] px-1">
                <Users className="h-3 w-3" />
                Assigned Adolescent Email
              </label>
              <input 
                type="email" 
                value={aEmail}
                onChange={e => setAEmail(e.target.value)}
                required
                className="w-full bg-zinc-50 border-none rounded-2xl px-6 py-5 text-sm font-bold text-zinc-900 focus:bg-white focus:ring-4 focus:ring-purple-100 transition-all outline-none" 
                placeholder="adolescent@user.com"
              />
            </div>

            {assignResult && (
              <div className={`p-5 rounded-2xl flex items-center gap-3 text-xs font-bold animate-in zoom-in-95 border ${
                assignResult.ok 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                  : 'bg-red-50 text-red-700 border-red-100'
              }`}>
                {assignResult.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                {assignResult.msg}
              </div>
            )}

            <button 
              type="submit"
              disabled={assignLoading}
              className="w-full py-5 bg-[#6b21a8] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#581c87] transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-purple-100 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {assignLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Establishing Link...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Confirm Assignment
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
