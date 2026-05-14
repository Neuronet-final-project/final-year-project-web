"use client";

import React, { useState, useEffect } from 'react';
import { Search, Bell, X, ShieldAlert, CheckCircle, Info } from 'lucide-react';

interface HeaderProps {
  title: string;
  onProfileClick?: () => void;
}

export default function DashboardHeader({ title, onProfileClick }: HeaderProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const intv = setInterval(fetchNotifications, 15000); // 15s poll
    return () => clearInterval(intv);
  }, []);

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/proxy/backend/dashboard/admin/notifications");
      if (res.ok) setNotifications(await res.json());
    } catch {}
  }

  return (
    <header className="h-20 shrink-0 flex items-center justify-between px-6 md:px-10 bg-white/40 backdrop-blur-md border-b border-white/60 sticky top-0 z-30 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
      <div className="flex items-center gap-4">
        {/* MOBILE TOGGLE */}
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('open-admin-mobile-sidebar'))}
          className="lg:hidden p-2 rounded-xl bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>

        <div className="flex flex-col">
          <h2 className="text-lg md:text-xl font-black text-zinc-900 tracking-tight leading-tight truncate max-w-[150px] md:max-w-none">{title}</h2>
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-1.5">Administrative Node</p>
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* Search Bar */}
        <div className="relative group hidden xl:block">
          <input 
            type="text" 
            placeholder="Query user database, logs, or settings..." 
            className="w-96 bg-zinc-100/50 border border-zinc-200/50 rounded-2xl px-12 py-3 text-[13px] font-medium text-zinc-900 focus:ring-4 focus:ring-indigo-600/10 focus:bg-white focus:border-indigo-600/20 transition-all outline-none"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-3 relative">
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2.5 rounded-xl bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 transition-all active:scale-90"
          >
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 border-2 border-white rounded-full text-[9px] text-white font-black flex items-center justify-center animate-pulse">
                {notifications.length}
              </span>
            )}
          </button>
          
          {/* Notifications Dropdown */}
          {showNotifs && (
            <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4">
              <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <span className="text-xs font-black text-zinc-900 uppercase tracking-widest">Active Alerts</span>
                <button onClick={() => setShowNotifs(false)} className="text-zinc-400 hover:text-zinc-900"><X className="h-4 w-4" /></button>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs font-bold text-zinc-400">System operating normally. No alerts.</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="p-3 hover:bg-zinc-50 rounded-xl transition-colors mb-1 cursor-pointer flex gap-3 items-start">
                      <div className={`mt-0.5 rounded-full p-2 ${n.type === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'}`}>
                        {n.type === 'warning' ? <ShieldAlert className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[13px] font-black text-zinc-900">{n.title}</h4>
                        <p className="text-[11px] font-medium text-zinc-500 mt-1 leading-relaxed">{n.description}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div 
          role="button"
          onClick={onProfileClick}
          className="flex items-center gap-4 pl-8 border-l border-zinc-200 cursor-pointer group hover:opacity-80 transition-opacity"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-zinc-900 leading-none group-hover:text-indigo-600 transition-colors">System Admin</p>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2 group-hover:text-indigo-400 transition-colors">Level 4 Auth</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-indigo-100 ring-4 ring-indigo-50 border border-white group-hover:scale-105 transition-transform">
             SA
          </div>
        </div>
      </div>
    </header>
  );
}
