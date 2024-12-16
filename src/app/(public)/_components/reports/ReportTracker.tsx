"use client";

import { Search } from "lucide-react";

export function ReportTracker() {
  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <div className="inline-flex h-9 items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 text-sm text-sky-400">
          <Search className="h-4 w-4" />
          Track Your Report Status
        </div>
        <h1 className="mt-6 bg-gradient-to-b from-white to-white/80 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
          Track Your Report
          <span className="block bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
            Stay Informed
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-zinc-400">
          Enter your report ID to check the current status and updates
        </p>
      </div>
    </div>
  );
}
