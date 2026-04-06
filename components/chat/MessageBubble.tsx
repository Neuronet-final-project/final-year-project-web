"use client";
import { useState } from "react";

type Message = {
  _id?: string; message_id?: string; conversation_id: string; sender_email: string;
  sender_role: string; content: string; message_type?: string; attachment_url?: string | null; created_at: string;
};

type Props = { msg: Message; isMe: boolean; onImageClick?: (url: string) => void };

function AudioPlayer({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-2 min-w-[200px]">
      <audio controls src={url} className="h-8 w-full" style={{ maxWidth: 260 }} />
    </div>
  );
}

export default function MessageBubble({ msg, isMe, onImageClick }: Props) {
  const type = msg.message_type || "text";
  const url = msg.attachment_url;
  const time = new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
      <div className={`relative max-w-[85%] sm:max-w-[70%] rounded-[1.5rem] px-5 py-3.5 text-sm shadow-sm transition-all hover:shadow-md ${
        isMe ? "bg-gradient-to-br from-[#4f46e5] to-[#0891b2] text-white rounded-tr-sm" : "bg-white border border-zinc-100 text-zinc-700 rounded-tl-sm shadow-indigo-100/50"
      }`}>
        {type === "image" && url && (
          <div className="mb-2 cursor-pointer" onClick={() => onImageClick?.(url)}>
            <img src={url} alt="shared" className="rounded-xl max-h-60 object-cover" loading="lazy" />
          </div>
        )}
        {type === "audio" && url && <AudioPlayer url={url} />}
        {type === "video" && url && (
          <video src={url} controls className="rounded-xl max-h-60 w-full mb-2" />
        )}
        {msg.content && <p className={type !== "text" ? "mt-1" : ""}>{msg.content}</p>}
        <div className={`text-[8px] font-black mt-2 inline-flex items-center gap-1 uppercase tracking-tighter ${isMe ? "text-white/50" : "text-zinc-300"}`}>
          {time}
          {isMe && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>}
        </div>
      </div>
    </div>
  );
}
