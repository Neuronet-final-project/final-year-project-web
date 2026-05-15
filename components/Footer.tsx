import Link from "next/link";
import Image from "next/image";
import { Mail, Github, Twitter, Linkedin, Heart, Send } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const linkClass =
    "text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors flex items-center gap-2.5 group rounded-lg px-2 py-1.5 -mx-2 hover:bg-indigo-50/60";

  return (
    <footer className="w-full border-t border-zinc-200/80 bg-gradient-to-b from-zinc-50 via-white to-indigo-50/20 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12 lg:items-start">
          {/* Brand */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 shadow-xl shadow-indigo-200/80 ring-2 ring-white group-hover:scale-105 transition-transform">
                <Image
                  src="/Images/icons/neuroneticon.png"
                  alt="NEURONET Logo"
                  width={48}
                  height={48}
                  className="object-cover p-1.5"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-zinc-900 leading-none">
                  NEURO<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">NET</span>
                </span>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1.5">Mental Health AI</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-600 font-medium max-w-sm">
              Empowering mental health through advanced AI monitoring and proactive care coordination. Building a safer future for adolescents worldwide.
            </p>
            <div className="flex items-center gap-2.5">
              <Link href="https://twitter.com" target="_blank" className="group flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50/80 ring-1 ring-indigo-100/80 transition-all hover:bg-gradient-to-br hover:from-indigo-600 hover:to-cyan-500 hover:ring-transparent hover:shadow-lg hover:shadow-indigo-200/50">
                <Twitter className="h-4 w-4 text-indigo-600 transition-colors group-hover:text-white" />
              </Link>
              <Link href="https://github.com" target="_blank" className="group flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50/80 ring-1 ring-indigo-100/80 transition-all hover:bg-gradient-to-br hover:from-indigo-600 hover:to-cyan-500 hover:ring-transparent hover:shadow-lg hover:shadow-indigo-200/50">
                <Github className="h-4 w-4 text-indigo-600 transition-colors group-hover:text-white" />
              </Link>
              <Link href="https://linkedin.com" target="_blank" className="group flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50/80 ring-1 ring-indigo-100/80 transition-all hover:bg-gradient-to-br hover:from-indigo-600 hover:to-cyan-500 hover:ring-transparent hover:shadow-lg hover:shadow-indigo-200/50">
                <Linkedin className="h-4 w-4 text-indigo-600 transition-colors group-hover:text-white" />
              </Link>
            </div>
          </div>

          {/* Nav + contact — balanced columns */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 sm:gap-x-6 lg:gap-x-10">
              <div className="flex flex-col gap-4 min-w-0">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900 pb-2 border-b border-indigo-200/60">
                  Platform
                </h3>
                <ul className="flex flex-col gap-1">
                  <li>
                    <Link href="/footer/features" className={linkClass}>
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400/70 group-hover:bg-indigo-600" />
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="/footer/security" className={linkClass}>
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400/70 group-hover:bg-indigo-600" />
                      Security
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-4 min-w-0">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900 pb-2 border-b border-indigo-200/60">
                  Company
                </h3>
                <ul className="flex flex-col gap-1">
                  <li>
                    <Link href="/footer/about" className={linkClass}>
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400/70 group-hover:bg-indigo-600" />
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/footer/blog" className={linkClass}>
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400/70 group-hover:bg-indigo-600" />
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-4 min-w-0">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900 pb-2 border-b border-indigo-200/60">
                  Legal
                </h3>
                <ul className="flex flex-col gap-1">
                  <li>
                    <Link href="/footer/privacy" className={linkClass}>
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400/70 group-hover:bg-indigo-600" />
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/footer/terms" className={linkClass}>
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400/70 group-hover:bg-indigo-600" />
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/footer/cookies" className={linkClass}>
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400/70 group-hover:bg-indigo-600" />
                      Cookie Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/footer/compliance" className={linkClass}>
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400/70 group-hover:bg-indigo-600" />
                      Compliance
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="col-span-2 sm:col-span-1 flex flex-col gap-4 min-w-0">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900 pb-2 border-b border-indigo-200/60">
                  Contact
                </h3>
                <div className="rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-white to-indigo-50/50 p-4 shadow-sm ring-1 ring-indigo-100/40">
                  <ul className="flex flex-col gap-3">
                    <li>
                      <Link href="mailto:contact@neuronet.com" className="flex items-start gap-3 text-sm font-medium text-zinc-700 hover:text-indigo-600 transition-colors group">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100/80 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <Mail className="h-4 w-4" />
                        </span>
                        <span className="text-xs leading-snug pt-2 break-all">contact@neuronet.com</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/footer/contact" className="flex items-start gap-3 text-sm font-medium text-zinc-700 hover:text-indigo-600 transition-colors group">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-100/80 text-cyan-700 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                          <Send className="h-4 w-4" />
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wide pt-2">Contact form</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-zinc-200/90 pt-10 md:flex-row">
          <p className="text-sm text-zinc-500 font-medium">&copy; {currentYear} NEURONET. All rights reserved.</p>
          <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
            <span>Made with</span>
            <Heart className="h-4 w-4 fill-rose-500 text-rose-500 animate-pulse" />
            <span>for better mental health care</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
