"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserRoundCheck, 
  Handshake, 
  ShieldCheck, 
  BookOpen, 
  Settings, 
  Bot, 
  History, 
  BarChart3, 
  FileText, 
  KeyRound,
  LogOut
} from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  pendingApps?: number;
  onLogout: () => void;
}

export default function DashboardSidebar({ activeTab, setActiveTab, pendingApps, onLogout }: SidebarProps) {
  const menuGroups: { group: string | null, items: { id: string, label: string, icon: any, badge?: number }[] }[] = [
    {
      group: null,
      items: [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'applications', label: 'Counselor Applications', icon: UserRoundCheck, badge: pendingApps },
        { id: 'assign', label: 'Case Assignments', icon: Handshake },
      ]
    },
    {
      group: 'MONITORING',
      items: [
        { id: 'approvals', label: 'Guardian Approvals', icon: ShieldCheck },
        { id: 'recommendations', label: 'AI Recommendations', icon: Bot },
        { id: 'educational', label: 'Educational Analytics', icon: BookOpen },
        { id: 'tasks', label: 'Background Tasks', icon: BarChart3 },
      ]
    },
    {
      group: 'CONFIGURATION',
      items: [
        { id: 'alerts', label: 'Alert Thresholds', icon: FileText },
        { id: 'limits', label: 'Counselor Limits', icon: KeyRound },
        { id: 'config', label: 'System Settings', icon: Settings },
        { id: 'audit', label: 'Audit Vault', icon: History },
      ]
    },
  ];

  return (
    <aside className="w-72 shrink-0 bg-[#09090b] text-white flex flex-col h-screen overflow-hidden relative shadow-2xl border-r border-white/5">
      <div className="p-8 flex-1 overflow-y-auto">
        {/* Logo Section */}
        <div className="flex items-center gap-4 mb-16 px-2">
          <div className="relative h-11 w-11 flex items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-white/20">
             <Image 
                src="/Images/icons/neuroneticon.png" 
                alt="NEURONET" 
                fill 
                className="object-cover p-1.5"
             />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter leading-none text-white">NEURO<span className="text-indigo-400">NET</span></h1>
            <p className="text-[9px] text-indigo-400/60 font-bold tracking-[0.2em] mt-1.5 uppercase">Admin Control</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-10">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-5">
              {group.group && (
                <h3 className="text-[10px] font-black text-zinc-600 tracking-[0.3em] px-5 uppercase">{group.group}</h3>
              )}
              <div className="space-y-1.5 px-2">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    data-tab={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                      activeTab === item.id 
                        ? 'bg-indigo-600 text-white shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] translate-x-1' 
                        : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon className={`h-5 w-5 transition-transform duration-300 ${activeTab === item.id ? 'scale-110 text-white' : 'opacity-40 group-hover:opacity-100 group-hover:text-indigo-400'}`} />
                      <span className={`text-sm tracking-tight ${activeTab === item.id ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="bg-rose-500 text-white text-[10px] font-black h-5 min-w-[20px] flex items-center justify-center px-1.5 rounded-full shadow-lg border-2 border-zinc-950 animate-pulse">{item.badge}</span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Logout Footer & Branding Accent */}
      <div className="p-8 border-t border-white/5 bg-zinc-950/50 relative">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-zinc-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-300 text-sm font-bold group"
        >
          <LogOut className="h-5 w-5 opacity-40 group-hover:opacity-100" />
          Logout Terminal
        </button>

        {/* Floating Branding Accent */}
        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-6 -left-2 transform rotate-12 opacity-20 pointer-events-none">
           <div className="bg-indigo-600 text-white p-2 rounded-xl text-xs font-black shadow-2xl shadow-indigo-500/20 border border-white/10">
              N
           </div>
        </div>
      </div>
    </aside>
  );
}
