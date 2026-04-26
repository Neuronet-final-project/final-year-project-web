"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FileText, AlertCircle, CheckCircle, XCircle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        <section className="relative overflow-hidden pt-20 pb-16 bg-gradient-to-b from-cyan-50 to-white">
          <div className="mx-auto max-w-4xl px-5 md:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-5 py-2 text-sm font-black text-cyan-600 mb-6">
              <FileText className="h-4 w-4" />
              TERMS OF SERVICE
            </div>
            <h1 className="text-5xl font-black text-zinc-900 md:text-6xl mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-zinc-600">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-4xl px-5 md:px-8">
            <div className="prose prose-lg max-w-none space-y-12">
              
              <div>
                <h2 className="text-3xl font-black text-zinc-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-zinc-600">
                  By accessing or using NEURONET, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-black text-zinc-900 mb-4">2. User Eligibility</h2>
                <p className="text-zinc-600 mb-4">NEURONET is intended for:</p>
                <ul className="list-disc list-inside space-y-2 text-zinc-600">
                  <li>Adolescents aged 13-18 (with guardian consent)</li>
                  <li>Guardians of adolescent users</li>
                  <li>Licensed mental health professionals</li>
                  <li>Educational institution administrators</li>
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-black text-zinc-900 mb-4">3. Platform Use</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-1" />
                    <p className="text-zinc-600"><strong>Permitted:</strong> Using the platform for mental health support, journaling, and communication with assigned counselors.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="h-6 w-6 text-rose-500 flex-shrink-0 mt-1" />
                    <p className="text-zinc-600"><strong>Prohibited:</strong> Sharing login credentials, posting harmful content, attempting to bypass security measures, or using the platform for commercial purposes.</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-black text-zinc-900 mb-4">4. AI Analysis Disclaimer</h2>
                <div className="rounded-2xl bg-amber-50 border-2 border-amber-200 p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0" />
                    <div>
                      <p className="text-amber-900 font-bold mb-2">Important Notice</p>
                      <p className="text-amber-800">
                        NEURONET's AI analysis is designed to assist mental health professionals, not replace them. Our AI does not provide medical diagnoses, treatment recommendations, or emergency intervention. If you are experiencing a mental health crisis, please contact emergency services immediately.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-black text-zinc-900 mb-4">5. Counselor Responsibilities</h2>
                <p className="text-zinc-600">Licensed counselors using NEURONET agree to:</p>
                <ul className="list-disc list-inside space-y-2 text-zinc-600 mt-4">
                  <li>Maintain professional licensing and credentials</li>
                  <li>Adhere to ethical guidelines and professional standards</li>
                  <li>Respond to high-risk alerts within designated timeframes</li>
                  <li>Maintain confidentiality as required by law</li>
                </ul>
              </div>

              <div>
                <h2 className="text-3xl font-black text-zinc-900 mb-4">6. Limitation of Liability</h2>
                <p className="text-zinc-600">
                  NEURONET provides a platform for mental health support but is not liable for the actions or decisions of users, counselors, or guardians. We do not guarantee specific outcomes and are not responsible for any damages arising from platform use.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-black text-zinc-900 mb-4">7. Termination</h2>
                <p className="text-zinc-600">
                  We reserve the right to suspend or terminate accounts that violate these terms, engage in harmful behavior, or misuse the platform. Users may also terminate their accounts at any time through account settings.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-black text-zinc-900 mb-4">8. Changes to Terms</h2>
                <p className="text-zinc-600">
                  We may update these Terms of Service periodically. Users will be notified of significant changes via email and in-platform notifications. Continued use of the platform after changes constitutes acceptance of the updated terms.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-black text-zinc-900 mb-4">9. Contact Information</h2>
                <div className="rounded-2xl bg-zinc-50 p-6 border border-zinc-200">
                  <p className="text-zinc-900 font-bold">NEURONET Legal Team</p>
                  <p className="text-zinc-600">Email: legal@neuronet.com</p>
                  <p className="text-zinc-600">Response time: Within 5 business days</p>
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
