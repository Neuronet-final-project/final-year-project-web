"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-indigo-50/30 to-white">
      <Navbar />

      <main className="flex-1">
        <section className="relative overflow-hidden pt-20 pb-16">
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-indigo-500/20 to-transparent blur-[100px]" />
          
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-5 py-2 text-sm font-black text-indigo-600 backdrop-blur-md border border-indigo-100 mb-6">
                <MessageSquare className="h-4 w-4" />
                GET IN TOUCH
              </div>
              
              <h1 className="text-5xl font-black tracking-tight text-zinc-900 md:text-6xl mb-6">
                We're Here to Help
              </h1>
              
              <p className="text-xl text-zinc-600 font-medium">
                Have questions about NEURONET? Our team is ready to assist you.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Info Cards */}
              <div className="space-y-6">
                <div className="rounded-3xl bg-white border-2 border-indigo-100 p-8 hover:shadow-xl hover:shadow-indigo-100/50 transition-all">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white mb-6">
                    <Mail className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-black text-zinc-900 mb-2">Email Us</h3>
                  <p className="text-sm text-zinc-600 mb-4">Our team typically responds within 24 hours</p>
                  <a href="mailto:contact@neuronet.com" className="text-indigo-600 font-bold hover:text-indigo-700">
                    contact@neuronet.com
                  </a>
                </div>

                <div className="rounded-3xl bg-white border-2 border-cyan-100 p-8 hover:shadow-xl hover:shadow-cyan-100/50 transition-all">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 text-white mb-6">
                    <Phone className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-black text-zinc-900 mb-2">Call Us</h3>
                  <p className="text-sm text-zinc-600 mb-4">Mon-Fri, 9AM-6PM EST</p>
                  <a href="tel:+1234567890" className="text-cyan-600 font-bold hover:text-cyan-700">
                    +1 (234) 567-890
                  </a>
                </div>

                <div className="rounded-3xl bg-white border-2 border-emerald-100 p-8 hover:shadow-xl hover:shadow-emerald-100/50 transition-all">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white mb-6">
                    <Clock className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-black text-zinc-900 mb-2">Support Hours</h3>
                  <p className="text-sm text-zinc-600 mb-2">Monday - Friday: 9AM - 6PM EST</p>
                  <p className="text-sm text-zinc-600">Emergency: 24/7 Crisis Line</p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="rounded-3xl bg-white border-2 border-zinc-100 p-8 md:p-12 shadow-xl">
                  <h2 className="text-3xl font-black text-zinc-900 mb-8">Send us a Message</h2>
                  
                  {submitted ? (
                    <div className="rounded-2xl bg-emerald-50 border-2 border-emerald-200 p-8 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white mx-auto mb-4">
                        <Send className="h-8 w-8" />
                      </div>
                      <h3 className="text-2xl font-black text-emerald-900 mb-2">Message Sent!</h3>
                      <p className="text-emerald-700">We'll get back to you within 24 hours.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-black text-zinc-700 mb-2 uppercase tracking-wider">
                            Your Name
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-zinc-900 font-medium focus:border-indigo-500 focus:outline-none transition-colors"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-black text-zinc-700 mb-2 uppercase tracking-wider">
                            Email Address
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-zinc-900 font-medium focus:border-indigo-500 focus:outline-none transition-colors"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-black text-zinc-700 mb-2 uppercase tracking-wider">
                          Subject
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                          className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-zinc-900 font-medium focus:border-indigo-500 focus:outline-none transition-colors"
                          placeholder="How can we help?"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-black text-zinc-700 mb-2 uppercase tracking-wider">
                          Message
                        </label>
                        <textarea
                          required
                          rows={6}
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-zinc-900 font-medium focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                          placeholder="Tell us more about your inquiry..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-8 py-4 text-lg font-black text-white hover:shadow-xl hover:shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                      >
                        Send Message
                        <Send className="h-5 w-5" />
                      </button>
                    </form>
                  )}
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
