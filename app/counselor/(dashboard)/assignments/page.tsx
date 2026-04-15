"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, UserPlus, Search, Mail, Calendar, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

type AuthMeResponse =
  | { authenticated: false }
  | { authenticated: true; email: string; role: string; _id: string };

type AssignedAdolescent = {
  adolescent_id: string;
  email: string;
  full_name?: string;
  assigned_at: string;
  guardian_email?: string;
  guardian_full_name?: string;
};

export default function CounselorAssignmentsPage() {
  const router = useRouter();
  const [me, setMe] = useState<AuthMeResponse>({ authenticated: false });
  const [adolescents, setAdolescents] = useState<AssignedAdolescent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const m = (await res.json()) as AuthMeResponse;
        setMe(m);
        if (!("authenticated" in m) || !m.authenticated) {
          router.replace("/login");
          return;
        }

        const dashRes = await fetch("/api/proxy/backend/dashboard/counselor");
        if (dashRes.ok) {
          const data = await dashRes.json();
          setAdolescents(data.assigned_adolescents || []);
        } else {
          setError("Failed to load clinical assignments.");
        }
      } catch (err) {
        setError("Network error while loading assignments.");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const filtered = adolescents.filter(a => 
    (a.full_name || "").toLowerCase().includes(search.toLowerCase()) || 
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    a.adolescent_id.toLowerCase().includes(search.toLowerCase())
  );

  if (loading || !me.authenticated) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-500">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Syncing Caseload...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Active Caseload</h1>
            <p className="mt-2 text-sm font-medium text-zinc-500 max-w-md">Comprehensive list of adolescent cases assigned for clinical monitoring.</p>
          </div>
          <div className="flex items-center gap-2">
             <div className="px-5 py-3 bg-white border border-zinc-100 rounded-2xl shadow-sm flex items-center gap-3">
                <Users size={18} className="text-indigo-600" />
                <span className="text-xs font-black uppercase tracking-widest text-zinc-900">{adolescents.length} Managed Cases</span>
             </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-8">
           <div className="relative">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
             <input 
               type="text"
               placeholder="Search by name, email or secure ID..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full rounded-[2rem] border border-white bg-white px-14 py-5 text-base font-bold text-zinc-900 placeholder:text-zinc-300 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all shadow-lg shadow-indigo-50/50"
             />
           </div>
        </div>

        {/* GRID */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center border border-zinc-200 border-dashed rounded-[3rem] bg-indigo-50/10">
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-indigo-50 text-indigo-400 border border-indigo-100">
               <UserPlus size={48} />
            </div>
            <h3 className="text-2xl font-black text-zinc-400">Empty Caseload</h3>
            <p className="mt-4 text-sm font-medium text-zinc-500 max-w-sm mx-auto">No assignments found matching your search. New cases will appear here as they are triage directed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((adolescent) => (
              <div 
                key={adolescent.adolescent_id}
                className="group relative flex flex-col rounded-[2.5rem] border border-white bg-white/70 backdrop-blur-md p-8 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-2 ring-1 ring-zinc-200/50"
              >
                <div className="absolute top-6 right-6">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                </div>

                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-indigo-600 text-white shadow-xl shadow-indigo-100 group-hover:scale-110 transition-transform">
                  <span className="text-xl font-black">
                    {(adolescent.full_name || adolescent.email)[0].toUpperCase()}
                  </span>
                </div>
                
                <h3 className="text-xl font-black text-zinc-900 mb-2 truncate">
                  {adolescent.full_name || "Confidential Case"}
                </h3>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-zinc-500">
                    <Mail size={14} className="shrink-0" />
                    <span className="text-xs font-bold truncate">{adolescent.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-indigo-600/80 bg-indigo-50/50 p-2 rounded-xl border border-indigo-100/50">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                       <UserPlus size={12} />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black uppercase tracking-widest leading-none mb-0.5">Primary Guardian</span>
                       <span className="text-[11px] font-bold truncate">{adolescent.guardian_full_name || "Searching..."}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400">
                    <Calendar size={14} className="shrink-0" />
                    <span className="text-xs font-bold">Assigned: {new Date(adolescent.assigned_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400">
                    <ShieldCheck size={14} className="shrink-0" />
                    <span className="text-xs font-black uppercase tracking-tighter text-zinc-300">ID: {adolescent.adolescent_id.substring(0, 8)}...</span>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-zinc-100 flex items-center justify-between">
                   <Link 
                     href={`/counselor/chat?adolescent_id=${adolescent.adolescent_id}`}
                     className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors"
                   >
                     View Records <ArrowRight size={14} />
                   </Link>
                   <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                     Active
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
