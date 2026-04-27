"use client";

import { useState, useEffect } from "react";
import { Search, BookOpen, Heart, TrendingUp, Sparkles, Users, FileText } from "lucide-react";
import Link from "next/link";

interface Category {
  value: string;
  label: string;
  description: string;
  article_count: number;
  follower_count: number;
  is_followed: boolean;
}

interface Article {
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  difficulty_level: string;
  author_name: string;
  view_count: number;
  featured_image_url: string;
  created_at: string;
}

export default function EducationalDiscoveryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [myFeed, setMyFeed] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"categories" | "feed">("categories");

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/proxy/backend/category-follows/available-categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchMyFeed = async () => {
    try {
      const res = await fetch("/api/proxy/backend/category-follows/my-feed");
      if (!res.ok) throw new Error("Failed to fetch feed");
      
      const data = await res.json();
      setMyFeed(data);
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchMyFeed()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleFollowCategory = async (category: string) => {
    try {
      const res = await fetch(`/api/proxy/backend/category-follows/follow/${category}`, {
        method: "POST"
      });
      
      if (res.ok) {
        await Promise.all([fetchCategories(), fetchMyFeed()]);
      }
    } catch (error) {
      console.error("Error following category:", error);
    }
  };

  const handleUnfollowCategory = async (category: string) => {
    try {
      const res = await fetch(`/api/proxy/backend/category-follows/unfollow/${category}`, {
        method: "DELETE"
      });
      
      if (res.ok) {
        await Promise.all([fetchCategories(), fetchMyFeed()]);
      }
    } catch (error) {
      console.error("Error unfollowing category:", error);
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

  const getCategoryGradient = (index: number) => {
    const gradients = [
      "from-indigo-500 to-purple-500",
      "from-cyan-500 to-blue-500",
      "from-rose-500 to-pink-500",
      "from-emerald-500 to-teal-500",
      "from-amber-500 to-orange-500",
      "from-violet-500 to-purple-500",
      "from-sky-500 to-cyan-500",
      "from-fuchsia-500 to-pink-500",
    ];
    return gradients[index % gradients.length];
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
            Follow Topics,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
              Learn Daily
            </span>
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto font-medium">
            Follow mental health topics and get all new articles automatically
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-6 py-3 rounded-2xl font-bold transition-all ${
              activeTab === "categories"
                ? "bg-zinc-900 text-white shadow-lg"
                : "bg-white text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            Browse Topics
          </button>
          <button
            onClick={() => setActiveTab("feed")}
            className={`px-6 py-3 rounded-2xl font-bold transition-all ${
              activeTab === "feed"
                ? "bg-zinc-900 text-white shadow-lg"
                : "bg-white text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            My Feed ({myFeed.length})
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-zinc-500 font-medium">Loading...</p>
          </div>
        ) : activeTab === "categories" ? (
          /* Categories Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, index) => (
              <div
                key={cat.value}
                className="group bg-white rounded-3xl border-2 border-zinc-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-300 overflow-hidden animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Category Header with Gradient */}
                <div className={`h-32 bg-gradient-to-br ${getCategoryGradient(index)} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-white/90" />
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* Category Name */}
                  <h3 className="text-2xl font-black text-zinc-900 leading-tight">
                    {cat.label}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-zinc-500 font-medium pt-4 border-t border-zinc-100">
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {cat.article_count} articles
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {cat.follower_count} followers
                    </div>
                  </div>

                  {/* Follow Button */}
                  <div className="pt-4">
                    {cat.is_followed ? (
                      <button
                        onClick={() => handleUnfollowCategory(cat.value)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all"
                      >
                        <Heart className="h-4 w-4 fill-current" />
                        Following
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFollowCategory(cat.value)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-100 text-zinc-700 rounded-2xl text-sm font-bold hover:bg-indigo-100 hover:text-indigo-700 transition-all"
                      >
                        <Heart className="h-4 w-4" />
                        Follow Topic
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* My Feed */
          <div className="space-y-6">
            {myFeed.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-zinc-400 bg-white rounded-3xl border-2 border-zinc-100">
                <Heart className="h-16 w-16 mb-4 opacity-20" />
                <p className="font-bold text-lg">No articles yet</p>
                <p className="text-sm mt-2">Follow some topics to see articles here</p>
                <button
                  onClick={() => setActiveTab("categories")}
                  className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all"
                >
                  Browse Topics
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myFeed.map((article, index) => (
                  <Link
                    key={article.slug}
                    href={`/adolescent/educational/${article.slug}`}
                    className="group bg-white rounded-3xl border-2 border-zinc-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-300 overflow-hidden animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Featured Image */}
                    {article.featured_image_url && (
                      <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-cyan-100 overflow-hidden">
                        <img
                          src={article.featured_image_url}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        
                        {/* Difficulty Badge */}
                        {article.difficulty_level && (
                          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black uppercase ${getDifficultyColor(article.difficulty_level)}`}>
                            {article.difficulty_level}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-6 space-y-4">
                      {/* Category */}
                      {article.category && (
                        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-wider rounded-lg">
                          {article.category}
                        </span>
                      )}

                      {/* Title */}
                      <h3 className="text-xl font-black text-zinc-900 leading-tight group-hover:text-indigo-600 transition-colors">
                        {article.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-sm text-zinc-600 leading-relaxed line-clamp-3">
                        {article.summary || "No summary available"}
                      </p>

                      {/* Tags */}
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {article.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold rounded-lg">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Author */}
                      <div className="pt-4 border-t border-zinc-100">
                        <span className="text-xs text-zinc-500 font-medium">
                          By {article.author_name}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
