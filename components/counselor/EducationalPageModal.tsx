"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, Loader2, Sparkles, BookOpen, Tag, Image as ImageIcon, FileText, Wand2 } from "lucide-react";

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
    tags: [] as string[],
    difficulty_level: "",
    author_bio: "",
    author_credentials: "",
    featured_image_url: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enriching, setEnriching] = useState(false);
  const [showEnrichment, setShowEnrichment] = useState(false);
  const [tagInput, setTagInput] = useState("");

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
          tags: initialData.tags || [],
          difficulty_level: initialData.difficulty_level || "",
          author_bio: initialData.author_bio || "",
          author_credentials: initialData.author_credentials || "",
          featured_image_url: initialData.featured_image_url || "",
        });
      } else {
        setFormData({
          slug: "",
          title: "",
          summary: "",
          category: "",
          content: "",
          tags: [],
          difficulty_level: "",
          author_bio: "",
          author_credentials: "",
          featured_image_url: "",
        });
      }
      setError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleEnrichContent = async () => {
    if (!formData.title || !formData.content) {
      setError("Please provide title and content first");
      return;
    }

    setEnriching(true);
    setError(null);
    try {
      const res = await fetch("/api/proxy/backend/educational-pages/enrich/comprehensive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          category: formData.category || null
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: "Enrichment failed" }));
        throw new Error(errorData.detail || "Failed to enrich content");
      }

      const data = await res.json();
      setFormData(prev => ({
        ...prev,
        summary: data.summary || prev.summary,
        tags: [...new Set([...prev.tags, ...(data.suggested_tags || [])])],
        featured_image_url: data.featured_image_url || prev.featured_image_url,
      }));
      setShowEnrichment(false);
    } catch (err: any) {
      console.error("Enrichment error:", err);
      setError(err.message || "Failed to enrich content");
    } finally {
      setEnriching(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Convert empty strings to null for optional fields
      const payload = {
        slug: formData.slug,
        title: formData.title,
        content: formData.content,
        category: formData.category || null,
        difficulty_level: formData.difficulty_level || null,
        summary: formData.summary || null,
        author_bio: formData.author_bio || null,
        author_credentials: formData.author_credentials || null,
        featured_image_url: formData.featured_image_url || null,
        tags: formData.tags,
      };

      const method = initialData ? "PUT" : "POST";
      const url = initialData 
        ? `/api/proxy/backend/educational-pages/${formData.slug}`
        : "/api/proxy/backend/educational-pages";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({ detail: "Failed to save" }));
        throw new Error(d.detail || "Failed to save educational resource");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "An error occurred");
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

            {/* AI Enrichment Button */}
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-100 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Wand2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-black text-zinc-900 text-sm">AI Content Enrichment</h4>
                    <p className="text-xs text-zinc-600">Auto-generate summary, tags, and featured image</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleEnrichContent}
                  disabled={enriching || !formData.title || !formData.content}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {enriching ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enriching...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Enrich
                    </>
                  )}
                </button>
              </div>
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest pl-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                  className="w-full bg-zinc-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-4 text-zinc-900 font-bold outline-none transition-all"
                >
                  <option value="">Select category</option>
                  <option value="anxiety">Anxiety</option>
                  <option value="depression">Depression</option>
                  <option value="stress">Stress Management</option>
                  <option value="self-care">Self-Care</option>
                  <option value="relationships">Relationships</option>
                  <option value="coping">Coping Strategies</option>
                  <option value="mindfulness">Mindfulness</option>
                  <option value="wellness">Wellness</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest pl-1">Difficulty Level</label>
                <select
                  value={formData.difficulty_level}
                  onChange={(e) => setFormData(p => ({ ...p, difficulty_level: e.target.value }))}
                  className="w-full bg-zinc-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-4 text-zinc-900 font-bold outline-none transition-all"
                >
                  <option value="">Select difficulty</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
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

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-xs font-black text-zinc-400 uppercase tracking-widest pl-1">Tags</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 bg-zinc-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-3 text-zinc-900 font-medium placeholder:text-zinc-300 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all"
                >
                  <Tag className="h-5 w-5" />
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-bold"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-indigo-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-zinc-400 uppercase tracking-widest pl-1">Featured Image URL</label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.featured_image_url}
                onChange={(e) => setFormData(p => ({ ...p, featured_image_url: e.target.value }))}
                className="w-full bg-zinc-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl px-5 py-4 text-zinc-900 font-medium placeholder:text-zinc-300 outline-none transition-all"
              />
              {formData.featured_image_url && (
                <div className="mt-2 rounded-xl overflow-hidden border-2 border-zinc-100">
                  <img src={formData.featured_image_url} alt="Preview" className="w-full h-48 object-cover" />
                </div>
              )}
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

            {/* Author Info */}
            <div className="space-y-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <h4 className="text-sm font-black text-zinc-700 uppercase tracking-widest">Author Information (Optional)</h4>
              
              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest pl-1">Credentials</label>
                <input
                  type="text"
                  placeholder="e.g. Licensed Clinical Psychologist, PhD"
                  value={formData.author_credentials}
                  onChange={(e) => setFormData(p => ({ ...p, author_credentials: e.target.value }))}
                  className="w-full bg-white border-2 border-transparent focus:border-indigo-500 rounded-xl px-4 py-3 text-zinc-900 font-medium placeholder:text-zinc-300 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-zinc-400 uppercase tracking-widest pl-1">Bio</label>
                <textarea
                  placeholder="Brief professional bio..."
                  value={formData.author_bio}
                  onChange={(e) => setFormData(p => ({ ...p, author_bio: e.target.value }))}
                  rows={3}
                  className="w-full resize-none bg-white border-2 border-transparent focus:border-indigo-500 rounded-xl px-4 py-3 text-zinc-900 font-medium placeholder:text-zinc-300 outline-none transition-all"
                />
              </div>
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
