"use client";

import CounselorSidebar from "@/components/counselor/CounselorSidebar";
import NotificationProvider from "@/components/counselor/NotificationProvider";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function CounselorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <NotificationProvider>
      <div className="flex h-screen overflow-hidden bg-slate-50 relative">
        {/* MOBILE OVERLAY */}
        {mobileOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <CounselorSidebar onMobileClose={() => setMobileOpen(false)} />
        </div>

        {/* MAIN CONTENT CANVAS */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between bg-slate-900 p-4 border-b border-slate-800 shrink-0 z-30">
            <div className="flex items-center gap-3">
               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                 </svg>
               </div>
               <span className="font-black text-white tracking-tight">Neuronet</span>
            </div>
            <button onClick={() => setMobileOpen(true)} className="text-white p-2">
              <Menu size={24} />
            </button>
          </div>

          <main className="flex-1 relative overflow-y-auto custom-scrollbar bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
            <div className="relative z-10 w-full min-h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
}
