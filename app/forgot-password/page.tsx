"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, Mail, KeyRound, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState("");

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.detail || "Failed to send reset code");
        return;
      }
      setStep(1);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/verify-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.detail || "Invalid verification code");
        return;
      }
      setResetToken(data.reset_token);
      setStep(2);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: resetToken, new_password: newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.detail || "Failed to reset password");
        return;
      }
      router.push("/login");
    } finally {
      setSubmitting(false);
    }
  }

  const stepConfig = [
    { icon: <Mail className="w-6 h-6" />, title: "Forgot Password", subtitle: "Enter your email to receive a reset code" },
    { icon: <KeyRound className="w-6 h-6" />, title: "Verify Code", subtitle: "Enter the 6-digit code sent to your email" },
    { icon: <ShieldCheck className="w-6 h-6" />, title: "New Password", subtitle: "Choose a strong new password" },
  ];

  const current = stepConfig[step];

  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-5 py-10 md:px-8">
        <div className="neuro-card w-full max-w-md overflow-hidden">
          <div className="p-8 md:p-10">
            {/* Back button */}
            <button
              type="button"
              onClick={() => (step > 0 ? setStep((s) => (s - 1) as 0 | 1 | 2) : router.push("/login"))}
              className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
            >
              <ArrowLeft size={16} />
              {step > 0 ? "Back" : "Back to Login"}
            </button>

            {/* Progress bar */}
            <div className="mb-6 flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    i <= step ? "bg-indigo-600" : "bg-zinc-200"
                  }`}
                />
              ))}
            </div>

            {/* Header */}
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1">
              <span className="text-indigo-600">{current.icon}</span>
              <span className="text-xs font-semibold text-indigo-600">
                STEP {step + 1} OF 3
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold text-zinc-900">{current.title}</h1>
            <p className="mt-2 text-sm text-zinc-600">{current.subtitle}</p>

            {/* Step 0: Email */}
            {step === 0 && (
              <form className="mt-8 space-y-4" onSubmit={handleSendOtp}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-900">Email Address</label>
                  <input
                    className="neuro-input focus:border-indigo-300 focus:ring-indigo-200/60"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    type="email"
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
                  className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
                  type="submit"
                >
                  {submitting ? "Sending..." : "Send Reset Code"}
                </button>
              </form>
            )}

            {/* Step 1: OTP */}
            {step === 1 && (
              <form className="mt-8 space-y-4" onSubmit={handleVerifyOtp}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-900">Verification Code</label>
                  <input
                    className="neuro-input text-center text-2xl tracking-[0.5em] font-bold focus:border-indigo-300 focus:ring-indigo-200/60"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-zinc-500">Check your inbox for the 6-digit code</p>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  disabled={submitting || otp.length < 6}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
                  type="submit"
                >
                  {submitting ? "Verifying..." : "Verify Code"}
                </button>
              </form>
            )}

            {/* Step 2: New Password */}
            {step === 2 && (
              <form className="mt-8 space-y-4" onSubmit={handleResetPassword}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-900">New Password</label>
                  <div className="relative">
                    <input
                      className="neuro-input pr-11 focus:border-indigo-300 focus:ring-indigo-200/60"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-900">Confirm Password</label>
                  <div className="relative">
                    <input
                      className="neuro-input pr-11 focus:border-indigo-300 focus:ring-indigo-200/60"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      type={showConfirm ? "text" : "password"}
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    >
                      {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
                  type="submit"
                >
                  {submitting ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
