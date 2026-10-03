"use client";

import { useState } from "react";
import { Loader2, PencilLine, X } from "lucide-react";
import { backendSend, type Job, type JobStatus } from "@/utils/backend-api";
import { StatusOptions } from "./add-jobs";

type JobFormValues = {
  companyName: string;
  position: string;
  jobUrl: string;
  location: string;
  salaryRange: string;
  recruiterName: string;
  recruiterEmail: string;
  recruiterPhone: string;
  status: JobStatus;
  applicationDate: string;
};

const valuesFromJob = (job: Job): JobFormValues => ({
  companyName: job.companyName,
  position: job.position,
  jobUrl: job.jobUrl ?? "",
  location: job.location ?? "",
  salaryRange: job.salaryRange ?? "",
  recruiterName: job.recruiterName ?? "",
  recruiterEmail: job.recruiterEmail ?? "",
  recruiterPhone: job.recruiterPhone ?? "",
  status: job.status,
  applicationDate: job.applicationDate?.slice(0, 10) ?? "",
});

export default function EditJobModal({
  job,
  onUpdated,
}: {
  job: Job;
  onUpdated?: (job: Job) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState(() => valuesFromJob(job));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const setField = <K extends keyof JobFormValues>(key: K, value: JobFormValues[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const result = await backendSend<{ job: Job }>(`jobs/${job.id}`, "PATCH", {
        ...values,
        applicationDate: values.applicationDate
          ? `${values.applicationDate}T00:00:00.000Z`
          : undefined,
      });
      onUpdated?.(result.job);
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update this application");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button type="button" onClick={() => { setValues(valuesFromJob(job)); setError(""); setIsOpen(true); }} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
        <PencilLine className="h-4 w-4" /> Edit application
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Edit application</h2>
                <p className="mt-1 text-sm text-slate-500">Update the role details or move it to another stage.</p>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close dialog" className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={submit} className="space-y-5 overflow-y-auto p-6">
              {error && <p role="alert" className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Company" required value={values.companyName} onChange={(value) => setField("companyName", value)} />
                <Field label="Position" required value={values.position} onChange={(value) => setField("position", value)} />
                <Field label="Job URL" type="url" value={values.jobUrl} onChange={(value) => setField("jobUrl", value)} />
                <Field label="Location" value={values.location} onChange={(value) => setField("location", value)} />
                <Field label="Salary range" value={values.salaryRange} onChange={(value) => setField("salaryRange", value)} />
                <label className="space-y-1.5 text-sm font-medium text-slate-700">Status
                  <select value={values.status} onChange={(event) => setField("status", event.target.value as JobStatus)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-800"><StatusOptions /></select>
                </label>
                <label className="space-y-1.5 text-sm font-medium text-slate-700">Date applied
                  <input type="date" value={values.applicationDate} onChange={(event) => setField("applicationDate", event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal text-slate-800" />
                </label>
              </div>
              <details className="rounded-xl border border-slate-200 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-700">Recruiter contact</summary>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Recruiter name" value={values.recruiterName} onChange={(value) => setField("recruiterName", value)} />
                  <Field label="Recruiter email" type="email" value={values.recruiterEmail} onChange={(value) => setField("recruiterEmail", value)} />
                  <Field label="Recruiter phone" value={values.recruiterPhone} onChange={(value) => setField("recruiterPhone", value)} />
                </div>
              </details>
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button type="button" onClick={() => setIsOpen(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[#5E43F3] px-4 py-2 text-sm font-medium text-white hover:bg-[#4d36c9] disabled:opacity-60">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{saving ? "Updating…" : "Update application"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return <label className="space-y-1.5 text-sm font-medium text-slate-700">{label}<input type={type} value={value} required={required} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal text-slate-800 focus:border-[#5E43F3] focus:outline-none focus:ring-2 focus:ring-[#5E43F3]/20" /></label>;
}
