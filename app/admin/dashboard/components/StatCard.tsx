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
    <div className={`relative bg-white p-7 rounded-[2rem] border-l-4 shadow-sm transition-all hover:translate-y-[-4px] hover:shadow-md`} style={{ borderLeftColor: color }}>
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-zinc-50 rounded-2xl text-zinc-600">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${
            trendType === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
            {trendType === 'up' ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>}
            {trend}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-black text-zinc-900 leading-none">{value}</h3>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-2">{label}</p>
      </div>
    </div>
  );
}
