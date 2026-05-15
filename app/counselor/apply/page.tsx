"use client";

import { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

/* ── Validation helpers ─────────────────────────────── */
const NAME_REGEX = /^[A-Za-z\s.\-']+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const QUALIFICATION_REGEX = /^[A-Za-z0-9\s.,()'/\-]+$/;

interface FieldErrors {
  fullName?: string;
  email?: string;
  password?: string;
  qualification?: string;
  experienceYears?: string;
  personalStatement?: string;
  idPhoto?: string;
}

function validateForm(fields: {
  fullName: string;
  email: string;
  password: string;
  qualification: string;
  experienceYears: number;
  personalStatement: string;
  idPhoto: File | null;
}): FieldErrors {
  const errors: FieldErrors = {};

  // Full name
  const trimmedName = fields.fullName.trim();
  if (!trimmedName) {
    errors.fullName = "Full name is required.";
  } else if (trimmedName.length < 2) {
    errors.fullName = "Name must be at least 2 characters.";
  } else if (trimmedName.length > 100) {
    errors.fullName = "Name must be under 100 characters.";
  } else if (!NAME_REGEX.test(trimmedName)) {
    errors.fullName =
      "Name can only contain letters, spaces, hyphens, periods, and apostrophes.";
  }

  // Email
  if (!fields.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(fields.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  // Password
  if (!fields.password) {
    errors.password = "Password is required.";
  } else if (fields.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (!/[A-Z]/.test(fields.password)) {
    errors.password = "Password must include at least one uppercase letter.";
  } else if (!/[a-z]/.test(fields.password)) {
    errors.password = "Password must include at least one lowercase letter.";
  } else if (!/[0-9]/.test(fields.password)) {
    errors.password = "Password must include at least one digit.";
  }

  // Qualification
  const trimmedQual = fields.qualification.trim();
  if (!trimmedQual) {
    errors.qualification = "Qualification is required.";
  } else if (trimmedQual.length < 2) {
    errors.qualification = "Qualification must be at least 2 characters.";
  } else if (!QUALIFICATION_REGEX.test(trimmedQual)) {
    errors.qualification =
      "Qualification can only contain letters, numbers, spaces, and common punctuation.";
  }

  // Experience
  if (
    fields.experienceYears < 0 ||
    fields.experienceYears > 80 ||
    !Number.isFinite(fields.experienceYears)
  ) {
    errors.experienceYears = "Experience must be between 0 and 80 years.";
  }

  // Personal statement
  const stmtLen = fields.personalStatement.trim().length;
  if (!stmtLen) {
    errors.personalStatement = "Personal statement is required.";
  } else if (stmtLen < 100) {
    errors.personalStatement = `Personal statement must be at least 100 characters (currently ${stmtLen}).`;
  } else if (stmtLen > 2000) {
    errors.personalStatement = "Personal statement must be under 2000 characters.";
  }

  // ID Photo
  if (!fields.idPhoto) {
    errors.idPhoto = "Please upload your professional ID photo.";
  }

  return errors;
}

export default function CounselorApplyPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [qualification, setQualification] = useState("");
  const [experienceYears, setExperienceYears] = useState<number>(0);
  const [personalStatement, setPersonalStatement] = useState("");
  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [idPhotoPreview, setIdPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<null | { ok: boolean; message: string }>(
    null,
  );
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleIdPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setIdPhoto(file);
      setErrors((prev) => ({ ...prev, idPhoto: undefined }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  /** Clear a field error when the user starts typing */
  function clearError(field: keyof FieldErrors) {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);

    // Validate all fields
    const validationErrors = validateForm({
      fullName,
      email,
      password,
      qualification,
      experienceYears,
      personalStatement,
      idPhoto,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      let idPhotoUrl = null;

      // Upload ID photo if provided
      if (idPhoto) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", idPhoto);

        const uploadRes = await fetch("/api/proxy/backend/counselor/upload-id-photo", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json().catch(() => ({}));
          setResult({ ok: false, message: errorData?.detail || "Failed to upload ID photo" });
          setUploading(false);
          setSubmitting(false);
          return;
        }

        const uploadData = await uploadRes.json();
        idPhotoUrl = uploadData.url;
        setUploading(false);
      }

      const res = await fetch("/api/proxy/backend/counselor/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          qualification,
          experience_years: experienceYears,
          personal_statement: personalStatement,
          id_photo_url: idPhotoUrl,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setResult({ ok: false, message: data?.detail || "Application failed" });
        return;
      }
      setResult({
        ok: true,
        message: data?.message || "Application submitted",
      });
      // Clear form after success
      setEmail("");
      setFullName("");
      setPassword("");
      setQualification("");
      setExperienceYears(0);
      setPersonalStatement("");
      setIdPhoto(null);
      setIdPhotoPreview(null);
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

  /* helper for red ring around invalid inputs */
  const inputCls = (field: keyof FieldErrors) =>
    `neuro-input ${errors[field] ? "!border-red-400 !ring-red-100" : ""}`;

  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-5 py-10 md:px-8">
        <div className="neuro-card grid w-full max-w-5xl grid-cols-1 overflow-hidden md:grid-cols-[1.05fr_0.95fr]">
        {/* ── LEFT: form ─────────────────────────────── */}
        <div className="p-8 md:p-10">
          <div className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-[#4F46E5]">
            COUNSELOR ONBOARDING
          </div>

          <h1 className="mt-4 text-3xl font-bold text-zinc-900">
            Join Our Team
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Submit your credentials below. An admin will review and approve your
            account.
          </p>

          <form
            className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2"
            onSubmit={onSubmit}
            noValidate
          >
            {/* Full name — full width */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-zinc-900">
                Full name
              </label>
              <input
                className={inputCls("fullName")}
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  clearError("fullName");
                }}
                placeholder="Dr. Jane Doe"
                required
              />
              {errors.fullName && (
                <p className="text-xs text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-900">Email</label>
              <input
                className={inputCls("email")}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError("email");
                }}
                placeholder="jane@example.com"
                type="email"
                required
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-900">
                Password
              </label>
              <input
                className={inputCls("password")}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError("password");
                }}
                placeholder="••••••••"
                type="password"
                required
              />
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
              {!errors.password && (
                <p className="text-xs text-zinc-400">
                  Min 8 chars, with uppercase, lowercase &amp; digit
                </p>
              )}
            </div>

            {/* Qualification */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-900">
                Qualification
              </label>
              <input
                className={inputCls("qualification")}
                value={qualification}
                onChange={(e) => {
                  setQualification(e.target.value);
                  clearError("qualification");
                }}
                placeholder="e.g. BSc Psychology"
                required
              />
              {errors.qualification && (
                <p className="text-xs text-red-500">{errors.qualification}</p>
              )}
            </div>

            {/* Experience */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-900">
                Experience (years)
              </label>
              <input
                className={inputCls("experienceYears")}
                value={experienceYears}
                onChange={(e) => {
                  setExperienceYears(Number(e.target.value));
                  clearError("experienceYears");
                }}
                type="number"
                min={0}
                max={80}
                required
              />
              {errors.experienceYears && (
                <p className="text-xs text-red-500">{errors.experienceYears}</p>
              )}
            </div>

            {/* ID Photo Upload */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-zinc-900">
                ID Photo <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIdPhotoChange}
                  className={`neuro-input file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 ${errors.idPhoto ? "!border-red-400 !ring-red-100" : ""}`}
                />
                {idPhotoPreview && (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-indigo-200">
                    <img
                      src={idPhotoPreview}
                      alt="ID Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              {errors.idPhoto ? (
                <p className="text-xs text-red-500">{errors.idPhoto}</p>
              ) : (
                <p className="text-xs text-zinc-500">
                  Upload a clear photo of your professional ID or license for verification
                </p>
              )}
            </div>

            {/* Personal Statement / Essay */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-zinc-900">
                Personal Statement <span className="text-red-500">*</span>
              </label>
              <textarea
                className={`${inputCls("personalStatement")} min-h-[200px] resize-y`}
                value={personalStatement}
                onChange={(e) => {
                  setPersonalStatement(e.target.value);
                  clearError("personalStatement");
                }}
                placeholder="Tell us about yourself, your experience, your approach to counseling, and why you want to join our team..."
                required
                maxLength={2000}
              />
              {errors.personalStatement ? (
                <p className="text-xs text-red-500">{errors.personalStatement}</p>
              ) : (
                <p className="text-xs text-zinc-500">
                  {personalStatement.length}/2000 characters (minimum 100 characters required)
                </p>
              )}
            </div>

            {/* Result message */}
            {result && (
              <div
                className={`sm:col-span-2 rounded-xl border px-3 py-2 text-sm ${
                  result.ok
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {result.message}
              </div>
            )}

            {/* Submit */}
            <button
              disabled={submitting || uploading}
              className="sm:col-span-2 inline-flex w-full items-center justify-center rounded-xl bg-[#4F46E5] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
              type="submit"
            >
              {uploading ? "Uploading ID Photo..." : submitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>

          <div className="mt-6 text-sm text-zinc-600">
            Already approved?{" "}
            <a
              className="font-medium text-[#4F46E5] hover:underline"
              href="/login"
            >
              Sign in
            </a>
            .
          </div>
        </div>

        {/* ── RIGHT: hero panel ──────────────────────── */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#4F46E5] via-indigo-600 to-cyan-500 md:flex md:flex-col">
          {/* Doctor image fills the panel */}
          <div className="relative h-full min-h-[480px]">
            <Image
              src="/Images/counselor.jpg"
              alt="Professional counselor"
              fill
              sizes="(max-width: 768px) 0vw, 45vw"
              className="object-cover object-top"
              priority
            />
            {/* Gradient overlay for text readability */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#4F46E5]/85 via-transparent to-[#4F46E5]/30" />

            {/* Bottom text overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Accepting applications
              </div>
              <h2 className="text-xl font-semibold leading-7 text-white">
                Make a Difference
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-blue-100">
                Join NEURONET&apos;s professional counseling team and help
                students navigate their mental health journey.
              </p>

              {/* Stats row */}
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-center backdrop-blur-sm">
                  <div className="text-lg font-bold text-white">500+</div>
                  <div className="text-[11px] text-blue-200">Students helped</div>
                </div>
                <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-center backdrop-blur-sm">
                  <div className="text-lg font-bold text-white">24/7</div>
                  <div className="text-[11px] text-blue-200">Support available</div>
                </div>
                <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 text-center backdrop-blur-sm">
                  <div className="text-lg font-bold text-white">98%</div>
                  <div className="text-[11px] text-blue-200">Satisfaction rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </main>
      <Footer />
    </>
  );
}
