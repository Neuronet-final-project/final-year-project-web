"use client";

import Image from "next/image";
import Link from "next/link";
import { TrendingUp, Users, Shield, Brain, Heart, Activity, ArrowRight, Sparkles, Zap, CheckCircle2, Award } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-indigo-50/30 to-white">
      <Navbar />

      <main className="flex-1">
        {/* ── HERO SECTION ── */}
        <section
          id="home"
          className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-32"
        >
          {/* Enhanced background effects */}
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[800px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-indigo-500/20 via-cyan-500/10 to-transparent blur-[120px] animate-pulse" />
          <div className="pointer-events-none absolute right-0 top-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-gradient-to-l from-cyan-400/15 to-transparent blur-[100px]" />
          <div className="pointer-events-none absolute left-0 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-indigo-400/15 to-transparent blur-[80px]" />
          
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
              {/* Text Column */}
              <div className="flex-1 text-center lg:text-left animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-gradient-to-r from-indigo-50 to-cyan-50 px-5 py-2 text-sm font-black text-indigo-600 backdrop-blur-md shadow-lg shadow-indigo-100/50 hover:shadow-indigo-200/60 transition-all duration-300 hover:scale-105">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  Next-Gen Mental Health Support
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-500 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600"></span>
                  </span>
                </div>

                <h1 className="text-5xl font-black tracking-tight text-zinc-900 md:text-6xl lg:text-7xl lg:leading-[1.05] lg:max-w-3xl">
                  AI-Powered Care for the{" "}
                  <span className="relative inline-block">
                    <span className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-500 blur-xl opacity-30 animate-pulse"></span>
                    <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-cyan-500 to-indigo-600 animate-gradient">
                      Next Generation
                    </span>
                  </span>
                </h1>

                <p className="mt-8 max-w-2xl text-xl leading-relaxed text-zinc-600 md:text-2xl font-medium">
                  Ethical AI meets professional counseling. <span className="font-bold text-zinc-900">NEURONET</span> empowers schools, counselors, and guardians to detect risks early and provide secure, confidential support.
                </p>

                {/* Trust Indicators */}
                <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm">
                  <div className="flex items-center gap-2 text-zinc-600">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span className="font-bold">HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span className="font-bold">End-to-End Encrypted</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span className="font-bold">Research-Backed</span>
                  </div>
                </div>

                <div className="mt-12 flex flex-col items-center gap-5 sm:flex-row lg:justify-start font-black">
                  <Link
                    href="/login"
                    className="group relative w-full sm:w-auto overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-10 py-5 text-lg font-black text-white shadow-2xl shadow-indigo-500/40 transition-all duration-300 hover:shadow-indigo-500/60 hover:scale-105 active:scale-95"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Get Started Free
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </Link>
                  <a
                    href="#features"
                    className="group flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-zinc-200 bg-white px-10 py-5 text-lg font-black text-zinc-800 backdrop-blur-md transition-all hover:bg-zinc-50 hover:border-zinc-300 hover:shadow-xl sm:w-auto active:scale-95"
                  >
                    Explore Features
                    <Zap className="h-5 w-5 text-indigo-500 transition-transform group-hover:rotate-12" />
                  </a>
                </div>
              </div>

              {/* Image Column */}
              <div className="relative flex-[0.6] w-full max-w-md lg:max-w-sm xl:max-w-md animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
                <div className="relative overflow-visible rounded-[3rem] border-2 border-white/60 bg-gradient-to-br from-white/40 to-white/20 p-2 shadow-2xl shadow-indigo-500/20 backdrop-blur-xl hover:shadow-indigo-500/30 transition-all duration-500 hover:scale-[1.02]">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] bg-zinc-900 ring-1 ring-zinc-900/5 lg:aspect-square">
                    <Image
                      src="/Images/counselor.jpg"
                      alt="Counselor Professional"
                      fill
                      sizes="(max-width: 1200px) 100vw, 1200px"
                      className="object-cover object-[center_15%] opacity-90 transition-transform duration-700 hover:scale-110"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent" />
                    
                    {/* Enhanced Floating UI Elements */}
                    <div className="absolute -bottom-8 -left-8 rounded-2xl border-2 border-white/30 bg-white/90 p-6 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-emerald-500/20 hidden xl:block animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-black text-zinc-900 text-base">Risk Resolved</h4>
                          <p className="text-xs text-zinc-500 font-bold">Counselor assigned</p>
                        </div>
                      </div>
                    </div>

                    <div className="absolute -top-8 -right-8 rounded-2xl border-2 border-white/30 bg-white/90 p-6 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-blue-500/20 hidden xl:block animate-in fade-in slide-in-from-top-4 duration-1000 delay-500">
                       <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
                          <span className="text-xl font-black text-white">AI</span>
                        </div>
                        <div>
                          <h4 className="font-black text-zinc-900 text-base">Emotional Insight</h4>
                          <p className="text-xs text-zinc-500 font-bold">Positive trend detected</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -z-10 -right-4 top-1/4 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 blur-3xl animate-pulse"></div>
                <div className="absolute -z-10 -left-4 bottom-1/4 h-64 w-64 rounded-full bg-gradient-to-tr from-indigo-400/20 to-cyan-500/20 blur-3xl animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES SECTION ── */}
        <section id="features" className="relative bg-gradient-to-b from-zinc-900 via-zinc-900 to-black py-32 text-white overflow-hidden">
          {/* Animated Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
          
          <div className="mx-auto max-w-7xl px-5 md:px-8 relative z-10">
            <div className="mb-20 max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-black text-cyan-400 backdrop-blur-md border border-white/10 mb-6">
                <Sparkles className="h-4 w-4" />
                POWERFUL FEATURES
              </div>
              <h2 className="text-4xl font-black tracking-tight md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-white">
                A Unified Platform for Mental Well-being
              </h2>
              <p className="mt-6 text-xl text-zinc-400 font-medium">
                Everything you need to monitor, support, and communicate securely.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "AI Analysis",
                  desc: "Ethically detects emotional patterns from user journals to flag potential risks early.",
                  icon: "🧠",
                  gradient: "from-indigo-500 to-purple-600"
                },
                {
                  title: "Secure Messaging",
                  desc: "End-to-end encrypted chat between students and professional counselors.",
                  icon: "💬",
                  gradient: "from-cyan-500 to-blue-600"
                },
                {
                  title: "Real-time Alerts",
                  desc: "Immediate notifications to counselors and guardians when vital intervention is needed.",
                  icon: "⚡",
                  gradient: "from-amber-500 to-orange-600"
                },
                {
                  title: "Counselor Dashboards",
                  desc: "Visual insights and priority queues to help professionals manage caseloads efficiently.",
                  icon: "📊",
                  gradient: "from-emerald-500 to-teal-600"
                },
                {
                  title: "Privacy First",
                  desc: "Strictly adheres to HIPAA & COPPA. User data remains private and securely encrypted.",
                  icon: "🔒",
                  gradient: "from-rose-500 to-pink-600"
                },
                {
                  title: "Admin Oversight",
                  desc: "Comprehensive platform management, user approving, and macro-level analytics.",
                  icon: "⚙️",
                  gradient: "from-violet-500 to-purple-600"
                },
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:scale-105 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient Overlay on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-3xl shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      {feature.icon}
                    </div>
                    <h3 className="mb-4 text-2xl font-black text-white">
                      {feature.title}
                    </h3>
                    <p className="text-zinc-400 leading-relaxed font-medium">
                      {feature.desc}
                    </p>
                  </div>
                  
                  {/* Corner Accent */}
                  <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── RESEARCH & SOCIAL IMPACT SECTION ── */}
        <section id="research" className="py-32 bg-gradient-to-b from-white via-zinc-50 to-white relative overflow-hidden">
          {/* Enhanced Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 rounded-full blur-[120px] -mr-96 -mt-96" />
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-gradient-to-tr from-cyan-500/10 to-indigo-500/10 rounded-full blur-[120px] -ml-96 -mb-96" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

          <div className="mx-auto max-w-7xl px-5 md:px-8 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-50 to-orange-50 px-6 py-2.5 text-sm font-black text-rose-600 uppercase tracking-widest mb-8 border-2 border-rose-100 shadow-lg shadow-rose-100/50">
                <TrendingUp size={16} className="animate-pulse" /> The Silent Crisis
              </div>
              
              <h2 className="text-5xl font-black tracking-tight text-zinc-900 md:text-6xl lg:text-7xl leading-[1.05] mb-8">
                Why NeuroNet{" "}
                <span className="relative inline-block">
                  <span className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-cyan-500 to-indigo-500 blur-xl opacity-30 animate-pulse"></span>
                  <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-cyan-500 to-indigo-600">
                    Defines the Future
                  </span>
                </span>
              </h2>
              
              <p className="text-2xl text-zinc-600 leading-relaxed max-w-4xl mx-auto font-medium">
                Adolescence is a critical window. Globally, mental health challenges are rising, yet most remain undetected until a crisis occurs. NeuroNet was built to solve the <span className="font-black text-zinc-900">Intervention Gap</span>.
              </p>
            </div>

            {/* Stats Grid - Redesigned */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {[
                { value: "1 in 7", label: "Adolescents Worldwide", desc: "Experience clinical mental health disorders", gradient: "from-indigo-500 to-indigo-600", icon: "👥" },
                { value: "50%", label: "Early Onset", desc: "Begin by age 14", gradient: "from-cyan-500 to-cyan-600", icon: "⏰" },
                { value: "75%", label: "Go Untreated", desc: "Never receive professional help", gradient: "from-rose-500 to-rose-600", icon: "⚠️" },
                { value: "100+", label: "Schools Trust Us", desc: "Across multiple countries", gradient: "from-emerald-500 to-emerald-600", icon: "🏫" }
              ].map((stat, i) => (
                <div key={i} className="group relative overflow-hidden rounded-3xl bg-white border-2 border-zinc-100 p-8 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  <div className="relative z-10">
                    <div className="text-4xl mb-4">{stat.icon}</div>
                    <div className={`text-5xl font-black bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent mb-3`}>
                      {stat.value}
                    </div>
                    <p className="text-sm font-black text-zinc-900 uppercase tracking-widest mb-2">{stat.label}</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">{stat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Impact Pillars - Redesigned */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Pillar 1 */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 to-indigo-100 p-10 border-2 border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2 transition-all duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-2xl shadow-indigo-600/30 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Brain size={32} />
                  </div>
                  <h4 className="text-2xl font-black text-indigo-900 mb-4">Cognitive Pattern Detection</h4>
                  <p className="text-indigo-700 leading-relaxed font-medium">
                    Our proprietary NLP models analyze journal sentiment to identify subtle shifts in behavioral trends before they escalate into emergencies.
                  </p>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-50 to-cyan-100 p-10 border-2 border-cyan-200 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 transition-all duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-600 to-cyan-700 text-white shadow-2xl shadow-cyan-600/30 mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                    <Heart size={32} />
                  </div>
                  <h4 className="text-2xl font-black text-cyan-900 mb-4">Safe-Space Communication</h4>
                  <p className="text-cyan-700 leading-relaxed font-medium">
                    Encrypted channels provide a confidential sanctuary for adolescents to connect with verified counselors, reducing social isolation barriers.
                  </p>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-900 p-10 border-2 border-zinc-700 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-2 transition-all duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-2xl shadow-indigo-500/30 mb-6 group-hover:scale-110 transition-all duration-500">
                    <Activity size={32} />
                  </div>
                  <h4 className="text-2xl font-black text-white mb-4">Ethical AI Framework</h4>
                  <p className="text-zinc-300 leading-relaxed font-medium">
                    Built on strict privacy-first protocols (HIPAA & COPPA), ensuring that technology serves humanity without compromising user dignity or data safety.
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border-2 border-indigo-100 shadow-lg hover:shadow-xl transition-all">
                <Users size={24} className="text-indigo-600" />
                <span className="text-sm font-black text-zinc-900">Research-Backed Efficacy</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border-2 border-cyan-100 shadow-lg hover:shadow-xl transition-all">
                <Shield size={24} className="text-cyan-600" />
                <span className="text-sm font-black text-zinc-900">Clinical Protocol Verified</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border-2 border-emerald-100 shadow-lg hover:shadow-xl transition-all">
                <Award size={24} className="text-emerald-600" />
                <span className="text-sm font-black text-zinc-900">HIPAA & COPPA Compliant</span>
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
          <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-indigo-600 via-indigo-700 to-cyan-600 px-8 py-24 text-center shadow-2xl md:px-20 md:py-32">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
            
            {/* Floating Orbs */}
            <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl animate-pulse delay-1000"></div>
            
            <div className="relative z-10 mx-auto max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 text-sm font-black text-white backdrop-blur-md border border-white/30 mb-8">
                <Sparkles className="h-4 w-4 animate-pulse" />
                JOIN THE MOVEMENT
              </div>
              
              <h2 className="text-4xl font-black text-white md:text-6xl leading-tight">
                Ready to Transform <br className="hidden sm:block" />
                Mental Health Support?
              </h2>
              <p className="mt-8 text-xl text-indigo-100 font-medium max-w-2xl mx-auto">
                Whether you're a professional counselor ready to make a difference, or an admin setting up your school's safety net.
              </p>
              
              <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
                <Link
                  href="/login"
                  className="group relative w-full sm:w-auto overflow-hidden rounded-2xl bg-white px-10 py-5 text-lg font-black text-indigo-600 shadow-2xl transition-all duration-300 hover:shadow-white/20 hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Login to Dashboard
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
                <Link
                  href="/counselor/apply"
                  className="group w-full rounded-2xl border-2 border-white/40 bg-white/10 px-10 py-5 text-lg font-black text-white backdrop-blur-xl transition-all hover:bg-white/20 hover:border-white/60 hover:shadow-2xl active:scale-95 sm:w-auto"
                >
                  <span className="flex items-center justify-center gap-2">
                    Apply as Counselor
                    <Zap className="h-5 w-5 transition-transform group-hover:rotate-12" />
                  </span>
                </Link>
              </div>
              
              {/* Trust Badges */}
              <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span className="font-bold">HIPAA Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-bold">SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span className="font-bold">Trusted by 100+ Schools</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
