"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, Loader2 } from "lucide-react";

interface EducationalPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function EducationalPageModal({ isOpen, onClose, onSuccess, initialData }: EducationalPageModalProps) {
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    summary: "",
    category: "",
    content: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new Event("close-counselor-sidebar"));
      if (initialData) {
        setFormData({
          slug: initialData.slug || "",
          title: initialData.title || "",
          summary: initialData.summary || "",
          category: initialData.category || "",
          content: initialData.content || "",
        });
      } else {
        setFormData({
          slug: "",
          title: "",
          summary: "",
          category: "",
          content: "",
        });
      }
      setError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/proxy/backend/educational-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.detail || "Failed to save educational resource");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 drop-shadow-2xl">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={!saving ? onClose : undefined}
      />
      
      {/* Centered Modal Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-zinc-100">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
              {initialData ? "Edit Resource" : "New Resource"}
            </h2>
            <p className="text-zinc-500 font-medium mt-1">
              Markdown is entirely supported for the content field.
            </p>
          </div>
          <button 
            onClick={onClose}
            disabled={saving}
            className="p-3 bg-zinc-100/50 hover:bg-zinc-200 text-zinc-400 hover:text-zinc-700 rounded-full transition-all active:scale-90"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
          <form id="resource-form" onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl font-bold text-sm tracking-tight flex items-center gap-2">
                <X size={16} /> {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest pl-1">Title</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Managing Anxiety"
                  value={formData.title}
                  onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                  className="w-full bg-zinc-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-4 text-zinc-900 font-bold placeholder:text-zinc-300 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest pl-1">Unique Slug (URL)</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. managing-anxiety"
                  value={formData.slug}
                  disabled={!!initialData}
                  onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                  className={`w-full border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-4 text-zinc-900 font-bold placeholder:text-zinc-300 outline-none transition-all ${initialData ? 'bg-zinc-100 cursor-not-allowed opacity-70' : 'bg-zinc-50'}`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-zinc-400 uppercase tracking-widest pl-1">Category / Tag</label>
              <input
                type="text"
                placeholder="e.g. well-being, crisis, coping"
                value={formData.category}
                onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                className="w-full bg-zinc-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-4 text-zinc-900 font-bold placeholder:text-zinc-300 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-zinc-400 uppercase tracking-widest pl-1">Brief Summary</label>
              <textarea
                placeholder="A short description representing the article content..."
                value={formData.summary}
                onChange={(e) => setFormData(p => ({ ...p, summary: e.target.value }))}
                rows={2}
                className="w-full resize-none bg-zinc-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-4 text-zinc-900 font-medium placeholder:text-zinc-300 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-zinc-400 uppercase tracking-widest pl-1">Markdown Content</label>
              <textarea
                required
                placeholder="# Markdown Content Here\n\nStart writing..."
                value={formData.content}
                onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))}
                rows={12}
                className="w-full bg-zinc-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-4 text-zinc-900 font-medium placeholder:text-zinc-300 outline-none transition-all font-mono text-sm leading-relaxed"
              />
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-end gap-3 mt-auto rounded-b-[32px]">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-6 py-3.5 rounded-2xl font-bold text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/50 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            form="resource-form"
            type="submit"
            disabled={saving || !formData.title || !formData.slug || !formData.content}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:bg-indigo-600 disabled:cursor-not-allowed text-white rounded-2xl font-bold transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-indigo-200"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                <span>Publish</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
