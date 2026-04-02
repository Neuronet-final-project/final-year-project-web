import Link from "next/link";
import { Mail, Github, Twitter, Linkedin, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-blue-100/50 bg-white/80 py-16 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
          {/* Brand Column */}
          <div className="flex flex-col gap-6 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-200">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-900">NEURONET</span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-500">
              Empowering mental health through advanced neural monitoring and proactive care coordination.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="group flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-50 transition-all hover:bg-zinc-900">
                <Twitter className="h-4 w-4 text-zinc-500 transition-colors group-hover:text-white" />
              </Link>
              <Link href="#" className="group flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-50 transition-all hover:bg-zinc-900">
                <Github className="h-4 w-4 text-zinc-500 transition-colors group-hover:text-white" />
              </Link>
              <Link href="#" className="group flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-50 transition-all hover:bg-zinc-900">
                <Linkedin className="h-4 w-4 text-zinc-500 transition-colors group-hover:text-white" />
              </Link>
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 gap-8 md:col-span-3 md:grid-cols-3">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">Platform</h3>
              <ul className="flex flex-col gap-2.5">
                <li><Link href="/counselor/dashboard" className="text-sm text-zinc-500 hover:text-blue-600 transition-colors">Dashboard</Link></li>
                <li><Link href="/counselor/chat" className="text-sm text-zinc-500 hover:text-blue-600 transition-colors">Real-time Chat</Link></li>
                <li><Link href="/counselor/alerts" className="text-sm text-zinc-500 hover:text-blue-600 transition-colors">Clinical Alerts</Link></li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">Company</h3>
              <ul className="flex flex-col gap-2.5">
                <li><Link href="#" className="text-sm text-zinc-500 hover:text-blue-600 transition-colors">About Us</Link></li>
                <li><Link href="#" className="text-sm text-zinc-500 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-sm text-zinc-500 hover:text-blue-600 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">Contact</h3>
              <ul className="flex flex-col gap-4">
                <li>
                  <Link href="mailto:contact@neuronet.com" className="flex items-center gap-3 text-sm text-zinc-500 hover:text-blue-600 transition-colors group">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 transition-colors group-hover:bg-blue-100">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                    contact@neuronet.com
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-zinc-100 pt-8 md:flex-row">
          <p className="text-sm text-zinc-400">
            &copy; {currentYear} NEURONET. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-sm text-zinc-400">
            <span>Made with</span>
            <Heart className="h-3.5 w-3.5 fill-red-400 text-red-400" />
            <span>for better care.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
