"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Shield, CheckCircle2, Lock, FileCheck } from "lucide-react";

export default function CompliancePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-indigo-50/30 to-white">
      <Navbar />
      
      <main className="flex-1">
        <section className="relative overflow-hidden pt-32 pb-20">
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-emerald-500/20 to-transparent blur-[120px]" />
          
          <div className="mx-auto max-w-4xl px-5 md:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-50 to-cyan-50 px-5 py-2 text-sm font-black text-emerald-600 border border-emerald-200/60 mb-8">
                <Shield className="h-4 w-4" />
                COMPLIANCE
              </div>
              <h1 className="text-5xl font-black tracking-tight text-zinc-900 md:text-6xl mb-6">
                Regulatory Compliance
              </h1>
              <p className="text-lg text-zinc-600">
                Our commitment to meeting the highest standards of data protection and privacy
              </p>
            </div>

            {/* Compliance Standards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="rounded-2xl border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 mb-6">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-black text-zinc-900 mb-3">HIPAA Compliance</h3>
                <p className="text-zinc-600 leading-relaxed">
                  Full compliance with the Health Insurance Portability and Accountability Act for protecting sensitive patient health information.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 mb-6">
                  <FileCheck className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-black text-zinc-900 mb-3">SOC 2 Type II</h3>
                <p className="text-zinc-600 leading-relaxed">
                  Independently audited and certified for security, availability, processing integrity, confidentiality, and privacy.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-violet-100 bg-gradient-to-br from-violet-50 to-white p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 mb-6">
                  <Lock className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-black text-zinc-900 mb-3">COPPA Compliant</h3>
                <p className="text-zinc-600 leading-relaxed">
                  Adherence to the Children's Online Privacy Protection Act, ensuring protection of children's personal information.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-cyan-100 bg-gradient-to-br from-cyan-50 to-white p-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 mb-6">
                  <CheckCircle2 className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-black text-zinc-900 mb-3">GDPR Ready</h3>
                <p className="text-zinc-600 leading-relaxed">
                  Compliance with the General Data Protection Regulation for processing personal data of EU residents.
                </p>
              </div>
            </div>

            {/* Detailed Sections */}
            <div className="space-y-8">
              <div className="rounded-2xl border-2 border-zinc-100 bg-white p-8">
                <h2 className="text-2xl font-black text-zinc-900 mb-4">Data Protection Measures</h2>
                <ul className="space-y-3">
                  {[
                    "End-to-end encryption for all data in transit and at rest",
                    "Regular security audits and penetration testing",
                    "Multi-factor authentication for all user accounts",
                    "Role-based access control with principle of least privilege",
                    "Automated backup and disaster recovery procedures",
                    "24/7 security monitoring and incident response"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border-2 border-zinc-100 bg-white p-8">
                <h2 className="text-2xl font-black text-zinc-900 mb-4">Privacy Commitments</h2>
                <ul className="space-y-3">
                  {[
                    "Data minimization - we only collect what's necessary",
                    "Purpose limitation - data used only for stated purposes",
                    "User consent required for all data processing",
                    "Right to access, correct, and delete personal data",
                    "Transparent data processing practices",
                    "No sale of personal information to third parties"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border-2 border-zinc-100 bg-white p-8">
                <h2 className="text-2xl font-black text-zinc-900 mb-4">Audit & Certification</h2>
                <p className="text-zinc-600 leading-relaxed mb-4">
                  NEURONET undergoes regular third-party audits to maintain our compliance certifications. Our security and privacy practices are continuously reviewed and updated to meet evolving regulatory requirements.
                </p>
                <p className="text-zinc-600 leading-relaxed">
                  For detailed compliance documentation or to request our latest audit reports, please contact our compliance team.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
