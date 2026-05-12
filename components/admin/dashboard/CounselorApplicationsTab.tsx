"use client";

import React, { useState } from 'react';
import { UserCheck, UserX, Clock, MapPin, Briefcase, ShieldCheck, Eye } from 'lucide-react';
import CounselorApplicationDetailModal from './CounselorApplicationDetailModal';

interface CounselorApplicationsProps {
  applications: any[];
  appsLoading: boolean;
  handleApplication: (email: string, action: 'approve' | 'reject') => void;
}

export default function CounselorApplicationsTab({ 
  applications, appsLoading, handleApplication 
}: CounselorApplicationsProps) {
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
      {/* Detail Modal */}
      {selectedApplication && (
        <CounselorApplicationDetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onApprove={(email) => handleApplication(email, 'approve')}
          onReject={(email) => handleApplication(email, 'reject')}
        />
      )}
      {/* Header Info */}
      <div className="bg-zinc-900 p-10 md:p-14 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px] pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md mb-6">
             <ShieldCheck className="h-4 w-4 text-indigo-400" />
             <span className="text-[10px] font-black uppercase tracking-widest">Security Protocol Level 4</span>
          </div>
          <h2 className="text-4xl font-black mb-4 tracking-tighter leading-tight">Credential & Identity Verification</h2>
          <p className="text-zinc-400 font-medium text-lg leading-relaxed">Review incoming counselor petitions. Verified professionals are granted cryptographic access to clinical case data and secure neuro-messaging gateways.</p>
        </div>
      </div>

      {/* Applications List */}
      <div className="grid grid-cols-1 gap-8">
        {appsLoading ? (
            <div className="p-40 text-center flex flex-col items-center gap-4">
               <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
               <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Scanning Petition Database...</span>
            </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-32 rounded-[3.5rem] border border-zinc-100 bg-zinc-50/30 text-zinc-400 shadow-inner">
             <div className="h-20 w-20 rounded-[2.5rem] bg-white shadow-sm flex items-center justify-center mb-8">
                <Clock className="h-8 w-8 opacity-20" />
             </div>
             <h3 className="text-2xl font-black text-zinc-800 tracking-tight">Queue Clear</h3>
             <p className="text-sm font-medium mt-2">No pending counselor applications require administrative attention.</p>
          </div>
        ) : applications.map((app) => (
          <div key={app.email} className="group relative overflow-hidden rounded-[3rem] border border-white/40 bg-white/60 p-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md hover:shadow-xl transition-all duration-500">
             <div className="p-8 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                   <div className="h-24 w-24 rounded-[2rem] bg-white shadow-lg ring-1 ring-zinc-100 flex items-center justify-center text-3xl font-black text-indigo-600 group-hover:scale-105 transition-transform duration-500 shrink-0">
                     {app.full_name?.substring(0, 1) || "C"}
                   </div>
                   <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-2xl font-black text-zinc-900 tracking-tight">{app.full_name}</h3>
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-center shadow-sm ${
                           app.status === 'pending' ? 'bg-orange-50 text-orange-600 ring-1 ring-orange-100' :
                           app.status === 'approved' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100' :
                           'bg-rose-50 text-rose-600 ring-1 ring-rose-100'
                        }`}>{app.status}</span>
                      </div>
                      <p className="text-sm font-bold text-zinc-400">{app.email}</p>
                      
                      <div className="flex flex-wrap gap-3">
                         <div className="flex items-center gap-2.5 px-4 py-2 bg-zinc-50 rounded-2xl border border-zinc-100/50">
                           <Briefcase className="h-4 w-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
                           <span className="text-xs font-black text-zinc-600 uppercase tracking-tight">{app.experience_years}y Tenure</span>
                         </div>
                         <div className="flex items-center gap-2.5 px-4 py-2 bg-zinc-50 rounded-2xl border border-zinc-100/50">
                           <MapPin className="h-4 w-4 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
                           <span className="text-xs font-black text-zinc-600 uppercase tracking-tight truncate max-w-[200px]">{app.qualification}</span>
                         </div>
                         <button
                           onClick={() => setSelectedApplication(app)}
                           className="flex items-center gap-2.5 px-4 py-2 bg-indigo-50 rounded-2xl border border-indigo-100/50 hover:bg-indigo-100 transition-colors"
                         >
                           <Eye className="h-4 w-4 text-indigo-600" />
                           <span className="text-xs font-black text-indigo-600 uppercase tracking-tight">View Details</span>
                         </button>
                      </div>
                   </div>
                </div>
   
                {app.status === 'pending' && (
                  <div className="flex flex-col sm:flex-row items-stretch gap-4 shrink-0">
                     <button 
                        onClick={() => handleApplication(app.email, "approve")}
                        className="h-16 px-10 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-zinc-200 active:scale-95 flex items-center justify-center gap-3 group/btn"
                     >
                        <UserCheck className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                        Verify Professional
                     </button>
                     <button 
                        onClick={() => handleApplication(app.email, "reject")}
                        className="h-16 px-10 border border-zinc-200 bg-white text-zinc-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all active:scale-95 flex items-center justify-center gap-3"
                     >
                        <UserX className="h-4 w-4" />
                        Decline
                     </button>
                  </div>
                )}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
