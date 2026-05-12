import React from "react";
import Link from "next/link";
import { AlertCircle, Users, MessageSquare, Radio, BookOpen } from "lucide-react";

type StatCardsProps = {
  activeAlerts: number;
  assignedAdolescents: number;
  unreadMessages: number;
  activeChannels: number;
  articlesCount: number;
};

export default function StatCards({
  activeAlerts,
  assignedAdolescents,
  unreadMessages,
  activeChannels,
  articlesCount,
}: StatCardsProps) {
  const stats = [
    { 
      label: "Active Alerts", 
      value: activeAlerts, 
      icon: AlertCircle, 
      color: "text-red-600", 
      bg: "bg-red-50", 
      border: "border-red-200", 
      href: "/counselor/alerts",
      desc: "Emergency pings"
    },
    { 
      label: "Assignments", 
      value: assignedAdolescents, 
      icon: Users, 
      color: "text-blue-600", 
      bg: "bg-blue-50", 
      border: "border-blue-200", 
      href: "/counselor/assignments",
      desc: "Managed cases"
    },
    { 
      label: "Direct Chat", 
      value: unreadMessages, 
      icon: MessageSquare, 
      color: "text-slate-600", 
      bg: "bg-slate-50", 
      border: "border-slate-200", 
      href: "/counselor/chat",
      desc: "Secure messages"
    },
    { 
      label: "Live Topics", 
      value: activeChannels, 
      icon: Radio, 
      color: "text-blue-600", 
      bg: "bg-blue-50", 
      border: "border-blue-200", 
      href: "/counselor/channels",
      desc: "Group broadcasts"
    },
    { 
      label: "Educational", 
      value: articlesCount, 
      icon: BookOpen, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50", 
      border: "border-emerald-200", 
      href: "/counselor/educational",
      desc: "Learning resources"
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mt-8">
      {stats.map((stat, i) => (
        <Link 
          key={i} 
          href={stat.href}
          className="group relative flex flex-col items-start overflow-hidden rounded-2xl border bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-slate-200 hover:border-blue-300"
        >
          <div className="flex w-full items-start justify-between mb-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color} border ${stat.border} shadow-sm group-hover:scale-110 transition-transform`}>
              <stat.icon className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div className={`text-4xl font-black ${stat.color} tracking-tighter`}>{stat.value}</div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{stat.label}</h3>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1">{stat.desc}</p>
          </div>

          <div className="absolute -bottom-2 -right-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <stat.icon className={`h-20 w-20 ${stat.color}`} />
          </div>
        </Link>
      ))}
    </div>
  );
}
