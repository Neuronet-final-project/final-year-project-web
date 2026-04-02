"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Hash, 
  User, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Users
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Overview", icon: LayoutDashboard, href: "/counselor/dashboard" },
  { name: "Alerts", icon: Bell, href: "/counselor/alerts" },
  { name: "Assignments", icon: Users, href: "/counselor/assignments" },
  { name: "SafeChat", icon: MessageSquare, href: "/counselor/chat" },
  { name: "Channels", icon: Hash, href: "/counselor/channels" },
];

export default function CounselorSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <aside 
      className={`relative h-screen bg-white border-r border-zinc-100 flex flex-col transition-all duration-500 ease-in-out z-50 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* BRANDING */}
      <div className="p-8 flex items-center gap-4">
        <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#0891b2] shadow-xl shadow-indigo-100">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        {!collapsed && (
          <div className="animate-in fade-in slide-in-from-left-2 duration-300">
            <h2 className="text-xl font-black text-zinc-900 tracking-tight leading-none">Neuronet</h2>
            <p className="text-[10px] font-bold text-indigo-600 mt-1 uppercase tracking-widest">Counselor Portal</p>
          </div>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 mt-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/counselor/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                  : "text-zinc-500 hover:bg-slate-50 hover:text-zinc-900"
              }`}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
              {!collapsed && (
                <span className="font-bold text-sm tracking-tight">{item.name}</span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER ACTIONS */}
      <div className="p-4 space-y-2">
        <Link 
          href="/counselor/profile"
          className="flex items-center gap-4 px-4 py-4 rounded-2xl text-zinc-500 hover:bg-slate-50 hover:text-zinc-900 transition-all"
        >
          <User size={22} className="shrink-0" />
          {!collapsed && <span className="font-bold text-sm tracking-tight">Account</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm tracking-tight"
        >
          <LogOut size={22} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* COLLAPSE TOGGLE */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-10 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-zinc-100 shadow-md text-zinc-400 hover:text-indigo-600 transition-colors"
      >
        {collapsed ? <ChevronRight size={16} strokeWidth={3} /> : <ChevronLeft size={16} strokeWidth={3} />}
      </button>
    </aside>
  );
}
