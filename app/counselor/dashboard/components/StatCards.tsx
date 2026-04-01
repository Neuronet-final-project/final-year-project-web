import React from "react";
import Link from "next/link";
import { AlertCircle, Users, MessageSquare, Radio } from "lucide-react";

type StatCardsProps = {
  activeAlerts: number;
  assignedAdolescents: number;
  unreadMessages: number;
  activeChannels: number;
};

export default function StatCards({
  activeAlerts,
  assignedAdolescents,
  unreadMessages,
  activeChannels,
}: StatCardsProps) {
  const stats = [
    { label: "Active Alerts", value: activeAlerts, icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { label: "Assignments", value: assignedAdolescents, icon: Users, color: "text-indigo-400", bg: "bg-indigo-600/10", border: "border-indigo-500/20" },
    { label: "Unread Msgs", value: unreadMessages, icon: MessageSquare, color: "text-cyan-400", bg: "bg-cyan-600/10", border: "border-cyan-500/20" },
    { label: "Live Channels", value: activeChannels, icon: Radio, color: "text-emerald-400", bg: "bg-emerald-600/10", border: "border-emerald-500/20" },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-10">
      {stats.map((stat, i) => (
        <div key={i} className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#09090b] p-8 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-white/10">
          <div className={`absolute top-0 right-0 h-32 w-32 rounded-full ${stat.bg} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
          
          <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-[1.25rem] ${stat.bg} ${stat.color} border ${stat.border} shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
            <stat.icon className="h-8 w-8" />
          </div>

          <div className="relative">
            <div className="text-5xl font-black text-white tracking-tighter mb-2 group-hover:scale-105 transition-transform origin-left">{stat.value}</div>
            <p className="text-xs font-black uppercase tracking-widest text-zinc-500">{stat.label}</p>
          </div>

          <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
             <stat.icon className="h-12 w-12 text-white" />
          </div>
        </div>
      ))}
    </div>
  );
}
