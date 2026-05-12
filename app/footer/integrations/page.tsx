"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Plug, Zap, Database, Mail, Calendar, FileText, MessageSquare, BarChart } from "lucide-react";

export default function IntegrationsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-indigo-50/30 to-white">
      <Navbar />
      
      <main className="flex-1">
        <section className="relative overflow-hidden pt-32 pb-20">
          <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-indigo-500/20 to-transparent blur-[120px]" />
          
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-cyan-50 px-5 py-2 text-sm font-black text-indigo-600 border border-indigo-200/60 mb-8">
                <Plug className="h-4 w-4" />
                INTEGRATIONS
              </div>
              <h1 className="text-5xl font-black tracking-tight text-zinc-900 md:text-7xl mb-8">
                Connect with Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
                  Existing Tools
                </span>
              </h1>
              <p className="mx-auto max-w-3xl text-xl text-zinc-600 font-medium">
                Seamlessly integrate NEURONET with your school's existing systems and workflows.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Database,
                  title: "Student Information Systems",
                  description: "Sync with PowerSchool, Infinite Campus, and other SIS platforms for automatic roster updates.",
                  gradient: "from-indigo-500 to-purple-600",
                  status: "Available"
                },
                {
                  icon: Mail,
                  title: "Email Platforms",
                  description: "Integration with Google Workspace and Microsoft 365 for seamless communication.",
                  gradient: "from-cyan-500 to-blue-600",
                  status: "Available"
                },
                {
                  icon: Calendar,
                  title: "Calendar Systems",
                  description: "Schedule counseling sessions directly through Google Calendar or Outlook.",
                  gradient: "from-emerald-500 to-teal-600",
                  status: "Available"
                },
                {
                  icon: MessageSquare,
                  title: "Communication Tools",
                  description: "Connect with Slack, Microsoft Teams for staff notifications and collaboration.",
                  gradient: "from-violet-500 to-purple-600",
                  status: "Available"
                },
                {
                  icon: BarChart,
                  title: "Analytics Platforms",
                  description: "Export data to Tableau, Power BI, or Google Data Studio for advanced reporting.",
                  gradient: "from-amber-500 to-orange-600",
                  status: "Available"
                },
                {
                  icon: FileText,
                  title: "Documentation Systems",
                  description: "Integrate with EHR systems for comprehensive patient record management.",
                  gradient: "from-rose-500 to-pink-600",
                  status: "Coming Soon"
                }
              ].map((integration, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl border-2 border-zinc-100 bg-white p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${integration.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${integration.gradient} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                        <integration.icon className="h-7 w-7 text-white" />
                      </div>
                      <span className={`text-xs font-black px-3 py-1 rounded-full ${
                        integration.status === "Available" 
                          ? "bg-emerald-100 text-emerald-700" 
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {integration.status}
                      </span>
                    </div>
                    <h3 className="mb-4 text-2xl font-black text-zinc-900">{integration.title}</h3>
                    <p className="text-zinc-600 leading-relaxed font-medium">{integration.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* API Section */}
            <div className="mt-20 rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-800 p-12 text-white">
              <div className="max-w-3xl mx-auto text-center">
                <Activity className="h-12 w-12 text-cyan-400 mx-auto mb-6" />
                <h2 className="text-3xl font-black mb-6">Custom Integrations with Our API</h2>
                <p className="text-xl text-zinc-300 mb-8">
                  Build custom integrations using our comprehensive REST API. Full documentation and developer support included.
                </p>
                <a href="/footer/contact" className="inline-block rounded-xl bg-white px-8 py-4 font-black text-zinc-900 transition-all hover:shadow-xl hover:scale-105">
                  Request API Access
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
