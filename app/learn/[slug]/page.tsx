"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export default function PublicArticlePage() {
  const params = useParams();
  const router = useRouter();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-black text-zinc-900 mb-4">Article Not Found</h1>
          <p className="text-zinc-500 mb-6">The article you're looking for doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-900 font-bold mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-4">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            {article.estimated_read_time > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {article.estimated_read_time} min read
              </div>
            )}
            {article.category && (
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-bold text-xs uppercase">
                {article.category}
              </span>
            )}
            {article.difficulty_level && (
              <span className="px-3 py-1 bg-zinc-200 text-zinc-700 rounded-full font-bold text-xs uppercase">
                {article.difficulty_level}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <article className="prose prose-lg prose-zinc max-w-none">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </article>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-zinc-200">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="h-5 w-5 text-zinc-400" />
              {article.tags.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-zinc-100 text-zinc-600 rounded-lg text-sm font-bold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author */}
        {article.author_name && (
          <div className="mt-8 p-6 bg-white rounded-2xl border border-zinc-200">
            <p className="text-sm text-zinc-500 font-bold mb-2">Written by</p>
            <p className="text-lg font-black text-zinc-900">{article.author_name}</p>
            {article.author_credentials && (
              <p className="text-sm text-zinc-600 mt-1">{article.author_credentials}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
