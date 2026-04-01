import React from "react";
import Link from "next/link";
import { AlertCircle, Zap, ShieldAlert, Info, ArrowRight } from "lucide-react";

type Alert = {
  _id: string;
  risk_level: string;
  risk_score: number;
  created_at: string;
  adolescent_email?: string;
};

export default function RecentAlerts({ alerts }: { alerts: Alert[] }) {
  const displayAlerts = alerts.slice(0, 4);
 
  return (
    <div className="flex flex-col h-full rounded-[2rem] border border-white bg-white/70 backdrop-blur-md p-8 shadow-sm ring-1 ring-zinc-200/50">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
           <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-100 text-rose-600 shadow-sm">
              <ShieldAlert className="h-6 w-6" />
           </div>
           <h3 className="text-xl font-bold tracking-tight text-zinc-900">Critical Alerts</h3>
        </div>
        <Link href="#alerts" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#6366f1] hover:text-[#06b6d4] transition-colors">
          View All <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
 
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar pr-1">
        {displayAlerts.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50/50 text-sm font-bold text-zinc-400">
            <Zap className="h-10 w-10 opacity-20 mb-3" />
            No risks detected.
          </div>
        ) : (
          displayAlerts.map((alert) => {
            const riskConfig = {
              high: { color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100", accent: "bg-rose-500", icon: ShieldAlert },
              medium: { color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100", accent: "bg-orange-500", icon: AlertCircle },
              low: { color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", accent: "bg-indigo-500", icon: Info },
            };
            const cfg = riskConfig[alert.risk_level as keyof typeof riskConfig] || riskConfig.low;
 
            return (
              <div
                key={alert._id}
                className="group relative flex items-center justify-between p-4 rounded-3xl border border-zinc-100 bg-white transition-all duration-300 hover:shadow-lg hover:shadow-rose-50 hover:bg-slate-50/50 ring-1 ring-transparent hover:ring-rose-100"
              >
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full transition-all duration-300 group-hover:h-12 ${cfg.accent}`} />
                
                <div className="flex items-center gap-4">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-inner transition-transform group-hover:scale-105 ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                    <cfg.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className={`text-[10px] font-black uppercase tracking-[0.1em] ${cfg.color}`}>
                      {alert.risk_level} Priority
                    </h4>
                    <p className="text-sm font-bold text-zinc-900 mt-0.5">
                      {alert.adolescent_email?.split('@')[0]}
                    </p>
                    <p className="text-[10px] font-bold text-zinc-400 mt-0.5">
                      Risk Score: <span className="text-zinc-600">{Math.round(alert.risk_score * 100)}%</span>
                    </p>
                  </div>
                </div>
                
                <div className="text-right flex flex-col items-end gap-2">
                  <div className="text-[10px] font-bold text-zinc-400">
                    {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="h-1.5 w-14 rounded-full bg-zinc-100 overflow-hidden shadow-inner">
                     <div className={`h-full ${cfg.accent}`} style={{ width: `${alert.risk_score * 100}%` }} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

