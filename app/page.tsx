"use client";

import Image from "next/image";
import Link from "next/link";
import { TrendingUp, Users, Shield, Brain, Heart, Activity, ArrowRight } from "lucide-react";
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
          className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-32"
        >
          {/* Subtle background glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-indigo-500/20 to-transparent blur-[80px]" />
          
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
              {/* Text Column */}
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200/50 bg-indigo-50/50 px-4 py-1.5 text-sm font-semibold text-[#4F46E5] backdrop-blur-md">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4F46E5] opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#4F46E5]"></span>
                  </span>
                  Next-Gen Mental Health Support
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 md:text-5xl lg:text-6xl lg:leading-[1.1] lg:max-w-3xl">
                  AI-Powered Care for the{" "}
                  <span className="relative whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-cyan-400">
                    Next Generation
                  </span>
                </h1>

                <p className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-600 md:text-xl">
                  Ethical AI meets professional counseling. NEURONET empowers schools, counselors, and guardians to detect risks early and provide secure, confidential support.
                </p>

                <div className="mt-10 flex flex-col items-center gap-5 sm:flex-row lg:justify-start font-black">
                  <Link
                    href="/login"
                    className="premium-btn-primary premium-btn-shimmer w-full sm:w-auto"
                  >
                    Get Started 
                    <ArrowRight className="inline-block ml-2 pointer-events-none" size={20} />
                  </Link>
                  <a
                    href="#features"
                    className="flex w-full items-center justify-center rounded-2xl border-2 border-zinc-200 bg-white/80 px-8 py-4 text-base font-bold text-zinc-800 backdrop-blur-md transition-all hover:bg-zinc-50 hover:border-zinc-300 hover:shadow-sm sm:w-auto active:scale-95"
                  >
                    Explore Features
                  </a>
                </div>
              </div>

              {/* Image Column */}
              <div className="relative flex-[0.6] w-full max-w-md lg:max-w-sm xl:max-w-md">
                <div className="relative overflow-visible rounded-[2.5rem] border border-white/40 bg-white/20 p-1.5 shadow-xl shadow-indigo-500/10 backdrop-blur-xl">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-zinc-900 ring-1 ring-zinc-900/5 lg:aspect-square">
                    <Image
                      src="/Images/counselor.jpg"
                      alt="Counselor Professional"
                      fill
                      sizes="(max-width: 1200px) 100vw, 1200px"
                      className="object-cover object-[center_15%] opacity-90 transition-transform duration-700 hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/40 via-transparent to-transparent" />
                    
                    {/* Floating UI Elements - Simplified for side view */}
                    <div className="absolute -bottom-6 -left-6 rounded-2xl border border-white/20 bg-white/80 p-5 shadow-xl backdrop-blur-md transition-transform hover:-translate-y-2 hidden xl:block">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                          <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-zinc-900">Risk Resolved</h4>
                          <p className="text-xs text-zinc-500">Counselor assigned</p>
                        </div>
                      </div>
                    </div>

                    <div className="absolute -top-6 -right-6 rounded-2xl border border-white/20 bg-white/80 p-5 shadow-xl backdrop-blur-md transition-transform hover:-translate-y-2 hidden xl:block">
                       <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                          <span className="text-lg font-bold text-blue-600">AI</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-zinc-900">Emotional Insight</h4>
                          <p className="text-xs text-zinc-500">Positive trend detected</p>
                        </div>
                      </div>
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

        {/* ── RESEARCH & SOCIAL IMPACT SECTION ── */}
        <section id="research" className="py-24 bg-white relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[100px] -ml-64 -mb-64" />

          <div className="mx-auto max-w-7xl px-5 md:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              
              {/* Left Column: The "Why" - Data & Crisis */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-1.5 text-xs font-black text-rose-600 uppercase tracking-widest mb-6 border border-rose-100">
                  <TrendingUp size={14} className="animate-pulse" /> The Silent Crisis
                </div>
                
                <h2 className="text-4xl font-black tracking-tight text-zinc-900 md:text-5xl lg:text-6xl leading-[1.1]">
                  Why NeuroNet <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Defines the Future</span>
                </h2>
                
                <p className="mt-8 text-lg text-zinc-600 leading-relaxed max-w-xl">
                  Adolescence is a critical window. Globally, mental health challenges are rising, yet most remain undetected until a crisis occurs. NeuroNet was built to solve the <b>Intervention Gap</b>.
                </p>

                {/* Pulse Stats Grid */}
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 border-l-2 border-indigo-100 pl-8">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-indigo-600">1 in 7</span>
                    </div>
                    <p className="mt-2 text-sm font-bold text-zinc-500 uppercase tracking-tight">Adolescents Worldwide</p>
                    <p className="mt-1 text-xs text-zinc-400">Experience clinical mental health disorders, often in silence.</p>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-cyan-500">50%</span>
                    </div>
                    <p className="mt-2 text-sm font-bold text-zinc-500 uppercase tracking-tight">Early Onset</p>
                    <p className="mt-1 text-xs text-zinc-400">Of all mental health conditions begin by age 14.</p>
                  </div>
                </div>

                <div className="mt-12 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 group cursor-help">
                    <Users size={18} className="text-indigo-400" />
                    <span className="text-sm font-bold text-zinc-700 underline decoration-indigo-200 underline-offset-4 decoration-2">Research-Backed Efficacy</span>
                  </div>
                  <div className="flex items-center gap-2 group cursor-help">
                    <Shield size={18} className="text-cyan-400" />
                    <span className="text-sm font-bold text-zinc-700 underline decoration-cyan-200 underline-offset-4 decoration-2">Clinical Protocol Verified</span>
                  </div>
                </div>
              </div>

              {/* Right Column: The "How" - Impact Pillars */}
              <div className="flex-1 w-full max-w-xl">
                <div className="grid grid-cols-1 gap-6">
                  {/* Pillar 1 */}
                  <div className="group relative overflow-hidden rounded-[2.5rem] bg-zinc-50 p-8 border border-zinc-100 hover:bg-white hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] transition-all duration-500">
                    <div className="flex items-start gap-6">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <Brain size={28} />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-zinc-900">Cognitive Pattern Detection</h4>
                        <p className="mt-2 text-sm text-zinc-500 leading-relaxed font-medium">
                          Our proprietary NLP models analyze journal sentiment to identify subtle shifts in behavioral trends before they escalate into emergencies.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pillar 2 */}
                  <div className="group relative overflow-hidden rounded-[2.5rem] bg-zinc-50 p-8 border border-zinc-100 hover:bg-white hover:shadow-[0_20px_50px_rgba(6,182,212,0.1)] transition-all duration-500 sm:translate-x-6">
                    <div className="flex items-start gap-6">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                        <Heart size={28} />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-zinc-900">Safe-Space Communication</h4>
                        <p className="mt-2 text-sm text-zinc-500 leading-relaxed font-medium">
                          Encrypted channels provide a confidential sanctuary for adolescents to connect with verified counselors, reducing social isolation barriers.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pillar 3 */}
                  <div className="group relative overflow-hidden rounded-[2.5rem] bg-zinc-900 p-8 border border-zinc-800 hover:shadow-[0_20px_50px_rgba(79,70,229,0.2)] transition-all duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
                    <div className="flex items-start gap-6 relative z-10">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white group-hover:scale-110 transition-all duration-500">
                        <Activity size={28} />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-white">Ethical AI Framework</h4>
                        <p className="mt-2 text-sm text-zinc-400 leading-relaxed font-medium">
                          Built on strict privacy-first protocols (HIPAA & COPPA), ensuring that technology serves humanity without compromising user dignity or data safety.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
              <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
                <Link
                  href="/login"
                  className="premium-btn-primary premium-btn-shimmer w-full sm:w-auto !bg-rose-50"
                  style={{ background: 'white', color: '#4F46E5' }}
                >
                  Login to Dashboard
                </Link>
                <Link
                  href="/counselor/apply"
                  className="w-full rounded-2xl border-2 border-white/40 bg-white/10 px-8 py-4 text-base font-black text-white backdrop-blur-xl transition-all hover:bg-white/25 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95 sm:w-auto"
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
