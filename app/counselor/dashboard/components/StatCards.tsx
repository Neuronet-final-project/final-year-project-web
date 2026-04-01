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
    { 
      label: "Active Alerts", 
      value: activeAlerts, 
      icon: AlertCircle, 
      color: "text-rose-600", 
      bg: "bg-rose-50", 
      border: "border-rose-100", 
      href: "/counselor/dashboard#alerts",
      desc: "Emergency pings"
    },
    { 
      label: "Assignments", 
      value: assignedAdolescents, 
      icon: Users, 
      color: "text-indigo-600", 
      bg: "bg-indigo-50", 
      border: "border-indigo-100", 
      href: "/counselor/dashboard",
      desc: "Managed cases"
    },
    { 
      label: "Direct Chat", 
      value: unreadMessages, 
      icon: MessageSquare, 
      color: "text-cyan-600", 
      bg: "bg-cyan-50", 
      border: "border-cyan-100", 
      href: "/counselor/chat",
      desc: "Secure messages"
    },
    { 
      label: "Live Topics", 
      value: activeChannels, 
      icon: Radio, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50", 
      border: "border-emerald-100", 
      href: "/counselor/channels",
      desc: "Group broadcasts"
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-8">
      {stats.map((stat, i) => (
        <Link 
          key={i} 
          href={stat.href}
          className="group relative flex flex-col items-start overflow-hidden rounded-[2rem] border border-white bg-white/70 backdrop-blur-md p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1 ring-1 ring-zinc-200/50 hover:ring-indigo-200"
        >
          <div className="flex w-full items-start justify-between mb-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color} border ${stat.border} shadow-sm group-hover:scale-110 transition-transform`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div className={`text-4xl font-black ${stat.color} tracking-tighter`}>{stat.value}</div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">{stat.label}</h3>
            <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest mt-1">{stat.desc}</p>
          </div>

          <div className="absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <stat.icon className={`h-16 w-16 ${stat.color}`} />
          </div>
        </Link>
      ))}
    </div>
  );
}
