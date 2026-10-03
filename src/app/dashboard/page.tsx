"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CalendarClock, CheckCircle2, Clock3, Loader2, Sparkles, TrendingUp } from "lucide-react";
import { backendGet, displayStatus, type Analytics, type Job, type Reminder } from "@/utils/backend-api";

const statusClass: Record<string, string> = {
  WISHLIST: "bg-slate-100 text-slate-700",
  APPLIED: "bg-blue-50 text-blue-700",
  ASSESSMENT: "bg-purple-50 text-purple-700",
  INTERVIEW: "bg-amber-50 text-amber-700",
  OFFER: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-rose-50 text-rose-700",
};

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void Promise.all([
      backendGet<Analytics>("analytics"),
      backendGet<{ jobs: Job[] }>("jobs?limit=5&sortBy=applicationDate&sortOrder=desc"),
      backendGet<{ reminders: Reminder[] }>("reminders?upcoming=true&limit=5"),
    ]).then(([analyticsResult, jobResult, reminderResult]) => {
      if (!active) return;
      setAnalytics(analyticsResult);
      setJobs(jobResult.jobs);
      setReminders(reminderResult.reminders);
    }).catch((err: unknown) => {
      if (active) setError(err instanceof Error ? err.message : "Could not load your dashboard");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const summary = analytics?.summary;
  const cards = [
    { title: "Applications", value: summary?.totalApplications ?? 0, icon: BriefcaseBusiness, style: "bg-blue-50 text-blue-700" },
    { title: "Active pipeline", value: summary?.activeApplications ?? 0, icon: Clock3, style: "bg-amber-50 text-amber-700" },
    { title: "Interviews", value: summary?.interviews ?? 0, icon: CalendarClock, style: "bg-purple-50 text-purple-700" },
    { title: "Offers", value: summary?.offers ?? 0, icon: CheckCircle2, style: "bg-emerald-50 text-emerald-700" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-[#5E43F3]">Job search overview</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">A live view of your applications, progress, and next steps.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/analytics" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"><TrendingUp className="h-4 w-4" />Analytics</Link>
          <Link href="/dashboard/ai" className="inline-flex items-center gap-2 rounded-lg bg-[#5E43F3] px-4 py-2 text-sm font-medium text-white hover:bg-[#4d36c9]"><Sparkles className="h-4 w-4" />AI tools</Link>
        </div>
      </div>

      {error && <div role="alert" className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {loading && <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" />Loading your data…</div>}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ title, value, icon: Icon, style }) => <article key={title} className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{title}</p><p className="mt-2 text-3xl font-bold text-slate-900">{value}</p></div><span className={`rounded-xl p-3 ${style}`}><Icon className="h-5 w-5" /></span></div>
        </article>)}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.9fr)]">
        <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-semibold text-slate-900">Recent applications</h2><p className="mt-1 text-xs text-slate-500">Your latest tracked roles</p></div><Link href="/dashboard/jobs" className="inline-flex items-center gap-1 text-sm font-medium text-[#5E43F3] hover:underline">All jobs <ArrowRight className="h-4 w-4" /></Link></div>
          {jobs.length ? <div className="divide-y divide-slate-100">{jobs.map((job) => <Link key={job.id} href={`/dashboard/job/${job.id}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50">
            <div><p className="font-semibold text-slate-900">{job.companyName}</p><p className="mt-1 text-sm text-slate-500">{job.position}</p></div><div className="flex items-center gap-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[job.status]}`}>{displayStatus(job.status)}</span><span className="hidden text-xs text-slate-400 sm:block">{formatDate(job.applicationDate)}</span></div>
          </Link>)}</div> : !loading && <div className="p-8 text-center"><BriefcaseBusiness className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 font-medium text-slate-700">No applications yet</p><Link href="/dashboard/jobs" className="mt-2 inline-block text-sm font-medium text-[#5E43F3]">Add your first application</Link></div>}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-semibold text-slate-900">Upcoming reminders</h2><p className="mt-1 text-xs text-slate-500">Important next steps</p></div><CalendarClock className="h-5 w-5 text-[#5E43F3]" /></div>
          {reminders.length ? <div className="divide-y divide-slate-100">{reminders.map((reminder) => <div key={reminder.id} className="flex gap-3 px-5 py-4">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#5E43F3]" /><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{reminder.title}</p><Link href={`/dashboard/job/${reminder.jobId}`} className="mt-1 block truncate text-xs text-slate-500 hover:text-[#5E43F3]">{reminder.companyName} · {reminder.position}</Link><p className="mt-1 text-xs text-slate-400">{formatDateTime(reminder.reminderDate)}</p></div>
          </div>)}</div> : !loading && <div className="p-8 text-center"><CheckCircle2 className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 text-sm text-slate-500">No upcoming reminders.</p></div>}
        </section>
      </div>

      {summary && <section className="grid gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-white p-5 md:grid-cols-[1fr_auto] md:items-center">
        <div><p className="text-sm font-semibold text-indigo-900">Keep momentum</p><p className="mt-1 text-sm text-indigo-800/80">Your interview rate is {summary.interviewRate}% and offer rate is {summary.offerRate}% across your tracked applications.</p></div><Link href="/dashboard/analytics" className="inline-flex items-center gap-2 text-sm font-semibold text-[#5E43F3]">View analytics <ArrowRight className="h-4 w-4" /></Link>
      </section>}
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);
}

function formatDateTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}
