"use client";

import { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, Users, Eye, Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface EducationalStats {
  total_pages: number;
  total_follows: number;
  most_followed_pages: Array<{
    page_slug: string;
    page_title: string;
    follow_count: number;
  }>;
  recent_follows: Array<{
    adolescent_name: string;
    page_title: string;
    followed_at: string;
  }>;
}

export default function EducationalAnalyticsTab() {
  const [stats, setStats] = useState<EducationalStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      console.log('Fetching educational analytics...');
      
      // Fetch the same data as counselor dashboard
      const [analyticsRes, categoryRes] = await Promise.all([
        fetch('/api/proxy/backend/analytics/counselor/my-analytics?days=30', {
          cache: "no-store"
        }),
        fetch('/api/proxy/backend/category-follows/available-categories', {
          cache: "no-store"
        })
      ]);
      
      console.log('Analytics response status:', analyticsRes.status);
      console.log('Category response status:', categoryRes.status);
      
      if (analyticsRes.ok && categoryRes.ok) {
        const analyticsData = await analyticsRes.json();
        const categoryData = await categoryRes.json();
        
        console.log('Analytics data:', analyticsData);
        console.log('Category data:', categoryData);
        
        // Transform to match our interface
        const transformedStats = {
          total_pages: analyticsData.total_pages || 0,
          total_follows: categoryData.reduce((sum: number, cat: any) => sum + cat.follower_count, 0),
          most_followed_pages: categoryData.map((cat: any) => ({
            page_slug: cat.value,
            page_title: cat.label,
            follow_count: cat.follower_count
          })),
          recent_follows: [] // Not available in this endpoint
        };
        
        setStats(transformedStats);
      } else {
        const errorText = await analyticsRes.text();
        console.error('Failed to load educational analytics:', errorText);
        toast.error(`Failed to load analytics: ${analyticsRes.status}`);
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
        <div className="h-12 w-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20">
        <BookOpen className="h-16 w-16 text-zinc-300 mx-auto mb-4" />
        <p className="text-sm font-bold text-zinc-400">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/40 border border-white/60 p-6 rounded-3xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 flex items-center justify-center bg-indigo-600 text-white rounded-xl">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-zinc-900 tracking-tight">Educational Content Analytics</h3>
            <p className="text-[11px] font-bold text-zinc-400 capitalize">Monitor page follows and engagement</p>
          </div>
        </div>
        <button 
          onClick={fetchStats}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95 transition-all"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Pages', value: stats.total_pages, color: 'indigo', icon: <BookOpen className="h-5 w-5" /> },
          { label: 'Total Follows', value: stats.total_follows, color: 'emerald', icon: <Heart className="h-5 w-5" /> },
          { label: 'Active Users', value: stats.recent_follows.length, color: 'blue', icon: <Users className="h-5 w-5" /> },
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

      {/* Most Followed Pages */}
      <div className="overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="h-5 w-5 text-indigo-600" />
          <h4 className="text-sm font-black text-zinc-900 uppercase tracking-widest">Most Followed Pages</h4>
        </div>
        
        {stats.most_followed_pages.length === 0 ? (
          <div className="py-12 text-center">
            <Eye className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-sm font-bold text-zinc-400">No page follows yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.most_followed_pages.map((page, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 bg-white hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-black text-sm">
                    #{idx + 1}
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-zinc-900">{page.page_title}</h5>
                    <p className="text-xs text-zinc-500">{page.page_slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm font-black">{page.follow_count}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Follows */}
      <div className="overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/60 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
        <div className="flex items-center gap-3 mb-6">
          <Users className="h-5 w-5 text-blue-600" />
          <h4 className="text-sm font-black text-zinc-900 uppercase tracking-widest">Recent Activity</h4>
        </div>
        
        {stats.recent_follows.length === 0 ? (
          <div className="py-12 text-center">
            <Eye className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-sm font-bold text-zinc-400">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.recent_follows.map((follow, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 bg-white">
                <div>
                  <p className="text-sm font-black text-zinc-900">{follow.adolescent_name}</p>
                  <p className="text-xs text-zinc-500">followed {follow.page_title}</p>
                </div>
                <p className="text-xs text-zinc-400">{new Date(follow.followed_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
