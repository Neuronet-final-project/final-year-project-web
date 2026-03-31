export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 px-6 py-16">
      <main className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          NEURONET Web Portal
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Counselor and Admin portal for dashboards, alerts, and messaging.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <a
            className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
            href="/login"
          >
            Sign in
          </a>
          <a
            className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            href="/counselor/apply"
          >
            Apply as counselor
          </a>
        </div>
      </main>
    </div>
  );
}
