"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-indigo-50/30 to-white">
      <Navbar />
      
      <main className="flex-1">
        <section className="relative overflow-hidden pt-32 pb-20">
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-indigo-500/20 to-transparent blur-[120px]" />
          
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-cyan-50 px-5 py-2 text-sm font-black text-indigo-600 border border-indigo-200/60 mb-8">
                <Sparkles className="h-4 w-4" />
                FLEXIBLE PRICING
              </div>
              <h1 className="text-5xl font-black tracking-tight text-zinc-900 md:text-7xl mb-8">
                Choose the Right Plan for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
                  Your Institution
                </span>
              </h1>
              <p className="mx-auto max-w-3xl text-xl text-zinc-600 font-medium">
                Transparent pricing designed to scale with your needs. All plans include core features with no hidden fees.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Starter Plan */}
              <div className="rounded-3xl border-2 border-zinc-200 bg-white p-8 transition-all hover:shadow-xl">
                <div className="mb-6">
                  <Zap className="h-10 w-10 text-indigo-600 mb-4" />
                  <h3 className="text-2xl font-black text-zinc-900 mb-2">Starter</h3>
                  <p className="text-zinc-600 font-medium">Perfect for small schools</p>
                </div>
                <div className="mb-8">
                  <span className="text-5xl font-black text-zinc-900">$499</span>
                  <span className="text-zinc-600 font-medium">/month</span>
                  <p className="text-sm text-zinc-500 mt-2">Up to 500 students</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    "AI Sentiment Analysis",
                    "Secure Messaging",
                    "Real-time Alerts",
                    "Basic Analytics",
                    "2 Counselor Accounts",
                    "Email Support"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-zinc-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="block w-full rounded-xl bg-zinc-900 py-4 text-center font-black text-white transition-all hover:bg-zinc-800">
                  Get Started
                </Link>
              </div>

              {/* Professional Plan */}
              <div className="relative rounded-3xl border-2 border-indigo-500 bg-gradient-to-b from-white to-indigo-50/50 p-8 shadow-2xl shadow-indigo-500/20 scale-105">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 px-6 py-2 text-sm font-black text-white">
                  MOST POPULAR
                </div>
                <div className="mb-6">
                  <Crown className="h-10 w-10 text-indigo-600 mb-4" />
                  <h3 className="text-2xl font-black text-zinc-900 mb-2">Professional</h3>
                  <p className="text-zinc-600 font-medium">For growing institutions</p>
                </div>
                <div className="mb-8">
                  <span className="text-5xl font-black text-zinc-900">$999</span>
                  <span className="text-zinc-600 font-medium">/month</span>
                  <p className="text-sm text-zinc-500 mt-2">Up to 2,000 students</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    "Everything in Starter",
                    "Advanced Analytics",
                    "Custom Alert Rules",
                    "10 Counselor Accounts",
                    "Guardian Portal Access",
                    "Priority Support",
                    "API Access",
                    "Custom Integrations"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-zinc-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="block w-full rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 py-4 text-center font-black text-white transition-all hover:shadow-xl hover:shadow-indigo-500/30">
                  Get Started
                </Link>
              </div>

              {/* Enterprise Plan */}
              <div className="rounded-3xl border-2 border-zinc-200 bg-white p-8 transition-all hover:shadow-xl">
                <div className="mb-6">
                  <Crown className="h-10 w-10 text-amber-600 mb-4" />
                  <h3 className="text-2xl font-black text-zinc-900 mb-2">Enterprise</h3>
                  <p className="text-zinc-600 font-medium">For large organizations</p>
                </div>
                <div className="mb-8">
                  <span className="text-5xl font-black text-zinc-900">Custom</span>
                  <p className="text-sm text-zinc-500 mt-2">Unlimited students</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    "Everything in Professional",
                    "Unlimited Counselors",
                    "Dedicated Account Manager",
                    "Custom Training",
                    "SLA Guarantee",
                    "24/7 Phone Support",
                    "White-label Options",
                    "On-premise Deployment"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-zinc-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="block w-full rounded-xl bg-zinc-900 py-4 text-center font-black text-white transition-all hover:bg-zinc-800">
                  Contact Sales
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
