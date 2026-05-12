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
        { id: 'educational', label: 'Educational Analytics', icon: BookOpen },
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
        <nav className="space-y-4">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {group.group && (
                <h3 className="text-[10px] font-black text-zinc-600 tracking-[0.3em] px-5 uppercase mb-2 mt-2">{group.group}</h3>
              )}
              <div className="space-y-0.5 px-2">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    data-tab={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                      activeTab === item.id 
                        ? 'bg-indigo-600 text-white shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)]' 
                        : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`h-4 w-4 transition-transform duration-300 ${activeTab === item.id ? 'scale-110 text-white' : 'opacity-40 group-hover:opacity-100 group-hover:text-indigo-400'}`} />
                      <span className={`text-xs tracking-tight ${activeTab === item.id ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="bg-rose-500 text-white text-[9px] font-black h-4 min-w-[16px] flex items-center justify-center px-1.5 rounded-full shadow-lg border-2 border-zinc-950 animate-pulse">{item.badge}</span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Logout Footer */}
      <div className="p-8 border-t border-white/5 bg-zinc-950/50">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-zinc-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-300 text-sm font-bold group"
        >
          <LogOut className="h-5 w-5 opacity-40 group-hover:opacity-100" />
          Logout
        </button>
      </div>
    </aside>
  );
}
