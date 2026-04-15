"use client";

import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Save, CheckCircle } from 'lucide-react';

export default function ProfileTab() {
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setLoading(true);
    try {
      const res = await fetch("/api/proxy/backend/auth/me");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setFullName(data.full_name || "System Administrator");
      }
    } catch {}
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const body: any = {};
      if (fullName) body.full_name = fullName;
      if (password) body.password = password;

      const res = await fetch("/api/proxy/backend/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setSaveSuccess(true);
        setPassword("");
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch {}
    setSaving(false);
  }

  if (loading) {
    return <div className="h-full flex justify-center pt-40"><div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" /></div>;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-3xl mx-auto py-10">
      <div className="overflow-hidden rounded-[3rem] border border-white/40 bg-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
        {/* Header Header */}
        <div className="h-32 bg-gradient-to-br from-indigo-600 to-indigo-900 relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        </div>
        
        <div className="px-10 pb-10">
          <div className="relative flex justify-between items-end -mt-12 mb-10">
            <div className="flex gap-6 items-end">
              <div className="h-24 w-24 rounded-3xl bg-white flex items-center justify-center text-4xl font-black text-indigo-600 shadow-xl ring-4 ring-white">
                {fullName.substring(0, 2).toUpperCase() || "SA"}
              </div>
              <div className="mb-2">
                <h2 className="text-2xl font-black text-zinc-900">{fullName}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Shield className="h-3.5 w-3.5 text-indigo-500" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Level 4 Auth • Admin Node</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500">
                  <User className="h-4 w-4" /> Full Name
                </label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-zinc-100/50 border border-zinc-200/50 rounded-2xl px-5 py-3 text-sm font-bold text-zinc-900 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600/30 outline-none transition-all"
                  placeholder="System Administrator" 
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500">
                  <Mail className="h-4 w-4" /> Email Address (Immutable)
                </label>
                <input 
                  type="email" 
                  value={profile?.email || ""}
                  disabled
                  className="w-full bg-zinc-200/30 border border-transparent rounded-2xl px-5 py-3 text-sm font-bold text-zinc-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100">
              <div className="space-y-3 md:w-1/2">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500">
                  <Shield className="h-4 w-4" /> Reset Authorization Key
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-zinc-100/50 border border-zinc-200/50 rounded-2xl px-5 py-3 text-sm font-bold text-zinc-900 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600/30 outline-none transition-all"
                  placeholder="Enter new password to update..." 
                />
              </div>
            </div>

            <div className="pt-10 flex gap-4">
              <button 
                type="submit" 
                disabled={saving}
                className={`h-14 px-8 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest transition-all ${
                  saveSuccess 
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 border border-emerald-400"
                    : "bg-zinc-900 text-white hover:bg-indigo-600 shadow-xl shadow-zinc-200 hover:shadow-indigo-200 active:scale-95"
                }`}
              >
                {saving ? (
                  <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : saveSuccess ? (
                  <>
                    <CheckCircle className="h-4 w-4" /> Successfully Saved
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Commit Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
