"use client";

import React from 'react';
import { Search, Bell, User } from 'lucide-react';

interface HeaderProps {
  title: string;
  adminEmail: string;
}

export default function DashboardHeader({ title, adminEmail }: HeaderProps) {
  return (
    <header className="h-20 shrink-0 flex items-center justify-between px-10 bg-white/80 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-30">
      <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">{title}</h2>

      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Search users, logs..." 
            className="w-80 bg-zinc-100 border-none rounded-2xl px-12 py-3 text-sm font-medium focus:ring-2 focus:ring-[#6b21a8]/20 transition-all outline-none"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-[#6b21a8]" />
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl bg-zinc-100 text-zinc-500 hover:bg-zinc-200 transition-all">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[10px] text-white font-bold flex items-center justify-center">3</span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-zinc-200">
          <div className="text-right">
            <p className="text-sm font-bold text-zinc-900 leading-none">System Admin</p>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-1">Super Administrator</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#6b21a8] flex items-center justify-center text-white font-bold shadow-lg shadow-purple-200">
             SA
          </div>
        </div>
      </div>
    </header>
  );
}
