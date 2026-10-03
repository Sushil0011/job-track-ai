"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowDownUp, KanbanSquare, List, Loader2, Search, Trash2 } from "lucide-react";
import AddJobModal from "@/components/jobs/add-jobs";
import { backendGet, backendSend, displayStatus, type Job, type JobStatus } from "@/utils/backend-api";

const statuses: JobStatus[] = ["WISHLIST", "APPLIED", "ASSESSMENT", "INTERVIEW", "OFFER", "REJECTED"];
const statusStyles: Record<JobStatus, string> = {
  WISHLIST: "bg-slate-100 text-slate-700 border-slate-200",
  APPLIED: "bg-blue-50 text-blue-700 border-blue-200",
  ASSESSMENT: "bg-purple-50 text-purple-700 border-purple-200",
  INTERVIEW: "bg-amber-50 text-amber-700 border-amber-200",
  OFFER: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
};

type JobsResponse = { jobs: Job[]; pagination: { total: number } };

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<JobStatus | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [view, setView] = useState<"list" | "board">("list");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    const query = new URLSearchParams({ limit: "100", sortBy: "applicationDate", sortOrder });
    if (search.trim()) query.set("search", search.trim());
    if (status) query.set("status", status);
    try {
      const data = await backendGet<JobsResponse>(`jobs?${query.toString()}`);
      setJobs(data.jobs);
      setTotal(data.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load applications");
    } finally {
      setLoading(false);
    }
  }, [search, sortOrder, status]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadJobs(), search ? 250 : 0);
    return () => window.clearTimeout(timer);
  }, [loadJobs, search]);

  const updateStatus = async (job: Job, nextStatus: JobStatus) => {
    setError("");
    try {
      const data = await backendSend<{ job: Job }>(`jobs/${job.id}`, "PATCH", { status: nextStatus });
      setJobs((current) => current.map((entry) => entry.id === job.id ? data.job : entry));
      if (status && nextStatus !== status) setJobs((current) => current.filter((entry) => entry.id !== job.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update status");
    }
  };

  const removeJob = async (job: Job) => {
    if (!window.confirm(`Delete the ${job.position} application at ${job.companyName}?`)) return;
    try {
      await backendSend(`jobs/${job.id}`, "DELETE");
      setJobs((current) => current.filter((entry) => entry.id !== job.id));
      setTotal((current) => Math.max(0, current - 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete application");
    }
  };

  const addJob = (job: Job) => {
    if (!status || job.status === status) {
      setJobs((current) => [job, ...current]);
    }
    setTotal((current) => current + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-[#5E43F3]">Your pipeline · {total} total</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Job applications</h1>
          <p className="mt-1 text-sm text-slate-500">Track roles, update progress, and keep every follow-up in one place.</p>
        </div>
        <AddJobModal onCreated={addJob} />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder="Search companies, roles, locations…" className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-[#5E43F3] focus:outline-none focus:ring-2 focus:ring-[#5E43F3]/20" />
        </div>
        <select aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value as JobStatus | "")} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
          <option value="">All statuses</option>
          {statuses.map((item) => <option key={item} value={item}>{displayStatus(item)}</option>)}
        </select>
        <button onClick={() => setSortOrder((value) => value === "desc" ? "asc" : "desc")} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
          <ArrowDownUp className="h-4 w-4" /> Date {sortOrder === "desc" ? "newest" : "oldest"}
        </button>
        <div className="flex rounded-lg border border-slate-200 p-1" aria-label="Change view">
          <button aria-pressed={view === "list"} onClick={() => setView("list")} className={`rounded-md p-2 ${view === "list" ? "bg-indigo-50 text-[#5E43F3]" : "text-slate-500 hover:bg-slate-50"}`} title="List view"><List className="h-4 w-4" /></button>
          <button aria-pressed={view === "board"} onClick={() => setView("board")} className={`rounded-md p-2 ${view === "board" ? "bg-indigo-50 text-[#5E43F3]" : "text-slate-500 hover:bg-slate-50"}`} title="Board view"><KanbanSquare className="h-4 w-4" /></button>
        </div>
      </div>

      {error && <div role="alert" className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}
      {loading ? <div className="flex items-center gap-2 py-12 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" />Loading applications…</div> : jobs.length === 0 ? <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center"><h2 className="font-semibold text-slate-900">No applications yet</h2><p className="mt-2 text-sm text-slate-500">Add a role to start building your job-search pipeline.</p></div> : view === "list" ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4">Company / position</th><th className="px-5 py-4">Location</th><th className="px-5 py-4">Salary</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Applied</th><th className="px-5 py-4">Actions</th></tr></thead>
              <tbody className="divide-y divide-slate-100">{jobs.map((job) => (
                <tr key={job.id} className="group hover:bg-slate-50/70">
                  <td className="px-5 py-4"><Link href={`/dashboard/job/${job.id}`} className="font-semibold text-slate-900 hover:text-[#5E43F3]">{job.companyName}</Link><p className="mt-1 text-slate-500">{job.position}</p></td>
                  <td className="px-5 py-4 text-slate-600">{job.location || "—"}</td>
                  <td className="px-5 py-4 text-slate-600">{job.salaryRange || "—"}</td>
                  <td className="px-5 py-4"><StatusPill status={job.status} /></td>
                  <td className="px-5 py-4 text-slate-500">{formatDate(job.applicationDate)}</td>
                  <td className="px-5 py-4"><div className="flex items-center gap-2">
                    <select aria-label={`Change ${job.companyName} status`} value={job.status} onChange={(event) => void updateStatus(job, event.target.value as JobStatus)} className="max-w-[135px] rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs"><StatusOptions /></select>
                    <button onClick={() => void removeJob(job)} title="Delete application" aria-label={`Delete ${job.companyName} application`} className="rounded-md p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-3 2xl:grid-cols-6">{statuses.map((column) => {
          const columnJobs = jobs.filter((job) => job.status === column);
          return <section key={column} className="min-h-56 rounded-xl border border-slate-200 bg-slate-100/70 p-3">
            <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold text-slate-800">{displayStatus(column)}</h2><span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-500">{columnJobs.length}</span></div>
            <div className="space-y-3">{columnJobs.map((job) => <article key={job.id} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
              <Link href={`/dashboard/job/${job.id}`} className="font-semibold text-slate-900 hover:text-[#5E43F3]">{job.companyName}</Link><p className="mt-1 text-sm text-slate-600">{job.position}</p><p className="mt-2 text-xs text-slate-400">{formatDate(job.applicationDate)}</p>
              <div className="mt-3 flex items-center gap-2"><select aria-label={`Move ${job.companyName} to another stage`} value={job.status} onChange={(event) => void updateStatus(job, event.target.value as JobStatus)} className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs"><StatusOptions /></select><button onClick={() => void removeJob(job)} aria-label={`Delete ${job.companyName} application`} className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button></div>
            </article>)}</div>
          </section>;
        })}</div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: JobStatus }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}>{displayStatus(status)}</span>;
}

function StatusOptions() {
  return <>{statuses.map((status) => <option key={status} value={status}>{displayStatus(status)}</option>)}</>;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);
}
