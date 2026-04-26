"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BookOpen, Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-indigo-50/30 to-white">
      <Navbar />
      
      <main className="flex-1">
        <section className="relative overflow-hidden pt-32 pb-20">
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-indigo-500/20 to-transparent blur-[120px]" />
          
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-cyan-50 px-5 py-2 text-sm font-black text-indigo-600 border border-indigo-200/60 mb-8">
                <BookOpen className="h-4 w-4" />
                INSIGHTS & UPDATES
              </div>
              <h1 className="text-5xl font-black tracking-tight text-zinc-900 md:text-7xl mb-8">
                The NEURONET{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
                  Blog
                </span>
              </h1>
              <p className="mx-auto max-w-3xl text-xl text-zinc-600 font-medium">
                Insights on mental health, AI technology, and the future of adolescent care.
              </p>
            </div>

            {/* Featured Post */}
            <div className="mb-16 rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-cyan-50 p-8 md:p-12">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <span className="inline-block rounded-full bg-indigo-600 px-4 py-1 text-xs font-black text-white mb-4">
                    FEATURED
                  </span>
                  <h2 className="text-4xl font-black text-zinc-900 mb-4">
                    The Role of AI in Early Mental Health Intervention
                  </h2>
                  <p className="text-lg text-zinc-600 mb-6">
                    Exploring how artificial intelligence is transforming the way we detect and respond to mental health challenges in adolescents.
                  </p>
                  <div className="flex items-center gap-6 text-sm text-zinc-600 mb-6">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      April 15, 2026
                    </span>
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Dr. Sarah Johnson
                    </span>
                  </div>
                  <Link href="#" className="inline-flex items-center gap-2 font-black text-indigo-600 hover:text-indigo-700">
                    Read More <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Understanding Adolescent Mental Health Trends in 2026",
                  excerpt: "A comprehensive look at the latest statistics and emerging patterns in youth mental health.",
                  author: "Dr. Michael Chen",
                  date: "April 10, 2026",
                  category: "Research"
                },
                {
                  title: "Privacy-First AI: Our Approach to Ethical Technology",
                  excerpt: "How we balance powerful AI capabilities with strict privacy protections and ethical guidelines.",
                  author: "Emily Rodriguez",
                  date: "April 5, 2026",
                  category: "Technology"
                },
                {
                  title: "Success Story: How One School Transformed Student Support",
                  excerpt: "A case study on implementing NEURONET and the measurable impact on student well-being.",
                  author: "James Wilson",
                  date: "March 28, 2026",
                  category: "Case Study"
                },
                {
                  title: "Best Practices for Counselors Using AI Tools",
                  excerpt: "Practical tips for mental health professionals integrating AI into their practice.",
                  author: "Dr. Lisa Martinez",
                  date: "March 20, 2026",
                  category: "Best Practices"
                },
                {
                  title: "The Science Behind Sentiment Analysis",
                  excerpt: "A deep dive into the NLP models and techniques powering our risk detection system.",
                  author: "Dr. David Park",
                  date: "March 15, 2026",
                  category: "Technology"
                },
                {
                  title: "Building Trust with Adolescents in Digital Spaces",
                  excerpt: "Strategies for creating safe, supportive environments for youth mental health conversations.",
                  author: "Dr. Sarah Johnson",
                  date: "March 10, 2026",
                  category: "Clinical"
                }
              ].map((post, i) => (
                <article key={i} className="group rounded-2xl border-2 border-zinc-100 bg-white p-6 transition-all hover:shadow-xl hover:-translate-y-2">
                  <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-black text-indigo-600 mb-4">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-black text-zinc-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-zinc-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </span>
                  </div>
                  <Link href="#" className="inline-flex items-center gap-2 text-sm font-black text-indigo-600 hover:text-indigo-700">
                    Read Article <ArrowRight className="h-3 w-3" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
