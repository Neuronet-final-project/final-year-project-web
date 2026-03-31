"use client";

import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fafcff]">
      <Navbar />

      <main className="flex-1">
        {/* ── HERO SECTION ── */}
        <section
          id="home"
          className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-40"
        >
          {/* Subtle background glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-indigo-500/20 to-transparent blur-[80px]" />
          
          <div className="mx-auto max-w-7xl px-5 text-center md:px-8">
            <div className="mx-auto mb-6 inline-flex max-w-fit items-center gap-2 rounded-full border border-indigo-200/50 bg-indigo-50/50 px-4 py-1.5 text-sm font-semibold text-[#4F46E5] backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4F46E5] opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#4F46E5]"></span>
              </span>
              Next-Gen Mental Health Support
            </div>

            <h1 className="mx-auto max-w-5xl text-5xl font-extrabold tracking-tight text-zinc-900 md:text-7xl lg:text-[5rem] lg:leading-[1.1]">
              AI-Powered Care for the{" "}
              <span className="relative whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-cyan-400">
                Next Generation
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading- relaxed text-zinc-600 md:text-xl">
              Ethical AI meets professional counseling. NEURONET empowers schools, counselors, and guardians to detect risks early and provide secure, confidential support.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/login"
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4F46E5] px-8 py-4 text-base font-semibold text-white transition-all hover:bg-indigo-600 hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] sm:w-auto"
              >
                Get Started
                <svg
                  className="transition-transform group-hover:translate-x-1"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <a
                href="#features"
                className="flex w-full items-center justify-center rounded-2xl border border-zinc-200 bg-white px-8 py-4 text-base font-semibold text-zinc-800 transition-all hover:bg-zinc-50 hover:shadow-sm sm:w-auto"
              >
                Explore Features
              </a>
            </div>
          </div>

          {/* Hero Image / Dashboard Mockup */}
          <div className="relative mx-auto mt-16 max-w-6xl px-5 md:mt-24 md:px-8">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/20 p-2 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[2rem] bg-zinc-900 ring-1 ring-zinc-900/5">
                <Image
                  src="/Images/counselor.jpg"
                  alt="Platform Preview"
                  fill
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  className="object-cover object-center opacity-90"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/20 to-transparent" />
                
                {/* Floating UI Elements */}
                <div className="absolute bottom-10 left-10 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md transition-transform hover:-translate-y-2 max-w-sm hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                      <svg
                        className="h-5 w-5 text-emerald-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Risk Resolved</h4>
                      <p className="text-xs text-zinc-300">Counselor assigned successfully</p>
                    </div>
                  </div>
                </div>

                <div className="absolute right-10 top-10 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md transition-transform hover:-translate-y-2 max-w-sm hidden md:block">
                   <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                      <span className="text-lg font-bold text-blue-400">AI</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Emotional Insight</h4>
                      <p className="text-xs text-zinc-300">Positive trend detected this week</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES SECTION ── */}
        <section id="features" className="relative bg-zinc-900 py-24 text-white">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="mb-16 max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
                A Unified Platform for Mental Well-being
              </h2>
              <p className="mt-4 text-lg text-zinc-400">
                Everything you need to monitor, support, and communicate securely.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "AI Analysis",
                  desc: "Ethically detects emotional patterns from user journals to flag potential risks early.",
                  icon: "🧠",
                },
                {
                  title: "Secure Messaging",
                  desc: "End-to-end encrypted chat between students and professional counselors.",
                  icon: "💬",
                },
                {
                  title: "Real-time Alerts",
                  desc: "Immediate notifications to counselors and guardians when vital intervention is needed.",
                  icon: "⚡",
                },
                {
                  title: "Counselor Dashboards",
                  desc: "Visual insights and priority queues to help professionals manage caseloads efficiently.",
                  icon: "📊",
                },
                {
                  title: "Privacy First",
                  desc: "Strictly adheres to HIPAA & COPPA. User data remains private and securely encrypted.",
                  icon: "🔒",
                },
                {
                  title: "Admin Oversight",
                  desc: "Comprehensive platform management, user approving, and macro-level analytics.",
                  icon: "⚙️",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl shadow-inner group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" className="py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-5xl">
                How NEURONET Works
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600">
                A seamless, privacy-first workflow designed to get students the help they need, right when they need it.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-4">
              {[
                { step: "01", title: "Journal Entry", desc: "Adolescents express their feelings securely in the app." },
                { step: "02", title: "AI Scanning", desc: "Our ethical AI analyzes emotional tone without reading raw text." },
                { step: "03", title: "Risk Detection", desc: "If a risk is detected, authorized professionals are alerted." },
                { step: "04", title: "Professional Care", desc: "Counselors step in to provide direct, secure support." },
              ].map((item, i) => (
                <div key={item.step} className="relative">
                  {i !== 3 && (
                    <div className="hidden md:block absolute right-0 top-12 w-full -translate-y-1/2 translate-x-1/2 border-t-2 border-dashed border-zinc-200" />
                  )}
                  <div className="relative z-10 mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-indigo-100 bg-white shadow-xl shadow-indigo-500/5">
                    <span className="text-2xl font-bold text-[#4F46E5]">{item.step}</span>
                  </div>
                  <h3 className="mt-8 text-center text-lg font-semibold text-zinc-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-center text-sm text-zinc-600">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA SECTION ── */}
        <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-900 px-8 py-20 text-center shadow-2xl md:px-20 md:py-24">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5] to-cyan-500 opacity-90" />
            
            <div className="relative z-10 mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold text-white md:text-5xl">
                Ready to Join the Network?
              </h2>
              <p className="mt-6 text-lg text-blue-50">
                Whether you're a professional counselor ready to make a difference, or an admin setting up your school's safety net.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/login"
                  className="w-full rounded-2xl bg-white px-8 py-4 text-base font-bold text-[#4F46E5] transition-all hover:scale-105 hover:bg-zinc-50 hover:shadow-xl sm:w-auto"
                >
                  Login to Dashboard
                </Link>
                <Link
                  href="/counselor/apply"
                  className="w-full rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 sm:w-auto"
                >
                  Apply as Counselor
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
