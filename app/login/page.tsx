"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type AuthMeResponse =
  | { authenticated: false }
  | { authenticated: true; email: string; role: string };

type RoleTab = "counselor" | "admin";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<RoleTab>("counselor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = (await res.json()) as AuthMeResponse;
      if (data.authenticated) {
        if (data.role === "admin") router.replace("/admin/dashboard");
        else if (data.role === "counselor")
          router.replace("/counselor/dashboard");
      }
    })();
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.detail || "Login failed");
        return;
      }
      if (data?.role === "admin") router.push("/admin/dashboard");
      else if (data?.role === "counselor") router.push("/counselor/dashboard");
      else setError("This portal is only for counselors and admins.");
    } finally {
      setSubmitting(false);
    }
  }

  const isAdmin = activeTab === "admin";

  /* ── colour tokens per role ── */
  const accent = isAdmin
    ? {
        gradient: "from-[#0f172a] via-[#1e293b] to-[#334155]",
        badge: "border-slate-300 bg-slate-100 text-slate-700",
        ring: "focus:border-slate-400 focus:ring-slate-300/60",
        btn: "bg-slate-800 hover:bg-slate-900",
        tabActive: "bg-slate-800 text-white shadow-md",
        tabIdle:
          "text-slate-500 hover:text-slate-700 hover:bg-slate-50",
      }
    : {
        gradient: "from-[#4F46E5] via-indigo-600 to-cyan-500",
        badge: "border-indigo-200 bg-indigo-50 text-[#4F46E5]",
        ring: "focus:border-blue-300 focus:ring-blue-200/60",
        btn: "bg-blue-600 hover:bg-blue-700",
        tabActive: "bg-indigo-600 text-white shadow-md",
        tabIdle:
          "text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50",
      };

  return (
    <div className="flex flex-1 items-center justify-center px-5 py-10 md:px-8">
      <div className="neuro-card grid w-full max-w-5xl grid-cols-1 overflow-hidden md:grid-cols-[0.95fr_1.05fr]">
        {/* ── LEFT: form ─────────────────────────────── */}
        <div className="p-8 md:p-10">
          {/* Role tabs */}
          <div className="mb-6 flex gap-1 rounded-xl bg-zinc-100 p-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab("counselor");
                setError(null);
              }}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                !isAdmin ? accent.tabActive : "text-zinc-500 hover:text-zinc-700 hover:bg-white/60"
              }`}
            >
              Counselor
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("admin");
                setError(null);
              }}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                isAdmin ? accent.tabActive : "text-zinc-500 hover:text-zinc-700 hover:bg-white/60"
              }`}
            >
              Admin
            </button>
          </div>

          <div
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${accent.badge}`}
          >
            {isAdmin ? "ADMIN ACCESS" : "NEURONET ACCESS"}
          </div>

          <h1 className="mt-4 text-3xl font-bold text-zinc-900">
            {isAdmin ? "Admin Portal" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            {isAdmin
              ? "Sign in to manage the platform and users."
              : "Sign in to access the counselor dashboard."}
          </p>

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-900">
                Email
              </label>
              <input
                className={`neuro-input ${accent.ring}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  isAdmin ? "admin@neuronet.com" : "counselor@example.com"
                }
                type="email"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-900">
                Password
              </label>
              <input
                className={`neuro-input ${accent.ring}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              disabled={submitting}
              className={`inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-white transition disabled:opacity-50 ${accent.btn}`}
              type="submit"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {!isAdmin && (
            <div className="mt-6 text-sm text-zinc-600">
              Want to become a counselor?{" "}
              <a
                className="font-medium text-blue-700 hover:underline"
                href="/counselor/apply"
              >
                Apply here
              </a>
              .
            </div>
          )}
        </div>

        {/* ── RIGHT: hero panel ──────────────────────── */}
        <div
          className={`relative hidden overflow-hidden bg-gradient-to-br ${accent.gradient} md:flex md:flex-col`}
        >
          {isAdmin ? (
            /* ── ADMIN panel ── */
            <div className="flex h-full flex-col">
              <div className="p-10 pb-4">
                <h2 className="text-xl font-semibold leading-8 text-white">
                  NEURONET Admin Control
                </h2>
                <p className="mt-3 text-sm text-slate-300">
                  Full platform oversight — manage users, review analytics, and
                  configure system settings.
                </p>
              </div>
              <div className="relative flex-1">
                <Image
                  src="/Images/admin.jpg"
                  alt="Admin portal"
                  fill
                  sizes="(max-width: 768px) 0vw, 50vw"
                  className="object-cover object-top"
                  priority
                />
                {/* Gradient fade from top */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#1e293b] to-transparent" />
              </div>
            </div>
          ) : (
            /* ── COUNSELOR panel ── */
            <div className="relative h-full">
              <Image
                src="/Images/counselor.jpg"
                alt="Counselor professional"
                fill
                sizes="(max-width: 768px) 0vw, 50vw"
                className="object-cover object-top"
                priority
              />
              {/* Gradient overlay for text readability */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#4F46E5]/80 via-transparent to-[#4F46E5]/40" />
              <div className="absolute bottom-0 left-0 right-0 p-10">
                <h2 className="text-xl font-semibold leading-8 text-white">
                  NEURONET Professional Portal
                </h2>
                <p className="mt-3 text-sm text-blue-100">
                  Securely monitor risks, review cases, and coordinate support
                  workflows.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
