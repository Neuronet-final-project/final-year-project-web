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
    <div className="group relative overflow-hidden rounded-3xl border border-white/30 bg-gradient-to-br from-white/70 to-white/50 p-5 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgb(0,0,0,0.12)] hover:border-white/50">
      {/* Animated Gradient Background */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ 
          background: `radial-gradient(circle at 30% 20%, ${color}15 0%, transparent 60%)` 
        }}
      />
      
      {/* Decorative Corner Accent */}
      <div 
        className="absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-all duration-700 group-hover:scale-150"
        style={{ backgroundColor: color }}
      />

      <div className="relative z-10">
        {/* Icon and Trend Badge Row */}
        <div className="flex justify-between items-start mb-8">
          <div 
            className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
            style={{ 
              backgroundColor: `${color}20`, 
              color: color,
              boxShadow: `0 10px 25px ${color}25`
            }}
          >
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all duration-300 group-hover:scale-105 ${
              trendType === 'up' 
                ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-700 border border-emerald-500/30' 
                : 'bg-gradient-to-r from-rose-500/20 to-rose-600/20 text-rose-700 border border-rose-500/30'
            }`}>
              {trendType === 'up' ? (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="animate-pulse">
                  <polyline points="18 15 12 9 6 15"/>
                </svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                  <polyline points="18 9 12 15 6 9"/>
                </svg>
              )}
              {trend}
            </div>
          )}
        </div>

        {/* Value and Label */}
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <h3 
              className="text-3xl md:text-4xl font-black tracking-tighter leading-none transition-colors duration-300"
              style={{ color: color }}
            >
              {value}
            </h3>
            {trendType === 'up' && (
              <span 
                className="h-2.5 w-2.5 rounded-full animate-pulse shadow-lg"
                style={{ 
                  backgroundColor: color,
                  boxShadow: `0 0 12px ${color}80`
                }}
              />
            )}
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500/80 leading-tight">
            {label}
          </p>
        </div>

        {/* Bottom Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500" style={{ color }} />
      </div>
    </div>
  );
}
