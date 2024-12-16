export default async function TrackReportSuccess({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return (
    <div>
      <h1>Track Report Success</h1>
    </div>
  );
}
