import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-10">
      <main className="neuro-card w-full max-w-6xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-blue-100/80 px-6 py-4 md:px-8">
          <div className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            NEURONET PORTAL
          </div>
          <a className="neuro-primary-btn px-5" href="/login">
            Log in
          </a>
        </div>

        <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2 md:gap-10 md:p-8">
          <section className="flex flex-col justify-center">
            <p className="text-sm font-medium uppercase tracking-wider text-blue-700">
              Counselor & Admin Web
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-zinc-900 md:text-5xl">
              Mental Health
              <br />
              Support In One
              <br />
              Secure Dashboard
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-600">
              Review counselor applications, monitor adolescent risk alerts, and coordinate support workflows with privacy-aware access rules.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a className="neuro-primary-btn" href="/login">
                Open dashboard
              </a>
              <a className="neuro-secondary-btn" href="/counselor/apply">
                Apply as counselor
              </a>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                <p className="font-semibold text-zinc-900">RBAC</p>
                <p className="mt-1 text-zinc-600">Role-based protected modules</p>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                <p className="font-semibold text-zinc-900">Live API</p>
                <p className="mt-1 text-zinc-600">Connected to deployed backend</p>
              </div>
            </div>
          </section>

          <section className="relative">
            <div className="relative h-[380px] overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-100 to-cyan-100 shadow-inner md:h-[430px]">
              <Image
                src="/Images/counselor.jpg"
                alt="Counselor dashboard preview"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -left-3 bottom-4 rounded-xl border border-white/70 bg-white/90 px-3 py-2 text-xs text-zinc-700 shadow">
              Built for counselor/admin workflows
            </div>
            <div className="absolute -right-3 top-4 rounded-xl border border-blue-200 bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow">
              Consent-aware & audit-ready
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
