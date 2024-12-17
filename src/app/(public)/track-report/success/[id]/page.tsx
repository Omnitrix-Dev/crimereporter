import Link from "next/link";

export default async function TrackReportSuccess({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <div className="flex h-[90vh] flex-col items-center justify-center space-y-6 text-center">
      <div className="flex flex-col items-center">
        <div className="rounded-full bg-green-500/10 p-3">
          <svg
            className="h-16 w-16 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-xl font-medium text-white">
          Report Successfully Submitted
        </h3>
        <p className="mt-2 text-sm text-zinc-400">
          Your report has been securely transmitted to law enforcement
        </p>
      </div>

      <div className="mx-auto max-w-md rounded-lg bg-zinc-800/50 p-6">
        <h4 className="mb-2 font-medium text-white">Your Report ID</h4>
        <div className="rounded bg-zinc-900 p-3">
          <code className="text-sky-400">{id}</code>
        </div>
        <p className="mt-2 text-sm text-zinc-400">
          Save this ID to check your report status or communicate securely with
          law enforcement
        </p>
      </div>

      <div className="pt-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
