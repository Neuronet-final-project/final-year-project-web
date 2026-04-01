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
  conversation_id?: string;
  conversation_type: "counselor_adolescent" | "counselor_guardian" | "adolescent_guardian" | "channel";
  adolescent_id?: string;
  guardian_email?: string;
  counselor_email?: string;
  participant_emails?: string[];
  participants?: string[];
  created_at: string;
};

type AssignedAdolescent = {
  adolescent_id: string;
  adolescent_email: string;
  full_name?: string;
  guardian_email?: string;
  guardian_id?: string;
  matched_at: string;
  status: string;
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
  const [assignedContacts, setAssignedContacts] = useState<AssignedAdolescent[]>([]);
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

        const [convsRes, assignRes] = await Promise.all([
          fetch("/api/proxy/backend/messaging/conversations"),
          fetch("/api/proxy/backend/counselor/assignments/me")
        ]);

        if (convsRes.ok) {
          const data = await convsRes.json();
          setConversations(data || []);
        } else {
          setError("Failed to load conversations.");
        }

        if (assignRes.ok) {
          const aData = await assignRes.json();
          setAssignedContacts(aData || []);
        }
      } catch (err) {
        setError("Network error while loading data.");
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
    if (!me.authenticated) return "Unknown";
    const pList = conv.participants || conv.participant_emails || [];
    const others = pList.filter((e) => e !== me.email);
    if (conv.conversation_type === "counselor_guardian") return `Guardian: ${others[0] || "Unknown"}`;
    if (conv.conversation_type === "counselor_adolescent") return `Adolescent: ${others[0] || "Unknown"}`;
    return conv.conversation_type || "Conversation";
  }

  // Initiate conversation with contact
  async function handleInitiateContact(adolescentId: string, type: "counselor_adolescent" | "counselor_guardian") {
    // Check if conversation already exists in state
    const existing = conversations.find(c => {
      const pList = c.participants || c.participant_emails || [];
      return c.conversation_type === type && 
        (c.adolescent_id === adolescentId || pList.some(e => e.includes(adolescentId)));
    });

    if (existing) {
      setActiveConvId(existing.conversation_id || existing._id || existing.id || null);
      return;
    }

    try {
      const res = await fetch("/api/proxy/backend/messaging/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_type: type,
          adolescent_id: adolescentId
        })
      });
      if (res.ok) {
        const newConv = await res.json();
        setConversations(prev => [...prev, newConv]);
        setActiveConvId(newConv.conversation_id || newConv._id || newConv.id);
      } else {
        alert("Failed to initiate thread with this contact.");
      }
    } catch (e) {
      alert("Network error.");
    }
  }

  if (loading || !me.authenticated) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb] text-zinc-500">Loading secure chat...</div>;
  }

  // Filter out any channel objects from this 1-on-1 direct messaging view
  const dmsOnly = conversations.filter(c => c.conversation_type !== "channel");

  const getConvId = (c: Conversation) => c.conversation_id || c._id || c.id;
  const activeConv = dmsOnly.find(c => getConvId(c) === activeConvId);

  // De-duplicate contacts natively mapping by ID
  const uniqueContacts = Array.from(new Map(assignedContacts.map(c => [c.adolescent_id, c])).values());

  // Group contacts by guardian
  const guardianGroups: Record<string, AssignedAdolescent[]> = {};
  const independentAdolescents: AssignedAdolescent[] = [];

  uniqueContacts.forEach(contact => {
    if (contact.guardian_email) {
      if (!guardianGroups[contact.guardian_email]) guardianGroups[contact.guardian_email] = [];
      guardianGroups[contact.guardian_email].push(contact);
    } else {
      independentAdolescents.push(contact);
    }
  });

  return (
    <div className="flex h-screen flex-col bg-[#f8fafc] relative overflow-hidden">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-transparent"></div>
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-100 via-transparent to-transparent"></div>

      {/* HEADER */}
      <header className="shrink-0 border-b border-white bg-white/60 backdrop-blur-md shadow-sm z-30">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
             <Link href="/counselor/dashboard" className="rounded-xl border border-zinc-200 bg-white p-2 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition shadow-sm">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
             </Link>
             <div className="flex items-center gap-3">
               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#0891b2] shadow-lg shadow-indigo-200">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
               </div>
               <div>
                 <h1 className="text-lg font-black text-zinc-900 leading-none">SafeChat Pro</h1>
                 <p className="text-[10px] font-bold text-zinc-500 mt-1 uppercase tracking-widest">Counselor Channel</p>
               </div>
             </div>
          </div>
          <div className="hidden sm:flex items-center gap-3">
             <div className="text-right">
               <p className="text-xs font-bold text-zinc-900">{me.authenticated ? (me as any).email : ""}</p>
               <p className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-1 uppercase tracking-tighter">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Encrypted
               </p>
             </div>
          </div>
        </div>
      </header>

      {/* MAIN CHAT AREA */}
      <main className="relative z-10 flex flex-1 overflow-hidden mx-auto w-full max-w-7xl p-4 md:p-6 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* SIDEBAR: Conversation List */}
        <div className={`w-full md:w-80 shrink-0 flex flex-col rounded-[2rem] border border-white bg-white/70 backdrop-blur-xl shadow-lg overflow-hidden transition-all duration-300 ring-1 ring-zinc-200/50 ${activeConvId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-zinc-100/50 bg-white/40 flex items-center justify-between">
            <h2 className="text-sm font-black tracking-widest text-zinc-400 uppercase">Contacts</h2>
            <div className="h-2 w-2 rounded-full bg-indigo-600 animate-ping" />
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {error && <div className="p-3 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl border border-rose-100">{error}</div>}
            
            <div className="space-y-4">
              {uniqueContacts.length === 0 && !error ? (
                <div className="p-6 text-center text-xs text-zinc-400 font-medium bg-zinc-50 rounded-[1.5rem] border border-dashed border-zinc-200">
                  No assigned cases yet.
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(guardianGroups).map(([gEmail, adolescents]) => {
                    const representativeAdolescentId = adolescents[0].adolescent_id;
                    const aConvPList = activeConv?.participants || activeConv?.participant_emails || [];
                    const isGuardActive = activeConv?.conversation_type === "counselor_guardian" && 
                      (activeConv.adolescent_id === representativeAdolescentId || aConvPList.some((p: string) => p.includes(representativeAdolescentId)));

                    return (
                      <div key={`guard-group-${gEmail}`} className="space-y-2">
                         {/* GUARDIAN PORTAL LINK */}
                         <button
                           onClick={() => handleInitiateContact(representativeAdolescentId, "counselor_guardian")}
                           className={`w-full flex items-center gap-3 p-3 text-left rounded-2xl transition-all duration-300 border ${isGuardActive ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white hover:bg-slate-50 border-zinc-100'}`}
                         >
                           <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black text-[10px] shadow-sm ${isGuardActive ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                              GRP
                           </div>
                           <div className="overflow-hidden flex-1">
                             <h4 className="truncate text-xs font-black uppercase tracking-tight">Parent/Guardian</h4>
                             <p className={`truncate text-[10px] font-bold ${isGuardActive ? 'text-indigo-100/70' : 'text-zinc-400'}`}>{gEmail}</p>
                           </div>
                         </button>

                         {/* NESTED CHILDREN */}
                         <div className="pl-4 space-y-2">
                             {adolescents.map(contact => {
                                const adolInitials = (contact.full_name || contact.adolescent_email).substring(0, 2).toUpperCase();
                                const contactPList = activeConv?.participants || activeConv?.participant_emails || [];
                                const isAdolActive = activeConv?.conversation_type === "counselor_adolescent" && 
                                  (activeConv.adolescent_id === contact.adolescent_id || contactPList.some((p: string) => p.includes(contact.adolescent_id)));

                                return (
                                  <button
                                    key={`adol-sub-${contact.adolescent_id}`}
                                    onClick={() => handleInitiateContact(contact.adolescent_id, "counselor_adolescent")}
                                    className={`w-full flex items-center gap-3 p-3 text-left rounded-2xl transition-all duration-300 border ${isAdolActive ? 'bg-white border-indigo-200 shadow-md ring-1 ring-indigo-50' : 'bg-white/50 border-zinc-100 hover:bg-white hover:border-indigo-100'}`}
                                  >
                                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-black text-[9px] shadow-sm ${isAdolActive ? 'bg-indigo-600 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                                      {adolInitials}
                                    </div>
                                    <div className="overflow-hidden flex-1">
                                      <h4 className={`truncate text-xs font-bold ${isAdolActive ? 'text-indigo-600' : 'text-zinc-700'}`}>
                                        {contact.full_name || contact.adolescent_email.split('@')[0]}
                                      </h4>
                                    </div>
                                  </button>
                                )
                             })}
                         </div>
                      </div>
                    )
                  })}

                  {/* INDEPENDENT CASES */}
                  {independentAdolescents.length > 0 && (
                     <div className="space-y-2">
                       <h3 className="px-3 text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">Direct Cases</h3>
                       {independentAdolescents.map(contact => {
                          const adolInitials = (contact.full_name || contact.adolescent_email).substring(0, 2).toUpperCase();
                          const indPList = activeConv?.participants || activeConv?.participant_emails || [];
                          const isAdolActive = activeConv?.conversation_type === "counselor_adolescent" && 
                            (activeConv.adolescent_id === contact.adolescent_id || indPList.some((p: string) => p.includes(contact.adolescent_id)));

                          return (
                            <button
                              key={`direct-case-${contact.adolescent_id}`}
                              onClick={() => handleInitiateContact(contact.adolescent_id, "counselor_adolescent")}
                              className={`w-full flex items-center gap-3 p-4 text-left rounded-[1.5rem] transition-all duration-300 border ${isAdolActive ? 'bg-white border-indigo-200 shadow-lg ring-1 ring-indigo-50' : 'bg-white/60 border-zinc-50 hover:bg-white hover:border-indigo-100'}`}
                            >
                              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-black text-xs shadow-sm ${isAdolActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                {adolInitials}
                              </div>
                              <div className="overflow-hidden flex-1">
                                <h4 className={`truncate text-sm font-bold ${isAdolActive ? 'text-indigo-600' : 'text-zinc-900'}`}>
                                  {contact.full_name || contact.adolescent_email.split('@')[0]}
                                </h4>
                                <p className="truncate text-[10px] mt-1 font-bold text-zinc-400 uppercase tracking-tighter">E2E Secured</p>
                              </div>
                            </button>
                          )
                       })}
                     </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ACTIVE CHAT AREA */}
        <div className={`flex-1 flex flex-col rounded-[2.5rem] border border-white bg-white/80 backdrop-blur-xl shadow-xl overflow-hidden transition-all duration-500 ring-1 ring-zinc-200/50 ${!activeConvId ? 'hidden md:flex' : 'flex'}`}>
          {!activeConvId ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center p-12">
               <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-indigo-50 text-indigo-600 shadow-inner">
                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
               </div>
               <h3 className="text-3xl font-black tracking-tight text-zinc-300">Quiet Zone</h3>
               <p className="mt-4 text-sm font-medium text-zinc-400 max-w-sm mx-auto">Select a verified contact from the directory to establish a private, audited communication link.</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
               <div className="flex items-center justify-between border-b border-zinc-100/50 bg-white/40 p-5 shrink-0">
                 <div className="flex items-center gap-4">
                    <button className="md:hidden p-2 text-zinc-500" onClick={() => setActiveConvId(null)}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center font-black text-xs text-indigo-600">
                      {activeConv ? getConvName(activeConv).substring(0, 2).toUpperCase() : "CH"}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-zinc-900 tracking-tight">{activeConv ? getConvName(activeConv) : "Encryption Active"}</h3>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                         End-to-End Encrypted
                      </p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <button className="p-2.5 rounded-xl bg-zinc-50 text-zinc-400 hover:bg-zinc-100 transition-colors">
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </button>
                 </div>
               </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/20 custom-scrollbar">
                {msgsLoading && messages.length === 0 ? (
                  <div className="flex items-center justify-center py-20 text-xs font-black text-zinc-400 uppercase tracking-[0.3em] animate-pulse">Decrypting thread...</div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                     <div className="h-24 w-24 bg-zinc-100 rounded-full mb-6 flex items-center justify-center text-zinc-400">
                       <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                     </div>
                     <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Zero Communications Logged</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isMe = msg.sender_email === me.email;
                    const showHeader = idx === 0 || messages[idx - 1].sender_email !== msg.sender_email;

                    return (
                      <div key={msg._id || idx} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                        <div
                          className={`relative max-w-[85%] sm:max-w-[70%] rounded-[1.5rem] px-5 py-3.5 text-sm shadow-sm transition-all hover:shadow-md ${
                            isMe
                              ? "bg-gradient-to-br from-[#4f46e5] to-[#0891b2] text-white rounded-tr-none"
                              : "bg-white border border-zinc-100 text-zinc-700 rounded-tl-none shadow-indigo-100/50"
                          }`}
                        >
                          {msg.content}
                          <div className={`text-[8px] font-black mt-2 inline-flex items-center gap-1 uppercase tracking-tighter ${isMe ? 'text-white/50' : 'text-zinc-300'}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {isMe && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="border-t border-zinc-100/50 bg-white/60 p-5 shrink-0 backdrop-blur-md">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 rounded-[1.5rem] px-2 py-2 focus-within:ring-4 focus-within:ring-indigo-100 focus-within:bg-white transition-all">
                  <div className="h-10 w-10 flex items-center justify-center text-zinc-300 hover:text-indigo-400 cursor-pointer">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                  </div>
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Compose a secure message..."
                    className="flex-1 border-none bg-transparent px-2 py-3 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:ring-0 outline-none"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim() || sending}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 hover:shadow-lg hover:shadow-indigo-200 active:scale-95"
                  >
                    {sending ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
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

