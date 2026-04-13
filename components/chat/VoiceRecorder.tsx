"use client";
import { useState, useRef, useEffect } from "react";

type Props = { onRecorded: (blob: Blob) => void; onCancel: () => void };

export default function VoiceRecorder({ onRecorded, onCancel }: Props) {
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const mr = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => { startRec(); return () => { clearInterval(timer.current); mr.current?.stream.getTracks().forEach(t => t.stop()); }; }, []);

  async function startRec() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunks.current = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.current.push(e.data); };
      recorder.onstop = () => { const blob = new Blob(chunks.current, { type: "audio/webm" }); onRecorded(blob); stream.getTracks().forEach(t => t.stop()); };
      recorder.start();
      mr.current = recorder;
      setRecording(true);
      timer.current = setInterval(() => setElapsed(p => p + 1), 1000);
    } catch { onCancel(); }
  }

  function stopRec() { clearInterval(timer.current); mr.current?.stop(); setRecording(false); }
  function cancel() { clearInterval(timer.current); mr.current?.stream.getTracks().forEach(t => t.stop()); mr.current = null; onCancel(); }

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 animate-in fade-in duration-300">
      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
      <span className="text-sm font-bold text-red-600 tabular-nums">{mm}:{ss}</span>
      <div className="flex-1" />
      <button onClick={cancel} className="px-3 py-1.5 text-xs font-bold text-zinc-500 bg-white rounded-xl border hover:bg-zinc-50">Cancel</button>
      <button onClick={stopRec} className="px-4 py-1.5 text-xs font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 flex items-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
        Send
      </button>
    </div>
  );
}
