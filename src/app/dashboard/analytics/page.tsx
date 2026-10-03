"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BarChart3, BriefcaseBusiness, CheckCircle2, Loader2, Percent, XCircle } from "lucide-react";
import { backendGet, displayStatus, type Analytics, type JobStatus } from "@/utils/backend-api";

const statuses: JobStatus[] = ["WISHLIST", "APPLIED", "ASSESSMENT", "INTERVIEW", "OFFER", "REJECTED"];

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void backendGet<Analytics>("analytics").then(setData).catch((err: unknown) => {
      setError(err instanceof Error ? err.message : "Could not load analytics");
    }).finally(() => setLoading(false));
  }, []);

  const summary = data?.summary;
  const maxApplications = Math.max(1, ...(data?.trend.map((item) => item.applications) ?? [0]));

  return (
    <div className="space-y-7">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"><ArrowLeft className="h-4 w-4" />Dashboard</Link>
      <div><p className="text-sm font-medium text-[#5E43F3]">Insights</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Application analytics</h1><p className="mt-2 text-sm text-slate-500">Understand the shape and momentum of your job search.</p></div>
      {error && <div role="alert" className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {loading && <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" />Loading analytics…</div>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric title="Total applications" value={summary?.totalApplications ?? 0} icon={<BriefcaseBusiness className="h-5 w-5" />} color="text-blue-700 bg-blue-50" />
        <Metric title="Active pipeline" value={summary?.activeApplications ?? 0} icon={<BarChart3 className="h-5 w-5" />} color="text-amber-700 bg-amber-50" />
        <Metric title="Interview rate" value={`${summary?.interviewRate ?? 0}%`} icon={<Percent className="h-5 w-5" />} color="text-indigo-700 bg-indigo-50" />
        <Metric title="Offer rate" value={`${summary?.offerRate ?? 0}%`} icon={<CheckCircle2 className="h-5 w-5" />} color="text-emerald-700 bg-emerald-50" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6"><h2 className="font-semibold text-slate-900">Applications over time</h2><p className="mt-1 text-sm text-slate-500">Last six months, grouped by application date</p></div>
          <div className="flex h-64 items-end gap-3 border-b border-slate-100 pb-2 sm:gap-5">
            {(data?.trend ?? []).map((item) => {
              const height = Math.max(4, (item.applications / maxApplications) * 100);
              return <div key={item.month} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                <span className="text-xs font-semibold text-slate-600">{item.applications}</span>
                <div className="flex w-full max-w-14 flex-1 items-end justify-center"><div title={`${item.applications} applications`} className="w-full rounded-t-md bg-gradient-to-t from-[#5E43F3] to-violet-400 transition-all" style={{ height: `${height}%` }} /></div>
                <span className="whitespace-nowrap text-[10px] text-slate-500 sm:text-xs">{formatMonth(item.month)}</span>
              </div>;
            })}
            {!data?.trend.length && !loading && <p className="m-auto text-sm text-slate-400">Add applications to see your trend.</p>}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500"><span>Interview stages: {data?.trend.reduce((sum, item) => sum + item.interviews, 0) ?? 0}</span><span>Offers: {data?.trend.reduce((sum, item) => sum + item.offers, 0) ?? 0}</span></div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">Pipeline by stage</h2><p className="mt-1 text-sm text-slate-500">Where each application currently stands</p>
          <div className="mt-6 space-y-4">{statuses.map((status) => {
            const count = data?.statusBreakdown[status] ?? 0;
            const width = summary?.totalApplications ? (count / summary.totalApplications) * 100 : 0;
            return <div key={status}>
              <div className="mb-1.5 flex justify-between text-sm"><span className="text-slate-600">{displayStatus(status)}</span><span className="font-semibold text-slate-900">{count}</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#5E43F3] transition-all" style={{ width: `${width}%` }} /></div>
            </div>;
          })}</div>
          {summary && <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5"><MiniMetric title="Interviews" value={summary.interviews} icon={<BarChart3 className="h-4 w-4" />} /><MiniMetric title="Rejections" value={summary.rejections} icon={<XCircle className="h-4 w-4" />} /></div>}
        </section>
      </div>
    </div>
  );
}

function Metric({ title, value, icon, color }: { title: string; value: number | string; icon: React.ReactNode; color: string }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><p className="text-sm text-slate-500">{title}</p><p className="mt-2 text-3xl font-bold text-slate-900">{value}</p></div><span className={`rounded-xl p-3 ${color}`}>{icon}</span></div></article>;
}
function MiniMetric({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return <div className="rounded-xl bg-slate-50 p-3"><div className="flex items-center gap-2 text-xs text-slate-500">{icon}{title}</div><p className="mt-1 text-lg font-bold text-slate-900">{value}</p></div>;
}
function formatMonth(value: string) {
  const date = new Date(`${value}-01T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-IN", { month: "short" }).format(date);
}
