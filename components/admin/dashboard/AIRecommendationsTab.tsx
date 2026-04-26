"use client";

import { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Recommendation {
  _id: string;
  adolescent_id: string;
  adolescent_name?: string;
  risk_analysis: {
    detected_themes: string[];
    risk_level: string;
    confidence: number;
  };
  recommended_pages: Array<{
    page_slug: string;
    page_title: string;
    relevance_score: number;
  }>;
  is_viewed: boolean;
  created_at: string;
}

export default function AIRecommendationsTab() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      // This would need an admin endpoint to get all recommendations
      // For now, we'll show a placeholder
      setLoading(false);
    } catch (error) {
      toast.error('Error loading recommendations');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-12 w-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

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
          onClick={fetchRecommendations}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-100 active:scale-95 transition-all"
        >
          Refresh Data
        </button>
      </div>

      {/* Coming Soon Placeholder */}
      <div className="overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md text-center">
        <Bot className="h-16 w-16 text-purple-300 mx-auto mb-6" />
        <h3 className="text-xl font-black text-zinc-900 mb-2">AI Recommendations Monitoring</h3>
        <p className="text-sm text-zinc-500 max-w-md mx-auto">
          This feature will display AI-generated educational recommendations based on medium-risk emotional patterns detected in adolescent data.
        </p>
      </div>
    </div>
  );
}
