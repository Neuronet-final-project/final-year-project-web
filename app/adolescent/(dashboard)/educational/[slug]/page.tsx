"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Heart, Eye, Clock, Share2, BookOpen, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface PageData {
  slug: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  difficulty_level: string;
  author_name: string;
  author_bio: string;
  author_credentials: string;
  estimated_read_time: number;
  view_count: number;
  follow_count: number;
  featured_image_url: string;
  is_following: boolean;
  related_pages: any[];
  created_at: string;
}

export default function EducationalPageReader() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    if (slug) {
      fetchPage();
    }
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchPage = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/proxy/backend/educational-pages/${slug}?with_analytics=true`);
      if (!res.ok) throw new Error("Failed to fetch page");
      
      const data = await res.json();
      setPage(data);
      
      // Track view
      await fetch(`/api/proxy/backend/analytics/track-view/${slug}`, {
        method: "POST"
      });
    } catch (error) {
      console.error("Error fetching page:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!page) return;
    
    try {
      const res = await fetch(`/api/proxy/backend/educational-follows/follow/${slug}`, {
        method: "POST"
      });
      
      if (res.ok) {
        setPage({ ...page, is_following: true, follow_count: page.follow_count + 1 });
      }
    } catch (error) {
      console.error("Error following page:", error);
    }
  };

  const handleUnfollow = async () => {
    if (!page) return;
    
    try {
      const res = await fetch(`/api/proxy/backend/educational-follows/unfollow/${slug}`, {
        method: "DELETE"
      });
      
      if (res.ok) {
        setPage({ ...page, is_following: false, follow_count: page.follow_count - 1 });
      }
    } catch (error) {
      console.error("Error unfollowing page:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <BookOpen className="h-16 w-16 text-zinc-300 mb-4" />
        <h2 className="text-2xl font-black text-zinc-900 mb-2">Page Not Found</h2>
        <p className="text-zinc-600 mb-6">The resource you're looking for doesn't exist.</p>
        <button
          onClick={() => router.push("/adolescent/educational")}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
        >
          Back to Discovery
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50/20 to-white">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-zinc-100 z-50">
        <div
          className="h-full bg-gradient-to-r from-indigo-600 to-cyan-500 transition-all duration-150"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Header */}
      <div className="bg-white border-b border-zinc-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 font-medium transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4 text-sm text-zinc-500">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {page.view_count}
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {page.follow_count}
              </div>
            </div>
            
            {page.is_following ? (
              <button
                onClick={handleUnfollow}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all"
              >
                <Heart className="h-4 w-4 fill-current" />
                Following
              </button>
            ) : (
              <button
                onClick={handleFollow}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-700 rounded-xl text-sm font-bold hover:bg-indigo-100 hover:text-indigo-700 transition-all"
              >
                <Heart className="h-4 w-4" />
                Follow
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      {page.featured_image_url && (
        <div className="relative h-96 bg-gradient-to-br from-indigo-100 to-cyan-100">
          <img
            src={page.featured_image_url}
            alt={page.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-4xl mx-auto">
              {page.category && (
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider rounded-lg mb-4">
                  {page.category}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                {page.title}
              </h1>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {page.author_name}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {page.estimated_read_time} min read
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Summary */}
        {page.summary && (
          <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-r-2xl mb-12">
            <p className="text-lg text-indigo-900 font-medium leading-relaxed">
              {page.summary}
            </p>
          </div>
        )}

        {/* Main Content */}
        <article className="prose prose-lg prose-zinc max-w-none">
          <ReactMarkdown>{page.content}</ReactMarkdown>
        </article>

        {/* Tags */}
        {page.tags && page.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-zinc-200">
            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-4">Topics</h3>
            <div className="flex flex-wrap gap-2">
              {page.tags.map((tag, i) => (
                <span key={i} className="px-4 py-2 bg-zinc-100 text-zinc-700 text-sm font-bold rounded-xl hover:bg-indigo-100 hover:text-indigo-700 transition-colors cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio */}
        {page.author_bio && (
          <div className="mt-12 p-8 bg-zinc-50 rounded-3xl border border-zinc-100">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-black text-2xl flex-shrink-0">
                {page.author_name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-zinc-900 mb-1">{page.author_name}</h3>
                {page.author_credentials && (
                  <p className="text-sm text-indigo-600 font-bold mb-3">{page.author_credentials}</p>
                )}
                <p className="text-zinc-600 leading-relaxed">{page.author_bio}</p>
              </div>
            </div>
          </div>
        )}

        {/* Related Pages */}
        {page.related_pages && page.related_pages.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-black text-zinc-900 mb-6">Related Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {page.related_pages.map((related) => (
                <a
                  key={related.slug}
                  href={`/adolescent/educational/${related.slug}`}
                  className="group p-6 bg-white border-2 border-zinc-100 rounded-2xl hover:border-indigo-200 hover:shadow-xl transition-all"
                >
                  <h4 className="text-lg font-black text-zinc-900 group-hover:text-indigo-600 transition-colors mb-2">
                    {related.title}
                  </h4>
                  <p className="text-sm text-zinc-600 line-clamp-2 mb-3">
                    {related.summary}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Clock className="h-3 w-3" />
                    {related.estimated_read_time} min read
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
