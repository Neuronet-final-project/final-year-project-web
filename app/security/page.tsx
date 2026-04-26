"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Shield, Lock, Eye, Server, FileCheck, Users, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-indigo-50/30 to-white">
      <Navbar />
      
      <main className="flex-1">
        <section className="relative overflow-hidden pt-32 pb-20">
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-indigo-500/20 to-transparent blur-[120px]" />
          
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-50 to-cyan-50 px-5 py-2 text-sm font-black text-emerald-600 border border-emerald-200/60 mb-8">
                <Shield className="h-4 w-4" />
                SECURITY & COMPLIANCE
              </div>
              <h1 className="text-5xl font-black tracking-tight text-zinc-900 md:text-7xl mb-8">
                Your Data is{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-500">
                  Protected
                </span>
              </h1>
              <p className="mx-auto max-w-3xl text-xl text-zinc-600 font-medium">
                Enterprise-grade security and compliance built into every layer of our platform. We take data protection seriously.
              </p>
            </div>

            {/* Security Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {[
                {
                  icon: Lock,
                  title: "End-to-End Encryption",
                  description: "All data is encrypted using AES-256 encryption both in transit and at rest. Your sensitive information is always protected.",
                  gradient: "from-emerald-500 to-teal-600"
                },
                {
                  icon: Shield,
                  title: "HIPAA Compliance",
                  description: "Full compliance with HIPAA regulations for healthcare data protection, including BAA agreements and audit trails.",
                  gradient: "from-blue-500 to-indigo-600"
                },
                {
                  icon: FileCheck,
                  title: "SOC 2 Type II Certified",
                  description: "Independently audited and certified for security, availability, and confidentiality controls.",
                  gradient: "from-violet-500 to-purple-600"
                },
                {
                  icon: Users,
                  title: "Role-Based Access Control",
                  description: "Granular permissions ensure users only access data relevant to their role and responsibilities.",
                  gradient: "from-cyan-500 to-blue-600"
                },
                {
                  icon: Eye,
                  title: "Privacy by Design",
                  description: "COPPA compliant with strict data minimization and purpose limitation principles built into our architecture.",
                  gradient: "from-rose-500 to-pink-600"
                },
                {
                  icon: Server,
                  title: "Secure Infrastructure",
                  description: "Hosted on AWS with multi-region redundancy, DDoS protection, and 99.9% uptime SLA.",
                  gradient: "from-amber-500 to-orange-600"
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

            {/* Compliance Badges */}
            <div className="rounded-3xl bg-zinc-900 p-12 text-white">
              <h2 className="text-3xl font-black text-center mb-12">Certifications & Compliance</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { name: "HIPAA", desc: "Healthcare Compliance" },
                  { name: "SOC 2", desc: "Type II Certified" },
                  { name: "COPPA", desc: "Child Privacy" },
                  { name: "GDPR", desc: "EU Data Protection" }
                ].map((cert, i) => (
                  <div key={i} className="text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
                      <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                    </div>
                    <h4 className="font-black text-lg mb-1">{cert.name}</h4>
                    <p className="text-sm text-zinc-400">{cert.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
