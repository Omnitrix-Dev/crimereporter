"use client";

import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";
import { useQueryState } from "nuqs";
import { cn, debounce } from "~/lib/utils";

function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    pending: "text-yellow-400",
    processing: "text-sky-400",
    completed: "text-emerald-400",
    failed: "text-red-400",
  };
  return statusColors[status?.toLowerCase()] || "text-white";
}

export function ReportTracker({ initialId }: { initialId?: string }) {
  const [q, setQ] = useQueryState("id", { defaultValue: initialId ?? "" });

  const debouncedSetQ = debounce(
    (setQ: (value: string) => void, value: string) => {
      setQ(value); // 664c5e73-85f6-47c1-b3dc-7ee4e3c74e5d
    },
    800,
  );

  const { data } = api.report.trackReport.useQuery(
    {
      id: q,
    },
    {
      enabled: !!q,
    },
  );

  return (
    <section className="flex flex-col gap-6">
      <Input
        onChange={(e) => debouncedSetQ(setQ, e.target.value)}
        className="w-full rounded-xl border-zinc-800 bg-zinc-900/50 px-4 py-3.5 text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40"
      />
      <div
        className={cn("transition-all duration-300", {
          "translate-y-0 opacity-100": data,
          "absolute translate-y-4 opacity-0": !data,
        })}
      >
        {data && (
          <div className="h-full rounded-xl border border-white/5 bg-black/30 p-6 backdrop-blur-xl">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
              <div className="h-2 w-2 rounded-full bg-sky-400" />
              Report Details
            </h2>

            <div className="grid gap-4">
              <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <span className="text-zinc-400">Status</span>
                <span
                  className={cn(
                    "rounded-full bg-white/5 px-3 py-1 font-medium",
                    getStatusColor(data?.status as string),
                  )}
                >
                  {data?.status?.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <span className="text-zinc-400">Report ID</span>
                <span className="font-mono text-white">{data?.id ?? ""}</span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                <span className="text-zinc-400">Submitted On</span>
                <span className="text-white">
                  {new Date(data?.createdAt as Date).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </span>
              </div>

              <div className="space-y-1.5 rounded-lg bg-white/5 p-3">
                <span className="text-sm text-zinc-400">Title</span>
                <span className="block font-medium text-white">
                  {data?.title}
                </span>
              </div>

              <div className="space-y-1.5 rounded-lg bg-white/5 p-3">
                <span className="text-sm text-zinc-400">Location</span>
                <span className="block font-medium text-white">
                  {data?.location}
                </span>
              </div>

              <div className="space-y-1.5 rounded-lg bg-white/5 p-3">
                <span className="text-sm text-zinc-400">Description</span>
                <p className="text-sm leading-relaxed text-white">
                  {data?.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
