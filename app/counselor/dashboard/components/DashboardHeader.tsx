"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, UserCircle } from "lucide-react";

export default function DashboardHeader({
  email,
  alertCount,
}: {
  email: string;
  alertCount: number;
}) {
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  }

  const initial = email ? email[0].toUpperCase() : "C";

  return (
    <div className="relative w-full overflow-hidden rounded-[2.5rem] bg-[#09090b] px-10 py-12 shadow-2xl border border-white/5 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* Decorative Elements */}
      <div className="absolute -right-20 -top-40 h-96 w-96 rounded-full bg-indigo-600/10 blur-[100px]" />
      <div className="absolute -left-20 -bottom-40 h-80 w-80 rounded-full bg-cyan-600/10 blur-[100px]" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 backdrop-blur-md border border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.2)]">
               <span className="h-2.5 w-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_white]" />
            </div>
            <h1 className="text-sm font-black uppercase tracking-[0.3em] text-indigo-400/80">
              Neuronet Counselor OS
            </h1>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight sm:text-5xl">
            Welcome back, <span className="text-indigo-400">Expert</span>
          </h2>
          <p className="mt-3 text-zinc-400 font-medium tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Session: {email}
          </p>
        </div>

        <div className="flex items-center gap-8">
          <Link href="/counselor/dashboard#alerts" className="group relative rounded-2xl bg-white/5 p-5 transition-all hover:bg-white/10 hover:scale-110 border border-white/5">
            <Bell className="h-6 w-6 text-zinc-400 transition-colors group-hover:text-indigo-400" />
            {alertCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-lg ring-4 ring-[#09090b] animate-bounce">
                {alertCount}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-6 border-l border-white/10 pl-8">
             <div className="text-right hidden sm:block">
               <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-1">Status</p>
               <p className="text-sm font-bold text-emerald-400">On Duty</p>
             </div>
             <button
               onClick={handleSignOut}
               className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-[0_10px_20px_-5px_rgba(79,70,229,0.4)] text-xl font-black text-white hover:scale-105 transition-transform active:scale-95 group"
               title="Sign Out"
             >
               <LogOut className="h-6 w-6 group-hover:-translate-x-0.5 transition-transform" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
