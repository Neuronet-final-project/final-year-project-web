"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Briefcase, Heart, Users, Zap, MapPin, Clock } from "lucide-react";
import Link from "next/link";

export default function CareersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-indigo-50/30 to-white">
      <Navbar />
      
      <main className="flex-1">
        <section className="relative overflow-hidden pt-32 pb-20">
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-indigo-500/20 to-transparent blur-[120px]" />
          
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-cyan-50 px-5 py-2 text-sm font-black text-indigo-600 border border-indigo-200/60 mb-8">
                <Briefcase className="h-4 w-4" />
                JOIN OUR TEAM
              </div>
              <h1 className="text-5xl font-black tracking-tight text-zinc-900 md:text-7xl mb-8">
                Build the Future of{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
                  Mental Health Care
                </span>
              </h1>
              <p className="mx-auto max-w-3xl text-xl text-zinc-600 font-medium">
                Join a mission-driven team working to transform adolescent mental health support through innovative technology.
              </p>
            </div>

            {/* Why Join Us */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {[
                { icon: Heart, title: "Mission-Driven", desc: "Make a real impact on mental health" },
                { icon: Users, title: "Collaborative", desc: "Work with passionate experts" },
                { icon: Zap, title: "Innovation", desc: "Cutting-edge AI and technology" },
                { icon: Briefcase, title: "Growth", desc: "Career development opportunities" }
              ].map((benefit, i) => (
                <div key={i} className="rounded-2xl border-2 border-zinc-100 bg-white p-6 text-center transition-all hover:shadow-xl hover:-translate-y-2">
                  <benefit.icon className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
                  <h3 className="font-black text-lg mb-2">{benefit.title}</h3>
                  <p className="text-sm text-zinc-600">{benefit.desc}</p>
                </div>
              ))}
            </div>

            {/* Open Positions */}
            <div className="mb-12">
              <h2 className="text-3xl font-black text-center mb-12">Open Positions</h2>
              <div className="space-y-6">
                {[
                  {
                    title: "Senior Full-Stack Engineer",
                    department: "Engineering",
                    location: "Remote",
                    type: "Full-time",
                    description: "Build scalable features for our mental health platform using React, Node.js, and Python."
                  },
                  {
                    title: "Machine Learning Engineer",
                    department: "AI/ML",
                    location: "Remote",
                    type: "Full-time",
                    description: "Develop and improve our NLP models for sentiment analysis and risk detection."
                  },
                  {
                    title: "Product Designer",
                    department: "Design",
                    location: "Remote",
                    type: "Full-time",
                    description: "Create intuitive, empathetic user experiences for adolescents and counselors."
                  },
                  {
                    title: "Clinical Psychologist",
                    department: "Clinical",
                    location: "Hybrid",
                    type: "Part-time",
                    description: "Provide clinical guidance and validate our AI models with mental health expertise."
                  }
                ].map((job, i) => (
                  <div key={i} className="rounded-2xl border-2 border-zinc-100 bg-white p-8 transition-all hover:shadow-xl hover:border-indigo-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-zinc-900 mb-2">{job.title}</h3>
                        <p className="text-zinc-600 mb-4">{job.description}</p>
                        <div className="flex flex-wrap gap-3">
                          <span className="inline-flex items-center gap-2 text-sm font-bold text-zinc-600">
                            <Briefcase className="h-4 w-4" />
                            {job.department}
                          </span>
                          <span className="inline-flex items-center gap-2 text-sm font-bold text-zinc-600">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="inline-flex items-center gap-2 text-sm font-bold text-zinc-600">
                            <Clock className="h-4 w-4" />
                            {job.type}
                          </span>
                        </div>
                      </div>
                      <Link href="/footer/contact" className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-8 py-3 font-black text-white transition-all hover:shadow-xl hover:scale-105 text-center">
                        Apply Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-cyan-600 p-12 text-center text-white">
              <h2 className="text-3xl font-black mb-4">Don't see the right role?</h2>
              <p className="text-xl mb-8 text-indigo-100">
                We're always looking for talented people. Send us your resume!
              </p>
              <Link href="/footer/contact" className="inline-block rounded-xl bg-white px-8 py-4 font-black text-indigo-600 transition-all hover:shadow-xl hover:scale-105">
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
