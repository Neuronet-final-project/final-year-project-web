"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/80 backdrop-blur-xl transition-all shadow-sm">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3 transition-transform hover:scale-105"
        >
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 shadow-lg shadow-indigo-200 ring-2 ring-white">
            <Image
              src="/Images/icons/neuroneticon.png"
              alt="NEURONET Logo"
              width={40}
              height={40}
              className="object-cover p-1"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-zinc-900 leading-none">
              NEURO<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">NET</span>
            </span>
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Mental Health AI</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-bold text-zinc-600 md:flex">
          {isHome ? (
            <>
              <a
                href="#home"
                className="px-4 py-2 rounded-xl transition-all hover:text-indigo-600 hover:bg-indigo-50"
              >
                Home
              </a>
              <a
                href="#features"
                className="px-4 py-2 rounded-xl transition-all hover:text-indigo-600 hover:bg-indigo-50"
              >
                Features
              </a>
              <a
                href="#research"
                className="px-4 py-2 rounded-xl transition-all hover:text-indigo-600 hover:bg-indigo-50"
              >
                Research
              </a>
              <a
                href="#how-it-works"
                className="px-4 py-2 rounded-xl transition-all hover:text-indigo-600 hover:bg-indigo-50"
              >
                How It Works
              </a>
            </>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-cyan-50 px-4 py-2 text-xs font-black text-indigo-600 border border-indigo-200/60 shadow-sm">
              <Sparkles className="h-3 w-3" />
              Next-Gen Mental Health Support
            </div>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden px-6 py-2.5 text-sm font-black text-zinc-700 transition-all hover:text-indigo-600 hover:bg-indigo-50 rounded-xl sm:block border-2 border-transparent hover:border-indigo-100"
          >
            Sign In
          </Link>
          <Link
            href="/counselor/apply"
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-6 py-2.5 text-sm font-black text-white transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            Join as Counselor
          </Link>

          {/* MOBILE TOGGLE BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-zinc-200 bg-white text-zinc-600 transition-all hover:bg-zinc-50 hover:border-indigo-200 hover:text-indigo-600 md:hidden"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300 border-t border-zinc-100 bg-white/95 backdrop-blur-xl p-6 md:hidden shadow-lg">
          <nav className="flex flex-col gap-3">
            {isHome && (
              <>
                <a
                  href="#home"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-base font-bold text-zinc-600 transition-all hover:text-indigo-600 hover:bg-indigo-50 rounded-xl"
                >
                  Home
                </a>
                <a
                  href="#features"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-base font-bold text-zinc-600 transition-all hover:text-indigo-600 hover:bg-indigo-50 rounded-xl"
                >
                  Features
                </a>
                <a
                  href="#research"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-base font-bold text-zinc-600 transition-all hover:text-indigo-600 hover:bg-indigo-50 rounded-xl"
                >
                  Research
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-base font-bold text-zinc-600 transition-all hover:text-indigo-600 hover:bg-indigo-50 rounded-xl"
                >
                  How It Works
                </a>
              </>
            )}
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 text-base font-bold text-zinc-600 transition-all hover:text-indigo-600 hover:bg-indigo-50 rounded-xl sm:hidden"
            >
              Sign In
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
