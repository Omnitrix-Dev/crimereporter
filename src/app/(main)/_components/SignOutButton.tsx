"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <div className="flex items-center gap-6">
      <span className="text-neutral-400">Admin</span>
      <button
        onClick={() => signOut()}
        className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-300 transition-all hover:border-neutral-700 hover:bg-neutral-800"
      >
        Sign out
      </button>
    </div>
  );
}
