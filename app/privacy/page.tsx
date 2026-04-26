"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Shield, Lock, Eye, Database, UserCheck, FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden pt-20 pb-16 bg-gradient-to-b from-indigo-50 to-white">
          <div className="mx-auto max-w-4xl px-5 md:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-5 py-2 text-sm font-black text-indigo-600 mb-6">
              <Shield className="h-4 w-4" />
              PRIVACY POLICY
            </div>
            <h1 className="text-5xl font-black text-zinc-900 md:text-6xl mb-6">
              Your Privacy is Our Priority
            </h1>
            <p className="text-xl text-zinc-600">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-5 md:px-8">
            <div className="prose prose-lg max-w-none">
              
              {/* Introduction */}
              <div className="mb-12">
                <p className="text-lg text-zinc-600 leading-relaxed">
                  At NEURONET, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mental health platform. We are committed to maintaining the highest standards of data protection and comply with HIPAA, COPPA, and GDPR regulations.
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-12">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                      <Database className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h2 className="text-3xl font-black text-zinc-900">Information We Collect</h2>
                  </div>
                  <div className="pl-15 space-y-4">
                    <p className="text-zinc-600"><strong>Personal Information:</strong> Name, email address, date of birth, and contact information provided during registration.</p>
                    <p className="text-zinc-600"><strong>Health Information:</strong> Journal entries, mood reflections, and AI-generated emotional insights (protected under HIPAA).</p>
                    <p className="text-zinc-600"><strong>Usage Data:</strong> Log data, device information, and interaction patterns to improve our services.</p>
                    <p className="text-zinc-600"><strong>Communications:</strong> Messages exchanged with counselors through our encrypted platform.</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100">
                      <Lock className="h-6 w-6 text-cyan-600" />
                    </div>
                    <h2 className="text-3xl font-black text-zinc-900">How We Use Your Information</h2>
                  </div>
                  <div className="pl-15 space-y-4">
                    <p className="text-zinc-600"><strong>Service Delivery:</strong> To provide mental health support, AI analysis, and counselor matching.</p>
                    <p className="text-zinc-600"><strong>Safety & Risk Detection:</strong> To identify emotional patterns that may require professional intervention.</p>
                    <p className="text-zinc-600"><strong>Communication:</strong> To facilitate secure messaging between adolescents, counselors, and guardians.</p>
                    <p className="text-zinc-600"><strong>Improvement:</strong> To enhance our AI models and platform features (using anonymized data only).</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                      <UserCheck className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-black text-zinc-900">Data Sharing & Disclosure</h2>
                  </div>
                  <div className="pl-15 space-y-4">
                    <p className="text-zinc-600"><strong>With Consent:</strong> We only share information with authorized counselors and guardians based on explicit consent settings.</p>
                    <p className="text-zinc-600"><strong>Legal Requirements:</strong> We may disclose information when required by law or to prevent imminent harm.</p>
                    <p className="text-zinc-600"><strong>Service Providers:</strong> Trusted third-party services (cloud hosting, analytics) under strict confidentiality agreements.</p>
                    <p className="text-zinc-600"><strong>Never Sold:</strong> We never sell your personal or health information to third parties.</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100">
                      <Eye className="h-6 w-6 text-rose-600" />
                    </div>
                    <h2 className="text-3xl font-black text-zinc-900">Your Rights</h2>
                  </div>
                  <div className="pl-15 space-y-4">
                    <p className="text-zinc-600"><strong>Access:</strong> Request a copy of your personal data at any time.</p>
                    <p className="text-zinc-600"><strong>Correction:</strong> Update or correct inaccurate information.</p>
                    <p className="text-zinc-600"><strong>Deletion:</strong> Request deletion of your account and associated data (subject to legal retention requirements).</p>
                    <p className="text-zinc-600"><strong>Consent Management:</strong> Control who can access your information through granular consent settings.</p>
                    <p className="text-zinc-600"><strong>Data Portability:</strong> Export your data in a machine-readable format.</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
                      <FileText className="h-6 w-6 text-violet-600" />
                    </div>
                    <h2 className="text-3xl font-black text-zinc-900">Data Security</h2>
                  </div>
                  <div className="pl-15 space-y-4">
                    <p className="text-zinc-600">We implement industry-leading security measures including:</p>
                    <ul className="list-disc list-inside space-y-2 text-zinc-600">
                      <li>End-to-end encryption for all communications</li>
                      <li>AES-256 encryption for data at rest</li>
                      <li>Regular security audits and penetration testing</li>
                      <li>Multi-factor authentication for all users</li>
                      <li>SOC 2 Type II certified infrastructure</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-black text-zinc-900 mb-4">Children's Privacy (COPPA Compliance)</h2>
                  <p className="text-zinc-600">
                    NEURONET is designed for adolescents aged 13-18. We require guardian consent for users under 18 and implement additional protections for minors, including restricted data sharing and enhanced privacy controls.
                  </p>
                </div>

                <div>
                  <h2 className="text-3xl font-black text-zinc-900 mb-4">Contact Us</h2>
                  <p className="text-zinc-600 mb-4">
                    If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
                  </p>
                  <div className="rounded-2xl bg-zinc-50 p-6 border border-zinc-200">
                    <p className="text-zinc-900 font-bold">NEURONET Privacy Team</p>
                    <p className="text-zinc-600">Email: privacy@neuronet.com</p>
                    <p className="text-zinc-600">Response time: Within 48 hours</p>
                  </div>
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
