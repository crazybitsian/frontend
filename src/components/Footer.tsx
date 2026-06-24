import React from "react";
import Link from "next/link";

const CITY_LINKS = [
  { href: "/delhi", label: "Delhi" },
  { href: "/bangalore", label: "Bangalore" },
  { href: "/mumbai", label: "Mumbai" },
  { href: "/kota", label: "Kota" },
  { href: "/jaipur", label: "Jaipur" },
  { href: "/hyderabad", label: "Hyderabad" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-white/70">
      <div className="container mx-auto px-4 max-w-6xl py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="font-display text-2xl font-bold text-white tracking-tight">
              ApnaKamra
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              Find verified hostels, PGs, and shared rooms in India's top student cities. Zero brokerage, always.
            </p>
          </div>

          {/* Cities */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">Cities</h4>
            <ul className="space-y-3">
              {CITY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">Company</h4>
            <ul className="space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 tracking-wide uppercase">For Owners</h4>
            <p className="text-sm text-white/50 mb-4 leading-relaxed">
              Reach thousands of students looking for a room. List your property for free.
            </p>
            <Link
              href="/owner"
              className="inline-flex items-center text-sm font-semibold bg-white text-foreground px-5 py-2.5 rounded-lg hover:bg-white/90 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} ApnaKamra. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-white/30 hover:text-white/60 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-white/30 hover:text-white/60 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
