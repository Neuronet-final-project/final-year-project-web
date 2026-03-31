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

    try {
      const res = await fetch("/api/proxy/counselor/apply", {
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
    } catch {
      setResult({
        ok: false,
        message:
          "Unable to reach backend. Check NEXT_PUBLIC_API_BASE_URL and server status.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="neuro-card w-full max-w-xl p-8">
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
              className="neuro-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900">Email</label>
            <input
              className="neuro-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900">
              Qualification
            </label>
            <input
              className="neuro-input"
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
              className="neuro-input"
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
            className="neuro-primary-btn mt-2 w-full"
            type="submit"
          >
            {submitting ? "Submitting..." : "Submit application"}
          </button>
        </form>

        <div className="mt-6 text-sm text-zinc-600">
          Already approved?{" "}
          <a className="font-medium text-blue-700 hover:underline" href="/login">
            Sign in
          </a>
          .
        </div>
      </div>
    </div>
  );
}

