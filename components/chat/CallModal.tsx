"use client";
import { useState, useRef, useEffect, useCallback } from "react";

type Props = {
  callId: string; callType: "voice" | "video"; peerEmail: string; peerName: string;
  isIncoming: boolean; onEnd: () => void;
};

const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

/* ── Programmatic Ringtone via Web Audio API ── */
function createRingtone(): { start: () => void; stop: () => void } {
  let ctx: AudioContext | null = null;
  let intervalId: NodeJS.Timeout | undefined;
  let isPlaying = false;

  function playBurst() {
    if (!ctx || ctx.state === "closed") return;
    const now = ctx.currentTime;

    // Two-tone ring burst (classic phone ring feel)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc1.type = "sine";
    osc1.frequency.value = 440;
    osc2.type = "sine";
    osc2.frequency.value = 480;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gain.gain.setValueAtTime(0.3, now + 0.4);
    gain.gain.linearRampToValueAtTime(0, now + 0.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);

    // Second burst after a short gap
    const osc3 = ctx.createOscillator();
    const osc4 = ctx.createOscillator();
    const gain2 = ctx.createGain();

    osc3.type = "sine";
    osc3.frequency.value = 440;
    osc4.type = "sine";
    osc4.frequency.value = 480;

    gain2.gain.setValueAtTime(0, now + 0.6);
    gain2.gain.linearRampToValueAtTime(0.3, now + 0.65);
    gain2.gain.setValueAtTime(0.3, now + 1.0);
    gain2.gain.linearRampToValueAtTime(0, now + 1.1);

    osc3.connect(gain2);
    osc4.connect(gain2);
    gain2.connect(ctx.destination);

    osc3.start(now + 0.6);
    osc4.start(now + 0.6);
    osc3.stop(now + 1.1);
    osc4.stop(now + 1.1);
  }

  return {
    start() {
      if (isPlaying) return;
      isPlaying = true;
      try {
        ctx = new AudioContext();
        playBurst();
        intervalId = setInterval(playBurst, 3000);
      } catch (e) {
        console.warn("Could not start ringtone:", e);
      }
    },
    stop() {
      isPlaying = false;
      clearInterval(intervalId);
      if (ctx && ctx.state !== "closed") {
        ctx.close().catch(() => {});
      }
      ctx = null;
    },
  };
}

export default function CallModal({ callId, callType, peerEmail, peerName, isIncoming, onEnd }: Props) {
  const [status, setStatus] = useState<"calling" | "ringing" | "connecting" | "connected" | "ended">(isIncoming ? "ringing" : "calling");
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const pc = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const pollRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const ringtoneRef = useRef<ReturnType<typeof createRingtone> | null>(null);
  const mountedRef = useRef(true);
  const iceQueueRef = useRef<RTCIceCandidateInit[]>([]);
  const pendingOfferRef = useRef<any>(null);
  const startedRef = useRef(false);
  const iceServersRef = useRef<RTCIceServer[]>(DEFAULT_ICE_SERVERS);

  const api = useCallback(async (path: string, method = "GET", body?: any) => {
    const opts: RequestInit = { method, headers: { "Content-Type": "application/json" } };
    if (body) opts.body = JSON.stringify(body);
    const r = await fetch(`/api/proxy/backend/messaging/calls${path}`, opts);
    return r.ok ? r.json() : null;
  }, []);

  const stopRingtone = useCallback(() => {
    ringtoneRef.current?.stop();
    ringtoneRef.current = null;
  }, []);

  const cleanup = useCallback(() => {
    mountedRef.current = false;
    clearInterval(pollRef.current); clearInterval(timerRef.current);
    pollRef.current = undefined;
    localStream.current?.getTracks().forEach(t => t.stop());
    pc.current?.close(); pc.current = null;
    stopRingtone();
    setStatus("ended");
  }, [stopRingtone]);

  const endCall = useCallback(() => {
    api(`/${callId}/end`, "POST").catch(() => {});
    cleanup(); 
  }, [callId, api, cleanup]);

  // ── Ringtone management ──
  useEffect(() => {
    if (isIncoming && status === "ringing") {
      const rt = createRingtone();
      ringtoneRef.current = rt;
      rt.start();
      return () => { rt.stop(); ringtoneRef.current = null; };
    } else {
      stopRingtone();
    }
  }, [isIncoming, status, stopRingtone]);

  async function setupMedia() {
    const constraints = callType === "video" ? { audio: true, video: true } : { audio: true };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStream.current = stream;
      if (localVideo.current) localVideo.current.srcObject = stream;
      return stream;
    } catch (e) { 
      console.error("Media access denied:", e);
      cleanup(); 
      return null; 
    }
  }

  async function fetchIceConfig() {
    try {
      const r = await fetch(`/api/proxy/backend/messaging/calls/ice-config`);
      if (r.ok) {
        const data = await r.json();
        if (data.ice_servers && data.ice_servers.length > 0) {
          iceServersRef.current = data.ice_servers;
          console.log("[WebRTC] Fetched ICE config:", data.ice_servers.length, "servers",
            data.ice_servers.some((s: any) => String(s.urls).includes("turn")) ? "(includes TURN)" : "(STUN only)");
        }
      }
    } catch (e) {
      console.warn("[WebRTC] Could not fetch ICE config, using defaults", e);
    }
  }

  async function createPC(stream: MediaStream) {
    const p = new RTCPeerConnection({ iceServers: iceServersRef.current });
    pc.current = p;
    stream.getTracks().forEach(t => p.addTrack(t, stream));
    console.log("[WebRTC] PeerConnection created, tracks added:", stream.getTracks().map(t => t.kind));
    
    p.ontrack = e => { 
      console.log("[WebRTC] ontrack fired, streams:", e.streams.length);
      if (remoteVideo.current && e.streams[0]) remoteVideo.current.srcObject = e.streams[0]; 
    };
    
    p.onicecandidate = e => { 
      if (e.candidate) {
        console.log("[WebRTC] Sending ICE candidate:", e.candidate.candidate.substring(0, 50));
        api(`/${callId}/signal`, "POST", { 
          type: "ice-candidate", 
          data: { 
            candidate: e.candidate.candidate,
            sdpMid: e.candidate.sdpMid,
            sdpMLineIndex: e.candidate.sdpMLineIndex
          } 
        }); 
      }
    };
    
    p.oniceconnectionstatechange = () => {
      console.log("[WebRTC] ICE connection state:", p.iceConnectionState);
      if (p.iceConnectionState === "connected" || p.iceConnectionState === "completed") {
        setStatus("connected");
        api(`/${callId}/active`, "POST").catch(() => {});
        if (!timerRef.current) {
          timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
        }
      }
      if (["disconnected", "failed", "closed"].includes(p.iceConnectionState)) {
        console.warn("[WebRTC] ICE connection failed/closed:", p.iceConnectionState);
        endCall();
      }
    };
    
    p.onconnectionstatechange = () => {
      console.log("[WebRTC] Connection state:", p.connectionState);
      if (p.connectionState === "connected") {
        setStatus("connected");
        api(`/${callId}/active`, "POST").catch(() => {});
        if (!timerRef.current) {
          timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
        }
      }
      if (["disconnected", "failed", "closed"].includes(p.connectionState)) endCall();
    };
    
    p.onicegatheringstatechange = () => {
      console.log("[WebRTC] ICE gathering state:", p.iceGatheringState);
    };
    
    p.onsignalingstatechange = () => {
      console.log("[WebRTC] Signaling state:", p.signalingState);
    };
    
    return p;
  }

  async function startAsOffer() {
    setStatus("calling");
    await fetchIceConfig();
    const stream = await setupMedia();
    if (!stream) { setStatus("ended"); return; }
    const p = await createPC(stream);
    const offer = await p.createOffer();
    await p.setLocalDescription(offer);
    console.log("[WebRTC] Created and set local offer");
    const res = await api(`/${callId}/signal`, "POST", { 
      type: "offer", 
      data: { sdp: offer.sdp, type: offer.type } 
    });
    console.log("[WebRTC] Offer signal posted, result:", !!res);
    if (res) setStatus("ringing");
    startPolling();
  }

  async function answerCall() {
    stopRingtone();
    setStatus("connecting");
    await api(`/${callId}/answer`, "POST");
    await fetchIceConfig();
    const stream = await setupMedia();
    if (!stream) { setStatus("ended"); return; }
    const p = await createPC(stream);
    
    // Use the offer we already caught in polling if available
    const offerSig = pendingOfferRef.current;
    console.log("[WebRTC] answerCall — pendingOffer:", !!offerSig, "sdp exists:", !!offerSig?.data?.sdp);
    if (offerSig?.data?.sdp) {
      try {
        // Handle both string SDP (from mobile) and object SDP (from web)
        const sdpVal = offerSig.data.sdp;
        const sdpInit = typeof sdpVal === 'string' 
          ? { type: offerSig.data.type || 'offer', sdp: sdpVal } 
          : sdpVal;
        console.log("[WebRTC] Setting remote description (offer)", sdpInit.type);
        await p.setRemoteDescription(sdpInit);
        
        const answer = await p.createAnswer();
        await p.setLocalDescription(answer);
        console.log("[WebRTC] Created and set local answer");
        await api(`/${callId}/signal`, "POST", { 
          type: "answer", 
          data: { sdp: answer.sdp, type: answer.type } 
        });
        console.log("[WebRTC] Answer signal posted");

        // Flush queued ICE candidates
        console.log("[WebRTC] Flushing", iceQueueRef.current.length, "queued ICE candidates");
        while (iceQueueRef.current.length > 0) {
          const cand = iceQueueRef.current.shift();
          if (cand) {
            await p.addIceCandidate(cand).catch((e) => console.warn("[WebRTC] Failed to add queued ICE:", e));
          }
        }
      } catch (e) {
        console.error("[WebRTC] Failed handling offer in answerCall:", e);
      }
    } else {
      console.warn("[WebRTC] No offer available when answering! Will wait for polling to deliver it.");
    }
    // Polling is already running from mount, no need to start again
  }

  function startPolling() {
    // Don't start duplicate polling
    if (pollRef.current) return;
    pollRef.current = setInterval(async () => {
      if (!mountedRef.current) return;
      const data = await api(`/${callId}`);
      if (!data) return;
      if (data.status === "ended" || data.status === "rejected" || data.status === "missed") { 
        cleanup(); 
        return; 
      }

      const signals = data.signals || [];
      if (signals.length > 0) {
        console.log("[WebRTC] Poll received", signals.length, "signals:", signals.map((s: any) => s.type));
      }

      for (const sig of signals) {
        if (sig.type === "offer") {
          pendingOfferRef.current = sig;
          console.log("[WebRTC] Stored pending offer from poll");
          if (pc.current && !pc.current.remoteDescription && sig.data?.sdp) {
            try {
              const sdpVal = sig.data.sdp;
              const sdpInit = typeof sdpVal === 'string' 
                ? { type: sig.data.type || 'offer', sdp: sdpVal } 
                : sdpVal;
              console.log("[WebRTC] Setting remote description (offer) from poll");
              await pc.current.setRemoteDescription(sdpInit);
              const answer = await pc.current.createAnswer();
              await pc.current.setLocalDescription(answer);
              await api(`/${callId}/signal`, "POST", { 
                type: "answer", 
                data: { sdp: answer.sdp, type: answer.type } 
              });
              console.log("[WebRTC] Answer sent from poll handler");
              
              // Flush queued ICE candidates
              console.log("[WebRTC] Flushing", iceQueueRef.current.length, "queued ICE candidates");
              while (iceQueueRef.current.length > 0) {
                const cand = iceQueueRef.current.shift();
                if (cand) {
                  await pc.current.addIceCandidate(cand).catch((e) => console.warn("[WebRTC] queued ICE fail:", e));
                }
              }
            } catch (e) {
              console.error("[WebRTC] Failed to process offer from poll:", e);
            }
          }
        } else if (sig.type === "answer" && sig.data?.sdp && pc.current && !pc.current.remoteDescription) {
          try {
            const sdpVal = sig.data.sdp;
            const sdpInit = typeof sdpVal === 'string' 
              ? { type: sig.data.type || 'answer', sdp: sdpVal } 
              : sdpVal;
            console.log("[WebRTC] Setting remote description (answer) from poll");
            await pc.current.setRemoteDescription(sdpInit);
            setStatus("connecting");
            // Flush queued ICE candidates
            console.log("[WebRTC] Flushing", iceQueueRef.current.length, "queued ICE candidates");
            while (iceQueueRef.current.length > 0) {
              const cand = iceQueueRef.current.shift();
              if (cand) {
                await pc.current.addIceCandidate(cand).catch((e) => console.warn("[WebRTC] queued ICE fail:", e));
              }
            }
          } catch (e) {
            console.error("[WebRTC] Failed to set remote description (answer):", e);
          }
        } else if (sig.type === "ice-candidate" && sig.data?.candidate) {
          const candInit = typeof sig.data.candidate === 'string' ? sig.data : sig.data.candidate;
          if (!pc.current || !pc.current.remoteDescription) {
            // Queue candidates that arrive before remote description is set
            iceQueueRef.current.push(candInit);
          } else {
            try { 
              await pc.current.addIceCandidate(candInit); 
            } catch (e) {
              console.warn("[WebRTC] Could not add ICE candidate:", e);
            }
          }
        }
      }
    }, 1000);
  }

  // ── On mount: start offer for outgoing OR start polling for incoming ──
  useEffect(() => {
    // Guard against React StrictMode double-mount creating duplicate PeerConnections
    if (startedRef.current) return;
    startedRef.current = true;
    mountedRef.current = true;
    
    if (!isIncoming) {
      startAsOffer();
    } else {
      // For incoming calls: immediately start polling so we detect if
      // the caller cancels/hangs up before we answer
      startPolling();
    }
    return () => {
      mountedRef.current = false;
      startedRef.current = false;
      clearInterval(pollRef.current);
      pollRef.current = undefined;
      clearInterval(timerRef.current);
      localStream.current?.getTracks().forEach(t => t.stop());
      pc.current?.close();
      pc.current = null;
      pendingOfferRef.current = null;
      iceQueueRef.current = [];
      stopRingtone();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  let bgClass = "bg-zinc-900";
  if (callType === "voice") bgClass = "bg-slate-950";
  else if (callType === "video") bgClass = "bg-black";

  const isRingingIncoming = status === "ringing" && isIncoming;

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center text-white transition-colors duration-1000 overflow-hidden ${bgClass}`} style={{ zIndex: 9999 }}>
      {/* Background Effects */}
      {callType === "voice" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-indigo-600/30 rounded-full mix-blend-screen blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-fuchsia-600/20 rounded-full mix-blend-screen blur-[100px] animate-pulse" style={{ animationDuration: '7s' }} />
        </div>
      )}

      {/* Incoming call green pulse */}
      {isRingingIncoming && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
        </div>
      )}

      {/* Video Streams */}
      {callType === "video" && status !== "ended" && (
        <>
          <video ref={remoteVideo} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90 pointer-events-none" />
          <video ref={localVideo} autoPlay playsInline muted className="absolute bottom-32 right-8 w-36 h-48 rounded-2xl object-cover border-[1px] border-white/30 shadow-2xl z-10 transition-transform hover:scale-105" />
        </>
      )}
      {callType === "voice" && <audio ref={remoteVideo as any} autoPlay />}
      
      {/* ── Main Content: Avatar + Status + Buttons all in one flex column ── */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto px-6">
        
        {/* Avatar & Name */}
        {(status !== "connected" || callType === "voice") && (
          <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative">
              {status === "connected" && callType === "voice" && (
                <div className="absolute inset-0 rounded-full bg-indigo-500/40 animate-ping" style={{ animationDuration: '3s' }} />
              )}
              {isRingingIncoming && (
                <>
                  <div className="absolute -inset-4 rounded-full bg-emerald-500/20 animate-ping" style={{ animationDuration: '1.5s' }} />
                  <div className="absolute -inset-2 rounded-full bg-white/10 animate-ping" style={{ animationDuration: '2s' }} />
                </>
              )}
              {status === "ringing" && !isIncoming && (
                <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" style={{ animationDuration: '2s' }} />
              )}
              <div className={`relative h-32 w-32 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-5xl font-black shadow-[0_0_40px_rgba(255,255,255,0.1)] border border-white/20 ${isRingingIncoming ? "animate-bounce" : ""}`} style={isRingingIncoming ? { animationDuration: '1s' } : {}}>
                {(peerName || peerEmail).substring(0, 2).toUpperCase()}
              </div>
            </div>
            <h3 className={`font-bold mt-6 tracking-tight drop-shadow-xl ${isRingingIncoming ? "text-4xl" : "text-3xl"}`}>{peerName || peerEmail}</h3>
          </div>
        )}
        
        {/* Status Text */}
        <div className="flex flex-col items-center mt-4 min-h-[56px]">
          {status === "ended" ? (
            <button onClick={() => onEnd()} className="px-8 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold tracking-widest uppercase shadow-lg shadow-rose-500/40 transition-transform hover:scale-105 active:scale-95 animate-in fade-in">
              Call Ended
            </button>
          ) : (
            <>
              <p className="text-lg font-bold text-white/90 tracking-widest uppercase drop-shadow-md">
                {status === "calling" && "Calling..."}
                {status === "ringing" && (isIncoming ? "Incoming Call..." : "Ringing...")}
                {status === "connecting" && "Connecting..."}
                {status === "connected" && `${mm}:${ss}`}
              </p>
              {status === "calling" && (
                <p className="text-[10px] text-zinc-500 mt-1 font-bold animate-pulse uppercase tracking-widest">Waking up server...</p>
              )}
              {status === "ringing" && !isIncoming && (
                <p className="text-xs text-indigo-400 mt-1 font-bold animate-pulse capitalize">Waiting for answer</p>
              )}
              {isRingingIncoming && (
                <p className="text-sm text-emerald-400 mt-1 font-bold animate-pulse capitalize">
                  {callType === "video" ? "📹 Incoming Video Call" : "📞 Incoming Voice Call"}
                </p>
              )}
              {status === "connecting" && (
                <p className="text-[10px] text-white/50 mt-1 font-medium capitalize animate-pulse">Establishing Secure Stream</p>
              )}
            </>
          )}
        </div>

        {/* ── Action Buttons (inline, NOT absolute/fixed) ── */}
        {status !== "ended" && (
          <div className="mt-10 w-full flex justify-center">
            {isRingingIncoming ? (
              /* ── INCOMING CALL: Large Accept / Decline ── */
              <div className="flex items-center gap-10 px-12 py-6 rounded-full bg-zinc-900/60 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <div className="flex flex-col items-center gap-3">
                  <button id="decline-call-btn" onClick={endCall} className="h-20 w-20 rounded-full bg-rose-500 flex items-center justify-center hover:bg-rose-600 shadow-lg shadow-rose-500/30 transition-all hover:scale-110 active:scale-95 text-white" aria-label="Decline Call">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="23" y1="1" x2="1" y2="23"/></svg>
                  </button>
                  <span className="text-xs font-bold tracking-widest text-rose-400 uppercase">Decline</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <button id="accept-call-btn" onClick={answerCall} className="h-20 w-20 rounded-full bg-emerald-500 flex items-center justify-center hover:bg-emerald-600 shadow-lg shadow-emerald-500/40 transition-all hover:scale-110 active:scale-95 text-white ring-4 ring-emerald-500/30 animate-pulse" style={{ animationDuration: '1.5s' }} aria-label="Accept Call">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </button>
                  <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">Accept</span>
                </div>
              </div>
            ) : (
              /* ── ACTIVE CALL / OUTGOING: Mute, Camera, End ── */
              <div className="flex items-center gap-6 px-10 py-5 rounded-full bg-zinc-900/40 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <div className="flex flex-col items-center gap-2">
                  <button onClick={() => { setMuted(!muted); localStream.current?.getAudioTracks().forEach(t => t.enabled = !muted); }} className={`h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 ${muted ? "bg-white text-zinc-900 shadow-lg shadow-white/20" : "bg-white/10 hover:bg-white/20 text-white"}`}>
                    {muted ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .76-.13 1.49-.35 2.17"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                      : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>}
                  </button>
                </div>
                {callType === "video" && (
                  <div className="flex flex-col items-center gap-2">
                    <button onClick={() => { setCamOff(!camOff); localStream.current?.getVideoTracks().forEach(t => t.enabled = !camOff); }} className={`h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300 ${camOff ? "bg-white text-zinc-900 shadow-lg shadow-white/20" : "bg-white/10 hover:bg-white/20 text-white"}`}>
                      {camOff ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16.16 3.84A2 2 0 0 0 14 2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 1.84 2"/><path d="m22 8-6 4 6 4V8Z"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="4" width="14" height="14" rx="2"/></svg>}
                    </button>
                  </div>
                )}
                <div className="flex flex-col items-center gap-2 ml-4">
                  <button onClick={endCall} className="h-14 w-14 rounded-full bg-rose-500 flex items-center justify-center hover:bg-rose-600 shadow-lg shadow-rose-500/40 transition-all hover:scale-110 active:scale-95 text-white">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="23" y1="1" x2="1" y2="23"/></svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
