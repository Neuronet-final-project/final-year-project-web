"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Brain, MessageSquare, Bell, BarChart3, Shield, Settings, Users, Zap, Heart, Activity, Lock, CheckCircle2 } from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-indigo-50/30 to-white">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-20">
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-indigo-500/20 to-transparent blur-[120px]" />
          
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-cyan-50 px-5 py-2 text-sm font-black text-indigo-600 border border-indigo-200/60 mb-8">
                <TrendingUp className="h-4 w-4" />
                PLATFORM FEATURES
              </div>
              <h1 className="text-5xl font-black tracking-tight text-zinc-900 md:text-7xl mb-8">
                Everything You Need for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
                  Mental Health Care
                </span>
              </h1>
              <p className="mx-auto max-w-3xl text-xl text-zinc-600 font-medium">
                A comprehensive platform designed to detect, monitor, and respond to mental health needs with cutting-edge AI and professional care coordination.
              </p>
            </div>
          </div>
        </section>

        {/* Core Features Grid */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "AI Sentiment Analysis",
                  description: "Advanced NLP models analyze journal entries to detect emotional patterns and potential risks without compromising privacy.",
                  gradient: "from-indigo-500 to-purple-600"
                },
                {
                  icon: MessageSquare,
                  title: "Secure Messaging",
                  description: "End-to-end encrypted chat between adolescents and verified counselors with real-time communication.",
                  gradient: "from-cyan-500 to-blue-600"
                },
                {
                  icon: Bell,
                  title: "Real-time Alerts",
                  description: "Instant notifications to counselors and guardians when intervention is needed, with customizable alert thresholds.",
                  gradient: "from-amber-500 to-orange-600"
                },
                {
                  icon: BarChart3,
                  title: "Analytics Dashboard",
                  description: "Comprehensive insights with visual charts, trends, and priority queues for efficient case management.",
                  gradient: "from-emerald-500 to-teal-600"
                },
                {
                  icon: Shield,
                  title: "Privacy & Compliance",
                  description: "HIPAA and COPPA compliant with military-grade encryption and strict data protection protocols.",
                  gradient: "from-rose-500 to-pink-600"
                },
                {
                  icon: Settings,
                  title: "Admin Controls",
                  description: "Platform-wide management, user approval workflows, and comprehensive system configuration.",
                  gradient: "from-violet-500 to-purple-600"
                },
                {
                  icon: Users,
                  title: "Multi-Role Support",
                  description: "Tailored interfaces for adolescents, counselors, guardians, and administrators with role-based access.",
                  gradient: "from-blue-500 to-indigo-600"
                },
                {
                  icon: Heart,
                  title: "Wellness Resources",
                  description: "Curated educational content, coping strategies, and mental health resources accessible to all users.",
                  gradient: "from-pink-500 to-rose-600"
                },
                {
                  icon: Activity,
                  title: "Progress Tracking",
                  description: "Monitor emotional well-being over time with mood tracking, journal analytics, and intervention outcomes.",
                  gradient: "from-cyan-500 to-teal-600"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl border-2 border-zinc-100 bg-white p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  <div className="relative z-10">
                    <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="mb-4 text-2xl font-black text-zinc-900">{feature.title}</h3>
                    <p className="text-zinc-600 leading-relaxed font-medium">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="py-20 bg-zinc-900 text-white">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black mb-6 md:text-5xl">Enterprise-Grade Security</h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                Your data security and privacy are our top priorities
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Lock, title: "End-to-End Encryption", desc: "AES-256 encryption for all data" },
                { icon: Shield, title: "HIPAA Compliant", desc: "Full healthcare data protection" },
                { icon: CheckCircle2, title: "SOC 2 Certified", desc: "Industry-standard security controls" },
                { icon: Users, title: "Role-Based Access", desc: "Granular permission management" }
              ].map((item, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <item.icon className="h-10 w-10 text-cyan-400 mb-4" />
                  <h4 className="font-black text-lg mb-2">{item.title}</h4>
                  <p className="text-sm text-zinc-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
