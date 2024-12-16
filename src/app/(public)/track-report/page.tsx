import { ReportTracker } from "../_components/reports/ReportTracker";

export default async function TrackReport() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="container mx-auto flex justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl">
          <ReportTracker />
        </div>
      </div>
    </div>
  );
}
