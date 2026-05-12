"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Newspaper, Download, Mail, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function PressPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-indigo-50/30 to-white">
      <Navbar />
      
      <main className="flex-1">
        <section className="relative overflow-hidden pt-32 pb-20">
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-indigo-500/20 to-transparent blur-[120px]" />
          
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-cyan-50 px-5 py-2 text-sm font-black text-indigo-600 border border-indigo-200/60 mb-8">
                <Newspaper className="h-4 w-4" />
                PRESS & MEDIA
              </div>
              <h1 className="text-5xl font-black tracking-tight text-zinc-900 md:text-7xl mb-8">
                Press{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
                  Resources
                </span>
              </h1>
              <p className="mx-auto max-w-3xl text-xl text-zinc-600 font-medium">
                Media kit, company information, and press releases for journalists and content creators.
              </p>
            </div>

            {/* Press Kit */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              <div className="rounded-2xl border-2 border-zinc-100 bg-white p-8 text-center transition-all hover:shadow-xl hover:-translate-y-2">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600">
                  <ImageIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-black mb-3">Brand Assets</h3>
                <p className="text-zinc-600 mb-6">Logos, colors, and brand guidelines</p>
                <button className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 font-black text-white transition-all hover:bg-zinc-800">
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>

              <div className="rounded-2xl border-2 border-zinc-100 bg-white p-8 text-center transition-all hover:shadow-xl hover:-translate-y-2">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600">
                  <Newspaper className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-black mb-3">Press Releases</h3>
                <p className="text-zinc-600 mb-6">Latest company announcements</p>
                <button className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 font-black text-white transition-all hover:bg-zinc-800">
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>

              <div className="rounded-2xl border-2 border-zinc-100 bg-white p-8 text-center transition-all hover:shadow-xl hover:-translate-y-2">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-black mb-3">Media Contact</h3>
                <p className="text-zinc-600 mb-6">Get in touch with our team</p>
                <Link href="/footer/contact" className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 font-black text-white transition-all hover:bg-zinc-800">
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Recent Press */}
            <div className="mb-20">
              <h2 className="text-3xl font-black text-center mb-12">Recent Press Coverage</h2>
              <div className="space-y-6">
                {[
                  {
                    outlet: "TechCrunch",
                    title: "NEURONET Raises $10M to Expand AI-Powered Mental Health Platform",
                    date: "March 2026",
                    link: "#"
                  },
                  {
                    outlet: "EdTech Magazine",
                    title: "How AI is Transforming Student Mental Health Support",
                    date: "February 2026",
                    link: "#"
                  },
                  {
                    outlet: "Healthcare IT News",
                    title: "NEURONET Achieves HIPAA Compliance Certification",
                    date: "January 2026",
                    link: "#"
                  }
                ].map((article, i) => (
                  <div key={i} className="rounded-2xl border-2 border-zinc-100 bg-white p-6 transition-all hover:shadow-xl hover:border-indigo-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-black text-indigo-600 mb-2">
                          {article.outlet}
                        </span>
                        <h3 className="text-xl font-black text-zinc-900 mb-1">{article.title}</h3>
                        <p className="text-sm text-zinc-500">{article.date}</p>
                      </div>
                      <a href={article.link} className="rounded-xl border-2 border-zinc-200 px-6 py-3 font-black text-zinc-900 transition-all hover:bg-zinc-50 text-center">
                        Read Article
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Company Info */}
            <div className="rounded-3xl bg-zinc-900 p-12 text-white">
              <h2 className="text-3xl font-black mb-8 text-center">About NEURONET</h2>
              <div className="max-w-3xl mx-auto space-y-4 text-zinc-300 leading-relaxed">
                <p>
                  NEURONET is a leading AI-powered mental health platform designed specifically for adolescents, schools, and mental health professionals. Founded in 2024, our mission is to bridge the intervention gap in youth mental health through ethical AI technology and professional care coordination.
                </p>
                <p>
                  Our platform combines advanced sentiment analysis, secure communication channels, and real-time alerting to help detect and respond to mental health challenges before they escalate into crises. We serve over 100 schools and have helped thousands of adolescents access timely mental health support.
                </p>
                <p>
                  NEURONET is HIPAA and COPPA compliant, SOC 2 certified, and committed to privacy-first AI development.
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
