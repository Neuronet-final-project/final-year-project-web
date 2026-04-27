"use client";

import { useState, useEffect } from "react";
import { Search, Filter, BookOpen, Heart, Eye, Clock, TrendingUp, Sparkles, X } from "lucide-react";
import Link from "next/link";

interface Page {
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  difficulty_level: string;
  author_name: string;
  estimated_read_time: number;
  view_count: number;
  follow_count: number;
  engagement_score: number;
  featured_image_url: string;
  is_following: boolean;
  created_at: string;
}

export default function EducationalDiscoveryPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [showFilters, setShowFilters] = useState(false);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (difficulty) params.append("difficulty", difficulty);
      params.append("sort_by", sortBy);
      
      const res = await fetch(`/api/proxy/backend/educational-pages/discover?${params}`);
      if (!res.ok) throw new Error("Failed to fetch pages");
      
      const data = await res.json();
      setPages(data.pages || []);
    } catch (error) {
      console.error("Error fetching pages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [search, category, difficulty, sortBy]);

  const handleFollow = async (slug: string) => {
    try {
      const res = await fetch(`/api/proxy/backend/educational-follows/follow/${slug}`, {
        method: "POST"
      });
      
      if (res.ok) {
        setPages(pages.map(p => 
          p.slug === slug ? { ...p, is_following: true, follow_count: p.follow_count + 1 } : p
        ));
      }
    } catch (error) {
      console.error("Error following page:", error);
    }
  };

  const handleUnfollow = async (slug: string) => {
    try {
      const res = await fetch(`/api/proxy/backend/educational-follows/unfollow/${slug}`, {
        method: "DELETE"
      });
      
      if (res.ok) {
        setPages(pages.map(p => 
          p.slug === slug ? { ...p, is_following: false, follow_count: p.follow_count - 1 } : p
        ));
      }
    } catch (error) {
      console.error("Error unfollowing page:", error);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-emerald-100 text-emerald-700";
      case "intermediate": return "bg-amber-100 text-amber-700";
      case "advanced": return "bg-rose-100 text-rose-700";
      default: return "bg-zinc-100 text-zinc-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50/30 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50 to-cyan-50 px-5 py-2 text-sm font-black text-indigo-600 border border-indigo-200/60 mb-4">
            <Sparkles className="h-4 w-4" />
            LEARNER'S NOOK
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tight">
            Discover Mental Health{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
              Resources
            </span>
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto font-medium">
            Explore evidence-based articles and guides created by professional counselors
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search articles, topics, or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl text-zinc-900 font-medium placeholder:text-zinc-400 outline-none transition-all"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all"
            >
              <Filter className="h-5 w-5" />
              Filters
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-100 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border-2 border-transparent focus:border-indigo-500 rounded-xl font-medium outline-none transition-all"
                >
                  <option value="">All Categories</option>
                  <option value="anxiety">Anxiety</option>
                  <option value="depression">Depression</option>
                  <option value="stress">Stress Management</option>
                  <option value="self-care">Self-Care</option>
                  <option value="relationships">Relationships</option>
                  <option value="coping">Coping Strategies</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border-2 border-transparent focus:border-indigo-500 rounded-xl font-medium outline-none transition-all"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border-2 border-transparent focus:border-indigo-500 rounded-xl font-medium outline-none transition-all"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="newest">Newest First</option>
                  <option value="most_viewed">Most Viewed</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-zinc-500 font-medium">Loading resources...</p>
          </div>
        ) : pages.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-zinc-400">
            <BookOpen className="h-16 w-16 mb-4 opacity-20" />
            <p className="font-bold text-lg">No resources found</p>
            <p className="text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page, index) => (
              <div
                key={page.slug}
                className="group bg-white rounded-3xl border-2 border-zinc-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-300 overflow-hidden animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Featured Image */}
                {page.featured_image_url && (
                  <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-cyan-100 overflow-hidden">
                    <img
                      src={page.featured_image_url}
                      alt={page.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    {/* Difficulty Badge */}
                    {page.difficulty_level && (
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black uppercase ${getDifficultyColor(page.difficulty_level)}`}>
                        {page.difficulty_level}
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6 space-y-4">
                  {/* Category */}
                  {page.category && (
                    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-wider rounded-lg">
                      {page.category}
                    </span>
                  )}

                  {/* Title */}
                  <Link href={`/adolescent/educational/${page.slug}`}>
                    <h3 className="text-xl font-black text-zinc-900 leading-tight group-hover:text-indigo-600 transition-colors cursor-pointer">
                      {page.title}
                    </h3>
                  </Link>

                  {/* Summary */}
                  <p className="text-sm text-zinc-600 leading-relaxed line-clamp-3">
                    {page.summary || "No summary available"}
                  </p>

                  {/* Tags */}
                  {page.tags && page.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {page.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-lg">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-zinc-500 font-medium pt-4 border-t border-zinc-100">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {page.estimated_read_time} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {page.view_count}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {page.follow_count}
                    </div>
                  </div>

                  {/* Author */}
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                    <span className="text-xs text-zinc-500 font-medium">
                      By {page.author_name}
                    </span>
                    
                    {/* Follow Button */}
                    {page.is_following ? (
                      <button
                        onClick={() => handleUnfollow(page.slug)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all"
                      >
                        <Heart className="h-4 w-4 fill-current" />
                        Following
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFollow(page.slug)}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-700 rounded-xl text-xs font-bold hover:bg-indigo-100 hover:text-indigo-700 transition-all"
                      >
                        <Heart className="h-4 w-4" />
                        Follow
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
