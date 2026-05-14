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
  Users,
  BookOpen
} from "lucide-react";
import { useState, useEffect } from "react";

const navItems = [
  { name: "Overview", icon: LayoutDashboard, href: "/counselor/dashboard" },
  { name: "Alerts", icon: Bell, href: "/counselor/alerts" },
  { name: "Assignments", icon: Users, href: "/counselor/assignments" },
  { name: "SafeChat", icon: MessageSquare, href: "/counselor/chat" },
  { name: "Channels", icon: Hash, href: "/counselor/channels" },
  { name: "Learner's Nook", icon: BookOpen, href: "/counselor/educational" },
];

export default function CounselorSidebar({ onMobileClose }: { onMobileClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleCloseSidebar = () => setCollapsed(true);
    window.addEventListener("close-counselor-sidebar", handleCloseSidebar as EventListener);
    return () => window.removeEventListener("close-counselor-sidebar", handleCloseSidebar as EventListener);
  }, []);

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
      className={`relative h-screen bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-500 ease-in-out z-50 shadow-2xl ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* BRANDING */}
      <div className="p-6 flex items-center gap-4 border-b border-slate-800">
        <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-900/50">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        {!collapsed && (
          <div className="animate-in fade-in slide-in-from-left-2 duration-300">
            <h2 className="text-xl font-black text-white tracking-tight leading-none">Neuronet</h2>
            <p className="text-[10px] font-bold text-blue-400 mt-1 uppercase tracking-widest">Counselor Portal</p>
          </div>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 mt-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/counselor/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              onClick={() => onMobileClose?.()}
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
              {!collapsed && (
                <span className="font-bold text-sm tracking-tight">{item.name}</span>
              )}
              {isActive && !collapsed && (
                <div className="ml-auto w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER ACTIONS */}
      <div className="p-4 space-y-2 border-t border-slate-800">
        <Link 
          onClick={() => onMobileClose?.()}
          href="/counselor/profile"
          className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
        >
          <User size={20} className="shrink-0" />
          {!collapsed && <span className="font-bold text-sm tracking-tight">Account</span>}
        </Link>
        <button
          onClick={() => { handleLogout(); onMobileClose?.(); }}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-950/50 hover:text-red-300 transition-all font-bold text-sm tracking-tight"
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* COLLAPSE TOGGLE */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 border-2 border-slate-700 shadow-lg text-slate-400 hover:text-blue-400 hover:border-blue-600 transition-all"
      >
        {collapsed ? <ChevronRight size={16} strokeWidth={3} /> : <ChevronLeft size={16} strokeWidth={3} />}
      </button>
    </aside>
  );
}
