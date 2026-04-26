'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { AlertTriangle, TrendingUp, Clock, Zap, RefreshCw } from 'lucide-react';

interface AlertConfig {
  high_risk_threshold: number;
  medium_risk_threshold: number;
  low_risk_threshold: number;
  alert_cooldown_hours: number;
  consecutive_alerts_limit: number;
  auto_escalation_enabled: boolean;
}

export default function AlertConfigPage() {
  const [config, setConfig] = useState<AlertConfig>({
    high_risk_threshold: 85,
    medium_risk_threshold: 60,
    low_risk_threshold: 30,
    alert_cooldown_hours: 24,
    consecutive_alerts_limit: 3,
    auto_escalation_enabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/proxy/backend/configurable-alerts/current-config');
      if (response.ok) {
        const data = await response.json();
        setConfig({
          high_risk_threshold: data.alert_thresholds?.high_risk_threshold || 85,
          medium_risk_threshold: data.alert_thresholds?.medium_risk_threshold || 60,
          low_risk_threshold: data.alert_thresholds?.low_risk_threshold || 30,
          alert_cooldown_hours: data.alert_settings?.alert_cooldown_hours || 24,
          consecutive_alerts_limit: data.alert_settings?.consecutive_alerts_limit || 3,
          auto_escalation_enabled: data.alert_settings?.auto_escalation_enabled ?? true,
        });
      } else {
        toast.error('Failed to load configuration');
      }
    } catch (error) {
      toast.error('Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/proxy/backend/configurable-alerts/thresholds', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        toast.success('Alert configuration updated successfully');
        fetchConfig();
      } else {
        toast.error('Failed to update configuration');
      }
    } catch (error) {
      toast.error('Error updating configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
        <div className="h-12 w-12 border-4 border-rose-600/20 border-t-rose-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-10">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="flex items-center justify-between bg-white/40 border border-white/60 p-6 rounded-3xl backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 flex items-center justify-center bg-rose-600 text-white rounded-xl">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-zinc-900 tracking-tight">Alert Threshold Configuration</h1>
              <p className="text-[11px] font-bold text-zinc-400 capitalize">Configure risk detection and alert behavior</p>
            </div>
          </div>
          <button 
            onClick={fetchConfig}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-zinc-100 text-zinc-700 hover:bg-zinc-200 active:scale-95 transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Risk Thresholds */}
        <div className="overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-5 w-5 text-rose-600" />
            <h2 className="text-sm font-black text-zinc-900 uppercase tracking-widest">Risk Thresholds</h2>
          </div>
          
          <div className="space-y-6">
            {/* High Risk */}
            <div className="p-6 rounded-2xl border border-rose-100 bg-rose-50/50">
              <label className="block text-xs font-black uppercase tracking-widest text-rose-700 mb-3">
                High Risk Threshold
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.high_risk_threshold}
                  onChange={(e) => setConfig({ ...config, high_risk_threshold: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={config.high_risk_threshold}
                  onChange={(e) => setConfig({ ...config, high_risk_threshold: parseInt(e.target.value) })}
                  className="w-20 px-3 py-2 border border-rose-200 rounded-xl text-center font-black text-rose-900 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-rose-600 mt-2">Scores above this trigger high-risk alerts</p>
            </div>

            {/* Medium Risk */}
            <div className="p-6 rounded-2xl border border-amber-100 bg-amber-50/50">
              <label className="block text-xs font-black uppercase tracking-widest text-amber-700 mb-3">
                Medium Risk Threshold
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.medium_risk_threshold}
                  onChange={(e) => setConfig({ ...config, medium_risk_threshold: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={config.medium_risk_threshold}
                  onChange={(e) => setConfig({ ...config, medium_risk_threshold: parseInt(e.target.value) })}
                  className="w-20 px-3 py-2 border border-amber-200 rounded-xl text-center font-black text-amber-900 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-amber-600 mt-2">Scores above this trigger medium-risk alerts</p>
            </div>

            {/* Low Risk */}
            <div className="p-6 rounded-2xl border border-blue-100 bg-blue-50/50">
              <label className="block text-xs font-black uppercase tracking-widest text-blue-700 mb-3">
                Low Risk Threshold
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.low_risk_threshold}
                  onChange={(e) => setConfig({ ...config, low_risk_threshold: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={config.low_risk_threshold}
                  onChange={(e) => setConfig({ ...config, low_risk_threshold: parseInt(e.target.value) })}
                  className="w-20 px-3 py-2 border border-blue-200 rounded-xl text-center font-black text-blue-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-blue-600 mt-2">Scores above this trigger low-risk alerts</p>
            </div>
          </div>
        </div>

        {/* Alert Behavior */}
        <div className="overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="h-5 w-5 text-indigo-600" />
            <h2 className="text-sm font-black text-zinc-900 uppercase tracking-widest">Alert Behavior</h2>
          </div>
          
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-zinc-100 bg-white">
              <label className="block text-xs font-black uppercase tracking-widest text-zinc-700 mb-3">
                Alert Cooldown (hours)
              </label>
              <input
                type="number"
                min="1"
                max="168"
                value={config.alert_cooldown_hours}
                onChange={(e) => setConfig({ ...config, alert_cooldown_hours: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-zinc-200 rounded-xl font-bold text-zinc-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-xs text-zinc-500 mt-2">Minimum time between alerts for the same adolescent</p>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-100 bg-white">
              <label className="block text-xs font-black uppercase tracking-widest text-zinc-700 mb-3">
                Consecutive Alerts Limit
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={config.consecutive_alerts_limit}
                onChange={(e) => setConfig({ ...config, consecutive_alerts_limit: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-zinc-200 rounded-xl font-bold text-zinc-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-xs text-zinc-500 mt-2">Number of consecutive alerts before auto-escalation</p>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-100 bg-white">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.auto_escalation_enabled}
                  onChange={(e) => setConfig({ ...config, auto_escalation_enabled: e.target.checked })}
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-zinc-300 rounded"
                />
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-700">Enable Auto-Escalation</span>
                  <p className="text-xs text-zinc-500 mt-1">Automatically escalate after consecutive alerts limit is reached</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            onClick={fetchConfig}
            className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-zinc-100 text-zinc-700 hover:bg-zinc-200 active:scale-95 transition-all"
          >
            Reset Changes
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-100 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
}
