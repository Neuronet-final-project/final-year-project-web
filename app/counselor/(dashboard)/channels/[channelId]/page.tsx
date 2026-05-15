"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";

/* ── Post Form Validation ─────────────────────────── */
interface PostFormErrors {
  title?: string;
  content?: string;
}

function validatePostForm(title: string, content: string): PostFormErrors {
  const errors: PostFormErrors = {};
  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (!trimmedTitle) {
    errors.title = "Post title is required.";
  } else if (trimmedTitle.length < 3) {
    errors.title = "Title must be at least 3 characters.";
  } else if (trimmedTitle.length > 150) {
    errors.title = "Title must be under 150 characters.";
  }

  if (!trimmedContent) {
    errors.content = "Post content is required.";
  } else if (trimmedContent.length < 10) {
    errors.content = `Content must be at least 10 characters (currently ${trimmedContent.length}).`;
  } else if (trimmedContent.length > 5000) {
    errors.content = "Content must be under 5000 characters.";
  }

  return errors;
}

type AuthMeResponse =
  | { authenticated: false }
  | { authenticated: true; email: string; role: string; _id: string };

type Channel = {
  channel_id: string;
  name: string;
  description?: string;
  is_group: boolean;
};

type ChannelPost = {
  id: string;
  channel_id: string;
  counselor_id: string;
  counselor_name: string | null;
  title: string;
  content: string;
  post_type: string;
  is_educational: boolean;
  is_pinned: boolean;
  allow_comments: boolean;
  view_count: number;
  reaction_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string | null;
};

type Interaction = {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string | null;
  interaction_type: string;
  content: string | null;
  reaction_type: string | null;
  created_at: string;
  is_visible: boolean;
};

export default function ChannelThreadPage() {
  const router = useRouter();
  const params = useParams();
  const channelId = params.channelId as string;

  const [me, setMe] = useState<AuthMeResponse>({ authenticated: false });
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [posts, setPosts] = useState<ChannelPost[]>([]);
  const [interactions, setInteractions] = useState<Record<string, Interaction[]>>({});
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [postType, setPostType] = useState("article");
  const [showNewForm, setShowNewForm] = useState(false);
  const [posting, setPosting] = useState(false);
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [postErrors, setPostErrors] = useState<PostFormErrors>({});

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const m = (await res.json()) as AuthMeResponse;
        setMe(m);
        if (!("authenticated" in m) || !m.authenticated) {
          router.replace("/login");
          return;
        }

        // Fetch channel metadata
        const chRes = await fetch("/api/proxy/backend/channels/me");
        if (chRes.ok) {
          const data: Channel[] = await chRes.json();
          const target = data.find(c => c.channel_id === channelId || (c as any).id === channelId);
          if (target) setChannel(target);
          else router.push("/counselor/channels");
        }

        // Fetch real posts from backend
        await loadPosts();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [channelId, router]);

  const loadPosts = async () => {
    const postsRes = await fetch(`/api/proxy/backend/channels/${channelId}/posts`);
    if (postsRes.ok) {
      const data: ChannelPost[] = await postsRes.json();
      setPosts(data);
    }
  };

  const loadInteractions = async (postId: string) => {
    const res = await fetch(`/api/proxy/backend/channels/${channelId}/posts/${postId}/interactions`);
    if (res.ok) {
      const data: Interaction[] = await res.json();
      setInteractions(prev => ({ ...prev, [postId]: data }));
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!me.authenticated) return;

    const validationErrors = validatePostForm(newTitle, newContent);
    if (Object.keys(validationErrors).length > 0) {
      setPostErrors(validationErrors);
      return;
    }
    setPostErrors({});
    setPosting(true);

    try {
      const res = await fetch(`/api/proxy/backend/channels/${channelId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          post_type: postType,
          is_educational: postType === "article",
          allow_comments: true,
        }),
      });
      if (res.ok) {
        setNewTitle("");
        setNewContent("");
        setShowNewForm(false);
        await loadPosts();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  const handleReaction = async (postId: string, reactionType: string) => {
    try {
      const res = await fetch(`/api/proxy/backend/channels/${channelId}/posts/${postId}/interact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interaction_type: "reaction", reaction_type: reactionType }),
      });
      if (res.ok || res.status === 400) {
        await loadPosts();
        await loadInteractions(postId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (postId: string) => {
    const text = commentTexts[postId]?.trim();
    if (!text) return;

    try {
      const res = await fetch(`/api/proxy/backend/channels/${channelId}/posts/${postId}/interact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interaction_type: "comment", content: text }),
      });
      if (res.ok) {
        setCommentTexts(prev => ({ ...prev, [postId]: "" }));
        await loadInteractions(postId);
        await loadPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Delete this post and all its interactions?")) return;
    try {
      const res = await fetch(`/api/proxy/backend/channels/${channelId}/posts/${postId}`, { method: "DELETE" });
      if (res.ok || res.status === 204) await loadPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleModerate = async (postId: string, interactionId: string, visible: boolean) => {
    try {
      const res = await fetch(
        `/api/proxy/backend/channels/${channelId}/posts/${postId}/interactions/${interactionId}/moderate?visible=${visible}`,
        { method: "PATCH" }
      );
      if (res.ok) await loadInteractions(postId);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleExpandPost = async (postId: string) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
      if (!interactions[postId]) await loadInteractions(postId);
    }
  };

  const reactionEmojis = [
    { type: "like", emoji: "👍" },
    { type: "support", emoji: "💜" },
    { type: "helpful", emoji: "✅" },
    { type: "question", emoji: "❓" },
  ];

  const postTypeOptions = [
    { value: "article", label: "📝 Article" },
    { value: "tip", label: "💡 Tip" },
    { value: "resource", label: "📚 Resource" },
    { value: "discussion", label: "💬 Discussion" },
    { value: "question", label: "❓ Question" },
  ];

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-zinc-500">
        Loading channel...
      </div>
    );
  if (!channel) return null;

  return (
    <div className="flex h-full flex-col overflow-hidden animate-in fade-in duration-700">
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="shrink-0 px-6 py-4 bg-white border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-start gap-4">
            <button
              onClick={() => router.push('/counselor/channels')}
              className="mt-1 shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-50 border border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
              title="Back to channels"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div>
              <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#4f46e5] to-[#0891b2]">
                {channel.name}
              </h1>
              {channel.description && (
                <p className="text-xs text-zinc-400 mt-1">{channel.description}</p>
              )}
            </div>
          </div>
          {me.authenticated && ((me as any).role === "counselor" || (me as any).role === "admin") && (
            <button
              onClick={() => setShowNewForm(!showNewForm)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              {showNewForm ? "Cancel" : "+ New Post"}
            </button>
          )}
        </div>

        {/* New Post Form */}
        {showNewForm && (
          <div className="shrink-0 px-6 py-5 bg-indigo-50/50 border-b border-indigo-100">
            <form onSubmit={handleCreatePost} className="max-w-3xl space-y-4" noValidate>
              <div className="flex gap-3">
                <select
                  value={postType}
                  onChange={e => setPostType(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-900 bg-white focus:ring-2 focus:ring-indigo-200 outline-none"
                >
                  {postTypeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="flex-1">
                  <input
                    value={newTitle}
                    onChange={e => { setNewTitle(e.target.value); if (postErrors.title) setPostErrors(prev => ({ ...prev, title: undefined })); }}
                    placeholder="Post title..."
                    className={`w-full px-4 py-2 rounded-xl border text-sm font-bold text-zinc-900 placeholder:text-zinc-400 bg-white focus:ring-2 focus:ring-indigo-200 outline-none ${postErrors.title ? 'border-red-400 ring-2 ring-red-100' : 'border-zinc-200'}`}
                  />
                  {postErrors.title && <p className="text-xs text-red-500 mt-1">{postErrors.title}</p>}
                </div>
              </div>
              <div>
                <textarea
                  value={newContent}
                  onChange={e => { setNewContent(e.target.value); if (postErrors.content) setPostErrors(prev => ({ ...prev, content: undefined })); }}
                  placeholder="Write your post content..."
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-zinc-900 placeholder:text-zinc-400 bg-white resize-none focus:ring-2 focus:ring-indigo-200 outline-none ${postErrors.content ? 'border-red-400 ring-2 ring-red-100' : 'border-zinc-200'}`}
                />
                {postErrors.content ? (
                  <p className="text-xs text-red-500 mt-1">{postErrors.content}</p>
                ) : (
                  <p className="text-xs text-zinc-400 mt-1">{newContent.length}/5000 characters (minimum 10)</p>
                )}
              </div>
              <button
                type="submit"
                disabled={posting}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold disabled:opacity-50 hover:bg-indigo-700 transition-all"
              >
                {posting ? "Publishing..." : "Publish Post"}
              </button>
            </form>
          </div>
        )}

        {/* Posts Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
          {posts.length === 0 && (
            <div className="text-center py-20">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-indigo-50 text-indigo-600 shadow-inner">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </div>
              <h2 className="text-lg font-bold text-zinc-500">No posts yet</h2>
              <p className="text-sm text-zinc-400 mt-1">Create the first post to start the conversation.</p>
            </div>
          )}

          {posts.map(post => {
            const isExpanded = expandedPost === post.id;
            const postInteractions = interactions[post.id] || [];
            const comments = postInteractions.filter(i => i.interaction_type === "comment" && i.is_visible);
            const reactions = postInteractions.filter(i => i.interaction_type === "reaction");
            const isMine = me.authenticated && post.counselor_id === (me as any)._id;

            return (
              <div key={post.id} className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
                {/* Post Header */}
                <div className="px-6 pt-5 pb-3 flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-xs">
                      {(post.counselor_name || "C").substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-zinc-800">{post.counselor_name || "Counselor"}</span>
                        <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase bg-indigo-50 text-indigo-600 border border-indigo-100">
                          {post.post_type}
                        </span>
                        {post.is_pinned && (
                          <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase bg-amber-50 text-amber-600 border border-amber-100">
                            📌 Pinned
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400">
                        {new Date(post.created_at).toLocaleDateString()} · {post.view_count} views
                      </span>
                    </div>
                  </div>
                  {isMine && (
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-zinc-300 hover:text-red-500 transition-colors p-1"
                      title="Delete post"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  )}
                </div>

                {/* Post Content */}
                <div className="px-6 pb-4">
                  <h3 className="text-lg font-bold text-zinc-900 mb-2">{post.title}</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                </div>

                {/* Reactions Bar */}
                <div className="px-6 pb-3 flex items-center gap-2 flex-wrap">
                  {reactionEmojis.map(re => (
                    <button
                      key={re.type}
                      onClick={() => handleReaction(post.id, re.type)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border border-zinc-100 bg-zinc-50 text-zinc-500 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all"
                    >
                      <span>{re.emoji}</span>
                    </button>
                  ))}
                  <span className="text-[10px] text-zinc-400 ml-2">
                    {post.reaction_count} reactions · {post.comment_count} comments
                  </span>
                </div>

                {/* Expand/Collapse Comments */}
                <div className="border-t border-zinc-50">
                  <button
                    onClick={() => toggleExpandPost(post.id)}
                    className="w-full px-6 py-3 text-xs font-bold text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-1"
                  >
                    {isExpanded ? "Hide Comments ▲" : `View Comments (${post.comment_count}) ▼`}
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-5 space-y-3">
                      {comments.length === 0 && (
                        <p className="text-xs text-zinc-400 text-center py-3">No comments yet. Be the first!</p>
                      )}
                      {comments.map(c => (
                        <div key={c.id} className="flex gap-3 items-start">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 text-[10px] font-bold shrink-0">
                            {(c.user_name || "U").substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-zinc-700">{c.user_name || "User"}</span>
                              <span className="text-[9px] text-zinc-300">{new Date(c.created_at).toLocaleTimeString()}</span>
                              {me.authenticated && ((me as any).role === "counselor" || (me as any).role === "admin") && (
                                <button
                                  onClick={() => handleModerate(post.id, c.id, false)}
                                  className="text-[9px] text-zinc-300 hover:text-red-500 ml-auto"
                                  title="Hide comment (moderate)"
                                >
                                  🚫
                                </button>
                              )}
                            </div>
                            <p className="text-sm text-zinc-600 mt-0.5">{c.content}</p>
                          </div>
                        </div>
                      ))}

                      {/* Comment Input */}
                      {post.allow_comments && (
                        <div className="flex gap-2 pt-2 border-t border-zinc-50">
                          <input
                            value={commentTexts[post.id] || ""}
                            onChange={e => setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                            placeholder="Write a comment..."
                            className="flex-1 px-3 py-2 rounded-xl border border-zinc-200 text-sm bg-zinc-50 focus:ring-2 focus:ring-indigo-200 outline-none"
                            onKeyDown={e => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleComment(post.id);
                              }
                            }}
                          />
                          <button
                            onClick={() => handleComment(post.id)}
                            disabled={!commentTexts[post.id]?.trim()}
                            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold disabled:opacity-50 hover:bg-indigo-700 transition-all"
                          >
                            Reply
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} className="h-8" />
        </div>
      </main>
    </div>
  );
}
