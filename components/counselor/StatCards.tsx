import React from "react";
import Link from "next/link";

type StatCardsProps = {
  activeAlerts: number;
  assignedAdolescents: number;
  unreadMessages: number;
  activeChannels: number;
};

export function StatCards({
  activeAlerts,
  assignedAdolescents,
  unreadMessages,
  activeChannels,
}: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-8">
      {/* 1. Active Alerts */}
      <div className="group relative overflow-hidden rounded-[2rem] border border-white/40 bg-white/80 backdrop-blur-md p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(99,102,241,0.15)] hover:-translate-y-1 transition-all duration-300">
        <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-[#6366f1] to-indigo-400" />
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-500/5 blur-2xl transition-all group-hover:bg-indigo-500/10" />
        <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-white text-indigo-500 shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 border border-indigo-100/50">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
        </div>
        <div className="relative text-4xl font-black text-zinc-900 tracking-tight">{activeAlerts}</div>
        <p className="relative mt-1 text-sm font-semibold text-zinc-500">Active Alerts</p>
      </div>

      {/* 2. Assigned Adolescents */}
      <div className="group relative overflow-hidden rounded-[2rem] border border-white/40 bg-white/80 backdrop-blur-md p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(99,102,241,0.15)] hover:-translate-y-1 transition-all duration-300">
        <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-indigo-400 to-[#06b6d4]" />
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-500/5 blur-2xl transition-all group-hover:bg-[#06b6d4]/10" />
        <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-cyan-50 text-[#06b6d4] shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 border border-cyan-100/50">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div className="relative text-4xl font-black text-zinc-900 tracking-tight">{assignedAdolescents}</div>
        <p className="relative mt-1 text-sm font-semibold text-zinc-500">Assigned Adolescents</p>
      </div>

      {/* 3. Unread Messages */}
      <Link href="/counselor/chat" className="group relative overflow-hidden rounded-[2rem] border border-white/40 bg-white/80 backdrop-blur-md p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(6,182,212,0.15)] hover:-translate-y-1 transition-all duration-300 block">
        <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-[#06b6d4] to-cyan-400" />
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#06b6d4]/5 blur-2xl transition-all group-hover:bg-[#06b6d4]/10" />
        <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-50 to-white text-[#06b6d4] shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 border border-cyan-100/50">
           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div className="relative text-4xl font-black text-zinc-900 tracking-tight">{unreadMessages}</div>
        <p className="relative mt-1 text-sm font-semibold text-zinc-500">Direct Messages</p>
      </Link>

      {/* 4. Active Channels */}
      <Link href="/counselor/channels" className="group relative overflow-hidden rounded-[2rem] border border-white/40 bg-white/80 backdrop-blur-md p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgb(99,102,241,0.15)] hover:-translate-y-1 transition-all duration-300 block">
        <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-indigo-400 to-[#6366f1]" />
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-500/5 blur-2xl transition-all group-hover:bg-indigo-500/10" />
        <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-white text-[#6366f1] shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 border border-indigo-100/50">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
        </div>
        <div className="relative text-4xl font-black text-zinc-900 tracking-tight">{activeChannels}</div>
        <p className="relative mt-1 text-sm font-semibold text-zinc-500">Active Channels</p>
      </Link>
    </div>
  );
}
