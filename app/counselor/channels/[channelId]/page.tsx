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
    <div className="flex h-screen flex-col bg-[#f8fafc] relative overflow-hidden">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-transparent"></div>
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-100 via-transparent to-transparent"></div>

      {/* HEADER */}
      <header className="shrink-0 border-b border-white bg-white/60 backdrop-blur-md shadow-sm z-30">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
             <Link href="/counselor/channels" className="rounded-xl border border-zinc-200 bg-white p-2.5 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition shadow-sm">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
             </Link>
             <div className="flex items-center gap-3">
               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#0891b2] shadow-lg shadow-indigo-200">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/></svg>
               </div>
               <div>
                 <h1 className="text-lg font-black text-zinc-900 tracking-tight leading-none">{channel.name}</h1>
                 <p className="text-[10px] font-bold text-zinc-500 mt-1 uppercase tracking-widest">Topic: {channelId.substring(0, 8)}</p>
               </div>
             </div>
          </div>
          <div className="hidden sm:flex items-center gap-3">
             <div className="text-right">
               <p className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-1.5 uppercase tracking-widest leading-none">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span> Live Thread
               </p>
             </div>
          </div>
        </div>
      </header>

      {/* MAIN THREAD AREA */}
      <main className="relative z-10 flex flex-1 flex-col overflow-hidden mx-auto w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-10 bg-slate-50/20 custom-scrollbar">
          <div className="text-center py-12 mb-8 border-b border-zinc-100/50">
             <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-indigo-50 text-indigo-600 shadow-inner">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
             </div>
             <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#4f46e5] to-[#0891b2] tracking-tight mb-3">Protocol Initialized</h2>
             <p className="text-sm font-medium text-zinc-400 max-w-lg mx-auto leading-relaxed">
               Welcome to the <span className="text-zinc-600 font-bold">{channel.name}</span> session. Communications in this thread are recorded and monitored for clinical quality.
             </p>
          </div>

          {messages.map((msg, idx) => {
             const isMe = me.authenticated && msg.author === (me as any).email;
             const isAdmin = msg.role === 'admin';
             const isCounselor = msg.role === 'counselor';
             
             return (
               <div key={msg.id} className="group flex gap-5 animate-in fade-in slide-in-from-bottom-4 transition-all hover:translate-x-1">
                 {/* Avatar */}
                 <div className={`shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl font-black text-xs shadow-sm transition-transform group-hover:scale-105 ${
                   isAdmin ? 'bg-zinc-900 text-amber-400 border border-zinc-800' : 
                   isCounselor ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 
                   'bg-white border border-zinc-100 text-zinc-400'
                 }`}>
                   {msg.author.substring(0, 2).toUpperCase()}
                 </div>

                 <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest ${isAdmin ? 'text-zinc-900' : isCounselor ? 'text-indigo-600' : 'text-zinc-400'}`}>
                         {msg.author.split('@')[0]}
                       </span>
                       {isAdmin && <span className="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase bg-amber-50 text-amber-700 border border-amber-100 shadow-sm">System Admin</span>}
                       {isCounselor && !isAdmin && <span className="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">Counselor</span>}
                       <span className="text-[9px] font-bold text-zinc-300 ml-auto">
                         {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>

                    <div className="inline-block bg-white border border-zinc-100 rounded-[1.5rem] rounded-tl-sm px-6 py-4 text-sm font-medium text-zinc-700 shadow-sm leading-relaxed max-w-[90%]">
                      {msg.content}
                    </div>

                    {/* Reactions Bar */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {Object.entries(msg.reactions).map(([emoji, count]) => (
                        <button
                          key={emoji}
                          onClick={() => handleToggleReaction(msg.id, emoji)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black transition-all duration-200 border ${
                            msg.userReacted 
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                              : 'bg-white border-zinc-100 text-zinc-400 hover:bg-zinc-50'
                          }`}
                        >
                          <span>{emoji}</span>
                          <span>{count}</span>
                        </button>
                      ))}
                      
                      <button
                        onClick={() => handleToggleReaction(msg.id, "👍")}
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex h-7 w-7 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100 text-zinc-400 hover:bg-white hover:text-indigo-600 hover:border-indigo-100 shadow-inner"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </button>
                    </div>
                 </div>
               </div>
             )
          })}
          <div ref={messagesEndRef} className="h-8" />
        </div>

        {/* INPUT BAR */}
        <div className="p-6 sm:p-8 shrink-0 bg-white/60 backdrop-blur-md border-t border-zinc-100/50">
           <form onSubmit={handlePostComment} className="flex items-end gap-3 max-w-4xl mx-auto rounded-3xl bg-zinc-50 border border-zinc-100 shadow-inner focus-within:ring-4 focus-within:ring-indigo-100 focus-within:bg-white focus-within:border-indigo-200 transition-all p-2">
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder="Broadcast a message to this channel..."
                className="flex-1 max-h-32 min-h-[48px] resize-none bg-transparent px-4 py-3.5 text-sm font-bold text-zinc-900 placeholder:text-zinc-300 focus:outline-none"
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
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white disabled:opacity-50 transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-200 mb-0.5 mr-0.5 active:scale-95"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              </button>
           </form>
           <p className="text-center text-[10px] uppercase font-black tracking-[0.2em] text-zinc-300 mt-4 flex items-center justify-center gap-2">
             <span className="w-1 h-1 rounded-full bg-zinc-200"></span>
             Safe Thread
             <span className="w-1 h-1 rounded-full bg-zinc-200"></span>
           </p>
        </div>

      </main>
    </div>
  );
}
