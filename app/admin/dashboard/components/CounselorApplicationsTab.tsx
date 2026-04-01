"use client";

import React from 'react';
import { UserCheck, UserX, Clock, MapPin, Briefcase } from 'lucide-react';

interface CounselorApplicationsProps {
  applications: any[];
  appsLoading: boolean;
  handleApplication: (email: string, action: 'approve' | 'reject') => void;
}

export default function CounselorApplicationsTab({ 
  applications, appsLoading, handleApplication 
}: CounselorApplicationsProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      {/* Header Info */}
      <div className="bg-[#6b21a8] p-10 rounded-[3rem] text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2">Credential Verification</h2>
          <p className="text-white/70 font-medium max-w-xl">Review and approve incoming counselor applications. Verified professionals gain access to adolescent case data and secure messaging.</p>
        </div>
      </div>

      {/* Applications List */}
      <div className="grid grid-cols-1 gap-6">
        {appsLoading ? (
           <div className="p-20 text-center animate-pulse text-zinc-400 font-bold uppercase tracking-widest text-xs">Syncing Pending Requests...</div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 bg-white border-2 border-dashed border-zinc-100 rounded-[3rem] text-zinc-400">
             <Clock className="h-12 w-12 mb-4 opacity-20" />
             <h3 className="text-lg font-bold text-zinc-600">All Caught Up!</h3>
             <p className="text-sm font-medium">No pending counselor applications at this time.</p>
          </div>
        ) : applications.map((app) => (
          <div key={app.email} className="p-8 bg-white border border-zinc-100 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-10 hover:shadow-md transition-all group">
             <div className="flex gap-6 items-center">
                <div className="h-20 w-20 rounded-[1.5rem] bg-zinc-50 border border-zinc-100 flex items-center justify-center text-2xl font-black text-purple-600 shadow-inner group-hover:scale-105 transition-transform">
                  {app.full_name?.substring(0, 1) || "C"}
                </div>
                <div>
                   <div className="flex items-center gap-3 mb-1">
                     <h3 className="text-xl font-bold text-zinc-900">{app.full_name}</h3>
                     <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        app.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                        app.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-rose-50 text-rose-600'
                     }`}>{app.status}</span>
                   </div>
                   <p className="text-sm font-bold text-zinc-400 mb-4">{app.email}</p>
                   
                   <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 rounded-xl border border-zinc-100">
                        <Briefcase className="h-3.5 w-3.5 text-zinc-400" />
                        <span className="text-xs font-bold text-zinc-600">{app.experience_years} Years Experience</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 rounded-xl border border-zinc-100">
                        <UserCheck className="h-3.5 w-3.5 text-zinc-400" />
                        <span className="text-xs font-bold text-zinc-600 truncate max-w-[200px]">{app.qualification}</span>
                      </div>
                   </div>
                </div>
             </div>

             {app.status === 'pending' && (
               <div className="flex items-center gap-3 shrink-0">
                  <button onClick={() => handleApplication(app.email, "approve")} className="px-8 py-4 bg-[#6b21a8] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#581c87] transition-all hover:shadow-lg active:scale-95">Verify & Approve</button>
                  <button onClick={() => handleApplication(app.email, "reject")} className="px-8 py-4 border border-zinc-200 bg-white text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-50 transition-all active:scale-95">Decline</button>
               </div>
             )}
          </div>
        ))}
      </div>
    </div>
  );
}
