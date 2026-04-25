'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/configurable-alerts/current-config`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/configurable-alerts/thresholds`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(config),
      });

      if (response.ok) {
        toast.success('Alert configuration updated successfully');
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Alert Threshold Configuration</h1>
        <p className="text-gray-600 mt-2">Configure risk thresholds and alert behavior</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Risk Thresholds */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Risk Thresholds</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                High Risk Threshold (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={config.high_risk_threshold}
                onChange={(e) => setConfig({ ...config, high_risk_threshold: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Scores above this trigger high-risk alerts</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medium Risk Threshold (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={config.medium_risk_threshold}
                onChange={(e) => setConfig({ ...config, medium_risk_threshold: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Scores above this trigger medium-risk alerts</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Low Risk Threshold (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={config.low_risk_threshold}
                onChange={(e) => setConfig({ ...config, low_risk_threshold: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Scores above this trigger low-risk alerts</p>
            </div>
          </div>
        </div>

        {/* Alert Behavior */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Alert Behavior</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alert Cooldown (hours)
              </label>
              <input
                type="number"
                min="1"
                max="168"
                value={config.alert_cooldown_hours}
                onChange={(e) => setConfig({ ...config, alert_cooldown_hours: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Minimum time between alerts for the same adolescent</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consecutive Alerts Limit
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={config.consecutive_alerts_limit}
                onChange={(e) => setConfig({ ...config, consecutive_alerts_limit: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Number of consecutive alerts before auto-escalation</p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="auto_escalation"
                checked={config.auto_escalation_enabled}
                onChange={(e) => setConfig({ ...config, auto_escalation_enabled: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="auto_escalation" className="ml-2 block text-sm text-gray-700">
                Enable Auto-Escalation
              </label>
            </div>
            <p className="text-sm text-gray-500">Automatically escalate after consecutive alerts limit is reached</p>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t pt-6 flex justify-end space-x-4">
          <button
            onClick={fetchConfig}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
}
