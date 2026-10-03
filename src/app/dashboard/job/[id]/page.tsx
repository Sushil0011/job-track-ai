import { Suspense } from "react";
import JobDetail from "@/components/jobs/job-detail";

export default function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div className="py-16 text-sm text-slate-500">Loading application…</div>}>
      <JobDetailsContent params={params} />
    </Suspense>
  );
}

async function JobDetailsContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <JobDetail key={id} jobId={id} />;
}
