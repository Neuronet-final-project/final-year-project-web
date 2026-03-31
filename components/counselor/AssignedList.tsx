import Link from "next/link";
import React from "react";

type AssignedAdolescent = {
  adolescent_id?: string;
  full_name?: string;
  email?: string;
  last_activity?: string;
  // Synthetic props added by page for display
  status?: "Declining" | "Improving" | "Stable" | "Needs Attention";
};

export function AssignedList({
  adolescents,
}: {
  adolescents: AssignedAdolescent[];
}) {
  return (
    <div className="flex flex-col h-full rounded-[2rem] border border-white/60 bg-white/70 backdrop-blur-xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-black tracking-tight text-zinc-900">Assigned Adolescents</h3>
        <span className="group flex items-center gap-1 text-sm font-bold text-[#4F46E5] cursor-pointer hover:text-indigo-700 transition">
          View All <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[400px]">
        {adolescents.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            No adolescents assigned yet.
          </div>
        ) : (
          adolescents.map((a, i) => {
            const initials = a.full_name
              ? a.full_name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
              : "??";

            // Determine fake badge/color based on index just for the visual layout matching 
            // the requested UI. In production, this would come from the AI mood engine endpoint.
            const isRed = i % 4 === 0;
            const isGreen = i % 4 === 1;
            const isOrange = i % 4 === 2;

            return (
              <div
                key={a.adolescent_id || Math.random()}
                className="group relative flex items-center justify-between rounded-2xl border border-white/50 bg-white/50 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:bg-indigo-50/50 hover:shadow-md"
              >
                <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-to-b from-indigo-400 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                <div className="flex items-center gap-4 pl-2">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-black shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                    isRed ? 'bg-red-50 text-red-600 border border-red-100' :
                    isGreen ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    isOrange ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                    'bg-zinc-100 text-zinc-600 border border-zinc-200'
                  }`}>
                    {initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900">{a.full_name || a.email}</h4>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Last activity: {a.last_activity ? new Date(a.last_activity).toLocaleDateString() : "Never"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2">
                     <span className="text-xl">{isRed ? "😟" : isGreen ? "😃" : isOrange ? "😐" : "🙂"}</span>
                     <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                        isRed ? 'bg-red-50 text-red-600' :
                        isGreen ? 'bg-emerald-50 text-emerald-600' :
                        isOrange ? 'bg-orange-50 text-orange-600' :
                        'bg-zinc-100 text-zinc-600'
                     }`}>
                       {a.status || (isRed ? "Needs Attention" : isGreen ? "Improving" : isOrange ? "Stable" : "Stable")}
                     </span>
                  </div>
                  <Link
                    href={`/counselor/adolescent/${a.adolescent_id}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 transition-colors group-hover:bg-[#4F46E5] group-hover:text-white"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
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
