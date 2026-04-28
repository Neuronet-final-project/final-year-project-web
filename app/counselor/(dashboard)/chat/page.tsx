"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { AlertCircle } from "lucide-react";
import VoiceRecorder from "../../../../components/chat/VoiceRecorder";
import MediaPreview from "../../../../components/chat/MediaPreview";
import MessageBubble from "../../../../components/chat/MessageBubble";
import CallModal from "../../../../components/chat/CallModal";

type AuthMeResponse = { authenticated: false } | { authenticated: true; email: string; role: string; _id: string };
type Conversation = {
  _id?: string; id?: string; conversation_id?: string;
  conversation_type: "counselor_adolescent" | "counselor_guardian" | "adolescent_guardian" | "channel";
  adolescent_id?: string; guardian_email?: string; counselor_email?: string;
  participant_emails?: string[]; participants?: string[]; created_at: string;
};
type AssignedAdolescent = { adolescent_id: string; adolescent_email: string; full_name?: string; guardian_email?: string; guardian_id?: string; matched_at: string; status: string };
type Message = { _id?: string; message_id?: string; conversation_id: string; sender_email: string; sender_role: string; content: string; message_type?: string; attachment_url?: string | null; created_at: string; is_edited?: boolean; };
type IncomingCall = { call_id: string; conversation_id: string; call_type: string; caller_email: string; caller_name?: string; callee_email: string; callee_name?: string; status: string };

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
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [showRecorder, setShowRecorder] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [callState, setCallState] = useState<{ callId: string; callType: "voice" | "video"; peerEmail: string; peerName: string; isIncoming: boolean } | null>(null);
  const callStateRef = useRef(callState);
  // Keep ref in sync with state so the polling closure always has the latest value
  useEffect(() => { callStateRef.current = callState; }, [callState]);
  const [searchFilter, setSearchFilter] = useState("");
  const [historyLimit, setHistoryLimit] = useState(15);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const callPollRef = useRef<NodeJS.Timeout>(undefined);

  // ---- Auth & data loading ----
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const m = (await res.json()) as AuthMeResponse;
        setMe(m);
        if (!("authenticated" in m) || !m.authenticated) { router.replace("/login"); return; }
        if (m.role !== "counselor") { router.replace(m.role === "admin" ? "/admin/dashboard" : "/login"); return; }
        const [convsRes, assignRes] = await Promise.all([
          fetch("/api/proxy/backend/messaging/conversations"),
          fetch("/api/proxy/backend/counselor/assignments/me"),
        ]);
        if (convsRes.ok) setConversations((await convsRes.json()) || []);
        else setError("Failed to load conversations.");
        if (assignRes.ok) setAssignedContacts((await assignRes.json()) || []);
      } catch { setError("Network error while loading data."); } finally { setLoading(false); }
    })();
  }, [router]);

  // ---- Poll for incoming calls ----
  useEffect(() => {
    if (!me.authenticated) return;

    // Request notification permission proactively
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }

    callPollRef.current = setInterval(async () => {
      // Use the ref to avoid stale closure — always has the latest value
      if (callStateRef.current) return;
      try {
        const r = await fetch("/api/proxy/backend/messaging/calls/incoming");
        if (r.ok) {
          const data = await r.json();
          if (data.call && !callStateRef.current) {
            const c = data.call as IncomingCall;
            const newState = { 
              callId: c.call_id, 
              callType: c.call_type as "voice" | "video", 
              peerEmail: c.caller_email, 
              peerName: c.caller_name || c.caller_email, 
              isIncoming: true 
            };
            setCallState(newState);
            callStateRef.current = newState;

            // In-app toast
            toast(`📞 Incoming ${c.call_type} call from ${c.caller_name || c.caller_email}`, { duration: 5000, icon: "🔔" });

            // Browser notification for background tabs
            if (typeof Notification !== "undefined" && Notification.permission === "granted") {
              try {
                new Notification("Incoming Call", {
                  body: `${c.caller_name || c.caller_email} is calling you (${c.call_type})`,
                  icon: "/Images/logo.png",
                  tag: "incoming-call",
                  requireInteraction: true,
                });
              } catch {}
            }
          } else if (!data.call && callStateRef.current?.isIncoming) {
             // BUG FIX: Clear ghost call state if backend reports no ringing call
             setCallState(null);
             callStateRef.current = null;
          }
        }
      } catch {}
    }, 2000);
    return () => clearInterval(callPollRef.current);
  }, [me]); // Only depend on `me` — use callStateRef to avoid stale closure

  const dmsOnly = conversations.filter(c => c.conversation_type !== "channel");
  const getConvId = (c: Conversation) => c.conversation_id || c._id || c.id;
  const activeConv = dmsOnly.find(c => getConvId(c) === activeConvId);

  // ---- Load messages ----
  useEffect(() => {
    if (!activeConvId) return;
    let mounted = true;
    async function fetchMsgs() {
      // Don't fetch if we're currently sending a message to avoid race conditions
      if (sending) return;
      
      setMsgsLoading(true);
      try {
        const res = await fetch(`/api/proxy/backend/messaging/conversations/${activeConvId}/messages`);
        if (res.ok && mounted) {
          const data = await res.json();
          const sortedMessages = (data || []).sort((a: Message, b: Message) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          
          // Only update if the message count changed or content is different
          setMessages(prev => {
            if (prev.length !== sortedMessages.length) return sortedMessages;
            // Check if last message is different
            const lastPrev = prev[prev.length - 1];
            const lastNew = sortedMessages[sortedMessages.length - 1];
            if (lastPrev?.message_id !== lastNew?.message_id && lastPrev?._id !== lastNew?._id) {
              return sortedMessages;
            }
            return prev;
          });
        }
      } finally { if (mounted) setMsgsLoading(false); }
    }
    fetchMsgs();
    const conv = dmsOnly.find(c => getConvId(c) === activeConvId);
    if (conv?.conversation_type === "counselor_adolescent" && conv.adolescent_id) {
      fetch(`/api/proxy/backend/alerts/adolescent/${conv.adolescent_id}/summary`).then(r => r.ok ? r.json() : null).then(d => setAiSummary(d?.summary || null)).catch(() => setAiSummary(null));
    } else { setAiSummary(null); }
    const iv = setInterval(fetchMsgs, 5000);
    return () => { mounted = false; clearInterval(iv); };
  }, [activeConvId, sending]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // ---- Send text message ----
  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim() || !activeConvId) return;
    setSending(true);
    const messageToSend = replyText.trim();
    setReplyText(""); // Clear input immediately for better UX
    
    try {
      const res = await fetch(`/api/proxy/backend/messaging/conversations/${activeConvId}/messages`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: messageToSend, message_type: "text" }),
      });
      
      if (res.ok) { 
        const newMsg = await res.json(); 
        setMessages(prev => [...prev, newMsg]);
        console.log('[Chat] Message sent successfully:', newMsg);
      } else {
        const error = await res.text();
        console.error('[Chat] Failed to send message:', error);
        toast.error("Failed to send message");
        setReplyText(messageToSend); // Restore message on error
      }
    } catch (error) {
      console.error('[Chat] Network error sending message:', error);
      toast.error("Network error");
      setReplyText(messageToSend); // Restore message on error
    } finally { 
      setSending(false); 
    }
  }

  // ---- Edit message ----
  async function handleEditMessage(messageId: string, newContent: string) {
    if (!activeConvId) return;
    try {
      const res = await fetch(`/api/proxy/backend/messaging/conversations/${activeConvId}/messages/${messageId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent }),
      });
      if (res.ok) {
        setMessages(prev => prev.map(m => m._id === messageId || m.message_id === messageId ? { ...m, content: newContent, is_edited: true } : m));
        toast.success("Message updated");
      } else toast.error("Failed to edit message");
    } catch { toast.error("Network error"); }
  }

  // ---- Delete message ----
  async function handleDeleteMessage(messageId: string) {
    if (!activeConvId) return;
    if (!confirm("Delete this message?")) return;
    try {
      const res = await fetch(`/api/proxy/backend/messaging/conversations/${activeConvId}/messages/${messageId}`, {
        method: "DELETE",
      });
      if (res.ok || res.status === 204) {
        setMessages(prev => prev.filter(m => m._id !== messageId && m.message_id !== messageId));
        toast.success("Message deleted");
      } else toast.error("Failed to delete message");
    } catch { toast.error("Network error"); }
  }

  // ---- Upload & send media ----
  async function uploadAndSend(file: File | Blob, msgType: string) {
    if (!activeConvId) return;
    setSending(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const upRes = await fetch("/api/proxy/backend/messaging/upload", { method: "POST", body: fd });
      if (!upRes.ok) { toast.error("Upload failed"); return; }
      const { url } = await upRes.json();
      const msgRes = await fetch(`/api/proxy/backend/messaging/conversations/${activeConvId}/messages`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "", message_type: msgType, attachment_url: url }),
      });
      if (msgRes.ok) { const newMsg = await msgRes.json(); setMessages(prev => [...prev, newMsg]); }
    } finally { setSending(false); setPreviewFile(null); }
  }

  // ---- Initiate contact ----
  async function handleInitiateContact(adolescentId: string, type: "counselor_adolescent" | "counselor_guardian") {
    // 1. First Check Alert Status (Clinical workflow requirement)
    try {
      const alertRes = await fetch(`/api/proxy/backend/alerts/adolescent/${adolescentId}/summary`);
      if (alertRes.ok) {
        const alertData = await alertRes.json();
        // If stable (no critical risk detected), show guidance message
        if (!alertData.summary.toLowerCase().includes("critical") && !alertData.summary.toLowerCase().includes("active alert")) {
          toast((t) => (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-zinc-100">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold text-sm">Clinical Stability Guidance</span>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                {alertData.summary}
                <br /><br />
                Since this adolescent is currently stable, initiating a chat thread may not be clinically necessary at this moment.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                  }}
                  className="px-3 py-1 text-xs font-medium bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    proceedWithInitiation(adolescentId, type);
                  }}
                  className="px-3 py-1 text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow-lg transition-colors"
                >
                  Initiate Anyway
                </button>
              </div>
            </div>
          ), { duration: 6000, position: "top-center" });
          return;
        }
      }
    } catch (e) {
      console.warn("Could not fetch alert summary for pre-check", e);
    }

    // Default: proceed immediately if alerts found or fetch failed
    proceedWithInitiation(adolescentId, type);
  }

  async function proceedWithInitiation(adolescentId: string, type: "counselor_adolescent" | "counselor_guardian") {
    // 2. Check for existing conversation
    const existing = conversations.find(c => {
      const pList = c.participants || c.participant_emails || [];
      const matchesType = c.conversation_type === type;
      const matchesAdol = c.adolescent_id === adolescentId || pList.some(e => e.includes(adolescentId));
      return matchesType && matchesAdol;
    });

    if (existing) { 
      setActiveConvId(existing.conversation_id || existing._id || existing.id || null); 
      window.dispatchEvent(new CustomEvent('close-counselor-sidebar'));
      return; 
    }

    const toastId = toast.loading("Establishing clinical thread...");

    // 3. Initiate new conversation
    try {
      const res = await fetch("/api/proxy/backend/messaging/conversations", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_type: type, adolescent_id: adolescentId }),
      });

      if (res.ok) { 
        const nc = await res.json(); 
        setConversations(prev => [...prev, nc]); 
        setActiveConvId(nc.conversation_id || nc._id || nc.id); 
        window.dispatchEvent(new CustomEvent('close-counselor-sidebar'));
        toast.success("Thread established successfully", { id: toastId });
      } else {
        const err = await res.json();
        toast.error(`Communication Error: ${err.detail || "Account profile not found"}`, { id: toastId });
      }
    } catch { 
      toast.error("Network Error: Could not reach the clinical gateway.", { id: toastId });
    }
  }


  // ---- Initiate call ----
  async function startCall(type: "voice" | "video") {
    if (!activeConvId || !activeConv) return;
    const pList = activeConv.participants || activeConv.participant_emails || [];
    const peer = pList.find(e => me.authenticated && e !== me.email) || "";
    try {
      const res = await fetch("/api/proxy/backend/messaging/calls/initiate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation_id: activeConvId, call_type: type }),
      });
      if (res.ok) { 
        const d = await res.json(); 
        const peerName = getConvName(activeConv);
        setCallState({ callId: d.call_id, callType: type, peerEmail: peer, peerName: peerName, isIncoming: false }); 
      }
      else toast.error("Failed to start call");
    } catch { toast.error("Network error"); }
  }

  function getConvName(conv: Conversation) {
    if (!me.authenticated) return "Unknown";
    const pList = conv.participants || conv.participant_emails || [];
    const others = pList.filter(e => e !== me.email);
    const otherEmail = others[0] || "";
    
    // Try to find full name from assigned contacts
    const contact = assignedContacts.find(c => c.adolescent_email === otherEmail || c.guardian_email === otherEmail);
    const displayName = contact?.full_name || otherEmail.split('@')[0] || "Unknown";

    if (conv.conversation_type === "counselor_guardian") return `Guardian: ${displayName}`;
    if (conv.conversation_type === "counselor_adolescent") return `Adolescent: ${displayName}`;
    return conv.conversation_type || "Conversation";
  }

  function dateSeparator(d: string) {
    const dt = new Date(d);
    const today = new Date();
    if (dt.toDateString() === today.toDateString()) return "Today";
    const y = new Date(today); y.setDate(y.getDate() - 1);
    if (dt.toDateString() === y.toDateString()) return "Yesterday";
    return dt.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  if (loading || !me.authenticated) return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading Secure Chat...</p>
    </div>
  </div>;

  const uniqueContacts = Array.from(new Map(assignedContacts.map(c => [c.adolescent_id, c])).values());
  const guardianGroups: Record<string, AssignedAdolescent[]> = {};
  const independentAdolescents: AssignedAdolescent[] = [];
  uniqueContacts.forEach(contact => {
    if (contact.guardian_email) { if (!guardianGroups[contact.guardian_email]) guardianGroups[contact.guardian_email] = []; guardianGroups[contact.guardian_email].push(contact); }
    else independentAdolescents.push(contact);
  });

  const filteredGuardianGroups = Object.entries(guardianGroups).filter(([gEmail, adols]) =>
    !searchFilter || gEmail.toLowerCase().includes(searchFilter.toLowerCase()) || adols.some(a => (a.full_name || a.adolescent_email).toLowerCase().includes(searchFilter.toLowerCase()))
  );
  const filteredIndependent = independentAdolescents.filter(c =>
    !searchFilter || (c.full_name || c.adolescent_email).toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden animate-in fade-in duration-700">
      {/* CALL MODAL */}
      {callState && <CallModal callId={callState.callId} callType={callState.callType} peerEmail={callState.peerEmail} peerName={callState.peerName} isIncoming={callState.isIncoming} onEnd={(duration) => {
        setCallState(null);
        if (duration > 0 && activeConvId) {
          const typeStr = callState.callType === "video" ? "Video call" : "Voice call";
          const mm = String(Math.floor(duration / 60)).padStart(2, "0");
          const ss = String(duration % 60).padStart(2, "0");
          fetch(`/api/proxy/backend/messaging/conversations/${activeConvId}/messages`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: `📞 ${typeStr} ended (${mm}:${ss})`, message_type: "call_log" }),
          }).then(r => r.json()).then(newMsg => setMessages(prev => [...prev, newMsg])).catch(()=>{});
        }
      }} />}
      {/* LIGHTBOX */}
      {lightboxUrl && (
        <div className="fixed inset-0 z-[90] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 cursor-pointer" onClick={() => setLightboxUrl(null)}>
          <div className="absolute top-6 right-8 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-3 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </div>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxUrl} alt="full" className="max-h-[85vh] max-w-[90vw] rounded-[2rem] shadow-2xl object-contain ring-1 ring-white/10" />
            <p className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-widest uppercase font-bold text-center w-full">Click anywhere outside to close</p>
          </div>
        </div>
      )}
      <main className="relative z-10 flex flex-1 overflow-hidden p-4 md:p-6 gap-6">
        {/* SIDEBAR */}
        <div className={`w-full shrink-0 flex flex-col rounded-[2rem] border border-white bg-white/70 backdrop-blur-xl shadow-lg overflow-hidden transition-all duration-300 ring-1 ring-zinc-200/50 ${activeConvId ? "hidden md:flex md:w-80" : "flex max-w-2xl mx-auto"}`}>
          <div className="p-5 border-b border-zinc-100/50 bg-white/40">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-black tracking-widest text-zinc-400 uppercase">Contacts</h2>
              <div className="h-2 w-2 rounded-full bg-indigo-600 animate-ping" />
            </div>
            <input type="text" value={searchFilter} onChange={e => setSearchFilter(e.target.value)} placeholder="Search contacts..." className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-100 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white outline-none transition-all" />
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {error && <div className="p-3 text-xs font-bold text-rose-600 bg-rose-50 rounded-xl border border-rose-100">{error}</div>}
            {uniqueContacts.length === 0 && !error ? (
              <div className="p-6 text-center text-xs text-zinc-400 font-medium bg-zinc-50 rounded-[1.5rem] border border-dashed border-zinc-200">No assigned cases yet.</div>
            ) : (
              <div className="space-y-6">
                {filteredGuardianGroups.map(([gEmail, adolescents]) => {
                  const repId = adolescents[0].adolescent_id;
                  const aConvP = activeConv?.participants || activeConv?.participant_emails || [];
                  const isGA = activeConv?.conversation_type === "counselor_guardian" && (activeConv.adolescent_id === repId || aConvP.some((p: string) => p.includes(repId)));
                  return (
                    <div key={`gg-${gEmail}`} className="space-y-2">
                      <button onClick={() => handleInitiateContact(repId, "counselor_guardian")} className={`w-full flex items-center gap-3 p-3 text-left rounded-2xl transition-all duration-300 border ${isGA ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100" : "bg-white hover:bg-slate-50 border-zinc-100"}`}>
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black text-[10px] shadow-sm ${isGA ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-600"}`}>GRP</div>
                        <div className="overflow-hidden flex-1">
                          <h4 className="truncate text-xs font-black uppercase tracking-tight">Parent/Guardian</h4>
                          <p className={`truncate text-[10px] font-bold ${isGA ? "text-indigo-100/70" : "text-zinc-400"}`}>{gEmail}</p>
                        </div>
                      </button>
                      <div className="pl-4 space-y-2">
                        {adolescents.map(contact => {
                          const ini = (contact.full_name || contact.adolescent_email).substring(0, 2).toUpperCase();
                          const cp = activeConv?.participants || activeConv?.participant_emails || [];
                          const isAA = activeConv?.conversation_type === "counselor_adolescent" && (activeConv.adolescent_id === contact.adolescent_id || cp.some((p: string) => p.includes(contact.adolescent_id)));
                          return (
                            <button key={`as-${contact.adolescent_id}`} onClick={() => handleInitiateContact(contact.adolescent_id, "counselor_adolescent")} className={`w-full flex items-center gap-3 p-3 text-left rounded-2xl transition-all duration-300 border ${isAA ? "bg-white border-indigo-200 shadow-md ring-1 ring-indigo-50" : "bg-white/50 border-zinc-100 hover:bg-white hover:border-indigo-100"}`}>
                              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-black text-[9px] shadow-sm ${isAA ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-500"}`}>{ini}</div>
                              <div className="overflow-hidden flex-1"><h4 className={`truncate text-xs font-bold ${isAA ? "text-indigo-600" : "text-zinc-700"}`}>{contact.full_name || contact.adolescent_email.split("@")[0]}</h4></div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {filteredIndependent.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="px-3 text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">Direct Cases</h3>
                    {filteredIndependent.map(contact => {
                      const ini = (contact.full_name || contact.adolescent_email).substring(0, 2).toUpperCase();
                      const ip = activeConv?.participants || activeConv?.participant_emails || [];
                      const isAA = activeConv?.conversation_type === "counselor_adolescent" && (activeConv.adolescent_id === contact.adolescent_id || ip.some((p: string) => p.includes(contact.adolescent_id)));
                      return (
                        <button key={`dc-${contact.adolescent_id}`} onClick={() => handleInitiateContact(contact.adolescent_id, "counselor_adolescent")} className={`w-full flex items-center gap-3 p-4 text-left rounded-[1.5rem] transition-all duration-300 border ${isAA ? "bg-white border-indigo-200 shadow-lg ring-1 ring-indigo-50" : "bg-white/60 border-zinc-50 hover:bg-white hover:border-indigo-100"}`}>
                          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-black text-xs shadow-sm ${isAA ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>{ini}</div>
                          <div className="overflow-hidden flex-1">
                            <h4 className={`truncate text-sm font-bold ${isAA ? "text-indigo-600" : "text-zinc-900"}`}>{contact.full_name || contact.adolescent_email.split("@")[0]}</h4>
                            <p className="truncate text-[10px] mt-1 font-bold text-zinc-400 uppercase tracking-tighter">E2E Secured</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* CHAT AREA */}
        <div className={`flex-1 flex flex-col rounded-[2.5rem] border border-white bg-white/90 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-500 ring-1 ring-slate-200/60 ${!activeConvId ? "hidden" : "flex"}`}>
          {!activeConvId ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center p-12 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="relative mb-8 flex h-28 w-28 items-center justify-center rounded-[2.5rem] bg-white text-indigo-600 shadow-xl shadow-indigo-100 ring-1 ring-indigo-50 animate-in zoom-in duration-700">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
              </div>
              <h3 className="relative text-3xl font-black tracking-tight text-slate-800">Quiet Zone</h3>
              <p className="relative mt-5 text-sm font-medium text-slate-500 max-w-md mx-auto leading-relaxed">Select a verified contact from the directory to establish a private, end-to-end encrypted communication link.</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-zinc-100/50 bg-gradient-to-r from-white/60 via-indigo-50/30 to-white/60 p-5 shrink-0 backdrop-blur-md">
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
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />End-to-End Encrypted
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => startCall("voice")} className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors" title="Voice Call">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </button>
                  <button onClick={() => startCall("video")} className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors" title="Video Call">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="4" width="14" height="14" rx="2"/></svg>
                  </button>
                </div>
              </div>

              {/* AI Summary */}
              {aiSummary && (
                <div className="mx-6 mt-6 p-4 bg-gradient-to-r from-indigo-50 to-emerald-50 border border-indigo-100 rounded-2xl flex items-start gap-4 shadow-sm animate-in slide-in-from-top duration-500">
                  <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-1">Clinical AI Insight</h5>
                    <p className="text-xs font-semibold text-zinc-700 leading-relaxed">{aiSummary}</p>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="relative flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/40">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
                <div className="relative z-10 space-y-4">

                {msgsLoading && messages.length === 0 ? (
                  <div className="flex items-center justify-center py-20 text-xs font-black text-zinc-400 uppercase tracking-[0.3em] animate-pulse">Decrypting thread...</div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                    <div className="h-24 w-24 bg-zinc-100 rounded-full mb-6 flex items-center justify-center text-zinc-400">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Start the conversation</p>
                  </div>
                ) : (
                  <>
                    {messages.length > historyLimit && (
                      <div className="flex justify-center mb-6">
                        <button onClick={() => setHistoryLimit(prev => prev + 20)} className="px-5 py-2 text-xs font-bold text-indigo-600 bg-indigo-50/80 hover:bg-indigo-100 rounded-full transition-colors border border-indigo-100">
                          Load Older Messages
                        </button>
                      </div>
                    )}
                    {messages.slice(-historyLimit).map((msg, idx, arr) => {
                      const showDate = idx === 0 || dateSeparator(msg.created_at) !== dateSeparator(arr[idx - 1].created_at);
                      // Use idx in the key to guarantee uniqueness globally, even if a race condition duplicates an ID momentarily
                      const uniqueKey = `${msg._id || msg.message_id || 'msg'}_${idx}`;
                      return (
                        <div key={uniqueKey}>
                          {showDate && <div className="flex items-center gap-3 my-4"><div className="flex-1 h-px bg-zinc-200/60" /><span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{dateSeparator(msg.created_at)}</span><div className="flex-1 h-px bg-zinc-200/60" /></div>}
                          <MessageBubble 
                            msg={msg} 
                            isMe={me.authenticated && msg.sender_email === me.email} 
                            onImageClick={setLightboxUrl} 
                            onEdit={handleEditMessage}
                            onDelete={handleDeleteMessage}
                          />
                        </div>
                      );
                    })}
                  </>
                )}
                </div>
                <div ref={messagesEndRef} className="relative z-10" />
              </div>

              {/* Media Preview overlay */}
              {previewFile && <MediaPreview file={previewFile} onCancel={() => setPreviewFile(null)} sending={sending} onSend={() => uploadAndSend(previewFile, previewFile.type.startsWith("video/") ? "video" : "image")} />}

              {/* Input Area */}
              <div className="border-t border-zinc-100/50 bg-white/60 p-5 shrink-0 backdrop-blur-md">
                {showRecorder ? (
                  <VoiceRecorder onRecorded={blob => { setShowRecorder(false); uploadAndSend(blob, "audio"); }} onCancel={() => setShowRecorder(false)} />
                ) : (
                  <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-zinc-50 border border-zinc-100 rounded-[1.5rem] px-2 py-2 focus-within:ring-4 focus-within:ring-indigo-100 focus-within:bg-white transition-all">
                    <div className="relative">
                      <button type="button" onClick={() => setShowAttachMenu(!showAttachMenu)} className="h-10 w-10 flex items-center justify-center text-zinc-400 hover:text-indigo-500 transition-colors rounded-xl hover:bg-indigo-50">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v8m-4-4h8"/></svg>
                      </button>
                      {showAttachMenu && (
                        <div className="absolute bottom-12 left-0 bg-white rounded-2xl shadow-xl border border-zinc-100 py-2 w-44 z-30 animate-in slide-in-from-bottom-2 duration-200">
                          <button type="button" onClick={() => { setShowAttachMenu(false); fileInputRef.current?.setAttribute("accept", "image/*"); fileInputRef.current?.click(); }} className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-indigo-50 flex items-center gap-3">
                            <span className="text-base">📷</span> Photo
                          </button>
                          <button type="button" onClick={() => { setShowAttachMenu(false); fileInputRef.current?.setAttribute("accept", "video/*"); fileInputRef.current?.click(); }} className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-indigo-50 flex items-center gap-3">
                            <span className="text-base">🎥</span> Video
                          </button>
                          <button type="button" onClick={() => { setShowAttachMenu(false); setShowRecorder(true); }} className="w-full px-4 py-2.5 text-left text-xs font-bold text-zinc-700 hover:bg-indigo-50 flex items-center gap-3">
                            <span className="text-base">🎤</span> Voice Note
                          </button>
                        </div>
                      )}
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setPreviewFile(f); e.target.value = ""; }} />
                    <input type="text" value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Compose a secure message..." className="flex-1 border-none bg-transparent px-2 py-3 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:ring-0 outline-none" disabled={sending} />
                    <button type="button" onClick={() => setShowRecorder(true)} className="h-10 w-10 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                    </button>
                    <button type="submit" disabled={!replyText.trim() || sending} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 hover:shadow-lg hover:shadow-indigo-200 active:scale-95">
                      {sending ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>}
                    </button>
                  </form>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
