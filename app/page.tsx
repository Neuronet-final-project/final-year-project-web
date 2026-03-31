export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <main className="neuro-card grid w-full max-w-5xl grid-cols-1 overflow-hidden md:grid-cols-2">
        <section className="p-9 md:p-11">
          <div className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            NEURONET
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
            Mental health support portal for counselors and admins.
          </h1>
          <p className="mt-4 text-sm leading-6 text-zinc-600">
            Monitor risk alerts, review counselor activity, and coordinate case support in one secure dashboard.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a className="neuro-primary-btn" href="/login">
              Sign in
            </a>
            <a className="neuro-secondary-btn" href="/counselor/apply">
              Apply as counselor
            </a>
          </div>
        </section>
        <section className="bg-gradient-to-br from-blue-600 via-indigo-500 to-cyan-500 p-9 text-white md:p-11">
          <div className="text-xs font-medium uppercase tracking-wider text-blue-100">
            Platform capabilities
          </div>
          <ul className="mt-6 space-y-3 text-sm text-blue-50">
            <li>• Risk alerts and consent-aware access control</li>
            <li>• Counselor assignment and case workflows</li>
            <li>• Educational recommendations and messaging</li>
            <li>• Audit logs for accountability and reporting</li>
          </ul>
          <div className="mt-8 rounded-xl border border-white/20 bg-white/10 p-4 text-sm text-blue-50">
            Connected to live API backend for mobile and web integration.
          </div>
        </section>
      </main>
    </div>
  );
}
