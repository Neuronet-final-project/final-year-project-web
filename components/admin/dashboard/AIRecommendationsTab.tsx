"use client";

import { useState, useEffect } from 'react';
import { Bot, TrendingUp, Eye, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AIRecommendationAnalytics {
  total_recommendations: number;
  viewed_count: number;
  unviewed_count: number;
  risk_level_distribution: Array<{
    risk_level: string;
    count: number;
  }>;
  common_themes: Array<{
    theme: string;
    count: number;
  }>;
  recent_recommendations: Array<{
    _id: string;
    adolescent_name: string;
    risk_level: string;
    detected_themes: string[];
    recommended_pages_count: number;
    is_viewed: boolean;
    created_at: string;
  }>;
}

export default function AIRecommendationsTab() {
  const [analytics, setAnalytics] = useState<AIRecommendationAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      console.log('Fetching AI recommendation analytics...');
      const res = await fetch('/api/proxy/backend/ai-recommendations/admin/analytics');
      console.log('Response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('AI recommendation analytics data:', data);
        setAnalytics(data);
      } else {
        const errorText = await res.text();
        console.error('Failed to load AI recommendation analytics:', errorText);
        toast.error(`Failed to load analytics: ${res.status}`);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Error loading analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-12 w-12 border-4 border-purple-600/20 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-20">
        <Bot className="h-16 w-16 text-zinc-300 mx-auto mb-4" />
        <p className="text-sm font-bold text-zinc-400">No analytics data available</p>
      </div>
    );
  }

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'yellow';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/40 border border-white/60 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 flex items-center justify-center bg-purple-600 text-white rounded-xl">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-zinc-900 tracking-tight">AI Recommendation Analytics</h3>
            <p className="text-[11px] font-bold text-zinc-400 capitalize">Monitor medium-risk pattern detection</p>
          </div>
        </div>
        <button 
          onClick={fetchAnalytics}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-100 active:scale-95 transition-all"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Recommendations', value: analytics.total_recommendations, color: 'purple', icon: <Bot className="h-5 w-5" /> },
          { label: 'Viewed', value: analytics.viewed_count, color: 'emerald', icon: <CheckCircle className="h-5 w-5" /> },
          { label: 'Unviewed', value: analytics.unviewed_count, color: 'orange', icon: <XCircle className="h-5 w-5" /> },
        ].map((stat, i) => (
          <div key={i} className="overflow-hidden rounded-[2rem] border border-white/40 bg-white/60 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className={`h-12 w-12 flex items-center justify-center rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-zinc-900">{stat.value}</p>
                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mt-1">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Risk Level Distribution */}
      {analytics.risk_level_distribution.length > 0 && (
        <div className="overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <h4 className="text-sm font-black text-zinc-900 uppercase tracking-widest">Risk Level Distribution</h4>
          </div>
          
          <div className="space-y-3">
            {analytics.risk_level_distribution.map((item, idx) => {
              const color = getRiskLevelColor(item.risk_level);
              return (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 bg-white">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 flex items-center justify-center rounded-lg bg-${color}-50 text-${color}-600 font-black text-sm capitalize`}>
                      {item.risk_level}
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-${color}-50 text-${color}-700`}>
                    <span className="text-sm font-black">{item.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Common Themes */}
      {analytics.common_themes.length > 0 && (
        <div className="overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <h4 className="text-sm font-black text-zinc-900 uppercase tracking-widest">Most Common Themes</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analytics.common_themes.map((theme, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 bg-white">
                <p className="text-sm font-bold text-zinc-700 capitalize">{theme.theme}</p>
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700">
                  <span className="text-sm font-black">{theme.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Recommendations */}
      <div className="overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
        <div className="flex items-center gap-3 mb-6">
          <Eye className="h-5 w-5 text-blue-600" />
          <h4 className="text-sm font-black text-zinc-900 uppercase tracking-widest">Recent Recommendations</h4>
        </div>
        
        {analytics.recent_recommendations.length === 0 ? (
          <div className="py-12 text-center">
            <Bot className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-sm font-bold text-zinc-400">No recommendations yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {analytics.recent_recommendations.map((rec, idx) => {
              const riskColor = getRiskLevelColor(rec.risk_level);
              return (
                <div key={idx} className="p-4 rounded-xl border border-zinc-100 bg-white">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-black text-zinc-900">{rec.adolescent_name}</p>
                      <p className="text-xs text-zinc-500">{new Date(rec.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-lg text-xs font-black capitalize bg-${riskColor}-50 text-${riskColor}-700`}>
                        {rec.risk_level}
                      </span>
                      {rec.is_viewed ? (
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-zinc-300" />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {rec.detected_themes.map((theme, i) => (
                      <span key={i} className="px-2 py-1 rounded-md text-xs font-bold bg-purple-50 text-purple-700 capitalize">
                        {theme}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-zinc-500">
                    {rec.recommended_pages_count} page{rec.recommended_pages_count !== 1 ? 's' : ''} recommended
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
