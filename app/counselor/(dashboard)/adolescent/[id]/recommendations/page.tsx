'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface AIRecommendation {
  recommendation_id: string;
  recommendation_type: string;
  trigger_reason: string;
  recommended_pages: Array<{
    slug: string;
    title: string;
    category?: string;
    relevance_score: number;
  }>;
  is_viewed: boolean;
  created_at: string;
}

export default function AdolescentRecommendationsPage() {
  const params = useParams();
  const router = useRouter();
  const adolescentId = params.id as string;
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [adolescentName, setAdolescentName] = useState<string>('Adolescent');

  useEffect(() => {
    fetchAdolescentInfo();
    fetchRecommendations();
  }, [adolescentId]);

  const fetchAdolescentInfo = async () => {
    try {
      const assignRes = await fetch("/api/proxy/backend/counselor/assignments/me");
      if (assignRes.ok) {
        const assignments = await assignRes.json();
        const match = assignments.find((a: any) => a.adolescent_id === adolescentId);
        if (match) {
          setAdolescentName(match.full_name || match.email);
        }
      }
    } catch (error) {
      console.error('Failed to fetch adolescent info');
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ai-recommendations/adolescent/${adolescentId}/recommendations`,
        { credentials: 'include' }
      );
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data);
      }
    } catch (error) {
      toast.error('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
          <div className="text-slate-600 font-medium">Loading recommendations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header with Back Button */}
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-6 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all hover:shadow-md"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-slate-900 leading-none tracking-tight">AI Recommendations</h1>
            <p className="text-sm font-semibold text-blue-600 mt-0.5">{adolescentName}</p>
          </div>
          <Link
            href={`/counselor/adolescent/${adolescentId}`}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 text-sm font-bold hover:from-slate-200 hover:to-slate-300 transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        {recommendations.length === 0 ? (
          <div className="rounded-3xl border-2 border-slate-200 bg-white p-16 text-center shadow-xl">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mb-6 text-blue-600">
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">No Recommendations Yet</h3>
            <p className="text-slate-600 font-medium">AI recommendations will appear here as patterns are detected in journal entries</p>
          </div>
        ) : (
          <div className="space-y-6">
            {recommendations.map((rec) => (
              <div key={rec.recommendation_id} className="rounded-3xl border-2 border-slate-200 bg-white shadow-xl overflow-hidden hover:shadow-2xl transition-all">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black rounded-xl shadow-md uppercase tracking-wider">
                        AI Recommendation
                      </span>
                      {rec.is_viewed && (
                        <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-black rounded-lg">
                          ✓ Viewed
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                      {new Date(rec.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="mb-6 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-black text-blue-900 mb-2 uppercase tracking-wide">Trigger Reason</div>
                        <div className="text-sm font-medium text-blue-800 leading-relaxed">{rec.trigger_reason}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Recommended Pages
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {rec.recommended_pages.map((page, idx) => {
                        // Fix: relevance_score is 0-1, convert to percentage
                        const relevancePercentage = Math.round(page.relevance_score * 100);
                        
                        return (
                          <div key={idx} className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all group">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="font-bold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition-colors">{page.title}</div>
                                {page.category && (
                                  <div className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    {page.category}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                              <span className="text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                                {relevancePercentage}% Match
                              </span>
                              <button 
                                onClick={() => window.open(`/educational/${page.slug}`, '_blank')}
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                              >
                                View Page
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
