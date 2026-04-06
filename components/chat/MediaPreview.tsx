"use client";

type Props = { file: File | null; onCancel: () => void; onSend: () => void; sending: boolean };

export default function MediaPreview({ file, onCancel, onSend, sending }: Props) {
  if (!file) return null;
  const url = URL.createObjectURL(file);
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-4 max-w-md w-full shadow-2xl">
        <div className="rounded-2xl overflow-hidden bg-zinc-100 mb-4 max-h-[50vh] flex items-center justify-center">
          {isImage && <img src={url} alt="preview" className="max-h-[50vh] object-contain" />}
          {isVideo && <video src={url} controls className="max-h-[50vh] w-full" />}
          {!isImage && !isVideo && (
            <div className="p-8 text-center">
              <div className="text-4xl mb-2">📎</div>
              <p className="text-sm font-bold text-zinc-600">{file.name}</p>
              <p className="text-xs text-zinc-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 text-sm font-bold text-zinc-600 bg-zinc-100 rounded-xl hover:bg-zinc-200">Cancel</button>
          <button onClick={onSend} disabled={sending} className="flex-1 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50">
            {sending ? "Uploading..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
