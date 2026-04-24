"use client";

import { useState, useEffect } from "react";
import { Plus, BookOpen, Edit2, Pencil, RefreshCcw } from "lucide-react";
import EducationalPageModal from "@/components/counselor/EducationalPageModal";

export default function EducationalPagesDashboard() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any | null>(null);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/proxy/backend/educational-pages");
      if (!res.ok) throw new Error("Failed to fetch educational pages");
      const data = await res.json();
      setPages(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleEdit = (page: any) => {
    setEditingPage(page);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingPage(null);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-zinc-100">
        <div className="flex gap-6 items-center">
          <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-[20px] flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
            <BookOpen className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Learner's Nook</h1>
            <p className="text-zinc-500 mt-2 font-medium">Manage evidence-based psychoeducational material.</p>
          </div>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-zinc-900 text-white rounded-[20px] font-bold shadow-lg shadow-zinc-200 hover:bg-zinc-800 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={20} />
          <span>New Article</span>
        </button>
      </div>

      {/* CONTENT LIST */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-zinc-100 min-h-[400px]">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-zinc-400">
            <RefreshCcw className="w-8 h-8 animate-spin mb-4" />
            <p className="font-bold tracking-tight">Loading resources...</p>
          </div>
        ) : error ? (
           <div className="py-20 flex flex-col items-center justify-center text-rose-500">
             <p className="font-bold tracking-tight p-4 bg-rose-50 rounded-2xl border border-rose-100">{error}</p>
           </div>
        ) : pages.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-zinc-400">
             <BookOpen className="w-16 h-16 mb-4 opacity-20" />
             <p className="font-bold tracking-tight text-lg text-zinc-500">No educational pages yet.</p>
             <p className="text-sm mt-2 text-zinc-400">Click the button above to publish the first article.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <div 
                key={page.slug}
                className="group relative flex flex-col justify-between bg-zinc-50 p-6 rounded-[24px] border border-zinc-100 hover:border-indigo-100 hover:bg-indigo-50/50 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-wider rounded-lg">
                      {page.category || "General"}
                    </span>
                    <button
                      onClick={() => handleEdit(page)}
                      className="p-2 bg-white rounded-xl text-zinc-400 hover:text-indigo-600 shadow-sm border border-zinc-100 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                    >
                      <Pencil size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                  <h3 className="text-lg font-black text-zinc-900 tracking-tight leading-tight mb-2">
                    {page.title}
                  </h3>
                  <p className="text-sm text-zinc-500 font-medium line-clamp-3 leading-relaxed">
                    {page.summary || "No summary provided."}
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-zinc-200/60 flex justify-between items-center text-xs font-bold text-zinc-400">
                  <span>/learn/{page.slug}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <EducationalPageModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchPages();
        }}
        initialData={editingPage}
      />
    </div>
  );
}
