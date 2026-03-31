"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function DashboardHeader({
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

  // Fallback initial
  const initial = email ? email[0].toUpperCase() : "C";

  return (
    <div className="relative w-full overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#4F46E5] to-cyan-500 px-8 py-10 shadow-lg mt-6">
      <div className="absolute -right-20 -top-40 h-96 w-96 rounded-full bg-white/10 blur-3xl mix-blend-overlay" />
      <div className="absolute -left-20 -bottom-40 h-80 w-80 rounded-full bg-white/10 blur-3xl mix-blend-overlay" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm shadow-inner">
               <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_8px_white]" />
            </div>
            <h1 className="text-xl font-bold uppercase tracking-wider text-cyan-50">
              Neuronet Dashboard
            </h1>
          </div>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Welcome back
          </h2>
          <p className="mt-2 text-indigo-100">{email}</p>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/counselor/dashboard#alerts" className="group relative rounded-full bg-white/10 p-4 transition-all hover:bg-white/20 hover:scale-105">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:-rotate-12"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {alertCount > 0 && (
              <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-md ring-2 ring-[#4F46E5]">
                {alertCount}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-4 border-l border-white/20 pl-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg text-lg font-bold text-[#4F46E5]">
              {initial}
            </div>
            <div className="hidden sm:block text-right">
              <div className="font-semibold text-white">Professional</div>
              <button
                onClick={handleSignOut}
                className="text-xs text-indigo-200 hover:text-white hover:underline transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
