"use client";

import Link from "next/link";
import MobileMenu from "./MobileMenu";

import { useState } from "react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed left-0 top-0 z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <span className="text-lg font-semibold text-white">
                  SafeReport
                </span>
              </Link>
            </div>

            {/* Main Navigation */}
            <div className="hidden items-center space-x-6 md:flex">
              <Link
                href="/submit-report"
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                Submit Report
              </Link>
              <Link
                href="/track-report"
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                Track Report
              </Link>
              <Link
                href="/how-it-works"
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                How It Works
              </Link>
              <Link
                href="/resources"
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                Resources
              </Link>
            </div>

            {/* Emergency Button */}
            <div className="flex items-center space-x-4">
              <Link
                href="/contact"
                className="hidden text-sm text-zinc-400 transition-colors hover:text-white md:block"
              >
                Contact
              </Link>
              <button className="group flex h-9 items-center gap-2 rounded-full bg-red-500/10 pl-4 pr-5 text-sm font-medium text-red-500 ring-1 ring-inset ring-red-500/20 transition-all hover:bg-red-500/20">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                Emergency: 911
              </button>

              {/* Mobile Menu Button */}
              <button
                className="p-2 text-zinc-400 hover:text-white md:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
