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
    <div className="relative w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#4f46e5] to-[#0891b2] px-8 py-10 shadow-xl shadow-indigo-200/50 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* Mesh Accents */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/20 blur-[60px]" />
      <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-[60px]" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shadow-inner">
               <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_8px_white] animate-pulse" />
            </div>
            <h1 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
              Neuronet Counselor Workspace
            </h1>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight sm:text-4xl">
            Peace be upon you, <span className="opacity-70">Expert</span>
          </h2>
          <div className="mt-4 flex items-center gap-4 text-white/70">
            <div className="flex items-center gap-1.5 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
               {email}
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
               <span>ID: {initial}024-X</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/counselor/dashboard#alerts" className="group relative rounded-2xl bg-white/10 p-4 transition-all hover:bg-white/20 hover:scale-105 border border-white/20 backdrop-blur-sm">
            <Bell className="h-5 w-5 text-white transition-colors" />
            {alertCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white shadow-lg ring-2 ring-[#4f46e5]">
                {alertCount}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-4 border-l border-white/20 pl-4 h-12">
             <button
               onClick={handleSignOut}
               className="flex items-center gap-2 pr-2 pl-4 py-2 rounded-2xl bg-white text-indigo-600 font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all hover:scale-[1.02] active:scale-95 shadow-lg group"
             >
               <span>Exit</span>
               <div className="h-8 w-8 flex items-center justify-center bg-indigo-600 text-white rounded-xl shadow-inner group-hover:rotate-12 transition-transform">
                 <LogOut className="h-4 w-4" />
               </div>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

