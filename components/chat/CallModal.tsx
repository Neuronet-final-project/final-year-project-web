"use client";
import { useState, useRef, useEffect, useCallback } from "react";

type Props = {
  callId: string; callType: "voice" | "video"; peerEmail: string;
  isIncoming: boolean; onEnd: () => void;
};

const ICE_SERVERS = [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }];

export default function CallModal({ callId, callType, peerEmail, isIncoming, onEnd }: Props) {
  const [status, setStatus] = useState<"ringing" | "connecting" | "connected" | "ended">(isIncoming ? "ringing" : "connecting");
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const pc = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const pollRef = useRef<NodeJS.Timeout>();
  const timerRef = useRef<NodeJS.Timeout>();

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

  const endCall = useCallback(async () => { await api(`/${callId}/end`, "POST"); cleanup(); setTimeout(onEnd, 1500); }, [callId, api, cleanup, onEnd]);

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
    // Get the offer signal
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

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-zinc-900 via-indigo-950 to-zinc-900 flex flex-col items-center justify-center text-white">
      {callType === "video" && status !== "ended" && (
        <>
          <video ref={remoteVideo} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-80" />
          <video ref={localVideo} autoPlay playsInline muted className="absolute bottom-24 right-6 w-32 h-44 rounded-2xl object-cover border-2 border-white/30 shadow-2xl z-10" />
        </>
      )}
      {callType === "voice" && <audio ref={remoteVideo as any} autoPlay />}
      <div className="relative z-20 flex flex-col items-center gap-4">
        {(status === "ringing" || status === "connecting" || callType === "voice") && (
          <>
            <div className="h-24 w-24 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-3xl font-black mb-2">
              {peerEmail.substring(0, 2).toUpperCase()}
            </div>
            <h3 className="text-xl font-bold">{peerEmail}</h3>
          </>
        )}
        <p className="text-sm font-medium text-white/60">
          {status === "ringing" && (isIncoming ? "Incoming call..." : "Ringing...")}
          {status === "connecting" && "Connecting..."}
          {status === "connected" && `${mm}:${ss}`}
          {status === "ended" && "Call ended"}
        </p>
        {status === "ringing" && isIncoming ? (
          <div className="flex gap-6 mt-6">
            <button onClick={endCall} className="h-16 w-16 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 shadow-lg">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="23" y1="1" x2="1" y2="23"/></svg>
            </button>
            <button onClick={answerCall} className="h-16 w-16 rounded-full bg-emerald-500 flex items-center justify-center hover:bg-emerald-600 shadow-lg animate-pulse">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </button>
          </div>
        ) : status !== "ended" ? (
          <div className="flex gap-4 mt-6">
            <button onClick={() => { setMuted(!muted); localStream.current?.getAudioTracks().forEach(t => t.enabled = muted); }} className={`h-12 w-12 rounded-full flex items-center justify-center ${muted ? "bg-red-500" : "bg-white/20"}`}>
              {muted ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .76-.13 1.49-.35 2.17"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>}
            </button>
            {callType === "video" && (
              <button onClick={() => { setCamOff(!camOff); localStream.current?.getVideoTracks().forEach(t => t.enabled = camOff); }} className={`h-12 w-12 rounded-full flex items-center justify-center ${camOff ? "bg-red-500" : "bg-white/20"}`}>
                {camOff ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16.16 3.84A2 2 0 0 0 14 2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 1.84 2"/><path d="m22 8-6 4 6 4V8Z"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="4" width="14" height="14" rx="2"/></svg>}
              </button>
            )}
            <button onClick={endCall} className="h-12 w-12 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="23" y1="1" x2="1" y2="23"/></svg>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
