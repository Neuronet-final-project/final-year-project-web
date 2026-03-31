"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2 transition-transform hover:scale-105"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#4F46E5] to-cyan-500 shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
          </div>
          <span className="text-lg font-bold tracking-tight text-zinc-900">
            NEURO<span className="text-[#4F46E5]">NET</span>
          </span>
        </Link>

        {isHome && (
          <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 md:flex">
            <a
              href="#home"
              className="transition-colors hover:text-[#4F46E5]"
            >
              Home
            </a>
            <a
              href="#features"
              className="transition-colors hover:text-[#4F46E5]"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="transition-colors hover:text-[#4F46E5]"
            >
              How It Works
            </a>
          </nav>
        )}

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden text-sm font-semibold text-zinc-600 transition-colors hover:text-zinc-900 sm:block"
          >
            Sign in
          </Link>
          <Link
            href="/counselor/apply"
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-zinc-800 hover:shadow-md"
          >
            Join as Counselor
          </Link>
        </div>
      </div>
    </header>
  );
}
