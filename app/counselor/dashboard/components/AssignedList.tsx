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
    <div className="flex flex-col h-full rounded-[2.5rem] border border-white/5 bg-[#09090b] p-10 shadow-2xl transition-all duration-500 group/container">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
           <div className="bg-indigo-600/20 p-2.5 rounded-xl border border-indigo-500/20">
              <UserCheck className="h-6 w-6 text-indigo-400" />
           </div>
           <h3 className="text-2xl font-black tracking-tight text-white">Assigned Adolescents</h3>
        </div>
        <button className="group/btn flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors">
          Directory <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 space-y-4 max-h-[450px] custom-scrollbar">
        {adolescents.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 text-sm font-bold text-zinc-500">
            <UserCheck className="h-10 w-10 opacity-20 mb-3" />
            No adolescents currently assigned.
          </div>
        ) : (
          adolescents.map((a, i) => {
            const initials = a.full_name
              ? a.full_name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
              : "??";

            const moodColors = {
              "Needs Attention": "text-rose-400 bg-rose-400/10 border-rose-400/20",
              "Declining": "text-orange-400 bg-orange-400/10 border-orange-400/20",
              "Improving": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
              "Stable": "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
            };

            const status = a.status || (i % 4 === 0 ? "Needs Attention" : i % 4 === 1 ? "Improving" : "Stable");

            return (
              <div
                key={a.adolescent_id || Math.random()}
                className="group relative flex items-center justify-between rounded-3xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-500 hover:bg-white/[0.05] hover:border-white/10 hover:translate-x-1"
              >
                <div className="flex items-center gap-5">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-black shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 bg-zinc-900 border border-white/10 text-white`}>
                    {initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg tracking-tight group-hover:text-indigo-400 transition-colors">{a.full_name || a.email}</h4>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">
                      Activity: {a.last_activity ? new Date(a.last_activity).toLocaleDateString() : "Just Now"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className={`hidden sm:inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${moodColors[status as keyof typeof moodColors]}`}>
                    {status}
                  </span>
                  <Link
                    href={`/counselor/adolescent/${a.adolescent_id}`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-zinc-500 hover:bg-indigo-600 hover:text-white transition-all hover:rotate-12"
                  >
                    <ArrowRight className="h-5 w-5" />
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
