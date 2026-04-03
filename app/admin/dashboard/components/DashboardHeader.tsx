"use client";

import React from 'react';
import { Search, Bell, User } from 'lucide-react';

interface HeaderProps {
  title: string;
  adminEmail: string;
}

export default function DashboardHeader({ title, adminEmail }: HeaderProps) {
  return (
    <header className="h-20 shrink-0 flex items-center justify-between px-10 bg-white/40 backdrop-blur-md border-b border-white/60 sticky top-0 z-30 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
      <div className="flex flex-col">
        <h2 className="text-xl font-black text-zinc-900 tracking-tight leading-tight">{title}</h2>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-1.5">Administrative Node</p>
      </div>

      <div className="flex items-center gap-8">
        {/* Search Bar */}
        <div className="relative group hidden xl:block">
          <input 
            type="text" 
            placeholder="Query user database, logs, or settings..." 
            className="w-96 bg-zinc-100/50 border border-zinc-200/50 rounded-2xl px-12 py-3 text-[13px] font-medium focus:ring-4 focus:ring-indigo-600/10 focus:bg-white focus:border-indigo-600/20 transition-all outline-none"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-3">
          <button className="relative p-2.5 rounded-xl bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition-all active:scale-90">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 border-2 border-white rounded-full text-[9px] text-white font-black flex items-center justify-center">3</span>
          </button>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-4 pl-8 border-l border-zinc-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-zinc-900 leading-none">System Admin</p>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Level 4 Auth</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-indigo-100 ring-4 ring-indigo-50 border border-white">
             SA
          </div>
        </div>
      </div>
    </header>
  );
}
