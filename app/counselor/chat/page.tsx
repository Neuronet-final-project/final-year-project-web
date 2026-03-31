"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type AuthMeResponse =
  | { authenticated: false }
  | { authenticated: true; email: string; role: string; _id: string };

type Conversation = {
  _id?: string;
  id?: string;
  conversation_type: "counselor_adolescent" | "counselor_guardian" | "adolescent_guardian" | "channel";
  adolescent_id?: string;
  guardian_email?: string;
  counselor_email?: string;
  participant_emails: string[];
  created_at: string;
};

type Message = {
  _id: string;
  conversation_id: string;
  sender_email: string;
  sender_role: string;
  content: string;
  created_at: string;
};

export default function CounselorChatPage() {
  const router = useRouter();
  const [me, setMe] = useState<AuthMeResponse>({ authenticated: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgsLoading, setMsgsLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

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
        if (m.role !== "counselor") {
          router.replace(m.role === "admin" ? "/admin/dashboard" : "/login");
          return;
        }

        const convsRes = await fetch("/api/proxy/backend/messaging/conversations");
        if (convsRes.ok) {
          const data = await convsRes.json();
          setConversations(data || []);
        } else {
          setError("Failed to load conversations.");
        }
      } catch (err) {
        setError("Network error while loading chat.");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (!activeConvId) return;
    let isMounted = true;

    async function fetchMessages() {
      setMsgsLoading(true);
      try {
        const res = await fetch(`/api/proxy/backend/messaging/conversations/${activeConvId}/messages`);
        if (res.ok && isMounted) {
          const data = await res.json();
          // Assuming backend returns newest first or we need to sort them chronologically for chat UI
          const sorted = (data || []).sort(
            (a: Message, b: Message) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
          setMessages(sorted);
        }
      } finally {
        if (isMounted) setMsgsLoading(false);
      }
    }

    fetchMessages();

    // Simple polling for real-time feel (every 5 seconds)
    const intervalId = setInterval(fetchMessages, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [activeConvId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim() || !activeConvId) return;

    setSending(true);
    try {
      const res = await fetch(`/api/proxy/backend/messaging/conversations/${activeConvId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyText }),
      });
      if (res.ok) {
        setReplyText("");
        const newMsg = await res.json();
        setMessages((prev) => [...prev, newMsg]);
      } else {
        alert("Failed to send message");
      }
    } finally {
      setSending(false);
    }
  }

  // Get display name for conversation
  function getConvName(conv: Conversation) {
    if (!("authenticated" in me)) return "Unknown";
    const others = conv.participant_emails?.filter((e) => e !== me.email) || [];
    if (conv.conversation_type === "counselor_guardian") return `Guardian: ${others[0] || "Unknown"}`;
    if (conv.conversation_type === "counselor_adolescent") return `Adolescent: ${others[0] || "Unknown"}`;
    return conv.conversation_type || "Conversation";
  }

  if (loading || !me.authenticated) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb] text-zinc-500">Loading secure chat...</div>;
  }

  const activeConv = conversations.find(c => (c._id || c.id) === activeConvId);

  return (
    <div className="flex h-screen flex-col bg-slate-50 relative overflow-hidden">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-transparent"></div>
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-100 via-transparent to-transparent"></div>

      {/* HEADER */}
      <header className="shrink-0 border-b border-white/20 bg-white/60 backdrop-blur-md shadow-sm z-30">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
             <Link href="/counselor/dashboard" className="rounded-xl border border-zinc-200 bg-white p-2 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
             </Link>
             <div className="flex items-center gap-3">
               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#4F46E5] to-cyan-500 shadow-inner">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
               </div>
               <div>
                 <h1 className="text-xl font-bold text-zinc-900 leading-none">Communications</h1>
                 <p className="text-xs font-medium text-zinc-500 mt-1">End-to-End Encrypted Secure Channel</p>
               </div>
             </div>
          </div>
          <div className="hidden sm:block text-right">
             <p className="text-sm font-semibold text-zinc-900">{me.authenticated ? (me as any).email : ""}</p>
             <p className="text-xs text-emerald-600 font-medium flex items-center justify-end gap-1">
               <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
             </p>
          </div>
        </div>
      </header>

      {/* MAIN CHAT AREA */}
      <main className="relative z-10 flex flex-1 overflow-hidden mx-auto w-full max-w-7xl p-4 md:p-6 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* SIDEBAR: Conversation List */}
        <div className={`w-full md:w-80 shrink-0 flex flex-col rounded-[2rem] border border-white/60 bg-white/70 backdrop-blur-xl shadow-lg overflow-hidden transition-all duration-300 ${activeConvId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-5 border-b border-white/40 bg-white/40">
            <h2 className="font-black tracking-tight text-zinc-900">Active Contacts</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {error && <div className="p-3 text-xs text-red-600">{error}</div>}
            {conversations.length === 0 && !error ? (
              <div className="p-4 text-center text-sm text-zinc-500">No active conversations.</div>
            ) : (
              conversations.map((conv, idx) => {
                const cId = conv.id || conv._id || String(idx);
                const isActive = cId === activeConvId;
                const name = getConvName(conv);
                const initials = name.replace("Adolescent: ", "").replace("Guardian: ", "").substring(0,2).toUpperCase();
                
                return (
                  <button
                    key={cId}
                    onClick={() => setActiveConvId(cId)}
                    className={`w-full flex items-center gap-3 p-3 text-left rounded-2xl transition-colors ${
                      isActive ? "bg-indigo-50 border border-indigo-100" : "hover:bg-zinc-50 border border-transparent"
                    }`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-xs ${isActive ? 'bg-[#4F46E5] text-white' : 'bg-zinc-100 text-zinc-600'}`}>
                      {initials}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className={`truncate text-sm font-semibold ${isActive ? 'text-indigo-900' : 'text-zinc-900'}`}>{name}</h4>
                      <p className="truncate text-xs text-zinc-500 mt-0.5">
                        {conv.conversation_type.replace('_', ' ')}
                      </p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* ACTIVE CHAT AREA */}
        <div className={`flex-1 flex flex-col rounded-[2rem] border border-white/60 bg-white/70 backdrop-blur-xl shadow-lg overflow-hidden transition-all duration-300 ${!activeConvId ? 'hidden md:flex' : 'flex'}`}>
          {!activeConvId ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center p-8">
               <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50/50 text-indigo-300 shadow-inner">
                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
               </div>
               <h3 className="text-2xl font-black tracking-tight text-zinc-400">Select a conversation</h3>
               <p className="mt-2 text-sm font-medium text-zinc-500 max-w-sm">Choose a contact from the sidebar to start a secure messaging session protecting adolescent privacy.</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
               <div className="flex items-center gap-4 border-b border-white/40 bg-white/40 p-4 shrink-0">
                 <button className="md:hidden p-2 text-zinc-500" onClick={() => setActiveConvId(null)}>
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                 </button>
                 <div>
                   <h3 className="font-bold text-zinc-900">{activeConv ? getConvName(activeConv) : "Chat"}</h3>
                   <p className="text-xs text-emerald-600 font-medium">Secure Session Active</p>
                 </div>
               </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-zinc-50/30">
                {msgsLoading && messages.length === 0 ? (
                  <div className="text-center text-sm text-zinc-500 mt-4">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-sm text-zinc-500 mt-10 p-6 bg-white rounded-2xl border border-dashed border-zinc-200">
                    No messages yet. Send a message to start the secure conversation.
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isMe = msg.sender_email === me.email;
                    const showHeader = idx === 0 || messages[idx - 1].sender_email !== msg.sender_email;

                    return (
                      <div key={msg._id || idx} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                        {showHeader && (
                          <span className="text-[10px] font-bold uppercase text-zinc-400 mb-1 px-1">
                            {isMe ? "You" : msg.sender_role || "User"}
                          </span>
                        )}
                        <div
                          className={`relative max-w-[85%] sm:max-w-[70%] rounded-2xl px-5 py-3 text-sm shadow-sm ${
                            isMe
                              ? "bg-[#4F46E5] text-white rounded-tr-none"
                              : "bg-white border border-zinc-200 text-zinc-900 rounded-tl-none"
                          }`}
                        >
                          {msg.content}
                          <div className={`text-[9px] mt-1.5 text-right ${isMe ? 'text-indigo-200' : 'text-zinc-400'}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="border-t border-white/40 bg-white/60 p-4 shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your secure message..."
                    className="flex-1 rounded-full border border-white/60 bg-white/80 px-5 py-3 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 shadow-sm"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim() || sending}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#4F46E5] text-white transition hover:bg-indigo-600 disabled:opacity-50 hover:shadow-md"
                  >
                    {sending ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    )}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>

      </main>
    </div>
  );
}
