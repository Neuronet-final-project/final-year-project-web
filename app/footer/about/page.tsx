"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Users, Target, Award, Heart, Sparkles, TrendingUp } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-indigo-50/30 to-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-indigo-500/20 to-transparent blur-[100px]" />
          
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-5 py-2 text-sm font-black text-indigo-600 backdrop-blur-md border border-indigo-100 mb-8">
                <Sparkles className="h-4 w-4" />
                ABOUT NEURONET
              </div>
              
              <h1 className="text-5xl font-black tracking-tight text-zinc-900 md:text-7xl">
                Building a{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
                  Safer Future
                </span>
                {" "}for Adolescents
              </h1>
              
              <p className="mt-8 text-xl text-zinc-600 font-medium leading-relaxed">
                NEURONET is an AI-powered mental health platform designed to detect emotional risks early and connect adolescents with professional support when they need it most.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-xs font-black text-cyan-600 uppercase tracking-widest mb-6">
                  <Target className="h-4 w-4" />
                  Our Mission
                </div>
                <h2 className="text-4xl font-black text-zinc-900 md:text-5xl mb-6">
                  Closing the Intervention Gap
                </h2>
                <p className="text-lg text-zinc-600 leading-relaxed mb-6">
                  1 in 7 adolescents worldwide experience mental health disorders, yet most go undetected until a crisis occurs. We're changing that.
                </p>
                <p className="text-lg text-zinc-600 leading-relaxed">
                  NEURONET combines ethical AI analysis with professional counseling to provide early detection, secure communication, and coordinated care—all while maintaining strict privacy standards (HIPAA & COPPA compliant).
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="rounded-3xl bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 border border-indigo-200">
                  <div className="text-5xl font-black text-indigo-600 mb-2">1 in 7</div>
                  <p className="text-sm font-bold text-indigo-900">Adolescents affected globally</p>
                </div>
                <div className="rounded-3xl bg-gradient-to-br from-cyan-50 to-cyan-100 p-8 border border-cyan-200 mt-8">
                  <div className="text-5xl font-black text-cyan-600 mb-2">50%</div>
                  <p className="text-sm font-bold text-cyan-900">Begin by age 14</p>
                </div>
                <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 border border-emerald-200 -mt-8">
                  <div className="text-5xl font-black text-emerald-600 mb-2">75%</div>
                  <p className="text-sm font-bold text-emerald-900">Go untreated</p>
                </div>
                <div className="rounded-3xl bg-gradient-to-br from-rose-50 to-rose-100 p-8 border border-rose-200">
                  <div className="text-5xl font-black text-rose-600 mb-2">100+</div>
                  <p className="text-sm font-bold text-rose-900">Schools trust us</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-zinc-900 text-white">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black md:text-5xl mb-4">Our Core Values</h2>
              <p className="text-xl text-zinc-400">The principles that guide everything we do</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Heart className="h-8 w-8" />,
                  title: "Privacy First",
                  desc: "We never compromise on user privacy. All data is encrypted and HIPAA/COPPA compliant."
                },
                {
                  icon: <Users className="h-8 w-8" />,
                  title: "Human-Centered AI",
                  desc: "AI assists, humans decide. Our technology supports professionals, never replaces them."
                },
                {
                  icon: <Award className="h-8 w-8" />,
                  title: "Evidence-Based",
                  desc: "Every feature is backed by clinical research and validated by mental health professionals."
                }
              ].map((value, i) => (
                <div key={i} className="rounded-3xl bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-all">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white mb-6">
                    {value.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-4">{value.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-zinc-900 md:text-5xl mb-4">
                Built by Experts, For Everyone
              </h2>
              <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
                Our team combines expertise in AI, mental health, and education to create a platform that truly makes a difference.
              </p>
            </div>
            
            <div className="rounded-3xl bg-gradient-to-br from-indigo-50 to-cyan-50 p-12 border border-indigo-100 text-center">
              <TrendingUp className="h-16 w-16 text-indigo-600 mx-auto mb-6" />
              <h3 className="text-3xl font-black text-zinc-900 mb-4">Join Our Mission</h3>
              <p className="text-lg text-zinc-600 mb-8 max-w-2xl mx-auto">
                We're always looking for passionate individuals who want to make a real impact in adolescent mental health.
              </p>
              <a href="/careers" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-8 py-4 text-lg font-black text-white hover:shadow-xl hover:shadow-indigo-500/30 transition-all">
                View Open Positions
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
