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
      <div className="group relative overflow-hidden rounded-[2rem] border border-red-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow">
        <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-red-400 to-orange-500" />
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500 transition-transform group-hover:scale-110">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
        </div>
        <div className="text-4xl font-extrabold text-zinc-900">{activeAlerts}</div>
        <p className="mt-1 text-sm font-medium text-zinc-500">Active Alerts</p>
      </div>

      {/* 2. Assigned Adolescents */}
      <div className="group relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow">
        <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-emerald-400 to-green-500" />
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 transition-transform group-hover:scale-110">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div className="text-4xl font-extrabold text-zinc-900">{assignedAdolescents}</div>
        <p className="mt-1 text-sm font-medium text-zinc-500">Assigned Adolescents</p>
      </div>

      {/* 3. Unread Messages */}
      <Link href="/counselor/chat" className="group relative overflow-hidden rounded-[2rem] border border-blue-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md hover:-translate-y-1 transition-all block">
        <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-blue-400 to-cyan-500" />
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-500 transition-transform group-hover:scale-110">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <div className="text-4xl font-extrabold text-zinc-900">{unreadMessages}</div>
        <p className="mt-1 text-sm font-medium text-zinc-500">Total Conversations</p>
      </Link>

      {/* 4. Active Channels */}
      <Link href="/counselor/chat" className="group relative overflow-hidden rounded-[2rem] border border-purple-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md hover:-translate-y-1 transition-all block">
        <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-purple-400 to-fuchsia-500" />
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-500 transition-transform group-hover:scale-110">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
        </div>
        <div className="text-4xl font-extrabold text-zinc-900">{activeChannels}</div>
        <p className="mt-1 text-sm font-medium text-zinc-500">Active Channels</p>
      </Link>
    </div>
  );
}
