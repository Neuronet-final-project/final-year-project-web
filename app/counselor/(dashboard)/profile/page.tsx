"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type AuthMeResponse =
  | { authenticated: false }
  | { authenticated: true; email: string; role: string; _id: string };

type CounselorProfile = {
  email: string;
  full_name: string;
  qualification: string;
  experience_years: number;
};

export default function CounselorProfilePage() {
  const router = useRouter();
  const [me, setMe] = useState<AuthMeResponse>({ authenticated: false });
  const [loading, setLoading] = useState(true);
  
  const [fullName, setFullName] = useState("");
  const [qualification, setQualification] = useState("");
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const m = (await res.json()) as AuthMeResponse;
        setMe(m);
        if (!("authenticated" in m) || !m.authenticated) {
          router.replace("/login");
          return;
        }
        if (m.role !== "counselor") {
          router.replace(m.role === "admin" ? "/admin/dashboard" : "/login");
          return;
        }

        const profRes = await fetch("/api/proxy/backend/counselor/profile");
        if (profRes.ok) {
          const data = (await profRes.json()) as CounselorProfile;
          setFullName(data.full_name || "");
          setQualification(data.qualification || "");
        } else {
          setError("Failed to load profile data.");
        }
      } catch (err) {
        setError("Network error while loading profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);
    try {
      const payload = {
        full_name: fullName,
        qualification: qualification
      };

      const res = await fetch("/api/proxy/backend/counselor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const errData = await res.json();
        setError(errData.detail || "Failed to update profile.");
      }
    } catch (err) {
      setError("Network error updating profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !me.authenticated) {
    return <div className="flex h-screen items-center justify-center bg-slate-50 text-zinc-500">Loading Account Preferences...</div>;
  }

  return (
    <div className="flex flex-col relative overflow-hidden animate-in fade-in duration-700">
      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex flex-1 flex-col mx-auto w-full max-w-3xl p-8 md:p-16">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Account Preferences</h1>
          <p className="mt-2 text-sm font-medium text-zinc-500 max-w-md">Manage your clinical identity and secure credentials.</p>
        </div>
        <div className="rounded-[2.5rem] border border-white/60 bg-white/70 backdrop-blur-xl shadow-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#6366f1] to-[#06b6d4]"></div>
          
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#06b6d4] tracking-tight mb-8">Personal Information</h2>
            
            {error && <div className="mb-6 p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-semibold">{error}</div>}
            {success && <div className="mb-6 p-4 rounded-2xl bg-emerald-50 text-emerald-600 text-sm font-semibold">Profile updated securely!</div>}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 pl-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 px-5 py-3.5 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:border-[#6366f1] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6366f1]/10 transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 pl-1">Email <span className="normal-case opacity-60">(Locked)</span></label>
                  <input
                    type="email"
                    disabled
                    value={(me as any).email}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-100 px-5 py-3.5 text-sm font-semibold text-zinc-500 cursor-not-allowed opacity-70"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 pl-1">Primary Qualification</label>
                <input
                  type="text"
                  required
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/50 px-5 py-3.5 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:border-[#6366f1] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#6366f1]/10 transition-all"
                />
              </div>


              <div className="pt-6 border-t border-zinc-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#06b6d4] px-8 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgb(99,102,241,0.25)] hover:shadow-[0_12px_25px_rgb(99,102,241,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
                >
                  {saving ? "Saving Record..." : "Confirm Secure Updates"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
