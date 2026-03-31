import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] text-zinc-900">
      <div className="mx-auto w-full max-w-7xl px-5 py-6 md:px-8">
        <nav className="mb-8 flex items-center justify-between rounded-2xl border border-indigo-100 bg-white px-5 py-4 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-[#4F46E5]" />
            <span className="text-sm font-semibold text-[#4F46E5]">NEURONET</span>
          </div>
          <div className="hidden items-center gap-6 text-sm font-medium text-zinc-600 md:flex">
            <a href="#home" className="hover:text-zinc-900">Home</a>
            <a href="#features" className="hover:text-zinc-900">Features</a>
            <a href="#how-it-works" className="hover:text-zinc-900">How It Works</a>
            <a href="/login" className="hover:text-zinc-900">Dashboard</a>
          </div>
          <a
            href="/login"
            className="rounded-xl bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Login
          </a>
        </nav>

        <section
          id="home"
          className="grid grid-cols-1 gap-8 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-purple-50 to-cyan-50 p-6 shadow-sm md:grid-cols-2 md:p-10"
        >
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold leading-tight text-zinc-900 md:text-5xl">
              AI-Powered Mental Health Support in One Platform
            </h1>
            <p className="mt-5 text-base leading-8 text-zinc-600">
              Supporting adolescents through intelligent monitoring, secure communication, and ethical AI-driven insights.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="/login"
                className="rounded-xl bg-[#4F46E5] px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Get Started
              </a>
              <a
                href="#features"
                className="rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="relative h-[360px] overflow-hidden rounded-2xl border border-indigo-100 bg-white md:h-[430px]">
              <Image
                src="/Images/counselor.jpg"
                alt="Doctor"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute left-3 top-4 rounded-xl border border-indigo-100 bg-white/95 px-3 py-2 text-xs font-medium text-[#4F46E5] shadow">
              AI detects emotional patterns
            </div>
            <div className="absolute right-3 top-20 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 shadow">
              +100 Active Counselors
            </div>
            <div className="absolute bottom-4 right-3 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 shadow">
              Secure &amp; Private System
            </div>
          </div>
        </section>

        <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-zinc-900">The Challenge</h2>
            <ul className="mt-4 list-inside list-disc space-y-2 text-zinc-600">
              <li>Rising adolescent mental health issues</li>
              <li>Limited access to professionals</li>
              <li>Stigma prevents seeking help</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#4F46E5]">Solution</h3>
            <p className="mt-3 text-zinc-700">
              NEURONET provides a safe, AI-supported, and privacy-first platform for early detection and support.
            </p>
          </div>
        </section>

        <section id="features" className="mt-12">
          <h2 className="text-3xl font-bold text-zinc-900">Key Features</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              ["AI Analysis", "Detects emotional patterns from journals"],
              ["Dashboard", "Visual insights for counselors"],
              ["Privacy First", "Secure and encrypted data handling"],
              ["Secure Chat", "Counselor-adolescent communication"],
              ["Alert System", "Real-time risk notifications"],
              ["Consent Control", "Guardian-based access management"],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <h3 className="font-semibold text-zinc-900">{title}</h3>
                <p className="mt-2 text-sm text-zinc-600">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="mt-12 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-3xl font-bold text-zinc-900">How It Works</h2>
          <ol className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-5">
            {[
              "Adolescent writes journal",
              "AI analyzes emotional state",
              "System detects risk",
              "Alert sent to counselor/guardian",
              "Counselor provides support",
            ].map((step, idx) => (
              <li
                key={step}
                className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700"
              >
                <span className="font-semibold text-[#4F46E5]">{idx + 1}.</span> {step}
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-zinc-900">Dashboard Preview</h2>
            <p className="mt-3 text-zinc-600">
              Powerful dashboards designed for counselors and administrators to monitor, analyze, and support users effectively.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-zinc-900">Security &amp; Privacy</h2>
            <ul className="mt-4 list-inside list-disc space-y-2 text-zinc-600">
              <li>End-to-end encryption</li>
              <li>Role-based access control</li>
              <li>HIPAA, FERPA, COPPA compliance</li>
              <li>Consent-based data sharing</li>
            </ul>
          </div>
        </section>

        <section className="mt-12 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-purple-600 p-8 text-center text-white shadow-sm">
          <h2 className="text-3xl font-bold">Start Supporting Mental Health Today</h2>
          <a
            href="/login"
            className="mt-5 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#4F46E5] hover:bg-zinc-100"
          >
            Login to Dashboard
          </a>
        </section>

        <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-zinc-200 py-6 text-sm text-zinc-600 md:flex-row">
          <div className="flex gap-5">
            <a href="#" className="hover:text-zinc-900">About</a>
            <a href="#" className="hover:text-zinc-900">Contact</a>
            <a href="#" className="hover:text-zinc-900">Privacy Policy</a>
          </div>
          <p>© 2026 NEURONET</p>
        </footer>
      </div>
    </div>
  );
}
