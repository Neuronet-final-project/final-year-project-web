import Link from "next/link";
import Image from "next/image";
import { Mail, Github, Twitter, Linkedin, Heart, MapPin, Phone, Send } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-zinc-100 bg-gradient-to-b from-white to-zinc-50 py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          {/* Brand Column */}
          <div className="flex flex-col gap-6 md:col-span-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 shadow-xl shadow-indigo-200 ring-2 ring-white group-hover:scale-110 transition-transform">
                <Image
                  src="/Images/icons/neuroneticon.png"
                  alt="NEURONET Logo"
                  width={48}
                  height={48}
                  className="object-cover p-1.5"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-zinc-900 leading-none">
                  NEURO<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">NET</span>
                </span>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Mental Health AI</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-600 font-medium max-w-sm">
              Empowering mental health through advanced AI monitoring and proactive care coordination. Building a safer future for adolescents worldwide.
            </p>
            <div className="flex items-center gap-3">
              <Link href="https://twitter.com" target="_blank" className="group flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 transition-all hover:bg-gradient-to-br hover:from-indigo-600 hover:to-cyan-500 hover:shadow-lg hover:shadow-indigo-200">
                <Twitter className="h-4 w-4 text-zinc-600 transition-colors group-hover:text-white" />
              </Link>
              <Link href="https://github.com" target="_blank" className="group flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 transition-all hover:bg-gradient-to-br hover:from-indigo-600 hover:to-cyan-500 hover:shadow-lg hover:shadow-indigo-200">
                <Github className="h-4 w-4 text-zinc-600 transition-colors group-hover:text-white" />
              </Link>
              <Link href="https://linkedin.com" target="_blank" className="group flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 transition-all hover:bg-gradient-to-br hover:from-indigo-600 hover:to-cyan-500 hover:shadow-lg hover:shadow-indigo-200">
                <Linkedin className="h-4 w-4 text-zinc-600 transition-colors group-hover:text-white" />
              </Link>
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 gap-8 md:col-span-8 md:grid-cols-4">
            <div className="flex flex-col gap-5">
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900">Platform</h3>
              <ul className="flex flex-col gap-3">
                <li><Link href="/footer/features" className="text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors flex items-center gap-2 group">
                  <span className="h-1 w-1 rounded-full bg-zinc-300 group-hover:bg-indigo-600 transition-colors"></span>
                  Features
                </Link></li>
                <li><Link href="/footer/security" className="text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors flex items-center gap-2 group">
                  <span className="h-1 w-1 rounded-full bg-zinc-300 group-hover:bg-indigo-600 transition-colors"></span>
                  Security
                </Link></li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-5">
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900">Company</h3>
              <ul className="flex flex-col gap-3">
                <li><Link href="/footer/about" className="text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors flex items-center gap-2 group">
                  <span className="h-1 w-1 rounded-full bg-zinc-300 group-hover:bg-indigo-600 transition-colors"></span>
                  About Us
                </Link></li>
                <li><Link href="/footer/blog" className="text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors flex items-center gap-2 group">
                  <span className="h-1 w-1 rounded-full bg-zinc-300 group-hover:bg-indigo-600 transition-colors"></span>
                  Blog
                </Link></li>
              </ul>
            </div>

            <div className="flex flex-col gap-5">
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900">Legal</h3>
              <ul className="flex flex-col gap-3">
                <li><Link href="/footer/privacy" className="text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors flex items-center gap-2 group">
                  <span className="h-1 w-1 rounded-full bg-zinc-300 group-hover:bg-indigo-600 transition-colors"></span>
                  Privacy Policy
                </Link></li>
                <li><Link href="/footer/terms" className="text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors flex items-center gap-2 group">
                  <span className="h-1 w-1 rounded-full bg-zinc-300 group-hover:bg-indigo-600 transition-colors"></span>
                  Terms of Service
                </Link></li>
                <li><Link href="/footer/cookies" className="text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors flex items-center gap-2 group">
                  <span className="h-1 w-1 rounded-full bg-zinc-300 group-hover:bg-indigo-600 transition-colors"></span>
                  Cookie Policy
                </Link></li>
                <li><Link href="/footer/compliance" className="text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors flex items-center gap-2 group">
                  <span className="h-1 w-1 rounded-full bg-zinc-300 group-hover:bg-indigo-600 transition-colors"></span>
                  Compliance
                </Link></li>
              </ul>
            </div>

            <div className="flex flex-col gap-5 col-span-2 md:col-span-1">
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900">Contact</h3>
              <ul className="flex flex-col gap-4">
                <li>
                  <Link href="mailto:contact@neuronet.com" className="flex items-center gap-3 text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 transition-all group-hover:bg-indigo-100 group-hover:scale-110">
                      <Mail className="h-4 w-4 text-indigo-600" />
                    </div>
                    <span className="text-xs">contact@neuronet.com</span>
                  </Link>
                </li>
                <li>
                  <Link href="/footer/contact" className="flex items-center gap-3 text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 transition-all group-hover:bg-cyan-100 group-hover:scale-110">
                      <Send className="h-4 w-4 text-cyan-600" />
                    </div>
                    <span className="text-xs">Contact Form</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-zinc-200 pt-10 md:flex-row">
          <p className="text-sm text-zinc-500 font-medium">
            &copy; {currentYear} NEURONET. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
            <span>Made with</span>
            <Heart className="h-4 w-4 fill-rose-500 text-rose-500 animate-pulse" />
            <span>for better mental health care</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
