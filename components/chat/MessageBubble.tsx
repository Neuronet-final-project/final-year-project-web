"use client";
import { useState } from "react";
import { Edit2, Trash2, X, Check } from "lucide-react";

type Message = {
  _id?: string; message_id?: string; conversation_id: string; sender_email: string;
  sender_role: string; content: string; message_type?: string; attachment_url?: string | null; created_at: string;
  is_edited?: boolean;
};

type Props = { 
  msg: Message; 
  isMe: boolean; 
  onImageClick?: (url: string) => void;
  onEdit?: (id: string, newContent: string) => void;
  onDelete?: (id: string) => void;
};

function AudioPlayer({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-2 min-w-[200px]">
      <audio controls src={url} className="h-8 w-full" style={{ maxWidth: 260 }} />
    </div>
  );
}

export default function MessageBubble({ msg, isMe, onImageClick, onEdit, onDelete }: Props) {
  const type = msg.message_type || "text";
  const url = msg.attachment_url;
  const time = new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(msg.content);

  const handleSave = () => {
    if (editContent.trim() && editContent !== msg.content) {
      onEdit?.(msg._id || msg.message_id || "", editContent);
    }
    setIsEditing(false);
  };

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} w-full mb-3`}>
      <div className={`flex items-end gap-2 max-w-[75%] group ${isMe ? "flex-row-reverse" : "flex-row"}`}>
        {/* Edit/Delete buttons */}
        {isMe && !isEditing && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mb-1">
            {type === "text" && (
              <button onClick={() => setIsEditing(true)} className="p-1.5 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                <Edit2 size={12} strokeWidth={2.5} />
              </button>
            )}
            <button onClick={() => onDelete?.(msg._id || msg.message_id || "")} className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete">
              <Trash2 size={12} strokeWidth={2.5} />
            </button>
          </div>
        )}
        
        {/* Message bubble */}
        <div className={`relative inline-block max-w-full break-words rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all duration-300 hover:shadow-md ${
          isMe 
            ? "bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white rounded-br-md shadow-indigo-200/50 ring-1 ring-white/10" 
            : "bg-white/90 backdrop-blur-sm border border-slate-100 text-slate-800 rounded-bl-md shadow-slate-200/50"
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
          
          {isEditing ? (
            <div className="flex items-center gap-2 mt-1">
              <input 
                type="text" 
                value={editContent} 
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") { setIsEditing(false); setEditContent(msg.content); } }}
                className="flex-1 bg-white/20 border border-white/30 text-white placeholder:text-white/50 rounded-xl px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-white/50"
                autoFocus
              />
              <button onClick={handleSave} className="p-1 hover:bg-white/20 rounded-lg transition-colors"><Check size={14} /></button>
              <button onClick={() => { setIsEditing(false); setEditContent(msg.content); }} className="p-1 hover:bg-white/20 rounded-lg transition-colors"><X size={14} /></button>
            </div>
          ) : (
            msg.content && <p className={`leading-relaxed break-words whitespace-pre-wrap ${type !== "text" ? "mt-1" : ""}`}>
              {msg.content}
              {msg.is_edited && <span className="text-[9px] opacity-70 italic ml-2">(edited)</span>}
            </p>
          )}
          
          <div className={`text-[9px] font-medium mt-1.5 flex items-center gap-1 ${isMe ? "text-white/60 justify-end" : "text-zinc-400 justify-start"}`}>
            {time}
            {isMe && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>}
          </div>
        </div>
      </div>
    </div>
  );
}
