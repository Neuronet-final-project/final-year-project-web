"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Inbox, Mail, RefreshCw, Check } from "lucide-react";

interface ContactRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string | null;
  read: boolean;
}

export default function ContactSubmissionsTab() {
  const [rows, setRows] = useState<ContactRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/proxy/backend/admin/contact/submissions", { cache: "no-store" });
      if (!res.ok) {
        toast.error("Could not load contact submissions");
        setRows([]);
        return;
      }
      const data = (await res.json()) as ContactRow[];
      setRows(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Could not load contact submissions");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const markRead = async (id: string) => {
    try {
      const res = await fetch(`/api/proxy/backend/admin/contact/submissions/${encodeURIComponent(id)}/read`, {
        method: "PATCH",
      });
      if (res.ok) {
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, read: true } : r)));
      } else {
        toast.error("Failed to update");
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-12 w-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl">
      <div className="flex items-center justify-between rounded-3xl border border-indigo-100/60 bg-gradient-to-br from-indigo-50/50 to-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white">
            <Inbox className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-zinc-900 tracking-tight">Contact form inbox</h1>
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
              Public website submissions
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white hover:bg-zinc-800"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="text-center text-sm font-bold text-zinc-400 py-16">No submissions yet.</p>
      ) : (
        <ul className="space-y-4">
          {rows.map((r) => (
            <li
              key={r.id}
              className={`rounded-2xl border p-5 shadow-sm ${
                r.read ? "border-zinc-100 bg-zinc-50/60" : "border-indigo-100 bg-white"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-zinc-900">{r.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <a href={`mailto:${r.email}`} className="text-indigo-600 hover:underline break-all">
                      {r.email}
                    </a>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    {r.created_at ? new Date(r.created_at).toLocaleString() : "—"}
                  </span>
                  {!r.read && (
                    <button
                      type="button"
                      onClick={() => void markRead(r.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-800 hover:bg-emerald-100"
                    >
                      <Check className="h-3 w-3" />
                      Mark read
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-3 text-xs font-black uppercase tracking-widest text-indigo-600">{r.subject}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700 leading-relaxed">{r.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
