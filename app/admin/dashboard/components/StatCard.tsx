"use client";

import React from 'react';

interface Stat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendType?: 'up' | 'down';
  color: string;
}

export default function StatCard({ label, value, icon, trend, trendType, color }: Stat) {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-white/40 bg-white/60 p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)]">
      {/* Decorative Gradient Blob */}
      <div 
        className="absolute -right-4 -top-4 h-24 w-24 rounded-full blur-2xl transition-opacity group-hover:opacity-100 opacity-20"
        style={{ backgroundColor: color }}
      />

      <div className="relative z-10 flex justify-between items-start mb-6">
        <div 
          className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-transform group-hover:scale-110"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
            trendType === 'up' ? 'bg-emerald-100/50 text-emerald-600' : 'bg-rose-100/50 text-rose-600'
          }`}>
            {trendType === 'up' ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className="animate-bounce-subtle">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
              </svg>
            )}
            {trend}
          </div>
        )}
      </div>

      <div className="relative z-10">
        <div className="flex items-baseline gap-1">
          <h3 className="text-3xl font-black tracking-tight text-zinc-900 leading-none">{value}</h3>
          {trendType === 'up' && <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />}
        </div>
        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">{label}</p>
      </div>
    </div>
  );
}
