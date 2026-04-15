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
    { label: "Total Users", value: data?.total_users || 0, icon: <Users className="h-5 w-5" />, trend: "12%", trendType: "up", color: "#4F46E5" },
    { label: "Active Counselors", value: data?.role_counts?.counselor || 0, icon: <UserPlus className="h-5 w-5" />, trend: "3", trendType: "up", color: "#06B6D4" },
    { label: "Total Alerts", value: data?.total_alerts || 0, icon: <AlertCircle className="h-5 w-5" />, trend: "8%", trendType: "down", color: "#F59E0B" },
    { label: "System Health", value: "99.9%", icon: <Monitor className="h-5 w-5" />, color: "#8B5CF6" },
  ];

  const systemHealth = [
    { name: "API Server", desc: "Edge Nodes Active", value: 98, color: "#10b981", icon: <Monitor className="h-4 w-4" /> },
    { name: "Database", desc: "Cloud Clusters", value: 72, color: "#3b82f6", icon: <Database className="h-4 w-4" /> },
    { name: "AI Service", desc: "Analysis Engine", value: 85, color: "#f59e0b", icon: <Cpu className="h-4 w-4" /> },
    { name: "Storage", desc: "Asset Vault", value: 45, color: "#8b5cf6", icon: <HardDrive className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat as any} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Registered Table */}
        <div className="lg:col-span-2 overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-xl font-black text-zinc-900 tracking-tight">Recent Activity Log</h3>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Real-time registration feed</p>
            </div>
            <div className="flex gap-2">
               <button 
                 onClick={() => window.open('/api/proxy/backend/admin/users/export', '_blank')}
                 className="flex h-10 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-xs font-bold text-zinc-500 transition-all hover:bg-zinc-50 active:scale-95"
               >
                 Export CSV
               </button>
               <button 
                 onClick={() => {
                   const sidebar = document.querySelector('[data-tab="users"]') as HTMLElement;
                   if (sidebar) sidebar.click();
                 }}
                 className="flex h-10 items-center justify-center space-x-2 rounded-xl bg-zinc-900 px-4 text-xs font-bold text-white transition-all hover:bg-zinc-800 active:scale-95"
               >
                 <span>Add Entry</span>
               </button>
            </div>
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

        {/* System Health Card */}
        <div className="overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-zinc-900 tracking-tight">System Status</h3>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Operational integrity</p>
            </div>
            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.4)]" />
          </div>
          
          <div className="space-y-9 flex-1">
            {systemHealth.map((item, i) => (
              <div key={i} className="space-y-4 group">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-4">
                      <div 
                        className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm transition-all group-hover:bg-white group-hover:scale-110"
                        style={{ backgroundColor: `${item.color}10`, color: item.color }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-800 leading-none">{item.name}</p>
                        <p className="text-[11px] font-medium text-zinc-400 mt-2">{item.desc}</p>
                      </div>
                   </div>
                   <span className="text-sm font-black text-zinc-900">{item.value}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-200/50 rounded-full overflow-hidden p-[1px]">
                   <div 
                     className="h-full rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${item.value}%`, backgroundColor: item.color }} 
                   />
                </div>
              </div>
            ))}
          </div>

          <button className="mt-10 w-full rounded-2xl bg-zinc-100 py-3 text-xs font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-200 transition-colors">
            Access Full Ledger
          </button>
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
          <div className="md:ml-auto">
            <button className="px-5 py-2 bg-white text-zinc-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all">Details</button>
          </div>
        </div>
      </div>
    </div>
  );
}
