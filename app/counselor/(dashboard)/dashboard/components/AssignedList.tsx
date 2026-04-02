import Link from "next/link";
import React from "react";
import { ArrowRight, UserCheck } from "lucide-react";

type AssignedAdolescent = {
  adolescent_id?: string;
  full_name?: string;
  email?: string;
  last_activity?: string;
  status?: "Declining" | "Improving" | "Stable" | "Needs Attention";
};

export default function AssignedList({
  adolescents,
}: {
  adolescents: AssignedAdolescent[];
}) {
  return (
    <div className="flex flex-col h-full rounded-[2.5rem] border border-white bg-white/70 backdrop-blur-md p-8 shadow-sm ring-1 ring-zinc-200/50">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
           <div className="bg-indigo-50 p-2.5 rounded-xl border border-indigo-100 shadow-sm">
              <UserCheck className="h-6 w-6 text-indigo-600" />
           </div>
           <h3 className="text-xl font-bold tracking-tight text-zinc-900">Active Caseload</h3>
        </div>
        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#6366f1] hover:text-[#06b6d4] transition-colors">
          Full Directory <ArrowRight className="h-3 w-3" />
        </button>
      </div>
 
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[400px] custom-scrollbar">
        {adolescents.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50/50 text-sm font-bold text-zinc-400">
            <UserCheck className="h-10 w-10 opacity-20 mb-3" />
            No active assignments.
          </div>
        ) : (
          adolescents.map((a, i) => {
            const initials = a.full_name
              ? a.full_name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
              : "U";
 
            const moodColors = {
              "Needs Attention": "text-rose-600 bg-rose-50 border-rose-100",
              "Declining": "text-orange-600 bg-orange-50 border-orange-100",
              "Improving": "text-emerald-600 bg-emerald-50 border-emerald-100",
              "Stable": "text-indigo-600 bg-indigo-50 border-indigo-100",
            };
 
            const status = a.status || ( (a as any).unresolved_alerts_count > 0 ? "Needs Attention" : "Stable" );
 
            return (
              <div
                key={a.adolescent_id || Math.random()}
                className="group relative flex items-center justify-between rounded-[1.5rem] border border-zinc-100 bg-white p-4 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-50 hover:bg-slate-50/50 ring-1 ring-transparent hover:ring-indigo-100"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xs font-black shadow-inner transition-transform group-hover:scale-105 bg-indigo-600 text-white`}>
                    {initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm tracking-tight">{a.full_name || a.email}</h4>
                    <p className="text-[10px] font-bold text-zinc-400 flex items-center gap-1.5 mt-0.5 uppercase tracking-wider">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                       Active {a.last_activity ? new Date(a.last_activity).toLocaleDateString() : "Today"}
                    </p>
                  </div>
                </div>
 
                <div className="flex items-center gap-4">
                  <span className={`hidden sm:inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${moodColors[status as keyof typeof moodColors]}`}>
                    {status}
                  </span>
                  <Link
                    href={`/counselor/adolescent/${a.adolescent_id}`}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-50 text-zinc-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm group-hover:rotate-6"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
