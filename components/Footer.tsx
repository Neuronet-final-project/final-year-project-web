import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200/60 bg-white/50 py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-5 text-sm md:flex-row md:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-900">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </div>
          <span className="font-semibold text-zinc-900">NEURONET</span>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-6 text-zinc-500">
          <Link href="/" className="transition hover:text-zinc-900">
            About
          </Link>
          <Link href="/" className="transition hover:text-zinc-900">
            Privacy Policy
          </Link>
          <Link href="/" className="transition hover:text-zinc-900">
            Terms of Service
          </Link>
          <Link href="mailto:contact@neuronet.com" className="transition hover:text-zinc-900">
            Contact
          </Link>
        </div>

        <p className="text-zinc-400">
          &copy; {new Date().getFullYear()} NEURONET. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
