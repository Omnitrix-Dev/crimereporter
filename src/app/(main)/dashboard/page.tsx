import { cn } from "~/lib/utils";
import { ReportsFilter } from "../_components/ReportsFilter";
import { SignOutButton } from "../_components/SignOutButton";
import { UpdateReportStatus } from "../_components/UpdateReportStatus";
import { Suspense } from "react";
import { api } from "~/trpc/server";

async function DashboardWithData({
  status,
  types,
}: {
  status: string;
  types: string;
}) {
  const allReports = await api.report.getAllReports();

  const filteredReports = allReports.filter((report) => {
    if (!status && !types) return true;
    if (status === "all" || types === "all") return true;
    return (
      report.status === status.toUpperCase() &&
      report.reportType === types.toUpperCase()
    );
  });
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <ReportsFilter />
        <div className="text-neutral-400">{filteredReports.length} Reports</div>
      </div>

      <div className="grid gap-4">
        {filteredReports.map((report, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm transition-all hover:border-neutral-700"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-medium text-neutral-200">
                    {report.title}
                  </h2>
                  <span
                    className={cn(
                      `rounded-full px-3 py-1 text-xs font-medium`,
                      {
                        "border border-neutral-500/20 bg-neutral-500/10 text-neutral-400":
                          report.status === "DISMISSED",
                        "border border-amber-500/20 bg-amber-500/10 text-amber-500":
                          report.status === "PENDING",
                        "border border-green-500/20 bg-blue-500/10 text-green-500":
                          report.status === "RESOLVED",
                        "border border-blue-500/10 bg-blue-500/10 text-blue-400":
                          report.status === "IN_PROGRESS",
                      },
                    )}
                  >
                    {report.status}
                  </span>
                </div>
                <p className="text-sm text-neutral-400">{report.description}</p>
                <div className="flex flex-wrap gap-6 text-sm text-neutral-500">
                  <span className="flex items-center gap-2">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-neutral-800">
                      <div
                        className={cn("h-2 w-2 rounded-full bg-neutral-600", {
                          "animate-pulse bg-red-500":
                            report.reportType === "EMERGENCY",
                          "bg-yellow-500": report.reportType !== "EMERGENCY",
                        })}
                      ></div>
                    </div>
                    {report.reportType}
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-neutral-800">
                      <div className="h-2 w-2 rounded-full bg-neutral-600"></div>
                    </div>
                    {report.location || "N/A"}
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-neutral-800">
                      <div className="h-2 w-2 rounded-full bg-neutral-600"></div>
                    </div>
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {report.image && (
                  <img
                    src={report.image}
                    alt="Report"
                    className="mt-4 rounded-lg border border-neutral-800"
                  />
                )}
              </div>
              <UpdateReportStatus id={report.customId} />
            </div>
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 py-12 text-center text-neutral-500">
            No reports found matching the selected filters.
          </div>
        )}
      </div>
    </main>
  );
}

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ status: string; types: string }>;
}) {
  const { status, types } = await searchParams;

  return (
    <div className="min-h-[90vh] bg-black text-white">
      <nav className="sticky top-0 z-50 border-b border-neutral-800 bg-black/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-2xl font-bold text-transparent">
              Admin Dashboard
            </h1>
            <SignOutButton />
          </div>
        </div>
      </nav>

      <Suspense fallback={<div>Loading...</div>}>
        <DashboardWithData status={status} types={types} />
      </Suspense>
    </div>
  );
}
