"use client";

import { useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { backendSend, type Job, type JobStatus } from "@/utils/backend-api";

const initialValues = {
  companyName: "",
  position: "",
  jobUrl: "",
  location: "",
  salaryRange: "",
  recruiterName: "",
  recruiterEmail: "",
  recruiterPhone: "",
  status: "WISHLIST" as JobStatus,
  applicationDate: new Date().toISOString().slice(0, 10),
};

export default function AddJobModal({
  onCreated,
}: {
  onCreated?: (job: Job) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const close = () => {
    setIsOpen(false);
    setError("");
  };

  const setField = <K extends keyof typeof initialValues>(
    key: K,
    value: (typeof initialValues)[K],
  ) => setValues((current) => ({ ...current, [key]: value }));

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const result = await backendSend<{ job: Job }>("jobs", "POST", {
        ...values,
        applicationDate: values.applicationDate
          ? `${values.applicationDate}T00:00:00.000Z`
          : undefined,
      });
      onCreated?.(result.job);
      setValues(initialValues);
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this application");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-[#5E43F3] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4d36c9]"
      >
        <Plus className="h-4 w-4" />
        Add application
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Add job application</h2>
                <p className="mt-1 text-sm text-slate-500">Save the role and track each stage of your search.</p>
              </div>
              <button type="button" onClick={close} aria-label="Close dialog" className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-5 overflow-y-auto p-6">
              {error && <p role="alert" className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Company" required value={values.companyName} onChange={(value) => setField("companyName", value)} placeholder="e.g. Vercel" />
                <Field label="Position" required value={values.position} onChange={(value) => setField("position", value)} placeholder="e.g. Frontend Engineer" />
                <Field label="Job URL" type="url" value={values.jobUrl} onChange={(value) => setField("jobUrl", value)} placeholder="https://..." />
                <Field label="Location" value={values.location} onChange={(value) => setField("location", value)} placeholder="Remote / Delhi" />
                <Field label="Salary range" value={values.salaryRange} onChange={(value) => setField("salaryRange", value)} placeholder="₹18–24 LPA" />
                <label className="space-y-1.5 text-sm font-medium text-slate-700">
                  Status
                  <select value={values.status} onChange={(event) => setField("status", event.target.value as JobStatus)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-800 focus:border-[#5E43F3] focus:outline-none focus:ring-2 focus:ring-[#5E43F3]/20">
                    <StatusOptions />
                  </select>
                </label>
                <label className="space-y-1.5 text-sm font-medium text-slate-700">
                  Date applied / added
                  <input type="date" value={values.applicationDate} onChange={(event) => setField("applicationDate", event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal text-slate-800 focus:border-[#5E43F3] focus:outline-none focus:ring-2 focus:ring-[#5E43F3]/20" />
                </label>
              </div>
              <details className="rounded-xl border border-slate-200 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-700">Recruiter contact (optional)</summary>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Recruiter name" value={values.recruiterName} onChange={(value) => setField("recruiterName", value)} />
                  <Field label="Recruiter email" type="email" value={values.recruiterEmail} onChange={(value) => setField("recruiterEmail", value)} />
                  <Field label="Recruiter phone" value={values.recruiterPhone} onChange={(value) => setField("recruiterPhone", value)} />
                </div>
              </details>
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button type="button" onClick={close} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[#5E43F3] px-4 py-2 text-sm font-medium text-white hover:bg-[#4d36c9] disabled:cursor-not-allowed disabled:opacity-60">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {saving ? "Saving…" : "Save application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function StatusOptions() {
  return <>
    <option value="WISHLIST">Wishlist</option>
    <option value="APPLIED">Applied</option>
    <option value="ASSESSMENT">Assessment</option>
    <option value="INTERVIEW">Interview</option>
    <option value="OFFER">Offer</option>
    <option value="REJECTED">Rejected</option>
  </>;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="space-y-1.5 text-sm font-medium text-slate-700">
      {label}
      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal text-slate-800 focus:border-[#5E43F3] focus:outline-none focus:ring-2 focus:ring-[#5E43F3]/20"
      />
    </label>
  );
}
