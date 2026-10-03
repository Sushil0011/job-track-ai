"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Bell, BriefcaseBusiness, Check, Clock3, ExternalLink, Loader2, Mail, MapPin, Pencil, Plus, Sparkles, Trash2, UserRound } from "lucide-react";
import EditJobModal from "@/components/jobs/edit-job";
import { backendGet, backendSend, displayStatus, type Job, type JobStatus, type Note, type Reminder } from "@/utils/backend-api";
import { StatusOptions } from "@/components/jobs/add-jobs";

type JobPayload = { job: Job };
type NotesPayload = { notes: Note[] };
type RemindersPayload = { reminders: Reminder[] };

export default function JobDetail({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [noteText, setNoteText] = useState("");
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void Promise.all([
      backendGet<JobPayload>(`jobs/${jobId}`),
      backendGet<NotesPayload>(`notes?jobId=${encodeURIComponent(jobId)}`),
      backendGet<RemindersPayload>(`reminders?jobId=${encodeURIComponent(jobId)}`),
    ]).then(([jobResult, noteResult, reminderResult]) => {
      if (!active) return;
      setJob(jobResult.job);
      setNotes(noteResult.notes);
      setReminders(reminderResult.reminders);
    }).catch((err: unknown) => {
      if (active) setError(err instanceof Error ? err.message : "Could not load this application");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [jobId]);

  const changeStatus = async (status: JobStatus) => {
    if (!job) return;
    try {
      const result = await backendSend<JobPayload>(`jobs/${job.id}`, "PATCH", { status });
      setJob(result.job);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not change the status");
    }
  };

  const addNote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!noteText.trim()) return;
    setSaving(true);
    setError("");
    try {
      const result = await backendSend<{ note: Note }>("notes", "POST", { jobId, content: noteText.trim() });
      setNotes((current) => [result.note, ...current]);
      setNoteText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this note");
    } finally {
      setSaving(false);
    }
  };

  const saveEditedNote = async (noteId: string) => {
    setSaving(true);
    try {
      const result = await backendSend<{ note: Note }>(`notes/${noteId}`, "PATCH", { content: editingText.trim() });
      setNotes((current) => current.map((note) => note.id === noteId ? result.note : note));
      setEditingNoteId(null);
      setEditingText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update this note");
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      await backendSend(`notes/${noteId}`, "DELETE");
      setNotes((current) => current.filter((note) => note.id !== noteId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete this note");
    }
  };

  const addReminder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reminderTitle.trim() || !reminderDate) return;
    setSaving(true);
    setError("");
    try {
      const result = await backendSend<{ reminder: Reminder }>("reminders", "POST", {
        jobId,
        title: reminderTitle.trim(),
        reminderDate: new Date(reminderDate).toISOString(),
      });
      setReminders((current) => [...current, { ...result.reminder, companyName: job?.companyName, position: job?.position }].sort((a, b) => a.reminderDate.localeCompare(b.reminderDate)));
      setReminderTitle("");
      setReminderDate("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create this reminder");
    } finally {
      setSaving(false);
    }
  };

  const toggleReminder = async (reminder: Reminder) => {
    try {
      const result = await backendSend<{ reminder: Reminder }>(`reminders/${reminder.id}`, "PATCH", { completed: !reminder.completed });
      setReminders((current) => current.map((item) => item.id === reminder.id ? { ...item, ...result.reminder } : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update reminder");
    }
  };

  const deleteReminder = async (reminderId: string) => {
    try {
      await backendSend(`reminders/${reminderId}`, "DELETE");
      setReminders((current) => current.filter((item) => item.id !== reminderId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete reminder");
    }
  };

  const deleteJob = async () => {
    if (!job || !window.confirm(`Delete ${job.position} at ${job.companyName}? This also deletes its notes and reminders.`)) return;
    try {
      await backendSend(`jobs/${job.id}`, "DELETE");
      router.push("/dashboard/jobs");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete this application");
    }
  };

  if (loading) return <div className="flex items-center gap-2 py-16 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" />Loading application…</div>;
  if (error && !job) return <div className="space-y-4"><Link href="/dashboard/jobs" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"><ArrowLeft className="h-4 w-4" />Back to applications</Link><div role="alert" className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div></div>;
  if (!job) return <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">Application not found.</div>;

  return (
    <div className="space-y-6">
      <Link href="/dashboard/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"><ArrowLeft className="h-4 w-4" />Back to applications</Link>
      {error && <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-[#5E43F3]"><BriefcaseBusiness className="h-3.5 w-3.5" />Application</span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{job.position}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-600"><span className="font-semibold text-slate-900">{job.companyName}</span>{job.location && <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4 text-slate-400" />{job.location}</span>}{job.applicationDate && <span>Added {formatDate(job.applicationDate)}</span>}</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select value={job.status} onChange={(event) => void changeStatus(event.target.value as JobStatus)} aria-label="Application status" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"><StatusOptions /></select>
            <EditJobModal job={job} onUpdated={setJob} />
            <button onClick={() => void deleteJob()} className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"><Trash2 className="h-4 w-4" />Delete</button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-900">Application details</h2>{job.jobUrl && <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5E43F3] hover:underline">Open job post <ExternalLink className="h-4 w-4" /></a>}</div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Info label="Salary range" value={job.salaryRange || "Not specified"} />
              <Info label="Location" value={job.location || "Not specified"} />
              <Info label="Date applied / added" value={formatDate(job.applicationDate)} />
              <Info label="Current stage" value={displayStatus(job.status)} />
              {job.recruiterName && <Info label="Recruiter" value={job.recruiterName} icon={<UserRound className="h-4 w-4" />} />}
              {job.recruiterEmail && <Info label="Recruiter email" value={job.recruiterEmail} icon={<Mail className="h-4 w-4" />} href={`mailto:${job.recruiterEmail}`} />}
              {job.recruiterPhone && <Info label="Recruiter phone" value={job.recruiterPhone} icon={<UserRound className="h-4 w-4" />} href={`tel:${job.recruiterPhone}`} />}
            </div>
            {job.jobUrl && <p className="mt-5 break-all text-sm text-slate-500">{job.jobUrl}</p>}
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4"><div><h2 className="font-semibold text-slate-900">Application notes</h2><p className="mt-1 text-xs text-slate-500">Keep interview feedback and follow-up context together.</p></div><Pencil className="h-4 w-4 text-slate-400" /></div>
            <form onSubmit={addNote} className="border-b border-slate-100 bg-slate-50/70 p-5">
              <label htmlFor="new-note" className="sr-only">Add a note</label>
              <textarea id="new-note" value={noteText} onChange={(event) => setNoteText(event.target.value)} rows={3} maxLength={5000} placeholder="Write a note about this application…" className="w-full resize-y rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-[#5E43F3] focus:outline-none focus:ring-2 focus:ring-[#5E43F3]/20" />
              <div className="mt-3 flex justify-between"><span className="text-xs text-slate-400">{noteText.length}/5000</span><button disabled={saving || !noteText.trim()} className="inline-flex items-center gap-2 rounded-lg bg-[#5E43F3] px-3 py-2 text-sm font-medium text-white hover:bg-[#4d36c9] disabled:opacity-50"><Plus className="h-4 w-4" />{saving ? "Saving…" : "Add note"}</button></div>
            </form>
            {notes.length ? <div className="divide-y divide-slate-100">{notes.map((note) => <article key={note.id} className="p-5">
              {editingNoteId === note.id ? <div className="space-y-3"><textarea value={editingText} onChange={(event) => setEditingText(event.target.value)} rows={4} className="w-full rounded-lg border border-slate-200 p-3 text-sm" /><div className="flex justify-end gap-2"><button onClick={() => setEditingNoteId(null)} className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100">Cancel</button><button onClick={() => void saveEditedNote(note.id)} disabled={saving || !editingText.trim()} className="rounded-md bg-[#5E43F3] px-3 py-1.5 text-sm text-white disabled:opacity-50">Save changes</button></div></div> : <><p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{note.content}</p><div className="mt-3 flex items-center justify-between gap-3"><span className="text-xs text-slate-400">{formatDateTime(note.updatedAt ?? note.createdAt)}</span><div className="flex gap-1"><button onClick={() => { setEditingNoteId(note.id); setEditingText(note.content); }} aria-label="Edit note" className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><Pencil className="h-4 w-4" /></button><button onClick={() => void deleteNote(note.id)} aria-label="Delete note" className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button></div></div></>}
            </article>)}</div> : <p className="p-6 text-sm text-slate-500">No notes yet. Add your first note above.</p>}
          </section>
        </div>

        <div className="space-y-6">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-semibold text-slate-900">Reminders</h2><p className="mt-1 text-xs text-slate-500">We&apos;ll email you when one is due.</p></div><Bell className="h-5 w-5 text-[#5E43F3]" /></div>
            <form onSubmit={addReminder} className="space-y-3 border-b border-slate-100 bg-slate-50/70 p-4">
              <label className="block text-xs font-semibold text-slate-600">Reminder title<input value={reminderTitle} onChange={(event) => setReminderTitle(event.target.value)} required maxLength={200} placeholder="Send a follow-up email" className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-800" /></label>
              <label className="block text-xs font-semibold text-slate-600">Date and time<input type="datetime-local" value={reminderDate} onChange={(event) => setReminderDate(event.target.value)} required className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-800" /></label>
              <button disabled={saving || !reminderTitle.trim() || !reminderDate} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#5E43F3] px-3 py-2 text-sm font-medium text-white hover:bg-[#4d36c9] disabled:opacity-50"><Plus className="h-4 w-4" />Set reminder</button>
            </form>
            {reminders.length ? <div className="divide-y divide-slate-100">{reminders.map((reminder) => <div key={reminder.id} className={`flex items-start gap-3 p-4 ${reminder.completed ? "opacity-60" : ""}`}>
              <button onClick={() => void toggleReminder(reminder)} aria-label={reminder.completed ? "Mark reminder incomplete" : "Mark reminder complete"} className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${reminder.completed ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 text-transparent hover:border-[#5E43F3]"}`}><Check className="h-3 w-3" /></button>
              <div className="min-w-0 flex-1"><p className={`text-sm font-medium text-slate-900 ${reminder.completed ? "line-through" : ""}`}>{reminder.title}</p><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><Clock3 className="h-3.5 w-3.5" />{formatDateTime(reminder.reminderDate)}</p>{reminder.notificationSentAt && <p className="mt-1 text-xs text-emerald-700">Email sent</p>}</div><button onClick={() => void deleteReminder(reminder.id)} aria-label="Delete reminder" className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
            </div>)}</div> : <p className="p-5 text-sm text-slate-500">No reminders for this application.</p>}
          </section>

          <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-5">
            <Sparkles className="h-5 w-5 text-[#5E43F3]" /><h2 className="mt-3 font-semibold text-slate-900">Prepare with AI</h2><p className="mt-1 text-sm leading-5 text-slate-600">Generate role-specific interview questions, compare a resume, or draft a follow-up.</p><Link href={`/dashboard/ai?jobId=${encodeURIComponent(job.id)}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#5E43F3] hover:underline">Open AI tools <ExternalLink className="h-4 w-4" /></Link>
          </section>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, icon, href }: { label: string; value: string; icon?: React.ReactNode; href?: string }) {
  return <div><p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>{href ? <a href={href} className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-[#5E43F3] hover:underline">{icon}{value}</a> : <p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-slate-800">{icon}{value}</p>}</div>;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);
}

function formatDateTime(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}
