"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { UserProfile } from "./UserProfile";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#cities-section", label: "Cities" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-border/40">
      <div className="container mx-auto px-4 max-w-6xl flex items-center justify-between h-16">
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-foreground hover:text-primary transition-colors">
          ApnaKamra
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-4 border-l border-border pl-6">
            <UserProfile />
            <Link
              href="/owner/login"
              className="text-sm font-semibold bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              List your property
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex items-center justify-center h-10 w-10 rounded-lg hover:bg-muted transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-background px-4 pb-6 pt-4 space-y-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-base font-medium text-foreground py-2"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 pb-4 border-b border-border/40">
            <UserProfile />
          </div>
          <Link
            href="/owner/login"
            onClick={() => setMobileOpen(false)}
            className="block w-full text-center text-sm font-semibold bg-primary text-primary-foreground px-5 py-3 rounded-lg hover:bg-primary/90 transition-colors mt-4"
          >
            List your property
          </Link>
        </div>
      )}
    </header>
  );
}
