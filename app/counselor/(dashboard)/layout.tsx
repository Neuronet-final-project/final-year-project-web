"use client";

import CounselorSidebar from "@/components/counselor/CounselorSidebar";
import NotificationProvider from "@/components/counselor/NotificationProvider";

export default function CounselorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        {/* PERSISTENT SIDEBAR */}
        <CounselorSidebar />

        {/* MAIN CONTENT CANVAS */}
        <main className="flex-1 relative overflow-y-auto custom-scrollbar bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
          <div className="relative z-10 w-full min-h-full">
            {children}
          </div>
        </main>
      </div>
    </NotificationProvider>
  );
}
