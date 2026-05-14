"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Bell, X, ShieldAlert, Info } from 'lucide-react';

const SEEN_NOTIF_STORAGE_KEY = "neuronet_admin_notifications_seen_v1";

function readSeenNotificationIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = sessionStorage.getItem(SEEN_NOTIF_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.map(String));
  } catch {
    return new Set();
  }
}

function persistSeenNotificationIds(ids: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SEEN_NOTIF_STORAGE_KEY, JSON.stringify([...ids]));
  } catch {}
}

interface HeaderProps {
  title: string;
  onProfileClick?: () => void;
  /** Wired to user directory search; header query stays in sync with the Users tab. */
  userSearch?: string;
  setUserSearch?: (v: string) => void;
  /** Run when the user submits search from the header (e.g. Enter). */
  onHeaderSearchSubmit?: () => void;
}

export default function DashboardHeader({
  title,
  onProfileClick,
  userSearch = "",
  setUserSearch,
  onHeaderSearchSubmit,
}: HeaderProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [seenIds, setSeenIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setSeenIds(readSeenNotificationIds());
  }, []);

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

  const unreadCount = useMemo(
    () => notifications.filter((n) => n?.id != null && !seenIds.has(String(n.id))).length,
    [notifications, seenIds]
  );

  const markCurrentNotificationsSeen = useCallback(() => {
    setSeenIds((prev) => {
      const next = new Set(prev);
      notifications.forEach((n) => {
        if (n?.id != null) next.add(String(n.id));
      });
      persistSeenNotificationIds(next);
      return next;
    });
  }, [notifications]);

  return (
    <header className="h-20 shrink-0 flex items-center justify-between px-6 md:px-10 bg-gradient-to-r from-slate-100/95 via-indigo-50/90 to-violet-100/85 backdrop-blur-md border-b border-indigo-100/60 sticky top-0 z-30 shadow-[0_4px_24px_rgba(79,70,229,0.08)]">
      <div className="flex items-center gap-4">
        {/* MOBILE TOGGLE */}
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('open-admin-mobile-sidebar'))}
          className="lg:hidden p-2 rounded-xl bg-white/80 border border-indigo-100/60 text-zinc-600 hover:bg-white shadow-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>

        <div className="flex flex-col">
          <h2 className="text-lg md:text-xl font-black text-zinc-900 tracking-tight leading-tight truncate max-w-[150px] md:max-w-none">{title}</h2>
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-1.5">Administrative Node</p>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6 xl:gap-8 min-w-0">
        {/* Search Bar — compact height; submits to user directory search */}
        <div className="relative group hidden xl:block min-w-0 max-w-md flex-1">
          <input
            type="text"
            placeholder="Search users by name or email…"
            value={userSearch}
            onChange={(e) => setUserSearch?.(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onHeaderSearchSubmit?.();
            }}
            className="w-full max-w-md bg-white/70 border border-indigo-100/80 rounded-xl pl-10 pr-3 py-2 text-[13px] font-medium text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-500/25 focus:bg-white focus:border-indigo-300/60 transition-all outline-none shadow-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-3 relative shrink-0">
          <button
            type="button"
            onClick={() => {
              setShowNotifs((open) => {
                const next = !open;
                if (next) markCurrentNotificationsSeen();
                return next;
              });
            }}
            className="relative p-2.5 rounded-xl bg-white/80 text-zinc-600 hover:bg-white hover:text-zinc-900 border border-indigo-100/60 transition-all active:scale-90 shadow-sm"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[1rem] h-4 px-0.5 bg-orange-500 border-2 border-white rounded-full text-[9px] text-white font-black flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
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
              <div className="max-h-72 overflow-y-auto p-2">
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

        <div 
          role="button"
          onClick={onProfileClick}
          className="flex items-center gap-2 sm:gap-4 sm:pl-8 sm:border-l sm:border-indigo-100/80 cursor-pointer group hover:opacity-80 transition-opacity"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-zinc-900 leading-none group-hover:text-indigo-600 transition-colors">System Admin</p>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2 group-hover:text-indigo-400 transition-colors">Level 4 Auth</p>
          </div>
          <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-indigo-100 ring-4 ring-indigo-50 border border-white group-hover:scale-105 transition-transform">
             SA
          </div>
        </div>
      </div>
    </header>
  );
}
