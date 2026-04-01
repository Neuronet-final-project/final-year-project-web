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

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  pendingApps?: number;
  onLogout: () => void;
}

export default function DashboardSidebar({ activeTab, setActiveTab, pendingApps, onLogout }: SidebarProps) {
  const menuGroups = [
    {
      group: null,
      items: [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'applications', label: 'Counselor Management', icon: UserRoundCheck, badge: pendingApps },
        { id: 'assign', label: 'Consent Oversight', icon: Handshake },
      ]
    },
    {
      group: 'SYSTEM',
      items: [
        { id: 'config', label: 'System Configuration', icon: Settings },
        { id: 'ai', label: 'AI Model Settings', icon: Bot },
        { id: 'audit', label: 'Audit Logs', icon: History },
      ]
    },
    {
      group: 'REPORTS',
      items: [
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'reports', label: 'Generate Reports', icon: FileText },
      ]
    },
    {
      group: 'SECURITY',
      items: [
        { id: 'access', label: 'Access Control', icon: KeyRound },
      ]
    }
  ];

  return (
    <aside className="w-72 shrink-0 bg-[#6b21a8] text-white flex flex-col h-screen overflow-y-auto">
      <div className="p-8">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-white/20 p-2 rounded-xl">
             <div className="w-8 h-8 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                   <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                   <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
             </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">NEURONET</h1>
            <p className="text-[10px] text-white/50 font-semibold tracking-wider">Admin Control Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-8">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-4">
              {group.group && (
                <h3 className="text-[10px] font-bold text-white/40 tracking-[0.2em] px-4 uppercase">{group.group}</h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                      activeTab === item.id 
                        ? 'bg-white/10 text-white shadow-lg' 
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`} />
                      <span className="text-sm font-semibold">{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">{item.badge}</span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Logout Footer */}
      <div className="mt-auto p-8 border-t border-white/10">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all text-sm font-semibold"
        >
          <LogOut className="h-5 w-5 text-white/40" />
          Logout Session
        </button>
      </div>
    </aside>
  );
}
