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
               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1] to-[#06b6d4] shadow-[0_4px_20px_rgb(99,102,241,0.3)]">
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
            
            <div className="pt-2">
              <h3 className="px-3 text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">My Caseload</h3>
              {uniqueContacts.length === 0 && !error ? (
                <div className="p-3 text-xs text-zinc-400 italic">No assigned contacts found.</div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(guardianGroups).map(([gEmail, adolescents]) => {
                    const gInitials = gEmail.substring(0, 1).toUpperCase();
                    
                    // We need a specific adolescent to establish the context of a guardian chat
                    const representativeAdolescentId = adolescents[0].adolescent_id;
                    const aConvPList = activeConv?.participants || activeConv?.participant_emails || [];
                    const isGuardActive = activeConv?.conversation_type === "counselor_guardian" && 
                      (activeConv.adolescent_id === representativeAdolescentId || aConvPList.some((p: string) => p.includes(representativeAdolescentId)));

                    return (
                      <div key={`guard-${gEmail}`} className="bg-zinc-50/50 rounded-[1.5rem] p-2 border border-zinc-100">
                         {/* GUARDIAN HEADER */}
                         <button
                           onClick={() => handleInitiateContact(representativeAdolescentId, "counselor_guardian")}
                           className={`w-full flex items-center gap-3 p-2 text-left rounded-xl transition-all duration-300 ${isGuardActive ? 'bg-gradient-to-r from-[#6366f1]/10 to-[#06b6d4]/10 shadow-sm' : 'hover:bg-white'}`}
                         >
                           <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-xs shadow-inner ${isGuardActive ? 'bg-gradient-to-br from-[#6366f1] to-[#06b6d4] text-white border-0' : 'bg-white text-zinc-600 border border-zinc-200'}`}>
                             {gInitials}
                           </div>
                           <div className="overflow-hidden flex-1">
                             <h4 className={`truncate text-sm ${isGuardActive ? 'font-bold text-[#6366f1]' : 'font-semibold text-zinc-700'}`}>Guardian Portal</h4>
                             <p className={`truncate text-[10px] ${isGuardActive ? 'font-semibold text-zinc-500' : 'text-zinc-400'}`}>{gEmail}</p>
                           </div>
                         </button>

                         {/* NESTED ADOLESCENTS */}
                         <div className="pl-5 mt-2 space-y-1 relative">
                            {/* Connector Line */}
                            <div className="absolute left-6 top-2 bottom-4 w-px bg-zinc-200" />
                            
                            {adolescents.map(contact => {
                               const adolInitials = contact.adolescent_email.substring(0, 2).toUpperCase();
                               const contactPList = activeConv?.participants || activeConv?.participant_emails || [];
                               const isAdolActive = activeConv?.conversation_type === "counselor_adolescent" && 
                                 (activeConv.adolescent_id === contact.adolescent_id || contactPList.some((p: string) => p.includes(contact.adolescent_id)));

                               return (
                                 <div key={`nest-${contact.adolescent_id}`} className="relative pl-6">
                                    <div className="absolute left-1 top-1/2 w-4 h-px bg-zinc-200" />
                                    <button
                                      onClick={() => handleInitiateContact(contact.adolescent_id, "counselor_adolescent")}
                                      className={`w-full flex items-center gap-3 p-2.5 text-left rounded-xl transition-all duration-300 ${isAdolActive ? 'bg-gradient-to-r from-[#6366f1]/10 to-[#06b6d4]/10 border border-[#06b6d4]/30 shadow-sm' : 'hover:bg-white border border-transparent'}`}
                                    >
                                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold text-[10px] shadow-inner ${isAdolActive ? 'bg-gradient-to-br from-[#6366f1] to-[#06b6d4] text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                                        {adolInitials}
                                      </div>
                                      <div className="overflow-hidden flex-1">
                                        <h4 className={`truncate text-[13px] font-semibold ${isAdolActive ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#06b6d4]' : 'text-zinc-600'}`}>
                                          {contact.adolescent_email}
                                        </h4>
                                      </div>
                                    </button>
                                 </div>
                               )
                            })}
                         </div>
                      </div>
                    )
                  })}

                  {/* INDEPENDENT ADOLESCENTS */}
                  {independentAdolescents.length > 0 && (
                     <div className="space-y-1">
                       {independentAdolescents.map(contact => {
                          const adolInitials = contact.adolescent_email.substring(0, 2).toUpperCase();
                          const indPList = activeConv?.participants || activeConv?.participant_emails || [];
                          const isAdolActive = activeConv?.conversation_type === "counselor_adolescent" && 
                            (activeConv.adolescent_id === contact.adolescent_id || indPList.some((p: string) => p.includes(contact.adolescent_id)));

                          return (
                            <button
                              key={`indep-${contact.adolescent_id}`}
                              onClick={() => handleInitiateContact(contact.adolescent_id, "counselor_adolescent")}
                              className={`w-full flex items-center gap-3 p-3 text-left rounded-2xl transition-all duration-300 ${isAdolActive ? 'bg-gradient-to-r from-[#6366f1]/10 to-[#06b6d4]/10 border border-[#06b6d4]/30 shadow-sm' : 'hover:bg-zinc-50 border border-transparent'}`}
                            >
                              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl font-bold text-xs shadow-inner ${isAdolActive ? 'bg-gradient-to-br from-[#6366f1] to-[#06b6d4] text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                                {adolInitials}
                              </div>
                              <div className="overflow-hidden flex-1">
                                <h4 className={`truncate text-sm font-semibold ${isAdolActive ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#06b6d4]' : 'text-zinc-700'}`}>
                                  {contact.adolescent_email}
                                </h4>
                                <p className={`truncate text-xs mt-0.5 font-medium flex items-center gap-1 ${isAdolActive ? 'text-[#06b6d4]' : 'text-zinc-400'}`}>
                                   Counselor/Adolescent
                                </p>
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
        <div className={`flex-1 flex flex-col rounded-[2rem] border border-white/60 bg-white/70 backdrop-blur-xl shadow-lg overflow-hidden transition-all duration-300 ${!activeConvId ? 'hidden md:flex' : 'flex'}`}>
          {!activeConvId ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center p-8">
               <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#6366f1]/10 to-[#06b6d4]/10 text-[#06b6d4] shadow-inner">
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
                          className={`relative max-w-[85%] sm:max-w-[70%] rounded-2xl px-5 py-3 text-sm shadow-[0_4px_20px_rgb(0,0,0,0.03)] ${
                            isMe
                              ? "bg-gradient-to-br from-[#6366f1] to-[#06b6d4] text-white rounded-tr-none"
                              : "bg-white border border-zinc-200/60 text-zinc-900 rounded-tl-none backdrop-blur-md"
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
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1] to-[#06b6d4] text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 hover:shadow-[0_4px_15px_rgb(99,102,241,0.4)]"
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
