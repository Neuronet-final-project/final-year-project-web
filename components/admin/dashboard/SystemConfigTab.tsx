"use client";

import React, { useState } from 'react';
import { Settings, Globe, Lock, Bell, Server, ShieldCheck, Save, CheckCircle2 } from 'lucide-react';

export default function SystemConfigTab() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    try {
      const res = await fetch('/api/proxy/backend/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setIsRegistrationOpen(data.public_registration_enabled);
        setIsMaintenanceMode(data.maintenance_mode_enabled);
      }
    } catch (err) {
      console.error("Failed to load system config");
    }
  }

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/proxy/backend/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          public_registration_enabled: isRegistrationOpen,
          maintenance_mode_enabled: isMaintenanceMode
        })
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save system config");
    } finally {
      setLoading(false);
    }
  };

  const configs = [
    {
      title: "Counselor Access Control",
      desc: "Manage public registration and onboarding protocols",
      icon: <Globe className="h-5 w-5" />,
      color: "blue",
      controls: [
        { label: "Public Applications", value: isRegistrationOpen, setter: setIsRegistrationOpen, hint: "Allow new counselors to submit applications via the homepage." },
      ]
    },
    {
      title: "System Status",
      desc: "Global availability and maintenance overrides",
      icon: <Server className="h-5 w-5" />,
      color: "orange",
      controls: [
        { label: "Maintenance Mode", value: isMaintenanceMode, setter: setIsMaintenanceMode, hint: "Restrict all non-admin access to the platform for scheduled maintenance." },
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between bg-white/40 border border-white/60 p-6 rounded-3xl backdrop-blur-md mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 flex items-center justify-center bg-zinc-900 text-white rounded-xl">
             <Settings className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-zinc-900 tracking-tight">System Configuration Center</h3>
            <p className="text-[11px] font-bold text-zinc-400 capitalize">Manage global variables and operational state</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            saveSuccess 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95'
          }`}
        >
          {saveSuccess ? (
            <><CheckCircle2 className="h-4 w-4" /> Saved Successfully</>
          ) : (
            <><Save className="h-4 w-4" /> Save Configuration</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {configs.map((group, idx) => (
          <div key={idx} className="overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
            <div className="flex items-center gap-4 mb-10">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                group.color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
              }`}>
                {group.icon}
              </div>
              <div>
                <h3 className="text-xl font-black text-zinc-900 tracking-tight">{group.title}</h3>
                <p className="text-[11px] font-medium text-zinc-400 mt-1">{group.desc}</p>
              </div>
            </div>

            <div className="space-y-8">
              {group.controls.map((control, cIdx) => (
                <div key={cIdx} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-zinc-700 uppercase tracking-wider">{control.label}</span>
                    <button 
                      onClick={() => control.setter(!control.value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                        control.value ? 'bg-indigo-600' : 'bg-zinc-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        control.value ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <p className="text-[11px] font-medium text-zinc-400 leading-relaxed pr-8">
                    {control.hint}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
         {[
           { label: "Notification Pulse", icon: <Bell className="h-5 w-5" />, value: "Active", sub: "Push/Email enabled" },
           { label: "Security Layer", icon: <Lock className="h-5 w-5" />, value: "WAF ON", sub: "Rate-limiting active" },
           { label: "Admin Logging", icon: <ShieldCheck className="h-5 w-5" />, value: "Full Audit", sub: "Retention: 90 days" },
         ].map((stat, i) => (
           <div key={i} className="p-6 rounded-[2rem] border border-white/40 bg-zinc-50 flex items-center gap-5">
              <div className="h-12 w-12 flex-shrink-0 bg-white rounded-xl shadow-sm flex items-center justify-center text-zinc-400">
                 {stat.icon}
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{stat.label}</p>
                 <p className="text-lg font-black text-zinc-900">{stat.value}</p>
                 <p className="text-[10px] font-medium text-zinc-400">{stat.sub}</p>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
