"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type AuthMeResponse =
  | { authenticated: false }
  | { authenticated: true; email: string; role: string };

export default function LoginPage() {
  const router = useRouter();
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
        else if (data.role === "counselor") router.replace("/counselor/dashboard");
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

  return (
    <div className="flex flex-1 items-center justify-center px-5 py-10 md:px-8">
      <div className="neuro-card grid w-full max-w-5xl grid-cols-1 overflow-hidden md:grid-cols-[0.95fr_1.05fr]">
        <div className="p-8 md:p-10">
          <div className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-[#4F46E5]">
            NEURONET ACCESS
          </div>
          <h1 className="mt-4 text-3xl font-bold text-zinc-900">Welcome back</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Sign in to access counselor and admin dashboards.
          </p>

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-900">Email</label>
              <input
                className="neuro-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="counselor@example.com"
                type="email"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-900">Password</label>
              <input
                className="neuro-input"
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
              className="neuro-primary-btn w-full"
              type="submit"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 text-sm text-zinc-600">
            Want to become a counselor?{" "}
            <a className="font-medium text-blue-700 hover:underline" href="/counselor/apply">
              Apply here
            </a>
            .
          </div>
        </div>
        <div className="relative hidden bg-gradient-to-br from-[#4F46E5] via-indigo-600 to-cyan-500 p-10 text-white md:block">
          <h2 className="text-xl font-semibold leading-8">NEURONET professional portal</h2>
          <p className="mt-3 text-sm text-blue-50">
            Securely monitor risks, review cases, and coordinate support workflows.
          </p>
          <div className="mt-7 rounded-xl border border-white/20 bg-white/10 p-4 text-sm">
            Your session is protected through role-based access control and JWT authentication.
          </div>
          <div className="relative mt-7 h-52 overflow-hidden rounded-xl border border-white/25 bg-white/10">
            <Image
              src="/Images/counselor.jpg"
              alt="NEURONET portal preview"
              fill
              className="object-cover opacity-85"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

