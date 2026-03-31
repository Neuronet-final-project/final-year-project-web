"use client";

import { useState } from "react";

export default function CounselorApplyPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [qualification, setQualification] = useState("");
  const [experienceYears, setExperienceYears] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<null | { ok: boolean; message: string }>(
    null,
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      setResult({ ok: false, message: "Missing NEXT_PUBLIC_API_BASE_URL" });
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/counselor/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          qualification,
          experience_years: experienceYears,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setResult({ ok: false, message: data?.detail || "Application failed" });
        return;
      }
      setResult({ ok: true, message: data?.message || "Application submitted" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-zinc-900">
          Counselor Application
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Submit your details. Admin will review and approve your account.
        </p>

        <form className="mt-8 grid grid-cols-1 gap-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900">Full name</label>
            <input
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900">Email</label>
            <input
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900">
              Qualification
            </label>
            <input
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              placeholder="e.g. BSc Psychology"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900">
              Experience (years)
            </label>
            <input
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10"
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              type="number"
              min={0}
              max={80}
              required
            />
          </div>

          {result && (
            <div
              className={`rounded-xl border px-3 py-2 text-sm ${
                result.ok
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {result.message}
            </div>
          )}

          <button
            disabled={submitting}
            className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
            type="submit"
          >
            {submitting ? "Submitting..." : "Submit application"}
          </button>
        </form>

        <div className="mt-6 text-sm text-zinc-600">
          Already approved?{" "}
          <a className="font-medium text-zinc-900 hover:underline" href="/login">
            Sign in
          </a>
          .
        </div>
      </div>
    </div>
  );
}

