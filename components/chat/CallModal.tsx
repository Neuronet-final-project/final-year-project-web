"use client";
import { useState, useRef, useEffect, useCallback } from "react";

type Props = {
  callId: string; callType: "voice" | "video"; peerEmail: string; peerName: string;
  isIncoming: boolean; onEnd: () => void;
};

const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }];

export default function CallModal({ callId, callType, peerEmail, peerName, isIncoming, onEnd }: Props) {
  const [status, setStatus] = useState<"ringing" | "connecting" | "connected" | "ended">(isIncoming ? "ringing" : "connecting");
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const pc = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const pollRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const api = useCallback(async (path: string, method = "GET", body?: any) => {
    const opts: RequestInit = { method, headers: { "Content-Type": "application/json" } };
    if (body) opts.body = JSON.stringify(body);
    const r = await fetch(`/api/proxy/backend/messaging/calls${path}`, opts);
    return r.ok ? r.json() : null;
  }, []);

  const cleanup = useCallback(() => {
    clearInterval(pollRef.current); clearInterval(timerRef.current);
    localStream.current?.getTracks().forEach(t => t.stop());
    pc.current?.close(); pc.current = null;
    setStatus("ended");
  }, []);

  const endCall = useCallback(() => {
    api(`/${callId}/end`, "POST").catch(() => {});
    cleanup(); 
    setTimeout(onEnd, 1500); 
  }, [callId, api, cleanup, onEnd]);

  async function setupMedia() {
    const constraints = callType === "video" ? { audio: true, video: true } : { audio: true };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStream.current = stream;
      if (localVideo.current) localVideo.current.srcObject = stream;
      return stream;
    } catch { cleanup(); onEnd(); return null; }
  }

  async function createPC(stream: MediaStream) {
    const p = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    pc.current = p;
    stream.getTracks().forEach(t => p.addTrack(t, stream));
    p.ontrack = e => { if (remoteVideo.current && e.streams[0]) remoteVideo.current.srcObject = e.streams[0]; };
    p.onicecandidate = e => { if (e.candidate) api(`/${callId}/signal`, "POST", { type: "ice-candidate", data: { candidate: e.candidate.toJSON() } }); };
    p.onconnectionstatechange = () => {
      if (p.connectionState === "connected") {
        setStatus("connected");
        timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
      }
      if (["disconnected", "failed", "closed"].includes(p.connectionState)) endCall();
    };
    return p;
  }

  async function startAsOffer() {
    const stream = await setupMedia();
    if (!stream) return;
    const p = await createPC(stream);
    const offer = await p.createOffer();
    await p.setLocalDescription(offer);
    await api(`/${callId}/signal`, "POST", { type: "offer", data: { sdp: offer } });
    startPolling();
  }

  async function answerCall() {
    setStatus("connecting");
    await api(`/${callId}/answer`, "POST");
    const stream = await setupMedia();
    if (!stream) return;
    const p = await createPC(stream);
    const callData = await api(`/${callId}`);
    const offerSig = callData?.signals?.find((s: any) => s.type === "offer");
    if (offerSig?.data?.sdp) {
      await p.setRemoteDescription(new RTCSessionDescription(offerSig.data.sdp));
      const answer = await p.createAnswer();
      await p.setLocalDescription(answer);
      await api(`/${callId}/signal`, "POST", { type: "answer", data: { sdp: answer } });
    }
    startPolling();
  }

  function startPolling() {
    pollRef.current = setInterval(async () => {
      const data = await api(`/${callId}`);
      if (!data) return;
      if (data.status === "ended" || data.status === "rejected" || data.status === "missed") { cleanup(); setTimeout(onEnd, 1500); return; }
      for (const sig of data.signals || []) {
        if (!pc.current) continue;
        if (sig.type === "answer" && sig.data?.sdp && !pc.current.currentRemoteDescription) {
          await pc.current.setRemoteDescription(new RTCSessionDescription(sig.data.sdp));
        } else if (sig.type === "ice-candidate" && sig.data?.candidate) {
          try { await pc.current.addIceCandidate(new RTCIceCandidate(sig.data.candidate)); } catch {}
        }
      }
    }, 1000);
  }

  useEffect(() => {
    if (!isIncoming) startAsOffer();
    return cleanup;
  }, []);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  let bgClass = "bg-zinc-900";
  if (callType === "voice") {
    bgClass = "bg-slate-950"; // Dark base for voice call to let glowing orbs stand out
  } else if (callType === "video") {
    bgClass = "bg-black";
  }

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center text-white transition-colors duration-1000 overflow-hidden ${bgClass}`}>
      {/* Background Effects for Voice Call */}
      {callType === "voice" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-[600px] h-[600px] bg-indigo-600/30 rounded-full mix-blend-screen blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-fuchsia-600/20 rounded-full mix-blend-screen blur-[100px] animate-pulse" style={{ animationDuration: '7s' }} />
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
      
      {/* Central Identity / Status */}
      <div className="relative z-20 flex flex-col items-center gap-2 transform transition-all duration-700 ease-out translate-y-[-20px]">
        {(status !== "connected" || callType === "voice") && (
          <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative">
              {status === "connected" && callType === "voice" && (
                <div className="absolute inset-0 rounded-full bg-indigo-500/40 animate-ping" style={{ animationDuration: '3s' }} />
              )}
              {status === "ringing" && (
                <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" style={{ animationDuration: '2s' }} />
              )}
              <div className="relative h-32 w-32 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-5xl font-black shadow-[0_0_40px_rgba(255,255,255,0.1)] border border-white/20">
                {(peerName || peerEmail).substring(0, 2).toUpperCase()}
              </div>
            </div>
            <h3 className="text-3xl font-bold mt-6 tracking-tight drop-shadow-xl">{peerName || peerEmail}</h3>
          </div>
        )}
        
        <div className="flex flex-col items-center mt-2 h-14">
          {status === "ended" ? (
            <button onClick={() => onEnd()} className="px-8 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold tracking-widest uppercase shadow-lg shadow-rose-500/40 transition-transform hover:scale-105 active:scale-95 animate-in fade-in">
              Call Ended
            </button>
          ) : (
            <>
              <p className="text-lg font-bold text-white/90 tracking-widest uppercase drop-shadow-md">
                {status === "ringing" && (isIncoming ? "Incoming Call..." : "Calling...")}
                {status === "connecting" && "Calling..."}
                {status === "connected" && `${mm}:${ss}`}
              </p>
              {status === "ringing" && !isIncoming && (
                <p className="text-xs text-white/50 mt-1 font-medium capitalize">Waiting for answer</p>
              )}
            </>
          )}
        </div>
        
        {/* Action Controls Dock */}
        {status !== "ended" && (
          <div className="absolute top-[200px] sm:top-[250px] w-full flex justify-center pb-12">
            <div className="flex items-center gap-6 px-10 py-5 rounded-full bg-zinc-900/40 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              {status === "ringing" && isIncoming ? (
                <>
                  <div className="flex flex-col items-center gap-2">
                    <button onClick={endCall} className="h-16 w-16 rounded-full bg-rose-500 flex items-center justify-center hover:bg-rose-600 shadow-lg shadow-rose-500/30 transition-all hover:scale-110 active:scale-95 text-white">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="23" y1="1" x2="1" y2="23"/></svg>
                    </button>
                    <span className="text-[10px] font-bold tracking-widest text-white/50 uppercase">Decline</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button onClick={answerCall} className="h-16 w-16 rounded-full bg-emerald-500 flex items-center justify-center hover:bg-emerald-600 shadow-lg shadow-emerald-500/40 animate-pulse transition-all hover:scale-110 active:scale-95 text-white">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </button>
                    <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">Accept</span>
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
