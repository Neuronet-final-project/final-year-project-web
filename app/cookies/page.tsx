"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Cookie } from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-indigo-50/30 to-white">
      <Navbar />
      
      <main className="flex-1">
        <section className="relative overflow-hidden pt-32 pb-20">
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-indigo-500/20 to-transparent blur-[120px]" />
          
          <div className="mx-auto max-w-4xl px-5 md:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-2 text-sm font-black text-amber-600 border border-amber-200/60 mb-8">
                <Cookie className="h-4 w-4" />
                COOKIE POLICY
              </div>
              <h1 className="text-5xl font-black tracking-tight text-zinc-900 md:text-6xl mb-6">
                Cookie Policy
              </h1>
              <p className="text-lg text-zinc-600">
                Last updated: April 27, 2026
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="rounded-2xl border-2 border-zinc-100 bg-white p-8 mb-8">
                <h2 className="text-2xl font-black text-zinc-900 mb-4">What Are Cookies?</h2>
                <p className="text-zinc-600 leading-relaxed">
                  Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our platform.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-zinc-100 bg-white p-8 mb-8">
                <h2 className="text-2xl font-black text-zinc-900 mb-4">Types of Cookies We Use</h2>
                
                <h3 className="text-xl font-black text-zinc-900 mt-6 mb-3">Essential Cookies</h3>
                <p className="text-zinc-600 leading-relaxed mb-4">
                  These cookies are necessary for the website to function properly. They enable core functionality such as security, authentication, and accessibility features.
                </p>

                <h3 className="text-xl font-black text-zinc-900 mt-6 mb-3">Performance Cookies</h3>
                <p className="text-zinc-600 leading-relaxed mb-4">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our platform.
                </p>

                <h3 className="text-xl font-black text-zinc-900 mt-6 mb-3">Functional Cookies</h3>
                <p className="text-zinc-600 leading-relaxed mb-4">
                  These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
                </p>

                <h3 className="text-xl font-black text-zinc-900 mt-6 mb-3">Analytics Cookies</h3>
                <p className="text-zinc-600 leading-relaxed">
                  We use analytics cookies to understand how users navigate our platform, which pages are most popular, and how we can improve the user experience.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-zinc-100 bg-white p-8 mb-8">
                <h2 className="text-2xl font-black text-zinc-900 mb-4">Managing Cookies</h2>
                <p className="text-zinc-600 leading-relaxed mb-4">
                  You can control and manage cookies in various ways. Please note that removing or blocking cookies may impact your user experience and some features may no longer be fully functional.
                </p>
                <p className="text-zinc-600 leading-relaxed">
                  Most browsers automatically accept cookies, but you can modify your browser settings to decline cookies if you prefer. Instructions for managing cookies can be found in your browser's help section.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-zinc-100 bg-white p-8 mb-8">
                <h2 className="text-2xl font-black text-zinc-900 mb-4">Third-Party Cookies</h2>
                <p className="text-zinc-600 leading-relaxed">
                  We may use third-party services that set cookies on your device. These services help us analyze website traffic and improve our platform. We carefully select our third-party partners and ensure they comply with applicable privacy regulations.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-zinc-100 bg-white p-8">
                <h2 className="text-2xl font-black text-zinc-900 mb-4">Updates to This Policy</h2>
                <p className="text-zinc-600 leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We encourage you to review this policy periodically.
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
