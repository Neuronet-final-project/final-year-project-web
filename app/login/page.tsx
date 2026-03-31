"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-zinc-900">Sign in</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Counselors and admins only.
        </p>

        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900">Email</label>
            <input
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10"
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
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10"
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
            className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
            type="submit"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6 text-sm text-zinc-600">
          Want to become a counselor?{" "}
          <a className="font-medium text-zinc-900 hover:underline" href="/counselor/apply">
            Apply here
          </a>
          .
        </div>
      </div>
    </div>
  );
}

