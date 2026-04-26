import React from "react";
import Link from "next/link";
import { AlertCircle, Zap, ShieldAlert, Info, ArrowRight, Brain } from "lucide-react";

type Alert = {
  _id: string;
  risk_level: string;
  risk_score: number;
  created_at: string;
  adolescent_email?: string;
  adolescent_name?: string;
  detected_emotions?: string[];
  main_concern?: string;
  ai_summary?: string;
};

export default function RecentAlerts({ alerts }: { alerts: Alert[] }) {
  // Show only 2 most recent high-priority alerts
  const displayAlerts = alerts
    .filter(a => a.risk_level === 'high')
    .slice(0, 2);
 
  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
           <div className="bg-red-50 p-2.5 rounded-xl border border-red-100 text-red-600">
              <ShieldAlert className="h-5 w-5" />
           </div>
           <div>
             <h3 className="text-lg font-black tracking-tight text-slate-900">Critical Alerts</h3>
             <p className="text-xs text-slate-500 font-medium">High priority cases</p>
           </div>
        </div>
        <Link 
          href="/counselor/alerts" 
          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"
        >
          View All <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
 
      <div className="flex flex-col gap-3 flex-1">
        {displayAlerts.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-sm font-semibold text-slate-400">
            <ShieldAlert className="h-8 w-8 opacity-30 mb-2" />
            No critical alerts
          </div>
        ) : (
          displayAlerts.map((alert) => {
            const emotions = alert.detected_emotions || [];
            const mainConcern = alert.main_concern || "";
            // Fix: risk_score is 0-1, convert to percentage
            const riskPercentage = Math.round(alert.risk_score * 100);
 
            return (
              <div
                key={alert._id}
                className="group relative flex items-center gap-3 p-3.5 rounded-xl border border-red-100 bg-red-50/50 transition-all duration-300 hover:shadow-md hover:bg-red-50"
              >
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-red-500 transition-all duration-300 group-hover:h-10" />
                
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 border border-red-200">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {alert.adolescent_name || alert.adolescent_email?.split('@')[0] || "Unknown"}
                    </p>
                    <span className="text-xs font-semibold text-slate-500 ml-2">
                      {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {mainConcern && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-900 text-white">
                        {mainConcern}
                      </span>
                    )}
                    {emotions.slice(0, 2).map((emotion, i) => (
                      <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {emotion}
                      </span>
                    ))}
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
