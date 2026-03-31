import React from "react";
import Link from "next/link";

type Alert = {
  _id: string;
  adolescent_id: string;
  adolescent_email?: string;
  risk_score: number;
  risk_level: string;
  created_at: string;
};

export function RecentAlerts({ alerts }: { alerts: Alert[] }) {
  // Taking only top 4 for the main dashboard view
  const displayAlerts = alerts.slice(0, 4);

  return (
    <div className="flex flex-col h-full rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-zinc-900">Recent Alerts</h3>
        <Link href="#alerts" className="text-sm font-medium text-indigo-600 hover:underline">
          View All &rarr;
        </Link>
      </div>

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[400px]">
        {displayAlerts.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
            No active alerts currently.
          </div>
        ) : (
          displayAlerts.map((alert) => {
            const isHigh = alert.risk_level === "high";
            const isMed = alert.risk_level === "medium";

            return (
              <div
                key={alert._id}
                className={`relative flex items-center justify-between overflow-hidden rounded-2xl border p-4 transition-all hover:shadow-sm ${
                  isHigh
                    ? "border-red-100 bg-red-50/50"
                    : isMed
                    ? "border-orange-100 bg-orange-50/50"
                    : "border-blue-100 bg-blue-50/50"
                }`}
              >
                <div
                  className={`absolute left-0 top-0 h-full w-1.5 ${
                    isHigh
                      ? "bg-red-500"
                      : isMed
                      ? "bg-orange-500"
                      : "bg-blue-500"
                  }`}
                />
                <div className="ml-3 flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm text-white ${
                      isHigh
                        ? "bg-red-500"
                        : isMed
                        ? "bg-orange-500"
                        : "bg-blue-500"
                    }`}
                  >
                    {isHigh ? (
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
                    ) : isMed ? (
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                    ) : (
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
                    )}
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-bold ${
                        isHigh
                          ? "text-red-900"
                          : isMed
                          ? "text-orange-900"
                          : "text-blue-900"
                      }`}
                    >
                      {isHigh
                        ? "High Priority Alert"
                        : isMed
                        ? "Medium Priority"
                        : "Information"}
                    </h4>
                    <p className="text-xs font-medium text-zinc-600 mt-0.5">
                      {(alert.adolescent_email || "Adolescent").split('@')[0]} - {Math.round(alert.risk_score * 100)}% risk
                    </p>
                  </div>
                </div>
                
                <div className="text-right shrink-0 ml-2">
                  <div className="text-[10px] uppercase font-bold text-zinc-400">
                    {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
