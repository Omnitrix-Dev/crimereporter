"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader } from "lucide-react";

interface ReportDetails {
  id: string;
  reportId: string;
  status: string;
  createdAt: string;
  title: string;
  description: string;
  location: string;
}

export function ReportTracker() {
  const [reportId, setReportId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportDetails, setReportDetails] = useState<ReportDetails | null>(
    null,
  );
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setReportDetails(null);
    setLoading(true);

    if (!reportId.trim()) {
      setError("Please enter a report ID");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/reports/${reportId}/details`);
      if (!response.ok) {
        throw new Error("Report not found");
      }
      const data = await response.json();
      setReportDetails(data);
    } catch (err) {
      setError("Unable to find report. Please check the ID and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header Section */}
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

      {/* Dynamic Layout Container */}
      <div className="flex justify-center">
        <div
          className={`transition-all duration-300 ease-in-out ${
            reportDetails
              ? "grid w-full gap-8 md:grid-cols-2"
              : "w-full max-w-lg"
          }`}
        >
          {/* Form Section */}
          <div
            className={`w-full rounded-2xl border border-white/5 bg-zinc-900/50 p-6 backdrop-blur-xl transition-all duration-300 ${reportDetails ? "" : "mx-auto"}`}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label
                  htmlFor="reportId"
                  className="mb-2 block text-sm font-medium text-zinc-400"
                >
                  Report ID
                </label>
                <input
                  type="text"
                  id="reportId"
                  value={reportId}
                  onChange={(e) => setReportId(e.target.value)}
                  className="w-full rounded-xl border border-white/5 bg-black/50 px-4 py-3 text-white placeholder-zinc-500 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  placeholder="Enter your report ID"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                  <svg
                    className="h-5 w-5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-white transition-all duration-200 hover:from-sky-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
                <span>{loading ? "Searching..." : "Track Report"}</span>
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div
            className={`transition-all duration-300 ${
              reportDetails
                ? "translate-x-0 opacity-100"
                : "absolute translate-x-8 opacity-0"
            }`}
          >
            {reportDetails && (
              <div className="h-full rounded-xl border border-white/5 bg-black/30 p-6 backdrop-blur-xl">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-white">
                  <div className="h-2 w-2 rounded-full bg-sky-400" />
                  Report Details
                </h2>

                <div className="grid gap-4">
                  <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                    <span className="text-zinc-400">Status</span>
                    <span
                      className={`font-medium ${getStatusColor(
                        reportDetails.status,
                      )} rounded-full bg-white/5 px-3 py-1`}
                    >
                      {reportDetails.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                    <span className="text-zinc-400">Report ID</span>
                    <span className="font-mono text-white">
                      {reportDetails.reportId || reportDetails.id}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                    <span className="text-zinc-400">Submitted On</span>
                    <span className="text-white">
                      {new Date(reportDetails.createdAt).toLocaleDateString(
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
                      {reportDetails.title}
                    </span>
                  </div>

                  <div className="space-y-1.5 rounded-lg bg-white/5 p-3">
                    <span className="text-sm text-zinc-400">Location</span>
                    <span className="block font-medium text-white">
                      {reportDetails.location}
                    </span>
                  </div>

                  <div className="space-y-1.5 rounded-lg bg-white/5 p-3">
                    <span className="text-sm text-zinc-400">Description</span>
                    <p className="text-sm leading-relaxed text-white">
                      {reportDetails.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    pending: "text-yellow-400",
    processing: "text-sky-400",
    completed: "text-emerald-400",
    failed: "text-red-400",
  };
  return statusColors[status.toLowerCase()] || "text-white";
}
