import { api } from "~/trpc/server";

export default async function TrackReport() {
  const reportById = await api.report.getReportById({
    id: "180c6d67-2542-47ad-9f21-d2d1284c2502",
  });

  console.log("report", reportById);
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="container mx-auto flex justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl">{/* <ReportTracker /> */}</div>
      </div>
    </div>
  );
}
