"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Tag, User } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export default function PublicArticlePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const res = await fetch(`/api/proxy/backend/educational-pages/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setArticle(data);
      }
    } catch (error) {
      console.error("Error fetching article:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryGradient = (category: string) => {
    const gradients: Record<string, string> = {
      'anxiety': 'from-indigo-500 to-purple-600',
      'depression': 'from-blue-500 to-blue-700',
      'stress': 'from-pink-500 to-rose-600',
      'self-care': 'from-green-500 to-emerald-600',
      'relationships': 'from-orange-500 to-red-500',
      'coping': 'from-purple-500 to-pink-600',
      'mindfulness': 'from-cyan-500 to-teal-600',
      'wellness': 'from-lime-500 to-green-600',
    };
    return gradients[category?.toLowerCase()] || 'from-zinc-500 to-zinc-700';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      'beginner': 'bg-green-100 text-green-700 border-green-200',
      'intermediate': 'bg-orange-100 text-orange-700 border-orange-200',
      'advanced': 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[difficulty?.toLowerCase()] || 'bg-zinc-100 text-zinc-700 border-zinc-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-zinc-600 font-bold">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-zinc-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-zinc-900 mb-3">Article Not Found</h1>
          <p className="text-zinc-500 mb-6 font-medium">The article you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/counselor/educational"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header with gradient */}
      <div className={`bg-gradient-to-br ${getCategoryGradient(article.category)} text-white`}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link
            href="/counselor/educational"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white font-bold mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
          
          <div className="space-y-4">
            {article.category && (
              <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full font-black text-sm uppercase tracking-wider">
                {article.category}
              </span>
            )}
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
              {article.estimated_read_time > 0 && (
                <div className="flex items-center gap-1.5 font-bold">
                  <Clock className="h-4 w-4" />
                  {article.estimated_read_time} min read
                </div>
              )}
              {article.difficulty_level && (
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full font-bold text-xs uppercase">
                  {article.difficulty_level}
                </span>
              )}
              {article.view_count > 0 && (
                <span className="font-bold">
                  {article.view_count} {article.view_count === 1 ? 'view' : 'views'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Author Card */}
        {article.author_name && (
          <div className="mb-8 p-6 bg-white rounded-3xl border border-zinc-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Written by</p>
                <p className="text-lg font-black text-zinc-900">{article.author_name}</p>
                {article.author_credentials && (
                  <p className="text-sm text-zinc-600 font-medium mt-0.5">{article.author_credentials}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Article Content */}
        <article className="prose prose-lg prose-zinc max-w-none mb-12">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-zinc-200">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl font-black text-zinc-900 mt-8 mb-4 first:mt-0" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-black text-zinc-900 mt-6 mb-3" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-bold text-zinc-900 mt-5 mb-2" {...props} />,
                p: ({node, ...props}) => <p className="text-zinc-700 leading-relaxed mb-4 text-base" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-4 text-zinc-700" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 mb-4 text-zinc-700" {...props} />,
                li: ({node, ...props}) => <li className="text-zinc-700" {...props} />,
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-4 border-indigo-500 pl-4 py-2 my-4 bg-indigo-50 rounded-r-xl italic text-zinc-700" {...props} />
                ),
                code: ({node, ...props}) => <code className="bg-zinc-100 px-2 py-1 rounded text-sm font-mono text-zinc-800" {...props} />,
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-8 p-6 bg-white rounded-3xl border border-zinc-200 shadow-sm">
            <div className="flex items-start gap-3">
              <Tag className="h-5 w-5 text-zinc-400 mt-1 flex-shrink-0" />
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-zinc-100 text-zinc-700 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center">
          <Link
            href="/counselor/educational"
            className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-lg"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
