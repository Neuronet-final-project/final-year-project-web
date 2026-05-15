"use client";

import React from 'react';
import StatCard from './StatCard';
import { Users, UserPlus, AlertCircle, Monitor, ShieldCheck, Database, Cpu, HardDrive } from 'lucide-react';

interface OverviewProps {
  data: any;
  recentUsers: any[];
}

export default function OverviewTab({ data, recentUsers }: OverviewProps) {
  const stats = [
    { label: "Total Users", value: data?.total_users || 0, icon: <Users className="h-6 w-6" />, trend: "12%", trendType: "up", color: "#1e40af" },
    { label: "Active Counselors", value: data?.role_counts?.counselor || 0, icon: <UserPlus className="h-6 w-6" />, trend: "3", trendType: "up", color: "#3b82f6" },
    { label: "Total Alerts", value: data?.total_alerts || 0, icon: <AlertCircle className="h-6 w-6" />, trend: "8%", trendType: "down", color: "#0f172a" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat as any} />
        ))}
      </div>

      {/* Recent Registered Table */}
      <div className="w-full overflow-hidden rounded-[2.5rem] border border-indigo-100/60 bg-gradient-to-br from-slate-50/95 via-indigo-50/35 to-violet-50/40 p-6 md:p-8 shadow-[0_8px_30px_rgba(79,70,229,0.08)] backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-xl font-black text-zinc-900 tracking-tight">Recent Activity Log</h3>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Real-time registration feed</p>
            </div>
            <button 
               onClick={() => window.open('/api/proxy/backend/admin/users/export', '_blank')}
               className="flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-xs font-bold text-zinc-500 transition-all hover:bg-zinc-50 active:scale-95"
             >
               Export CSV
             </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  <th className="pb-4">IDENTIFIER</th>
                  <th className="pb-4">CLASSIFICATION</th>
                  <th className="pb-4">STATUS</th>
                  <th className="pb-4">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {recentUsers.length === 0 ? (
                  <tr><td colSpan={4} className="py-16 text-center text-sm font-bold text-zinc-300 italic">No historical activities found.</td></tr>
                ) : recentUsers.map((user, i) => (
                  <tr key={i} className="group hover:bg-zinc-50/50 transition-colors">
                    <td className="py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-zinc-100 to-zinc-200 rounded-xl flex items-center justify-center text-[11px] font-black text-zinc-600 shadow-inner group-hover:scale-110 transition-transform">
                          {user.full_name?.substring(0, 2).toUpperCase() || "U"}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-zinc-800">{user.full_name || "N/A"}</span>
                          <span className="text-[11px] font-medium text-zinc-400">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-100 px-2 py-1 rounded-md">{user.role}</span>
                    </td>
                    <td className="py-5">
                      <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          user.is_active ? 'text-emerald-600' : 'text-red-500'
                        }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="py-5">
                      <span className="text-xs font-bold text-zinc-400">{user.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "--"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      {/* Security Context */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-900 p-6 text-white group">
        <div className="absolute -right-10 -top-10 h-40 w-40 bg-white/5 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-150" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <div className="h-12 w-12 flex-shrink-0 bg-white/10 rounded-2xl flex items-center justify-center text-zinc-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest">Protocol Intelligence Notice</h4>
            <p className="text-[13px] text-zinc-400 mt-1 leading-relaxed">
              All administrative operations are encrypted and audited via high-frequency protocols. Please maintain standard security hygiene (HIPAA/GDPR compliance) when accessing protected health identifiers.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
