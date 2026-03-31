"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

type AuthMeResponse =
  | { authenticated: false }
  | { authenticated: true; email: string; role: string; _id: string };

type Channel = {
  channel_id: string;
  name: string;
  description?: string;
  is_group: boolean;
};

// Mocking the reaction and comment types since they don't natively exist yet
type ChannelMessage = {
  id: string;
  author: string;
  role: string;
  content: string;
  timestamp: string;
  reactions: Record<string, number>;
  userReacted?: boolean;
};

export default function ChannelThreadPage() {
  const router = useRouter();
  const params = useParams();
  const channelId = params.channelId as string;

  const [me, setMe] = useState<AuthMeResponse>({ authenticated: false });
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState<Channel | null>(null);
  
  const [messages, setMessages] = useState<ChannelMessage[]>([]);
  const [replyText, setReplyText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

        // Fetch channel metadata from /channels/me to find this specific room
        const chRes = await fetch("/api/proxy/backend/channels/me");
        if (chRes.ok) {
          const data: Channel[] = await chRes.json();
          const target = data.find(c => c.channel_id === channelId || (c as any).id === channelId);
          if (target) {
            setChannel(target);
          } else {
            router.push("/counselor/channels");
          }
        }

        // Load mock starter messages from local storage or pre-seed
        const localKey = `channel_${channelId}_msgs`;
        const stored = localStorage.getItem(localKey);
        if (stored) {
          setMessages(JSON.parse(stored));
        } else {
          setMessages([
            { id: "msg-1", author: "System Administrator", role: "admin", content: "Welcome to this broadcast channel. Please maintain respect and privacy guidelines while discussing topics.", timestamp: new Date().toISOString(), reactions: { "👍": 2 } }
          ]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [channelId, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (messages.length > 0) {
      localStorage.setItem(`channel_${channelId}_msgs`, JSON.stringify(messages));
    }
  }, [messages, channelId]);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !me.authenticated) return;
    
    const newMsg: ChannelMessage = {
      id: `msg-${Date.now()}`,
      author: (me as any).email,
      role: (me as any).role,
      content: replyText,
      timestamp: new Date().toISOString(),
      reactions: {}
    };

    setMessages(prev => [...prev, newMsg]);
    setReplyText("");
  };

  const handleToggleReaction = (msgId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === msgId) {
        const newReactions = { ...msg.reactions };
        const currentCount = newReactions[emoji] || 0;
        
        if (msg.userReacted) {
          if (currentCount > 1) newReactions[emoji]--;
          else delete newReactions[emoji];
        } else {
          newReactions[emoji] = currentCount + 1;
        }
        
        return { ...msg, reactions: newReactions, userReacted: !msg.userReacted };
      }
      return msg;
    }));
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50 text-zinc-500">Loading channel...</div>;
  if (!channel) return null;

  return (
    <div className="flex h-screen flex-col bg-slate-50 relative overflow-hidden">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/50 via-transparent to-transparent"></div>

      {/* HEADER */}
      <header className="shrink-0 border-b border-white/40 bg-white/70 backdrop-blur-xl shadow-sm z-30">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
             <Link href="/counselor/channels" className="rounded-xl border border-zinc-200 bg-white/50 p-2.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors backdrop-blur-md">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
             </Link>
             <div>
               <div className="flex items-center gap-2">
                 <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-[#6366f1] to-[#06b6d4]">
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/></svg>
                 </div>
                 <h1 className="text-xl font-bold text-zinc-900 tracking-tight">{channel.name}</h1>
               </div>
               {channel.description && <p className="text-xs font-medium text-zinc-500 mt-1 max-w-lg truncate">{channel.description}</p>}
             </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
             <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
             <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Live</span>
          </div>
        </div>
      </header>

      {/* MAIN THREAD AREA */}
      <main className="relative z-10 flex flex-1 flex-col overflow-hidden mx-auto w-full max-w-5xl">
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="text-center py-6 mb-4 border-b border-zinc-200/50">
             <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#06b6d4]">Welcome to {channel.name}</h2>
             <p className="text-sm text-zinc-500 mt-2">This is the beginning of the {channel.is_group ? "group" : "broadcast"} discussion.</p>
          </div>

          {messages.map((msg, idx) => {
             const isMe = me.authenticated && msg.author === (me as any).email;
             const isAdmin = msg.role === 'admin';
             const isCounselor = msg.role === 'counselor';
             
             return (
               <div key={msg.id} className="group flex gap-4 animate-in fade-in slide-in-from-bottom-2">
                 {/* Avatar */}
                 <div className={`shrink-0 flex h-10 w-10 items-center justify-center rounded-2xl font-bold text-xs shadow-inner ${
                   isAdmin ? 'bg-zinc-800 text-amber-400' : 
                   isCounselor ? 'bg-gradient-to-br from-[#6366f1] to-[#06b6d4] text-white' : 
                   'bg-white border border-zinc-200 text-zinc-600'
                 }`}>
                   {msg.author.substring(0, 2).toUpperCase()}
                 </div>

                 <div className="flex-1 min-w-0">
                   {/* Meta */}
                   <div className="flex items-baseline gap-2 mb-1">
                     <span className={`text-sm font-bold ${isAdmin ? 'text-zinc-800' : isCounselor ? 'text-[#6366f1]' : 'text-zinc-700'}`}>
                       {msg.author.split('@')[0]}
                     </span>
                     {isAdmin && <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-100 text-amber-700">Admin</span>}
                     {isCounselor && !isAdmin && <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-indigo-50 text-indigo-600">Counselor</span>}
                     <span className="text-[10px] font-medium text-zinc-400">
                       {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </span>
                   </div>

                   {/* Bubble */}
                   <div className="inline-block bg-white border border-zinc-200/60 rounded-2xl rounded-tl-sm px-5 py-3.5 text-[15px] text-zinc-800 shadow-sm leading-relaxed">
                     {msg.content}
                   </div>

                   {/* Reactions Bar */}
                   <div className="mt-2 flex flex-wrap items-center gap-2">
                     {Object.entries(msg.reactions).map(([emoji, count]) => (
                       <button
                         key={emoji}
                         onClick={() => handleToggleReaction(msg.id, emoji)}
                         className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors duration-200 border ${
                           msg.userReacted 
                             ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                             : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                         }`}
                       >
                         <span>{emoji}</span>
                         <span>{count}</span>
                       </button>
                     ))}
                     
                     {/* Add Reaction Button (Shows on hover) */}
                     <button
                       onClick={() => handleToggleReaction(msg.id, "👍")}
                       className="opacity-0 group-hover:opacity-100 transition-opacity flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 text-xs shadow-inner"
                       title="React with Thumb Up"
                     >
                       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                     </button>
                   </div>
                 </div>
               </div>
             )
          })}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* INPUT BAR */}
        <div className="p-4 sm:p-6 shrink-0 bg-white/40 backdrop-blur-md border-t border-white/60">
           <form onSubmit={handlePostComment} className="flex items-end gap-3 max-w-4xl mx-auto relative rounded-3xl bg-white border border-zinc-200 shadow-sm focus-within:ring-4 focus-within:ring-[#6366f1]/10 focus-within:border-[#6366f1] transition-all p-2">
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Write a comment to the channel..."
                className="flex-1 max-h-32 min-h-[44px] resize-none bg-transparent px-4 py-3 text-[15px] text-zinc-800 placeholder:text-zinc-400 focus:outline-none"
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handlePostComment(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#06b6d4] text-white disabled:opacity-50 transition-all hover:scale-105 hover:shadow-[0_4px_15px_rgb(99,102,241,0.4)] mb-0.5 mr-0.5"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
           </form>
           <p className="text-center text-[10px] uppercase tracking-widest font-bold text-zinc-400 mt-3 flex items-center justify-center gap-1.5">
             <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
             Secure Broadcast Thread
           </p>
        </div>

      </main>
    </div>
  );
}
