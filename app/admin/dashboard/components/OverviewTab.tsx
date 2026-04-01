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
    { label: "Total Users", value: data?.total_users || "1,247", icon: <Users className="h-6 w-6" />, trend: "12%", trendType: "up", color: "#10b981" },
    { label: "Active Counselors", value: data?.role_counts?.counselor || "28", icon: <UserPlus className="h-6 w-6" />, trend: "3", trendType: "up", color: "#3b82f6" },
    { label: "Alerts This Week", value: data?.total_alerts || "156", icon: <AlertCircle className="h-6 w-6" />, trend: "8%", trendType: "down", color: "#f59e0b" },
    { label: "System Uptime", value: "99.9%", icon: <Monitor className="h-6 w-6" />, color: "#8b5cf6" },
  ];

  const systemHealth = [
    { name: "API Server", desc: "Response time: 45ms", value: 98, color: "#10b981", icon: <Monitor className="h-4 w-4" /> },
    { name: "Database", desc: "PostgreSQL + MongoDB", value: 72, color: "#3b82f6", icon: <Database className="h-4 w-4" /> },
    { name: "AI Service", desc: "NLP Processing", value: 85, color: "#f59e0b", icon: <Cpu className="h-4 w-4" /> },
    { name: "Storage", desc: "AWS S3 Buckets", value: 45, color: "#8b5cf6", icon: <HardDrive className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat as any} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Registered Table */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-zinc-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-zinc-900">Recent User Registrations</h3>
            <div className="flex gap-2">
               <button className="px-4 py-2 text-xs font-bold text-zinc-500 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all">Export</button>
               <button className="px-4 py-2 text-xs font-bold text-white bg-[#6b21a8] rounded-xl hover:bg-[#581c87] transition-all flex items-center gap-2">
                 <span>+ Add User</span>
               </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase text-zinc-400 border-b border-zinc-50">
                  <th className="pb-4">USER</th>
                  <th className="pb-4">ROLE</th>
                  <th className="pb-4">STATUS</th>
                  <th className="pb-4">REGISTERED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {recentUsers.length === 0 ? (
                  <tr><td colSpan={4} className="py-10 text-center text-zinc-400">No recent registrations.</td></tr>
                ) : recentUsers.map((user, i) => (
                  <tr key={i} className="group">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                          ['bg-emerald-500', 'bg-rose-500', 'bg-blue-500', 'bg-amber-500'][i % 4]
                        }`}>
                          {user.full_name?.substring(0, 2) || "U"}
                        </div>
                        <span className="text-sm font-bold text-zinc-700">{user.full_name || user.email}</span>
                      </div>
                    </td>
                    <td className="py-4 font-bold text-xs text-zinc-400 capitalize">{user.role}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        user.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {user.is_active ? 'Active' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 text-xs font-bold text-zinc-400">{user.created_at ? new Date(user.created_at).toLocaleDateString() : "Dec 24, 2025"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health Card */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-zinc-100 p-8 flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold text-zinc-900">System Health</h3>
            <button className="text-xs font-bold text-[#6b21a8] hover:underline">View Details →</button>
          </div>
          <div className="space-y-8 flex-1">
            {systemHealth.map((item, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-zinc-50 rounded-lg text-zinc-400 group-hover:text-zinc-600 transition-colors">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-700 leading-none">{item.name}</p>
                        <p className="text-[10px] font-medium text-zinc-400 mt-1">{item.desc}</p>
                      </div>
                   </div>
                   <span className="text-sm font-black text-zinc-900">{item.value}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                   <div 
                     className="h-full rounded-full" 
                     style={{ width: `${item.value}%`, backgroundColor: item.color }} 
                   />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-[#6b21a8]/5 border border-[#6b21a8]/10 rounded-2xl p-4 flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-[#6b21a8]" />
        <p className="text-xs font-bold text-[#6b21a8]/80">
          Security Notice: All administrative actions are logged and monitored. Ensure compliance with data protection regulations (HIPAA, FERPA, COPPA) when managing user data.
        </p>
      </div>
    </div>
  );
}
