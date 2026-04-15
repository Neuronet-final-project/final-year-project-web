"use client";

import CounselorSidebar from "@/components/counselor/CounselorSidebar";

export default function CounselorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      {/* PERSISTENT SIDEBAR */}
      <CounselorSidebar />

      {/* MAIN CONTENT CANVAS */}
      <main className="flex-1 relative overflow-y-auto custom-scrollbar">
        {/* Dynamic Background Mesh (Consistent across subpages) */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-transparent"></div>
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-100 via-transparent to-transparent"></div>
        
        <div className="relative z-10 w-full min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
