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
    <div className="flex flex-col h-full rounded-[2.5rem] border border-white/5 bg-[#09090b] p-10 shadow-2xl transition-all duration-500">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
           <div className="bg-rose-500/20 p-2.5 rounded-xl border border-rose-500/20 text-rose-400">
              <ShieldAlert className="h-6 w-6" />
           </div>
           <h3 className="text-2xl font-black tracking-tight text-white">Critical Alerts</h3>
        </div>
        <Link href="#alerts" className="group/btn flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
          View Logs <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>

      <div className="flex flex-col gap-4 flex-1 overflow-y-auto max-h-[450px] custom-scrollbar pl-1 pr-2">
        {displayAlerts.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 text-sm font-bold text-zinc-500">
            <Zap className="h-10 w-10 opacity-20 mb-3" />
            No active risks detected.
          </div>
        ) : (
          displayAlerts.map((alert) => {
            const riskConfig = {
              high: { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", icon: ShieldAlert },
              medium: { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", icon: AlertCircle },
              low: { color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", icon: Info },
            };
            const cfg = riskConfig[alert.risk_level as keyof typeof riskConfig] || riskConfig.low;

            return (
              <div
                key={alert._id}
                className={`group relative flex items-center justify-between p-5 rounded-3xl border transition-all duration-500 hover:translate-x-1 bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10`}
              >
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full transition-all duration-500 group-hover:h-12 ${cfg.color.replace('text', 'bg')}`} />
                
                <div className="flex items-center gap-5">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-2xl transition-all duration-500 group-hover:scale-110 ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                    <cfg.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-black uppercase tracking-widest ${cfg.color}`}>
                      {alert.risk_level} Priority
                    </h4>
                    <p className="text-sm font-bold text-white mt-1">
                      {alert.adolescent_email?.split('@')[0]}
                    </p>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-0.5">
                      Risk Score: {Math.round(alert.risk_score * 100)}%
                    </p>
                  </div>
                </div>
                
                <div className="text-right flex flex-col items-end gap-1">
                  <div className="text-[10px] font-black font-mono text-zinc-500">
                    {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="h-1 w-12 rounded-full bg-zinc-900 overflow-hidden">
                     <div className={`h-full ${cfg.color.replace('text', 'bg')}`} style={{ width: `${alert.risk_score * 100}%` }} />
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
