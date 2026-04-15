"use client";

import React, { useState } from 'react';
import { Cpu, ShieldAlert, Zap, MessageSquare, Save, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AISettingsTab() {
  const [riskThreshold, setRiskThreshold] = useState(75);
  const [isAutoAlertEnabled, setIsAutoAlertEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  React.useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch('/api/proxy/backend/admin/settings');
      if (res.ok) {
        const data = await res.json();
        setRiskThreshold(data.risk_threshold);
        setIsAutoAlertEnabled(data.auto_alert_enabled);
      }
    } catch (err) {
      console.error("Failed to load AI settings");
    }
  }

  async function handleSave() {
    setLoading(true);
    try {
      const res = await fetch('/api/proxy/backend/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          risk_threshold: riskThreshold,
          auto_alert_enabled: isAutoAlertEnabled
        })
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save AI settings");
    } finally {
      setLoading(false);
    }
  }

  const promptTemplate = `Analyze the following journal entry for clinical risk...
Context: Adolescent mental health support.
Indicators: Self-harm, depressive patterns, social withdrawal.
Output: JSON { risk_level: "high" | "medium" | "low", confidence: float }`;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Model Configuration Card */}
        <div className="overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-zinc-900 tracking-tight">Inference Engine</h3>
              <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Core AI Parameters</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black text-zinc-700 uppercase tracking-wider">Risk Sensitivity</label>
                <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">{riskThreshold}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={riskThreshold} 
                onChange={(e) => setRiskThreshold(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-[11px] font-medium text-zinc-400 leading-relaxed">
                Determines the threshold for "High Risk" classification. Lowering this increases sensitivity but may result in more false positives.
              </p>
            </div>

            <div className="pt-6 border-t border-zinc-100 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-zinc-700 uppercase tracking-wider text-left">Auto-Alert Generation</span>
                  <span className="text-[11px] font-medium text-zinc-400 mt-1">Automatically notify counselors on high detection</span>
                </div>
                <button 
                  onClick={() => setIsAutoAlertEnabled(!isAutoAlertEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isAutoAlertEnabled ? 'bg-indigo-600' : 'bg-zinc-200'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAutoAlertEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Prompt Engineer Card */}
        <div className="overflow-hidden rounded-[2.5rem] border border-white/40 bg-zinc-900 p-8 shadow-xl text-white">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">System Prompt Template</h3>
              <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mt-1 italic">Read-Only Mode</p>
            </div>
          </div>

          <div className="relative">
            <pre className="p-6 rounded-2xl bg-black/40 border border-white/5 text-xs font-mono text-zinc-400 leading-relaxed overflow-x-auto whitespace-pre-wrap h-64">
              {promptTemplate}
            </pre>
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none" />
          </div>

          <div className="mt-8 flex gap-3">
             <button 
               onClick={handleSave}
               disabled={loading}
               className={`flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                 saveSuccess ? 'bg-emerald-500 text-white' : 'bg-white text-zinc-900 hover:bg-zinc-200'
               }`}
             >
                {loading ? <div className="h-4 w-4 border-2 border-zinc-900/20 border-t-zinc-900 rounded-full animate-spin" /> : <Save className="h-4 w-4" />}
                {saveSuccess ? "Settings Updated" : "Commit Changes"}
             </button>
             <button 
               onClick={fetchSettings}
               className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all"
             >
                <RotateCcw className="h-4 w-4" />
             </button>
          </div>
        </div>
      </div>

      {/* Analytics Preview Card */}
      <div className="overflow-hidden rounded-[3rem] bg-gradient-to-br from-indigo-600 to-cyan-500 p-[1px] shadow-lg shadow-indigo-200">
        <div className="bg-white rounded-[2.9rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Zap className="h-5 w-5" />
            </div>
            <h2 className="text-3xl font-black text-zinc-900 tracking-tight leading-tight">AI Model Health & Latency</h2>
            <p className="text-zinc-500 font-medium leading-relaxed">
              Real-time monitoring of inference performance. The AI model is currently operating at optimal efficiency with an average confidence score of 0.89.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-4">
               <div>
                  <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Avg Latency</p>
                  <p className="text-xl font-black text-zinc-900 mt-1">1.2s</p>
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Tokens/Sec</p>
                  <p className="text-xl font-black text-zinc-900 mt-1">45.2</p>
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Queue Size</p>
                  <p className="text-xl font-black text-zinc-900 mt-1">0</p>
               </div>
            </div>
          </div>
          <div className="w-full md:w-72 aspect-square bg-zinc-50 rounded-[4rem] border-4 border-white shadow-inner flex items-center justify-center relative group overflow-hidden">
             <div className="absolute inset-0 bg-indigo-50/50 group-hover:scale-110 transition-transform duration-1000" />
             <div className="relative z-10 flex flex-col items-center">
                <div className="h-20 w-20 rounded-full border-4 border-indigo-500 flex items-center justify-center border-t-transparent animate-spin duration-[3s]" />
                <span className="absolute text-xl font-black text-indigo-600">92%</span>
                <p className="text-[10px] font-black uppercase text-indigo-600 mt-4">Precision</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
