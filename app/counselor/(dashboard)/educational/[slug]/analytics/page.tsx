"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Eye, Heart, TrendingUp, Users, Clock, FolderOpen } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function PageAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [page, setPage] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [categoryInfo, setCategoryInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30); // days

  useEffect(() => {
    fetchData();
  }, [slug, timeRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch page details
      const pageRes = await fetch(`/api/proxy/backend/educational-pages/${slug}`);
      if (pageRes.ok) {
        const pageData = await pageRes.json();
        setPage(pageData);

        // Fetch category info if page has a category
        if (pageData.category) {
          const categoryRes = await fetch(`/api/proxy/backend/category-follows/available-categories`);
          if (categoryRes.ok) {
            const categories = await categoryRes.json();
            const catInfo = categories.find((c: any) => c.value === pageData.category);
            setCategoryInfo(catInfo);
          }
        }
      }

      // Fetch analytics
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const analyticsRes = await fetch(
        `/api/proxy/backend/educational-pages/${slug}/analytics?start_date=${startDate}&end_date=${endDate}`
      );
      
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-zinc-200 rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-zinc-200 rounded-3xl"></div>
            ))}
          </div>
          <div className="h-96 bg-zinc-200 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (!page || !analytics) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="text-center py-20">
          <p className="text-zinc-500 font-bold">Analytics not available</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const viewsData = analytics.daily_views || [];
  const chartData = viewsData.map((item: any) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    views: item.views,
    uniqueViewers: item.unique_viewers || 0,
  }));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-3 bg-zinc-100 hover:bg-zinc-200 rounded-2xl transition-all"
        >
          <ArrowLeft className="h-5 w-5 text-zinc-600" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">{page.title}</h1>
          <p className="text-zinc-500 font-medium mt-1">Analytics & Performance</p>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {[7, 14, 30, 90].map(days => (
          <button
            key={days}
            onClick={() => setTimeRange(days)}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              timeRange === days
                ? 'bg-indigo-600 text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {days} days
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200">
          <div className="flex items-center justify-between mb-4">
            <Eye className="h-8 w-8 opacity-80" />
            <TrendingUp className="h-5 w-5 opacity-60" />
          </div>
          <div className="text-3xl font-black mb-1">{analytics.total_views?.toLocaleString() || page.view_count}</div>
          <div className="text-sm font-medium opacity-90">Total Views</div>
        </div>

        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-3xl p-6 text-white shadow-lg shadow-rose-200">
          <div className="flex items-center justify-between mb-4">
            <Heart className="h-8 w-8 opacity-80" />
            <TrendingUp className="h-5 w-5 opacity-60" />
          </div>
          <div className="text-3xl font-black mb-1">{page.follow_count}</div>
          <div className="text-sm font-medium opacity-90">Followers</div>
        </div>

        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-3xl p-6 text-white shadow-lg shadow-cyan-200">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8 opacity-80" />
            <TrendingUp className="h-5 w-5 opacity-60" />
          </div>
          <div className="text-3xl font-black mb-1">{analytics.unique_viewers || 0}</div>
          <div className="text-sm font-medium opacity-90">Unique Viewers</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-200">
          <div className="flex items-center justify-between mb-4">
            <Clock className="h-8 w-8 opacity-80" />
            <TrendingUp className="h-5 w-5 opacity-60" />
          </div>
          <div className="text-3xl font-black mb-1">{page.estimated_read_time || 0}</div>
          <div className="text-sm font-medium opacity-90">Min Read Time</div>
        </div>

        {categoryInfo && (
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg shadow-purple-200">
            <div className="flex items-center justify-between mb-4">
              <FolderOpen className="h-8 w-8 opacity-80" />
              <TrendingUp className="h-5 w-5 opacity-60" />
            </div>
            <div className="text-3xl font-black mb-1">{categoryInfo.follower_count}</div>
            <div className="text-sm font-medium opacity-90">Topic Followers</div>
          </div>
        )}
      </div>

      {/* Views Chart */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
        <h3 className="text-xl font-black text-zinc-900 mb-6">Views Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis 
              dataKey="date" 
              stroke="#71717a"
              style={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            <YAxis 
              stroke="#71717a"
              style={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '2px solid #e4e4e7',
                borderRadius: '12px',
                fontWeight: 'bold'
              }}
            />
            <Legend 
              wrapperStyle={{ fontWeight: 'bold', fontSize: '12px' }}
            />
            <Line 
              type="monotone" 
              dataKey="views" 
              stroke="#6366f1" 
              strokeWidth={3}
              dot={{ fill: '#6366f1', r: 4 }}
              activeDot={{ r: 6 }}
              name="Total Views"
            />
            <Line 
              type="monotone" 
              dataKey="uniqueViewers" 
              stroke="#06b6d4" 
              strokeWidth={3}
              dot={{ fill: '#06b6d4', r: 4 }}
              activeDot={{ r: 6 }}
              name="Unique Viewers"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
          <h3 className="text-xl font-black text-zinc-900 mb-6">Engagement Rate</h3>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="text-6xl font-black text-indigo-600 mb-2">
                {((page.follow_count / (page.view_count || 1)) * 100).toFixed(1)}%
              </div>
              <p className="text-zinc-500 font-bold">Follow Rate</p>
              <p className="text-sm text-zinc-400 mt-2">
                {page.follow_count} follows / {page.view_count} views
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
          <h3 className="text-xl font-black text-zinc-900 mb-6">Page Info</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-zinc-100">
              <span className="text-zinc-600 font-bold">Category</span>
              <span className="text-zinc-900 font-black">{page.category || 'N/A'}</span>
            </div>
            {categoryInfo && (
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                <p className="text-xs text-purple-700 font-medium">
                  <span className="font-black">{categoryInfo.follower_count} students</span> follow the <span className="font-black">{categoryInfo.label}</span> topic and will see this article in their feed
                </p>
              </div>
            )}
            <div className="flex justify-between items-center py-3 border-b border-zinc-100">
              <span className="text-zinc-600 font-bold">Difficulty</span>
              <span className="text-zinc-900 font-black">{page.difficulty_level || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-zinc-100">
              <span className="text-zinc-600 font-bold">Created</span>
              <span className="text-zinc-900 font-black">
                {new Date(page.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-zinc-600 font-bold">Tags</span>
              <span className="text-zinc-900 font-black">{page.tags?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
